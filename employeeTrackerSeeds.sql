DROP DATABASE IF EXISTS employee_tracker_DB;

CREATE DATABASE employee_tracker_DB;

USE employee_tracker_DB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES role(id),
  manager_id INT,
  FOREIGN KEY (manager_id) REFERENCES employee(id),
  PRIMARY KEY (id)
);


INSERT INTO department (name)
VALUES ("Sales"),("Engineering"),("Finance"),("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 80000, 1),("Sales Lead", 100000, 1), ("Software Engineer", 120000, 2),("Software Lead", 150000, 2),("Accountant", 125000, 3),("Account Manager", 160000, 3),("Lawyer", 190000, 4),("Legal Team Lead", 250000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rupert", "McInnes", 1, NULL), ("Nelson", "Wong", 2, NULL), ("Lisa", "Lionsworth", 1, NULL), ("Mick", "Norton", 4, NULL), ("Abigail", "Lawrence", 3, NULL);

SELECT * FROM employee;

SELECT * FROM department;

SELECT * FROM role;
