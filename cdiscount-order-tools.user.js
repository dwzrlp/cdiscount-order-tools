// ==UserScript==
// @name         Cdiscount 订单工具
// @namespace    https://github.com/dwzrlp/cdiscount-order-tools
// @version      1.6.5
// @description  在订单页面添加改价与隐藏地址按钮，附带截图提醒（中/英/法自动切换）。
// @author       HyperNovaSigma
// @match        *://*.cdiscount.fr/*
// @match        *://*.cdiscount.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/dwzrlp/cdiscount-order-tools/main/cdiscount-order-tools.user.js
// @downloadURL  https://raw.githubusercontent.com/dwzrlp/cdiscount-order-tools/main/cdiscount-order-tools.user.js
// ==/UserScript==

(function () {
  "use strict";

  const I18N = {
    fr: {
      btnChange: "Changer prix",
      btnErase: "Effacer adresse",
      prompt: "Nouveau montant payé (ex: 18,99) :",
      warn: "⚠️ Attention de ne pas mettre cette partie dans la capture de commande",
      payePar: "0.00 € payé par Carte Bancaire avec 3D-Secure",
    },
    en: {
      btnChange: "Change price",
      btnErase: "Remove address",
      prompt: "New paid amount (e.g. 18.99 or 18,99):",
      warn: "⚠️ Do NOT include this area in your order screenshot",
      payePar: "0.00 € paid by credit card with 3D-Secure",
    },
    zh: {
      btnChange: "修改金额",
      btnErase: "隐藏地址",
      prompt: "请输入新金额（例如：18,99 或 18.99）：",
      warn: "⚠️ 下单凭证截图请勿包含此区域",
      payePar: "使用信用卡通过 3D 安全验证支付 0.00 欧元",
    },
  };

    function detectLang() {
        // 1️⃣ 先看浏览器语言（最符合“用户自己的语言习惯”）
        const nav = (navigator.language || navigator.userLanguage || "").toLowerCase();
        if (nav.startsWith("zh")) return "zh";
        if (nav.startsWith("fr")) return "fr";
        if (nav.startsWith("en")) return "en";

        // 2️⃣ 再看页面 <html lang="...">
        const htmlLang = (document.documentElement.lang || "").toLowerCase();
        if (htmlLang.startsWith("zh")) return "zh";
        if (htmlLang.startsWith("fr")) return "fr";
        if (htmlLang.startsWith("en")) return "en";

        // 3️⃣ 最后才按域名猜
        const host = location.hostname.toLowerCase();
        if (host.endsWith(".fr")) return "fr";
        return "en"; // 默认英文
    }

  const LANG = detectLang();
  const T = I18N[LANG] || I18N.en;

  GM_addStyle(`
    .cd-btn-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 10px;
      padding: 10px;
      background: #f2f2f2;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .cd-btn {
      padding: 8px 16px;
      border-radius: 24px;
      cursor: pointer;
      color: white;
      font-weight: bold;
      text-align: center;
      transition: all 0.2s ease;
      user-select: none;
    }
    .cd-btn:hover { opacity: 0.9; }
    .cd-btn-modifier { background-color: #3732FF; }
    .cd-btn-modifier:hover { background-color: #1f1cbf; }
    .cd-btn-effacer { background-color: #FF3B30; }
    .cd-btn-effacer:hover { background-color: #bf2a24; }
  `);

  function addButtons() {
    const cmdRecaps = document.querySelectorAll(".czCmdRecap");
    cmdRecaps.forEach((cmdRecap) => {
      const innerDiv = cmdRecap.querySelector("div:first-child");
      if (!innerDiv || innerDiv.querySelector(".cd-btn-container")) return;

      const warning = document.createElement("div");
      warning.textContent = T.warn;
      warning.style.cssText = `
        background: #FFF3CD;
        color: #856404;
        border: 1px solid #FFE69C;
        padding: 8px 12px;
        border-radius: 6px;
        margin-bottom: 8px;
        font-weight: bold;
        font-size: 13px;
      `;

      const buttonsRow = document.createElement("div");
      buttonsRow.style.display = "flex";
      buttonsRow.style.gap = "10px";

      const btnContainer = document.createElement("div");
      btnContainer.className = "cd-btn-container";

      const btnModifier = document.createElement("div");
      btnModifier.className = "cd-btn cd-btn-modifier";
      btnModifier.textContent = T.btnChange;
      btnModifier.addEventListener("click", () => {
          const headerLeft = cmdRecap.querySelector(".czOrderHeaderBlocLeft");
          if (!headerLeft) return;

          const montant = prompt(T.prompt);
          if (!montant) return;

          let normalized = montant.trim().replace(",", "."); // unifie la saisie
          let numeric = parseFloat(normalized);

          if (isNaN(numeric)) {
              alert("Veuillez entrer un nombre valide.");
              return;
          }

          // Formate toujours avec 2 décimales et une virgule
          normalized = numeric.toFixed(2);

          if(LANG == 'fr'){
              normalized = normalized.replace('.',',');
          }

          for (const node of headerLeft.childNodes) {
              if (node.nodeType === Node.TEXT_NODE) {
                  const trimmed = node.textContent.trim();
                  if (trimmed.length > 0) {
                      node.textContent = node.textContent.replace(
                          /[\d\s]+,[\d]{2}\s*|[\d\s]+\.[\d]{2}\s*/,
                          `${normalized} `
                      );
                  }
              }
          }
      });

      const btnEffacer = document.createElement("div");
      btnEffacer.className = "cd-btn cd-btn-effacer";
      btnEffacer.textContent = T.btnErase;
      btnEffacer.addEventListener("click", () => {
        const detailBloc = cmdRecap.nextElementSibling;
        if (!detailBloc) return;
        const deliveryBloc = detailBloc.querySelector(".czOrderDeliveryBloc");
        if (deliveryBloc) deliveryBloc.remove();
      });

      buttonsRow.appendChild(btnModifier);
      buttonsRow.appendChild(btnEffacer);
      btnContainer.appendChild(buttonsRow);
      btnContainer.appendChild(warning);
      innerDiv.insertBefore(btnContainer, innerDiv.firstChild);
    });
  }

  if (document.body) addButtons();
  else document.addEventListener("DOMContentLoaded", addButtons);
})();
