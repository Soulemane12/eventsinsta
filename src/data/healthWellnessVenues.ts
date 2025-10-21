export interface HealthWellnessVenue {
  id: string
  name: string
  address: string
  description: string
  specialties: string[]
  priceRange: string
  capacity: number
  packages: {
    name: string
    description: string
    price: number
    duration: string
    maxPeople: number
  }[]
}

export const HEALTH_WELLNESS_VENUES: HealthWellnessVenue[] = [
  {
    id: 'midtown-biohack',
    name: 'Midtown Biohack - Dr Chuck Morris',
    address: '575 Madison Ave, New York, NY 10022',
    description: 'Premium biohacking center led by Dr Chuck Morris. Advanced wellness treatments and personalized health optimization.',
    specialties: ['Biohacking', 'Health Optimization', 'Wellness Consulting'],
    priceRange: '$$$',
    capacity: 10,
    packages: [
      {
        name: 'Group Biohack Session',
        description: 'Comprehensive biohacking session with Dr Chuck Morris including health assessments and optimization protocols.',
        price: 5000,
        duration: '2 hours',
        maxPeople: 5
      },
      {
        name: 'Extended Wellness Program',
        description: 'Full-day wellness experience with multiple biohacking modalities and personalized consultation.',
        price: 8000,
        duration: '4 hours',
        maxPeople: 5
      }
    ]
  },
  {
    id: 'ty-cutner-ifs',
    name: 'TY Cutner IFS Practice',
    address: '2 Park Ave, 20th Floor, New York, NY 10016',
    description: 'Internal Family Systems (IFS) therapy center led by TY Cutner. Transformative emotional and mental wellness coaching.',
    specialties: ['IFS Therapy', 'Mental Wellness', 'Emotional Coaching'],
    priceRange: '$$$',
    capacity: 8,
    packages: [
      {
        name: 'Group IFS Session',
        description: 'Transformative Internal Family Systems therapy session led by TY Cutner for small groups.',
        price: 5000,
        duration: '1.5 hours',
        maxPeople: 5
      },
      {
        name: 'Extended IFS Workshop',
        description: 'Comprehensive IFS workshop with multiple sessions and personalized coaching.',
        price: 7500,
        duration: '3 hours',
        maxPeople: 5
      }
    ]
  },
  {
    id: 'eric-kelly-boxing',
    name: 'Eric Kelly Boxing Studio',
    address: '171 Lincoln Ave, Bronx, NY 10454',
    description: 'Professional boxing training studio led by Eric Kelly. Expert instruction and fitness training for all skill levels.',
    specialties: ['Boxing Training', 'Fitness Coaching', 'Group Workouts'],
    priceRange: '$$',
    capacity: 15,
    packages: [
      {
        name: 'Group Boxing Lessons',
        description: 'Professional boxing training sessions with Eric Kelly for groups up to 10 people.',
        price: 1000,
        duration: '1.5 hours',
        maxPeople: 10
      },
      {
        name: 'Boxing Workshop',
        description: 'Extended boxing training workshop with technique instruction and sparring practice.',
        price: 1500,
        duration: '2.5 hours',
        maxPeople: 10
      }
    ]
  }
]

export function getHealthWellnessVenueById(id: string): HealthWellnessVenue | undefined {
  return HEALTH_WELLNESS_VENUES.find(venue => venue.id === id)
}

export function getHealthWellnessVenuesByCapacity(minCapacity: number): HealthWellnessVenue[] {
  return HEALTH_WELLNESS_VENUES.filter(venue => venue.capacity >= minCapacity)
}

export function getHealthWellnessVenuePriceByGuestCount(venueId: string, guestCount: number, packageName?: string): number {
  const venue = getHealthWellnessVenueById(venueId)
  if (!venue) return 0

  if (packageName) {
    const pkg = venue.packages.find(p => p.name === packageName)
    return pkg ? pkg.price : venue.packages[0]?.price || 0
  }

  // Return the price of the first package that can accommodate the guest count
  const suitablePackage = venue.packages.find(pkg => pkg.maxPeople >= guestCount)
  return suitablePackage ? suitablePackage.price : venue.packages[0]?.price || 0
}