// src/employees/dto/update-employee.dto.ts
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
  IsEnum,
  IsDateString,
  IsUUID,
  ValidateIf,
  IsNotEmpty,
  Allow,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdateEmployeeDto {
  // All simple fields are optional
  @IsOptional() @IsString() @MinLength(6) @MaxLength(10) name?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @Matches(/^[89]\d{7}$/) phone_number?: string;
  @IsOptional() @IsEnum(Gender) gender?: Gender;

  // The 'cafeId' and 'start_date' are now a linked pair
  @IsOptional()
  @IsUUID()
  @Allow() // Allow 'null' to be passed for un-assignment
  cafeId?: string | null;

  @ValidateIf((o: UpdateEmployeeDto) => {
    if (o.cafeId) return true;
    return false;
  }) // If cafeId is a non-null string...
  @IsNotEmpty() // ...then start_date is required
  @IsDateString()
  start_date?: Date;
}
