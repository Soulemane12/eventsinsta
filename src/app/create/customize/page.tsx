'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

const EVENT_TYPES = [
  { id: 'birthday', name: 'Birthday Party', icon: '🎉', description: 'Celebrate special moments' },
  { id: 'wedding', name: 'Wedding', icon: '💒', description: 'Your perfect day' },
  { id: 'corporate', name: 'Corporate Event', icon: '🏢', description: 'Professional gatherings' },
  { id: 'graduation', name: 'Graduation', icon: '🎓', description: 'Academic achievements' },
  { id: 'anniversary', name: 'Anniversary', icon: '💕', description: 'Milestone celebrations' },
  { id: 'holiday-party', name: 'Holiday Party', icon: '🎄', description: 'Festive celebrations' },
  { id: 'vacation', name: 'Vacation', icon: '✈️', description: 'Travel experiences' },
  { id: 'sporting', name: 'Sporting Event', icon: '⚽', description: 'Sports and recreation' },
  { id: 'networking', name: 'Networking Mixer', icon: '🤝', description: 'Professional connections' },
]

export default function Customize() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('')

  function next() {
    if (selectedType) {
      const eventTypeName = EVENT_TYPES.find(type => type.id === selectedType)?.name || selectedType
      router.push(`/create/details?eventType=${encodeURIComponent(eventTypeName)}`)
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={1} title="Select Event Type" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">What type of event are you planning?</h2>
          <p className="text-sm text-gray-600">Choose the event type that best matches your celebration</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {EVENT_TYPES.map((type) => (
            <button
              key={type.id}
              className={`w-full p-4 text-center cursor-pointer transition-all rounded-2xl bg-white shadow ${
                selectedType === type.id 
                  ? 'border-2 border-purple-600 bg-purple-50' 
                  : 'border border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <div className="font-semibold text-sm mb-1">{type.name}</div>
              <div className="text-xs text-gray-600">{type.description}</div>
              {selectedType === type.id && (
                <div className="mt-2">
                  <div className="w-4 h-4 bg-purple-600 rounded-full mx-auto flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <Button onClick={next} disabled={!selectedType}>
            Next: Location & Date
          </Button>
        </div>
      </div>
    </div>
  )
}
