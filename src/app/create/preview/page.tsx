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

const VENUES = [
  { id: '1', name: 'The Grand Ballroom', type: 'Wedding Venue', rating: 4.8, price: '$2,500', image: '🏛️' },
  { id: '2', name: 'Skyline Rooftop', type: 'Event Space', rating: 4.6, price: '$1,800', image: '🏙️' },
  { id: '3', name: 'Garden Plaza', type: 'Outdoor Venue', rating: 4.7, price: '$1,200', image: '🌺' },
]

const SERVICES = [
  { id: '1', name: 'Elite Catering', type: 'Food & Beverage', rating: 4.9, price: '$45/person', image: '🍽️' },
  { id: '2', name: 'DJ Master Pro', type: 'Entertainment', rating: 4.7, price: '$800', image: '🎵' },
  { id: '3', name: 'Capture Moments', type: 'Photography', rating: 4.8, price: '$1,200', image: '📸' },
]

export default function Preview() {
  const router = useRouter()

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={4} title="View Matching Venues & Services" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Perfect matches for your event!</h2>
          <p className="text-sm text-gray-600">Based on your preferences, here are the best venues and services</p>
        </div>

        {/* Event Summary */}
        <Card className="p-4 bg-purple-50">
          <div className="text-sm font-medium text-purple-800 mb-2">Your Event Details</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>🎉 Birthday Party</div>
            <div>📍 New York, NY</div>
            <div>📅 Dec 15, 2024</div>
            <div>👥 50 guests</div>
            <div>💰 $1,000 - $3,000</div>
          </div>
        </Card>

        {/* Venues Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Recommended Venues</h3>
          <div className="space-y-3">
            {VENUES.map((venue) => (
              <Card key={venue.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{venue.image}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{venue.name}</div>
                    <div className="text-xs text-gray-600">{venue.type}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-xs text-yellow-600">⭐ {venue.rating}</div>
                      <div className="text-xs font-medium text-purple-600">{venue.price}</div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                    View
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Recommended Services</h3>
          <div className="space-y-3">
            {SERVICES.map((service) => (
              <Card key={service.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{service.image}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{service.name}</div>
                    <div className="text-xs text-gray-600">{service.type}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-xs text-yellow-600">⭐ {service.rating}</div>
                      <div className="text-xs font-medium text-purple-600">{service.price}</div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                    View
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-xl">
          <div className="text-sm font-medium text-green-800 mb-2">✅ Perfect Match</div>
          <div className="text-xs text-green-700">
            All venues and services are available for your date and within your budget range.
          </div>
        </div>

        <Button onClick={()=>router.push('/create/review')}>
          Next: Book & Celebrate!
        </Button>
      </div>
    </div>
  )
}
