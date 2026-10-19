/**
 * 自助订单 · R45
 * 首页横滑票卡 + s16 列表 + s17 全屏补全（逐项员工 / 价目 sheet / 快捷开单）
 */
(function () {
  'use strict';

  var ARCHIVER = '店员小陈';
  var PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var CHEV_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var HELP_ICON = '<img class="sp-help-btn__ic" src="assets/ic_sp_help.svg" alt="" width="16" height="16">';
  /** 微信式二楼：预览行程 / 触发阈值（px） */
  var FLOOR_THRESHOLD = 80;
  var FLOOR_FRAME_W = 390;
  var FLOOR_EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
  var FLOOR_MS = 340;
  /* 近 30 天热销（智能补全 · 演示） */
  var HOT_30D = [
    { name: '洗剪吹', price: 68, type: 'project', sold: 120 },
    { name: '时尚洗吹', price: 58, type: 'project', sold: 96 },
    { name: '深层滋养', price: 198, type: 'project', sold: 72 },
    { name: '染发', price: 358, type: 'project', sold: 54 },
    { name: '精致剪发', price: 98, type: 'project', sold: 48 },
    { name: '烫发', price: 398, type: 'project', sold: 36 },
    { name: '剑琅柔顺发膜', price: 148, type: 'product', sold: 40 }
  ];
  /* 工位 = 本次分工（非固定头衔）；演示默认业绩占比 */
  var STATIONS = [
    { id: 'senior', lab: '大工', pct: 100 },
    { id: 'mid', lab: '中工', pct: 85 },
    { id: 'junior', lab: '小工', pct: 75 }
  ];
  var STATION_PCT = { senior: 100, mid: 85, junior: 75 };
  /** 演示店员工池（分工在单据内选）；>4 人时数值条折叠 */
  var SP_DEMO_STAFF = [
    { id: 'st1', name: '林屿森', short: '森', avatar: 'assets/emp-avatars/man-a.jpg' },
    { id: 'st3', name: '阿Ken', short: 'Ken', avatar: 'assets/emp-avatars/man-b.jpg' },
    { id: 'st2', name: '何苏叶', short: '叶', avatar: 'assets/emp-avatars/woman-a.jpg' },
    { id: 'st5', name: '小周', short: '周', avatar: 'assets/emp-avatars/man-c.jpg' },
    { id: 'st6', name: '阿棠', short: '棠', avatar: 'assets/emp-avatars/woman-a.jpg' },
    { id: 'st7', name: '老吴', short: '吴', avatar: 'assets/emp-avatars/man-a.jpg' }
  ];
  /** 选中色条按点击顺序循环：红→黄→绿→蓝（较淡）；pct 为更深可读色 */
  var BAR_TINTS = [
    { fill: '#FFB3B8', pct: '#B83A44' },
    { fill: '#FFE08A', pct: '#9A7B12' },
    { fill: '#A8E0B8', pct: '#2F7A4F' },
    { fill: '#A8C8F0', pct: '#2F5F9E' }
  ];
  /** 会员头像回退（网络图失败时） */
  var MEM_AVATAR_FALLBACK = 'assets/avatar_card_female.png';
  /** Pexels 免费人像直链 · 中日韩网红感（w=320 方形裁切） */
  function pxAvatar(id) {
    return 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id +
      '.jpeg?auto=compress&cs=tinysrgb&w=320&h=320&fit=crop';
  }
  var MEM_WX_AVATARS = {
    f1: pxAvatar(34586559), /* 首尔街拍 */
    f2: pxAvatar(31776048), /* 东京饰品写真 */
    f3: pxAvatar(6316074),  /* 东京街头潮流 */
    f4: pxAvatar(39877058), /* 北京咖啡馆 */
    f5: pxAvatar(34586542), /* 首尔时尚博主 · 绿蝴蝶结写真 */
    f6: pxAvatar(20478046), /* 米色大衣 · 首尔 */
    f7: pxAvatar(19271566), /* 韩屋步行街 */
    m1: pxAvatar(6929324)   /* 男 · 休闲街拍 */
  };
  /** 选择会员 sheet 演示名单 */
  var SP_DEMO_MEMBERS = [
    { id: 'm1', name: '何静', gender: 'female', phone: '188****6655', avatar: MEM_WX_AVATARS.f1, balance: 1280, bonus: 80, debt: 0, lastVisitDate: '2026.10.12', lastItem: '洗剪吹' },
    { id: 'm2', name: '陈昕然', gender: 'female', phone: '186****9033', avatar: MEM_WX_AVATARS.f2, balance: 0, bonus: 0, debt: 120, lastVisitDate: '2026.10.08', lastItem: '染发' },
    { id: 'm3', name: '周雨欣', gender: 'female', phone: '159****4412', avatar: MEM_WX_AVATARS.f3, balance: 0, bonus: 20, debt: 0, lastVisitDate: '2026.10.14', lastItem: '时尚洗吹' },
    { id: 'm4', name: '苏晓萌', gender: 'female', phone: '151****2201', avatar: MEM_WX_AVATARS.f4, balance: 560, bonus: 45, debt: 36.5, lastVisitDate: '2026.09.28', lastItem: '深层滋养' },
    { id: 'm5', name: '林晓萱', gender: 'female', phone: '135****8820', avatar: MEM_WX_AVATARS.f5, balance: 880, bonus: 0, debt: 0, lastVisitDate: '2026.10.01', lastItem: '精致剪发' },
    { id: 'm6', name: '周子昂', gender: 'male', phone: '137****2048', avatar: MEM_WX_AVATARS.m1, balance: 460, bonus: 30, debt: 0, lastVisitDate: '2026.10.11', lastItem: '染发' }
  ];
  var GUEST_AVATAR = {
    male: 'assets/billing/avatar-male.png',
    female: 'assets/billing/avatar-female.png'
  };

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
  /** 票卡 / s17 实付：整数无小数；有小数则去掉尾部 0 */
  function moneyTrim(n) {
    var v = Math.round((Number(n) || 0) * 100) / 100;
    if (!isFinite(v)) v = 0;
    if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
    return String(parseFloat(v.toFixed(2)));
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

  /* 演示提成方案：业绩 × 比例；sheet 可改成固定金额 */
  var COMMISSION_RATE = 0.1;
  /* 项目→常用员工（智能补全 · 演示） */
  var ITEM_STAFF_PREF = {
    '洗剪吹': 'st1', '时尚洗吹': 'st1', '精致剪发': 'st3', '染发': 'st3',
    '烫发': 'st3', '深层滋养': 'st2', '蛋白矫正': 'st1', '头皮护理': 'st2',
    '洗头': 'st5', '挑染': 'st3', '漂发': 'st3'
  };

  function seedSlips() {
    var t = todayKey();
    var y = shiftDay(t, -1);
    var y2 = shiftDay(t, -2);
    function mkPerson(id, name, st, opts) {
      opts = opts || {};
      return {
        id: id, name: name, dianke: !!opts.dianke,
        active: opts.active !== false,
        pct: opts.pct != null ? opts.pct : (STATION_PCT[st] || 100),
        commissionFixed: opts.commissionFixed
      };
    }
    function assignSenior(p) {
      return { stations: { senior: [p], mid: [], junior: [] }, people: [] };
    }
    return [
      /* 1 会员 · 多项目 · 已有分工 */
      {
        id: 'sp-1', seq: 100, isMember: true, status: 'pending', dateKey: t, time: '09:18',
        customerName: '何静', gender: 'female', phone: '188****6655',
        avatar: MEM_WX_AVATARS.f1,
        cards: '', balance: 1280, bonus: 80,
        debt: 0, lastVisitDate: '2026.10.12', lastItem: '洗剪吹',
        items: [
          {
            id: 'p0', name: '洗剪吹', type: 'project', price: 68, qty: 1,
            assign: assignSenior(mkPerson('st1', '林屿森', 'senior', { dianke: true, pct: 100 }))
          },
          { id: 'p1', name: '蛋白矫正', type: 'project', price: 598, qty: 1 },
          { id: 'p2', name: '深层滋养', type: 'project', price: 198, qty: 1 },
          { id: 'g1', name: '剑琅柔顺发膜', type: 'product', price: 148, qty: 1 }
        ],
        paid: 666, payments: [{ method: '微信', amount: 666 }],
        benefits: '', slipNo: 'SP202610150018', remark: ''
      },
      /* 2 会员 · 未填项目 · 有欠款 · 智能补全演示主入口 */
      {
        id: 'sp-2', seq: 101, isMember: true, status: 'pending', dateKey: t, time: '10:42',
        customerName: '陈昕然', gender: 'female', phone: '186****9033',
        avatar: MEM_WX_AVATARS.f2,
        cards: '', balance: 0, bonus: 0,
        debt: 120, lastVisitDate: '2026.10.08', lastItem: '染发',
        items: [],
        paid: 198, payments: [{ method: '微信', amount: 198 }],
        benefits: '', slipNo: 'SP202610150042', remark: '顾客备注：补项目'
      },
      /* 3 会员 · 1 项 · 会员卡 */
      {
        id: 'sp-3', seq: 102, isMember: true, status: 'pending', dateKey: t, time: '11:05',
        customerName: '周雨欣', gender: 'female', phone: '159****4412',
        avatar: MEM_WX_AVATARS.f3,
        cards: '', balance: 0, bonus: 20,
        debt: 0, lastVisitDate: '2026.10.14', lastItem: '时尚洗吹',
        items: [{ id: 'p2', name: '时尚洗吹', type: 'project', price: 58, qty: 1 }],
        paid: 58, payments: [{ method: '会员卡', amount: 58 }],
        benefits: '', slipNo: 'SP202610150055', remark: ''
      },
      /* 3b 男会员 · 2 项 · 微信 + 会员卡（验证 ♂ 与男头像） */
      {
        id: 'sp-4', seq: 103, isMember: true, status: 'pending', dateKey: t, time: '12:26',
        customerName: '周子昂', gender: 'male', phone: '137****2048',
        avatar: MEM_WX_AVATARS.m1,
        cards: '', balance: 460, bonus: 30,
        debt: 0, lastVisitDate: '2026.10.11', lastItem: '染发',
        items: [
          { id: 'p11', name: '精致剪发', type: 'project', price: 98, qty: 1 },
          { id: 'p3', name: '染发', type: 'project', price: 358, qty: 1 }
        ],
        paid: 456, payments: [{ method: '微信', amount: 300 }, { method: '会员卡', amount: 156 }],
        benefits: '', slipNo: 'SP202610150078', remark: '男会员演示单'
      },
      /* 4 会员 · 混合支付 · 2 项 */
      {
        id: 'sp-5', seq: 104, isMember: true, status: 'pending', dateKey: t, time: '14:08',
        customerName: '苏晓萌', gender: 'female', phone: '151****2201',
        avatar: MEM_WX_AVATARS.f4,
        cards: '', balance: 560, bonus: 45,
        debt: 36.5, lastVisitDate: '2026.09.28', lastItem: '深层滋养',
        items: [
          { id: 'p4', name: '深层滋养', type: 'project', price: 198, qty: 1 },
          { id: 'g1', name: '剑琅柔顺发膜', type: 'product', price: 148, qty: 1 }
        ],
        paid: 260, payments: [{ method: '会员卡', amount: 200 }, { method: '微信', amount: 60 }],
        benefits: '', slipNo: 'SP202610150102', remark: ''
      },
      /* 5 散客 · 默认男 */
      {
        id: 'sp-6', seq: 105, isMember: false, status: 'pending', dateKey: t, time: '15:33',
        customerName: '男散客', phone: '', guestGender: 'male',
        avatar: GUEST_AVATAR.male,
        cards: '', debt: 0, lastVisit: '',
        items: [{ id: 'p2', name: '时尚洗吹', type: 'project', price: 58, qty: 1 }],
        paid: 58, payments: [{ method: '微信', amount: 58 }],
        benefits: '', slipNo: 'SP202610150133', remark: ''
      },
      /* 6 快捷开单 · 保留 */
      {
        id: 'sp-7', seq: 108, isMember: true, status: 'pending', dateKey: t, time: '16:05',
        customerName: '林晓萱', gender: 'female', phone: '135****8820',
        avatar: MEM_WX_AVATARS.f5,
        cards: '', balance: 880, bonus: 0,
        debt: 0, lastVisitDate: '2026.10.01', lastItem: '精致剪发',
        items: [], contentMode: 'quick',
        paid: 168, payments: [{ method: '微信', amount: 168 }],
        benefits: '', slipNo: 'SP202610150168', remark: '顾客选了快捷'
      },
      /* 7 烫染套餐 · 三档工位满态（Figma 抓取主态） */
      {
        id: 'sp-9', seq: 110, isMember: true, status: 'pending', dateKey: t, time: '17:10',
        customerName: '陆思琪', gender: 'female', phone: '186****5511',
        avatar: MEM_WX_AVATARS.f6,
        cards: '', balance: 1280, bonus: 120,
        debt: 88, lastVisitDate: '2026.09.20', lastItem: '烫发',
        items: [
          {
            id: 'p7', name: '烫发', type: 'project', price: 398, qty: 1,
            assign: {
              stations: {
                senior: [mkPerson('st3', '阿Ken', 'senior', { pct: 100, dianke: true })],
                mid: [mkPerson('st2', '何苏叶', 'mid', { pct: 85 })],
                junior: [mkPerson('st5', '小周', 'junior', { pct: 75 })]
              },
              people: []
            }
          },
          {
            id: 'p8', name: '染发', type: 'project', price: 358, qty: 1,
            assign: {
              stations: {
                senior: [mkPerson('st1', '林屿森', 'senior', { pct: 100 })],
                mid: [],
                junior: []
              },
              people: []
            }
          },
          {
            id: 'p9', name: '深层滋养', type: 'project', price: 198, qty: 1,
            assign: {
              stations: {
                senior: [],
                mid: [mkPerson('st2', '何苏叶', 'mid', { pct: 85, dianke: true })],
                junior: []
              },
              people: []
            }
          },
          { id: 'g2', name: '剑琅柔顺发膜', type: 'product', price: 148, qty: 1 }
        ],
        paid: 860, payments: [{ method: '微信', amount: 400 }, { method: '会员卡', amount: 460 }],
        benefits: '折扣卡 8 折', benefit: '折扣卡 8 折', coupon: '护理券满减 ¥20',
        slipNo: 'SP202610150210', remark: '烫染套餐 · 客户指定阿Ken'
      },
      /* 8 散客女 · 2 项 */
      {
        id: 'sp-10', seq: 111, isMember: false, status: 'pending', dateKey: t, time: '17:45',
        customerName: '女散客', phone: '', guestGender: 'female',
        avatar: GUEST_AVATAR.female,
        cards: '', debt: 0, lastVisit: '',
        items: [
          { id: 'p10', name: '洗头', type: 'project', price: 28, qty: 1 },
          { id: 'p11', name: '精致剪发', type: 'project', price: 98, qty: 1 }
        ],
        paid: 126, payments: [{ method: '微信', amount: 126 }],
        benefits: '', slipNo: 'SP202610150245', remark: ''
      },
      /* 9 跨日 · 昨天 */
      {
        id: 'sp-y1', seq: 114, isMember: true, status: 'pending', dateKey: y, time: '16:40',
        customerName: '蔡雅婷', gender: 'female', phone: '139****1100',
        avatar: MEM_WX_AVATARS.f7,
        cards: '', balance: 2100, bonus: 120,
        debt: 88, lastVisitDate: '2026.10.05', lastItem: '洗剪吹',
        items: [{ id: 'p1', name: '精致剪发', type: 'project', price: 98, qty: 1 }],
        paid: 98, payments: [{ method: '微信', amount: 98 }],
        benefits: '', slipNo: 'SP202610140240', remark: '跨日待处理'
      },
      /* 10 跨日 · 前天 · 未填项目散客 */
      {
        id: 'sp-y5', seq: 118, isMember: false, status: 'pending', dateKey: y2, time: '20:08',
        customerName: '男散客', phone: '', guestGender: 'male',
        avatar: GUEST_AVATAR.male,
        cards: '', debt: 0, lastVisit: '',
        items: [],
        paid: 88, payments: [{ method: '微信', amount: 88 }],
        benefits: '', slipNo: 'SP202610120208', remark: '散客未填项目'
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
    allocMode: 'average',
    pickCtx: null,
    pickDraft: {},
    pickFootEl: null,
    guestGender: 'male',
    focusItemIdx: 0,
    itemPerfEdit: null,
    dragBar: null,
    ibarFoldOpen: {},
    perfRows: [],
    perfStaffKey: '',
    perfEditId: null,
    perfKeypadBuf: '',
    perfKeypadReplace: false,
    perfKeypadTarget: null,
    smartComplete: true,
    /** 进 s16 手势：dots=圆点版（默认）· hint=文案版 */
    floorMode: 'dots'
  };

  function emptyAssign() {
    return {
      stations: { senior: [], mid: [], junior: [] },
      people: [],
      _tintSeqMap: {}
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
      people: (a.people || []).map(function (x) { return Object.assign({}, x); }),
      _tintSeqMap: Object.assign({}, a._tintSeqMap || {})
    };
  }
  function ensureItemAssign(it) {
    if (!it.assign) it.assign = emptyAssign();
    return it.assign;
  }
  function staffPoolList() {
    return SP_DEMO_STAFF.slice();
  }
  function demoStaffById(sid) {
    return SP_DEMO_STAFF.find(function (s) { return s.id === sid; }) ||
      (typeof window.staffById === 'function' ? window.staffById(sid) : null);
  }
  function itemAmount(it) {
    return (Number(it.price) || 0) * (Number(it.qty) || 1);
  }
  function defaultPctForStation(stId) {
    if (ui.allocMode === 'average') return 100;
    return STATION_PCT[stId] || 100;
  }
  function roundHalf(n) {
    return Math.round((Number(n) || 0) * 2) / 2;
  }
  function syncPersonPerf(p, stId, it) {
    if (!p) return;
    var base = itemAmount(it);
    if (p.active == null) p.active = true;
    if (p.pct == null) p.pct = p.active ? defaultPctForStation(stId) : 0;
    if (!p.active) p.pct = 0;
    p.pct = Math.max(0, Math.min(100, Number(p.pct) || 0));
    p.achievement = roundHalf(base * p.pct / 100);
    if (p.commissionFixed != null && p.commissionFixed !== '') {
      p.commission = Math.max(0, Math.min(99999, Number(p.commissionFixed) || 0));
    } else {
      p.commission = Math.round(p.achievement * COMMISSION_RATE * 100) / 100;
    }
  }
  function tintScopeOf(station) {
    if (ui.allocMode === 'average' || !station || station === 'avg') return 'avg';
    return station;
  }
  function listInTintScope(assign, scope) {
    if (!assign) return [];
    if (scope === 'avg') return assign.people || [];
    return assign.stations[scope] || [];
  }
  function activatePerson(p, stId, it, assign) {
    p.active = true;
    if (p.pct == null || p.pct === 0) p.pct = defaultPctForStation(stId);
    if (assign) assignNextTint(assign, p, tintScopeOf(stId));
    syncPersonPerf(p, stId, it);
  }
  /** 同项目卡（平均）/ 同工位行内按点击序上色；有已选则取最大色序+1 顺延；全未选中才从红起 */
  function assignNextTint(assign, p, station) {
    if (!assign || !p || p.tintIdx != null) return;
    var scope = tintScopeOf(station);
    if (!assign._tintSeqMap) assign._tintSeqMap = {};
    var others = listInTintScope(assign, scope).filter(function (x) {
      return x && x.active && x !== p;
    });
    var seq;
    if (!others.length) {
      seq = 0;
    } else {
      var maxIdx = -1;
      others.forEach(function (x) {
        if (x.tintIdx != null && x.tintIdx > maxIdx) maxIdx = x.tintIdx;
      });
      /* 已有色则顺延；若已选尚无 tintIdx（极端），回退 map */
      if (maxIdx >= 0) seq = maxIdx + 1;
      else seq = assign._tintSeqMap[scope] || 0;
    }
    p.tintIdx = seq % BAR_TINTS.length;
    assign._tintSeqMap[scope] = seq + 1;
  }
  function ensureAssignTints(assign) {
    if (!assign) return;
    (assign.people || []).forEach(function (p) {
      if (p && p.active) assignNextTint(assign, p, 'avg');
    });
    STATIONS.forEach(function (st) {
      (assign.stations[st.id] || []).forEach(function (p) {
        if (p && p.active) assignNextTint(assign, p, st.id);
      });
    });
  }
  function barTintOf(p) {
    if (p && p.active && p.tintIdx != null) {
      return BAR_TINTS[p.tintIdx % BAR_TINTS.length];
    }
    return { fill: '#E5E5EA', pct: '#8E8E93' };
  }
  function guestAvatarOf(gender) {
    return gender === 'female' ? GUEST_AVATAR.female : GUEST_AVATAR.male;
  }
  /** 散客性别符号（稿：粉底倾斜♀ / 蓝底♂ SVG） */
  function guestGenderBadgeHtml(gender, interactive) {
    var g = gender === 'female' ? 'female' : 'male';
    var src = g === 'female' ? 'assets/gender/ic_guest_female.svg' : 'assets/gender/ic_guest_male.svg';
    var icon = '<img class="spf-gender__ic" src="' + src + '" alt="" width="' +
      (g === 'female' ? '30' : '48') + '" height="' + (g === 'female' ? '30' : '48') +
      '" aria-hidden="true">';
    var inner = '<span class="spf-gender is-' + g + '">' + icon + '</span>';
    if (!interactive) return inner;
    return '<button type="button" class="spf-cust__av-btn" data-sp-guest-av aria-label="切换性别">' +
      inner + '</button>';
  }
  /** 选中态 %：贴分界线左侧（CSS translateX(-100%)），left 夹在条内安全区 */
  function pctLabelLeft(pct) {
    var p = Math.max(0, Math.min(100, Number(pct) || 0));
    var lo = 8;
    var hi = 92;
    return Math.max(lo, Math.min(hi, p));
  }
  function memberWalletHtml(slip) {
    var bal = slip.balance;
    var bonus = slip.bonus;
    var hasBal = bal != null && bal !== '';
    var hasBonus = bonus != null && bonus !== '';
    if (!hasBal && !hasBonus) return '';
    var bits = [];
    if (hasBal) bits.push('充值余额 ¥' + moneyTrim(bal));
    if (hasBonus) bits.push('赠金 ¥' + moneyTrim(bonus));
    return '<div class="spf-cust__wallet">' + bits.map(function (t) {
      return '<span class="spf-cust__wallet-item">' + escapeHtml(t) + '</span>';
    }).join('<span class="spf-cust__wallet-dot">·</span>') + '</div>';
  }
  function memberFootHtml(slip) {
    var debt = Number(slip.debt) || 0;
    var date = slip.lastVisitDate || '';
    return (
      '<div class="spf-cust__foot">' +
      (date
        ? '<span class="spf-cust__last">上次 ' + escapeHtml(date) + '</span>'
        : '<span class="spf-cust__last is-empty"></span>') +
      '<span class="spf-cust__debt">欠款 ¥' + moneyTrim(debt) + '</span></div>'
    );
  }
  /** 会员姓名旁性别符号（小 ♂/♀，非散客大色圆） */
  function memberGenderIconHtml(gender) {
    var g = gender === 'male' ? 'male' : 'female';
    var sym = g === 'male' ? '♂' : '♀';
    var lab = g === 'male' ? '男' : '女';
    return '<span class="spf-cust__sex is-' + g + '" aria-label="' + lab + '">' + sym + '</span>';
  }
  function memberAvatarImgHtml(cls, src) {
    var url = src || MEM_AVATAR_FALLBACK;
    return (
      '<img class="' + cls + '" src="' + escapeHtml(url) + '" alt="" loading="lazy" ' +
      'referrerpolicy="no-referrer" ' +
      'onerror="this.onerror=null;this.src=\'' + MEM_AVATAR_FALLBACK + '\'">'
    );
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
  function hasActiveStaffInAssign(a) {
    return peopleFromAssign(a).some(function (p) { return p && !!p.active; });
  }
  function hasAnyStaff() {
    if (ui.contentMode === 'quick') return hasActiveStaffInAssign(ui.orderStaff);
    return ui.editItems.some(function (it) { return hasActiveStaffInAssign(it.assign); });
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
    if (gender === 'female') return '女散客';
    return '男散客';
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
  function payListCardHtml(slip) {
    var rows = [];
    rows.push({
      lab: '实付金额',
      val: '¥' + moneyTrim(slip.paid),
      bold: true,
      afterHair: true
    });
    (slip.payments || []).forEach(function (p) {
      if (!p || !p.method) return;
      var amt = Number(p.amount);
      if (!(amt > 0)) return;
      rows.push({ lab: p.method, val: '¥' + moneyTrim(amt) });
    });
    var benefit = slip.benefit || '';
    var coupon = slip.coupon || '';
    if (!benefit && !coupon && slip.benefits) {
      benefit = String(slip.benefits);
    }
    if (benefit) rows.push({ lab: '使用权益', val: benefit, red: true });
    if (coupon) rows.push({ lab: '使用优惠券', val: coupon, red: true });
    var html = '<div class="spf-card spf-card--pay"><div class="spf-pay-list">';
    rows.forEach(function (r) {
      html +=
        '<div class="spf-pay-row' + (r.bold ? ' is-paid' : '') + (r.red ? ' is-ben' : '') + '">' +
        '<span class="spf-pay-row__lab">' + escapeHtml(r.lab) + '</span>' +
        '<span class="spf-pay-row__val' + (r.bold ? ' is-bold' : '') + (r.red ? ' is-red' : '') + '">' +
        escapeHtml(r.val) + '</span></div>';
      if (r.afterHair) html += '<div class="spf-pay-hair" aria-hidden="true"></div>';
    });
    html += '</div></div>';
    return html;
  }
  function commissionOf(achievement) {
    return Math.round((Number(achievement) || 0) * COMMISSION_RATE * 100) / 100;
  }
  function reconcilePerfRows() {
    /* 归档汇总：按员工聚合各项目横条业绩/提成 */
    var map = {};
    function addFromAssign(assign, it) {
      listStaffEntries(assign, 'x', it).forEach(function (en) {
        var p = en.person;
        if (!p || !p.id || !p.active) return;
        if (!map[p.id]) map[p.id] = { id: p.id, name: p.name, achievement: 0, commission: 0 };
        map[p.id].achievement += Number(p.achievement) || 0;
        map[p.id].commission += Number(p.commission) || 0;
      });
    }
    if (ui.contentMode === 'quick') {
      var slipQ = getSlip(ui.currentId);
      addFromAssign(ui.orderStaff, { price: slipQ ? slipQ.paid : 0, qty: 1 });
    } else {
      ui.editItems.forEach(function (it) {
        ensureItemAssign(it);
        addFromAssign(it.assign, it);
      });
    }
    ui.perfRows = Object.keys(map).map(function (k) {
      var r = map[k];
      r.achievement = Math.round(r.achievement * 100) / 100;
      r.commission = Math.round(r.commission * 100) / 100;
      return r;
    });
    ui.perfStaffKey = ui.perfRows.map(function (r) { return r.id; }).join(',');
  }
  /** s17 消费内容下方：本单参与员工业绩/提成概览（只读，业绩为 0 不展示） */
  function perfOverviewCardHtml() {
    reconcilePerfRows();
    var rows = (ui.perfRows || []).filter(function (r) {
      return (Number(r.achievement) || 0) > 0;
    });
    var body;
    if (!rows.length) {
      body = '<div class="spf-quick-tip">选择员工后显示业绩与提成</div>';
    } else {
      body =
        '<div class="spf-ov" aria-readonly="true">' +
        '<div class="spf-ov__head" aria-hidden="true">' +
        '<span class="spf-ov__nm">员工</span>' +
        '<span class="spf-ov__col">业绩</span>' +
        '<span class="spf-ov__col">提成</span></div>' +
        rows.map(function (row) {
          var comm = Number(row.commission);
          if (!isFinite(comm)) comm = commissionOf(row.achievement);
          return (
            '<div class="spf-ov__row">' +
            '<div class="spf-ov__nm">' + escapeHtml(row.name) + '</div>' +
            '<div class="spf-ov__col">¥' + money(row.achievement) + '</div>' +
            '<div class="spf-ov__col">¥' + money(comm) + '</div></div>'
          );
        }).join('') +
        '</div>';
    }
    return (
      '<div class="spf-card spf-card--perf">' +
      '<div class="spf-card__h">业绩提成</div>' +
      body + '</div>'
    );
  }

  function pendingCount() {
    return slips.filter(function (s) { return s.status === 'pending'; }).length;
  }
  function getSlip(id) {
    return slips.find(function (s) { return s.id === id; });
  }
  /** 下单时间戳：dateKey + time；越近越前 */
  function slipTimeMs(slip) {
    var key = slip.dateKey || todayKey();
    var p = String(key).split('-').map(Number);
    var hm = String(slip.time || '00:00').split(':');
    var d = new Date(p[0] || 1970, (p[1] || 1) - 1, p[2] || 1, Number(hm[0]) || 0, Number(hm[1]) || 0, 0, 0);
    return d.getTime();
  }
  function sortByTimeNewest(list) {
    return list.slice().sort(function (a, b) {
      var dt = slipTimeMs(b) - slipTimeMs(a);
      if (dt !== 0) return dt;
      return (Number(a.seq) || 0) - (Number(b.seq) || 0);
    });
  }
  function pendingSlipsAll() {
    return sortByTimeNewest(slips.filter(function (s) { return s.status === 'pending'; }));
  }
  function memberTagHtml(slip) {
    var mem = !!slip.isMember;
    return '<span class="sp-tag ' + (mem ? 'is-mem' : 'is-guest') + '">' + (mem ? '会' : '散') + '</span>';
  }
  /* 当日只显 HH:mm；非当日只显 M/D */
  function ticketWhenLabel(slip) {
    var key = slip.dateKey || todayKey();
    if (key === todayKey()) return slip.time || '';
    var p = key.split('-');
    return Number(p[1]) + '/' + Number(p[2]);
  }
  /** 票卡项目名：最多 6 字；超长或还有更多项时只加一个「…」（按字截断，避免 CSS 半字裁切） */
  function ticketItemLabel(name, moreItems) {
    var s = String(name || '');
    var shown = s.length > 6 ? s.slice(0, 6) : s;
    var dots = s.length > 6 || moreItems ? '…' : '';
    return escapeHtml(shown) + dots;
  }
  function itemLinesHtml(slip) {
    var items = slip.items || [];
    if (!items.length) {
      if (slip.contentMode === 'quick') return '<div class="sp-ticket__line">快捷开单</div>';
      return '<div class="sp-ticket__line is-empty">未填项目</div>';
    }
    if (items.length === 1) {
      /* 仅 1 项：仍按两行占位，名称固定在上行 */
      return (
        '<div class="sp-ticket__line">' + ticketItemLabel(items[0].name, false) + '</div>' +
        '<div class="sp-ticket__line2"><span></span></div>'
      );
    }
    /* 恰 2 项：两行名；≥3：第二项名（可带…）+ 灰圆件数 */
    var overflow = items.length > 2;
    var more = overflow
      ? '<span class="sp-ticket__count" aria-label="共' + items.length + '项">' + items.length + '</span>'
      : '';
    return (
      '<div class="sp-ticket__line">' + ticketItemLabel(items[0].name, false) + '</div>' +
      '<div class="sp-ticket__line2">' +
      '<span>' + ticketItemLabel(items[1].name, overflow) + '</span>' + more + '</div>'
    );
  }
  function ticketHtml(slip) {
    var name = escapeHtml(displayCustomerName(slip));
    var nameHtml = slip.isMember
      ? '<span class="sp-ticket__name is-link" data-sp-member-link role="link" tabindex="0">' + name + '</span>'
      : '<span class="sp-ticket__name">' + name + '</span>';
    var when = ticketWhenLabel(slip);
    return (
      '<div role="button" tabindex="0" class="sp-ticket" data-sp-id="' + slip.id + '">' +
      '<i class="sp-ticket__stub" aria-hidden="true"></i>' +
      '<div class="sp-ticket__top">' +
      '<div class="sp-ticket__seq">' + escapeHtml(String(slip.seq != null ? slip.seq : '')) + '</div>' +
      (when ? '<div class="sp-ticket__when">' + escapeHtml(when) + '</div>' : '') +
      '</div>' +
      nameHtml +
      '<div class="sp-ticket__items">' + itemLinesHtml(slip) + '</div>' +
      '<div class="sp-ticket__ft">' + memberTagHtml(slip) +
      '<div class="sp-ticket__amt">¥' + moneyTrim(slip.paid) + '</div></div></div>'
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
    html += floorTailHtml();
    el.innerHTML = html;
    el.style.transform = '';
    var host = $('#spHomeStripHost');
    if (host) {
      host.classList.remove('is-at-end', 'is-armed', 'is-pulling');
      host.classList.toggle('is-floor-hint', ui.floorMode === 'hint');
    }
  }
  function floorTailHtml() {
    if (ui.floorMode === 'hint') {
      return (
        '<div class="vh-sp-tail vh-sp-tail--hint" aria-hidden="true">' +
        '<div class="sp-floor-hint" id="spFloorHint">' +
        '<span class="sp-floor-hint__lab">继续滑动查看更多</span>' +
        '<span class="sp-floor-hint__chev" aria-hidden="true">' +
        '<svg viewBox="0 0 12 12" width="12" height="12">' +
        '<path d="M4.5 3L7.5 6l-3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg></span></div></div>'
      );
    }
    return (
      '<div class="vh-sp-tail" aria-hidden="true">' +
      '<div class="sp-floor-dots" id="spFloorDots"><i></i><i></i><i></i></div></div>'
    );
  }

  function resetHomeStripScroll() {
    var host = $('#spHomeStripHost');
    if (host) {
      host.scrollLeft = 0;
      host.classList.remove('is-at-end', 'is-armed', 'is-pulling');
    }
    var dots = $('#spFloorDots');
    if (dots) {
      dots.classList.remove('is-on', 'is-split', 'is-armed');
      dots.style.removeProperty('--sp-dot-spread');
      dots.style.removeProperty('--sp-floor-t');
    }
    var hint = $('#spFloorHint');
    if (hint) {
      hint.classList.remove('is-on', 'is-armed');
      setFloorHintLab(hint, '继续滑动查看更多');
    }
    var hintTail = document.querySelector('.vh-sp-tail--hint');
    if (hintTail) hintTail.classList.remove('is-armed');
  }
  function setFloorHintLab(hint, text) {
    if (!hint) return;
    var lab = hint.querySelector('.sp-floor-hint__lab');
    if (lab) lab.textContent = text;
  }
  function syncHintTailArmed(armed) {
    var hintTail = document.querySelector('.vh-sp-tail--hint');
    if (hintTail) hintTail.classList.toggle('is-armed', !!armed);
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
    if (items.length === 2) return items[0].name + '、' + items[1].name;
    return items[0].name + '等' + items.length + '项';
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
    return sortByTimeNewest(slips.filter(function (s) {
      return s.status === 'pending' && matchesFilter(s);
    }));
  }

  function renderList() {
    var wrap = $('#spGridWrap');
    var hint = $('#spVoidHint');
    if (!wrap) return;
    ui.tab = 'pending';
    ui.dateKey = '';
    ui.filter = { pay: '', hasItems: '', amtMin: '', amtMax: '' };
    if (hint) hint.hidden = true;
    var list = listForTab();
    if (!list.length) {
      wrap.innerHTML =
        '<div class="sp-empty">' +
        '<img src="assets/ic_empty.svg" alt="">' +
        '<div class="sp-empty__t">暂无待归档订单</div>' +
        '<div class="sp-empty__s">可调整搜索关键词后再试</div></div>';
      return;
    }
    var html = '<div class="sp-grid">';
    list.forEach(function (slip) { html += ticketHtml(slip); });
    html += '</div>';
    wrap.innerHTML = html;
  }

  function ensureAveragePeople(assign, it) {
    assign = assign || emptyAssign();
    var map = {};
    (assign.people || []).forEach(function (p) {
      if (p && p.id) map[p.id] = p;
    });
    assign.people = SP_DEMO_STAFF.map(function (st) {
      var p = map[st.id];
      if (!p) {
        p = { id: st.id, name: st.name, dianke: false, active: false, pct: 0 };
      } else {
        p.name = st.name;
      }
      syncPersonPerf(p, 'avg', it || { price: 0, qty: 1 });
      return p;
    });
    return assign;
  }
  function listStaffEntries(assign, prefix, it) {
    assign = assign || emptyAssign();
    var rows = [];
    if (ui.allocMode === 'average') {
      ensureAveragePeople(assign, it);
      (assign.people || []).forEach(function (p, i) {
        syncPersonPerf(p, 'avg', it || { price: 0, qty: 1 });
        rows.push({ person: p, station: 'avg', ctx: prefix + '|avg|' + i, lab: '' });
      });
    } else {
      STATIONS.forEach(function (st) {
        (assign.stations[st.id] || []).forEach(function (p, i) {
          syncPersonPerf(p, st.id, it || { price: 0, qty: 1 });
          rows.push({ person: p, station: st.id, ctx: prefix + '|' + st.id + '|' + i, lab: st.lab });
        });
      });
    }
    return rows;
  }

  function staffBarHtml(entry) {
    var p = entry.person;
    var on = !!p.active;
    var pct = on ? (Number(p.pct) || 0) : 0;
    var tint = barTintOf(p);
    var pctLeft = pctLabelLeft(pct);
    var xHtml = on
      ? '<button type="button" class="spf-ibar__x" data-sp-ibar-clear="' + escapeHtml(entry.ctx) +
        '" aria-label="清除">×</button>'
      : '';
    var pctHtml = on
      ? '<span class="spf-ibar__pct" style="left:' + pctLeft + '%">' + Math.round(pct) + '%</span>'
      : '';
    var dkHtml = on
      ? '<button type="button" class="spf-ibar__dk' + (p.dianke ? ' is-on' : '') +
        '" data-sp-ibar-dk="' + escapeHtml(entry.ctx) + '" aria-label="点客">' +
        '<span class="spf-ibar__dk-lab">点客</span></button>'
      : '';
    var handleHtml = on
      ? '<span class="spf-ibar__handle" data-sp-ibar-handle aria-hidden="true"></span>'
      : '';
    return (
      '<div class="spf-ibar' + (on ? ' is-on' : '') + (p.dianke ? ' is-dk' : '') +
      '" data-sp-ibar="' + escapeHtml(entry.ctx) +
      '" style="--ibar-color:' + tint.fill + ';--ibar-pct-color:' + tint.pct + '">' +
      '<div class="spf-ibar__track" data-sp-ibar-track="' + escapeHtml(entry.ctx) + '">' +
      '<div class="spf-ibar__fill" style="width:' + pct + '%;background:' + tint.fill + '">' +
      handleHtml + '</div>' +
      '<div class="spf-ibar__nm">' + escapeHtml(p.name) + '</div>' +
      pctHtml + dkHtml + xHtml +
      '<div class="spf-ibar__bubble" hidden></div>' +
      '</div></div>'
    );
  }
  function foldBarsHtml(rows, foldKey) {
    var open = !!(ui.ibarFoldOpen && ui.ibarFoldOpen[foldKey]);
    var show = rows;
    var more = '';
    if (rows.length > 4) {
      if (!open) {
        show = rows.slice(0, 3);
        more =
          '<button type="button" class="spf-ibar-more" data-sp-ibar-more="' +
          escapeHtml(foldKey) + '">展开（共' + rows.length + '人）</button>';
      } else {
        more =
          '<button type="button" class="spf-ibar-more is-open" data-sp-ibar-more="' +
          escapeHtml(foldKey) + '">收起</button>';
      }
    }
    return '<div class="spf-ibar-list" data-sp-ibar-fold="' + escapeHtml(foldKey) + '">' +
      show.map(function (r) { return staffBarHtml(r); }).join('') + more + '</div>';
  }
  function stationCanAddMore(arr) {
    var used = {};
    (arr || []).forEach(function (p) { if (p && p.id) used[p.id] = true; });
    return staffPoolList().some(function (st) { return st && st.id && !used[st.id]; });
  }

  function stationSlotBtn(ctxRaw) {
    return (
      '<button type="button" class="spf-slot" data-sp-slot="' + escapeHtml(ctxRaw) + '">+</button>'
    );
  }

  function assignBarsHtml(assign, prefix, it) {
    assign = assign || emptyAssign();
    ensureAssignTints(assign);
    /* 平均：全员数值条，不可再添加；>4 折叠 */
    if (ui.allocMode === 'average') {
      ensureAveragePeople(assign, it);
      ensureAssignTints(assign);
      var avgRows = listStaffEntries(assign, prefix, it);
      if (!avgRows.length) {
        return '<div class="spf-quick-tip">暂无员工</div>';
      }
      return foldBarsHtml(avgRows, prefix);
    }
    /* 工位：三行工位；已选为条；未满留 + 空槽 */
    var out = '<div class="spf-st-block">';
    STATIONS.forEach(function (st) {
      var arr = assign.stations[st.id] || [];
      out += '<div class="spf-st-row"><div class="spf-st-lab">' + st.lab + '</div><div class="spf-st-main">';
      var stRows = [];
      arr.forEach(function (p, i) {
        syncPersonPerf(p, st.id, it || { price: 0, qty: 1 });
        stRows.push({
          person: p, station: st.id, ctx: prefix + '|' + st.id + '|' + i, lab: st.lab
        });
      });
      out += foldBarsHtml(stRows, prefix + '|' + st.id);
      /* 本工位已选满演示池全部员工时隐藏 +；人数不限、可跨工位同人 */
      if (stationCanAddMore(arr)) {
        out += '<div class="spf-st-slots">' + stationSlotBtn(prefix + '|' + st.id + '|' + arr.length) + '</div>';
      }
      out += '</div></div>';
    });
    out += '</div>';
    return out;
  }

  function itemCardHtml(it, idx) {
    ensureItemAssign(it);
    if (ui.allocMode === 'average') ensureAveragePeople(it.assign, it);
    var focus = ui.focusItemIdx === idx ? ' is-focus' : '';
    var head =
      '<div class="spf-icard__hd">' +
      '<div class="spf-icard__info">' +
      '<div class="spf-icard__name">' + escapeHtml(it.name) +
      (it.smart ? '<span class="spf-icard__smart">智能补全</span>' : '') + '</div>' +
      '<div class="spf-icard__sub">' +
      '<span class="spf-icard__meta">' + (it.type === 'product' ? '产品' : '项目') + ' · ¥' +
      money(it.price) + ' ×' + (it.qty || 1) + '</span>' +
      '<span class="spf-icard__sep" aria-hidden="true"></span>' +
      '<button type="button" class="spf-icard__sheet" data-sp-item-sheet="' + idx +
      '" aria-label="业绩提成">' +
      '<img src="assets/ic_sp_staff_sheet.svg" alt="" width="18" height="18"></button>' +
      '</div></div>' +
      '<button type="button" class="spf-item__del" data-sp-del="' + idx + '" aria-label="删除">×</button>' +
      '</div>';
    return (
      '<div class="spf-icard' + focus + '" data-sp-item-card="' + idx + '">' +
      head + assignBarsHtml(it.assign, 'item|' + idx, it) + '</div>'
    );
  }

  function completeBodyHtml(slip) {
    var when = ticketWhenLabel(slip);
    var seqCard =
      '<div class="spf-card spf-card--seq">' +
      '<div class="spf-seq">' + escapeHtml(String(slip.seq != null ? slip.seq : '')) + '</div>' +
      '<div class="spf-when">' + escapeHtml(when) + '</div></div>';

    var custName = displayCustomerName(slip);
    var memberBody;
    if (slip.isMember) {
      memberBody =
        '<div class="spf-card spf-card--cust spf-card--member" data-sp-member-card>' +
        '<div class="spf-cust">' +
        memberAvatarImgHtml('spf-cust__av', slip.avatar) +
        '<div class="spf-cust__main">' +
        '<div class="spf-cust__line1">' +
        '<span class="spf-cust__name">' + escapeHtml(custName) + '</span>' +
        '<span class="spf-sum__vip">会员</span></div>' +
        (slip.phone ? '<div class="spf-cust__phone">' + escapeHtml(slip.phone) + '</div>' : '') +
        memberWalletHtml(slip) +
        memberFootHtml(slip) +
        (slip.canRestoreGuest
          ? '<button type="button" class="spf-restore-guest" data-sp-restore-guest>恢复散客</button>'
          : '') +
        '</div></div></div>';
    } else {
      var g = ui.guestGender || slip.guestGender || 'male';
      memberBody =
        '<div class="spf-card spf-card--cust spf-card--guest">' +
        '<div class="spf-cust spf-cust--guest">' +
        guestGenderBadgeHtml(g, true) +
        '<div class="spf-cust__main">' +
        '<div class="spf-cust__line1">' +
        '<button type="button" class="spf-cust__name spf-cust__name--btn" data-sp-guest-av>' +
        escapeHtml(custName) + '</button></div></div>' +
        '<button type="button" class="spf-pick-mem" data-sp-pick-member>选择会员</button>' +
        '</div></div>';
    }

    var payCard = payListCardHtml(slip);

    var itemsInner = '';
    var quickHd =
      '<div class="spf-quick-hd">' +
      '<img class="spf-quick-hd__ic" src="assets/ic_sp_quick_bolt.svg" alt="" width="23" height="23">' +
      '<span class="spf-quick-hd__t">快捷开单</span></div>';
    if (ui.contentMode === 'quick') {
      itemsInner =
        quickHd +
        assignBarsHtml(ui.orderStaff, 'order', { price: slip.paid, qty: 1 }) +
        '<button type="button" class="spf-add-btn" data-sp-add>改为项目/产品</button>';
    } else {
      itemsInner = (ui.editItems.length
        ? ui.editItems.map(function (it, idx) { return itemCardHtml(it, idx); }).join('')
        : '<div class="spf-quick-tip">尚未添加项目/产品</div>') +
        '<button type="button" class="spf-add-btn" data-sp-add>+ 添加项目/产品</button>';
    }

    var consumeCard =
      '<div class="spf-card spf-card--items">' +
      '<div class="spf-card__h">消费内容</div>' +
      '<div class="spf-card__rule" aria-hidden="true"></div>' +
      '<div class="spf-card__body">' + itemsInner + '</div></div>';

    var remarkHtml =
      '<textarea class="spf-remark" id="spRemark" maxlength="200" placeholder="选填">' +
      escapeHtml(ui.remark) + '</textarea>';
    var remarkCard =
      '<div class="spf-card spf-card--remark">' +
      '<div class="spf-card__h">备注</div>' + remarkHtml + '</div>';

    return seqCard + memberBody + payCard + consumeCard + perfOverviewCardHtml() + remarkCard;
  }

  function paintS17() {
    var slip = getSlip(ui.currentId);
    if (!slip) return;
    var scroll = $('#s17Scroll');
    var title = $('#s17Title');
    var root = $('#s17');
    var bar = $('#s17Bar');
    if (!scroll || !root) return;
    if (title) title.textContent = '补全订单';
    if (bar) bar.hidden = false;
    scroll.innerHTML = completeBodyHtml(slip);
    var remark = $('#spRemark');
    if (remark) {
      remark.addEventListener('input', function () { ui.remark = remark.value || ''; });
    }
    syncAllocNav();
  }

  function parseLastVisitName(slipOrText) {
    if (slipOrText && typeof slipOrText === 'object') {
      if (slipOrText.lastItem) return String(slipOrText.lastItem);
      slipOrText = slipOrText.lastVisit || '';
    }
    var m = String(slipOrText || '').match(/上次\s*[\d./]+\s*(.+)$/);
    return m ? m[1].trim() : '';
  }
  function catalogFlat() {
    var cat = priceCatalog();
    var out = [];
    ['project', 'product'].forEach(function (tab) {
      ((cat[tab] && cat[tab].items) || []).forEach(function (it) {
        out.push({
          name: it.name,
          price: Number(it.price) || 0,
          type: tab === 'product' ? 'product' : 'project'
        });
      });
    });
    HOT_30D.forEach(function (h) {
      if (!out.some(function (x) { return x.name === h.name; })) {
        out.push({ name: h.name, price: h.price, type: h.type });
      }
    });
    return out;
  }
  function smartPickItem(slip) {
    var paid = Number(slip.paid) || 0;
    var lastName = parseLastVisitName(slip);
    var hotRank = {};
    HOT_30D.forEach(function (h, i) { hotRank[h.name] = i + 1; });
    var best = null;
    var bestScore = -1;
    catalogFlat().forEach(function (c) {
      /* 硬规则：填入项售价不得低于订单实付 */
      if (Number(c.price) < paid) return;
      /* 项目优先：同价差下项目加分 */
      var priceDiff = Math.abs(c.price - paid);
      var priceScore = 1 / (1 + priceDiff / Math.max(paid, 1));
      var lastHit = lastName && c.name === lastName ? 1 : 0;
      var hot = hotRank[c.name] ? (1 / hotRank[c.name]) : 0;
      var typeBoost = c.type === 'project' ? 0.08 : 0;
      var score = priceScore * 0.5 + lastHit * 0.3 + hot * 0.2 + typeBoost;
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    });
    return best;
  }
  function smartPickStaffId(itemName) {
    var pref = ITEM_STAFF_PREF[itemName];
    if (pref && SP_DEMO_STAFF.some(function (s) { return s.id === pref; })) return pref;
    return 'st1';
  }
  function pushStaffToAssign(assign, sid, station, dianke, it) {
    var stInfo = demoStaffById(sid);
    if (!stInfo) return false;
    var person = {
      id: sid,
      name: stInfo.name,
      dianke: !!dianke,
      active: true,
      pct: defaultPctForStation(station === 'avg' ? 'senior' : station)
    };
    assignNextTint(assign, person, tintScopeOf(station));
    syncPersonPerf(person, station === 'avg' ? 'senior' : station, it);
    if (ui.allocMode === 'average' || station === 'avg') {
      assign.people = assign.people || [];
      if (assign.people.some(function (p) { return p.id === sid; })) return false;
      assign.people.push(person);
    } else {
      var arr = assign.stations[station] || (assign.stations[station] = []);
      if (arr.some(function (p) { return p.id === sid; })) return false;
      arr.push(person);
    }
    return true;
  }
  function runSmartComplete(slip) {
    ui.smartComplete = true;
    if (ui.contentMode !== 'quick' && !ui.editItems.length) {
      var pick = smartPickItem(slip);
      if (pick) {
        ui.editItems.push({
          id: 'smart-' + Date.now(),
          name: pick.name,
          type: pick.type,
          price: pick.price,
          qty: 1,
          smart: true,
          assign: emptyAssign()
        });
      }
    }
    var targetIt = null;
    var targetAssign = null;
    var prefixStation = 'senior';
    if (ui.contentMode === 'quick') {
      targetIt = { price: slip.paid, qty: 1, name: '' };
      targetAssign = ui.orderStaff;
    } else if (ui.editItems.length) {
      targetIt = ui.editItems[0];
      ensureItemAssign(targetIt);
      targetAssign = targetIt.assign;
    }
    if (targetAssign) {
      if (ui.allocMode === 'average') {
        ensureAveragePeople(targetAssign, targetIt);
        if (!peopleFromAssign(targetAssign).some(function (p) { return p && p.active; })) {
          var sidAvg = smartPickStaffId(targetIt.name || parseLastVisitName(slip));
          var hit = (targetAssign.people || []).find(function (p) { return p.id === sidAvg; }) ||
            (targetAssign.people || [])[0];
          if (hit) activatePerson(hit, 'senior', targetIt, targetAssign);
        }
      } else if (!peopleFromAssign(targetAssign).length) {
        var sid = smartPickStaffId(targetIt.name || parseLastVisitName(slip));
        pushStaffToAssign(targetAssign, sid, prefixStation, false, targetIt);
      }
    }
  }

  function openComplete(id) {
    var slip = getSlip(id);
    if (!slip) return;
    if (slip.status === 'done') {
      toast('已归档 · 请从订单流水查看');
      return;
    }
    ui.currentId = id;
    ui.contentMode = slip.contentMode === 'quick' ? 'quick' : 'items';
    ui.editItems = (slip.items || []).map(function (it) {
      return {
        id: it.id, name: it.name, type: it.type, price: it.price, qty: it.qty || 1,
        smart: !!it.smart,
        assign: cloneAssign(it.assign)
      };
    });
    ui.orderStaff = cloneAssign(slip.orderStaff);
    ui.cardsOpen = false;
    ui.remark = slip.remark || '';
    ui.focusItemIdx = 0;
    ui.guestGender = slip.isMember ? '' : (slip.guestGender || 'male');
    if (!slip.isMember) {
      slip.guestGender = ui.guestGender;
      slip.customerName = guestDisplayName(ui.guestGender);
      slip.avatar = '';
    }
    ui.perfRows = [];
    ui.perfStaffKey = '';
    if (!window.__spSkipSmartComplete) runSmartComplete(slip);
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
    if (!slip || slip.status !== 'pending') return;

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
        smart: !!it.smart,
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
        commission: Number(r.commission) != null ? Number(r.commission) : commissionOf(r.achievement)
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
  function pickStationBlocked(assign, station) {
    var blocked = {};
    var arr = (assign && assign.stations && assign.stations[station]) || [];
    arr.forEach(function (p) { if (p && p.id) blocked[p.id] = true; });
    return blocked;
  }
  function pickRemainCap(ctx, assign) {
    if (!ctx || !assign || ctx.station === 'avg') return 0;
    var blocked = pickStationBlocked(assign, ctx.station);
    return staffPoolList().filter(function (st) {
      return st && st.id && !blocked[st.id];
    }).length;
  }
  function renderPickStaffBody() {
    var body = $('#spPickStaffBody');
    var foot = $('#spPickStaffFoot');
    var ctx = ui.pickCtx;
    if (!body || !ctx) return;
    var assign = getAssignByCtx(ctx);
    /* 仅排除本工位已有员工；其他工位已选的人仍可选 */
    var blocked = pickStationBlocked(assign, ctx.station);
    var remain = pickRemainCap(ctx, assign);
    var pool = staffPoolList().filter(function (st) {
      return st && st.id && !blocked[st.id];
    });
    if (!pool.length || remain <= 0) {
      body.innerHTML = '<div class="spf-quick-tip">暂无可选员工</div>';
      if (foot) foot.hidden = true;
      return;
    }
    if (foot) foot.hidden = false;
    body.innerHTML = pool.map(function (st) {
      var draft = ui.pickDraft[st.id] || { on: false, dianke: false };
      return (
        '<div class="sp-pick-row' + (draft.on ? ' is-checked' : '') + '" data-sp-pick-row="' +
        escapeHtml(st.id) + '">' +
        '<button type="button" class="sp-pick-dk' + (draft.dianke ? ' is-on' : '') +
        '" data-sp-pick-dk-toggle="' + escapeHtml(st.id) + '" aria-label="点客">' +
        '<span>点客</span></button>' +
        '<span class="sp-pick-row__nm">' + escapeHtml(st.name) + '</span>' +
        '<button type="button" class="sp-pick-switch' + (draft.on ? ' is-on' : '') +
        '" data-sp-pick-check="' + escapeHtml(st.id) + '" role="switch" aria-checked="' +
        (draft.on ? 'true' : 'false') + '" aria-label="选择">' +
        '<span class="sp-pick-switch__track"><span class="sp-pick-switch__knob"></span></span></button></div>'
      );
    }).join('');
  }
  function openPickStaff(ctxRaw) {
    var ctx = parseSlotCtx(ctxRaw);
    if (!ctx) return;
    if (ui.allocMode === 'average' || ctx.station === 'avg') {
      toast('平均分配下已展示全部员工');
      return;
    }
    ui.pickCtx = ctx;
    ui.pickDraft = {};
    var title = $('#spPickStaffTitle');
    var st = STATIONS.find(function (s) { return s.id === ctx.station; });
    if (title) title.textContent = '选择' + (st ? st.lab : '员工');
    var assign = getAssignByCtx(ctx);
    if (pickRemainCap(ctx, assign) <= 0) {
      ui.pickCtx = null;
      toast('暂无可选员工');
      return;
    }
    renderPickStaffBody();
    openMask('spPickStaffMask');
  }
  function closePickStaff() {
    closeMask('spPickStaffMask');
    ui.pickCtx = null;
    ui.pickDraft = {};
    ui.pickAwaitStation = null;
  }
  function togglePickDraftCheck(sid) {
    var ctx = ui.pickCtx;
    var assign = getAssignByCtx(ctx);
    var remain = pickRemainCap(ctx, assign);
    var draft = ui.pickDraft[sid] || { on: false, dianke: false };
    if (!draft.on) {
      var selectedCount = Object.keys(ui.pickDraft).filter(function (id) {
        return ui.pickDraft[id] && ui.pickDraft[id].on;
      }).length;
      if (selectedCount >= remain) {
        toast('暂无可选员工');
        return;
      }
      draft.on = true;
    } else {
      draft.on = false;
    }
    ui.pickDraft[sid] = draft;
    renderPickStaffBody();
  }
  function togglePickDraftDianke(sid) {
    var draft = ui.pickDraft[sid] || { on: false, dianke: false };
    draft.dianke = !draft.dianke;
    ui.pickDraft[sid] = draft;
    renderPickStaffBody();
  }
  function confirmPickStaff() {
    var ctx = ui.pickCtx;
    var assign = getAssignByCtx(ctx);
    if (!ctx || !assign || ctx.station === 'avg') {
      closePickStaff();
      return;
    }
    var it = itemFromCtx(ctx);
    var arr = assign.stations[ctx.station] || (assign.stations[ctx.station] = []);
    var remain = pickRemainCap(ctx, assign);
    var chosen = Object.keys(ui.pickDraft).filter(function (id) {
      return ui.pickDraft[id] && ui.pickDraft[id].on;
    });
    if (!chosen.length) {
      toast('请勾选员工');
      return;
    }
    if (chosen.length > remain) {
      toast('暂无可选员工');
      return;
    }
    chosen.forEach(function (sid) {
      if (arr.some(function (p) { return p.id === sid; })) return;
      var st = demoStaffById(sid);
      var person = {
        id: sid,
        name: st ? st.name : sid,
        dianke: !!(ui.pickDraft[sid] && ui.pickDraft[sid].dianke),
        active: true,
        pct: defaultPctForStation(ctx.station)
      };
      assignNextTint(assign, person, ctx.station);
      syncPersonPerf(person, ctx.station, it);
      arr.push(person);
    });
    closePickStaff();
    ui.perfStaffKey = '';
    paintS17();
  }
  function itemFromCtx(ctx) {
    if (!ctx) return { price: 0, qty: 1 };
    if (ctx.kind === 'order') {
      var slip = getSlip(ui.currentId);
      return { price: slip ? slip.paid : 0, qty: 1, name: '' };
    }
    return ui.editItems[ctx.itemIdx] || { price: 0, qty: 1 };
  }
  function personFromCtx(ctx) {
    var assign = getAssignByCtx(ctx);
    if (!ctx || !assign) return null;
    if (ctx.station === 'avg') return (assign.people || [])[ctx.index] || null;
    return (assign.stations[ctx.station] || [])[ctx.index] || null;
  }
  function clearSlot(ctxRaw) {
    var ctx = parseSlotCtx(ctxRaw);
    var assign = getAssignByCtx(ctx);
    var it = itemFromCtx(ctx);
    if (!ctx || !assign) return;
    if (ctx.station === 'avg') {
      var p = (assign.people || [])[ctx.index];
      if (p) {
        p.active = false;
        p.pct = 0;
        p.dianke = false;
        p.tintIdx = null;
        p.commissionFixed = null;
        syncPersonPerf(p, 'avg', it);
      }
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
    if (!row) return;
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
    var buf = (ui.perfKeypadBuf || '').trim();
    var n = buf === '' ? NaN : Number(buf);
    if (!isNaN(n) && n >= 0) {
      n = Math.max(0, Math.min(99999, Math.round(n * 100) / 100));
      if (ui.perfKeypadTarget) {
        var ctx = parseSlotCtx(ui.perfKeypadTarget.ctx);
        var p = personFromCtx(ctx);
        if (p) {
          if (ui.perfKeypadTarget.field === 'commission') {
            p.commissionFixed = n;
            p.commission = n;
          } else {
            applyBarPctFromAchievement(ctx, n);
          }
        }
      } else {
        var sid = ui.perfEditId;
        var row = (ui.perfRows || []).find(function (r) { return r.id === sid; });
        if (row) row.achievement = n;
      }
    }
    ui.perfKeypadTarget = null;
    closePerfKeypad();
    if ($('#spItemPerfMask') && $('#spItemPerfMask').classList.contains('show') &&
        ui.focusItemIdx != null) {
      openItemPerfSheet(ui.focusItemIdx);
    }
    paintS17();
  }

  function setAllocMode(mode) {
    ui.allocMode = mode === 'average' ? 'average' : 'station';
    ui.perfStaffKey = '';
    if (ui.allocMode === 'average') {
      if (ui.contentMode === 'quick') {
        ensureAveragePeople(ui.orderStaff, { price: (getSlip(ui.currentId) || {}).paid || 0, qty: 1 });
      } else {
        ui.editItems.forEach(function (it) {
          ensureItemAssign(it);
          ensureAveragePeople(it.assign, it);
        });
      }
    }
    syncAllocNav();
    if ($('#s17') && $('#s17').classList.contains('active')) paintS17();
    toast(ui.allocMode === 'average' ? '演示：平均分配' : '演示：按工位分配');
  }
  function syncAllocNav() {
    $all('.site-nav [data-sp-alloc]').forEach(function (btn) {
      btn.classList.toggle('on', btn.getAttribute('data-sp-alloc') === ui.allocMode);
    });
  }
  function setFloorMode(mode) {
    ui.floorMode = mode === 'hint' ? 'hint' : 'dots';
    toast(ui.floorMode === 'hint' ? '演示：进列表 · 文案版' : '演示：进列表 · 圆点版');
    syncFloorNav();
    renderHomeStrip();
    resetHomeStripScroll();
    syncFloorEndChrome();
  }
  function syncFloorNav() {
    $all('.site-nav [data-sp-floor]').forEach(function (btn) {
      btn.classList.toggle('on', btn.getAttribute('data-sp-floor') === ui.floorMode);
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

  var HELP_SUGGEST =
    '这里会帮你猜几个可能要加的项目/产品，方便点选。' +
    '<br>会看三方面：店里卖得多的、常和已选项目一起做的、最近店里归档时常用的。' +
    '<br>运用智能计算列出6个供你快速选择。';

  function openHelp(kind) {
    var title = $('#spHelpTitle');
    var body = $('#spHelpBody');
    /* 排列规则已废止；仅保留价目「猜你想加」推荐说明 */
    if (kind !== 'suggest') return;
    if (title) title.textContent = '推荐规则';
    if (body) body.innerHTML = HELP_SUGGEST;
    openMask('spHelpMask');
  }
  function closeHelp() { closeMask('spHelpMask'); }

  function openMemberSheet() {
    var body = $('#spMemberBody');
    if (!body) return;
    body.innerHTML = SP_DEMO_MEMBERS.map(function (m) {
      return (
        '<button type="button" class="sp-mem-row" data-sp-bind-member="' + escapeHtml(m.id) + '">' +
        memberAvatarImgHtml('sp-mem-row__av', m.avatar) +
        '<span class="sp-mem-row__main">' +
        '<span class="sp-mem-row__nm">' + escapeHtml(m.name) +
        memberGenderIconHtml(m.gender) + '</span>' +
        '<span class="sp-mem-row__ph">' + escapeHtml(m.phone) + '</span>' +
        '<span class="sp-mem-row__card">' + escapeHtml(m.cards || '') + '</span></span></button>'
      );
    }).join('');
    openMask('spMemberMask');
  }
  function closeMemberSheet() { closeMask('spMemberMask'); }
  function bindMember(mid) {
    var m = SP_DEMO_MEMBERS.find(function (x) { return x.id === mid; });
    var slip = getSlip(ui.currentId);
    if (!m || !slip) return;
    if (!slip.isMember) {
      slip.canRestoreGuest = true;
      slip.restoreGuestGender = slip.guestGender || ui.guestGender || 'male';
    }
    slip.isMember = true;
    slip.customerName = m.name;
    slip.gender = m.gender === 'male' ? 'male' : 'female';
    slip.phone = m.phone;
    slip.avatar = m.avatar;
    slip.cards = '';
    slip.balance = m.balance;
    slip.bonus = m.bonus;
    slip.debt = m.debt;
    slip.lastVisitDate = m.lastVisitDate || '';
    slip.lastItem = m.lastItem || '';
    slip.guestGender = '';
    ui.guestGender = '';
    closeMemberSheet();
    paintS17();
    toast('已绑定会员');
  }
  function restoreGuestOrder() {
    var slip = getSlip(ui.currentId);
    if (!slip || !slip.canRestoreGuest) return;
    var g = slip.restoreGuestGender === 'female' ? 'female' : 'male';
    slip.isMember = false;
    slip.guestGender = g;
    ui.guestGender = g;
    slip.customerName = guestDisplayName(g);
    slip.phone = '';
    slip.avatar = '';
    slip.gender = '';
    slip.cards = '';
    slip.balance = null;
    slip.bonus = null;
    slip.debt = 0;
    slip.lastVisitDate = '';
    slip.lastItem = '';
    slip.canRestoreGuest = false;
    slip.restoreGuestGender = '';
    paintS17();
    toast('已恢复散客');
  }
  function openItemPerfSheet(itemIdx) {
    var it = ui.editItems[itemIdx];
    if (!it) return;
    ui.focusItemIdx = itemIdx;
    ensureItemAssign(it);
    var entries = listStaffEntries(it.assign, 'item|' + itemIdx, it);
    var body = $('#spItemPerfBody');
    var title = $('#spItemPerfTitle');
    if (title) title.textContent = it.name + ' · 业绩提成';
    if (!body) return;
    if (!entries.length) {
      body.innerHTML =
        '<div class="sp-ipf-empty">' +
        '<div class="sp-ipf-empty__ico" aria-hidden="true">' +
        '<svg viewBox="0 0 48 48" width="40" height="40" fill="none">' +
        '<circle cx="24" cy="16" r="8" stroke="#C7C7CC" stroke-width="2"/>' +
        '<path d="M10 38c0-7.2 6.3-13 14-13s14 5.8 14 13" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round"/>' +
        '</svg></div>' +
        '<div class="sp-ipf-empty__t">暂未指定员工</div>' +
        '<div class="sp-ipf-empty__d">请先在消费内容中为该项目添加服务员工</div>' +
        '<button type="button" class="sp-ipf-empty__btn" data-sp-ipf-empty-ok>知道了</button></div>';
    } else {
      var editIc = '<img class="sp-ipf-row__pen" src="assets/ic_sp_perf_edit.svg" alt="" width="12" height="12">';
      body.innerHTML = entries.map(function (en) {
        var p = en.person;
        return (
          '<div class="sp-ipf-row" data-sp-ipf-ctx="' + escapeHtml(en.ctx) + '">' +
          '<div class="sp-ipf-row__nm">' + escapeHtml(p.name) +
          (en.lab ? '<span class="spf-ibar__st">' + escapeHtml(en.lab) + '</span>' : '') + '</div>' +
          '<button type="button" class="sp-ipf-row__num" data-sp-ipf-ach="' + escapeHtml(en.ctx) +
          '"><span class="sp-ipf-row__lab">业绩</span><span class="sp-ipf-row__v">¥' +
          money(p.achievement) + '</span>' + editIc + '</button>' +
          '<button type="button" class="sp-ipf-row__num" data-sp-ipf-comm="' + escapeHtml(en.ctx) +
          '"><span class="sp-ipf-row__lab">提成</span><span class="sp-ipf-row__v">¥' +
          money(p.commission) + '</span>' + editIc + '</button></div>'
        );
      }).join('');
    }
    openMask('spItemPerfMask');
  }
  function closeItemPerfSheet() { closeMask('spItemPerfMask'); }
  function openBarKeypad(ctxRaw, field) {
    var ctx = parseSlotCtx(ctxRaw);
    var p = personFromCtx(ctx);
    if (!p) return;
    ui.perfKeypadTarget = { ctx: ctxRaw, field: field || 'achievement' };
    ui.perfEditId = null;
    var val = field === 'commission' ? (p.commissionFixed != null ? p.commissionFixed : p.commission) : p.achievement;
    ui.perfKeypadBuf = money(val);
    ui.perfKeypadReplace = true;
    var head = $('#spPerfKeypadMask .sp-sheet__head');
    if (head) {
      head.childNodes[0].textContent = field === 'commission' ? '修改提成' : '修改业绩';
    }
    renderPerfKeypadGrid();
    syncPerfKeypadDisplay();
    openMask('spPerfKeypadMask');
  }
  function applyBarPctFromAchievement(ctx, achievement) {
    var p = personFromCtx(ctx);
    var it = itemFromCtx(ctx);
    if (!p) return;
    var base = itemAmount(it);
    p.active = true;
    p.achievement = Math.max(0, Math.min(99999, achievement));
    p.pct = base > 0 ? Math.max(0, Math.min(100, Math.round((p.achievement / base) * 100))) : 0;
    if (p.commissionFixed == null || p.commissionFixed === '') {
      p.commission = Math.round(p.achievement * COMMISSION_RATE * 100) / 100;
    }
  }
  function setBarPct(ctxRaw, pct) {
    var ctx = parseSlotCtx(ctxRaw);
    var p = personFromCtx(ctx);
    var it = itemFromCtx(ctx);
    var assign = getAssignByCtx(ctx);
    if (!p) return;
    p.active = true;
    assignNextTint(assign, p, tintScopeOf(ctx.station));
    var base = itemAmount(it);
    var ach = roundHalf(base * Math.max(0, Math.min(100, Number(pct) || 0)) / 100);
    p.achievement = ach;
    p.pct = base > 0 ? Math.max(0, Math.min(100, (ach / base) * 100)) : 0;
    if (p.commissionFixed == null || p.commissionFixed === '') {
      p.commission = Math.round(p.achievement * COMMISSION_RATE * 100) / 100;
    }
  }
  function setBarAchievement(ctxRaw, ach) {
    var ctx = parseSlotCtx(ctxRaw);
    var p = personFromCtx(ctx);
    var it = itemFromCtx(ctx);
    var assign = getAssignByCtx(ctx);
    if (!p) return;
    p.active = true;
    assignNextTint(assign, p, tintScopeOf(ctx.station));
    var base = itemAmount(it);
    p.achievement = roundHalf(Math.max(0, Math.min(base || 99999, ach)));
    p.pct = base > 0 ? Math.max(0, Math.min(100, (p.achievement / base) * 100)) : 0;
    if (p.commissionFixed == null || p.commissionFixed === '') {
      p.commission = Math.round(p.achievement * COMMISSION_RATE * 100) / 100;
    }
  }
  /** 就地刷新「业绩提成」概览卡（条内变动时调用，避免整页重绘/跳滚动） */
  function syncPerfOverviewCard() {
    var scroll = $('#s17Scroll');
    if (!scroll) return;
    var card = scroll.querySelector('.spf-card--perf');
    if (!card || !card.parentNode) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = perfOverviewCardHtml();
    var next = wrap.firstElementChild;
    if (next) card.parentNode.replaceChild(next, card);
  }
  function paintBarDom(track, p, opts) {
    if (!track || !p) return;
    opts = opts || {};
    var fill = track.querySelector('.spf-ibar__fill');
    var pctEl = track.querySelector('.spf-ibar__pct');
    var xBtn = track.querySelector('.spf-ibar__x');
    var dkBtn = track.querySelector('.spf-ibar__dk');
    var nm = track.querySelector('.spf-ibar__nm');
    var bubble = track.querySelector('.spf-ibar__bubble');
    var handle = track.querySelector('.spf-ibar__handle');
    var root = track.closest('.spf-ibar');
    var pct = Number(p.pct) || 0;
    var tint = barTintOf(p);
    var ctxRaw = track.getAttribute('data-sp-ibar-track') || '';
    if (root) {
      root.classList.toggle('is-on', !!p.active);
      root.classList.toggle('is-dk', !!p.dianke);
      root.style.setProperty('--ibar-color', tint.fill);
      root.style.setProperty('--ibar-pct-color', tint.pct);
    }
    if (fill) {
      fill.style.width = (p.active ? pct : 0) + '%';
      fill.style.background = tint.fill;
    }
    if (nm) nm.textContent = p.name || '';
    if (p.active) {
      if (!handle && fill) {
        handle = document.createElement('span');
        handle.className = 'spf-ibar__handle';
        handle.setAttribute('data-sp-ibar-handle', '');
        handle.setAttribute('aria-hidden', 'true');
        fill.appendChild(handle);
      }
      if (!dkBtn) {
        dkBtn = document.createElement('button');
        dkBtn.type = 'button';
        dkBtn.className = 'spf-ibar__dk';
        dkBtn.setAttribute('data-sp-ibar-dk', ctxRaw);
        dkBtn.setAttribute('aria-label', '点客');
        dkBtn.innerHTML = '<span class="spf-ibar__dk-lab">点客</span>';
        track.appendChild(dkBtn);
      }
      dkBtn.hidden = false;
      dkBtn.classList.toggle('is-on', !!p.dianke);
      if (!pctEl) {
        pctEl = document.createElement('span');
        pctEl.className = 'spf-ibar__pct';
        track.appendChild(pctEl);
      }
      pctEl.hidden = false;
      pctEl.textContent = Math.round(pct) + '%';
      pctEl.style.left = pctLabelLeft(pct) + '%';
      if (!xBtn) {
        xBtn = document.createElement('button');
        xBtn.type = 'button';
        xBtn.className = 'spf-ibar__x';
        xBtn.setAttribute('data-sp-ibar-clear', ctxRaw);
        xBtn.setAttribute('aria-label', '清除');
        xBtn.textContent = '×';
        track.appendChild(xBtn);
      }
      xBtn.hidden = false;
      if (!bubble) {
        bubble = document.createElement('div');
        bubble.className = 'spf-ibar__bubble';
        bubble.hidden = true;
        track.appendChild(bubble);
      }
      if (opts.showBubble) {
        bubble.hidden = false;
        bubble.textContent = '业绩 ' + moneyTrim(p.achievement || 0);
        bubble.style.left = Math.max(0, Math.min(100, pct)) + '%';
      } else {
        bubble.hidden = true;
      }
    } else {
      if (pctEl) pctEl.hidden = true;
      if (xBtn) xBtn.hidden = true;
      if (dkBtn) dkBtn.hidden = true;
      if (handle) handle.remove();
      if (bubble) bubble.hidden = true;
    }
    syncPerfOverviewCard();
  }

  function onS17Click(e) {
    var card = e.target.closest('[data-sp-item-card]');
    if (card && !e.target.closest('[data-sp-del]') && !e.target.closest('[data-sp-item-sheet]')) {
      ui.focusItemIdx = Number(card.getAttribute('data-sp-item-card')) || 0;
    }
    if (e.target.closest('[data-sp-restore-guest]')) {
      e.stopPropagation();
      restoreGuestOrder();
      return;
    }
    if (e.target.closest('[data-sp-pick-member]')) {
      openMemberSheet();
      return;
    }
    if (e.target.closest('[data-sp-ibar-more]')) {
      var foldKey = e.target.closest('[data-sp-ibar-more]').getAttribute('data-sp-ibar-more') || '';
      ui.ibarFoldOpen = ui.ibarFoldOpen || {};
      ui.ibarFoldOpen[foldKey] = !ui.ibarFoldOpen[foldKey];
      paintS17();
      return;
    }
    if (e.target.closest('[data-sp-member-card]') && !e.target.closest('[data-sp-restore-guest]')) {
      /* 会员卡整卡 → 会员详情（原型用 toast 示意） */
      toast('会员详情');
      return;
    }
    if (e.target.closest('[data-sp-guest-av]')) {
      ui.guestGender = ui.guestGender === 'female' ? 'male' : 'female';
      var slipG = getSlip(ui.currentId);
      if (slipG && !slipG.isMember) {
        slipG.guestGender = ui.guestGender;
        slipG.customerName = guestDisplayName(ui.guestGender);
        slipG.avatar = '';
      }
      paintS17();
      return;
    }
    var sheetBtn = e.target.closest('[data-sp-item-sheet]');
    if (sheetBtn) {
      openItemPerfSheet(Number(sheetBtn.getAttribute('data-sp-item-sheet')) || 0);
      return;
    }
    var slotBtn = e.target.closest('[data-sp-slot]');
    if (slotBtn) {
      openPickStaff(slotBtn.getAttribute('data-sp-slot'));
      return;
    }
    var dk = e.target.closest('[data-sp-ibar-dk]');
    if (dk) {
      e.stopPropagation();
      var ctxDk = parseSlotCtx(dk.getAttribute('data-sp-ibar-dk'));
      var pDk = personFromCtx(ctxDk);
      if (pDk) {
        pDk.dianke = !pDk.dianke;
        dk.classList.toggle('is-on', !!pDk.dianke);
      }
      return;
    }
    var clearBar = e.target.closest('[data-sp-ibar-clear]');
    if (clearBar) {
      e.preventDefault();
      e.stopPropagation();
      clearSlot(clearBar.getAttribute('data-sp-ibar-clear'));
      return;
    }
    /* 数值条点击选中 / 点客切换由 pointer 手势处理，避免与拖动冲突 */
    if (e.target.closest('[data-sp-add]')) {
      openPriceSheet();
      return;
    }
    var del = e.target.closest('[data-sp-del]');
    if (del) {
      var idx = Number(del.getAttribute('data-sp-del'));
      if (!isNaN(idx)) {
        ui.editItems.splice(idx, 1);
        if (ui.focusItemIdx >= ui.editItems.length) ui.focusItemIdx = Math.max(0, ui.editItems.length - 1);
        ui.perfStaffKey = '';
        paintS17();
      }
    }
  }

  function ensureFloorChrome() {
    /* 圆点挂在卡流尾部 .vh-sp-tail；由 renderHomeStrip 注入 */
    return $('#spFloorDots');
  }

  function floorVisualPull(raw) {
    var p = Math.max(0, raw);
    if (p <= FLOOR_THRESHOLD) return p;
    return FLOOR_THRESHOLD + (p - FLOOR_THRESHOLD) * 0.32;
  }

  function clearFloorInline(el) {
    if (!el) return;
    el.style.transition = '';
    el.style.transform = '';
    el.style.opacity = '';
    el.style.zIndex = '';
    el.style.display = '';
    el.classList.remove('is-floor-peek');
  }

  function syncEndDotsOnly() {
    syncFloorEndChrome();
  }
  function syncFloorEndChrome() {
    var host = $('#spHomeStripHost');
    if (!host) return;
    var at = host.scrollLeft >= Math.max(0, host.scrollWidth - host.clientWidth) - 18;
    host.classList.toggle('is-at-end', at);
    host.classList.toggle('is-floor-hint', ui.floorMode === 'hint');
    if (ui.floorMode === 'hint') {
      var hint = $('#spFloorHint');
      if (hint) {
        hint.classList.toggle('is-on', at);
        if (!host.classList.contains('is-pulling')) {
          setFloorHintLab(hint, '继续滑动查看更多');
          hint.classList.remove('is-armed');
          syncHintTailArmed(false);
        }
      }
      return;
    }
    var dots = $('#spFloorDots');
    if (!dots) return;
    dots.classList.toggle('is-on', at);
    dots.classList.remove('is-split', 'is-armed');
    dots.style.setProperty('--sp-dot-spread', '0px');
    dots.style.removeProperty('--sp-floor-t');
  }

  function clearFloorStyles() {
    var frame = document.getElementById('frame');
    var s0 = $('#s0');
    var s16 = $('#s16');
    var dots = $('#spFloorDots');
    if (frame) frame.classList.remove('is-floor-dragging');
    clearFloorInline(s0);
    clearFloorInline(s16);
    if (dots) {
      dots.classList.remove('is-split', 'is-armed');
      dots.style.setProperty('--sp-dot-spread', '0px');
      dots.style.removeProperty('--sp-floor-t');
    }
    /* 若仍在卡流尽头，保留 1 点提示；否则隐藏 */
    syncEndDotsOnly();
  }

  /** dir: 'to-list' | 'to-home'；progress 为跟手像素（逻辑拉力） */
  function applyFloorPull(rawPull, dir) {
    ensureFloorChrome();
    var frame = document.getElementById('frame');
    var s0 = $('#s0');
    var s16 = $('#s16');
    var dots = $('#spFloorDots');
    var raw = Math.max(0, rawPull);
    var visual = floorVisualPull(raw);
    var t = Math.min(1, raw / FLOOR_THRESHOLD);
    /* 约 35% 起才开始分裂，拉满才完全散开，过程更可读 */
    var splitT = Math.max(0, (t - 0.35) / 0.65);
    var spread = splitT * 12;

    if (frame) frame.classList.toggle('is-floor-dragging', raw > 0);
    if (!raw) {
      clearFloorStyles();
      return;
    }

    if (dir === 'to-list') {
      if (s0) {
        s0.classList.add('is-floor-peek');
        s0.style.display = 'block';
        s0.style.transition = 'none';
        s0.style.transform = 'translateX(' + (-visual) + 'px)';
        s0.style.opacity = '1';
        s0.style.zIndex = '4';
      }
      if (s16) {
        s16.classList.add('is-floor-peek');
        s16.style.display = 'block';
        s16.style.transition = 'none';
        s16.style.transform = 'translateX(' + (FLOOR_FRAME_W - visual) + 'px)';
        s16.style.opacity = String(Math.min(1, t * 1.05));
        s16.style.zIndex = '5';
      }
    } else {
      if (s16) {
        s16.classList.add('is-floor-peek');
        s16.style.display = 'block';
        s16.style.transition = 'none';
        s16.style.transform = 'translateX(' + visual + 'px)';
        s16.style.opacity = String(Math.max(0.15, 1 - t * 0.85));
        s16.style.zIndex = '5';
      }
      if (s0) {
        s0.classList.add('is-floor-peek');
        s0.style.display = 'block';
        s0.style.transition = 'none';
        s0.style.transform = 'translateX(' + (-FLOOR_FRAME_W + visual) + 'px)';
        s0.style.opacity = String(Math.min(1, t * 1.05));
        s0.style.zIndex = '4';
      }
    }

    if (dots) {
      dots.classList.add('is-on');
      dots.classList.toggle('is-split', splitT > 0.02);
      dots.classList.toggle('is-armed', t >= 1);
      dots.style.setProperty('--sp-floor-t', String(t));
      dots.style.setProperty('--sp-dot-spread', spread.toFixed(2) + 'px');
    }
  }

  function animateFloorSettle(dir, rawPull, onDone) {
    var s0 = $('#s0');
    var s16 = $('#s16');
    var dots = $('#spFloorDots');
    var visual = floorVisualPull(rawPull);
    var enter = dir === 'to-list';

    if (dots) dots.classList.remove('is-on', 'is-split', 'is-armed');

    function prep(el, tx, op) {
      if (!el) return;
      el.classList.add('is-floor-peek');
      el.style.display = 'block';
      el.style.transition = 'none';
      el.style.transform = 'translateX(' + tx + 'px)';
      el.style.opacity = String(op);
      void el.offsetWidth;
      el.style.transition =
        'transform ' + (FLOOR_MS / 1000) + 's ' + FLOOR_EASE +
        ', opacity ' + (FLOOR_MS / 1000) + 's ' + FLOOR_EASE;
    }

    if (enter) {
      prep(s0, -visual, 1);
      prep(s16, FLOOR_FRAME_W - visual, Math.min(1, rawPull / FLOOR_THRESHOLD));
      requestAnimationFrame(function () {
        if (s0) {
          s0.style.transform = 'translateX(' + (-FLOOR_FRAME_W) + 'px)';
          s0.style.opacity = '0.35';
        }
        if (s16) {
          s16.style.transform = 'translateX(0)';
          s16.style.opacity = '1';
        }
      });
    } else {
      prep(s16, visual, Math.max(0.15, 1 - rawPull / FLOOR_THRESHOLD));
      prep(s0, -FLOOR_FRAME_W + visual, Math.min(1, rawPull / FLOOR_THRESHOLD));
      requestAnimationFrame(function () {
        if (s16) {
          s16.style.transform = 'translateX(' + FLOOR_FRAME_W + 'px)';
          s16.style.opacity = '0';
        }
        if (s0) {
          s0.style.transform = 'translateX(0)';
          s0.style.opacity = '1';
        }
      });
    }

    setTimeout(function () {
      clearFloorStyles();
      if (onDone) onDone();
    }, FLOOR_MS + 20);
  }

  function animateFloorCancel(dir, rawPull, onDone) {
    var s0 = $('#s0');
    var s16 = $('#s16');
    var dots = $('#spFloorDots');
    var visual = floorVisualPull(rawPull);
    if (dots) dots.classList.remove('is-on', 'is-split', 'is-armed');

    function prep(el, tx, op) {
      if (!el) return;
      el.classList.add('is-floor-peek');
      el.style.display = 'block';
      el.style.transition = 'none';
      el.style.transform = 'translateX(' + tx + 'px)';
      el.style.opacity = String(op);
      void el.offsetWidth;
      el.style.transition =
        'transform .3s ' + FLOOR_EASE + ', opacity .3s ' + FLOOR_EASE;
    }

    if (dir === 'to-list') {
      prep(s0, -visual, 1);
      prep(s16, FLOOR_FRAME_W - visual, Math.min(1, rawPull / FLOOR_THRESHOLD));
      requestAnimationFrame(function () {
        if (s0) { s0.style.transform = 'translateX(0)'; s0.style.opacity = '1'; }
        if (s16) { s16.style.transform = 'translateX(' + FLOOR_FRAME_W + 'px)'; s16.style.opacity = '0'; }
      });
    } else {
      prep(s16, visual, 1);
      prep(s0, -FLOOR_FRAME_W + visual, Math.min(1, rawPull / FLOOR_THRESHOLD));
      requestAnimationFrame(function () {
        if (s16) { s16.style.transform = 'translateX(0)'; s16.style.opacity = '1'; }
        if (s0) { s0.style.transform = 'translateX(' + (-FLOOR_FRAME_W) + 'px)'; s0.style.opacity = '0'; }
      });
    }

    setTimeout(function () {
      clearFloorStyles();
      if (onDone) onDone();
    }, 320);
  }

  function bindHomeStripPull(host) {
    if (!host || host._spPullBound) return;
    host._spPullBound = true;
    ensureFloorChrome();

    var pull = 0;
    var tracking = false;
    var engaged = false;
    var startX = 0;
    var pointerId = null;
    var locking = false;
    var watch = 0;

    function getStrip() {
      return $('#spHomeStrip', host) || $('#spHomeStrip');
    }
    function maxScroll() {
      return Math.max(0, host.scrollWidth - host.clientWidth);
    }
    function atEnd(pad) {
      return host.scrollLeft >= maxScroll() - (pad == null ? 18 : pad);
    }
    function lastCardReached() {
      var cards = host.querySelectorAll('.sp-ticket[data-sp-id]');
      if (!cards.length) return false;
      var last = cards[cards.length - 1];
      var hr = host.getBoundingClientRect();
      var cr = last.getBoundingClientRect();
      return cr.right <= hr.right + 28;
    }
    function canStartFloor() {
      return atEnd(24) || lastCardReached();
    }
    function hasCards() {
      var strip = getStrip();
      return !!(strip && !strip.querySelector('.vh-sp-empty') && strip.querySelector('[data-sp-id]'));
    }
    function armWatch() {
      clearTimeout(watch);
      watch = setTimeout(function () {
        if (!locking) return;
        locking = false;
        engaged = false;
        tracking = false;
        pull = 0;
        host.classList.remove('is-pulling', 'is-armed', 'is-at-end');
        clearFloorStyles();
      }, 900);
    }
    function disarmWatch() { clearTimeout(watch); }
    function setPull(px) {
      pull = Math.max(0, px);
      host.classList.toggle('is-at-end', true);
      host.classList.toggle('is-pulling', pull > 0);
      host.classList.toggle('is-armed', pull >= FLOOR_THRESHOLD);
      if (ui.floorMode === 'hint') {
        /* 文案版：无整页跟手预览；达阈值同帧切文案并拉宽尾区 */
        var hint = $('#spFloorHint');
        if (hint) {
          hint.classList.add('is-on');
          var armed = pull >= FLOOR_THRESHOLD;
          hint.classList.toggle('is-armed', armed);
          syncHintTailArmed(armed);
          setFloorHintLab(hint, armed ? '释放查看全部' : '继续滑动查看更多');
        }
        return;
      }
      applyFloorPull(pull, 'to-list');
    }
    function finishGesture() {
      if (!tracking && !engaged) return;
      tracking = false;
      pointerId = null;
      if (!engaged) {
        pull = 0;
        return;
      }
      engaged = false;
      if (locking) return;
      var last = pull;
      var shouldGo = last >= FLOOR_THRESHOLD;
      locking = true;
      armWatch();
      host.classList.remove('is-pulling', 'is-armed');
      if (shouldGo) {
        /* 文案版松手前无跟手：从 0 吸满进列表；圆点版从当前拉距吸满 */
        var settleFrom = ui.floorMode === 'hint' ? 0 : last;
        animateFloorSettle('to-list', settleFrom, function () {
          pull = 0;
          locking = false;
          disarmWatch();
          clearFloorStyles();
          go('s16');
        });
      } else if (last > 0) {
        if (ui.floorMode === 'hint') {
          pull = 0;
          locking = false;
          disarmWatch();
          clearFloorStyles();
          syncFloorEndChrome();
        } else {
          animateFloorCancel('to-list', last, function () {
            pull = 0;
            locking = false;
            disarmWatch();
            clearFloorStyles();
            host.classList.toggle('is-at-end', atEnd(18));
          });
        }
      } else {
        pull = 0;
        locking = false;
        disarmWatch();
        clearFloorStyles();
        if (ui.floorMode === 'hint') syncFloorEndChrome();
      }
    }
    /** 仅在已到尽头后继续左拖才接管；普通点击不 preventDefault、不 capture */
    function onMoveClient(clientX, e) {
      if (!tracking || locking) return;
      var dx = clientX - startX;
      if (!engaged) {
        if (canStartFloor() && dx < -10) {
          engaged = true;
          startX = clientX;
          dx = 0;
          if (e.pointerId != null && e.pointerType === 'mouse') {
            try { host.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
          }
        } else {
          return;
        }
      }
      if (e.cancelable) e.preventDefault();
      setPull(Math.max(0, -(clientX - startX)));
      /* 文案版达阈值拉宽尾区后需再钉到新尽头，避免末卡相对文案位移 */
      host.scrollLeft = maxScroll();
    }

    host.addEventListener('scroll', function () {
      if (pull > 0 || locking || engaged) return;
      syncEndDotsOnly();
    }, { passive: true });

    host.addEventListener('pointerdown', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      if (locking) return;
      if (e.button !== 0) return;
      if (!hasCards()) return;
      tracking = true;
      engaged = false;
      pull = 0;
      startX = e.clientX;
      pointerId = e.pointerId;
    });
    host.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      if (pointerId != null && e.pointerId !== pointerId) return;
      onMoveClient(e.clientX, e);
    }, { passive: false });
    host.addEventListener('pointerup', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      if (pointerId != null && e.pointerId !== pointerId) return;
      finishGesture();
    });
    host.addEventListener('pointercancel', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      finishGesture();
    });

    host.addEventListener('touchstart', function (e) {
      if (locking || !hasCards() || !e.touches || !e.touches[0]) return;
      tracking = true;
      engaged = false;
      pull = 0;
      startX = e.touches[0].clientX;
      pointerId = null;
    }, { passive: true });
    host.addEventListener('touchmove', function (e) {
      if (!tracking || locking || !e.touches || !e.touches[0]) return;
      onMoveClient(e.touches[0].clientX, e);
    }, { passive: false });
    host.addEventListener('touchend', function () { finishGesture(); });
    host.addEventListener('touchcancel', function () { finishGesture(); });

    host.addEventListener('wheel', function (e) {
      if (locking || !hasCards()) return;
      var dx = e.deltaX || 0;
      var dy = e.deltaY || 0;
      var delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (!canStartFloor() && pull <= 0) return;
      if (e.cancelable) e.preventDefault();
      setPull(Math.max(0, pull + delta));
      host.scrollLeft = maxScroll();
      engaged = pull > 0;
      clearTimeout(host._spWheelTimer);
      host._spWheelTimer = setTimeout(function () {
        if (!engaged && pull <= 0) return;
        tracking = true;
        finishGesture();
      }, 140);
    }, { passive: false });
  }

  /** s16 左缘右滑回首页（对称二楼） */
  function bindS16EdgeBack() {
    var s16 = $('#s16');
    if (!s16 || s16._spEdgeBound) return;
    s16._spEdgeBound = true;
    ensureFloorChrome();

    var pull = 0;
    var tracking = false;
    var armed = false;
    var startX = 0;
    var pointerId = null;
    var locking = false;
    var EDGE = 28;

    function onDown(e) {
      if (locking) return;
      if (!s16.classList.contains('active')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      /* 不拦截标题栏返回按钮（须始终 go('s0')） */
      if (e.target && e.target.closest && e.target.closest('.btn-back, .nav-bar')) return;
      var rect = s16.getBoundingClientRect();
      var localX = e.clientX - rect.left;
      if (localX > EDGE) return;
      tracking = true;
      armed = false;
      pull = 0;
      startX = e.clientX;
      pointerId = e.pointerId;
      try { s16.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }
    function onMove(e) {
      if (!tracking || locking || (pointerId != null && e.pointerId !== pointerId)) return;
      var dx = e.clientX - startX;
      if (!armed) {
        if (dx > 8) armed = true;
        else return;
      }
      if (e.cancelable) e.preventDefault();
      pull = Math.max(0, dx);
      applyFloorPull(pull, 'to-home');
    }
    function onUp(e) {
      if (!tracking || (pointerId != null && e.pointerId !== pointerId)) return;
      tracking = false;
      pointerId = null;
      if (locking) return;
      var last = pull;
      pull = 0;
      if (last >= FLOOR_THRESHOLD) {
        locking = true;
        animateFloorSettle('to-home', last, function () {
          locking = false;
          goBack();
          setTimeout(function () {
            renderHomeStrip();
            resetHomeStripScroll();
          }, 0);
        });
      } else if (last > 0) {
        locking = true;
        animateFloorCancel('to-home', last, function () {
          locking = false;
        });
      } else {
        clearFloorStyles();
      }
    }
    s16.addEventListener('pointerdown', onDown);
    s16.addEventListener('pointermove', onMove, { passive: false });
    s16.addEventListener('pointerup', onUp);
    s16.addEventListener('pointercancel', onUp);
  }

  function bind() {
    var stripHost = $('#spHomeStripHost') || $('#spHomeStrip');
    if (stripHost) {
      stripHost.addEventListener('click', function (e) {
        if (e.target.closest('[data-sp-member-link]')) {
          e.stopPropagation();
          toast('会员详情');
          return;
        }
        var card = e.target.closest('[data-sp-id]');
        if (card) openComplete(card.getAttribute('data-sp-id'));
      });
      bindHomeStripPull(stripHost);
    }
    bindS16EdgeBack();
    var grid = $('#spGridWrap');
    if (grid) {
      grid.addEventListener('click', function (e) {
        if (e.target.closest('[data-sp-member-link]')) {
          e.stopPropagation();
          toast('会员详情');
          return;
        }
        var card = e.target.closest('[data-sp-id]');
        if (card) openComplete(card.getAttribute('data-sp-id'));
      });
    }
    var s17 = $('#s17');
    if (s17) {
      s17.addEventListener('click', onS17Click);
      s17.addEventListener('pointerdown', function (e) {
        var track = e.target.closest('[data-sp-ibar-track]');
        if (!track) return;
        if (e.target.closest('[data-sp-ibar-dk]') || e.target.closest('[data-sp-ibar-clear]') ||
            e.target.closest('.spf-ibar__x') || e.target.closest('[data-sp-ibar-more]')) return;
        var ctxRaw = track.getAttribute('data-sp-ibar-track');
        var ctx = parseSlotCtx(ctxRaw);
        var p = personFromCtx(ctx);
        var it = itemFromCtx(ctx);
        var assign = getAssignByCtx(ctx);
        if (!p) return;
        var wasActive = !!p.active;
        var useHandle = !!e.target.closest('[data-sp-ibar-handle]');
        if (!wasActive) {
          activatePerson(p, ctx.station === 'avg' ? 'senior' : ctx.station, it, assign);
          paintBarDom(track, p);
        }
        var startX = e.clientX;
        var startPct = Number(p.pct) || 0;
        var moved = false;
        ui.dragBar = {
          ctx: ctxRaw, pointerId: e.pointerId, track: track,
          startX: startX, startPct: startPct,
          wasActiveAtDown: wasActive, useHandle: useHandle
        };
        try { track.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        function onMove(ev) {
          if (!ui.dragBar || ev.pointerId !== ui.dragBar.pointerId) return;
          if (ev.cancelable) ev.preventDefault();
          var rect = track.getBoundingClientRect();
          var dx = ev.clientX - ui.dragBar.startX;
          if (!moved && Math.abs(dx) < 3) return;
          moved = true;
          var next;
          if (ui.dragBar.useHandle) {
            var x = ev.clientX - rect.left;
            next = Math.max(0, Math.min(100, (x / Math.max(1, rect.width)) * 100));
          } else {
            var padL = 28;
            var padR = 28;
            var usable = Math.max(1, rect.width - padL - padR);
            next = Math.max(0, Math.min(100, ui.dragBar.startPct + (dx / usable) * 100));
          }
          setBarPct(ui.dragBar.ctx, next);
          paintBarDom(
            ui.dragBar.track,
            personFromCtx(parseSlotCtx(ui.dragBar.ctx)),
            { showBubble: true }
          );
        }
        function onUp(ev) {
          if (!ui.dragBar || ev.pointerId !== ui.dragBar.pointerId) return;
          var drag = ui.dragBar;
          ui.dragBar = null;
          track.removeEventListener('pointermove', onMove);
          track.removeEventListener('pointerup', onUp);
          track.removeEventListener('pointercancel', onUp);
          var pUp = personFromCtx(parseSlotCtx(drag.ctx));
          if (!moved && drag.wasActiveAtDown && pUp) {
            pUp.dianke = !pUp.dianke;
            paintBarDom(drag.track, pUp);
          } else if (pUp) {
            paintBarDom(drag.track, pUp, { showBubble: false });
          }
        }
        track.addEventListener('pointermove', onMove);
        track.addEventListener('pointerup', onUp);
        track.addEventListener('pointercancel', onUp);
      });
    }
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
        openHelp(e.target.closest('[data-sp-help]').getAttribute('data-sp-help') || 'suggest');
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
      if (e.target.closest('#spPickStaffCancel')) {
        closePickStaff();
        return;
      }
      if (e.target.closest('#spPickStaffOk')) {
        confirmPickStaff();
        return;
      }
      var pickDk = e.target.closest('[data-sp-pick-dk-toggle]');
      if (pickDk && $('#spPickStaffMask') && $('#spPickStaffMask').classList.contains('show')) {
        e.stopPropagation();
        togglePickDraftDianke(pickDk.getAttribute('data-sp-pick-dk-toggle'));
        return;
      }
      var pickChk = e.target.closest('[data-sp-pick-check]');
      if (pickChk && $('#spPickStaffMask') && $('#spPickStaffMask').classList.contains('show')) {
        togglePickDraftCheck(pickChk.getAttribute('data-sp-pick-check'));
        return;
      }
      var pickRow = e.target.closest('[data-sp-pick-row]');
      if (pickRow && $('#spPickStaffMask') && $('#spPickStaffMask').classList.contains('show') &&
          !e.target.closest('[data-sp-pick-dk-toggle]')) {
        togglePickDraftCheck(pickRow.getAttribute('data-sp-pick-row'));
        return;
      }
      var mem = e.target.closest('[data-sp-bind-member]');
      if (mem && $('#spMemberMask') && $('#spMemberMask').classList.contains('show')) {
        bindMember(mem.getAttribute('data-sp-bind-member'));
        return;
      }
      if (e.target.closest('#spMemberClose')) { closeMemberSheet(); return; }
      if (e.target.closest('#spItemPerfClose') || e.target.closest('[data-sp-ipf-empty-ok]')) {
        closeItemPerfSheet();
        return;
      }
      var ipfAch = e.target.closest('[data-sp-ipf-ach]');
      if (ipfAch) {
        openBarKeypad(ipfAch.getAttribute('data-sp-ipf-ach'), 'achievement');
        return;
      }
      var ipfComm = e.target.closest('[data-sp-ipf-comm]');
      if (ipfComm) {
        openBarKeypad(ipfComm.getAttribute('data-sp-ipf-comm'), 'commission');
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
        clearFloorStyles();
        _go.apply(this, arguments);
        setTimeout(function () { syncAllocNav(); syncFloorNav(); }, 0);
        if (id === 's0') {
          setTimeout(function () {
            renderHomeStrip();
            resetHomeStripScroll();
          }, 0);
        }
        if (id === 's16') setTimeout(function () { ui.tab = 'pending'; renderList(); }, 0);
        if (id === 's17' && ui.currentId) setTimeout(paintS17, 0);
      };
      window.go._spHook = true;
    }
    if (window.goBack && !window.goBack._spHook) {
      var _back = window.goBack;
      window.goBack = function () {
        clearFloorStyles();
        var ret = _back.apply(this, arguments);
        setTimeout(function () {
          if ($('#s0') && $('#s0').classList.contains('active')) {
            renderHomeStrip();
            resetHomeStripScroll();
          }
        }, 0);
        return ret;
      };
      window.goBack._spHook = true;
    }
  }

  function init() {
    ensureFloorChrome();
    bind();
    syncAllocNav();
    syncFloorNav();
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
      closeMemberSheet: closeMemberSheet,
      closeItemPerfSheet: closeItemPerfSheet,
      setAllocMode: setAllocMode,
      setFloorMode: setFloorMode,
      openVoidConfirm: function () {},
      pendingCount: pendingCount,
      paintS17: paintS17,
      openPickStaff: openPickStaff
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
