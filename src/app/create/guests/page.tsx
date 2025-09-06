'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
        <div className="text-2xl font-semibold">{step} of 7: {title}</div>
      </div>
      <div className="w-full h-1 bg-gray-200">
        <div className="h-1 bg-green-500" style={{ width: pct + '%' }} />
      </div>
    </div>
  )
}

const BUDGET_RANGES = [
  { id: 'budget-1', range: '$500 - $1,000', description: 'Small gatherings' },
  { id: 'budget-2', range: '$1,000 - $3,000', description: 'Medium events' },
  { id: 'budget-3', range: '$3,000 - $5,000', description: 'Large celebrations' },
  { id: 'budget-4', range: '$5,000+', description: 'Premium events' },
]

function GuestsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [guestCount, setGuestCount] = useState('')
  const [selectedBudget, setSelectedBudget] = useState('')
  const [customMinBudget, setCustomMinBudget] = useState('')
  const [customMaxBudget, setCustomMaxBudget] = useState('')
  const [eventType, setEventType] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  useEffect(() => {
    // Get previous parameters from URL
    const eventTypeParam = searchParams.get('eventType')
    const locationParam = searchParams.get('location')
    const dateParam = searchParams.get('date')
    const timeParam = searchParams.get('time')
    
    if (eventTypeParam) setEventType(eventTypeParam)
    if (locationParam) setLocation(locationParam)
    if (dateParam) setDate(dateParam)
    if (timeParam) setTime(timeParam)
  }, [searchParams])

  const valid = guestCount && selectedBudget && (selectedBudget !== 'custom' || (customMinBudget && customMaxBudget && parseInt(customMinBudget) > 0 && parseInt(customMaxBudget) > 0 && parseInt(customMinBudget) < parseInt(customMaxBudget)))

  function next(){
    if (valid) {
      let budgetParam = selectedBudget
      if (selectedBudget === 'custom') {
        budgetParam = `custom-${parseInt(customMinBudget)}-${parseInt(customMaxBudget)}`
      }
      
      const params = new URLSearchParams({
        eventType: eventType,
        location: location,
        date: date,
        time: time,
        guestCount: guestCount,
        budget: budgetParam
      })
      router.push(`/create/venue?${params.toString()}`)
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={3} title="Guest Count & Budget" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">How many guests and what's your budget?</h2>
          <p className="text-sm text-gray-600">This helps us find the perfect venues and services for your event</p>
          {eventType && location && (
            <div className="mt-2 text-sm text-purple-600 font-medium">
              Planning: {eventType} in {location}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Field label="Number of Guests">
            <Input 
              type="number" 
              value={guestCount} 
              onChange={e=>setGuestCount(e.target.value)} 
              placeholder="e.g., 50" 
              min="1"
            />
          </Field>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Budget Range</div>
            <div className="grid gap-3">
              {BUDGET_RANGES.map((budget) => (
                <button
                  key={budget.id}
                  className={`w-full p-4 cursor-pointer transition-all rounded-2xl bg-white shadow ${
                    selectedBudget === budget.id 
                      ? 'border-2 border-purple-600 bg-purple-50' 
                      : 'border border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedBudget(budget.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{budget.range}</div>
                      <div className="text-xs text-gray-600">{budget.description}</div>
                    </div>
                    {selectedBudget === budget.id && (
                      <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Budget Range Input */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Custom Budget Range</div>
            <div className="bg-white rounded-2xl p-4 shadow border border-gray-200">
              <div className="text-xs text-gray-600 mb-3">
                Set your own custom budget range (minimum $100)
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Minimum ($)</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={customMinBudget}
                    onChange={(e) => {
                      const value = e.target.value
                      setCustomMinBudget(value)
                    }}
                    min="100"
                    step="100"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Maximum ($)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={customMaxBudget}
                    onChange={(e) => {
                      const value = e.target.value
                      setCustomMaxBudget(value)
                    }}
                    min="100"
                    step="100"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                  />
                </div>
              </div>
              {customMinBudget && customMaxBudget && parseInt(customMinBudget) > 0 && parseInt(customMaxBudget) > 0 && (
                <div className="mt-3 text-sm text-purple-600 font-medium">
                  Your Custom Budget: ${parseInt(customMinBudget).toLocaleString()} - ${parseInt(customMaxBudget).toLocaleString()}
                </div>
              )}
              {customMinBudget && customMaxBudget && parseInt(customMinBudget) >= parseInt(customMaxBudget) && (
                <div className="mt-2 text-xs text-red-600">
                  Maximum must be greater than minimum
                </div>
              )}
              <button
                onClick={() => setSelectedBudget('custom')}
                disabled={!customMinBudget || !customMaxBudget || parseInt(customMinBudget) < 100 || parseInt(customMaxBudget) <= parseInt(customMinBudget)}
                className={`w-full mt-3 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  selectedBudget === 'custom' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {selectedBudget === 'custom' ? '✓ Custom Budget Selected' : 'Use Custom Budget'}
              </button>
            </div>
          </div>
        </div>



        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="text-sm font-medium text-purple-800 mb-2">💰 Budget Tip</div>
          <div className="text-xs text-purple-700">
            Your budget helps us match you with venues and services that fit your financial plan. We'll show you options within your range.
          </div>
        </div>

        <Button onClick={next} disabled={!valid}>
          Next: View Matching Venues & Services
        </Button>
      </div>
    </div>
  )
}

export default function Guests() {
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
      <GuestsContent />
    </Suspense>
  )
}
