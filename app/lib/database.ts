import * as bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

export interface User {
  id: string
  name: string
  username?: string
  email: string
  phone: string
  password: string
  role: 'admin' | 'passenger' | 'driver'
  created_at: string
  is_verified: boolean
  last_login?: string
}

export interface Driver {
  id: string
  driver_id: string
  name: string
  email: string
  phone: string
  password: string
  license_number: string
  experience: string
  status: 'active' | 'inactive'
  created_at: string
}

export interface Trip {
  id: string
  route: string
  from_location: string
  to_location: string
  departure_time: string
  arrival_time: string
  price: number
  total_seats: number
  available_seats: number
  trip_date: string
  vehicle: string
  driver_id?: string
  status: string
  created_at: string
}

export interface Booking {
  id: string
  booking_reference: string
  user_id: string
  trip_id: string
  passenger_name: string
  phone: string
  email: string
  selected_seats: number[]
  total_amount: number
  status: string
  payment_status: string
  created_at: string
}

let initialized = false
let users: User[] = []
let drivers: Driver[] = []
let trips: Trip[] = []
let bookings: Booking[] = []

async function safeHash(value: string): Promise<string> {
  try {
    return await bcrypt.hash(value, 12)
  } catch {
    return value
  }
}

function isoDate(daysAhead = 0): string {
  const date = new Date()
  date.setDate(date.getDate() + daysAhead)
  return date.toISOString().split('T')[0]
}

export async function initializeDatabase() {
  if (initialized) {
    return
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@techlogix.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const adminPhone = process.env.ADMIN_PHONE || '+234 810 733 8827'

  const driverPassword = process.env.DRIVER_PASSWORD || 'driver123'
  const driver1Id = process.env.DRIVER_1_ID || 'DRV001'
  const driver1Name = process.env.DRIVER_1_NAME || 'Samuel Oche'
  const driver1Email = process.env.DRIVER_1_EMAIL || 'samuel@techlogix.com'
  const driver1Phone = process.env.DRIVER_1_PHONE || '+234 810 733 8830'
  const driver1License = process.env.DRIVER_1_LICENSE || 'ABC123456789'

  const driver2Id = process.env.DRIVER_2_ID || 'DRV002'
  const driver2Name = process.env.DRIVER_2_NAME || 'Michael Adah'
  const driver2Email = process.env.DRIVER_2_EMAIL || 'michael@techlogix.com'
  const driver2Phone = process.env.DRIVER_2_PHONE || '+234 810 733 8831'
  const driver2License = process.env.DRIVER_2_LICENSE || 'DEF987654321'

  const adminPasswordHash = await safeHash(adminPassword)
  const driverPasswordHash = await safeHash(driverPassword)

  users = [
    {
      id: randomUUID(),
      name: 'Admin User',
      username: 'admin',
      email: adminEmail,
      phone: adminPhone,
      password: adminPasswordHash,
      role: 'admin',
      created_at: new Date().toISOString(),
      is_verified: true,
    },
  ]

  drivers = [
    {
      id: randomUUID(),
      driver_id: driver1Id,
      name: driver1Name,
      email: driver1Email,
      phone: driver1Phone,
      password: driverPasswordHash,
      license_number: driver1License,
      experience: '5 years',
      status: 'active',
      created_at: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      driver_id: driver2Id,
      name: driver2Name,
      email: driver2Email,
      phone: driver2Phone,
      password: driverPasswordHash,
      license_number: driver2License,
      experience: '8 years',
      status: 'active',
      created_at: new Date().toISOString(),
    },
  ]

  trips = [
    {
      id: 'TRP001',
      route: 'Lagos to Abuja',
      from_location: 'Lagos',
      to_location: 'Abuja',
      departure_time: '08:00',
      arrival_time: '14:00',
      price: 15000,
      total_seats: 7,
      available_seats: 7,
      trip_date: isoDate(1),
      vehicle: 'Mercedes Sprinter - LG123ABC',
      status: 'scheduled',
      created_at: new Date().toISOString(),
    },
    {
      id: 'TRP002',
      route: 'Abuja to Port Harcourt',
      from_location: 'Abuja',
      to_location: 'Port Harcourt',
      departure_time: '09:00',
      arrival_time: '16:00',
      price: 18000,
      total_seats: 7,
      available_seats: 7,
      trip_date: isoDate(1),
      vehicle: 'Toyota Hiace - AB456DEF',
      status: 'scheduled',
      created_at: new Date().toISOString(),
    },
    {
      id: 'TRP003',
      route: 'Lagos to Kano',
      from_location: 'Lagos',
      to_location: 'Kano',
      departure_time: '07:00',
      arrival_time: '15:00',
      price: 20000,
      total_seats: 7,
      available_seats: 7,
      trip_date: isoDate(2),
      vehicle: 'Mercedes Sprinter - LG789GHI',
      status: 'scheduled',
      created_at: new Date().toISOString(),
    },
    {
      id: 'TRP004',
      route: 'Port Harcourt to Lagos',
      from_location: 'Port Harcourt',
      to_location: 'Lagos',
      departure_time: '10:00',
      arrival_time: '17:00',
      price: 16000,
      total_seats: 7,
      available_seats: 7,
      trip_date: isoDate(2),
      vehicle: 'Toyota Hiace - PH123JKL',
      status: 'scheduled',
      created_at: new Date().toISOString(),
    },
  ]

  bookings = []
  initialized = true
}

// User database functions
export async function createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
  await initializeDatabase()
  const user: User = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    ...userData,
  }
  users.push(user)
  return user
}

