-- NAME: check_square_order_duplicates
-- CN_NAME: 检查Square重复订单
-- DESCRIPTION: Detects duplicate orders in the last 3000 order records in the Square order system.
-- CN_DESCRIPTION: 检测 Square 订单系统中最近 3000 条订单记录中的重复订单。
/*
Purpose: 检测 Square 订单系统中最近 3000 条订单记录中的重复订单
Scope: 最近 3000 条订单记录
Author: Williams
Created: 2025/4/6
*/

-- 模块 1：基础重复检测
WITH recent_base_orders AS (
  SELECT 
    square_order_id,
    created_at
  FROM orders."order_square"
  ORDER BY created_at DESC
  LIMIT 3000
)
SELECT 
  square_order_id AS base_duplicate_id,
  COUNT(*) AS duplicate_count
FROM recent_base_orders
GROUP BY square_order_id
HAVING COUNT(*) > 1
LIMIT 10;

-- 模块 2：关联订单ID的深度检测
WITH recent_joined_orders AS (
  SELECT 
    square_order_id,
    id AS order_id
  FROM orders."order_square"
  ORDER BY created_at DESC
  LIMIT 3000
)
SELECT 
  j.square_order_id AS joined_duplicate_id,
  COUNT(j.order_id) AS id_duplicate_count
FROM recent_joined_orders j
GROUP BY j.square_order_id
HAVING COUNT(j.order_id) > 1
LIMIT 10;
