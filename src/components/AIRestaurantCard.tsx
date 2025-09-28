import React from 'react'
import { Restaurant } from '../data/restaurants'
import { getRestaurantPriceByGuestCount } from '../data/restaurants'

interface AIRestaurantCardProps {
  restaurant: Restaurant
  aiRecommendation?: {
    restaurantId: string
    confidence: number
    reasoning: string
    bestPackage: string
    whyPerfect: string
  }
  onSelect: (restaurantId: string) => void
  isSelected: boolean
  showDetails?: boolean
  guestCount: number
  selectedPackage?: string
  onPackageSelect?: (restaurantId: string, packageName: string) => void
}

export default function AIRestaurantCard({
  restaurant,
  aiRecommendation,
  onSelect,
  isSelected,
  showDetails = false,
  guestCount,
  selectedPackage,
  onPackageSelect
}: AIRestaurantCardProps) {
  const getPackageForGuestCount = () => {
    if (guestCount <= 2) {
      return restaurant.packages.find(p => p.guestCount === 2)
    } else if (guestCount <= 25) {
      return restaurant.packages.find(p => p.guestCount === 25)
    } else if (guestCount <= 50) {
      return restaurant.packages.find(p => p.guestCount === 50)
    } else {
      return restaurant.packages.find(p => p.guestCount === 50)
    }
  }

  const recommendedPackage = getPackageForGuestCount()
  const totalPrice = getRestaurantPriceByGuestCount(restaurant.id, guestCount)

  // Get the currently selected package or fall back to recommended
  const currentPackage = selectedPackage
    ? restaurant.packages.find(p => p.name === selectedPackage)
    : recommendedPackage

  // Calculate price for selected package
  const currentPrice = selectedPackage && currentPackage
    ? currentPackage.price
    : totalPrice

  return (
    <div
      className={`rounded-2xl bg-white shadow-lg border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-purple-600 bg-purple-50'
          : 'border-gray-200 hover:border-purple-300'
      }`}
      onClick={() => onSelect(restaurant.id)}
    >
      <div className="p-6">
        {/* AI Recommendation Badge */}
        {aiRecommendation && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-green-800">
                🤖 AI Recommended ({Math.round(aiRecommendation.confidence * 100)}% match)
              </span>
            </div>
            <div className="text-xs text-green-700 mb-1">
              <strong>Why perfect:</strong> {aiRecommendation.whyPerfect}
            </div>
            <div className="text-xs text-green-600">
              <strong>Best package:</strong> {aiRecommendation.bestPackage}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{restaurant.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>📍 {restaurant.address}</span>
            </div>
          </div>
          {isSelected && (
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          {restaurant.description}
        </p>

        {/* Current/Recommended Package for Guest Count */}
        {currentPackage && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-blue-900">
                  {selectedPackage ? 'Selected Package' : `Recommended for ${guestCount} guests`}
                </h5>
                <p className="text-sm font-semibold text-blue-800">{currentPackage.name}</p>
              </div>
              <span className="text-lg font-bold text-blue-600">${currentPrice}</span>
            </div>
            <p className="text-xs text-blue-700 mb-2">{currentPackage.description}</p>
            <div className="text-xs text-blue-600">
              <span className="font-medium">Includes:</span> {currentPackage.includes.join(', ')}
            </div>
          </div>
        )}

        {/* All Packages (if showDetails is true) */}
        {showDetails && (
          <div className="space-y-3 mb-4">
            <h4 className="font-semibold text-gray-900">All Available Packages:</h4>
            {restaurant.packages.map((pkg, index) => {
              const isPackageSelected = selectedPackage === pkg.name
              const isRecommended = recommendedPackage?.name === pkg.name
              return (
                <div
                  key={index}
                  className={`rounded-lg p-3 border-2 transition-all cursor-pointer ${
                    isPackageSelected
                      ? 'bg-purple-50 border-purple-300'
                      : isRecommended
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation() // Prevent card selection
                    if (onPackageSelect) {
                      onPackageSelect(restaurant.id, pkg.name)
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={isPackageSelected}
                        onChange={() => {}}
                        className="w-4 h-4 text-purple-600"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <h5 className="font-medium text-gray-900">{pkg.name}</h5>
                        {isRecommended && !isPackageSelected && (
                          <span className="text-xs text-blue-600 font-medium">⭐ Recommended</span>
                        )}
                        {isPackageSelected && (
                          <span className="text-xs text-purple-600 font-medium">✓ Selected</span>
                        )}
                      </div>
                    </div>
                    <span className="text-lg font-bold text-purple-600">${pkg.price}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{pkg.description}</p>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Includes:</span> {pkg.includes.join(', ')}
                  </div>
                  {pkg.guestCount && (
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Capacity:</span> Up to {pkg.guestCount} guests
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {restaurant.features.map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Contact Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>📞 {restaurant.phone}</div>
          <div>📧 {restaurant.email}</div>
          <div>🕒 {restaurant.hours}</div>
        </div>
      </div>
    </div>
  )
}