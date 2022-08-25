CREATE TABLE Customer (
  id INT,
  name varchar(256) null
);

INSERT INTO Customer (id, name) VALUES 
(1, 'Henry'),
(2, 'Michelle'),
(3, 'Jose');

CREATE TABLE Purchase (
  id INT,
  fk_customer_id INT,
  timestamp timestamp, 
  amount DECIMAL
);

INSERT INTO Purchase (id, fk_customer_id, timestamp, amount) 
values
(1, 1, '2020-06-05T12:00:00', 2897.29),
(2, 1, '2020-06-06T12:00:00', 921.99),
(3, 1, '2020-06-07T12:00:00', 182.21),
(4, 2, '2020-06-09T12:00:00', 2767.29),
(5, 2, '2020-06-08T12:00:00', 381.11),
(6, 3, '2020-06-02T12:00:00', 2990.29),
(7, 3, '2020-06-02T12:00:00', 1924.92)
