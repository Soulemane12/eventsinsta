'use client'

import { useState, useReducer, createContext, useContext, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ----------------------------- Types

type Guest = { id: string; name: string; email?: string; phone?: string }

type Template = {
  id: string
  name: string
  bg: string // tailwind class for background
}

type EventDraft = {
  templateId?: string
  headline?: string
  dateText?: string
  locationText?: string

  title?: string
  eventType?: string
  description?: string
  start?: string // ISO
  end?: string   // ISO
  timezone?: string
  location?: string
  hostedBy?: string
  hideGuestList?: boolean

  guests: Guest[]
}

// ----------------------------- Event Context

type EventAction = { type: 'reset' } | { type: 'patch'; payload: Partial<EventDraft> } | { type: 'setGuests'; guests: Guest[] }

const initialDraft: EventDraft = {
  guests: [],
  timezone: typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
}

function reducer(state: EventDraft, action: EventAction): EventDraft {
  switch (action.type) {
    case 'reset':
      return { ...initialDraft, timezone: typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC' }
    case 'patch':
      return { ...state, ...action.payload }
    case 'setGuests':
      return { ...state, guests: action.guests }
    default:
      return state
  }
}

const EventCtx = createContext<{ draft: EventDraft; dispatch: React.Dispatch<EventAction> } | null>(null)

function useEvent() {
  const ctx = useContext(EventCtx)
  if (!ctx) throw new Error('EventCtx missing')
  return ctx
}

// ----------------------------- UI Primitives

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

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full min-h-[96px] rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-300 ${props.className ?? ''}`} />
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center">
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-7 rounded-full transition-colors ${checked ? 'bg-purple-700' : 'bg-gray-300'} relative`}
        aria-pressed={checked}
      >
        <span className={`absolute top-0.5 ${checked ? 'right-0.5' : 'left-0.5'} w-6 h-6 rounded-full bg-white shadow`} />
      </button>
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white shadow ${className}`}>{children}</div>
}

// ----------------------------- Templates (Step 1)

const TEMPLATES: Template[] = [
  { id: 'soft-mint', name: 'Soft Mint', bg: 'bg-teal-100' },
  { id: 'lavender', name: 'Lavender', bg: 'bg-purple-100' },
  { id: 'sunset', name: 'Sunset', bg: 'bg-orange-100' },
  { id: 'mono', name: 'Minimal', bg: 'bg-gray-100' },
]

function TemplateCard({ t, selected, onSelect, headline, dateText, locationText }: { t: Template; selected: boolean; onSelect: () => void; headline?: string; dateText?: string; locationText?: string }) {
  return (
    <button onClick={onSelect} className={`relative rounded-2xl p-4 w-full text-left ${t.bg} border ${selected? 'border-purple-600' : 'border-transparent'} hover:border-purple-400`}>
      <div className="text-xs text-gray-500">{t.name}</div>
      <div className="mt-6 grid place-items-center">
        <div className="w-64 h-40 rounded-xl bg-white/80 border border-dashed grid place-items-center">
          <div className="text-center px-4">
            <div className="font-semibold text-lg">{headline || 'Event Headline'}</div>
            <div className="text-sm text-gray-600 mt-1">{dateText || 'Dec 6, 2023 | 11:30 am'}</div>
            <div className="text-xs text-gray-500">{locationText || 'AS Villa, Kochi'}</div>
          </div>
        </div>
      </div>
      {selected && <span className="absolute top-3 right-3 text-sm px-2 py-0.5 rounded-full bg-purple-700 text-white">Selected</span>}
    </button>
  )
}

// ----------------------------- Helper utils

function isoLocal(date: string, time: string) {
  if (!date) return ''
  const [y,m,d] = date.split('-').map(Number)
  const [hh,mm] = time.split(':').map(Number)
  const dt = new Date(y, m-1, d, hh ?? 0, mm ?? 0)
  return dt.toISOString()
}

function fmtRange(start?: string, end?: string, tz?: string) {
  if (!start || !end) return ''
  try {
    const s = new Date(start)
    const e = new Date(end)
    const fmt: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }
    const time: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' }
    return `${s.toLocaleDateString(undefined, fmt)}\n${s.toLocaleTimeString(undefined, time)} – ${e.toLocaleTimeString(undefined, time)}${tz?` ${tz}`:''}`
  } catch {
    return ''
  }
}

// ----------------------------- Onboarding Page

export default function Onboarding() {
  const router = useRouter()
  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-between py-16 px-6">
      <div className="flex-1 grid place-items-center">
        <div className="text-center">
          <div className={`${BrandText} text-5xl font-black tracking-wide`}>EVENTS INSTA</div>
          <div className="text-purple-500 mt-2 text-xs tracking-wide">Plan. Create. Celebrate</div>
        </div>
      </div>
      <div className="w-full">
        <div className="text-2xl font-semibold mb-2">Event planning made easy</div>
        <p className="text-sm text-gray-600">Choose event type, location, guests, budget—get personalized suggestions for a memorable event.</p>
        <div className="mt-6">
          <Button onClick={() => router.push('/signup')}>Start</Button>
        </div>
      </div>
    </div>
  )
}
