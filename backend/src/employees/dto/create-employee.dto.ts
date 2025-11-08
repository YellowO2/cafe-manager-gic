import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsEmail,
  Matches,
  IsDateString,
  IsEnum,
  IsUUID,
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

  @Matches(/^[89]\d{7}$/, {
    message: 'Phone number must be 8 digits and start with 8 or 9',
  })
  phone_number: string;

  //   @IsString()
  @IsNotEmpty()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsDateString()
  start_date?: Date;

  @IsOptional()
  @IsUUID()
  cafeId?: string;
}
