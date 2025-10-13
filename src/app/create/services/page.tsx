'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SERVICES, SERVICE_CATEGORIES, Service } from '@/data/services'
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

function BackBtn() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="w-9 h-9 grid place-items-center rounded-full hover:bg-gray-100" aria-label="Back">
      ←
    </button>
  )
}

function StepHeader({ step, title }: { step: number; title: string }) {
  const pct = (step / 7) * 100
  return (
    <div className="sticky top-0 bg-white z-10">
      <div className="flex items-center gap-3 p-4">
        <BackBtn />
        <Logo size="md" />
        <div className="text-2xl font-semibold">{step} of 7: {title}</div>
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
  const [showDetails, setShowDetails] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDetails(!showDetails)
  }

  const handlePurchase = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAdding(true)
    
    // Add service to selection if not already selected
    if (!isSelected) {
      onToggle()
    }
    // Create purchase intent with service details
    const purchaseData = {
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      category: service.category,
      description: service.description,
      priceDescription: service.priceDescription
    }
    
    // Store purchase intent in localStorage for future implementation
    localStorage.setItem(`purchase_intent_${service.id}`, JSON.stringify(purchaseData))
    
    // Show success feedback with better UX
    setTimeout(() => {
      setIsAdding(false)
      // Create a more elegant success notification
      const successMessage = document.createElement('div')
      successMessage.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2'
      successMessage.innerHTML = `
        <span>✅</span>
        <span>${service.name} added to your event!</span>
      `
      document.body.appendChild(successMessage)
      
      // Remove the notification after 3 seconds
      setTimeout(() => {
        if (successMessage.parentNode) {
          successMessage.parentNode.removeChild(successMessage)
        }
      }, 3000)
    }, 500)
  }

  return (
    <div
      className={`w-full p-4 transition-all rounded-2xl bg-white shadow ${
        isSelected 
          ? 'border-2 border-purple-600 bg-purple-50' 
          : 'border border-gray-200 hover:border-purple-300'
      }`}
    >
      <div className="flex items-start gap-3" onClick={onToggle}>
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
      
      {/* Action Buttons */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
        <button
          onClick={handleViewDetails}
          className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
        <button
          onClick={handlePurchase}
          disabled={isAdding}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300 ${
            isAdding 
              ? 'bg-green-500 text-white' 
              : isSelected 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isAdding ? (
            <span className="flex items-center justify-center gap-1">
              <span className="animate-spin">⭐</span> Adding...
            </span>
          ) : isSelected ? (
            '✅ Selected'
          ) : (
            'Add Service'
          )}
        </button>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-600 space-y-2">
            <div><strong>Service Details:</strong></div>
            <div>{service.description}</div>
            <div><strong>Price:</strong> {service.priceDescription}</div>
            <div><strong>Category:</strong> {service.category}</div>
            {service.instagram && (
              <div><strong>Instagram:</strong> {service.instagram}</div>
            )}
            <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
              Contact our team for more details, customization options, and booking assistance.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ServicesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [eventType, setEventType] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [hostName, setHostName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [budget, setBudget] = useState('')
  const [venue, setVenue] = useState('')
  const [specificVenue, setSpecificVenue] = useState('')
  const [venueName, setVenueName] = useState('')
  const [venueAddress, setVenueAddress] = useState('')
  const [venuePrice, setVenuePrice] = useState('')
  const [venuePackage, setVenuePackage] = useState('')

  const [recommendedServices, setRecommendedServices] = useState<string[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [aiFilteredServices, setAiFilteredServices] = useState<string[]>([])
  const [isLoadingAiFilter, setIsLoadingAiFilter] = useState(false)

  useEffect(() => {
    // Aggressive cleanup of corrupted localStorage data on component mount
    const cleanupCorruptedData = () => {
      const savedServices = localStorage.getItem('event_selected_services')
      if (savedServices) {
        try {
          const parsedServices = JSON.parse(savedServices)
          if (!Array.isArray(parsedServices)) {
            localStorage.removeItem('event_selected_services')
            return
          }
          // Check if any service IDs are invalid or don't exist
          const hasInvalidServices = parsedServices.some(serviceId => {
            if (!serviceId || typeof serviceId !== 'string' || serviceId.trim().length === 0) {
              return true
            }
            return !SERVICES.some(service => service.id === serviceId.trim())
          })
          if (hasInvalidServices) {
            localStorage.removeItem('event_selected_services')
          }
        } catch (error) {
          localStorage.removeItem('event_selected_services')
        }
      }
    }
    
    cleanupCorruptedData()

    // Get previous parameters from URL
    const eventTypeParam = searchParams.get('eventType')
    const locationParam = searchParams.get('location')
    const dateParam = searchParams.get('date')
    const hostNameParam = searchParams.get('hostName')
    const startTimeParam = searchParams.get('startTime')
    const endTimeParam = searchParams.get('endTime')
    const guestCountParam = searchParams.get('guestCount')
    const budgetParam = searchParams.get('budget')
    const venueParam = searchParams.get('venue')
    const servicesParam = searchParams.get('services')
    const specificVenueParam = searchParams.get('specificVenue')
    const venueNameParam = searchParams.get('venueName')
    const venueAddressParam = searchParams.get('venueAddress')
    const venuePriceParam = searchParams.get('venuePrice')
    const venuePackageParam = searchParams.get('venuePackage')
    
    if (eventTypeParam) setEventType(eventTypeParam)
    if (locationParam) setLocation(locationParam)
    if (dateParam) setDate(dateParam)
    if (hostNameParam) setHostName(hostNameParam)
    if (startTimeParam) setStartTime(startTimeParam)
    if (endTimeParam) setEndTime(endTimeParam)
    if (guestCountParam) setGuestCount(guestCountParam)
    if (budgetParam) setBudget(budgetParam)
    if (venueParam) setVenue(venueParam)
    if (specificVenueParam) setSpecificVenue(specificVenueParam)
    if (venueNameParam) setVenueName(venueNameParam)
    if (venueAddressParam) setVenueAddress(venueAddressParam)
    if (venuePriceParam) setVenuePrice(venuePriceParam)
    if (venuePackageParam) setVenuePackage(venuePackageParam)
    
    // Restore previously selected services
    if (servicesParam) {
      const services = servicesParam.split(',').filter(Boolean)
      setSelectedServices(services)
    } else {
      // Try to restore from localStorage as fallback, but be very strict about validation
      const savedServices = localStorage.getItem('event_selected_services')
      if (savedServices) {
        try {
          const parsedServices = JSON.parse(savedServices)
          // Only restore if it's a valid array with actual service IDs
          if (Array.isArray(parsedServices) && parsedServices.length > 0) {
            // Filter out any invalid/empty service IDs and ensure they exist in SERVICES
            const validServices = parsedServices.filter(serviceId => {
              if (!serviceId || typeof serviceId !== 'string' || serviceId.trim().length === 0) {
                return false
              }
              // Check if the service actually exists in our services list
              const serviceExists = SERVICES.some(service => service.id === serviceId.trim())
              return serviceExists
            })
            if (validServices.length > 0) {
              setSelectedServices(validServices)
            } else {
              // If no valid services found, clear localStorage
              localStorage.removeItem('event_selected_services')
              setSelectedServices([])
            }
          } else {
            // Invalid data, clear it
            localStorage.removeItem('event_selected_services')
            setSelectedServices([])
          }
        } catch (error) {
          console.error('Error parsing saved services:', error)
          localStorage.removeItem('event_selected_services')
          setSelectedServices([])
        }
      } else {
        // No saved services, ensure we start with empty array
        setSelectedServices([])
      }
    }
    

  }, [searchParams])

  // Save selected services to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('event_selected_services', JSON.stringify(selectedServices))
  }, [selectedServices])

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const isCurrentlySelected = prev.includes(serviceId)
      const newSelection = isCurrentlySelected 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
      
      // Show feedback for service addition/removal
      const service = SERVICES.find(s => s.id === serviceId)
      if (service) {
        if (isCurrentlySelected) {
          // Service removed
          setTimeout(() => {
            console.log(`${service.name} removed from your event`)
          }, 100)
        } else {
          // Service added
          setTimeout(() => {
            console.log(`${service.name} added to your event`)
          }, 100)
        }
      }
      
      return newSelection
    })
  }

  const getSelectedServicesTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = SERVICES.find(s => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)
  }

  const getVenueCost = () => {
    return venuePrice ? parseInt(venuePrice) : 0
  }

  const getGrandTotal = () => {
    return getSelectedServicesTotal() + getVenueCost()
  }

  const servicesTotal = getSelectedServicesTotal()
  const venueCost = getVenueCost()
  const totalCost = getGrandTotal()

  // Budget flexibility features
  const getBudgetRange = (budgetId: string): { min: number; max: number } => {
    // Handle custom budget format: custom-min-max
    if (budgetId.startsWith('custom-')) {
      const parts = budgetId.split('-')
      if (parts.length === 3) {
        const min = parseInt(parts[1]) || 1000
        const max = parseInt(parts[2]) || 3000
        return { min, max }
      }
    }
    
    switch (budgetId) {
      case 'budget-1': return { min: 500, max: 1000 }
      case 'budget-2': return { min: 1000, max: 3000 }
      case 'budget-3': return { min: 3000, max: 5000 }
      case 'budget-4': return { min: 5000, max: 50000 }
      default: return { min: 1000, max: 3000 }
    }
  }

  // Get budget values from URL parameter
  const budgetRange = getBudgetRange(budget)
  const minBudget = budgetRange.min
  const maxBudget = budgetRange.max
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

  // AI-powered service filtering based on event type and venue
  useEffect(() => {
    if (eventType && venue && !isLoadingAiFilter) {
      setIsLoadingAiFilter(true)
      
      const getAiFilteredServices = async () => {
        try {
          const response = await fetch('/api/service-recommendations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              eventType: eventType,
              guestCount: parseInt(guestCount) || 2,
              budget: budget,
              location: location,
              venue: venue,
              preferences: `Show only services that make logical sense for ${eventType} events at ${venue} venues. Be selective and only include services that are actually relevant to this specific event type and venue combination.`
            }),
          })

          if (response.ok) {
            const data = await response.json()
            const filteredServiceIds = data.recommendations?.map((rec: any) => rec.serviceId) || []
            setAiFilteredServices(filteredServiceIds)
          } else {
            // AI failed to return results
            console.error('AI filtering failed - no recommendations returned')
            setAiFilteredServices([])
          }
        } catch (error) {
          console.error('Error getting AI-filtered services:', error)
          setAiFilteredServices([])
        } finally {
          setIsLoadingAiFilter(false)
        }
      }

      getAiFilteredServices()
    }
  }, [eventType, venue, guestCount, budget, location])

  function next() {
    const params = new URLSearchParams({
      eventType: eventType,
      location: location,
      date: date,
      hostName: hostName,
      startTime: startTime,
      endTime: endTime,
      guestCount: guestCount,
      budget: budget,
      venue: venue,
      services: selectedServices.join(','),
      servicesTotal: servicesTotal.toString(),
      specificVenue: specificVenue,
      venueName: venueName,
      venueAddress: venueAddress,
      venuePrice: venuePrice,
      venuePackage: venuePackage
    })
    router.push(`/create/preview?${params.toString()}`)
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      <StepHeader step={5} title="Select Services" />
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Curate Your Experience</h2>
          <p className="text-sm text-gray-600">Select the services you need for your event</p>
          {eventType && location && (
            <div className="mt-2 text-sm text-purple-600 font-medium">
              Planning: {eventType} in {location}
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 rounded-2xl border border-gray-200 focus:outline-none focus:border-purple-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterCategory('')}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                filterCategory === '' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {SERVICE_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  filterCategory === category 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* AI Filter Loading */}
        {isLoadingAiFilter && (
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="text-sm font-medium text-blue-800 mb-2">🤖 Filtering Services...</div>
            <div className="text-xs text-blue-700">
              Analyzing your {eventType} event at {venue} venue to show only relevant services.
            </div>
          </div>
        )}

        {/* AI Filter Active */}
        {!isLoadingAiFilter && aiFilteredServices.length > 0 && (
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-sm font-medium text-green-800 mb-2">✨ Smart Filtering Active</div>
            <div className="text-xs text-green-700">
              Showing only services that make sense for your {eventType} event at {venue} venue. 
              {aiFilteredServices.length} relevant services available.
            </div>
          </div>
        )}

        {/* AI Filter Failed */}
        {!isLoadingAiFilter && aiFilteredServices.length === 0 && eventType && venue && (
          <div className="bg-red-50 p-4 rounded-xl">
            <div className="text-sm font-medium text-red-800 mb-2">❌ AI Filtering Not Working</div>
            <div className="text-xs text-red-700">
              AI filtering is not working. Showing all services. Please check the AI service configuration or try again later.
            </div>
          </div>
        )}

        {/* Services by Category */}
        <div className="space-y-6">
          {SERVICE_CATEGORIES.map(category => {
            // Start with all services in category
            let categoryServices = SERVICES.filter(service => service.category === category)
            
            // Apply AI filtering based on event type and venue
            if (aiFilteredServices.length > 0) {
              categoryServices = categoryServices.filter(service => 
                aiFilteredServices.includes(service.id)
              )
            } else if (eventType && venue && !isLoadingAiFilter) {
              // If AI filtering failed, show all services (let user choose)
              // This ensures the AI filtering is working properly
              console.log('AI filtering failed, showing all services for debugging')
            }
            
            // Apply search filter
            if (searchTerm) {
              categoryServices = categoryServices.filter(service =>
                service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.category.toLowerCase().includes(searchTerm.toLowerCase())
              )
            }
            
            // Apply category filter
            if (filterCategory && filterCategory !== category) {
              return null
            }
            
            // Don't render empty categories
            if (categoryServices.length === 0) {
              return null
            }
            
            return (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {category} ({categoryServices.length})
                </h3>
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

        {/* No Results Message */}
        {(searchTerm || filterCategory) && (
          (() => {
            let filteredServices = SERVICES
            if (searchTerm) {
              filteredServices = filteredServices.filter(service =>
                service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.category.toLowerCase().includes(searchTerm.toLowerCase())
              )
            }
            if (filterCategory) {
              filteredServices = filteredServices.filter(service => service.category === filterCategory)
            }
            
            return filteredServices.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 text-sm">
                  No services found matching your search criteria.
                  <br />
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setFilterCategory('')
                    }}
                    className="text-purple-600 underline mt-2"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            ) : null
          })()
        )}

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
                {/* Show venue cost if available */}
                {venueCost > 0 && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Venue Cost</span>
                    <span className="text-gray-700">${venueCost}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Services Cost</span>
                  <span className="text-gray-700">${servicesTotal}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-purple-800">Total Cost</span>
                  <span className="text-purple-800">${totalCost}</span>
                </div>
                
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Your Budget</span>
                  <span className="text-gray-600">
                    ${minBudget.toLocaleString()} - ${maxBudget.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className={isOverBudget ? "text-red-600" : "text-green-600"}>
                    {isOverBudget ? "Over Budget" : "Remaining"}
                  </span>
                  <span className={isOverBudget ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                    {isOverBudget ? `+$${Math.abs(budgetRemaining)}` : `$${Math.abs(budgetRemaining)}`}
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

        {/* Skip Services Option - Only show when no services are selected */}
        {selectedServices.length === 0 && (
          <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700 mb-2">Don't need additional services?</div>
              <div className="text-xs text-gray-600 mb-3">
                You can skip this step and proceed with just your venue selection.
              </div>
              <button
                onClick={next}
                className="bg-gray-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Skip Services & Continue
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions Floating Panel */}
        {selectedServices.length > 0 && (
          <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-20">
            <div className="bg-purple-600 text-white p-4 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected</div>
                  <div className="text-xs opacity-90">Total: ${totalCost}</div>
                </div>
                <button
                  onClick={next}
                  className="bg-white text-purple-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}


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
