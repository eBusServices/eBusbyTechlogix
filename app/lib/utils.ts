import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Validation utilities
export const validators = {
  email: (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  },
  
  phone: (phone: string) => {
    const re = /^(\+234|0)[7-9][0-1]\d{8}$/
    return re.test(phone.replace(/\s/g, ''))
  },
  
  required: (value: string) => {
    return value.trim().length > 0
  },
  
  minLength: (value: string, min: number) => {
    return value.length >= min
  }
}

// Error handling
export function handleApiError(error: any) {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error.message) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

// URL utilities
export function buildUrl(base: string, params: Record<string, string | number | boolean | undefined>) {
  const url = new URL(base, window.location.origin)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })
  
  return url.toString()
}

// Date utilities
export function isToday(date: string | Date) {
  const today = new Date()
  const targetDate = new Date(date)
  
  return today.toDateString() === targetDate.toDateString()
}

export function isFutureDate(date: string | Date) {
  return new Date(date) > new Date()
}

export function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T) {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc') {
  return array.sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

// String utilities
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncate(str: string, length: number) {
  return str.length <= length ? str : str.slice(0, length) + '...'
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Number utilities
export function formatNumber(num: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat('en-NG', options).format(num)
}

export function percentage(value: number, total: number) {
  return total === 0 ? 0 : Math.round((value / total) * 100)
}

// Device detection
export function isMobile() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export function isTablet() {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export function isDesktop() {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 1024
}

// Color utilities
export function getStatusColor(status: string) {
  const colors = {
    success: 'text-green-600 bg-green-100',
    warning: 'text-yellow-600 bg-yellow-100',
    error: 'text-red-600 bg-red-100',
    info: 'text-blue-600 bg-blue-100',
    pending: 'text-orange-600 bg-orange-100',
    confirmed: 'text-green-600 bg-green-100',
    cancelled: 'text-red-600 bg-red-100',
    completed: 'text-green-600 bg-green-100'
  }
  
  return colors[status.toLowerCase() as keyof typeof colors] || colors.info
}

// Random utilities
export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export function generateBookingRef() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substr(2, 3).toUpperCase()
  return `TL${timestamp}${random}`
}

// Animation utilities
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
}
