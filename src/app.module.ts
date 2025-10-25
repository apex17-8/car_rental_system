import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarModule } from './car/car.module';
import { CustomerModule } from './customer/customer.module';
import { RentalModule } from './rental/rental.module';
import { PaymentModule } from './payment/payment.module';
import { InsuranceModule } from './insurance/insurance.module';
import { LocationModule } from './location/location.module';
import { ReservationModule } from './reservation/reservation.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { DatabaseModule } from './database/database.module'; 


@Module({
  imports: [DatabaseModule,CarModule, CustomerModule, RentalModule, PaymentModule, InsuranceModule, LocationModule, ReservationModule, MaintenanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
