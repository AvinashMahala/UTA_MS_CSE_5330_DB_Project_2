

/*
Retrieve All
*/
SELECT * FROM avinash_tbl_customer;
SELECT * FROM avinash_tbl_owner;
SELECT * FROM avinash_tbl_car;
SELECT * FROM avinash_tbl_car_type;
SELECT * FROM avinash_tbl_rental;
SELECT * FROM avinash_tbl_car_availability;


/*
2.Write queries to retrieve and print all the data you entered. 
Try to print the data so that it is easy to understand 
(for example, print appropriate headings, such as: 
Customers, Compact Cars, SUVs, Current Rentals, etc.).
*/
-- Customers
SELECT cust.idno,cust.name,cust.phone FROM AVINASH_TBL_CUSTOMER cust;

-- Compact Cars
SELECT * FROM AVINASH_TBL_CAR WHERE TYPE = 'Compact';

-- SUVs
SELECT * FROM AVINASH_TBL_CAR WHERE TYPE = 'SUV';

-- Current Rentals
SELECT * FROM AVINASH_TBL_RENTAL WHERE RETURN_DATE IS NULL;


/*
3.	Write a query that will prepare a report for 
weekly earnings by owner, by car type and per car unit that owner owns within that car type.
*/




/*
4.	Write the following database update transactions using any 
suitable programming or scripting language (e.g. JAVA/JDBC, Python or PHP).
4.1	The first transaction is to add information about a new CUSTOMER.
*/




/*
4.2	The second transaction is to add all the information about a new CAR.
*/



/*
4.3	The third transaction is to add all the information about a new RENTAL reservation
(this must find a free car of the appropriate type for the rental period).
*/



/*
4.4	The fourth transaction is to handle the return of a rented car. 
*/

/*
This transaction should print the total customer payment due for the rental, and enter it in the database.
*/



/*
4.5	The fifth transaction is to enter or update the rental rates 
(daily and weekly) for a type of car.
*/




