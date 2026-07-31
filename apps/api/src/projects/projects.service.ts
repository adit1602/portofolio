import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany({
      orderBy: { order: 'asc' },
      include: {
        skills: { include: { skill: { include: { category: true } } } },
      },
    })
  }

  findFeatured() {
    return this.prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
      include: {
        skills: { include: { skill: { include: { category: true } } } },
      },
    })
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        skills: { include: { skill: { include: { category: true } } } },
      },
    })
    if (!project) {
      throw new NotFoundException(`Project with slug "${slug}" not found`)
    }
    return project
  }

  async findOne(id: string) {
    return this.findOrThrow(id)
  }

  async create(dto: CreateProjectDto) {
    const existing = await this.prisma.project.findUnique({ where: { slug: dto.slug } })
    if (existing) {
      throw new ConflictException(`Project with slug "${dto.slug}" already exists`)
    }

    return this.prisma.project.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        liveUrl: dto.liveUrl,
        repoUrl: dto.repoUrl,
        photoUrl: dto.photoUrl,
        featured: dto.featured ?? false,
        order: dto.order ?? 0,
        // Connect existing skills via the join table
        skills: dto.skillIds?.length
          ? {
              create: dto.skillIds.map((skillId) => ({
                skill: { connect: { id: skillId } },
              })),
            }
          : undefined,
      },
      include: {
        skills: { include: { skill: true } },
      },
    })
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOrThrow(id)

    if (dto.slug) {
      const existing = await this.prisma.project.findFirst({
        where: { slug: dto.slug, NOT: { id } },
      })
      if (existing) {
        throw new ConflictException(`Slug "${dto.slug}" already taken`)
      }
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.slug && { slug: dto.slug }),
        ...(dto.description && { description: dto.description }),
        ...(dto.liveUrl !== undefined && { liveUrl: dto.liveUrl }),
        ...(dto.repoUrl !== undefined && { repoUrl: dto.repoUrl }),
        ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
        ...(dto.featured !== undefined && { featured: dto.featured }),
        ...(dto.order !== undefined && { order: dto.order }),
        // Replace all skills if skillIds provided
        ...(dto.skillIds !== undefined && {
          skills: {
            deleteMany: {},
            create: dto.skillIds.map((skillId) => ({
              skill: { connect: { id: skillId } },
            })),
          },
        }),
      },
      include: {
        skills: { include: { skill: true } },
      },
    })
  }

  async remove(id: string) {
    await this.findOrThrow(id)
    return this.prisma.project.delete({ where: { id } })
  }

  private async findOrThrow(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        skills: { include: { skill: { include: { category: true } } } },
      },
    })
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`)
    }
    return project
  }
}
