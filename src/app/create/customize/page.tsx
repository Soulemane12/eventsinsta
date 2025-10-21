'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '../../../components/Logo'

function GradientButton({ children, className = '', disabled, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`w-full h-16 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:transform-none ${className}`}
    >
      {children}
    </button>
  )
}

function BackBtn() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="w-10 h-10 grid place-items-center rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300"
      aria-label="Back"
    >
      <span className="text-gray-700">←</span>
    </button>
  )
}

function StepHeader({ step, title }: { step: number; title: string }) {
  const pct = (step / 6) * 100
  return (
    <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 z-10 shadow-lg">
      <div className="flex items-center gap-3 p-4 text-white">
        <BackBtn />
        <Logo size="md" className="drop-shadow-lg" />
        <div className="text-xl font-bold">{step} of 6: {title}</div>
      </div>
      <div className="w-full h-2 bg-white/20">
        <div
          className="h-2 bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out"
          style={{ width: pct + '%' }}
        />
      </div>
    </div>
  )
}

function EnhancedCard({ children, className = '', selected = false }: { children: React.ReactNode; className?: string; selected?: boolean }) {
  return (
    <div className={`rounded-2xl bg-white shadow-lg border-2 transition-all duration-300 ${
      selected
        ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl scale-[1.02]'
        : 'border-gray-100 hover:border-purple-300 hover:shadow-xl hover:scale-[1.02]'
    } ${className}`}>
      {children}
    </div>
  )
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
  { id: 'kids-event', name: 'Kid\'s Event', icon: '🧸', description: 'Fun for the little ones' },
  { id: 'networking', name: 'Networking Mixer', icon: '🤝', description: 'Professional connections' },
  { id: 'ladies-night', name: 'Ladies Night Out', icon: '💃', description: 'Fun night out for the ladies' },
  { id: 'gentlemen-night', name: 'Gentlemen\'s Night Out', icon: '🕺', description: 'Sophisticated night for gentlemen' },
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
    <div className="max-w-md mx-auto min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50">
      <StepHeader step={1} title="Select Event Type" />
      <div className="p-6 space-y-8">
        <div className="text-center">
          <div className="text-5xl mb-4">✨</div>
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
            What type of event are you planning?
          </h2>
          <p className="text-gray-600 leading-relaxed">Choose the event type that best matches your celebration</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {EVENT_TYPES.map((type, index) => (
            <EnhancedCard
              key={type.id}
              selected={selectedType === type.id}
              className="cursor-pointer group"
            >
              <button
                className="w-full p-5 text-center"
                onClick={() => setSelectedType(type.id)}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {type.icon}
                </div>
                <div className="font-bold text-sm mb-2">{type.name}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{type.description}</div>
                {selectedType === type.id && (
                  <div className="mt-3 animate-pulse">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </button>
            </EnhancedCard>
          ))}
        </div>

        <div className="mt-10">
          <GradientButton
            onClick={next}
            disabled={!selectedType}
            className={selectedType ? 'animate-pulse' : ''}
          >
            {selectedType ? '✨ Next: Location & Date' : 'Select an Event Type'}
          </GradientButton>
        </div>

        {selectedType && (
          <div className="text-center animate-fade-in">
            <p className="text-sm text-gray-500">
              Great choice! Let's plan your{' '}
              <span className="font-semibold text-purple-600">
                {EVENT_TYPES.find(type => type.id === selectedType)?.name}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
