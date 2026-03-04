import { NextRequest, NextResponse } from 'next/server'

// Mock database for branches
const branches = [
  {
    id: '1',
    name: 'Makurdi Branch',
    address: 'TMT Plaza, Iyorchia Ayu Road, Makurdi, Benue State, Nigeria',
    phones: ['+234 902 350 6944'],
    emails: ['info@techlogix.ng', 'admin@techlogix.ng'],
    coordinates: {
      lat: 7.733490792282525,
      lng: 8.512205174126747
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3931.4876766315086!2d8.512205174126747!3d7.733490792282525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104ddad310f8d87d%3A0xc327c4b49760b44a!2sTMT%20Plaza!5e0!3m2!1sen!2sng!4v1690460000000!5m2!1sen!2sng',
    workingHours: {
      weekdays: '6:00 AM - 8:00 PM',
      weekends: '7:00 AM - 7:00 PM'
    },
    services: ['Ticket Sales', 'Customer Service', 'Baggage Storage', 'Waiting Area'],
    manager: 'John Doe',
    isHeadquarters: true
  },
  {
    id: '2',
    name: 'Abuja Branch',
    address: 'Area 3, Trinity Garden, Nnamdi Azikiwe Expy, Junction, Abuja 900108, Federal Capital Territory',
    phones: ['+234 805 822 2919', '+234 810 733 8827'],
    emails: ['info@techlogix.ng', 'admin@techlogix.ng'],
    coordinates: {
      lat: 9.058456990976454,
      lng: 7.447042374122098
    },
    mapUrl: 'https://www.google.com/maps?q=Area+3,+Trinity+Garden,+Nnamdi+Azikiwe+Expy,+Junction,+Abuja+900108,+Federal+Capital+Territory&output=embed',
    workingHours: {
      weekdays: '6:00 AM - 9:00 PM',
      weekends: '7:00 AM - 8:00 PM'
    },
    services: ['Ticket Sales', 'Customer Service', 'VIP Lounge', 'Refreshments'],
    manager: 'Jane Smith',
    isHeadquarters: false
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const branch = branches.find(b => b.id === id)
      if (!branch) {
        return NextResponse.json(
          { error: 'Branch not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(branch)
    }

    return NextResponse.json(branches)
  } catch (error) {
    console.error('Error fetching branches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newBranch = {
      id: String(branches.length + 1),
      ...body,
      isHeadquarters: false
    }

    branches.push(newBranch)
    return NextResponse.json(newBranch, { status: 201 })
  } catch (error) {
    console.error('Error creating branch:', error)
    return NextResponse.json(
      { error: 'Failed to create branch' },
      { status: 500 }
    )
  }
}
