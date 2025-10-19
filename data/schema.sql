
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

-- A user can add another user as a contact
CREATE TABLE user_contact (
  user_id INT NOT NULL,
  contact_user_id INT NOT NULL,
  label VARCHAR(100) NULL,
  is_emergency BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, contact_user_id),
  CONSTRAINT fk_uc_user     FOREIGN KEY (user_id)        REFERENCES user(id) ON DELETE CASCADE,
  CONSTRAINT fk_uc_contact  FOREIGN KEY (contact_user_id) REFERENCES user(id) ON DELETE CASCADE,
  CONSTRAINT chk_not_self CHECK (user_id <> contact_user_id)
) ENGINE=InnoDB;

