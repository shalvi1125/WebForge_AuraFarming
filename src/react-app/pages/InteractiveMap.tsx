// src/react-app/pages/InteractiveMap.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Eye, ArrowRight, MapPin, Compass, Globe2, CheckCircle, Star, Shield, Users, Globe, Upload, Camera, X, Save, ImageIcon, User } from 'lucide-react';
import indiaMapImg from '../../images/india-map.jpg';
import gatewayOfIndiaImg from '../../images/gateway-of-india.jpg';
import hawaMahalImg from '../../images/hawa-mahal.jpg';

interface Photo {
  id: number;
  url: string;
  caption: string;
  date: string;
  place_name: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  preferences: any;
}
// India boundary: West=68°, East=97.5°, North=37°, South=8°
// Adjust +1% margin so points never land "out of India" on your map

const touristSpots = {
    Punjab: {
      name: "Golden Temple",
      image: "/images/golden-temple.jpg",
      description: "The holiest Gurdwara of Sikhism, Amritsar.",
      // Amritsar (31.6199N, 74.8767E)
      top: "20%",
      left: "28%",
    },
    Delhi: {
      name: "Red Fort",
      image: "/images/red-fort.jpg",
      description: "Iconic Mughal fort in the heart of Delhi.",
      // (28.6562N, 77.2410E)
      top: "31%",
      left: "36%",
    },
    "Delhi-Qutub": {
      name: "Qutub Minar",
      image: "/images/qutub-minar.jpg",
      description: "UNESCO minaret, South Delhi.",
      // (28.5245N, 77.1855E)
      top: "28.8%",
      left: "34%",
    },
    Rajasthan: {
      name: "Hawa Mahal",
      image: hawaMahalImg,
      description: "Jaipur's Palace of Winds.",
      // Jaipur (26.9239N, 75.8267E)
      top: "36%",
      left: "32.8%",
    },
    "Rajasthan-Amer": {
      name: "Amer Fort",
      image: "/images/amer-fort.jpg",
      description: "Amer, outside Jaipur.",
      // Amer Fort (26.9858N, 75.8518E)
      top: "33.4%",
      left: "32.9%",
    },
    "Uttar Pradesh": {
      name: "Taj Mahal",
      image: "/images/taj-mahal.jpg",
      description: "Wonder of the world, Agra.",
      // Agra (27.1751N, 78.0421E)
      top: "34%",
      left: "40.0%",
    },
    Maharashtra: {
      name: "Gateway of India",
      image: gatewayOfIndiaImg,
      description: "Mumbai's sea-facing arch.",
      // Mumbai (18.9220N, 72.8347E)
      top: "63.5%",
      left: "23%",
    },
    "West Bengal": {
      name: "Victoria Memorial",
      image: "/images/victoria-memorial.jpg",
      description: "Iconic structure in Kolkata.",
      // Kolkata (22.5448N, 88.3426E)
      top: "48.4%",
      left: "69.3%",
    },
    Odisha: {
      name: "Konark Sun Temple",
      image: "/images/konark-sun-temple.jpg",
      description: "Odisha's famed Sun Temple.",
      // (19.8876N, 86.0945E)
      top: "57.6%",
      left: "60.3%",
    },
    Telangana: {
      name: "Charminar",
      image: "/images/charminar.jpg",
      description: "Mosque & monument, Hyderabad.",
      // Hyderabad (17.3616N, 78.4747E)
      top: "63%",
      left: "41.9%",
    },
    Karnataka: {
      name: "Mysore Palace",
      image: "/images/mysore-palace.jpg",
      description: "The royal palace of Mysuru.",
      // Mysore (12.3052N, 76.6533E)
      top: "84%",
      left: "35.9%",
    },
    "Tamil Nadu": {
      name: "Meenakshi Temple",
      image: "/images/meenakshi-temple.jpg",
      description: "Historic temple, Madurai.",
      // Madurai (9.9195N, 78.1194E)
      top: "91%",
      left: "38.5%",
    },
  };
