import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    const { cafeId, ...employeeData } = createEmployeeDto;
    const newEmployeeId = `UI${nanoid(7)}`;
    return this.prisma.employee.create({
      data: {
        id: newEmployeeId,
        ...employeeData,
        ...(cafeId && {
          cafe: {
            connect: {
              id: cafeId,
            },
          },
        }),
      },
    });
  }

  async findAll(cafeId?: string) {
    const employees = await this.prisma.employee.findMany({
      where: cafeId ? { cafeId: cafeId } : {},
      include: {
        cafe: { select: { name: true } },
      },
      orderBy: {
        start_date: 'asc',
      },
    });

    const today = dayjs();
    return employees.map((employee) => {
      const { cafe, start_date, cafeId, ...restOfEmployee } = employee;
      const days_worked = start_date ? today.diff(dayjs(start_date), 'day') : 0;
      return {
        ...restOfEmployee,
        days_worked,
        cafeId: cafeId || null,
        cafe: cafe?.name || '',
      };
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const { cafeId, start_date, ...employeeData } = updateEmployeeDto;

    return this.prisma.employee.update({
      where: { id },
      data: {
        ...employeeData, // Update simple fields like name, email
        ...(cafeId !== undefined && {
          // Only update relationship if cafeId was in the request
          start_date: cafeId ? start_date : null, // Set date if assigning, null if un-assigning
          cafe: {
            connect: cafeId ? { id: cafeId } : undefined,
            disconnect: !cafeId ? true : undefined,
          },
        }),
      },
    });
  }

  remove(id: number) {
    return this.prisma.employee.delete({
      where: { id: id.toString() },
    });
  }
}
