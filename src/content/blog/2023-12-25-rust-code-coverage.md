---
author: "k"
pubDate: "2023-12-25"
title: "Rust 项目单测覆盖率"
tags: ["rust", "coverage"]
description: ""
---

共有 2 种比较方便的方式

## tarpaulin

介绍一下[`tarpaulin`](https://github.com/xd009642/tarpaulin)

安装：`cargo install cargo-tarpaulin`

支持的功能比较多，文档很全不再赘述。等后面使用一段时间再补充一些常用的场景和踩坑记录

运行测试并得到覆盖率：`cargo tarpaulin --out Html`

这是我尝试之后相对满意的一个解决方案。执行之后会在项目跟目录生成一个单独的
`tarpaulin-report.html`文件，在浏览器中打开即可看到覆盖详情，唯一的缺点是没有行号，怀疑是我
自己没有配置好，毕竟显示行号这个功能比较简单

![image](../../images/tarpualin_report.png)

## cargo-llvm-cov

`cargo-llvm-cov`是一个使用`source-based code coverage`的工具：
[`llvm-cov`](https://lib.rs/crates/cargo-llvm-cov#readme-usage)。

安装：`cargo +stable install cargo-llvm-cov --locked`

使用：`cargo llvm-cov --open`，生成`html`格式覆盖率报告，位于`target/llvm-cov/html`

首次运行会安装依赖：`rustup component add llvm-tools-preview --toolchain stable-x86_64-apple-darwin`

结论：极大地提升了使用`LLVM source-based code coverage`的效率，与`tarpaulin`相比，
覆盖率报告是按文件分布的，报告中有行号显示，但是页面展示效果不够明显

![image](../../images/llvm_cov_report.png)

## Rust 的覆盖率统计方案

如果直接 google `rust code coverage`，最先获取的信息应该是
[The rustc book](https://doc.rust-lang.org/rustc/instrument-coverage.html)，
其中提到的`rustc`包括两种代码覆盖率实现：

- `gcov-based coverage implementation`，基于 DebugInfo 生成覆盖率数据
- `LLVM source-based code coverage`，一个基于源代码的代码覆盖率实现，编译时使用`-C instrument-coverage`标志开启，它使用LLVM的原生、高效的覆盖工具来生成非常精确的覆盖数据。

但因为是编译器层面的支持，直接使用起来有点麻烦

然后基于 google 的搜索结果，我们进入[`Reddit`的`r/rust`论坛](https://www.reddit.com/r/rust/comments/y3zzze/rust_project_test_coverage/)，还可以找到上面用到的，基于已有的覆盖文件统计覆盖率的工具：[grcov](https://github.com/mozilla/grcov)

```sh
CARGO_INCREMENTAL=0 RUSTFLAGS='-Cinstrument-coverage' LLVM_PROFILE_FILE='cargo-test-%p-%m.profraw' cargo test
grcov . --binary-path ./target/debug/deps/ -s . -t html --branch --ignore-not-existing --ignore '../*' --ignore "/*" -o target/coverage/html
grcov . --binary-path ./target/debug/deps/ -s . -t lcov --branch --ignore-not-existing --ignore '../*' --ignore "/*" -o target/coverage/tests.lcov
```

## 其他

一篇博客介绍[如何使用`rust`统计代码覆盖率](https://blog.rng0.io/how-to-do-code-coverage-in-rust/)
