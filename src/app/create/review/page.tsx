'use client'

import { useMemo } from 'react'
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

function BackBtn() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="w-9 h-9 grid place-items-center rounded-full hover:bg-gray-100" aria-label="Back">
      ←
    </button>
  )
}

function StepHeader({ step, title }: { step: number; title: string }) {
  const pct = (step / 5) * 100
  return (
    <div className="sticky top-0 bg-white z-10">
      <div className="flex items-center gap-2 p-4">
        <BackBtn />
        <div className="text-2xl font-semibold">{step} of 5: {title}</div>
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

export default function ReviewSend() {
  const router = useRouter()
  const totalPrice = useMemo(() => 2500 + 2250 + 800 + 1200, []) // Venue + Catering + DJ + Photography

  function bookEvent(){
    // In a real app, this would process the booking
    router.push('/create/success')
  }

  function saveForLater(){
    // In a real app, this would save the event details
    router.push('/home')
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={5} title="Book & Celebrate!" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Ready to book your perfect event?</h2>
          <p className="text-sm text-gray-600">Review your selections and complete your booking</p>
        </div>

        {/* Event Summary */}
        <Card className="p-4">
          <div className="font-semibold mb-3">Event Summary</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Event Type:</span>
              <span className="font-medium">Birthday Party</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="font-medium">New York, NY</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span className="font-medium">Dec 15, 2024 at 7:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Guests:</span>
              <span className="font-medium">50 people</span>
            </div>
            <div className="flex justify-between">
              <span>Budget Range:</span>
              <span className="font-medium">$1,000 - $3,000</span>
            </div>
          </div>
        </Card>

        {/* Selected Venues & Services */}
        <Card className="p-4">
          <div className="font-semibold mb-3">Your Selections</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-sm">The Grand Ballroom</div>
                <div className="text-xs text-gray-600">Wedding Venue</div>
              </div>
              <div className="text-sm font-medium">$2,500</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-sm">Elite Catering</div>
                <div className="text-xs text-gray-600">Food & Beverage (50 guests)</div>
              </div>
              <div className="text-sm font-medium">$2,250</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-sm">DJ Master Pro</div>
                <div className="text-xs text-gray-600">Entertainment</div>
              </div>
              <div className="text-sm font-medium">$800</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-sm">Capture Moments</div>
                <div className="text-xs text-gray-600">Photography</div>
              </div>
              <div className="text-sm font-medium">$1,200</div>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center font-semibold">
                <span>Total:</span>
                <span className="text-lg">${totalPrice.toLocaleString()}</span>
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
          <Button onClick={bookEvent}>
            Book Now - ${totalPrice.toLocaleString()}
          </Button>
          <GhostButton onClick={saveForLater}>
            Save for Later
          </GhostButton>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Secure booking with instant confirmation. Cancel up to 48 hours before your event.
        </div>
      </div>
    </div>
  )
}
