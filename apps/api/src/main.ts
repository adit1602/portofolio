import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { UPLOADS_DIR } from './uploads/uploads.constants'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const configService = app.get(ConfigService)

  // Parse cookies (needed for httpOnly refresh token)
  app.use(cookieParser())

  // Serve uploaded images (profile photo, project photos) as static files
  app.useStaticAssets(UPLOADS_DIR, { prefix: '/uploads/' })

  // Global request validation via class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,          // Auto-transform payload types
    }),
  )

  // CORS — allow requests from the Next.js frontend
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    credentials: true,          // Required for httpOnly cookies
  })

  // Global API prefix
  app.setGlobalPrefix('api')

  const port = configService.get<number>('PORT', 3001)
  await app.listen(port)
  console.warn(`API running on http://localhost:${port}/api`)
}

bootstrap()
