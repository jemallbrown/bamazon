var mysql = require("mysql");
var inquirer = require("inquirer");

console.reset = function () {
    return process.stdout.write('\033c');
  }

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

// validateInput makes sure that the user is supplying only positive integers for their inputs
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

function queryAllProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log("-----------------------------------");
        console.log('\nWELCOME TO BAMAZON!!!')
        console.log('\nThe following items are available for purchase\n')
        // console.table(res)
        for (var i = 0; i < res.length; i++) {
            // item_id, product_name, department_name, price, stock_quantity
            console.table(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------\n");
        // connection.end();
    });
}



// The app should  prompt users with two messages.
//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

function beginShopping() {
    console.reset;
    queryAllProducts();
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
        .prompt([
            {
                name: "choice",
                type: "list",
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity );
                    }
                    return choiceArray;
                },
                message: "Which item would you like to purchase?"
            },
            {
                name: "amount",
                type: "input",
                message: "How many would you like to purchase?",
                validate: validateInput,
			    filter: Number
            },
            // Here we ask the user to confirm.
            {
                type: "confirm",
                message: "Are you sure?",
                name: "confirm",
                default: true
            }
        ])
        .then(function(inquireResponse) {
            // If the user confirms, we display the user's item to purchase, price and quantity.
            if (inquireResponse.confirm) {
                // console.log("You chose to purchase " + inquireResponse.amount + " of item " + inquireResponse.choice[0]);
                makePurchase(inquireResponse.choice,inquireResponse.amount);
                }
            
            else {
                console.log("\nThat's okay. Let's try again.\n");
                checkShopping();
            }    
        })
    });
};
var makePurchase = function(item,quantity) { 
    
    var array = item.split("|"); 
    var itemNum = array[0];
    var quantity = parseInt(quantity);
    var totalPrice = (quantity * array[2]).toFixed(2);
    // console.log(array)
    // console.log("user chose item number " + itemNum);
    // console.log("user chose quantity of " + quantity)
    // console.log("the total cost for user is " + totalPrice);
    var orderAmount = parseInt(quantity)
    // console.log("in check item availability with item = " + itemNum);
    // console.log(typeof orderAmount)
    // console.log("in check item availability with quantity = " + orderAmount);
    connection.query("SELECT * FROM products WHERE item_id=?", [itemNum], function(err, res){
        if (err) throw err;
        
        //run a check to see if there are enough items available to fulfill customer order
        // console.log(res[0].stock_quantity);
        if (orderAmount <= res[0].stock_quantity){
            // if there are enough items we will confirm the user wants to make purchase
            // console.log("there are enough items")
            // console.log("The total price for your purchase will be " + totalPrice)
            
            inquirer
            .prompt([
                {
                    type: "confirm",
                    message: "Your total cost is $" + totalPrice + "\nWould you like to proceed with the purchase of " + orderAmount + " " + res[0].product_name + " at a total cost of " + totalPrice + "?",
                    name: "confirm",
                    default: true
                }
            ])
            .then(function(inquireResponse) {
                if (inquireResponse.confirm) {
                    
                    var newQuantity = (res[0].stock_quantity - orderAmount)
                    
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newQuantity
                            },
                            {
                                item_id: itemNum
                            }
                        ],
                        function(error) {
                            if (error) throw err;
                            console.log("\Your order has placed successfully!");
                            checkShopping();
                        }
                        );
                        

                    } else {
                        checkShopping();
                    }
                })
                
            } else {
                console.log("Please modify the quantity of " + res[0].product_name + " you are requesting as there are only " + res[0].stock_quantity + " currently available for purchase")
                inquirer
                .prompt([
                    {
                        name: "amount",
                        type: "input",
                        message: "What is your revised quantity?",
                        validate: validateInput,
			            filter: Number
                    },
                    // Here we ask the user to confirm.
                    {
                        type: "confirm",
                        message: "Are you sure?",
                        name: "confirm",
                        default: true
                    }
                ])
                .then(function(inquireResponse) {
                    if (inquireResponse.confirm) {
                        // If the user confirms, we display the user's item to purchase, price and quantity.
                        orderAmount = parseInt(inquireResponse.amount);
                        console.log("You have revised your purchase amount to " + orderAmount);
                        var newQuantity = (res[0].stock_quantity - orderAmount)

                        connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newQuantity
                            },
                            {
                                item_id: itemNum
                            }
                        ],
                        function(error) {
                            if (error) throw err;
                            console.log("\Your order has placed successfully!");
                            checkShopping();
                        }
                        );
                    }
                    
                    else {
                        console.log("\nThat's okay, please start over.");
                        checkShopping();
                    }   
                    
                })
        }
            
    });

};
    

var checkShopping = function(){
    inquirer
    .prompt({
      name: "checkGoal",
      type: "list",
      message: "Would you like to shop?",
      choices: ["SHOP", "EXIT"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.checkGoal.toUpperCase() === "SHOP") {
        console.reset();
        beginShopping();
      }
      else {
        sayGoodBye();
      }
    });
}

var sayGoodBye = function(){
    connection.end();
    console.log('Thanks for visiting. Hope you return soon')
}

    

    checkShopping();

    
