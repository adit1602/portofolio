import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { SkillsModule } from './skills/skills.module'
import { ExperiencesModule } from './experiences/experiences.module'
import { ProjectsModule } from './projects/projects.module'
import { SiteSettingsModule } from './site-settings/site-settings.module'
import { UploadsModule } from './uploads/uploads.module'

@Module({
  imports: [
    // Load .env variables globally — must be first
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    SkillsModule,
    ExperiencesModule,
    ProjectsModule,
    SiteSettingsModule,
    UploadsModule,
  ],
})
export class AppModule {}
