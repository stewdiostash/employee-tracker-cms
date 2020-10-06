const mysql = require("mysql");
const inquirer = require("inquirer");

let rolesArray = [];
let deptsArray = [];
let employeesArray = [];

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
          "View current departments",
          "View current roles",
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
      } else if (userSelection === "View current departments") {
        viewDepartments();
      } else if (userSelection === "View current roles") {
        viewRoles();
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

function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
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

function addRole() {
  checkDepts();
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
        message: "Role department code?"
      }
    ])
    .then(({roleTitle, roleSalary, roleDept}) => {
      console.log(roleDept);
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: roleTitle,
          salary: roleSalary,
          department_id: roleDept
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
        message: "Department name?"
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

function checkRoles() {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    for (var i = 0; i < results.length; i++) {
      rolesArray.push(results[i].title);
    }
  });
}

function checkEmployees() {
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
    for (var i = 0; i < results.length; i++) {
      employeesArray.push(results[i].last_name);
    }
  });
}

function checkDepts() {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    for (var i = 0; i < results.length; i++) {
      deptsArray.push(results[i].name);
    }
  });
}

// let roleList = [
//   {
//     roleNum: 1,
//     roleTitle: "Salesperson"
//   },
//   {
//     roleNum: 2,
//     roleTitle: "Sales Lead"
//   },
//   {
//     roleNum: 3,
//     roleTitle: "Software Engineer"
//   },
//   {
//     roleNum: 4,
//     roleTitle: "Software Lead"
//   },
//   {
//     roleNum: 5,
//     roleTitle: "Accountant"
//   },
//   {
//     roleNum: 6,
//     roleTitle: "Account Manager"
//   },
//   {
//     roleNum: 7,
//     roleTitle: "Lawyer"
//   },
//   {
//     roleNum: 8,
//     roleTitle: "Legal Team Lead"
//   },
// ]
