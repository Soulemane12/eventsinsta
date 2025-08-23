export interface Restaurant {
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
    guestCount?: number
  }>
  hours: string
  features: string[]
  eventTypes: string[]
  guestRange: {
    min: number
    max: number
  }
  budgetRange: {
    min: number
    max: number
  }
}

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'saint-restaurant',
    name: 'Saint Restaurant Bar & Speakeasy',
    description: 'Actualizing the spirit of the East Village, SAINT celebrates the art, architecture, and multiculturalism that has defined the surrounding blocks for centuries. Our globally-inspired menu features signature share plates with curated cocktails by Ravi Thapa, while a botanical ambiance invites you to our downstairs speakeasy-inspired bar.',
    address: '136 2nd Avenue, New York, NY 10003',
    phone: '(347)-588-9817',
    email: 'Events@saintny.com',
    website: 'https://saintny.com',
    image: '/saint-restaurant.jpg',
    cuisine: 'Contemporary American with Global Influences',
    priceRange: '$$$',
    packages: [
      {
        name: 'Anniversary Dinner for Two',
        price: 200,
        description: 'All-inclusive romantic dinner experience perfect for couples celebrating special moments.',
        includes: ['Appetizers', 'Entrées', 'Dessert', 'Tax', 'Tip', 'Curated wine pairing'],
        guestCount: 2
      },
      {
        name: 'Small Group Event (25 guests)',
        price: 1000,
        description: 'Perfect for intimate gatherings with premium dining experience.',
        includes: ['Private dining space', 'Multi-course meal', 'Basic service', 'Event coordination'],
        guestCount: 25
      },
      {
        name: 'Large Group Event (50 guests)',
        price: 2500,
        description: 'Complete celebration package for larger groups with premium dining and entertainment.',
        includes: ['Private dining space', 'Multi-course meal', 'Premium service', 'Event coordination'],
        guestCount: 50
      }
    ],
    hours: 'Dinner: Wed-Sat 5pm-11pm, Brunch: Sat 12pm-4pm, Bar: Fri-Sat until 2am',
    features: ['Speakeasy Bar', 'Private Dining', 'Catering Services', 'Live Music', 'Outdoor Seating', 'Wine Pairing'],
    eventTypes: ['Anniversary', 'Birthday', 'Holiday Party', 'Corporate Event', 'Date Night'],
    guestRange: { min: 2, max: 100 },
    budgetRange: { min: 150, max: 3000 }
  },
  {
    id: 'rebel-restaurant',
    name: 'Rebèl Restaurant & Bar',
    description: 'Showcasing Haitian food, art & culture! Rebel Restaurant and Bar is your prime destination for great drinks and amazing nightlife in New York, NY. We promise great vibes and comfortable seating for you and your friends, providing the highest quality of food and services for a memorable experience.',
    address: '29 Clinton Street, New York, NY 10002',
    phone: '917-388-3425',
    email: 'info@nyrebel.com',
    website: 'https://nyrebel.com',
    image: '/rebel-restaurant.jpg',
    cuisine: 'Haitian & Caribbean Cuisine',
    priceRange: '$$',
    packages: [
      {
        name: 'Three-Course Dinner for Two',
        price: 79,
        description: 'Special deal offering incredible value with premium Haitian cuisine and drinks.',
        includes: ['Appetizers', 'Two entrées', 'Dessert', 'Two cocktails/wine/beer', 'Valued at $140'],
        guestCount: 2
      },
      {
        name: 'Small Group Event (25 guests)',
        price: 1000,
        description: 'Authentic Haitian atmosphere for intimate gatherings.',
        includes: ['Group dining setup', 'Shared plates', 'Cocktail packages', 'Music and entertainment'],
        guestCount: 25
      },
      {
        name: 'Large Group Event (50 guests)',
        price: 2500,
        description: 'Complete celebration package with authentic Haitian cuisine and culture.',
        includes: ['Group dining setup', 'Shared plates', 'Cocktail packages', 'Music and entertainment', 'Party decorations'],
        guestCount: 50
      }
    ],
    hours: 'Tue-Fri 5PM-7PM Happy Hour, Dinner hours vary, Lounge Bar open late',
    features: ['Haitian Cuisine', 'Lounge Bar', 'Happy Hour', 'Live Music', 'Group Seating', 'Cultural Experience'],
    eventTypes: ['Birthday', 'Group Party', 'Date Night', 'Cultural Celebration', 'Happy Hour'],
    guestRange: { min: 2, max: 50 },
    budgetRange: { min: 25, max: 3000 }
  },
  {
    id: 'del-friscos',
    name: 'Del Frisco\'s Double Eagle Steak House',
    description: 'Del Frisco\'s is rooted in a rich American tradition – the steakhouse. We stay true to time-honored principles, like chef-driven cuisine, impeccable wines and exceptional hospitality to give you an experience like no other. An extraordinary dining experience with remarkable menu and unrivaled atmosphere.',
    address: 'Multiple locations in NYC',
    phone: 'Varies by location',
    email: 'info@delfriscos.com',
    website: 'https://delfriscos.com',
    image: '/del-friscos.jpg',
    cuisine: 'American Steakhouse',
    priceRange: '$$$$',
    packages: [
      {
        name: 'Premium Anniversary Experience',
        price: 300,
        description: 'Luxury anniversary dinner with premium steaks and exceptional service.',
        includes: ['USDA Prime steaks', 'Appetizers', 'Dessert', 'Premium wine selection', 'Private table service'],
        guestCount: 2
      },
      {
        name: 'Small Group Event (25 guests)',
        price: 1000,
        description: 'Professional dining experience with private dining rooms.',
        includes: ['Private dining room', 'Premium menu options', 'Professional service', 'Business catering'],
        guestCount: 25
      },
      {
        name: 'Large Group Event (50 guests)',
        price: 2500,
        description: 'Luxury corporate dining experience with premium service.',
        includes: ['Private dining room', 'Premium menu options', 'Professional service', 'Business catering', 'Audio/visual setup'],
        guestCount: 50
      }
    ],
    hours: 'Dinner hours vary by location, typically 5pm-11pm',
    features: ['USDA Prime Steaks', 'Private Dining', 'Wine Cellar', 'Chef\'s Table', 'Corporate Events', 'Luxury Service'],
    eventTypes: ['Anniversary', 'Corporate Event', 'Special Occasion', 'Business Dinner', 'Luxury Celebration'],
    guestRange: { min: 2, max: 200 },
    budgetRange: { min: 200, max: 3000 }
  }
]

