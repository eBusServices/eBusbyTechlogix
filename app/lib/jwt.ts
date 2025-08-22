// JWT Security Helper
import * as jwt from 'jsonwebtoken'
import { config } from './config'

export function getJwtSecret(): string {
  const secret = config.jwtSecret
  
  // Validate JWT secret in production
  if (config.isProduction && secret === 'development_jwt_secret_not_for_production') {
    throw new Error('JWT_SECRET environment variable is required in production. Please set a secure JWT secret.')
  }
  
  return secret
}

export function signToken(payload: any, expiresIn: string = '24h'): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn } as jwt.SignOptions)
}

export function verifyToken(token: string): any {
  return jwt.verify(token, getJwtSecret())
}
