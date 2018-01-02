## Bamazon Customer Tutorial:


When you first load the program, it’ll give the customer 5 different options to click on: “Search for item by…”, “List all items”, “List items in stock”, “Purchase Item”, and “End Connection”

![Main Menu](./screenshots/customer1.png?raw=true "Customer1")

# Search for item by:
When you click search for item by, it allows you to search either by item or by department:

![Main Menu](./screenshots/customer2.png?raw=true "Customer2")
 
When you click either Search by Item or by department, it uses a LIKE statement in the where clause to pick up on keywords the user types in and finds anything related.

In the example below, I chose search by department and typed in video games and received 3 results…

![Main Menu](./screenshots/customer3.png?raw=true "Customer3")


# List all items:

The list all items feature allows the user to see all the items in inventory: 

 
![Main Menu](./screenshots/customer4.png?raw=true "Customer4")


# List items in stock: 

This feature allows the user to see what items we currently have in stock to purchase…
Notice the ID # 3, Nintendo Switch not on the screenshot below.. it currently has a stock quantity of 0.

![Main Menu](./screenshots/customer5.png?raw=true "Customer5")

# Purchase Item:

The purchase item feature allows the user to make purchases of what items we have in stock by ID #. The customer will have to look up the item they want and then use the item ID of that item to purchase it.

If the item is currently not in stock, the prompt will let you know and return you back to the purchase window.

If the item ID is not in the database, the prompt will let you know and return you back to the purchase window.

Once you’ve selected your item, it’ll ask the user how many of that item they would like to purchase.

Once the user selects the quantity, it will ask the user for confirmation to make sure they want to purchase that item before sending it off.

If the user selects no, it will return them to the main menu, otherwise it will process the order and then return them to the main menu.

![Main Menu](./screenshots/customer6.png?raw=true "Customer6")

# End Connection:

Lastly, the end connection option logs the customer off of Bamazon.










## Bamazon Manager Tutorial:

When you load the Bamazon Manager script, it gives the manager 5 different options to choose from: “Search “View Products for Sale”, “View Low Inventory”, “Add to Inventory”, “Add New Product”, and “End Connection”.

![Main Menu](./screenshots/manager1.png?raw=true "manager1")

# Search for item by…: 
This allows the manager to search for individual items if needed for restock purposes or to check on an item for a customer. It will allow the manager to search either by item or by department. The difference between the customer version and the manager version is it allows the manager to see the stock quantity of an item whereas the customer version does not show how much is left in stock.
 
![Main Menu](./screenshots/manager2.png?raw=true "manager2")

# View Products for Sale:
This allows the manager to see the list of all the products we have currently on sale on Bamazon. Very similar to the customer version, but this one displays the stock quantity for each item to the manager.

![Main Menu](./screenshots/manager3.png?raw=true "manager3")

# View Low Inventory:
This allows the manager to see what items are low on the inventory list. It will show an item if it is below a stock quantity of 6000. This will allow the manager to have time to replenish based on sales.

![Main Menu](./screenshots/manager4.png?raw=true "manager4")

# Add to Inventory: 
This allows the manager to order a new shipment of a particular item if the store is low of something. For example, the Nintendo Switch is completely out of stock as seen by the screenshot above…
It will prompt the manager and ask which ID number they want to add inventory to…
It will then ask for confirmation that the ID they input was the correct one…

Then it will ask how many of the item do you want to order, in the example, I put 10000 since it’s been sold out.
Then it will confirm with the manager if they want to add the number they input in.

Once you select Yes, it will add 10000 to the stock quantity and show the manager the old stock quantity versus the new stock quantity.

![Main Menu](./screenshots/manager5.png?raw=true "manager5") 

# Add New Product: 
This allows the manager to add a new item to the inventory. It will prompt the manager for the name, department, and price. It will default the stock to 0 so you’ll have to add inventory once you add the new item.
It will ask for the name of the item first, then ask for confirmation from the manager…
Then it will ask for the department name, then ask for confirmation from the manager…
Then it will ask for the price, and ask for confirmation from the manager…

Once all the information is input… It’ll ask for one more confirmation for all 3: name, department, price.

And if you hit yes, It will add it to the database.

![Main Menu](./screenshots/manager6.png?raw=true "manager6") 

# End Connection: 
This allows for the manager to log out of the current s

