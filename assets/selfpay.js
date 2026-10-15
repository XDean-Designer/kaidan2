/**
 * 自助订单 · s16（R44）
 * 首页横滑待归档 + 列表页（无 Tab）；点票对齐 FLIP 放大编辑
 */
(function () {
  'use strict';

  var ARCHIVER = '店员小陈';
  var PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var CHEV_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var CHEV_RIGHT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

  function priceCatalog() {
    return window.__v2Catalog || {
      project: { groups: ['剪发造型'], items: [{ g: '剪发造型', name: '剪发', price: 68 }] },
      product: { groups: ['洗护'], items: [{ g: '洗护', name: '洗发水', price: 98 }] }
    };
  }

  function pad(n) { return String(n).padStart(2, '0'); }
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function shiftDay(key, delta) {
    var p = key.split('-').map(Number);
    var d = new Date(p[0], p[1] - 1, p[2]);
    d.setDate(d.getDate() + delta);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function money(n) {
    return (Math.round((Number(n) || 0) * 100) / 100).toFixed(2);
  }
  function toast(msg, ms) {
    if (typeof window.toast === 'function') window.toast(msg, ms);
  }
  function go(id) {
    if (typeof window.go === 'function') window.go(id);
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function seedSlips() {
    var t = todayKey();
    var y = shiftDay(t, -1);
    var y2 = shiftDay(t, -2);
    return [
      {
        id: 'sp-1', seq: 100, isMember: true, status: 'pending', dateKey: t, time: '09:18',
        customerName: '林嘉怡', phone: '138****6210',
        avatar: 'assets/avatar_card_female.png',
        cards: '储值卡 美发卡　余额 ¥1,280.00',
        items: [{ id: 'p1', name: '剪发', type: 'project', price: 68, qty: 1 }],
        paid: 48, payments: [{ method: '微信', amount: 20 }, { method: '卡本金', amount: 28 }],
        benefits: '会员折扣 −¥20', slipNo: 'SP202610130018', remark: ''
      },
      {
        id: 'sp-2', seq: 101, isMember: true, status: 'pending', dateKey: t, time: '10:42',
        customerName: '陈昕然', phone: '186****9033',
        avatar: 'assets/avatar_female3.png',
        cards: '计次卡 染烫10次　余 4 次',
        items: [],
        paid: 198, payments: [{ method: '支付宝', amount: 198 }],
        benefits: '', slipNo: 'SP202610130042', remark: '顾客备注：补项目'
      },
      {
        id: 'sp-3', seq: 102, isMember: true, status: 'pending', dateKey: t, time: '11:05',
        customerName: '周雨欣', phone: '159****4412',
        avatar: 'assets/avatar_female2.png',
        cards: '计次卡 洗吹次卡　余 6 次',
        items: [{ id: 'p2', name: '洗吹', type: 'project', price: 38, qty: 1 }],
        paid: 0, payments: [{ method: '计次', amount: 0 }],
        benefits: '扣次 ×1', slipNo: 'SP202610130055', remark: ''
      },
      {
        id: 'sp-4', seq: 103, isMember: true, status: 'pending', dateKey: t, time: '13:20',
        customerName: '马婷', phone: '137****7788',
        avatar: 'assets/avatar_card_female.png',
        cards: '折扣卡 超值折扣　8.0 折',
        items: [{ id: 'p3', name: '染发', type: 'project', price: 298, qty: 1 }],
        paid: 238.4, payments: [{ method: '微信', amount: 238.4 }],
        benefits: '折扣卡 8 折', slipNo: 'SP202610130088', remark: ''
      },
      {
        id: 'sp-5', seq: 104, isMember: true, status: 'pending', dateKey: t, time: '14:08',
        customerName: '苏晓萌', phone: '151****2201',
        avatar: 'assets/avatar_female3.png',
        cards: '储值卡 护理卡　余额 ¥560.00',
        items: [
          { id: 'p4', name: '护理', type: 'project', price: 168, qty: 1 },
          { id: 'g1', name: '发膜', type: 'product', price: 128, qty: 1 }
        ],
        paid: 260, payments: [{ method: '卡本金', amount: 200 }, { method: '微信', amount: 60 }],
        benefits: '', slipNo: 'SP202610130102', remark: ''
      },
      {
        id: 'sp-6', seq: 105, isMember: false, status: 'pending', dateKey: t, time: '15:33',
        customerName: '何静', phone: '188****6655',
        avatar: 'assets/avatar_card_female.png',
        cards: '',
        items: [],
        paid: 68, payments: [{ method: '微信', amount: 68 }],
        benefits: '', slipNo: 'SP202610130133', remark: ''
      },
      {
        id: 'sp-y1', seq: 106, isMember: true, status: 'pending', dateKey: y, time: '16:40',
        customerName: '蔡雅婷', phone: '139****1100',
        avatar: 'assets/avatar_female2.png',
        cards: '储值卡 美发卡　余额 ¥2,100.00',
        items: [{ id: 'p1', name: '剪发', type: 'project', price: 68, qty: 1 }],
        paid: 68, payments: [{ method: '微信', amount: 68 }],
        benefits: '', slipNo: 'SP202610120240', remark: '跨日待处理样例'
      },
      {
        id: 'sp-y2', seq: 107, isMember: false, status: 'pending', dateKey: y2, time: '11:12',
        customerName: '王先生', phone: '136****8899',
        avatar: 'assets/avatar_male2.png',
        cards: '',
        items: [{ id: 'p2', name: '洗吹', type: 'project', price: 38, qty: 1 }],
        paid: 38, payments: [{ method: '支付宝', amount: 38 }],
        benefits: '', slipNo: 'SP202610110112', remark: ''
      },
      {
        id: 'sp-d1', seq: 108, isMember: true, status: 'done', dateKey: t, time: '08:50',
        customerName: '黄浩然', phone: '158****3344',
        avatar: 'assets/avatar_male2.png',
        cards: '储值卡 美发卡　余额 ¥800.00',
        items: [{ id: 'p1', name: '剪发', type: 'project', price: 68, qty: 1 }],
        paid: 68, payments: [{ method: '微信', amount: 68 }],
        benefits: '', slipNo: 'SP202610130008', remark: '',
        staffs: ['小美'], contentMode: 'items',
        archiver: ARCHIVER, flowOrderId: null
      },
      {
        id: 'sp-v1', seq: 109, isMember: true, status: 'voided', dateKey: t, time: '09:02',
        customerName: '邓伟', phone: '177****5566',
        avatar: 'assets/avatar_male2.png',
        cards: '计次卡 洗吹次卡　余 2 次',
        items: [{ id: 'p2', name: '洗吹', type: 'project', price: 38, qty: 1 }],
        paid: 0, payments: [{ method: '计次', amount: 0 }],
        benefits: '扣次已回滚', slipNo: 'SP202610130012', remark: '',
        voidAt: t
      }
    ];
  }

  var slips = seedSlips();
  var ui = {
    tab: 'pending',
    dateKey: todayKey(),
    search: '',
    filter: { pay: '', hasItems: '', amtMin: '', amtMax: '' },
    currentId: null,
    contentMode: 'items',
    editItems: [],
    staffRow: emptyStaffRow(),
    remark: '',
    cardsOpen: false,
    priceTab: 'project',
    priceGroup: '全部',
    readonly: false,
    animating: false,
    fromRect: null,
    originEl: null
  };

  function emptyStaffRow() {
    return { id: '__selfpay__', staffIds: [], staffRoles: {}, staffExtra: {}, staffChosen: {} };
  }
  function staffNamesFromRow(row) {
    if (!row || !row.staffIds || !row.staffIds.length) return [];
    return row.staffIds.map(function (sid) {
      var st = typeof window.staffById === 'function' ? window.staffById(sid) : null;
      return st ? st.name : sid;
    });
  }
  function staffSummaryText(row) {
    var names = staffNamesFromRow(row);
    return names.length ? names.join('、') : '未选';
  }

  function pendingCount() {
    return slips.filter(function (s) { return s.status === 'pending'; }).length;
  }
  function getSlip(id) {
    return slips.find(function (s) { return s.id === id; });
  }

  function pendingSlipsAll() {
    return slips
      .filter(function (s) { return s.status === 'pending'; })
      .sort(function (a, b) { return (Number(a.seq) || 0) - (Number(b.seq) || 0); });
  }
  function memberTagHtml(slip) {
    var mem = !!slip.isMember;
    return '<span class="sp-tag ' + (mem ? 'is-mem' : 'is-guest') + '">' + (mem ? '会' : '散') + '</span>';
  }
  function homeCardHtml(slip) {
    var empty = !(slip.items && slip.items.length) && slip.contentMode !== 'quick';
    return (
      '<button type="button" class="vh-sp-card" data-sp-id="' + slip.id + '">' +
      '<div class="vh-sp-card__seq">' + escapeHtml(String(slip.seq != null ? slip.seq : '')) + '</div>' +
      '<div class="vh-sp-card__row">' + memberTagHtml(slip) +
      '<span class="vh-sp-card__time">' + escapeHtml(slipTimeLabel(slip)) + '</span></div>' +
      '<div class="vh-sp-card__name">' + escapeHtml(slip.customerName) + '</div>' +
      '<div class="vh-sp-card__item' + (empty ? ' is-empty' : '') + '">' + escapeHtml(itemSummary(slip)) + '</div>' +
      '<div class="vh-sp-card__amt">¥' + money(slip.paid) + '</div>' +
      '</button>'
    );
  }
  function renderHomeStrip() {
    var el = $('#spHomeStrip');
    if (!el) return;
    var list = pendingSlipsAll();
    if (!list.length) {
      el.innerHTML = '<div class="vh-sp-empty">暂无待归档订单</div>';
      return;
    }
    var html = '';
    list.slice(0, 5).forEach(function (slip) { html += homeCardHtml(slip); });
    html +=
      '<button type="button" class="vh-sp-more" data-sp-more aria-label="更多">' +
      '<span class="vh-sp-more__t">更多</span>' + CHEV_RIGHT +
      '</button>';
    el.innerHTML = html;
  }
  /** R44：去掉开单角标；保留空函数以免外部调用报错 */
  function syncHomeBadge() {
    document.querySelectorAll('.sp-home-badge').forEach(function (b) { b.remove(); });
    renderHomeStrip();
  }

  function itemSummary(slip) {
    var items = slip.items || [];
    if (!items.length) {
      if (slip.contentMode === 'quick') return '快捷开单';
      return '未填项目';
    }
    if (items.length === 1) return items[0].name;
    return items[0].name + '等' + items.length;
  }
  function dateLabel(key) {
    if (key === todayKey()) return '今天';
    var p = key.split('-');
    return Number(p[1]) + '/' + Number(p[2]);
  }
  function slipTimeLabel(slip) {
    if (slip.dateKey === todayKey()) return slip.time;
    var p = slip.dateKey.split('-');
    return Number(p[1]) + '/' + Number(p[2]) + ' ' + slip.time;
  }
  function filterActive() {
    var f = ui.filter;
    return !!(f.pay || f.hasItems || f.amtMin !== '' || f.amtMax !== '');
  }
  function matchesFilter(slip) {
    if (slip.dateKey !== ui.dateKey) return false;
    var q = (ui.search || '').trim();
    if (q) {
      var hit =
        (slip.customerName && slip.customerName.indexOf(q) >= 0) ||
        (slip.phone && slip.phone.indexOf(q) >= 0) ||
        (slip.slipNo && slip.slipNo.indexOf(q) >= 0);
      if (!hit) return false;
    }
    var f = ui.filter;
    if (f.pay) {
      var ok = (slip.payments || []).some(function (p) { return p.method === f.pay; });
      if (!ok) return false;
    }
    if (f.hasItems === 'yes' && !(slip.items && slip.items.length)) return false;
    if (f.hasItems === 'no' && slip.items && slip.items.length) return false;
    if (f.amtMin !== '' && Number(slip.paid) < Number(f.amtMin)) return false;
    if (f.amtMax !== '' && Number(slip.paid) > Number(f.amtMax)) return false;
    return true;
  }
  function listForTab() {
    return slips.filter(function (s) {
      return s.status === ui.tab && matchesFilter(s);
    });
  }

  /** 布局坐标宿主（不受 stage scale 影响） */
  function hostEl() {
    var active = document.querySelector('#frame > .screen.active');
    return active || document.getElementById('frame');
  }
  /** 视觉矩形 → 宿主布局坐标（抵消 transform: scale） */
  function layoutRect(el, host) {
    host = host || hostEl();
    if (!host) return { left: 0, top: 0, width: 0, height: 0 };
    var hr = host.getBoundingClientRect();
    var er = el.getBoundingClientRect();
    var sx = host.clientWidth ? hr.width / host.clientWidth : 1;
    var sy = host.clientHeight ? hr.height / host.clientHeight : 1;
    if (!sx) sx = 1;
    if (!sy) sy = 1;
    return {
      left: (er.left - hr.left) / sx,
      top: (er.top - hr.top) / sy,
      width: er.width / sx,
      height: er.height / sy
    };
  }
  function finalCardBox() {
    var host = hostEl();
    var hw = host ? host.clientWidth : 390;
    var hh = host ? host.clientHeight : 844;
    var marginX = 12;
    var marginY = 20;
    /* 取整：避免半像素 top/height + transform 层导致切态后文字发糊 */
    var w = Math.round(Math.min(366, hw - marginX * 2));
    var h = Math.round(Math.min(hh * 0.75, hh - marginY * 2));
    var left = Math.round((hw - w) / 2);
    var top = Math.round((hh - h) / 2);
    return { left: left, top: top, width: w, height: h, hostW: hw, hostH: hh };
  }

  /** 入场动画结束后清掉 transform，避免常驻合成层在内容重绘时糊字 */
  function settleExpandCard(card, root) {
    if (!card) return;
    card.style.transition = 'none';
    card.style.transform = 'none';
    card.style.opacity = '1';
    card.style.willChange = 'auto';
    if (root) root.classList.remove('is-animating');
    void card.offsetWidth;
    card.style.transition = '';
  }

  function renderList() {
    var wrap = $('#spGridWrap');
    var hint = $('#spVoidHint');
    var dateEl = $('#spDateLabel');
    var filterBtn = $('#spFilterBtn');
    if (!wrap) return;

    if (dateEl) dateEl.textContent = dateLabel(ui.dateKey);
    if (filterBtn) filterBtn.classList.toggle('is-on', filterActive());
    /* R44：列表仅待归档 */
    ui.tab = 'pending';
    if (hint) hint.hidden = true;

    var list = listForTab();
    if (!list.length) {
      wrap.innerHTML =
        '<div class="sp-empty">' +
        '<img src="assets/ic_empty.svg" alt="">' +
        '<div class="sp-empty__t">暂无待归档订单</div>' +
        '<div class="sp-empty__s">可切换日期或清除筛选后再试</div>' +
        '</div>';
      return;
    }

    var html = '<div class="sp-grid">';
    list.forEach(function (slip) {
      var empty = !(slip.items && slip.items.length) && slip.contentMode !== 'quick';
      html +=
        '<button type="button" class="sp-slip" data-sp-id="' + slip.id + '">' +
        '<div class="sp-slip__seq">' + escapeHtml(String(slip.seq != null ? slip.seq : '')) + '</div>' +
        '<div class="sp-slip__meta">' + memberTagHtml(slip) +
        '<span class="sp-slip__time">' + slipTimeLabel(slip) + '</span></div>' +
        '<div class="sp-slip__name">' + escapeHtml(slip.customerName) + '</div>' +
        '<div class="sp-slip__item' + (empty ? ' is-empty' : '') + '">' +
        escapeHtml(itemSummary(slip)) + '</div>' +
        '<div class="sp-slip__amt">¥' + money(slip.paid) + '</div>' +
        '</button>';
    });
    html += '</div>';
    wrap.innerHTML = html;
  }

  function expandBodyHtml(slip, readonly) {
    var payBits = (slip.payments || []).map(function (p) {
      return escapeHtml(p.method) + ' ¥' + money(p.amount);
    }).join(' · ');
    if (!payBits) payBits = '实付 ¥' + money(slip.paid);

    var cardsBlock = '';
    if (slip.cards) {
      cardsBlock =
        '<button type="button" class="spf-sum__cards-toggle' + (ui.cardsOpen ? ' is-open' : '') +
        '" data-sp-cards-toggle>持卡' + CHEV_SVG + '</button>' +
        (ui.cardsOpen
          ? '<div class="spf-sum__cards">' + escapeHtml(slip.cards) + '</div>'
          : '');
    }

    var sumHtml =
      '<div class="spf-block spf-sum">' +
      '<div class="spf-sum__cust">' +
      '<img class="spf-sum__av" src="' + escapeHtml(slip.avatar || 'assets/avatar_default.svg') + '" alt="">' +
      '<div class="spf-sum__main">' +
      '<div class="spf-sum__line1">' +
      '<span class="spf-sum__name">' + escapeHtml(slip.customerName) + '</span>' +
      '<span class="spf-sum__vip">会员</span>' +
      '<span class="spf-sum__phone">' + escapeHtml(slip.phone || '') + '</span>' +
      '</div>' + cardsBlock +
      '</div></div>' +
      '<div class="spf-sum__pay">' +
      '<div class="spf-sum__amt"><span>¥</span>' + money(slip.paid) + '</div>' +
      '<div class="spf-sum__pays">' + payBits + '</div></div>' +
      (slip.benefits
        ? '<div class="spf-sum__ben">' + escapeHtml(slip.benefits) + '</div>'
        : '') +
      '<div class="spf-sum__meta">' +
      '<div class="spf-sum__meta-item"><span class="k">时间</span><span class="v">' +
      escapeHtml(slip.dateKey.replace(/-/g, '.')) + ' ' + escapeHtml(slip.time) + '</span></div>' +
      '<div class="spf-sum__meta-item"><span class="k">单号</span><span class="v">' +
      escapeHtml(slip.slipNo) + '</span></div>' +
      '<div class="spf-sum__meta-item"><span class="k">开单人</span><span class="v">自助买单</span></div>' +
      '<div class="spf-sum__meta-item"><span class="k">归档人</span><span class="v">' +
      escapeHtml(readonly ? (slip.archiver || '—') : ARCHIVER) + '</span></div>' +
      '</div></div>';

    var itemsHtml;
    if (readonly) {
      itemsHtml = '<div class="spf-quick-tip">' + escapeHtml(itemSummary(slip)) +
        (slip.contentMode === 'quick' ? '（快捷开单）' : '') + '</div>';
    } else if (ui.contentMode === 'quick') {
      itemsHtml = '';
    } else {
      var list = ui.editItems.length
        ? ui.editItems.map(function (it, idx) {
            return (
              '<div class="spf-item">' +
              '<div class="spf-item__info">' +
              '<div class="spf-item__name">' + escapeHtml(it.name) + '</div>' +
              '<div class="spf-item__sub">' + (it.type === 'product' ? '产品' : '项目') +
              ' · ¥' + money(it.price) + ' ×' + (it.qty || 1) + '</div></div>' +
              '<button type="button" class="spf-item__del" data-sp-del="' + idx + '" aria-label="删除">×</button></div>'
            );
          }).join('')
        : '<div class="spf-quick-tip">尚未添加项目/产品</div>';
      itemsHtml =
        '<div id="spItemsBlock">' +
        '<div class="spf-item-list" id="spItemList">' + list + '</div>' +
        '<button type="button" class="spf-add-btn" data-sp-add>+ 添加项目/产品</button></div>';
    }

    var modeSeg = readonly ? '' : (
      '<div class="spf-seg" role="tablist">' +
      '<button type="button" class="spf-seg__btn' + (ui.contentMode === 'items' ? ' is-on' : '') + '" data-sp-mode="items">项目·产品</button>' +
      '<button type="button" class="spf-seg__btn' + (ui.contentMode === 'quick' ? ' is-on' : '') + '" data-sp-mode="quick">快捷开单</button>' +
      '</div>'
    );

    var staffVal = readonly
      ? (slip.staffs && slip.staffs.length ? slip.staffs.join('、') : '未指定')
      : staffSummaryText(ui.staffRow);
    var staffHas = readonly
      ? !!(slip.staffs && slip.staffs.length)
      : !!(ui.staffRow.staffIds && ui.staffRow.staffIds.length);
    var staffHtml = readonly
      ? '<div class="spf-quick-tip">' + escapeHtml(staffVal) + '</div>'
      : ('<button type="button" class="spf-link-row" data-sp-staff-open>' +
        '<span class="spf-link-row__lab">服务员工</span>' +
        '<span class="spf-link-row__val' + (staffHas ? ' has-val' : '') + '">' +
        escapeHtml(staffVal) + '</span>' +
        '<span class="spf-link-row__chev" aria-hidden="true">' + CHEV_RIGHT + '</span></button>');

    var remarkHtml = readonly
      ? '<div class="spf-quick-tip">' + escapeHtml(slip.remark || '无') + '</div>'
      : '<textarea class="spf-remark" id="spRemark" maxlength="200" placeholder="选填">' +
        escapeHtml(ui.remark) + '</textarea>';

    return (
      sumHtml +
      '<div class="spf-block"><div class="spf-block__h">消费内容</div>' + modeSeg + itemsHtml + '</div>' +
      '<div class="spf-block">' +
      (readonly ? '<div class="spf-block__h">服务员工</div>' : '') +
      staffHtml + '</div>' +
      '<div class="spf-block"><div class="spf-block__h">备注</div>' + remarkHtml + '</div>'
    );
  }

  function paintExpandContent() {
    var slip = getSlip(ui.currentId);
    if (!slip) return;
    var scroll = $('#spExpandScroll');
    var title = $('#spExpandTitle');
    var stamp = $('#spExpandStamp');
    var root = $('#spExpandRoot');
    var card = $('#spExpandCard');
    if (!scroll || !root) return;
    /* 切「快捷开单」等会重绘内容：若仍残留入场 transform，整卡文字会发糊 */
    if (card && root.classList.contains('is-open') && !root.classList.contains('is-animating') &&
        !root.classList.contains('is-closing') && !root.classList.contains('is-flying')) {
      settleExpandCard(card, root);
    }

    if (title) title.textContent = ui.readonly ? (slip.status === 'voided' ? '已作废' : '单据详情') : '补全订单';
    root.classList.toggle('is-readonly', !!ui.readonly);
    scroll.innerHTML = expandBodyHtml(slip, ui.readonly);

    if (stamp) {
      if (ui.readonly && slip.status === 'voided') {
        stamp.hidden = false;
        stamp.className = 'sp-expand__stamp is-void is-show';
        stamp.textContent = '作废';
        stamp.setAttribute('aria-hidden', 'false');
      } else {
        stamp.hidden = true;
        stamp.className = 'sp-expand__stamp';
        stamp.textContent = '';
        stamp.setAttribute('aria-hidden', 'true');
      }
    }

    var remark = $('#spRemark');
    if (remark) {
      remark.addEventListener('input', function () { ui.remark = remark.value || ''; });
    }
  }

  function openExpand(id, fromEl) {
    var slip = getSlip(id);
    if (!slip || ui.animating) return;

    if (slip.status === 'done') {
      if (slip.flowOrderId && window.BillingDemo && window.BillingDemo.openFlowDetail) {
        window.BillingDemo.openFlowDetail(slip.flowOrderId, { fromSuccess: false });
      } else if (window.BillingDemo && window.BillingDemo.openFlowList) {
        toast('已归档样例 · 打开门店流水');
        window.BillingDemo.openFlowList();
      } else {
        toast('已归档 · 请从订单流水查看');
      }
      return;
    }

    ui.currentId = id;
    ui.readonly = slip.status === 'voided';
    ui.contentMode = slip.contentMode === 'quick' ? 'quick' : 'items';
    ui.editItems = (slip.items || []).map(function (it) {
      return { id: it.id, name: it.name, type: it.type, price: it.price, qty: it.qty || 1 };
    });
    ui.staffRow = emptyStaffRow();
    ui.cardsOpen = false;
    ui.remark = slip.remark || '';
    ui.originEl = fromEl || null;
    if (fromEl) fromEl.classList.add('is-origin-hide');

    var root = $('#spExpandRoot');
    var card = $('#spExpandCard');
    if (!root || !card) return;

    paintExpandContent();

    var box = finalCardBox();
    var from = fromEl
      ? layoutRect(fromEl)
      : { left: box.left + 40, top: box.top + 40, width: 80, height: 100 };

    card.style.right = 'auto';
    card.style.width = box.width + 'px';
    card.style.maxWidth = box.width + 'px';
    card.style.height = box.height + 'px';
    card.style.maxHeight = box.height + 'px';
    card.style.left = box.left + 'px';
    card.style.top = box.top + 'px';
    card.style.borderRadius = '14px';
    card.style.background = '#F2F2F7';
    card.style.transformOrigin = 'top left';

    var dx = from.left - box.left;
    var dy = from.top - box.top;
    var sx = Math.max(0.08, from.width / box.width);
    var sy = Math.max(0.08, from.height / box.height);

    root.hidden = false;
    root.classList.remove('is-open', 'is-closing', 'is-flying');
    root.classList.add('is-animating');
    card.style.transition = 'none';
    card.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')';
    card.style.opacity = '0.85';
    card.style.borderRadius = '6px';

    ui.fromRect = { dx: dx, dy: dy, sx: sx, sy: sy };

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.add('is-open');
        card.style.transform = 'translate(0,0) scale(1)';
        card.style.opacity = '1';
        card.style.borderRadius = '14px';
        setTimeout(function () {
          settleExpandCard(card, root);
        }, 500);
      });
    });
  }

  function closeExpand(animated) {
    var root = $('#spExpandRoot');
    var card = $('#spExpandCard');
    if (!root || root.hidden) return;
    if (!animated) {
      root.hidden = true;
      root.classList.remove('is-open', 'is-closing', 'is-flying');
      if (ui.originEl) ui.originEl.classList.remove('is-origin-hide');
      ui.originEl = null;
      ui.currentId = null;
      return;
    }
    if (ui.animating) return;
    ui.animating = true;
    root.classList.add('is-closing');
    root.classList.remove('is-open');
    var fr = ui.fromRect || { dx: 0, dy: 40, sx: 0.2, sy: 0.2 };
    card.style.transform = 'translate(' + fr.dx + 'px,' + fr.dy + 'px) scale(' + fr.sx + ',' + fr.sy + ')';
    card.style.opacity = '0';
    card.style.borderRadius = '6px';
    setTimeout(function () {
      root.hidden = true;
      root.classList.remove('is-closing', 'is-flying');
      card.style.transition = '';
      card.style.transform = '';
      if (ui.originEl) ui.originEl.classList.remove('is-origin-hide');
      ui.originEl = null;
      ui.currentId = null;
      ui.animating = false;
    }, 360);
  }

  function flyToDoneThenClose() {
    var root = $('#spExpandRoot');
    var card = $('#spExpandCard');
    var dot = $('#spFlyDot');
    var doneTab = $('#spTabDone') || $('[data-sp-tab="done"]');
    var tabVisible = doneTab && doneTab.offsetParent !== null;
    if (!root || !card || !dot || !tabVisible) {
      closeExpand(false);
      renderList();
      syncHomeBadge();
      toast('已归档');
      return;
    }
    ui.animating = true;
    root.classList.add('is-flying');
    root.classList.remove('is-open');

    var box = finalCardBox();
    var cardCx = box.left + box.width / 2;
    var cardCy = box.top + box.height / 2;
    card.style.transformOrigin = 'center center';
    card.style.borderRadius = '50%';
    card.style.background = '#34C759';
    card.style.transform = 'translate(' + (cardCx - box.left - 14) + 'px,' + (cardCy - box.top - 14) + 'px) scale(' + (28 / box.width) + ',' + (28 / box.height) + ')';
    card.style.opacity = '0';

    var tabL = layoutRect(doneTab);
    var tx = tabL.left + tabL.width / 2 - 14;
    var ty = tabL.top + tabL.height / 2 - 14;

    dot.hidden = false;
    dot.classList.remove('is-on');
    dot.style.left = (cardCx - 14) + 'px';
    dot.style.top = (cardCy - 14) + 'px';
    dot.style.transform = 'translate(0,0) scale(1)';

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        dot.classList.add('is-on');
        var dx = tx - (cardCx - 14);
        var dy = ty - (cardCy - 14);
        dot.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0.85)';
      });
    });

    setTimeout(function () {
      doneTab.classList.add('is-flash');
      setTimeout(function () { doneTab.classList.remove('is-flash'); }, 600);
      dot.classList.remove('is-on');
      dot.hidden = true;
      root.hidden = true;
      root.classList.remove('is-flying', 'is-closing');
      card.style.transition = '';
      card.style.transform = '';
      card.style.transformOrigin = 'top left';
      card.style.background = '#F2F2F7';
      card.style.borderRadius = '14px';
      card.style.opacity = '';
      card.style.maxHeight = '';
      card.style.maxWidth = '';
      if (ui.originEl) ui.originEl.classList.remove('is-origin-hide');
      ui.originEl = null;
      ui.currentId = null;
      ui.animating = false;
      ui.tab = 'pending';
      renderList();
      syncHomeBadge();
      toast('已归档');
    }, 560);
  }

  function archiveCurrent() {
    var slip = getSlip(ui.currentId);
    if (!slip || slip.status !== 'pending' || ui.readonly) return;

    if (ui.contentMode === 'items' && !ui.editItems.length) {
      toast('请添加项目/产品，或切换为快捷开单');
      return;
    }

    slip.items = ui.contentMode === 'quick' ? [] : ui.editItems.map(function (it) {
      return { id: it.id, name: it.name, type: it.type, price: it.price, qty: it.qty || 1 };
    });
    slip.contentMode = ui.contentMode;
    slip.staffs = staffNamesFromRow(ui.staffRow);
    slip.remark = ui.remark || '';
    slip.archiver = ARCHIVER;
    slip.status = 'done';

    if (window.BillingDemo && typeof window.BillingDemo.recordFromHostCheckout === 'function') {
      var safeItems = slip.items.length
        ? slip.items.map(function (it) {
            return {
              name: it.name,
              type: it.type === 'product' ? 'product' : 'project',
              price: Number(it.price) || 0,
              qty: it.qty || 1,
              amount: (Number(it.price) || 0) * (it.qty || 1),
              staffIds: (ui.staffRow.staffIds || []).slice()
            };
          })
        : [{
            name: '快捷开单',
            type: 'quick',
            price: Number(slip.paid) || 0,
            qty: 1,
            amount: Number(slip.paid) || 0,
            staffIds: (ui.staffRow.staffIds || []).slice()
          }];

      var payLines = (slip.payments || []).map(function (p) {
        return { method: p.method, amount: Number(p.amount) || 0 };
      });
      var order = window.BillingDemo.recordFromHostCheckout({
        isMember: true,
        customerId: 'selfpay-' + slip.id,
        customerName: slip.customerName,
        avatar: slip.avatar,
        amount: Number(slip.paid) || 0,
        listTotal: Math.max(Number(slip.paid) || 0, safeItems.reduce(function (a, it) {
          return a + (Number(it.amount) || 0);
        }, 0)),
        items: safeItems,
        kind: ui.contentMode === 'quick' ? 'qco' : 'bill',
        payments: payLines.some(function (p) { return Number(p.amount) > 0; })
          ? payLines.filter(function (p) { return Number(p.amount) > 0; })
          : [{ method: (payLines[0] && payLines[0].method) || '计次', amount: Number(slip.paid) || 0 }],
        remark: slip.remark || '',
        billBizDate: slip.dateKey,
        manualOrderNo: String(slip.slipNo || '').replace(/\D/g, '').slice(-8)
      });
      if (order) {
        order.cashier = '自助买单';
        order.archiver = ARCHIVER;
        order.source = 'selfpay';
        slip.flowOrderId = order.id;
      }
    }

    flyToDoneThenClose();
  }

  function voidCurrent() {
    var slip = getSlip(ui.currentId);
    if (!slip || slip.status !== 'pending') return;
    slip.status = 'voided';
    slip.voidAt = todayKey();
    closeMask('spVoidMask');
    closeExpand(false);
    ui.tab = 'pending';
    renderList();
    syncHomeBadge();
    toast('已作废，权益已回滚');
  }

  function closeMask(id) {
    var m = document.getElementById(id);
    if (m) m.classList.remove('show');
  }
  function openMask(id) {
    var m = document.getElementById(id);
    if (m) m.classList.add('show');
  }

  function renderPriceSheet() {
    var body = $('#spPriceBody');
    if (!body) return;
    var catAll = priceCatalog();
    var tab = ui.priceTab === 'product' ? 'product' : 'project';
    var cat = catAll[tab] || { groups: [], items: [] };
    var groups = ['全部'].concat(cat.groups || []);
    if (!ui.priceGroup || groups.indexOf(ui.priceGroup) < 0) ui.priceGroup = '全部';
    var g = ui.priceGroup;
    var items = g === '全部'
      ? (cat.items || []).slice()
      : (cat.items || []).filter(function (it) { return it.g === g; });

    var tabsHtml =
      '<div class="v2-page-tabs">' +
      '<button type="button" class="' + (tab === 'project' ? 'on' : '') + '" data-sp-ptab="project">项目</button>' +
      '<button type="button" class="' + (tab === 'product' ? 'on' : '') + '" data-sp-ptab="product">产品</button>' +
      '</div>';
    var gTabs = groups.map(function (name) {
      return '<button type="button" class="v2-group-tab' + (name === g ? ' on' : '') +
        '" data-sp-pgroup="' + escapeHtml(name) + '">' + escapeHtml(name) + '</button>';
    }).join('');
    var list = items.map(function (it, idx) {
      return (
        '<div class="v2-cat-item" data-sp-pname="' + escapeHtml(it.name) +
        '" data-sp-pprice="' + it.price +
        '" data-sp-pprod="' + (tab === 'product' ? '1' : '0') + '">' +
        '<div class="v2-cat-main">' +
        '<div class="v2-cat-info"><div class="v2-cat-name">' + escapeHtml(it.name) + '</div>' +
        '<div class="v2-cat-price"><span class="yen">¥</span>' + money(it.price) + '</div></div>' +
        '<div class="v2-cat-right"><button type="button" class="v2-add-btn" data-sp-padd aria-label="添加">' +
        PLUS_SVG + '</button></div></div></div>'
      );
    }).join('');

    body.innerHTML =
      '<div class="v2-price-card">' +
      '<div class="v2-price-head">' + tabsHtml +
      '<div class="v2-group-bar"><div class="v2-group-seg"><div class="v2-group-scroll">' +
      gTabs + '</div></div></div></div>' +
      '<div class="v2-catalog">' + (list || '<div class="v2-cat-empty">暂无价目</div>') +
      '</div></div>';
  }

  function openPriceSheet() {
    ui.priceTab = 'project';
    ui.priceGroup = '全部';
    renderPriceSheet();
    var m = document.getElementById('spPriceMask');
    if (m) m.classList.add('show');
  }
  function closePriceSheet() {
    var m = document.getElementById('spPriceMask');
    if (m) m.classList.remove('show');
  }

  function openStaffSheet() {
    window.__selfpayStaffRow = ui.staffRow;
    var grid = document.getElementById('spStaffGrid');
    if (grid) {
      grid.setAttribute('data-ctx', 'selfpay');
      if (typeof window.__staffPickResetEdit === 'function') window.__staffPickResetEdit();
      if (typeof renderStaffInto === 'function') renderStaffInto(grid, ui.staffRow);
      else if (typeof window.renderStaffInto === 'function') window.renderStaffInto(grid, ui.staffRow);
    }
    var m = document.getElementById('spStaffMask');
    if (m) m.classList.add('show');
    if (typeof spMeasureHost === 'function') spMeasureHost('spStaffGrid');
    else if (typeof window.spMeasureHost === 'function') window.spMeasureHost('spStaffGrid');
  }
  function closeStaffSheet() {
    var m = document.getElementById('spStaffMask');
    if (m) m.classList.remove('show');
    if (window.__selfpayStaffRow) ui.staffRow = window.__selfpayStaffRow;
    paintExpandContent();
  }
  window.__selfpayOnStaffChange = function () {
    if (window.__selfpayStaffRow) ui.staffRow = window.__selfpayStaffRow;
  };

  function installDateHook() {
    if (window.__v2OnBillDateChange && window.__v2OnBillDateChange._spSelfpay) return;
    var prev = window.__v2OnBillDateChange;
    var hooked = function (key, ctx) {
      if (ctx === 'selfpay') {
        ui.dateKey = key;
        renderList();
        return;
      }
      if (typeof prev === 'function') prev(key, ctx);
    };
    hooked._spSelfpay = true;
    window.__v2OnBillDateChange = hooked;
  }

  function openSelfpayDate() {
    installDateHook();
    if (typeof window.__v2OpenDatePop === 'function') {
      window.__v2OpenDatePop(true, 'selfpay', ui.dateKey);
    } else {
      toast('日期控件未就绪');
    }
  }

  function onExpandClick(e) {
    if (e.target.closest('#spExpandMask') || e.target.closest('#spExpandClose')) {
      if (!ui.animating) closeExpand(true);
      return;
    }
    if (e.target.closest('#spExpandVoid')) {
      openMask('spVoidMask');
      return;
    }
    var mode = e.target.closest('[data-sp-mode]');
    if (mode && !ui.readonly) {
      var next = mode.getAttribute('data-sp-mode');
      if (next === 'quick' && ui.contentMode === 'items' && ui.editItems.length) {
        if (!window.confirm('切换为快捷开单将清空已选项目/产品，确定？')) return;
        ui.editItems = [];
      }
      ui.contentMode = next;
      paintExpandContent();
      return;
    }
    if (e.target.closest('[data-sp-cards-toggle]')) {
      ui.cardsOpen = !ui.cardsOpen;
      paintExpandContent();
      return;
    }
    if (e.target.closest('[data-sp-add]')) {
      openPriceSheet();
      return;
    }
    if (e.target.closest('[data-sp-staff-open]')) {
      openStaffSheet();
      return;
    }
    var del = e.target.closest('[data-sp-del]');
    if (del) {
      ui.editItems.splice(Number(del.getAttribute('data-sp-del')), 1);
      paintExpandContent();
      return;
    }
    if (e.target.closest('#spArchiveBtn')) {
      archiveCurrent();
    }
  }

  function wire() {
    var s16 = $('#s16');
    if (!s16) return;

    s16.addEventListener('click', function (e) {
      if (e.target.closest('#spDateBtn')) {
        openSelfpayDate();
        return;
      }
      if (e.target.closest('#spFilterBtn')) {
        $('#spFltPay').value = ui.filter.pay;
        $('#spFltItems').value = ui.filter.hasItems;
        $('#spFltMin').value = ui.filter.amtMin;
        $('#spFltMax').value = ui.filter.amtMax;
        openMask('spFilterMask');
        return;
      }
      var slipBtn = e.target.closest('[data-sp-id]');
      if (slipBtn) {
        openExpand(slipBtn.getAttribute('data-sp-id'), slipBtn);
      }
    });

    var expand = $('#spExpandRoot');
    if (expand) expand.addEventListener('click', onExpandClick);

    var strip = $('#spHomeStrip');
    if (strip) {
      strip.addEventListener('click', function (e) {
        if (e.target.closest('[data-sp-more]')) {
          go('s16');
          return;
        }
        var btn = e.target.closest('[data-sp-id]');
        if (btn) openExpand(btn.getAttribute('data-sp-id'), btn);
      });
    }

    var search = $('#spSearchInput');
    if (search) {
      search.addEventListener('input', function () {
        ui.search = search.value || '';
        renderList();
      });
    }

    document.addEventListener('click', function (e) {
      var mask = e.target.closest('.sp-mask');
      if (mask && e.target === mask) {
        mask.classList.remove('show');
        return;
      }
      if (e.target.closest('[data-sp-close]')) {
        closeMask(e.target.closest('[data-sp-close]').getAttribute('data-sp-close'));
        return;
      }
      if (e.target.closest('#spFltReset')) {
        ui.filter = { pay: '', hasItems: '', amtMin: '', amtMax: '' };
        closeMask('spFilterMask');
        renderList();
        return;
      }
      if (e.target.closest('#spFltOk')) {
        ui.filter = {
          pay: ($('#spFltPay') || {}).value || '',
          hasItems: ($('#spFltItems') || {}).value || '',
          amtMin: ($('#spFltMin') || {}).value || '',
          amtMax: ($('#spFltMax') || {}).value || ''
        };
        closeMask('spFilterMask');
        renderList();
        return;
      }
      if (e.target.closest('#spVoidConfirm')) {
        voidCurrent();
        return;
      }
      if (e.target.closest('#spStaffOk')) {
        closeStaffSheet();
        return;
      }
      if (e.target.closest('#spPriceClose')) {
        closePriceSheet();
        return;
      }
      var pTab = e.target.closest('[data-sp-ptab]');
      if (pTab && $('#spPriceMask') && $('#spPriceMask').classList.contains('show')) {
        ui.priceTab = pTab.getAttribute('data-sp-ptab');
        ui.priceGroup = '全部';
        renderPriceSheet();
        return;
      }
      var pGroup = e.target.closest('[data-sp-pgroup]');
      if (pGroup && $('#spPriceMask') && $('#spPriceMask').classList.contains('show')) {
        ui.priceGroup = pGroup.getAttribute('data-sp-pgroup');
        renderPriceSheet();
        return;
      }
      var padd = e.target.closest('[data-sp-padd]');
      if (padd && $('#spPriceMask') && $('#spPriceMask').classList.contains('show')) {
        var row = padd.closest('.v2-cat-item');
        if (!row) return;
        ui.editItems.push({
          id: 'sp-' + Date.now() + '-' + ui.editItems.length,
          name: row.getAttribute('data-sp-pname') || '项目',
          type: row.getAttribute('data-sp-pprod') === '1' ? 'product' : 'project',
          price: Number(row.getAttribute('data-sp-pprice')) || 0,
          qty: 1
        });
        closePriceSheet();
        paintExpandContent();
        toast('已添加');
      }
    });
  }

  function hookNav() {
    var fn = window.go;
    if (typeof fn !== 'function' || fn._spHook) return;
    var orig = fn;
    window.go = function (id) {
      var ret = orig.apply(this, arguments);
      if (id === 's16') setTimeout(function () { ui.tab = 'pending'; renderList(); }, 0);
      if (id === 's0') setTimeout(function () { renderHomeStrip(); }, 0);
      if (id === 's17') {
        /* 旧入口兜底：回 s16 */
        setTimeout(function () { orig.call(window, 's16'); }, 0);
      }
      return ret;
    };
    window.go._spHook = true;
  }

  function boot() {
    wire();
    hookNav();
    installDateHook();
    syncHomeBadge();
    if ($('#s16') && $('#s16').classList.contains('active')) renderList();
    window.SelfPay = {
      pendingCount: pendingCount,
      syncHomeBadge: syncHomeBadge,
      renderHomeStrip: renderHomeStrip,
      renderList: renderList,
      open: function () { go('s16'); },
      closeStaffSheet: closeStaffSheet,
      closePriceSheet: closePriceSheet,
      /* Run-to-Figma 抓取：切 Tab / 打开放大卡与 sheet（不改业务逻辑） */
      setTab: function (tab) {
        ui.tab = tab || 'pending';
        renderList();
      },
      openExpandById: function (id) {
        var card = document.querySelector('#spGridWrap [data-sp-id="' + id + '"]') ||
          document.querySelector('[data-sp-id="' + id + '"]');
        openExpand(id, card || null);
      },
      setContentMode: function (mode) {
        ui.contentMode = mode === 'quick' ? 'quick' : 'items';
        if (ui.contentMode === 'quick') ui.editItems = [];
        paintExpandContent();
      },
      openFilter: function () {
        var pay = document.getElementById('spFltPay');
        var items = document.getElementById('spFltItems');
        var min = document.getElementById('spFltMin');
        var max = document.getElementById('spFltMax');
        if (pay) pay.value = ui.filter.pay;
        if (items) items.value = ui.filter.hasItems;
        if (min) min.value = ui.filter.amtMin;
        if (max) max.value = ui.filter.amtMax;
        openMask('spFilterMask');
      },
      openDate: openSelfpayDate,
      openPrice: openPriceSheet,
      openStaff: openStaffSheet,
      openVoidConfirm: function () { openMask('spVoidMask'); }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 0); });
  } else {
    setTimeout(boot, 0);
  }
})();
