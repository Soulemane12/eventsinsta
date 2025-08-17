import React, { useState } from 'react'
import { Restaurant } from '../data/restaurants'

interface AIRestaurantCardProps {
  restaurant: Restaurant
  aiRecommendation: {
    confidence: number
    reasoning: string
    bestPackage: string
    whyPerfect: string
  }
  onSelect: (restaurantId: string) => void
  isSelected: boolean
}

export default function AIRestaurantCard({ 
  restaurant, 
  aiRecommendation, 
  onSelect, 
  isSelected 
}: AIRestaurantCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const confidenceColor = aiRecommendation.confidence >= 0.9 ? 'bg-green-100 text-green-800' :
                         aiRecommendation.confidence >= 0.7 ? 'bg-blue-100 text-blue-800' :
                         'bg-yellow-100 text-yellow-800'

  const confidenceText = aiRecommendation.confidence >= 0.9 ? 'Perfect Match' :
                        aiRecommendation.confidence >= 0.7 ? 'Great Match' :
                        'Good Match'

  return (
    <div className="space-y-3">
      {/* Compact Card (Default View) */}
      <div 
        className={`rounded-2xl bg-white shadow-lg border-2 transition-all cursor-pointer ${
          isSelected 
            ? 'border-purple-600 bg-purple-50' 
            : 'border-gray-200 hover:border-purple-300'
        }`}
        onClick={() => onSelect(restaurant.id)}
      >
        <div className="p-4">
          {/* Header with AI Badge */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900">{restaurant.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${confidenceColor}`}>
                  {confidenceText} {Math.round(aiRecommendation.confidence * 100)}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>📍 {restaurant.address.split(',')[0]}</span>
                <span>💰 {restaurant.priceRange}</span>
              </div>
            </div>
            {isSelected && (
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            )}
          </div>

          {/* AI Recommendation Preview */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg mb-3">
            <div className="flex items-start gap-2">
              <div className="text-purple-600 text-lg">🤖</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-800 mb-1">
                  AI Recommendation
                </p>
                <p className="text-xs text-purple-700 line-clamp-2">
                  {aiRecommendation.whyPerfect}
                </p>
              </div>
            </div>
          </div>

          {/* Best Package Preview */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium text-gray-900">Best Package: </span>
              <span className="text-purple-600">{aiRecommendation.bestPackage}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="text-purple-600 text-sm font-medium hover:text-purple-700"
            >
              {isExpanded ? 'Show Less' : 'View Details'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 animate-in slide-in-from-top-2">
          <div className="space-y-4">
            {/* AI Reasoning */}
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">🤖 Why This Restaurant?</h4>
              <p className="text-sm text-purple-700">{aiRecommendation.reasoning}</p>
            </div>

            {/* Restaurant Description */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">About {restaurant.name}</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{restaurant.description}</p>
            </div>

            {/* Packages */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Available Packages</h4>
              <div className="space-y-2">
                {restaurant.packages.map((pkg, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-medium text-gray-900">{pkg.name}</h5>
                      <span className="text-lg font-bold text-purple-600">${pkg.price}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{pkg.description}</p>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Includes:</span> {pkg.includes.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
              <div className="flex flex-wrap gap-2">
                {restaurant.features.map((feature, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>📞 {restaurant.phone}</div>
                <div>📧 {restaurant.email}</div>
                <div>🕒 {restaurant.hours}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
