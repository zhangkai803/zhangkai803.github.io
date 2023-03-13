---
author: "k"
pubDate: "2023-03-10"
title: "Rust 终端小游戏 FlappyBird"
tags: ["rust"]
description: ""
---

跟着 B站 一个视频敲出来的，视频总时长约 30 分钟，我自己跟着敲一遍花了约一个小时，一是因为不太熟练，二是视频有加速。

源码放在[这里](https://github.com/zhangkai803/flappy_bird)，非常简单就一个`main.rs`。

简单回顾一下涉及到的几个知识点：

- 结构体
- Rust 面向对象
- 枚举
- 可变引用
- 模式匹配
- 游戏本身的主循环以及逐帧渲染就不展开说了，是通用的做法，感兴趣的跑一下代码试试，参阅<https://github.com/amethyst/bracket-lib>

项目里没写`readme`（坏习惯），补充一下怎么运行：

- 安装 rust 主要的工具链：runstup + cargo，参考<https://doc.rust-lang.org/book/ch01-00-getting-started.html>
- 然后`cargo run`就可以跑起来，会自动安装依赖
