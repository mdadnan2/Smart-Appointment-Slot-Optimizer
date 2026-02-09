import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEnum(['ADMIN', 'USER'])
  role: 'ADMIN' | 'USER';
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