export function getMatchingRestaurants(
  eventType: string,
  guestCount: number,
  budget: string
): Restaurant[] {
  return RESTAURANTS.filter(restaurant => {
    // Check if restaurant supports the event type
    const supportsEventType = restaurant.eventTypes.some(type => 
      type.toLowerCase().includes(eventType.toLowerCase())
    )
    
    // Check if guest count is within range
    const supportsGuestCount = guestCount >= restaurant.guestRange.min && 
                              guestCount <= restaurant.guestRange.max
    
    // Check if budget is within range
    const budgetRange = getBudgetRange(budget)
    const supportsBudget = budgetRange.max >= restaurant.budgetRange.min && 
                          budgetRange.min <= restaurant.budgetRange.max
    
    return supportsEventType && supportsGuestCount && supportsBudget
  })
}

export function getRestaurantPriceByGuestCount(restaurantId: string, guestCount: number): number {
  const restaurant = RESTAURANTS.find(r => r.id === restaurantId)
  if (!restaurant) return 0

  // Find the appropriate package based on guest count
  if (guestCount <= 2) {
    const couplePackage = restaurant.packages.find(p => p.guestCount === 2)
    return couplePackage?.price || 0
  } else if (guestCount <= 25) {
    const smallGroupPackage = restaurant.packages.find(p => p.guestCount === 25)
    return smallGroupPackage?.price || 0
  } else if (guestCount <= 50) {
    const largeGroupPackage = restaurant.packages.find(p => p.guestCount === 50)
    return largeGroupPackage?.price || 0
  } else {
    // For larger groups, calculate based on 50-guest package
    const largeGroupPackage = restaurant.packages.find(p => p.guestCount === 50)
    const basePrice = largeGroupPackage?.price || 0
    return Math.ceil(guestCount / 50) * basePrice
  }
}

function getBudgetRange(budgetId: string): { min: number; max: number } {
  switch (budgetId) {
    case 'budget-1':
      return { min: 500, max: 1000 }
    case 'budget-2':
      return { min: 1000, max: 3000 }
    case 'budget-3':
      return { min: 3000, max: 5000 }
    case 'budget-4':
      return { min: 5000, max: 50000 }
    default:
      return { min: 0, max: 10000 }
  }
}
