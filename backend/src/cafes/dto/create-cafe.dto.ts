import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateCafeDto {
  @IsString({ message: 'Cafe name must be a string.' })
  @IsNotEmpty({ message: 'Cafe name is required.' })
  @MinLength(6, { message: 'Cafe name must be at least 6 characters long.' })
  @MaxLength(10, { message: 'Cafe name must not exceed 10 characters.' })
  name: string;

  @IsString({ message: 'Description must be a string.' })
  @IsNotEmpty({ message: 'Description is required.' })
  @MaxLength(256, { message: 'Description must not exceed 256 characters.' })
  description: string;

  @IsString({ message: 'Location must be a string.' })
  @IsNotEmpty({ message: 'Location is required.' })
  location: string;

  @IsString({ message: 'Logo must be a string.' })
  @IsOptional()
  logo?: string;
}
