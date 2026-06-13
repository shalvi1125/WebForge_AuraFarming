// src/react-app/pages/Profile.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  User, Mail, Calendar, Building2, AlertCircle, Settings, LogOut,
  Calendar as CalIcon, Star, ImageIcon, Edit, Save, X
} from 'lucide-react';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  preferences: {
    heritageSites: boolean;
    beaches: boolean;
    mountains: boolean;
    cities: boolean;
    temples: boolean;
    museums: boolean;
    adventure: boolean;
    culture: boolean;
    food: boolean;
    wildlife: boolean;
  };
  createdAt: string;
  photoCount: number;
  itineraryCount: number;
}

interface UserPhoto {
  id: string;
  url: string;
  caption: string;
  location: string;
  uploadedAt: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

  const checkAuthAndLoadProfile = async () => {
    try {
      const sessionToken = localStorage.getItem('token');
      if (!sessionToken) {
        navigate('/login');
        return;
      }

      // Validate session and get user data
      const response = await fetch('/api/auth/validate-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken })
      });

      if (!response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      const { user: userData } = await response.json();
      setUser(userData);
      setEditForm({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email
      });

      // Load user photos
      await loadUserPhotos(userData.id);
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserPhotos = async (userId: number) => {
    try {
      const response = await fetch(`/api/user/photos?userId=${userId}`);
      if (response.ok) {
        const photosData = await response.json();
        setPhotos(photosData.photos || []);
      }
    } catch (error) {
      console.error('Failed to load photos:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const sessionToken = localStorage.getItem('token');
      if (sessionToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const sessionToken = localStorage.getItem('token');
      const response = await fetch('/api/user/profile/update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedUser = { ...user, ...editForm };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const getPreferenceIcon = (key: string) => {
    const icons: Record<string, any> = {
      heritageSites: '🏛️',
      beaches: '🏖️',
      mountains: '🏔️',
      cities: '🏙️',
      temples: '🕉️',
      museums: '🏛️',
      adventure: '🏃',
      culture: '🎭',
      food: '🍜',
      wildlife: '🦌'
    };
    return icons[key] || '❤️';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

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
                  My Profile
                </h1>
                <p className="text-sm text-amber-700">
                  Manage your account and travel memories
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-amber-700 hover:text-amber-900 font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-amber-900 mb-1">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-amber-600">@{user.username}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-900">{user.photoCount || 0}</div>
                  <div className="text-sm text-amber-600">Photos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-900">{user.itineraryCount || 0}</div>
                  <div className="text-sm text-amber-600">Trips</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-900">
                    {new Date(user.createdAt).getFullYear()}
                  </div>
                  <div className="text-sm text-amber-600">Member</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <Link
                  to="/photo-album"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Manage Photos</span>
                </Link>
                <Link
                  to="/itinerary-planner"
                  className="w-full border-2 border-amber-300 text-amber-700 py-3 rounded-xl hover:bg-amber-50 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Plan New Trip</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-amber-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-amber-600 hover:text-amber-900"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center space-x-2 text-green-600 hover:text-green-900"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          firstName: user.firstName,
                          lastName: user.lastName,
                          email: user.email
                        });
                      }}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-900"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-amber-50 rounded-xl text-amber-900">{user.firstName}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-amber-50 rounded-xl text-amber-900">{user.lastName}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-2">Username</label>
                  <div className="px-4 py-3 bg-amber-50 rounded-xl text-amber-900">@{user.username}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-amber-50 rounded-xl text-amber-900 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-amber-700 mb-2">Member Since</label>
                <div className="px-4 py-3 bg-amber-50 rounded-xl text-amber-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(user.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Travel Preferences */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
              <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Travel Preferences
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(user.preferences).map(([key, value]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getPreferenceIcon(key)}</span>
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className={`text-sm ${value ? 'text-amber-600' : 'text-gray-500'}`}>
                          {value ? 'Interested' : 'Not interested'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  to="/signup"
                  className="text-amber-600 hover:text-amber-900 text-sm underline"
                >
                  Update preferences →
                </Link>
              </div>
            </div>

            {/* Recent Photos */}
            {photos.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-amber-900 flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Recent Photos
                  </h3>
                  <Link
                    to="/photo-album"
                    className="text-amber-600 hover:text-amber-900 text-sm underline"
                  >
                    View all →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photos.slice(0, 6).map((photo) => (
                    <div key={photo.id} className="aspect-video rounded-xl overflow-hidden relative group">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <div className="text-white">
                          <p className="text-sm font-medium">{photo.caption}</p>
                          <p className="text-xs opacity-80">{photo.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
              <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Account Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 border-2 border-amber-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all duration-200 text-left">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="font-medium text-amber-900">Account Settings</div>
                      <div className="text-sm text-amber-600">Manage your account preferences</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleLogout}
                  className="p-4 border-2 border-red-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all duration-200 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <LogOut className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-medium text-red-900">Logout</div>
                      <div className="text-sm text-red-600">Sign out of your account</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}