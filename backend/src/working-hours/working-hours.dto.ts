import { IsString, IsEnum, IsBoolean, IsOptional, Matches } from 'class-validator';

export class CreateWorkingHourDto {
  @IsString()
  providerId: string;

  @IsEnum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])
  dayOfWeek: string;

  @IsEnum(['MORNING', 'EVENING', 'FULL_DAY'])
  @IsOptional()
  shiftType?: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateWorkingHourDto {
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  @IsOptional()
  startTime?: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  @IsOptional()
  endTime?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
