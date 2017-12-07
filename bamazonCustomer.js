var mysql = require("mysql");
var inquirer = require("inquirer");

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
			case "End Connection":
				connection.end();
				break;
			default:
				console.log("This works");
		}


	})
}


