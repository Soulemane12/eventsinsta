'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '../../components/Logo'

function GradientButton({ children, className = '', disabled, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 shadow-md hover:shadow-lg'
  }

  return (
    <button
      {...props}
      disabled={disabled}
      className={`w-full h-14 rounded-2xl font-bold transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:transform-none ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

function EnhancedCard({ children, className = '', hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`rounded-2xl bg-white shadow-lg border border-gray-100 ${hover ? 'hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  )
}



function BottomNav() {
  const item = (to: string, label: string, symbol: string) => (
    <Link href={to} className={`flex-1 py-4 text-center transition-all duration-300 ${to === '/home' ? 'text-purple-700 bg-purple-50' : 'text-gray-500 hover:text-purple-600 hover:bg-gray-50'}`}>
      <div className="text-xl mb-1">{symbol}</div>
      <div className="text-xs font-medium">{label}</div>
    </Link>
  )
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 flex shadow-lg">
      {item('/home','Home','🏠')}
      {item('/create/customize','Plan','✨')}
      {item('/profile','Account','👤')}
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  return (
    <div className="max-w-md mx-auto min-h-screen pb-24 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50">
      {/* Header with animated background */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white p-6 rounded-b-3xl shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <Logo size="lg" className="drop-shadow-lg" />
          <div>
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="text-purple-100 text-sm">Ready to create something amazing?</p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => router.push('/create/customize')}
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-4 rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-2xl mb-1">✨</div>
            <div className="font-semibold text-sm">Plan Event</div>
          </button>
          <button
            onClick={() => router.push('/my-events')}
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-4 rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-2xl mb-1">📅</div>
            <div className="font-semibold text-sm">My Events</div>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Hero CTA Card */}
        <EnhancedCard className="mt-6 p-6 bg-gradient-to-br from-white to-purple-50 border-purple-200">
          <div className="text-center">
            <div className="text-3xl mb-3">🎉</div>
            <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
              Ready for your next celebration?
            </h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Let's find the perfect venues and services for your unforgettable event!
            </p>
            <GradientButton onClick={() => router.push('/create/customize')}>
              Start Planning ✨
            </GradientButton>
          </div>
        </EnhancedCard>

        <section className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Quick Start</h2>
            <div className="text-xl">🚀</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🎉', title: 'Birthday Party', desc: 'Venues & services', gradient: 'from-pink-400 to-purple-500' },
              { icon: '💒', title: 'Wedding', desc: 'Dream venues', gradient: 'from-purple-400 to-pink-500' },
              { icon: '🏢', title: 'Corporate', desc: 'Professional spaces', gradient: 'from-blue-400 to-purple-500' },
              { icon: '🎓', title: 'Graduation', desc: 'Celebration venues', gradient: 'from-green-400 to-blue-500' }
            ].map((item, index) => (
              <EnhancedCard key={index} className="p-4 text-center cursor-pointer group">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <div className="font-semibold text-sm mb-1">{item.title}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </EnhancedCard>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Your Events</h2>
            <div className="text-xl">📋</div>
          </div>
          <EnhancedCard className="p-6 text-center bg-gradient-to-br from-gray-50 to-white">
            <div className="text-4xl mb-3 opacity-50">📅</div>
            <div className="font-bold text-lg mb-2">No Events Yet</div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Start planning your first event and discover amazing venues and services tailored to your needs.
            </p>
            <GradientButton
              variant="secondary"
              onClick={() => router.push('/create/customize')}
              className="!w-auto px-6"
            >
              Create Your First Event
            </GradientButton>
          </EnhancedCard>
        </section>

        <section className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Popular Services</h2>
            <div className="text-xl">⭐</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <EnhancedCard className="p-4 text-center cursor-pointer group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">📸</div>
              <div className="text-xs font-semibold">Photography</div>
            </EnhancedCard>
            <EnhancedCard className="p-4 text-center cursor-pointer group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🎵</div>
              <div className="text-xs font-semibold">DJ Services</div>
            </EnhancedCard>
            <EnhancedCard className="p-4 text-center cursor-pointer group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🍽️</div>
              <div className="text-xs font-semibold">Catering</div>
            </EnhancedCard>
            <EnhancedCard className="p-4 text-center cursor-pointer group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🚗</div>
              <div className="text-xs font-semibold">Transport</div>
            </EnhancedCard>
            <EnhancedCard className="p-4 text-center cursor-pointer group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">💄</div>
              <div className="text-xs font-semibold">Makeup</div>
            </EnhancedCard>
            <EnhancedCard className="p-4 text-center cursor-pointer group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🏛️</div>
              <div className="text-xs font-semibold">Venues</div>
            </EnhancedCard>
          </div>
        </section>
      </div>
      <BottomNav />
    </div>
  )
}
