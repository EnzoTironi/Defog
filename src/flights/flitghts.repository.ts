import { CreateFlightDto } from './dto/create-flight.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export default class FlightsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFlightDto) {
    return this.prisma.flight.create({ data });
  }

  async createMany(data) {
    await this.prisma.flight.createMany({
      data: data.map((flight) => ({
        from: flight.from,
        to: flight.to,
        date: flight.date,
        airline: flight.airline,
      })),
    });
  }

  async find(departure, from, to) {
    return this.prisma.flight.findMany({
      where: {
        from: { equals: from },
        to: { equals: to },
        date: { gte: departure },
      },
    });
  }
}
