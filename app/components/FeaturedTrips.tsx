'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ClockIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

interface Trip {
  id: string
  route: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  price: number
  availableSeats: number
  date: string
}

export default function FeaturedTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const { apiRequest, config } = await import('../lib/config')
      const data = await apiRequest(`${config.endpoints.trips}?featured=true`)
      setTrips(data)
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Trips
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Trips
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Popular routes with the best prices and comfortable seating. 
            Book now for your next journey.
          </p>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-8">No trips available at the moment.</p>
            <Link href="/trips" className="btn-primary">
              View All Trips
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.slice(0, 6).map((trip) => (
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
                        {trip.availableSeats} seats
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
                    className="w-full btn-primary text-center block group-hover:bg-primary-700 transition-colors duration-300"
                  >
                    Book This Trip
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/trips" className="btn-secondary">
                View All Available Trips
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
