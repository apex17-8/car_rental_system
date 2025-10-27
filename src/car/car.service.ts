import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Index 
} from 'typeorm';
import { Rental } from '../../rental/entities/rental.entity';
import { Insurance } from '../../insurance/entities/insurance.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Maintenance } from '../../maintenance/entities/maintenance.entity';
import { Location } from '../../location/entities/location.entity';

export enum CarAvailability {
  AVAILABLE = 'Available',
  RENTED = 'Rented',
  MAINTENANCE = 'Maintenance',
  RESERVED = 'Reserved'
}

export enum CarType {
  SEDAN = 'Sedan',
  SUV = 'SUV',
  HATCHBACK = 'Hatchback',
  COUPE = 'Coupe',
  CONVERTIBLE = 'Convertible',
  MINIVAN = 'Minivan',
  TRUCK = 'Truck',
  LUXURY = 'Luxury'
}

export enum FuelType {
  PETROL = 'Petrol',
  DIESEL = 'Diesel',
  ELECTRIC = 'Electric',
  HYBRID = 'Hybrid'
}

@Entity('cars', { schema: 'dbo' })
@Index('IDX_cars_availability', ['availability'])
@Index('IDX_cars_location', ['current_location_id'])
@Index('IDX_cars_license_plate', ['license_plate'])
@Index('IDX_cars_type', ['car_type'])
export class Car {
  @PrimaryGeneratedColumn()
  car_id: number;

  @Column({ type: 'varchar', length: 100 })
  car_model: string;

  @Column({ type: 'varchar', length: 100 })
  car_manufacturer: string;

  @Column({ type: 'varchar', length: 4 })
  year: string;

  @Column({ type: 'varchar', length: 50 })
  color: string;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    enum: CarType,
    default: CarType.SEDAN
  })
  car_type: CarType;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    enum: FuelType,
    default: FuelType.PETROL
  })
  fuel_type: FuelType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rental_rate: number;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    enum: CarAvailability,
    default: CarAvailability.AVAILABLE 
  })
  availability: CarAvailability;

  @Column({ type: 'int', nullable: true })
  current_location_id: number;

  @Column({ type: 'int', default: 0 })
  mileage: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  license_plate: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  transmission: string; // Automatic, Manual

  @Column({ type: 'int', nullable: true })
  seats: number;

  @Column({ type: 'int', nullable: true })
  doors: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  engine_size: number; // in liters

  @Column({ type: 'varchar', length: 100, nullable: true })
  features: string; // Comma separated features

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string;

  @Column({ type: 'bit', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'datetime2', default: () => 'GETDATE()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2', default: () => 'GETDATE()' })
  updated_at: Date;

  // ============ RELATIONSHIPS ============

  // One Car can have many Rentals
  @OneToMany(() => Rental, rental => rental.car)
  rentals: Rental[];

  // One Car can have many Insurance policies
  @OneToMany(() => Insurance, insurance => insurance.car)
  insurances: Insurance[];

  // One Car can have many Reservations
  @OneToMany(() => Reservation, reservation => reservation.car)
  reservations: Reservation[];

  // One Car can have many Maintenance records
  @OneToMany(() => Maintenance, maintenance => maintenance.car)
  maintenances: Maintenance[];

  // Many Cars can be at one Location (current location)
  @ManyToOne(() => Location, location => location.cars)
  @JoinColumn({ name: 'current_location_id' })
  current_location: Location;

  // ============ METHODS ============

  /**
   * Check if car is available for rental in given date range
   */
  isAvailableForRental(startDate: Date, endDate: Date): boolean {
    if (this.availability !== CarAvailability.AVAILABLE) {
      return false;
    }

    // Check if car has any active rentals in the date range
    if (this.rentals) {
      const conflictingRental = this.rentals.find(rental => {
        return (
          rental.status === 'active' &&
          new Date(rental.rental_start_date) <= endDate &&
          new Date(rental.rental_end_date) >= startDate
        );
      });
      if (conflictingRental) return false;
    }

    // Check if car has any reservations in the date range
    if (this.reservations) {
      const conflictingReservation = this.reservations.find(reservation => {
        return (
          reservation.status === 'confirmed' &&
          new Date(reservation.pickup_date) <= endDate &&
          new Date(reservation.return_date) >= startDate
        );
      });
      if (conflictingReservation) return false;
    }

    return true;
  }

  /**
   * Calculate rental cost for given number of days
   */
  calculateRentalCost(days: number): number {
    return this.rental_rate * days;
  }

  /**
   * Update car availability based on current state
   */
  updateAvailability(): void {
    const now = new Date();
    
    // Check for active rentals
    if (this.rentals) {
      const activeRental = this.rentals.find(rental => 
        rental.status === 'active' && new Date(rental.rental_end_date) >= now
      );
      if (activeRental) {
        this.availability = CarAvailability.RENTED;
        return;
      }
    }

    // Check for confirmed reservations
    if (this.reservations) {
      const upcomingReservation = this.reservations.find(reservation => 
        reservation.status === 'confirmed' && new Date(reservation.pickup_date) <= now
      );
      if (upcomingReservation) {
        this.availability = CarAvailability.RESERVED;
        return;
      }
    }

    // Check for ongoing maintenance
    if (this.maintenances) {
      const ongoingMaintenance = this.maintenances.find(maintenance => 
        maintenance.status === 'in_progress'
      );
      if (ongoingMaintenance) {
        this.availability = CarAvailability.MAINTENANCE;
        return;
      }
    }

    this.availability = CarAvailability.AVAILABLE;
  }

  /**
   * Get active insurance policy
   */
  getActiveInsurance(): Insurance | undefined {
    if (!this.insurances) return undefined;
    
    const now = new Date();
    return this.insurances.find(insurance => 
      insurance.status === 'active' &&
      new Date(insurance.start_date) <= now &&
      new Date(insurance.end_date) >= now
    );
  }

  /**
   * Get maintenance history
   */
  getMaintenanceHistory(): Maintenance[] {
    if (!this.maintenances) return [];
    return this.maintenances
      .filter(maintenance => maintenance.status === 'completed')
      .sort((a, b) => new Date(b.maintenance_date).getTime() - new Date(a.maintenance_date).getTime());
  }

  /**
   * Get rental history
   */
  getRentalHistory(): Rental[] {
    if (!this.rentals) return [];
    return this.rentals
      .filter(rental => rental.status === 'completed')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}