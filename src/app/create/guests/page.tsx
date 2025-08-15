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

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white shadow ${className}`}>{children}</div>
}

type Guest = { id: string; name: string; email?: string; phone?: string }

const DEMO_CONTACTS: Guest[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: '3', name: 'Carol White', phone: '+1 555-1111' },
  { id: '4', name: 'David Green', email: 'david@example.com' },
  { id: '5', name: 'Eve Brown', email: 'eve@example.com' },
  { id: '6', name: 'Frank Blue', phone: '+1 555-2222' },
]

function ManualAdd({ onAdd }: { onAdd: (name: string, contact: string) => void }){
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const canAdd = name.trim().length>0 && contact.trim().length>0
  return (
    <Card className="p-4">
      <div className="font-semibold mb-2">Add manually</div>
      <div className="grid gap-3">
        <Input placeholder="Guest name" value={name} onChange={e=>setName(e.target.value)} />
        <Input placeholder="Email or phone" value={contact} onChange={e=>setContact(e.target.value)} />
        <Button onClick={()=>{onAdd(name, contact); setName(''); setContact('')}} disabled={!canAdd}>Add Guest</Button>
      </div>
    </Card>
  )
}

export default function Guests() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<Guest[]>([])

  const filtered = useMemo(()=> DEMO_CONTACTS.filter(c=> c.name.toLowerCase().includes(q.toLowerCase()) || c.email?.includes(q) || c.phone?.includes(q)), [q])

  function toggle(g: Guest){
    const exists = selected.find(s=> s.email && g.email ? s.email===g.email : (s.phone && g.phone ? s.phone===g.phone : s.id===g.id))
    if (exists) setSelected(sel=> sel.filter(s=> s!==exists))
    else setSelected(sel=> [...sel, g])
  }

  function addManual(name: string, contact: string){
    let g: Guest = { id: Math.random().toString(36).slice(2), name }
    if (contact.includes('@')) g.email = contact; else g.phone = contact
    // dedupe
    const exists = selected.find(s=> (g.email && s.email===g.email) || (g.phone && s.phone===g.phone))
    if (!exists) setSelected(sel=> [...sel, g])
  }

  function next(){
    // In a real app, you'd save this to context/state
    router.push('/create/preview')
  }

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <StepHeader step={3} title="Add Guests" />
      <div className="p-6 space-y-4">
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm">This demo requests contacts permission here. (Not implemented.)</div>
        <Input placeholder="Search contacts" value={q} onChange={e=>setQ(e.target.value)} />

        <div className="text-sm text-gray-600">{selected.length} guest{selected.length!==1?'s':''} selected</div>

        <div className="divide-y rounded-xl border overflow-hidden">
          {filtered.map(c=>{
            const isSel = !!selected.find(s=> s.id===c.id || (c.email && s.email===c.email) || (c.phone && s.phone===c.phone))
            return (
              <label key={c.id} className="flex items-center gap-3 p-3 hover:bg-gray-50">
                <input type="checkbox" checked={isSel} onChange={()=>toggle(c)} />
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.email || c.phone}</div>
                </div>
              </label>
            )
          })}
          {filtered.length===0 && <div className="p-4 text-sm text-gray-500">No matches.</div>}
        </div>

        <ManualAdd onAdd={addManual} />

        <Button onClick={next}>Next: Preview</Button>
        <div className="text-center text-xs text-gray-500">You can continue with 0 guests — you'll share the link later.</div>
      </div>
    </div>
  )
}
