import { Injectable } from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import FlightsRepository from './flitghts.repository';
import * as fs from 'fs';
import { Parser } from 'csv-parse';

@Injectable()
export class FlightsService {
  constructor(private readonly flightRepository: FlightsRepository) {}
  async create(data: CreateFlightDto) {
    return this.flightRepository.create(data);
  }

  async find({ departure, from, to }) {
    return this.flightRepository.find(departure, from, to);
  }

  async normalizeAndSaveFlights(file: Express.Multer.File) {
    const chunkSize = 1000;
    const parser = new Parser({ columns: true });
    const stream = fs.createReadStream(file.path).pipe(parser);
    let chunk = [];
    const results = [];

    stream.on('data', async (row) => {
      const flight = this.normalizeFlight(row);
      chunk.push(flight);
      results.push(flight);

      if (chunk.length === chunkSize) {
        await this.createChunk(chunk);
        console.log(chunk.length);
        chunk = [];
        console.log(chunk.length);
      }
    });

    stream.on('end', async () => {
      if (chunk.length > 0) {
        await this.createChunk(chunk);
      }
      console.log(`Finished processing ${results.length} flights`);
    });

    stream.on('error', this.handleError);
  }

  private normalizeFlight(row: any) {
    return {
      from: row['Aeroporto.Origem'],
      to: row['Aeroporto.Destino'],
      date: new Date(row['Partida.Prevista']),
      airline: row['Companhia.Aerea'],
    };
  }

  private async createChunk(chunk) {
    try {
      await this.flightRepository.createMany(chunk);
      console.log(`Processed ${chunk.length} flights`);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error) {
    console.error(error);
    throw error;
  }
}
