import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as argon2 from 'argon2'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Validate user credentials and return tokens.
   */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const passwordValid = await argon2.verify(user.passwordHash, dto.password)
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = { sub: user.id, email: user.email, role: user.role }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.config.get<string>('JWT_SECRET'),
    })

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
    })

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
    }
  }

  /**
   * Issue new access token from a valid refresh token.
   */
  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      })

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub as string } })
      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      const newPayload = { sub: user.id, email: user.email, role: user.role }
      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
        secret: this.config.get<string>('JWT_SECRET'),
      })

      return { accessToken }
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
