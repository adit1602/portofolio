import { IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator'

export class CreateExperienceDto {
  @IsString()
  company: string

  @IsString()
  role: string

  @IsString()
  description: string

  @IsDateString()
  startDate: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean
}

export class UpdateExperienceDto {
  @IsOptional()
  @IsString()
  company?: string

  @IsOptional()
  @IsString()
  role?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean
}
