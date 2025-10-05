export interface WeddingVenue {
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
}

export const WEDDING_VENUES: WeddingVenue[] = [
  {
    id: 'metropolitan-glen-cove',
    name: 'Metropolitan Wedding Venue',
    location: 'Glen Cove, NY',
    address: '200 Dosoris Lane, Glen Cove, NY 11542',
    capacity: { min: 50, max: 250 },
    price: {
      starting: 50000,
      description: '$50,000 for 250 guests'
    },
    features: [
      'Full-service wedding planning',
      'Elegant ballroom',
      'Bridal suite',
      'Professional catering',
      'Dance floor',
      'Outdoor ceremony space'
    ],
    description: 'Premium wedding venue at Metropolitan, Glen Cove NY. Elegant ballroom with stunning views and full-service wedding packages.',
    rating: 4.8,
    tags: ['luxury', 'ballroom', 'waterfront', 'full-service']
  },
  {
    id: 'luxury-manor-estate',
    name: 'Luxury Manor Estate',
    location: 'Hamptons, NY',
    address: '456 Mansion Drive, East Hampton, NY 11937',
    capacity: { min: 30, max: 180 },
    price: {
      starting: 35000,
      description: '$35,000 starting price'
    },
    features: [
      'Historic mansion setting',
      'Manicured gardens',
      'Grand staircase',
      'Vintage architecture',
      'Outdoor ceremony lawn',
      'Reception pavilion'
    ],
    description: 'Breathtaking historic manor estate with manicured gardens and vintage charm. Perfect for elegant outdoor ceremonies.',
    rating: 4.9,
    tags: ['historic', 'gardens', 'mansion', 'outdoor']
  },
  {
    id: 'waterfront-pavilion',
    name: 'Waterfront Pavilion',
    location: 'Brooklyn, NY',
    address: '1 Water Street, Brooklyn, NY 11201',
    capacity: { min: 75, max: 300 },
    price: {
      starting: 25000,
      description: '$25,000 starting price'
    },
    features: [
      'Stunning water views',
      'Glass pavilion',
      'Modern amenities',
      'Professional lighting',
      'Spacious dance floor',
      'Cocktail terrace'
    ],
    description: 'Modern waterfront pavilion with breathtaking views of the harbor. Contemporary design meets natural beauty.',
    rating: 4.7,
    tags: ['waterfront', 'modern', 'views', 'glass pavilion']
  },
  {
    id: 'rustic-barn-venue',
    name: 'Rustic Barn Venue',
    location: 'Westchester, NY',
    address: '789 Country Road, Tarrytown, NY 10591',
    capacity: { min: 40, max: 150 },
    price: {
      starting: 15000,
      description: '$15,000 starting price'
    },
    features: [
      'Restored historic barn',
      'Exposed wooden beams',
      'String light ambiance',
      'Outdoor ceremony space',
      'Farm-to-table catering',
      'Rustic charm'
    ],
    description: 'Charming restored barn venue with rustic elegance. Perfect for couples seeking a countryside wedding experience.',
    rating: 4.6,
    tags: ['rustic', 'barn', 'countryside', 'historic']
  },
  {
    id: 'rooftop-garden-venue',
    name: 'Rooftop Garden Venue',
    location: 'Manhattan, NY',
    address: '123 Park Avenue, New York, NY 10016',
    capacity: { min: 60, max: 200 },
    price: {
      starting: 40000,
      description: '$40,000 starting price'
    },
    features: [
      'NYC skyline views',
      'Rooftop garden setting',
      'City lights ambiance',
      'Climate-controlled tent',
      'Professional catering',
      'Urban sophistication'
    ],
    description: 'Sophisticated rooftop venue with stunning NYC skyline views. Urban elegance with garden charm high above the city.',
    rating: 4.8,
    tags: ['rooftop', 'city views', 'urban', 'garden']
  },
  {
    id: 'beach-club-venue',
    name: 'Beach Club Venue',
    location: 'Long Island, NY',
    address: '555 Ocean Boulevard, Montauk, NY 11954',
    capacity: { min: 80, max: 220 },
    price: {
      starting: 30000,
      description: '$30,000 starting price'
    },
    features: [
      'Beachfront ceremony',
      'Ocean views',
      'Sandy aisle walk',
      'Seaside reception',
      'Professional planning',
      'Nautical charm'
    ],
    description: 'Romantic beachfront venue with ocean views and sandy ceremony space. Perfect for couples dreaming of a seaside wedding.',
    rating: 4.7,
    tags: ['beach', 'ocean', 'seaside', 'romantic']
  }
]

export function searchWeddingVenues(query: string): WeddingVenue[] {
  if (!query.trim()) return WEDDING_VENUES

  const searchTerm = query.toLowerCase().trim()

  return WEDDING_VENUES.filter(venue => {
    const nameMatch = venue.name.toLowerCase().includes(searchTerm)
    const locationMatch = venue.location.toLowerCase().includes(searchTerm)
    const descriptionMatch = venue.description.toLowerCase().includes(searchTerm)
    const tagsMatch = venue.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    const featuresMatch = venue.features.some(feature => feature.toLowerCase().includes(searchTerm))

    return nameMatch || locationMatch || descriptionMatch || tagsMatch || featuresMatch
  })
}

export function getWeddingVenueById(id: string): WeddingVenue | undefined {
  return WEDDING_VENUES.find(venue => venue.id === id)
}

export function getWeddingVenuesByCapacity(minGuests: number, maxGuests: number): WeddingVenue[] {
  return WEDDING_VENUES.filter(venue =>
    venue.capacity.min <= maxGuests && venue.capacity.max >= minGuests
  )
}

export function getWeddingVenuesByBudget(maxBudget: number): WeddingVenue[] {
  return WEDDING_VENUES.filter(venue => venue.price.starting <= maxBudget)
}