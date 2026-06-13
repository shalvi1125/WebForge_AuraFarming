// src/components/ItineraryForm.tsx
import { useRef, useState } from 'react';
import { Calendar, MapPin, Users, IndianRupee, Clock, Star, ArrowRight } from 'lucide-react';

interface ItineraryFormData {
  origin: string; // Starting location
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  accommodation: 'budget' | 'mid-range' | 'luxury';
  interests: string[];
  dietaryRestrictions: string[];
  pace: 'relaxed' | 'moderate' | 'intense';
  transportation: 'public' | 'private' | 'mixed';
  specialRequests: string;
}

interface ItineraryFormProps {
  onGenerate: (prompt: string, formData: ItineraryFormData) => void;
  isLoading: boolean;
}

export default function ItineraryForm({ onGenerate, isLoading }: ItineraryFormProps) {
  const [formData, setFormData] = useState<ItineraryFormData>({
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 50000,
    accommodation: 'mid-range',
    interests: [],
    dietaryRestrictions: [],
    pace: 'moderate',
    transportation: 'mixed',
    specialRequests: ''
  });

  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  // State for autocomplete dropdowns
  const [originSuggestions, setOriginSuggestions] = useState<Array<{name: string, fullName: string, latitude: number, longitude: number, country: string}>>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Array<{name: string, fullName: string, latitude: number, longitude: number, country: string}>>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [originHighlightIndex, setOriginHighlightIndex] = useState(-1);
  const [destinationHighlightIndex, setDestinationHighlightIndex] = useState(-1);
  const [originSearchTimeout, setOriginSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [destinationSearchTimeout, setDestinationSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [dateError, setDateError] = useState<string>('');

  const interestOptions = [
    'Historical Sites', 'Temples', 'Museums', 'Beaches', 'Mountains', 
    'Wildlife', 'Adventure Sports', 'Local Cuisine', 'Shopping', 'Culture'
  ];

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free'];

  const popularRoutes = [
    { from: 'Bhopal', to: 'Manali', distance: '800km' },
    { from: 'Delhi', to: 'Jaipur', distance: '280km' },
    { from: 'Mumbai', to: 'Goa', distance: '590km' },
    { from: 'Chennai', to: 'Bangalore', distance: '350km' }
  ];

  // Function to fetch cities from API
  const fetchCities = async (query: string): Promise<Array<{name: string, fullName: string, latitude: number, longitude: number, country: string}>> => {
    if (query.length < 2) return [];
    
    try {
      const response = await fetch(`/api/cities/autocomplete?q=${encodeURIComponent(query)}`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.cities || [];
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  };

  // Autocomplete handlers with debounced API calls
  const handleOriginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, origin: value }));

    // Clear previous timeout
    if (originSearchTimeout) {
      clearTimeout(originSearchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(async () => {
      if (value.length >= 2) {
        const cities = await fetchCities(value);
        setOriginSuggestions(cities);
        setShowOriginDropdown(cities.length > 0);
      } else {
        setOriginSuggestions([]);
        setShowOriginDropdown(false);
      }
    }, 300); // 300ms debounce

    setOriginSearchTimeout(timeout);
    setOriginHighlightIndex(-1);
  };

  const handleDestinationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, destination: value }));

    // Clear previous timeout
    if (destinationSearchTimeout) {
      clearTimeout(destinationSearchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(async () => {
      if (value.length >= 2) {
        const cities = await fetchCities(value);
        setDestinationSuggestions(cities);
        setShowDestinationDropdown(cities.length > 0);
      } else {
        setDestinationSuggestions([]);
        setShowDestinationDropdown(false);
      }
    }, 300); // 300ms debounce

    setDestinationSearchTimeout(timeout);
    setDestinationHighlightIndex(-1);
  };

  const handleOriginSelect = (city: {name: string, fullName: string}) => {
    setFormData(prev => ({ ...prev, origin: city.name }));
    setShowOriginDropdown(false);
    setOriginSuggestions([]);
    setOriginHighlightIndex(-1);
  };

  const handleDestinationSelect = (city: {name: string, fullName: string}) => {
    setFormData(prev => ({ ...prev, destination: city.name }));
    setShowDestinationDropdown(false);
    setDestinationSuggestions([]);
    setDestinationHighlightIndex(-1);
  };

  const handleOriginKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showOriginDropdown || originSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setOriginHighlightIndex(prev =>
          prev < originSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setOriginHighlightIndex(prev =>
          prev > 0 ? prev - 1 : originSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (originHighlightIndex >= 0) {
          handleOriginSelect(originSuggestions[originHighlightIndex]);
        }
        break;
      case 'Escape':
        setShowOriginDropdown(false);
        setOriginHighlightIndex(-1);
        break;
    }
  };

  const handleDestinationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDestinationDropdown || destinationSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setDestinationHighlightIndex(prev =>
          prev < destinationSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setDestinationHighlightIndex(prev =>
          prev > 0 ? prev - 1 : destinationSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (destinationHighlightIndex >= 0) {
          handleDestinationSelect(destinationSuggestions[destinationHighlightIndex]);
        }
        break;
      case 'Escape':
        setShowDestinationDropdown(false);
        setDestinationHighlightIndex(-1);
        break;
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleDietaryToggle = (diet: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(diet)
        ? prev.dietaryRestrictions.filter(d => d !== diet)
        : [...prev.dietaryRestrictions, diet]
    }));
  };

  const generatePrompt = (data: ItineraryFormData): string => {
    return `Create a detailed ${data.startDate} to ${data.endDate} itinerary for ${data.travelers} travelers traveling from ${data.origin} to ${data.destination}, India.

TRIP DETAILS:
- Origin: ${data.origin}
- Destination: ${data.destination}
- Budget: ₹${data.budget.toLocaleString('en-IN')} total
- Accommodation: ${data.accommodation} category
- Travel Pace: ${data.pace}
- Transportation: ${data.transportation}
- Interests: ${data.interests.join(', ')}
- Dietary Restrictions: ${data.dietaryRestrictions.join(', ')}
${data.specialRequests ? `- Special Requests: ${data.specialRequests}` : ''}

REQUIREMENTS:
1. Return a valid JSON object with this exact structure:
{
  "title": "Trip from ${data.origin} to ${data.destination}",
  "duration": "X days",
  "totalBudget": ${data.budget},
  "dailyItinerary": [
    {
      "day": 1,
      "date": "${data.startDate}",
      "theme": "Travel & Arrival",
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "Activity name",
          "description": "Brief description",
          "location": "Specific location/address in ${data.destination}",
          "duration": "2 hours",
          "cost": 500,
          "category": "sightseeing"
        }
      ],
      "meals": [
        {
          "meal": "Breakfast",
          "restaurant": "Restaurant name",
          "cuisine": "Cuisine type",
          "cost": 200
        }
      ],
      "overnight": "Hotel name"
    }
  ],
  "accommodation": {
    "name": "Hotel Name",
    "type": "hotel type",
    "location": "Hotel location",
    "checkIn": "${data.startDate}",
    "checkOut": "end date",
    "totalCost": 5000,
    "amenities": ["WiFi", "Pool", "Breakfast"]
  },
  "transportation": {
    "mode": "local transport",
    "details": "Transportation details for local travel",
    "totalCost": 1000
  },
  "tips": ["Tip 1", "Tip 2"],
  "emergencyContacts": ["Police: 100", "Ambulance: 108"]
}

GUIDELINES:
- For EACH activity, include a SPECIFIC location/address within ${data.destination}
- Suggest authentic local experiences with real location names
- Include mix of popular and hidden gems with their exact locations
- Account for weather and best visiting times
- Provide practical travel tips
- Ensure activities match the traveler's interests and pace
- Include restaurant recommendations with dietary considerations
- Make locations specific and actionable (e.g., "Qutub Minar Complex, Mehrauli" not just "historical site")`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = generatePrompt(formData);
    onGenerate(prompt, formData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
          Plan Your Perfect Trip
        </h2>
        <p className="text-amber-700">Tell us your starting point and destination, and we'll create a personalized itinerary</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-amber-900 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              From (Origin)
            </label>
            <input
              ref={originRef}
              type="text"
              value={formData.origin}
              onChange={handleOriginInputChange}
              onFocus={() => {
                if (formData.origin.length > 0) {
                  const filtered = originSuggestions.filter(city =>
                    city.name.toLowerCase().includes(formData.origin.toLowerCase())
                  );
                  setShowOriginDropdown(filtered.length > 0);
                }
              }}
              onBlur={() => {
                // Delay hiding to allow click on dropdown items
                setTimeout(() => setShowOriginDropdown(false), 150);
              }}
              onKeyDown={handleOriginKeyDown}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g., Bhopal"
              required
            />

            {/* Origin Autocomplete Dropdown */}
            {showOriginDropdown && originSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-amber-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {originSuggestions.map((city, index) => (
                  <div
                    key={`${city.name}-${city.country}`}
                    onClick={() => handleOriginSelect(city)}
                    className={`px-4 py-2 cursor-pointer hover:bg-amber-50 ${
                      index === originHighlightIndex ? 'bg-amber-100' : ''
                    }`}
                  >
                    <div className="font-medium">{city.name}</div>
                    <div className="text-xs text-gray-500">{city.country}</div>
                  </div>
                ))}
              </div>
            )}

          </div>
          
          <div className="flex items-center justify-center pt-8">
            <ArrowRight className="w-6 h-6 text-amber-500" />
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-amber-900 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              To (Destination)
            </label>
            <input
              ref={destinationRef}
              type="text"
              value={formData.destination}
              onChange={handleDestinationInputChange}
              onFocus={() => {
                if (formData.destination.length > 0) {
                  const filtered = destinationSuggestions.filter(city =>
                    city.name.toLowerCase().includes(formData.destination.toLowerCase())
                  );
                  setShowDestinationDropdown(filtered.length > 0);
                }
              }}
              onBlur={() => {
                // Delay hiding to allow click on dropdown items
                setTimeout(() => setShowDestinationDropdown(false), 150);
              }}
              onKeyDown={handleDestinationKeyDown}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g., Manali"
              required
            />

            {/* Destination Autocomplete Dropdown */}
            {showDestinationDropdown && destinationSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-amber-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {destinationSuggestions.map((city, index) => (
                  <div
                    key={`${city.name}-${city.country}`}
                    onClick={() => handleDestinationSelect(city)}
                    className={`px-4 py-2 cursor-pointer hover:bg-amber-50 ${
                      index === destinationHighlightIndex ? 'bg-amber-100' : ''
                    }`}
                  >
                    <div className="font-medium">{city.name}</div>
                    <div className="text-xs text-gray-500">{city.country}</div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Popular Routes Suggestion */}
        {(!formData.origin || !formData.destination) && (
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <h3 className="text-sm font-medium text-amber-900 mb-2">Popular Routes:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {popularRoutes.map((route, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, origin: route.from, destination: route.to }))}
                  className="text-left p-2 rounded-lg hover:bg-amber-100 transition-colors text-sm text-amber-800"
                >
                  {route.from} → {route.to} ({route.distance})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => {
                const newStartDate = e.target.value;
                setFormData(prev => ({ ...prev, startDate: newStartDate }));
                // Re-validate end date when start date changes
                if (formData.endDate && formData.endDate < newStartDate) {
                  setDateError('End date cannot be before start date');
                } else {
                  setDateError('');
                }
              }}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => {
                const newEndDate = e.target.value;
                if (formData.startDate && newEndDate < formData.startDate) {
                  setDateError('End date cannot be before start date');
                } else {
                  setDateError('');
                }
                setFormData(prev => ({ ...prev, endDate: newEndDate }));
              }}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Date validation error */}
        {dateError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-700 text-sm">{dateError}</p>
          </div>
        )}

        {/* Travelers & Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Travelers
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.travelers || ''}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({ ...prev, travelers: value === '' ? 1 : parseInt(value) || 1 }))
              }}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              <IndianRupee className="w-4 h-4 inline mr-2" />
              Total Budget (₹)
            </label>
            <input
              type="number"
              min="10000"
              step="5000"
              value={formData.budget || ''}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({ ...prev, budget: value === '' ? 0 : parseInt(value) || 0 }))
              }}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Accommodation */}
        <div>
          <label className="block text-sm font-medium text-amber-900 mb-2">
            <Star className="w-4 h-4 inline mr-2" />
            Accommodation Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['budget', 'mid-range', 'luxury'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, accommodation: type as any }))}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  formData.accommodation === type
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : 'border-amber-200 bg-white text-amber-700 hover:border-amber-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-amber-900 mb-2">
            Interests & Activities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                  formData.interests.includes(interest)
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : 'border-amber-200 bg-white text-amber-700 hover:border-amber-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div>
          <label className="block text-sm font-medium text-amber-900 mb-2">
            Dietary Restrictions
          </label>
          <div className="grid grid-cols-3 gap-2">
            {dietaryOptions.map((diet) => (
              <button
                key={diet}
                type="button"
                onClick={() => handleDietaryToggle(diet)}
                className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                  formData.dietaryRestrictions.includes(diet)
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : 'border-amber-200 bg-white text-amber-700 hover:border-amber-300'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Pace & Transportation */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Travel Pace
            </label>
            <select
              value={formData.pace}
              onChange={(e) => setFormData(prev => ({ ...prev, pace: e.target.value as any }))}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="relaxed">Relaxed</option>
              <option value="moderate">Moderate</option>
              <option value="intense">Intense</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Local Transportation
            </label>
            <select
              value={formData.transportation}
              onChange={(e) => setFormData(prev => ({ ...prev, transportation: e.target.value as any }))}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="public">Public Transport</option>
              <option value="private">Private Vehicle</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-amber-900 mb-2">
            Special Requests or Notes
          </label>
          <textarea
            value={formData.specialRequests}
            onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            rows={3}
            placeholder="Any special requirements, accessibility needs, or preferences..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !!dateError}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Your Itinerary...</span>
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5" />
              <span>Generate My Itinerary</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}