Bamazon Customer Tutorial:

When you first load the program, it’ll give the customer 5 different options to click on: “Search for item by…”, “List all items”, “List items in stock”, “Purchase Item”, and “End Connection”



Search for item by:
When you click search for item by, it allows you to search either by item or by department:

 
When you click either Search by Item or by department, it uses a LIKE statement in the where clause to pick up on keywords the user types in and finds anything related.

In the example below, I chose search by department and typed in video games and received 3 results…

 


List all items:

The list all items feature allows the user to see all the items in inventory: 

 



List items in stock: 

This feature allows the user to see what items we currently have in stock to purchase…
Notice the ID # 3, Nintendo Switch not on the screenshot below.. it currently has a stock quantity of 0.

 

Purchase Item:

The purchase item feature allows the user to make purchases of what items we have in stock by ID #. The customer will have to look up the item they want and then use the item ID of that item to purchase it.

If the item is currently not in stock, the prompt will let you know and return you back to the purchase window.

If the item ID is not in the database, the prompt will let you know and return you back to the purchase window.

Once you’ve selected your item, it’ll ask the user how many of that item they would like to purchase.

Once the user selects the quantity, it will ask the user for confirmation to make sure they want to purchase that item before sending it off.

If the user selects no, it will return them to the main menu, otherwise it will process the order and then return them to the main menu.

 

End Connection:

Lastly, the end connection option logs the customer off of Bamazon.
