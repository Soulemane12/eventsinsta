import React, { useState } from 'react'

interface CelebrationIdea {
  id: string
  title: string
  description: string
  icon: string
  activities: string[]
  estimatedCost: string
  duration: string
  bestFor: string[]
}

const CELEBRATION_IDEAS: CelebrationIdea[] = [
  {
    id: 'romantic-dinner',
    title: 'Romantic Dinner Experience',
    description: 'An intimate dining experience perfect for couples celebrating special moments.',
    icon: '💕',
    activities: [
      'Private table with candlelit ambiance',
      'Multi-course tasting menu',
      'Wine pairing recommendations',
      'Personalized service',
      'Photography service available'
    ],
    estimatedCost: '$150-300 per couple',
    duration: '2-3 hours',
    bestFor: ['Anniversary', 'Valentine\'s Day', 'Date Night', 'Proposal']
  },
  {
    id: 'party-celebration',
    title: 'Party & Celebration',
    description: 'Lively celebration with friends and family in a vibrant atmosphere.',
    icon: '🎉',
    activities: [
      'Group dining with shared plates',
      'Cocktail packages',
      'Music and entertainment',
      'Party decorations',
      'Group photography'
    ],
    estimatedCost: '$50-100 per person',
    duration: '3-4 hours',
    bestFor: ['Birthday', 'Graduation', 'Job Promotion', 'Holiday Party']
  },
  {
    id: 'luxury-experience',
    title: 'Luxury Fine Dining',
    description: 'Premium dining experience with exceptional service and gourmet cuisine.',
    icon: '⭐',
    activities: [
      'Chef\'s table experience',
      'Premium wine selection',
      'Private dining room',
      'Concierge service',
      'Luxury transportation available'
    ],
    estimatedCost: '$200-500 per person',
    duration: '3-4 hours',
    bestFor: ['Special Anniversary', 'Corporate Event', 'Milestone Celebration']
  },
  {
    id: 'casual-gathering',
    title: 'Casual Group Gathering',
    description: 'Relaxed atmosphere perfect for informal celebrations with friends.',
    icon: '🍽️',
    activities: [
      'Family-style dining',
      'Happy hour specials',
      'Game night options',
      'Outdoor seating available',
      'Kid-friendly options'
    ],
    estimatedCost: '$30-80 per person',
    duration: '2-3 hours',
    bestFor: ['Family Gathering', 'Friend Meetup', 'Casual Birthday', 'Holiday']
  },
  {
    id: 'cocktail-party',
    title: 'Cocktail Party & Networking',
    description: 'Sophisticated cocktail party perfect for professional and social networking.',
    icon: '🍸',
    activities: [
      'Craft cocktail menu',
      'Hors d\'oeuvres service',
      'Professional networking space',
      'Live music options',
      'Business catering available'
    ],
    estimatedCost: '$75-150 per person',
    duration: '2-3 hours',
    bestFor: ['Corporate Event', 'Networking', 'Holiday Party', 'Product Launch']
  },
  {
    id: 'brunch-celebration',
    title: 'Brunch Celebration',
    description: 'Perfect daytime celebration with delicious brunch options and daytime cocktails.',
    icon: '🥂',
    activities: [
      'Brunch buffet or à la carte',
      'Mimosa and cocktail service',
      'Daytime entertainment',
      'Outdoor brunch options',
      'Family-friendly atmosphere'
    ],
    estimatedCost: '$40-90 per person',
    duration: '2-3 hours',
    bestFor: ['Birthday Brunch', 'Mother\'s Day', 'Bridal Shower', 'Graduation']
  }
]

interface CelebrationIdeasProps {
  onSelectIdea: (idea: CelebrationIdea) => void
  selectedEventType?: string
}

export default function CelebrationIdeas({ onSelectIdea, selectedEventType }: CelebrationIdeasProps) {
  const [selectedIdea, setSelectedIdea] = useState<string>('')

  const filteredIdeas = selectedEventType 
    ? CELEBRATION_IDEAS.filter(idea => 
        idea.bestFor.some(type => 
          type.toLowerCase().includes(selectedEventType.toLowerCase())
        )
      )
    : CELEBRATION_IDEAS

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Need help deciding?</h2>
        <p className="text-sm text-gray-600">
          Choose from our curated celebration ideas to make your event unforgettable
        </p>
      </div>

      <div className="grid gap-4">
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className={`rounded-2xl bg-white shadow-lg border-2 transition-all cursor-pointer ${
              selectedIdea === idea.id 
                ? 'border-purple-600 bg-purple-50' 
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => setSelectedIdea(idea.id)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{idea.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{idea.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{idea.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>💰 {idea.estimatedCost}</span>
                    <span>⏱️ {idea.duration}</span>
                  </div>
                </div>
                {selectedIdea === idea.id && (
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Activities */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">What's included:</h4>
                <div className="grid grid-cols-1 gap-1">
                  {idea.activities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                      {activity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Best For */}
              <div className="flex flex-wrap gap-2">
                {idea.bestFor.map((type, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedIdea && (
        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="text-sm font-medium text-purple-800 mb-2">💡 Great choice!</div>
          <div className="text-xs text-purple-700 mb-3">
            This celebration idea will help us find the perfect restaurants and venues for your event.
          </div>
          <button
            onClick={() => onSelectIdea(filteredIdeas.find(idea => idea.id === selectedIdea)!)}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Use This Idea
          </button>
        </div>
      )}
    </div>
  )
}
