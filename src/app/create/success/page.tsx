'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getRestaurantPriceByGuestCount, RESTAURANTS } from '../../../data/restaurants'
import { SERVICES } from '../../../data/services'
import Logo from '../../../components/Logo'

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
  venue: string
  services: string[]
  servicesTotal: number
  selectedRestaurant: string
  customerName: string
  specialRequests?: string
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
  const [message, setMessage] = useState('')
  const [messageSent, setMessageSent] = useState(false)

  useEffect(() => {
    // Get event data from URL parameters
    const eventType = searchParams.get('eventType') || 'Anniversary'
    const location = searchParams.get('location') || 'New York, NY'
    const date = searchParams.get('date') || ''
    const time = searchParams.get('time') || ''
    const guestCount = parseInt(searchParams.get('guestCount') || '2')
    const budget = searchParams.get('budget') || 'budget-2'
    const venue = searchParams.get('venue') || ''
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
      venue,
      services,
      servicesTotal,
      selectedRestaurant,
      customerName
    }

    setEventData(data)
  }, [searchParams])

  const getRestaurantDetails = () => {
    if (!eventData || !eventData.selectedRestaurant) return null
    const restaurant = RESTAURANTS.find(r => r.id === eventData.selectedRestaurant)
    if (!restaurant) return null
    
    // Get host name based on restaurant id
    let hostName = ""
    if (restaurant.id === 'saint-restaurant') {
      hostName = "Ian"
    } else if (restaurant.id === 'rebel-restaurant') {
      hostName = "Fred"
    } else if (restaurant.id === 'del-friscos') {
      hostName = "Travis"
    }
    
    return {
      name: restaurant.name,
      address: restaurant.address,
      phone: restaurant.phone,
      hostName: hostName
    }
  }

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
  
  const sendSpecialRequest = () => {
    // In a real app, this would send the message to the backend
    console.log('Special request sent:', message)
    setMessageSent(true)
    // Clear the message
    setMessage('')
  }

  return (
    <div className="max-w-md mx-auto min-h-screen grid place-items-center p-6 text-center bg-gray-50">
      <div className="w-full">
        <Logo size="lg" className="justify-center mb-4" />
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
          
          {getRestaurantDetails() && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-800 mb-2">Restaurant Information</div>
              <div className="space-y-1 text-sm text-gray-600">
                <div>🍽️ {getRestaurantDetails()?.name}</div>
                <div>📍 {getRestaurantDetails()?.address}</div>
                <div>📞 {getRestaurantDetails()?.phone}</div>
                <div>👤 Host: {getRestaurantDetails()?.hostName}</div>
              </div>
            </div>
          )}
          
          {/* Special Requests Section */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm font-medium text-gray-800 mb-2">Special Requests</div>
            {messageSent ? (
              <div className="bg-green-50 p-3 rounded-lg text-sm text-green-700">
                Your special request has been sent to the venue. They will contact you shortly.
              </div>
            ) : (
              <div className="space-y-3">
                <textarea 
                  placeholder="Any special requests for the venue? (dietary restrictions, seating preferences, etc.)" 
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <button 
                  onClick={sendSpecialRequest}
                  disabled={!message.trim()}
                  className={`w-full py-2 rounded-lg text-sm font-medium ${
                    message.trim() ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  Send to Venue
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={()=>router.push('/home')}>
            View My Events
          </Button>
          <GhostButton onClick={() => router.push(`/create/guest-list?eventId=${encodeURIComponent(JSON.stringify(eventData))}`)}>
            Manage Guest List
          </GhostButton>
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
