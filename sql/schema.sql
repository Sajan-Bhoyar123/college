-- Create database and schools table
CREATE DATABASE IF NOT EXISTS school_db;
USE school_db;

CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  UNIQUE KEY uq_school_name_addr (name, address),
  INDEX idx_schools_lat (latitude),
  INDEX idx_schools_lon (longitude)
);

-- Optional seed data
INSERT INTO schools (name, address, latitude, longitude) VALUES
('Alpha Public School', 'Main Street 1', 28.6139, 77.2090),
('Beta International', 'Second Avenue 22', 19.0760, 72.8777),
('Gamma High', 'Third Road 5', 13.0827, 80.2707);



