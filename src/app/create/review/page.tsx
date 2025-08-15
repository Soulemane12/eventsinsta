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
  const link = useMemo(()=> `https://events.insta/invite/${Math.random().toString(36).slice(2,8)}`, [])

  async function share(){
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title: 'Family Get-Together', url: link })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(link)
        alert('Link copied to clipboard!')
      }
    } catch {}
  }

  function send(){
    // pretend to send and succeed
    router.push('/create/success')
  }

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <StepHeader step={5} title="Review & Send" />
      <div className="p-6 space-y-4">
        <Card className="p-4">
          <div className="font-semibold">Summary</div>
          <div className="text-sm text-gray-700 mt-2">Title: Family Get-Together</div>
          <div className="text-sm text-gray-700">Type: Anniversary</div>
          <div className="text-sm text-gray-700">When: Wednesday, 6 Dec 2023</div>
          <div className="text-sm text-gray-700">🕐 11:30 am - 5:00 pm</div>
          <div className="text-sm text-gray-700">Where: A5 Villa, Kochi</div>
          <div className="text-sm text-gray-700">Hosted by: Dylan Thomas</div>
          <div className="text-sm text-gray-700">Guest list: Visible</div>
          <div className="text-sm text-gray-700">Guests selected: 3</div>
        </Card>

        <Button onClick={send}>Send Invitations</Button>
        <GhostButton onClick={share}>Copy/Share Link</GhostButton>
        <div className="text-xs text-gray-500 text-center">Share Link is always available, even if sending fails.</div>
      </div>
    </div>
  )
}