export async function findUserByEmail(email: string): Promise<User | null> {
  await initializeDatabase()
  const normalizedEmail = email.trim().toLowerCase()
  return users.find((user) => user.email.trim().toLowerCase() === normalizedEmail) || null
}

export async function findUserByUsername(username: string): Promise<User | null> {
  await initializeDatabase()
  const normalizedUsername = username.trim().toLowerCase()
  return (
    users.find((user) => user.username?.trim().toLowerCase() === normalizedUsername) || null
  )
}

export async function findUserByEmailOrUsername(identifier: string): Promise<User | null> {
  await initializeDatabase()
  const normalizedIdentifier = identifier.trim().toLowerCase()
  return (
    users.find((user) => {
      const email = user.email.trim().toLowerCase()
      const username = user.username?.trim().toLowerCase()
      return email === normalizedIdentifier || username === normalizedIdentifier
    }) || null
  )
}

export async function updateUserLastLogin(userId: string): Promise<void> {
  await initializeDatabase()
  users = users.map((user) =>
    user.id === userId ? { ...user, last_login: new Date().toISOString() } : user
  )
}

// Driver database functions
export async function findDriverById(driverId: string): Promise<Driver | null> {
  await initializeDatabase()
  const normalizedDriverId = driverId.trim().toUpperCase()
  return drivers.find((driver) => driver.driver_id.trim().toUpperCase() === normalizedDriverId) || null
}

export async function getAllDrivers(): Promise<Driver[]> {
  await initializeDatabase()
  return drivers.filter((driver) => driver.status === 'active')
}

// Trip database functions
export async function getAllTrips(): Promise<Trip[]> {
  await initializeDatabase()
  const today = isoDate(0)
  return trips
    .filter((trip) => trip.trip_date >= today)
    .sort((a, b) => {
      if (a.trip_date === b.trip_date) {
        return a.departure_time.localeCompare(b.departure_time)
      }
      return a.trip_date.localeCompare(b.trip_date)
    })
}

export async function getTripById(tripId: string): Promise<Trip | null> {
  await initializeDatabase()
  return trips.find((trip) => trip.id === tripId) || null
}

export async function createTrip(tripData: Omit<Trip, 'id' | 'created_at'>): Promise<Trip> {
  await initializeDatabase()
  const totalSeatsRaw = Number(tripData.total_seats)
  const totalSeats = Number.isFinite(totalSeatsRaw) && totalSeatsRaw > 0
    ? Math.floor(totalSeatsRaw)
    : 1
  const availableSeatsRaw = Number(tripData.available_seats)
  const availableSeats = Number.isFinite(availableSeatsRaw)
    ? Math.min(Math.max(Math.floor(availableSeatsRaw), 0), totalSeats)
    : totalSeats

  const trip: Trip = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    ...tripData,
    total_seats: totalSeats,
    available_seats: availableSeats,
  }
  trips.push(trip)
  return trip
}

export async function updateTrip(tripId: string, updates: Partial<Trip>): Promise<Trip> {
  await initializeDatabase()
  const index = trips.findIndex((trip) => trip.id === tripId)
  if (index === -1) {
    throw new Error('Trip not found')
  }
  const existingTrip = trips[index]

  const requestedTotalSeatsRaw =
    updates.total_seats !== undefined ? Number(updates.total_seats) : existingTrip.total_seats
  const nextTotalSeats =
    Number.isFinite(requestedTotalSeatsRaw) && requestedTotalSeatsRaw > 0
      ? Math.floor(requestedTotalSeatsRaw)
      : existingTrip.total_seats

  const requestedAvailableSeatsRaw =
    updates.available_seats !== undefined
      ? Number(updates.available_seats)
      : updates.total_seats !== undefined
        ? Math.min(existingTrip.available_seats, nextTotalSeats)
        : existingTrip.available_seats

  const nextAvailableSeats = Number.isFinite(requestedAvailableSeatsRaw)
    ? Math.min(Math.max(Math.floor(requestedAvailableSeatsRaw), 0), nextTotalSeats)
    : Math.min(existingTrip.available_seats, nextTotalSeats)

  trips[index] = {
    ...existingTrip,
    ...updates,
    total_seats: nextTotalSeats,
    available_seats: nextAvailableSeats,
  }
  return trips[index]
}

// Booking database functions
export async function createBooking(bookingData: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> {
  await initializeDatabase()
  const trip = trips.find((item) => item.id === bookingData.trip_id)
  if (!trip) {
    throw new Error('Trip not found')
  }

  if (trip.available_seats < bookingData.selected_seats.length) {
    throw new Error('Not enough seats available')
  }

  trip.available_seats = trip.available_seats - bookingData.selected_seats.length

  const booking: Booking = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    ...bookingData,
    selected_seats: Array.isArray(bookingData.selected_seats)
      ? bookingData.selected_seats
      : [],
  }
  bookings.push(booking)
  return booking
}

export async function getAllBookings(): Promise<Booking[]> {
  await initializeDatabase()
  return [...bookings].sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function getBookingByReference(reference: string): Promise<Booking | null> {
  await initializeDatabase()
  return bookings.find((booking) => booking.booking_reference === reference) || null
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  await initializeDatabase()
  const userBookings = bookings
    .filter((booking) => booking.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))

  return userBookings.map((booking) => {
    const trip = trips.find((item) => item.id === booking.trip_id)
    return {
      ...booking,
      route: trip?.route,
      from_location: trip?.from_location,
      to_location: trip?.to_location,
      departure_time: trip?.departure_time,
      trip_date: trip?.trip_date,
    } as Booking
  })
}

// Utility function to generate booking reference
export function generateBookingReference(): string {
  const prefix = 'EB'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `${prefix}${timestamp}${random}`
}
