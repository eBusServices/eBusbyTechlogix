import jsPDF from 'jspdf'
import QRCode from 'qrcode'

export interface TicketBookingDetails {
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

const CITY_ADDRESS_LINES: Record<string, string[]> = {
  makurdi: [
    'TMT Plaza, Wurukum, Makurdi',
    '(Before Salvation Ministries',
    'Church, formerly AfriBank)'
  ],
  abuja: [
    'Area 3, Trinity Garden,',
    'Nnamdi Azikiwe Expy Junction,',
    'Abuja, FCT'
  ],
  'port harcourt': [
    'e-Bus Terminal, Port Harcourt',
    'Rivers State',
    'Nigeria'
  ],
  lagos: [
    'e-Bus Terminal, Lagos',
    'Lagos State',
    'Nigeria'
  ],
  kano: [
    'e-Bus Terminal, Kano',
    'Kano State',
    'Nigeria'
  ]
}

function getCityAddressLines(cityName?: string): string[] {
  if (!cityName) {
    return ['Address unavailable']
  }

  const key = cityName.trim().toLowerCase()
  return CITY_ADDRESS_LINES[key] || [`e-Bus Terminal, ${cityName}`, 'Nigeria']
}

export function normalizeTicketBooking(raw: any): TicketBookingDetails {
  const tripRoute = raw.tripRoute || raw.trip_route || raw.route || ''
  const routeParts = typeof tripRoute === 'string' ? tripRoute.split(/\s+to\s+/i) : []
  const tripFrom = raw.tripFrom || raw.trip_from || raw.from || routeParts[0] || ''
  const tripTo = raw.tripTo || raw.trip_to || raw.to || routeParts[1] || ''

  return {
    id: raw.id || '',
    bookingReference: raw.bookingReference || raw.booking_reference || '',
    passengerName: raw.passengerName || raw.passenger_name || '',
    phone: raw.phone || '',
    email: raw.email || '',
    tripId: raw.tripId || raw.trip_id || '',
    tripRoute,
    tripFrom,
    tripTo,
    tripDate: raw.tripDate || raw.trip_date || '',
    departureTime: raw.departureTime || raw.departure_time || '',
    arrivalTime: raw.arrivalTime || raw.arrival_time || '',
    selectedSeats: raw.selectedSeats || raw.selected_seats || [],
    totalAmount: Number(raw.totalAmount ?? raw.total_amount ?? 0),
    status: raw.status || 'confirmed',
    paymentStatus: raw.paymentStatus || raw.payment_status || 'pending',
    bookingDate: raw.bookingDate || raw.booking_date || raw.created_at || '',
  }
}

async function buildTicketPdf(bookingData: TicketBookingDetails): Promise<jsPDF> {
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

  const departureLines = getCityAddressLines(bookingData.tripFrom)
  const destinationLines = getCityAddressLines(bookingData.tripTo)
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
    bookingData.tripDate ? new Date(bookingData.tripDate).toLocaleDateString() : '-'
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
  drawLabelValue(y, 'Seat Number:', (bookingData.selectedSeats || []).join(', '))
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

  return doc
}

export async function downloadStructuredTicket(bookingData: TicketBookingDetails): Promise<void> {
  const doc = await buildTicketPdf(bookingData)
  doc.save(`Ticket_${bookingData.bookingReference}.pdf`)
}

export async function printStructuredTicket(bookingData: TicketBookingDetails): Promise<void> {
  const doc = await buildTicketPdf(bookingData)
  const blob = doc.output('blob')
  const blobUrl = URL.createObjectURL(blob)
  const printWindow = window.open(blobUrl, '_blank')
  if (!printWindow) {
    return
  }

  const triggerPrint = () => {
    printWindow.focus()
    printWindow.print()
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl)
    }, 2000)
  }

  const timer = setInterval(() => {
    if (printWindow.document?.readyState === 'complete') {
      clearInterval(timer)
      triggerPrint()
    }
  }, 300)

  setTimeout(() => {
    clearInterval(timer)
    triggerPrint()
  }, 2000)
}
