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

function GhostButton({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`w-full h-14 rounded-2xl border border-gray-300 font-semibold ${className}`}>{children}</button>
  )
}

export default function Success() {
  const router = useRouter()
  return (
    <div className="max-w-md mx-auto min-h-screen grid place-items-center p-6 text-center">
      <div>
        <div className="text-6xl">🎉</div>
        <h1 className="text-2xl font-bold mt-2">Invitations sent!</h1>
        <p className="text-gray-600 mt-2">Your event is live. You can invite more people or share the link anytime.</p>
        <div className="mt-6 grid gap-3">
          <Button onClick={()=>router.push('/home')}>View Event</Button>
          <Button onClick={()=>router.push('/create/guests')} className="!h-12">Invite more</Button>
          <GhostButton onClick={()=>router.push('/create/review')} className="!h-12">Share link</GhostButton>
          <button onClick={()=>router.push('/home')} className="text-sm text-gray-500 underline mt-2">Plan another</button>
        </div>
      </div>
    </div>
  )
}
