'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getRestaurantPriceByGuestCount } from '../../../data/restaurants'
import { SERVICES, VENUE_SERVICES } from '../../../data/services'
import { getSportsArenaPriceByGuestCount } from '../../../data/sportsArenas'
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
  selectedSportsArena: string
  venue: string
  venuePrice?: string
  venueName?: string
  venueAddress?: string
  venuePackage?: string
  specificVenue?: string
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
    const selectedRestaurant = searchParams.get('selectedRestaurant') || searchParams.get('specificVenue') || ''
    const selectedSportsArena = searchParams.get('selectedSportsArena') || ''
    const venue = searchParams.get('venue') || ''
    const venuePrice = searchParams.get('venuePrice') || ''
    const venueName = searchParams.get('venueName') || ''
    const venueAddress = searchParams.get('venueAddress') || ''
    const venuePackage = searchParams.get('venuePackage') || ''
    const specificVenue = searchParams.get('specificVenue') || ''

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
      selectedSportsArena,
      venue,
      venuePrice,
      venueName,
      venueAddress,
      venuePackage,
      specificVenue
    }

    setEventData(data)
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
  }

  const getCurrentVenueCost = () => {
    if (!eventData) return 0

    // First priority: Use specific venue price if available (from URL parameters)
    if (eventData.venuePrice) {
      const price = parseInt(eventData.venuePrice) || 0
      return price
    }

    // Second priority: Use venue-specific pricing functions
    if (eventData.venue === 'venue-restaurant' && eventData.selectedRestaurant) {
      const venueCost = getRestaurantPriceByGuestCount(eventData.selectedRestaurant, eventData.guestCount)
      return venueCost
    }

    if (eventData.venue === 'venue-sports-arena' && eventData.selectedSportsArena) {
      const venueCost = getSportsArenaPriceByGuestCount(eventData.selectedSportsArena, eventData.guestCount)
      return venueCost
    }

    // Fallback: Use base venue pricing
    const basePricing = getVenueCost(eventData.venue, eventData.guestCount)
    return basePricing
  }

  const getTotalCost = () => {
    if (!eventData) return 0
    const venueCost = getCurrentVenueCost()
    const total = venueCost + eventData.servicesTotal
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
    
    const params = new URLSearchParams({
      eventType: eventData!.eventType,
      location: eventData!.location,
      date: eventData!.date,
      time: eventData!.time,
      guestCount: eventData!.guestCount.toString(),
      budget: eventData!.budget,
      venue: eventData!.venue,
      services: eventData!.services.join(','),
      servicesTotal: eventData!.servicesTotal.toString(),
      totalCost: getTotalCost().toString(),
      selectedRestaurant: eventData!.selectedRestaurant,
      customerName: bookingData.name,
      ...(eventData!.venueName && { venueName: eventData!.venueName }),
      ...(eventData!.venueAddress && { venueAddress: eventData!.venueAddress }),
      ...(eventData!.specificVenue && { specificVenue: eventData!.specificVenue }),
      ...(eventData!.venuePrice && { venuePrice: eventData!.venuePrice }),
      ...(eventData!.venuePackage && { venuePackage: eventData!.venuePackage })
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
          <h2 className="text-xl font-semibold mb-2">📝 Complete Event Review</h2>
          <p className="text-sm text-gray-600">Review all your selections in detail before booking your perfect event</p>
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
                  <select
                    value={dateOfBirth.split('-')[1] || ''}
                    onChange={e => {
                      const month = e.target.value
                      const currentDate = dateOfBirth.split('-')
                      const newDate = `${currentDate[0] || ''}-${month}-${currentDate[2] || ''}`
                      setDateOfBirth(newDate)
                      setDateOfBirthError('')
                    }}
                    onBlur={() => {
                      const currentDate = dateOfBirth.split('-')
                      if (currentDate[0] && currentDate[1] && currentDate[2]) {
                        const error = validateDateOfBirth(currentDate[0], currentDate[1], currentDate[2])
                        setDateOfBirthError(error)
                      }
                    }}
                    className={`w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300 text-center text-base bg-white ${dateOfBirthError ? 'border-red-500' : ''} ${!dateOfBirthError && dateOfBirth && dateOfBirth.split('-')[0] && dateOfBirth.split('-')[1] && dateOfBirth.split('-')[2] && dateOfBirth.split('-')[0].length === 4 && dateOfBirth.split('-')[1].length >= 1 && dateOfBirth.split('-')[2].length >= 1 ? 'border-green-500' : ''}`}
                  >
                    <option value="">Month</option>
                    <option value="01">Jan</option>
                    <option value="02">Feb</option>
                    <option value="03">Mar</option>
                    <option value="04">Apr</option>
                    <option value="05">May</option>
                    <option value="06">Jun</option>
                    <option value="07">Jul</option>
                    <option value="08">Aug</option>
                    <option value="09">Sep</option>
                    <option value="10">Oct</option>
                    <option value="11">Nov</option>
                    <option value="12">Dec</option>
                  </select>
                </div>

                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Day"
                    min="1"
                    max="31"
                    value={dateOfBirth.split('-')[2] || ''}
                    onChange={e => {
                      let day = e.target.value
                      if (parseInt(day) > 31) day = '31'
                      if (parseInt(day) < 1 && day !== '') day = '1'

                      const currentDate = dateOfBirth.split('-')
                      const newDate = `${currentDate[0] || ''}-${currentDate[1] || ''}-${day.padStart(2, '0')}`
                      setDateOfBirth(newDate)
                      setDateOfBirthError('')
                    }}
                    onBlur={() => {
                      const currentDate = dateOfBirth.split('-')
                      if (currentDate[0] && currentDate[1] && currentDate[2]) {
                        const error = validateDateOfBirth(currentDate[0], currentDate[1], currentDate[2])
                        setDateOfBirthError(error)
                      }
                    }}
                    className={`w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300 text-center text-base ${dateOfBirthError ? 'border-red-500' : ''} ${!dateOfBirthError && dateOfBirth && dateOfBirth.split('-')[0] && dateOfBirth.split('-')[1] && dateOfBirth.split('-')[2] && dateOfBirth.split('-')[0].length === 4 && dateOfBirth.split('-')[1].length >= 1 && dateOfBirth.split('-')[2].length >= 1 ? 'border-green-500' : ''}`}
                  />
                </div>

                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Year"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={dateOfBirth.split('-')[0] || ''}
                    onChange={e => {
                      let year = e.target.value
                      if (year.length > 4) year = year.slice(0, 4)

                      const currentDate = dateOfBirth.split('-')
                      const newDate = `${year}-${currentDate[1] || ''}-${currentDate[2] || ''}`
                      setDateOfBirth(newDate)
                      setDateOfBirthError('')
                    }}
                    onBlur={() => {
                      const currentDate = dateOfBirth.split('-')
                      if (currentDate[0] && currentDate[1] && currentDate[2]) {
                        const error = validateDateOfBirth(currentDate[0], currentDate[1], currentDate[2])
                        setDateOfBirthError(error)
                      }
                    }}
                    className={`w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300 text-center text-base ${dateOfBirthError ? 'border-red-500' : ''} ${!dateOfBirthError && dateOfBirth && dateOfBirth.split('-')[0] && dateOfBirth.split('-')[1] && dateOfBirth.split('-')[2] && dateOfBirth.split('-')[0].length === 4 && dateOfBirth.split('-')[1].length >= 1 && dateOfBirth.split('-')[2].length >= 1 ? 'border-green-500' : ''}`}
                  />
                </div>
              </div>
              
              {/* Date validation error */}
              {dateOfBirthError && (
                <div className="text-red-500 text-xs mt-1">{dateOfBirthError}</div>
              )}
              
              {/* Valid date confirmation */}
              {!dateOfBirthError && dateOfBirth && dateOfBirth.split('-')[0] && dateOfBirth.split('-')[1] && dateOfBirth.split('-')[2] && dateOfBirth.split('-')[0].length === 4 && dateOfBirth.split('-')[1].length >= 1 && dateOfBirth.split('-')[2].length >= 1 && (
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

        {/* Event Overview */}
        <Card className="p-4">
          <div className="font-semibold mb-3">🎉 Your Event Overview</div>
          <div className="space-y-2 text-sm">
            <div className="text-base font-medium text-purple-800">{eventData.eventType}</div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>📍</span>
              <span>{eventData.location}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <div className="text-xs text-gray-500">📅 Date</div>
                <div className="font-medium">{formatDate(eventData.date)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">🕐 Time</div>
                <div className="font-medium">{formatTime(eventData.time)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">👥 Guests</div>
                <div className="font-medium">{eventData.guestCount} people</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">💰 Budget</div>
                <div className="font-medium">${eventData.budget === 'budget-1' ? '1,000 - 3,000' :
                  eventData.budget === 'budget-2' ? '3,000 - 5,000' :
                  eventData.budget === 'budget-3' ? '5,000+' : '3,000 - 5,000'}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Venue Details */}
        {eventData.venue === 'venue-restaurant' && eventData.selectedRestaurant && (
          <Card className="p-4">
            <div className="font-semibold mb-3">🍽️ Your Restaurant Details</div>
            <div className="space-y-2">
              <div className="text-base font-medium text-purple-800">
                {eventData.venueName || eventData.selectedRestaurant}
              </div>
              <div className="text-sm text-gray-600">
                📍 {eventData.venueAddress || eventData.location}
              </div>
              {eventData.venuePackage && (
                <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm font-medium text-purple-800">📦 Your Selected Package</div>
                  <div className="text-sm text-purple-700">{eventData.venuePackage}</div>
                  <div className="text-lg font-semibold text-purple-800">${getCurrentVenueCost()}</div>
                  <div className="text-xs text-purple-600">For {eventData.guestCount} guests</div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Services Summary */}
        {eventData.services.length > 0 && (
          <Card className="p-4">
            <div className="font-semibold mb-3">🎯 Your Selected Services</div>
            <div className="space-y-3">
              {eventData.services.map(serviceId => {
                const service = SERVICES.find(s => s.id === serviceId)
                return service ? (
                  <div key={serviceId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {service.category === 'Decorations' ? '🎨' :
                         service.category === 'DJ' ? '🎵' :
                         service.category === 'Photography' ? '📷' :
                         service.category === 'Catering' ? '🍽️' : '🎯'}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{service.name}</div>
                        <div className="text-xs text-gray-600">{service.category}</div>
                        <div className="text-xs text-green-600">${service.price} for full event</div>
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-purple-800">${service.price}</div>
                  </div>
                ) : null
              })}

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Total Services Cost</div>
                  <div className="text-lg font-semibold">${eventData.servicesTotal}</div>
                </div>
                <div className="text-xs text-gray-600">{eventData.services.length} services selected</div>
              </div>
            </div>
          </Card>
        )}

        {/* Cost Breakdown */}
        <Card className="p-4">
          <div className="font-semibold mb-3">💰 Complete Cost Breakdown</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🏛️</div>
                <div>
                  <div className="font-medium text-sm">
                    {eventData.venueName ||
                     (eventData.venue === 'venue-restaurant' ? 'Restaurant Venue' :
                      eventData.venue === 'venue-sports-arena' ? 'Sports Arena' :
                      getVenueDisplayName(eventData.venue))}
                  </div>
                  <div className="text-xs text-gray-600">
                    {eventData.venuePackage || `For ${eventData.guestCount} guests`} • {eventData.venueAddress || eventData.location}
                  </div>
                </div>
              </div>
              <div className="text-lg font-semibold text-purple-800">${getCurrentVenueCost()}</div>
            </div>

            {eventData.services.length > 0 && (
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <div className="font-medium text-sm">All Services</div>
                    <div className="text-xs text-gray-600">{eventData.services.length} services included</div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-purple-800">${eventData.servicesTotal}</div>
              </div>
            )}

            <div className="border-t pt-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">💡 Budget Analysis</div>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Your Budget:</span>
                    <span className="font-medium">${eventData.budget === 'budget-1' ? '1,000 - 3,000' :
                      eventData.budget === 'budget-2' ? '3,000 - 5,000' :
                      eventData.budget === 'budget-3' ? '5,000+' : '3,000 - 5,000'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span className="font-medium">${getTotalCost()}</span>
                  </div>
                  <div className="text-green-600 font-medium">✅ Within Budget</div>
                </div>
              </div>

              <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-lg">Grand Total</div>
                  <div className="text-2xl font-bold text-purple-800">${getTotalCost().toLocaleString()}</div>
                </div>
                <div className="text-xs text-gray-600 mt-1">All costs included</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Event Ready Section */}
        <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-800 mb-2">🎉 Your Event is Ready to Book!</div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <span>📝</span>
                <span className="font-medium">Event Confirmed:</span>
                <span>{eventData.eventType} for {eventData.guestCount} guests on {formatDate(eventData.date)}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-700">
                <span>🏛️</span>
                <span className="font-medium">Venue Secured:</span>
                <span>{eventData.venueName || 'Perfect venue selected'}</span>
              </div>
              {eventData.services.length > 0 && (
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <span>🎯</span>
                  <span className="font-medium">Services Booked:</span>
                  <span>{eventData.services.length} premium services totaling ${eventData.servicesTotal}</span>
                </div>
              )}
            </div>
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
