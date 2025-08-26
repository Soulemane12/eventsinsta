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
          {service.image ? (
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={service.image} 
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="text-2xl">{service.icon}</div>
          )}
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
  const [recommendedServices, setRecommendedServices] = useState<string[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)

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

  // Budget flexibility features
  const budgetRange = budget.split(' - ')
  const minBudget = parseInt(budgetRange[0]?.replace(/[^0-9]/g, '') || '0')
  const maxBudget = parseInt(budgetRange[1]?.replace(/[^0-9]/g, '') || '0')
  const isOverBudget = totalCost > maxBudget
  const budgetRemaining = maxBudget - totalCost

  // Get expensive services to suggest removal
  const getExpensiveServices = () => {
    return selectedServices
      .map(id => SERVICES.find(s => s.id === id))
      .filter(service => service && service.price > 200)
      .sort((a, b) => (b?.price || 0) - (a?.price || 0))
      .slice(0, 3)
  }

  const expensiveServices = getExpensiveServices()

  // Load AI recommendations
  useEffect(() => {
    if (eventType && guestCount && budget) {
      setIsLoadingRecommendations(true)
      fetch('/api/service-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          guestCount: parseInt(guestCount),
          budget,
          location
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.recommendations) {
          setRecommendedServices(data.recommendations.map((rec: any) => rec.serviceId))
        }
        setIsLoadingRecommendations(false)
      })
      .catch(error => {
        console.error('Error loading service recommendations:', error)
        setIsLoadingRecommendations(false)
      })
    }
  }, [eventType, guestCount, budget, location])

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

        {/* AI Recommendations */}
        {isLoadingRecommendations && (
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="text-sm font-medium text-blue-800 mb-2">🤖 Loading Smart Recommendations...</div>
            <div className="text-xs text-blue-700">
              Analyzing your event details to suggest the perfect services for you.
            </div>
          </div>
        )}

        {!isLoadingRecommendations && recommendedServices.length > 0 && (
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-sm font-medium text-green-800 mb-2">⭐ Recommended for Your Event</div>
            <div className="text-xs text-green-700 mb-3">
              Based on your {eventType} event with {guestCount} guests and ${budget} budget.
            </div>
            <div className="space-y-2">
              {recommendedServices.map(serviceId => {
                const service = SERVICES.find(s => s.id === serviceId)
                const isSelected = selectedServices.includes(serviceId)
                return service ? (
                  <div key={serviceId} className="flex items-center justify-between text-xs">
                    <span className="text-green-700">{service.name}</span>
                    <button
                      onClick={() => toggleService(serviceId)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        isSelected 
                          ? 'bg-green-600 text-white' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Add (+$' + service.price + ')'}
                    </button>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}

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
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Your Budget</span>
                  <span className="text-gray-600">${minBudget} - ${maxBudget}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className={isOverBudget ? "text-red-600" : "text-green-600"}>
                    {isOverBudget ? "Over Budget" : "Remaining"}
                  </span>
                  <span className={isOverBudget ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                    {isOverBudget ? `+$${Math.abs(budgetRemaining)}` : `$${budgetRemaining}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Budget Warning */}
        {isOverBudget && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <div className="text-sm font-medium text-red-800 mb-2">⚠️ Budget Exceeded</div>
            <div className="text-xs text-red-700 mb-3">
              Your selected services exceed your budget by ${Math.abs(budgetRemaining)}. 
              Consider removing some services to stay within your budget.
            </div>
            {expensiveServices.length > 0 && (
              <div>
                <div className="text-xs font-medium text-red-800 mb-2">💡 Suggested removals:</div>
                <div className="space-y-2">
                  {expensiveServices.map(service => (
                    <div key={service?.id} className="flex items-center justify-between text-xs">
                      <span className="text-red-700">{service?.name}</span>
                      <button
                        onClick={() => toggleService(service?.id || '')}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove (-${service?.price})
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
