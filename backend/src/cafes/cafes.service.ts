import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(location?: string) {
    const cafes = await this.prisma.cafe.findMany({
      include: { _count: { select: { employees: true } } },
      orderBy: { employees: { _count: 'desc' } },
      where: location ? { location } : {},
    });

    return cafes.map((cafe) => {
      const { _count, ...restOfCafe } = cafe;
      return {
        ...restOfCafe,
        employees: _count.employees,
      };
    });
  }

  async findOne(id: string) {
    const cafe = await this.prisma.cafe.findUnique({
      where: { id },
    });

    if (!cafe) {
      throw new NotFoundException(`Cafe with ID "${id}" not found.`);
    }

    return cafe;
  }

  async update(id: string, updateCafeDto: UpdateCafeDto) {
    await this.findOne(id); // Check if cafe exists
    return this.prisma.cafe.update({
      where: { id },
      data: updateCafeDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if cafe exists
    return this.prisma.cafe.delete({
      where: { id },
    });
  }
}
