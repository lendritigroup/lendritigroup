-- Lendriti Group Marketplace Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users table (link auth.users to admin role)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories with multilingual names
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  name_sq TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_de TEXT NOT NULL,
  name_sr TEXT NOT NULL,
  name_mk TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products with full multilingual support
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  subcategory_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  vehicle_type TEXT CHECK (vehicle_type IN ('TRUCK', 'EXCAVATOR', 'PART', 'ATTACHMENT', 'SERVICE')),
  title_sq TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_de TEXT NOT NULL,
  title_sr TEXT NOT NULL,
  title_mk TEXT NOT NULL,
  description_sq TEXT,
  description_en TEXT,
  description_de TEXT,
  description_sr TEXT,
  description_mk TEXT,
  price DECIMAL(12,2),
  price_negotiable BOOLEAN DEFAULT false,
  price_on_request BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'SOLD')),
  sold_at TIMESTAMPTZ,
  year INTEGER,
  brand TEXT,
  model TEXT,
  hours INTEGER,
  km INTEGER,
  condition TEXT CHECK (condition IN ('new', 'used')),
  location TEXT,
  whatsapp TEXT,
  specs JSONB DEFAULT '{}',
  soft_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_soft_deleted ON products(soft_deleted) WHERE soft_deleted = false;
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Product photos
CREATE TABLE IF NOT EXISTS product_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_photos_product ON product_photos(product_id);

-- Pages (About content - multilingual)
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  content_sq TEXT,
  content_en TEXT,
  content_de TEXT,
  content_sr TEXT,
  content_mk TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_status ON contact_messages(status);

-- RLS Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read for categories, products, photos, pages
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (soft_deleted = false);
CREATE POLICY "Public read product_photos" ON product_photos FOR SELECT USING (true);
CREATE POLICY "Public read pages" ON pages FOR SELECT USING (true);

-- Public insert for contact_messages
CREATE POLICY "Public insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Admin policies (use service role or check admin_users)
-- For RLS with auth, we need a function to check admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Admin can do everything on products, categories, pages, photos
CREATE POLICY "Admin all products" ON products FOR ALL USING (is_admin());
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (is_admin());
CREATE POLICY "Admin all product_photos" ON product_photos FOR ALL USING (is_admin());
CREATE POLICY "Admin all pages" ON pages FOR ALL USING (is_admin());

-- Admin can read/update contact_messages
CREATE POLICY "Admin read contact_messages" ON contact_messages FOR SELECT USING (is_admin());
CREATE POLICY "Admin update contact_messages" ON contact_messages FOR UPDATE USING (is_admin());

-- Admin users: only admins can manage
CREATE POLICY "Admin read admin_users" ON admin_users FOR SELECT USING (is_admin());
CREATE POLICY "Admin insert admin_users" ON admin_users FOR INSERT WITH CHECK (is_admin());

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: public read
CREATE POLICY "Public read product images" ON storage.objects 
FOR SELECT USING (bucket_id = 'product-images');

-- Storage policy: authenticated (admin) upload
CREATE POLICY "Admin upload product images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
