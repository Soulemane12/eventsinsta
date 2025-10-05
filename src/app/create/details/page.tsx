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
  const [customStartTime, setCustomStartTime] = useState('')
  const [customStartPeriod, setCustomStartPeriod] = useState('PM')
  const [customEndTime, setCustomEndTime] = useState('')
  const [customEndPeriod, setCustomEndPeriod] = useState('PM')
  const [eventType, setEventType] = useState('')
  const [dateError, setDateError] = useState('')


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

  // Time validation functions
  const parseCustomTime = (timeStr: string, period: string): { hours: number; minutes: number } | null => {
    if (!timeStr || !period) return null
    
    // Parse time like "2:30" or "2"
    const timeParts = timeStr.split(':')
    let hours = parseInt(timeParts[0])
    let minutes = timeParts[1] ? parseInt(timeParts[1]) : 0
    
    if (isNaN(hours) || isNaN(minutes)) return null
    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null

    if (period === 'PM' && hours !== 12) {
      hours += 12
    } else if (period === 'AM' && hours === 12) {
      hours = 0
    }
    return { hours, minutes }
  }

  const validateCustomTime = (timeStr: string, period: string): string => {
    if (!timeStr || !period) return ''
    
    const parsed = parseCustomTime(timeStr, period)
    if (!parsed) {
      return 'Please enter valid time (e.g., 2:30 or 2)'
    }
    
    return ''
  }

  const formatTimeInput = (value: string, isEndTime: boolean = false): string => {
    // Check for AM/PM in the input
    const hasAM = /am/i.test(value)
    const hasPM = /pm/i.test(value)

    // Set the period if detected in the input
    if (hasAM && !hasPM) {
      if (isEndTime) {
        setCustomEndPeriod('AM')
      } else {
        setCustomStartPeriod('AM')
      }
    } else if (hasPM && !hasAM) {
      if (isEndTime) {
        setCustomEndPeriod('PM')
      } else {
        setCustomStartPeriod('PM')
      }
    }

    // Remove any non-numeric characters except colon
    let cleaned = value.replace(/[^\d:]/g, '')

    // If user types a single digit (1-9), automatically add :00
    if (cleaned.length === 1 && /^[1-9]$/.test(cleaned)) {
      return cleaned + ':00'
    }

    // If user types two digits without colon, add :00
    if (cleaned.length === 2 && !cleaned.includes(':')) {
      const hour = parseInt(cleaned)
      // Only auto-format if it's a valid hour (1-12)
      if (hour >= 1 && hour <= 12) {
        return cleaned + ':00'
      }
    }

    // Handle cases like "8p" or "8pm" - should set PM and return "8:00"
    if (/^(\d{1,2})[p]/i.test(value)) {
      const hour = value.match(/^(\d{1,2})/)?.[1]
      if (hour) {
        if (isEndTime) {
          setCustomEndPeriod('PM')
        } else {
          setCustomStartPeriod('PM')
        }
        return hour + ':00'
      }
    }

    // Handle cases like "8a" or "8am" - should set AM and return "8:00"
    if (/^(\d{1,2})[a]/i.test(value)) {
      const hour = value.match(/^(\d{1,2})/)?.[1]
      if (hour) {
        if (isEndTime) {
          setCustomEndPeriod('AM')
        } else {
          setCustomStartPeriod('AM')
        }
        return hour + ':00'
      }
    }

    return cleaned
  }

  const validateCustomTimeRange = (): string => {
    if (!customStartTime || !customStartPeriod || !customEndTime || !customEndPeriod) {
      return ''
    }
    
    const startParsed = parseCustomTime(customStartTime, customStartPeriod)
    const endParsed = parseCustomTime(customEndTime, customEndPeriod)
    
    if (!startParsed || !endParsed) {
      return 'Please enter valid start and end times'
    }
    
    const startMinutes = startParsed.hours * 60 + startParsed.minutes
    const endMinutes = endParsed.hours * 60 + endParsed.minutes
    
    // Handle overnight events (e.g., 8 PM to 12 AM next day)
    const isOvernight = startParsed.hours >= 12 && endParsed.hours < 12
    
    if (!isOvernight && endMinutes <= startMinutes) {
      return 'End time must be after start time'
    }
    
    // For overnight events, check if the duration is reasonable (not more than 24 hours)
    if (isOvernight) {
      const duration = (24 * 60) - startMinutes + endMinutes
      if (duration > 24 * 60) {
        return 'Event duration cannot exceed 24 hours'
      }
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

  const timeValid = customStartTime && customStartPeriod && customEndTime && customEndPeriod && 
                   !validateCustomTimeRange()

  const valid = location.trim().length > 0 && date && hostName.trim().length > 0 && timeValid && !dateError

  function next(){
    if (valid) {
      const startMinutes = customStartTime.includes(':') ? customStartTime.split(':')[1] : '00'
      const endMinutes = customEndTime.includes(':') ? customEndTime.split(':')[1] : '00'
      const startTime = `${customStartTime.split(':')[0]}:${startMinutes.padStart(2, '0')} ${customStartPeriod}`
      const endTime = `${customEndTime.split(':')[0]}:${endMinutes.padStart(2, '0')} ${customEndPeriod}`
      
      
      const params = new URLSearchParams({
        eventType: eventType,
        location: location,
        date: date,
        hostName: hostName,
        timeRange: 'custom',
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
            {/* Display selected location info */}
            {location && (
              <div className="mt-2 bg-green-50 p-3 rounded-xl">
                <div className="text-sm font-medium text-green-800 mb-1">📍 Selected Location</div>
                <div className="text-sm text-green-700 flex items-center gap-2">
                  <span>🏙️</span>
                  <span>{location}</span>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  We'll find venues and services available in this area
                </div>
              </div>
            )}
          </Field>

          <Field label="Event Date">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="MM"
                  maxLength={2}
                  value={date.split('-')[1] || ''}
                  onChange={e => {
                    let month = e.target.value

                    // Limit to 2 digits
                    if (month.length > 2) {
                      month = month.slice(0, 2)
                    }

                    // Allow all input - no restrictions during typing
                    const currentDate = date.split('-')
                    const newDate = `${currentDate[0] || ''}-${month}-${currentDate[2] || ''}`
                    setDate(newDate)

                    // Clear errors while typing
                    setDateError('')
                  }}
                  onBlur={e => {
                    // Validate when user finishes typing
                    const currentDate = date.split('-')
                    
                    // Only validate if we have a complete date
                    if (currentDate[0] && currentDate[1] && currentDate[2]) {
                      const error = validateDate(currentDate[0], currentDate[1], currentDate[2])
                      setDateError(error)
                    } else {
                      setDateError('')
                    }
                  }}
                  className={`text-center text-base ${dateError ? 'border-red-500' : ''} ${!dateError && date && date.split('-')[0] && date.split('-')[1] && date.split('-')[2] && date.split('-')[0].length === 4 && date.split('-')[1].length === 2 && date.split('-')[2].length === 2 ? 'border-green-500' : ''}`}
                />
                <div className="text-xs text-gray-500 text-center mt-1">Month</div>
              </div>
              <div className="text-2xl text-gray-400">/</div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="DD"
                  maxLength={2}
                  value={date.split('-')[2] || ''}
                  onChange={e => {
                    let day = e.target.value

                    // Limit to 2 digits
                    if (day.length > 2) {
                      day = day.slice(0, 2)
                    }

                    // Allow all input - no restrictions during typing
                    const currentDate = date.split('-')
                    const newDate = `${currentDate[0] || ''}-${currentDate[1] || ''}-${day}`
                    setDate(newDate)

                    // Clear errors while typing
                    setDateError('')
                  }}
                  onBlur={e => {
                    // Validate when user finishes typing
                    const currentDate = date.split('-')
                    
                    // Only validate if we have a complete date
                    if (currentDate[0] && currentDate[1] && currentDate[2]) {
                      const error = validateDate(currentDate[0], currentDate[1], currentDate[2])
                      setDateError(error)
                    } else {
                      setDateError('')
                    }
                  }}
                  className={`text-center text-base ${dateError ? 'border-red-500' : ''} ${!dateError && date && date.split('-')[0] && date.split('-')[1] && date.split('-')[2] && date.split('-')[0].length === 4 && date.split('-')[1].length === 2 && date.split('-')[2].length === 2 ? 'border-green-500' : ''}`}
                />
                <div className="text-xs text-gray-500 text-center mt-1">Day</div>
              </div>
              <div className="text-2xl text-gray-400">/</div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="YYYY"
                  maxLength={4}
                  value={date.split('-')[0] || ''}
                  onChange={e => {
                    let year = e.target.value
                    
                    // Limit to 4 digits
                    if (year.length > 4) {
                      year = year.slice(0, 4)
                    }
                    
                    // Allow all input - no restrictions during typing
                    const currentDate = date.split('-')
                    const newDate = `${year}-${currentDate[1] || ''}-${currentDate[2] || ''}`
                    setDate(newDate)
                    
                    // Clear errors while typing
                    setDateError('')
                  }}
                  onBlur={e => {
                    // Validate when user finishes typing
                    const currentDate = date.split('-')
                    
                    // Only validate if we have a complete date
                    if (currentDate[0] && currentDate[1] && currentDate[2]) {
                      const error = validateDate(currentDate[0], currentDate[1], currentDate[2])
                      setDateError(error)
                    } else {
                      setDateError('')
                    }
                  }}
                  className={`text-center text-base ${dateError ? 'border-red-500' : ''} ${!dateError && date && date.split('-')[0] && date.split('-')[1] && date.split('-')[2] && date.split('-')[0].length === 4 && date.split('-')[1].length === 2 && date.split('-')[2].length === 2 ? 'border-green-500' : ''}`}
                />
                <div className="text-xs text-gray-500 text-center mt-1">Year</div>
              </div>
            </div>
            {dateError && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                ⚠️ {dateError}
              </div>
            )}
            {!dateError && date && date.split('-')[0] && date.split('-')[1] && date.split('-')[2] && 
             date.split('-')[0].length === 4 && date.split('-')[1].length === 2 && date.split('-')[2].length === 2 && (
              <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg flex items-center gap-2">
                ✅ Valid date selected
              </div>
            )}
          </Field>

          <Field label="Event Time">
            <div className="space-y-4">
              {/* Quick Time Presets */}
              <div className="bg-blue-50 p-3 rounded-xl">
                <div className="text-sm font-medium text-blue-800 mb-2">⏰ Quick Time Options</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomStartTime('10:00')
                      setCustomStartPeriod('AM')
                      setCustomEndTime('2:00')
                      setCustomEndPeriod('PM')
                    }}
                    className="text-xs bg-white border border-blue-200 rounded-lg p-2 hover:bg-blue-50 transition-colors"
                  >
                    Morning: 10AM - 2PM
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomStartTime('2:00')
                      setCustomStartPeriod('PM')
                      setCustomEndTime('6:00')
                      setCustomEndPeriod('PM')
                    }}
                    className="text-xs bg-white border border-blue-200 rounded-lg p-2 hover:bg-blue-50 transition-colors"
                  >
                    Afternoon: 2PM - 6PM
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomStartTime('6:00')
                      setCustomStartPeriod('PM')
                      setCustomEndTime('10:00')
                      setCustomEndPeriod('PM')
                    }}
                    className="text-xs bg-white border border-blue-200 rounded-lg p-2 hover:bg-blue-50 transition-colors"
                  >
                    Evening: 6PM - 10PM
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomStartTime('7:00')
                      setCustomStartPeriod('PM')
                      setCustomEndTime('12:00')
                      setCustomEndPeriod('AM')
                    }}
                    className="text-xs bg-white border border-blue-200 rounded-lg p-2 hover:bg-blue-50 transition-colors"
                  >
                    Night: 7PM - 12AM
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Start Time">
                  <select
                    value={customStartTime && customStartPeriod ? `${customStartTime} ${customStartPeriod}` : ''}
                    onChange={e => {
                      const [time, period] = e.target.value.split(' ')
                      setCustomStartTime(time)
                      setCustomStartPeriod(period)
                    }}
                    className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300 text-base"
                  >
                    <option value="">Select start time</option>
                    <option value="6:00 AM">6:00 AM</option>
                    <option value="7:00 AM">7:00 AM</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                    <option value="11:00 PM">11:00 PM</option>
                  </select>
                </Field>

                <Field label="End Time">
                  <select
                    value={customEndTime && customEndPeriod ? `${customEndTime} ${customEndPeriod}` : ''}
                    onChange={e => {
                      const [time, period] = e.target.value.split(' ')
                      setCustomEndTime(time)
                      setCustomEndPeriod(period)
                    }}
                    className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300 text-base"
                  >
                    <option value="">Select end time</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                    <option value="11:00 PM">11:00 PM</option>
                    <option value="12:00 AM">12:00 AM</option>
                    <option value="1:00 AM">1:00 AM</option>
                    <option value="2:00 AM">2:00 AM</option>
                  </select>
                </Field>
              </div>

              {/* Display selected time range */}
              {customStartTime && customStartPeriod && customEndTime && customEndPeriod && !validateCustomTimeRange() && (
                <div className="bg-green-50 p-3 rounded-xl">
                  <div className="text-sm font-medium text-green-800 mb-1">✅ Selected Time</div>
                  <div className="text-sm text-green-700">
                    {customStartTime} {customStartPeriod} - {customEndTime} {customEndPeriod}
                  </div>
                </div>
              )}

              {validateCustomTimeRange() && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                  ⚠️ {validateCustomTimeRange()}
                </div>
              )}

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                💡 Select times from dropdowns or use quick preset buttons above
              </div>
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
