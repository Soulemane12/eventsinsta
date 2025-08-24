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

function BackBtn() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="w-9 h-9 grid place-items-center rounded-full hover:bg-gray-100" aria-label="Back">
      ←
    </button>
  )
}

function StepHeader({ step, title }: { step: number; title: string }) {
  const pct = (step / 6) * 100
  return (
    <div className="sticky top-0 bg-white z-10">
      <div className="flex items-center gap-2 p-4">
        <BackBtn />
        <div className="text-2xl font-semibold">{step} of 6: {title}</div>
      </div>
      <div className="w-full h-1 bg-gray-200">
        <div className="h-1 bg-green-500" style={{ width: pct + '%' }} />
      </div>
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white shadow ${className}`}>{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
      {children}
    </label>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300 ${props.className ?? ''}`} />
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

function ReviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    dateOfBirth: ''
  })

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

    const data: EventData = {
      eventType,
      location,
      date,
      time,
      guestCount,
      budget,
      services,
      servicesTotal,
      selectedRestaurant
    }

    setEventData(data)
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
  }

  const getRestaurantCost = () => {
    if (!eventData || !eventData.selectedRestaurant) return 0
    return getRestaurantPriceByGuestCount(eventData.selectedRestaurant, eventData.guestCount)
  }

  const getTotalCost = () => {
    if (!eventData) return 0
    return getRestaurantCost() + eventData.servicesTotal
  }

  const isFormValid = bookingData.name && bookingData.phone && bookingData.dateOfBirth

  function bookEvent() {
    // In a real app, this would process the booking with the collected data
    console.log('Booking event with data:', { eventData, bookingData })
    
    const params = new URLSearchParams({
      eventType: eventData!.eventType,
      location: eventData!.location,
      date: eventData!.date,
      time: eventData!.time,
      guestCount: eventData!.guestCount.toString(),
      budget: eventData!.budget,
      services: eventData!.services.join(','),
      servicesTotal: eventData!.servicesTotal.toString(),
      selectedRestaurant: eventData!.selectedRestaurant,
      customerName: bookingData.name
    })
    
    router.push(`/create/success?${params.toString()}`)
  }

  function saveForLater() {
    // In a real app, this would save the event details
    router.push('/home')
  }

  if (!eventData) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50">
        <StepHeader step={6} title="Book & Celebrate!" />
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading event details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={6} title="Book & Celebrate!" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Ready to book your perfect event?</h2>
          <p className="text-sm text-gray-600">Review your selections and complete your booking</p>
        </div>

        {/* Booking Information */}
        <Card className="p-4">
          <div className="font-semibold mb-3">Contact Information</div>
          <div className="space-y-3">
            <Field label="Full Name">
              <Input 
                placeholder="Enter your full name" 
                value={bookingData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </Field>
            
            <Field label="Phone Number">
              <Input 
                placeholder="Enter your phone number" 
                type="tel"
                value={bookingData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </Field>
            
            <Field label="Date of Birth">
              <Input 
                placeholder="MM/DD/YYYY" 
                type="date"
                value={bookingData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              />
            </Field>
          </div>
        </Card>

        {/* Event Summary */}
        <Card className="p-4">
          <div className="font-semibold mb-3">Event Summary</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Event Type:</span>
              <span className="font-medium">{eventData.eventType}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="font-medium">{eventData.location}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span className="font-medium">{formatDate(eventData.date)} at {formatTime(eventData.time)}</span>
            </div>
            <div className="flex justify-between">
              <span>Guests:</span>
              <span className="font-medium">{eventData.guestCount} people</span>
            </div>
            <div className="flex justify-between">
              <span>Budget Range:</span>
              <span className="font-medium">${eventData.budget === 'budget-1' ? '500 - 1,000' : 
                eventData.budget === 'budget-2' ? '1,000 - 3,000' : 
                eventData.budget === 'budget-3' ? '3,000 - 5,000' : '5,000+'}</span>
            </div>
          </div>
        </Card>

        {/* Selected Venues & Services */}
        <Card className="p-4">
          <div className="font-semibold mb-3">Your Selections</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-sm">Restaurant Cost</div>
                <div className="text-xs text-gray-600">For {eventData.guestCount} guests</div>
              </div>
              <div className="text-sm font-medium">${getRestaurantCost()}</div>
            </div>
            
            {eventData.services.map(serviceId => {
              const service = SERVICES.find(s => s.id === serviceId)
              return service ? (
                <div key={serviceId} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">{service.name}</div>
                    <div className="text-xs text-gray-600">{service.category}</div>
                  </div>
                  <div className="text-sm font-medium">${service.price}</div>
                </div>
              ) : null
            })}
            
            <div className="border-t pt-3">
              <div className="flex justify-between items-center font-semibold">
                <span>Total:</span>
                <span className="text-lg">${getTotalCost().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Booking Benefits */}
        <Card className="p-4 bg-green-50">
          <div className="text-sm font-medium text-green-800 mb-2">🎉 What's Included</div>
          <div className="space-y-1 text-xs text-green-700">
            <div>• Professional event coordination</div>
            <div>• All-inclusive pricing (no hidden fees)</div>
            <div>• 24/7 support throughout your event</div>
            <div>• Flexible payment options available</div>
          </div>
        </Card>

        <div className="space-y-3">
          <Button onClick={bookEvent} disabled={!isFormValid}>
            Book Now - ${getTotalCost().toLocaleString()}
          </Button>
          <GhostButton onClick={saveForLater}>
            Save for Later
          </GhostButton>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Secure booking with instant confirmation. Cancel up to 48 hours before your event.
        </div>
      </div>
    </div>
  )
}

export default function Review() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ReviewContent />
    </Suspense>
  )
}
