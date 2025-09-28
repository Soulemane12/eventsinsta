export interface SportsArena {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  image: string
  sportType: string
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

export const SPORTS_ARENAS: SportsArena[] = [
  {
    id: 'madison-square-garden',
    name: 'Madison Square Garden',
    description: 'The World\'s Most Famous Arena. Madison Square Garden is the premier sports and entertainment venue in New York City, hosting the New York Knicks, New York Rangers, and world-class concerts and events.',
    address: '4 Pennsylvania Plaza, New York, NY 10001',
    phone: '(212) 465-6741',
    email: 'events@msg.com',
    website: 'https://msg.com',
    image: '/madison-square-garden.jpg',
    sportType: 'Multi-Purpose Arena',
    priceRange: '$$$$',
    packages: [
      {
        name: 'Premium Suite Experience',
        price: 5000,
        description: 'Luxury suite experience with premium amenities and exclusive access.',
        includes: ['Private suite', 'Premium catering', 'VIP parking', 'Event coordination', 'Premium seating'],
        guestCount: 20
      },
      {
        name: 'Group Event Package (50 guests)',
        price: 10000,
        description: 'Group event package with premium seating and catering options.',
        includes: ['Premium seating block', 'Catering options', 'Event coordination', 'Group discounts'],
        guestCount: 50
      },
      {
        name: 'Large Group Event (100 guests)',
        price: 20000,
        description: 'Large group event package with premium amenities and exclusive access.',
        includes: ['Premium seating block', 'Premium catering', 'Event coordination', 'VIP amenities', 'Group discounts'],
        guestCount: 100
      }
    ],
    hours: 'Event hours vary, typically 7pm-11pm for games and concerts',
    features: ['Premium Suites', 'VIP Parking', 'Premium Catering', 'Event Coordination', 'Premium Seating', 'Exclusive Access'],
    eventTypes: ['Birthday Party', 'Corporate Event', 'Sporting Events', 'Special Occasion', 'Group Celebration'],
    guestRange: { min: 20, max: 200 },
    budgetRange: { min: 5000, max: 50000 }
  },
  {
    id: 'barclays-center',
    name: 'Barclays Center',
    description: 'Brooklyn\'s premier sports and entertainment venue, home to the Brooklyn Nets and New York Islanders. State-of-the-art facility with premium amenities and world-class service.',
    address: '620 Atlantic Ave, Brooklyn, NY 11217',
    phone: '(718) 643-6000',
    email: 'events@barclayscenter.com',
    website: 'https://barclayscenter.com',
    image: '/barclays-center.jpg',
    sportType: 'Multi-Purpose Arena',
    priceRange: '$$$$',
    packages: [
      {
        name: 'Premium Suite Experience',
        price: 4000,
        description: 'Luxury suite experience with premium amenities and exclusive access.',
        includes: ['Private suite', 'Premium catering', 'VIP parking', 'Event coordination', 'Premium seating'],
        guestCount: 20
      },
      {
        name: 'Group Event Package (50 guests)',
        price: 8000,
        description: 'Group event package with premium seating and catering options.',
        includes: ['Premium seating block', 'Catering options', 'Event coordination', 'Group discounts'],
        guestCount: 50
      },
      {
        name: 'Large Group Event (100 guests)',
        price: 15000,
        description: 'Large group event package with premium amenities and exclusive access.',
        includes: ['Premium seating block', 'Premium catering', 'Event coordination', 'VIP amenities', 'Group discounts'],
        guestCount: 100
      }
    ],
    hours: 'Event hours vary, typically 7pm-11pm for games and concerts',
    features: ['Premium Suites', 'VIP Parking', 'Premium Catering', 'Event Coordination', 'Premium Seating', 'Exclusive Access'],
    eventTypes: ['Birthday Party', 'Corporate Event', 'Sporting Events', 'Special Occasion', 'Group Celebration'],
    guestRange: { min: 20, max: 200 },
    budgetRange: { min: 4000, max: 40000 }
  },
  {
    id: 'yankee-stadium',
    name: 'Yankee Stadium',
    description: 'The home of the New York Yankees, one of the most iconic sports venues in the world. Experience the rich history and tradition of baseball in this state-of-the-art stadium.',
    address: '1 E 161st St, Bronx, NY 10451',
    phone: '(718) 293-4300',
    email: 'events@yankees.com',
    website: 'https://yankees.com',
    image: '/yankee-stadium.jpg',
    sportType: 'Baseball Stadium',
    priceRange: '$$$$',
    packages: [
      {
        name: 'Premium Suite Experience',
        price: 3000,
        description: 'Luxury suite experience with premium amenities and exclusive access.',
        includes: ['Private suite', 'Premium catering', 'VIP parking', 'Event coordination', 'Premium seating'],
        guestCount: 20
      },
      {
        name: 'Group Event Package (50 guests)',
        price: 6000,
        description: 'Group event package with premium seating and catering options.',
        includes: ['Premium seating block', 'Catering options', 'Event coordination', 'Group discounts'],
        guestCount: 50
      },
      {
        name: 'Large Group Event (100 guests)',
        price: 12000,
        description: 'Large group event package with premium amenities and exclusive access.',
        includes: ['Premium seating block', 'Premium catering', 'Event coordination', 'VIP amenities', 'Group discounts'],
        guestCount: 100
      }
    ],
    hours: 'Event hours vary, typically 7pm-11pm for games',
    features: ['Premium Suites', 'VIP Parking', 'Premium Catering', 'Event Coordination', 'Premium Seating', 'Exclusive Access'],
    eventTypes: ['Birthday Party', 'Corporate Event', 'Sporting Events', 'Special Occasion', 'Group Celebration'],
    guestRange: { min: 20, max: 200 },
    budgetRange: { min: 3000, max: 30000 }
  }
]

export function getMatchingSportsArenas(
  eventType: string,
  guestCount: number,
  budget: string
): SportsArena[] {
  return SPORTS_ARENAS.filter(arena => {
    // Check if arena supports the event type
    const supportsEventType = arena.eventTypes.some(type => 
      type.toLowerCase().includes(eventType.toLowerCase())
    )
    
    // Check if guest count is within range
    const supportsGuestCount = guestCount >= arena.guestRange.min && 
                              guestCount <= arena.guestRange.max
    
    // Check if budget is within range
    const budgetRange = getBudgetRange(budget)
    const supportsBudget = budgetRange.max >= arena.budgetRange.min && 
                          budgetRange.min <= arena.budgetRange.max
    
    return supportsEventType && supportsGuestCount && supportsBudget
  })
}

export function getSportsArenaPriceByGuestCount(arenaId: string, guestCount: number): number {
  console.log('getSportsArenaPriceByGuestCount called:', { arenaId, guestCount })
  const arena = SPORTS_ARENAS.find(a => a.id === arenaId)
  console.log('Found arena:', arena?.name)
  if (!arena) {
    console.log('No arena found for id:', arenaId)
    return 0
  }

  // Find the appropriate package based on guest count
  if (guestCount <= 20) {
    const suitePackage = arena.packages.find(p => p.guestCount === 20)
    console.log('Guest count <= 20, found package:', suitePackage?.name, 'price:', suitePackage?.price)
    return suitePackage?.price || 0
  } else if (guestCount <= 50) {
    const smallGroupPackage = arena.packages.find(p => p.guestCount === 50)
    console.log('Guest count <= 50, found package:', smallGroupPackage?.name, 'price:', smallGroupPackage?.price)
    return smallGroupPackage?.price || 0
  } else if (guestCount <= 100) {
    const largeGroupPackage = arena.packages.find(p => p.guestCount === 100)
    console.log('Guest count <= 100, found package:', largeGroupPackage?.name, 'price:', largeGroupPackage?.price)
    return largeGroupPackage?.price || 0
  } else {
    // For larger groups, calculate based on 100-guest package
    const largeGroupPackage = arena.packages.find(p => p.guestCount === 100)
    const basePrice = largeGroupPackage?.price || 0
    const calculatedPrice = Math.ceil(guestCount / 100) * basePrice
    console.log('Guest count > 100, calculated price:', calculatedPrice, 'base price:', basePrice)
    return calculatedPrice
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
