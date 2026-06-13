// src/react-app/pages/Community.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  Heart, MessageCircle, MapPin, Users, Star, Award, UserPlus, UserMinus,
  Camera, Globe, Compass, Trophy, Gift, ArrowLeft, Search, Filter,
  Plus, X, Upload, CheckCircle, Target, TrendingUp, Mountain, Waves,
  Utensils, Building, CameraIcon, Map, Navigation
} from 'lucide-react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  preferences: any;
  avatar?: string;
  bio?: string;
  review_count?: number;
  follower_count?: number;
  following_count?: number;
  interests?: string[];
}

interface Review {
  id: number;
  user_id: number;
  place_name: string;
  review_text: string;
  rating: number;
  photo_url?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  first_name: string;
  last_name: string;
  username: string;
  is_following?: boolean;
  user_avatar?: string;
}

interface Reward {
  id: number;
  reward_type: string;
  description: string;
  voucher_code?: string;
  voucher_amount?: number;
  status: string;
  created_at: string;
}

interface DiscoverUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  avatar?: string;
  bio?: string;
  review_count: number;
  follower_count: number;
  interests: string[];
  is_following: boolean;
  mutual_followers?: number;
}

const INTERESTS = [
  { id: 'adventure', label: 'Adventure', icon: Mountain, color: 'text-green-600' },
  { id: 'beach', label: 'Beach & Coastal', icon: Waves, color: 'text-blue-600' },
  { id: 'food', label: 'Food & Cuisine', icon: Utensils, color: 'text-orange-600' },
  { id: 'culture', label: 'Culture & Heritage', icon: Building, color: 'text-purple-600' },
  { id: 'photography', label: 'Photography', icon: CameraIcon, color: 'text-pink-600' },
  { id: 'nature', label: 'Nature & Wildlife', icon: Map, color: 'text-green-700' },
  { id: 'city', label: 'City Exploration', icon: Navigation, color: 'text-gray-600' },
];

