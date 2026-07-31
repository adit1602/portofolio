import { IsString, IsBoolean, IsOptional, IsUrl, IsInt, IsArray, Min } from 'class-validator'

export class CreateProjectDto {
  @IsString()
  title: string

  @IsString()
  slug: string

  @IsString()
  description: string

  @IsOptional()
  @IsUrl()
  liveUrl?: string

  @IsOptional()
  @IsUrl()
  repoUrl?: string

  @IsOptional()
  @IsString()
  photoUrl?: string

  @IsOptional()
  @IsBoolean()
  featured?: boolean

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillIds?: string[]
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  slug?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsUrl()
  liveUrl?: string

  @IsOptional()
  @IsUrl()
  repoUrl?: string

  @IsOptional()
  @IsString()
  photoUrl?: string

  @IsOptional()
  @IsBoolean()
  featured?: boolean

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillIds?: string[]
}
