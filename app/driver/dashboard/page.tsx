'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TruckIcon, 
  ClockIcon, 
  MapPinIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Driver {
  id: string
  driverId: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  experience: string
  status: string
}

interface Trip {
  id: string
  route: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  date: string
  vehicle: string
  availableSeats: number
  totalSeats: number
  status: string
  passengers?: Array<{
    name: string
    phone: string
    seats: number[]
  }>
}

export default function DriverDashboardPage() {
  const router = useRouter()
  const [driver, setDriver] = useState<Driver | null>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('driverToken')
    const driverData = localStorage.getItem('driver')
    
    if (!token || !driverData) {
      router.push('/driver/login')
      return
    }

    const parsedDriver = JSON.parse(driverData)
    setDriver(parsedDriver)
    fetchDriverTrips(parsedDriver.id)
  }, [router])

  const fetchDriverTrips = async (driverId: string) => {
    try {
      const response = await fetch(`/api/trips?driverId=${driverId}`)
      const data = await response.json()
      
      // Mock additional data for demo
      const tripsWithPassengers = data.map((trip: Trip) => ({
        ...trip,
        passengers: [
          { name: 'John Doe', phone: '+234 801 234 5678', seats: [12, 13] },
          { name: 'Jane Smith', phone: '+234 802 345 6789', seats: [8] },
        ]
      }))
      
      setTrips(tripsWithPassengers)
    } catch (error) {
      console.error('Error fetching driver trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('driverToken')
    localStorage.removeItem('driver')
    router.push('/driver/login')
  }

  const updateTripStatus = async (tripId: string, status: string) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        setTrips(prev => prev.map(trip => 
          trip.id === tripId ? { ...trip, status } : trip
        ))
      }
    } catch (error) {
      console.error('Error updating trip status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-100'
      case 'in-progress':
        return 'text-yellow-600 bg-yellow-100'
      case 'completed':
        return 'text-green-600 bg-green-100'
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

  const todayTrips = trips.filter(trip => {
    const tripDate = new Date(trip.date).toDateString()
    const today = new Date().toDateString()
    return tripDate === today
  })

  const upcomingTrips = trips.filter(trip => {
    const tripDate = new Date(trip.date)
    const today = new Date()
    return tripDate > today
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Driver Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {driver?.name} ({driver?.driverId})
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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <TruckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{todayTrips.length}</h3>
                <p className="text-sm text-gray-600">Today's Trips</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {trips.filter(t => t.status === 'completed').length}
                </h3>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{upcomingTrips.length}</h3>
                <p className="text-sm text-gray-600">Upcoming</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {trips.reduce((acc, trip) => acc + (trip.totalSeats - trip.availableSeats), 0)}
                </h3>
                <p className="text-sm text-gray-600">Total Passengers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Trips */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Today's Trips</h2>
          </div>
          
          {todayTrips.length === 0 ? (
            <div className="p-12 text-center">
              <TruckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trips scheduled for today</h3>
              <p className="text-gray-600">Check back later or view upcoming trips below</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {todayTrips.map((trip) => (
                <div key={trip.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {trip.route}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
                          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-2" />
                          <span>{trip.departureTime} - {trip.arrivalTime}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-2" />
                          <span>{trip.from} → {trip.to}</span>
                        </div>
                        <div className="flex items-center">
                          <TruckIcon className="w-4 h-4 mr-2" />
                          <span>{trip.vehicle}</span>
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="w-4 h-4 mr-2" />
                          <span>{trip.totalSeats - trip.availableSeats}/{trip.totalSeats} passengers</span>
                        </div>
                      </div>

                      {trip.passengers && trip.passengers.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Passengers:</h4>
                          <div className="space-y-2">
                            {trip.passengers.map((passenger, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span>{passenger.name}</span>
                                <span className="text-gray-600">
                                  Seats: {passenger.seats.join(', ')} | {passenger.phone}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col gap-2">
                      {trip.status === 'scheduled' && (
                        <button
                          onClick={() => updateTripStatus(trip.id, 'in-progress')}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          Start Trip
                        </button>
                      )}
                      {trip.status === 'in-progress' && (
                        <button
                          onClick={() => updateTripStatus(trip.id, 'completed')}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          Complete Trip
                        </button>
                      )}
                      <button className="btn-secondary text-sm px-4 py-2">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Trips */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Trips</h2>
          </div>
          
          {upcomingTrips.length === 0 ? (
            <div className="p-12 text-center">
              <ClockIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming trips</h3>
              <p className="text-gray-600">New trips will appear here when assigned</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {upcomingTrips.map((trip) => (
                <div key={trip.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {trip.route}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
                          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="font-medium">Date:</span>
                          <span className="ml-1">{new Date(trip.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-2" />
                          <span>{trip.departureTime} - {trip.arrivalTime}</span>
                        </div>
                        <div className="flex items-center">
                          <TruckIcon className="w-4 h-4 mr-2" />
                          <span>{trip.vehicle}</span>
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="w-4 h-4 mr-2" />
                          <span>{trip.totalSeats - trip.availableSeats}/{trip.totalSeats} passengers</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <button className="btn-secondary text-sm px-4 py-2">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Driver Information */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Driver ID:</span>
                <p className="text-gray-900 font-mono">{driver?.driverId}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <p className="text-gray-900">{driver?.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Phone:</span>
                <p className="text-gray-900">{driver?.phone}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">License Number:</span>
                <p className="text-gray-900 font-mono">{driver?.licenseNumber}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Experience:</span>
                <p className="text-gray-900">{driver?.experience}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver?.status || 'active')}`}>
                  {driver?.status?.charAt(0).toUpperCase()}{driver?.status?.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
