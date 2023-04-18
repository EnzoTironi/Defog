import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import FlightsRepository from './flitghts.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FlightsController],
  providers: [FlightsService, FlightsRepository],
  imports: [PrismaModule],
})
export class FlightsModule {}
