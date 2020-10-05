DROP DATABASE IF EXISTS employee_tracker_DB;

CREATE DATABASE employee_tracker_DB;

USE employee_tracker_DB;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary VARCHAR(30),
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rupert", "McInnes", 11, 101), ("Nelson", "Wong", 12, 101), ("Lisa", "Lionsworth", 13, 101), ("Mick", "Norton", 14, 102), ("Abigail", "Lawrence", 15, 103);

INSERT INTO department (name)
VALUES ("Sales"),("Engineering"),("Finance"),("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 80000, "Sales"),("Sales Lead", 100000, "Sales");

SELECT * FROM employee;
