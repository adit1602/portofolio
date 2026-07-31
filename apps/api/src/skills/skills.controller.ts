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
import { SkillsService } from './skills.service'
import {
  CreateSkillDto,
  UpdateSkillDto,
  CreateSkillCategoryDto,
  UpdateSkillCategoryDto,
} from './dto/skill.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  // ---- Public endpoints ----

  /** GET /api/skills — all skills with their category */
  @Get()
  findAll() {
    return this.skillsService.findAll()
  }

  /** GET /api/skills/categories — all categories with their skills */
  @Get('categories')
  findAllCategories() {
    return this.skillsService.findAllCategories()
  }

  /** GET /api/skills/:id */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id)
  }

  // ---- Protected endpoints (admin only) ----

  /** POST /api/skills */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateSkillDto) {
    return this.skillsService.create(dto)
  }

  /** PATCH /api/skills/:id */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateSkillDto) {
    return this.skillsService.update(id, dto)
  }

  /** DELETE /api/skills/:id */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id)
  }

  // ---- Category protected endpoints ----

  /** POST /api/skills/categories */
  @Post('categories')
  @UseGuards(JwtAuthGuard)
  createCategory(@Body() dto: CreateSkillCategoryDto) {
    return this.skillsService.createCategory(dto)
  }

  /** PATCH /api/skills/categories/:id */
  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard)
  updateCategory(@Param('id') id: string, @Body() dto: UpdateSkillCategoryDto) {
    return this.skillsService.updateCategory(id, dto)
  }

  /** DELETE /api/skills/categories/:id */
  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCategory(@Param('id') id: string) {
    return this.skillsService.deleteCategory(id)
  }
}
