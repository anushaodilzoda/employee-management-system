INSERT INTO department(name) VALUES ("Human Resources");
INSERT INTO department(name) VALUES ("Engineering");
INSERT INTO department(name) VALUES ("Marketing");
INSERT INTO department(name) VALUES ("Finance");
INSERT INTO department(name) VALUES ("Operationss");

INSERT INTO role(title, salary, department_id) VALUES ("HR Director", 100000.00, 1);
INSERT INTO role(title, salary, department_id) VALUES ("Recruiter", 59000.00, 1);
INSERT INTO role(title, salary, department_id) VALUES ("Senior Engineer", 85000.00, 2);
INSERT INTO role(title, salary, department_id) VALUES ("Software Developer", 55000.00, 2);
INSERT INTO role(title, salary, department_id) VALUES ("Marketing Manager", 77000.00, 3);
INSERT INTO role(title, salary, department_id) VALUES ("CEO", 60000.00, 4);
INSERT INTO role(title, salary, department_id) VALUES ("Accountant", 55000.00, 4);
INSERT INTO role(title, salary, department_id) VALUES ("Facility Manager", 65000.00, 5);
INSERT INTO role(title, salary, department_id) VALUES ("Executive", 20000.00, 5);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Johnny", "Depp", 1, 8);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Chris", "Hemsworth", 2, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Bradley", "Cooper", 3, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Matt", "Prior", 3, 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Will", "Smith", 4, 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Leonardo", "DiCaprio", 4, 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Dwayne", "Johnson", 5, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Sean", "Connery", 6, 8 );
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Jen", "Lee", 7, 7);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Shaun", "Hart", 8, 8 );
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Martin", "Steve", 9, 8);
