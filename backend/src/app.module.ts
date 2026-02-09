import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProvidersModule } from './providers/providers.module';
import { ServicesModule } from './services/services.module';
import { WorkingHoursModule } from './working-hours/working-hours.module';
import { BreaksModule } from './breaks/breaks.module';
import { HolidaysModule } from './holidays/holidays.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { SlotEngineModule } from './slot-engine/slot-engine.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProvidersModule,
    ServicesModule,
    WorkingHoursModule,
    BreaksModule,
    HolidaysModule,
    AppointmentsModule,
    SlotEngineModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
