'use client'

import { useState, useMemo } from 'react'
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

type Template = {
  id: string
  name: string
  bg: string
}

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

export default function Customize() {
  const router = useRouter()
  const [headline, setHeadline] = useState('')
  const [dateText, setDate] = useState('')
  const [locText, setLoc] = useState('')
  const [selected, setSelected] = useState<string>(TEMPLATES[0].id)

  const tObj = useMemo(()=> TEMPLATES.find(t=>t.id===selected)!, [selected])

  function next() {
    // In a real app, you'd save this to context/state
    router.push('/create/details')
  }

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <StepHeader step={1} title="Customize" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4">
          <TemplateCard t={tObj} selected={true} onSelect={()=>{}} headline={headline} dateText={dateText} locationText={locText} />
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={()=>setSelected(t.id)} className={`rounded-xl p-3 ${t.bg} border ${selected===t.id?'border-purple-600':'border-transparent'}`}>
                <div className="text-sm">{t.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <Field label="Headline"><Input value={headline} onChange={e=>setHeadline(e.target.value)} placeholder="Parish Feast Get-Together" /></Field>
          <Field label="Date"><Input value={dateText} onChange={e=>setDate(e.target.value)} placeholder="Dec 6, 2023 | 11:30 am" /></Field>
          <Field label="Location"><Input value={locText} onChange={e=>setLoc(e.target.value)} placeholder="AS Villa, Kochi" /></Field>
        </div>

        <Button onClick={next}>Next: Event Details</Button>
      </div>
    </div>
  )
}
