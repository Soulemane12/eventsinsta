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
    <div className="max-w-md mx-auto min-h-screen pb-24">
      <div className="p-6">
        <h1 className="text-3xl font-bold">Hello Jared!</h1>
        <Card className="mt-4 p-5 bg-purple-100">
          <div className="text-gray-700">Now that you are all set, let's make your events extraordinary, starting right here!</div>
          <div className="mt-4"><Button onClick={()=>router.push('/create/customize')} className="!h-12">Plan an Event</Button></div>
        </Card>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Invitations</h2>
          <Card className="mt-3 p-4 flex gap-4 items-start">
            <div className={`${BrandText} text-2xl`}>✉️</div>
            <div>
              <div className="font-semibold">No Invitations</div>
              <p className="text-sm text-gray-600">No invitations received? Take charge and plan your own event with EventsInsta.</p>
            </div>
          </Card>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <Card className="mt-3 p-4 flex gap-4 items-start">
            <div className={`${BrandText} text-2xl`}>📅</div>
            <div>
              <div className="font-semibold">No Events</div>
              <p className="text-sm text-gray-600">Your event calendar is a blank canvas. Use EventsInsta to paint it with memorable moments.</p>
            </div>
          </Card>
        </section>
      </div>
      <BottomNav />
    </div>
  )
}
