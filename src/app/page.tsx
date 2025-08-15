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

export default function Onboarding() {
  const router = useRouter()
  return (
    <div className="max-w-md mx-auto min-h-screen bg-white">
      {/* Hero Section */}
      <div className="text-center py-16 px-6">
        <div className={`${BrandText} text-5xl font-black tracking-wide mb-2`}>EVENTSINSTA</div>
        <div className="text-purple-500 text-xs tracking-wide mb-4">Plan. Create. Celebrate</div>
        <div className="text-xl font-semibold mb-2">Your All-in-One Event Planning Solution</div>
      </div>

      {/* What is EventsInsta Section */}
      <div className="px-6 mb-8">
        <div className="text-center mb-4">
          <div className="text-2xl font-bold">WHAT IS EVENTSINSTA?</div>
        </div>
        <div className="text-sm text-gray-700 leading-relaxed">
          <p className="mb-4">
            Eventsinsta is a powerful event planning app that connects you to the best
            nightclubs, bars, restaurants, sporting venues, spas, wedding venues, event
            spaces, and more in every city.
          </p>
          <p>
            With a set budget, event type, date, and location, you'll get curated venue
            options and premium services—all in one place.
          </p>
        </div>
      </div>

      {/* 5 Steps Section */}
      <div className="px-6 mb-8">
        <div className="text-center mb-6">
          <div className="text-xl font-bold">PLAN YOUR EVENT IN 5 STEPS</div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div className="text-sm font-medium">Select Event Type</div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div className="text-sm font-medium">Enter Location & Date</div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <div className="text-sm font-medium">Add Guest Count & Budget</div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
            <div className="text-sm font-medium">View Matching Venues & Services</div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
            <div className="text-sm font-medium">Book & Celebrate!</div>
          </div>
        </div>
      </div>

      {/* Occasions Section */}
      <div className="px-6 mb-8">
        <div className="text-center mb-4">
          <div className="text-xl font-bold">CELEBRATE EVERY OCCASION</div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg text-center">Birthdays</div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">Graduation</div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">Anniversary</div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">Job Promotion</div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">Vacation</div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">Sporting Venues</div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">Corporate Events</div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">Weddings</div>
        </div>
        <div className="text-xs text-gray-600 mt-3 text-center">
          No matter the occasion, Eventsinsta ensures every celebration is unforgettable and tailored to your budget and vision.
        </div>
      </div>

      {/* Services Section */}
      <div className="px-6 mb-8">
        <div className="text-center mb-4">
          <div className="text-xl font-bold">EVERYTHING YOU NEED IN ONE PLACE</div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-gray-50 rounded text-center">Security</div>
          <div className="p-2 bg-gray-50 rounded text-center">Food Vendors</div>
          <div className="p-2 bg-gray-50 rounded text-center">Photographer</div>
          <div className="p-2 bg-gray-50 rounded text-center">Make-up Artist</div>
          <div className="p-2 bg-gray-50 rounded text-center">Videographer</div>
          <div className="p-2 bg-gray-50 rounded text-center">Barbers</div>
          <div className="p-2 bg-gray-50 rounded text-center">Host and DJ</div>
          <div className="p-2 bg-gray-50 rounded text-center">Luxury Car Rentals</div>
          <div className="p-2 bg-gray-50 rounded text-center">Car Service</div>
          <div className="p-2 bg-gray-50 rounded text-center">Party Buses</div>
          <div className="p-2 bg-gray-50 rounded text-center">Bartenders</div>
          <div className="p-2 bg-gray-50 rounded text-center">Celebrity Host</div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="px-6 mb-8">
        <div className="text-center mb-4">
          <div className="text-xl font-bold">THE SMARTER WAY TO PLAN</div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span>Save time and effort</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span>Stay within budget</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span>Book all services in one app</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span>Access to exclusive venues</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span>Professional event coordination</span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 pb-8">
        <div className="text-center mb-6">
          <div className="text-xl font-bold mb-2">YOUR EVENT, YOUR WAY</div>
          <div className="text-sm text-gray-600 mb-4">
            Start planning today with <span className="font-semibold">Eventsinsta</span><br/>
            where unforgettable events begin.
          </div>
        </div>
        <Button onClick={() => router.push('/signup')}>Get Started Now</Button>
        
        {/* Contact Info */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <div>info@eventsinsta.com</div>
          <div>www.eventsinsta.com</div>
        </div>
      </div>
    </div>
  )
}