export default function Community() {
  const [user, setUser] = useState<User | null>(null);
  const [feed, setFeed] = useState<Review[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [discoverUsers, setDiscoverUsers] = useState<DiscoverUser[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'discover' | 'rewards'>('upload');
  const [loading, setLoading] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [reviewForm, setReviewForm] = useState({
    placeName: '',
    reviewText: '',
    rating: 5,
    photo: null as File | null,
    latitude: null as number | null,
    longitude: null as number | null
  });
  const [postingReview, setPostingReview] = useState(false);
  const [userStats, setUserStats] = useState({
    totalReviews: 0,
    reviewsThisMonth: 0,
    nextRewardAt: 10,
    currentStreak: 0
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('/api/auth/validate-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken: token }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          await Promise.all([
            loadFeed(data.user.id),
            loadRewards(data.user.id),
            loadDiscoverUsers(data.user.id),
            loadUserStats(data.user.id)
          ]);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    }
    setLoading(false);
  };

  const loadFeed = async (userId: number) => {
    try {
      const response = await fetch('/api/community/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setFeed(data.feed);
      }
    } catch (error) {
      console.error('Failed to load feed:', error);
    }
  };

  const loadRewards = async (userId: number) => {
    try {
      const response = await fetch(`/api/community/rewards/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setRewards(data.rewards);
      }
    } catch (error) {
      console.error('Failed to load rewards:', error);
    }
  };

  const loadDiscoverUsers = async (userId: number) => {
    try {
      const response = await fetch(`/api/community/discover/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setDiscoverUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to load discover users:', error);
    }
  };

  const loadUserStats = async (userId: number) => {
    try {
      const response = await fetch(`/api/community/stats/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const handleFollow = async (targetUserId: number, action: 'follow' | 'unfollow') => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/community/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          followerId: user.id, 
          followingId: targetUserId, 
          action 
        }),
      });

      if (response.ok) {
        setDiscoverUsers(prev => prev.map(u => 
          u.id === targetUserId 
            ? { ...u, is_following: action === 'follow' }
            : u
        ));
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    }
  };

  const handlePostReview = async () => {
    if (!user || !reviewForm.placeName.trim() || !reviewForm.reviewText.trim()) return;

    setPostingReview(true);
    try {
      const formData = new FormData();
      formData.append('userId', user.id.toString());
      formData.append('placeName', reviewForm.placeName);
      formData.append('reviewText', reviewForm.reviewText);
      formData.append('rating', reviewForm.rating.toString());
      if (reviewForm.photo) {
        formData.append('photo', reviewForm.photo);
      }
      if (reviewForm.latitude && reviewForm.longitude) {
        formData.append('latitude', reviewForm.latitude.toString());
        formData.append('longitude', reviewForm.longitude.toString());
      }

      const response = await fetch('/api/community/reviews', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setReviewForm({
          placeName: '',
          reviewText: '',
          rating: 5,
          photo: null,
          latitude: null,
          longitude: null
        });
        await loadFeed(user.id);
        await loadUserStats(user.id);
        await loadRewards(user.id);
        alert('Review posted successfully!');
      }
    } catch (error) {
      console.error('Failed to post review:', error);
      alert('Failed to post review. Please try again.');
    } finally {
      setPostingReview(false);
    }
  };

  const claimReward = async (rewardId: number) => {
    const upiId = prompt('Enter your UPI ID to receive the voucher:');
    if (!upiId) return;

    try {
      const response = await fetch('/api/community/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId, upiId }),
      });

      if (response.ok) {
        alert('Reward claimed successfully! Voucher will be credited to your UPI within 24 hours.');
        await loadRewards(user!.id);
      }
    } catch (error) {
      console.error('Claim reward failed:', error);
      alert('Failed to claim reward. Please try again.');
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReviewForm(prev => ({ ...prev, photo: file }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setReviewForm(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const filteredUsers = selectedInterests.length === 0 
    ? discoverUsers 
    : discoverUsers.filter(user => 
        user.interests.some(interest => selectedInterests.includes(interest))
      );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

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
                  Raahi Community
                </h1>
              </Link>
            </div>
            <Link to="/" className="text-amber-700 hover:text-amber-900">
              <ArrowLeft className="w-5 h-5 inline mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: 'upload', label: 'Share Experience', icon: Plus },
            { id: 'discover', label: 'Discover People', icon: Users },
            { id: 'rewards', label: 'My Rewards', icon: Trophy }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-8">
            {/* Upload Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
              <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center">
                <Plus className="w-6 h-6 mr-3 text-amber-500" />
                Share Your Travel Experience
              </h2>
              
              <form onSubmit={(e) => { e.preventDefault(); handlePostReview(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="placeName" className="block text-sm font-medium text-amber-700 mb-2">
                      Place Name *
                    </label>
                    <input
                      type="text"
                      id="placeName"
                      value={reviewForm.placeName}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, placeName: e.target.value }))}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="e.g., Taj Mahal, Delhi"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-amber-700 mb-2">
                      Rating *
                    </label>
                    <select
                      id="rating"
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, rating: parseInt(e.target.value, 10) }))}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      {[5,4,3,2,1].map(num => (
                        <option key={num} value={num}>
                          {num} Star{num !== 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="reviewText" className="block text-sm font-medium text-amber-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    id="reviewText"
                    value={reviewForm.reviewText}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, reviewText: e.target.value }))}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={6}
                    placeholder="Share your experience, tips, and recommendations..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-amber-700 mb-2">
                    Photo (Optional)
                  </label>
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="block w-full text-sm text-amber-900 border border-amber-300 rounded-lg cursor-pointer bg-amber-50 focus:outline-none file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-white hover:file:bg-amber-600"
                  />
                  {reviewForm.photo && (
                    <p className="mt-2 text-sm text-amber-600">
                      Selected: {reviewForm.photo.name}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Add Location</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={postingReview}
                    className="flex items-center space-x-2 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {postingReview ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Share Experience</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Recent Reviews Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
              <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-amber-500" />
                Recent Community Reviews
              </h3>
              
              {feed.length === 0 ? (
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-amber-900 mb-2">No reviews yet</h4>
                  <p className="text-amber-700">Be the first to share your travel experiences!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {feed.slice(0, 4).map((review) => (
                    <div key={review.id} className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {review.first_name[0]}{review.last_name[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-amber-900">
                              {review.first_name} {review.last_name}
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="w-4 h-4 text-amber-500" />
                            <span className="font-medium text-amber-900">{review.place_name}</span>
                          </div>
                          
                          {review.photo_url && (
                            <img 
                              src={review.photo_url} 
                              alt={review.place_name}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                          )}
                          
                          <p className="text-amber-800 text-sm line-clamp-3">{review.review_text}</p>
                          
                          <div className="text-xs text-amber-500 mt-2">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Discover People Tab */}
        {activeTab === 'discover' && (
          <div className="space-y-8">
            {/* Interest Filters */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
              <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center">
                <Compass className="w-6 h-6 mr-3 text-amber-500" />
                Discover Like-Minded Travelers
              </h2>
              
              <p className="text-amber-700 mb-6">
                Select your interests to find travelers who share your passion
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      selectedInterests.includes(interest.id)
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-amber-200 hover:border-amber-300 text-amber-700'
                    }`}
                  >
                    <interest.icon className={`w-8 h-8 mb-2 ${interest.color}`} />
                    <span className="text-sm font-medium text-center">{interest.label}</span>
                  </button>
                ))}
              </div>
              
              {selectedInterests.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-amber-600 mb-2">
                    Showing travelers interested in: {selectedInterests.map(id => 
                      INTERESTS.find(i => i.id === id)?.label
                    ).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* User Discovery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((discoverUser) => (
                <div key={discoverUser.id} className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {discoverUser.first_name[0]}{discoverUser.last_name[0]}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-amber-900">
                            {discoverUser.first_name} {discoverUser.last_name}
                          </h3>
                          <p className="text-sm text-amber-600">@{discoverUser.username}</p>
                        </div>
                        
                        {user && discoverUser.id !== user.id && (
                          <button
                            onClick={() => handleFollow(discoverUser.id, discoverUser.is_following ? 'unfollow' : 'follow')}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              discoverUser.is_following 
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                                : 'bg-amber-500 text-white hover:bg-amber-600'
                            }`}
                          >
                            {discoverUser.is_following ? (
                              <>
                                <UserMinus className="w-3 h-3" />
                                <span>Unfollow</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-3 h-3" />
                                <span>Follow</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      
                      {discoverUser.bio && (
                        <p className="text-amber-700 text-sm mb-3">{discoverUser.bio}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-amber-600 mb-3">
                        <span>{discoverUser.review_count} reviews</span>
                        <span>{discoverUser.follower_count} followers</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {discoverUser.interests.slice(0, 3).map((interestId) => {
                          const interest = INTERESTS.find(i => i.id === interestId);
                          return interest ? (
                            <span key={interestId} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                              <interest.icon className="w-3 h-3 mr-1" />
                              {interest.label}
                            </span>
                          ) : null;
                        })}
                        {discoverUser.interests.length > 3 && (
                          <span className="text-xs text-amber-500">
                            +{discoverUser.interests.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-amber-100 text-center">
                <Users className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-amber-900 mb-2">No travelers found</h3>
                <p className="text-amber-700">Try selecting different interests to discover more people!</p>
              </div>
            )}
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="space-y-8">
            {/* Progress Overview */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
              <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3 text-amber-500" />
                Your Reward Progress
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-900">{userStats.totalReviews}</p>
                      <p className="text-sm text-amber-600">Total Reviews</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-900">{userStats.reviewsThisMonth}</p>
                      <p className="text-sm text-blue-600">This Month</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-900">{userStats.nextRewardAt - (userStats.totalReviews % 10)}</p>
                      <p className="text-sm text-green-600">Reviews to Next Reward</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-amber-600 mb-2">
                  <span>Progress to next reward</span>
                  <span>{userStats.totalReviews % 10}/10 reviews</span>
                </div>
                <div className="w-full bg-amber-100 rounded-full h-3">
                  <div 
                    className="bg-amber-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((userStats.totalReviews % 10) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Rewards List */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
              <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center">
                <Gift className="w-5 h-5 mr-2 text-amber-500" />
                Your Rewards & Achievements
              </h3>
              
              {rewards.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-amber-900 mb-2">No rewards yet</h4>
                  <p className="text-amber-700">Start reviewing places to earn vouchers and unlock achievements!</p>
                  <div className="mt-6 bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <p className="text-sm text-amber-700">
                      <strong>How it works:</strong> Get exciting rewards for every 10 reviews you post. 
                      Share your genuine travel experiences and help fellow travelers!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                            <Award className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-amber-900 text-lg">{reward.description}</h4>
                            <p className="text-sm text-amber-600">
                              {reward.voucher_amount ? `₹${reward.voucher_amount} voucher` : 'Achievement unlocked'}
                            </p>
                            <p className="text-xs text-amber-500 mt-1">
                              Earned on {new Date(reward.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {reward.status === 'pending' && reward.voucher_code && user && (
                          <button
                            onClick={() => claimReward(reward.id)}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                          >
                            Claim ₹{reward.voucher_amount}
                          </button>
                        )}
                        
                        {reward.status === 'claimed' && (
                          <div className="text-green-600 font-medium flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>Claimed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}