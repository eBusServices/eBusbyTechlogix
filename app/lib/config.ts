// API Configuration for Vercel deployment
export const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://e-busby-techlogix.vercel.app' 
    : 'http://localhost:3000',
  
  // Environment check
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Security configuration
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
  
  // Demo credentials (use environment variables in production)
  demo: {
    adminEmail: process.env.ADMIN_EMAIL || 'admin@techlogix.com',
    adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsHEp/Gp2', // admin123
    driverId: process.env.DRIVER_ID || 'DRV001',
    driverPasswordHash: process.env.DRIVER_PASSWORD_HASH || '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsHEp/Gp2', // driver123
  },
  
  // API endpoints
  endpoints: {
    trips: '/api/trips',
    bookings: '/api/bookings',
    branches: '/api/branches',
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      driver: '/api/auth/driver'
    }
  }
}

// Helper function to get full API URL
export function getApiUrl(endpoint: string): string {
  return `${config.apiBaseUrl}${endpoint}`
}

// Helper function for API requests
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = getApiUrl(endpoint)
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}
