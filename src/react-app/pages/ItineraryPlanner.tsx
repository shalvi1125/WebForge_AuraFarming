// src/react-app/pages/ItineraryPlanner.tsx
import { useState } from 'react';
import { Link } from 'react-router';
import { 
  ArrowLeft, MapPin, Calendar, Clock, IndianRupee, Star, Download, Share2, 
  Hotel, Utensils, Camera, Heart, Phone,
  Loader2, CheckCircle, AlertCircle, Coffee, Sun, Moon, Car
} from 'lucide-react';
import ItineraryForm from '../components/ItineraryForm';
// You'll need to install these packages:
// npm install jspdf html2canvas
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ItineraryData {
  title: string;
  duration: string;
  totalBudget: number;
  dailyItinerary: Array<{
    day: number;
    date: string;
    theme: string;
    activities: Array<{
      time?: string | null;
      activity: string;
      description?: string | null;
      location?: string | null;
      duration?: string | null;
      cost?: number | null;
      category?: string | null;
    }>;
    meals: Array<{
      meal: string;
      restaurant?: string | null;
      cuisine?: string | null;
      cost?: number | null;
    }>;
    overnight: string;
  }>;
  accommodation: {
    name: string;
    type: string;
    location: string;
    checkIn: string;
    checkOut: string;
    totalCost: number;
    amenities: string[];
  };
  transportation: {
    mode: string;
    details: string;
    totalCost: number;
  };
  tips: string[];
  emergencyContacts: Array<{
    name: string;
    phone: string;
  }>;
}

