USE Data;

INSERT INTO Users (username, password, email, gender, height, phone_number, image)
VALUES
 ('tristan', 'hashed_pw_1', 'tristan@example.com', 'Male', '178cm', '876-555-0101', '/img/tristan.jpg'),
 ('alia', 'hashed_pw_2', 'alia@example.com', 'Female', '165cm', '876-555-0102', '/img/alia.jpg');

INSERT INTO Drivers (plate, car_type, user_id)
VALUES
 ('1234JK', 'Sedan', 1),
 ('5678LM', 'SUV',   2);

INSERT INTO Emergency_Contacts (user_id, display_name, contact_phone)
VALUES
 (1, 'Mom',  '876-555-0201'),
 (1, 'Dad',  '876-555-0202'),
 (2, 'Sister','876-555-0203');
