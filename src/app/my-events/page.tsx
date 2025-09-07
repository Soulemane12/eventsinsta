'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
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

function BackBtn() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="w-9 h-9 grid place-items-center rounded-full hover:bg-gray-100" aria-label="Back">
      ←
    </button>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white shadow ${className}`}>{children}</div>
}

interface EventData {
  id: string
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
  createdAt: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

function formatDate(dateString: string): string {
  if (!dateString) return 'Not set'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  } catch {
    return dateString 
  }
}

function formatTime(timeString: string): string {
  if (!timeString) return 'Not set'
  try {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  } catch {
    return timeString
  }
}

function MyEventsContent() {
  const router = useRouter()
  const [events, setEvents] = useState<EventData[]>([])
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    // In a real app, this would fetch from a database
    // For now, we'll simulate with localStorage or show empty state
    const savedEvents = localStorage.getItem('userEvents')
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents))
      } catch (error) {
        console.error('Error parsing saved events:', error)
      }
    }
  }, [])

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true
    return event.status === filter
  })

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-green-600 bg-green-50'
      case 'completed': return 'text-blue-600 bg-blue-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getEventStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return '📅'
      case 'completed': return '✅'
      case 'cancelled': return '❌'
      default: return '📋'
    }
  }

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'birthday': return '🎉'
      case 'wedding': return '💒'
      case 'anniversary': return '💕'
      case 'corporate': return '🏢'
      case 'graduation': return '🎓'
      case 'baby shower': return '👶'
      default: return '🎊'
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3 p-4">
          <BackBtn />
          <Logo size="md" />
          <div className="text-2xl font-semibold">My Events</div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filter Tabs */}
        <div className="flex bg-white rounded-xl p-1 shadow">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All ({events.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              filter === 'upcoming' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Upcoming ({events.filter(e => e.status === 'upcoming').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              filter === 'completed' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Past ({events.filter(e => e.status === 'completed').length})
          </button>
        </div>

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2">
              {filter === 'all' ? 'No Events Yet' : `No ${filter} Events`}
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              {filter === 'all' 
                ? 'Start planning your first event to see it here!'
                : `You don't have any ${filter} events yet.`
              }
            </p>
            <Button onClick={() => router.push('/create/customize')}>
              Plan Your First Event
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map(event => (
              <Card key={event.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getEventTypeIcon(event.eventType)}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{event.eventType}</h3>
                      <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getEventStatusColor(event.status)}`}>
                    {getEventStatusIcon(event.status)} {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>{event.guestCount} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>
                      {event.venue === 'venue-restaurant' && event.selectedRestaurant 
                        ? 'Restaurant Venue'
                        : event.venue 
                          ? event.venue.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                          : 'Venue TBD'
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span>${event.servicesTotal.toLocaleString()} total</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/create/guest-list?eventId=${encodeURIComponent(JSON.stringify(event))}`)}
                    className="flex-1 py-2 px-3 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    Manage Guests
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, this would show event details
                      alert('Event details feature coming soon!')
                    }}
                    className="flex-1 py-2 px-3 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="p-4">
          <div className="font-semibold mb-3">Quick Actions</div>
          <div className="space-y-3">
            <Button onClick={() => router.push('/create/customize')}>
              + Plan New Event
            </Button>
            <GhostButton onClick={() => router.push('/home')}>
              Back to Home
            </GhostButton>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function MyEvents() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading your events...</p>
          </div>
        </div>
      </div>
    }>
      <MyEventsContent />
    </Suspense>
  )
}
