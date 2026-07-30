-- Multiline Promotional V2 — MySQL schema
-- Import this file via hPanel > Databases > phpMyAdmin, or:
--   mysql -u USERNAME -p DATABASE_NAME < db/schema.sql

CREATE DATABASE IF NOT EXISTS multiline_promotional
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE multiline_promotional;

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  tagline VARCHAR(255) DEFAULT NULL,
  description TEXT NOT NULL,
  banner_image VARCHAR(255) DEFAULT NULL,
  featured_image VARCHAR(255) DEFAULT NULL,
  icon_name VARCHAR(100) DEFAULT NULL,
  status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  featured_on_homepage BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  category_id VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT DEFAULT NULL,
  image VARCHAR(2048) DEFAULT NULL,
  images JSON DEFAULT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  min_order INT NOT NULL DEFAULT 1,
  specs JSON DEFAULT NULL,
  price_inquiry_note TEXT DEFAULT NULL,
  seo_title VARCHAR(255) DEFAULT NULL,
  seo_description TEXT DEFAULT NULL,
  created_date DATE DEFAULT NULL,
  updated_date DATE DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_category_id (category_id),
  CONSTRAINT fk_products_category_id
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quotes (
  id VARCHAR(100) NOT NULL,
  quote_date VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  org VARCHAR(255) DEFAULT NULL,
  date_needed VARCHAR(50) DEFAULT NULL,
  city VARCHAR(100) DEFAULT NULL,
  comm_pref VARCHAR(50) NOT NULL,
  extra_details TEXT DEFAULT NULL,
  status ENUM('Pending','Reviewed','Contacted','Completed') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quote_items (
  id INT NOT NULL AUTO_INCREMENT,
  quote_id VARCHAR(100) NOT NULL,
  product_id VARCHAR(100) DEFAULT NULL,
  quantity INT NOT NULL DEFAULT 1,
  customization_notes TEXT DEFAULT NULL,
  product_snapshot JSON DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_quote_items_quote_id (quote_id),
  KEY idx_quote_items_product_id (product_id),
  CONSTRAINT fk_quote_items_quote_id
    FOREIGN KEY (quote_id) REFERENCES quotes (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_quote_items_product_id
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(100) NOT NULL,
  message_date VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) DEFAULT NULL,
  message TEXT NOT NULL,
  status ENUM('Unread','Read','Replied') NOT NULL DEFAULT 'Unread',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed the 4 default categories so the Admin Panel and homepage have data
-- immediately after import (matches the categories the UI expects).
INSERT INTO categories (id, title, slug, tagline, description, icon_name, status, featured_on_homepage, sort_order)
VALUES
  ('Awards & Metal Crafts', 'Awards & Metal Crafts', 'awards-metal-crafts', 'Premium trophies, medals, and lapel pins', 'Honoring achievements with beautifully crafted metallic awards, custom embossed medals, and exquisite commemorative pins.', 'Award', 'Active', TRUE, 1),
  ('Wooden Creatives', 'Wooden Creatives', 'wooden-creatives', 'Distinguished handcrafted wooden items', 'Combining raw natural elegance with precise laser engraving for high-end corporate shields, shadowboxes, and clocks.', 'Trees', 'Active', TRUE, 2),
  ('Apparel & Caps', 'Apparel & Caps', 'apparel-caps', 'Custom corporate clothing & custom headwear', 'Premium cotton caps, custom embroidery, and high-quality team wear that carries your corporate identity with pride.', 'Shirt', 'Active', TRUE, 3),
  ('Corporate Gifts', 'Corporate Gifts', 'corporate-gifts', 'Sophisticated luxury giveaways', 'Elite presentation watches, LED wooden clocks, metal presentation trays, and personalized executive gifts.', 'Gift', 'Active', TRUE, 4)
ON DUPLICATE KEY UPDATE title = VALUES(title);
