'use client'

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

function GhostButton({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`w-full h-14 rounded-2xl border border-gray-300 font-semibold ${className}`}>{children}</button>
  )
}

export default function Success() {
  const router = useRouter()
  return (
    <div className="max-w-md mx-auto min-h-screen grid place-items-center p-6 text-center bg-gray-50">
      <div className="w-full">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">Your event is officially booked and ready to celebrate!</p>
        
        <div className="bg-white rounded-2xl p-6 mb-6 shadow">
          <div className="text-sm font-medium text-gray-800 mb-3">Event Details</div>
          <div className="space-y-2 text-sm text-gray-600">
            <div>🎉 Birthday Party</div>
            <div>📍 The Grand Ballroom, New York</div>
            <div>📅 Dec 15, 2024 at 7:00 PM</div>
            <div>👥 50 guests</div>
            <div className="font-medium text-purple-600">💰 $6,750 total</div>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={()=>router.push('/home')}>
            View My Events
          </Button>
          <GhostButton onClick={()=>router.push('/create/customize')}>
            Plan Another Event
          </GhostButton>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <div>You'll receive a confirmation email shortly</div>
          <div>Our team will contact you within 24 hours</div>
        </div>
      </div>
    </div>
  )
}
