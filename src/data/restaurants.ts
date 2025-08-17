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
        includes: ['Appetizers', 'Entrées', 'Dessert', 'Tax', 'Tip', 'Curated wine pairing']
      },
      {
        name: 'Holiday Party Package',
        price: 5000,
        description: 'Complete holiday celebration package for 50 guests with premium dining and entertainment.',
        includes: ['2-hour open bar', 'Catering for 50 guests', 'Private dining space', 'Event coordination', 'Decorations']
      },
      {
        name: 'Birthday Celebration',
        price: 150,
        description: 'Birthday party package with personalized service and festive atmosphere.',
        includes: ['Multi-course meal', 'Birthday dessert', 'Decorations', 'Photography service']
      }
    ],
    hours: 'Dinner: Wed-Sat 5pm-11pm, Brunch: Sat 12pm-4pm, Bar: Fri-Sat until 2am',
    features: ['Speakeasy Bar', 'Private Dining', 'Catering Services', 'Live Music', 'Outdoor Seating', 'Wine Pairing'],
    eventTypes: ['Anniversary', 'Birthday', 'Holiday Party', 'Corporate Event', 'Date Night'],
    guestRange: { min: 2, max: 100 },
    budgetRange: { min: 150, max: 10000 }
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
        includes: ['Appetizers', 'Two entrées', 'Dessert', 'Two cocktails/wine/beer', 'Valued at $140']
      },
      {
        name: 'Group Party Package',
        price: 1200,
        description: 'Perfect for birthday celebrations and group gatherings with authentic Haitian atmosphere.',
        includes: ['Group dining setup', 'Shared plates', 'Cocktail packages', 'Music and entertainment', 'Party decorations']
      },
      {
        name: 'Happy Hour Special',
        price: 25,
        description: 'Tuesday-Friday 5PM to 7PM happy hour with great deals on drinks and appetizers.',
        includes: ['Discounted cocktails', 'Appetizer specials', 'Lounge atmosphere', 'Live music']
      }
    ],
    hours: 'Tue-Fri 5PM-7PM Happy Hour, Dinner hours vary, Lounge Bar open late',
    features: ['Haitian Cuisine', 'Lounge Bar', 'Happy Hour', 'Live Music', 'Group Seating', 'Cultural Experience'],
    eventTypes: ['Birthday', 'Group Party', 'Date Night', 'Cultural Celebration', 'Happy Hour'],
    guestRange: { min: 2, max: 50 },
    budgetRange: { min: 25, max: 2000 }
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
        includes: ['USDA Prime steaks', 'Appetizers', 'Dessert', 'Premium wine selection', 'Private table service']
      },
      {
        name: 'Corporate Event Package',
        price: 8000,
        description: 'Professional corporate dining experience with private dining rooms and business catering.',
        includes: ['Private dining room', 'Corporate menu options', 'Professional service', 'Business catering', 'Audio/visual setup']
      },
      {
        name: 'Chef\'s Table Experience',
        price: 500,
        description: 'Exclusive chef\'s table with personalized menu and wine pairing.',
        includes: ['Chef\'s table seating', 'Personalized menu', 'Wine pairing', 'Chef interaction', 'Premium service']
      }
    ],
    hours: 'Dinner hours vary by location, typically 5pm-11pm',
    features: ['USDA Prime Steaks', 'Private Dining', 'Wine Cellar', 'Chef\'s Table', 'Corporate Events', 'Luxury Service'],
    eventTypes: ['Anniversary', 'Corporate Event', 'Special Occasion', 'Business Dinner', 'Luxury Celebration'],
    guestRange: { min: 2, max: 200 },
    budgetRange: { min: 200, max: 15000 }
  }
]

