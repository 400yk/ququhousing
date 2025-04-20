-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2023-03-02 10:58:47
-- 服务器版本： 5.7.34-log
-- PHP 版本： 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE TABLE IF NOT EXISTS `userInfo` (
  `userId` int PRIMARY KEY AUTO_INCREMENT COMMENT 'id',
  `username` varchar(32) NOT NULL COMMENT '用户名',
  `phone` varchar(32) DEFAULT NULL COMMENT '手机号',
  `roles` varchar(32) NOT NULL COMMENT '用户权限',
  `nickname` varchar(32) DEFAULT NULL COMMENT '昵称',
  `password` varchar(60) NOT NULL COMMENT 'bcrypt加密密码',
  `level` int(2) DEFAULT 1 COMMENT '会员等级',
  `point` int(8) DEFAULT 100 COMMENT '会员积分',
  `demandDescription` text COMMENT '购房需求描述',
  `registeredSince` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '会员注册时间',
  `memberExpiration` datetime NOT NULL DEFAULT (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3 DAY) + INTERVAL 1 DAY - INTERVAL 1 SECOND) COMMENT '会员到期时间',
  UNIQUE (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `orderList` (
  `orderId` int PRIMARY KEY AUTO_INCREMENT COMMENT 'id',
  `userId` int COMMENT '用户ID',
  `username` varchar(32) COMMENT '用户名',
  `order_num` varchar(32) DEFAULT NULL COMMENT '订单号',
  `order_time` varchar(32) DEFAULT NULL COMMENT '创建时间',
  `order_price` float DEFAULT NULL COMMENT '订单价格（真实价格）',
  `order_money` float DEFAULT NULL COMMENT '订单价格（支付金额）',
  `order_paytime` varchar(32) DEFAULT NULL COMMENT '支付时间',
  `order_status` int(2) NOT NULL DEFAULT '1' COMMENT '支付状态（1未支付 2已支付）',
  `order_msg` text COMMENT '原文',
  CONSTRAINT `fk_order_userId` FOREIGN KEY (`userId`) REFERENCES `userInfo`(`userId`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_username` FOREIGN KEY (`username`) REFERENCES `userInfo`(`username`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `userAuth` (
  `userId` int COMMENT '用户ID',
  `refresh_token` VARCHAR(255),
  CONSTRAINT `fk_auth_userId` FOREIGN KEY (`userId`) REFERENCES `userInfo`(`userId`) ON DELETE CASCADE,
  UNIQUE (`userId`),
  UNIQUE (`refresh_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `searchHistory` (
  `searchId` INT PRIMARY KEY AUTO_INCREMENT COMMENT '搜索ID',
  `userId` int COMMENT '用户ID',
  `username` varchar(32), 
  `search_query` text COMMENT '搜索内容',
  `search_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '搜索时间',
  CONSTRAINT `fk_search_userId` FOREIGN KEY (`userId`) REFERENCES `userInfo`(`userId`) ON DELETE CASCADE,
  CONSTRAINT `fk_search_username` FOREIGN KEY (`username`) REFERENCES `userInfo`(`username`) ON DELETE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8;
--
-- 转储表的索引
--

--
-- 表的索引 `mqpay_order`
-- --
-- ALTER TABLE `orderList`
--   ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `mqpay_order`
-- --
-- ALTER TABLE `orderList`
--   MODIFY `id` int(5) NOT NULL AUTO_INCREMENT COMMENT 'id';
-- COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
