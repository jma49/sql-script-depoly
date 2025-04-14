-- NAME: 检查 Square 重复订单
-- DESCRIPTION: 检测 Square 订单系统中最近 3000 条订单记录中的重复订单。

/*
Purpose: 检测 Square 订单系统中的重复订单
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

-- 安全保护：禁止修改操作
DO $$
BEGIN
  IF current_query() LIKE '%UPDATE%' OR current_query() LIKE '%DELETE%' THEN
    RAISE EXCEPTION 'Read-only script: 此脚本仅用于查询，禁止执行修改操作';
  END IF;
END $$;