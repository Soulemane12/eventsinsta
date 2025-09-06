'use client'

import { useRouter } from 'next/navigation'
import Logo from '../components/Logo'

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
    <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col">
      {/* Centered Logo Section */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <Logo size="lg" className="justify-center mb-6" />
          <div className={`${BrandText} text-5xl font-black tracking-wide mb-2`}>EVENTSINSTA</div>
          <div className="text-purple-500 text-xs tracking-wide mb-4">Plan. Create. Celebrate</div>
        </div>
      </div>

      {/* Bottom CTA Section */}
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
        
        
      </div>
    </div>
  )
}
