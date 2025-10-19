DROP DATABASE IF EXISTS pathdatabase;
CREATE DATABASE pathdatabase
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE pathdatabase;

-- Users
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
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
    height VARCHAR(50) NOT NULL,                 -- keep as VARCHAR per your current choice
    phone_number VARCHAR(50) NOT NULL UNIQUE,    -- global unique per your current choice
    CONSTRAINT fk_user_information_user
      FOREIGN KEY (user_id) REFERENCES user(id)
      ON DELETE CASCADE
) ENGINE=InnoDB;

-- Driver (owned by a user)
CREATE TABLE driver (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate VARCHAR(50) NOT NULL UNIQUE,
    car_type VARCHAR(100) NOT NULL,

) ENGINE=InnoDB;

-- ✅ Self-referential contacts (Option A)
CREATE TABLE user_contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,             -- owner of the contact list
    contact_user_id INT NOT NULL,     -- another existing user
    label VARCHAR(100) NULL,
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_contact_owner  FOREIGN KEY (user_id)        REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_contact_friend FOREIGN KEY (contact_user_id) REFERENCES user(id) ON DELETE CASCADE,

    -- prevent duplicate pairs
    UNIQUE KEY uq_user_contact_pair (user_id, contact_user_id)
) ENGINE=InnoDB;

CREATE TABLE trip {
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,            
  origin VARCHAR(50) NOT NULL UNIQUE,
  destination VARCHAR(50) NOT NULL UNIQUE,
  driver_id INT,
  mode ENUM('DRIVING','WALKING', "BICYCLING",'TRANSIT') NOT NULL,
    CONSTRAINT fk_trip
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE

}

CREATE TABLE nodes {
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,       

}



-- (Optional, if your MySQL enforces CHECK constraints; otherwise see trigger below)
-- ALTER TABLE user_contact
--   ADD CONSTRAINT chk_not_self CHECK (user_id <> contact_user_id);

-- If your MySQL ignores CHECKs, use this trigger to block self-contacts:
DELIMITER //
CREATE TRIGGER trg_user_contact_not_self
BEFORE INSERT ON user_contact
FOR EACH ROW
BEGIN
  IF NEW.user_id = NEW.contact_user_id THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A user cannot add themselves as a contact.';
  END IF;
END//
DELIMITER ;
