-- Seed Data for BuildSafe Nigeria

-- Standard Profiles
-- Note: Replace with real UUIDs from your Auth table if testing manually
-- These are placeholders for the SQL editor

INSERT INTO profiles (id, full_name, role, location, phone)
VALUES 
('d5e1b2c4-a1b2-c3d4-e5f6-g7h8i9j0k1l2', 'Tunde Folawiyo', 'client', 'London, UK', '+447911122233'),
('e6f2c3d4-b2c3-d4e5-f6g7-h8i9j0k1l2m3', 'Chioma Adebayo', 'builder', 'Lekki, Lagos', '+2348011223344');

INSERT INTO builders (id, bio, status, specialties, rating)
VALUES
('e6f2c3d4-b2c3-d4e5-f6g7-h8i9j0k1l2m3', 'Specialist in modern duplexes and sustainable materials.', 'verified', ARRAY['Residential', 'Solar Integration'], 4.9);

INSERT INTO projects (title, client_id, builder_id, budget, status, location)
VALUES
('Modern 5 Bedroom Villa', 'd5e1b2c4-a1b2-c3d4-e5f6-g7h8i9j0k1l2', 'e6f2c3d4-b2c3-d4e5-f6g7-h8i9j0k1l2m3', 85000000, 'in_progress', 'Epe, Lagos');
