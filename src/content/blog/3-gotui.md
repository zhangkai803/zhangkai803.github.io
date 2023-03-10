---
# layout: ../../layouts/MarkdownPostLayout.astro
author: "k"
pubDate: "2023-01-13"
title: "Go TUI 尝试"
tags: ["go", "TUI"]
description: ""
---

之前写过一个查看集群日志的小工具，用 go 爬取公司内部平台的 websocket 消息流。

随着慢慢迭代，参数越来越多，比如环境、项目、服务、tail 行数等，感觉手写麻烦，如果用的不熟还记不住那么多选项。

所以想着写个 UI，爬日志的工具本身就已经编译成可执行文件了，所以可以换个语言，只需要能够开子进程就行。

尝试了 C++ Qt、python textual 等，发现都要写 CSS，可惜审美能力不足。对 CSS 也提不起兴趣。

最后发现了这个框架。

## GO 的极简 TUI 框架 - bubbletea

GitHub 仓库地址：[bubbletea](https://github.com/charmbracelet/bubbletea)

上手非常简单，框架设计的 API 也很精简，是我喜欢的风格。

界面是用纯字符串画的，写界面就像 print to console，码字、换行、加符号，所见即所得，简单的几行字和符号显示在终端里却有非常炫酷的感觉。

看 API 文档发现好像能支持鼠标操作，也可以写 CSS，对我来说都不需要，全键盘操作最好。

放点截图吧，不会做 GIF。

![screenshot1](../../../images/gotui1.png)

![screenshot2](../../../images/gotui2.png)

![screenshot3](../../../images/gotui3.png)
