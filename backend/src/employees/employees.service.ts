import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { customAlphabet } from 'nanoid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const generateEmployeeId = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  7,
);

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    const { cafeId, start_date, ...employeeData } = createEmployeeDto;
    const newEmployeeId = `UI${generateEmployeeId()}`;

    // Parse date-only string (YYYY-MM-DD) as UTC midnight
    const adjustedStartDate = start_date
      ? dayjs.utc(start_date).startOf('day').toDate()
      : null;

    return this.prisma.employee.create({
      data: {
        id: newEmployeeId,
        ...employeeData,
        start_date: adjustedStartDate,
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

  async findAll(cafeName?: string) {
    // If cafe name is provided, find the cafe first
    let cafeId: string | undefined;
    if (cafeName) {
      const cafe = await this.prisma.cafe.findUnique({
        where: { name: cafeName },
      });

      if (!cafe) {
        return [];
      }

      cafeId = cafe.id;
    }

    const employees = await this.prisma.employee.findMany({
      where: cafeId ? { cafeId: cafeId } : {},
      include: {
        cafe: { select: { name: true } },
      },
      orderBy: {
        start_date: 'asc',
      },
    });

    const today = dayjs().utc().startOf('day');
    return employees.map((employee) => {
      const { cafe, start_date, cafeId, ...restOfEmployee } = employee;

      let days_worked = 0;
      if (start_date) {
        const startDay = dayjs(start_date).utc().startOf('day');
        days_worked = today.diff(startDay, 'day');
      }

      return {
        ...restOfEmployee,
        days_worked,
        cafeId: cafeId || null,
        cafe: cafe?.name || '',
      };
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        cafe: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found.`);
    }

    // Return start_date as date-only string to avoid timezone issues in frontend
    const formattedDate = employee.start_date
      ? dayjs(employee.start_date).format('YYYY-MM-DD')
      : null;

    return {
      ...employee,
      start_date: formattedDate,
    };
  }

  /**
   * Update employee and reassign/unassign cafe.
   * - If cafeId is provided:
   *   - if null: disconnect from cafe and clear start_date
   *   - if non-null: connect to cafe and set start_date
   */
  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    await this.findOne(id);

    const { cafeId, start_date, ...employeeData } = updateEmployeeDto;

    // Parse date-only string (YYYY-MM-DD) as UTC midnight
    const adjustedStartDate =
      start_date !== undefined
        ? start_date
          ? dayjs.utc(start_date).startOf('day').toDate()
          : null
        : undefined;

    return this.prisma.employee.update({
      where: { id },
      data: {
        ...employeeData,
        ...(cafeId !== undefined && {
          // Only update relationship if cafeId was in the request
          start_date: cafeId ? adjustedStartDate : null, // Set adjusted date if assigning, null if un-assigning
          cafe: {
            connect: cafeId ? { id: cafeId } : undefined,
            disconnect: !cafeId ? true : undefined,
          },
        }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if employee exists
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
