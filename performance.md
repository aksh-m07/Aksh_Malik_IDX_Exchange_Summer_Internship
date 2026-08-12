# Filter Performance Notes

## Query tested

mysql EXPLAIN SELECT * FROM rets_property  WHERE LOWER(TRIM(L_City)) = LOWER(TRIM('Los Angeles'))  AND L_SystemPrice >= 500000  AND L_SystemPrice <= 1000000  AND L_Keyword2 = 3  AND LM_Dec_3 = 2  ORDER BY L_SystemPrice DESC  LIMIT 20 OFFSET 0;

## Before adding indexes

+----+-------------+---------------+------------+------+---------------+------------+---------+-------+------+----------+-----------------------------+
| id | select_type | table         | partitions | type | possible_keys | key        | key_len | ref   | rows | filtered | Extra                       |
+----+-------------+---------------+------------+------+---------------+------------+---------+-------+------+----------+-----------------------------+
|  1 | SIMPLE      | rets_property | NULL       | ref  | idx_L_City    | idx_L_City | 203     | const | 3444 |     0.11 | Using where; Using filesort |
+----+-------------+---------------+------------+------+---------------+------------+---------+-------+------+----------+-----------------------------+
1 row in set, 1 warning (0.00 sec)


## Output Columns Meanings

- **id** — Identifies each step in the query plan. A query with no subqueries has just one step thus we have `id=1`.
- **select_type** — The type of SELECT. `SIMPLE` means no subqueries or unions were involved.
- **table** — Which table this row of the plan refers to.
- **partitions** — Which table partitions are involved. `NULL` since this table isn't partitioned.
- **type** — The type MySQL will use to find rows.  `ALL` means a full table scan, every row gets checked. 
- **possible_keys** — Indexes MySQL could use for this query, based on the columns in WHERE/JOIN. `NULL` means no relevant index exists at all.
- **key** — The index MySQL actually chose to use, out of `possible_keys`. `NULL` means none were available to choose from.
- **key_len** — The number of bytes of the chosen index MySQL is using. `NULL` when no index is used.
- **ref** — What's being compared against the index, a column, a constant, etc. `NULL` when no index is involved.
- **rows** — MySQL's estimate of how many rows it will need to examine to produce the result.
- **filtered** — The estimated percentage of the examined rows that actually satisfy the WHERE conditions after being read.
- **Extra** — Additional details about the plan. `Using where` (filtering happens after rows are fetched, not via an index), `Using filesort` (MySQL needs a separate sorting pass since no index provides pre-sorted order)

## Index creation query and output
mysql> CREATE INDEX idx_city_price ON rets_property (L_City, L_SystemPrice);
Query OK, 0 rows affected (1.08 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> Show index from rets_property
    -> ;
+---------------+------------+------------------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table         | Non_unique | Key_name               | Seq_in_index | Column_name   | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+---------------+------------+------------------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| rets_property |          0 | PRIMARY                |            1 | id            | A         |       36207 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| rets_property |          1 | idx_L_ListingID        |            1 | L_ListingID   | A         |       36207 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| rets_property |          1 | idx_L_City             |            1 | L_City        | A         |         907 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| rets_property |          1 | idx_L_Zip              |            1 | L_Zip         | A         |        1408 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| rets_property |          1 | idx_L_DisplayId        |            1 | L_DisplayId   | A         |       36207 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| rets_property |          1 | idx_rets_property_type |            1 | L_Type_       | A         |          19 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| rets_property |          1 | idx_city_price         |            1 | L_City        | A         |        1005 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| rets_property |          1 | idx_city_price         |            2 | L_SystemPrice | A         |       36207 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| rets_property |          1 | ft_remarks             |            1 | L_Remarks     | NULL      |       36207 |     NULL |   NULL | YES  | FULLTEXT   |         |               | YES     | NULL       |
+---------------+------------+------------------------+--------------+---------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
9 rows in set (0.00 sec)

## Composite index creation
CREATE INDEX idx_city_price ON rets_property (L_City, L_SystemPrice);
AQuery OK, 0 rows affected (0.86 sec)
Records: 0  Duplicates: 0  Warnings: 0

 ## Performance After composite index
 mysql> EXPLAIN SELECT * FROM rets_property  WHERE L_City = 'Los Angeles'  AND L_SystemPrice >= 500000  AND L_SystemPrice <= 1000000  AND L_Keyword2 = 3  AND LM_Dec_3 = 2  ORDER BY L_SystemPrice DESC  LIMIT 20 OFFSET 0;
+----+-------------+---------------+------------+-------+---------------------------+----------------+---------+------+------+----------+---------------------------------------------------------+
| id | select_type | table         | partitions | type  | possible_keys             | key            | key_len | ref  | rows | filtered | Extra                                                   |
+----+-------------+---------------+------------+-------+---------------------------+----------------+---------+------+------+----------+---------------------------------------------------------+
|  1 | SIMPLE      | rets_property | NULL       | range | idx_L_City,idx_city_price | idx_city_price | 208     | NULL | 1273 |     1.00 | Using index condition; Using where; Backward index scan |
+----+-------------+---------------+------------+-------+---------------------------+----------------+---------+------+------+----------+---------------------------------------------------------+
1 row in set, 1 warning (0.00 sec)