export function getMatchingRestaurants(
  eventType: string,
  guestCount: number,
  budget: string
): Array<Restaurant & { matchScore: number; matchReasons: string[] }> {
  const budgetRange = getBudgetRange(budget)
  
  // Score each restaurant based on how well it matches the criteria
  const scoredRestaurants = RESTAURANTS.map(restaurant => {
    let score = 0
    let reasons: string[] = []
    
    // Event type matching (highest weight)
    const eventTypeMatch = restaurant.eventTypes.some(type => 
      type.toLowerCase().includes(eventType.toLowerCase())
    )
    if (eventTypeMatch) {
      score += 40
      reasons.push(`Perfect for ${eventType} events`)
    }
    
    // Guest count optimization
    const guestCountOptimal = guestCount >= restaurant.guestRange.min && 
                             guestCount <= restaurant.guestRange.max
    if (guestCountOptimal) {
      score += 30
      reasons.push(`Accommodates ${guestCount} guests`)
    }
    
    // Budget matching
    const budgetMatch = budgetRange.max >= restaurant.budgetRange.min && 
                       budgetRange.min <= restaurant.budgetRange.max
    if (budgetMatch) {
      score += 20
      reasons.push(`Fits your budget`)
    }
    
    // Special package matching for specific scenarios
    const hasPerfectPackage = restaurant.packages.some(pkg => {
      // Anniversary dinner for 2
      if (eventType.toLowerCase().includes('anniversary') && guestCount === 2) {
        return pkg.name.toLowerCase().includes('anniversary') || 
               pkg.name.toLowerCase().includes('dinner for two')
      }
      // Holiday party for 50
      if (eventType.toLowerCase().includes('holiday') && guestCount >= 50) {
        return pkg.name.toLowerCase().includes('holiday') || 
               pkg.name.toLowerCase().includes('party')
      }
      // Birthday celebrations
      if (eventType.toLowerCase().includes('birthday')) {
        return pkg.name.toLowerCase().includes('birthday') || 
               pkg.name.toLowerCase().includes('party')
      }
      return false
    })
    
    if (hasPerfectPackage) {
      score += 10
      reasons.push(`Has perfect package for your event`)
    }
    
    // Cuisine preference bonus (for specific event types)
    if (eventType.toLowerCase().includes('anniversary') && 
        restaurant.cuisine.toLowerCase().includes('steakhouse')) {
      score += 5
      reasons.push(`Premium steakhouse for special occasions`)
    }
    
    if (eventType.toLowerCase().includes('birthday') && 
        restaurant.cuisine.toLowerCase().includes('caribbean')) {
      score += 5
      reasons.push(`Vibrant atmosphere perfect for celebrations`)
    }
    
    return {
      restaurant,
      score,
      reasons
    }
  })
  
  // Filter out restaurants with no matches and sort by score
  const matchingRestaurants = scoredRestaurants
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2) // Only show top 2 recommendations
  
  return matchingRestaurants.map(item => ({
    ...item.restaurant,
    matchScore: item.score,
    matchReasons: item.reasons
  }))
}

// Enhanced function to get restaurant recommendations with explanations
export function getRestaurantRecommendations(
  eventType: string,
  guestCount: number,
  budget: string
): Array<Restaurant & { matchScore: number; matchReasons: string[]; recommendation: string }> {
  const matches = getMatchingRestaurants(eventType, guestCount, budget)
  
  return matches.map(restaurant => {
    let recommendation = ''
    
    // Generate personalized recommendation based on the scenario
    if (eventType.toLowerCase().includes('anniversary') && guestCount === 2) {
      if (restaurant.id === 'saint-restaurant') {
        recommendation = `Perfect choice for your anniversary! Saint Restaurant offers an all-inclusive $200 package with wine pairing, making it ideal for a romantic celebration.`
      } else if (restaurant.id === 'del-friscos') {
        recommendation = `For a truly special anniversary, Del Frisco's premium steakhouse experience with USDA Prime steaks and exceptional service will create unforgettable memories.`
      }
    } else if (eventType.toLowerCase().includes('holiday') && guestCount >= 50) {
      if (restaurant.id === 'saint-restaurant') {
        recommendation = `Saint Restaurant's $5,000 holiday package is perfect for your large celebration, including 2-hour open bar and catering for 50 guests.`
      }
    } else if (eventType.toLowerCase().includes('birthday')) {
      if (restaurant.id === 'rebel-restaurant') {
        recommendation = `Rebel Restaurant's vibrant Haitian atmosphere and group party packages make it perfect for birthday celebrations with friends and family.`
      } else if (restaurant.id === 'saint-restaurant') {
        recommendation = `Saint Restaurant offers a festive birthday package with decorations and photography service, perfect for your celebration.`
      }
    } else {
      recommendation = `${restaurant.name} is an excellent choice for your ${eventType} with ${guestCount} guests. Their ${restaurant.cuisine} cuisine and professional service will ensure a memorable event.`
    }
    
    return {
      ...restaurant,
      recommendation
    }
  })
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
