'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon, DocumentArrowDownIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import {
  downloadStructuredTicket,
  normalizeTicketBooking,
  printStructuredTicket,
} from '../lib/ticketPdf'
import ReviewForm from '../components/ReviewForm'

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const bookingRef = searchParams.get('ref')
  const [downloading, setDownloading] = useState(false)

  const getBookingForReference = async () => {
    const response = await fetch(`/api/bookings?bookingReference=${encodeURIComponent(bookingRef || '')}`)
    const data = await response.json()

    if (response.ok && Array.isArray(data) && data.length > 0) {
      return normalizeTicketBooking(data[0])
    }

    return normalizeTicketBooking({
      bookingReference: bookingRef || 'TL000000',
      status: 'confirmed',
      paymentStatus: 'pending',
    })
  }

  const handleDownloadTicket = async () => {
    try {
      setDownloading(true)
      const booking = await getBookingForReference()
      await downloadStructuredTicket(booking)
    } catch (error) {
      console.error('Download ticket error:', error)
      alert('Unable to download ticket right now. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const handlePrintTicket = async () => {
    try {
      const booking = await getBookingForReference()
      await printStructuredTicket(booking)
    } catch (error) {
      console.error('Print ticket error:', error)
      alert('Unable to print ticket right now. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>
          
          <p className="text-base sm:text-xl text-gray-600 mb-8">
            Your trip has been successfully booked. Your booking reference is:
          </p>

          {/* Booking Reference */}
          <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 mb-8">
            <div className="text-sm text-primary-600 font-medium mb-2">
              Booking Reference
            </div>
            <div className="text-3xl font-bold text-primary-800 tracking-wider">
              {bookingRef || 'TL000000'}
            </div>
            <div className="text-sm text-primary-600 mt-2">
              Keep this reference for your records
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-left bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <EnvelopeIcon className="h-5 w-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
                <span>A confirmation email with your ticket details has been sent to your email address</span>
              </li>
              <li className="flex items-start">
                <DocumentArrowDownIcon className="h-5 w-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
                <span>You can download your ticket PDF from your booking history or the email</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
                <span>Arrive at the departure terminal 30 minutes before your scheduled departure time</span>
              </li>
            </ul>
          </div>

          {/* Important Information */}
          <div className="text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <h4 className="font-semibold text-yellow-800 mb-2">Important Information:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Please bring a valid ID for verification</li>
              <li>• Arrive 30 minutes before departure</li>
              <li>• Keep your booking reference handy</li>
              <li>• Contact us if you need to make changes</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/find-ticket?ref=${encodeURIComponent(bookingRef || '')}`} className="btn-primary">
              View Booking Details
            </Link>
            <button
              onClick={() => {
                void handleDownloadTicket()
              }}
              disabled={downloading}
              className="btn-secondary disabled:opacity-50"
            >
              {downloading ? 'Preparing Ticket...' : 'Download Ticket'}
            </button>
            <button
              onClick={() => {
                void handlePrintTicket()
              }}
              className="btn-secondary"
            >
              Print Ticket
            </button>
            <Link href="/trips" className="btn-secondary">
              Book Another Trip
            </Link>
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>

          {/* Contact Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-4">
              Need help? Contact our customer service:
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 text-sm">
              <a href="tel:+2348107338827" className="text-primary-600 hover:text-primary-700">
                📞 +234 810 733 8827
              </a>
              <a href="mailto:support@techlogix.com" className="text-primary-600 hover:text-primary-700">
                ✉️ support@techlogix.com
              </a>
            </div>
          </div>
        </div>

        {/* Review Form Section */}
        <div className="mt-12">
          <ReviewForm bookingReference={bookingRef || 'TL000000'} />
        </div>
      </div>
    </div>
  )
}
