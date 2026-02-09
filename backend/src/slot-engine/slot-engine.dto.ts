import { IsString, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetSlotsDto {
  @IsString()
  providerId: string;

  @IsDateString()
  date: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  duration: number;
}
