export interface Service {
  id: string
  name: string
  category: string
  description: string
  price: number
  priceDescription: string
  icon: string
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
  
  // Car Services
  {
    id: 'isit-corp',
    name: 'I-sit Corp',
    category: 'Car Services',
    description: 'Premium car service for 3 hours',
    price: 250,
    priceDescription: '$250 for 3 hours',
    icon: '🚗'
  },
  {
    id: 'car-standard',
    name: 'Standard Car Service',
    category: 'Car Services',
    description: 'Professional car service for 2 hours',
    price: 150,
    priceDescription: '$150 for 2 hours',
    icon: '🚗'
  },
  
  // Photography
  {
    id: 'photographer-premium',
    name: 'Premium Photographer',
    category: 'Photography',
    description: 'Professional photographer with editing included',
    price: 800,
    priceDescription: '$800 for full event',
    icon: '📸'
  },
  {
    id: 'photographer-standard',
    name: 'Standard Photographer',
    category: 'Photography',
    description: 'Professional photography service',
    price: 500,
    priceDescription: '$500 for full event',
    icon: '📸'
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
  }
]

export const SERVICE_CATEGORIES = [
  'DJ',
  'Car Services', 
  'Photography',
  'Catering',
  'Makeup & Hair',
  'Decorations',
  'Entertainment'
]

export function getServicesByCategory(category: string): Service[] {
  return SERVICES.filter(service => service.category === category)
}

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find(service => service.id === id)
}
