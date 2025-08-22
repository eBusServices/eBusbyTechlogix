// Mock Database - Shared across all API routes
// In production, this would be replaced with a real database

import { config } from './config'

export interface User {
  id: string
  name: string
  username?: string
  email: string
  phone: string
  password: string
  role: 'admin' | 'passenger' | 'driver'
  createdAt: string
  isVerified: boolean
  lastLogin?: string
}

export interface Driver {
  id: string
  driverId: string
  name: string
  email: string
  phone: string
  password: string
  licenseNumber: string
  experience: string
  status: 'active' | 'inactive'
  createdAt: string
}

// Shared users database
export let users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    username: 'admin',
    email: config.demo.adminEmail,
    phone: '+234 810 733 8827',
    password: '$2a$12$5GPCtKbgBOQOdO/JyKOn5u.n6sTdttyzcdL5Vya3X5O7o5g5E2edm', // admin123 - working hash
    role: 'admin',
    createdAt: new Date().toISOString(),
    isVerified: true,
    lastLogin: new Date().toISOString()
  }
]

// Shared drivers database
export let drivers: Driver[] = [
  {
    id: '1',
    driverId: config.demo.driverId,
    name: 'Samuel Oche',
    email: 'samuel@techlogix.com',
    phone: '+234 810 733 8830',
    password: config.demo.driverPasswordHash,
    licenseNumber: 'ABC123456789',
    experience: '5 years',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    driverId: 'DRV002',
    name: 'Michael Adah',
    email: 'michael@techlogix.com',
    phone: '+234 810 733 8831',
    password: config.demo.driverPasswordHash,
    licenseNumber: 'DEF987654321',
    experience: '8 years',
    status: 'active',
    createdAt: new Date().toISOString()
  }
]

// User counter for new registrations
export let userCounter = 2 // Start from 2 since admin is id 1

// Helper functions
export function addUser(user: Omit<User, 'id'>): User {
  const newUser: User = {
    ...user,
    id: userCounter.toString()
  }
  users.push(newUser)
  userCounter++
  return newUser
}

export function findUserByEmail(email: string): User | undefined {
  return users.find(user => user.email === email)
}

export function findUserByUsername(username: string): User | undefined {
  return users.find(user => user.username === username)
}

export function findUserByEmailOrUsername(identifier: string): User | undefined {
  return users.find(user => user.email === identifier || user.username === identifier)
}

export function findDriverById(driverId: string): Driver | undefined {
  return drivers.find(driver => driver.driverId === driverId)
}

export function updateUserLastLogin(userId: string): void {
  const user = users.find(u => u.id === userId)
  if (user) {
    user.lastLogin = new Date().toISOString()
  }
}
