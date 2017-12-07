var mysql = require("mysql");
var inquirer = require("inquirer");
var id = 0;
var quant = 0;

var connection = mysql.createConnection({

	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazon"

})


connection.connect(function(err){
	if(err) throw err;
	console.log("connected as id " + connection.threadId + "\n");
	userInput();
})	

function listItems(){

	connection.query("SELECT item_id, product_name, department_name, price FROM bamazon.products", function(err, res) {
		if (!err) {
			for (var i = 0; i < res.length; i++) {
			console.log(res[i]);
			console.log("\n----------------------------------------\n");
		}
			userInput();
		}
		else {
			console.log(err);
		}
	})

}

function inStockItems(){
	connection.query("SELECT item_id, product_name, department_name, price FROM bamazon.products WHERE stock_quantity > 0", function(err, res) {
		if (!err) {
			for (var i = 0; i < res.length; i++) {
			console.log(res[i]);
			console.log("\n----------------------------------------\n");
		}
			userInput();
		}
		else {
			console.log(err);
		}
	})
}


function purchaseItem(){

	inquirer.prompt([
		{
			name: "purchase",
			message: "Which item do you want to purchase? (ID #)",
			validate: function(input) {

				var done = this.async();
		
					if (input != parseInt(input)) {
						done("Return just a number");
						return;
					}
					done(null, true);	
				}
		}
	]).then(function(ans) {
		connection.query("SELECT * FROM bamazon.products WHERE item_id = " + ans.purchase, function(err, res){
			if (!err) {
				if (res[0].stock_quantity <= 0) {
					console.log(res);
					console.log("Insufficient Supply. Please wait for us to restock!");
					purchaseItem();
				}
				else {
				id = ans.purchase;
				console.log(res);
				howMany();
				}
			}
			else {
				console.log(err);
			}
		});

	})

}


function userInput(){

	inquirer.prompt([
		{
			name: "user",
			message: "What would you like to do?",
			type: "list",
			choices: ["List all items", "List items in stock", "Purchase Item", "End Connection"]
		}
	]).then(function(ans) {

		switch(ans.user) {
			case "List all items":
				listItems();
				break;
			case "List items in stock":
				inStockItems();
				break;
			case "Purchase Item":
				purchaseItem();
				break;
			case "End Connection":
				connection.end();
				break;
			default:
				console.log("This works");
		}


	})
}


function howMany() {
    
	inquirer.prompt([
		{
			name: "quantity",
			message: "How many do you want to purchase?",
			validate: function(input) {

				var done = this.async();
		
					if (input != parseInt(input)) {
						done("Return just a number");
						return;
					}
					done(null, true);	
				}
		}
	]).then(function(ans){
		quant = ans.quantity;
		connection.query("SELECT * FROM bamazon.products WHERE item_id = " + id, function(err, res){
			if (!err) {
				if (res[0].stock_quantity - ans.quantity <= 0) {
					console.log("Insufficient Supply. Try ordering a smaller amount! \nThere is only " + res[0].stock_quantity + " left in stock");
					howMany();
				}
				else {
				// console.log("Order made for " + ans.quantity);
				// console.log(res);
					userConfirm();
				}
			}
			else {
				console.log(err);
			}
		});
		
		
	})
}


function userConfirm() {
	// console.log(quant);
	inquirer.prompt([
		{
			name: "confirm",
			message: "Are you sure you want to order " + quant + " of the item?",
			type: "list",
			choices: ["Yes", "No"]
		}
	]).then(function(ans) {
		if (ans.confirm === "No") {
			console.log("\n---------------------------")
			console.log("Cancelling Order...")
			console.log("Returning to the main menu...")
			console.log("---------------------------\n")
			userInput();
		}
		else if (ans.confirm === "Yes") {
			console.log("\n---------------------------")
			console.log("Order made for " + quant);
			console.log("---------------------------\n")
			// orderMade();
			userInput();
		}

		else {
			console.log("There was an error... try again");
			userConfirm();
		}


	})
}

//  function orderMade() {
		// connection.query(
		//	"UPDATE bamazon.products SET ? WHERE ?",
		// 		[ 
		// 			{

		// 			},
		// 			{

		// 			}
		// 		],
	// 			function(err, res){
	// 				if (!err) {
	// 					console.log(res)
	// 				}
	// 			}
		// )
//  }