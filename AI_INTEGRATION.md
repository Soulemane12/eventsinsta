# AI-Powered Restaurant Recommendation System

## Overview
I've implemented an intelligent AI recommendation system using Groq AI that analyzes user preferences and intelligently selects the best restaurants from the available options. The system shows only the most relevant restaurants with AI-powered reasoning.

## 🤖 AI Features

### Smart Restaurant Selection
- **Intelligent Filtering**: AI analyzes event type, guest count, budget, and special requirements
- **Confidence Scoring**: Each recommendation comes with a confidence score (0-100%)
- **Personalized Reasoning**: AI explains why each restaurant is perfect for your event
- **Best Package Identification**: AI suggests the most suitable dining package

### User Experience
- **Minimal Initial Display**: Shows only essential info until user clicks for details
- **Expandable Cards**: Click "View Details" to see full restaurant information
- **AI Badge System**: Visual indicators for Perfect Match (90%+), Great Match (70%+), Good Match
- **Loading States**: Smooth loading animations while AI analyzes preferences

## 🏗️ Technical Implementation

### AI Service (`src/services/aiRecommendations.ts`)
```typescript
interface UserPreferences {
  eventType: string
  guestCount: number
  budget: string
  location?: string
  occasion?: string
  dietaryRestrictions?: string[]
  atmosphere?: string
  specialRequirements?: string[]
}

interface AIRecommendation {
  restaurantId: string
  confidence: number
  reasoning: string
  bestPackage: string
  whyPerfect: string
}
```

### AI Restaurant Card (`src/components/AIRestaurantCard.tsx`)
- **Compact View**: Shows restaurant name, cuisine, location, AI confidence, and best package
- **Expanded View**: Full details including AI reasoning, packages, features, and contact info
- **Interactive Elements**: Click to select, expand for details

### Updated Preview Page (`src/app/create/preview/page.tsx`)
- **AI-Powered Recommendations**: Replaces basic filtering with intelligent AI selection
- **Loading States**: Shows skeleton loading while AI processes
- **Error Handling**: Graceful fallback if AI service fails

## 🎯 AI Analysis Factors

The AI considers these factors when making recommendations:

1. **Event Type Compatibility**
   - Anniversary → Romantic, intimate settings
   - Birthday → Fun, lively atmosphere
   - Holiday Party → Large capacity, entertainment
   - Corporate Event → Professional, business-friendly

2. **Guest Count Matching**
   - Small groups (2-10) → Intimate dining
   - Medium groups (10-50) → Group dining options
   - Large groups (50+) → Event spaces, catering

3. **Budget Appropriateness**
   - $500-$1,000 → Value-focused options
   - $1,000-$3,000 → Mid-range premium
   - $3,000-$5,000 → High-end experiences
   - $5,000+ → Luxury, exclusive packages

4. **Special Requirements**
   - Private dining
   - Wine pairing
   - Open bar
   - Entertainment
   - Dietary restrictions
   - Atmosphere preferences

## 📊 Example AI Recommendations

### Scenario 1: Romantic Anniversary (2 guests, $1,000-3,000)
**AI Recommendation:**
- **Restaurant**: Saint Restaurant Bar & Speakeasy
- **Confidence**: 95%
- **Reasoning**: "Perfect for romantic anniversaries with intimate speakeasy atmosphere"
- **Best Package**: Anniversary Dinner for Two ($200)
- **Why Perfect**: "Offers candlelit ambiance, wine pairing, and private dining perfect for couples"

### Scenario 2: Corporate Holiday Party (50 guests, $5,000+)
**AI Recommendation:**
- **Restaurant**: Saint Restaurant Bar & Speakeasy
- **Confidence**: 92%
- **Reasoning**: "Ideal for large corporate events with professional catering"
- **Best Package**: Holiday Party Package ($5,000)
- **Why Perfect**: "Includes 2-hour open bar, private dining space, and event coordination"

### Scenario 3: Birthday Celebration (20 guests, $1,000-3,000)
**AI Recommendation:**
- **Restaurant**: Rebel Restaurant & Bar
- **Confidence**: 88%
- **Reasoning**: "Perfect for fun birthday celebrations with lively atmosphere"
- **Best Package**: Group Party Package ($1,200)
- **Why Perfect**: "Offers entertainment, group dining, and festive Haitian culture"

## 🔧 Setup Instructions

### 1. Get Groq API Key
- Visit [console.groq.com](https://console.groq.com/)
- Sign up and get your API key
- Groq offers fast, reliable AI inference

### 2. Environment Configuration
Create a `.env.local` file in your project root:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Install Dependencies
```bash
npm install groq-sdk
```

### 4. Restart Development Server
```bash
npm run dev
```

## 🎮 Demo Pages

### `/ai-demo` - AI Recommendation Demo
Interactive demo showing how AI recommendations work with different scenarios:
- Romantic Anniversary
- Corporate Holiday Party
- Birthday Celebration

### `/demo` - Original Restaurant Demo
Shows the basic restaurant matching system for comparison.

## 🛡️ Error Handling & Fallbacks

### AI Service Failures
- **Graceful Degradation**: Falls back to basic filtering if AI fails
- **Error Logging**: Console errors for debugging
- **User Feedback**: Clear messaging when AI is unavailable

### No Matches Found
- **Helpful Messaging**: Explains why no matches were found
- **Alternative Suggestions**: Recommends adjusting preferences
- **Contact Support**: Provides assistance options

## 🚀 Performance Optimizations

### AI Response Caching
- Recommendations cached for similar requests
- Reduces API calls and improves response time
- Configurable cache duration

### Loading States
- Skeleton loading animations
- Progressive disclosure of information
- Smooth transitions between states

### Bundle Optimization
- Lazy loading of AI components
- Tree shaking for unused features
- Minimal bundle size impact

## 🔮 Future Enhancements

1. **Real-time Availability**: Check restaurant availability in real-time
2. **User Feedback Loop**: Learn from user selections to improve recommendations
3. **Multi-language Support**: AI recommendations in multiple languages
4. **Personalization**: Remember user preferences across sessions
5. **Advanced Filtering**: More granular preference controls
6. **Integration APIs**: Connect with restaurant booking systems

## 📈 Benefits

### For Users
- **Personalized Experience**: AI understands your specific needs
- **Time Saving**: No need to browse through irrelevant options
- **Confidence**: AI explains why each recommendation is perfect
- **Quality Assurance**: Only the best matches are shown

### For Business
- **Higher Conversion**: More relevant recommendations lead to more bookings
- **User Satisfaction**: Personalized experience increases user retention
- **Operational Efficiency**: Reduces support requests for restaurant selection
- **Competitive Advantage**: AI-powered recommendations differentiate the platform

## 🧪 Testing

### Manual Testing
1. Visit `/ai-demo` to test different scenarios
2. Verify AI recommendations match expected restaurants
3. Test error handling by temporarily disabling API key
4. Check loading states and animations

### Automated Testing
```bash
# Run tests
npm test

# Test AI service specifically
npm test -- --grep "AI recommendations"
```

The AI recommendation system transforms the restaurant selection process from a manual search to an intelligent, personalized experience that understands your event needs and finds the perfect matches.
