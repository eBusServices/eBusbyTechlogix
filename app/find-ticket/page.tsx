'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'
import { 
  MagnifyingGlassIcon, 
  TicketIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

interface BookingDetails {
  id: string
  bookingReference: string
  passengerName: string
  phone: string
  email: string
  tripId: string
  tripRoute: string
  tripFrom: string
  tripTo: string
  tripDate: string
  departureTime: string
  arrivalTime: string
  selectedSeats: number[]
  totalAmount: number
  status: string
  paymentStatus: string
  bookingDate: string
}

export default function FindTicketPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      setSearchTerm(ref)
      void fetchBookingByReference(ref)
    }
  }, [searchParams])

  const fetchBookingByReference = async (reference: string) => {
    setLoading(true)
    setError('')
    setBooking(null)

    try {
      const response = await fetch(`/api/bookings?bookingReference=${encodeURIComponent(reference)}`)
      const data = await response.json()

      if (response.ok && Array.isArray(data) && data.length > 0) {
        setBooking(data[0])
        if (window.location.hash === '#download') {
          setTimeout(() => {
            void downloadTicket(data[0])
          }, 100)
        }
      } else {
        setError('Booking not found. Please check your booking reference and try again.')
      }
    } catch (error) {
      console.error('Error searching for booking:', error)
      setError('An error occurred while searching. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    await fetchBookingByReference(searchTerm)
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

  const downloadTicket = async (bookingData: BookingDetails | null = booking) => {
    if (!bookingData) return

    const doc = new jsPDF({ unit: 'pt', format: 'a4' })

    const mm = (n: number) => n * 2.83465
    const drawCurrencyN = (x: number, y: number) => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text('N', x, y)
    }
    const drawLabelValue = (
      y: number,
      label: string,
      value: string,
      opts: { labelX?: number; valueX?: number } = {}
    ) => {
      const { labelX = mm(20), valueX = mm(60) } = opts
      doc.setFont('courier', 'bold')
      doc.text(label, labelX, y)
      doc.setFont('helvetica', 'normal')
      doc.text(value || '-', valueX, y)
    }

    let headerY = mm(18)
    try {
      const loadBanner = async (url: string) => {
        return fetch(url).then(r => {
          if (!r.ok) throw new Error('not found')
          return r.blob()
        })
      }
      let bannerBlob: Blob
      try {
        bannerBlob = await loadBanner('/images/ticket-header.png')
      } catch {
        bannerBlob = await loadBanner('/images/ticket-header.jpg')
      }
      const bannerData = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(bannerBlob)
      })
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = mm(8)
      const bannerX = margin
      const bannerW = pageWidth - margin * 2
      const bannerH = mm(26)
      doc.setFillColor(255, 255, 255)
      doc.rect(0, 0, pageWidth, mm(6), 'F')
      doc.addImage(bannerData, 'PNG', bannerX, mm(8), bannerW, bannerH)
      doc.rect(0, mm(8) + bannerH, pageWidth, mm(5), 'F')
      headerY = mm(8) + bannerH + mm(9)
    } catch {
      try {
        const logoUrl = '/images/logo.jpg'
        const imgData = await fetch(logoUrl)
          .then(r => r.blob())
          .then(
            b =>
              new Promise<string>((resolve) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result as string)
                reader.readAsDataURL(b)
              })
          )
        doc.addImage(imgData, 'JPEG', mm(20), mm(12), mm(28), mm(28))
        headerY = mm(52)
      } catch {}
    }

    doc.setFont('courier', 'bold')
    doc.setFontSize(20)
    doc.text('Passenger', mm(20), headerY)
    doc.text('Ticket', mm(20), headerY + mm(7))

    try {
      const brandUrl = '/images/ebus-services.png'
      const brandData = await fetch(brandUrl)
        .then(r => (r.ok ? r.blob() : Promise.reject()))
        .then(
          b =>
            new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.readAsDataURL(b)
            })
        )
      const brandW = mm(45)
      const brandH = mm(14)
      doc.addImage(brandData, 'PNG', mm(95), headerY - mm(6), brandW, brandH)
    } catch {}

    doc.setFontSize(13)
    doc.setFont('courier', 'bold')
    doc.text('Date:', mm(155), headerY)
    doc.setFont('courier', 'normal')
    const todayStr = new Date().toLocaleDateString()
    doc.text(todayStr, mm(170), headerY)

    doc.setFont('courier', 'bold')
    doc.setFontSize(8.5)
    doc.text('OR VISIT:', mm(155), headerY + mm(10))
    doc.setFont('courier', 'normal')
    doc.text('www.techlogix.ng', mm(155), headerY + mm(15))
    doc.text('info@techlogix.ng', mm(155), headerY + mm(20))

    doc.setDrawColor(200)
    doc.line(mm(15), headerY + mm(12), mm(195), headerY + mm(12))

    doc.setFontSize(9)
    doc.setFont('courier', 'bold')
    doc.text('Departure Point:', mm(20), headerY + mm(24))
    doc.text('Destination:', mm(120), headerY + mm(24))
    doc.setFont('courier', 'normal')
    doc.text(bookingData.tripFrom || '-', mm(20), headerY + mm(30))
    doc.text(bookingData.tripTo || '-', mm(120), headerY + mm(30))

    const departureLines = [
      'TMT Plaza, Wurukum, Makurdi',
      '(Before Salvation Ministries',
      'Church, formerly AfriBank)'
    ]
    const destinationLines = [
      '107B Nnamdi Azikiwe Express',
      'Way, Area 3 Junction,',
      'Garki, FCT-Abuja'
    ]
    let locY = headerY + mm(36)
    departureLines.forEach(line => {
      doc.text(line, mm(20), locY)
      locY += mm(6)
    })
    let destY = headerY + mm(36)
    destinationLines.forEach(line => {
      doc.text(line, mm(120), destY)
      destY += mm(6)
    })

    let y = headerY + mm(70)
    doc.setFontSize(11)
    drawLabelValue(y, 'Name:', bookingData.passengerName)
    y += mm(8)
    drawLabelValue(y, 'Phone:', bookingData.phone)
    y += mm(8)
    drawLabelValue(
      y,
      'Date of Trip:',
      new Date(bookingData.tripDate).toLocaleDateString()
    )
    y += mm(8)
    doc.setFont('courier', 'bold')
    const timeLabel = 'Time of Departure:'
    doc.text(timeLabel, mm(20), y)
    const labelWidth = doc.getTextWidth(timeLabel)
    doc.setFont('helvetica', 'normal')
    const timeValueX = mm(20) + labelWidth + mm(6)
    doc.text(bookingData.departureTime || '-', timeValueX, y)
    y += mm(8)
    drawLabelValue(
      y,
      'Seat Number:',
      (bookingData.selectedSeats || []).join(', ')
    )
    y += mm(16)

    doc.setDrawColor(0)
    doc.setLineWidth(0.9)
    doc.line(mm(20), y, mm(110), y)
    y += mm(6)
    doc.setFont('courier', 'bold')
    doc.text('Amount paid', mm(20), y)
    const amountX = mm(60)
    drawCurrencyN(amountX, y)
    doc.setFont('helvetica', 'normal')
    doc.text(`${Number(bookingData.totalAmount || 0).toLocaleString()}`, amountX + mm(3.5), y)

    try {
      const qr = await QRCode.toDataURL(
        `REF:${bookingData.bookingReference}\nName:${bookingData.passengerName}\nTrip:${bookingData.tripFrom}→${bookingData.tripTo}\nDate:${bookingData.tripDate}\nTime:${bookingData.departureTime}\nSeats:${(bookingData.selectedSeats || []).join(', ')}`,
        { margin: 1, width: 110 }
      )
      const qrX = mm(150)
      const qrY = mm(108)
      const qrW = mm(40)
      const qrH = mm(40)
      doc.setFillColor(255, 255, 255)
      doc.rect(qrX - mm(2), qrY - mm(2), qrW + mm(4), qrH + mm(4), 'F')
      doc.addImage(qr, 'PNG', qrX, qrY, qrW, qrH)
    } catch {}

    const baseY = mm(186)
    doc.setFontSize(9)
    doc.setFont('courier', 'bold')
    doc.text('Note:', mm(20), baseY)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    const noteStartX = mm(36)
    const noteY = baseY
    const notePrefix = 'Rescheduling of trips attracts a fee of '
    doc.text(notePrefix, noteStartX, noteY)
    const prefixWidth = doc.getTextWidth(notePrefix)
    const nairaX = noteStartX + prefixWidth + mm(1)
    drawCurrencyN(nairaX, noteY)
    doc.setFont('helvetica', 'normal')
    doc.text('5,000.', nairaX + mm(3.5), noteY)

    const infoY = baseY + mm(8)
    doc.setFontSize(8.5)
    doc.text('Thank you for choosing e-Bus Services by Techlogix Solutions Ltd', mm(20), infoY)
    const contactY = infoY + mm(12)
    doc.text('Email: info@techlogix.ng', mm(20), contactY)
    doc.text('Contact us: 09023506944, 08107338827', mm(115), contactY)

    doc.setFont('courier', 'bold')
    doc.setFontSize(10)
    doc.text(`Booking Ref: ${bookingData.bookingReference}`, mm(20), mm(220))

    doc.save(`Ticket_${bookingData.bookingReference}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Ticket
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your booking reference to view your ticket details and travel information
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Booking Reference
            </label>
            <div className="flex">
              <div className="relative flex-1">
                <TicketIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                  className="input-field pl-10 pr-4"
                  placeholder="Enter booking reference (e.g., TL123456)"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="ml-3 btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <MagnifyingGlassIcon className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Booking Details */}
        {booking && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-primary-600 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Booking Details</h2>
                  <p className="text-primary-100">Reference: {booking.bookingReference}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Trip Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Trip Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">{booking.tripRoute}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(booking.tripDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Departure:</span>
                      <span className="font-medium">{booking.departureTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Arrival:</span>
                      <span className="font-medium">{booking.arrivalTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seats:</span>
                      <span className="font-medium">{booking.selectedSeats.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium text-primary-600">₦{booking.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <UserIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Passenger Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{booking.passengerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{booking.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{booking.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Date:</span>
                      <span className="font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`font-medium px-2 py-1 rounded text-sm ${getStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  Important Travel Information
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Arrive at the departure terminal 30 minutes before scheduled departure</li>
                  <li>• Bring a valid government-issued ID for verification</li>
                  <li>• Keep this booking reference for easy check-in</li>
                  <li>• Contact customer service for any changes or inquiries</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    void downloadTicket()
                  }}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Ticket</span>
                </button>
                <button className="btn-secondary">
                  Print Ticket
                </button>
                <a href="mailto:support@techlogix.com" className="btn-secondary text-center">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!booking && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Can't find your booking reference?</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Your booking reference was sent to your email when you completed your booking. 
                  Check your email inbox and spam folder for the confirmation email.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Still having trouble?</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Contact our customer service team and they'll help you locate your booking using 
                  your phone number or email address.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <a href="tel:+2348107338827" className="btn-primary text-center">
                📞 Call Support
              </a>
              <a href="mailto:support@techlogix.com" className="btn-secondary text-center">
                ✉️ Email Support
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
