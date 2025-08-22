// API Configuration for Vercel deployment
export const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://e-busby-techlogix.vercel.app' 
    : 'http://localhost:3000',
  
  // Environment check
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Security configuration
  jwtSecret: process.env.JWT_SECRET || 'development_jwt_secret_not_for_production',
  
  // Demo credentials (ONLY for development - use environment variables in production)
  demo: {
    adminEmail: process.env.ADMIN_EMAIL || 'admin@techlogix.com',
    driverId: process.env.DRIVER_1_ID || 'DRV001',
    // Password hashes removed for security - use environment variables
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
