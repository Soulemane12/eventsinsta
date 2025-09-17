'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getRestaurantPriceByGuestCount } from '../../../data/restaurants'
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
      <div className="flex items-center gap-3 p-4">
        <BackBtn />
        <Logo size="md" />
        <div className="text-2xl font-semibold">{step} of 7: {title}</div>
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
  venue: string
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

function getVenueCost(venueId: string, guestCount: number): number {
  if (!venueId) return 0
  const venue = VENUE_SERVICES.find(v => v.id === venueId)
  if (!venue) return 0
  
  // For restaurant venues, use the restaurant pricing
  if (venueId === 'venue-restaurant') {
    return 0 // Will be handled separately with selectedRestaurant
  }
  
  // For other venues, return the base price
  const venuePrice = venue.price || 0
  console.log('[Review] getVenueCost', { venueId, guestCount, venueName: venue?.name, venuePrice })
  return venuePrice
}

// Date validation functions for date of birth
const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

const getDaysInMonth = (month: number, year: number): number => {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (month === 2 && isLeapYear(year)) {
    return 29
  }
  return daysInMonth[month - 1]
}

const validateDateOfBirth = (year: string, month: string, day: string): string => {
  const yearNum = parseInt(year)
  const monthNum = parseInt(month)
  const dayNum = parseInt(day)
  
  if (yearNum < 1900 || yearNum > new Date().getFullYear()) {
    return 'Please enter a valid year'
  }
  
  if (monthNum < 1 || monthNum > 12) {
    return 'Please enter a valid month (1-12)'
  }
  
  if (dayNum < 1 || dayNum > getDaysInMonth(monthNum, yearNum)) {
    return 'Please enter a valid day for this month'
  }
  
  // Check if date is in the future
  const birthDate = new Date(yearNum, monthNum - 1, dayNum)
  const today = new Date()
  if (birthDate > today) {
    return 'Date of birth cannot be in the future'
  }
  
  return ''
}

function ReviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: ''
  })
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [dateOfBirthError, setDateOfBirthError] = useState('')

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
    const venue = searchParams.get('venue') || ''

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
      venue
    }

    setEventData(data)
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
  }

  const getCurrentVenueCost = () => {
    if (!eventData) return 0
    
    // Debug: log inputs and intermediate values
    console.log('[Review] getCurrentVenueCost inputs', {
      venue: eventData.venue,
      selectedRestaurant: eventData.selectedRestaurant,
      guestCount: eventData.guestCount
    })

    // For restaurant venues, use restaurant pricing
    if (eventData.venue === 'venue-restaurant' && eventData.selectedRestaurant) {
      const venueCost = getRestaurantPriceByGuestCount(eventData.selectedRestaurant, eventData.guestCount)
      console.log('[Review] restaurant venue cost', { selectedRestaurant: eventData.selectedRestaurant, guestCount: eventData.guestCount, venueCost })
      return venueCost
    }
    
    // For other venues, use venue pricing
    const otherVenueCost = getVenueCost(eventData.venue, eventData.guestCount)
    console.log('[Review] other venue cost', { venue: eventData.venue, guestCount: eventData.guestCount, otherVenueCost })
    return otherVenueCost
  }

  const getTotalCost = () => {
    if (!eventData) return 0
    const venueCost = getCurrentVenueCost()
    const total = venueCost + eventData.servicesTotal
    console.log('[Review] getTotalCost', { venueCost, servicesTotal: eventData.servicesTotal, total })
    return total
  }

  // Update booking data when date of birth changes
  useEffect(() => {
    if (dateOfBirth) {
      const [year, month, day] = dateOfBirth.split('-')
      if (year && month && day) {
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        setBookingData(prev => ({ ...prev, dateOfBirth: formattedDate }))
      }
    }
  }, [dateOfBirth])

  // Age verification logic
  const isOver18 = (() => {
    if (!dateOfBirth) return false
    const [year, month, day] = dateOfBirth.split('-')
    if (!year || !month || !day) return false
    
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18
    }
    return age >= 18
  })()

  const isFormValid = bookingData.name && bookingData.phone && bookingData.email && dateOfBirth && !dateOfBirthError && isOver18

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
        <StepHeader step={7} title="Book & Celebrate!" />
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
              <StepHeader step={7} title="Book & Celebrate!" />
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
            
            <Field label="Email">
              <Input 
                placeholder="Enter your email address" 
                type="email"
                value={bookingData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </Field>
            
            <Field label="Date of Birth">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="MM"
                    maxLength={2}
                    value={dateOfBirth.split('-')[1] || ''}
                    onChange={e => {
                      let month = e.target.value
                      if (month.length > 2) {
                        month = month.slice(0, 2)
                      }
                      
                      // Allow all input - no restrictions during typing
                      const currentDate = dateOfBirth.split('-')
                      const newDate = `${currentDate[0] || ''}-${month}-${currentDate[2] || ''}`
                      setDateOfBirth(newDate)
                      
                      // Clear errors while typing
                      setDateOfBirthError('')
                    }}
                    onBlur={e => {
                      // Validate when user finishes typing
                      const currentDate = dateOfBirth.split('-')
                      
                      // Only validate if we have a complete date
                      if (currentDate[0] && currentDate[1] && currentDate[2]) {
                        const error = validateDateOfBirth(currentDate[0], currentDate[1], currentDate[2])
                        setDateOfBirthError(error)
                      } else {
                        setDateOfBirthError('')
                      }
                    }}
                    className={`w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300 text-center text-base ${dateOfBirthError ? 'border-red-500' : ''} ${!dateOfBirthError && dateOfBirth && dateOfBirth.split('-')[0] && dateOfBirth.split('-')[1] && dateOfBirth.split('-')[2] && dateOfBirth.split('-')[0].length === 4 && dateOfBirth.split('-')[1].length === 2 && dateOfBirth.split('-')[2].length === 2 ? 'border-green-500' : ''}`}
                  />
                  <div className="text-xs text-gray-500 text-center mt-1">Month</div>
                </div>
                
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="DD"
                    maxLength={2}
                    value={dateOfBirth.split('-')[2] || ''}
                    onChange={e => {
                      let day = e.target.value
                      if (day.length > 2) {
                        day = day.slice(0, 2)
                      }
                      
                      // Allow all input - no restrictions during typing
                      const currentDate = dateOfBirth.split('-')
                      const newDate = `${currentDate[0] || ''}-${currentDate[1] || ''}-${day}`
                      setDateOfBirth(newDate)
                      
                      // Clear errors while typing
                      setDateOfBirthError('')
                    }}
                    onBlur={e => {
                      // Validate when user finishes typing
                      const currentDate = dateOfBirth.split('-')
                      
                      // Only validate if we have a complete date
                      if (currentDate[0] && currentDate[1] && currentDate[2]) {
                        const error = validateDateOfBirth(currentDate[0], currentDate[1], currentDate[2])
                        setDateOfBirthError(error)
                      } else {
                        setDateOfBirthError('')
                      }
                    }}
                    className={`w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300 text-center text-base ${dateOfBirthError ? 'border-red-500' : ''} ${!dateOfBirthError && dateOfBirth && dateOfBirth.split('-')[0] && dateOfBirth.split('-')[1] && dateOfBirth.split('-')[2] && dateOfBirth.split('-')[0].length === 4 && dateOfBirth.split('-')[1].length === 2 && dateOfBirth.split('-')[2].length === 2 ? 'border-green-500' : ''}`}
                  />
                  <div className="text-xs text-gray-500 text-center mt-1">Day</div>
                </div>
                
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="YYYY"
                    maxLength={4}
                    value={dateOfBirth.split('-')[0] || ''}
                    onChange={e => {
                      let year = e.target.value
                      if (year.length > 4) {
                        year = year.slice(0, 4)
                      }
                      
                      // Allow all input - no restrictions during typing
                      const currentDate = dateOfBirth.split('-')
                      const newDate = `${year}-${currentDate[1] || ''}-${currentDate[2] || ''}`
                      setDateOfBirth(newDate)
                      
                      // Clear errors while typing
                      setDateOfBirthError('')
                    }}
                    onBlur={e => {
                      // Validate when user finishes typing
                      const currentDate = dateOfBirth.split('-')
                      
                      // Only validate if we have a complete date
                      if (currentDate[0] && currentDate[1] && currentDate[2]) {
                        const error = validateDateOfBirth(currentDate[0], currentDate[1], currentDate[2])
                        setDateOfBirthError(error)
                      } else {
                        setDateOfBirthError('')
                      }
                    }}
                    className={`w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300 text-center text-base ${dateOfBirthError ? 'border-red-500' : ''} ${!dateOfBirthError && dateOfBirth && dateOfBirth.split('-')[0] && dateOfBirth.split('-')[1] && dateOfBirth.split('-')[2] && dateOfBirth.split('-')[0].length === 4 && dateOfBirth.split('-')[1].length === 2 && dateOfBirth.split('-')[2].length === 2 ? 'border-green-500' : ''}`}
                  />
                  <div className="text-xs text-gray-500 text-center mt-1">Year</div>
                </div>
              </div>
              
              {/* Date validation error */}
              {dateOfBirthError && (
                <div className="text-red-500 text-xs mt-1">{dateOfBirthError}</div>
              )}
              
              {/* Valid date confirmation */}
              {!dateOfBirthError && dateOfBirth && dateOfBirth.split('-')[0] && dateOfBirth.split('-')[1] && dateOfBirth.split('-')[2] && dateOfBirth.split('-')[0].length === 4 && dateOfBirth.split('-')[1].length === 2 && dateOfBirth.split('-')[2].length === 2 && (
                <div className="text-green-600 text-xs mt-1">✅ Valid date of birth</div>
              )}
            </Field>
            
            {/* Age Verification */}
            {dateOfBirth && dateOfBirth.split('-')[0] && dateOfBirth.split('-')[1] && dateOfBirth.split('-')[2] && (
              <div className={`p-3 rounded-lg text-sm ${
                isOver18 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {isOver18 ? '✅ Age verified: You are 18 or older' : '❌ You must be 18 or older to book an event'}
              </div>
            )}
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
                <div className="font-medium text-sm">
                  {eventData.venue === 'venue-restaurant' ? 'Restaurant Cost' : 
                   eventData.venue === 'venue-sports-arena' ? 'Sports Arena Cost' :
                   getVenueDisplayName(eventData.venue) + ' Cost'}
                </div>
                <div className="text-xs text-gray-600">For {eventData.guestCount} guests</div>
              </div>
              <div className="text-sm font-medium">${getCurrentVenueCost()}</div>
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
              
              {/* Debug: Show cost breakdown */}
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                <div className="font-medium text-gray-700 mb-1">🔍 Debug Cost Breakdown:</div>
                <div className="flex justify-between">
                  <span>Venue Cost:</span>
                  <span>${getCurrentVenueCost()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Services Total:</span>
                  <span>${eventData.servicesTotal}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Calculated Total:</span>
                  <span>${getCurrentVenueCost() + eventData.servicesTotal}</span>
                </div>
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
          <GhostButton onClick={() => router.push('/home')}>
            Home
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
