import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * GET /api/projects
   * Optional query param: ?featured=true to get only featured projects
   */
  @Get()
  findAll(@Query('featured') featured?: string) {
    if (featured === 'true') {
      return this.projectsService.findFeatured()
    }
    return this.projectsService.findAll()
  }

  /** GET /api/projects/by-slug/:slug */
  @Get('by-slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug)
  }

  /** GET /api/projects/:id */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id)
  }

  /** POST /api/projects */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto)
  }

  /** PATCH /api/projects/:id */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto)
  }

  /** DELETE /api/projects/:id */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id)
  }
}
