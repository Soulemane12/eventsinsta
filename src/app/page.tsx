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
