'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  UsersIcon,
  TruckIcon,
  TicketIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
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

interface Booking {
  id: string
  bookingReference: string
  passengerName: string
  phone: string
  tripId: string
  selectedSeats: number[]
  totalAmount: number
  status: string
  bookingDate: string
}

interface Fleet {
  id: string
  name: string
  vehicle_type: string
  total_seats: number
  registration_number: string
  status: string
}

interface Route {
  id: string
  name: string
  from_location: string
  to_location: string
  price: number
  distance?: string
  estimated_duration?: string
  status: string
}

interface AdminStats {
  totalUsers: number
  totalTrips: number
  totalBookings: number
  totalRevenue: number
  todayBookings: number
  activeTrips: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTrips: 0,
    totalBookings: 0,
    totalRevenue: 0,
    todayBookings: 0,
    activeTrips: 0,
  })

  const [trips, setTrips] = useState<Trip[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [fleets, setFleets] = useState<Fleet[]>([])
  const [routes, setRoutes] = useState<Route[]>([])

  const [loading, setLoading] = useState(true)
  const [showTripModal, setShowTripModal] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)

  const [showFleetForm, setShowFleetForm] = useState(false)
  const [showRouteForm, setShowRouteForm] = useState(false)
  const [editingFleetId, setEditingFleetId] = useState<string | null>(null)
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [fleetFormData, setFleetFormData] = useState({
    name: '',
    vehicle_type: '',
    total_seats: 7,
    registration_number: '',
    status: 'active',
  })

  const [routeFormData, setRouteFormData] = useState({
    name: '',
    from_location: '',
    to_location: '',
    price: 0,
    distance: '',
    estimated_duration: '',
    status: 'active',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/auth/login')
      return
    }

    let user: any = null
    try {
      user = JSON.parse(userData)
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/auth/login')
      return
    }

    if (user.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    setAdmin(user)
    fetchDashboardData()
  }, [router])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message })
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  const fetchDashboardData = async () => {
    try {
      const [tripsRes, bookingsRes, fleetsRes, routesRes] = await Promise.all([
        fetch('/api/trips'),
        fetch('/api/bookings'),
        fetch('/api/fleets'),
        fetch('/api/routes'),
      ])

      const tripsDataRaw = await tripsRes.json()
      const bookingsDataRaw = await bookingsRes.json()
      const fleetsDataRaw = await fleetsRes.json()
      const routesDataRaw = await routesRes.json()

      const tripsData = Array.isArray(tripsDataRaw) ? tripsDataRaw : []
      const bookingsData = Array.isArray(bookingsDataRaw) ? bookingsDataRaw : []
      const fleetsData = Array.isArray(fleetsDataRaw) ? fleetsDataRaw : []
      const routesData = Array.isArray(routesDataRaw) ? routesDataRaw : []

      setTrips(tripsData)
      setBookings(bookingsData)
      setFleets(fleetsData)
      setRoutes(routesData)

      const today = new Date().toISOString().split('T')[0]
      const todayBookings = bookingsData.filter(
        (booking: Booking) => String(booking?.bookingDate || '').split('T')[0] === today
      ).length

      const totalRevenue = bookingsData.reduce(
        (sum: number, booking: Booking) => sum + (Number(booking?.totalAmount) || 0),
        0
      )

      const activeTrips = tripsData.filter(
        (trip: Trip) =>
          String(trip?.status || '').toLowerCase() === 'scheduled' ||
          String(trip?.status || '').toLowerCase() === 'in-progress'
      ).length

      setStats({
        totalUsers: 25,
        totalTrips: tripsData.length,
        totalBookings: bookingsData.length,
        totalRevenue,
        todayBookings,
        activeTrips,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTrip = async (tripData: Partial<Trip>) => {
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        alert(errorData.error || 'Failed to create trip')
        return
      }

      const data = await response.json()
      const newTrip = data?.trip ?? data
      setTrips((prev) => [...prev, newTrip])
      setShowTripModal(false)
      setEditingTrip(null)
      fetchDashboardData()
    } catch (error) {
      console.error('Error creating trip:', error)
      alert('Failed to create trip')
    }
  }

  const handleUpdateTrip = async (tripId: string, updates: Partial<Trip>) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        alert(errorData.error || 'Failed to update trip')
        return
      }

      const updatedTrip = await response.json()
      setTrips((prev) => prev.map((trip) => (trip.id === tripId ? updatedTrip : trip)))
      setShowTripModal(false)
      setEditingTrip(null)
      fetchDashboardData()
    } catch (error) {
      console.error('Error updating trip:', error)
      alert('Failed to update trip')
    }
  }

  const handleSaveFleet = async () => {
    if (!fleetFormData.name || !fleetFormData.vehicle_type || !fleetFormData.total_seats) {
      showToast('Please fill in all required fleet fields', 'error')
      return
    }

    try {
      const isEditingFleet = Boolean(editingFleetId)
      const response = await fetch(editingFleetId ? `/api/fleets/${editingFleetId}` : '/api/fleets', {
        method: editingFleetId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fleetFormData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        showToast(errorData.error || `Failed to ${isEditingFleet ? 'update' : 'create'} fleet`, 'error')
        return
      }

      const savedFleet = await response.json()
      setFleets((prev) =>
        editingFleetId
          ? prev.map((fleet) => (fleet.id === editingFleetId ? savedFleet : fleet))
          : [...prev, savedFleet]
      )
      setFleetFormData({
        name: '',
        vehicle_type: '',
        total_seats: 7,
        registration_number: '',
        status: 'active',
      })
      setShowFleetForm(false)
      setEditingFleetId(null)
      showToast(`Fleet ${isEditingFleet ? 'updated' : 'created'} successfully`)
    } catch (error) {
      console.error('Error saving fleet:', error)
      showToast(`Failed to ${editingFleetId ? 'update' : 'create'} fleet`, 'error')
    }
  }

  const handleEditFleet = (fleet: Fleet) => {
    setFleetFormData({
      name: fleet.name,
      vehicle_type: fleet.vehicle_type,
      total_seats: Math.max(1, Number(fleet.total_seats) || 1),
      registration_number: fleet.registration_number || '',
      status: fleet.status || 'active',
    })
    setEditingFleetId(fleet.id)
    setShowFleetForm(true)
  }

  const handleDeleteFleet = async (fleetId: string) => {
    if (!confirm('Delete this fleet?')) {
      return
    }

    try {
      const response = await fetch(`/api/fleets/${fleetId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        showToast(errorData.error || 'Failed to delete fleet', 'error')
        return
      }

      setFleets((prev) => prev.filter((fleet) => fleet.id !== fleetId))
      if (editingFleetId === fleetId) {
        setEditingFleetId(null)
        setShowFleetForm(false)
      }
      showToast('Fleet deleted successfully')
    } catch (error) {
      console.error('Error deleting fleet:', error)
      showToast('Failed to delete fleet', 'error')
    }
  }

  const handleSaveRoute = async () => {
    if (
      !routeFormData.name ||
      !routeFormData.from_location ||
      !routeFormData.to_location ||
      routeFormData.price <= 0
    ) {
      showToast('Please fill in all required route fields and enter a valid price', 'error')
      return
    }

    try {
      const isEditingRoute = Boolean(editingRouteId)
      const response = await fetch(editingRouteId ? `/api/routes/${editingRouteId}` : '/api/routes', {
        method: editingRouteId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routeFormData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        showToast(errorData.error || `Failed to ${isEditingRoute ? 'update' : 'create'} route`, 'error')
        return
      }

      const savedRoute = await response.json()
      setRoutes((prev) =>
        editingRouteId
          ? prev.map((route) => (route.id === editingRouteId ? savedRoute : route))
          : [...prev, savedRoute]
      )
      setRouteFormData({
        name: '',
        from_location: '',
        to_location: '',
        price: 0,
        distance: '',
        estimated_duration: '',
        status: 'active',
      })
      setShowRouteForm(false)
      setEditingRouteId(null)
      showToast(`Route ${isEditingRoute ? 'updated' : 'created'} successfully`)
    } catch (error) {
      console.error('Error saving route:', error)
      showToast(`Failed to ${editingRouteId ? 'update' : 'create'} route`, 'error')
    }
  }

  const handleEditRoute = (route: Route) => {
    setRouteFormData({
      name: route.name,
      from_location: route.from_location,
      to_location: route.to_location,
      price: Math.max(1, Number(route.price) || 1),
      distance: route.distance || '',
      estimated_duration: route.estimated_duration || '',
      status: route.status || 'active',
    })
    setEditingRouteId(route.id)
    setShowRouteForm(true)
  }

  const handleDeleteRoute = async (routeId: string) => {
    if (!confirm('Delete this route?')) {
      return
    }

    try {
      const response = await fetch(`/api/routes/${routeId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        showToast(errorData.error || 'Failed to delete route', 'error')
        return
      }

      setRoutes((prev) => prev.filter((route) => route.id !== routeId))
      if (editingRouteId === routeId) {
        setEditingRouteId(null)
        setShowRouteForm(false)
      }
      showToast('Route deleted successfully')
    } catch (error) {
      console.error('Error deleting route:', error)
      showToast('Failed to delete route', 'error')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
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
      case 'confirmed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeatStats = (trip: Trip) => {
    const total = Math.max(0, Number(trip.totalSeats) || 0)
    const availableRaw = Number(trip.availableSeats)
    const available = Number.isFinite(availableRaw)
      ? Math.min(Math.max(0, availableRaw), total)
      : total

    return {
      total,
      available,
      booked: Math.max(0, total - available),
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className="fixed top-4 right-4 z-[60] max-w-sm">
          <div
            className={`rounded-lg px-4 py-3 shadow-lg text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="ml-3 px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                {admin?.name}
              </span>
            </div>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto pb-2">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'trips', name: 'Trip Management', icon: TruckIcon },
              { id: 'fleets', name: 'Fleet Management', icon: TruckIcon },
              { id: 'routes', name: 'Route Management', icon: TruckIcon },
              { id: 'bookings', name: 'Bookings', icon: TicketIcon },
              { id: 'users', name: 'Users', icon: UsersIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <UsersIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
                    <p className="text-sm text-gray-600">Total Users</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <TruckIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalTrips}</h3>
                    <p className="text-sm text-gray-600">Total Trips</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <TicketIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalBookings}</h3>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      ₦{(Number(stats.totalRevenue) || 0).toLocaleString()}
                    </h3>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setShowTripModal(true)}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Add New Trip</span>
                </button>
                <button
                  onClick={() => setActiveTab('fleets')}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <TruckIcon className="w-5 h-5" />
                  <span>Manage Fleets</span>
                </button>
                <button
                  onClick={() => setActiveTab('routes')}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <EyeIcon className="w-5 h-5" />
                  <span>Manage Routes</span>
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <TicketIcon className="w-5 h-5" />
                  <span>View Bookings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trips' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Trip Management</h2>
              <button onClick={() => setShowTripModal(true)} className="btn-primary flex items-center space-x-2">
                <PlusIcon className="w-5 h-5" />
                <span>Schedule Trip</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trips.map((trip) => (
                      <tr key={trip.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{trip.route}</div>
                            <div className="text-sm text-gray-500">{trip.vehicle}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(trip.date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">{trip.departureTime} - {trip.arrivalTime}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₦{(Number(trip?.price) || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {getSeatStats(trip).booked}/{getSeatStats(trip).total}
                          </div>
                          <div className="text-sm text-gray-500">{getSeatStats(trip).available} available</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(trip.status)}`}
                          >
                            {trip.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => {
                              setEditingTrip(trip)
                              setShowTripModal(true)
                            }}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateTrip(trip.id, { status: 'cancelled' })}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fleets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Fleet Management</h2>
              <button
                onClick={() => {
                  if (showFleetForm && editingFleetId) {
                    setEditingFleetId(null)
                    setFleetFormData({
                      name: '',
                      vehicle_type: '',
                      total_seats: 7,
                      registration_number: '',
                      status: 'active',
                    })
                  }
                  setShowFleetForm((prev) => !prev)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>{showFleetForm ? 'Close Form' : 'Add Fleet'}</span>
              </button>
            </div>

            {showFleetForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="input-field"
                    placeholder="Fleet Name"
                    value={fleetFormData.name}
                    onChange={(e) => setFleetFormData({ ...fleetFormData, name: e.target.value })}
                  />
                  <input
                    className="input-field"
                    placeholder="Vehicle Type"
                    value={fleetFormData.vehicle_type}
                    onChange={(e) => setFleetFormData({ ...fleetFormData, vehicle_type: e.target.value })}
                  />
                  <input
                    className="input-field"
                    type="number"
                    min={1}
                    placeholder="Total Seats"
                    value={fleetFormData.total_seats}
                    onChange={(e) =>
                      setFleetFormData({ ...fleetFormData, total_seats: Math.max(1, Number(e.target.value) || 1) })
                    }
                  />
                  <input
                    className="input-field"
                    placeholder="Registration Number"
                    value={fleetFormData.registration_number}
                    onChange={(e) =>
                      setFleetFormData({ ...fleetFormData, registration_number: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleSaveFleet} className="btn-primary">
                    {editingFleetId ? 'Update Fleet' : 'Save Fleet'}
                  </button>
                  {editingFleetId && (
                    <button
                      onClick={() => {
                        setEditingFleetId(null)
                        setFleetFormData({
                          name: '',
                          vehicle_type: '',
                          total_seats: 7,
                          registration_number: '',
                          status: 'active',
                        })
                        setShowFleetForm(false)
                      }}
                      className="btn-secondary"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fleets.map((fleet) => (
                      <tr key={fleet.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fleet.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fleet.vehicle_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fleet.total_seats}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fleet.registration_number || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fleet.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEditFleet(fleet)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFleet(fleet.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Route Management</h2>
              <button
                onClick={() => {
                  if (showRouteForm && editingRouteId) {
                    setEditingRouteId(null)
                    setRouteFormData({
                      name: '',
                      from_location: '',
                      to_location: '',
                      price: 0,
                      distance: '',
                      estimated_duration: '',
                      status: 'active',
                    })
                  }
                  setShowRouteForm((prev) => !prev)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>{showRouteForm ? 'Close Form' : 'Add Route'}</span>
              </button>
            </div>

            {showRouteForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="input-field"
                    placeholder="Route Name"
                    value={routeFormData.name}
                    onChange={(e) => setRouteFormData({ ...routeFormData, name: e.target.value })}
                  />
                  <input
                    className="input-field"
                    placeholder="From Location"
                    value={routeFormData.from_location}
                    onChange={(e) => setRouteFormData({ ...routeFormData, from_location: e.target.value })}
                  />
                  <input
                    className="input-field"
                    placeholder="To Location"
                    value={routeFormData.to_location}
                    onChange={(e) => setRouteFormData({ ...routeFormData, to_location: e.target.value })}
                  />
                  <input
                    className="input-field"
                    type="number"
                    min={1}
                    placeholder="Price"
                    value={routeFormData.price}
                    onChange={(e) =>
                      setRouteFormData({ ...routeFormData, price: Math.max(1, Number(e.target.value) || 1) })
                    }
                  />
                  <input
                    className="input-field"
                    placeholder="Distance (optional)"
                    value={routeFormData.distance}
                    onChange={(e) => setRouteFormData({ ...routeFormData, distance: e.target.value })}
                  />
                  <input
                    className="input-field"
                    placeholder="Estimated Duration (optional)"
                    value={routeFormData.estimated_duration}
                    onChange={(e) =>
                      setRouteFormData({ ...routeFormData, estimated_duration: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleSaveRoute} className="btn-primary">
                    {editingRouteId ? 'Update Route' : 'Save Route'}
                  </button>
                  {editingRouteId && (
                    <button
                      onClick={() => {
                        setEditingRouteId(null)
                        setRouteFormData({
                          name: '',
                          from_location: '',
                          to_location: '',
                          price: 0,
                          distance: '',
                          estimated_duration: '',
                          status: 'active',
                        })
                        setShowRouteForm(false)
                      }}
                      className="btn-secondary"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {routes.map((route) => (
                      <tr key={route.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{route.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.from_location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.to_location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{(Number(route.price) || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEditRoute(route)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoute(route.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passenger</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.bookingReference}</div>
                          <div className="text-sm text-gray-500">
                            Seats: {(Array.isArray(booking.selectedSeats) ? booking.selectedSeats : []).join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.passengerName}</div>
                          <div className="text-sm text-gray-500">{booking.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Trip ID: {booking.tripId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{(Number(booking.totalAmount) || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-gray-600 mb-4">
                User management features will be available when connected to a real database.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <UsersIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">25 Total Users</h3>
                  <p className="text-sm text-gray-600">Registered passengers</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <UsersIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">23 Active Users</h3>
                  <p className="text-sm text-gray-600">Recently active</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <UsersIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">2 New Today</h3>
                  <p className="text-sm text-gray-600">New registrations</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showTripModal && (
        <TripModal
          trip={editingTrip}
          fleets={fleets}
          routes={routes}
          onClose={() => {
            setShowTripModal(false)
            setEditingTrip(null)
          }}
          onSave={(tripData) => {
            if (editingTrip) {
              handleUpdateTrip(editingTrip.id, tripData)
            } else {
              handleCreateTrip(tripData)
            }
          }}
        />
      )}
    </div>
  )
}

function TripModal({
  trip,
  fleets,
  routes,
  onClose,
  onSave,
}: {
  trip: Trip | null
  fleets: Fleet[]
  routes: Route[]
  onClose: () => void
  onSave: (tripData: Partial<Trip>) => void
}) {
  const initialRoute = routes.find(
    (item) => item.name === trip?.route || (item.from_location === trip?.from && item.to_location === trip?.to)
  )
  const initialFleet = fleets.find((item) => item.name === trip?.vehicle)

  const [selectedRouteId, setSelectedRouteId] = useState(initialRoute?.id || '')
  const [selectedFleetId, setSelectedFleetId] = useState(initialFleet?.id || '')
  const [formData, setFormData] = useState({
    route: trip?.route || '',
    from: trip?.from || '',
    to: trip?.to || '',
    departureTime: trip?.departureTime || '',
    arrivalTime: trip?.arrivalTime || '',
    price: trip?.price || 0,
    totalSeats: trip?.totalSeats || 0,
    date: trip?.date || '',
    vehicle: trip?.vehicle || '',
    status: trip?.status || 'scheduled',
  })

  const handleRouteChange = (routeId: string) => {
    setSelectedRouteId(routeId)
    const route = routes.find((item) => item.id === routeId)
    if (!route) return

    setFormData((prev) => ({
      ...prev,
      route: route.name,
      from: route.from_location,
      to: route.to_location,
      price: Number(route.price) || 0,
    }))
  }

  const handleFleetChange = (fleetId: string) => {
    setSelectedFleetId(fleetId)
    const fleet = fleets.find((item) => item.id === fleetId)
    if (!fleet) return

    setFormData((prev) => ({
      ...prev,
      vehicle: fleet.name,
      totalSeats: Math.max(1, Number(fleet.total_seats) || 1),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRouteId || !selectedFleetId) {
      alert('Please select a route and a fleet')
      return
    }

    onSave({
      ...formData,
      route: `${formData.from} to ${formData.to}`,
      availableSeats: trip ? trip.availableSeats : formData.totalSeats,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{trip ? 'Edit Trip' : 'Schedule Trip'}</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
                <select
                  value={selectedRouteId}
                  onChange={(e) => handleRouteChange(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select Route</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name} (₦{(Number(route.price) || 0).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fleet</label>
                <select
                  value={selectedFleetId}
                  onChange={(e) => handleFleetChange(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select Fleet</option>
                  {fleets.map((fleet) => (
                    <option key={fleet.id} value={fleet.id}>
                      {fleet.name} ({fleet.total_seats} seats)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <input type="text" value={formData.from} className="input-field bg-gray-50" readOnly required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <input type="text" value={formData.to} className="input-field bg-gray-50" readOnly required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
                <input
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Time</label>
                <input
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦)</label>
                <input
                  type="number"
                  value={formData.price}
                  className="input-field bg-gray-50"
                  readOnly
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Seats</label>
                <input
                  type="number"
                  value={formData.totalSeats}
                  className="input-field bg-gray-50"
                  readOnly
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
                <input type="text" value={formData.vehicle} className="input-field bg-gray-50" readOnly required />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {trip ? 'Update Trip' : 'Create Trip'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
