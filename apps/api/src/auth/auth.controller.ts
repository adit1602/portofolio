import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

// Name of the httpOnly cookie holding the refresh token
const REFRESH_TOKEN_COOKIE = 'refresh_token'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/login
   * Validates credentials, returns access token in body and
   * sets refresh token as an httpOnly cookie.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(dto)

    // Store refresh token in httpOnly cookie (not accessible from JS)
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    })

    return { accessToken, user }
  }

  /**
   * POST /api/auth/refresh
   * Reads refresh token from httpOnly cookie and returns a new access token.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] as string | undefined

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token')
    }

    return this.authService.refresh(refreshToken)
  }

  /**
   * POST /api/auth/logout
   * Clears the refresh token cookie.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(REFRESH_TOKEN_COOKIE)
    return { message: 'Logged out' }
  }
}
