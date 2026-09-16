/**
 * 开单结账2.0 · S1 确认执行版
 * 行下展 · 员工槽位 + 贴边 sheet（不遮展开区）· iOS 动效
 * 价目=demo 美发子集 · 结算文档流：明细→券→备注
 */
(function () {
  'use strict';

  var HOLD_COUNT = 3;
  var MAX_STAFF = 3;
  var expandKey = null;
  var draft = null;
  var staffSheetOpen = false;
  var priceSheetOpen = false;
  var priceBuf = '';
  var IOS_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

  function guestDisplayName(g) {
    if (g === 'male') return '男散客';
    if (g === 'female') return '女散客';
    return '散客';
  }
  function guestAvatarSrc(g) {
    if (g === 'female') return 'assets/avatar_card_female.png';
    if (g === 'male') return 'assets/avatar_male2.png';
    return 'assets/avatar_default.svg';
  }
  function currentGuestG() {
    var el = document.querySelector('.guest-card');
    return (el && el.getAttribute('data-g')) || 'default';
  }

  /* card/demo.html 价目 · 美发相关（不含美容/美甲/美睫；隐藏&下架不展示） */
  var CATALOG = {
    project: {
      groups: ['洗吹', '烫染', '护理', '剪发造型'],
      items: [
        { g: '洗吹', name: '时尚洗吹', price: 58 },
        { g: '洗吹', name: '洗剪吹', price: 68 },
        { g: '洗吹', name: '洗头', price: 28 },
        { g: '烫染', name: '染发', price: 358 },
        { g: '烫染', name: '漂发', price: 288 },
        { g: '烫染', name: '烫发', price: 398 },
        { g: '烫染', name: '摩根烫', price: 458 },
        { g: '烫染', name: '电棒烫', price: 428 },
        { g: '烫染', name: '挑染', price: 198 },
        { g: '烫染', name: '暖色漂褪', price: 328 },
        { g: '护理', name: '深层滋养', price: 198 },
        { g: '护理', name: '蛋白矫正', price: 598 },
        { g: '护理', name: '头皮护理', price: 168 },
        { g: '剪发造型', name: '精致剪发', price: 98 },
        { g: '剪发造型', name: '儿童剪发', price: 48 },
        { g: '剪发造型', name: '时尚造型', price: 128 }
      ]
    },
    product: {
      groups: ['洗护', '头皮护理', '造型', '烫染护理', '儿童专区'],
      items: [
        { g: '洗护', name: '剑琅修护洗发水', price: 128 },
        { g: '洗护', name: '剑琅滋养护发素', price: 98 },
        { g: '洗护', name: '剑琅控油洗发水', price: 118 },
        { g: '洗护', name: '剑琅护色洗发水', price: 138 },
        { g: '洗护', name: '剑琅儿童护发素', price: 68 },
        { g: '头皮护理', name: '剑琅头皮护理精华', price: 168 },
        { g: '头皮护理', name: '剑琅免洗喷雾', price: 68 },
        { g: '头皮护理', name: '剑琅柔顺发膜', price: 148 },
        { g: '头皮护理', name: '剑琅护发精油', price: 158 },
        { g: '头皮护理', name: '剑琅头皮清洁泥', price: 128 },
        { g: '造型', name: '剑琅哑光发泥', price: 78 },
        { g: '造型', name: '剑琅定型喷雾', price: 88 },
        { g: '烫染护理', name: '剑琅染发护色套装', price: 198 },
        { g: '烫染护理', name: '剑琅漂后修护乳', price: 138 },
        { g: '烫染护理', name: '剑琅护色洗发水', price: 138 },
        { g: '儿童专区', name: '剑琅儿童护发素', price: 68 }
      ]
    }
  };

  var billTab = { s1: 'project', s5: 'project' };
  var billGroup = { s1: '全部', s5: '全部' };

  var PEN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
  var PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var MINUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';
  /* 加入购物车：设计稿实心购物车（来自 Figma 矢量，18.36×18.53） */
  var CART_SVG = '<svg viewBox="0 0 18.36 18.53" fill="currentColor" aria-hidden="true">' +
    '<path d="M 17.08 13.84 L 4.67 13.84 C 4.07 13.84 3.58 13.39 3.55 12.87 L 2.83 1.88 C 2.8 1.28 2.46 0.79 1.93 0.53 L 0.81 0.04 C 0.51 -0.07 0.21 0.04 0.06 0.34 C -0.09 0.64 0.06 0.94 0.36 1.09 L 1.45 1.58 C 1.6 1.66 1.71 1.81 1.71 1.99 L 2.38 12.98 C 2.46 14.11 3.47 15.01 4.63 15.01 L 17.08 15.01 C 17.38 15.01 17.65 14.74 17.65 14.44 C 17.65 14.14 17.38 13.84 17.08 13.84 Z"/>' +
    '<path d="M 17.95 3.38 C 17.61 3.01 17.12 2.78 16.6 2.78 L 5.12 2.78 C 4.82 2.78 4.56 3.04 4.56 3.34 C 4.56 3.64 4.82 3.91 5.12 3.91 L 16.6 3.91 C 16.78 3.91 16.97 3.98 17.08 4.13 C 17.2 4.28 17.27 4.47 17.27 4.66 L 16.37 9.61 L 16.37 9.64 C 16.33 9.98 16.07 10.21 15.73 10.24 L 5.87 10.99 C 5.57 11.03 5.35 11.29 5.35 11.59 C 5.38 11.89 5.61 12.12 5.91 12.12 L 5.95 12.12 L 15.77 11.37 C 16.63 11.29 17.35 10.66 17.42 9.79 L 18.32 4.81 L 18.32 4.77 C 18.43 4.28 18.28 3.76 17.95 3.38 Z"/>' +
    '<path d="M 3.06 17.22 C 3.06 17.57 3.2 17.9 3.44 18.15 C 3.69 18.39 4.02 18.53 4.37 18.53 C 4.72 18.53 5.05 18.39 5.3 18.15 C 5.55 17.9 5.68 17.57 5.68 17.22 C 5.68 16.87 5.55 16.54 5.3 16.29 C 5.05 16.04 4.72 15.91 4.37 15.91 C 4.02 15.91 3.69 16.04 3.44 16.29 C 3.2 16.54 3.06 16.87 3.06 17.22 Z"/>' +
    '<path d="M 13.56 17.22 C 13.56 17.57 13.7 17.9 13.94 18.15 C 14.19 18.39 14.52 18.53 14.87 18.53 C 15.22 18.53 15.55 18.39 15.8 18.15 C 16.05 17.9 16.18 17.57 16.18 17.22 C 16.18 16.87 16.05 16.54 15.8 16.29 C 15.55 16.04 15.22 15.91 14.87 15.91 C 14.52 15.91 14.19 16.04 13.94 16.29 C 13.7 16.54 13.56 16.87 13.56 17.22 Z"/>' +
  '</svg>';
  var CHEV_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function toast(m) { (window.toast || console.log)(m); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function money(n) {
    var x = Number(n) || 0;
    var t = x.toFixed(2);
    var p = t.split('.');
    return '<span class="yen">¥</span>' + p[0] +
      (p[1] !== '00' ? '<span class="dec">.' + p[1] + '</span>' : '');
  }
  function staffList() {
    return window.STAFFS || (typeof STAFFS !== 'undefined' ? STAFFS : []);
  }
  function roleLabel(id) {
    if (typeof staffRoleLabel === 'function') return staffRoleLabel(id);
    var map = { senior: '大工', mid: '中工', junior: '小工' };
    return map[id] || id || '';
  }

  /* ========== 选顾客 ========== */
  function syncHold() {
    $all('[data-hold-count]').forEach(function (el) {
      el.textContent = String(HOLD_COUNT);
    });
    var btn = $('[data-hold-entry]');
    if (btn && !btn._v2) {
      btn._v2 = 1;
      btn.onclick = function () {
        toast('示意：当前有 ' + HOLD_COUNT + ' 笔挂单');
      };
    }
  }

  function wrapPickRows() {
    var list = $('#s4 .pick-list');
    if (!list || list.getAttribute('data-v2-wrapped')) return;
    list.setAttribute('data-v2-wrapped', '1');
    $all('#s4 .pick-row').forEach(function (row) {
      /* 「添加会员」是入口行（新增会员），不参与顾客行的展开/开单逻辑 */
      if (row.hasAttribute('data-add-member')) return;
      var wrap = document.createElement('div');
      wrap.className = 'pick-row-wrap';
      var kind = 'member';
      var key = 'x';
      var oc = row.getAttribute('onclick') || '';
      var nmEl = row.querySelector('.nm');
      var nm = nmEl ? nmEl.textContent.trim() : '';
      if (oc.indexOf("pickGuest('male')") >= 0) { kind = 'guest'; key = 'male'; }
      else if (oc.indexOf("pickGuest('female')") >= 0) { kind = 'guest'; key = 'female'; }
      else if (oc.indexOf('pickChen') >= 0 || nm === '陈女士') key = 'chen';
      else if (nm === '陈昕然') key = 'chenxr';
      else if (nm === '高海泉') key = 'gao';
      else if (nm === '李女士') key = 'li';
      else if (nm === '马婷') key = 'ma';
      else key = nm || 'member';
      row.removeAttribute('onclick');
      row.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = wrap.classList.contains('is-open');
        $all('.pick-row-wrap.is-open').forEach(function (w) {
          w.classList.remove('is-open');
        });
        if (!open) wrap.classList.add('is-open');
      });
      var actions = document.createElement('div');
      actions.className = 'pick-row-actions';
      actions.innerHTML =
        '<button type="button" class="pick-act bill" data-a="bill">开单</button>' +
        '<button type="button" class="pick-act quick" data-a="quick">直接收款</button>';
      actions.onclick = function (e) {
        var b = e.target.closest('[data-a]');
        if (!b) return;
        e.stopPropagation();
        applyPick(kind, key, b.getAttribute('data-a'), nm);
      };
      row.parentNode.insertBefore(wrap, row);
      wrap.appendChild(row);
      wrap.appendChild(actions);
    });
  }

  function applyPick(kind, key, act, displayName) {
    $all('.pick-row-wrap.is-open').forEach(function (w) {
      w.classList.remove('is-open');
    });
    if (kind === 'guest') {
      if (window.setGuestGender) window.setGuestGender(key);
      if (window.setCust) window.setCust('guest');
    } else {
      if (window.setCust) window.setCust('member');
      var map = {
        chen: '陈女士', chenxr: '陈昕然', gao: '高海泉', li: '李女士', ma: '马婷'
      };
      var nm = map[key] || displayName || '会员';
      setTimeout(function () {
        $all('#s5 .v2-ccard__name-text').forEach(function (el) {
          el.textContent = nm;
        });
      }, 40);
    }
    if (act === 'quick') { go('s2'); return; }
    var sid = kind === 'guest' ? 's1' : 's5';
    go(sid);
    setTimeout(function () { rebuildBill(sid); }, 30);
  }

  /* ========== 开单页 ========== */
  function hideLegacyScroll(screenId) {
    var scr = document.getElementById(screenId);
    if (!scr) return;
    var legacy = scr.querySelector('.scroll');
    if (legacy) legacy.classList.add('v2-legacy-hide');
    scr.classList.add('v2-bill');
    var bar = scr.querySelector('.bottom-bar');
    if (bar) bar.classList.add('v2-safe');
  }

  function ensureBillBody(screenId) {
    var scr = document.getElementById(screenId);
    if (!scr) return null;
    hideLegacyScroll(screenId);
    ensureStaffSheetHost(scr);
    var body = scr.querySelector('.v2-bill-body');
    if (body) return body;
    body = document.createElement('div');
    body.className = 'v2-bill-body';
    body.id = screenId + 'BillBody';
    var bar = scr.querySelector('.bottom-bar');
    if (bar) scr.insertBefore(body, bar);
    else scr.appendChild(body);
    body.addEventListener('scroll', function () {}, { passive: true });
    return body;
  }

  function ensureStaffSheetHost(scr) {
    if (scr.querySelector('.v2-staff-sheet-mask')) return;
    var mask = document.createElement('div');
    mask.className = 'v2-staff-sheet-mask';
    mask.innerHTML =
      '<div class="v2-staff-sheet" role="dialog" aria-label="选择服务员工">' +
        '<div class="v2-staff-sheet__grab" aria-hidden="true"></div>' +
        '<div class="v2-staff-sheet__hd">服务员工' +
          '<span class="v2-staff-sheet__limit">最多 ' + MAX_STAFF + ' 位</span></div>' +
        '<div class="v2-staff-sheet__bd" data-staff-root data-ctx="v2draft"></div>' +
      '</div>';
    scr.appendChild(mask);
    mask.addEventListener('click', function (e) {
      if (e.target === mask) closeStaffSheet();
    });
  }

  function ensurePriceSheetHost(scr) {
    if (scr.querySelector('.v2-price-sheet-mask')) return;
    var mask = document.createElement('div');
    mask.className = 'v2-price-sheet-mask';
    mask.innerHTML =
      '<div class="v2-price-sheet" role="dialog" aria-label="价格（元）">' +
        '<div class="v2-price-sheet__grab" aria-hidden="true"></div>' +
        '<div class="v2-price-sheet__hd">价格（元）</div>' +
        '<div class="v2-price-sheet__val" data-price-disp>¥0.00</div>' +
        '<div class="v2-price-keys">' +
          '<button type="button" data-pk="1">1</button><button type="button" data-pk="2">2</button><button type="button" data-pk="3">3</button>' +
          '<button type="button" data-pk="4">4</button><button type="button" data-pk="5">5</button><button type="button" data-pk="6">6</button>' +
          '<button type="button" data-pk="7">7</button><button type="button" data-pk="8">8</button><button type="button" data-pk="9">9</button>' +
          '<button type="button" data-pk=".">.</button><button type="button" data-pk="0">0</button><button type="button" data-pk="del">⌫</button>' +
        '</div>' +
        '<button type="button" class="v2-price-ok" data-pk-ok>确定</button>' +
      '</div>';
    scr.appendChild(mask);
    mask.addEventListener('click', function (e) {
      if (e.target === mask) closePriceSheet(false);
    });
    mask.querySelectorAll('[data-pk]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        pushPriceKey(btn.getAttribute('data-pk'));
      });
    });
    mask.querySelector('[data-pk-ok]').addEventListener('click', function (e) {
      e.stopPropagation();
      closePriceSheet(true);
    });
  }

  function formatPriceBuf(buf) {
    if (!buf) return '0.00';
    if (buf.charAt(buf.length - 1) === '.') return buf;
    if (buf.indexOf('.') >= 0) {
      var parts = buf.split('.');
      return parts[0] + '.' + (parts[1] || '').slice(0, 2);
    }
    return buf;
  }

  function paintPriceSheet() {
    if (!draft) return;
    var scr = document.getElementById(draft.screenId);
    var disp = scr && scr.querySelector('[data-price-disp]');
    if (disp) disp.textContent = '¥' + formatPriceBuf(priceBuf);
  }

  function pushPriceKey(k) {
    if (k === 'del') {
      priceBuf = priceBuf.slice(0, -1);
      paintPriceSheet();
      return;
    }
    if (k === '.') {
      if (priceBuf.indexOf('.') >= 0) return;
      priceBuf = priceBuf ? priceBuf + '.' : '0.';
      paintPriceSheet();
      return;
    }
    if (priceBuf.indexOf('.') >= 0) {
      var dec = priceBuf.split('.')[1] || '';
      if (dec.length >= 2) return;
      priceBuf += k;
      paintPriceSheet();
      return;
    }
    var intp = priceBuf.replace(/^0+/, '');
    if (intp.length >= 6) return;
    if (priceBuf === '0') priceBuf = k;
    else priceBuf += k;
    var n = parseFloat(priceBuf);
    if (n > 999999.99) priceBuf = '999999.99';
    paintPriceSheet();
  }

  /* ===== 价格：折叠态行内展示原价；展开态在展开卡底部「价格（元）」行内编辑（数值右侧铅笔） ===== */
  function catPriceEl(row) { return row ? row.querySelector('.v2-cat-price') : null; }
  function pricePillEl(row) { return row ? row.querySelector('[data-price-pill]') : null; }

  function pricePenHtml() { return '<span class="v2-price-pen" data-price-pen>' + PEN_SVG + '</span>'; }

  /* 1899 → "1899"；1899.5 → "1899.5" */
  function pricePlain(n) {
    var x = Number(n) || 0;
    var t = x.toFixed(2).replace(/\.?0+$/, '');
    return t === '' ? '0' : t;
  }

  function paintRowPrice(n) {
    if (!draft || !draft.el) return;
    var pr = catPriceEl(draft.el);
    if (pr) pr.innerHTML = money(n);
    var val = pricePillEl(draft.el) && pricePillEl(draft.el).querySelector('[data-pill-val]');
    if (val) val.textContent = pricePlain(n);
  }

  function openPriceSheet() {
    if (!draft) return;
    var scr = document.getElementById(draft.screenId);
    if (!scr) return;
    closeStaffSheet();
    ensurePriceSheetHost(scr);
    var mask = scr.querySelector('.v2-price-sheet-mask');
    if (!mask) return;
    var p = draft.price;
    priceBuf = (Math.round(p * 100) / 100).toFixed(2).replace(/\.?0+$/, '');
    if (priceBuf === '') priceBuf = '0';
    paintPriceSheet();
    priceSheetOpen = true;
    mask._v2CloseGen = (mask._v2CloseGen || 0) + 1;
    mask.classList.add('show');
    void mask.offsetWidth;
    mask.classList.add('is-in');
  }

  function closePriceSheet(apply) {
    if (apply && draft) {
      var n = parseFloat(priceBuf);
      if (!isFinite(n) || n < 0) n = draft.price;
      if (n > 999999.99) n = 999999.99;
      draft.price = Math.round(n * 100) / 100;
      /* 行内价格同步（改价仅作用于本次加入购物车，不影响价目表原价） */
      paintRowPrice(draft.price);
    }
    priceSheetOpen = false;
    $all('.v2-price-sheet-mask').forEach(function (mask) {
      mask.classList.remove('is-in');
      var gen = (mask._v2CloseGen || 0) + 1;
      mask._v2CloseGen = gen;
      setTimeout(function () {
        if (mask._v2CloseGen !== gen) return;
        if (priceSheetOpen) return;
        mask.classList.remove('show');
      }, 380);
    });
  }

  function goPickCustomer(e) {
    if (e) e.stopPropagation();
    go('s4');
  }

  function wireCcard(root) {
    if (!root) return;
    var av = root.querySelector('.v2-ccard__avatar');
    var info = root.querySelector('.v2-ccard__info');
    if (av) av.onclick = goPickCustomer;
    if (info) info.onclick = goPickCustomer;
    var chev = root.querySelector('[data-ccard-toggle]');
    if (chev) {
      chev.onclick = function (e) {
        e.stopPropagation();
        root.classList.toggle('is-open');
      };
    }
  }

  function customerHtml(screenId) {
    if (screenId === 's5') {
      return '<div class="v2-ccard v2-ccard--member">' +
        '<div class="v2-ccard__row">' +
          '<img class="v2-ccard__avatar" src="assets/avatar_female3.png" alt="">' +
          '<div class="v2-ccard__info"><div class="v2-ccard__name">' +
            '<span class="v2-ccard__name-text">陈女士</span>' +
            '<img class="v2-ccard__vip" src="assets/ic_vip.svg" alt="VIP">' +
          '</div>' +
          '<div class="v2-ccard__sub">上次到店2026-08-15</div></div>' +
          '<button type="button" class="v2-ccard__chev" data-ccard-toggle aria-label="展开权益">' +
            CHEV_SVG + '</button>' +
        '</div>' +
        '<div class="v2-ccard__metrics">' +
          '<div class="v2-ccard__metric"><div class="v2-ccard__metric-val">3</div>' +
            '<div class="v2-ccard__metric-label">会员卡</div></div>' +
          '<div class="v2-ccard__metric"><div class="v2-ccard__metric-val">2049</div>' +
            '<div class="v2-ccard__metric-label">储值余额</div></div>' +
          '<div class="v2-ccard__metric"><div class="v2-ccard__metric-val">8.0</div>' +
            '<div class="v2-ccard__metric-label">折扣</div></div>' +
        '</div></div>';
    }
    var g = currentGuestG();
    return '<div class="v2-ccard">' +
      '<div class="v2-ccard__row">' +
        '<img class="v2-ccard__avatar" src="' + guestAvatarSrc(g) + '" alt="">' +
        '<div class="v2-ccard__info"><div class="v2-ccard__name">' +
          '<span class="v2-ccard__name-text nm">' + guestDisplayName(g) + '</span></div>' +
        '</div>' +
      '</div></div>';
  }

  function rebuildBill(screenId) {
    var body = ensureBillBody(screenId);
    if (!body) return;
    closeStaffSheet();
    closeExpand();
    var tab = billTab[screenId] || 'project';
    var cat = CATALOG[tab];
    var groups = ['全部'].concat(cat.groups);
    if (!billGroup[screenId] || groups.indexOf(billGroup[screenId]) < 0) {
      billGroup[screenId] = '全部';
    }
    var g = billGroup[screenId];

    var tabsHtml = '<div class="v2-page-tabs">' +
      '<button type="button" class="' + (tab === 'project' ? 'on' : '') +
        '" data-btab="project">项目</button>' +
      '<button type="button" class="' + (tab === 'product' ? 'on' : '') +
        '" data-btab="product">产品</button></div>';

    var gTabs = groups.map(function (name) {
      return '<button type="button" class="v2-group-tab' +
        (name === g ? ' on' : '') + '" data-bgroup="' + esc(name) + '">' +
        esc(name) + '</button>';
    }).join('');

    var items = g === '全部'
      ? cat.items.slice()
      : cat.items.filter(function (it) { return it.g === g; });
    var list = items.map(function (it, idx) {
      var key = screenId + '_' + tab + '_' + g + '_' + idx;
      return '<div class="v2-cat-item" data-ikey="' + key + '" data-name="' +
        esc(it.name) + '" data-price="' + it.price + '" data-prod="' +
        (tab === 'product' ? '1' : '0') + '" data-group="' + esc(it.g) + '">' +
        '<div class="v2-cat-main">' +
          '<div class="v2-cat-info"><div class="v2-cat-name">' + esc(it.name) +
          '</div><div class="v2-cat-price">' + money(it.price) + '</div></div>' +
          '<div class="v2-cat-right" data-right></div>' +
        '</div>' +
        '<div class="v2-row-expand" data-expand></div>' +
      '</div>';
    }).join('');

    body.innerHTML = customerHtml(screenId) + tabsHtml +
      '<div class="v2-group-bar"><div class="v2-group-seg"><div class="v2-group-scroll">' +
      gTabs + '</div></div></div>' +
      '<div class="v2-catalog">' + list + '</div>';

    wireCcard(body.querySelector('.v2-ccard'));

    body.querySelectorAll('[data-btab]').forEach(function (b) {
      b.onclick = function () {
        billTab[screenId] = b.getAttribute('data-btab');
        billGroup[screenId] = '全部';
        rebuildBill(screenId);
      };
    });
    body.querySelectorAll('[data-bgroup]').forEach(function (b) {
      b.onclick = function () {
        billGroup[screenId] = b.getAttribute('data-bgroup');
        rebuildBill(screenId);
      };
    });
    body.querySelectorAll('.v2-cat-item').forEach(function (row) {
      renderRowRight(row, false);
    });
  }

  function renderRowRight(row, open) {
    var right = row.querySelector('[data-right]');
    if (!right) return;
    if (!open) {
      right.innerHTML =
        '<button type="button" class="v2-add-btn" data-add aria-label="添加">' +
        PLUS_SVG + '</button>';
      right.querySelector('[data-add]').onclick = function (e) {
        e.stopPropagation();
        openExpand(row);
      };
      return;
    }
    right.innerHTML =
      '<div class="v2-round-step">' +
        '<button type="button" class="minus" data-q="-1" aria-label="减">' + MINUS_SVG + '</button>' +
        '<span data-qty>' + draft.qty + '</span>' +
        '<button type="button" class="plus" data-q="1" aria-label="加">' + PLUS_SVG + '</button>' +
      '</div>';
    right.querySelectorAll('[data-q]').forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        var d = parseInt(b.getAttribute('data-q'), 10);
        draft.qty = Math.max(1, Math.min(99, draft.qty + d));
        right.querySelector('[data-qty]').textContent = String(draft.qty);
      };
    });
  }

  function emptyStaffRow() {
    return {
      id: '__v2draft__' + Date.now(),
      staffIds: [],
      staffRoles: {},
      staffDesignated: {}
    };
  }

  function openExpand(row) {
    var screen = row.closest('.screen');
    var screenId = screen ? screen.id : 's1';
    var key = row.getAttribute('data-ikey');
    if (expandKey && expandKey !== key) closeExpand();

    draft = {
      key: key,
      name: row.getAttribute('data-name'),
      price: parseFloat(row.getAttribute('data-price')) || 0,
      base: parseFloat(row.getAttribute('data-price')) || 0,
      qty: 1,
      isProd: row.getAttribute('data-prod') === '1',
      group: row.getAttribute('data-group') || '',
      staffRow: emptyStaffRow(),
      screenId: screenId,
      el: row
    };
    window.__v2DraftStaff = draft.staffRow;
    expandKey = key;
    row.classList.add('is-open');
    renderRowRight(row, true);
    renderExpandBody(row);
    /* 仅保证展开区可见，不为 sheet 预留位移 */
    var body = screen && screen.querySelector('.v2-bill-body');
    if (body) {
      var top = Math.max(0, row.offsetTop - 72);
      body.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  function renderExpandBody(row) {
    var box = row.querySelector('[data-expand]');
    if (!box || !draft) return;
    /* 展开卡：① 服务员工 Chip 区 ② 底部「价格（元）」+ 可编辑价格药丸 + 加入购物车 */
    box.innerHTML =
      '<div class="v2-staff-row">' +
        '<div class="v2-staff-row__lbl">服务员工</div>' +
        '<div class="v2-staff-row__chips" data-slots></div>' +
      '</div>' +
      '<div class="v2-expand-foot">' +
        '<div class="v2-price-line">' +
          '<span class="v2-price-line__lbl">价格（元）</span>' +
          '<span class="v2-price-pill" data-price-pill role="button" tabindex="0">' +
            '<span class="yen">¥</span>' +
            '<span class="val" data-pill-val>' + pricePlain(draft.price) + '</span>' +
            pricePenHtml() +
          '</span>' +
        '</div>' +
        '<button type="button" class="v2-cart-pill" data-commit aria-label="加入购物车">' +
          CART_SVG +
        '</button>' +
      '</div>';

    renderSlots();
    var pill = box.querySelector('[data-price-pill]');
    if (pill) {
      pill.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        openPriceSheet();
      };
    }
    box.querySelector('[data-commit]').onclick = function (e) {
      e.stopPropagation();
      commitDraft(e.currentTarget);
    };
  }

  /* 员工 Chip：姓名 + 「点客/散客·工位」（设计稿去掉了头像），最多 MAX_STAFF 位 */
  function renderSlots() {
    if (!draft || !draft.el) return;
    var row = draft.el.querySelector('[data-slots]');
    if (!row) return;
    var ids = draft.staffRow.staffIds || [];
    var html = ids.map(function (sid) {
      var st = staffList().find(function (s) { return s.id === sid; }) ||
        { name: sid, short: '?', avatar: '' };
      var des = draft.staffRow.staffDesignated && draft.staffRow.staffDesignated[sid] === true;
      var role = roleLabel(draft.staffRow.staffRoles && draft.staffRow.staffRoles[sid]);
      var sub = des ? '点客' : '散客';
      if (role) sub += '·' + role;
      return '<div class="v2-staff-chip is-filled" data-slot-sid="' + esc(sid) + '">' +
        '<span class="v2-staff-chip__meta">' +
          '<span class="v2-staff-chip__name">' + esc(st.name) + '</span>' +
          '<span class="v2-staff-chip__sub">' + esc(sub) + '</span>' +
        '</span>' +
        '<button type="button" class="v2-staff-chip__x" data-slot-clear="' + esc(sid) +
          '" aria-label="移除">×</button>' +
      '</div>';
    }).join('');
    if (ids.length < MAX_STAFF) {
      html += '<button type="button" class="v2-staff-chip is-empty" data-slot-empty ' +
        'aria-label="添加员工">' +
        '<span class="v2-staff-chip__plus">' + PLUS_SVG + '</span>' +
        '<span class="v2-staff-chip__hint">添加</span>' +
      '</button>';
    }
    row.innerHTML = html;

    row.querySelectorAll('.v2-staff-chip.is-filled, [data-slot-empty]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (e.target.closest('[data-slot-clear]')) return;
        e.stopPropagation();
        openStaffSheet();
      });
    });
    row.querySelectorAll('[data-slot-clear]').forEach(function (x) {
      x.addEventListener('click', function (e) {
        e.stopPropagation();
        var sid = x.getAttribute('data-slot-clear');
        draft.staffRow.staffIds = draft.staffRow.staffIds.filter(function (id) {
          return id !== sid;
        });
        delete draft.staffRow.staffRoles[sid];
        delete draft.staffRow.staffDesignated[sid];
        renderSlots();
        if (staffSheetOpen) paintStaffSheet();
      });
    });
  }

  window.__v2OnDraftStaffChange = function () {
    renderSlots();
    if (staffSheetOpen) paintStaffSheet();
  };

  /* 供外部（员工选择组件）调用：新增员工成功后收起 sheet，需再次点「添加」才弹出 */
  window.__v2CloseStaffSheet = function () {
    closeStaffSheet();
  };

  /* —— 员工 sheet：普通底部弹出 —— */
  function paintStaffSheet() {
    if (!draft) return;
    var screen = document.getElementById(draft.screenId);
    var root = screen && screen.querySelector('.v2-staff-sheet__bd');
    if (!root) return;
    window.__v2DraftStaff = draft.staffRow;
    if (typeof renderStaffInto === 'function') {
      renderStaffInto(root);
    } else if (typeof renderStaffPickerHtmlForRow === 'function') {
      root.innerHTML = renderStaffPickerHtmlForRow(draft.staffRow);
      if (typeof afterStaffPickerPaint === 'function') afterStaffPickerPaint(root);
    }
  }

  function openStaffSheet() {
    if (!draft) return;
    var screen = document.getElementById(draft.screenId);
    if (!screen) return;
    ensureStaffSheetHost(screen);
    var mask = screen.querySelector('.v2-staff-sheet-mask');
    if (!mask) return;
    paintStaffSheet();
    staffSheetOpen = true;
    mask._v2CloseGen = (mask._v2CloseGen || 0) + 1;
    mask.style.top = '';
    mask.classList.add('show');
    void mask.offsetWidth;
    mask.classList.add('is-in');
  }

  function closeStaffSheet() {
    staffSheetOpen = false;
    $all('.v2-staff-sheet-mask').forEach(function (mask) {
      mask.classList.remove('is-in');
      var gen = (mask._v2CloseGen || 0) + 1;
      mask._v2CloseGen = gen;
      setTimeout(function () {
        if (mask._v2CloseGen !== gen) return;
        if (staffSheetOpen) return;
        mask.classList.remove('show');
      }, 380);
    });
  }

  function closeExpand() {
    closePriceSheet(false);
    closeStaffSheet();
    if (draft && draft.el) {
      draft.el.classList.remove('is-open');
      var exp = draft.el.querySelector('[data-expand]');
      if (exp) exp.innerHTML = '';
      renderRowRight(draft.el, false);
    }
    draft = null;
    expandKey = null;
    window.__v2DraftStaff = null;
  }

  function commitDraft(fromBtn) {
    if (!draft) return;
    if (!window.cartItems) window.cartItems = [];
    var payable = Math.round(draft.price * draft.qty * 100) / 100;
    var basePay = Math.round(draft.base * draft.qty * 100) / 100;
    var kind = draft.screenId === 's5' ? 'member' : 'guest';
    var staffObj = {
      id: '__co',
      staffIds: draft.staffRow.staffIds.slice(),
      staffRoles: Object.assign({}, draft.staffRow.staffRoles),
      staffDesignated: Object.assign({}, draft.staffRow.staffDesignated)
    };
    window.cartItems.push({
      name: draft.name,
      price: draft.price,
      salePrice: draft.base,
      qty: draft.qty,
      payable: payable,
      receivable: payable,
      actual: payable,
      discounted: Math.abs(payable - basePay) > 0.001,
      isProd: draft.isProd,
      kind: kind,
      group: draft.group,
      thumb: '',
      staff: staffObj,
      benefit: null,
      _benefitCleared: false
    });
    if (typeof window.recalcOrderAmounts === 'function') window.recalcOrderAmounts();
    if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
    else refreshCartUI();

    var btn = fromBtn;
    var sid = draft.screenId;
    var startRect = btn ? btn.getBoundingClientRect() : null;
    closeExpand();
    flyToCart(startRect, sid, function () {
      toast('已加入购物车');
    });
  }

  function refreshCartUI() {
    var total = 0;
    var n = 0;
    (window.cartItems || []).forEach(function (it) {
      total += it.actual;
      n += it.qty;
    });
    ['s1amount', 's5amount'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = total.toFixed(2);
    });
    $all('[data-cart-badge]').forEach(function (b) {
      b.textContent = String(n);
      b.classList.toggle('show', n > 0);
    });
    if (typeof window.syncHangAndNextUI === 'function') window.syncHangAndNextUI();
  }

  function flyToCart(fromRectOrEl, screenId, done) {
    var cart = document.querySelector('#' + screenId + ' .btn-add') ||
      document.querySelector('#' + screenId + ' .cart-hot');
    var a = fromRectOrEl && typeof fromRectOrEl.getBoundingClientRect === 'function'
      ? fromRectOrEl.getBoundingClientRect()
      : fromRectOrEl;
    if (!a || !cart) { if (done) done(); return; }
    var b = cart.getBoundingClientRect();
    var ball = document.createElement('div');
    ball.className = 'v2-fly-ball';
    document.body.appendChild(ball);
    var x0 = a.left + a.width / 2 - 9;
    var y0 = a.top + a.height / 2 - 9;
    var x1 = b.left + b.width / 2 - 9;
    var y1 = b.top + b.height / 2 - 9;
    var cx = (x0 + x1) / 2;
    var cy = Math.min(y0, y1) - 120;
    var t0 = performance.now();
    var dur = 560;
    var finished = false;
    function popCart() {
      var icon = document.querySelector('#' + screenId + ' .btn-add');
      if (!icon) return;
      icon.classList.remove('is-pop');
      void icon.offsetWidth;
      icon.classList.add('is-pop');
    }
    function finish() {
      if (finished) return;
      finished = true;
      if (ball.parentNode) ball.remove();
      /* 小球飞抵购物车 → 购物车图标快速弹性回弹 */
      popCart();
      if (done) done();
    }
    function frame(now) {
      var p = Math.min(1, (now - t0) / dur);
      var u = 1 - Math.pow(1 - p, 2);
      var x = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * cx + u * u * x1;
      var y = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * cy + u * u * y1;
      var r = Math.round(255 + (243 - 255) * u);
      var g = Math.round(137 + (47 - 137) * u);
      var bl = Math.round(86 + (65 - 86) * u);
      ball.style.left = x + 'px';
      ball.style.top = y + 'px';
      ball.style.background = 'rgb(' + r + ',' + g + ',' + bl + ')';
      ball.style.transform = 'scale(' + (1 - 0.35 * u) + ')';
      if (p < 1) requestAnimationFrame(frame);
      else finish();
    }
    requestAnimationFrame(frame);
    setTimeout(finish, dur + 120);
  }

  /* 点展开区外部丢弃；点 sheet 不丢弃展开 */
  document.addEventListener('click', function (e) {
    if (!draft) return;
    if (e.target.closest('.v2-staff-sheet-mask')) return;
    if (e.target.closest('.v2-price-sheet-mask')) return;
    if (e.target.closest('.v2-cat-item.is-open')) return;
    if (e.target.closest('.v2-fly-ball')) return;
    closeExpand();
  }, true);

  function forceNext() {
    if (!window.onPrimaryAction || !window.onPrimaryAction._v2b) {
      window.onPrimaryAction = function (screenId) {
        if (!window.cartItems || !window.cartItems.length) {
          toast('请先添加项目或产品');
          return;
        }
        if (window.nextStep) window.nextStep(screenId);
        else go('s6');
      };
      window.onPrimaryAction._v2b = true;
    }
    if (window.syncHangAndNextUI && !window.syncHangAndNextUI._v2b) {
      var _s = window.syncHangAndNextUI;
      window.syncHangAndNextUI = function () {
        _s.apply(this, arguments);
        var empty = !window.cartItems || !window.cartItems.length;
        $all('.btn-next[data-next]').forEach(function (btn) {
          btn.classList.remove('is-quick');
          btn.innerHTML = '<span class="txt">下一步</span>';
          btn.classList.toggle('is-disabled', empty);
        });
      };
      window.syncHangAndNextUI._v2b = true;
    }
    if (typeof window.syncHangAndNextUI === 'function') window.syncHangAndNextUI();
  }

  /* ========== 结算文档流 ========== */
  var orderCoupon = null;
  var orderRemark = '';

  function enableCheckoutFlow() {
    ['s6', 's7'].forEach(function (id) {
      var scr = document.getElementById(id);
      if (scr) scr.classList.add('v2-co');
      var items = document.getElementById(id === 's6' ? 'coItems' : 'qcoItems');
      if (items) {
        items.style.position = 'relative';
        items.style.left = 'auto';
        items.style.top = 'auto';
        items.style.width = '100%';
      }
      var manual = scr && scr.querySelector('.co-manual');
      if (manual) {
        manual.style.position = 'relative';
        manual.style.left = 'auto';
        manual.style.top = 'auto';
        manual.style.width = '100%';
      }
      ['guest-card', 'member-card'].forEach(function (cls) {
        var card = scr && scr.querySelector('.' + cls);
        if (!card) return;
        card.style.position = 'relative';
        card.style.left = 'auto';
        card.style.top = 'auto';
        card.style.margin = '12px 16px 0';
        card.style.width = 'calc(100% - 32px)';
      });
      var page = scr && scr.querySelector('.scroll .page');
      if (page) {
        page.style.height = 'auto';
        page.style.minHeight = '100%';
        page.style.paddingBottom = '24px';
      }
    });
  }

  function ensureCheckoutExtras() {
    enableCheckoutFlow();
    ['coItems', 'qcoItems'].forEach(function (id) {
      var items = document.getElementById(id);
      if (!items) return;
      var page = items.parentElement;
      if (!page) return;
      var extras = page.querySelector('.co-extras[data-for="' + id + '"]');
      if (!extras) {
        extras = document.createElement('div');
        extras.className = 'co-extras';
        extras.setAttribute('data-for', id);
        extras.innerHTML =
          '<div class="co-coupon-row" data-coupon-row>' +
            '<span class="l">优惠券</span>' +
            '<span class="r" data-coupon-val>请选择<span>›</span></span>' +
          '</div>' +
          '<div class="co-remark-card">' +
            '<div class="t">备注</div>' +
            '<div class="box">' +
              '<textarea maxlength="500" placeholder="请输入备注" data-remark></textarea>' +
              '<div class="cnt"><span data-remark-cnt>0</span>/500</div>' +
            '</div>' +
          '</div>';
        items.insertAdjacentElement('afterend', extras);

        extras.querySelector('[data-coupon-row]').onclick = function () {
          var list = (window.BENEFITS || []).filter(function (b) {
            return b.type === '优惠券';
          });
          if (!list.length) {
            list = [
              { name: '新人8折券', val: '满58减10' },
              { name: '满200减30券', val: '满200减30' }
            ];
          }
          var names = list.map(function (b, i) {
            return (i + 1) + '. ' + b.name + '（' + (b.val || '') + '）';
          }).join('\n');
          var pick = prompt('选择优惠券序号：\n' + names + '\n输入 0 清除', '1');
          if (pick == null) return;
          var idx = parseInt(pick, 10);
          var valEl = extras.querySelector('[data-coupon-val]');
          if (!idx) {
            orderCoupon = null;
            valEl.className = 'r';
            valEl.innerHTML = '请选择<span>›</span>';
            return;
          }
          orderCoupon = list[idx - 1] || list[0];
          valEl.className = 'r has';
          valEl.innerHTML = esc(orderCoupon.name) + '<span>›</span>';
        };

        var ta = extras.querySelector('[data-remark]');
        var cnt = extras.querySelector('[data-remark-cnt]');
        ta.value = orderRemark;
        cnt.textContent = String(orderRemark.length);
        ta.oninput = function () {
          orderRemark = ta.value.slice(0, 500);
          cnt.textContent = String(orderRemark.length);
        };
      }
    });
  }

  function patchCheckout() {
    ensureCheckoutExtras();
    if (window.renderCo && !window.renderCo._v2c) {
      var _co = window.renderCo;
      window.renderCo = function () {
        _co.apply(this, arguments);
        polishCoItems('#coItems');
        ensureCheckoutExtras();
      };
      window.renderCo._v2c = true;
    }
    if (window.renderQco && !window.renderQco._v2c) {
      var _q = window.renderQco;
      window.renderQco = function () {
        _q.apply(this, arguments);
        polishCoItems('#qcoItems');
        ensureCheckoutExtras();
      };
      window.renderQco._v2c = true;
    }
  }

  function polishCoItems(sel) {
    $all(sel + ' .co-item').forEach(function (el) {
      el.classList.add('v2-compact');
      $all('.co-row', el).forEach(function (row) {
        var lbl = row.querySelector('.lbl');
        var t = lbl ? lbl.textContent : '';
        /* 「服务员工」改为只读摘要，不可点不可编辑；「权益」行保持可点选 */
        if (t.indexOf('服务员工') >= 0 || t.indexOf('选择员工') >= 0) {
          row.setAttribute('data-ro', '1');
          row.removeAttribute('onclick');
          row.onclick = null;
        }
        if (t.indexOf('开单内容') >= 0) row.style.display = 'none';
      });
      $all('.co-sum-row', el).forEach(function (row) {
        if (row.classList.contains('pay')) return;
        row.setAttribute('data-ro', '1');
        row.removeAttribute('onclick');
        var input = row.querySelector('input');
        if (input) {
          input.readOnly = true;
          input.onfocus = function (ev) { ev.target.blur(); };
        }
      });
    });
  }

  function wireHome() {
    var bill = $('[data-v2-home="bill"]');
    var card = $('[data-v2-home="card"]');
    if (bill) bill.onclick = function () { go('s4'); };
    if (card) card.onclick = function () { toast('示意：开卡'); };
  }

  function patchNav() {
    if (window.navStack) window.navStack = ['s0'];
    if (typeof window.activate === 'function') window.activate('s0');
    window.pickGuest = function (g) { applyPick('guest', g, 'bill'); };
  }

  function onGoHook() {
    if (!window.go || window.go._v2hook) return;
    var _go = window.go;
    window.go = function (id) {
      _go.apply(this, arguments);
      if (id === 's1' || id === 's5') setTimeout(function () { rebuildBill(id); }, 20);
      if (id === 's2' || id === 's3' || id === 's6' || id === 's7') {
        setTimeout(function () {
          replaceLegacyCustomerCards();
          if (id === 's6' || id === 's7') patchCheckout();
        }, 20);
      }
    };
    window.go._v2hook = true;
  }

  /* 全页黑卡 → 淡色卡（保留 gcard/mcard 显隐与 setGuestGender） */
  function replaceLegacyCustomerCards() {
    $all('.guest-card').forEach(function (card) {
      if (card.getAttribute('data-v2-lite') === '1') {
        card.classList.add('v2-lite');
        var oldSub = card.querySelector('.v2-ccard__sub');
        if (oldSub) oldSub.remove();
        var gg = card.getAttribute('data-g') || 'default';
        var nmKeep = card.querySelector('.nm');
        if (nmKeep) nmKeep.textContent = guestDisplayName(gg);
        wireCcard(card);
        return;
      }
      var g = card.getAttribute('data-g') || 'default';
      var av = guestAvatarSrc(g);
      var keep = [];
      if (card.classList.contains('gcard')) keep.push('gcard');
      if (card.classList.contains('co-gcard')) keep.push('co-gcard');
      card.className = ('guest-card v2-lite ' + keep.join(' ')).trim();
      card.setAttribute('data-v2-lite', '1');
      card.setAttribute('data-g', g);
      card.innerHTML =
        '<div class="v2-ccard__row" style="width:100%">' +
          '<img class="v2-ccard__avatar" data-v2-guest-av src="' + av + '" alt="">' +
          '<div class="v2-ccard__info">' +
            '<div class="v2-ccard__name"><span class="v2-ccard__name-text nm">' +
              guestDisplayName(g) + '</span></div>' +
          '</div>' +
        '</div>';
      wireCcard(card);
    });

    $all('.member-card').forEach(function (card) {
      if (card.getAttribute('data-v2-lite') === '1') {
        card.classList.add('v2-lite');
        wireCcard(card);
        return;
      }
      var nmEl = card.querySelector('.nm');
      var nm = nmEl ? nmEl.textContent.trim() : '陈女士';
      var keep = [];
      if (card.classList.contains('mcard')) keep.push('mcard');
      if (card.classList.contains('co-mcard')) keep.push('co-mcard');
      card.className = ('member-card v2-lite ' + keep.join(' ')).trim();
      card.setAttribute('data-v2-lite', '1');
      card.innerHTML =
        '<div class="v2-ccard__row" style="width:100%">' +
          '<img class="v2-ccard__avatar" src="assets/avatar_female3.png" alt="">' +
          '<div class="v2-ccard__info">' +
            '<div class="v2-ccard__name"><span class="v2-ccard__name-text nm">' + esc(nm) + '</span>' +
              '<img class="v2-ccard__vip" src="assets/ic_vip.svg" alt="VIP"></div>' +
            '<div class="v2-ccard__sub last">上次到店2026-08-15</div>' +
          '</div>' +
          '<button type="button" class="v2-ccard__chev" data-ccard-toggle aria-label="展开权益">' +
            CHEV_SVG + '</button>' +
        '</div>' +
        '<div class="v2-ccard__metrics">' +
          '<div class="v2-ccard__metric"><div class="v2-ccard__metric-val">3</div>' +
            '<div class="v2-ccard__metric-label">会员卡</div></div>' +
          '<div class="v2-ccard__metric"><div class="v2-ccard__metric-val">2049</div>' +
            '<div class="v2-ccard__metric-label">储值余额</div></div>' +
          '<div class="v2-ccard__metric"><div class="v2-ccard__metric-val">8.0</div>' +
            '<div class="v2-ccard__metric-label">折扣</div></div>' +
        '</div>';
      /* 复用折叠样式：member-card 当容器，内部用 v2-ccard 结构 */
      card.classList.add('v2-ccard', 'v2-ccard--member');
      wireCcard(card);
    });

    /* 同步散客性别头像 */
    if (typeof window.setGuestGender === 'function' && !window.setGuestGender._v2lite) {
      var _sg = window.setGuestGender;
      window.setGuestGender = function (g) {
        _sg.apply(this, arguments);
        syncGuestLite(g);
      };
      window.setGuestGender._v2lite = true;
    }
    if (typeof window.resetGuestDefault === 'function' && !window.resetGuestDefault._v2lite) {
      var _rd = window.resetGuestDefault;
      window.resetGuestDefault = function () {
        _rd.apply(this, arguments);
        syncGuestLite('default');
      };
      window.resetGuestDefault._v2lite = true;
    }
  }

  function syncGuestLite(g) {
    g = g || 'default';
    var name = guestDisplayName(g);
    var src = guestAvatarSrc(g);
    $all('.guest-card').forEach(function (card) {
      card.setAttribute('data-g', g);
      var av = card.querySelector('[data-v2-guest-av], .v2-ccard__avatar');
      if (av) av.src = src;
      var nm = card.querySelector('.nm');
      if (nm) nm.textContent = name;
      var sub = card.querySelector('.v2-ccard__sub');
      if (sub) sub.remove();
    });
    $all('#s1 .v2-ccard:not(.v2-ccard--member) .v2-ccard__name-text').forEach(function (el) {
      el.textContent = name;
    });
    $all('#s1 .v2-ccard:not(.v2-ccard--member) .v2-ccard__avatar').forEach(function (el) {
      el.src = src;
    });
  }

  function boot() {
    syncHold();
    wrapPickRows();
    forceNext();
    wireHome();
    patchNav();
    onGoHook();
    replaceLegacyCustomerCards();
    patchCheckout();
    rebuildBill('s1');
    rebuildBill('s5');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 0); });
  } else {
    setTimeout(boot, 0);
  }
})();
