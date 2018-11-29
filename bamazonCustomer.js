var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "tiffany1",
  database: "bamazonDB"
});

// connection.connect(function(err) {
//   if (err) throw err;
// //   console.log("connected as id " + connection.threadId);
// });

// selectAll();
// queryElectronics();
// queryAllProducts();


function queryAllProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            // item_id, product_name, department_name, price, stock_quantity
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
        connection.end();
    });
}
function queryElectronics() {
    var query = connection.query("SELECT * FROM products WHERE department_name=?", ["Electronics"], function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);    }
            console.log("-----------------------------------");
            connection.end();
        });
        
        // logs the actual query being run
        //   console.log(query.sql);
    }
    
    function selectAll(){
        let query = "SELECT * FROM products"
        
        connection.query(query, function(err, response){
            if (err) throw err;
            // console.log(response);
            console.table(response);
            console.log("-----------------------------------");
            connection.end();
        })
    };

    // The app should  prompt users with two messages.
    //    * The first should ask them the ID of the product they would like to buy.
    //    * The second message should ask how many units of the product they would like to buy.

    var beginShopping = function(){
        queryAllProducts();
        // Create a "Prompt" with a series of questions.
        inquirer
        .prompt([
            // Here we give the user a list to choose from.
            {
                type: "list",
                message: "Please select the the ID of the product they would like to buy?",
                choices: ["1", "2", "3","4"],
                name: "userChoice"
            },
            // Here we ask the user to confirm.
            {
                type: "confirm",
                message: "Are you sure:",
                name: "confirm",
                default: true
            }
        ])
        .then(function(inquireResponse) {
            // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
            if (inquireResponse.confirm) {
                console.log("You chose item number " + inquireResponse.userChoice);
    
            }
            else {
                console.log("\nThat's okay, come again when you are more sure.\n");
                
            }
        });
    }

    beginShopping();