import { Module } from '@nestjs/common';
import { FlightsModule } from './flights/flights.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [FlightsModule, PrismaModule],
})
export class AppModule {}
