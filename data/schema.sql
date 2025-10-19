-- Recreate DB
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
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- User profile / info
CREATE TABLE user_information (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender ENUM('M','F','Other') NOT NULL,
  height VARCHAR(50) NOT NULL,                 -- as you preferred
  phone_number VARCHAR(50) NOT NULL UNIQUE,    -- global unique
  CONSTRAINT fk_user_information_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- Driver (owned by a user)  — added user_id and removed stray comma
CREATE TABLE driver (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plate VARCHAR(50) NOT NULL UNIQUE,
  car_type VARCHAR(100) NOT NULL,
  user_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_driver_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- Self-referential contacts (Option A)
CREATE TABLE user_contact (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,             -- owner of the contact list
  contact_user_id INT NOT NULL,     -- another existing user
  label VARCHAR(100) NULL,
  is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_user_contact_owner   FOREIGN KEY (user_id)         REFERENCES user(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_contact_friend  FOREIGN KEY (contact_user_id) REFERENCES user(id) ON DELETE CASCADE,

  -- prevent duplicate pairs
  UNIQUE KEY uq_user_contact_pair (user_id, contact_user_id)
) ENGINE=InnoDB;

-- Trips (fixed parentheses, removed UNIQUE on origin/destination, fixed ENUM quotes, added FKs)
CREATE TABLE trip (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  driver_id INT NULL,
  mode ENUM('DRIVING','WALKING','BICYCLING','TRANSIT') NOT NULL,
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at   DATETIME NULL,

  CONSTRAINT fk_trip_user   FOREIGN KEY (user_id)  REFERENCES user(id)   ON DELETE CASCADE,
  CONSTRAINT fk_trip_driver FOREIGN KEY (driver_id) REFERENCES driver(id) ON DELETE SET NULL,

  INDEX idx_trip_user (user_id, started_at),
  INDEX idx_trip_driver (driver_id, started_at)
) ENGINE=InnoDB;

-- Trip nodes (renamed from `nodes`, added columns; brace -> parentheses)
CREATE TABLE trip_node (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  seq INT NOT NULL,                -- 0..N order if you want it
  lat DECIMAL(9,6) NULL,
  lng DECIMAL(9,6) NULL,
  recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_node_trip FOREIGN KEY (trip_id) REFERENCES trip(id) ON DELETE CASCADE,
  UNIQUE KEY uq_trip_seq (trip_id, seq),
  INDEX idx_node_trip_time (trip_id, recorded_at)
) ENGINE=InnoDB;

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

ALTER TABLE driver ADD COLUMN date DATETIME NULL;

CREATE TABLE route_cluster (
  id INT AUTO_INCREMENT PRIMARY KEY,
  origin_hash VARCHAR(12) NOT NULL,
  dest_hash   VARCHAR(12) NOT NULL,
  geohashes_json JSON NOT NULL,
  trips_count INT NOT NULL DEFAULT 0,
  status ENUM('UNUSUAL','NORMAL') NOT NULL DEFAULT 'UNUSUAL',
  last_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_od (origin_hash, dest_hash)
) ENGINE=InnoDB;

ALTER TABLE route_cluster 
  MODIFY origin_hash VARCHAR(24) NOT NULL,
  MODIFY dest_hash   VARCHAR(24) NOT NULL;

  












  USE pathdatabase;

-- 1) TRIP: add the columns your model expects (keep old origin/destination for now)
ALTER TABLE trip
  ADD COLUMN origin_lat DECIMAL(9,6) NOT NULL AFTER user_id,
  ADD COLUMN origin_lng DECIMAL(9,6) NOT NULL AFTER origin_lat,
  ADD COLUMN dest_lat   DECIMAL(9,6) NOT NULL AFTER origin_lng,
  ADD COLUMN dest_lng   DECIMAL(9,6) NOT NULL AFTER dest_lat,
  ADD COLUMN route_polyline TEXT NOT NULL AFTER mode,
  ADD COLUMN eta_sec INT NOT NULL AFTER route_polyline,
  ADD COLUMN distance_m INT NOT NULL AFTER eta_sec,
  ADD COLUMN status ENUM('REQUESTED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'REQUESTED' AFTER distance_m,
  ADD COLUMN cluster_id INT NULL AFTER ended_at,
  ADD COLUMN cluster_sim DECIMAL(4,3) NULL AFTER cluster_id,
  ADD COLUMN risk_level ENUM('NORMAL','UNUSUAL','RISKY') NULL AFTER cluster_sim,
  ADD COLUMN alert_sent BOOLEAN NOT NULL DEFAULT FALSE AFTER risk_level;

-- add FK to route_cluster (you already created it)
ALTER TABLE trip
  ADD CONSTRAINT fk_trip_cluster FOREIGN KEY (cluster_id) REFERENCES route_cluster(id) ON DELETE SET NULL;

-- optional: once you're sure, drop legacy string columns
-- ALTER TABLE trip DROP COLUMN origin, DROP COLUMN destination;

-- 2) TRIP POINTS: rename trip_node -> trip_point and match the model
RENAME TABLE trip_node TO trip_point;

-- drop seq uniqueness if present (model doesn’t use seq)
ALTER TABLE trip_point
  DROP INDEX uq_trip_seq;

-- make lat/lng required to match model
ALTER TABLE trip_point
  MODIFY lat DECIMAL(9,6) NOT NULL,
  MODIFY lng DECIMAL(9,6) NOT NULL;

-- ensure time index matches model name
DROP INDEX idx_node_trip_time ON trip_point;
CREATE INDEX idx_point_trip_time ON trip_point (trip_id, recorded_at);

-- 3) ROUTE CLUSTER: you already widened hashes to 24 (👍)
-- If your SQL column is JSON, that’s fine. If you prefer TEXT, switch:
-- ALTER TABLE route_cluster MODIFY geohashes_json TEXT NOT NULL;





USE pathdatabase;

-- 1) Ensure a dedicated index exists for the FK column
CREATE INDEX idx_trip_point_trip_id ON trip_point (trip_id);

-- 2) Now you can drop the composite index that was previously satisfying the FK
DROP INDEX idx_node_trip_time ON trip_point;

-- 3) (Optional) Recreate the composite index with your preferred name
CREATE INDEX idx_point_trip_time ON trip_point (trip_id, recorded_at);
