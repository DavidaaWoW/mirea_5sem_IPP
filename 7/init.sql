CREATE DATABASE IF NOT EXISTS IPP7;
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'password';
GRANT SELECT,UPDATE,INSERT ON RSCHIR.* TO 'user'@'%';
FLUSH PRIVILEGES;

USE IPP7;
CREATE TABLE IF NOT EXISTS brand (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS car (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  price FLOAT,
  age INT,
  brandId INT(11),
  PRIMARY KEY (id)
);

INSERT INTO brand (name)
SELECT * FROM (SELECT 'audi') AS tmp
WHERE NOT EXISTS (
    SELECT name FROM brand WHERE name = 'audi'
) LIMIT 1;

INSERT INTO brand (name)
SELECT * FROM (SELECT 'bmw') AS tmp
WHERE NOT EXISTS (
    SELECT name FROM brand WHERE name = 'bmw'
) LIMIT 1;

INSERT INTO car (name, price, age, brandId)
SELECT * FROM (SELECT 'Audi Q7', 6.3, 2022, 1) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM car WHERE name = 'Audi Q7' AND price = 6.3 AND age = 2022 AND brandId = 1
) LIMIT 1;

INSERT INTO car (name, price, age, brandId)
SELECT * FROM (SELECT 'Audi A3', 2.7, 2022, 1) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM car WHERE name = 'Audi A3' AND price = 2.7 AND age = 2022 AND brandId = 1
) LIMIT 1;

INSERT INTO car (name, price, age, brandId)
SELECT * FROM (SELECT 'BMW X7', 9.3, 2022, 2) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM car WHERE name = 'BMW X7' AND price = 9.3 AND age = 2022 AND brandId = 2
) LIMIT 1;

INSERT INTO car (name, price, age, brandId)
SELECT * FROM (SELECT 'BMW 128I', 2.2, 2010, 2) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM car WHERE name = 'BMW 128I' AND price = 2.2 AND age = 2010 AND brandId = 2
) LIMIT 1;