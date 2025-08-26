interface ExoticCarCardProps {
  service: any
  isSelected: boolean
  onToggle: (serviceId: string) => void
  budget: number
  totalCost: number
}

export function ExoticCarCard({ service, isSelected, onToggle, budget, totalCost }: ExoticCarCardProps) {
  const isOverBudget = totalCost > budget
  const isThisServiceOverBudget = isSelected && isOverBudget

  const getCarImage = (carName: string) => {
    switch (carName.toLowerCase()) {
      case 'bmw 2025':
        return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop'
      case 'rolls royce ghost 2025':
        return 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=250&fit=crop'
      case 'mercedes-benz g-wagon 2025':
        return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop'
      case 'range rover 2025':
        return 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=250&fit=crop'
      default:
        return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop'
    }
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-purple-500 shadow-lg' 
          : 'hover:shadow-md'
      } ${isThisServiceOverBudget ? 'ring-2 ring-red-500' : ''}`}
      onClick={() => onToggle(service.id)}
    >
      {/* Car Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={getCarImage(service.name)}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Car Details */}
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900">{service.name}</h3>
          <span className="text-2xl">{service.icon}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{service.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-right">
            <p className="font-bold text-lg text-purple-600">{service.priceDescription}</p>
            <p className="text-sm text-gray-500">${service.price.toLocaleString()}</p>
          </div>
        </div>

        {isThisServiceOverBudget && (
          <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded">
            <p className="text-xs text-red-700 font-medium">
              ⚠️ Over budget by ${(service.price - (budget - (totalCost - service.price))).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
