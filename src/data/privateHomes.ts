export interface PrivateHome {
  id: string
  name: string
  location: string
  address: string
  capacity: {
    min: number
    max: number
  }
  price: {
    starting: number
    description: string
  }
  features: string[]
  description: string
  image?: string
  rating: number
  tags: string[]
  type: 'mansion' | 'penthouse' | 'villa' | 'estate' | 'loft'
}

export const PRIVATE_HOMES: PrivateHome[] = [
  {
    id: 'manhattan-penthouse-plaza',
    name: 'Manhattan Plaza Penthouse',
    location: 'Manhattan, NY',
    address: '768 Fifth Avenue, New York, NY 10019',
    capacity: { min: 20, max: 80 },
    price: {
      starting: 2500,
      description: '$2,500 for full day'
    },
    features: [
      'Central Park views',
      'Rooftop terrace',
      'Modern kitchen',
      'Floor-to-ceiling windows',
      'High-end furnishings',
      'Elevator access'
    ],
    description: 'Stunning Manhattan penthouse with breathtaking Central Park views. Perfect for elegant gatherings and sophisticated events.',
    rating: 4.9,
    tags: ['luxury', 'views', 'modern', 'rooftop'],
    type: 'penthouse'
  },
  {
    id: 'brooklyn-brownstone-heights',
    name: 'Brooklyn Heights Brownstone',
    location: 'Brooklyn, NY',
    address: '123 Remsen Street, Brooklyn, NY 11201',
    capacity: { min: 15, max: 60 },
    price: {
      starting: 1800,
      description: '$1,800 for full day'
    },
    features: [
      'Historic charm',
      'Private garden',
      'Original hardwood floors',
      'Multiple entertaining spaces',
      'Full kitchen',
      'Street parking available'
    ],
    description: 'Beautiful historic brownstone in Brooklyn Heights with private garden. Classic New York charm meets modern comfort.',
    rating: 4.7,
    tags: ['historic', 'garden', 'brownstone', 'charming'],
    type: 'mansion'
  },
  {
    id: 'queens-modern-villa',
    name: 'Queens Modern Villa',
    location: 'Queens, NY',
    address: '456 Northern Boulevard, Queens, NY 11361',
    capacity: { min: 30, max: 120 },
    price: {
      starting: 2200,
      description: '$2,200 for full day'
    },
    features: [
      'Large backyard',
      'Modern architecture',
      'Open floor plan',
      'Chef\'s kitchen',
      'Multiple bedrooms',
      'Parking for 10 cars'
    ],
    description: 'Contemporary villa in Queens with spacious backyard and modern amenities. Ideal for large family gatherings and celebrations.',
    rating: 4.6,
    tags: ['modern', 'spacious', 'family-friendly', 'parking'],
    type: 'villa'
  },
  {
    id: 'long-island-estate',
    name: 'Long Island Waterfront Estate',
    location: 'Long Island, NY',
    address: '789 Ocean Drive, East Hampton, NY 11937',
    capacity: { min: 50, max: 200 },
    price: {
      starting: 5000,
      description: '$5,000 for full day'
    },
    features: [
      'Waterfront location',
      'Private beach access',
      'Grand ballroom',
      'Catering kitchen',
      'Guest suites',
      'Valet parking'
    ],
    description: 'Magnificent waterfront estate on Long Island with private beach access. Perfect for luxury weddings and large celebrations.',
    rating: 4.9,
    tags: ['waterfront', 'luxury', 'beach', 'grand'],
    type: 'estate'
  },
  {
    id: 'soho-industrial-loft',
    name: 'SoHo Industrial Loft',
    location: 'Manhattan, NY',
    address: '321 Spring Street, New York, NY 10013',
    capacity: { min: 25, max: 90 },
    price: {
      starting: 3000,
      description: '$3,000 for full day'
    },
    features: [
      'Exposed brick walls',
      'High ceilings',
      'Industrial design',
      'Natural lighting',
      'Open layout',
      'Sound system included'
    ],
    description: 'Trendy industrial loft in the heart of SoHo. Perfect for modern events, art shows, and creative gatherings.',
    rating: 4.8,
    tags: ['industrial', 'trendy', 'artistic', 'downtown'],
    type: 'loft'
  },
  {
    id: 'upper-east-side-townhouse',
    name: 'Upper East Side Townhouse',
    location: 'Manhattan, NY',
    address: '567 East 78th Street, New York, NY 10075',
    capacity: { min: 20, max: 70 },
    price: {
      starting: 2800,
      description: '$2,800 for full day'
    },
    features: [
      'Classic townhouse',
      'Multiple floors',
      'Formal dining room',
      'Library/study',
      'Rooftop deck',
      'Professional kitchen'
    ],
    description: 'Elegant Upper East Side townhouse with classic New York architecture. Perfect for intimate dinners and sophisticated gatherings.',
    rating: 4.8,
    tags: ['elegant', 'classic', 'upscale', 'intimate'],
    type: 'mansion'
  },
  {
    id: 'westchester-country-estate',
    name: 'Westchester Country Estate',
    location: 'Westchester, NY',
    address: '890 Country Club Road, Scarsdale, NY 10583',
    capacity: { min: 40, max: 150 },
    price: {
      starting: 3500,
      description: '$3,500 for full day'
    },
    features: [
      'Sprawling grounds',
      'Pool and spa',
      'Tennis court',
      'Guest house',
      'Formal gardens',
      'Ample parking'
    ],
    description: 'Luxurious country estate in Westchester with beautiful grounds and recreational facilities. Ideal for weekend celebrations.',
    rating: 4.7,
    tags: ['country', 'recreational', 'luxury', 'grounds'],
    type: 'estate'
  },
  {
    id: 'tribeca-modern-penthouse',
    name: 'Tribeca Modern Penthouse',
    location: 'Manhattan, NY',
    address: '234 West Broadway, New York, NY 10013',
    capacity: { min: 30, max: 100 },
    price: {
      starting: 4000,
      description: '$4,000 for full day'
    },
    features: [
      'City skyline views',
      'Modern amenities',
      'Wrap-around terrace',
      'Chef\'s kitchen',
      'Wine cellar',
      'Concierge service'
    ],
    description: 'Ultra-modern penthouse in Tribeca with stunning city views and luxury amenities. Perfect for upscale corporate events.',
    rating: 4.9,
    tags: ['modern', 'luxury', 'corporate', 'views'],
    type: 'penthouse'
  }
]

