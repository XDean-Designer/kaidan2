/**
 * 自助订单 · R45
 * 首页横滑票卡 + s16 列表 + s17 全屏补全（逐项员工 / 价目 sheet / 快捷开单）
 */
(function () {
  'use strict';

  var ARCHIVER = '店员小陈';
  var PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var CHEV_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var MORE_ICON = '<img class="vh-sp-more__ic" src="assets/ic_sp_more.svg" alt="" width="20" height="20">';
  var HELP_ICON = '<img class="sp-help-btn__ic" src="assets/ic_sp_help.svg" alt="" width="16" height="16">';
  /* 猜你想加 · 演示种子（②热销 / ③搭配 / ④归档常用） */
  var SUGGEST_HOT = [
    '洗剪吹', '染发', '深层滋养', '烫发', '时尚洗吹',
    '蛋白矫正', '精致剪发', '剑琅修护洗发水', '挑染', '头皮护理'
  ];
  var SUGGEST_PAIR = {
    '洗剪吹': ['深层滋养', '剑琅修护洗发水', '时尚造型'],
    '时尚洗吹': ['深层滋养', '剑琅哑光发泥'],
    '洗头': ['头皮护理', '剑琅头皮护理精华'],
    '染发': ['剑琅染发护色套装', '剑琅护色洗发水', '深层滋养'],
    '漂发': ['剑琅漂后修护乳', '蛋白矫正'],
    '烫发': ['深层滋养', '剑琅柔顺发膜'],
    '蛋白矫正': ['剑琅护发精油', '深层滋养'],
    '深层滋养': ['剑琅柔顺发膜', '剑琅修护洗发水'],
    '精致剪发': ['时尚造型', '剑琅哑光发泥'],
    '儿童剪发': ['剑琅儿童护发素'],
    '头皮护理': ['剑琅头皮护理精华', '剑琅头皮清洁泥'],
    '护理': ['剑琅柔顺发膜', '深层滋养'],
    '洗吹': ['深层滋养', '剑琅修护洗发水'],
    '剪发': ['时尚造型', '剑琅哑光发泥']
  };
  var SUGGEST_RECENT = {
    '洗剪吹': 28, '染发': 22, '深层滋养': 18, '时尚洗吹': 15,
    '剑琅修护洗发水': 14, '烫发': 12, '精致剪发': 11, '头皮护理': 9,
    '剑琅柔顺发膜': 8, '蛋白矫正': 7, '挑染': 6, '剑琅护色洗发水': 5,
    '时尚造型': 4, '剑琅染发护色套装': 4
  };
  var STATIONS = [
    { id: 'senior', lab: '大工' },
    { id: 'mid', lab: '中工' },
    { id: 'junior', lab: '小工' }
  ];

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
  function goBack() {
    if (typeof window.goBack === 'function') window.goBack();
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var COMMISSION_RATE = 0.1;

  function seedSlips() {
    var t = todayKey();
    var y = shiftDay(t, -1);
    var y2 = shiftDay(t, -2);
    return [
      {
        id: 'sp-1', seq: 100, isMember: true, status: 'pending', dateKey: t, time: '09:18',
        customerName: '何静', phone: '188****6655',
        avatar: 'assets/avatar_card_female.png',
        cards: '储值卡 美发卡　余额 ¥1,280.00',
        items: [
          { id: 'p0', name: '洗剪吹', type: 'project', price: 88, qty: 1 },
          { id: 'p1', name: '蛋白矫正', type: 'project', price: 298, qty: 1 },
          { id: 'p2', name: '护理', type: 'project', price: 168, qty: 1 },
          { id: 'g1', name: '发膜', type: 'product', price: 112, qty: 1 }
        ],
        paid: 666, payments: [{ method: '微信', amount: 666 }],
        benefits: '', slipNo: 'SP202610150018', remark: ''
      },
      {
        id: 'sp-2', seq: 101, isMember: true, status: 'pending', dateKey: t, time: '10:42',
        customerName: '陈昕然', phone: '186****9033',
        avatar: 'assets/avatar_female3.png',
        cards: '计次卡 染烫10次　余 4 次',
        items: [],
        paid: 198, payments: [{ method: '微信', amount: 198 }],
        benefits: '', slipNo: 'SP202610150042', remark: '顾客备注：补项目'
      },
      {
        id: 'sp-3', seq: 102, isMember: true, status: 'pending', dateKey: t, time: '11:05',
        customerName: '周雨欣', phone: '159****4412',
        avatar: 'assets/avatar_female2.png',
        cards: '计次卡 洗吹次卡　余 6 次',
        items: [{ id: 'p2', name: '洗吹', type: 'project', price: 38, qty: 1 }],
        paid: 38, payments: [{ method: '会员卡', amount: 38 }],
        benefits: '', slipNo: 'SP202610150055', remark: ''
      },
      {
        id: 'sp-4', seq: 103, isMember: true, status: 'pending', dateKey: t, time: '13:20',
        customerName: '马婷', phone: '137****7788',
        avatar: 'assets/avatar_card_female.png',
        cards: '折扣卡 超值折扣　8.0 折',
        items: [{ id: 'p3', name: '染发', type: 'project', price: 298, qty: 1 }],
        paid: 238.4, payments: [{ method: '微信', amount: 238.4 }],
        benefits: '折扣卡 8 折', slipNo: 'SP202610150088', remark: ''
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
        paid: 260, payments: [{ method: '会员卡', amount: 200 }, { method: '微信', amount: 60 }],
        benefits: '', slipNo: 'SP202610150102', remark: ''
      },
      {
        id: 'sp-6', seq: 105, isMember: false, status: 'pending', dateKey: t, time: '15:33',
        customerName: '散客', phone: '', guestGender: '',
        avatar: 'assets/avatar_default.svg',
        cards: '',
        items: [{ id: 'p2', name: '洗吹', type: 'project', price: 38, qty: 1 }],
        paid: 68, payments: [{ method: '微信', amount: 68 }],
        benefits: '', slipNo: 'SP202610150133', remark: ''
      },
      {
        id: 'sp-y1', seq: 106, isMember: true, status: 'pending', dateKey: y, time: '16:40',
        customerName: '蔡雅婷', phone: '139****1100',
        avatar: 'assets/avatar_female2.png',
        cards: '储值卡 美发卡　余额 ¥2,100.00',
        items: [{ id: 'p1', name: '剪发', type: 'project', price: 68, qty: 1 }],
        paid: 68, payments: [{ method: '微信', amount: 68 }],
        benefits: '', slipNo: 'SP202610140240', remark: '跨日待处理样例'
      },
      {
        id: 'sp-y2', seq: 107, isMember: false, status: 'pending', dateKey: y2, time: '11:12',
        customerName: '散客', phone: '', guestGender: '',
        avatar: 'assets/avatar_default.svg',
        cards: '',
        items: [{ id: 'p2', name: '洗吹', type: 'project', price: 38, qty: 1 }],
        paid: 38, payments: [{ method: '微信', amount: 38 }],
        benefits: '', slipNo: 'SP202610130112', remark: ''
      }
    ];
  }

  var slips = seedSlips();
  var ui = {
    tab: 'pending',
    dateKey: '', /* '' = 全部 */
    search: '',
    filter: { pay: '', hasItems: '', amtMin: '', amtMax: '' },
    currentId: null,
    contentMode: 'items',
    editItems: [],
    orderStaff: emptyAssign(),
    remark: '',
    cardsOpen: false,
    priceTab: 'project',
    priceGroup: '全部',
    readonly: false,
    allocMode: 'station',
    pickCtx: null,
    guestGender: '',
    perfRows: [],
    perfStaffKey: '',
    perfEditId: null,
    perfKeypadBuf: '',
    perfKeypadReplace: false
  };

  function emptyAssign() {
    return {
      stations: { senior: [], mid: [], junior: [] },
      people: []
    };
  }
  function cloneAssign(a) {
    a = a || emptyAssign();
    return {
      stations: {
        senior: (a.stations.senior || []).map(function (x) { return Object.assign({}, x); }),
        mid: (a.stations.mid || []).map(function (x) { return Object.assign({}, x); }),
        junior: (a.stations.junior || []).map(function (x) { return Object.assign({}, x); })
      },
      people: (a.people || []).map(function (x) { return Object.assign({}, x); })
    };
  }
  function ensureItemAssign(it) {
    if (!it.assign) it.assign = emptyAssign();
    return it.assign;
  }
  function staffPoolList() {
    if (typeof window.staffPool === 'function') return window.staffPool() || [];
    return [];
  }
  function namesFromAssign(a) {
    a = a || emptyAssign();
    var out = [];
    if (ui.allocMode === 'average') {
      (a.people || []).forEach(function (p) { out.push(p.name + (p.dianke ? '(点客)' : '')); });
    } else {
      STATIONS.forEach(function (st) {
        (a.stations[st.id] || []).forEach(function (p) {
          out.push(st.lab + '·' + p.name + (p.dianke ? '(点客)' : ''));
        });
      });
    }
    return out;
  }
  function hasAnyStaff() {
    if (ui.contentMode === 'quick') return namesFromAssign(ui.orderStaff).length > 0;
    return ui.editItems.some(function (it) { return namesFromAssign(it.assign).length > 0; });
  }
  function collectStaffNames() {
    if (ui.contentMode === 'quick') return namesFromAssign(ui.orderStaff);
    var all = [];
    ui.editItems.forEach(function (it) {
      namesFromAssign(it.assign).forEach(function (n) {
        if (all.indexOf(n) < 0) all.push(n);
      });
    });
    return all;
  }
  function peopleFromAssign(a) {
    a = a || emptyAssign();
    var out = [];
    if (ui.allocMode === 'average') {
      (a.people || []).forEach(function (p) { out.push(p); });
    } else {
      STATIONS.forEach(function (st) {
        (a.stations[st.id] || []).forEach(function (p) { out.push(p); });
      });
    }
    return out;
  }
  function collectUniqueStaff() {
    var map = {};
    var list = [];
    function add(p) {
      if (!p || !p.id || map[p.id]) return;
      map[p.id] = true;
      list.push({ id: p.id, name: p.name || p.id });
    }
    if (ui.contentMode === 'quick') {
      peopleFromAssign(ui.orderStaff).forEach(add);
    } else {
      ui.editItems.forEach(function (it) {
        peopleFromAssign(it.assign).forEach(add);
      });
    }
    return list;
  }
  function guestDisplayName(gender) {
    if (gender === 'male') return '男散客';
    if (gender === 'female') return '女散客';
    return '散客';
  }
  function displayCustomerName(slip) {
    if (!slip) return '';
    if (!slip.isMember) return guestDisplayName(slip.guestGender || '');
    return slip.customerName || '';
  }
  function payModeOf(slip) {
    var methods = (slip.payments || []).map(function (p) { return p.method; });
    var hasWx = methods.indexOf('微信') >= 0;
    var hasCard = methods.indexOf('会员卡') >= 0;
    if (hasWx && hasCard) return '微信+会员卡';
    if (hasCard) return '会员卡';
    if (hasWx) return '微信';
    return methods[0] || '';
  }
  function formatPayBits(slip) {
    var ps = slip.payments || [];
    if (!ps.length) return '实付 ¥' + money(slip.paid);
    return ps.map(function (p) {
      return escapeHtml(p.method) + ' ¥' + money(p.amount);
    }).join(' · ');
  }
  function commissionOf(achievement) {
    return Math.round((Number(achievement) || 0) * COMMISSION_RATE * 100) / 100;
  }
  function reconcilePerfRows() {
    var slip = getSlip(ui.currentId);
    var staff = collectUniqueStaff();
    var key = staff.map(function (s) { return s.id; }).join(',');
    var paid = slip ? (Number(slip.paid) || 0) : 0;
    if (!staff.length) {
      ui.perfRows = [];
      ui.perfStaffKey = '';
      return;
    }
    if (key === ui.perfStaffKey && ui.perfRows && ui.perfRows.length === staff.length) {
      ui.perfRows.forEach(function (row, i) {
        if (staff[i]) row.name = staff[i].name;
      });
      return;
    }
    ui.perfStaffKey = key;
    var n = staff.length;
    var eachCents = Math.floor(Math.round(paid * 100) / n);
    var rows = staff.map(function (s, i) {
      var cents = i === n - 1
        ? Math.round(paid * 100) - eachCents * (n - 1)
        : eachCents;
      return { id: s.id, name: s.name, achievement: cents / 100 };
    });
    ui.perfRows = rows;
  }
  function perfBlockHtml(readonly) {
    reconcilePerfRows();
    if (!ui.perfRows.length) {
      return '<div class="spf-block"><div class="spf-block__h">业绩提成</div>' +
        '<div class="spf-quick-tip">选择员工后显示业绩与提成</div></div>';
    }
    var rows = ui.perfRows.map(function (row) {
      var achBtn = readonly
        ? '<span class="spf-perf-row__ach">¥' + money(row.achievement) + '</span>'
        : '<button type="button" class="spf-perf-row__ach" data-sp-perf="' +
          escapeHtml(row.id) + '" aria-label="修改业绩">¥' + money(row.achievement) +
          '<img class="spf-perf-row__ach-ic" src="assets/ic_sp_perf_edit.svg" alt="" width="12" height="12"></button>';
      return (
        '<div class="spf-perf-row">' +
        '<div class="spf-perf-row__nm">' + escapeHtml(row.name) + '</div>' +
        '<div class="spf-perf-row__col">' + achBtn + '</div>' +
        '<div class="spf-perf-row__col">' +
        '<span class="spf-perf-row__comm">¥' + money(commissionOf(row.achievement)) + '</span></div></div>'
      );
    }).join('');
    return (
      '<div class="spf-block"><div class="spf-block__h">业绩提成</div>' +
      '<div class="spf-perf-list">' +
      '<div class="spf-perf-head" aria-hidden="true">' +
      '<span class="spf-perf-head__nm">员工</span>' +
      '<span class="spf-perf-head__col">业绩</span>' +
      '<span class="spf-perf-head__col">提成</span></div>' +
      rows + '</div></div>'
    );
  }

  function pendingCount() {
    return slips.filter(function (s) { return s.status === 'pending'; }).length;
  }
  function getSlip(id) {
    return slips.find(function (s) { return s.id === id; });
  }
  function dayDiffFromToday(dateKey) {
    if (!dateKey) return 0;
    var a = dateKey.split('-').map(Number);
    var b = todayKey().split('-').map(Number);
    var da = new Date(a[0], a[1] - 1, a[2]);
    var db = new Date(b[0], b[1] - 1, b[2]);
    return Math.round((db - da) / 86400000);
  }
  function slipHasStaffSeed(slip) {
    if (slip.staffs && slip.staffs.length) return true;
    if (slip.orderStaff && namesFromAssign(slip.orderStaff).length) return true;
    return (slip.items || []).some(function (it) {
      return it.assign && namesFromAssign(it.assign).length > 0;
    });
  }
  function scoreSlip(slip) {
    var score = 0;
    var noItems = !(slip.items && slip.items.length) && slip.contentMode !== 'quick';
    if (noItems) score += 3;
    var days = dayDiffFromToday(slip.dateKey);
    if (days > 0) score += 2;
    if (!slipHasStaffSeed(slip)) score += 2;
    score += Math.min(7, Math.max(0, days)) * 1;
    var hm = String(slip.time || '00:00').split(':');
    var mins = (Number(hm[0]) || 0) * 60 + (Number(hm[1]) || 0);
    score += mins / 1440 * 0.2;
    return score;
  }
  function sortByS4(list) {
    return list.slice().sort(function (a, b) {
      var ds = scoreSlip(b) - scoreSlip(a);
      if (Math.abs(ds) > 1e-6) return ds;
      return (Number(a.seq) || 0) - (Number(b.seq) || 0);
    });
  }
  function pendingSlipsAll() {
    return sortByS4(slips.filter(function (s) { return s.status === 'pending'; }));
  }
  function memberTagHtml(slip) {
    var mem = !!slip.isMember;
    return '<span class="sp-tag ' + (mem ? 'is-mem' : 'is-guest') + '">' + (mem ? '会' : '散') + '</span>';
  }
  function ticketTimeLabel(slip) {
    var p = (slip.dateKey || todayKey()).split('-');
    return Number(p[1]) + '/' + Number(p[2]) + ' ' + (slip.time || '');
  }
  function itemLinesHtml(slip) {
    var items = slip.items || [];
    if (!items.length) {
      if (slip.contentMode === 'quick') return '<div class="sp-ticket__line">快捷开单</div>';
      return '<div class="sp-ticket__line is-empty">未填项目</div>';
    }
    if (items.length === 1) {
      return '<div class="sp-ticket__line">' + escapeHtml(items[0].name) + '</div>';
    }
    return (
      '<div class="sp-ticket__line">' + escapeHtml(items[0].name) + '</div>' +
      '<div class="sp-ticket__line2">' +
      '<span>' + escapeHtml(items[1].name) + '</span>' +
      '<span class="sp-ticket__more">等' + items.length + '项</span></div>'
    );
  }
  function ticketHtml(slip) {
    return (
      '<button type="button" class="sp-ticket" data-sp-id="' + slip.id + '">' +
      '<i class="sp-ticket__stub" aria-hidden="true"></i>' +
      '<div class="sp-ticket__seq">' + escapeHtml(String(slip.seq != null ? slip.seq : '')) + '</div>' +
      '<div class="sp-ticket__name">' + escapeHtml(displayCustomerName(slip)) + '</div>' +
      '<div class="sp-ticket__time">' + escapeHtml(ticketTimeLabel(slip)) + '</div>' +
      '<div class="sp-ticket__items">' + itemLinesHtml(slip) + '</div>' +
      '<div class="sp-ticket__ft">' + memberTagHtml(slip) +
      '<div class="sp-ticket__amt">¥' + money(slip.paid) + '</div></div></button>'
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
    list.slice(0, 5).forEach(function (slip) { html += ticketHtml(slip); });
    html +=
      '<button type="button" class="vh-sp-more" data-sp-more aria-label="更多">' +
      '<span class="vh-sp-more__t">更多</span>' + MORE_ICON +
      '</button>';
    el.innerHTML = html;
  }
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
    if (!key) return '全部';
    if (key === todayKey()) return '今天';
    var p = key.split('-');
    return Number(p[1]) + '/' + Number(p[2]);
  }
  function filterActive() {
    var f = ui.filter;
    return !!(f.pay || f.hasItems || f.amtMin !== '' || f.amtMax !== '');
  }
  function matchesFilter(slip) {
    if (ui.dateKey && slip.dateKey !== ui.dateKey) return false;
    var q = (ui.search || '').trim();
    if (q) {
      var disp = displayCustomerName(slip);
      var hit =
        (disp && disp.indexOf(q) >= 0) ||
        (slip.customerName && slip.customerName.indexOf(q) >= 0) ||
        (slip.phone && slip.phone.indexOf(q) >= 0) ||
        (slip.slipNo && slip.slipNo.indexOf(q) >= 0);
      if (!hit) return false;
    }
    var f = ui.filter;
    if (f.pay) {
      if (payModeOf(slip) !== f.pay) return false;
    }
    if (f.hasItems === 'yes' && !(slip.items && slip.items.length)) return false;
    if (f.hasItems === 'no' && slip.items && slip.items.length) return false;
    if (f.amtMin !== '' && Number(slip.paid) < Number(f.amtMin)) return false;
    if (f.amtMax !== '' && Number(slip.paid) > Number(f.amtMax)) return false;
    return true;
  }
  function listForTab() {
    return sortByS4(slips.filter(function (s) {
      return s.status === 'pending' && matchesFilter(s);
    }));
  }

  function renderList() {
    var wrap = $('#spGridWrap');
    var hint = $('#spVoidHint');
    var dateEl = $('#spDateLabel');
    var filterBtn = $('#spFilterBtn');
    if (!wrap) return;
    if (dateEl) dateEl.textContent = dateLabel(ui.dateKey);
    if (filterBtn) filterBtn.classList.toggle('is-on', filterActive());
    ui.tab = 'pending';
    if (hint) hint.hidden = true;
    var list = listForTab();
    if (!list.length) {
      wrap.innerHTML =
        '<div class="sp-empty">' +
        '<img src="assets/ic_empty.svg" alt="">' +
        '<div class="sp-empty__t">暂无待归档订单</div>' +
        '<div class="sp-empty__s">可切换日期或清除筛选后再试</div></div>';
      return;
    }
    var html = '<div class="sp-grid">';
    list.forEach(function (slip) { html += ticketHtml(slip); });
    html += '</div>';
    wrap.innerHTML = html;
  }

  function slotBtnHtml(ctx, person, emptyLab) {
    if (!person) {
      return (
        '<button type="button" class="spf-slot" data-sp-slot="' + escapeHtml(ctx) + '">' +
        (emptyLab || '+') + '</button>'
      );
    }
    return (
      '<button type="button" class="spf-slot is-filled" data-sp-slot="' + escapeHtml(ctx) + '">' +
      '<span>' + escapeHtml(person.name) + '</span>' +
      (person.dianke ? '<span class="spf-slot__dk">点客</span>' : '') +
      '<span class="spf-slot__x" data-sp-slot-clear="' + escapeHtml(ctx) + '" aria-label="清除">×</span></button>'
    );
  }

  function assignBlockHtml(assign, prefix, readonly) {
    assign = assign || emptyAssign();
    if (readonly) {
      var names = namesFromAssign(assign);
      return '<div class="spf-quick-tip">' + escapeHtml(names.length ? names.join('、') : '未指定') + '</div>';
    }
    if (ui.allocMode === 'average') {
      var people = assign.people || [];
      var slots = people.slice();
      if (slots.length < 5) slots.push(null);
      var html = '<div class="spf-st-block"><div class="spf-st-row"><div class="spf-st-lab">员工</div><div class="spf-st-slots">';
      slots.forEach(function (p, i) {
        html += slotBtnHtml(prefix + '|avg|' + i, p, '+');
      });
      html += '</div></div></div>';
      return html;
    }
    var out = '<div class="spf-st-block">';
    STATIONS.forEach(function (st) {
      var arr = assign.stations[st.id] || [];
      var slots = arr.slice();
      if (slots.length < 3) slots.push(null);
      out += '<div class="spf-st-row"><div class="spf-st-lab">' + st.lab + '</div><div class="spf-st-slots">';
      slots.forEach(function (p, i) {
        out += slotBtnHtml(prefix + '|' + st.id + '|' + i, p, '+');
      });
      out += '</div></div>';
    });
    out += '</div>';
    return out;
  }

  function completeBodyHtml(slip, readonly) {
    var payBits = formatPayBits(slip);
    var custName = displayCustomerName(slip);
    var gender = ui.guestGender || '';
    var genderHtml = '';
    if (!slip.isMember && !readonly) {
      genderHtml =
        '<div class="spf-sum__gender">' +
        '<span class="spf-sum__gender-lab">性别</span>' +
        '<button type="button" class="spf-gender-btn' + (gender === '' ? ' is-on' : '') +
        '" data-sp-gender="">不选</button>' +
        '<button type="button" class="spf-gender-btn' + (gender === 'male' ? ' is-on' : '') +
        '" data-sp-gender="male">男</button>' +
        '<button type="button" class="spf-gender-btn' + (gender === 'female' ? ' is-on' : '') +
        '" data-sp-gender="female">女</button></div>';
    }

    var timeText = escapeHtml(slip.dateKey.replace(/-/g, '.')) + '  ' + escapeHtml(slip.time);
    var cardsRow =
      '<div class="spf-sum__cards-row">' +
      (slip.cards
        ? '<button type="button" class="spf-sum__cards-toggle' + (ui.cardsOpen ? ' is-open' : '') +
          '" data-sp-cards-toggle>持卡' + CHEV_SVG + '</button>'
        : '<span class="spf-sum__cards-toggle is-empty"></span>') +
      '<span class="spf-sum__time">' + timeText + '</span></div>' +
      (slip.cards && ui.cardsOpen
        ? '<div class="spf-sum__cards">' + escapeHtml(slip.cards) + '</div>'
        : '');

    var sumHtml =
      '<div class="spf-block spf-sum">' +
      '<div class="spf-sum__cust">' +
      '<img class="spf-sum__av" src="' + escapeHtml(slip.avatar || 'assets/avatar_default.svg') + '" alt="">' +
      '<div class="spf-sum__main">' +
      '<div class="spf-sum__line1">' +
      '<span class="spf-sum__name">' + escapeHtml(custName) + '</span>' +
      (slip.isMember ? '<span class="spf-sum__vip">会员</span>' : '<span class="spf-sum__vip" style="background:#EEF2FF;color:#4A7BF4">散客</span>') +
      (slip.phone ? '<span class="spf-sum__phone">' + escapeHtml(slip.phone) + '</span>' : '') +
      '</div>' + cardsRow + genderHtml +
      '</div></div>' +
      '<div class="spf-sum__pay">' +
      '<div class="spf-sum__amt"><span>¥</span>' + money(slip.paid) + '</div>' +
      '<div class="spf-sum__pays">' + payBits + '</div></div>' +
      (slip.benefits ? '<div class="spf-sum__ben">' + escapeHtml(slip.benefits) + '</div>' : '') +
      '</div>';

    var itemsHtml = '';
    if (readonly) {
      itemsHtml = '<div class="spf-quick-tip">' + escapeHtml(itemSummary(slip)) +
        (slip.contentMode === 'quick' ? '（快捷开单）' : '') + '</div>';
      if (slip.contentMode !== 'quick' && slip.items && slip.items.length) {
        itemsHtml += slip.items.map(function (it) {
          return '<div class="spf-item"><div class="spf-item__info"><div class="spf-item__name">' +
            escapeHtml(it.name) + '</div><div class="spf-item__sub">' +
            (it.type === 'product' ? '产品' : '项目') + ' · ¥' + money(it.price) +
            ' ×' + (it.qty || 1) + '</div></div></div>';
        }).join('');
      }
    } else if (ui.contentMode === 'quick') {
      itemsHtml =
        '<div class="spf-quick-tip">已选快捷开单（无明细项）</div>' +
        '<button type="button" class="spf-add-btn" data-sp-add>+ 添加项目/产品</button>' +
        '<div class="spf-block__h" style="margin-top:14px">服务员工</div>' +
        assignBlockHtml(ui.orderStaff, 'order', false);
    } else {
      var list = ui.editItems.length
        ? ui.editItems.map(function (it, idx) {
            ensureItemAssign(it);
            return (
              '<div class="spf-item" style="flex-direction:column;align-items:stretch">' +
              '<div style="display:flex;align-items:center;gap:8px">' +
              '<div class="spf-item__info" style="flex:1">' +
              '<div class="spf-item__name">' + escapeHtml(it.name) + '</div>' +
              '<div class="spf-item__sub">' + (it.type === 'product' ? '产品' : '项目') +
              ' · ¥' + money(it.price) + ' ×' + (it.qty || 1) + '</div></div>' +
              '<button type="button" class="spf-item__del" data-sp-del="' + idx + '" aria-label="删除">×</button></div>' +
              assignBlockHtml(it.assign, 'item|' + idx, false) +
              '</div>'
            );
          }).join('')
        : '<div class="spf-quick-tip">尚未添加项目/产品</div>';
      itemsHtml =
        '<div id="spItemsBlock">' +
        '<div class="spf-item-list" id="spItemList">' + list + '</div>' +
        '<button type="button" class="spf-add-btn" data-sp-add>+ 添加项目/产品</button></div>';
    }

    var remarkHtml = readonly
      ? '<div class="spf-quick-tip">' + escapeHtml(slip.remark || '无') + '</div>'
      : '<textarea class="spf-remark" id="spRemark" maxlength="200" placeholder="选填">' +
        escapeHtml(ui.remark) + '</textarea>';

    return (
      sumHtml +
      '<div class="spf-block"><div class="spf-block__h">消费内容</div>' + itemsHtml + '</div>' +
      perfBlockHtml(readonly) +
      '<div class="spf-block"><div class="spf-block__h">备注</div>' + remarkHtml + '</div>'
    );
  }

  function paintS17() {
    var slip = getSlip(ui.currentId);
    if (!slip) return;
    var scroll = $('#s17Scroll');
    var title = $('#s17Title');
    var root = $('#s17');
    var bar = $('#s17Bar');
    if (!scroll || !root) return;
    if (title) title.textContent = ui.readonly ? (slip.status === 'voided' ? '已作废' : '单据详情') : '补全订单';
    root.classList.toggle('is-readonly', !!ui.readonly);
    if (bar) bar.hidden = !!ui.readonly;
    scroll.innerHTML = completeBodyHtml(slip, ui.readonly);
    var remark = $('#spRemark');
    if (remark) {
      remark.addEventListener('input', function () { ui.remark = remark.value || ''; });
    }
    syncAllocNav();
  }

  function openComplete(id) {
    var slip = getSlip(id);
    if (!slip) return;
    if (slip.status === 'done') {
      toast('已归档 · 请从订单流水查看');
      return;
    }
    ui.currentId = id;
    ui.readonly = slip.status === 'voided';
    ui.contentMode = slip.contentMode === 'quick' ? 'quick' : 'items';
    ui.editItems = (slip.items || []).map(function (it) {
      return {
        id: it.id, name: it.name, type: it.type, price: it.price, qty: it.qty || 1,
        assign: cloneAssign(it.assign)
      };
    });
    ui.orderStaff = cloneAssign(slip.orderStaff);
    ui.cardsOpen = false;
    ui.remark = slip.remark || '';
    ui.guestGender = slip.isMember ? '' : (slip.guestGender || '');
    if (!slip.isMember) {
      slip.customerName = guestDisplayName(ui.guestGender);
    }
    ui.perfRows = [];
    ui.perfStaffKey = '';
    go('s17');
    setTimeout(paintS17, 0);
  }

  function closeComplete() {
    ui.currentId = null;
    goBack();
    renderList();
    syncHomeBadge();
  }

  function archiveCurrent() {
    var slip = getSlip(ui.currentId);
    if (!slip || slip.status !== 'pending' || ui.readonly) return;

    if (ui.contentMode === 'items' && !ui.editItems.length) {
      toast('请添加项目/产品，或使用快捷开单');
      return;
    }
    if (!hasAnyStaff()) {
      toast('未指定服务员工');
    }

    slip.items = ui.contentMode === 'quick' ? [] : ui.editItems.map(function (it) {
      return {
        id: it.id, name: it.name, type: it.type, price: it.price, qty: it.qty || 1,
        assign: cloneAssign(it.assign)
      };
    });
    slip.contentMode = ui.contentMode;
    slip.orderStaff = cloneAssign(ui.orderStaff);
    slip.staffs = collectStaffNames();
    slip.remark = ui.remark || '';
    if (!slip.isMember) {
      slip.guestGender = ui.guestGender || '';
      slip.customerName = guestDisplayName(slip.guestGender);
    }
    reconcilePerfRows();
    slip.perfRows = (ui.perfRows || []).map(function (r) {
      return {
        id: r.id,
        name: r.name,
        achievement: Number(r.achievement) || 0,
        commission: commissionOf(r.achievement)
      };
    });
    slip.archiver = ARCHIVER;
    slip.status = 'done';

    function finishArchive() {
      toast('已归档');
      closeComplete();
    }
    function writeFlowOrder() {
      if (!(window.BillingDemo && typeof window.BillingDemo.recordFromHostCheckout === 'function')) {
        finishArchive();
        return;
      }
      var safeItems = slip.items.length
        ? slip.items.map(function (it) {
            return {
              name: it.name,
              type: it.type === 'product' ? 'product' : 'project',
              price: Number(it.price) || 0,
              qty: it.qty || 1,
              amount: (Number(it.price) || 0) * (it.qty || 1),
              staffIds: []
            };
          })
        : [{
            name: '快捷开单',
            type: 'quick',
            price: Number(slip.paid) || 0,
            qty: 1,
            amount: Number(slip.paid) || 0,
            staffIds: []
          }];
      var payLines = (slip.payments || []).map(function (p) {
        return { method: p.method, amount: Number(p.amount) || 0 };
      });
      var order = window.BillingDemo.recordFromHostCheckout({
        isMember: !!slip.isMember,
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
      finishArchive();
    }
    if (typeof window.ensureFlowBundle === 'function' && !window.__flowBundleReady) {
      window.ensureFlowBundle(function (err) {
        if (err) console.warn('[selfpay] flow bundle:', err);
        writeFlowOrder();
      });
      return;
    }
    writeFlowOrder();
  }

  function closeMask(id) {
    var m = document.getElementById(id);
    if (m) m.classList.remove('show');
  }
  function openMask(id) {
    var m = document.getElementById(id);
    if (m) m.classList.add('show');
  }

  function catalogByName() {
    var map = {};
    var catAll = priceCatalog();
    ((catAll.project && catAll.project.items) || []).forEach(function (it) {
      if (it && it.name && !map[it.name]) {
        map[it.name] = { name: it.name, price: it.price, product: false };
      }
    });
    ((catAll.product && catAll.product.items) || []).forEach(function (it) {
      if (it && it.name && !map[it.name]) {
        map[it.name] = { name: it.name, price: it.price, product: true };
      }
    });
    return map;
  }
  function selectedItemNames() {
    var set = {};
    (ui.editItems || []).forEach(function (it) {
      if (it && it.name) set[it.name] = true;
    });
    return set;
  }
  function suggestHotScore(name) {
    var i = SUGGEST_HOT.indexOf(name);
    return i < 0 ? 0 : 10 - i;
  }
  function suggestPairScore(name, selected) {
    var score = 0;
    Object.keys(selected).forEach(function (sel) {
      var pals = SUGGEST_PAIR[sel] || [];
      if (pals.indexOf(name) >= 0) score += 1;
    });
    return score;
  }
  function suggestRecentScore(name) {
    return Math.min(10, Number(SUGGEST_RECENT[name]) || 0);
  }
  function suggestTotal(c) {
    return c.hot * 3 + c.pair * 4 + c.recent * 2;
  }
  function hotSuggestItems() {
    var map = catalogByName();
    var selected = selectedItemNames();
    var names = {};
    SUGGEST_HOT.forEach(function (n) { names[n] = true; });
    Object.keys(SUGGEST_PAIR).forEach(function (k) {
      names[k] = true;
      (SUGGEST_PAIR[k] || []).forEach(function (n) { names[n] = true; });
    });
    Object.keys(SUGGEST_RECENT).forEach(function (n) { names[n] = true; });
    var pool = [];
    Object.keys(names).forEach(function (name) {
      if (selected[name] || !map[name]) return;
      var row = {
        name: name,
        price: map[name].price,
        product: map[name].product,
        hot: suggestHotScore(name),
        pair: suggestPairScore(name, selected),
        recent: suggestRecentScore(name)
      };
      row.total = suggestTotal(row);
      if (row.hot || row.pair || row.recent) pool.push(row);
    });
    var picked = [];
    var used = {};
    function takeBy(key, n) {
      var taken = 0;
      pool.slice().sort(function (a, b) {
        var d = b[key] - a[key];
        if (d) return d;
        return b.total - a.total;
      }).forEach(function (row) {
        if (taken >= n || picked.length >= 6 || used[row.name] || !row[key]) return;
        used[row.name] = true;
        taken += 1;
        picked.push({ name: row.name, price: row.price, product: row.product });
      });
    }
    takeBy('hot', 2);
    takeBy('pair', 2);
    takeBy('recent', 2);
    pool.slice().sort(function (a, b) { return b.total - a.total; }).forEach(function (row) {
      if (picked.length >= 6 || used[row.name]) return;
      used[row.name] = true;
      picked.push({ name: row.name, price: row.price, product: row.product });
    });
    return picked;
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
    var suggest = hotSuggestItems();
    var suggestHtml =
      '<div class="sp-suggest">' +
      '<div class="sp-suggest__hd">' +
      '<span class="sp-suggest__title">猜你想加</span>' +
      '<button type="button" class="sp-help-btn" data-sp-help="suggest" aria-label="推荐规则说明">' +
      HELP_ICON + '</button></div>' +
      '<div class="sp-suggest__scroll">' +
      suggest.map(function (it) {
        return (
          '<button type="button" class="sp-suggest__chip" data-sp-pname="' + escapeHtml(it.name) +
          '" data-sp-pprice="' + it.price +
          '" data-sp-pprod="' + (it.product ? '1' : '0') + '" data-sp-padd>' +
          '<span class="sp-suggest__nm">' + escapeHtml(it.name) + '</span>' +
          '<span class="sp-suggest__pr">¥' + money(it.price) + '</span></button>'
        );
      }).join('') +
      '</div></div>';
    var tabsHtml =
      '<div class="v2-page-tabs" id="spPriceAllAnchor">' +
      '<button type="button" class="' + (tab === 'project' ? 'on' : '') + '" data-sp-ptab="project">项目</button>' +
      '<button type="button" class="' + (tab === 'product' ? 'on' : '') + '" data-sp-ptab="product">产品</button></div>';
    var gTabs = groups.map(function (name) {
      return '<button type="button" class="v2-group-tab' + (name === g ? ' on' : '') +
        '" data-sp-pgroup="' + escapeHtml(name) + '">' + escapeHtml(name) + '</button>';
    }).join('');
    var list = items.map(function (it) {
      return (
        '<div class="v2-cat-item" data-sp-pname="' + escapeHtml(it.name) +
        '" data-sp-pprice="' + it.price +
        '" data-sp-pprod="' + (tab === 'product' ? '1' : '0') + '">' +
        '<div class="v2-cat-main"><div class="v2-cat-info"><div class="v2-cat-name">' +
        escapeHtml(it.name) + '</div><div class="v2-cat-price"><span class="yen">¥</span>' +
        money(it.price) + '</div></div>' +
        '<div class="v2-cat-right"><button type="button" class="v2-add-btn" data-sp-padd aria-label="添加">' +
        PLUS_SVG + '</button></div></div></div>'
      );
    }).join('');
    body.innerHTML =
      '<div class="v2-price-card">' + suggestHtml +
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
    openMask('spPriceMask');
  }
  function closePriceSheet() { closeMask('spPriceMask'); }

  function applyQuickMode() {
    if (ui.contentMode === 'items' && ui.editItems.length) {
      if (!window.confirm('切换为快捷开单将清空已选项目/产品，确定？')) return;
    }
    ui.contentMode = 'quick';
    ui.editItems = [];
    closePriceSheet();
    paintS17();
  }

  function parseSlotCtx(raw) {
    var parts = String(raw || '').split('|');
    if (parts[0] === 'order') {
      return { kind: 'order', station: parts[1], index: Number(parts[2]) || 0 };
    }
    if (parts[0] === 'item') {
      return { kind: 'item', itemIdx: Number(parts[1]) || 0, station: parts[2], index: Number(parts[3]) || 0 };
    }
    return null;
  }
  function getAssignByCtx(ctx) {
    if (!ctx) return null;
    if (ctx.kind === 'order') return ui.orderStaff;
    var it = ui.editItems[ctx.itemIdx];
    if (!it) return null;
    return ensureItemAssign(it);
  }
  function openPickStaff(ctxRaw) {
    var ctx = parseSlotCtx(ctxRaw);
    if (!ctx || ui.readonly) return;
    ui.pickCtx = ctx;
    var title = $('#spPickStaffTitle');
    if (title) {
      if (ctx.station === 'avg') title.textContent = '选择员工';
      else {
        var st = STATIONS.find(function (s) { return s.id === ctx.station; });
        title.textContent = '选择' + (st ? st.lab : '员工');
      }
    }
    var body = $('#spPickStaffBody');
    var pool = staffPoolList();
    var assign = getAssignByCtx(ctx);
    if (!body) return;
    var blocked = {};
    var atCap = false;
    if (assign) {
      if (ctx.station === 'avg') {
        var people = assign.people || [];
        people.forEach(function (p, i) {
          if (p && p.id && i !== ctx.index) blocked[p.id] = true;
        });
        atCap = people.length >= 5 && ctx.index >= people.length;
      } else {
        var arr = assign.stations[ctx.station] || [];
        arr.forEach(function (p, i) {
          if (p && p.id && i !== ctx.index) blocked[p.id] = true;
        });
        atCap = arr.length >= 3 && ctx.index >= arr.length;
      }
    }
    var avail = pool.filter(function (st) {
      return st && st.id && !blocked[st.id];
    });
    if (atCap || !avail.length) {
      ui.pickCtx = null;
      toast('暂无可选员工');
      return;
    }
    body.innerHTML = avail.map(function (st) {
      return (
        '<div class="sp-pick-row">' +
        '<span class="sp-pick-row__nm">' + escapeHtml(st.name) +
        (st.role ? '<span class="sp-pick-row__role">' + escapeHtml(st.role) + '</span>' : '') +
        '</span>' +
        '<span class="sp-pick-row__acts">' +
        '<button type="button" class="sp-pick-act sp-pick-act--dk" data-sp-pick="' +
        escapeHtml(st.id) + '" data-sp-pick-dk="1">点客</button>' +
        '<button type="button" class="sp-pick-act sp-pick-act--sk" data-sp-pick="' +
        escapeHtml(st.id) + '" data-sp-pick-dk="0">散客</button>' +
        '</span></div>'
      );
    }).join('');
    openMask('spPickStaffMask');
  }
  function closePickStaff() {
    closeMask('spPickStaffMask');
    ui.pickCtx = null;
  }
  function pickStaff(sid, dianke) {
    var ctx = ui.pickCtx;
    var assign = getAssignByCtx(ctx);
    if (!ctx || !assign) {
      toast('选择失败，请重试');
      return;
    }
    var st = typeof window.staffById === 'function' ? window.staffById(sid) : null;
    var name = st ? st.name : sid;
    var person = { id: sid, name: name, dianke: !!dianke };

    if (ctx.station === 'avg') {
      var people = assign.people || (assign.people = []);
      if (people.some(function (p) { return p.id === sid; })) {
        toast('该员工已在本项中');
        return;
      }
      if (ctx.index < people.length) people[ctx.index] = person;
      else if (people.length < 5) people.push(person);
      else { toast('最多选择 5 名员工'); return; }
    } else {
      var arr = assign.stations[ctx.station] || (assign.stations[ctx.station] = []);
      if (arr.some(function (p) { return p.id === sid; })) {
        toast('该工位已有此员工');
        return;
      }
      if (ctx.index < arr.length) arr[ctx.index] = person;
      else if (arr.length < 3) arr.push(person);
      else { toast('每个工位最多 3 人'); return; }
    }
    closePickStaff();
    ui.perfStaffKey = '';
    paintS17();
  }
  function clearSlot(ctxRaw) {
    var ctx = parseSlotCtx(ctxRaw);
    var assign = getAssignByCtx(ctx);
    if (!ctx || !assign) return;
    if (ctx.station === 'avg') {
      if (assign.people && assign.people[ctx.index]) assign.people.splice(ctx.index, 1);
    } else if (assign.stations[ctx.station] && assign.stations[ctx.station][ctx.index]) {
      assign.stations[ctx.station].splice(ctx.index, 1);
    }
    ui.perfStaffKey = '';
    paintS17();
  }

  function syncPerfKeypadDisplay() {
    var el = $('#spPerfKeypadDisplay');
    if (!el) return;
    var buf = ui.perfKeypadBuf;
    if (!buf) {
      el.textContent = '请输入';
      el.classList.add('is-empty');
    } else {
      el.textContent = buf;
      el.classList.remove('is-empty');
    }
  }
  function renderPerfKeypadGrid() {
    var grid = $('#spPerfKeypadGrid');
    if (!grid || grid.dataset.ready === '1') return;
    var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];
    grid.innerHTML = keys.map(function (k) {
      if (k === 'del') {
        return '<button type="button" class="sp-perf-keypad__key is-del" data-sp-pkey="del">删除</button>';
      }
      return '<button type="button" class="sp-perf-keypad__key" data-sp-pkey="' + k + '">' + k + '</button>';
    }).join('');
    grid.dataset.ready = '1';
  }
  function openPerfKeypad(sid) {
    var row = (ui.perfRows || []).find(function (r) { return r.id === sid; });
    if (!row || ui.readonly) return;
    ui.perfEditId = sid;
    ui.perfKeypadBuf = money(row.achievement);
    ui.perfKeypadReplace = true;
    renderPerfKeypadGrid();
    syncPerfKeypadDisplay();
    openMask('spPerfKeypadMask');
  }
  function closePerfKeypad() {
    closeMask('spPerfKeypadMask');
    ui.perfEditId = null;
    ui.perfKeypadBuf = '';
    ui.perfKeypadReplace = false;
  }
  function pushPerfKey(key) {
    var buf = ui.perfKeypadBuf || '';
    if (key === 'del') {
      if (ui.perfKeypadReplace) {
        ui.perfKeypadBuf = '';
        ui.perfKeypadReplace = false;
      } else {
        ui.perfKeypadBuf = buf.slice(0, -1);
      }
      syncPerfKeypadDisplay();
      return;
    }
    if (ui.perfKeypadReplace) {
      buf = '';
      ui.perfKeypadReplace = false;
    }
    if (key === '.') {
      if (buf.indexOf('.') >= 0) return;
      buf = buf ? buf + '.' : '0.';
    } else {
      if (buf === '0') buf = key;
      else {
        var parts = buf.split('.');
        if (parts[1] && parts[1].length >= 2) return;
        buf += key;
      }
    }
    if (/^\d{7,}/.test(buf.split('.')[0])) return;
    ui.perfKeypadBuf = buf;
    syncPerfKeypadDisplay();
  }
  function confirmPerfKeypad() {
    var sid = ui.perfEditId;
    var row = (ui.perfRows || []).find(function (r) { return r.id === sid; });
    var buf = (ui.perfKeypadBuf || '').trim();
    if (row && buf !== '') {
      var n = Number(buf);
      if (!isNaN(n) && n >= 0) row.achievement = Math.round(n * 100) / 100;
    }
    closePerfKeypad();
    paintS17();
  }

  function setAllocMode(mode) {
    ui.allocMode = mode === 'average' ? 'average' : 'station';
    ui.perfStaffKey = '';
    syncAllocNav();
    if ($('#s17') && $('#s17').classList.contains('active')) paintS17();
    toast(ui.allocMode === 'average' ? '演示：平均分配' : '演示：按工位分配');
  }
  function syncAllocNav() {
    $all('.site-nav [data-sp-alloc]').forEach(function (btn) {
      btn.classList.toggle('on', btn.getAttribute('data-sp-alloc') === ui.allocMode);
    });
  }

  function installDateHook() {
    if (window.__v2OnBillDateChange && window.__v2OnBillDateChange._spSelfpay) return;
    var prev = window.__v2OnBillDateChange;
    var hooked = function (key, ctx) {
      if (ctx === 'selfpay') {
        ui.dateKey = key || '';
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
      window.__v2OpenDatePop(true, 'selfpay', ui.dateKey || todayKey());
    } else toast('日期控件未就绪');
  }

  var HELP_SORT =
    '列表与首页卡片按「综合分」从高到低排列，优先展示更可能需要处理的自助订单：' +
    '<br>· 未填项目 +3' +
    '<br>· 跨日遗留 +2' +
    '<br>· 尚未指定员工 +2' +
    '<br>· 等待天数（最多计 7 天）' +
    '<br>同分再按序号。首页取排序后前 5 张。';
  var HELP_SUGGEST =
    '这里会帮你猜几个可能要加的项目/产品，方便点选。' +
    '<br>会看三方面：店里卖得多的、常和已选项目一起做的、最近店里归档时常用的。' +
    '<br>运用智能计算列出6个供你快速选择。';

  function openHelp(kind) {
    var title = $('#spHelpTitle');
    var body = $('#spHelpBody');
    if (kind === 'suggest') {
      if (title) title.textContent = '推荐规则';
      if (body) body.innerHTML = HELP_SUGGEST;
    } else {
      if (title) title.textContent = '排列规则';
      if (body) body.innerHTML = HELP_SORT;
    }
    openMask('spHelpMask');
  }
  function closeHelp() { closeMask('spHelpMask'); }

  function onS17Click(e) {
    if (e.target.closest('[data-sp-cards-toggle]')) {
      ui.cardsOpen = !ui.cardsOpen;
      paintS17();
      return;
    }
    var genderBtn = e.target.closest('[data-sp-gender]');
    if (genderBtn) {
      var g = genderBtn.getAttribute('data-sp-gender') || '';
      ui.guestGender = g;
      var slipG = getSlip(ui.currentId);
      if (slipG && !slipG.isMember) {
        slipG.guestGender = g;
        slipG.customerName = guestDisplayName(g);
      }
      paintS17();
      return;
    }
    var perfBtn = e.target.closest('[data-sp-perf]');
    if (perfBtn) {
      openPerfKeypad(perfBtn.getAttribute('data-sp-perf'));
      return;
    }
    var clear = e.target.closest('[data-sp-slot-clear]');
    if (clear) {
      e.preventDefault();
      e.stopPropagation();
      clearSlot(clear.getAttribute('data-sp-slot-clear'));
      return;
    }
    var slot = e.target.closest('[data-sp-slot]');
    if (slot) {
      openPickStaff(slot.getAttribute('data-sp-slot'));
      return;
    }
    if (e.target.closest('[data-sp-add]')) {
      openPriceSheet();
      return;
    }
    var del = e.target.closest('[data-sp-del]');
    if (del) {
      var idx = Number(del.getAttribute('data-sp-del'));
      if (!isNaN(idx)) {
        ui.editItems.splice(idx, 1);
        ui.perfStaffKey = '';
        paintS17();
      }
    }
  }

  function bind() {
    var stripHost = $('#spHomeStripHost') || $('#spHomeStrip');
    if (stripHost) {
      stripHost.addEventListener('click', function (e) {
        if (e.target.closest('[data-sp-more]')) { go('s16'); return; }
        var card = e.target.closest('[data-sp-id]');
        if (card) openComplete(card.getAttribute('data-sp-id'));
      });
    }
    var grid = $('#spGridWrap');
    if (grid) {
      grid.addEventListener('click', function (e) {
        var card = e.target.closest('[data-sp-id]');
        if (card) openComplete(card.getAttribute('data-sp-id'));
      });
    }
    var s17 = $('#s17');
    if (s17) s17.addEventListener('click', onS17Click);
    var back = $('#s17Back');
    if (back) back.addEventListener('click', function () { closeComplete(); });
    var arch = $('#s17ArchiveBtn');
    if (arch) arch.addEventListener('click', archiveCurrent);
    var perfCancel = $('#spPerfKeypadCancel');
    if (perfCancel) perfCancel.addEventListener('click', closePerfKeypad);
    var perfOk = $('#spPerfKeypadOk');
    if (perfOk) perfOk.addEventListener('click', confirmPerfKeypad);
    var perfGrid = $('#spPerfKeypadGrid');
    if (perfGrid) {
      renderPerfKeypadGrid();
      perfGrid.addEventListener('click', function (e) {
        var key = e.target.closest('[data-sp-pkey]');
        if (!key) return;
        pushPerfKey(key.getAttribute('data-sp-pkey'));
      });
    }

    var dateBtn = $('#spDateBtn');
    if (dateBtn) dateBtn.addEventListener('click', openSelfpayDate);
    var sortHelp = $('#spSortHelpBtn');
    if (sortHelp) sortHelp.addEventListener('click', function (e) {
      e.stopPropagation();
      openHelp('sort');
    });
    var helpOk = $('#spHelpOk');
    if (helpOk) helpOk.addEventListener('click', closeHelp);
    var search = $('#spSearchInput');
    if (search) {
      search.addEventListener('input', function () {
        ui.search = search.value || '';
        renderList();
      });
    }
    var filterBtn = $('#spFilterBtn');
    if (filterBtn) filterBtn.addEventListener('click', function () { openMask('spFilterMask'); });
    var fltOk = $('#spFltOk');
    if (fltOk) {
      fltOk.addEventListener('click', function () {
        ui.filter.pay = ($('#spFltPay') && $('#spFltPay').value) || '';
        ui.filter.hasItems = ($('#spFltItems') && $('#spFltItems').value) || '';
        ui.filter.amtMin = ($('#spFltMin') && $('#spFltMin').value) || '';
        ui.filter.amtMax = ($('#spFltMax') && $('#spFltMax').value) || '';
        closeMask('spFilterMask');
        renderList();
      });
    }
    var fltReset = $('#spFltReset');
    if (fltReset) {
      fltReset.addEventListener('click', function () {
        ui.filter = { pay: '', hasItems: '', amtMin: '', amtMax: '' };
        if ($('#spFltPay')) $('#spFltPay').value = '';
        if ($('#spFltItems')) $('#spFltItems').value = '';
        if ($('#spFltMin')) $('#spFltMin').value = '';
        if ($('#spFltMax')) $('#spFltMax').value = '';
      });
    }
    document.addEventListener('click', function (e) {
      var closeBtn = e.target.closest('[data-sp-close]');
      if (closeBtn) closeMask(closeBtn.getAttribute('data-sp-close'));
      if (e.target.closest('[data-sp-help]')) {
        openHelp(e.target.closest('[data-sp-help]').getAttribute('data-sp-help') || 'sort');
        return;
      }
      if (e.target.closest('#spHelpMask') && e.target.id === 'spHelpMask') {
        closeHelp();
        return;
      }
      if (e.target.closest('#spPriceQuick') || e.target.closest('[data-sp-price-quick]')) {
        applyQuickMode();
        return;
      }
      if (e.target.closest('#spPickStaffClose')) { closePickStaff(); return; }
      var pick = e.target.closest('[data-sp-pick]');
      if (pick && $('#spPickStaffMask') && $('#spPickStaffMask').classList.contains('show')) {
        pickStaff(pick.getAttribute('data-sp-pick'), pick.getAttribute('data-sp-pick-dk') === '1');
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
        var row = padd.closest('[data-sp-pname]');
        if (!row) return;
        var addName = row.getAttribute('data-sp-pname') || '';
        ui.contentMode = 'items';
        ui.editItems.push({
          id: 'x-' + Date.now(),
          name: addName,
          type: row.getAttribute('data-sp-pprod') === '1' ? 'product' : 'project',
          price: Number(row.getAttribute('data-sp-pprice')) || 0,
          qty: 1,
          assign: emptyAssign()
        });
        closePriceSheet();
        ui.perfStaffKey = '';
        paintS17();
        toast('已添加「' + addName + '」');
      }
    });

    if (window.go && !window.go._spHook) {
      var _go = window.go;
      window.go = function (id) {
        _go.apply(this, arguments);
        setTimeout(syncAllocNav, 0);
        if (id === 's0') setTimeout(renderHomeStrip, 0);
        if (id === 's16') setTimeout(function () { ui.tab = 'pending'; renderList(); }, 0);
        if (id === 's17' && ui.currentId) setTimeout(paintS17, 0);
      };
      window.go._spHook = true;
    }
  }

  function init() {
    bind();
    syncAllocNav();
    renderHomeStrip();
    if ($('#s16') && $('#s16').classList.contains('active')) renderList();
    window.SelfPay = {
      renderHomeStrip: renderHomeStrip,
      renderList: renderList,
      syncHomeBadge: syncHomeBadge,
      setTab: function (t) { ui.tab = t || 'pending'; renderList(); },
      openExpandById: openComplete,
      openExpand: openComplete,
      setContentMode: function (mode) {
        ui.contentMode = mode === 'quick' ? 'quick' : 'items';
        if (ui.contentMode === 'quick') ui.editItems = [];
        paintS17();
      },
      openFilter: function () { openMask('spFilterMask'); },
      openDate: openSelfpayDate,
      openPrice: openPriceSheet,
      closePriceSheet: closePriceSheet,
      closeStaffSheet: function () {},
      openStaff: function () {},
      closePickStaff: closePickStaff,
      setAllocMode: setAllocMode,
      openVoidConfirm: function () {},
      pendingCount: pendingCount
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
