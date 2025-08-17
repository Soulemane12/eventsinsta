# AI Restaurant Recommendation System

## Overview
I've integrated Groq AI to create an intelligent restaurant recommendation system that analyzes user event requirements and suggests the perfect restaurants from the three available options.

## 🤖 AI Features

### Smart Matching
- **Event Type Analysis**: AI understands different event types (Anniversary, Birthday, Holiday Party, etc.)
- **Guest Count Optimization**: Matches restaurants based on capacity requirements
- **Budget Intelligence**: Suggests restaurants within the user's budget range
- **Confidence Scoring**: Provides match confidence percentages (0-100%)

### AI-Powered Recommendations
Each recommendation includes:
- **Confidence Score**: How well the restaurant matches (Perfect/Good/Fair)
- **Reasoning**: AI explanation of why this restaurant is recommended
- **Best Package**: Specific package that fits the event
- **Why Perfect**: Detailed explanation of the match

## 🍽️ Restaurant Integration

### Available Restaurants
1. **Saint Restaurant Bar & Speakeasy** - Contemporary American
2. **Rebèl Restaurant & Bar** - Haitian & Caribbean Cuisine  
3. **Del Frisco's Double Eagle Steak House** - American Steakhouse

### AI Matching Examples

#### Anniversary Dinner for 2
- **AI Recommendation**: Saint Restaurant (95% match)
- **Reasoning**: Perfect for romantic occasions with intimate dining
- **Package**: Anniversary Dinner for Two ($200 all-inclusive)

#### Holiday Party for 50
- **AI Recommendation**: Saint Restaurant (98% match)
- **Reasoning**: Large capacity with open bar package
- **Package**: Holiday Party Package ($5,000 with 2-hour open bar)

#### Birthday Party for 20
- **AI Recommendation**: Rebel Restaurant (92% match)
- **Reasoning**: Great atmosphere for group celebrations
- **Package**: Group Party Package ($1,200)

## 🛠️ Technical Implementation

### Components
- **AIRestaurantCard**: Enhanced restaurant card with AI recommendations
- **aiRecommendation.ts**: Groq AI service for intelligent matching
- **Updated Preview Page**: Now uses AI recommendations instead of static matching

### AI Service Features
- **Groq Integration**: Uses Llama 3.3 70B model for intelligent analysis
- **JSON Response**: Structured output for reliable recommendations
- **Error Handling**: Graceful fallback when AI is unavailable
- **Loading States**: User-friendly loading indicators

### API Configuration
```typescript
// Environment variable required
GROQ_API_KEY=your_groq_api_key_here
```

## 🎯 User Experience

### Smart Interface
- **AI Badge**: Visual indicator of AI recommendations
- **Confidence Colors**: Green (Perfect), Yellow (Good), Red (Fair)
- **Expandable Details**: Show/hide restaurant information
- **Loading Animation**: Smooth AI processing feedback

### Recommendation Flow
1. User enters event details (type, guests, budget)
2. AI analyzes requirements against restaurant database
3. System shows only matching restaurants with confidence scores
4. User can view detailed reasoning and select their choice

## 🧪 Testing

### Test Page
Visit `/ai-test` to test different scenarios:
- Anniversary Dinner for 2
- Holiday Party for 50  
- Birthday Party for 20

### API Key Setup
1. Get your Groq API key from [Groq Console](https://console.groq.com)
2. Create `.env.local` file in project root
3. Add: `GROQ_API_KEY=your_key_here`
4. Restart the development server

## 🚀 Benefits

### For Users
- **Personalized Recommendations**: AI understands context and preferences
- **Confidence Transparency**: Know how well each restaurant matches
- **Intelligent Filtering**: Only see relevant options
- **Detailed Reasoning**: Understand why each restaurant is recommended

### For Business
- **Higher Conversion**: Better matches lead to more bookings
- **Reduced Decision Fatigue**: AI narrows down choices intelligently
- **Improved User Satisfaction**: Personalized experience
- **Scalable System**: Easy to add more restaurants and criteria

## 🔮 Future Enhancements

1. **Real-time Availability**: Check restaurant availability via AI
2. **User Preferences Learning**: Remember user choices for better recommendations
3. **Seasonal Adjustments**: AI considers holidays and special occasions
4. **Multi-language Support**: AI recommendations in different languages
5. **Voice Integration**: Voice-based restaurant recommendations

## 📊 Performance

- **Response Time**: ~2-3 seconds for AI analysis
- **Accuracy**: High confidence scores for well-matched events
- **Reliability**: Graceful fallback when AI is unavailable
- **Scalability**: Can handle multiple concurrent requests

The AI recommendation system transforms the restaurant selection process from a manual search to an intelligent, personalized experience that helps users find the perfect venue for their special occasions.
