'use client'

import { useRouter } from 'next/navigation'
import Logo from '../components/Logo'

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

function FloatingElement({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="animate-pulse"
      style={{ animationDelay: `${delay}s`, animationDuration: '3s' }}
    >
      {children}
    </div>
  )
}

export default function Onboarding() {
  const router = useRouter()
  return (
    <div className="max-w-md mx-auto min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-32 right-8 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-25 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-6 w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-30 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 right-12 w-24 h-24 bg-gradient-to-br from-purple-300 to-blue-300 rounded-full opacity-15 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
      </div>

      {/* Centered Logo Section */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="text-center">
          <FloatingElement>
            <Logo size="3xl" className="justify-center mb-8 drop-shadow-lg" />
          </FloatingElement>
          <FloatingElement delay={0.5}>
            <div className="text-6xl font-black tracking-wide mb-4 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
              EVENTSINSTA
            </div>
          </FloatingElement>
          <FloatingElement delay={1}>
            <div className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wide mb-8">
              Plan. Create. Celebrate.
            </div>
          </FloatingElement>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <FloatingElement delay={1.5}>
              <div className="text-center">
                <div className="text-3xl mb-2">🎉</div>
                <div className="text-xs font-semibold text-purple-700">Events</div>
              </div>
            </FloatingElement>
            <FloatingElement delay={2}>
              <div className="text-center">
                <div className="text-3xl mb-2">🏛️</div>
                <div className="text-xs font-semibold text-purple-700">Venues</div>
              </div>
            </FloatingElement>
            <FloatingElement delay={2.5}>
              <div className="text-center">
                <div className="text-3xl mb-2">✨</div>
                <div className="text-xs font-semibold text-purple-700">Services</div>
              </div>
            </FloatingElement>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="px-6 pb-8 relative z-10">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            YOUR EVENT, YOUR WAY
          </div>
          <div className="text-base text-gray-700 mb-6 leading-relaxed">
            Start planning today with <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">EventsInsta</span><br/>
            where unforgettable events begin.
          </div>
        </div>

        <div className="space-y-4">
          <GradientButton onClick={() => router.push('/signup')}>
            Get Started Now ✨
          </GradientButton>

          <button
            onClick={() => router.push('/signin')}
            className="w-full h-14 rounded-2xl border-2 border-purple-300 text-purple-700 font-semibold hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 hover:shadow-md"
          >
            Already have an account?
          </button>
        </div>
      </div>
    </div>
  )
}
