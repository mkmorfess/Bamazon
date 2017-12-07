var mysql = require("mysql");
var inquirer = require("inquirer");
var id;
var quant;

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
			message: "Which item do you want to purchase? (ID #)"
		}
	]).then(function(ans) {
		connection.query("SELECT * FROM bamazon.products WHERE item_id = " + ans.purchase, function(err, res){
			if (!err) {
				if (res.stock_quantity <= 0) {
					console.log("Insufficient Supply. Please wait for us to restock!");
					purchaseItem();
				}
				else {
				id = ans.purchase;
				console.log(res.affectedRows);
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
			message: "How many do you want to purchase?"
		}
	]).then(function(ans){
		quant = ans.quantity;
		connection.query("SELECT * FROM bamazon.products WHERE item_id = " + id, function(err, res){
			if (!err) {
				if (res.stock_quantity - ans.quantity <= 0) {
					console.log("Insufficient Supply. Try ordering a smaller amount! There is only " + res.stock_quantity + " left");
					howMany();
				}
				else {
				console.log("Order made for " + ans.quantity);
				console.log(res);
				// orderMade();
				}
			}
			else {
				console.log(err);
			}
		});
		
		
	})
}

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