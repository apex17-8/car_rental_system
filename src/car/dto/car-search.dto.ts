import { IsOptional, IsEnum, IsNumber, IsDateString, Min } from 'class-validator';
import { CarType, FuelType } from '../entities/car.entity';

export class CarSearchDto {
  @IsOptional()
  @IsEnum(CarType)
  car_type?: CarType;

  @IsOptional()
  @IsEnum(FuelType)
  fuel_type?: FuelType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  min_price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  max_price?: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsNumber()
  location_id?: number;

  @IsOptional()
  seats?: number;

  @IsOptional()
  transmission?: string;
}