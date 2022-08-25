-- write a query to select the sum of all order amounts grouped by customer and
-- to display the total number of orders for each customer. output should include
-- the customer name, the summed amount (SumAmount), and the number of orders (CountOrders)

select 
c.name, sum(p.amount) SumAmount, count(c.*) CountOrders
from customer c 
join purchase p on c.id=p.fk_customer_id
group by c.id, c.name

-- | name     | sumamount | countorders |
-- | -------- | --------- | ----------- |
-- | Henry    | 4001.49   | 3           |
-- | Michelle | 3148.40   | 2           |
-- | Jose     | 4915.21   | 2           |