var mysql = require("mysql");
var inquirer = require("inquirer");
var product;
var currentStock;
var itemID;
var productName;
var deptName;
var newPrice;



var connection = mysql.createConnection({

	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazon"

});

managerInput();

function managerInput(){

	inquirer.prompt([
		{
			name: "manager",
			message: "What would you like to do?",
			type: "list",
			choices: ["Search for item by...", "View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End Connection"]
		}
	]).then(function(ans){

		switch (ans.manager){
			case "Search for item by...":
				searchBy();
				break;
			case "View Products for Sale":
				viewProducts();
				break;
			case "View Low Inventory":
				viewLow();
				break;
			case "Add to Inventory":
				addInv();
				break;
			case "Add New Product":
				addProd();
				break;
			case "End Connection":
				connection.end();
				break;
			default:
				console.log("Something went wrong...")
		}

	})

}

function viewProducts() {

	connection.query("SELECT * FROM bamazon.products", function(err, res) {

		if(!err){

			for (var i = 0; i < res.length; i++) {
				console.log("\n-------------------------------------")
				console.log("ID: " + res[i].item_id + " | Product: " + res[i].product_name + " | Dept: " + res[i].department_name + " | Price: " + res[i].price + " | Stock Quantity: " + res[i].stock_quantity);
				console.log("-------------------------------------\n")
			}
			managerInput();
		}
		else {
			console.log(err);
		}

	})

}

function viewLow() {

	connection.query("SELECT * FROM bamazon.products WHERE stock_quantity < 6000", function(err, res) {

		if(!err){

			for (var i = 0; i < res.length; i++) {
				console.log("\n-------------------------------------");
				console.log("ID: " + res[i].item_id + " | Product: " + res[i].product_name + " | Dept: " + res[i].department_name + " | Price: " + res[i].price + " | Stock Quantity: " + res[i].stock_quantity);
				console.log("-------------------------------------\n");
			}
			managerInput();
		}
		else {
			console.log(err);
		}

	})

}


function addInv() {
	
	inquirer.prompt([
		{
			name: "inventory",
			message: "Which item do you want to add more inventory to? (ID #):",
			validate: function(input){

				var done = this.async();

				if(input != parseInt(input)) {
					done("Please return a number");
				}
				done(null, true);
			}
		}
	]).then(function(ans){

		connection.query("SELECT * FROM bamazon.products WHERE item_id = " + ans.inventory, function(err,res){

			if (!err) {
				if (res.length > 0) {
					console.log("ID: " + res[0].item_id + " | Product: " + res[0].product_name + " | Dept: " + res[0].department_name + " | Price: " + res[0].price + " | Stock Quantity: " + res[0].stock_quantity);
					product = res[0].product_name;
					itemID = res[0].item_id;
					currentStock = parseInt(res[0].stock_quantity);
					addInvConfirm();
				}
				else {
					console.log("That ID # does not exist... Please enter a valid ID #");
					addInv();
				}			
			}
			else {
				console.log(err);
			}


		})

	})

}


function addInvConfirm() {

	inquirer.prompt([
		{
			name: "invConfirm",
			message: "Are you sure you want to add inventory for " + product + " with a current stock quantity of " + currentStock + "?",
			type: "list",
			choices: ["Yes", "No"]
		}
	]).then(function(ans) {

		if(ans.invConfirm === "Yes") {
			howMuch();
		}
		else if(ans.invConfirm === "No") {
			console.log("Returning to main menu...")
			managerInput();
		}
		else{
			console.log("Something went wrong...")
			managerInput();
		}

	})

}


