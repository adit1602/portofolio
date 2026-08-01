import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'
import { Observable, tap } from 'rxjs'

const MUTATING_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE'])

/**
 * Notifies the Next.js web app to revalidate the landing page right after
 * an admin write succeeds, instead of relying on the passive 60s ISR window.
 * Skips /auth/* (login/refresh/logout are mutating but don't change page content).
 */
@Injectable()
export class RevalidateInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>()

    if (!MUTATING_METHODS.has(req.method) || req.path.includes('/auth')) {
      return next.handle()
    }

    return next.handle().pipe(tap(() => this.triggerRevalidate()))
  }

  private triggerRevalidate(): void {
    const webUrl = this.config.get<string>('WEB_URL')
    const secret = this.config.get<string>('REVALIDATE_SECRET')
    if (!webUrl || !secret) return

    fetch(`${webUrl}/api/revalidate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}` },
    }).catch((err: unknown) => {
      console.warn('Revalidate webhook failed:', err instanceof Error ? err.message : err)
    })
  }
}
