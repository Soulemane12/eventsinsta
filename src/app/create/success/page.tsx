'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getRestaurantPriceByGuestCount, RESTAURANTS } from '../../../data/restaurants'
import { SERVICES, VENUE_SERVICES } from '../../../data/services'
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

function getVenueDisplayName(venueId: string): string {
  if (!venueId) return 'No venue selected'
  const venue = VENUE_SERVICES.find(v => v.id === venueId)
  return venue ? venue.name : venueId.replace('venue-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function getVenueDescription(venueId: string): string {
  if (!venueId) return 'Please select a venue for your event'
  const venue = VENUE_SERVICES.find(v => v.id === venueId)
  return venue ? venue.description : 'Selected venue for your event'
}

function getVenueCost(venueId: string, guestCount: number): number {
  if (!venueId) return 0
  const venue = VENUE_SERVICES.find(v => v.id === venueId)
  if (!venue) return 0
  
  // For restaurant venues, use the restaurant pricing
  if (venueId === 'venue-restaurant') {
    return 0 // Will be handled separately with selectedRestaurant
  }
  
  // For other venues, return the base price
  return venue.price || 0
}

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [totalCost, setTotalCost] = useState(0)
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
    const totalCostParam = parseInt(searchParams.get('totalCost') || '0')
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
    setTotalCost(totalCostParam)

    // Debug: Log the total cost
    console.log('[Success] Total cost from URL:', totalCostParam)
    console.log('[Success] Calculated total cost:', getTotalCost())

    // Save event to localStorage for My Events page
    const eventToSave = {
      ...data,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'upcoming' as const
    }

    const existingEvents = localStorage.getItem('userEvents')
    const events = existingEvents ? JSON.parse(existingEvents) : []
    events.push(eventToSave)
    localStorage.setItem('userEvents', JSON.stringify(events))
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

  const getCurrentVenueCost = () => {
    if (!eventData) return 0
    
    // For restaurant venues, use restaurant pricing
    if (eventData.venue === 'venue-restaurant' && eventData.selectedRestaurant) {
      return getRestaurantPriceByGuestCount(eventData.selectedRestaurant, eventData.guestCount)
    }
    
    // For other venues, use venue pricing
    return getVenueCost(eventData.venue, eventData.guestCount)
  }

  const getTotalCost = () => {
    if (!eventData) return 0
    return getCurrentVenueCost() + eventData.servicesTotal
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
        <Logo size="lg" className="justify-center mb-6" />
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
            <div className="font-medium text-purple-600">💰 ${totalCost.toLocaleString()} total</div>
          </div>
          
          {/* Venue Information */}
          {eventData.venue && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-800 mb-2">
                {eventData.venue === 'venue-restaurant' ? 'Restaurant Information' : 'Venue Information'}
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                {eventData.venue === 'venue-restaurant' && getRestaurantDetails() ? (
                  <>
                    <div>🍽️ {getRestaurantDetails()?.name}</div>
                    <div>📍 {getRestaurantDetails()?.address}</div>
                    <div>📞 {getRestaurantDetails()?.phone}</div>
                    <div>👤 Host: {getRestaurantDetails()?.hostName}</div>
                  </>
                ) : (
                  <>
                    <div>🏛️ {getVenueDisplayName(eventData.venue)}</div>
                    <div>📝 {getVenueDescription(eventData.venue)}</div>
                    <div>💰 ${getCurrentVenueCost().toLocaleString()}</div>
                  </>
                )}
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
          <Button onClick={()=>router.push('/my-events')}>
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
