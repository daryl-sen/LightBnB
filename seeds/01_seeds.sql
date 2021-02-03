INSERT INTO users (name, email, password)
VALUES ('userone', 'user1@1.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('usertwo', 'user2@1.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('userthree', 'user3@1.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Home in a box', 'Compact urban living space with plenty of outdoor elements.', '', '', 100, 10, 0, 0, 'Canada', 'Meadows Rd', 'Vancouver', 'BC', 'V5A', TRUE),
(2, 'Connect with nature', 'Connect with nature, free water but no electricity.', '', '', 5, 1, 0, 0, 'Canada', 'Wilderness Rd', 'Vancouver', 'BC', 'V5A', TRUE),
(2, 'Dream house', 'Apartment with no view.', '', '', 150, 0, 1, 1, 'Canada', 'Faraway Ave', 'Vancouver', 'BC', 'V5A', TRUE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2021-01-05', '2021-01-05', 1, 3),
('2021-01-06', '2021-01-06', 2, 3),
('2021-01-06', '2021-01-06', 3, 2),
('2021-01-07', '2021-01-10', 3, 3),
('2021-01-11', '2021-01-30', 3, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (3, 1, 1, 0, 'This was just a cardboard box. 0 stars.'),
(3, 2, 2, 0, 'This was just a piece of land with no buildings on it. Never going there again.'),
(2, 3, 3, 3, 'Nowhere near dream house but good enough.'),
(3, 3, 4, 5, 'Finally a real place that I could live in, my expectations are low at this point.'),
(1, 3, 5, 5, 'Im never gonna leave this place');