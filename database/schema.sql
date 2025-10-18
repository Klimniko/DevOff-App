-- Commission Calculator Database Schema
CREATE DATABASE IF NOT EXISTS commission_calculator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE commission_calculator;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS calculations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  project_name VARCHAR(150) NOT NULL,
  project_description TEXT,
  buying_price_usd DECIMAL(10,2) NOT NULL,
  selling_price_eur DECIMAL(10,2) NOT NULL,
  exchange_rate DECIMAL(10,6) NOT NULL,
  commission_eur DECIMAL(10,2) NOT NULL,
  working_days INT NOT NULL,
  calculation_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_calculations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_calculations_user_date ON calculations(user_id, calculation_date);
CREATE INDEX idx_calculations_user_commission ON calculations(user_id, commission_eur);
CREATE INDEX idx_calculations_user_project ON calculations(user_id, project_name);

INSERT INTO users (username, password) VALUES
  ('kliment', '$2b$12$jMjS7PnycIKzuqxbmTgmcOvkWGvVXkhe48CGyutN/cbxu8yzMWiFC'),
  ('hugo', '$2b$12$IF.jgZCRsnm9HlEpddeGiO3zikl6m4bQrLUZW3Np9I1lXSRuubF2u'),
  ('arnaud', '$2b$12$6u5A5UHDDrygtO736hw0me/pPC/bywtJWPKQloHKsTScaY4flefu2')
ON DUPLICATE KEY UPDATE password = VALUES(password);
