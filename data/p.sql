
DROP DATABASE IF EXISTS pathdatabase;
CREATE DATABASE pathdatabase
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE pathdatabase;

-- Users
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- User profile / info
CREATE TABLE user_information (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('M','F','Other') NOT NULL,
    height VARCHAR(50) NOT NULL,      -- or DECIMAL(5,2) if you prefer numeric
    phone_number VARCHAR(50) NOT NULL UNIQUE,
--     image VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user_information_user
      FOREIGN KEY (user_id) REFERENCES user(id)
      ON DELETE CASCADE
) ENGINE=InnoDB;

-- Driver (owned by a user)
CREATE TABLE driver (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate VARCHAR(50) NOT NULL UNIQUE,
    car_type VARCHAR(100) NOT NULL,
    user_id INT,
    CONSTRAINT fk_driver_user
      FOREIGN KEY (user_id) REFERENCES user(id)
      ON DELETE CASCADE
) ENGINE=InnoDB;

-- Emergency contacts (lowercase, consistent naming)
CREATE TABLE emergency_contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    -- allow same phone across different users, but prevent duplicates per user:
    UNIQUE KEY uq_user_contact_phone (user_id, contact_phone),
    CONSTRAINT fk_emergency_contact_user
      FOREIGN KEY (user_id) REFERENCES user(id)
      ON DELETE CASCADE
) ENGINE=InnoDB;
