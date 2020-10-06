var mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
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
        connection.end();
      } else if (userSelection === "Add a new department") {
        connection.end();
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
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id 
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id; `,
    (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
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

function defineManager() {


}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        message: "Employee first name?",
        type: "input"
      },
      {
        name: "lastName",
        message: "Employee last name?",
        type: "input"
      },
      {
        name: "roleId",
        message: "Employee role ID number?",
        type: "input"
      },
      {
        name: "managerId",
        message: "Manager ID number? (leave blank if none)",
        type: "input"
      }
    ])
    .then(({firstName, lastName, roleId, managerId}) => {
      console.log(firstName, lastName, roleId, managerId);
      if (managerId === "") {
        managerId = null;
      }
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: firstName,
          last_name: lastName,
          role_id: roleId,
          manager_id: managerId
        },
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " employee added!\n");
          start();
        }
      );

  
    });
}

function addDepartments() {}

function addRoles() {}