function howMuch() {

	inquirer.prompt([
		{
			name: "amount",
			message: "How much stock do you want to order for " + product + "?",
			validate: function(input){

				var done = this.async();

				if(input != parseInt(input)) {
					console.log("Please return a number");
				}
				done(null, true);
			}
		}
	]).then(function(ans){
		var invAmount = ans.amount;
			inquirer.prompt([
			{
				name: "amountConfirm",
				message: "Are you sure you want to add " + ans.amount + " stock for " + product + "?",
				type: "list",
				choices: ["Yes", "No"]
			}
			]).then(function(ans) {
				if (ans.amountConfirm === "Yes") {
					var newStock = parseInt(currentStock) + parseInt(invAmount);
					connection.query("UPDATE bamazon.products SET ? WHERE ?",
						[
							{
								stock_quantity: newStock
							},
							{
								item_id: itemID
							}
						], function(err, res){
							if (!err){
								var oldStock = parseInt(currentStock);
								console.log("Old Stock Quantity: " + oldStock + " New Stock Quantity: " + newStock);
								console.log("Returning to Main Menu...")
								managerInput();
							}
							else{
								console.log(err);
							}
						})
				}
				else if(ans.amountConfirm === "No") {
					console.log("Returning to Main Menu...");
					managerInput();
				}
				else {
					console.log("Something went wrong...");
					managerInput();
				}
		})
	})
}


function addProd() {

	inquirer.prompt([
		{
			name: "prodName",
			message: "What is the name of the product"
		}
	]).then(function(ans){

		productName = ans.prodName;
		inquirer.prompt([
			{
				name: "prodConfirm",
				message: "Are you sure the product name is " + productName + "?",
				type: "list",
				choices: ["Yes", "No"]
			}
		]).then(function(ans){

			if(ans.prodConfirm === "Yes") {
				addDept();
			}
			else if(ans.prodConfirm === "No") {
				addProd();
			}
			else {
				console.log("Something went wrong...");
				addProd();
			}

		})

	})

}


function addDept(){

	inquirer.prompt([
		{
			name: "depName",
			message: "What is the department name for " + productName
		}
	]).then(function(ans){

		deptName = ans.depName;
		inquirer.prompt([
			{
				name: "deptConfirm",
				message: "Are you sure the department name is " + deptName + "?",
				type: "list",
				choices: ["Yes", "No"]
			}
		]).then(function(ans){

			if(ans.deptConfirm === "Yes") {
				addPrice();
			}
			else if(ans.deptConfirm === "No") {
				addDept();
			}
			else {
				console.log("Something went wrong...");
				addDept();
			}

		})

	})



}


function addPrice(){

		inquirer.prompt([
		{
			name: "priceName",
			message: "What is the price for " + productName
		}
	]).then(function(ans){

		newPrice = parseFloat(ans.priceName);
		inquirer.prompt([
			{
				name: "priceConfirm",
				message: "Are you sure the price is " + newPrice + "?",
				type: "list",
				choices: ["Yes", "No"]
			}
		]).then(function(ans){

			if(ans.priceConfirm === "Yes") {
				confirmAdd();
			}
			else if(ans.priceConfirm === "No") {
				addPrice();
			}
			else {
				console.log("Something went wrong...");
				addPrice();
			}

		})

	})

}


function confirmAdd() {


		inquirer.prompt([
			{
				name: "confirmAdd",
				message: "Are you sure the product is " + productName + ", the department name is " + deptName + ", and the price is " + newPrice + "?",
				type: "list",
				choices: ["Yes", "No"]
			}
		]).then(function(ans){

			if(ans.confirmAdd === "Yes") {
				addNewRow();
			}
			else if(ans.confirmAdd === "No") {
				managerInput();
			}
			else {
				console.log("Something went wrong...");
				managerInput();
			}

		})

	


}


function addNewRow() {


	connection.query("INSERT INTO products (product_name, department_name, price) VALUES ('" + productName + "', '" + deptName + "', '" + newPrice + "');", function(err, res) {

		if (err) throw err;
		console.log("New Product Added");
		managerInput();

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
			managerInput();
		}

	})

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
						console.log("Item: " + res[i].item_id + " | Item Name: " + res[i].product_name + " | Price: " + res[i].price + " | Stock Quantity: " + res[i].stock_quantity);
						console.log("---------------------------\n")
					}
					managerInput();
				}
				else{
					console.log("No items found by that name...")
					managerInput();
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
						console.log("Item: " + res[i].item_id + " | Item Name: " + res[i].product_name + " | Price: " + res[i].price + " | Stock Quantity: " + res[i].stock_quantity);
						console.log("---------------------------\n")
					}
					managerInput();
				}
				else{
					console.log("No items found by that name...")
					managerInput();
				}
			}
			else {
				console.log(err);
			}

		})

	})

}