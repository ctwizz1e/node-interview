-- write a query to display the most recent order for each customer by timestamp
-- include the customer name, the timestamp (OrderTimestamp), and the amount for the 
-- order (Amount)
  with LastOrder as (
    select p.fk_customer_id, max(p.timestamp) timestamp
    from purchase p
    group by p.fk_customer_id
  ) 
  select c.name, o.timestamp OrderTimestamp, p.amount Amount
  from LastOrder o
  join Purchase p on o.fk_customer_id=p.fk_customer_id and o.timestamp=p.timestamp
  join customer c on o.fk_customer_id=c.id;

-- | name     | ordertimestamp           | amount  |
-- | -------- | ------------------------ | ------- |
-- | Henry    | 2020-06-07T12:00:00.000Z | 182.21  |
-- | Michelle | 2020-06-09T12:00:00.000Z | 2767.29 |
-- | Jose     | 2020-06-02T13:00:00.000Z | 1924.92 |
