'use client'

import { useState } from 'react'
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

function isoLocal(date: string, time: string) {
  if (!date) return ''
  const [y,m,d] = date.split('-').map(Number)
  const [hh,mm] = time.split(':').map(Number)
  const dt = new Date(y, m-1, d, hh ?? 0, mm ?? 0)
  return dt.toISOString()
}

export default function Details() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [desc, setDesc] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('12:00')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('13:00')
  const [location, setLocation] = useState('')
  const [hostedBy, setHostedBy] = useState('')
  const [hideGuests, setHideGuests] = useState(false)

  const startIso = isoLocal(startDate, startTime)
  const endIso = isoLocal(endDate, endTime)
  const valid = title.trim().length>0 && !!startIso && !!endIso && new Date(startIso) < new Date(endIso)

  function next(){
    // In a real app, you'd save this to context/state
    router.push('/create/guests')
  }

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <StepHeader step={2} title="Event Details" />
      <div className="p-6 space-y-4">
        <Field label="Event Title"><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Enter event title" /></Field>

        <Field label="Event Type">
          <select value={type} onChange={e=>setType(e.target.value)} className="w-full h-12 rounded-xl border border-gray-300 px-4">
            <option value="">Select event type</option>
            {['Graduation','Anniversary','Wedding Party','Kid Party','Rooftop Party','Corporate Event'].map(opt=> <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </Field>

        <Field label="Event Description"><TextArea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Write your event description" /></Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Date"><Input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} /></Field>
          <Field label="Start Time"><Input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} /></Field>
          <Field label="End Date"><Input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} /></Field>
          <Field label="End Time"><Input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} /></Field>
        </div>

        <Field label="Location"><Input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" /></Field>
        <Field label="Hosted By"><Input value={hostedBy} onChange={e=>setHostedBy(e.target.value)} placeholder="Enter host name" /></Field>

        <div className="flex items-center justify-between py-2">
          <div>
            <div className="font-medium">Guest Options</div>
            <div className="text-sm text-gray-600">Hide the guest list from attendees for this event</div>
          </div>
          <Toggle checked={hideGuests} onChange={setHideGuests} />
        </div>

        {!valid && (
          <div className="text-sm text-red-600">Title is required and start must be before end.</div>
        )}
        <Button onClick={next} disabled={!valid}>Next: Add Guests</Button>
      </div>
    </div>
  )
}
