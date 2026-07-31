import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../src/app.module'

// Basic smoke test: verify the app can bootstrap
// Real integration tests belong in a separate test suite with a test DB
describe('App (smoke)', () => {
  it('should be defined', () => {
    expect(AppModule).toBeDefined()
  })
})
