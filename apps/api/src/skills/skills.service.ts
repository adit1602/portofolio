import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import {
  CreateSkillDto,
  UpdateSkillDto,
  CreateSkillCategoryDto,
  UpdateSkillCategoryDto,
} from './dto/skill.dto'

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  // ---- Categories ----

  findAllCategories() {
    return this.prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        skills: { orderBy: { order: 'asc' } },
      },
    })
  }

  async createCategory(dto: CreateSkillCategoryDto) {
    const exists = await this.prisma.skillCategory.findUnique({ where: { name: dto.name } })
    if (exists) {
      throw new ConflictException(`Category "${dto.name}" already exists`)
    }
    return this.prisma.skillCategory.create({ data: dto })
  }

  async updateCategory(id: string, dto: UpdateSkillCategoryDto) {
    await this.findCategoryOrThrow(id)
    return this.prisma.skillCategory.update({ where: { id }, data: dto })
  }

  async deleteCategory(id: string) {
    await this.findCategoryOrThrow(id)
    return this.prisma.skillCategory.delete({ where: { id } })
  }

  private async findCategoryOrThrow(id: string) {
    const cat = await this.prisma.skillCategory.findUnique({ where: { id } })
    if (!cat) {
      throw new NotFoundException(`Category ${id} not found`)
    }
    return cat
  }

  // ---- Skills ----

  findAll() {
    return this.prisma.skill.findMany({
      orderBy: { order: 'asc' },
      include: { category: true },
    })
  }

  async findOne(id: string) {
    return this.findSkillOrThrow(id)
  }

  async create(dto: CreateSkillDto) {
    await this.findCategoryOrThrow(dto.categoryId)
    return this.prisma.skill.create({
      data: {
        name: dto.name,
        level: dto.level,
        iconUrl: dto.iconUrl,
        order: dto.order ?? 0,
        category: { connect: { id: dto.categoryId } },
      },
      include: { category: true },
    })
  }

  async update(id: string, dto: UpdateSkillDto) {
    await this.findSkillOrThrow(id)
    if (dto.categoryId) {
      await this.findCategoryOrThrow(dto.categoryId)
    }
    return this.prisma.skill.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.level !== undefined && { level: dto.level }),
        ...(dto.iconUrl !== undefined && { iconUrl: dto.iconUrl }),
        ...(dto.order !== undefined && { order: dto.order }),
        ...(dto.categoryId && { category: { connect: { id: dto.categoryId } } }),
      },
      include: { category: true },
    })
  }

  async remove(id: string) {
    await this.findSkillOrThrow(id)
    return this.prisma.skill.delete({ where: { id } })
  }

  private async findSkillOrThrow(id: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!skill) {
      throw new NotFoundException(`Skill ${id} not found`)
    }
    return skill
  }
}
