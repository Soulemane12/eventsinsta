import React, { useState } from 'react'
import { SportsArena, getSportsArenaPriceByGuestCount } from '../data/sportsArenas'

interface AIRecommendation {
  arenaId: string
  confidence: number
  reasoning: string
  bestPackage: string
  whyPerfect: string
}

interface AISportsArenaCardProps {
  arena: SportsArena
  aiRecommendation?: AIRecommendation
  onSelect: (arenaId: string) => void
  isSelected: boolean
  showDetails?: boolean
  guestCount?: number
}

export default function AISportsArenaCard({ 
  arena, 
  aiRecommendation, 
  onSelect, 
  isSelected,
  showDetails = false,
  guestCount = 20
}: AISportsArenaCardProps) {
  const [expanded, setExpanded] = useState(false)

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100'
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Perfect Match'
    if (confidence >= 0.6) return 'Good Match'
    return 'Fair Match'
  }

  const getArenaPrice = () => {
    return getSportsArenaPriceByGuestCount(arena.id, guestCount)
  }

  return (
    <div 
      className={`rounded-2xl bg-white shadow-lg border-2 transition-all cursor-pointer ${
        isSelected 
          ? 'border-purple-600 bg-purple-50' 
          : 'border-gray-200 hover:border-purple-300'
      }`}
      onClick={() => onSelect(arena.id)}
    >
      <div className="p-6">
        {/* Header with AI Recommendation */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900">{arena.name}</h3>
              {aiRecommendation && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(aiRecommendation.confidence)}`}>
                  {getConfidenceText(aiRecommendation.confidence)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{arena.sportType}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>📍 {arena.address}</span>
            </div>
          </div>
          {isSelected && (
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          )}
        </div>

        {/* Recommendation Section */}
        {aiRecommendation && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl mb-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">⭐</span>
              </div>
              <span className="text-sm font-semibold text-purple-800">Perfect Match</span>
              <span className="text-xs text-gray-500">({Math.round(aiRecommendation.confidence * 100)}% match)</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{aiRecommendation.reasoning}</p>
            <div className="text-xs text-purple-700">
              <strong>Best Package:</strong> {aiRecommendation.bestPackage}
            </div>
          </div>
        )}

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="bg-gray-50 p-2 rounded-lg">
            <div className="font-medium text-gray-700">Price for {guestCount} guests</div>
            <div className="text-lg font-bold text-purple-600">${getArenaPrice()}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg">
            <div className="font-medium text-gray-700">Capacity</div>
            <div className="text-gray-600">{arena.guestRange.min}-{arena.guestRange.max} guests</div>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {arena.features.slice(0, 4).map((feature, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
            >
              {feature}
            </span>
          ))}
          {arena.features.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{arena.features.length - 4} more
            </span>
          )}
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(!expanded)
              }}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium mb-3"
            >
              {expanded ? 'Show Less' : 'Show Details'}
            </button>
            
            {expanded && (
              <div className="space-y-4">
                {/* Packages */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Available Packages:</h4>
                  <div className="space-y-2">
                    {arena.packages.map((pkg, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-medium text-gray-900 text-sm">{pkg.name}</h5>
                          <span className="text-sm font-bold text-purple-600">${pkg.price}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{pkg.description}</p>
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Includes:</span> {pkg.includes.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div>📞 {arena.phone}</div>
                  <div>📧 {arena.email}</div>
                  <div>🕒 {arena.hours}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelect(arena.id)
          }}
          className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors ${
            isSelected
              ? 'bg-purple-600 text-white'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          }`}
        >
          {isSelected ? 'Selected' : 'Select This Arena'}
        </button>
      </div>
    </div>
  )
}
