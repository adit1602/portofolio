import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SiteSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Return all settings as a key→value map for easy consumption */
  async findAll(): Promise<Record<string, string>> {
    const settings = await this.prisma.siteSetting.findMany()
    return Object.fromEntries(settings.map((s) => [s.key, s.value]))
  }

  async findOne(key: string) {
    const setting = await this.prisma.siteSetting.findUnique({ where: { key } })
    if (!setting) {
      throw new NotFoundException(`Setting "${key}" not found`)
    }
    return setting
  }

  /** Upsert a setting by key */
  upsert(key: string, value: string) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }

  /** Bulk upsert — accepts a key→value record */
  async bulkUpsert(data: Record<string, string>) {
    const ops = Object.entries(data).map(([key, value]) =>
      this.prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    )
    return this.prisma.$transaction(ops)
  }

  // ---- Social Links ----

  findAllSocialLinks() {
    return this.prisma.socialLink.findMany({ orderBy: { order: 'asc' } })
  }

  createSocialLink(data: { platform: string; url: string; icon: string; order?: number }) {
    return this.prisma.socialLink.create({ data: { order: 0, ...data } })
  }

  async updateSocialLink(
    id: string,
    data: Partial<{ platform: string; url: string; icon: string; order: number }>,
  ) {
    const existing = await this.prisma.socialLink.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException(`Social link ${id} not found`)
    return this.prisma.socialLink.update({ where: { id }, data })
  }

  async deleteSocialLink(id: string) {
    const existing = await this.prisma.socialLink.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException(`Social link ${id} not found`)
    return this.prisma.socialLink.delete({ where: { id } })
  }
}
