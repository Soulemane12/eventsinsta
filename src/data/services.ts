export interface Service {
  id: string
  name: string
  category: string
  description: string
  price: number
  priceDescription: string
  icon: string
  instagram?: string
  image?: string
}

export const SERVICES: Service[] = [
  // Restaurant Venues
  {
    id: 'restaurant-venue-upscale',
    name: 'Upscale Restaurant Venue',
    category: 'Restaurants',
    description: 'Premium restaurant venue for private events. Includes dedicated staff and customized menu options.',
    price: 3000,
    priceDescription: '$3,000 base fee',
    icon: '🍽️'
  },
  {
    id: 'restaurant-venue-casual',
    name: 'Casual Restaurant Venue',
    category: 'Restaurants',
    description: 'Relaxed restaurant setting for casual gatherings and celebrations.',
    price: 1500,
    priceDescription: '$1,500 base fee',
    icon: '🍽️'
  },
  // DJ Services
  {
    id: 'dj-ceo',
    name: 'DJ CEO',
    category: 'DJ',
    description: 'Professional DJ with premium sound system and lighting',
    price: 600,
    priceDescription: '$600 for full event',
    icon: '🎵'
  },
  {
    id: 'dj-standard',
    name: 'Standard DJ',
    category: 'DJ',
    description: 'Professional DJ service with basic equipment',
    price: 400,
    priceDescription: '$400 for full event',
    icon: '🎵'
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
  {
    id: 'photographer-standard',
    name: 'Standard Photographer',
    category: 'Photography',
    description: 'Professional photography service with basic editing',
    price: 400,
    priceDescription: '$400 for full event',
    icon: '📸'
  },
  
  // Car Services
  {
    id: 'isit-corp',
    name: 'I-sit Corp',
    category: 'Car Services',
    description: 'Premium car service for up to 3 hours',
    price: 250,
    priceDescription: '$250 up to 3 hours',
    icon: '🚗'
  },
  {
    id: 'car-standard',
    name: 'Standard Car Service',
    category: 'Car Services',
    description: 'Professional car service for up to 2 hours',
    price: 150,
    priceDescription: '$150 up to 2 hours',
    icon: '🚗'
  },
  
  // Catering
  {
    id: 'catering-premium',
    name: 'Premium Catering',
    category: 'Catering',
    description: 'Full-service catering with wait staff',
    price: 1200,
    priceDescription: '$1200 for 50 guests',
    icon: '🍽️'
  },
  {
    id: 'catering-standard',
    name: 'Standard Catering',
    category: 'Catering',
    description: 'Buffet-style catering service',
    price: 800,
    priceDescription: '$800 for 50 guests',
    icon: '🍽️'
  },
  
  // Makeup & Hair
  {
    id: 'makeup-premium',
    name: 'Premium Makeup Artist',
    category: 'Makeup & Hair',
    description: 'Professional makeup and hair styling',
    price: 300,
    priceDescription: '$300 per person',
    icon: '💄'
  },
  {
    id: 'makeup-standard',
    name: 'Standard Makeup Artist',
    category: 'Makeup & Hair',
    description: 'Professional makeup service',
    price: 200,
    priceDescription: '$200 per person',
    icon: '💄'
  },
  
  // Decorations
  {
    id: 'decorations-premium',
    name: 'Premium Decorations',
    category: 'Decorations',
    description: 'Full event decoration and setup',
    price: 1000,
    priceDescription: '$1000 for full setup',
    icon: '🎨'
  },
  {
    id: 'decorations-standard',
    name: 'Standard Decorations',
    category: 'Decorations',
    description: 'Basic decoration package',
    price: 600,
    priceDescription: '$600 for basic setup',
    icon: '🎨'
  },
  
  // Entertainment
  {
    id: 'entertainment-live-band',
    name: 'Live Band',
    category: 'Entertainment',
    description: 'Professional live band performance',
    price: 1500,
    priceDescription: '$1500 for 3 hours',
    icon: '🎤'
  },
  {
    id: 'entertainment-magician',
    name: 'Magician',
    category: 'Entertainment',
    description: 'Professional magician for entertainment',
    price: 400,
    priceDescription: '$400 for 1 hour',
    icon: '🎩'
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
  {
    id: 'wedding-venue-garden',
    name: 'Garden Wedding Venue',
    category: 'Wedding',
    description: 'Beautiful garden venue for wedding ceremonies and receptions. Perfect for outdoor celebrations.',
    price: 15000,
    priceDescription: '$15,000 for venue rental',
    icon: '💒'
  },
  {
    id: 'wedding-venue-ballroom',
    name: 'Grand Ballroom Wedding Venue',
    category: 'Wedding',
    description: 'Elegant ballroom venue for wedding receptions. Includes basic decor and setup.',
    price: 25000,
    priceDescription: '$25,000 for venue rental',
    icon: '💒'
  },

  // Sports Birthday Package
  {
    id: 'sports-knicks-birthday',
    name: 'NY Knicks Birthday Package',
    category: 'Sporting Events',
    description: 'NY Knicks game experience. 5 lower-level tickets (Sections 100-200). Includes drinks and birthday shoutout on Jumbotron.',
    price: 1000,
    priceDescription: '$1,000 for 5 tickets',
    icon: '🏀'
  },
  {
    id: 'sports-knicks-jersey-signing',
    name: 'NY Knicks with Jersey Signing',
    category: 'Sporting Events',
    description: 'NY Knicks game experience with player jersey signing. 5 lower-level tickets. Includes drinks, birthday shoutout, and jersey signing.',
    price: 1500,
    priceDescription: '$1,500 for 5 tickets + signing',
    icon: '🏀'
  },

  // Private Home Rentals
  {
    id: 'venue-hamptons-3br',
    name: 'The Hamptons 3BR/2BA with Basement',
    category: 'Private Home Rentals',
    description: 'Luxury vacation rental in The Hamptons. 3 bedrooms, 2 bathrooms with finished basement. Perfect for events and gatherings.',
    price: 7000,
    priceDescription: '$7,000 per week',
    icon: '🏠'
  },
  {
    id: 'venue-hamptons-pool',
    name: 'The Hamptons House with Pool',
    category: 'Private Home Rentals',
    description: 'Premium Hamptons rental with private pool. Perfect for summer events and celebrations.',
    price: 15000,
    priceDescription: '$15,000 per week',
    icon: '🏊‍♂️'
  },
  {
    id: 'venue-marthas-vineyard-3br',
    name: 'Martha\'s Vineyard 3BR/2BA with Basement',
    category: 'Private Home Rentals',
    description: 'Beautiful Martha\'s Vineyard rental. 3 bedrooms, 2 bathrooms with finished basement. Ideal for destination events.',
    price: 7000,
    priceDescription: '$7,000 per week',
    icon: '🏠'
  },
  {
    id: 'venue-marthas-vineyard-pool',
    name: 'Martha\'s Vineyard House with Pool',
    category: 'Private Home Rentals',
    description: 'Luxury Martha\'s Vineyard rental with private pool. Perfect for upscale events and celebrations.',
    price: 15000,
    priceDescription: '$15,000 per week',
    icon: '🏊‍♂️'
  },

  // Venue Types
  {
    id: 'venue-type-private-home',
    name: 'Private Home Venue',
    category: 'Venue Type',
    description: 'Luxury private homes available for events. Various locations and sizes to accommodate different group sizes.',
    price: 5000,
    priceDescription: '$5,000 base fee',
    icon: '🏠'
  },
  {
    id: 'venue-type-boat',
    name: 'Boat Venue',
    category: 'Venue Type',
    description: 'Private yacht and boat rentals for unique waterfront events and celebrations.',
    price: 3000,
    priceDescription: '$3,000 base fee',
    icon: '🛥️'
  },
  {
    id: 'venue-type-restaurant',
    name: 'Restaurant Venue',
    category: 'Venue Type',
    description: 'Private dining rooms and restaurant venues for intimate or large gatherings.',
    price: 2500,
    priceDescription: '$2,500 base fee',
    icon: '🍽️'
  },
  {
    id: 'venue-type-event-space',
    name: 'Event Space Venue',
    category: 'Venue Type',
    description: 'Dedicated event spaces and halls perfect for conferences, parties, and special occasions.',
    price: 4000,
    priceDescription: '$4,000 base fee',
    icon: '🏛️'
  },

  // Additional Services
  {
    id: 'mobile-barber',
    name: 'Mobile Barber',
    category: 'Mobile Professionals',
    description: 'Professional mobile barber service. Comes to your location for haircuts and grooming.',
    price: 100,
    priceDescription: '$100 per service',
    icon: '✂️'
  },
  {
    id: 'golf-lessons-access',
    name: 'Access Golf by Kelly Pierre',
    category: 'Sporting Events',
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
    icon: '🚗',
    image: '/bmw-2025.jpg'
  },
  {
    id: 'exotic-car-rolls-royce-ghost',
    name: 'Rolls Royce Ghost 2025',
    category: 'Exotic Cars',
    description: 'Ultra-luxury Rolls Royce Ghost 2025. The ultimate in automotive excellence.',
    price: 7500,
    priceDescription: '$7,500 for 5 days',
    icon: '🚗',
    image: '/rolls-royce-ghost-2025.jpg'
  },
  {
    id: 'exotic-car-mercedes-gwagon',
    name: 'Mercedes-Benz G-Wagon 2025',
    category: 'Exotic Cars',
    description: 'Luxury Mercedes-Benz G-Wagon 2025. Iconic SUV for the discerning driver.',
    price: 5000,
    priceDescription: '$5,000 for 5 days',
    icon: '🚗',
    image: '/mercedes-gwagon-2025.jpg'
  },
  {
    id: 'exotic-car-range-rover',
    name: 'Range Rover 2025',
    category: 'Exotic Cars',
    description: 'Premium Range Rover 2025. Luxury SUV with exceptional performance.',
    price: 5000,
    priceDescription: '$5,000 for 5 days',
    icon: '🚗',
    image: '/range-rover-2025.jpg'
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

export const SERVICE_CATEGORIES = [
  'DJ',
  'Photography',
  'Car Services',
  'Catering',
  'Makeup & Hair',
  'Decorations',
  'Entertainment',
  'Vacation',
  'Kids',
  'Wedding',
  'Sporting Events',
  'Private Home Rentals',
  'Venue Type',
  'Mobile Professionals',
  'Exotic Cars',
  'Yacht',
  'Restaurants'
]

export function getServicesByCategory(category: string): Service[] {
  return SERVICES.filter(service => service.category === category)
}

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find(service => service.id === id)
}
