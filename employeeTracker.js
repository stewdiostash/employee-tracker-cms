const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "s0mUchdAt@",
  database: "employee_tracker_DB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  // viewEmployees();
  start();
});

function start() {
  inquirer
    .prompt([
      {
        name: "userSelection",
        message: "What would you like to do?",
        type: "list",
        choices: [
          "View current employees",
          "View employees by department",
          "View employees by role",
          "Update an employee's role",
          "Add a new employee",
          "Add a new role",
          "Add a new department",
          "Exit",
        ],
      },
    ])
    .then(({ userSelection }) => {
      console.log(userSelection);
      if (userSelection === "View current employees") {
        viewEmployees();
      } else if (userSelection === "View employees by department") {
        viewByDepartment();
      } else if (userSelection === "View employees by role") {
        viewByRole();
      } else if (userSelection === "Update an employee's role") {
        updateEmployeeRole();
      } else if (userSelection === "Add a new employee") {
        addEmployee();
      } else if (userSelection === "Add a new role") {
        addRole();
      } else if (userSelection === "Add a new department") {
        addDepartment();
      } else {
        connection.end();
      }
    });
}

// function viewEmployees() {
//   connection.query("SELECT * FROM employee", function (err, res) {
//     if (err) throw err;
//     console.table(res);
//     start();
//   });
// }

function viewEmployees() {
  connection.query(
    `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, concat(manager.first_name , " " , manager.last_name) AS "manager"
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id; `,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

function viewByDepartment() {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    let deptsArray = [];
    for (var i = 0; i < results.length; i++) {
      deptsArray.push(results[i].name);
    }
    inquirer
      .prompt([
        {
          name: "viewDept",
          type: "list",
          message: "Select a department to view",
          choices: deptsArray,
        },
      ])
      .then(({ viewDept }) => {
        console.log(viewDept);
        connection.query(
          `
        SELECT employee.id, employee.first_name, employee.last_name, role.title
        FROM employee
        INNER JOIN role ON employee.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        WHERE department.name in ("${viewDept}"); `,
          (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
          }
        );
      });
  });
}

function viewByRole() {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    let rolesArray = [];
    for (var i = 0; i < results.length; i++) {
      rolesArray.push(results[i].title);
    }
    inquirer
      .prompt([
        {
          name: "viewRole",
          type: "list",
          message: "Select a role to view",
          choices: rolesArray,
        },
      ])
      .then(({ viewRole }) => {
        console.log(viewRole);
        connection.query(
          `
        SELECT employee.id, employee.first_name, employee.last_name, role.title
        FROM employee
        INNER JOIN role ON employee.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        WHERE role.title in ("${viewRole}"); `,
          (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
          }
        );
      });
  });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Employee first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "Employee last name?",
      },
      {
        name: "roleId",
        type: "input",
        message: "Employee role number?",
      },
      {
        name: "managerId",
        type: "input",
        message: "Manager ID number? (leave blank if none)",
      },
    ])
    .then(({ firstName, lastName, roleId, managerId }) => {
      console.log(firstName, lastName, roleId, managerId);
      if (managerId == "") {
        managerId = null;
      }
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: firstName,
          last_name: lastName,
          role_id: roleId,
          manager_id: managerId,
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " employee added!\n");
          start();
        }
      );
    });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        name: "employeeId",
        type: "input",
        message: "Enter the ID number of the employee you wish to re-assign",
      },
      {
        name: "newRole",
        type: "input",
        message: "Enter the employee's new title",
      },
    ])
    .then(({ employeeId, newRole }) => {
      connection.query(
        "UPDATE role SET ? WHERE ?",
        [
          {
            title: newRole,
          },
          {
            id: employeeId,
          }
        ],
        function (err, res) {
          if (err) throw err;
          // console.log(res);
          console.log(res.affectedRows + " updated!\n");
          start();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "Role title?",
      },
      {
        name: "roleSalary",
        type: "input",
        message: "Role salary?",
      },
      {
        name: "roleDept",
        type: "input",
        message: "Role department code?",
      },
    ])
    .then(({ roleTitle, roleSalary, roleDept }) => {
      console.log(roleDept);
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: roleTitle,
          salary: roleSalary,
          department_id: roleDept,
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " role added!\n");
          start();
        }
      );
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "deptName",
        type: "input",
        message: "Department name?",
      },
    ])
    .then(({ deptName }) => {
      console.log(deptName);
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: deptName,
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " department added!\n");
          start();
        }
      );
    });
}