export default function ItineraryPlanner() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const generationSteps = [
    { icon: MapPin, text: 'Planning destinations...', color: 'text-green-500' },
    { icon: Hotel, text: 'Finding accommodations...', color: 'text-purple-500' },
    { icon: Utensils, text: 'Curating dining experiences...', color: 'text-orange-500' },
    { icon: Camera, text: 'Adding local attractions...', color: 'text-pink-500' },
    { icon: Star, text: 'Finalizing your itinerary...', color: 'text-amber-500' }
  ];

  const safeRender = (value: any, fallback = 'TBD') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (Array.isArray(value)) return value.join(', ');
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const handleGenerateItinerary = async (prompt: string, formData: any) => {
    setIsGenerating(true);
    setError(null);
    setGenerationStep('Initializing...');

    try {
      // Simulate step-by-step generation with delays
      for (let i = 0; i < generationSteps.length; i++) {
        setGenerationStep(generationSteps[i].text);
        await new Promise(resolve => setTimeout(resolve, 800)); // 800ms delay
      }

      const response = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, formData }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || 'Failed to generate itinerary');
      }

      const data = await response.json();
      setItinerary(data.itinerary);
      setGenerationStep('Complete! 🎉');

      // Show success for 2 seconds then hide
      setTimeout(() => {
        setGenerationStep('');
        setIsGenerating(false);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate itinerary');
      setIsGenerating(false);
      setGenerationStep('');
      console.error('Itinerary generation error:', err);
    }
  };

  const handleExportPDF = async () => {
    if (!itinerary) return;

    setIsExporting(true);
    try {
      const element = document.getElementById('itinerary-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#fef3c7'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${itinerary.title.replace(/\s+/g, '_')}_Itinerary.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    if (!itinerary) return;

    setIsExporting(true);
    try {
      const element = document.getElementById('itinerary-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#fef3c7'
      });

      const link = document.createElement('a');
      link.download = `${itinerary.title.replace(/\s+/g, '_')}_Itinerary.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error('Image export error:', err);
      alert('Failed to export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!itinerary) return;

    const shareData = {
      title: itinerary.title,
      text: `Check out my ${itinerary.duration} itinerary for ${itinerary.title}! Planned with Raahi AI.`,
      url: window.location.href,
    };


    try {
      if ((navigator as any).share && (navigator as any).canShare && (navigator as any).canShare(shareData)) {
        await (navigator as any).share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        alert('Itinerary link copied to clipboard!');
      }
    } catch (err) {
      try {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        alert('Itinerary link copied to clipboard!');
      } catch (clipboardErr) {
        alert('Sharing not supported on this device.');
      }
    }
  };

  const getActivityIcon = (category: string | undefined | null) => {
    if (!category || typeof category !== 'string') return MapPin;

    switch (category.toLowerCase()) {
      case 'sightseeing': return Camera;
      case 'food': return Utensils;
      case 'transport': return Car;
      case 'accommodation': return Hotel;
      default: return MapPin;
    }
  };

  const getMealIcon = (meal: string | undefined | null) => {
    if (!meal || typeof meal !== 'string') return Utensils;

    switch (meal.toLowerCase()) {
      case 'breakfast': return Coffee;
      case 'lunch': return Sun;
      case 'dinner': return Moon;
      default: return Utensils;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <img src="/images/logo.png" alt="Raahi Logo" className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold text-amber-900" style={{ fontFamily: 'Cinzel, serif' }}>
                  Raahi
                </h1>
              </Link>
            </div>

            <Link to="/" className="flex items-center space-x-2 text-amber-700 hover:text-amber-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {!itinerary ? (
          /* Form View */
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-amber-900 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                AI Itinerary Planner
              </h1>
              <p className="text-xl text-amber-700 max-w-3xl mx-auto">
                Let our AI create a personalized travel itinerary based on preferences, budget, and interests.
              </p>
            </div>

            <ItineraryForm onGenerate={handleGenerateItinerary} isLoading={isGenerating} />

            {/* Enhanced Loading State */}
            {isGenerating && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-amber-900">Creating Your Perfect Itinerary</h3>
                      <p className="text-amber-700">{generationStep}</p>

                      <div className="flex justify-center space-x-2">
                        {generationSteps.map((step, index) => {
                          const isActive = generationStep === step.text;
                          const isCompleted = generationSteps.findIndex(s => s.text === generationStep) > index;

                          return (
                            <div key={index} className="flex flex-col items-center space-y-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isCompleted ? 'bg-green-500 text-white' :
                                isActive ? 'bg-amber-500 text-white animate-pulse' :
                                'bg-amber-100 text-amber-400'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle className="w-5 h-5" />
                                ) : (
                                  <step.icon className="w-5 h-5" />
                                )}
                              </div>
                              <div className="text-xs text-amber-600 text-center max-w-20">
                                {step.icon === MapPin ? 'Planning' :
                                 step.icon === Hotel ? 'Hotels' :
                                 step.icon === Utensils ? 'Dining' :
                                 step.icon === Camera ? 'Attractions' :
                                 'Finalize'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">Error generating itinerary</p>
                  </div>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Itinerary View */
          <div id="itinerary-content" className="space-y-8">
            {/* Header with Export Options */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-amber-900 mb-2 flex items-center">
                    <MapPin className="w-8 h-8 mr-3 text-amber-500" />
                    {safeRender(itinerary.title, 'Untitled')}
                  </h1>
                  <div className="flex items-center space-x-6 text-amber-700">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>{safeRender(itinerary.duration, 'TBD')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="w-5 h-5" />
                      <span>₹{itinerary.totalBudget?.toLocaleString('en-IN') ?? 'TBD'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={handleExportImage}
                    disabled={isExporting}
                    className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>Image</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Daily Itinerary */}
            <div className="space-y-6">
              {itinerary.dailyItinerary.map((day, index) => (
                <div key={day.day} className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
                  {/* Day Header */}
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-6 h-6" />
                        <div>
                          <h2 className="text-2xl font-bold">Day {day.day}</h2>
                          <p className="text-amber-100">{day.theme}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg">{day.date}</p>
                        <p className="text-amber-100 text-sm flex items-center">
                          <Hotel className="w-4 h-4 mr-1" />
                          {day.overnight}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="p-6 space-y-4">
                    {day.activities.map((activity, actIndex) => {
                      const ActivityIcon = getActivityIcon(activity.category || undefined);
                      return (
                        <div key={actIndex} className="flex items-start space-x-4 p-4 bg-amber-50 rounded-lg">
                          <div className="flex-shrink-0 w-20 text-center">
                            <div className="text-sm font-medium text-amber-900 flex items-center justify-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {safeRender(activity.time, 'TBD')}
                            </div>
                            <div className="text-xs text-amber-600">{safeRender(activity.duration, 'N/A')}</div>
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-semibold text-amber-900 mb-1 flex items-center">
                              <ActivityIcon className="w-5 h-5 mr-2 text-amber-600" />
                              {safeRender(activity.activity, 'Activity')}
                            </h3>
                            <p className="text-amber-700 text-sm mb-2">{safeRender(activity.description, '')}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-sm text-amber-600">
                                <MapPin className="w-4 h-4" />
                                <span>{safeRender(activity.location, 'Location TBD')}</span>
                              </div>
                              <div className="text-sm font-medium text-amber-900 flex items-center">
                                <IndianRupee className="w-4 h-4 mr-1" />
                                {activity.cost ? <>₹{activity.cost}</> : 'Cost TBD'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Meals */}
                    {day.meals.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-amber-900 mb-3 flex items-center">
                          <Utensils className="w-5 h-5 mr-2 text-orange-500" />
                          Meals
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {day.meals.map((meal, mealIndex) => {
                            const MealIcon = getMealIcon(meal.meal);
                            return (
                              <div key={mealIndex} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                                <div className="font-medium text-amber-900 flex items-center">
                                  <MealIcon className="w-4 h-4 mr-2 text-orange-600" />
                                  {meal.meal || 'Meal'}
                                </div>
                                <div className="text-sm text-amber-700">{meal.restaurant || 'Restaurant TBD'}</div>
                                <div className="text-xs text-amber-600">{meal.cuisine || 'Cuisine TBD'}</div>
                                <div className="text-sm font-medium text-amber-900 mt-1 flex items-center">
                                  <IndianRupee className="w-4 h-4 mr-1" />
                                  {meal.cost ? <>₹{meal.cost}</> : 'Cost TBD'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Accommodation */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                  <Hotel className="w-6 h-6 mr-2 text-purple-500" />
                  Accommodation
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-amber-700 flex items-center">
                      <Hotel className="w-4 h-4 mr-1" />
                      Hotel:
                    </span>
                    <span className="font-medium text-amber-900">{safeRender(itinerary.accommodation.name, 'TBD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Location:
                    </span>
                    <span className="font-medium text-amber-900">{safeRender(itinerary.accommodation.location, 'TBD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Type:</span>
                    <span className="font-medium text-amber-900 capitalize">{safeRender(itinerary.accommodation.type, 'TBD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700 flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      Total Cost:
                    </span>
                    <span className="font-medium text-amber-900">₹{itinerary.accommodation.totalCost?.toLocaleString('en-IN') ?? 'Cost TBD'}</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-amber-700 mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-2">
                      {itinerary.accommodation.amenities && itinerary.accommodation.amenities.length > 0 ? (
                        itinerary.accommodation.amenities.map((amenity, index) => (
                          <span key={index} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                            {amenity}
                          </span>
                        ))
                      ) : (
                        <span className="text-amber-600 text-xs italic">Amenities not specified</span>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Transportation */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                  <Car className="w-6 h-6 mr-2 text-blue-500" />
                  Transportation
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-amber-700">Mode:</span>
                    <span className="font-medium text-amber-900 capitalize">{safeRender(itinerary.transportation.mode, 'TBD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700 flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      Total Cost:
                    </span>
                    <span className="font-medium text-amber-900">₹{itinerary.transportation.totalCost?.toLocaleString('en-IN') ?? 'Cost TBD'}</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-amber-700 mb-2">Details:</p>
                    <p className="text-sm text-amber-900">{safeRender(itinerary.transportation.details, '')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips & Emergency Contacts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-yellow-500" />
                  Travel Tips
                </h3>
                <ul className="space-y-2">
                  {itinerary.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-amber-700 text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                  <Phone className="w-6 h-6 mr-2 text-red-500" />
                  Emergency Contacts
                </h3>
                <ul className="space-y-2">
                  {itinerary.emergencyContacts.map((contact, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-amber-700 text-sm">
                        {contact && typeof contact === 'object' && 'name' in contact && 'phone' in contact
                          ? `${contact.name}: ${contact.phone}`
                          : safeRender(contact, 'Contact information unavailable')
                        }
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Generate New Itinerary Button */}
            <div className="text-center">
              <button
                onClick={() => setItinerary(null)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-semibold flex items-center space-x-2 mx-auto"
              >
                <MapPin className="w-5 h-5" />
                <span>Plan Another Trip</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}