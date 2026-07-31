import { IsString, IsInt, IsOptional, IsUrl, Min, Max } from 'class-validator'

export class CreateSkillCategoryDto {
  @IsString()
  name: string

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number
}

export class UpdateSkillCategoryDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number
}

export class CreateSkillDto {
  @IsString()
  categoryId: string

  @IsString()
  name: string

  @IsInt()
  @Min(1)
  @Max(5)
  level: number

  @IsOptional()
  @IsUrl()
  iconUrl?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number
}

export class UpdateSkillDto {
  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  level?: number

  @IsOptional()
  @IsUrl()
  iconUrl?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number
}
