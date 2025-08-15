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

export default function Preview() {
  const router = useRouter()

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <StepHeader step={4} title="Preview" />
      <div className="p-6 space-y-5">
        <Card className="p-4 bg-teal-100">
          <div className="grid place-items-center">
            <div className="w-72 h-44 rounded-xl bg-white/80 border grid place-items-center">
              <div className="text-center px-4">
                <div className="text-xs text-gray-500">Join us for our annual</div>
                <div className="font-semibold text-lg">Parish Feast Get-Together</div>
                <div className="text-sm text-gray-600 mt-1">Dec 6, 2023 | 11:30 am</div>
                <div className="text-xs text-gray-500">AS Villa, Kochi</div>
              </div>
            </div>
          </div>
        </Card>

        <div>
          <div className="text-xl font-semibold">Family Get-Together</div>
          <div className="mt-2 text-sm">📅 Wednesday, 6 Dec 2023</div>
          <div className="mt-1 text-sm">🕐 11:30 am - 5:00 pm</div>
          <div className="mt-1 text-sm text-purple-700 underline">+ Add to Calendar</div>
          <div className="mt-2 text-sm">📍 A5 Villa, Kochi</div>
          <div className="mt-3 text-sm"><span className="font-medium">Hosted By</span> — Dylan Thomas</div>
          <div className="mt-3">
            <div className="font-semibold">Event Description</div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">Join us for a joyful celebration of faith, family, and fellowship at our annual Parish Feast Family Get-Together! Let us spend quality time with each other and create new memories that will last a lifetime.</p>
          </div>
          <div className="mt-3 text-sm">Guest list visibility: Visible to attendees</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={()=>router.push('/create/details')} className="!h-12">Edit Details</Button>
          <Button onClick={()=>router.push('/create/guests')} className="!h-12">Edit Guests</Button>
        </div>

        <Button onClick={()=>router.push('/create/review')}>Next: Review & Send</Button>
      </div>
    </div>
  )
}
