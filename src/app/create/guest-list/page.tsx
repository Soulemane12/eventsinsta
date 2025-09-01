'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

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

function StepHeader({ title }: { title: string }) {
  return (
    <div className="sticky top-0 bg-white z-10">
      <div className="flex items-center gap-2 p-4">
        <BackBtn />
        <div className="text-2xl font-semibold">{title}</div>
      </div>
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white shadow ${className}`}>{children}</div>
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

interface Guest {
  id: string
  name: string
  email: string
  phone: string
  dietaryRestrictions: string
  plusOne: boolean
  rsvpStatus: 'pending' | 'confirmed' | 'declined'
}

interface EventData {
  eventType: string
  location: string
  date: string
  time: string
  guestCount: number
  budget: string
  services: string[]
  servicesTotal: number
  selectedRestaurant: string
  customerName: string
}

function GuestListContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    dietaryRestrictions: '',
    plusOne: false
  })
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // Get event data from URL parameters
    const eventIdParam = searchParams.get('eventId')
    if (eventIdParam) {
      try {
        const eventData = JSON.parse(decodeURIComponent(eventIdParam))
        setEventData(eventData)
        
        // Initialize with some sample guests based on guest count
        const sampleGuests: Guest[] = []
        for (let i = 1; i <= Math.min(eventData.guestCount, 10); i++) {
          sampleGuests.push({
            id: `guest-${i}`,
            name: `Guest ${i}`,
            email: `guest${i}@example.com`,
            phone: `(555) 000-${i.toString().padStart(4, '0')}`,
            dietaryRestrictions: '',
            plusOne: false,
            rsvpStatus: 'pending'
          })
        }
        setGuests(sampleGuests)
      } catch (error) {
        console.error('Error parsing event data:', error)
      }
    }
  }, [searchParams])

  const addGuest = () => {
    if (newGuest.name.trim()) {
      const guest: Guest = {
        id: `guest-${Date.now()}`,
        name: newGuest.name,
        email: newGuest.email,
        phone: newGuest.phone,
        dietaryRestrictions: newGuest.dietaryRestrictions,
        plusOne: newGuest.plusOne,
        rsvpStatus: 'pending'
      }
      setGuests([...guests, guest])
      setNewGuest({ name: '', email: '', phone: '', dietaryRestrictions: '', plusOne: false })
      setShowAddForm(false)
    }
  }

  const removeGuest = (id: string) => {
    setGuests(guests.filter(guest => guest.id !== id))
  }

  const updateGuestRSVP = (id: string, status: 'pending' | 'confirmed' | 'declined') => {
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, rsvpStatus: status } : guest
    ))
  }

  const getRSVPStats = () => {
    const confirmed = guests.filter(g => g.rsvpStatus === 'confirmed').length
    const declined = guests.filter(g => g.rsvpStatus === 'declined').length
    const pending = guests.filter(g => g.rsvpStatus === 'pending').length
    return { confirmed, declined, pending }
  }

  if (!eventData) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50">
        <StepHeader title="Guest List Management" />
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading event details...</p>
          </div>
        </div>
      </div>
    )
  }

  const rsvpStats = getRSVPStats()

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader title="Guest List Management" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Manage Your Guest List</h2>
          <p className="text-sm text-gray-600">Keep track of your guests and their RSVPs</p>
          <div className="mt-2 text-sm text-purple-600 font-medium">
            {eventData.eventType} • {eventData.location} • {eventData.date}
          </div>
        </div>

        {/* RSVP Statistics */}
        <Card className="p-4">
          <div className="font-semibold mb-3">RSVP Summary</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{rsvpStats.confirmed}</div>
              <div className="text-xs text-gray-600">Confirmed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{rsvpStats.declined}</div>
              <div className="text-xs text-gray-600">Declined</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{rsvpStats.pending}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
          </div>
        </Card>

        {/* Add Guest Form */}
        {!showAddForm ? (
          <Button onClick={() => setShowAddForm(true)}>
            + Add New Guest
          </Button>
        ) : (
          <Card className="p-4">
            <div className="font-semibold mb-3">Add New Guest</div>
            <div className="space-y-3">
              <Field label="Name">
                <Input 
                  placeholder="Guest name"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                />
              </Field>
              <Field label="Email">
                <Input 
                  type="email"
                  placeholder="Email address"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                />
              </Field>
              <Field label="Phone">
                <Input 
                  type="tel"
                  placeholder="Phone number"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                />
              </Field>
              <Field label="Dietary Restrictions">
                <Input 
                  placeholder="Any dietary restrictions?"
                  value={newGuest.dietaryRestrictions}
                  onChange={(e) => setNewGuest({...newGuest, dietaryRestrictions: e.target.value})}
                />
              </Field>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="plusOne"
                  checked={newGuest.plusOne}
                  onChange={(e) => setNewGuest({...newGuest, plusOne: e.target.checked})}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="plusOne" className="text-sm text-gray-700">
                  Plus One
                </label>
              </div>
              <div className="flex gap-2">
                <Button onClick={addGuest} disabled={!newGuest.name.trim()}>
                  Add Guest
                </Button>
                <GhostButton onClick={() => setShowAddForm(false)}>
                  Cancel
                </GhostButton>
              </div>
            </div>
          </Card>
        )}

        {/* Guest List */}
        <Card className="p-4">
          <div className="font-semibold mb-3">Guest List ({guests.length})</div>
          <div className="space-y-3">
            {guests.map(guest => (
              <div key={guest.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{guest.name}</div>
                  <button
                    onClick={() => removeGuest(guest.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>📧 {guest.email}</div>
                  <div>📞 {guest.phone}</div>
                  {guest.dietaryRestrictions && (
                    <div>🥗 Dietary: {guest.dietaryRestrictions}</div>
                  )}
                  {guest.plusOne && <div>👥 Plus One</div>}
                </div>
                <div className="mt-2 flex gap-1">
                  {(['pending', 'confirmed', 'declined'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => updateGuestRSVP(guest.id, status)}
                      className={`px-2 py-1 text-xs rounded ${
                        guest.rsvpStatus === status
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-3">
          <Button onClick={() => router.back()}>
            Back to Event
          </Button>
          <GhostButton onClick={() => router.push('/home')}>
            Home
          </GhostButton>
        </div>
      </div>
    </div>
  )
}

export default function GuestList() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <GuestListContent />
    </Suspense>
  )
}
