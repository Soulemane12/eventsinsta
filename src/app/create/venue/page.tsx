'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { VENUE_SERVICES, Service } from '@/data/services'
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

function BackBtn() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="w-9 h-9 grid place-items-center rounded-full hover:bg-gray-100" aria-label="Back">
      ←
    </button>
  )
}

function StepHeader({ step, title }: { step: number; title: string }) {
  const pct = (step / 7) * 100
  return (
    <div className="sticky top-0 bg-white z-10">
      <div className="flex items-center gap-2 p-4">
        <BackBtn />
        <Logo size="sm" />
        <div className="text-2xl font-semibold">{step} of 7: {title}</div>
      </div>
      <div className="w-full h-1 bg-gray-200">
        <div className="h-1 bg-green-500" style={{ width: pct + '%' }} />
      </div>
    </div>
  )
}

function VenueCard({ 
  venue, 
  isSelected, 
  onSelect 
}: { 
  venue: Service; 
  isSelected: boolean; 
  onSelect: () => void 
}) {
  return (
    <div
      className={`w-full p-4 transition-all rounded-2xl bg-white shadow cursor-pointer ${
        isSelected 
          ? 'border-2 border-purple-600 bg-purple-50' 
          : 'border border-gray-200 hover:border-purple-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{venue.icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="font-semibold text-sm">{venue.name}</div>
            <div className="text-sm font-bold text-purple-600">{venue.priceDescription}</div>
          </div>
          <div className="text-xs text-gray-600 mb-2">{venue.description}</div>
          {isSelected && (
            <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center ml-auto">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function VenueContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [selectedVenue, setSelectedVenue] = useState<string>('')
  const [eventType, setEventType] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [budget, setBudget] = useState('')

  useEffect(() => {
    // Get previous parameters from URL
    const eventTypeParam = searchParams.get('eventType')
    const locationParam = searchParams.get('location')
    const dateParam = searchParams.get('date')
    const timeParam = searchParams.get('time')
    const guestCountParam = searchParams.get('guestCount')
    const budgetParam = searchParams.get('budget')
    
    if (eventTypeParam) setEventType(eventTypeParam)
    if (locationParam) setLocation(locationParam)
    if (dateParam) setDate(dateParam)
    if (timeParam) setTime(timeParam)
    if (guestCountParam) setGuestCount(guestCountParam)
    if (budgetParam) setBudget(budgetParam)
  }, [searchParams])

  const venueServices = VENUE_SERVICES

  const valid = selectedVenue

  function next() {
    if (valid) {
      const params = new URLSearchParams({
        eventType: eventType,
        location: location,
        date: date,
        time: time,
        guestCount: guestCount,
        budget: budget,
        venue: selectedVenue
      })
      router.push(`/create/services?${params.toString()}`)
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={4} title="Select Your Venue" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Choose Your Venue</h2>
          <p className="text-sm text-gray-600">Select the perfect venue for your event</p>
          {eventType && location && (
            <div className="mt-2 text-sm text-purple-600 font-medium">
              Planning: {eventType} in {location}
            </div>
          )}
        </div>

        <div className="space-y-3">
          {venueServices.map(venue => (
            <VenueCard
              key={venue.id}
              venue={venue}
              isSelected={selectedVenue === venue.id}
              onSelect={() => setSelectedVenue(venue.id)}
            />
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="text-sm font-medium text-blue-800 mb-2">💡 Venue Selection Tip</div>
          <div className="text-xs text-blue-700">
            Choose your venue first, then we'll help you select the perfect services to complement your venue choice.
          </div>
        </div>

        <Button onClick={next} disabled={!valid}>
          Continue to Services
        </Button>
      </div>
    </div>
  )
}

export default function Venue() {
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
      <VenueContent />
    </Suspense>
  )
}
