/*
Name: square-orders-sync-to-infi-daily
CN_Name: Square订单可以进入INFI
Description: Ensure that square orders can sync to INFI daily
CN_Description: 确保每天都要有square的订单进入INFI系统
Scope: All Square Prod Data for Real Merchant
CN_Scope: 所有Square的Prod环境的真实用户的订单
Author: Williams
Created: 2025/5/7
*/

-- Make a query to check the square order count for the last 3 days
WITH date_series AS (SELECT generate_series(
                                            CURRENT_DATE - INTERVAL '1 days', -- 过去3天
                                            CURRENT_DATE,
                                            INTERVAL '1 day'
                            )::date AS order_date),
     square_orders AS (SELECT DATE(created_at) AS order_date,
                              COUNT(*)         AS square_order_count
                       FROM orders.order
                       WHERE source_type LIKE '%SQU%'
                       GROUP BY DATE(created_at))
SELECT d.order_date,
       COALESCE(s.square_order_count, 0) AS square_order_count
FROM date_series d
         LEFT JOIN square_orders s ON d.order_date = s.order_date
WHERE COALESCE(s.square_order_count, 0) = 0
ORDER BY d.order_date DESC;