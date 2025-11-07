import { Injectable } from '@nestjs/common';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CafesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCafeDto: CreateCafeDto) {
    return this.prisma.cafe.create({
      data: createCafeDto,
    });
  }

  findAll() {
    return `This action returns all cafes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cafe`;
  }

  update(id: number, updateCafeDto: UpdateCafeDto) {
    return `This action updates a #${id} cafe`;
  }

  remove(id: number) {
    return `This action removes a #${id} cafe`;
  }
}
