'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LocationAutocomplete from '../../../components/LocationAutocomplete'
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
        <div className="text-2xl font-semibold">{step} of 6: {title}</div>
      </div>
      <div className="w-full h-1 bg-gray-200">
        <div className="h-1 bg-green-500" style={{ width: pct + '%' }} />
      </div>
    </div>
  )
}

function DetailsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [hostName, setHostName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [eventType, setEventType] = useState('')

  const timeOptions = [
    '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
    '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM',
    '2:00 AM', '2:30 AM', '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM'
  ]

  useEffect(() => {
    // Get event type from URL parameters
    const eventTypeParam = searchParams.get('eventType')
    if (eventTypeParam) {
      setEventType(eventTypeParam)
    }
  }, [searchParams])

  const valid = location.trim().length > 0 && date && hostName.trim().length > 0 && startTime && endTime

  function next(){
    if (valid) {
      const params = new URLSearchParams({
        eventType: eventType,
        location: location,
        date: date,
        hostName: hostName,
        startTime: startTime,
        endTime: endTime
      })
      router.push(`/create/guests?${params.toString()}`)
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={2} title="Location & Date" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Event Details</h2>
          <p className="text-sm text-gray-600">Tell us about your event location, date, and timing</p>
          {eventType && (
            <div className="mt-2 text-sm text-purple-600 font-medium">
              Planning: {eventType}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Field label="Host Name">
            <Input 
              placeholder="Enter your name"
              value={hostName}
              onChange={e => setHostName(e.target.value)}
            />
          </Field>

          <Field label="Event Location">
            <LocationAutocomplete
              value={location}
              onChange={setLocation}
              placeholder="Start typing city or state..."
            />
          </Field>

          <Field label="Event Date">
            <Input 
              type="date" 
              value={date} 
              onChange={e=>setDate(e.target.value)}
              className="text-base"
            />
          </Field>

          <Field label="Start Time">
            <select 
              value={startTime} 
              onChange={e => setStartTime(e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300 text-base"
            >
              <option value="">Select start time</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </Field>

          <Field label="End Time">
            <select 
              value={endTime} 
              onChange={e => setEndTime(e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300 text-base"
            >
              <option value="">Select end time</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </Field>

        </div>

        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="text-sm font-medium text-purple-800 mb-2">💡 Tip</div>
          <div className="text-xs text-purple-700">
            Start typing a city or state name and we'll suggest options. We'll use this information to find the best venues and services available in your area for your chosen date and time.
          </div>
        </div>

        <Button onClick={next} disabled={!valid}>
          Next: Guest Count & Budget
        </Button>
      </div>
    </div>
  )
}

export default function Details() {
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
      <DetailsContent />
    </Suspense>
  )
}
