const inquirer = require("inquirer");
const mysql = require("mysql");
const { printTable } = require('console-table-printer');



var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_tracker_db"
});



const CFonts = require('cfonts');
 
CFonts.say('EMPLOYEE TRACKER', {
    font: 'chrome',              // define the font face
    align: 'left',              // define text alignment
    colors:  ['cyanBright', 'yellowBright','redBright'],         // define all colors
    background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
    letterSpacing:0 ,           // define letter spacing
    lineHeight: 0,              // define the line height
    space: true,                // define if the output text should have empty lines on top and on the bottom
    maxLength: '0',             // define how many character can be on one line
});



connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }   
  start();
});


function start() {
    inquirer.prompt(
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all employees',
          'View employees by manager',
          'View all roles',
          'View all departments',
          'View department budget utilized',
          'View manager budget utilization',
          'Update employee role',
          'Add employee',
          'Add role',
          'Add department',
          'Remove employee',
          'Remove role',
          'Remove department',          
          'Exit'
        ]
      }
    ).then(answer => {
      const { action } = answer;
  
      switch (action) {
        case 'View all employees':
          connection.query(
            'SELECT * FROM employee',
            (err, result) => {
              if (err) throw err;
  
              console.log(printTable(result));              
  
              start();
            });
          break;
  
        case 'View employees by manager':
          connection.query(
            'SELECT * FROM employee',
            (err, result) => {
              if (err) throw err;
  
              const managerNames = [];
              const managerIds = result
              .map(employee => employee.manager_id)
              .filter(manager_id => typeof manager_id === 'number');
  
              result.forEach(employee => {
                if (managerIds.includes(employee.employee_id)) {
                  managerNames.push(employee.first_name + ' ' + employee.last_name);
                }
              });
  
              inquirer.prompt(
                {
                  type: 'list',
                  name: 'manager',
                  message: 'What is the manager\'s name?',
                  choices: managerNames
                }
              ).then(answer => {
                const [manager] = result.filter(employee => {
                  return employee.first_name + ' ' + employee.last_name === answer.manager;
                });
                const employees = result.filter(employee => {
                  return employee.manager_id === manager.employee_id;
                });
  
                console.log(printTable(employees));
  
                start();
              });
            }
          );
          break;
  
        case 'View all roles':
          connection.query(
            'SELECT * FROM role',
            (err, result) => {
              if (err) throw err;
  
              console.log(printTable (result));
  
              start();
            });
          break;
  
        case 'View all departments':
          connection.query(
            'SELECT * FROM department',
            (err, result) => {
              if (err) throw err;
  
              console.log(printTable (result));
  
              start();
            });
          break;

          case 'View department budget utilized':
            connection.query(
              'select d.name "Department", SUM(r.salary) "Budget Utilized" from role r JOIN department d JOIN employee e where r.role_id = e.role_id and r.department_id = d.department_id group by r.department_id;',
              (err, result) => {
                if (err) throw err;    
                console.log(printTable (result));    
                start();
              });
            break;   

            case 'View manager budget utilization':
              connection.query(
                "select concat(e.first_name,' ', e.last_name) 'Manager_Name', SUM(r.salary) 'Budget Utilized' from role r JOIN department d JOIN employee e where r.role_id = e.role_id and r.department_id = d.department_id group by e.manager_id;",
                (err, result) => {
                  if (err) throw err;    
                  console.log(printTable (result));    
                  start();
                });
              break;
  
        case 'Update employee role':
          connection.query(
            'SELECT * FROM employee',
            (err, employeeResult) => {
              const employees = employeeResult.map(employee => {
                return employee.first_name + ' ' + employee.last_name;
              });
  
              connection.query(
                'SELECT * FROM role',
                (err, roleResult) => {
                  const roles = roleResult.map(role => {
                    return role.title;
                  });
  
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'employee',
                      message: 'Which employee\'s role would you like to update?',
                      choices: employees
                    },
                    {
                      type: 'list',
                      name: 'role',
                      message: 'What is the employee\'s new role?',
                      choices: roles
                    }
                  ]).then(answer => {
                    const employee_id = employeeResult.filter(employee => {
                      return employee.first_name + ' ' + employee.last_name === answer.employee;
                    })[0].employee_id;
                    const role_id = roleResult.filter(role => {
                      return role.title === answer.role;
                    })[0].role_id;
  
                    connection.query(
                      'UPDATE employee SET role_id = ? WHERE role_id  = ?',
                      [role_id, role_id ],
                      (err, result) => {
                        if (err) throw err;
  
                        console.log(`Role successfully updated.`);
  
                        start();
                      }
                    );
                  });
                }
              );
            }
          );
          break;
  
        case 'Add employee':
          connection.query(
            'SELECT * FROM employee',
            (err, employeeResult) => {
              const employees = employeeResult.map(employee => {
                return employee.first_name + ' ' + employee.last_name;
              });
  
              connection.query(
                'SELECT * FROM role',
                (err, roleResult) => {
                  const roles = roleResult.map(role => {
                    return role.title;
                  });
  
                  inquirer.prompt([
                    {
                      type: 'input',
                      name: 'first_name',
                      message: 'What is the employee\'s first name?'
                    },
                    {
                      type: 'input',
                      name: 'last_name',
                      message: 'What is the employee\'s last name?'
                    },
                    {
                      type: 'list',
                      name: 'role',
                      message: 'What is the employee\'s role?',
                      choices: roles
                    },
                    {
                      type: 'list',
                      name: 'manager',
                      message: 'Who is the employee\'s manager?',
                      choices: employees.concat('None')
                    }
                  ]).then(answer => {
                    const { first_name, last_name } = answer;
                    const manager = employeeResult.filter(employee => {
                      return employee.first_name + ' ' + employee.last_name === answer.manager;
                    })[0];
                    const role_id = roleResult.filter(role => {
                      return role.title === answer.role;
                    })[0].role_id;
                    const manager_id = manager ? manager.manager_id : null;

                    // console.log(role);
  
                    connection.query(
                      'INSERT INTO employee SET ?',
                      { first_name, last_name, role_id, manager_id },
                      (err, result) => {
                        if (err) throw err;
  
                        console.log(`${first_name} ${last_name} was successfully added to employees.`);
  
                        start();
                      }
                    );
                  });
                }
              );
            }
          );
          break;
  
        case 'Add role':
          connection.query(
            'SELECT * FROM department',
            (err, result) => {
              if (err) throw err;
  
              const departments = result.map(department => department.name);
  
              inquirer.prompt([
                {
                  type: 'input',
                  name: 'title',
                  message: 'What is the title of this role?'
                },
                {
                  type: 'input',
                  name: 'salary',
                  message: 'What is the salary of this role?',
                  validate: salary => {
                    if (isNaN(salary) || salary < 0) {
                      return 'Please enter a number greater than zero.';
                    }
  
                    return true;
                  }
                },
                {
                  type: 'list',
                  name: 'department',
                  message: 'What department is this role in?',
                  choices: departments
                }
              ]).then(answer => {
                const { title } = answer;
                const salary = Number(answer.salary).toFixed(2);
                const department_id = result.filter(department => {
                  return department.name === answer.department;
                })[0].department_id;
  
                connection.query(
                  'INSERT INTO role SET ?',
                  {
                    title,
                    salary,
                    department_id
                  },
                  (err, result) => {
                    if (err) throw err;
  
                    console.log(`${title} successfully added to roles.`);
  
                    start();
                  }
                );
              });
            }
          );
          break;
  
        case 'Add department':
          inquirer.prompt(
            {
              type: 'input',
              name: 'name',
              message: 'What is the name of the department?'
            }
          ).then(answer => {
            const { name } = answer;
  
            connection.query(
              'INSERT INTO department (name) VALUES (?)',
              name,
              (err, result) => {
                if (err) throw err;
  
                console.log(`${name} successfully added to departments.`);
  
                start();
              });
          });
          break;
  
        case 'Remove employee':
          connection.query(
            'SELECT * FROM employee',
            (err, result) => {
              if (err) throw err;
  
              const employees = result.map(employee => {
                return employee.first_name + ' ' + employee.last_name;
              });
  
              inquirer.prompt(
                {
                  type: 'list',
                  name: 'employee',
                  message: 'Which employee do you want to remove?',
                  choices: employees
                }
              ).then(answer => {
                const { employee } = answer;
                const firstName = employee.split(' ')[0];
                const lastName = employee.split(' ')[1];
  
                connection.query(
                  'DELETE FROM employee WHERE first_name = ? AND last_name = ?',
                  [firstName, lastName],
                  (err, result) => {
                    if (err) throw err;
  
                    console.log('Employee successfully removed.');
  
                    start();
                  }
                );
              });
            }
          );
          break;
  
        case 'Remove role':
          connection.query(
            'SELECT * FROM role',
            (err, result) => {
              if (err) throw err;
  
              const roles = result.map(role => role.title);
  
              inquirer.prompt(
                {
                  type: 'list',
                  name: 'role',
                  message: 'Which role do you want to remove?',
                  choices: roles
                }
              ).then(answer => {
                const { role } = answer;
  
                connection.query(
                  'DELETE FROM role WHERE title = ?',
                  role,
                  (err, result) => {
                    if (err) throw err;
  
                    console.log(`${role} successfully removed.`);
  
                    start();
                  }
                );
              });
            }
          );
          break;
  
        case 'Remove department':
          connection.query(
            'SELECT * FROM department',
            (err, result) => {
              if (err) throw err;
  
              const departments = result.map(department => department.name);
  
              inquirer.prompt(
                {
                  type: 'list',
                  name: 'department',
                  message: 'Which department do you want to remove?',
                  choices: departments
                }
              ).then(answer => {
                const { department } = answer;
  
                connection.query(
                  'DELETE FROM department WHERE name = ?',
                  department,
                  (err, result) => {
                    if (err) throw err;
  
                    console.log('Department successfully removed.');
  
                    start();
                  }
                );
              });
            }
          );
          break;
  
        case 'Exit':
          connection.end();
          break;
      }
    });    
  }
