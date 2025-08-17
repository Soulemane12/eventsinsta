import React from 'react'

interface RestaurantCardProps {
  restaurant: {
    id: string
    name: string
    description: string
    address: string
    phone: string
    email: string
    website: string
    image: string
    cuisine: string
    priceRange: string
    packages: Array<{
      name: string
      price: number
      description: string
      includes: string[]
    }>
    hours: string
    features: string[]
  }
  onSelect: (restaurantId: string) => void
  isSelected: boolean
}

export default function RestaurantCard({ restaurant, onSelect, isSelected }: RestaurantCardProps) {
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

        {/* Packages */}
        <div className="space-y-3 mb-4">
          <h4 className="font-semibold text-gray-900">Available Packages:</h4>
          {restaurant.packages.map((pkg, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
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
