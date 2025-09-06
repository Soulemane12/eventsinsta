'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '../../components/Logo'

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

export default function SignIn() {
  const router = useRouter()
  return (
    <div className="max-w-md mx-auto min-h-screen px-6 py-6">
      <div className="flex items-center gap-2 mb-6">
        <BackBtn />
        <Logo size="md" />
        <h1 className="text-2xl font-semibold">Sign In</h1>
      </div>

      <div className="mt-6 space-y-4">
        <Field label="Email"><Input placeholder="Enter your email" type="email" /></Field>
        <Field label="Password"><Input placeholder="Enter your password" type="password" /></Field>
        <div className="text-right text-sm"><a className="text-purple-700" href="#">Forgot password?</a></div>
        <Button onClick={()=>router.push('/home')}>Sign In</Button>
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-gray-200"/>
          <div className="text-xs text-gray-500">OR</div>
          <div className="flex-1 h-px bg-gray-200"/>
        </div>
        <GhostButton>Sign in with Google</GhostButton>
        <GhostButton>Sign in with Apple</GhostButton>
        <div className="text-center text-sm">Don't have an account? <Link className="text-purple-700 font-medium" href="/signup">Sign up</Link></div>
        <div className="text-center text-xs text-gray-500">For demo, you can <button onClick={()=>router.push('/home')} className="underline">skip</button>.</div>
      </div>
    </div>
  )
}
