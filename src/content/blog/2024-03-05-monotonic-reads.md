---
author: "k"
pubDate: "2024-03-05"
title: "Monotonic reads 单调读"
tags: ["distributed", "transaction"]
description: ""
---

今天在看 MongoDB 文档的时候，读到 non-monotonic reads 一词，名字很熟悉，但是印象已经模糊了，查漏补缺一下。

## 单调读 monotonic reads

单调读（monotonic reads）是数据库事务中的一个概念，是事务一致性保证中的一个方面。指在一个事务或会话中，随着时间的推移，读取到的数据不会“回退”。

一致性约束强度：强一致性 > 单调读 > 最终一致性 > 弱一致性。在讨论分布式事务的一致性约束时，不太常提起单调读，但它能提供的保证比最终一致性更强。

### 分布式事务回顾

#### CAP 定理

CAP 定理指出，分布式系统不可能同时满足以下三个要求，强调了设计分布式系统时面临的根本性权衡：

- 一致性（Consistency）：所有节点在同一时间看到的数据是相同的
- 可用性（Availability）：系统应该保证服务总是可用的，不会出现拒绝服务的情况
- 分区容错性（Partition tolerance）：系统应该能够在任意数量的网络分区发生时继续工作，允许部分故障

#### BASE 理论

BASE 理论是对 CAP 中一致性和可用性权衡的一种实现方式，它提供了一种在放宽一致性要求下实现高可用性和可伸缩性的设计原则。

- Basically Available（基本可用）：系统保证核心功能可用，即使是在出现故障的情况下，也能提供服务，但性能可能下降
- Soft-state（软状态）：允许系统在没有输入的情况下改变状态，意味着系统的状态不需要实时保持一致，而是可以延迟一致
- Eventual consistency（最终一致性）：系统保证在没有新的更新操作的情况下，数据最终将达到一致的状态，这意味着给定足够的时间，所有节点最终都将同步到最新的状态

### 传统事务回顾

#### ACID

- Atomicity（原子性）：事务中的所有操作要么全部完成，要么全部不完成
- Consistency（一致性）：事务执行前后，数据库的完整性约束没有被破坏。例如，如果一个事务的作用是转账，那么不管事务成功还是失败，转账前后两个账户的总金额应该保持不变
- Isolation（隔离性）：并发执行的事务彼此隔离，事务的执行不会互相干扰
- Durability（持久性）：一旦事务被提交，它对数据库的修改就是永久性的，即使发生系统崩溃，数据库系统也能保证数据不丢失。

#### 隔离级别

- 读未提交（Read uncommitted）：一个事务还没提交时，它做的变更就能被别的事务看到
- 读已提交（Read committed）：一个事务提交之后，它做的变更才会被其他事务看到
- 重复读（Repeatable read）：一个事务执行过程中看到的数据，总是跟这个事务在启动时看到的数据是一致的。另外一个事务对该数据的修改，在这个事务中不会被看到
- 串行化（Serializable）：对于同一行记录，写会加排它锁，读会加共享锁。当出现读写冲突的时候，后访问的事务必须等前一个事务执行完成，才能继续执行

#### 脏读

读到其他事务未提交的数据

解决方案：提升隔离级别到 RC

#### 不可重复读

读到已提交但被其他事务修改的数据，导致前后结果不一致

解决方案：

- 提升隔离级别到 RR
- 乐观并发控制（Optimistic Concurrency Control，OCC），在数据更新时检查数据是否在事务开始后被修改过

#### 幻读

读到已提交但被其他事务插入的数据，跟不可重复读的区别在于，幻读通常出现在查询多条数据的时候

解决方案：

- 提升隔离级别到 Serializable
- GapsLock 锁住间隙
- MVCC

### 存一些链接

<https://jepsen.io/consistency/models/monotonic-reads>
