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
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

// Name of the httpOnly cookie holding the refresh token
const REFRESH_TOKEN_COOKIE = 'refresh_token'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  // Shared across api.<domain> and <domain> when web + API live on different
  // subdomains, so the web app's middleware can read the cookie. Unset in
  // local dev where both run on localhost with different ports.
  private get cookieDomain(): string | undefined {
    return this.config.get<string>('COOKIE_DOMAIN')
  }

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
      domain: this.cookieDomain,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    })

    return { accessToken, user }
  }

  /**
   * POST /api/auth/refresh
   * Reads refresh token from httpOnly cookie, returns a new access token,
   * and rotates the refresh cookie (resets its 30-day maxAge) so the
   * session keeps sliding forward as long as the app keeps calling this.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] as string | undefined

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token')
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.authService.refresh(refreshToken)

    res.cookie(REFRESH_TOKEN_COOKIE, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: this.cookieDomain,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    })

    return { accessToken }
  }

  /**
   * POST /api/auth/logout
   * Clears the refresh token cookie.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(REFRESH_TOKEN_COOKIE, { domain: this.cookieDomain })
    return { message: 'Logged out' }
  }
}
