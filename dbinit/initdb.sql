create database Joe;
use Joe;
CREATE TABLE action
(
  id int NOT NULL AUTO_INCREMENT,
  ota varchar(255),
  pickup varchar(255),
  booking_date datetime,
  PRIMARY KEY (id)
);

CREATE TABLE ota
(
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255),
  description varchar(255),
  PRIMARY KEY (id)
)
