import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class CreateProviderDto {
  @IsString()
  userId: string;

  @IsString()
  specialty: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsInt()
  @Min(5)
  @IsOptional()
  defaultServiceDuration?: number;
}

export class UpdateProviderDto {
  @IsString()
  @IsOptional()
  specialty?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsInt()
  @Min(5)
  @IsOptional()
  defaultServiceDuration?: number;
}
