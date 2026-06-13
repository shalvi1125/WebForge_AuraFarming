
CREATE TABLE heritage_sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  historical_period TEXT,
  location TEXT,
  latitude REAL,
  longitude REAL,
  is_featured BOOLEAN DEFAULT 0,
  model_url TEXT,
  background_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE site_stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  audio_url TEXT,
  position_x REAL,
  position_y REAL,
  position_z REAL,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE site_artifacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  model_url TEXT,
  position_x REAL,
  position_y REAL,
  position_z REAL,
  scale_factor REAL DEFAULT 1.0,
  is_interactive BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_site_stories_site_id ON site_stories(site_id);
CREATE INDEX idx_site_artifacts_site_id ON site_artifacts(site_id);


-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User sessions or additional tables as needed
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);


-- Create user_photos table
CREATE TABLE user_photos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,  -- Stores base64 encoded images
  caption TEXT,
  place_name VARCHAR(255) NOT NULL,
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_photos_user_id ON user_photos(user_id);
CREATE INDEX idx_user_photos_place_name ON user_photos(place_name);

-- Optional: Add a unique constraint to prevent duplicate photos for same user/place
-- ALTER TABLE user_photos ADD CONSTRAINT unique_user_place_photo UNIQUE (user_id, place_name, url);

-- Reviews table for place reviews
CREATE TABLE place_reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  place_name VARCHAR(255) NOT NULL,
  review_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  photo_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User follows table
CREATE TABLE user_follows (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- User rewards/rewards tracking
CREATE TABLE user_rewards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_type VARCHAR(50) NOT NULL, -- 'review_milestone', 'engagement', etc.
  description TEXT NOT NULL,
  voucher_code VARCHAR(100) UNIQUE,
  voucher_amount DECIMAL(10, 2),
  razorpay_payment_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'issued', 'claimed'
  created_at TIMESTAMP DEFAULT NOW(),
  claimed_at TIMESTAMP
);

-- User interests mapping (if not already exists)
CREATE TABLE user_interests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interest VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, interest)
);

-- Indexes
CREATE INDEX idx_place_reviews_user_id ON place_reviews(user_id);
CREATE INDEX idx_place_reviews_place_name ON place_reviews(place_name);
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
CREATE INDEX idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX idx_user_interests_user ON user_interests(user_id);

-- Add these columns to track image metadata
ALTER TABLE user_photos ADD COLUMN file_name TEXT;
ALTER TABLE user_photos ADD COLUMN file_size INTEGER;
ALTER TABLE user_photos ADD COLUMN mime_type TEXT;


-- ... existing tables ...

-- User visited places table
CREATE TABLE user_visited_places (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  place_name VARCHAR(255) NOT NULL,
  visited_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, place_name)
);

-- Create indexes for better performance
CREATE INDEX idx_user_visited_places_user_id ON user_visited_places(user_id);
CREATE INDEX idx_user_visited_places_place_name ON user_visited_places(place_name);

-- ... existing code ...