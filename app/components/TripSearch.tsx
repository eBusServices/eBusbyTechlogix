'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, MapPinIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'

export default function TripSearch() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: ''
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchData.from) params.set('from', searchData.from)
    if (searchData.to) params.set('to', searchData.to)
    if (searchData.date) params.set('date', searchData.date)
    
    router.push(`/trips?${params.toString()}`)
  }

  const popularRoutes = [
    { from: 'Makurdi', to: 'Abuja' },
    { from: 'Abuja', to: 'Makurdi' },
    { from: 'Makurdi', to: 'Lagos' },
    { from: 'Abuja', to: 'Lagos' },
  ]

  return (
    <section className="py-16 bg-white relative -mt-10 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Form */}
        <div className="card">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Find Your Perfect Trip
          </h2>
          
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* From */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={searchData.from}
                    onChange={(e) => setSearchData({...searchData, from: e.target.value})}
                    className="input-field pl-10"
                    required
                  >
                    <option value="">Select departure city</option>
                    <option value="Makurdi">Makurdi</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Kano">Kano</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                  </select>
                </div>
              </div>

              {/* To */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={searchData.to}
                    onChange={(e) => setSearchData({...searchData, to: e.target.value})}
                    className="input-field pl-10"
                    required
                  >
                    <option value="">Select destination city</option>
                    <option value="Makurdi">Makurdi</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Kano">Kano</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date
                </label>
                <div className="relative">
                  <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={searchData.date}
                    onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              <span>Search Trips</span>
            </button>
          </form>
        </div>

        {/* Popular Routes */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
            Popular Routes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularRoutes.map((route, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchData({
                    from: route.from,
                    to: route.to,
                    date: new Date().toISOString().split('T')[0]
                  })
                }}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left"
              >
                <div className="font-medium text-gray-800">
                  {route.from} → {route.to}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Click to select
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
