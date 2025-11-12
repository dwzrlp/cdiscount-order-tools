# 🛠️ Cdiscount 订单工具

一个简单实用的 Tampermonkey 脚本，用于在 Cdiscount 订单页面中添加两个快速操作按钮：

- **修改金额（Changer prix）**
- **隐藏地址（Effacer adresse）**

同时自动显示提醒信息：
> ⚠️ 下单凭证截图请勿包含此区域  
> ⚠️ Attention de ne pas mettre cette partie dans la capture de commande  
> ⚠️ Do NOT include this area in your order screenshot  

---

## 🌍 功能特色

- 🖤 黑色简洁风界面  
- 🌐 支持 **中文 / Français / English** 自动切换  
- 🪄 即点即改，无需刷新页面  
- 🧹 一键隐藏收货地址信息  
- 🔄 支持自动更新（Tampermonkey 会检测新版本）

---

## 🧩 安装方法

1. 安装浏览器扩展 [Tampermonkey](https://www.tampermonkey.net/)
2. 点击下方链接安装脚本：

   👉 [点击安装脚本](https://raw.githubusercontent.com/dwzrlp/cdiscount-order-tools/main/cdiscount-order-tools.user.js)

3. 打开 Cdiscount 网站订单页（如 `https://www.cdiscount.com/account/orderlist.html`）
4. 脚本自动在订单信息上方插入操作栏。

---

## 📸 预览

| 功能 | 效果 |
|------|------|
| 改价按钮 | 直接修改订单显示金额 |
| 隐藏地址按钮 | 删除收货地址区块 |
| 提醒信息 | 黄色警告条防止截图误区 |

---

## 🧠 技术信息

- **语言自动检测**：根据网页语言、域名与浏览器语言自动切换  
- **脚本运行时机**：`document-idle`（页面加载完成后执行）  
- **支持网站**：
  - `https://*.cdiscount.fr/*`
  - `https://*.cdiscount.com/*`

---

## 🔄 自动更新机制

Tampermonkey 每隔数天自动访问以下地址检测更新：

```text
@updateURL    https://raw.githubusercontent.com/dwzrlp/cdiscount-order-tools/main/cdiscount-order-tools.user.js
@downloadURL  https://raw.githubusercontent.com/dwzrlp/cdiscount-order-tools/main/cdiscount-order-tools.user.js
