'use client'

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

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white shadow ${className}`}>{children}</div>
}

function BackBtn() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="w-9 h-9 grid place-items-center rounded-full hover:bg-gray-100" aria-label="Back">
      ←
    </button>
  )
}

function BottomNav() {
  const item = (to: string, label: string, symbol: string) => (
    <a href={to} className={`flex-1 py-3 text-center ${to === '/profile' ? BrandText : 'text-gray-500'}`}>{symbol}<div className="text-sm">{label}</div></a>
  )
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex">
      {item('/home','Home','🏠')}
      {item('/create/customize','Plan','➕')}
      {item('/profile','Account','👤')}
    </div>
  )
}

export default function Profile() {
  const router = useRouter()
  return (
    <div className="max-w-md mx-auto min-h-screen pb-24 bg-gray-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <BackBtn />
          <Logo size="md" />
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>

        <Card className="p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Logo size="lg" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Welcome to EventsInsta!</h2>
            <p className="text-gray-600 text-sm mb-6">
              Your account is ready to help you plan amazing events. Start by creating your first event!
            </p>
            <Button onClick={() => router.push('/create/customize')}>
              Plan Your First Event
            </Button>
          </div>
        </Card>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">My Events</h2>
          <div className="space-y-3">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">View My Events</div>
                  <div className="text-sm text-gray-600">See all your planned events</div>
                </div>
                <button
                  onClick={() => router.push('/my-events')}
                  className="text-purple-600 hover:text-purple-800"
                >
                  →
                </button>
              </div>
            </Card>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-3">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Personal Information</div>
                  <div className="text-sm text-gray-600">Update your profile details</div>
                </div>
                <div className="text-purple-600">→</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Notification Preferences</div>
                  <div className="text-sm text-gray-600">Manage your notifications</div>
                </div>
                <div className="text-purple-600">→</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Privacy & Security</div>
                  <div className="text-sm text-gray-600">Control your privacy settings</div>
                </div>
                <div className="text-purple-600">→</div>
              </div>
            </Card>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Support</h2>
          <div className="space-y-3">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Help Center</div>
                  <div className="text-sm text-gray-600">Get help with your events</div>
                </div>
                <div className="text-purple-600">→</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Contact Support</div>
                  <div className="text-sm text-gray-600">Reach out to our team</div>
                </div>
                <div className="text-purple-600">→</div>
              </div>
            </Card>
          </div>
        </section>
      </div>
      <BottomNav />
    </div>
  )
}
