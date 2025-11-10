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
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(10)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email_address: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[89]\d{7}$/, {
    message: 'Phone number must be an 8-digit number starting with 8 or 9.',
  })
  phone_number: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ValidateIf((o: CreateEmployeeDto) => o.start_date != null)
  @IsNotEmpty({ message: 'cafeId must be provided if start_date exists.' })
  @IsOptional()
  @IsUUID()
  cafeId?: string;

  @ValidateIf((o: CreateEmployeeDto) => o.cafeId != null)
  @IsNotEmpty()
  @IsDateString()
  start_date?: Date;
}