export default function InteractiveMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [photos, setPhotos] = useState<Record<string, Photo[]>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadCaption, setUploadCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPlaceForUpload, setSelectedPlaceForUpload] = useState<string | null>(null);
  const [showPhotoSidebar, setShowPhotoSidebar] = useState(false);
  const [sidebarPlace, setSidebarPlace] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Optimize authentication - check localStorage first
  useEffect(() => {
    const checkAuth = async () => {
      // Quick local check first (should be instant)
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setUser(user);
          
          // Load data in background without blocking UI
          loadUserData(user.id);
        } catch (error) {
          // Invalid cached data, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      // Always set loading to false after 1 second max
      setTimeout(() => setLoading(false), 1000);
    };

    checkAuth();

    // Load fonts asynchronously (non-blocking)
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    link.onload = () => console.log('Fonts loaded');
    document.head.appendChild(link);
  }, []);

  // Separate data loading function that doesn't block UI
  const loadUserData = async (userId: number) => {
    try {
      // Load both photos and visited places in parallel
      const [photosResponse, visitedResponse] = await Promise.allSettled([
        fetch(`/api/photos/user/${userId}`),
        fetch(`/api/places/visited/${userId}`)
      ]);

      // Process photos
      if (photosResponse.status === 'fulfilled' && photosResponse.value.ok) {
        const userPhotos = await photosResponse.value.json();
        const photosByPlace: Record<string, Photo[]> = {};
        
        if (Array.isArray(userPhotos)) {
          userPhotos.forEach((photo: Photo) => {
            if (!photosByPlace[photo.place_name]) {
              photosByPlace[photo.place_name] = [];
            }
            photosByPlace[photo.place_name].push(photo);
          });
        }
        
        setPhotos(photosByPlace);
      }

      // Process visited places
      if (visitedResponse.status === 'fulfilled' && visitedResponse.value.ok) {
        const visitedMap = await visitedResponse.value.json();
        setVisited(visitedMap);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  // Load user's photos from database
  const loadUserPhotos = async (userId: number) => {
    try {
      console.log('Loading photos for user ID:', userId);
      const response = await fetch(`/api/photos/user/${userId}`);
      console.log('Photo API response status:', response.status);
      
      if (response.ok) {
        const userPhotos = await response.json();
        console.log('Retrieved photos from API:', userPhotos);
        
        // Group photos by place
        const photosByPlace: Record<string, Photo[]> = {};
        if (Array.isArray(userPhotos)) {
          userPhotos.forEach((photo: Photo) => {
            console.log('Processing photo:', photo.id, photo.place_name);
            if (!photosByPlace[photo.place_name]) {
              photosByPlace[photo.place_name] = [];
            }
            photosByPlace[photo.place_name].push(photo);
          });
        } else {
          console.error('API returned non-array response:', userPhotos);
        }
        
        console.log('Grouped photos by place:', photosByPlace);
        setPhotos(photosByPlace);
      } else {
        console.error('Photo API failed with status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Failed to load photos:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (!selectedPlaceForUpload || selectedFiles.length === 0 || !user) return;

    setIsUploading(true);

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('place_name', touristSpots[selectedPlaceForUpload as keyof typeof touristSpots].name);
        formData.append('caption', uploadCaption || `Photo of ${touristSpots[selectedPlaceForUpload as keyof typeof touristSpots].name}`);
        formData.append('user_id', user.id.toString());

        const response = await fetch('/api/photos/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        return response.json();
      });

      const uploadedPhotos = await Promise.all(uploadPromises);
      
      // Map API response to Photo interface format
      const mappedPhotos = uploadedPhotos.map(response => ({
        id: response.photoId,
        url: response.url,
        caption: response.caption,
        date: new Date().toISOString(),
        place_name: response.place_name
      }));
      
      // Update local state with properly formatted photos
      setPhotos(prev => ({
        ...prev,
        [selectedPlaceForUpload]: [...(prev[selectedPlaceForUpload] || []), ...mappedPhotos]
      }));

      console.log('Photos uploaded and added to state:', mappedPhotos);

      setSelectedFiles([]);
      setUploadCaption('');
      setSelectedPlaceForUpload(null);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload photos. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = async (placeKey: string, photoId: number) => {
    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPhotos(prev => ({
          ...prev,
          [placeKey]: prev[placeKey].filter(photo => photo.id !== photoId)
        }));
      } else {
        alert('Failed to delete photo');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete photo');
    }
  };

  const openPhotoSidebar = (placeKey: string) => {
    setSidebarPlace(placeKey);
    setShowPhotoSidebar(true);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: token }),
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setPhotos({}); // Clear photos on logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Update visited place in database
  const updateVisitedPlace = async (placeName: string, visited: boolean) => {
    if (!user) return;

    try {
      const response = await fetch('/api/places/visited', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          placeName,
          visited
        }),
      });

      if (!response.ok) {
        console.error('Failed to update visited place');
      }
    } catch (error) {
      console.error('Error updating visited place:', error);
    }
  };

  // Early return with optimized loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-3"></div>
          <p className="text-amber-700 text-sm">Loading your travel map...</p>
        </div>
      </div>
    );
  }

  const handleVisitedChange = (state: string) => {
    const newVisited = !visited[state];
    setVisited((prev) => ({
      ...prev,
      [state]: newVisited,
    }));
    
    // Save to database
    updateVisitedPlace(touristSpots[state as keyof typeof touristSpots].name, newVisited);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 text-amber-900 flex">
      {/* Main Content */}
      <div className="flex-1">
        {/* 🌐 Navbar */}
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
                    Discover India's unseen heritage & journeys
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
                <Link to="/interactive-map" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
                  Interactive Map
                </Link>
                <Link to="/trip-planner" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
                  Trip Planner
                </Link>
                <Link to="/community" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
                Community
              </Link>
                <Link to="/time-travel" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
                  Time Travel
                </Link>
                
                {user ? (
                  // User is logged in - show profile menu
                  <div className="relative profile-menu">
                    <button
                      className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200"
                      onClick={() => {
                        const menu = document.querySelector('.profile-dropdown');
                        menu?.classList.toggle('hidden');
                      }}
                    >
                      <User className="w-4 h-4" />
                      <span>{user.firstName}</span>
                    </button>
                    <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-amber-200 hidden z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                        onClick={() => document.querySelector('.profile-dropdown')?.classList.add('hidden')}
                      >
                        <User className="w-4 h-4 inline mr-2" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  // User not logged in - show login/signup
                  <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
                      Login
                    </Link>
                    <Link to="/signup" className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* 🌍 Hero Section */}
        <section className="text-center py-20 px-6">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Explore India's Heritage, State by State
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-amber-800">
            Hover across the map to uncover India's timeless landmarks. Discover cultural gems, check places you've visited, and capture your memories with personal photo albums.
          </p>

          <div className="flex justify-center space-x-8 mt-8">
            <div className="flex items-center space-x-2">
              <MapPin className="text-amber-700" />
              <span>Interactive Exploration</span>
            </div>
            <div className="flex items-center space-x-2">
              <Compass className="text-amber-700" />
              <span>Personal Journey Tracker</span>
            </div>
            <div className="flex items-center space-x-2">
              <Camera className="text-amber-700" />
              <span>Photo Memory Albums</span>
            </div>
          </div>

          {!user && (
            <div className="mt-8 p-4 bg-amber-100 rounded-lg border border-amber-300">
              <p className="text-amber-800">
                <User className="w-5 h-5 inline mr-2" />
                <strong>Login to save your photos permanently!</strong> Your photo albums will be stored securely and accessible anytime.
              </p>
            </div>
          )}
        </section>

        {/* 🗺️ Interactive Map Section */}
        <div className="flex justify-center pb-24">
          <div className="relative inline-block">
            <img
              src={indiaMapImg}
              alt="India Map"
              className="rounded-xl shadow-2xl border border-amber-200 max-w-full h-auto"
              loading="eager" // Load immediately
              decoding="sync" // Decode synchronously for faster display
            />

             {/* Tourist Spots - optimize rendering */}
             {Object.entries(touristSpots).map(([state, spot]) => (
      <div
        key={state}
        className="absolute"
        style={{
          top: spot.top,
          left: spot.left,
          transform: 'translate(-50%, -50%)',
          zIndex: hovered ? (hovered === state ? 30 : 10) : 20,
          opacity: !hovered || hovered === state ? 1 : 0.25,
          pointerEvents: hovered && hovered !== state ? "none" : "auto"
        }}
        onMouseEnter={() => setHovered(state)}
        onMouseLeave={() => setHovered(null)}
      >
                  {/* Marker dot, only highlighted if active */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white cursor-pointer transition-transform duration-200 ${
                      hovered === state
                        ? "bg-amber-700 scale-125"
                        : "bg-amber-700 opacity-60"
                    }`}
                  />
                  {/* Info box only for hovered */}
                  {hovered === state && (
          <div className="absolute -top-44 left-6 w-72 bg-white shadow-xl rounded-xl p-4 border border-amber-100 z-50 text-left animate-fade-in">
            <img
              src={spot.image}
              alt={spot.name}
              className="w-full h-36 object-cover rounded-lg mb-3"
              loading="eager"
              decoding="sync"
            />
            <h3 className="text-lg font-bold text-amber-900">{spot.name}</h3>
            <p className="text-sm text-amber-700 mb-2">{spot.description}</p>
            {/* Visited checkbox (NO error: always in correct map context) */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm text-amber-700">
                <input
                  type="checkbox"
                  checked={visited[state] || false}
                  onChange={() => handleVisitedChange(state)}
                />
                <span>Already visited</span>
                {visited[state] && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </label>

                      {user ? (
                        visited[state] && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedPlaceForUpload(state)}
                              className="flex-1 bg-amber-500 text-white px-3 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center space-x-1 text-sm"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Upload Photos</span>
                            </button>
                            <button
                              onClick={() => openPhotoSidebar(state)}
                              className="flex-1 border border-amber-300 text-amber-700 px-3 py-2 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-center space-x-1 text-sm"
                            >
                              <Camera className="w-4 h-4" />
                              <span>View Photos ({photos[state]?.length || 0})</span>
                            </button>
                          </div>
                        )
                      ) : (
                        visited[state] && (
                          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-sm text-amber-700">
                              <User className="w-4 h-4 inline mr-1" />
                              Login to upload and save photos permanently
                            </p>
                            <div className="flex space-x-2 mt-2">
                              <Link 
                                to="/login"
                                className="flex-1 bg-amber-500 text-white px-3 py-2 rounded text-center text-sm hover:bg-amber-600 transition-colors"
                              >
                                Login
                              </Link>
                              <Link 
                                to="/signup"
                                className="flex-1 border border-amber-300 text-amber-700 px-3 py-2 rounded text-center text-sm hover:bg-amber-50 transition-colors"
                              >
                                Sign Up
                              </Link>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ✨ Footer Section */}
        <footer className="text-center py-12 bg-amber-100 border-t border-amber-300">
          <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
            Plan Your Next Journey with Raahi
          </h2>
          <p className="text-amber-800 mb-6 max-w-2xl mx-auto">
            Whether it's revisiting monuments or discovering hidden wonders, Raahi helps you connect with India's living history — one destination at a time.
          </p>
          <Link
            to="/trip-planner"
            className="inline-block bg-amber-700 text-white px-6 py-3 rounded-xl shadow-md hover:bg-amber-800 transition"
          >
            Go to Trip Planner
          </Link>
        </footer>
      </div>

      {/* Photo Sidebar */}
      {showPhotoSidebar && sidebarPlace && (
        <div className="w-96 bg-white shadow-2xl border-l border-amber-200 h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <img 
                  src={touristSpots[sidebarPlace as keyof typeof touristSpots].image} 
                  alt={touristSpots[sidebarPlace as keyof typeof touristSpots].name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-amber-900">{touristSpots[sidebarPlace as keyof typeof touristSpots].name}</h3>
                  <p className="text-sm text-amber-600">Your Photo Collection</p>
                </div>
              </div>
              <button
                onClick={() => setShowPhotoSidebar(false)}
                className="p-2 hover:bg-amber-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-amber-700" />
              </button>
            </div>

            <button
              onClick={() => {
                setSelectedPlaceForUpload(sidebarPlace);
                setShowPhotoSidebar(false);
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center space-x-2 mb-6"
            >
              <Upload className="w-5 h-5" />
              <span>Add More Photos</span>
            </button>

            {photos[sidebarPlace] && photos[sidebarPlace].length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-amber-900 mb-4">Your Memories ({photos[sidebarPlace].length})</h4>
                {photos[sidebarPlace].map((photo) => (
                  <div key={photo.id} className="bg-amber-50 rounded-xl overflow-hidden border border-amber-100">
                    <div className="aspect-video relative group">
                      <img 
                        src={photo.url} 
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={() => removePhoto(sidebarPlace, photo.id)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-amber-700 mb-2">{photo.caption}</p>
                      <p className="text-xs text-amber-500">{new Date(photo.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ImageIcon className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-amber-900 mb-2">No photos yet</h3>
                <p className="text-amber-700 mb-6">Start building your photo collection for {touristSpots[sidebarPlace as keyof typeof touristSpots].name}</p>
                <button
                  onClick={() => {
                    setSelectedPlaceForUpload(sidebarPlace);
                    setShowPhotoSidebar(false);
                  }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Your First Photo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {selectedPlaceForUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-amber-900 mb-4">
              Add Photos to {touristSpots[selectedPlaceForUpload as keyof typeof touristSpots].name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-2">
                  Select Photos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full p-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-2">
                  Caption (optional)
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Describe your photos..."
                  className="w-full p-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="bg-amber-50 p-3 rounded-lg">
                  <p className="text-sm text-amber-700">{selectedFiles.length} photo(s) selected</p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{isUploading ? 'Uploading...' : 'Upload Photos'}</span>
              </button>
              <button
                onClick={() => setSelectedPlaceForUpload(null)}
                className="flex-1 border-2 border-amber-300 text-amber-700 py-3 rounded-xl hover:bg-amber-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}