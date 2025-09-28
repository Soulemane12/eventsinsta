import React from 'react'
import { SportsArena } from '../data/sportsArenas'
import { getSportsArenaPriceByGuestCount } from '../data/sportsArenas'

interface AISportsArenaCardProps {
  arena: SportsArena
  aiRecommendation?: {
    arenaId: string
    confidence: number
    reasoning: string
    bestPackage: string
    whyPerfect: string
  }
  onSelect: (arenaId: string) => void
  isSelected: boolean
  showDetails?: boolean
  guestCount: number
}

export default function AISportsArenaCard({
  arena,
  aiRecommendation,
  onSelect,
  isSelected,
  showDetails = false,
  guestCount
}: AISportsArenaCardProps) {
  const getPackageForGuestCount = () => {
    if (guestCount <= 20) {
      return arena.packages.find(p => p.guestCount === 20)
    } else if (guestCount <= 50) {
      return arena.packages.find(p => p.guestCount === 50)
    } else if (guestCount <= 100) {
      return arena.packages.find(p => p.guestCount === 100)
    } else {
      return arena.packages.find(p => p.guestCount === 100)
    }
  }

  const recommendedPackage = getPackageForGuestCount()
  const totalPrice = getSportsArenaPriceByGuestCount(arena.id, guestCount)

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
            <h3 className="text-xl font-bold text-gray-900 mb-1">{arena.name}</h3>
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

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          {arena.description}
        </p>

        {/* Recommended Package for Guest Count */}
        {recommendedPackage && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="font-medium text-blue-900">Recommended for {guestCount} guests</h5>
                <p className="text-sm font-semibold text-blue-800">{recommendedPackage.name}</p>
              </div>
              <span className="text-lg font-bold text-blue-600">${totalPrice}</span>
            </div>
            <p className="text-xs text-blue-700 mb-2">{recommendedPackage.description}</p>
            <div className="text-xs text-blue-600">
              <span className="font-medium">Includes:</span> {recommendedPackage.includes.join(', ')}
            </div>
          </div>
        )}

        {/* All Packages (if showDetails is true) */}
        {showDetails && (
          <div className="space-y-3 mb-4">
            <h4 className="font-semibold text-gray-900">All Available Packages:</h4>
            {arena.packages.map((pkg, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-900">{pkg.name}</h5>
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
            ))}
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {arena.features.map((feature, index) => (
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
          <div>📞 {arena.phone}</div>
          <div>📧 {arena.email}</div>
          <div>🕒 {arena.hours}</div>
        </div>
      </div>
    </div>
  )
}