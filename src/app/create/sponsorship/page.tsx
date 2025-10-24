'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Logo from '../../../components/Logo'

function GradientButton({ children, className = '', disabled, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 shadow-md hover:shadow-lg'
  }

  return (
    <button
      {...props}
      disabled={disabled}
      className={`w-full h-16 rounded-2xl font-bold transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:transform-none ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

function BackBtn() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="w-10 h-10 grid place-items-center rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300"
      aria-label="Back"
    >
      <span className="text-gray-700">←</span>
    </button>
  )
}

function StepHeader({ step, title }: { step: number; title: string }) {
  const pct = (step / 7) * 100
  return (
    <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 z-10 shadow-lg">
      <div className="flex items-center gap-3 p-4 text-white">
        <BackBtn />
        <Logo size="md" className="drop-shadow-lg" />
        <div className="text-xl font-bold">{step} of 7: {title}</div>
      </div>
      <div className="w-full h-2 bg-white/20">
        <div
          className="h-2 bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out"
          style={{ width: pct + '%' }}
        />
      </div>
    </div>
  )
}

function EnhancedCard({ children, className = '', selected = false, onClick }: {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-lg border-2 transition-all duration-300 cursor-pointer ${
        selected
          ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl scale-[1.02]'
          : 'border-gray-100 hover:border-purple-300 hover:shadow-xl hover:scale-[1.02]'
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

function SponsorshipContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [wantSponsorship, setWantSponsorship] = useState<boolean | null>(null)
  const [eventData, setEventData] = useState<any>(null)

  useEffect(() => {
    // Get all event data from URL parameters
    const data = {
      eventType: searchParams.get('eventType') || '',
      location: searchParams.get('location') || '',
      date: searchParams.get('date') || '',
      time: searchParams.get('time') || '',
      guestCount: searchParams.get('guestCount') || '',
      budget: searchParams.get('budget') || '',
      venue: searchParams.get('venue') || '',
      services: searchParams.get('services') || '',
      servicesTotal: searchParams.get('servicesTotal') || '',
      selectedRestaurant: searchParams.get('selectedRestaurant') || '',
      venueName: searchParams.get('venueName') || '',
      venueAddress: searchParams.get('venueAddress') || '',
      venuePrice: searchParams.get('venuePrice') || '',
      venuePackage: searchParams.get('venuePackage') || '',
      specificVenue: searchParams.get('specificVenue') || ''
    }
    setEventData(data)
  }, [searchParams])

  function proceedToReview() {
    if (!eventData) return

    const params = new URLSearchParams({
      ...eventData,
      sponsorship: wantSponsorship ? 'yes' : 'no',
      ...(wantSponsorship && {
        sponsorshipContact: 'Malir Burks',
        sponsorshipEmail: 'malir@burksbizdev.com',
        sponsorshipPhone: '404-550-4596'
      })
    })

    router.push(`/create/review?${params.toString()}`)
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50">
      <StepHeader step={6} title="Event Sponsorship" />
      <div className="p-6 space-y-8">
        <div className="text-center">
          <div className="text-5xl mb-4">💼</div>
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
            Interested in Event Sponsorship?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Connect with our sponsorship coordinator to explore opportunities for your event
          </p>
        </div>

        {/* Sponsorship Coordinator Card */}
        <EnhancedCard className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
              💼
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-800">
              Malir Burks
            </h3>
            <p className="text-sm font-semibold text-purple-600 mb-2">
              Event Sponsorship Coordinator
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Burks Biz Dev Agency
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 p-3 bg-white/80 rounded-lg">
                <span className="text-lg">📧</span>
                <a
                  href="mailto:malir@burksbizdev.com"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  malir@burksbizdev.com
                </a>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-white/80 rounded-lg">
                <span className="text-lg">📞</span>
                <a
                  href="tel:404-550-4596"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  404-550-4596
                </a>
              </div>
            </div>
          </div>
        </EnhancedCard>

        {/* Sponsorship Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-center mb-4">Would you like to be contacted about sponsorship opportunities?</h3>

          <div className="grid grid-cols-1 gap-4">
            <EnhancedCard
              selected={wantSponsorship === true}
              onClick={() => setWantSponsorship(true)}
              className="p-6 text-center"
            >
              <div className="text-4xl mb-3">✅</div>
              <h4 className="font-bold text-lg mb-2">Yes, I'm Interested</h4>
              <p className="text-sm text-gray-600">
                Connect me with Malir Burks to explore sponsorship opportunities for my event
              </p>
              {wantSponsorship === true && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">
                    ✨ Great! We'll include your contact info for sponsorship outreach
                  </p>
                </div>
              )}
            </EnhancedCard>

            <EnhancedCard
              selected={wantSponsorship === false}
              onClick={() => setWantSponsorship(false)}
              className="p-6 text-center"
            >
              <div className="text-4xl mb-3">⏭️</div>
              <h4 className="font-bold text-lg mb-2">No Thanks</h4>
              <p className="text-sm text-gray-600">
                I'll proceed without sponsorship information at this time
              </p>
              {wantSponsorship === false && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">
                    No problem! You can always reach out later if interested
                  </p>
                </div>
              )}
            </EnhancedCard>
          </div>
        </div>

        <div className="mt-10">
          <GradientButton
            onClick={proceedToReview}
            disabled={wantSponsorship === null}
            className={wantSponsorship !== null ? 'animate-pulse' : ''}
          >
            {wantSponsorship !== null ? '✨ Continue to Review' : 'Please Select an Option'}
          </GradientButton>
        </div>

        {wantSponsorship !== null && (
          <div className="text-center animate-fade-in">
            <p className="text-sm text-gray-500">
              {wantSponsorship
                ? 'Perfect! We\'ll connect you with our sponsorship team'
                : 'All set! Let\'s review your event details'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Sponsorship() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50">
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading sponsorship options...</p>
          </div>
        </div>
      </div>
    }>
      <SponsorshipContent />
    </Suspense>
  )
}