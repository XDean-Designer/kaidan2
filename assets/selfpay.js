/**
 * 自助订单 · R45
 * 首页横滑票卡 + s16 列表 + s17 全屏补全（逐项员工 / 价目 sheet / 快捷开单）
 */
(function () {
  'use strict';

  var ARCHIVER = '店员小陈';
  var PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var CHEV_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var CHEV_RIGHT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
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
        paid: 198, payments: [{ method: '支付宝', amount: 198 }],
        benefits: '', slipNo: 'SP202610150042', remark: '顾客备注：补项目'
      },
      {
        id: 'sp-3', seq: 102, isMember: true, status: 'pending', dateKey: t, time: '11:05',
        customerName: '周雨欣', phone: '159****4412',
        avatar: 'assets/avatar_female2.png',
        cards: '计次卡 洗吹次卡　余 6 次',
        items: [{ id: 'p2', name: '洗吹', type: 'project', price: 38, qty: 1 }],
        paid: 0, payments: [{ method: '计次', amount: 0 }],
        benefits: '扣次 ×1', slipNo: 'SP202610150055', remark: ''
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
        paid: 260, payments: [{ method: '卡本金', amount: 200 }, { method: '微信', amount: 60 }],
        benefits: '', slipNo: 'SP202610150102', remark: ''
      },
      {
        id: 'sp-6', seq: 105, isMember: false, status: 'pending', dateKey: t, time: '15:33',
        customerName: '王先生', phone: '136****8899',
        avatar: 'assets/avatar_male2.png',
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
        customerName: '林嘉怡', phone: '138****6210',
        avatar: 'assets/avatar_card_female.png',
        cards: '',
        items: [{ id: 'p2', name: '洗吹', type: 'project', price: 38, qty: 1 }],
        paid: 38, payments: [{ method: '支付宝', amount: 38 }],
        benefits: '', slipNo: 'SP202610130112', remark: ''
      },
      {
        id: 'sp-d1', seq: 108, isMember: true, status: 'done', dateKey: t, time: '08:50',
        customerName: '黄浩然', phone: '158****3344',
        avatar: 'assets/avatar_male2.png',
        cards: '储值卡 美发卡　余额 ¥800.00',
        items: [{ id: 'p1', name: '剪发', type: 'project', price: 68, qty: 1 }],
        paid: 68, payments: [{ method: '微信', amount: 68 }],
        benefits: '', slipNo: 'SP202610150008', remark: '',
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
        benefits: '扣次已回滚', slipNo: 'SP202610150012', remark: '',
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
    orderStaff: emptyAssign(),
    remark: '',
    cardsOpen: false,
    priceTab: 'project',
    priceGroup: '全部',
    readonly: false,
    allocMode: 'station',
    pickCtx: null
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
      '<div class="sp-ticket__name">' + escapeHtml(slip.customerName) + '</div>' +
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
      '<span class="vh-sp-more__t">更多</span>' + CHEV_RIGHT +
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
    if (key === todayKey()) return '今天';
    var p = key.split('-');
    return Number(p[1]) + '/' + Number(p[2]);
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
      (slip.isMember ? '<span class="spf-sum__vip">会员</span>' : '<span class="spf-sum__vip" style="background:#EEF2FF;color:#4A7BF4">散客</span>') +
      '<span class="spf-sum__phone">' + escapeHtml(slip.phone || '') + '</span>' +
      '</div>' + cardsBlock +
      '</div></div>' +
      '<div class="spf-sum__pay">' +
      '<div class="spf-sum__amt"><span>¥</span>' + money(slip.paid) + '</div>' +
      '<div class="spf-sum__pays">' + payBits + '</div></div>' +
      (slip.benefits ? '<div class="spf-sum__ben">' + escapeHtml(slip.benefits) + '</div>' : '') +
      '<div class="spf-sum__meta">' +
      '<div class="spf-sum__meta-item"><span class="k">时间</span><span class="v">' +
      escapeHtml(slip.dateKey.replace(/-/g, '.')) + ' ' + escapeHtml(slip.time) + '</span></div>' +
      '</div></div>';

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
    }

    toast('已归档');
    closeComplete();
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
      '<div class="v2-price-card"><div class="v2-price-head">' + tabsHtml +
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
    if (!body) return;
    if (!pool.length) {
      body.innerHTML = '<div class="spf-quick-tip">暂无员工数据</div>';
    } else {
      body.innerHTML = pool.map(function (st) {
        return (
          '<button type="button" class="sp-pick-row" data-sp-pick="' + escapeHtml(st.id) + '">' +
          '<span class="sp-pick-row__nm">' + escapeHtml(st.name) +
          (st.role ? '<span style="color:#8E8E93;font-size:12px;margin-left:6px">' + escapeHtml(st.role) + '</span>' : '') +
          '</span>' +
          '<label class="sp-pick-row__dk" onclick="event.stopPropagation()">' +
          '<input type="checkbox" data-sp-dianke="' + escapeHtml(st.id) + '">点客</label></button>'
        );
      }).join('');
    }
    openMask('spPickStaffMask');
  }
  function closePickStaff() {
    closeMask('spPickStaffMask');
    ui.pickCtx = null;
  }
  function pickStaff(sid) {
    var ctx = ui.pickCtx;
    var assign = getAssignByCtx(ctx);
    if (!ctx || !assign) return;
    var st = typeof window.staffById === 'function' ? window.staffById(sid) : null;
    var name = st ? st.name : sid;
    var diankeEl = document.querySelector('[data-sp-dianke="' + sid + '"]');
    var dianke = !!(diankeEl && diankeEl.checked);
    var person = { id: sid, name: name, dianke: dianke };

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
    paintS17();
  }

  function setAllocMode(mode) {
    ui.allocMode = mode === 'average' ? 'average' : 'station';
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
    } else toast('日期控件未就绪');
  }

  function onS17Click(e) {
    if (e.target.closest('[data-sp-cards-toggle]')) {
      ui.cardsOpen = !ui.cardsOpen;
      paintS17();
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

    var dateBtn = $('#spDateBtn');
    if (dateBtn) dateBtn.addEventListener('click', openSelfpayDate);
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
      if (e.target.closest('#spPriceClose')) closePriceSheet();
      if (e.target.closest('#spPriceQuick') || e.target.closest('[data-sp-price-quick]')) {
        applyQuickMode();
        return;
      }
      if (e.target.closest('#spPickStaffClose')) { closePickStaff(); return; }
      var pick = e.target.closest('[data-sp-pick]');
      if (pick && $('#spPickStaffMask') && $('#spPickStaffMask').classList.contains('show')) {
        pickStaff(pick.getAttribute('data-sp-pick'));
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
        ui.contentMode = 'items';
        ui.editItems.push({
          id: 'x-' + Date.now(),
          name: row.getAttribute('data-sp-pname'),
          type: row.getAttribute('data-sp-pprod') === '1' ? 'product' : 'project',
          price: Number(row.getAttribute('data-sp-pprice')) || 0,
          qty: 1,
          assign: emptyAssign()
        });
        closePriceSheet();
        paintS17();
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
