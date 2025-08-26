'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SERVICES, SERVICE_CATEGORIES, getServicesByCategory } from '@/data/services'
import { ExoticCarCard } from '@/components/ExoticCarCard'

interface ServiceCardProps {
  service: any
  isSelected: boolean
  onToggle: (serviceId: string) => void
  budget: number
  totalCost: number
}

function ServiceCard({ service, isSelected, onToggle, budget, totalCost }: ServiceCardProps) {
  const isOverBudget = totalCost > budget
  const isThisServiceOverBudget = isSelected && isOverBudget

  return (
    <div 
      className={`p-4 cursor-pointer transition-all duration-200 rounded-lg border-2 ${
        isSelected 
          ? 'border-purple-500 bg-purple-50 shadow-md' 
          : 'border-gray-200 hover:border-purple-300'
      } ${isThisServiceOverBudget ? 'border-red-500 bg-red-50' : ''}`}
      onClick={() => onToggle(service.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{service.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{service.name}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
            {service.instagram && (
              <p className="text-sm text-purple-600 font-medium">Instagram: {service.instagram}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-gray-900">{service.priceDescription}</p>
          <p className="text-sm text-gray-500">${service.price.toLocaleString()}</p>
        </div>
      </div>
      {isThisServiceOverBudget && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
          <p className="text-sm text-red-700 font-medium">
            ⚠️ This service puts you over budget. Consider removing it to stay within your ${budget.toLocaleString()} limit.
          </p>
        </div>
      )}
    </div>
  )
}

function ServicesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const eventType = searchParams.get('eventType')
  const location = searchParams.get('location')
  const date = searchParams.get('date')
  const time = searchParams.get('time')
  const guestCount = searchParams.get('guestCount')
  const budget = searchParams.get('budget')

  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    const cost = selectedServices.reduce((total, serviceId) => {
      const service = SERVICES.find(s => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)
    setTotalCost(cost)
  }, [selectedServices])

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleContinue = () => {
    const params = new URLSearchParams()
    if (eventType) params.set('eventType', eventType)
    if (location) params.set('location', location)
    if (date) params.set('date', date)
    if (time) params.set('time', time)
    if (guestCount) params.set('guestCount', guestCount)
    if (budget) params.set('budget', budget)
    params.set('services', selectedServices.join(','))
    params.set('servicesTotal', totalCost.toString())
    
    router.push(`/create/preview?${params.toString()}`)
  }

  const budgetNum = budget ? parseInt(budget) : 0
  const isOverBudget = totalCost > budgetNum
  const budgetDifference = totalCost - budgetNum

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Additional Services</h1>
        <p className="text-gray-600">Choose the services you'd like to include in your event</p>
      </div>

      {/* Budget Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">Budget Summary</h3>
            <p className="text-sm text-gray-600">Your budget: ${budgetNum.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-gray-900">Total: ${totalCost.toLocaleString()}</p>
            {isOverBudget && (
              <p className="text-sm text-red-600 font-medium">
                Over budget by ${budgetDifference.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        
        {isOverBudget && (
          <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded">
            <p className="text-sm text-red-700 font-medium">
              💡 Tip: Uncheck some services to stay within your budget of ${budgetNum.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Services by Category */}
      <div className="space-y-8">
        {SERVICE_CATEGORIES.map(category => {
          const categoryServices = getServicesByCategory(category)
          if (categoryServices.length === 0) return null

          return (
            <div key={category}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">
                  {category === 'DJ' && '🎵'}
                  {category === 'Car Services' && '🚗'}
                  {category === 'Photography' && '📸'}
                  {category === 'Beauty' && '💄'}
                  {category === 'Venues' && '🏠'}
                  {category === 'Vacation' && '🏝️'}
                  {category === 'Kids' && '🎂'}
                  {category === 'Wedding' && '💒'}
                  {category === 'Sports' && '🏀'}
                  {category === 'Golf' && '⛳'}
                  {category === 'Exotic Cars' && '🚗'}
                  {category === 'Yacht' && '🛥️'}
                </span>
                {category}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryServices.map(service => (
                  category === 'Exotic Cars' ? (
                    <ExoticCarCard
                      key={service.id}
                      service={service}
                      isSelected={selectedServices.includes(service.id)}
                      onToggle={handleServiceToggle}
                      budget={budgetNum}
                      totalCost={totalCost}
                    />
                  ) : (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isSelected={selectedServices.includes(service.id)}
                      onToggle={handleServiceToggle}
                      budget={budgetNum}
                      totalCost={totalCost}
                    />
                  )
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Continue Button */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold"
        >
          Back
        </button>
        
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-2">
            Selected {selectedServices.length} services
          </p>
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold disabled:opacity-50"
            disabled={selectedServices.length === 0}
          >
            Continue to Preview
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServicesContent />
    </Suspense>
  )
}
