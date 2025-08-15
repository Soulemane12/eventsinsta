'use client'

import { useState } from 'react'
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
      {children}
    </label>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-purple-300 ${props.className ?? ''}`} />
}

function BackBtn() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="w-9 h-9 grid place-items-center rounded-full hover:bg-gray-100" aria-label="Back">
      ←
    </button>
  )
}

export default function SignUp() {
  const router = useRouter()
  const [agree, setAgree] = useState(false)
  return (
    <div className="max-w-md mx-auto min-h-screen px-6 py-6">
      <div className="flex items-center gap-2">
        <BackBtn />
        <h1 className="text-2xl font-semibold">Sign Up</h1>
      </div>

      <div className="mt-6 space-y-4">
        <Field label="Name"><Input placeholder="Enter your name" /></Field>
        <Field label="Email"><Input placeholder="Enter your email" type="email" /></Field>
        <Field label="Password"><Input placeholder="Enter your password" type="password" /></Field>

        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} className="w-4 h-4" />
          <span>I agree to the <a className="text-purple-700 underline" href="#">Terms of Service</a> and <a className="text-purple-700 underline" href="#">Privacy Policy</a>.</span>
        </label>

        <Button onClick={()=>router.push('/home')} disabled={!agree}>Sign Up</Button>
        <div className="text-center text-sm">Already have an account? <Link className="text-purple-700 font-medium" href="/signin">Sign In</Link></div>
        <div className="text-center text-xs text-gray-500">For demo, you can <button onClick={()=>router.push('/home')} className="underline">skip</button>.</div>
      </div>
    </div>
  )
}
