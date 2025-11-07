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

  findAll(location?: string) {
    return this.prisma.cafe.findMany({
      include: { _count: { select: { employees: true } } },
      orderBy: { employees: { _count: 'desc' } },
      where: location ? { location } : {},
    });
  }

  // id as in uuid
  findOne(id: string) {
    return this.prisma.cafe.findUnique({
      where: { id },
    });
  }

  update(id: string, updateCafeDto: UpdateCafeDto) {
    return this.prisma.cafe.update({
      where: { id },
      data: updateCafeDto,
    });
  }

  remove(id: string) {
    return this.prisma.cafe.delete({
      where: { id },
    });
  }
}
