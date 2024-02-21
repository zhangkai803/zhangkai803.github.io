---
author: "k"
pubDate: "2024-02-21"
title: "Fine-tuning 大语言模型微调"
tags: ["ai", "fine-tuning"]
description: ""
---

> [对通用大语言模型进行细分知识场景的训练](https://platform.openai.com/docs/guides/fine-tuning)

微调带来的能力

- 高质量的输出结果
- 兼容更多case而不是一个场景的prompt
- 节省 token
- 低延迟

大致步骤：

- 准备训练数据
- 训练一个微调模型
- 验证结果，如有需要继续回到步骤一
- 使用微调模型

费用：![screenshot1](../../../images/openai_fine_tuning_pricing.png)

哪些模型可微调：

> gpt-3.5-turbo-1106 (recommended), gpt-3.5-turbo-0613, babbage-002, davinci-002, and gpt-4-0613 (experimental). Support for gpt-3.5-turbo-0125 is coming soon.

决定场景是否适用：（优先使用提示工程/提示链）

- 任务步骤多，但是可通过正确的提示语来达到更好的效果
- 优化提示语或其他策略更有性价比
- 以上2点都已做完，仍未达到预期效果，在此基础上开始微调

常用场景：

- 设定风格、语气、格式或其他定性方面
- 提高生产所需产品的可靠性
- 纠正无法遵循复杂提示的错误
- 以特定的方式处理许多边缘情况
- 执行一项很难用提示语表达的新技能或任务
- （降低成本和/或延迟）

微调实践：

- 按格式准备训练集
- 制作提示语
- 数据量：最低10，推荐50-100，每次新增一倍
- 拆分数据集：训练集+测试集
- token数量限制
- 估算成本
- 检查数据格式（有工具）
- 上传训练数据：client.files.create
- 创建微调模型：client.fine_tuning.jobs.create
- 使用
- 分析及优化

多次微调

- 微调训练集：少数+高质量 > 多数+低质量
- 微调超参数：hyperparameters
