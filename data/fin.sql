-- ─────────────────────────────────────────────────────────────────────────────
-- Recreate DB
-- ─────────────────────────────────────────────────────────────────────────────
DROP DATABASE IF EXISTS pathdatabase;
CREATE DATABASE pathdatabase
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE pathdatabase;

-- ─────────────────────────────────────────────────────────────────────────────
-- Users
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE user (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(50)  NOT NULL,
  password   VARCHAR(255) NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE user_information (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT         NOT NULL,
  date_of_birth DATE        NOT NULL,
  gender        ENUM('M','F','Other') NOT NULL,
  height        VARCHAR(50) NOT NULL,
  phone_number  VARCHAR(50) NOT NULL UNIQUE,
  CONSTRAINT fk_user_information_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────────────
-- Driver
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE driver (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  plate      VARCHAR(50)  NOT NULL UNIQUE,
  car_type   VARCHAR(100) NOT NULL,
  user_id    INT          NULL,
  date       DATETIME     NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_driver_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────────────
-- Self-referential Contacts
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE user_contact (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT          NOT NULL,
  contact_user_id  INT          NOT NULL,
  label            VARCHAR(100) NULL,
  is_emergency     BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_contact_owner   FOREIGN KEY (user_id)         REFERENCES user(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_contact_friend  FOREIGN KEY (contact_user_id) REFERENCES user(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_contact_pair (user_id, contact_user_id)
) ENGINE=InnoDB;

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

-- ─────────────────────────────────────────────────────────────────────────────
-- Route Clusters (crowd baseline)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE route_cluster (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  origin_hash    VARCHAR(24) NOT NULL,
  dest_hash      VARCHAR(24) NOT NULL,
  geohashes_json JSON        NOT NULL,   -- use TEXT if your MySQL lacks JSON
  trips_count    INT         NOT NULL DEFAULT 0,
  status         ENUM('UNUSUAL','NORMAL') NOT NULL DEFAULT 'UNUSUAL',
  last_seen      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_od (origin_hash, dest_hash)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────────────
-- Trips (numeric coordinates + clustering fields)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE trip (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT  NOT NULL,

  origin_lat    DECIMAL(9,6) NOT NULL,
  origin_lng    DECIMAL(9,6) NOT NULL,
  dest_lat      DECIMAL(9,6) NOT NULL,
  dest_lng      DECIMAL(9,6) NOT NULL,

  mode          ENUM('DRIVING','WALKING','BICYCLING','TRANSIT') NOT NULL,
  route_polyline TEXT NOT NULL,
  eta_sec       INT  NOT NULL,
  distance_m    INT  NOT NULL,

  status        ENUM('REQUESTED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'REQUESTED',
  started_at    DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at      DATETIME            NULL,

  cluster_id    INT       NULL,
  cluster_sim   DECIMAL(4,3) NULL,
  risk_level    ENUM('NORMAL','UNUSUAL','RISKY') NULL,
  alert_sent    BOOLEAN   NOT NULL DEFAULT FALSE,

  CONSTRAINT fk_trip_user    FOREIGN KEY (user_id)    REFERENCES user(id)          ON DELETE CASCADE,
  CONSTRAINT fk_trip_cluster FOREIGN KEY (cluster_id) REFERENCES route_cluster(id) ON DELETE SET NULL,

  INDEX idx_trip_user (user_id, started_at),
  INDEX idx_trip_cluster (cluster_id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────────────
-- Trip Points (GPS pings)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE trip_point (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  trip_id     INT          NOT NULL,
  lat         DECIMAL(9,6) NOT NULL,
  lng         DECIMAL(9,6) NOT NULL,
  recorded_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_point_trip FOREIGN KEY (trip_id) REFERENCES trip(id) ON DELETE CASCADE,
  INDEX idx_trip_point_trip_id (trip_id),
  INDEX idx_point_trip_time (trip_id, recorded_at)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────────────
-- Optional: seed a user so foreign keys work immediately
-- ─────────────────────────────────────────────────────────────────────────────
-- INSERT INTO user (id, name, password, email)
-- VALUES (1, 'Carlyon', '$2b$12$devOnlyHash', 'carlyon@example.com');
-- INSERT INTO user_information (user_id, date_of_birth, gender, height, phone_number)
-- VALUES (1, '2000-01-01', 'M', '180cm', '876-844-5789');