export function searchPrivateHomes(query: string): PrivateHome[] {
  if (!query.trim()) return PRIVATE_HOMES

  const searchTerm = query.toLowerCase().trim()

  return PRIVATE_HOMES.filter(home => {
    const nameMatch = home.name.toLowerCase().includes(searchTerm)
    const locationMatch = home.location.toLowerCase().includes(searchTerm)
    const addressMatch = home.address.toLowerCase().includes(searchTerm)
    const descriptionMatch = home.description.toLowerCase().includes(searchTerm)
    const tagsMatch = home.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    const featuresMatch = home.features.some(feature => feature.toLowerCase().includes(searchTerm))
    const typeMatch = home.type.toLowerCase().includes(searchTerm)

    return nameMatch || locationMatch || addressMatch || descriptionMatch || tagsMatch || featuresMatch || typeMatch
  })
}

export function getPrivateHomeById(id: string): PrivateHome | undefined {
  return PRIVATE_HOMES.find(home => home.id === id)
}

export function getPrivateHomesByCapacity(minGuests: number, maxGuests: number): PrivateHome[] {
  return PRIVATE_HOMES.filter(home =>
    home.capacity.min <= maxGuests && home.capacity.max >= minGuests
  )
}

export function getPrivateHomesByBudget(maxBudget: number): PrivateHome[] {
  return PRIVATE_HOMES.filter(home => home.price.starting <= maxBudget)
}

export function getPrivateHomesByType(type: string): PrivateHome[] {
  return PRIVATE_HOMES.filter(home => home.type === type)
}

export function getPrivateHomesByLocation(location: string): PrivateHome[] {
  return PRIVATE_HOMES.filter(home =>
    home.location.toLowerCase().includes(location.toLowerCase()) ||
    home.address.toLowerCase().includes(location.toLowerCase())
  )
}