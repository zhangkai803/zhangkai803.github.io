---
author: "k"
pubDate: "2024-03-18"
title: "Rust 学习进度回顾"
tags: ["rust"]
description: ""
---

最近在写 rust 的时候，感觉还是很吃力，感觉自己学习 rust 的进度缓慢，可能到了所谓的平台期。
回顾一下我的学习进度，做一个阶段性的总结，认清自己的定位，也整理一下有多少收获，希望能有更多动力。

## 我是什么时候开始接触 rust ？

如果基于 github 的 commit history 来追溯的话：

2023 年 3 月 7 日，提交了[一个终端渲染的小游戏](https://github.com/zhangkai803/flappy_bird)

- 我学了如何使用 bracket-lib，体验就像 go 的 bubbletea

2023 年 7 月 15 日，第一次提交 [rustlings 的部分题解](https://github.com/zhangkai803/rustlings/commit/9792f009850e8c4e4fe5b173a3e7d85d3cbbec15)，中间工作忙间歇性中断，终于在 8 月 9 日我提交了全部的题解

- 此时应该已经将 the Book 过了第一遍，我迫不及待想写一些 rust 代码

2023 年 10 月 20 日，提交了[一个翻译日语罗马音的命令行工具](https://github.com/zhangkai803/romaji)

- 我学会了用 clap 编写命令行工具，使用 reqwest 作为 http client，以及第一次使用 tokio

2023 年 11 月 7 日，提交了[一个 discord bot demo](https://github.com/zhangkai803/discord-bots)

- 把上面提到的罗马音翻译工具集成到了我的 server 里，我学会了如何开子进程并且监听 stdout

2023 年 12 月 25 日，第一次[给 salvo 提交单测](https://github.com/salvo-rs/salvo/commit/2ec35d40372bbfa24cceea52afb8855f18c406e8)

- 我学会了如何统计 rust 项目的单测覆盖率，第一次知道还可以给 cargo 扩展子命令

2024 年 3 月 7 日，我[用 iced 将平时自用的爬日志工具写成了跨平台的桌面应用](https://github.com/zhangkai803/kklogIced)

- 从构建页面布局，到添加响应事件，监听 websocket，我学会了在 rust 中开发 ELM 应用

我最开始入门是读的 [the Book 英文版](https://doc.rust-lang.org/book/)，惊讶于这个语言设计的严谨性以及社区文档的完整性，就像很多人一样被吸引然后决定入坑。截止到码字的时间，已经超过一年了。

## 我都学到了什么呢

- rustup cargo 这些工具链熟悉了
- Cargo.toml Cargo.lock 项目结构基本理解了
- 关键字都熟悉了
- 基本类型、容器类型、泛型都尝试了
- trait 和 derive 理解了
- move copy clone 最核心的所有权机制基本了解了
- 引用类型的生命周期认识了
- 测试会写了
- 简单的异步编程写过了
- 过程宏 命令宏 刚会读还不会写
- unsafe 这些 dark magic 还没实践过
- crates.io 逛熟了，想要的 crate 会找了

总结下来，有一些进步，应该可以说不是一个小白，但也没有实质产出的能力。

到这里其实是有点失望的。

## 为什么慢呢

- rust 自身的难度

    ![image](../../../images/rust_curve.webp)

    ![image](../../../images/dk_effect.webp)

    > 图源网络

    对于绝大多数人而言，学习 rust 的进度应该都与上面的曲线不谋而合。我现在应该还在向绝望之谷进发，毕竟还在想办法寻找动力。

- 我本人付出的时间

    这一年多的时间一直是全职的，且工作内容不相关。虽然空余时间基本都给了 rust，但总体付出的精力不能算多。

- 外部合适的资源

    除了 the Book 和 youtube 上的一些视频，我没有购买任何系统化的 rust 教程或参与线上的训练营。可能因为身处在线教育行业，我对知识付费的看法不太乐观。

    日常依赖的还得算上 GPT，但是 GPT-4 的知识库只更新到 2023 年 4 月 23 日，基础知识问答还可以，一旦真正进行代码生成表现就比较差。

## 有哪些做的好的地方

1. 尝试了足够多的方向（辩证地说也不算好，毕竟涉猎太多也没有特别精通的，介于我的水平还不足以支撑我深耕某一领域，姑且算作好事）

    - 用 salvo 进行 Web 开发
    - 用 bracket-lib/bevy 游戏开发
    - 用 iced 写桌面应用

2. 坚持读英文文档
3. 参与了 rustcc 线下 meetup
4. 加入了几个社区群，找到了共同爱好的人
5. 尽微薄之力为 rust 开源做了贡献

## TODOs

1. 首先还是要继续写，多尝试，多实践
2. 换一个能抓取实时信息的 AI 助手，比如 kimi chat
3. 付费课程的话，暂时还是不考虑

> Updated at 23:56 on March 21, 2024
