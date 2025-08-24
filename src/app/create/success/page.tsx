'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getRestaurantPriceByGuestCount } from '../../../data/restaurants'
import { SERVICES } from '../../../data/services'

const BrandPurple = 'bg-purple-800'
const BrandPurpleHover = 'hover:bg-purple-900'
const BrandText = 'text-purple-800'

function Button({ children, className = '', disabled, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`w-full h-14 rounded-2xl ${BrandPurple} ${BrandPurpleHover} text-white font-semibold disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

function GhostButton({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`w-full h-14 rounded-2xl border border-gray-300 font-semibold ${className}`}>{children}</button>
  )
}

interface EventData {
  eventType: string
  location: string
  date: string
  time: string
  guestCount: number
  budget: string
  services: string[]
  servicesTotal: number
  selectedRestaurant: string
  customerName: string
}

function formatDate(dateString: string): string {
  if (!dateString) return 'Not set'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  } catch {
    return dateString
  }
}

function formatTime(timeString: string): string {
  if (!timeString) return 'Not set'
  try {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  } catch {
    return timeString
  }
}

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventData, setEventData] = useState<EventData | null>(null)

  useEffect(() => {
    // Get event data from URL parameters
    const eventType = searchParams.get('eventType') || 'Anniversary'
    const location = searchParams.get('location') || 'New York, NY'
    const date = searchParams.get('date') || ''
    const time = searchParams.get('time') || ''
    const guestCount = parseInt(searchParams.get('guestCount') || '2')
    const budget = searchParams.get('budget') || 'budget-2'
    const services = searchParams.get('services')?.split(',').filter(Boolean) || []
    const servicesTotal = parseInt(searchParams.get('servicesTotal') || '0')
    const selectedRestaurant = searchParams.get('selectedRestaurant') || ''
    const customerName = searchParams.get('customerName') || 'Billy Duc'

    const data: EventData = {
      eventType,
      location,
      date,
      time,
      guestCount,
      budget,
      services,
      servicesTotal,
      selectedRestaurant,
      customerName
    }

    setEventData(data)
  }, [searchParams])

  const getRestaurantCost = () => {
    if (!eventData || !eventData.selectedRestaurant) return 0
    return getRestaurantPriceByGuestCount(eventData.selectedRestaurant, eventData.guestCount)
  }

  const getTotalCost = () => {
    if (!eventData) return 0
    return getRestaurantCost() + eventData.servicesTotal
  }

  if (!eventData) {
    return (
      <div className="max-w-md mx-auto min-h-screen grid place-items-center p-6 text-center bg-gray-50">
        <div className="w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen grid place-items-center p-6 text-center bg-gray-50">
      <div className="w-full">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Hello {eventData.customerName}!</h1>
        <h2 className="text-xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">Your event is officially booked and ready to celebrate!</p>
        
        <div className="bg-white rounded-2xl p-6 mb-6 shadow">
          <div className="text-sm font-medium text-gray-800 mb-3">Event Details</div>
          <div className="space-y-2 text-sm text-gray-600">
            <div>🎉 {eventData.eventType}</div>
            <div>📍 {eventData.location}</div>
            <div>📅 {formatDate(eventData.date)} at {formatTime(eventData.time)}</div>
            <div>👥 {eventData.guestCount} guests</div>
            <div className="font-medium text-purple-600">💰 ${getTotalCost().toLocaleString()} total</div>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={()=>router.push('/home')}>
            View My Events
          </Button>
          <GhostButton onClick={()=>router.push('/create/customize')}>
            Plan Another Event
          </GhostButton>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <div>You'll receive a confirmation email shortly</div>
          <div>Our team will contact you within 24 hours</div>
        </div>
      </div>
    </div>
  )
}

export default function Success() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto min-h-screen grid place-items-center p-6 text-center bg-gray-50">
        <div className="w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
