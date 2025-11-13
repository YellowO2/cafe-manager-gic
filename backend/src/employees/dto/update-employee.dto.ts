import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import {
  Allow,
  IsOptional,
  IsUUID,
  ValidateIf,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['cafeId', 'start_date'] as const),
) {
  @ValidateIf(
    (o: UpdateEmployeeDto) => o.start_date !== undefined || o.cafeId === null,
  )
  @IsOptional()
  @IsUUID()
  @Allow() // Allows cafeId to be null
  cafeId?: string | null;

  @ValidateIf(
    (o: UpdateEmployeeDto) => o.cafeId !== undefined && o.cafeId !== null,
  )
  @IsNotEmpty({
    message: 'start_date must be provided if employee is assigned a cafe.',
  })
  @IsDateString()
  start_date?: Date;
}
