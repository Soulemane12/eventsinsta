export interface Service {
  id: string
  name: string
  category: string
  description: string
  price: number
  priceDescription: string
  icon: string
  instagram?: string
}

export const SERVICE_CATEGORIES = [
  'DJ',
  'Car Services', 
  'Photography',
  'Beauty',
  'Venues',
  'Vacation',
  'Kids',
  'Wedding',
  'Sports',
  'Golf',
  'Exotic Cars',
  'Yacht'
] as const

export const SERVICES: Service[] = [
  // DJ Services
  {
    id: 'dj-ceo',
    name: 'DJ CEO',
    category: 'DJ',
    description: 'Professional DJ with 10+ years experience. Specializing in all genres from hip-hop to electronic. Full sound system included.',
    price: 600,
    priceDescription: '$600 for full event',
    icon: '🎵'
  },

  // Car Services
  {
    id: 'car-service-isit',
    name: 'I-sit Corp',
    category: 'Car Services',
    description: 'Professional car service for events. Luxury vehicles with professional drivers. 3-hour minimum booking.',
    price: 250,
    priceDescription: '$250 for 3 hours',
    icon: '🚗'
  },

  // Photography
  {
    id: 'photographer-premium',
    name: 'TheGoodStewardProductions by Dietric Paul',
    category: 'Photography',
    description: 'Professional photographer with editing included. Specializing in event photography with 5+ years experience. 4 hours of photography and videography. Check out our work @capturemoments_nyc',
    price: 750,
    priceDescription: '$750 for 4 hours',
    icon: '📸',
    instagram: '@capturemoments_nyc'
  },

  // Beauty Services
  {
    id: 'makeup-artist',
    name: 'Glamour Makeup Artist',
    category: 'Beauty',
    description: 'Professional makeup artist for special events. Airbrush makeup, false lashes, and touch-ups included.',
    price: 150,
    priceDescription: '$150 per person',
    icon: '💄'
  },

  // Venue Rentals
  {
    id: 'venue-hamptons-3br',
    name: 'The Hamptons 3BR/2BA with Basement',
    category: 'Venues',
    description: 'Luxury vacation rental in The Hamptons. 3 bedrooms, 2 bathrooms with finished basement. Perfect for events and gatherings.',
    price: 7000,
    priceDescription: '$7,000 per week',
    icon: '🏠'
  },

  {
    id: 'venue-hamptons-pool',
    name: 'The Hamptons House with Pool',
    category: 'Venues',
    description: 'Premium Hamptons rental with private pool. Perfect for summer events and celebrations.',
    price: 15000,
    priceDescription: '$15,000 per week',
    icon: '🏊‍♂️'
  },

  {
    id: 'venue-marthas-vineyard-3br',
    name: 'Martha\'s Vineyard 3BR/2BA with Basement',
    category: 'Venues',
    description: 'Beautiful Martha\'s Vineyard rental. 3 bedrooms, 2 bathrooms with finished basement. Ideal for destination events.',
    price: 7000,
    priceDescription: '$7,000 per week',
    icon: '🏠'
  },

  {
    id: 'venue-marthas-vineyard-pool',
    name: 'Martha\'s Vineyard House with Pool',
    category: 'Venues',
    description: 'Luxury Martha\'s Vineyard rental with private pool. Perfect for upscale events and celebrations.',
    price: 15000,
    priceDescription: '$15,000 per week',
    icon: '🏊‍♂️'
  },

  // Vacation Packages
  {
    id: 'vacation-aruba-swiss-paradise',
    name: 'Swiss Paradise Aruba',
    category: 'Vacation',
    description: '5-night vacation package to Aruba. Flight departing from JFK. All-inclusive resort experience.',
    price: 1800,
    priceDescription: '$1,800 for 5 nights',
    icon: '🏝️'
  },

  // Kids Birthday Packages
  {
    id: 'kids-birthday-package',
    name: 'Kids Birthday Package',
    category: 'Kids',
    description: 'Complete birthday celebration for kids ages 2-12. Up to 35 kids. Includes decorations, activities, and entertainment.',
    price: 1500,
    priceDescription: '$1,500 for up to 35 kids',
    icon: '🎂'
  },

  // Wedding Package
  {
    id: 'wedding-metropolitan',
    name: 'Metropolitan Wedding Package',
    category: 'Wedding',
    description: 'Wedding venue at Metropolitan, Glen Cove NY. 250 guests. Includes food and liquor for 5 hours.',
    price: 50000,
    priceDescription: '$50,000 for 250 guests',
    icon: '💒'
  },

  // Sports Birthday Package
  {
    id: 'sports-knicks-birthday',
    name: 'NY Knicks Birthday Package',
    category: 'Sports',
    description: 'NY Knicks game experience. 5 lower-level tickets (Sections 100-200). Includes drinks and birthday shoutout on Jumbotron.',
    price: 1000,
    priceDescription: '$1,000 for 5 tickets',
    icon: '🏀'
  },

  {
    id: 'sports-knicks-jersey-signing',
    name: 'NY Knicks with Jersey Signing',
    category: 'Sports',
    description: 'NY Knicks game experience with player jersey signing. 5 lower-level tickets. Includes drinks, birthday shoutout, and jersey signing.',
    price: 1500,
    priceDescription: '$1,500 for 5 tickets + signing',
    icon: '🏀'
  },

  // Additional Services
  {
    id: 'mobile-barber',
    name: 'Mobile Barber',
    category: 'Beauty',
    description: 'Professional mobile barber service. Comes to your location for haircuts and grooming.',
    price: 100,
    priceDescription: '$100 per service',
    icon: '✂️'
  },

  {
    id: 'golf-lessons-access',
    name: 'Access Golf by Kelly Pierre',
    category: 'Golf',
    description: 'Professional golf lessons. 10 people for 2 hours. Expert instruction from Kelly Pierre.',
    price: 1000,
    priceDescription: '$1,000 for 10 people (2 hours)',
    icon: '⛳'
  },

  // Exotic Car Rentals
  {
    id: 'exotic-car-bmw-2025',
    name: 'BMW 2025',
    category: 'Exotic Cars',
    description: 'Luxury BMW 2025 model. Premium driving experience for special occasions.',
    price: 2000,
    priceDescription: '$2,000 for 5 days',
    icon: '🚗'
  },

  {
    id: 'exotic-car-rolls-royce-ghost',
    name: 'Rolls Royce Ghost 2025',
    category: 'Exotic Cars',
    description: 'Ultra-luxury Rolls Royce Ghost 2025. The ultimate in automotive excellence.',
    price: 7500,
    priceDescription: '$7,500 for 5 days',
    icon: '🚗'
  },

  {
    id: 'exotic-car-mercedes-gwagon',
    name: 'Mercedes-Benz G-Wagon 2025',
    category: 'Exotic Cars',
    description: 'Luxury Mercedes-Benz G-Wagon 2025. Iconic SUV for the discerning driver.',
    price: 5000,
    priceDescription: '$5,000 for 5 days',
    icon: '🚗'
  },

  {
    id: 'exotic-car-range-rover',
    name: 'Range Rover 2025',
    category: 'Exotic Cars',
    description: 'Premium Range Rover 2025. Luxury SUV with exceptional performance.',
    price: 5000,
    priceDescription: '$5,000 for 5 days',
    icon: '🚗'
  },

  // Yacht Party
  {
    id: 'yacht-party-jboogie',
    name: 'JBoogieBrooklynBoatingTours',
    category: 'Yacht',
    description: 'Private yacht party experience. 3-hour rental includes captain, snacks, light refreshments, and 3 bottles of premium liquor.',
    price: 2500,
    priceDescription: '$2,500 for 3 hours',
    icon: '🛥️'
  }
]

export function getServicesByCategory(category: string): Service[] {
  return SERVICES.filter(service => service.category === category)
}

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find(service => service.id === id)
}
