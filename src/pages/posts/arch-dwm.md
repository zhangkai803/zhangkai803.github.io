---
layout: ../../layouts/MarkdownPostLayout.astro
author: "k"
pubDate: "2023-01-09"
title: "Arch - DWM"
tags: ["successes"]
---

## Arch

- 镜像下载
- Rufus 录入
- 进入安装
- 格式化硬盘 + 分区 fdisk
  - 300M EFI
  - 512M swap
  - 剩余空间 root
- 挂载新分区
  - root - /mnt
  - efi - /mnt/boot
- 网络安装
- 预安装软件
- 进入新系统，配置 arch-chroot /mnt
- 安装 bootloader GRUB 到 /mnt/boot/EFI, 创建引导配置 /mnt/boot/grub.cfg
- 退出新系统
- 取消挂载
- 重启

## DWM

- pacman -S git
- pacman -S base-devel
- pacman -S xorg
- git clone git://git.suckless.org/dwm
- make install
- echo "exec dwm" >> ~/.xinitrc
- startx

## yay

- git clone
- go env -w GOFLAGS="-buildvcs=false"
- makepkg -si

## sshd

- pacman -S openssh
- /etc/ssh/sshd_config
  - uncomment auth passwd
  - PermitRootLogin yes
- systemctl start sshd
