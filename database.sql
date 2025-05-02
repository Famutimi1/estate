-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'admin', 'agent')) DEFAULT 'user'
);

-- Create properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title VARCHAR(255) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  price_type VARCHAR(10) NOT NULL CHECK (price_type IN ('sale', 'rent')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('FOR SALE', 'FOR RENT', 'SOLD', 'RENTED')),
  address VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  area DECIMAL(10, 2) NOT NULL,
  area_unit VARCHAR(20) NOT NULL,
  property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('house', 'apartment', 'villa', 'commercial', 'land')),
  location VARCHAR(100) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  images TEXT[] NULL,
  featured_image_index INTEGER NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  garage_spaces INTEGER NULL,
  amenities JSONB NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT valid_price CHECK (price > 0),
  CONSTRAINT valid_bedrooms CHECK (bedrooms >= 0),
  CONSTRAINT valid_bathrooms CHECK (bathrooms >= 0),
  CONSTRAINT valid_area CHECK (area > 0)
);

-- Create favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  UNIQUE(user_id, property_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_price_type ON properties(price_type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_property_id ON favorites(property_id);

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add RLS (Row Level Security) policies

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Create policies for properties table
CREATE POLICY "Properties are viewable by everyone" 
  ON properties FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own properties" 
  ON properties FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" 
  ON properties FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" 
  ON properties FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for favorites table
CREATE POLICY "Users can view their own favorites" 
  ON favorites FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own favorites" 
  ON favorites FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own favorites" 
  ON favorites FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);