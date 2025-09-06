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
  // DJ Services
  {
    id: 'dj-ceo',
    name: 'DJ CEO',
    category: 'DJ',
    description: 'Professional DJ with premium sound system and lighting',
    price: 600,
    priceDescription: '$600 for full event',
    icon: '🎵',
    image: '/dj-ceo.svg'
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
    instagram: '@capturemoments_nyc',
    image: '/photography-premium.svg'
  },
  {
    id: 'photographer-standard',
    name: 'Standard Photographer',
    category: 'Photography',
    description: 'Professional photography service with basic editing',
    price: 400,
    priceDescription: '$400 for full event',
    icon: '📸',
    image: '/photography-standard.svg'
  },
  
  // Car Services
  {
    id: 'isit-corp',
    name: 'I-sit Corp',
    category: 'Car Services',
    description: 'Premium car service for up to 3 hours',
    price: 250,
    priceDescription: '$250 up to 3 hours',
    icon: '🚗',
    image: '/l-sit.png'
  },
  {
    id: 'car-standard',
    name: 'Standard Car Service',
    category: 'Car Services',
    description: 'Professional car service for up to 2 hours',
    price: 150,
    priceDescription: '$150 up to 2 hours',
    icon: '🚗',
    image: '/car-standard.jpg'
  },
  
  // Catering
  {
    id: 'catering-premium',
    name: 'Premium Catering',
    category: 'Catering',
    description: 'Full-service catering with wait staff',
    price: 1200,
    priceDescription: '$1200 for 50 guests',
    icon: '🍽️',
    image: '/catering-premium.svg'
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
    id: 'wedding-venues',
    name: 'Wedding Venues',
    category: 'Wedding',
    description: 'Premium wedding venues with full-service packages. Various locations and capacities available.',
    price: 15000,
    priceDescription: '$15,000 starting price',
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
  {
    id: 'sporting-events',
    name: 'Sporting Events',
    category: 'Sporting Events',
    description: 'Premium sporting event experiences including tickets, VIP access, and exclusive packages.',
    price: 2000,
    priceDescription: '$2,000 starting price',
    icon: '⚽'
  },
  {
    id: 'boxing-lessons-eric-kelly',
    name: 'Boxing Lessons by Eric Kelly',
    category: 'Sporting Events',
    description: 'Professional boxing training sessions with Eric Kelly. Expert instruction for all skill levels, from beginners to advanced fighters.',
    price: 100,
    priceDescription: '$100 per hour',
    icon: '🥊'
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
    image: '/bmw.png'
  },
  {
    id: 'exotic-car-rolls-royce-ghost',
    name: 'Rolls Royce Ghost 2025',
    category: 'Exotic Cars',
    description: 'Ultra-luxury Rolls Royce Ghost 2025. The ultimate in automotive excellence.',
    price: 7500,
    priceDescription: '$7,500 for 5 days',
    icon: '🚗',
    image: '/2025ghostrollsroyce.png'
  },
  {
    id: 'exotic-car-mercedes-gwagon',
    name: 'Mercedes-Benz G-Wagon 2025',
    category: 'Exotic Cars',
    description: 'Luxury Mercedes-Benz G-Wagon 2025. Iconic SUV for the discerning driver.',
    price: 5000,
    priceDescription: '$5,000 for 5 days',
    icon: '🚗',
    image: '/gwagon.png'
  },
  {
    id: 'exotic-car-range-rover',
    name: 'Range Rover 2025',
    category: 'Exotic Cars',
    description: 'Premium Range Rover 2025. Luxury SUV with exceptional performance.',
    price: 5000,
    priceDescription: '$5,000 for 5 days',
    icon: '🚗',
    image: '/rangerover.png'
  },

  // Baby Shower
  {
    id: 'baby-shower-package',
    name: 'Baby Shower Package',
    category: 'Baby Shower',
    description: 'Complete baby shower celebration package. Includes decorations, catering, games, and entertainment for up to 30 guests.',
    price: 1200,
    priceDescription: '$1,200 for up to 30 guests',
    icon: '👶'
  },

  // Health & Wellness
  {
    id: 'health-wellness-midtown-biohack',
    name: 'Midtown Biohack',
    category: 'Health & Wellness',
    description: 'Premium health and wellness experience at Midtown Biohack. Includes personalized wellness assessment, treatments, and recovery services.',
    price: 1000,
    priceDescription: '$1,000 per session',
    icon: '🧘'
  },
  {
    id: 'health-wellness-platinum-spa',
    name: 'Platinum Wellness Spa',
    category: 'Health & Wellness',
    description: 'Luxury wellness spa experience with premium treatments, relaxation services, and personalized wellness programs.',
    price: 1000,
    priceDescription: '$1,000 per session',
    icon: '🧘'
  },
  {
    id: 'emotional-mental-coaching-ifs',
    name: 'Emotional & Mental Coaching (IFS by Ty Cutner)',
    category: 'Health & Wellness',
    description: 'Professional Internal Family Systems (IFS) coaching sessions with Ty Cutner. Transformative emotional and mental wellness coaching for groups.',
    price: 1500,
    priceDescription: '$1,500 for group of 5 (2 hours)',
    icon: '🧠'
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
  'Kids',
  'Wedding',
  'Sporting Events',
  'Vacation',
  'Mobile Professionals',
  'Exotic Cars',
  'Yacht',
  'Baby Shower',
  'Health & Wellness'
]

export function getServicesByCategory(category: string): Service[] {
  return SERVICES.filter(service => service.category === category)
}

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find(service => service.id === id)
}

// Venue services for the dedicated venue selection page
export const VENUE_SERVICES: Service[] = [
  {
    id: 'venue-private-home',
    name: 'Private Home',
    category: 'Venue',
    description: 'Luxury private homes available for events. Various locations and sizes to accommodate different group sizes.',
    price: 0,
    priceDescription: 'Contact for pricing',
    icon: '🏠'
  },
  {
    id: 'venue-boat',
    name: 'JBoogie\'s Yacht',
    category: 'Venue',
    description: 'Luxurious private yacht rentals for unique waterfront events and celebrations.',
    price: 0,
    priceDescription: 'Contact for pricing',
    icon: '🛥️'
  },
  {
    id: 'venue-restaurant',
    name: 'The Plaza Hotel',
    category: 'Venue',
    description: 'Luxurious private dining rooms at The Plaza Hotel for intimate or large gatherings.',
    price: 0,
    priceDescription: 'Contact for pricing',
    icon: '🍽️'
  },
  {
    id: 'venue-event-space',
    name: 'The Metropolitan Pavilion',
    category: 'Venue',
    description: 'Elegant event spaces at The Metropolitan Pavilion perfect for conferences, parties, and special occasions.',
    price: 0,
    priceDescription: 'Contact for pricing',
    icon: '🏛️'
  },
  {
    id: 'venue-sports-arena',
    name: 'Madison Square Garden',
    category: 'Venue',
    description: 'The world\'s most famous arena - Madison Square Garden. Perfect for large-scale events, corporate gatherings, and special celebrations.',
    price: 0,
    priceDescription: 'Contact for pricing',
    icon: '🏟️'
  },
  {
    id: 'venue-health-wellness',
    name: 'Equinox Fitness Club',
    category: 'Venue',
    description: 'Premium wellness facilities at Equinox Fitness Club perfect for wellness retreats, corporate wellness events, and relaxation-focused gatherings.',
    price: 0,
    priceDescription: 'Contact for pricing',
    icon: '🧘‍♀️'
  }
]
