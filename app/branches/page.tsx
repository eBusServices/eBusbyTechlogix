'use client'

import { useState, useEffect } from 'react'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline'

interface Branch {
  id: string
  name: string
  address: string
  phones: string[]
  emails: string[]
  coordinates: {
    lat: number
    lng: number
  }
  mapUrl: string
  workingHours: {
    weekdays: string
    weekends: string
  }
  services: string[]
  manager: string
  isHeadquarters: boolean
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches')
      const data = await response.json()
      setBranches(data)
    } catch (error) {
      console.error('Error fetching branches:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-64 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Branch Offices
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visit our convenient locations across Nigeria for ticket purchases, 
            customer service, and travel information.
          </p>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Branch Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <BuildingOfficeIcon className="w-6 h-6 mr-2 text-primary-600" />
                    {branch.name}
                  </h2>
                  {branch.isHeadquarters && (
                    <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded-full">
                      Headquarters
                    </span>
                  )}
                </div>

                {/* Address */}
                <div className="flex items-start mb-4">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">{branch.address}</p>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center">
                      <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700 font-medium">Contacts</span>
                    </div>
                    <div className="ml-8 mt-1 space-y-1">
                      {branch.phones.map((phone, index) => (
                        <a
                          key={index}
                          href={`tel:${phone}`}
                          className="block text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700 font-medium">Emails</span>
                    </div>
                    <div className="ml-8 mt-1 space-y-1">
                      {branch.emails.map((email, index) => (
                        <a
                          key={index}
                          href={`mailto:${email}`}
                          className="block text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {email}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <ClockIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-700">Working Hours</span>
                  </div>
                  <div className="ml-8 text-sm text-gray-600">
                    <div>Weekdays: {branch.workingHours.weekdays}</div>
                    <div>Weekends: {branch.workingHours.weekends}</div>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Available Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {branch.services.map((service, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Manager */}
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Branch Manager:</span> {branch.manager}
                </div>
              </div>

              {/* Map */}
              <div className="h-64 bg-gray-200">
                <iframe
                  src={branch.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title={`Map of ${branch.name}`}
                />
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-4 bg-gray-50 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://www.google.com/maps?q=${branch.coordinates.lat},${branch.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn-primary text-center"
                >
                  Get Directions
                </a>
                <a
                  href={`tel:${branch.phones[0]}`}
                  className="flex-1 btn-secondary text-center"
                >
                  Call Branch
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Finding Us?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our friendly staff at any of our branches will be happy to assist you with 
            bookings, travel information, and any questions you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+2348107338827" className="btn-primary">
              📞 Call Customer Service
            </a>
            <a href="mailto:support@techlogix.com" className="btn-secondary">
              ✉️ Send us an Email
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
