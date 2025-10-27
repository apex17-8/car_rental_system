import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE, APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

// existing modules
import { CarModule } from './car/car.module';
import { CustomerModule } from './customer/customer.module';
import { RentalModule } from './rental/rental.module';
import { PaymentModule } from './payment/payment.module';
import { InsuranceModule } from './insurance/insurance.module';
import { LocationModule } from './location/location.module';
import { ReservationModule } from './reservation/reservation.module';
import { MaintenanceModule } from './maintenance/maintenance.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule, // AuthModule here
    CarModule, 
    CustomerModule, 
    RentalModule, 
    PaymentModule, 
    InsuranceModule, 
    LocationModule, 
    ReservationModule, 
    MaintenanceModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Global JWT guard
    },
  ],
})
export class AppModule {}