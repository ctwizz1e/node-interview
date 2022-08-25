-- write a query to display the most recent order for each customer by timestamp
-- include the customer name and the timestamp (OrderTimestamp)
select 
c.name, max(p.timestamp)
from customer c 
join purchase p on c.id=p.fk_customer_id
group by c.id, c.name;

-- | name     | ordertimestamp           |
-- | -------- | ------------------------ |
-- | Henry    | 2020-06-07T12:00:00.000Z |
-- | Michelle | 2020-06-09T12:00:00.000Z |
-- | Jose     | 2020-06-02T13:00:00.000Z |