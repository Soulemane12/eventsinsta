'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SERVICES, SERVICE_CATEGORIES, Service } from '@/data/services'

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

function BackBtn() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="w-9 h-9 grid place-items-center rounded-full hover:bg-gray-100" aria-label="Back">
      ←
    </button>
  )
}

function StepHeader({ step, title }: { step: number; title: string }) {
  const pct = (step / 6) * 100
  return (
    <div className="sticky top-0 bg-white z-10">
      <div className="flex items-center gap-2 p-4">
        <BackBtn />
        <div className="text-2xl font-semibold">{step} of 6: {title}</div>
      </div>
      <div className="w-full h-1 bg-gray-200">
        <div className="h-1 bg-green-500" style={{ width: pct + '%' }} />
      </div>
    </div>
  )
}

function ServiceCard({ 
  service, 
  isSelected, 
  onToggle 
}: { 
  service: Service; 
  isSelected: boolean; 
  onToggle: () => void 
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full p-4 cursor-pointer transition-all rounded-2xl bg-white shadow ${
        isSelected 
          ? 'border-2 border-purple-600 bg-purple-50' 
          : 'border border-gray-200 hover:border-purple-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{service.icon}</div>
        <div className="flex-1 text-left">
          <div className="flex items-center justify-between mb-1">
            <div className="font-semibold text-sm">{service.name}</div>
            <div className="text-sm font-bold text-purple-600">{service.priceDescription}</div>
          </div>
          <div className="text-xs text-gray-600 mb-2">{service.description}</div>
          {service.instagram && (
            <div className="text-xs text-blue-600 mb-2">
              📸 Instagram: {service.instagram}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">{service.category}</div>
            {isSelected && (
              <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

function ServicesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [eventType, setEventType] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [budget, setBudget] = useState('')

  useEffect(() => {
    // Get previous parameters from URL
    const eventTypeParam = searchParams.get('eventType')
    const locationParam = searchParams.get('location')
    const dateParam = searchParams.get('date')
    const timeParam = searchParams.get('time')
    const guestCountParam = searchParams.get('guestCount')
    const budgetParam = searchParams.get('budget')
    
    if (eventTypeParam) setEventType(eventTypeParam)
    if (locationParam) setLocation(locationParam)
    if (dateParam) setDate(dateParam)
    if (timeParam) setTime(timeParam)
    if (guestCountParam) setGuestCount(guestCountParam)
    if (budgetParam) setBudget(budgetParam)
  }, [searchParams])

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const getSelectedServicesTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = SERVICES.find(s => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)
  }

  const totalCost = getSelectedServicesTotal()

  function next() {
    const params = new URLSearchParams({
      eventType: eventType,
      location: location,
      date: date,
      time: time,
      guestCount: guestCount,
      budget: budget,
      services: selectedServices.join(','),
      servicesTotal: totalCost.toString()
    })
    router.push(`/create/preview?${params.toString()}`)
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={4} title="Select Services" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Choose your services</h2>
          <p className="text-sm text-gray-600">Select the services you need for your event</p>
          {eventType && location && (
            <div className="mt-2 text-sm text-purple-600 font-medium">
              Planning: {eventType} in {location}
            </div>
          )}
        </div>

        {/* Services by Category */}
        <div className="space-y-6">
          {SERVICE_CATEGORIES.map(category => {
            const categoryServices = SERVICES.filter(service => service.category === category)
            return (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">{category}</h3>
                <div className="space-y-3">
                  {categoryServices.map(service => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isSelected={selectedServices.includes(service.id)}
                      onToggle={() => toggleService(service.id)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Cost Summary */}
        {selectedServices.length > 0 && (
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="text-sm font-medium text-purple-800 mb-2">💰 Services Cost Summary</div>
            <div className="space-y-2">
              {selectedServices.map(serviceId => {
                const service = SERVICES.find(s => s.id === serviceId)
                return service ? (
                  <div key={serviceId} className="flex justify-between text-sm">
                    <span className="text-gray-700">{service.name}</span>
                    <span className="font-semibold text-purple-600">${service.price}</span>
                  </div>
                ) : null
              })}
              <div className="border-t border-purple-200 pt-2 mt-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-purple-800">Total Services Cost</span>
                  <span className="text-purple-800">${totalCost}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="text-sm font-medium text-blue-800 mb-2">💡 Service Selection Tip</div>
          <div className="text-xs text-blue-700">
            You can select multiple services from different categories. The total cost will be added to your event budget. You can always modify your selections later.
          </div>
        </div>

        <Button onClick={next}>
          Next: Review Your Event
        </Button>
      </div>
    </div>
  )
}

export default function Services() {
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
      <ServicesContent />
    </Suspense>
  )
}
