import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserProfileDto {
  @IsString()
  firstName: string;
  lastName: string;

  @IsNumber()
  age: number;

  @IsOptional()
  dateOfBirth: string;
}
