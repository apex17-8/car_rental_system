import { 
  IsString, 
  IsNumber, 
  IsEnum, 
  IsOptional, 
  IsBoolean, 
  Min, 
  MaxLength, 
  IsPositive 
} from 'class-validator';
import { CarType, FuelType, CarAvailability } from '../entities/car.entity';

export class CreateCarDto {
  @IsString()
  @MaxLength(100)
  car_model: string;

  @IsString()
  @MaxLength(100)
  car_manufacturer: string;

  @IsString()
  @MaxLength(4)
  year: string;

  @IsString()
  @MaxLength(50)
  color: string;

  @IsEnum(CarType)
  car_type: CarType;

  @IsEnum(FuelType)
  fuel_type: FuelType;

  @IsNumber()
  @IsPositive()
  rental_rate: number;

  @IsNumber()
  @IsOptional()
  current_location_id?: number;

  @IsNumber()
  @Min(0)
  mileage: number;

  @IsString()
  @MaxLength(20)
  license_plate: string;

  @IsString()
  @IsOptional()
  transmission?: string;

  @IsNumber()
  @IsOptional()
  seats?: number;

  @IsNumber()
  @IsOptional()
  doors?: number;

  @IsNumber()
  @IsOptional()
  engine_size?: number;

  @IsString()
  @IsOptional()
  features?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
