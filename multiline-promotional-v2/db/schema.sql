-- PostgreSQL-compatible schema for Multiline Promotional V2

-- NOTE: Create the database separately (Render provides the DATABASE_URL).

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  tagline VARCHAR(255),
  description TEXT NOT NULL,
  banner_image VARCHAR(255),
  featured_image VARCHAR(255),
  icon_name VARCHAR(100),
  status VARCHAR(32) NOT NULL DEFAULT 'Active',
  featured_on_homepage BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  category_id VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  image VARCHAR(2048),
  images JSONB,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(32) NOT NULL DEFAULT 'Active',
  min_order INT NOT NULL DEFAULT 1,
  specs JSONB,
  price_inquiry_note TEXT,
  seo_title VARCHAR(255),
  seo_description VARCHAR(255),
  created_date DATE,
  updated_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category_id FOREIGN KEY (category_id) REFERENCES categories (id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS quotes (
  id VARCHAR(100) PRIMARY KEY,
  quote_date VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  org VARCHAR(255),
  date_needed VARCHAR(50),
  city VARCHAR(100),
  comm_pref VARCHAR(50) NOT NULL,
  extra_details TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quote_items (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quote_id VARCHAR(100) NOT NULL,
  product_id VARCHAR(100),
  quantity INT NOT NULL DEFAULT 1,
  customization_notes TEXT,
  product_snapshot JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quote_items_quote_id FOREIGN KEY (quote_id) REFERENCES quotes (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_quote_items_product_id FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(100) PRIMARY KEY,
  message_date VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Unread',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to update updated_at on row modification
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_categories
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_products
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_quotes
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_quote_items
  BEFORE UPDATE ON quote_items
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_messages
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Seed default categories (id is used as the primary key)
INSERT INTO categories (id, title, slug, tagline, description, icon_name, status, featured_on_homepage, sort_order)
VALUES
  ('Awards & Metal Crafts', 'Awards & Metal Crafts', 'awards-metal-crafts', 'Premium trophies, medals, and lapel pins', 'Honoring achievements with beautifully crafted metallic awards, custom embossed medals, and exquisite commemorative pins.', 'Award', 'Active', TRUE, 1),
  ('Wooden Creatives', 'Wooden Creatives', 'wooden-creatives', 'Distinguished handcrafted wooden items', 'Combining raw natural elegance with precise laser engraving for high-end corporate shields, shadowboxes, and clocks.', 'Trees', 'Active', TRUE, 2),
  ('Apparel & Caps', 'Apparel & Caps', 'apparel-caps', 'Custom corporate clothing & custom headwear', 'Premium cotton caps, custom embroidery, and high-quality team wear that carries your corporate identity with pride.', 'Shirt', 'Active', TRUE, 3),
  ('Corporate Gifts', 'Corporate Gifts', 'corporate-gifts', 'Sophisticated luxury giveaways', 'Elite presentation watches, LED wooden clocks, metal presentation trays, and personalized executive gifts.', 'Gift', 'Active', TRUE, 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
