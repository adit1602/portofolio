import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { IsString, IsOptional, IsInt, IsUrl, Min } from 'class-validator'
import { SiteSettingsService } from './site-settings.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

class CreateSocialLinkDto {
  @IsString()
  platform: string

  @IsUrl()
  url: string

  @IsString()
  icon: string

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number
}

@Controller('settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  /** GET /api/settings — returns all settings as key→value map */
  @Get()
  findAll() {
    return this.siteSettingsService.findAll()
  }

  /**
   * PATCH /api/settings — bulk upsert
   * Body is an arbitrary key→value map (settings are freeform), so it's typed
   * as a plain Record rather than a class — a class type here would trigger
   * the global ValidationPipe's whitelist and reject every key (none are
   * declared as class-validator properties).
   */
  @Patch()
  @UseGuards(JwtAuthGuard)
  bulkUpsert(@Body() data: Record<string, string>) {
    return this.siteSettingsService.bulkUpsert(data)
  }

  // ---- Social Links ----

  /** GET /api/settings/social-links */
  @Get('social-links')
  findSocialLinks() {
    return this.siteSettingsService.findAllSocialLinks()
  }

  /** POST /api/settings/social-links */
  @Post('social-links')
  @UseGuards(JwtAuthGuard)
  createSocialLink(@Body() dto: CreateSocialLinkDto) {
    return this.siteSettingsService.createSocialLink(dto)
  }

  /** PATCH /api/settings/social-links/:id */
  @Patch('social-links/:id')
  @UseGuards(JwtAuthGuard)
  updateSocialLink(@Param('id') id: string, @Body() dto: Partial<CreateSocialLinkDto>) {
    return this.siteSettingsService.updateSocialLink(id, dto)
  }

  /** DELETE /api/settings/social-links/:id */
  @Delete('social-links/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSocialLink(@Param('id') id: string) {
    return this.siteSettingsService.deleteSocialLink(id)
  }
}
