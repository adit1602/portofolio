import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateExperienceDto, UpdateExperienceDto } from './dto/experience.dto'

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    })
  }

  async findOne(id: string) {
    return this.findOrThrow(id)
  }

  create(dto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: {
        company: dto.company,
        role: dto.role,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isCurrent: dto.isCurrent ?? false,
      },
    })
  }

  async update(id: string, dto: UpdateExperienceDto) {
    await this.findOrThrow(id)
    return this.prisma.experience.update({
      where: { id },
      data: {
        ...(dto.company && { company: dto.company }),
        ...(dto.role && { role: dto.role }),
        ...(dto.description && { description: dto.description }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        // Allow null to clear endDate
        ...(dto.endDate !== undefined && { endDate: dto.endDate ? new Date(dto.endDate) : null }),
        ...(dto.isCurrent !== undefined && { isCurrent: dto.isCurrent }),
      },
    })
  }

  async remove(id: string) {
    await this.findOrThrow(id)
    return this.prisma.experience.delete({ where: { id } })
  }

  private async findOrThrow(id: string) {
    const exp = await this.prisma.experience.findUnique({ where: { id } })
    if (!exp) {
      throw new NotFoundException(`Experience ${id} not found`)
    }
    return exp
  }
}
