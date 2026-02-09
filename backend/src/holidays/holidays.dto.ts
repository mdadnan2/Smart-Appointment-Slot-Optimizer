import { IsString, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateHolidayDto {
  @IsString()
  providerId: string;

  @IsString()
  title: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
}
