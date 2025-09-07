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
  const [timeRange, setTimeRange] = useState('')
  const [eventType, setEventType] = useState('')
  const [dateError, setDateError] = useState('')

  const timeRangeOptions = [
    { 
      id: 'afternoon', 
      label: '12:00 PM - 4:00 PM', 
      description: 'Afternoon Event (4 hours)',
      startTime: '12:00 PM',
      endTime: '4:00 PM'
    },
    { 
      id: 'evening', 
      label: '6:00 PM - 10:00 PM', 
      description: 'Evening Event (4 hours)',
      startTime: '6:00 PM',
      endTime: '10:00 PM'
    },
    { 
      id: 'late-evening', 
      label: '8:00 PM - 12:00 AM', 
      description: 'Late Evening Event (4 hours)',
      startTime: '8:00 PM',
      endTime: '12:00 AM'
    },
    { 
      id: 'all-day', 
      label: '10:00 AM - 6:00 PM', 
      description: 'All Day Event (8 hours)',
      startTime: '10:00 AM',
      endTime: '6:00 PM'
    },
    { 
      id: 'night', 
      label: '10:00 PM - 2:00 AM', 
      description: 'Night Event (4 hours)',
      startTime: '10:00 PM',
      endTime: '2:00 AM'
    }
  ]

  // Date validation functions
  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  }

  const getDaysInMonth = (month: number, year: number): number => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (month === 2 && isLeapYear(year)) {
      return 29
    }
    return daysInMonth[month - 1] || 31
  }

  const validateDate = (year: string, month: string, day: string): string => {
    if (!year || !month || !day) {
      return ''
    }

    const yearNum = parseInt(year)
    const monthNum = parseInt(month)
    const dayNum = parseInt(day)

    // Check if year is in reasonable range
    if (yearNum < 2024 || yearNum > 2030) {
      return 'Year must be between 2024 and 2030'
    }

    // Check if month is valid
    if (monthNum < 1 || monthNum > 12) {
      return 'Month must be between 1 and 12'
    }

    // Check if day is valid for the month
    const maxDays = getDaysInMonth(monthNum, yearNum)
    if (dayNum < 1 || dayNum > maxDays) {
      if (monthNum === 2 && dayNum === 29) {
        return 'February 29th only exists in leap years'
      }
      return `Day must be between 1 and ${maxDays} for this month`
    }

    // Check if date is in the past
    const selectedDate = new Date(yearNum, monthNum - 1, dayNum)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for comparison
    
    if (selectedDate < today) {
      return 'Event date cannot be in the past'
    }

    return ''
  }

  useEffect(() => {
    // Get event type from URL parameters
    const eventTypeParam = searchParams.get('eventType')
    if (eventTypeParam) {
      setEventType(eventTypeParam)
    }
  }, [searchParams])

  const valid = location.trim().length > 0 && date && hostName.trim().length > 0 && timeRange && !dateError

  function next(){
    if (valid) {
      const selectedTimeRange = timeRangeOptions.find(option => option.id === timeRange)
      const params = new URLSearchParams({
        eventType: eventType,
        location: location,
        date: date,
        hostName: hostName,
        timeRange: timeRange,
        startTime: selectedTimeRange?.startTime || '',
        endTime: selectedTimeRange?.endTime || ''
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
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input 
                  type="number"
                  placeholder="MM"
                  min="1"
                  max="12"
                  maxLength={2}
                  value={date.split('-')[1] || ''}
                  onChange={e => {
                    let month = e.target.value
                    
                    // Prevent invalid month values
                    if (month && (parseInt(month) < 1 || parseInt(month) > 12)) {
                      return // Don't update if invalid
                    }
                    
                    // Limit to 2 digits
                    if (month.length > 2) {
                      month = month.slice(0, 2)
                    }
                    
                    const paddedMonth = month.padStart(2, '0')
                    const currentDate = date.split('-')
                    const newDate = `${currentDate[0] || ''}-${paddedMonth}-${currentDate[2] || ''}`
                    setDate(newDate)
                    
                    // Validate the new date
                    const error = validateDate(currentDate[0] || '', paddedMonth, currentDate[2] || '')
                    setDateError(error)
                  }}
                  className={`text-center text-base ${dateError ? 'border-red-500' : ''}`}
                />
                <div className="text-xs text-gray-500 text-center mt-1">Month</div>
              </div>
              <div className="text-2xl text-gray-400">/</div>
              <div className="flex-1">
                <Input 
                  type="number"
                  placeholder="DD"
                  min="1"
                  max="31"
                  maxLength={2}
                  value={date.split('-')[2] || ''}
                  onChange={e => {
                    let day = e.target.value
                    
                    // Prevent invalid day values
                    if (day && (parseInt(day) < 1 || parseInt(day) > 31)) {
                      return // Don't update if invalid
                    }
                    
                    // Limit to 2 digits
                    if (day.length > 2) {
                      day = day.slice(0, 2)
                    }
                    
                    const paddedDay = day.padStart(2, '0')
                    const currentDate = date.split('-')
                    const newDate = `${currentDate[0] || ''}-${currentDate[1] || ''}-${paddedDay}`
                    setDate(newDate)
                    
                    // Validate the new date
                    const error = validateDate(currentDate[0] || '', currentDate[1] || '', paddedDay)
                    setDateError(error)
                  }}
                  className={`text-center text-base ${dateError ? 'border-red-500' : ''}`}
                />
                <div className="text-xs text-gray-500 text-center mt-1">Day</div>
              </div>
              <div className="text-2xl text-gray-400">/</div>
              <div className="flex-1">
                <Input 
                  type="number"
                  placeholder="YYYY"
                  min="2024"
                  max="2030"
                  maxLength={4}
                  value={date.split('-')[0] || ''}
                  onChange={e => {
                    let year = e.target.value
                    
                    // Limit to 4 digits
                    if (year.length > 4) {
                      year = year.slice(0, 4)
                    }
                    
                    // Prevent invalid year values
                    if (year && (parseInt(year) < 2024 || parseInt(year) > 2030)) {
                      return // Don't update if invalid
                    }
                    
                    // Prevent years starting with 0 (like 0010, 0025, etc.)
                    if (year && year.length === 4 && year.startsWith('0')) {
                      return // Don't update if starts with 0
                    }
                    
                    const currentDate = date.split('-')
                    const newDate = `${year}-${currentDate[1] || ''}-${currentDate[2] || ''}`
                    setDate(newDate)
                    
                    // Validate the new date
                    const error = validateDate(year, currentDate[1] || '', currentDate[2] || '')
                    setDateError(error)
                  }}
                  className={`text-center text-base ${dateError ? 'border-red-500' : ''}`}
                />
                <div className="text-xs text-gray-500 text-center mt-1">Year</div>
              </div>
            </div>
            {dateError && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                ⚠️ {dateError}
              </div>
            )}
          </Field>

          <Field label="Event Time Range">
            <div className="space-y-3">
              {timeRangeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`w-full p-4 text-left cursor-pointer transition-all rounded-xl border ${
                    timeRange === option.id 
                      ? 'border-purple-600 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300 bg-white'
                  }`}
                  onClick={() => setTimeRange(option.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-base text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                    </div>
                    {timeRange === option.id && (
                      <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Field>

        </div>

        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="text-sm font-medium text-purple-800 mb-2">💡 Tip</div>
          <div className="text-xs text-purple-700">
            Start typing a city or state name and we'll suggest options. Choose a time range that works best for your event type. We'll use this information to find the best venues and services available in your area for your chosen date and time.
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
