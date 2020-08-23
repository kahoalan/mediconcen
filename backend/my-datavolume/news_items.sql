--
-- Table structure for table items
--

DROP TABLE IF EXISTS clinic_users;
DROP TABLE IF EXISTS clinic_records;
DROP TABLE IF EXISTS clinics;

CREATE TABLE clinics (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  address varchar(255),
  phone_number varchar(255),
  PRIMARY KEY (id)
);

CREATE TABLE clinic_users (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  clinic_id int NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT u_clinic_users_email UNIQUE (email),
  CONSTRAINT fk_clinic_user_clinic_id FOREIGN KEY (clinic_id) REFERENCES clinics(id)
);

CREATE TABLE clinic_records (
  id int NOT NULL AUTO_INCREMENT,
  clinic_id int,
  doctor varchar(255) NOT NULL,
  patient varchar(255) NOT NULL,
  diagnosis varchar(255),
  medication varchar(255),
  consultation_fee FLOAT,
  date_time datetime NOT NULL,
  follow_up bit NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  CONSTRAINT fk_clinic_records_clinic_id FOREIGN KEY (clinic_id) REFERENCES clinics(id)
);