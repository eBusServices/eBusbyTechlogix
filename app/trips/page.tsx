'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

interface Trip {
  id: string
  route: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  price: number
  availableSeats: number
  totalSeats: number
  date: string
  vehicle: string
  status: string
}

export default function TripsPage() {
  const searchParams = useSearchParams()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchTrips()
  }, [filters])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.from) params.set('from', filters.from)
      if (filters.to) params.set('to', filters.to)
      if (filters.date) params.set('date', filters.date)

      const response = await fetch(`/api/trips?${params.toString()}`)
      const data = await response.json()
      setTrips(data)
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ from: '', to: '', date: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Available Trips
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find and book your perfect trip from our available routes
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Filter Trips
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 text-primary-600"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filters.from}
                    onChange={(e) => handleFilterChange('from', e.target.value)}
                    className="input-field pl-10"
                  >
                    <option value="">All cities</option>
                    <option value="Makurdi">Makurdi</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Kano">Kano</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                  </select>
                </div>
              </div>

              {/* To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filters.to}
                    onChange={(e) => handleFilterChange('to', e.target.value)}
                    className="input-field pl-10"
                  >
                    <option value="">All cities</option>
                    <option value="Makurdi">Makurdi</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Kano">Kano</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date
                </label>
                <div className="relative">
                  <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col justify-end space-y-2">
                <button
                  onClick={fetchTrips}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>Search</span>
                </button>
                <button
                  onClick={clearFilters}
                  className="btn-secondary text-center"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MagnifyingGlassIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No trips found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or check back later for new trips.
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="card group hover:scale-105 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {trip.from} → {trip.to}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span>{trip.route}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      ₦{trip.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">per seat</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {trip.departureTime} - {trip.arrivalTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Available Seats:</span>
                    <span className={`text-sm font-medium ${
                      trip.availableSeats < 5 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {trip.availableSeats} / {trip.totalSeats}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vehicle:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {trip.vehicle}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(trip.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/book?tripId=${trip.id}`}
                  className={`w-full text-center block py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    trip.availableSeats > 0
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {trip.availableSeats > 0 ? 'Book This Trip' : 'Fully Booked'}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
