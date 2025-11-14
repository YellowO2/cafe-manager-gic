import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
  IsEnum,
  IsDateString,
  IsUUID,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateEmployeeDto {
  @IsString({ message: 'Employee name must be a string.' })
  @IsNotEmpty({ message: 'Employee name is required.' })
  @MinLength(6, {
    message: 'Employee name must be at least 6 characters long.',
  })
  @MaxLength(10, { message: 'Employee name must not exceed 10 characters.' })
  name: string;

  @IsEmail({}, { message: 'Email address must be a valid email format.' })
  @IsNotEmpty({ message: 'Email address is required.' })
  email_address: string;

  @IsString({ message: 'Phone number must be a string.' })
  @IsNotEmpty({ message: 'Phone number is required.' })
  @Matches(/^[89]\d{7}$/, {
    message: 'Phone number must be an 8-digit number starting with 8 or 9.',
  })
  phone_number: string;

  @IsEnum(Gender, { message: 'Gender must be either "male" or "female".' })
  @IsNotEmpty({ message: 'Gender is required.' })
  gender: Gender;

  @ValidateIf((o: CreateEmployeeDto) => o.start_date != null)
  @IsNotEmpty({ message: 'Cafe must be selected if a start date is provided.' })
  @IsOptional()
  @IsUUID(undefined, { message: 'Cafe ID must be a valid UUID.' })
  cafeId?: string;

  @ValidateIf((o: CreateEmployeeDto) => o.cafeId != null)
  @IsNotEmpty({ message: 'Start date is required when assigning to a cafe.' })
  @IsDateString({}, { message: 'Start date must be a valid date.' })
  start_date?: Date;
}
