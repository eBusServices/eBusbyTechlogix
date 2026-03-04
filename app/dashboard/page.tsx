'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  TicketIcon, 
  ClockIcon, 
  MapPinIcon,
  UserIcon,
  CreditCardIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
}

interface Booking {
  id: string
  bookingReference: string
  tripRoute: string
  tripDate: string
  departureTime: string
  selectedSeats: number[]
  totalAmount: number
  status: string
  paymentStatus: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/auth/login')
      return
    }

    setUser(JSON.parse(userData))
    fetchBookings()
  }, [router])

  const fetchBookings = async () => {
    try {
      // Mock bookings data - in real app, fetch from API
      const mockBookings: Booking[] = [
        {
          id: '1',
          bookingReference: 'TL123456001',
          tripRoute: 'Makurdi to Abuja',
          tripDate: '2025-01-25',
          departureTime: '06:00',
          selectedSeats: [12, 13],
          totalAmount: 16000,
          status: 'confirmed',
          paymentStatus: 'paid'
        },
        {
          id: '2',
          bookingReference: 'TL123456002',
          tripRoute: 'Abuja to Lagos',
          tripDate: '2025-01-30',
          departureTime: '07:30',
          selectedSeats: [8],
          totalAmount: 12000,
          status: 'confirmed',
          paymentStatus: 'pending'
        }
      ]
      
      setBookings(mockBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">
                Manage your bookings and travel information
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 sm:mt-0 btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/trips" className="card hover:scale-105 transition-transform duration-300 text-center">
            <TicketIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Book New Trip</h3>
            <p className="text-sm text-gray-600">Find and book your next journey</p>
          </Link>
          
          <Link href="/find-ticket" className="card hover:scale-105 transition-transform duration-300 text-center">
            <DocumentArrowDownIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Find Ticket</h3>
            <p className="text-sm text-gray-600">Search for existing bookings</p>
          </Link>
          
          <Link href="/branches" className="card hover:scale-105 transition-transform duration-300 text-center">
            <MapPinIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Our Branches</h3>
            <p className="text-sm text-gray-600">Find our office locations</p>
          </Link>
          
          <div className="card text-center">
            <UserIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Profile</h3>
            <p className="text-sm text-gray-600">Update your information</p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          
          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">Start your journey by booking your first trip</p>
              <Link href="/trips" className="btn-primary">
                Book Your First Trip
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.tripRoute}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <span className="font-medium">Reference:</span>
                          <span className="ml-1 font-mono">{booking.bookingReference}</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          <span>{new Date(booking.tripDate).toLocaleDateString()} at {booking.departureTime}</span>
                        </div>
                        <div className="flex items-center">
                          <TicketIcon className="w-4 h-4 mr-1" />
                          <span>Seats: {booking.selectedSeats.join(', ')}</span>
                        </div>
                        <div className="flex items-center">
                          <CreditCardIcon className="w-4 h-4 mr-1" />
                          <span>₦{booking.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Payment:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
                      <Link
                        href={`/find-ticket?ref=${booking.bookingReference}`}
                        className="btn-secondary text-center text-sm px-4 py-2"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/find-ticket?ref=${encodeURIComponent(booking.bookingReference)}#download`}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        Download Ticket
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <p className="text-gray-900">{user?.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Email:</span>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Phone:</span>
                <p className="text-gray-900">{user?.phone}</p>
              </div>
            </div>
            <button className="mt-4 btn-secondary">
              Edit Profile
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{bookings.length}</div>
                <div className="text-sm text-gray-600">Total Trips</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
