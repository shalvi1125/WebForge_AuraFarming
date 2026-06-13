import { useEffect } from 'react';
import { Link } from 'react-router';
import {
  Eye, ArrowRight, Globe, Clock, MapPin, Users, Star,
  Play, Brain, Map
} from 'lucide-react';

export default function Features() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">

                <img src="/images/logo.png" alt="Raahi Logo" className="w-10 h-10" />
              </div>
              <div>
                <h1
                  className="text-2xl font-bold text-amber-900"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Raahi
                </h1>
                <p className="text-sm text-amber-700">
                  Discover, Plan, and Experience Incredible India
                </p>
              </div>
            </Link>

            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-amber-700 hover:text-amber-900 font-medium transition-colors"
              >
                Home
              </Link>
              <Link to="/itinerary-planner" className="text-amber-700 hover:text-amber-900 font-small transition-colors">
                AI Itinerary Planner
              </Link>
              <Link
                to="/interactive-map"
                className="text-amber-700 hover:text-amber-900 font-medium transition-colors"
              >
                Interactive Map
              </Link>
              <Link
                to="/trip-planner"
                className="text-amber-700 hover:text-amber-900 font-medium transition-colors"
              >
                Trip Planner
              </Link>
              
              <Link to="/community" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
                Community
              </Link>
              <Link
                to="/time-travel"
                className="text-amber-700 hover:text-amber-900 font-medium transition-colors"
              >
                Time Travel
              </Link>

              <Link
                to="/chat"
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Chat with Guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-5xl mx-auto px-6 space-y-6">
          <div className="flex items-center justify-center space-x-2 text-amber-600">
            <Star className="w-5 h-5 fill-current" />
            <span className="text-sm font-medium">Explore smarter with AI & maps</span>
          </div>
          <h1
            className="text-5xl lg:text-6xl font-bold text-amber-900 leading-tight transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Plan Your Journey Across
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {" "}
              Incredible India
            </span>
          </h1>
          <p className="text-xl text-amber-700 leading-relaxed max-w-3xl mx-auto">
            Raahi helps you explore destinations, plan trips, and experience India’s
            culture through an interactive map, smart AI suggestions, and immersive travel tools.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-white/60">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-4xl font-bold text-center text-amber-900 mb-16"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Explore Raahi's Travel Features
          </h2>

          {/* Interactive Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <img src="/images/map-feature.png" alt="Map Feature" className="w-12 h-12 rounded-lg" />
                </div>
                <h3 className="text-2xl font-bold text-amber-900">
                  Interactive Travel Map
                </h3>
              </div>
              <p className="text-lg text-amber-700 leading-relaxed">
                Hover over Indian states to discover top destinations, cultural landmarks,
                and add your favorite places to a “Visited” checklist.
              </p>
              <ul className="space-y-3 text-amber-700">
                <li>• State-wise destination discovery</li>
                <li>• Instant previews with photos & info</li>
                <li>• “Visited” tracking for travelers</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 border border-amber-200">
              <div className="aspect-video rounded-xl overflow-hidden transform transition-transform duration-500 hover:scale-105 cursor-pointer">
                <img src="/images/map.png" alt="Interactive Map" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
          </div>

          {/* AI Trip Planner */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 border border-amber-200 order-2 lg:order-1">
              <div className="aspect-video rounded-xl overflow-hidden transform transition-transform duration-500 hover:scale-105 cursor-pointer">
                <img src="/images/ai-planner.png" alt="Smart Trip Recommendations" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <img src="/images/ai-logo.png" alt="AI Trip Planner" className="w-12 h-12 rounded-lg" />
                </div>
                <h3 className="text-2xl font-bold text-amber-900">AI Trip Planner</h3>
              </div>
              <p className="text-lg text-amber-700 leading-relaxed">
                Get AI-powered trip plans based on your interests, time, and budget — from
                historical circuits to beach getaways or temple trails.
              </p>
              <ul className="space-y-3 text-amber-700">
                <li>• Personalized route suggestions</li>
                <li>• Hidden gems and offbeat spots</li>
                <li>• Real-time itinerary optimization</li>
              </ul>
            </div>
          </div>

          {/* Personal Album */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <img src="/images/album-icon.png" alt="Personal Album" className="w-12 h-12 rounded-lg" />
                </div>
                <h3 className="text-2xl font-bold text-amber-900">Your Personal Album</h3>
              </div>
              <p className="text-lg text-amber-700 leading-relaxed">
                Create your private travel photo collection. Upload pictures from your journeys,
                organize them by destination, and access your memories anytime with secure,
                personalized storage.
              </p>
              <ul className="space-y-3 text-amber-700">
                <li>• Private photo storage for your travels</li>
                <li>• Organize by destinations and trips</li>
                <li>• Secure cloud backup and access</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 border border-amber-200">
              <div className="aspect-video rounded-xl overflow-hidden transform transition-transform duration-500 hover:scale-105 cursor-pointer">
                <img src="/images/album-feature.png" alt="Personal Album" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
          </div>

          {/* AI Chat Guide */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 border border-amber-200 order-2 lg:order-1">
              <div className="aspect-video rounded-xl overflow-hidden transform transition-transform duration-500 hover:scale-105 cursor-pointer">
                <img src="/images/chat-feature.png" alt="AI Travel Companion" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <img src="/images/chat-icon.png" alt="Chat Guide" className="w-12 h-12 rounded-lg" />
                </div>
                <h3 className="text-2xl font-bold text-amber-900">Chat with Your Guide</h3>
              </div>
              <p className="text-lg text-amber-700 leading-relaxed">
                Chat with Raahi’s AI-powered travel guide — get live suggestions,
                cultural facts, and local travel advice for your next destination.
              </p>
              <ul className="space-y-3 text-amber-700">
                <li>• Real-time travel assistance</li>
                <li>• Smart Q&A for destinations</li>
                <li>• Personalized experiences</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Start Your Journey with Raahi
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Explore India like never before — plan smarter, travel deeper, and connect with the stories behind every destination.
          </p>
          <Link
            to="/interactive-map"
            className="bg-white text-amber-700 px-8 py-4 rounded-xl hover:bg-amber-50 transition-all duration-200 text-lg font-semibold inline-flex items-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Launch Interactive Map</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-100">
        <div className="max-w-7xl mx-auto px-6 py-12 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <img src="/images/logo.png" alt="Raahi Logo" className="w-8 h-8" />
            </div>
            <div>
              <h3
                className="text-lg font-bold"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                Raahi
              </h3>
              <p className="text-sm text-amber-300">
                Discover. Plan. Experience India.
              </p>
            </div>
          </Link>
          <p className="text-sm text-amber-300">
            © 2025 Raahi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
