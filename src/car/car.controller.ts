import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CarService } from './car.service';
import { Car } from './entities/car.entity';
import { Public } from '../auth/decorators/public.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('cars')
@UseGuards(RolesGuard)
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Public()
  @Get()
  async findAll() {
    return this.carService.findAll();
  }

  @Public()
  @Get('available')
  async findAvailableCars(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.carService.findAvailableCars(new Date(startDate), new Date(endDate));
  }

  @Public()
  @Get('statistics')
  async getStatistics() {
    return this.carService.getCarStatistics();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.carService.findOne(+id);
  }

  @Post()
  @Roles('admin', 'manager')
  async create(@Body() createCarDto: Partial<Car>) {
    return this.carService.create(createCarDto);
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  async update(@Param('id') id: string, @Body() updateCarDto: Partial<Car>) {
    return this.carService.update(+id, updateCarDto);
  }

  @Patch(':id/availability')
  @Roles('admin', 'manager')
  async updateAvailability(
    @Param('id') id: string,
    @Body('availability') availability: string
  ) {
    return this.carService.updateAvailability(+id, availability as any);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
