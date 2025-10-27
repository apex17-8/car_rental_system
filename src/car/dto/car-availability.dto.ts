import { IsEnum } from 'class-validator';
import { CarAvailability } from '../entities/car.entity';

export class CarAvailabilityDto {
  @IsEnum(CarAvailability)
  availability: CarAvailability;
}