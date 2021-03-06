var mysql = require("mysql");
var inquirer = require("inquirer");
var idItem = 0;
var quant = 0;
var item;
var price;
var inStock;
var purchase;

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

	connection.query("SELECT * FROM bamazon.products", function(err, res) {
		if (!err) {
			for (var i = 0; i < res.length; i++) {
			console.log("ID # " + res[i].item_id);
			console.log("Name: " + res[i].product_name);
			console.log("Department " + res[i].department_name);
			console.log("Price " + res[i].price);
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
	connection.query("SELECT * FROM bamazon.products WHERE stock_quantity > 0", function(err, res) {
		if (!err) {
			for (var i = 0; i < res.length; i++) {
			console.log("ID # " + res[i].item_id);
			console.log("Name: " + res[i].product_name);
			console.log("Department " + res[i].department_name);
			console.log("Price " + res[i].price);
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

				if (res.length > 0) {

					if (res[0].stock_quantity <= 0) {
						console.log("Insufficient Supply. Please wait for us to restock!");
						purchaseItem();
					}

					else {
					idItem = ans.purchase;
					item = res[0].product_name;
					price = res[0].price;
					inStock = res[0].stock_quantity;
					console.log("Item: " + res[0].item_id + " | Item Name: " + res[0].product_name + " | Price: " + res[0].price);
					howMany();
					}
				}
				else {
					console.log("There is no item found with the ID # of '" + ans.purchase + "' try again...");
					purchaseItem();
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
			choices: ["Search for item by...", "List all items", "List items in stock", "Purchase Item", "End Connection"]
		}
	]).then(function(ans) {

		switch(ans.user) {
			case "Search for item by...":
				searchBy();
				break;
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
				console.log("Something went wrong...");
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
		connection.query("SELECT * FROM bamazon.products WHERE item_id = " + idItem, function(err, res){
			if (!err) {
				if (ans.quantity != 0) {
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
					inquirer.prompt([
						{
							name: "unsure",
							message: "You pressed 0.. Do you want to return to the main menu?",
							type: "list",
							choices: ["Yes", "No"]
						}
					]).then(function(ans) {
						if(ans.unsure === "Yes") {
							userInput();
						}
						if(ans.unsure === "No"){
							howMany();
						}
					})
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
			message: "Are you sure you want to order " + quant + " of " + item + " for " + price + " each? Total: " + quant * parseFloat(price),
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
			orderMade();
		}

		else {
			console.log("There was an error... try again");
			userConfirm();
		}


	})
}

 function orderMade() {
 	purchase = inStock - quant;
		connection.query(
			"UPDATE bamazon.products SET ? WHERE ?",
				[ 
					{
						stock_quantity: purchase
					},
					{
						item_id: idItem
					}
				],
				function(err, res){
					if (!err) {
						console.log("Back to main menu...\n");
						userInput();
					}
					else {
						console.log(err);
					}
				}
		)
 }

function searchItem() {


	inquirer.prompt([
		{
			name: "search",
			message: "What item are you looking for?"
		}
	]).then(function(ans){


		connection.query("SELECT * FROM products WHERE product_name like '%" + ans.search + "%'", function(err, res){


			if (!err) {
				if (res.length > 0) {
					for(var i = 0; i < res.length; i++) {
						console.log("\n---------------------------")
						console.log("Item: " + res[i].item_id + " | Item Name: " + res[i].product_name + " | Price: " + res[i].price)
						console.log("---------------------------\n")
					}
					userInput();
				}
				else{
					console.log("No items found by that name...")
					userInput();
				}
			}
			else {
				console.log(err);
			}

		})

	})

}


function searchDept() {


	inquirer.prompt([
		{
			name: "search",
			message: "Which department do you want to search for?"
		}
	]).then(function(ans){


		connection.query("SELECT * FROM products WHERE department_name like '%" + ans.search + "%'", function(err, res){


			if (!err) {
				if (res.length > 0) {

					for(var i = 0; i < res.length; i++) {
						console.log("\n---------------------------")
						console.log("Item: " + res[i].item_id + " | Item Name: " + res[i].product_name + " | Price: " + res[i].price)
						console.log("---------------------------\n")
					}
					userInput();
				}
				else{
					console.log("No items found by that name...")
					userInput();
				}
			}
			else {
				console.log(err);
			}

		})

	})

}




function searchBy(){

	inquirer.prompt([
		{
			name: "searchBy",
			message: "What do you want to search by?",
			type: "list",
			choices: ["Search by Item", "Search by Department"]
		}
	]).then(function(ans){

		if (ans.searchBy === "Search by Item") {
			searchItem();
		}
		else if(ans.searchBy === "Search by Department") {
			searchDept();
		}
		else {
			console.log("Something went wrong...");
			userInput();
		}

	})

}