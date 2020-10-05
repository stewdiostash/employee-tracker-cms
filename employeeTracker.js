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
        connection.end();
      } else if (userSelection === "Add a new role") {
        connection.end();
      } else if (userSelection === "Add a new department") {
        connection.end();
      } else {
        connection.end();
      }
    });
}

// function start() {
//   inquirer.prompt([

//   ])
//   .then((result) => {

//   })
// }

function viewEmployees() {
  connection.query("SELECT * FROM employee", function (err, res) {
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

function viewRoles() {}

function addEmployees() {}

function addDepartments() {}

function addRoles() {}
