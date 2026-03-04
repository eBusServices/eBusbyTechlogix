'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon
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
  seatingLayout: Array<{
    seatNumber: number
    isOccupied: boolean
  }>
}

interface BookingData {
  tripId: string
  passengerName: string
  phone: string
  email: string
  kinName: string
  kinPhone: string
  bloodGroup: string
  seats: number
  selectedSeats: number[]
  totalAmount: number
}

export default function BookPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tripId = searchParams.get('tripId')
  
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [bookingData, setBookingData] = useState<BookingData>({
    tripId: tripId || '',
    passengerName: '',
    phone: '',
    email: '',
    kinName: '',
    kinPhone: '',
    bloodGroup: '',
    seats: 1,
    selectedSeats: [],
    totalAmount: 0
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (tripId) {
      fetchTrip()
    } else {
      setLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    if (trip) {
      setBookingData(prev => ({
        ...prev,
        totalAmount: selectedSeats.length * trip.price
      }))
    }
  }, [selectedSeats, trip])

  const fetchTrip = async () => {
    try {
      const response = await fetch(`/api/trips/${tripId}`)
      if (response.ok) {
        const data = await response.json()
        setTrip(data)
      }
    } catch (error) {
      console.error('Error fetching trip:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSeatClick = (seatNumber: number, isOccupied: boolean) => {
    if (isOccupied) return

    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber)
      } else {
        if (prev.length < bookingData.seats) {
          return [...prev, seatNumber]
        } else {
          // Replace the first selected seat with the new one
          return [...prev.slice(1), seatNumber]
        }
      }
    })
  }

  const handleInputChange = (field: keyof BookingData, value: string | number) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }))

    if (field === 'seats') {
      const numSeats = Number(value)
      if (selectedSeats.length > numSeats) {
        setSelectedSeats(prev => prev.slice(0, numSeats))
      }
    }
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return selectedSeats.length === bookingData.seats
      case 2:
        return bookingData.passengerName && 
               bookingData.phone && 
               bookingData.email &&
               bookingData.kinName &&
               bookingData.kinPhone &&
               bookingData.bloodGroup
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          selectedSeats
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        // Redirect to success page with booking reference
        router.push(`/booking-success?ref=${result.booking.bookingReference}`)
      } else {
        alert(result.error || 'Booking failed')
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    const hasTripId = Boolean(tripId)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {hasTripId ? 'Trip Not Found' : 'Select a Trip First'}
          </h2>
          <p className="text-gray-600 mb-6">
            {hasTripId
              ? 'The requested trip could not be found.'
              : 'Please choose a trip from the trips page before booking.'}
          </p>
          <button
            onClick={() => router.push('/trips')}
            className="btn-primary"
          >
            Browse Trips
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Your Trip</h1>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">
              {trip.from} → {trip.to}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>Date: {new Date(trip.date).toLocaleDateString()}</div>
              <div>Time: {trip.departureTime} - {trip.arrivalTime}</div>
              <div>Price: ₦{trip.price.toLocaleString()} per seat</div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Step 1: Seat Selection */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Your Seats</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of seats
                </label>
                <select
                  value={bookingData.seats}
                  onChange={(e) => handleInputChange('seats', Number(e.target.value))}
                  className="input-field max-w-xs"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} seat{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Seat Map */}
              <div className="bg-gray-100 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="inline-block bg-gray-800 text-white px-4 py-2 rounded">
                    Driver
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                  {trip.seatingLayout?.map((seat) => (
                    <button
                      key={seat.seatNumber}
                      onClick={() => handleSeatClick(seat.seatNumber, seat.isOccupied)}
                      disabled={seat.isOccupied}
                      className={`w-12 h-12 rounded text-sm font-semibold transition-all ${
                        seat.isOccupied
                          ? 'bg-red-200 text-red-800 cursor-not-allowed'
                          : selectedSeats.includes(seat.seatNumber)
                          ? 'bg-primary-600 text-white'
                          : 'bg-green-200 text-green-800 hover:bg-green-300'
                      }`}
                    >
                      {seat.seatNumber}
                    </button>
                  ))}
                </div>

                <div className="flex justify-center mt-6 space-x-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-primary-600 rounded mr-2"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
                    <span>Occupied</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">
                  Selected seats: {selectedSeats.join(', ') || 'None'}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  Total: ₦{(selectedSeats.length * trip.price).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Passenger Details */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Passenger Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={bookingData.passengerName}
                      onChange={(e) => handleInputChange('passengerName', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="input-field pl-10"
                      placeholder="+234 xxx xxx xxxx"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="input-field pl-10"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group *
                  </label>
                  <select
                    value={bookingData.bloodGroup}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next of Kin Name *
                  </label>
                  <input
                    type="text"
                    value={bookingData.kinName}
                    onChange={(e) => handleInputChange('kinName', e.target.value)}
                    className="input-field"
                    placeholder="Emergency contact name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next of Kin Phone *
                  </label>
                  <input
                    type="tel"
                    value={bookingData.kinPhone}
                    onChange={(e) => handleInputChange('kinPhone', e.target.value)}
                    className="input-field"
                    placeholder="+234 xxx xxx xxxx"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Booking Confirmation</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Route:</span> {trip.route}</div>
                  <div><span className="font-medium">Date:</span> {new Date(trip.date).toLocaleDateString()}</div>
                  <div><span className="font-medium">Time:</span> {trip.departureTime} - {trip.arrivalTime}</div>
                  <div><span className="font-medium">Vehicle:</span> {trip.vehicle}</div>
                  <div><span className="font-medium">Seats:</span> {selectedSeats.join(', ')}</div>
                  <div><span className="font-medium">Total Amount:</span> ₦{bookingData.totalAmount.toLocaleString()}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Passenger Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Name:</span> {bookingData.passengerName}</div>
                  <div><span className="font-medium">Phone:</span> {bookingData.phone}</div>
                  <div><span className="font-medium">Email:</span> {bookingData.email}</div>
                  <div><span className="font-medium">Blood Group:</span> {bookingData.bloodGroup}</div>
                  <div><span className="font-medium">Next of Kin:</span> {bookingData.kinName}</div>
                  <div><span className="font-medium">Emergency Contact:</span> {bookingData.kinPhone}</div>
                </div>
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                <p className="text-primary-800 text-sm">
                  <strong>Note:</strong> Your booking confirmation and ticket will be sent to your email address. 
                  Please ensure your email is correct. You can also download your ticket from your booking history.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className={`btn-secondary ${currentStep === 1 ? 'invisible' : ''}`}
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!validateStep(currentStep)}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="w-5 h-5" />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
