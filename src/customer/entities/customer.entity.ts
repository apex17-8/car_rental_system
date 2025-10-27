import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Rental } from '../../rental/entities/rental.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';

@Entity('customers', { schema: 'dbo' })
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id: number;

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @Column({ type: 'varchar', length: 15 })
  phone_number: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  driver_license: string;

  @CreateDateColumn({ type: 'datetime2', default: () => 'GETDATE()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2', default: () => 'GETDATE()' })
  updated_at: Date;

@Column({ nullable: true })
  user_id: number;
  // Relationships
  @OneToOne(() => User, user => user.customer)
  @JoinColumn({ name: 'user_id' })
  user: User;
  

  @OneToMany(() => Rental, rental => rental.customer)
  @JoinColumn({ name: ' customer_id' })
  rentals: Rental[];

  @OneToMany(() => Reservation, reservation => reservation.customer)
   @JoinColumn({ name: ' customer_id' })
  reservations: Reservation[];
}