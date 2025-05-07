/*
Name: check-square-order-duplicates
CN_Name: 检查Square重复订单
Description: Ensure square orders can map to INFI unique
CN_Description: 确保Square的订单映射到INFI系统时生成唯一的order_id
Scope: All Square Prod Orders for Real Merchant
CN_Scope: 所有Square的Prod环境的真实用户的订单
Author: Williams
Created: 2025/4/6
*/

-- Detect duplicate orders in the most recent 3000 order records in Square order system
WITH recent_orders AS (
    SELECT square_order_id
    FROM orders."order_square"
    ORDER BY created_at DESC
    LIMIT 3000
)
SELECT square_order_id, COUNT(*)
FROM recent_orders
GROUP BY square_order_id
HAVING COUNT(*) > 1
LIMIT 10;