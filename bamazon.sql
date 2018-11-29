CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(300) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL (10,2) NOT NULL,
  stock_quantity INT (100) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tickle Me Elmo", "toys", 17.95, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Apple iPad", "Electronics", 139.99, 26);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Zero Gravity Chair", "Lawn and Garden", 34.99, 31);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bamazon Echo Dot", "Electronics", 19.99, 28);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Stuffed Dinosaur", "toys", 11.19, 17);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Playing Cards", "toys", 5.17, 2000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wall Mirror", "Home Decor", 85.25, 24);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Adirondack Basket", "Home Decor", 16.99, 36);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ceramic Vase", "Home Decor", 8.17, 70);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Lawn Table", "Lawn and Garden", 225.95, 10);
