'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Logo from '../../../components/Logo'

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
      <div className="flex items-center gap-3 p-4">
        <BackBtn />
        <Logo size="md" />
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
  rsvpStatus: 'pending' | 'yes' | 'no' | 'maybe'
  inviteSent: boolean
  inviteSentDate?: string
}

interface CoHost {
  id: string
  name: string
  email: string
  phone: string
  role: string
}

interface EventData {
  eventType: string
  location: string
  date: string
  time: string
  guestCount: number
  budget: string
  venue: string
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
  const [coHosts, setCoHosts] = useState<CoHost[]>([])
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    dietaryRestrictions: '',
    plusOne: false
  })
  const [newCoHost, setNewCoHost] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [showCoHostForm, setShowCoHostForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'guests' | 'cohosts' | 'invites'>('guests')

  useEffect(() => {
    // Get event data from URL parameters
    const eventIdParam = searchParams.get('eventId')
    if (eventIdParam) {
      try {
        const eventData = JSON.parse(decodeURIComponent(eventIdParam))
        setEventData(eventData)
        
        // Initialize with empty guest list - users will add their own guests
        setGuests([])
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
        rsvpStatus: 'pending',
        inviteSent: false
      }
      setGuests([...guests, guest])
      setNewGuest({ name: '', email: '', phone: '', dietaryRestrictions: '', plusOne: false })
      setShowAddForm(false)
    }
  }

  const addCoHost = () => {
    if (newCoHost.name.trim() && coHosts.length < 3) {
      const coHost: CoHost = {
        id: `cohost-${Date.now()}`,
        name: newCoHost.name,
        email: newCoHost.email,
        phone: newCoHost.phone,
        role: newCoHost.role || 'Co-Host'
      }
      setCoHosts([...coHosts, coHost])
      setNewCoHost({ name: '', email: '', phone: '', role: '' })
      setShowCoHostForm(false)
    }
  }

  const removeGuest = (id: string) => {
    setGuests(guests.filter(guest => guest.id !== id))
  }

  const removeCoHost = (id: string) => {
    setCoHosts(coHosts.filter(coHost => coHost.id !== id))
  }

  const updateGuestRSVP = (id: string, status: 'pending' | 'yes' | 'no' | 'maybe') => {
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, rsvpStatus: status } : guest
    ))
  }

  const sendInvite = (guestId: string) => {
    setGuests(guests.map(guest => 
      guest.id === guestId ? { 
        ...guest, 
        inviteSent: true, 
        inviteSentDate: new Date().toISOString() 
      } : guest
    ))
    // In a real app, this would send an actual email/SMS
    console.log('Invite sent to guest:', guestId)
  }

  const sendBulkInvites = () => {
    const pendingGuests = guests.filter(guest => !guest.inviteSent)
    setGuests(guests.map(guest => 
      !guest.inviteSent ? { 
        ...guest, 
        inviteSent: true, 
        inviteSentDate: new Date().toISOString() 
      } : guest
    ))
    // In a real app, this would send actual emails/SMS
    console.log('Bulk invites sent to:', pendingGuests.length, 'guests')
  }

  const getRSVPStats = () => {
    const yes = guests.filter(g => g.rsvpStatus === 'yes').length
    const no = guests.filter(g => g.rsvpStatus === 'no').length
    const maybe = guests.filter(g => g.rsvpStatus === 'maybe').length
    const pending = guests.filter(g => g.rsvpStatus === 'pending').length
    return { yes, no, maybe, pending }
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
          <p className="text-sm text-gray-600">Keep track of your guests, co-hosts, and RSVPs</p>
          <div className="mt-2 text-sm text-purple-600 font-medium">
            {eventData.eventType} • {eventData.location} • {eventData.date}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-xl p-1 shadow">
          <button
            onClick={() => setActiveTab('guests')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'guests' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            👥 Guests ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab('cohosts')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'cohosts' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🤝 Co-Hosts ({coHosts.length}/3)
          </button>
          <button
            onClick={() => setActiveTab('invites')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'invites' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📧 Invites
          </button>
        </div>

        {/* Event & Venue Summary */}
        <Card className="p-4">
          <div className="font-semibold mb-3">Event & Venue Summary</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Event Type:</span>
              <span className="font-medium">{eventData.eventType}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="font-medium">{eventData.location}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span className="font-medium">{eventData.date} at {eventData.time}</span>
            </div>
            <div className="flex justify-between">
              <span>Venue:</span>
              <span className="font-medium">
                {eventData.venue === 'venue-restaurant' && eventData.selectedRestaurant 
                  ? 'Restaurant Venue (Restaurant Selected)'
                  : eventData.venue 
                    ? eventData.venue.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                    : 'No venue selected'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span>Guest Count:</span>
              <span className="font-medium">{eventData.guestCount} guests</span>
            </div>
            <div className="flex justify-between">
              <span>Services:</span>
              <span className="font-medium">{eventData.services.length} services selected</span>
            </div>
          </div>
        </Card>

        {/* RSVP Statistics */}
        <Card className="p-4">
          <div className="font-semibold mb-3">RSVP Summary</div>
          <div className="grid grid-cols-4 gap-2 text-center mb-3">
            <div>
              <div className="text-xl font-bold text-green-600">{rsvpStats.yes}</div>
              <div className="text-xs text-gray-600">Yes</div>
            </div>
            <div>
              <div className="text-xl font-bold text-red-600">{rsvpStats.no}</div>
              <div className="text-xs text-gray-600">No</div>
            </div>
            <div>
              <div className="text-xl font-bold text-yellow-600">{rsvpStats.maybe}</div>
              <div className="text-xs text-gray-600">Maybe</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-600">{rsvpStats.pending}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
          </div>
          
          {/* Capacity Indicator */}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between text-sm">
              <span>Guest Capacity:</span>
              <span className={`font-medium ${
                rsvpStats.yes > eventData.guestCount 
                  ? 'text-red-600' 
                  : rsvpStats.yes === eventData.guestCount 
                    ? 'text-green-600' 
                    : 'text-yellow-600'
              }`}>
                {rsvpStats.yes} / {eventData.guestCount}
              </span>
            </div>
            {rsvpStats.yes > eventData.guestCount && (
              <div className="text-xs text-red-600 mt-1">
                ⚠️ Over capacity! Consider upgrading your venue or reducing guest list.
              </div>
            )}
            {rsvpStats.yes === eventData.guestCount && (
              <div className="text-xs text-green-600 mt-1">
                ✅ Perfect! All spots filled.
              </div>
            )}
            {rsvpStats.yes < eventData.guestCount && (
              <div className="text-xs text-yellow-600 mt-1">
                📝 {eventData.guestCount - rsvpStats.yes} spots still available.
              </div>
            )}
          </div>
        </Card>

        {/* Tab Content */}
        {activeTab === 'guests' && (
          <>
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
          </>
        )}

        {activeTab === 'cohosts' && (
          <>
            {/* Add Co-Host Form */}
            {!showCoHostForm ? (
              <Button 
                onClick={() => setShowCoHostForm(true)} 
                disabled={coHosts.length >= 3}
              >
                {coHosts.length >= 3 ? 'Max 3 Co-Hosts' : '+ Add Co-Host'}
              </Button>
            ) : (
              <Card className="p-4">
                <div className="font-semibold mb-3">Add Co-Host</div>
                <div className="space-y-3">
                  <Field label="Name">
                    <Input 
                      placeholder="Co-host name"
                      value={newCoHost.name}
                      onChange={(e) => setNewCoHost({...newCoHost, name: e.target.value})}
                    />
                  </Field>
                  <Field label="Email">
                    <Input 
                      type="email"
                      placeholder="Email address"
                      value={newCoHost.email}
                      onChange={(e) => setNewCoHost({...newCoHost, email: e.target.value})}
                    />
                  </Field>
                  <Field label="Phone">
                    <Input 
                      type="tel"
                      placeholder="Phone number"
                      value={newCoHost.phone}
                      onChange={(e) => setNewCoHost({...newCoHost, phone: e.target.value})}
                    />
                  </Field>
                  <Field label="Role">
                    <Input 
                      placeholder="e.g., Best Man, Maid of Honor, etc."
                      value={newCoHost.role}
                      onChange={(e) => setNewCoHost({...newCoHost, role: e.target.value})}
                    />
                  </Field>
                  <div className="flex gap-2">
                    <Button onClick={addCoHost} disabled={!newCoHost.name.trim()}>
                      Add Co-Host
                    </Button>
                    <GhostButton onClick={() => setShowCoHostForm(false)}>
                      Cancel
                    </GhostButton>
                  </div>
                </div>
              </Card>
            )}

            {/* Co-Hosts List */}
            {coHosts.length > 0 && (
              <Card className="p-4">
                <div className="font-semibold mb-3">Co-Hosts ({coHosts.length}/3)</div>
                <div className="space-y-3">
                  {coHosts.map(coHost => (
                    <div key={coHost.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{coHost.name}</div>
                        <button
                          onClick={() => removeCoHost(coHost.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>📧 {coHost.email}</div>
                        <div>📞 {coHost.phone}</div>
                        <div>🎭 Role: {coHost.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        {activeTab === 'invites' && (
          <>
            {/* Invite Management */}
            <Card className="p-4">
              <div className="font-semibold mb-3">Send Invites</div>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  Send personalized invites to your guests with RSVP options.
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={sendBulkInvites}
                    disabled={guests.filter(g => !g.inviteSent).length === 0}
                  >
                    📧 Send All Invites ({guests.filter(g => !g.inviteSent).length} pending)
                  </Button>
                </div>

                <div className="text-xs text-gray-500">
                  💡 Invites will be sent via email and SMS with RSVP links
                </div>
              </div>
            </Card>

            {/* Invite Status */}
            <Card className="p-4">
              <div className="font-semibold mb-3">Invite Status</div>
              <div className="space-y-2">
                {guests.map(guest => (
                  <div key={guest.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{guest.name}</div>
                      <div className="text-xs text-gray-600">{guest.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {guest.inviteSent ? (
                        <div className="text-xs text-green-600">
                          ✅ Sent {guest.inviteSentDate ? new Date(guest.inviteSentDate).toLocaleDateString() : ''}
                        </div>
                      ) : (
                        <button
                          onClick={() => sendInvite(guest.id)}
                          className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          Send
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Guest List - Only show in guests tab */}
        {activeTab === 'guests' && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Guest List ({guests.length})</div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                    const yesCount = guests.filter(g => g.rsvpStatus === 'yes').length
                    if (yesCount < eventData.guestCount) {
                    // Auto-confirm remaining guests to fill capacity
                      const remainingSlots = eventData.guestCount - yesCount
                    const pendingGuests = guests.filter(g => g.rsvpStatus === 'pending').slice(0, remainingSlots)
                    pendingGuests.forEach(guest => {
                        updateGuestRSVP(guest.id, 'yes')
                    })
                  }
                }}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                title="Auto-confirm guests to fill capacity"
              >
                Auto-Fill
              </button>
              <button
                onClick={() => {
                  guests.forEach(guest => {
                    if (guest.rsvpStatus === 'pending') {
                        updateGuestRSVP(guest.id, 'yes')
                    }
                  })
                }}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                title="Confirm all pending guests"
              >
                Confirm All
              </button>
            </div>
          </div>
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
                    {guest.inviteSent && (
                      <div className="text-green-600">✅ Invite sent</div>
                    )}
                </div>
                <div className="mt-2 flex gap-1">
                    {(['pending', 'yes', 'no', 'maybe'] as const).map(status => (
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
        )}

        {/* Export and Actions */}
        <Card className="p-4">
          <div className="font-semibold mb-3">Export & Actions</div>
          <div className="space-y-3">
            <Button 
              onClick={() => {
                const csvContent = [
                  ['Name', 'Email', 'Phone', 'Dietary Restrictions', 'Plus One', 'RSVP Status', 'Invite Sent'],
                  ...guests.map(guest => [
                    guest.name,
                    guest.email,
                    guest.phone,
                    guest.dietaryRestrictions || 'None',
                    guest.plusOne ? 'Yes' : 'No',
                    guest.rsvpStatus.charAt(0).toUpperCase() + guest.rsvpStatus.slice(1),
                    guest.inviteSent ? 'Yes' : 'No'
                  ])
                ].map(row => row.join(',')).join('\n')
                
                const blob = new Blob([csvContent], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `guest-list-${eventData.eventType}-${eventData.date}.csv`
                a.click()
                window.URL.revokeObjectURL(url)
              }}
            >
              📊 Export Guest List (CSV)
            </Button>
            
            {coHosts.length > 0 && (
              <Button 
                onClick={() => {
                  const csvContent = [
                    ['Name', 'Email', 'Phone', 'Role'],
                    ...coHosts.map(coHost => [
                      coHost.name,
                      coHost.email,
                      coHost.phone,
                      coHost.role
                    ])
                  ].map(row => row.join(',')).join('\n')
                  
                  const blob = new Blob([csvContent], { type: 'text/csv' })
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `cohosts-${eventData.eventType}-${eventData.date}.csv`
                  a.click()
                  window.URL.revokeObjectURL(url)
                }}
              >
                🤝 Export Co-Hosts (CSV)
              </Button>
            )}
            
            <GhostButton 
              onClick={() => {
                const confirmedGuests = guests.filter(g => g.rsvpStatus === 'yes')
                const coHostsText = coHosts.length > 0 ? `\n\nCo-Hosts (${coHosts.length}):\n${coHosts.map(c => `- ${c.name} (${c.role})`).join('\n')}` : ''
                const text = `Event: ${eventData.eventType}\nDate: ${eventData.date}\nLocation: ${eventData.location}${coHostsText}\n\nConfirmed Guests (${confirmedGuests.length}):\n${confirmedGuests.map(g => `- ${g.name}${g.plusOne ? ' +1' : ''}`).join('\n')}`
                
                navigator.clipboard.writeText(text).then(() => {
                  alert('Event details copied to clipboard!')
                })
              }}
            >
              📋 Copy Event Summary
            </GhostButton>
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
