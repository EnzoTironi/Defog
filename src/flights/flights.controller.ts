import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightService: FlightsService) {}

  @Post()
  async createFlight(@Body() data: CreateFlightDto): Promise<any> {
    const normalizedData = {
      ...data,
      date: new Date(data.date),
    };
    return this.flightService.create(normalizedData);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
  async uploadFlights(@UploadedFile() file: Express.Multer.File) {
    return this.flightService.normalizeAndSaveFlights(file);
  }

  @Get()
  async findFlights(
    @Query('departure') departure: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<any> {
    const date = new Date(departure);
    return this.flightService.find({ departure: date, from, to });
  }
}
