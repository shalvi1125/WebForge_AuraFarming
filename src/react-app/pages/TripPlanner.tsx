import { useEffect } from 'react';
import { Link } from 'react-router';
import { Eye, ArrowRight, Globe, Clock, MapPin, Users, Zap, Shield, Play, Star, ChevronRight } from 'lucide-react';

// Google Translate API type declarations


export default function Landing() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <img src="/images/logo.png" alt="Raahi Logo" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-900" style={{ fontFamily: 'Cinzel, serif' }}>
                  Raahi
                </h1>
                <p className="text-sm text-amber-700">
                  Your Intelligent Tourist Companion
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <Link to="/features" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
                Features
              </Link>
              
              <Link to="/itinerary-planner" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
  AI Itinerary Planner
</Link>
<Link to="/interactive-map" className="hover:text-amber-700">
                Interactive Map
              </Link>
              <Link to="/chat" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
                Trip Planner
              </Link>
              <Link to="/community" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
                Community
              </Link>
           
              <Link to="/time-travel" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
                Time Travel
              </Link>
             
              <Link
                to="/chat"
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Start Exploring</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-amber-600">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-sm font-medium">Travel, the Smart Way !</span>
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-amber-900 leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                  Discover India
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> with Raahi</span>
                </h1>

                <p className="text-xl text-amber-700 leading-relaxed">
                  Every Traveller seeks a story -- Raahi helps you live yours. With AI at its heart, it turns every map into a memory and every plan into an adventure.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/chat"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2 text-lg font-semibold"
                >
                  <Play className="w-5 h-5" />
                  <span>Begin Your Journey</span>
                </Link>

                <Link
                  to="/features"
                  className="border-2 border-amber-600 text-amber-700 px-8 py-4 rounded-xl hover:bg-amber-50 transition-all duration-200 flex items-center justify-center space-x-2 text-lg font-semibold"
                >
                  <span>See How It Works</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="flex items-center space-x-8 text-sm text-amber-600">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>AI-Powered Exploration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Authentic Insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Community-Driven</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 shadow-2xl border border-amber-200">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-amber-200 transform transition-transform duration-500 hover:scale-105 cursor-pointer">
                  <img
                    src="/images/heritage-preview.png"
                    alt="Immersive Heritage Preview"
                    className="w-full h-auto rounded-2xl transition-all duration-500 hover:brightness-110"
                  />
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg border border-amber-200">
                <div className="flex items-center space-x-2 text-amber-700">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Experiences</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg border border-amber-200">
                <div className="flex items-center space-x-2 text-amber-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Through Every Journey</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-amber-900 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
              Why Choose Raahi?
            </h2>
            <p className="text-xl text-amber-700 max-w-3xl mx-auto">
              Raahi transforms how you travel combining AI-powered planning, interactive maps and personalized recommendations to make very journey effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-amber-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">
                Smart Trip Planning
              </h3>
              <p className="text-amber-700 leading-relaxed">
                Let Raahi’s AI curate personalized journeys based on your interests, time, and location — seamlessly connecting travellers to places, stories and experiences.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-amber-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">
                Budget-Smart Planning & Stays
              </h3>
              <p className="text-amber-700 leading-relaxed">
                Travel more while spending less. Raahi compares routes, hotels, and experiences in real time to help you find the best deals that match your budget. From affordable stays to cost-efficient itineraries, Raahi makes smart savings effortless — without compromising on experience.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-amber-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">
                Real-Time Travel Assistance
              </h3>
              <p className="text-amber-700 leading-relaxed">
                Never feel lost on your journey. Raahi’s AI chatbot provides instant answers, route guidance, local tips, and on-the-spot travel suggestions — ensuring every moment of your trip is seamless, informed, and stress-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
                  Raahi
                </h3>
                <p className="text-sm text-amber-300">
                  Discover. Travel. Relive History.
                </p>
              </div>
            </div>
            <div className="text-sm text-amber-300">
              © 2025 Raahi. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}