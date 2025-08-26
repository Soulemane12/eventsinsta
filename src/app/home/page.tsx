'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white shadow ${className}`}>{children}</div>
}

function BottomNav() {
  const item = (to: string, label: string, symbol: string) => (
    <Link href={to} className={`flex-1 py-3 text-center ${to === '/home' ? BrandText : 'text-gray-500'}`}>{symbol}<div className="text-sm">{label}</div></Link>
  )
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex">
      {item('/home','Home','🏠')}
      {item('/create/customize','Plan','➕')}
      {item('/profile','Account','👤')}
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  return (
    <div className="max-w-md mx-auto min-h-screen pb-24 bg-gray-50">
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to EventsInsta!</h1>
        </div>
        <Card className="mt-4 p-5 bg-purple-100">
          <div className="text-gray-700">Ready to plan your next unforgettable event? Let's find the perfect venues and services for you!</div>
          <div className="mt-4"><Button onClick={()=>router.push('/create/customize')} className="!h-12">Plan an Event</Button></div>
        </Card>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Quick Start</h2>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Card className="p-4 text-center">
              <div className={`${BrandText} text-2xl mb-2`}>🎉</div>
              <div className="font-semibold text-sm">Birthday Party</div>
              <div className="text-xs text-gray-600 mt-1">Find venues & services</div>
            </Card>
            <Card className="p-4 text-center">
              <div className={`${BrandText} text-2xl mb-2`}>💒</div>
              <div className="font-semibold text-sm">Wedding</div>
              <div className="text-xs text-gray-600 mt-1">Venues & coordination</div>
            </Card>
            <Card className="p-4 text-center">
              <div className={`${BrandText} text-2xl mb-2`}>🏢</div>
              <div className="font-semibold text-sm">Corporate Event</div>
              <div className="text-xs text-gray-600 mt-1">Professional venues</div>
            </Card>
            <Card className="p-4 text-center">
              <div className={`${BrandText} text-2xl mb-2`}>🎓</div>
              <div className="font-semibold text-sm">Graduation</div>
              <div className="text-xs text-gray-600 mt-1">Celebration venues</div>
            </Card>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Your Events</h2>
          <Card className="mt-3 p-4 flex gap-4 items-start">
            <div className={`${BrandText} text-2xl`}>📅</div>
            <div>
              <div className="font-semibold">No Events Yet</div>
              <p className="text-sm text-gray-600">Start planning your first event and discover amazing venues and services tailored to your needs.</p>
            </div>
          </Card>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Popular Services</h2>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <Card className="p-3 text-center">
              <div className="text-lg mb-1">📸</div>
              <div className="text-xs font-medium">Photographer</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-lg mb-1">🎵</div>
              <div className="text-xs font-medium">DJ</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-lg mb-1">🍽️</div>
              <div className="text-xs font-medium">Catering</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-lg mb-1">🚗</div>
              <div className="text-xs font-medium">Transport</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-lg mb-1">💄</div>
              <div className="text-xs font-medium">Makeup</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-lg mb-1">🎪</div>
              <div className="text-xs font-medium">Venues</div>
            </Card>
          </div>
        </section>
      </div>
      <BottomNav />
    </div>
  )
}
