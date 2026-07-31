import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ExperiencesService } from './experiences.service'
import { CreateExperienceDto, UpdateExperienceDto } from './dto/experience.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  /** GET /api/experiences */
  @Get()
  findAll() {
    return this.experiencesService.findAll()
  }

  /** GET /api/experiences/:id */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experiencesService.findOne(id)
  }

  /** POST /api/experiences */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateExperienceDto) {
    return this.experiencesService.create(dto)
  }

  /** PATCH /api/experiences/:id */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateExperienceDto) {
    return this.experiencesService.update(id, dto)
  }

  /** DELETE /api/experiences/:id */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.experiencesService.remove(id)
  }
}
