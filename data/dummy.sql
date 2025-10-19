-- USERS
INSERT INTO user (name, email, password) VALUES
  ('tristan', 'tristan@example.com', 'hashed_pw_1'),
  ('alia',    'alia@example.com',    'hashed_pw_2'),
  ('raheem',  'raheem@example.com',  'hashed_pw_3'),
  ('nita',    'nita@example.com',    'hashed_pw_4'),
  ('max',     'max@example.com',     'hashed_pw_5'),
  ('carlyon', 'carlyon@example.com', 'hashed_pw_6');

-- USER INFORMATION (assumes IDs 1..6 given in order above)
INSERT INTO user_information (user_id, date_of_birth, gender, height, phone_number) VALUES
  (1, '1997-03-12', 'M',     '178cm', '876-555-0101'),
  (2, '1999-11-05', 'F',     '165cm', '876-555-0102'),
  (3, '1996-07-21', 'M',     '183.5cm','876-555-0103'),
  (4, '1998-04-02', 'F',     '170.2cm','876-555-0104'),
  (5, '2000-12-30', 'Other', '174cm',  '876-555-0105'),
  (6, '1998-09-14', 'M',     '181.75cm','876-555-0106');

-- DRIVERS
INSERT INTO driver (plate, car_type, user_id) VALUES
  ('1234JK', 'Sedan', 1),
  ('5678LM', 'SUV',   2),
  ('P123XY', 'Hatch', 4);

-- SELF-REFERENTIAL CONTACTS
-- (user_id adds contact_user_id)
INSERT INTO user_contact (user_id, contact_user_id, label, is_emergency) VALUES
  (1, 2, 'Teammate',         FALSE),
  (1, 4, 'Sister-in-law',    FALSE),
  (1, 6, 'Primary Contact',  TRUE),

  (2, 1, 'Buddy',            FALSE),
  (2, 3, 'Coworker',         FALSE),

  (3, 1, 'Gym Partner',      FALSE),
  (3, 5, 'Neighbor',         FALSE),

  (4, 2, 'Study Group',      FALSE),

  (5, 6, 'On-call',          TRUE),

  (6, 1, 'Emergency Backup', TRUE);
