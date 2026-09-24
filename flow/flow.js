'use strict';
window.__BILLING_EMBEDDED__ = true;
window.__FLOW_STANDALONE__ = true;
var AVATAR_MALE = 'assets/billing/avatar-male.png';
var AVATAR_FEMALE = 'assets/billing/avatar-female.png';
var AVATAR_GUEST = 'assets/billing/avatar-guest-default.png';
if (typeof window.showToast !== 'function') {
  window.showToast = function (msg) {
    var el = document.getElementById('billToastMsg');
    if (el) {
      el.textContent = msg;
      el.classList.remove('hidden');
      el.classList.add('show');
      clearTimeout(window.__billToastTimer);
      window.__billToastTimer = setTimeout(function () {
        el.classList.remove('show');
        el.classList.add('hidden');
      }, 1400);
      return;
    }
    if (typeof window.toast === 'function') window.toast(msg);
  };
}
if (typeof window.openWorkbench !== 'function') {
  window.openWorkbench = function () {
    if (window.BillingDemo && window.BillingDemo.openFlowList) window.BillingDemo.openFlowList();
  };
}
if (typeof window.closeAllFlowOverlays !== 'function') {
  window.closeAllFlowOverlays = function () {
    document.querySelectorAll('#flowModuleRoot .picker-mask.open, #flowModuleRoot .dialog-mask.open').forEach(function (el) {
      el.classList.remove('open');
    });
  };
}
if (typeof window.setFlowNavHighlight !== 'function') {
  window.setFlowNavHighlight = function (id) {
    document.querySelectorAll('.site-nav [data-flow]').forEach(function (btn) {
      btn.classList.toggle('on', btn.getAttribute('data-flow') === id);
    });
    document.querySelectorAll('.site-nav [data-target]').forEach(function (btn) {
      btn.classList.remove('on');
    });
  };
}
if (typeof window.wireAmountKeypadInputs !== 'function') {
  window.wireAmountKeypadInputs = function () {};
}

(function () {
  'use strict';

  const PROJECTS = [
    { id: 'p1', name: '时尚洗吹', category: '洗吹', price: 58, benefitKey: '时尚洗吹' },
    { id: 'p2', name: '精致剪发', category: '剪发', price: 98, benefitKey: '精致剪发' },
    { id: 'p3', name: '洗剪吹', category: '洗吹', price: 68, benefitKey: '洗剪吹' },
    { id: 'p4', name: '儿童剪发', category: '剪发', price: 48, benefitKey: '儿童剪发' },
    { id: 'p5', name: '女士造型', category: '造型', price: 128, benefitKey: '女士造型' },
    { id: 'p6', name: '染发', category: '烫染', price: 358, benefitKey: '染发' },
    { id: 'p7', name: '漂发', category: '烫染', price: 288, benefitKey: '漂发' },
    { id: 'p8', name: '烫发', category: '烫染', price: 398, benefitKey: '烫发' },
    { id: 'p9', name: '摩根烫', category: '烫染', price: 458, benefitKey: '摩根烫' },
    { id: 'p10', name: '电棒烫', category: '烫染', price: 428, benefitKey: '电棒烫' },
    { id: 'p11', name: '深层滋养', category: '护理', price: 198, benefitKey: '深层滋养' },
    { id: 'p12', name: '蛋白矫正', category: '护理', price: 598, benefitKey: '蛋白矫正' },
    { id: 'p13', name: '头疗', category: '护理', price: 138, benefitKey: '头疗' },
    { id: 'p14', name: '接发', category: '造型', price: 888, benefitKey: '接发' },
    { id: 'p15', name: '头皮护理', category: '护理', price: 168, benefitKey: '头皮护理' },
    { id: 'p16', name: '挑染', category: '烫染', price: 198, benefitKey: '挑染' },
    { id: 'p17', name: '时尚造型', category: '造型', price: 128, benefitKey: '时尚造型' },
    { id: 'p18', name: '暖色漂褪', category: '烫染', price: 328, benefitKey: '暖色漂褪' },
    { id: 'p19', name: '洗头', category: '洗吹', price: 28, benefitKey: '洗头' },
    { id: 'p20', name: '面部清洁护理', category: '美容', price: 168, benefitKey: '面部清洁护理' },
    { id: 'p21', name: '深层补水护理', category: '美容', price: 268, benefitKey: '深层补水护理' },
    { id: 'p22', name: '美白淡斑护理', category: '美容', price: 398, benefitKey: '美白淡斑护理' },
    { id: 'p23', name: '手部基础美甲', category: '美甲', price: 98, benefitKey: '手部基础美甲' },
    { id: 'p24', name: '猫眼甲油胶', category: '美甲', price: 158, benefitKey: '猫眼甲油胶' },
    { id: 'p25', name: '卸甲重做', category: '美甲', price: 68, benefitKey: '卸甲重做' },
    { id: 'p26', name: '开花嫁接睫毛', category: '美睫', price: 288, benefitKey: '开花嫁接睫毛' },
    { id: 'p27', name: '美睫补嫁', category: '美睫', price: 128, benefitKey: '美睫补嫁' },
  ];
  const PRODUCTS = [
    { id: 'pd1', name: '剑琅修护洗发水', spec: '500ml', category: '洗护', price: 128 },
    { id: 'pd2', name: '剑琅滋养护发素', spec: '500ml', category: '洗护', price: 98 },
    { id: 'pd3', name: '剑琅头皮护理精华', spec: '100ml', category: '护理', price: 168 },
    { id: 'pd4', name: '剑琅造型发蜡', spec: '80g', category: '造型', price: 88 },
    { id: 'pd5', name: '剑琅染发护色套装', spec: '', category: '烫染', price: 198 },
    { id: 'pd6', name: '剑琅免洗喷雾', spec: '150ml', category: '护理', price: 68 },
    { id: 'pd7', name: '剑琅儿童温和洗发水', spec: '300ml', category: '洗护', price: 78 },
    { id: 'pd8', name: '剑琅控油洗发水', spec: '400ml', category: '洗护', price: 118 },
    { id: 'pd9', name: '剑琅柔顺发膜', spec: '200ml', category: '护理', price: 148 },
    { id: 'pd10', name: '剑琅护发精油', spec: '50ml', category: '护理', price: 158 },
    { id: 'pd11', name: '剑琅哑光发泥', spec: '100g', category: '造型', price: 78 },
    { id: 'pd12', name: '剑琅定型喷雾', spec: '300ml', category: '造型', price: 88 },
    { id: 'pd13', name: '剑琅漂后修护乳', spec: '250ml', category: '烫染', price: 138 },
    { id: 'pd14', name: '剑琅护色洗发水', spec: '500ml', category: '烫染', price: 138 },
    { id: 'pd15', name: '剑琅儿童护发素', spec: '250ml', category: '洗护', price: 68 },
    { id: 'pd16', name: '剑琅头皮清洁泥', spec: '120g', category: '护理', price: 128 },
    { id: 'pd17', name: '剑琅旅行装洗护套', spec: '', category: '洗护', price: 88 },
    { id: 'pd18', name: '剑琅烫后还原霜', spec: '200ml', category: '烫染', price: 118 },
    { id: 'pd19', name: '剑琅玻尿酸精华液', spec: '30ml', category: '美容', price: 198 },
    { id: 'pd20', name: '剑琅补水面膜', spec: '5片', category: '美容', price: 88 },
    { id: 'pd21', name: '剑琅甲油胶套装', spec: '12色', category: '美甲', price: 168 },
    { id: 'pd22', name: '剑琅指缘护理油', spec: '15ml', category: '美甲', price: 58 },
    { id: 'pd23', name: '剑琅睫毛胶水', spec: '5ml', category: '美睫', price: 78 },
    { id: 'pd24', name: '剑琅美睫卸除液', spec: '50ml', category: '美睫', price: 48 },
  ];

  /* 与会员卡管理2浅色卡面视觉对齐（开单侧仍用旧 key） */
  const CARD_COLORS = {
    brand_red: 'linear-gradient(90deg, #F4EAE5 0%, #EED1C3 100%)',
    gold: 'linear-gradient(90deg, #F4EEE3 0%, #DFC9A1 100%)',
    blue: 'linear-gradient(90deg, #E9F0F3 0%, #C0DCE9 100%)',
    purple: 'linear-gradient(90deg, #F0EBF3 0%, #CFBCDA 100%)',
    teal: 'linear-gradient(90deg, #EDF2E9 0%, #B1CD9B 100%)',
  };
  /** 同步自 card/demo QUICK_TEMPLATES · 与价目分组对齐 */
  const CARD_TEMPLATES = [
    {
      id: 'demo_vip_combo', name: '尊享组合卡', price: 2000, giftAmount: 500, face: 2500,
      cardColor: 'brand_red', validity: '1年',
      benefits: { balance: true, timesOrValidity: true, products: true, projectDiscount: true },
      projects: ['时尚洗吹×8', '洗剪吹×10', '精致剪发×5+赠1', '时尚造型×2', '深层滋养×3', '头皮护理×2'],
      discounts: ['烫发 会员价', '染发 ¥299', '漂发 ¥238', '摩根烫 会员价', '电棒烫 ¥368', '挑染 会员价', '暖色漂褪 会员价'],
      memberPrices: typeof DEMO_TANG_GROUP_MEMBER_PRICES !== 'undefined' ? { ...DEMO_TANG_GROUP_MEMBER_PRICES } : {},
      projectItems: [
        { name: '时尚洗吹', purchaseQty: 8, giftQty: 0 },
        { name: '洗剪吹', purchaseQty: 10, giftQty: 0 },
        { name: '精致剪发', purchaseQty: 5, giftQty: 1 },
        { name: '时尚造型', purchaseQty: 2, giftQty: 0 },
        { name: '深层滋养', purchaseQty: 3, giftQty: 0 },
        { name: '头皮护理', purchaseQty: 2, giftQty: 0 },
      ],
      productItems: [
        { name: '剑琅修护洗发水', qty: 2 },
        { name: '剑琅哑光发泥', qty: 1 },
        { name: '剑琅护发精油', qty: 1 },
      ],
    },
    {
      id: 'demo_new_first', name: '新客首开卡', price: 300, giftAmount: 50, face: 350,
      cardColor: 'teal', validity: '1年',
      benefits: { balance: true, timesOrValidity: false, projectDiscount: false },
      projects: [], discounts: [],
    },
    {
      id: 'demo_old_renew', name: '老客续充卡', price: 1000, giftAmount: 200, face: 1200,
      cardColor: 'blue', validity: '1年',
      benefits: { balance: true, timesOrValidity: false, projectDiscount: true },
      projects: [], discounts: ['时尚洗吹 会员价', '洗剪吹 会员价', '洗头 会员价'],
      memberPrices: typeof DEMO_WASH_GROUP_MEMBER_PRICES !== 'undefined' ? { ...DEMO_WASH_GROUP_MEMBER_PRICES } : {},
    },
    {
      id: 'demo_perm_color_discount', name: '烫染会员价卡', price: 599, giftAmount: 0, face: 0,
      cardColor: 'purple', validity: '1年',
      benefits: { balance: false, timesOrValidity: false, projectDiscount: true },
      projects: [], discounts: ['烫发 会员价', '染发 ¥299', '漂发 ¥238', '摩根烫 会员价', '电棒烫 ¥368', '挑染 会员价', '暖色漂褪 会员价'],
      memberPrices: typeof DEMO_TANG_GROUP_MEMBER_PRICES !== 'undefined' ? { ...DEMO_TANG_GROUP_MEMBER_PRICES } : {},
    },
    {
      id: 'demo_retail_perm_color', name: '减值烫染卡', price: 599, giftAmount: 0, face: 0,
      cardColor: 'purple', validity: '1年',
      benefits: { balance: false, timesOrValidity: false, projectDiscount: true },
      projects: [], discounts: ['烫发 会员价', '染发 ¥299', '漂发 ¥238', '摩根烫 会员价', '电棒烫 ¥368', '挑染 会员价', '暖色漂褪 会员价'],
      memberPrices: typeof DEMO_TANG_GROUP_MEMBER_PRICES !== 'undefined' ? { ...DEMO_TANG_GROUP_MEMBER_PRICES } : {},
    },
    {
      id: 'demo_year_wash', name: '洗吹12次卡', price: 888, giftAmount: 0, face: 0,
      cardColor: 'gold', validity: '1年',
      benefits: { balance: false, timesOrValidity: true, projectDiscount: false },
      projects: ['时尚洗吹×12', '洗剪吹赠×2'], discounts: [],
      projectItems: [
        { name: '时尚洗吹', purchaseQty: 12, giftQty: 0 },
        { name: '洗剪吹', purchaseQty: 0, giftQty: 2 },
      ],
    },
    {
      id: 'demo_care_pack', name: '护理体验包', price: 598, giftAmount: 0, face: 0,
      cardColor: 'teal', validity: '1年',
      benefits: { balance: false, timesOrValidity: true, projectDiscount: false },
      projects: ['深层滋养×3', '头皮护理×2', '蛋白矫正×1'], discounts: [],
      projectItems: [
        { name: '深层滋养', purchaseQty: 3, giftQty: 0 },
        { name: '头皮护理', purchaseQty: 2, giftQty: 0 },
        { name: '蛋白矫正', purchaseQty: 1, giftQty: 0 },
      ],
    },
    {
      id: 'demo_unlimited_wash', name: '洗吹不限次卡', price: 1288, giftAmount: 0, face: 0,
      cardColor: 'blue', validity: '1年',
      benefits: { balance: false, timesOrValidity: true, projectDiscount: false },
      projects: ['时尚洗吹不限次', '洗剪吹不限次', '洗头不限次'], discounts: [],
      projectItems: [
        { name: '时尚洗吹', unlimited: true },
        { name: '洗剪吹', unlimited: true },
        { name: '洗头', unlimited: true },
      ],
    },
    {
      id: 'demo_shared_cut_pool', name: '剪发造型共计10次卡', price: 698, giftAmount: 0, face: 0,
      cardColor: 'brand_red', validity: '6个月',
      benefits: { balance: false, timesOrValidity: true, projectDiscount: false },
      projects: ['共计 · 精致剪发、儿童剪发、时尚造型×10'], discounts: [],
      projectItems: [
        { name: '精致剪发', purchaseQty: 10, qtyScope: 'shared', sharedGroupId: 'demo_shared_cut' },
        { name: '儿童剪发', purchaseQty: 10, qtyScope: 'shared', sharedGroupId: 'demo_shared_cut' },
        { name: '时尚造型', purchaseQty: 10, qtyScope: 'shared', sharedGroupId: 'demo_shared_cut' },
      ],
    },
    {
      id: 'demo_home_care_pack', name: '居家洗护包', price: 399, giftAmount: 0, face: 0,
      cardColor: 'gold', validity: '1年',
      benefits: { balance: false, timesOrValidity: false, products: true, projectDiscount: false },
      projects: [], discounts: [],
      productItems: [
        { name: '剑琅修护洗发水', qty: 1 },
        { name: '剑琅滋养护发素', qty: 1 },
        { name: '剑琅头皮护理精华', qty: 1 },
        { name: '剑琅柔顺发膜', qty: 1 },
      ],
    },
    {
      id: 'demo_kids_times', name: '儿童10次剪发', price: 498, giftAmount: 0, face: 0,
      cardColor: 'brand_red', validity: '6个月',
      benefits: { balance: false, timesOrValidity: true, projectDiscount: false },
      projects: ['儿童剪发×10'], discounts: [],
      projectItems: [{ name: '儿童剪发', purchaseQty: 10, giftQty: 0 }],
    },
    {
      id: 'demo_retail_policy', name: '减值策略演示卡', price: 498, giftAmount: 0, face: 0,
      cardColor: 'brand_red', validity: '6个月',
      benefits: { balance: false, timesOrValidity: true, projectDiscount: false },
      projects: ['儿童剪发×10'], discounts: [],
      projectItems: [{ name: '儿童剪发', purchaseQty: 10, giftQty: 0 }],
    },
    {
      id: 'demo_lifetime_balance', name: '永久储值卡', price: 1000, giftAmount: 100, face: 1100,
      cardColor: 'teal', validity: '永久有效',
      benefits: { balance: true, timesOrValidity: false, projectDiscount: false },
      projects: [], discounts: [],
    },
    {
      id: 'demo_editable', name: '可编辑演示卡', price: 500, giftAmount: 80, face: 580,
      cardColor: 'teal', validity: '1年',
      benefits: { balance: true, timesOrValidity: false, projectDiscount: false },
      projects: [], discounts: [],
    },
  ];

  const CUSTOMERS = [
    {
      id: 'm1', name: '张雨晴', phone: '138****8821', isMember: true, vip: true, totalSpend: 4680,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-female.png', cards: [
        { id: 'demo_new_first_m1', name: '新客首开卡', balance: 300, projects: [] },
        { id: 'demo_year_wash_m1', name: '洗吹12次卡', balance: 0, projects: [{ key: '时尚洗吹', label: '时尚洗吹', remain: 11 }, { key: '洗剪吹', label: '洗剪吹', remain: 2 }] },
      ],
    },
    {
      id: 'm2', name: '李诗涵', phone: '139****6612', isMember: true, vip: true, totalSpend: 8920,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-female.png', cards: [
        { id: 'demo_new_first_m2', name: '新客首开卡', balance: 170, projects: [] },
        { id: 'demo_lifetime_balance_m2', name: '永久储值卡', balance: 950, projects: [] },
      ],
    },
    {
      id: 'm3', name: '王思琪', phone: '136****9033', isMember: true, vip: true, totalSpend: 2150,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-female.png', cards: [
        { id: 'demo_new_first_m3', name: '新客首开卡', balance: 20, projects: [] },
        { id: 'demo_retail_policy_m3', name: '减值策略演示卡', balance: 0, projects: [{ key: '儿童剪发', label: '儿童剪发', remain: 9 }] },
      ],
    },
    {
      id: 'm4', name: '陈浩然', phone: '137****5520', isMember: true, vip: true, totalSpend: 12680,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-male.png', cards: [
        { id: 'demo_new_first_m4', name: '新客首开卡', balance: 300, projects: [] },
        { id: 'demo_retail_perm_color_m4', name: '减值烫染卡', balance: 0, discount: 0.85, projects: [] },
        { id: 'demo_retail_policy_m4', name: '减值策略演示卡', balance: 0, projects: [{ key: '儿童剪发', label: '儿童剪发', remain: 6 }] },
      ],
    },
    {
      id: 'm5', name: '赵欣怡', phone: '135****7788', isMember: true, vip: true, totalSpend: 5340,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-female.png', cards: [
        { id: 'demo_new_first_m5', name: '新客首开卡', balance: 350, projects: [] },
        { id: 'demo_year_wash_m5', name: '洗吹12次卡', balance: 0, projects: [{ key: '时尚洗吹', label: '时尚洗吹', remain: 8 }, { key: '洗剪吹', label: '洗剪吹', remain: 1 }] },
      ],
    },
    {
      id: 'm6', name: '刘子轩', phone: '133****1205', isMember: true, vip: false, totalSpend: 3200,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-male.png', cards: [
        { id: 'demo_old_renew_m6', name: '老客续充卡', balance: 1000, discount: 0.85, projects: [] },
      ],
    },
    {
      id: 'm7', name: '周婉清', phone: '132****3344', isMember: true, vip: false, totalSpend: 1880,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-female.png', cards: [
        { id: 'demo_old_renew_m7', name: '老客续充卡', balance: 600, discount: 0.85, projects: [] },
      ],
    },
    {
      id: 'm8', name: '吴佳宁', phone: '131****5566', isMember: true, vip: true, totalSpend: 7650,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-female.png', cards: [
        { id: 'demo_old_renew_m8', name: '老客续充卡', balance: 150, discount: 0.85, projects: [] },
        { id: 'demo_lifetime_balance_m8', name: '永久储值卡', balance: 480, projects: [] },
      ],
    },
    {
      id: 'm9', name: '郑一鸣', phone: '130****7789', isMember: true, vip: true, totalSpend: 9420,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-male.png', cards: [
        { id: 'demo_old_renew_m9', name: '老客续充卡', balance: 1000, discount: 0.85, projects: [] },
        { id: 'demo_retail_perm_color_m9', name: '减值烫染卡', balance: 0, discount: 0.85, projects: [] },
      ],
    },
    {
      id: 'm10', name: '孙梦洁', phone: '158****0012', isMember: true, vip: true, totalSpend: 6100,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-female.png', cards: [
        { id: 'demo_old_renew_m10', name: '老客续充卡', balance: 1200, discount: 0.85, projects: [] },
        { id: 'demo_year_wash_m10', name: '洗吹12次卡', balance: 0, projects: [{ key: '时尚洗吹', label: '时尚洗吹', remain: 3 }] },
      ],
    },
    {
      id: 'm11', name: '钱小姐', phone: '159****2233', isMember: true, vip: true, totalSpend: 28600,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-female.png', cards: [
        { id: 'demo_vip_combo_m11', name: '尊享组合卡', balance: 2300, discount: 0.85, projects: [{ key: '时尚洗吹', label: '时尚洗吹', remain: 8 }, { key: '洗剪吹', label: '洗剪吹', remain: 9 }, { key: '精致剪发', label: '精致剪发', remain: 6 }, { key: '时尚造型', label: '时尚造型', remain: 2 }, { key: '深层滋养', label: '深层滋养', remain: 3 }, { key: '头皮护理', label: '头皮护理', remain: 2 }] },
        { id: 'demo_kids_times_m11', name: '儿童10次剪发', balance: 0, projects: [{ key: '儿童剪发', label: '儿童剪发', remain: 9 }] },
        { id: 'demo_lifetime_balance_m11', name: '永久储值卡', balance: 50, projects: [] },
      ],
    },
    {
      id: 'm12', name: '冯启航', phone: '157****4455', isMember: true, vip: true, totalSpend: 22140,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-male.png', cards: [
        { id: 'demo_vip_combo_m12', name: '尊享组合卡', balance: 1600, discount: 0.85, projects: [{ key: '时尚洗吹', label: '时尚洗吹', remain: 8 }, { key: '洗剪吹', label: '洗剪吹', remain: 7 }, { key: '精致剪发', label: '精致剪发', remain: 6 }, { key: '时尚造型', label: '时尚造型', remain: 2 }, { key: '深层滋养', label: '深层滋养', remain: 3 }, { key: '头皮护理', label: '头皮护理', remain: 2 }] },
        { id: 'demo_kids_times_m12', name: '儿童10次剪发', balance: 0, projects: [{ key: '儿童剪发', label: '儿童剪发', remain: 6 }] },
        { id: 'demo_retail_perm_color_m12', name: '减值烫染卡', balance: 0, discount: 0.85, projects: [] },
      ],
    },
    {
      id: 'm13', name: '陈小姐', phone: '156****6677', isMember: true, vip: true, totalSpend: 19880,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-female.png', cards: [
        { id: 'demo_vip_combo_m13', name: '尊享组合卡', balance: 300, discount: 0.85, projects: [{ key: '时尚洗吹', label: '时尚洗吹', remain: 8 }, { key: '洗剪吹', label: '洗剪吹', remain: 2 }, { key: '精致剪发', label: '精致剪发', remain: 6 }, { key: '时尚造型', label: '时尚造型', remain: 1 }, { key: '深层滋养', label: '深层滋养', remain: 3 }, { key: '头皮护理', label: '头皮护理', remain: 1 }] },
        { id: 'demo_kids_times_m13', name: '儿童10次剪发', balance: 0, projects: [{ key: '儿童剪发', label: '儿童剪发', remain: 2 }] },
        { id: 'demo_retail_perm_color_m13', name: '减值烫染卡', balance: 0, discount: 0.85, projects: [] },
        { id: 'demo_retail_policy_m13', name: '减值策略演示卡', balance: 0, projects: [{ key: '儿童剪发', label: '儿童剪发', remain: 2 }] },
      ],
    },
    {
      id: 'm14', name: '褚女士', phone: '155****8899', isMember: true, vip: true, totalSpend: 25420,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-female.png', cards: [
        { id: 'demo_vip_combo_m14', name: '尊享组合卡', balance: 2000, discount: 0.85, projects: [{ key: '时尚洗吹', label: '时尚洗吹', remain: 8 }, { key: '洗剪吹', label: '洗剪吹', remain: 10 }, { key: '精致剪发', label: '精致剪发', remain: 6 }, { key: '时尚造型', label: '时尚造型', remain: 2 }, { key: '深层滋养', label: '深层滋养', remain: 3 }, { key: '头皮护理', label: '头皮护理', remain: 2 }] },
        { id: 'demo_kids_times_m14', name: '儿童10次剪发', balance: 0, projects: [{ key: '儿童剪发', label: '儿童剪发', remain: 1 }] },
        { id: 'demo_retail_perm_color_m14', name: '减值烫染卡', balance: 0, discount: 0.85, projects: [] },
        { id: 'demo_retail_policy_m14', name: '减值策略演示卡', balance: 0, projects: [{ key: '儿童剪发', label: '儿童剪发', remain: 1 }] },
      ],
    },
    {
      id: 'm15', name: '卫文博', phone: '153****1122', isMember: true, vip: true, totalSpend: 3120,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-male.png', cards: [
        { id: 'demo_vip_combo_m15', name: '尊享组合卡', balance: 2500, discount: 0.85, projects: [{ key: '时尚洗吹', label: '时尚洗吹', remain: 8 }, { key: '洗剪吹', label: '洗剪吹', remain: 10 }, { key: '精致剪发', label: '精致剪发', remain: 6 }, { key: '时尚造型', label: '时尚造型', remain: 2 }, { key: '深层滋养', label: '深层滋养', remain: 3 }, { key: '头皮护理', label: '头皮护理', remain: 2 }] },
        { id: 'demo_kids_times_m15', name: '儿童10次剪发', balance: 0, projects: [{ key: '儿童剪发', label: '儿童剪发', remain: 10 }] },
        { id: 'demo_year_wash_m15', name: '洗吹12次卡', balance: 0, projects: [{ key: '时尚洗吹', label: '时尚洗吹', remain: 6 }, { key: '洗剪吹', label: '洗剪吹', remain: 1 }] },
      ],
    },
    {
      id: 'm16', name: '蒋小姐', phone: '152****3344', isMember: true, vip: true, totalSpend: 8700,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-female.png', cards: [
        { id: 'demo_perm_color_discount_m16', name: '烫染会员价卡', balance: 0, discount: 0.85, projects: [] },
        { id: 'demo_lifetime_balance_m16', name: '永久储值卡', balance: 800, projects: [] },
      ],
    },
    {
      id: 'm17', name: '沈女士', phone: '151****5566', isMember: true, vip: false, totalSpend: 1560,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-female.png', cards: [
        { id: 'demo_perm_color_discount_m17', name: '烫染会员价卡', balance: 0, discount: 0.85, projects: [] },
      ],
    },
    {
      id: 'm18', name: '韩立晨', phone: '150****7788', isMember: true, vip: true, totalSpend: 11200,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-male.png', cards: [
        { id: 'demo_perm_color_discount_m18', name: '烫染会员价卡', balance: 0, discount: 0.85, projects: [] },
        { id: 'demo_retail_policy_m18', name: '减值策略演示卡', balance: 0, projects: [{ key: '儿童剪发', label: '儿童剪发', remain: 10 }] },
      ],
    },
    {
      id: 'm19', name: '杨小姐', phone: '188****9900', isMember: true, vip: true, totalSpend: 6890,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-female.png', cards: [
        { id: 'demo_perm_color_discount_m19', name: '烫染会员价卡', balance: 0, discount: 0.85, projects: [] },
        { id: 'demo_lifetime_balance_m19', name: '永久储值卡', balance: 1100, projects: [] },
      ],
    },
    {
      id: 'm20', name: '朱女士', phone: '187****2211', isMember: true, vip: true, totalSpend: 4320,
      lastVisit: '2026.6.8', avatar: 'assets/billing/avatar-female.png', cards: [
        { id: 'demo_perm_color_discount_m20', name: '烫染会员价卡', balance: 0, discount: 0.85, projects: [] },
        { id: 'demo_year_wash_m20', name: '洗吹12次卡', balance: 0, projects: [{ key: '时尚洗吹', label: '时尚洗吹', remain: 12 }, { key: '洗剪吹', label: '洗剪吹', remain: 2 }] },
      ],
    },
  ];
  const CARD_TPL_BY_ID = Object.fromEntries(CARD_TEMPLATES.map(t => [t.id, t]));
  function emptyBenefits() {
    return { balance: false, timesOrValidity: false, products: false, projectDiscount: false };
  }
  function heldTemplateId(card) {
    if (card.templateId) return card.templateId;
    const id = String(card.id || '');
    const m = id.match(/^(demo_.+?)_(m\d+)$/);
    return m ? m[1] : null;
  }
  function normalizeHeldCard(card) {
    const templateId = heldTemplateId(card);
    const tpl = templateId ? CARD_TPL_BY_ID[templateId] : null;
    const benefits = tpl?.benefits
      ? { ...emptyBenefits(), ...tpl.benefits }
      : {
          balance: Number(card.balance) > 0 || Number(card.rechargeBalance) > 0 || Number(card.giftBalance) > 0,
          timesOrValidity: (card.projects || []).length > 0,
          products: (card.products || card.productItems || []).length > 0,
          projectDiscount: !!card.discount,
        };
    const next = { ...card, templateId, benefits };
    delete next.type;
    if (next.rechargeBalance == null && next.giftBalance == null) {
      const total = Math.max(0, Number(next.balance) || 0);
      if (total <= 0) {
        next.rechargeBalance = 0;
        next.giftBalance = 0;
      } else {
        next.giftBalance = Math.round(total * 0.25);
        next.rechargeBalance = Math.round((total - next.giftBalance) * 100) / 100;
      }
    } else {
      next.rechargeBalance = Math.max(0, Number(next.rechargeBalance) || 0);
      next.giftBalance = Math.max(0, Number(next.giftBalance) || 0);
    }
    next.balance = Math.round(((Number(next.rechargeBalance) || 0) + (Number(next.giftBalance) || 0)) * 100) / 100;
    if (Array.isArray(next.projects)) {
      next.projects = next.projects.map(p => {
        if (!p || (Array.isArray(p.matchKeys) && p.matchKeys.length)) return p;
        const keys = projectBenefitMatchKeys(p);
        return keys.length ? { ...p, matchKeys: keys } : p;
      });
    }
    if (benefits.projectDiscount && typeof billingDiscountMetaFromTpl === 'function') {
      const fullTpl = (typeof getTemplateById === 'function' && templateId)
        ? getTemplateById(templateId)
        : null;
      const discSrc = (fullTpl && fullTpl.memberPrices && Object.keys(fullTpl.memberPrices).length)
        ? fullTpl
        : tpl;
      const discMeta = discSrc ? billingDiscountMetaFromTpl(discSrc) : null;
      if (discMeta) {
        if (next.discount == null && discMeta.rate != null) next.discount = discMeta.rate;
        if (next.discountScopeAll == null) next.discountScopeAll = !!discMeta.scopeAll;
        if (next.discountProjects == null && !discMeta.scopeAll) {
          next.discountProjects = discMeta.projectNames || [];
        }
      }
    }
    return next;
  }
  CUSTOMERS.forEach(c => {
    if (c.cards) c.cards = c.cards.map(normalizeHeldCard);
    if (c.isMember && c.couponCount == null) {
      const n = parseInt(String(c.id).replace(/\D/g, ''), 10) || 1;
      c.couponCount = (n % 4) + 1;
    }
  });
  /* 载入时的顾客持卡快照：本页未接入会员卡持卡账本（CardHost）时，用它与被账本同步清空的 c.cards 兜底 */
  const CUSTOMER_SEED_CARDS = {};
  CUSTOMERS.forEach(c => {
    if (c.id && Array.isArray(c.cards) && c.cards.length) CUSTOMER_SEED_CARDS[c.id] = c.cards.slice();
  });
  const GUEST_UNSET = { id: 'guest', name: '散客', phone: '', isMember: false, vip: false, gender: null, avatar: 'assets/billing/avatar-guest-default.png' };
  const GUEST_MALE = { id: 'guest_m', name: '男散客', phone: '', isMember: false, vip: false, gender: 'male', avatar: 'assets/billing/avatar-male.png' };
  const GUEST_FEMALE = { id: 'guest_f', name: '女散客', phone: '', isMember: false, vip: false, gender: 'female', avatar: 'assets/billing/avatar-female.png' };
  const GUEST = GUEST_UNSET;
  const STAFFS = [
    { id: 'st0', name: '顾清扬', short: '顾', role: '店主', avatar: 'assets/emp-avatars/man-e.jpg' },
    { id: 'st1', name: '林屿森', short: '森', role: '美容师', avatar: 'assets/emp-avatars/man-a.jpg' },
    { id: 'st2', name: '何苏叶', short: '叶', role: '店长', avatar: 'assets/emp-avatars/woman-a.jpg' },
    { id: 'st3', name: '阿Ken', short: 'Ken', role: '美容师', avatar: 'assets/emp-avatars/man-b.jpg' },
    { id: 'st4', name: 'Lisa', short: 'Lisa', role: '美甲师', avatar: 'assets/emp-avatars/woman-b.jpg' },
    { id: 'st5', name: '张明', short: '张', role: '美发师', avatar: 'assets/emp-avatars/man-c.jpg' },
    { id: 'st6', name: '李华', short: '李', role: '美发师', avatar: 'assets/emp-avatars/man-d.jpg' },
    { id: 'st7', name: '王芳', short: '王', role: '美甲师', avatar: 'assets/emp-avatars/woman-c.jpg' },
    { id: 'st8', name: '陈强', short: '陈', role: '美发师', avatar: 'assets/emp-avatars/man-e.jpg' },
    { id: 'st9', name: '赵敏', short: '赵', role: '前台', avatar: 'assets/emp-avatars/woman-d.jpg' },
    { id: 'st10', name: '周杰', short: '周', role: '美发师', avatar: 'assets/emp-avatars/man-a.jpg' },
    { id: 'st11', name: '吴婷', short: '吴', role: '美睫师', avatar: 'assets/emp-avatars/woman-e.jpg' },
    { id: 'st12', name: '小陈', short: '陈', role: '学徒', avatar: 'assets/emp-avatars/man-b.jpg' },
    { id: 'st13', name: '阿宁', short: '宁', role: '学徒', avatar: 'assets/emp-avatars/woman-b.jpg' },
  ];
  function staffJobTitleHtml(st) {
    const title = st && st.role ? String(st.role).trim() : '';
    if (!title) return '';
    return `<div class="staff-card__title">${escapeHtml(title)}</div>`;
  }
  function getStaffPool() {
    if (window.EmployeeDemo && typeof window.EmployeeDemo.getBillingStaffPool === 'function') {
      var shared = window.EmployeeDemo.getBillingStaffPool();
      if (shared && shared.length) {
        var ids = {};
        shared.forEach(function (s) { ids[s.id] = true; });
        return shared.concat(STAFFS.filter(function (s) { return !ids[s.id]; }));
      }
    }
    return STAFFS;
  }
  const STAFF_ROLE_OPTS = [
    { id: 'senior', label: '大工' },
    { id: 'mid', label: '中工' },
    { id: 'junior', label: '小工' },
  ];
  const STAFF_ROLE_PICK_ORDER = ['senior', 'mid', 'junior'];
  const STAFF_ROLE_DEFAULT = 'senior';
  function cartItemAchKind(it) {
    if (!it) return 'labor';
    if (typeof isQuickCartItem === 'function' && isQuickCartItem(it)) return 'labor';
    if (it.category === '产品' || it.type === 'product' || it.kind === 'product') return 'sales';
    if (it.type === 'card' || it.kind === 'card' || it.category === '会员卡' || it.category === '办卡') return 'card';
    return 'labor';
  }
  function getAchCalcModeForKind(kind) {
    if (typeof window.EmployeeDemo !== 'undefined' && typeof window.EmployeeDemo.getAchCalcMode === 'function') {
      return window.EmployeeDemo.getAchCalcMode(kind) === 'station' ? 'station' : 'avg';
    }
    const store = window.EmployeeStore;
    if (!store) return 'avg';
    if (kind === 'sales') return store.calcModeSales === 'station' ? 'station' : 'avg';
    if (kind === 'card') return store.calcModeCard === 'station' ? 'station' : 'avg';
    return (store.calcModeLabor || store.calcMode) === 'station' ? 'station' : 'avg';
  }
  function isAvgAchCalcModeForItem(it) {
    return getAchCalcModeForKind(cartItemAchKind(it)) !== 'station';
  }
  function isAvgAchCalcMode() {
    /* 兼容旧调用：全部行均为平均时才视为全局平均 */
    const cart = state.cart || [];
    if (!cart.length) return getAchCalcModeForKind('labor') !== 'station';
    return cart.every(it => isAvgAchCalcModeForItem(it));
  }
  function staffRoleLabel(roleId) {
    if (typeof window.EmployeeDemo !== 'undefined' && typeof window.EmployeeDemo.getStationLabel === 'function') {
      const mapped = window.EmployeeDemo.getStationLabel(roleId);
      if (mapped) return mapped;
    }
    const store = window.EmployeeStore;
    if (store && store.stationMap && store.stationMap[roleId]) return store.stationMap[roleId];
    const hit = STAFF_ROLE_OPTS.find(r => r.id === roleId);
    return hit ? hit.label : '';
  }
  function stationRoleLabelsJoined() {
    return STAFF_ROLE_PICK_ORDER.map(id => staffRoleLabel(id)).filter(Boolean).join('/');
  }
  function ensureCartStaffState(it) {
    if (!it) return;
    if (!Array.isArray(it.staffIds)) it.staffIds = [];
    if (!it.staffRoles || typeof it.staffRoles !== 'object') it.staffRoles = {};
    if (!it.staffDesignated || typeof it.staffDesignated !== 'object') it.staffDesignated = {};
    Object.keys(it.staffRoles).forEach(sid => {
      if (!it.staffIds.includes(sid)) delete it.staffRoles[sid];
    });
    Object.keys(it.staffDesignated).forEach(sid => {
      if (!it.staffIds.includes(sid)) delete it.staffDesignated[sid];
    });
    it.staffIds.forEach(sid => {
      if (!it.staffRoles[sid]) it.staffRoles[sid] = STAFF_ROLE_DEFAULT;
      if (typeof it.staffDesignated[sid] !== 'boolean') it.staffDesignated[sid] = false;
    });
  }
  function cartHasUnsetStaffRoles() {
    return (state.cart || []).some(it => {
      if (isAvgAchCalcModeForItem(it)) return false;
      ensureCartStaffState(it);
      return (it.staffIds || []).some(sid => !it.staffRoles[sid]);
    });
  }
  function staffCardOrigin(index) {
    const col = index % 3;
    if (col === 0) return 'left center';
    if (col === 2) return 'right center';
    return 'center center';
  }
  function staffPickSummaryText(it, sid) {
    const designated = it && it.staffDesignated && it.staffDesignated[sid] === true;
    const guest = designated ? '点客' : '散客';
    if (isAvgAchCalcModeForItem(it)) return guest;
    const role = staffRoleLabel(it && it.staffRoles ? it.staffRoles[sid] : '');
    return role ? `${guest}·${role}` : guest;
  }
  function afterStaffPickerPaint(root) {
    const scope = root && root.querySelectorAll ? root : document;
    requestAnimationFrame(() => {
      scope.querySelectorAll('.staff-grid').forEach(grid => animateStaffMorphLayout(grid));
    });
  }
  function animateStaffMorphLayout(grid) {
    if (!grid) return;
    const token = (grid._staffMorphToken = (grid._staffMorphToken || 0) + 1);
    const cards = [...grid.querySelectorAll(':scope > .staff-card')];
    const editing = cards.find(c => c.classList.contains('is-editing'));
    const reduce = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    cards.forEach(c => {
      c.classList.remove('is-pinching', 'is-expanding');
      c.style.transition = 'none';
      c.style.transform = '';
      c.style.width = '';
      c.style.zIndex = '';
    });
    grid.classList.toggle('is-morphing', !!editing);

    /* A1：完成/取消时直接复原，不做收窄两段式 */
    if (!editing) {
      requestAnimationFrame(() => {
        if (grid._staffMorphToken !== token) return;
        cards.forEach(c => { c.style.transition = ''; });
      });
      return;
    }

    const gap = 8;
    const narrowW = 32;
    const gridW = grid.clientWidth;
    if (gridW <= 0) return;
    const cellW = (gridW - gap * 2) / 3;
    const face = editing.querySelector('[data-face]')?.getAttribute('data-face');
    /* 展开宽 = 原宽 × 2/3（减少三分之一） */
    const editWFull = face === 'role' ? gridW : Math.min(gridW, cellW * 2 + gap);
    const editW = Math.max(cellW, round2(editWFull * (2 / 3)));
    const idx = cards.indexOf(editing);
    if (idx < 0) return;
    const col = idx % 3;
    const rowStart = idx - col;
    const natural = [0, cellW + gap, 2 * (cellW + gap)];
    const lefts = [natural[0], natural[1], natural[2]];
    if (col === 0) {
      lefts[0] = 0;
      lefts[1] = editW + gap;
      lefts[2] = editW + gap * 2 + cellW;
    } else if (col === 2) {
      lefts[2] = gridW - editW;
      lefts[1] = lefts[2] - gap - cellW;
      lefts[0] = lefts[1] - gap - cellW;
    } else {
      lefts[1] = (gridW - editW) / 2;
      lefts[0] = lefts[1] - gap - cellW;
      lefts[2] = lefts[1] + editW + gap;
    }
    const narrowDx = (cellW - narrowW) / 2;

    const applyFinalLayout = () => {
      for (let i = 0; i < 3; i++) {
        const card = cards[rowStart + i];
        if (!card) continue;
        const dx = lefts[i] - natural[i];
        const w = i === col ? editW : cellW;
        card.style.width = `${w}px`;
        card.style.transform = `translateX(${dx}px)`;
        if (i === col) card.style.zIndex = '6';
      }
    };

    editing.style.zIndex = '6';
    editing.classList.add('is-pinching');
    /* 起点：原格宽，邻卡不动 */
    editing.style.width = `${cellW}px`;
    editing.style.transform = 'translateX(0)';
    for (let i = 0; i < 3; i++) {
      if (i === col) continue;
      const card = cards[rowStart + i];
      if (!card) continue;
      card.style.width = `${cellW}px`;
      card.style.transform = 'translateX(0)';
    }
    void grid.offsetWidth;

    if (reduce) {
      editing.classList.remove('is-pinching');
      editing.classList.add('is-expanding');
      applyFinalLayout();
      cards.forEach(c => { c.style.transition = ''; });
      return;
    }

    let phaseDone = false;
    const runExpand = () => {
      if (phaseDone || grid._staffMorphToken !== token) return;
      phaseDone = true;
      editing.classList.remove('is-pinching');
      editing.classList.add('is-expanding');
      for (let i = 0; i < 3; i++) {
        const card = cards[rowStart + i];
        if (!card) continue;
        const dx = lefts[i] - natural[i];
        const w = i === col ? editW : cellW;
        card.style.transition = 'transform .17s cubic-bezier(.22,.82,.24,1), width .17s cubic-bezier(.22,.82,.24,1)';
        card.style.width = `${w}px`;
        card.style.transform = `translateX(${dx}px)`;
        if (i === col) card.style.zIndex = '6';
      }
    };

    requestAnimationFrame(() => {
      if (grid._staffMorphToken !== token) return;
      /* ① 向中收缩成窄白卡，同行邻卡保持原位 */
      editing.style.transition = 'transform .09s cubic-bezier(.4,0,.2,1), width .09s cubic-bezier(.4,0,.2,1)';
      editing.style.width = `${narrowW}px`;
      editing.style.transform = `translateX(${narrowDx}px)`;

      const onShrinkEnd = (e) => {
        if (e && e.target !== editing) return;
        if (e && e.propertyName && e.propertyName !== 'width' && e.propertyName !== 'transform') return;
        editing.removeEventListener('transitionend', onShrinkEnd);
        runExpand();
      };
      editing.addEventListener('transitionend', onShrinkEnd);
      setTimeout(runExpand, 110);
    });
  }
  function staffAvatarHtml(st, extraClass) {
    const cls = 'staff-card__avatar' + (extraClass ? ' ' + extraClass : '');
    if (st.avatar) {
      return `<img class="${cls}" src="${escapeHtml(st.avatar)}" alt="" loading="lazy" referrerpolicy="no-referrer">`;
    }
    const letter = escapeHtml((st.short || st.name || '?').toString().slice(0, 2));
    return `<span class="${cls} staff-card__avatar--ph" aria-hidden="true">${letter}</span>`;
  }
  function clearStaffCardEdit() {
    state.staffCardEdit = null;
  }
  function resetIssueStaffDraft() {
    state.issueStaffDraft = {
      id: '__issue__',
      type: 'card',
      kind: 'card',
      category: '办卡',
      staffIds: [],
      staffRoles: {},
      staffDesignated: {},
    };
    if (state.staffCardEdit && state.staffCardEdit.cartId === '__issue__') clearStaffCardEdit();
  }
  function getIssueStaffRow() {
    if (!state.issueStaffDraft) resetIssueStaffDraft();
    ensureCartStaffState(state.issueStaffDraft);
    return state.issueStaffDraft;
  }
  function resetTimesTicketStaffDraft() {
    state.billTimesTicketStaffDraft = {
      id: '__ticket__',
      category: '项目',
      name: '扣次',
      staffIds: [],
      staffRoles: {},
      staffDesignated: {},
    };
    if (state.staffCardEdit && state.staffCardEdit.cartId === '__ticket__') clearStaffCardEdit();
  }
  function getTimesTicketStaffRow() {
    if (!state.billTimesTicketStaffDraft) resetTimesTicketStaffDraft();
    ensureCartStaffState(state.billTimesTicketStaffDraft);
    return state.billTimesTicketStaffDraft;
  }
  function resolveStaffRow(cartId) {
    if (cartId === '__issue__') return getIssueStaffRow();
    if (cartId === '__ticket__') return getTimesTicketStaffRow();
    return (state.cart || []).find(x => x.id === cartId) || null;
  }
  function refreshStaffPickerUi(cartId) {
    if (cartId === '__issue__') {
      renderAddCardStaffOnly();
      return;
    }
    if (cartId === '__ticket__') {
      const mask = document.getElementById('billStaffMask');
      const sheetOpen = !!(mask && mask.classList.contains('open'));
      if (sheetOpen && state.billStaffSheetCartId === '__ticket__') {
        renderBillStaffSheet();
      }
      renderTimesTicketStaffRow();
      return;
    }
    const mask = document.getElementById('billStaffMask');
    const sheetOpen = !!(mask && mask.classList.contains('open'));
    if (sheetOpen && state.billStaffSheetCartId === cartId) {
      renderBillStaffSheet();
      return;
    }
    renderDetail();
  }

  function renderDetailStaffSummary(it) {
    ensureCartStaffState(it);
    const ids = it.staffIds || [];
    if (!ids.length) return '';
    const pool = getStaffPool();
    const delSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    const rows = ids.map(sid => {
      const st = pool.find(s => s.id === sid);
      const name = st ? st.name : sid;
      const job = st && st.role ? st.role : '';
      const params = staffPickSummaryText(it, sid);
      return `<div class="detail-staff-summary__row">
        <div class="detail-staff-summary__main">
          <span class="detail-staff-summary__name">${escapeHtml(name)}</span>
          ${job ? `<span class="detail-staff-summary__role">${escapeHtml(job)}</span>` : ''}
          <span class="detail-staff-summary__meta">${escapeHtml(params)}</span>
        </div>
        <button type="button" class="detail-staff-summary__del" data-staff-summary-del data-cart-id="${escapeHtml(it.id)}" data-staff-id="${escapeHtml(sid)}" aria-label="移除 ${escapeHtml(name)}">${delSvg}</button>
      </div>`;
    }).join('');
    return `<div class="detail-staff-summary">${rows}</div>`;
  }

  function renderDetailStaffSection(it) {
    ensureCartStaffState(it);
    const n = (it.staffIds || []).length;
    const val = n ? `已选 ${n} 人` : '未选择';
    return `<div class="detail-staff-block">
      <button type="button" class="detail-staff-entry" data-open-bill-staff="${escapeHtml(it.id)}">
        <span class="detail-staff-entry__lbl">选择员工</span>
        <span class="detail-staff-entry__val${n ? ' has-staff' : ''}">${escapeHtml(val)}</span>
        <span class="chev ui-icon" aria-hidden="true">${iconSvg('chevron-right', 'ui-icon')}</span>
      </button>
      ${renderDetailStaffSummary(it)}
    </div>`;
  }

  function renderBillStaffSheet() {
    const root = document.getElementById('billStaffSheetRoot');
    const hint = document.getElementById('billStaffSheetHint');
    const cartId = state.billStaffSheetCartId;
    const it = resolveStaffRow(cartId);
    if (!root || !it) return;
    ensureCartStaffState(it);
    const avg = isAvgAchCalcModeForItem(it);
    if (hint) {
      hint.textContent = avg
        ? '可多选员工；点卡片后选择点客或散客（即时生效）。'
        : `可多选员工；点卡片后选择点客/散客，再选工位（${stationRoleLabelsJoined()}），即时生效。`;
    }
    root.innerHTML = renderStaffPickerHtml(it);
    afterStaffPickerPaint(root);
  }

  function openBillStaffSheet(cartId) {
    const it = resolveStaffRow(cartId);
    if (!it) return;
    state.billStaffSheetCartId = cartId;
    state.staffCardEdit = null;
    renderBillStaffSheet();
    openMask('billStaffMask');
  }

  function closeBillStaffSheet() {
    const fromTicket = state.billStaffSheetCartId === '__ticket__';
    clearStaffCardEdit();
    state.billStaffSheetCartId = null;
    closeMask('billStaffMask');
    if (fromTicket) {
      renderTimesTicketStaffRow();
      return;
    }
    if (!document.getElementById('screen-detail')?.classList.contains('hidden')) renderDetail();
  }

  function renderTimesTicketStaffRow() {
    const row = getTimesTicketStaffRow();
    const ids = row.staffIds || [];
    const pool = getStaffPool();
    const names = ids.map(id => {
      const st = pool.find(s => s.id === id);
      return st ? st.name : id;
    });
    const hasStaff = names.length > 0;
    const text = hasStaff ? names.join('、') : '未选择员工';
    const rowEl = document.getElementById('billTimesTicketStaffRow');
    const valEl = document.getElementById('billTimesTicketStaffVal');
    const actionEl = document.getElementById('billTimesTicketStaffAction');
    if (valEl) {
      valEl.textContent = text;
      valEl.classList.toggle('is-placeholder', !hasStaff);
    }
    if (actionEl) actionEl.textContent = '去选择';
    if (rowEl) rowEl.classList.toggle('has-staff', hasStaff);
  }

  function renderAddCardStaffOnly() {
    const root = document.getElementById('addCardStaffRoot');
    const hint = document.getElementById('addCardStaffHint');
    if (root) {
      const avg = getAchCalcModeForKind('card') !== 'station';
      if (hint) {
        hint.textContent = avg
          ? '可多选员工；点卡片后选择点客或散客。'
          : `可多选员工；点卡片后选择点客/散客，再选择工位（${stationRoleLabelsJoined()}）。`;
      }
      root.innerHTML = renderStaffPickerHtml(getIssueStaffRow());
      afterStaffPickerPaint(root);
    }
    renderAddCardStaffRow();
  }

  function renderAddCardStaffRow() {
    const ids = (getIssueStaffRow().staffIds || []);
    const pool = getStaffPool();
    const names = ids.map(id => {
      const st = pool.find(s => s.id === id);
      return st ? st.name : id;
    });
    const text = names.length ? names.join('、') : '请选择';
    const hasStaff = names.length > 0;
    [
      { row: 'addCardStaffRow', val: 'addCardStaffRowVal' },
      { row: 'quickIssueStaffRow', val: 'quickIssueStaffRowVal' },
    ].forEach(({ row, val }) => {
      const rowEl = document.getElementById(row);
      const valEl = document.getElementById(val);
      if (!valEl) return;
      valEl.textContent = text;
      valEl.classList.toggle('is-placeholder', !hasStaff);
      if (rowEl) rowEl.classList.toggle('has-staff', hasStaff);
    });
  }

  function defaultCardIssuePayAmount(tpl) {
    if (!tpl) return 0;
    if (typeof resolveCardIssueAmount === 'function') return round2(resolveCardIssueAmount(tpl, null) || 0);
    if (typeof getTemplatePurchaseAmount === 'function') {
      const fromRecharge = getTemplatePurchaseAmount(tpl);
      if (fromRecharge > 0) return round2(fromRecharge);
    }
    return round2(Number(tpl.price) || Number(tpl.recharge) || Number(tpl.face) || 0);
  }

  function resetCardIssuePayState() {
    state.cardIssuePayAmount = null;
    state.cardIssuePayTemplateId = null;
    state.cardIssuePayEdited = false;
  }

  /** 换卡时重置为模板默认价；同卡保留已改金额（含 ¥0） */
  function ensureCardIssuePayForTemplate(tpl, opts) {
    opts = opts || {};
    if (!tpl) {
      resetCardIssuePayState();
      return 0;
    }
    const forceDefault = !!opts.forceDefault;
    if (forceDefault || state.cardIssuePayTemplateId !== tpl.id) {
      state.cardIssuePayTemplateId = tpl.id;
      if (!forceDefault
        && state.pendingOpenCard
        && state.pendingOpenCard.templateId === tpl.id
        && state.pendingOpenCard.amountEdited
        && Number.isFinite(Number(state.pendingOpenCard.amount))) {
        state.cardIssuePayAmount = round2(Math.max(0, Number(state.pendingOpenCard.amount)));
        state.cardIssuePayEdited = true;
      } else if (!forceDefault
        && state.pendingOpenCard
        && state.pendingOpenCard.templateId === tpl.id
        && Number.isFinite(Number(state.pendingOpenCard.amount))
        && !state.cardIssuePayEdited) {
        /* 会员卡管理进入时已带默认应付，尚未改价 */
        state.cardIssuePayAmount = round2(Math.max(0, Number(state.pendingOpenCard.amount)));
        state.cardIssuePayEdited = false;
      } else {
        state.cardIssuePayAmount = defaultCardIssuePayAmount(tpl);
        state.cardIssuePayEdited = false;
      }
    }
    return round2(Math.max(0, Number(state.cardIssuePayAmount) || 0));
  }

  function getCardIssuePayAmount(tpl) {
    return ensureCardIssuePayForTemplate(tpl);
  }

  function setCardIssuePayAmount(amount, tpl) {
    const n = round2(Math.max(0, Number(amount) || 0));
    if (n > INPUT_LIMITS.MONEY_MAX) {
      showToast('金额不能超过 ' + formatMoneyLimitLabel(), true);
      return false;
    }
    const tid = (tpl && tpl.id) || state.selectedTemplateId || state.cardIssuePayTemplateId;
    state.cardIssuePayTemplateId = tid;
    state.cardIssuePayAmount = n;
    state.cardIssuePayEdited = true;
    if (state.pendingOpenCard && state.pendingOpenCard.templateId === tid) {
      state.pendingOpenCard.amount = n;
      state.pendingOpenCard.amountEdited = true;
    }
    return true;
  }

  function formatCardIssuePayText(amount) {
    if (typeof formatMoneyDisplay === 'function') return formatMoneyDisplay(amount);
    return '¥' + round2(Number(amount) || 0);
  }

  function syncCardIssuePayUi(tpl) {
    const amount = tpl ? getCardIssuePayAmount(tpl) : 0;
    const priceText = formatCardIssuePayText(amount);
    const edited = !!(tpl && state.cardIssuePayEdited && state.cardIssuePayTemplateId === tpl.id);
    const editIcon = (typeof iconSvg === 'function') ? iconSvg('edit') : '';
    [
      { btn: 'btnQuickIssuePayEdit', val: 'quickIssuePayVal', price: null },
      { btn: 'btnAddCardPayEdit', val: 'addCardPayVal', price: null },
    ].forEach(function (cfg) {
      const btn = document.getElementById(cfg.btn);
      const val = document.getElementById(cfg.val);
      if (val) val.textContent = priceText;
      if (btn) {
        btn.classList.toggle('is-edited', edited);
        btn.hidden = !tpl;
        const editEl = btn.querySelector('.quick-issue-pay__edit');
        if (editEl && editIcon && !editEl.innerHTML) editEl.innerHTML = editIcon;
      }
    });
    const qiPrice = document.querySelector('#quickIssueCard .quick-issue-card__price');
    if (qiPrice) qiPrice.textContent = priceText;
    const slotPrice = document.querySelector('#addCardSlot .add-card-slot__price');
    if (slotPrice) slotPrice.textContent = priceText;
    return amount;
  }

  function openCardIssuePayKeypad(tpl) {
    if (!tpl) {
      showToast('请先选择会员卡', true);
      return;
    }
    ensureCardIssuePayForTemplate(tpl);
    let el = document.getElementById('cardIssuePayKeypadProxy');
    if (!el) {
      el = document.createElement('input');
      el.type = 'text';
      el.id = 'cardIssuePayKeypadProxy';
      el.className = 'input-amount';
      el.setAttribute('readonly', 'readonly');
      el.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;width:1px;height:1px;';
      document.body.appendChild(el);
      el.addEventListener('change', function () {
        const n = parseFloat(el.value);
        if (!Number.isFinite(n) || n < 0) {
          showToast('请输入有效金额', true);
          return;
        }
        const curTpl = CARD_TEMPLATES.find(function (t) { return t.id === state.selectedTemplateId; })
          || (typeof getTemplate === 'function' ? getTemplate(state.selectedTemplateId) : null)
          || (typeof getTemplateById === 'function' ? getTemplateById(state.cardIssuePayTemplateId) : null);
        if (!setCardIssuePayAmount(n, curTpl)) return;
        syncCardIssuePayUi(curTpl);
        showToast('已更新应付金额');
      });
    }
    el.value = String(getCardIssuePayAmount(tpl));
    if (typeof window.openAmountKeypad === 'function') window.openAmountKeypad(el);
    else showToast('金额键盘未就绪', true);
  }

  function formatQuickIssueBenefitLineLocal(tpl) {
    if (typeof formatQuickIssueBenefitLine === 'function') return formatQuickIssueBenefitLine(tpl);
    return '—';
  }

  /** 确认办卡：权益按类型分行（面值/项目/产品/折扣/期限） */
  function buildQuickIssueBenefitRows(tpl) {
    if (!tpl) return [];
    const rows = [];
    const b = tpl.benefits || {};
    if (b.balance) {
      const face = (typeof getTemplateFaceTotal === 'function')
        ? getTemplateFaceTotal(tpl)
        : (tpl.face != null ? Number(tpl.face) : 0);
      const faceText = (typeof formatMoneyDisplay === 'function')
        ? formatMoneyDisplay(face > 0 ? face : 0)
        : (`¥${face || 0}`);
      const gift = typeof parseAmount === 'function' ? parseAmount(tpl.giftAmount) : Number(tpl.giftAmount) || 0;
      let text = faceText;
      if (gift > 0) text += ' · 赠送 ¥' + tpl.giftAmount;
      rows.push({ label: '面值', text: text });
    }
    const projs = (tpl.projects && tpl.projects.length)
      ? tpl.projects.map(function (x) { return typeof x === 'string' ? x : (x && x.name); }).filter(Boolean)
      : ((typeof normalizeProjectItemsFromTpl === 'function')
        ? normalizeProjectItemsFromTpl(tpl).map(function (i) {
          return (typeof formatProjectItemFaceLine === 'function')
            ? formatProjectItemFaceLine(i)
            : (i && i.name);
        }).filter(Boolean)
        : []);
    if (b.timesOrValidity || projs.length) {
      const line = projs.length
        ? ((typeof formatProjectItemsLine === 'function' && !(tpl.projects && tpl.projects.length))
          ? (formatProjectItemsLine(normalizeProjectItemsFromTpl(tpl)) || projs.join('、'))
          : projs.join('、'))
        : '';
      if (line) rows.push({ label: '项目', text: line });
    }
    const prods = (typeof normalizeProductItemsFromTpl === 'function')
      ? normalizeProductItemsFromTpl(tpl)
      : (tpl.productItems || tpl.products || []);
    const prodLine = (typeof formatProductItemsLine === 'function')
      ? formatProductItemsLine(prods)
      : (Array.isArray(prods) ? prods.map(function (p) {
        return typeof p === 'string' ? p : (p && p.name);
      }).filter(Boolean).join('、') : '');
    if ((b.products || prodLine) && prodLine) rows.push({ label: '产品', text: prodLine });
    const discs = tpl.discounts || [];
    if (b.projectDiscount || discs.length) {
      let discLine = '';
      if (tpl.memberPrices && typeof formatMemberPriceFaceSummary === 'function') {
        discLine = formatMemberPriceFaceSummary(tpl.memberPrices) || '';
      }
      if (!discLine && discs.length) discLine = discs.join('、');
      if (discLine) rows.push({ label: '折扣', text: discLine });
    }
    const validity = (typeof formatListCardValidity === 'function')
      ? formatListCardValidity(tpl)
      : ((typeof formatCardValidity === 'function') ? formatCardValidity(tpl) : '');
    if (validity && validity !== '—') rows.push({ label: '期限', text: validity });
    return rows;
  }

  function renderQuickIssueBenefitRowsHtml(rows) {
    if (!rows || !rows.length) {
      return '<p class="quick-issue-card__summary">—</p>';
    }
    return '<div class="quick-issue-card__benefits">' + rows.map(function (r) {
      return '<div class="quick-issue-card__benefit">' +
        '<span class="quick-issue-card__benefit-lbl">' + escapeHtml(r.label) + '</span>' +
        '<span class="quick-issue-card__benefit-val">' + escapeHtml(r.text) + '</span></div>';
    }).join('') + '</div>';
  }

  function renderQuickIssuePage() {
    const pending = state.cardIssuePending;
    const templateId = pending?.templateId || state.selectedTemplateId;
    const memberId = pending?.memberId;
    const c = (CUSTOMERS || []).find(x => x.id === memberId) || getCustomer() || GUEST;
    const custEl = document.getElementById('quickIssueCustomer');
    if (custEl) custEl.innerHTML = renderCustomerNameCard(c);

    /* 优先会员卡模块完整模板（含 recharge）；开单列表项仅有 price */
    const cardTpl = (typeof getTemplate === 'function' ? getTemplate(templateId) : null)
      || (typeof getTemplateById === 'function' ? getTemplateById(templateId) : null);
    const billTpl = CARD_TEMPLATES.find(t => t.id === templateId)
      || (typeof CARD_TPL_BY_ID !== 'undefined' ? CARD_TPL_BY_ID[templateId] : null);
    const tpl = cardTpl || billTpl;
    const cardEl = document.getElementById('quickIssueCard');
    if (!tpl) {
      if (cardEl) cardEl.innerHTML = '<p class="quick-issue-card__summary">未找到会员卡模板</p>';
      syncCardIssuePayUi(null);
      renderAddCardStaffOnly();
      return;
    }
    state.selectedTemplateId = tpl.id;
    const theme = (typeof getCardTheme === 'function')
      ? getCardTheme(tpl.cardColor)
      : { gradient: (CARD_COLORS && CARD_COLORS[tpl.cardColor]) || '#F32F41' };
    const amountNum = getCardIssuePayAmount(tpl);
    const priceText = formatCardIssuePayText(amountNum);
    /* 摘要优先用开单侧已格式化的 projects/discounts 文案 */
    const summaryTpl = billTpl && (billTpl.projects?.length || billTpl.discounts?.length)
      ? { ...tpl, projects: billTpl.projects || tpl.projects, discounts: billTpl.discounts || tpl.discounts, benefits: billTpl.benefits || tpl.benefits }
      : tpl;
    const benefitRows = buildQuickIssueBenefitRows(summaryTpl);
    const grad = theme.gradient;
    if (cardEl) {
      cardEl.innerHTML =
        '<div class="quick-issue-card__info">' +
        '<div class="quick-issue-card__head">' +
        '<span class="add-card-slot__face" aria-hidden="true">' +
        '<span class="add-card-slot__face-head" style="background:' + grad + '"></span>' +
        '<span class="add-card-slot__face-body"></span></span>' +
        '<span class="quick-issue-card__name">' + escapeHtml(tpl.name) + '</span>' +
        '<span class="quick-issue-card__price is-data">' + escapeHtml(priceText) + '</span>' +
        '</div>' +
        renderQuickIssueBenefitRowsHtml(benefitRows) +
        '</div>';
    }
    syncCardIssuePayUi(tpl);
    syncBillDateLabels();
    renderAddCardStaffOnly();
  }

  function confirmQuickIssueCheckout() {
    const pending = state.cardIssuePending;
    const templateId = pending?.templateId || state.selectedTemplateId;
    const cardTpl = (typeof getTemplate === 'function' ? getTemplate(templateId) : null)
      || (typeof getTemplateById === 'function' ? getTemplateById(templateId) : null);
    const tpl = cardTpl
      || CARD_TEMPLATES.find(t => t.id === templateId)
      || (typeof getTemplate === 'function' ? getTemplate(templateId) : null);
    if (!tpl) {
      showToast('未找到该卡模板');
      return;
    }
    const staffErr = issueStaffSelectionError();
    if (staffErr) {
      showToast(staffErr, true);
      return;
    }
    const memberId = pending?.memberId || getCustomer()?.id;
    const c = (CUSTOMERS || []).find(x => x.id === memberId) || getCustomer();
    if (!c || c.isMember === false || String(c.id || '').indexOf('guest') === 0) {
      showToast('请先选择会员顾客再办卡', true);
      return;
    }
    const amount = getCardIssuePayAmount(tpl);
    const staff = snapshotIssueStaff();
    startCardIssueCheckout({
      templateId: tpl.id,
      memberId: c.id,
      cardName: tpl.name,
      amount,
      cardHtml: (window.CardHost && typeof window.CardHost.renderIssueSuccessCardFace === 'function')
        ? window.CardHost.renderIssueSuccessCardFace(tpl.id)
        : '',
      staff,
      skipStaffScreen: true,
    });
  }

  function leaveQuickIssueToCardList() {
    clearStaffCardEdit();
    closeMask('addCardStaffMask');
    resetCardIssuePayState();
    state.pendingOpenCard = null;
    state.cardIssuePending = null;
    state.successIssueTemplateId = null;
    state.successIssueCardHtml = '';
    state.lastIssueFromCardMgmt = false;
    resetIssueStaffDraft();
    if (typeof setStep === 'function') setStep(0);
    showOnlyScreen('screen0');
    if (typeof setFlowNavHighlight === 'function') setFlowNavHighlight('list');
  }

  function openAddCardStaffSheet() {
    renderAddCardStaffOnly();
    openMask('addCardStaffMask');
  }

  function closeAddCardStaffSheet() {
    clearStaffCardEdit();
    closeMask('addCardStaffMask');
    renderAddCardStaffRow();
  }
  function issueStaffSelectionError() {
    const row = getIssueStaffRow();
    if (!(row.staffIds || []).length) return '请选择至少一名服务员工';
    if (getAchCalcModeForKind('card') === 'station') {
      const missing = (row.staffIds || []).some(sid => !row.staffRoles[sid]);
      if (missing) return `请为员工选择工位（${stationRoleLabelsJoined()}）`;
    }
    return '';
  }
  function snapshotIssueStaff() {
    const row = getIssueStaffRow();
    return {
      staffIds: (row.staffIds || []).slice(),
      staffRoles: Object.assign({}, row.staffRoles || {}),
      staffDesignated: Object.assign({}, row.staffDesignated || {}),
    };
  }
  function tapStaffHaptic() {
    try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) { /* ignore */ }
  }
  const SURNAME_LETTER = {
    张: 'Z', 李: 'L', 王: 'W', 刘: 'L', 陈: 'C', 杨: 'Y', 赵: 'Z', 黄: 'H', 周: 'Z', 吴: 'W',
    徐: 'X', 孙: 'S', 胡: 'H', 朱: 'Z', 高: 'G', 林: 'L', 何: 'H', 郭: 'G', 马: 'M', 罗: 'L',
    梁: 'L', 宋: 'S', 郑: 'Z', 谢: 'X', 韩: 'H', 唐: 'T', 冯: 'F', 于: 'Y', 董: 'D', 萧: 'X',
    程: 'C', 曹: 'C', 袁: 'Y', 邓: 'D', 许: 'X', 傅: 'F', 沈: 'S', 曾: 'Z', 彭: 'P', 吕: 'L',
    苏: 'S', 卢: 'L', 蒋: 'J', 蔡: 'C', 贾: 'J', 丁: 'D', 魏: 'W', 薛: 'X', 叶: 'Y', 阎: 'Y',
    余: 'Y', 潘: 'P', 杜: 'D', 戴: 'D', 夏: 'X', 钟: 'Z', 汪: 'W', 田: 'T', 任: 'R', 姜: 'J',
    范: 'F', 方: 'F', 石: 'S', 姚: 'Y', 谭: 'T', 廖: 'L', 邹: 'Z', 熊: 'X', 金: 'J', 陆: 'L',
    郝: 'H', 孔: 'K', 白: 'B', 崔: 'C', 康: 'K', 毛: 'M', 邱: 'Q', 秦: 'Q', 江: 'J', 史: 'S',
    顾: 'G', 侯: 'H', 邵: 'S', 孟: 'M', 龙: 'L', 万: 'W', 段: 'D', 雷: 'L', 钱: 'Q', 汤: 'T',
    尹: 'Y', 黎: 'L', 易: 'Y', 常: 'C', 武: 'W', 乔: 'Q', 贺: 'H', 赖: 'L', 龚: 'G', 文: 'W',
    迪: 'D',
  };
  const DISCOUNT_CATS_DEFAULT = [
    { id: 'all', name: '所有项目', rate: 8.5, on: true },
    { id: 'wash', name: '洗剪吹', rate: 0, on: false },
    { id: 'perm', name: '烫发', rate: 8, on: true },
    { id: 'dye', name: '染发', rate: 6, on: true },
    { id: 'care', name: '护理', rate: 0, on: false },
    { id: 'beauty', name: '美容', rate: 0, on: false },
    { id: 'other', name: '其他', rate: 0, on: false },
  ];
  const TECHS = ['未指定', '阿Ken', 'Lisa', 'Tony'];
  const COUPONS = [
    {
      id: 'cp1', tag: '代金券', name: '店长洗剪吹新人优惠券，洗剪吹专享',
      scope: '项目通用', amount: 100, minAmount: 0, gateLabel: '无门槛',
      stackWithBenefit: true,
      rules: ['有效期：15天', '测试用账号：18297402934'],
    },
    {
      id: 'cp2', tag: '抵用券', name: '洗剪吹免单券，凭券免费洗剪吹一次',
      scope: '洗剪吹', exchangeItems: [{ id: 'p3', name: '洗剪吹' }, { id: 'p1', name: '时尚洗吹' }],
      minAmount: 0, gateLabel: '抵用洗剪吹',
      stackWithBenefit: false,
      rules: ['有效期：60天', '购物车含绑定项目即可免费抵用', '不可与会员卡权益同享（演示）'],
    },
    {
      id: 'cp3', tag: '代金券', name: '全场代金券',
      scope: '项目通用', amount: 50, minAmount: 200, gateLabel: '满200可用',
      stackWithBenefit: false,
      rules: ['有效期：30天', '不可与会员卡权益同享（演示）'],
    },
  ];

  const state = {
    customer: null,
    cart: [],
    billTab: 'project',
    billGroupId: { project: 'all', product: 'all' },
    billStockPickSelected: {},
    pendingCatalogAdds: [],
    searchQuery: '',
    cardsExpanded: false,
    billCardGateOpen: false,
    billCardGateDone: false,
    billPickCardId: null,
    billGateDraftCardId: null,
    billSlips: [], // [{ id, cardIds: [] }]
    billDraft: null, // { id, cardIds: [] } | null
    billComposerMode: 'browse', // browse | drafting | review
    billPickCardIds: [], // single-select (0 or 1 id) while composing
    billHeldCardsToolsOpen: false,
    billActionTab: null, // 'card' | 'quick' | null(=auto)
    billQuickAmtDraft: '',
    billCardRailScrollLeft: 0,
    billTimesTicketCardId: null,
    billTimesTicketQty: 1,
    billTimesTicketStaffDraft: null,
    benefitFocusLineId: null,
    linkedCardIds: [],
    billRechargeCardId: null,
    billRechargeAmount: '',
    billRechargeGift: '',
    billRechargeDue: '',
    billRechargeDueTouched: false,
    billTimesCardId: null,
    billTimesAdds: {},
    billTimesDue: '',
    billTimesDueTouched: false,
    billExtendCardId: null,
    billExtendUnit: 'month',
    billExtendAmount: '1',
    billExtendFee: '',
    billExtendFeeTouched: false,
    billExtendDue: '',
    billExtendDueTouched: false,
    billAssetPay: null,
    benefitDraft: {},
    benefitApplied: {},
    technician: '未指定',
    cashierId: null,
    billWizardStep: 'customer',
    billStaffExpandedId: null,
    billStaffSheetCartId: null,
    payChannel: 'alipay',
    payAmounts: {},
    payManualEdit: {},
    payActiveAmtId: null,
    payEditingId: null,
    lastSettlement: null,
    lastFlowOrderId: null,
    flowTab: 'all',
    flowDetailId: null,
    flowDetailExpanded: false,
    flowFromSuccess: false,
    flowFilter: { date: 'all', pay: 'all', guest: 'all', customStart: '', customEnd: '' },
    flowFilterDraft: null,
    flowSelfCustomStart: '',
    flowSelfCustomEnd: '',
    flowRangeContext: null,
    flowRangeDraftStart: '',
    flowRangeDraftEnd: '',
    flowRangeCalFocus: 'start',
    flowRangeCalYear: null,
    flowRangeCalMonth: null,
    flowRefundSelected: [],
    flowEditDraft: null,
    flowEditAddTab: 'project',
    flowEditAddSelected: [],
    flowEditItemId: null,
    flowEditAddCardSeg: 'issue',
    flowEditAddCardId: null,
    flowEditAddCardTpls: [],
    flowEditAddAmount: 1000,
    flowEditReplaceItemId: null,
    flowSelfDetailId: null,
    flowSelfDetailReturn: null,
    flowSelfDate: 'today',
    flowSelfStatus: 'all',
    flowSelfDd: null,
    flowNavHighlight: null,
    addCardMode: 'new',
    selectedTemplateId: null,
    cardIssuePayAmount: null,
    cardIssuePayTemplateId: null,
    cardIssuePayEdited: false,
    selectedCouponId: null,
    couponDraftId: null,
    couponRulesOpen: {},
    settleOffersTouched: false,
    billBizDate: '',
    billBizDateDraft: '',
    billBizCalYear: null,
    billBizCalMonth: null,
    billDateSheetKind: 'bill',
    manualOrderNo: '',
    heldOrders: [],
    billFromHold: false,
    activeHoldId: null,
    billDueEdited: false,
    /** 结算应付手动覆盖：有值时即为最终应付，不再按行价/抵扣重算 */
    billDueOverride: null,
    payDueSnapshot: null,
    guestGender: null,
    guestGenderPickerOpen: false,
    billCustomerPickOpen: false,
    orderRemark: '',
    detailExpandedId: null,
    staffCardEdit: null,
    issueStaffDraft: null,
    benefitSkip: false,
    voiceCollect: true,
    discountCats: JSON.parse(JSON.stringify(DISCOUNT_CATS_DEFAULT)),
    pendingOpenCard: null,
    cardIssuePending: null,
    cardExtendPending: null,
    orderIsFree: false,
    successIssueTemplateId: null,
    successIssueCardHtml: '',
    lastIssueFromCardMgmt: false,
    lastRefundResult: null,
    payMembercardCardId: null,
    pickLetter: 'C',
    pickAvailableLetters: [],
  };

  const PICK_INDEX_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

  let toastTimer = null;

  function iconCheckSvg(className) {
    const cls = className ? ` class="${className}"` : '';
    return `<svg${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>`;
  }

  /** 面性图标：不使用优惠券/权益（莫兰迪红）· 人工打折（莫兰迪蓝） */
  function offerActionIconHtml(kind) {
    let inner = '';
    if (kind === 'coupon-none' || kind === 'benefit-none') {
      /* 圆内减号 ⊖：取消选用（方案 C） */
      inner = '<path fill="currentColor" fill-rule="evenodd" d="M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5ZM7.5 11.1h9a.9.9 0 1 1 0 1.8h-9a.9.9 0 1 1 0-1.8Z"/>';
    } else if (kind === 'manual-discount') {
      /* 圆标 %（挖空） */
      inner = '<path fill="currentColor" fill-rule="evenodd" d="M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5ZM9.1 7.6a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3Zm5.8 5.5a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3ZM8.05 16.2a.9.9 0 0 1 .05-1.27l6.8-6.8a.9.9 0 1 1 1.27 1.27l-6.8 6.8a.9.9 0 0 1-1.32 0Z"/>';
    } else {
      return '';
    }
    return `<span class="offer-btn-icon offer-btn-icon--${kind}" aria-hidden="true"><svg viewBox="0 0 24 24">${inner}</svg></span>`;
  }

  function iconSvg(kind, className) {
    const cls = className ? ` class="${className}"` : '';
    const common = `${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;
    switch (kind) {
      case 'chevron-right':
        return `<svg${common}><path d="m9 18 6-6-6-6"/></svg>`;
      case 'chevron-down':
        return `<svg${common}><path d="m6 9 6 6 6-6"/></svg>`;
      case 'chevron-up':
        return `<svg${common}><path d="m18 15-6-6-6 6"/></svg>`;
      case 'close':
        return `<svg${cls} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M14 6L6 14M14 14L6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;
      case 'edit':
        /* 圆角实心铅笔 · 可编辑示意（面性） */
        return filledEditPencilSvg(className);
      case 'trash':
        /* 偏胖描边垃圾桶 · 独立 stroke，避免沿用细线 common */
        return `<svg${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6.5h18"/><path d="M9.5 6.5V4.8c0-.7.56-1.3 1.25-1.3h2.5c.69 0 1.25.6 1.25 1.3v1.7"/><path d="M18.2 6.5 17.2 19.1c0 .95-.8 1.7-1.75 1.7H8.55c-.95 0-1.75-.75-1.75-1.7L5.8 6.5"/><path d="M10 10.5v6"/><path d="M14 10.5v6"/></svg>`;
      case 'info':
        return `<svg${cls} viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M7.5 14.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" stroke="currentColor" stroke-linejoin="round"/><path d="M7.5 10.55a.625.625 0 1 1 0 1.25.625.625 0 0 1 0-1.25Z" fill="currentColor"/><path d="M7.5 3.3v5.6" stroke="currentColor" stroke-linecap="round"/></svg>`;
      case 'plus':
        return `<svg${common}><path d="M12 5v14M5 12h14"/></svg>`;
      case 'minus':
        return `<svg${common}><path d="M5 12h14"/></svg>`;
      case 'calendar':
        return `<svg${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/><path d="m9.2 14.2 1.8 1.7 3.6-3.5"/></svg>`;
      default:
        return '';
    }
  }

  /** 圆角实心铅笔（面性），开单可编辑字段统一使用 */
  function filledEditPencilSvg(className) {
    const cls = className ? ` class="${className}"` : '';
    return `<svg${cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14.92 3.08a2.35 2.35 0 0 1 3.32 0l2.68 2.68a2.35 2.35 0 0 1 0 3.32L9.28 20.72c-.24.24-.54.4-.87.46l-4.78 1.12a1.12 1.12 0 0 1-1.35-1.35l1.12-4.78c.06-.33.22-.63.46-.87L14.92 3.08Z"/><path d="M16.2 4.55c.2-.2.52-.2.72 0l2.53 2.53c.2.2.2.52 0 .72l-.9.9-3.25-3.25.9-.9Z" opacity=".35"/></svg>`;
  }

  function formatYen(n) {
    const v = Math.round((Number(n) || 0) * 100) / 100;
    const s = v.toFixed(2).replace(/\.?0+$/, m => (m.includes('.') ? m.replace(/0+$/, '').replace(/\.$/, '') : ''));
    return '¥' + (s || '0');
  }
  function formatYenParts(n) {
    const raw = formatYen(n).replace(/^¥/, '') || '0';
    return `<span class="yen">¥</span><span class="val">${raw}</span>`;
  }
  function formatPriceParts(n) {
    const v = Math.round((Number(n) || 0) * 100) / 100;
    const [intPart, dec] = v.toFixed(2).split('.');
    const showDec = dec !== '00';
    return `<span class="yen">¥</span>${intPart}${showDec ? `<span class="dec">.${dec.replace(/0+$/, '')}</span>` : ''}`;
  }
  function round2(n) { return Math.round(n * 100) / 100; }
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function showToast(msg) {
    const el = document.getElementById('billToastMsg');
    if (!el) { if (typeof window.toast === 'function') window.toast(msg); return; }
    el.textContent = msg;
    el.classList.remove('hidden');
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.classList.remove('show'); el.classList.add('hidden'); }, 2500);
  }
  function showOnlyScreen(id) {
    /* 切屏时收起「已选」抽屉，避免盖在详情等页面上残留 */
    closeMask('cartSheetMask');
    closeMask('guestRecordMask');
    /* 开单页不应残留办卡成功的绿色渐变底 */
    document.querySelector('.phone-shell')?.classList.remove('phone-shell--success', 'phone-shell--issue-success');
    document.querySelectorAll('.phone .screen').forEach(el => el.classList.toggle('hidden', el.id !== id));
    if (id === 'screen-success' && state.lastIssueFromCardMgmt && typeof renderSuccess === 'function') {
      renderSuccess();
    }
    if (window.CardHost && window.CardHost.onBillingScreen) window.CardHost.onBillingScreen(id);
    else syncFlowMapFromAppState();
  }
  function closeMask(id, opts) {
    const keepCardIssueDraft = !!(opts && opts.keepCardIssueDraft);
    const keepCardExtendDraft = !!(opts && opts.keepCardExtendDraft);
    document.getElementById(id)?.classList.remove('open');
    if (id === 'checkoutMask' && state.cardIssuePending && !keepCardIssueDraft) {
      state.cardIssuePending = null;
      state.pendingOpenCard = null;
      resetCardIssuePayState();
      state.orderIsFree = false;
      state.successIssueTemplateId = null;
      state.successIssueCardHtml = '';
      state.lastIssueFromCardMgmt = false;
      state.payAmounts = {};
    }
    if (id === 'payMask' && state.cardExtendPending && !keepCardExtendDraft) {
      state.cardExtendPending = null;
      state.pendingOpenCard = null;
      state.orderIsFree = false;
      state.successIssueTemplateId = null;
      state.successIssueCardHtml = '';
      state.lastIssueFromCardMgmt = false;
      state.payAmounts = {};
    }
    if (id === 'payMask' && state.billAssetPay) {
      state.billAssetPay = null;
      state.payAmounts = {};
      state.payManualEdit = {};
    }
  }
  function openMask(id) { document.getElementById(id)?.classList.add('open'); }
  function isAnonymousGuest(c) {
    return !c || c.id === 'guest' || c.id === 'guest_m' || c.id === 'guest_f';
  }
  function isNamedWalkIn(c) {
    return !!(c && !c.isMember && String(c.id || '').startsWith('w_'));
  }
  function isGuestCustomer(c) {
    return isAnonymousGuest(c) || isNamedWalkIn(c);
  }
  function maskPhone(phone) {
    const p = String(phone || '').replace(/\D/g, '');
    if (p.length === 11) return p.slice(0, 3) + '****' + p.slice(7);
    return String(phone || '');
  }
  function formatWalkInName(raw, gender) {
    const s = String(raw || '').trim();
    if (!s) return '';
    if (/[先生小姐女士]$/.test(s)) return s;
    if (s.length === 1) return s + (gender === 'male' ? '先生' : '小姐');
    return s;
  }
  function hasGuestGender() {
    return state.guestGender === 'male' || state.guestGender === 'female';
  }
  function currentGuest() {
    if (state.guestGender === 'male') return GUEST_MALE;
    if (state.guestGender === 'female') return GUEST_FEMALE;
    return GUEST_UNSET;
  }
  function getCustomer() {
    if (!state.customer) return currentGuest();
    if (isAnonymousGuest(state.customer)) return currentGuest();
    return state.customer;
  }
  function syncBillBackChrome() {
    const btn = document.getElementById('billBack');
    if (!btn) return;
    btn.classList.remove('hidden');
    btn.setAttribute('aria-hidden', 'false');
    let label = '返回选择顾客';
    if (state.billFromHold) label = '返回挂单列表';
    btn.setAttribute('aria-label', label);
  }

  function enterBillUnselected() {
    state.guestGender = null;
    state.guestGenderPickerOpen = false;
    state.billCustomerPickOpen = false;
    state.billFromHold = false;
    state.activeHoldId = null;
    resetBillBizDate();
    openBillCustomer({ reset: true });
  }

  const BILL_WIZARD_STEPS = [
    { id: 'customer', label: '顾客' },
    { id: 'catalog', label: '点单' },
    { id: 'settle', label: '结算' },
  ];

  function ensureCashierId() {
    const pool = getStaffPool();
    const sessionId = (window.RTBPerm && typeof window.RTBPerm.getSessionStaffId === 'function')
      ? window.RTBPerm.getSessionStaffId()
      : null;
    if (sessionId && pool.some(s => s.id === sessionId)) {
      state.cashierId = sessionId;
      return state.cashierId;
    }
    if (state.cashierId && pool.some(s => s.id === state.cashierId)) return state.cashierId;
    state.cashierId = (pool[0] && pool[0].id) || null;
    return state.cashierId;
  }

  function getCashierStaff() {
    const id = ensureCashierId();
    return getStaffPool().find(s => s.id === id) || null;
  }

  function renderBillStepBar(activeId) {
    const idx = BILL_WIZARD_STEPS.findIndex(s => s.id === activeId);
    const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l5 5L20 7"/></svg>';
    return BILL_WIZARD_STEPS.map((s, i) => {
      const on = s.id === activeId;
      const done = i < idx;
      const cls = `bill-step-bar__item${on ? ' on' : ''}${done ? ' is-done' : ''}`;
      const dotInner = done ? checkSvg : String(i + 1);
      return `<div class="${cls}" data-bill-step="${escapeHtml(s.id)}">` +
        `<span class="bill-step-bar__dot">${dotInner}</span>` +
        `<span class="bill-step-bar__label">${escapeHtml(s.label)}</span></div>`;
    }).join('');
  }

  function syncBillStepBars(activeId) {
    state.billWizardStep = activeId;
    if (typeof setFlowNavHighlight === 'function') {
      const map = { customer: 'bill-pick', catalog: 'bill-bill', settle: 'bill-detail' };
      if (map[activeId]) setFlowNavHighlight(map[activeId]);
    }
  }

  function openBillCustomer(opts) {
    opts = opts || {};
    if (opts.reset) {
      state.customer = GUEST_UNSET;
      state.guestGender = null;
      state.cardsExpanded = false;
      resetBillCardPick();
    }
    ensureCashierId();
    state.guestGenderPickerOpen = false;
    state.billCustomerPickOpen = false;
    state.billCardGateOpen = false;
    syncPickHoldsEntry();
    state.searchQuery = '';
    const search = document.getElementById('pickSearch');
    if (search) search.value = '';
    renderCustomerList();
    syncBillStepBars('customer');
    showOnlyScreen('screen-pick');
  }

  /** 只设顾客，不跳屏 */
  function enterBillCustomerOnly(customer) {
    state.guestGenderPickerOpen = false;
    state.billCustomerPickOpen = false;
    state.billFromHold = false;
    state.activeHoldId = null;
    if (isAnonymousGuest(customer)) {
      if (customer && (customer.gender === 'male' || customer.gender === 'female')) state.guestGender = customer.gender;
      state.customer = currentGuest();
    } else {
      if (customer && customer.isMember) refreshCustomerCardsFromHoldings(customer);
      state.customer = customer;
      if (customer && (customer.gender === 'male' || customer.gender === 'female')) state.guestGender = customer.gender;
      else if (customer && customer.isMember) state.guestGender = null;
    }
  }

  function openBillCatalog(opts) {
    opts = opts || {};
    if (typeof ensureDemoFilled === 'function') ensureDemoFilled();
    ensureCashierId();
    if (!state.customer) enterBillCustomerOnly(GUEST_UNSET);
    if (opts.resetCardPick) resetBillCardPick();
    if (opts.resetSlips) resetBillSlipState();
    state.billCardGateOpen = false;
    state.billCardGateDone = true;
    state.billGateDraftCardId = null;
    state.billCustomerPickOpen = false;
    renderBillHeader();
    syncCartChrome();
    syncPickHoldsEntry();
    syncBillBackChrome();
    syncBillCardGateChrome();
    syncBillStepBars('catalog');
    syncBillDateLabels();
    showOnlyScreen('screen-bill');
  }

  function resetBillCardPick() {
    state.billCardGateOpen = false;
    state.billCardGateDone = false;
    state.billPickCardId = null;
    state.billGateDraftCardId = null;
    resetBillSlipState();
  }

  function resetBillSlipState() {
    state.billSlips = [];
    state.billDraft = null;
    state.billPickCardIds = [];
    state.billComposerMode = 'browse';
    state.billHeldCardsToolsOpen = false;
    state.billActionTab = null;
    state.billQuickAmtDraft = '';
    state.billCardRailScrollLeft = 0;
    state.benefitFocusLineId = null;
  }

  function syncBillComposerMode() {
    const draft = state.billDraft;
    const draftLines = draft ? getDraftLines() : [];
    if (draft && draftLines.length) state.billComposerMode = 'drafting';
    else if ((state.billSlips || []).length && !draft) state.billComposerMode = 'review';
    else if (draft) state.billComposerMode = 'drafting';
    else state.billComposerMode = 'browse';
    return state.billComposerMode;
  }

  function ensureBillDraft() {
    if (state.billDraft) return state.billDraft;
    state.billDraft = {
      id: 'slip_' + Date.now(),
      cardIds: (state.billPickCardIds || []).slice(),
    };
    state.billComposerMode = 'drafting';
    return state.billDraft;
  }

  function getSlipLines(slipId) {
    if (!slipId) return [];
    return (state.cart || []).filter(it => it && it.slipId === slipId);
  }

  function getDraftLines() {
    return state.billDraft ? getSlipLines(state.billDraft.id) : [];
  }

  function slipSubtotal(slipId) {
    return round2(getSlipLines(slipId).reduce((s, it) => s + lineUnit(it) * it.qty, 0));
  }

  function sealBillDraft() {
    const draft = state.billDraft;
    if (!draft) return false;
    const lines = getDraftLines();
    if (!lines.length) {
      showToast('请先添加商品');
      return false;
    }
    state.billSlips.push({
      id: draft.id,
      cardIds: (draft.cardIds || state.billPickCardIds || []).slice(),
    });
    state.billDraft = null;
    state.billPickCardIds = [];
    state.billComposerMode = 'review';
    return true;
  }

  function continueAddBillSlip() {
    state.billComposerMode = 'browse';
    state.billDraft = null;
    state.billPickCardIds = [];
    state.billTab = 'project';
    state.billGroupId = { project: 'all', product: 'all' };
    state.billHeldCardsToolsOpen = false;
  }

  function unsealSlipForEdit(slipId) {
    if (!slipId) return false;
    const idx = (state.billSlips || []).findIndex(s => s.id === slipId);
    if (idx < 0) return false;
    if (state.billDraft && getDraftLines().length) {
      if (!sealBillDraft()) return false;
    }
    const slip = state.billSlips[idx];
    state.billSlips.splice(idx, 1);
    state.billDraft = { id: slip.id, cardIds: (slip.cardIds || []).slice() };
    state.billPickCardIds = (slip.cardIds || []).slice();
    state.billComposerMode = 'drafting';
    return true;
  }

  function deleteBillSlip(slipId) {
    if (!slipId) return false;
    if (!window.confirm('确定删除该记账单？')) return false;
    const idx = (state.billSlips || []).findIndex(s => s.id === slipId);
    if (idx < 0) return false;
    state.cart = (state.cart || []).filter(it => it.slipId !== slipId);
    state.billSlips.splice(idx, 1);
    clearBillDueOverride();
    syncBillComposerMode();
    renderBillHeader();
    syncCartChrome();
    showToast('已删除记账单');
    return true;
  }

  function getActiveBillPickCardIds() {
    let ids = (state.billDraft && Array.isArray(state.billDraft.cardIds))
      ? state.billDraft.cardIds
      : (state.billPickCardIds || []);
    if (!Array.isArray(ids)) ids = [];
    /* 选卡改为单选：历史多选草稿收敛为首张 */
    if (ids.length > 1) {
      ids = [ids[0]];
      state.billPickCardIds = ids.slice();
      if (state.billDraft) state.billDraft.cardIds = ids.slice();
      state.billPickCardId = ids[0];
    }
    return ids;
  }

  function toggleBillPickCard(cardId) {
    if (!cardId) return;
    const ids = getActiveBillPickCardIds();
    const selected = ids.length === 1 && ids[0] === cardId;
    const next = selected ? [] : [cardId];
    state.billPickCardIds = next;
    state.billPickCardId = next[0] || null;
    if (state.billDraft) state.billDraft.cardIds = next.slice();
    if (next[0]) syncBillTabForSelectedCard(findHeldCardById(next[0]));
    else state.billTab = 'project';
    renderBillHeader();
    syncCartChrome();
  }

  function ensureBillActionTab() {
    if (state.billActionTab === 'card' || state.billActionTab === 'quick') return state.billActionTab;
    const c = getCustomer();
    const hasCards = !!(c && c.isMember && (c.cards || []).length);
    state.billActionTab = hasCards ? 'card' : 'quick';
    return state.billActionTab;
  }

  function setBillActionTab(tab) {
    if (tab !== 'card' && tab !== 'quick') return;
    state.billActionTab = tab;
    renderBillHeader();
  }

  function hasBillCardSelected() {
    return getActiveBillPickCardIds().length > 0;
  }

  function renderBillCatalogBlock(opts) {
    opts = opts || {};
    const cls = opts.scope ? 'bill-action__scope' : 'bill-sheet';
    const kinds = opts.scope
      ? getSelectedCardCatalogKinds()
      : { project: true, product: true, hideTabs: false };
    /* 单品类适用：隐藏 Tab，仅展示适用侧 */
    if (opts.scope && kinds.hideTabs) {
      if (kinds.product && !kinds.project) state.billTab = 'product';
      else if (kinds.project && !kinds.product) state.billTab = 'project';
    }
    const tabsHtml = kinds.hideTabs
      ? ''
      : `<div class="page-tabs">
        <button type="button" class="page-tabs__item ${state.billTab === 'project' ? 'on' : ''}" data-tab="project">项目</button>
        <button type="button" class="page-tabs__item ${state.billTab === 'product' ? 'on' : ''}" data-tab="product">产品</button>
      </div>`;
    return `<div class="${cls}">
      ${tabsHtml}
      <div class="catalog-group-bar pick-group-bar bill-group-bar" id="billGroupBar">
        <div class="catalog-group-segment">
          <div class="catalog-group-scroll" id="billGroupTabs" role="tablist" aria-label="价目分组"></div>
          <div class="catalog-group-fade" aria-hidden="true"></div>
        </div>
      </div>
      <div class="catalog-list" id="catalogList"></div>
    </div>`;
  }

  function captureBillCardRailScroll() {
    const rail = document.getElementById('billCardRailScroll');
    if (rail) state.billCardRailScrollLeft = rail.scrollLeft;
  }

  function restoreBillCardRailScroll() {
    const rail = document.getElementById('billCardRailScroll');
    if (!rail) return;
    const x = Math.max(0, Number(state.billCardRailScrollLeft) || 0);
    rail.scrollLeft = x;
    /* 内容变短时钳制，并回写 */
    state.billCardRailScrollLeft = rail.scrollLeft;
  }

  function wireBillCardRailScroll(el) {
    if (!el || el.dataset.railWired === '1') return;
    el.dataset.railWired = '1';
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let startScroll = 0;
    let axis = null;
    let moved = false;
    const THRESHOLD = 6;
    const persist = () => { state.billCardRailScrollLeft = el.scrollLeft; };
    el.addEventListener('scroll', persist, { passive: true });
    el.addEventListener('pointerdown', e => {
      if (e.button != null && e.button !== 0) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      startScroll = el.scrollLeft;
      axis = null;
      moved = false;
    });
    el.addEventListener('pointermove', e => {
      if (pointerId == null || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!axis) {
        if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
        axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
        if (axis === 'x') {
          el.classList.add('is-panning');
          try { el.setPointerCapture(pointerId); } catch (_) { /* ignore */ }
        }
      }
      if (axis !== 'x') return;
      moved = true;
      el.scrollLeft = startScroll - dx;
      persist();
      e.preventDefault();
    }, { passive: false });
    const endPan = e => {
      if (pointerId == null || (e && e.pointerId !== pointerId)) return;
      if (axis === 'x') {
        try { el.releasePointerCapture(pointerId); } catch (_) { /* ignore */ }
        persist();
        /* 延后清 is-panning，避免同次手势触发 click 选卡 */
        setTimeout(() => el.classList.remove('is-panning'), 0);
      }
      pointerId = null;
      axis = null;
    };
    el.addEventListener('pointerup', endPan);
    el.addEventListener('pointercancel', endPan);
    el.addEventListener('click', e => {
      if (moved || el.classList.contains('is-panning')) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    }, true);
  }

  function renderBillCardRail() {
    const cards = (getCustomer().cards || []);
    const activeIds = getActiveBillPickCardIds();
    const hasSel = activeIds.length > 0;
    const plusSvg = '<svg class="bill-held-card__plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
    const items = cards.map(card => {
      const on = activeIds[0] === card.id;
      const dim = hasSel && !on;
      const isTicket = isTimesTicketCard(card);
      if (isTicket) {
        const rem = getTimesTicketRemain(card);
        return `<button type="button" class="bill-held-card bill-held-card--ticket${on ? ' is-on' : ''}${dim ? ' is-dim' : ''}" data-bill-times-ticket="${escapeHtml(card.id)}" aria-label="${escapeHtml(card.name)} 剩 ${rem} 次">
          <span class="bill-held-card__face" aria-hidden="true"><span class="bill-held-card__face-head">剩 ${rem} 次</span><span class="bill-held-card__face-body"></span></span>
          <span class="bill-held-card__name">${escapeHtml(card.name)}</span>
        </button>`;
      }
      const tid = heldTemplateId(card);
      const tpl = (typeof getTemplateById === 'function' && tid) ? getTemplateById(tid) : (CARD_TPL_BY_ID[tid] || null);
      const colorKey = (card.cardColor || (tpl && tpl.cardColor) || 'brand_red');
      const theme = (typeof getCardTheme === 'function')
        ? getCardTheme(colorKey)
        : { gradient: '#E8E8E8' };
      const grad = theme.gradient || '#E8E8E8';
      return `<button type="button" class="bill-held-card${on ? ' is-on' : ''}${dim ? ' is-dim' : ''}" data-bill-held-card="${escapeHtml(card.id)}" aria-pressed="${on ? 'true' : 'false'}">
        <span class="bill-held-card__face" aria-hidden="true"><span class="bill-held-card__face-head" style="background:${grad}"></span><span class="bill-held-card__face-body"></span></span>
        <span class="bill-held-card__name">${escapeHtml(card.name)}</span>
      </button>`;
    });
    items.push(`<button type="button" class="bill-held-card bill-held-card--add" data-bill-add-card aria-label="为客户办卡">
      <span class="bill-held-card__face" aria-hidden="true">${plusSvg}</span>
      <span class="bill-held-card__name">办卡</span>
    </button>`);
    const empty = !cards.length
      ? '<p class="bill-held-cards__empty">暂无会员卡，可点右侧「办卡」添加</p>'
      : '';
    return `${empty}<div class="bill-card-rail">
      <div class="bill-card-rail__scroll" id="billCardRailScroll">${items.join('')}</div>
      <div class="bill-card-rail__fade" aria-hidden="true"></div>
    </div>`;
  }

  function renderBillQuickPanel() {
    const amt = state.billQuickAmtDraft != null ? String(state.billQuickAmtDraft) : '';
    return `<div class="bill-quick-row">
      <input type="text" class="bill-quick-row__input input-amount${!amt ? ' is-empty' : ''}" id="billQuickAmt" readonly inputmode="decimal" placeholder="输入消费金额" value="${amt ? escapeHtml(amt) : ''}" aria-label="直接收款金额">
      <button type="button" class="bill-quick-row__add" id="btnBillQuickAdd">添加</button>
    </div>`;
  }

  function isTimesTicketCard(card) {
    return !!(card && (card.kind === 'times_ticket' || card.isTimesTicket));
  }

  function getTimesTicketRemain(card) {
    if (!card) return 0;
    const slot = (card.projects || [])[0];
    return Math.max(0, Number(slot && slot.remain) || 0);
  }

  function getTimesTicketRedeemName(card) {
    if (!card) return '';
    return String(card.redeemName || (card.projects && card.projects[0] && (card.projects[0].label || card.projects[0].key)) || card.name || '').trim();
  }

  function preserveTimesTickets(prevCards, nextCards) {
    const out = (nextCards || []).slice();
    const ids = new Set(out.map(c => c && c.id));
    (prevCards || []).filter(isTimesTicketCard).forEach(t => {
      if (t && t.id && !ids.has(t.id)) {
        out.push(t);
        ids.add(t.id);
      }
    });
    return out;
  }

  function buildTimesTicketCard({ customerId, catalogProjectId, name, redeemName, remain }) {
    const rid = String(redeemName || name || '').trim();
    return normalizeHeldCard({
      id: `tt_${catalogProjectId}_${customerId}`,
      kind: 'times_ticket',
      isTimesTicket: true,
      catalogProjectId,
      name: name || rid,
      redeemName: rid,
      balance: 0,
      benefits: { balance: false, timesOrValidity: true, products: false, projectDiscount: false },
      projects: [{ key: rid, label: rid, remain: Math.max(0, Number(remain) || 0), matchKeys: [rid] }],
      cardColor: 'brand_red',
    });
  }

  function ensureDemoTimesTickets() {
    /* 扣次卡改由会员卡「独立计次」持卡投影，不再从价目计次项目铸造 */
  }

  function mintTimesTicketsFromCart() {
    /* no-op：扣次卡随办卡持仓产生，不在购物车售出后铸造 */
  }

  function openTimesTicketDeductSheet(cardId) {
    const card = findHeldCardById(cardId);
    if (!isTimesTicketCard(card)) return;
    const rem = getTimesTicketRemain(card);
    if (rem <= 0) {
      showToast('该票卡次数已用完', true);
      return;
    }
    state.billTimesTicketCardId = card.id;
    state.billTimesTicketQty = 1;
    resetTimesTicketStaffDraft();
    const titleEl = document.getElementById('billTimesTicketTitle');
    if (titleEl) titleEl.textContent = `扣次·${card.name || '扣次卡'}`;
    const meta = document.getElementById('billTimesTicketMeta');
    if (meta) {
      meta.innerHTML = `<div class="bill-ticket-deduct-meta__remain">余 <strong>${rem}</strong> 次</div>`;
    }
    syncTimesTicketDeductStep();
    renderTimesTicketStaffRow();
    openMask('billTimesTicketMask');
  }

  function syncTimesTicketDeductStep() {
    const card = findHeldCardById(state.billTimesTicketCardId);
    const rem = getTimesTicketRemain(card);
    let q = Math.max(1, Number(state.billTimesTicketQty) || 1);
    q = Math.min(q, Math.max(1, rem));
    state.billTimesTicketQty = q;
    const nEl = document.getElementById('billTimesTicketQty');
    if (nEl) nEl.textContent = String(q);
    const minus = document.getElementById('btnBillTimesTicketMinus');
    const plus = document.getElementById('btnBillTimesTicketPlus');
    if (minus) minus.disabled = q <= 1;
    if (plus) plus.disabled = q >= rem;
  }

  function submitTimesTicketDeduct() {
    const card = findHeldCardById(state.billTimesTicketCardId);
    if (!isTimesTicketCard(card)) {
      showToast('票卡无效', true);
      return;
    }
    const rem = getTimesTicketRemain(card);
    const qty = Math.max(1, Math.min(rem, Number(state.billTimesTicketQty) || 1));
    if (qty > rem) {
      showToast(`剩余不足，最多 ${rem} 次`, true);
      return;
    }
    const staffRow = getTimesTicketStaffRow();
    ensureCartStaffState(staffRow);
    /* 扣次允许不选员工；若已选且为工位模式则须设完工位 */
    if ((staffRow.staffIds || []).length
      && !isAvgAchCalcModeForItem(staffRow)
      && (staffRow.staffIds || []).some(sid => !staffRow.staffRoles[sid])) {
      showToast('请为已选员工设置工位（' + stationRoleLabelsJoined() + '）', true);
      return;
    }
    const otherItems = (state.cart || []).filter(it => (it.qty || 0) > 0);
    if (otherItems.length) {
      showToast('购物车还有其他商品，请先结账或清空后再扣次', true);
      return;
    }
    const redeemName = getTimesTicketRedeemName(card);
    const totalTimes = Math.max(1, Number(card.issueTotalTimes) || 1);
    const paid = Number(card.issuePaidAmount);
    const unitFromIssue = Number.isFinite(paid) ? round2(paid / totalTimes) : 0;
    const item = {
      id: card.simpleTimesAchId || (`st_${card.templateId || card.id}`),
      name: redeemName || card.name,
      price: unitFromIssue,
      benefitKey: redeemName || card.name,
      category: '独立计次卡',
      isSimpleTimesConsume: true,
    };
    const unit = unitFromIssue;
    state.cart = [{
      ...item,
      qty,
      price: unit,
      unitPrice: unit,
      staffIds: (staffRow.staffIds || []).slice(),
      staffRoles: { ...(staffRow.staffRoles || {}) },
      staffDesignated: { ...(staffRow.staffDesignated || {}) },
      expanded: false,
      slipId: null,
    }];
    state.billDraft = null;
    state.billSlips = [{ id: 'slip_ticket_' + Date.now(), cardIds: [card.id] }];
    state.billPickCardIds = [card.id];
    state.billPickCardId = card.id;
    state.billComposerMode = 'review';
    clearBillDueOverride();
    state.orderIsFree = false;
    state.settleOffersTouched = false;
    state.selectedCouponId = null;
    autoApplyBestSettleOffers();
    /* 强制落在本票卡次数权益 */
    const picks = cloneEmptyBenefitPicks([card]);
    const pick = picks[card.id];
    if (pick && pick.projects && pick.projects[0]) {
      pick.projects[0].qty = qty;
      pick.projects[0].max = rem;
    }
    state.benefitApplied = picks;
    state.benefitSkip = false;
    const s = calcSettlement();
    if (round2(Number(s.dueCash) || 0) > 0.01 && !(s.projectDeduct > 0)) {
      showToast('无法一键抵扣，请走结账', true);
      openBillSettle();
      closeMask('billTimesTicketMask');
      return;
    }
    s.paySplits = [];
    state.payChannel = 'membercard';
    closeMask('billTimesTicketMask');
    completeBillPayFromSettlement(s);
  }

  /** 支付成功入账：扣卡权益 + 写流水 + 成功页 */
  function completeBillPayFromSettlement(s, opts) {
    opts = opts || {};
    const settlement = s || calcSettlement();
    if (!Array.isArray(settlement.paySplits)) settlement.paySplits = [];
    settlement.manualOrderNo = settlement.manualOrderNo || ensureManualOrderNo();
    settlement.billBizDate = settlement.billBizDate || ensureBillBizDate();
    settlement.orderIsFree = !!settlement.orderIsFree;
    state.lastSettlement = settlement;
    if (opts.deductStock) deductProductStockAfterPay();
    mutateCardsAfterPay(settlement);
    mintTimesTicketsFromCart();
    if (!state.lastIssueFromCardMgmt && !state.lastRefundResult) {
      recordFlowOrderFromSettlement(settlement);
    }
    consumeActiveHold();
    state.pendingCatalogAdds = collectPendingCatalogAddsFromCart();
    closeMask('payMask', { keepCardExtendDraft: true });
    closeMask('checkoutMask');
    closeMask('cartSheetMask');
    closeMask('billTimesTicketMask');
    renderSuccess();
    showOnlyScreen('screen-success');
    if ((state.pendingCatalogAdds || []).length) {
      requestAnimationFrame(() => openBillStockToCatalogDialog());
    }
  }

  function renderBillActionPanel() {
    const tab = ensureBillActionTab();
    const cardOn = tab === 'card';
    const selected = hasBillCardSelected();
    let bodyInner = '';
    if (cardOn) {
      bodyInner = renderBillCardRail()
        + (selected ? renderBillCatalogBlock({ scope: true }) : '');
    } else {
      bodyInner = renderBillQuickPanel();
    }
    return `<div class="bill-action" id="billActionPanel">
      <div class="bill-action__tabs" role="tablist" aria-label="开单方式">
        <button type="button" class="bill-action__tab${cardOn ? ' is-on' : ''}" data-bill-action-tab="card" role="tab" aria-selected="${cardOn ? 'true' : 'false'}">选择会员卡</button>
        <button type="button" class="bill-action__tab${!cardOn ? ' is-on' : ''}" data-bill-action-tab="quick" role="tab" aria-selected="${!cardOn ? 'true' : 'false'}">直接收款</button>
      </div>
      <div class="bill-action__body ${cardOn ? 'is-card-tab' : 'is-quick-tab'}">${bodyInner}</div>
    </div>`;
  }

  /** @deprecated kept name for callers — now renders folder action panel */
  function renderBillHeldCardsPicker() {
    return renderBillActionPanel();
  }

  function assignCartItemToDraft(item) {
    if (!item) return;
    const draft = ensureBillDraft();
    item.slipId = draft.id;
  }

  function slipCardChipHtml(cardId) {
    const card = findHeldCardById(cardId);
    if (!card) return '';
    const tid = heldTemplateId(card);
    const tpl = (typeof getTemplateById === 'function' && tid) ? getTemplateById(tid) : (CARD_TPL_BY_ID[tid] || null);
    const colorKey = (card.cardColor || (tpl && tpl.cardColor) || 'brand_red');
    const theme = (typeof getCardTheme === 'function')
      ? getCardTheme(colorKey)
      : { gradient: '#C0C0C0', accent: '#C0C0C0' };
    const swatch = theme.accent || theme.gradient || '#C0C0C0';
    return `<span class="bill-slip__card-chip"><span class="bill-slip__card-dot" style="background:${swatch}"></span>${escapeHtml(card.name)}</span>`;
  }

  function renderBillSlipCard(slip, opts) {
    opts = opts || {};
    if (!slip) return '';
    const isDraft = !!opts.draft;
    const index = opts.index || 1;
    const lines = getSlipLines(slip.id);
    const total = slipSubtotal(slip.id);
    const cardIds = slip.cardIds || [];
    const chips = cardIds.map(slipCardChipHtml).filter(Boolean).join('')
      || '<span class="bill-slip__no-card">未选卡</span>';
    const lineHtml = lines.length
      ? lines.map(it => {
          const quick = isQuickCartItem(it);
          return `<div class="bill-slip__line${quick ? ' bill-slip__line--quick' : ''}">
            <span class="bill-slip__line-name">${escapeHtml(it.name || '')}</span>
            <span class="bill-slip__line-qty">×${it.qty || 1}</span>
            <span class="bill-slip__line-amt">${formatYen(lineUnit(it) * it.qty)}</span>
          </div>`;
        }).join('')
      : '<div class="bill-slip__line"><span class="bill-slip__line-name" style="color:var(--text-sec)">暂无项目</span></div>';
    return `<div class="bill-slip${isDraft ? ' bill-slip--draft' : ''}" data-bill-slip="${escapeHtml(slip.id)}">
      <div class="bill-slip__fold" aria-hidden="true"></div>
      <div class="bill-slip__perforation" aria-hidden="true"></div>
      <div class="bill-slip__head">
        ${isDraft ? '<span class="bill-slip__tag">编辑中</span>' : ''}
        <div class="bill-slip__cards">${chips}</div>
        ${isDraft ? '' : `<button type="button" class="bill-slip__del" data-bill-slip-delete="${escapeHtml(slip.id)}" aria-label="删除记账单">${iconSvg('trash')}</button>`}
      </div>
      <div class="bill-slip__body">${lineHtml}</div>
      <div class="bill-slip__foot">
        <span class="bill-slip__sub">共 ${lines.length} 项</span>
        <span class="bill-slip__total">${formatYen(total)}</span>
      </div>
    </div>`;
  }

  function renderBillSlipStack() {
    const parts = [];
    (state.billSlips || []).forEach((slip, i) => {
      parts.push(renderBillSlipCard(slip, { draft: false, index: i + 1 }));
    });
    if (state.billDraft && getDraftLines().length) {
      parts.push(renderBillSlipCard(state.billDraft, {
        draft: true,
        index: (state.billSlips || []).length + 1,
      }));
    }
    if (!parts.length) return '';
    return `<div class="bill-slip-stack">${parts.join('')}</div>`;
  }

  function shouldOfferBillCardGate() {
    return isMemberBill();
  }

  function getBillPickCard() {
    if (!state.billPickCardId) return null;
    return findHeldCardById(state.billPickCardId);
  }

  function syncBillGateOkBtn() {
    const ok = document.getElementById('btnBillGateOk');
    if (!ok) return;
    const cards = (getCustomer().cards || []);
    if (!cards.length) {
      ok.disabled = false;
      return;
    }
    ok.disabled = !state.billGateDraftCardId;
  }

  function syncBillCardGateChrome() {
    document.getElementById('screen-bill')?.classList.toggle('is-card-gate', false);
    const gateBar = document.getElementById('billGateBar');
    if (gateBar) gateBar.setAttribute('hidden', '');
  }

  function openBillCardGate() {
    if (!shouldOfferBillCardGate()) {
      state.billCardGateOpen = false;
      state.billCardGateDone = true;
      state.billGateDraftCardId = null;
      renderBillHeader();
      syncBillCardGateChrome();
      return;
    }
    state.billCardGateOpen = true;
    state.billCustomerPickOpen = false;
    state.billGateDraftCardId = state.billPickCardId || null;
    renderBillHeader();
    syncBillBackChrome();
    syncBillCardGateChrome();
    syncBillStepBars('catalog');
    showOnlyScreen('screen-bill');
  }

  function getCardCatalogScope(card) {
    if (!card) return { mode: 'all', universal: false };
    const namesProj = new Set();
    const namesProd = new Set();
    const idsProj = new Set();
    const idsProd = new Set();
    const b = cardBenefits(card);
    (card.projects || []).forEach(p => {
      projectBenefitMatchKeys(p).forEach(k => namesProj.add(k));
    });
    const tid = heldTemplateId(card);
    const billTpl = CARD_TPL_BY_ID[tid];
    const fullTpl = (typeof getTemplateById === 'function' && tid) ? getTemplateById(tid) : null;
    const tpl = fullTpl || billTpl;
    (tpl && tpl.projectItems || []).forEach(i => {
      if (i && i.name) namesProj.add(String(i.name));
      if (i && i.id) idsProj.add(String(i.id));
    });
    (tpl && tpl.productItems || []).forEach(i => {
      if (i && i.name) namesProd.add(String(i.name));
      if (i && i.id) idsProd.add(String(i.id));
    });
    /* 纯折扣卡：目录仅显示权益覆盖的项目；有储值面值时仍可浏览全部 */
    if (b.projectDiscount && !b.balance) {
      if (card.discountScopeAll || (tpl && tpl.memberPrices && tpl.memberPrices[MP_BATCH_KEY])) {
        return { mode: 'all', universal: true };
      }
      const discNames = Array.isArray(card.discountProjects)
        ? card.discountProjects
        : Object.keys((tpl && tpl.memberPrices) || {}).filter(k => k !== MP_BATCH_KEY);
      discNames.forEach(n => { if (n) namesProj.add(String(n)); });
    }
    if (namesProj.size || namesProd.size || idsProj.size || idsProd.size) {
      return { mode: 'filter', namesProj, namesProd, idsProj, idsProd };
    }
    return { mode: 'all', universal: true };
  }

  function catalogItemMatchesScope(it, scope, asProduct) {
    if (!scope || scope.mode === 'all') return true;
    if (!it) return false;
    const name = String(it.name || '');
    const key = String(it.benefitKey || it.name || '');
    const id = String(it.id || '');
    if (asProduct) return scope.namesProd.has(name) || scope.idsProd.has(id);
    return scope.namesProj.has(name) || scope.namesProj.has(key) || scope.idsProj.has(id);
  }

  function getSelectedCardCatalogKinds() {
    if (!hasBillCardSelected()) {
      return { project: true, product: true, hideTabs: false };
    }
    const card = findHeldCardById(getActiveBillPickCardIds()[0]);
    if (!card) return { project: true, product: true, hideTabs: false };
    const scope = getCardCatalogScope(card);
    if (!scope || scope.mode === 'all') {
      return { project: true, product: true, hideTabs: false };
    }
    const bridge = window.CardCatalogBridge;
    const projects = bridge?.getBillProjects?.() || PROJECTS;
    const products = bridge?.getBillProducts?.() || PRODUCTS;
    let projN = 0;
    let prodN = 0;
    (projects || []).forEach(it => { if (catalogItemMatchesScope(it, scope, false)) projN += 1; });
    (products || []).forEach(it => { if (catalogItemMatchesScope(it, scope, true)) prodN += 1; });
    const hasProj = projN > 0;
    const hasProd = prodN > 0;
    if (hasProj && !hasProd) return { project: true, product: false, hideTabs: true };
    if (!hasProj && hasProd) return { project: false, product: true, hideTabs: true };
    return { project: true, product: true, hideTabs: false };
  }

  /** 选中卡仅适用产品、无适用项目时，价目默认切到「产品」 */
  function syncBillTabForSelectedCard(card) {
    if (!card) {
      state.billTab = 'project';
      return;
    }
    const kinds = (() => {
      const scope = getCardCatalogScope(card);
      if (!scope || scope.mode === 'all') return { project: true, product: true };
      const bridge = window.CardCatalogBridge;
      const projects = bridge?.getBillProjects?.() || PROJECTS;
      const products = bridge?.getBillProducts?.() || PRODUCTS;
      let projN = 0;
      let prodN = 0;
      (projects || []).forEach(it => { if (catalogItemMatchesScope(it, scope, false)) projN += 1; });
      (products || []).forEach(it => { if (catalogItemMatchesScope(it, scope, true)) prodN += 1; });
      return { project: projN > 0, product: prodN > 0 };
    })();
    if (!kinds.project && kinds.product) state.billTab = 'product';
    else state.billTab = 'project';
  }

  function countCardScopeItems(card) {
    const scope = getCardCatalogScope(card);
    if (scope.mode === 'all') return null;
    const bridge = window.CardCatalogBridge;
    const projects = bridge?.getBillProjects?.() || PROJECTS;
    const products = bridge?.getBillProducts?.() || PRODUCTS;
    let n = 0;
    projects.forEach(it => { if (catalogItemMatchesScope(it, scope, false)) n += 1; });
    products.forEach(it => { if (catalogItemMatchesScope(it, scope, true)) n += 1; });
    return n;
  }

  function countCartOutsideCardScope(cardId) {
    if (!cardId) return 0;
    const card = findHeldCardById(cardId);
    if (!card) return 0;
    const scope = getCardCatalogScope(card);
    if (scope.mode === 'all') return 0;
    return state.cart.filter(it => !catalogItemMatchesScope(it, scope, isBillProductItem(it))).length;
  }

  function pruneCartOutsideCardScope(cardId) {
    if (!cardId) return 0;
    const card = findHeldCardById(cardId);
    if (!card) return 0;
    const scope = getCardCatalogScope(card);
    if (scope.mode === 'all') return 0;
    const before = state.cart.length;
    state.cart = state.cart.filter(it => catalogItemMatchesScope(it, scope, isBillProductItem(it)));
    return before - state.cart.length;
  }

  function finishBillCardGate(opts) {
    opts = opts || {};
    const nextId = opts.skip ? null : (opts.cardId || null);
    if (!opts.skip && nextId && !findHeldCardById(nextId)) {
      showToast('会员卡不存在', true);
      return;
    }
    const removedNeed = nextId ? countCartOutsideCardScope(nextId) : 0;
    if (removedNeed > 0 && !opts.force) {
      if (!window.confirm(`切换后将移除不适用商品（${removedNeed}）`)) return;
    }
    if (nextId) pruneCartOutsideCardScope(nextId);
    state.billPickCardId = nextId;
    state.billGateDraftCardId = null;
    state.billCardGateDone = true;
    state.billCardGateOpen = false;
    if (nextId) syncBillTabForSelectedCard(findHeldCardById(nextId));
    else state.billTab = 'project';
    renderBillHeader();
    syncCartChrome();
    syncBillCardGateChrome();
    showToast(nextId ? `已选用 ${findHeldCardById(nextId).name}` : '已跳过选卡 · 可浏览全部');
  }

  function filterBillCatalogByCard(list) {
    const ids = getActiveBillPickCardIds();
    if (!ids || !ids.length) return list;
    const scopes = ids.map(id => getCardCatalogScope(findHeldCardById(id))).filter(Boolean);
    if (!scopes.length) return list;
    if (scopes.some(s => s.mode === 'all')) return list;
    const asProduct = state.billTab === 'product';
    return list.filter(it => scopes.some(scope => catalogItemMatchesScope(it, scope, asProduct)));
  }

  function renderBillCardModeStrip() {
    if (!shouldOfferBillCardGate() || !state.billCardGateDone) return '';
    const tools = `<div class="bill-card-mode__tools">
      <button type="button" class="bill-card-mode__tool" id="btnBillCardAsset">充卡/续卡</button>
      <button type="button" class="bill-card-mode__tool" id="btnBillAddCard">添加卡</button>
    </div>`;
    const card = getBillPickCard();
    if (card) {
      const scope = getCardCatalogScope(card);
      const n = countCardScopeItems(card);
      const sub = scope.mode === 'all'
        ? '储值通用 · 显示全部项目/产品'
        : `适用 ${n == null ? 0 : n} 项 · 已筛选目录`;
      return `<div class="bill-card-mode" id="billCardMode">
        <div class="bill-card-mode__body">
          <div class="bill-card-mode__main">
            <span class="bill-card-mode__mark" aria-hidden="true"></span>
            <div style="min-width:0">
              <div class="bill-card-mode__title">${escapeHtml(card.name)}</div>
              <div class="bill-card-mode__sub">${escapeHtml(sub)}</div>
            </div>
          </div>
          <div class="bill-card-mode__acts">
            <button type="button" class="bill-card-mode__act" data-bill-card-change>更换</button>
            <button type="button" class="bill-card-mode__act is-muted" data-bill-card-clear>不限卡</button>
          </div>
        </div>
        ${tools}
      </div>`;
    }
    return `<div class="bill-card-mode" id="billCardMode">
      <div class="bill-card-mode__body">
        <div class="bill-card-mode__main">
          <span class="bill-card-mode__mark is-muted" aria-hidden="true"></span>
          <div style="min-width:0">
            <div class="bill-card-mode__title">未用会员卡</div>
            <div class="bill-card-mode__sub">显示全部项目/产品 · 结算时可再选权益</div>
          </div>
        </div>
        <div class="bill-card-mode__acts">
          <button type="button" class="bill-card-mode__act" data-bill-card-change>选卡筛选</button>
        </div>
      </div>
      ${tools}
    </div>`;
  }

  function renderBillCardGate() {
    const c = getCustomer();
    const cards = (c && c.cards) || [];
    const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l5 5L20 7"/></svg>';
    const skipBtn = `<button type="button" class="bill-card-gate__skip" data-bill-gate-skip>暂不选卡</button>`;
    if (!cards.length) {
      return `<div class="bill-card-gate">
        <div class="bill-card-gate__intro">
          <div class="bill-card-gate__title-row">
            <h3>选择本单会员卡</h3>
            ${skipBtn}
          </div>
          <p>暂无所持会员卡，可暂不选卡浏览全部，或去添加卡</p>
        </div>
      </div>`;
    }
    const list = cards.map(card => {
      const on = card.id === state.billGateDraftCardId;
      const scope = getCardCatalogScope(card);
      const n = countCardScopeItems(card);
      const scopeText = scope.mode === 'all'
        ? '储值通用 · 可选全部项目'
        : `适用 ${n == null ? 0 : n} 个项目/产品`;
      return `<button type="button" class="bill-card-gate__card${on ? ' is-on' : ''}" data-bill-gate-card="${escapeHtml(card.id)}">
        <span class="bill-card-gate__card-check">${checkSvg}</span>
        <div class="bill-card-gate__card-name">${escapeHtml(card.name)}</div>
        <div class="bill-card-gate__card-meta">${escapeHtml(cardFaceSummary(card))} · ${escapeHtml(scopeText)}</div>
        <div class="bill-card-gate__card-chips">${benefitChipsHtml(card)}</div>
      </button>`;
    }).join('');
    return `<div class="bill-card-gate">
      <div class="bill-card-gate__intro">
        <div class="bill-card-gate__title-row">
          <h3>选择本单会员卡</h3>
          ${skipBtn}
        </div>
        <p>用于筛选可用项目；也可稍后在结算权益里再选</p>
      </div>
      <div class="bill-card-gate__list">${list}</div>
    </div>`;
  }

  function cartLineStaffSummary(it) {
    ensureCartStaffState(it);
    const n = (it.staffIds || []).length;
    if (!n) return { text: '未指定', empty: true };
    const names = (it.staffIds || []).map(id => {
      const st = getStaffPool().find(s => s.id === id);
      return st ? st.name : id;
    }).filter(Boolean);
    return { text: names.slice(0, 2).join('、') + (names.length > 2 ? ' 等' : ''), empty: false };
  }

  function renderBillStaff() {
    const root = document.getElementById('billStaffBody');
    if (!root) return;
    if (!state.cart.length) {
      root.innerHTML = '<div class="stk-empty" style="padding:48px 24px;text-align:center;color:var(--text-sec)">暂无商品，请返回点单</div>';
      return;
    }
    if (!state.billStaffExpandedId || !state.cart.some(x => x.id === state.billStaffExpandedId)) {
      state.billStaffExpandedId = state.cart[0].id;
    }
    root.innerHTML =
      `<p class="bill-staff-hint">为每项服务指定服务人（可多选）</p>` +
      state.cart.map(it => {
        const open = state.billStaffExpandedId === it.id;
        const sum = cartLineStaffSummary(it);
        return `<div class="bill-staff-line" data-bill-staff-line="${escapeHtml(it.id)}">` +
          `<button type="button" class="bill-staff-line__head" data-bill-staff-toggle="${escapeHtml(it.id)}">` +
          `<span class="bill-staff-line__name">${escapeHtml(it.name || it.label || '项目')}</span>` +
          `<span class="bill-staff-line__meta">×${Number(it.qty) || 1}</span>` +
          `<span class="bill-staff-line__status${sum.empty ? ' is-empty' : ''}">${escapeHtml(sum.text)}</span>` +
          `</button>` +
          (open ? `<div class="bill-staff-line__body">${renderStaffPickerHtml(it)}</div>` : '') +
          `</div>`;
      }).join('');
    afterStaffPickerPaint(root);
  }

  function openBillStaff() {
    openBillSettle();
  }

  function billTodayKey() {
    if (typeof flowTodayKey === 'function') return flowTodayKey();
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function billDaysAgoKey(n) {
    if (typeof flowDaysAgoKey === 'function') return flowDaysAgoKey(n);
    const d = new Date();
    d.setDate(d.getDate() - n);
    const pad = x => String(x).padStart(2, '0');
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function billBizMinKey() { return billDaysAgoKey(90); }
  function billBizMaxKey() { return billTodayKey(); }
  function parseBillDateKey(key) {
    const m = String(key || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    return { y: +m[1], m: +m[2] - 1, d: +m[3], key: m[1] + '-' + m[2] + '-' + m[3] };
  }
  function formatBillDateLabel(key) {
    const p = parseBillDateKey(key);
    if (!p) return '';
    return p.y + '.' + (p.m + 1) + '.' + p.d;
  }
  function clampBillBizDate(key) {
    const minK = billBizMinKey();
    const maxK = billBizMaxKey();
    let k = key || maxK;
    if (k < minK) k = minK;
    if (k > maxK) k = maxK;
    return k;
  }
  function ensureBillBizDate() {
    state.billBizDate = clampBillBizDate(state.billBizDate || billTodayKey());
    return state.billBizDate;
  }
  function resetBillBizDate() {
    state.billBizDate = billTodayKey();
    syncBillDateLabels();
  }
  function syncBillDateLabels() {
    const label = formatBillDateLabel(ensureBillBizDate());
    ['billDateLabel', 'detailDateLabel', 'quickIssueDateLabel', 'addCardDateLabel'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = label;
    });
  }
  function openBillDateSheet(kind) {
    ensureBillBizDate();
    state.billDateSheetKind = kind === 'issue' ? 'issue' : 'bill';
    state.billBizDateDraft = state.billBizDate;
    const anchor = parseBillDateKey(state.billBizDateDraft);
    state.billBizCalYear = anchor ? anchor.y : new Date().getFullYear();
    state.billBizCalMonth = anchor ? anchor.m : new Date().getMonth();
    const title = document.getElementById('billDateSheetTitle');
    if (title) title.textContent = state.billDateSheetKind === 'issue' ? '选择办卡日期' : '选择开单日期';
    renderBillDateCalendar();
    openMask('billDateMask');
  }
  function closeBillDateSheet() {
    closeMask('billDateMask');
  }
  function renderBillDateCalendar() {
    const cal = document.getElementById('billDateCal');
    if (!cal) return;
    let y = state.billBizCalYear;
    let m = state.billBizCalMonth;
    if (y == null || m == null) {
      const anchor = parseBillDateKey(state.billBizDateDraft || billTodayKey());
      y = anchor ? anchor.y : new Date().getFullYear();
      m = anchor ? anchor.m : new Date().getMonth();
      state.billBizCalYear = y;
      state.billBizCalMonth = m;
    }
    const minK = billBizMinKey();
    const maxK = billBizMaxKey();
    const minP = parseBillDateKey(minK);
    const maxP = parseBillDateKey(maxK);
    const canPrev = !(y === minP.y && m === minP.m);
    const canNext = !(y === maxP.y && m === maxP.m);
    const chevL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
    const chevR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const selected = state.billBizDateDraft;
    const todayK = billTodayKey();
    const cells = [];
    for (let i = 0; i < firstDow; i++) cells.push('<span class="flow-balance-cal__day is-muted" aria-hidden="true"></span>');
    for (let d = 1; d <= daysInMonth; d++) {
      const pad = n => String(n).padStart(2, '0');
      const key = y + '-' + pad(m + 1) + '-' + pad(d);
      const disabled = key < minK || key > maxK;
      const cls = [
        'flow-balance-cal__day',
        disabled ? 'is-disabled' : '',
        key === selected ? 'is-selected' : '',
        key === todayK ? 'is-today' : '',
      ].filter(Boolean).join(' ');
      cells.push('<button type="button" class="' + cls + '" data-bill-cal-day="' + key + '" ' + (disabled ? 'disabled' : '') + ' aria-label="' + key + '"><span class="flow-balance-cal__day-num">' + d + '</span></button>');
    }
    cal.innerHTML =
      '<div class="flow-balance-cal__nav">' +
      '<button type="button" class="flow-balance-cal__nav-btn" data-bill-cal-nav="-1" aria-label="上一月" ' + (canPrev ? '' : 'disabled') + '>' + chevL + '</button>' +
      '<div class="flow-balance-cal__title">' + y + '年' + (m + 1) + '月</div>' +
      '<button type="button" class="flow-balance-cal__nav-btn" data-bill-cal-nav="1" aria-label="下一月" ' + (canNext ? '' : 'disabled') + '>' + chevR + '</button>' +
      '</div>' +
      '<div class="flow-balance-cal__weekdays">' + weekdays.map(w => '<div class="flow-balance-cal__wd">' + w + '</div>').join('') + '</div>' +
      '<div class="flow-balance-cal__grid">' + cells.join('') + '</div>';
    const quick = document.getElementById('billDateQuick');
    if (quick) {
      quick.querySelectorAll('[data-bill-date-quick]').forEach(btn => {
        const q = btn.dataset.billDateQuick;
        const k = q === 'yesterday' ? billDaysAgoKey(1) : billTodayKey();
        btn.classList.toggle('is-on', selected === k);
      });
    }
  }
  function shiftBillDateCalMonth(delta) {
    let y = state.billBizCalYear;
    let m = state.billBizCalMonth + delta;
    while (m < 0) { m += 12; y -= 1; }
    while (m > 11) { m -= 12; y += 1; }
    const minP = parseBillDateKey(billBizMinKey());
    const maxP = parseBillDateKey(billBizMaxKey());
    if (y < minP.y || (y === minP.y && m < minP.m)) { y = minP.y; m = minP.m; }
    if (y > maxP.y || (y === maxP.y && m > maxP.m)) { y = maxP.y; m = maxP.m; }
    state.billBizCalYear = y;
    state.billBizCalMonth = m;
    renderBillDateCalendar();
  }
  function confirmBillDateDraft() {
    state.billBizDate = clampBillBizDate(state.billBizDateDraft || billTodayKey());
    syncBillDateLabels();
    closeBillDateSheet();
    showToast('已设为 ' + formatBillDateLabel(state.billBizDate));
  }
  function formatFlowTimeOnBizDate() {
    const now = new Date();
    const p = parseBillDateKey(ensureBillBizDate());
    const d = p
      ? new Date(p.y, p.m, p.d, now.getHours(), now.getMinutes())
      : now;
    return formatFlowTime(d);
  }

  function genDemoManualOrderNo(bizDateKey) {
    const key = bizDateKey || (typeof ensureBillBizDate === 'function' ? ensureBillBizDate() : '') || billTodayKey();
    if (!state._manualOrderSeqByDate) state._manualOrderSeqByDate = {};
    if (state._manualOrderSeqByDate[key] == null) {
      let max = 0;
      (typeof FLOW_ORDERS !== 'undefined' ? FLOW_ORDERS : []).forEach(o => {
        if ((o.billBizDate || '') !== key) return;
        const raw = String(o.manualOrderNo || '');
        if (!/^\d{1,4}$/.test(raw)) return;
        const n = parseInt(raw, 10);
        if (n > max) max = n;
      });
      state._manualOrderSeqByDate[key] = max;
    }
    state._manualOrderSeqByDate[key] += 1;
    const seq = state._manualOrderSeqByDate[key];
    return seq > 9999 ? String(seq) : String(seq).padStart(4, '0');
  }

  function ensureManualOrderNo() {
    if (!state.manualOrderNo) state.manualOrderNo = genDemoManualOrderNo();
    return state.manualOrderNo;
  }

  function emptyBenefitPickForCard(card) {
    return {
      balanceUse: 0,
      discountOn: false,
      fixedUse: 0,
      projects: (card.projects || []).map(p => ({
        key: p.key,
        label: p.label,
        qty: 0,
        max: p.remain,
        matchKeys: projectBenefitMatchKeys(p),
      })),
    };
  }

  function cloneEmptyBenefitPicks(cards) {
    const out = {};
    (cards || []).forEach(card => { out[card.id] = emptyBenefitPickForCard(card); });
    return out;
  }

  function offerSaveOf(s) {
    return round2((s.projectDeduct || 0) + (s.discountDeduct || 0) + (s.couponDeduct || 0));
  }

  function withTempSettleOffers(tmp, fn) {
    const bak = {
      benefitApplied: state.benefitApplied,
      selectedCouponId: state.selectedCouponId,
      benefitSkip: state.benefitSkip,
    };
    state.benefitApplied = tmp.benefitApplied;
    state.selectedCouponId = tmp.selectedCouponId;
    state.benefitSkip = tmp.benefitSkip;
    try { return fn(calcSettlement()); }
    finally {
      state.benefitApplied = bak.benefitApplied;
      state.selectedCouponId = bak.selectedCouponId;
      state.benefitSkip = bak.benefitSkip;
    }
  }

  function buildGreedyProjectPicks(cards) {
    const picks = cloneEmptyBenefitPicks(cards);
    const leftById = {};
    state.cart.forEach(it => { leftById[it.id] = it.qty; });
    const ordered = (cards || []).slice();
    const preferIds = [];
    (state.billSlips || []).forEach(s => (s.cardIds || []).forEach(id => {
      if (id && !preferIds.includes(id)) preferIds.push(id);
    }));
    if (state.billDraft) {
      (state.billDraft.cardIds || []).forEach(id => {
        if (id && !preferIds.includes(id)) preferIds.push(id);
      });
    }
    if (!preferIds.length && state.billPickCardId) preferIds.push(state.billPickCardId);
    if (preferIds.length) {
      ordered.sort((a, b) => {
        const ai = preferIds.indexOf(a.id);
        const bi = preferIds.indexOf(b.id);
        return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
      });
    }
    ordered.forEach(card => {
      const pick = picks[card.id];
      (pick.projects || []).forEach(pr => {
        let avail = pr.max;
        state.cart.forEach(it => {
          if (avail <= 0 || leftById[it.id] <= 0) return;
          if (!cartItemMatchesProjectBenefit(it, pr)) return;
          const use = Math.min(avail, leftById[it.id]);
          pr.qty += use;
          leftById[it.id] -= use;
          avail -= use;
        });
      });
    });
    return picks;
  }

  function benefitPicksHaveUse(picks) {
    return Object.values(picks || {}).some(d => {
      if (!d) return false;
      if (d.discountOn) return true;
      if (Number(d.balanceUse) > 0 || d.fixedUse) return true;
      return (d.projects || []).some(p => p.qty > 0);
    });
  }

  function autoApplyBestSettleOffers() {
    if (state.settleOffersTouched) return;
    const listTotal = cartListTotal();
    /* 演示券均为「项目通用」：仅服务项目可抵，产品/库存/直接收款不参与 */
    const couponBase = cartDiscountableSubtotal();
    const eligibleCoupons = COUPONS.filter(cp => {
      if (cp.tag === '抵用券') return couponExchangeDeduct(cp) > 0;
      return couponBase > 0 && listTotal >= (cp.minAmount || 0);
    });
    const couponOpts = [null].concat(eligibleCoupons);

    if (!isMemberBill()) {
      let bestCp = null;
      let bestAmt = -1;
      eligibleCoupons.forEach(cp => {
        const amt = cp.tag === '抵用券' ? couponExchangeDeduct(cp) : Math.min(cp.amount, couponBase);
        if (amt > bestAmt) { bestAmt = amt; bestCp = cp; }
      });
      state.selectedCouponId = bestCp && bestAmt > 0 ? bestCp.id : null;
      state.benefitApplied = {};
      state.benefitSkip = false;
      return;
    }

    const cards = getCustomer().cards || [];
    const basePicks = buildGreedyProjectPicks(cards);
    const candidates = [];
    candidates.push({ picks: {}, skip: true });
    candidates.push({ picks: JSON.parse(JSON.stringify(basePicks)), skip: false });
    if (cartHasDiscountableItems()) {
      cards.forEach(card => {
        if (!(card.discount && cardBenefits(card).projectDiscount)) return;
        if (!cartHasDiscountableItemsForCard(card)) return;
        const withDisc = JSON.parse(JSON.stringify(basePicks));
        Object.keys(withDisc).forEach(id => { withDisc[id].discountOn = false; });
        withDisc[card.id].discountOn = true;
        candidates.push({ picks: withDisc, skip: false });
        const discOnly = cloneEmptyBenefitPicks(cards);
        discOnly[card.id].discountOn = true;
        candidates.push({ picks: discOnly, skip: false });
      });
    }

    let best = null;
    let bestScore = -1;
    candidates.forEach(cand => {
      couponOpts.forEach(cp => {
        let usePicks = cand.skip ? {} : cand.picks;
        let useSkip = !!cand.skip;
        if (cp && cp.stackWithBenefit === false) {
          usePicks = {};
          useSkip = true;
        }
        const s = withTempSettleOffers({
          benefitApplied: usePicks,
          selectedCouponId: cp ? cp.id : null,
          benefitSkip: useSkip,
        }, x => x);
        const score = offerSaveOf(s);
        if (score > bestScore) {
          bestScore = score;
          best = {
            picks: usePicks,
            couponId: cp ? cp.id : null,
            skip: useSkip || !benefitPicksHaveUse(usePicks),
          };
        }
      });
    });

    if (!best) {
      state.benefitApplied = {};
      state.selectedCouponId = null;
      state.benefitSkip = false;
      return;
    }
    state.benefitApplied = best.picks;
    state.selectedCouponId = best.couponId;
    state.benefitSkip = !!best.skip && !benefitPicksHaveUse(best.picks);
  }

  function enforceSettleOfferMutex(source) {
    const cp = COUPONS.find(c => c.id === state.selectedCouponId);
    const hasBenefit = !state.benefitSkip && benefitPicksHaveUse(state.benefitApplied);
    if (!(cp && cp.stackWithBenefit === false && hasBenefit)) return;
    if (source === 'coupon') {
      state.benefitApplied = {};
      state.benefitSkip = true;
      showToast('该券不可与会员卡权益同享，已取消权益');
    } else {
      state.selectedCouponId = null;
      showToast('已选权益与该券互斥，已取消优惠券');
    }
    clearBillDueOverride();
  }

  function openBillSettle() {
    /* 进入结算确认：默认展开购物车第一项；从权益/券返回不经此函数，保留用户展开态 */
    state.detailExpandedId = state.cart[0]?.id || null;
    syncBillDateLabels();
    autoApplyBestSettleOffers();
    closeMask('cartSheetMask');
    closeMask('checkoutMask');
    renderDetail();
    syncBillStepBars('settle');
    showOnlyScreen('screen-detail');
  }

  function openMemberPicker() {
    openBillCustomer({ reset: true });
  }
  function isMemberBill() { const c = getCustomer(); return c.isMember && c.cards && c.cards.length; }
  function refreshCustomerCardsFromHoldings(customer) {
    if (!customer || !customer.isMember || !customer.id) return customer;
    if (String(customer.id).indexOf('guest') === 0) return customer;
    if (!(window.CardHost && typeof window.CardHost.getMemberCards === 'function')) return customer;
    const projected = window.CardHost.getMemberCards(customer.id).map(normalizeHeldCard);
    const prev = customer.cards || [];
    const prevByTpl = new Map();
    prev.forEach(card => {
      const tid = heldTemplateId(card);
      if (tid) prevByTpl.set(tid, card);
    });
    // 以持卡账本为准增减卡；同模板已存在的卡保留开单侧已扣减余额/次数
    const cards = projected.map(p => {
      const tid = heldTemplateId(p) || p.templateId;
      return (tid && prevByTpl.get(tid)) || p;
    });
    customer.cards = preserveTimesTickets(prev, cards);
    const root = CUSTOMERS.find(x => x.id === customer.id);
    if (root) root.cards = customer.cards;
    return customer;
  }
  function syncMemberCardsFromHoldings(memberId) {
    if (!memberId) return;
    const c = CUSTOMERS.find(x => x.id === memberId);
    if (!c) return;
    const prev = c.cards || [];
    const cards = (window.CardHost && typeof window.CardHost.getMemberCards === 'function'
      ? window.CardHost.getMemberCards(memberId)
      : []).map(normalizeHeldCard);
    c.cards = preserveTimesTickets(prev, cards);
    if (state.customer && state.customer.id === memberId) {
      state.customer = c;
      const billEl = document.getElementById('screen-bill');
      if (billEl && !billEl.classList.contains('hidden')) {
        renderBillHeader();
        syncCartChrome();
      }
    }
  }
  function syncAllMemberCardsFromHoldings() {
    CUSTOMERS.forEach(c => {
      if (!c.isMember || !c.id || String(c.id).indexOf('guest') === 0) return;
      const prev = c.cards || [];
      const cards = (window.CardHost && typeof window.CardHost.getMemberCards === 'function'
        ? window.CardHost.getMemberCards(c.id)
        : []).map(normalizeHeldCard);
      c.cards = preserveTimesTickets(prev, cards);
    });
    ensureDemoTimesTickets();
    if (state.customer && state.customer.isMember && state.customer.id) {
      const root = CUSTOMERS.find(x => x.id === state.customer.id);
      if (root) state.customer = root;
    }
  }
  function customerLetter(c) {
    const ch = (c.name || '')[0];
    return SURNAME_LETTER[ch] || '#';
  }
  function cardBenefits(card) {
    if (card?.benefits) return card.benefits;
    const tpl = CARD_TPL_BY_ID[heldTemplateId(card)];
    if (tpl?.benefits) return { ...emptyBenefits(), ...tpl.benefits };
    const products = (card?.products || card?.productItems || []).length > 0
      || !!(tpl?.productItems || []).length;
    return {
      balance: Number(card?.balance) > 0,
      timesOrValidity: (card?.projects || []).length > 0,
      products,
      projectDiscount: !!card?.discount,
    };
  }
  function cardHasFaceBenefit(card) {
    return !!cardBenefits(card).balance;
  }
  function benefitChipsHtml(card) {
    const b = cardBenefits(card);
    const chips = [];
    if (b.balance) chips.push('<span class="benefit-chip is-face">面值</span>');
    if (b.timesOrValidity) chips.push('<span class="benefit-chip is-project">项目</span>');
    if (b.products) chips.push('<span class="benefit-chip is-product">产品</span>');
    if (b.projectDiscount) chips.push('<span class="benefit-chip is-discount">折扣</span>');
    return chips.length ? chips.join('') : '';
  }
  function cardFaceSummary(card) {
    const b = cardBenefits(card);
    const parts = [];
    if (b.balance) {
      const r = Number(card.rechargeBalance);
      const g = Number(card.giftBalance);
      if (Number.isFinite(r) || Number.isFinite(g)) {
        parts.push(`储值 ${formatYen(r || 0)} · 赠送 ${formatYen(g || 0)}`);
      } else {
        parts.push(Number(card.balance) > 0 ? `面值余额 ${formatYen(card.balance)}` : '面值');
      }
    }
    if (b.projectDiscount && card.discount) parts.push(`${(card.discount * 10).toFixed(1)}折`);
    if (!parts.length && b.timesOrValidity) return '项目权益';
    return parts.join(' · ') || '—';
  }
  function memberAssetMetrics(c) {
    const cards = (c && c.cards) || [];
    const recharge = cards.reduce((s, x) => s + (Number(x.rechargeBalance) || 0), 0);
    const gift = cards.reduce((s, x) => s + (Number(x.giftBalance) || 0), 0);
    return {
      recharge: round2(recharge),
      gift: round2(gift),
      cardCount: cards.length,
      couponCount: Number(c && c.couponCount) || 0,
    };
  }
  function formatMetricYen(n) {
    const v = Math.round((Number(n) || 0) * 100) / 100;
    if (v >= 10000) return String(Math.round(v));
    const s = v.toFixed(2).replace(/\.?0+$/, m => (m.includes('.') ? m.replace(/0+$/, '').replace(/\.$/, '') : ''));
    return s || '0';
  }
  function findHeldCardById(cardId) {
    const c = getCustomer();
    return ((c && c.cards) || []).find(x => x.id === cardId) || null;
  }
  function syncHeldCardBalance(card) {
    if (!card) return;
    card.rechargeBalance = Math.max(0, Number(card.rechargeBalance) || 0);
    card.giftBalance = Math.max(0, Number(card.giftBalance) || 0);
    card.balance = round2(card.rechargeBalance + card.giftBalance);
  }
  const BILL_TIMES_UNIT_PRICE = 58;
  function showBillAssetOk(title, bodyHtml) {
    const titleEl = document.getElementById('billRechargeOkTitle');
    const bodyEl = document.getElementById('billRechargeOkBody');
    if (titleEl) titleEl.textContent = title || '操作成功';
    if (bodyEl) bodyEl.innerHTML = bodyHtml || '';
    document.getElementById('billRechargeOkMask')?.classList.add('show');
  }
  function closeBillAssetOk() {
    document.getElementById('billRechargeOkMask')?.classList.remove('show');
  }
  function openBillRechargeSheet(cardId) {
    if (window.RTBPerm && typeof window.RTBPerm.require === 'function' && !window.RTBPerm.require('cardRecharge')) return;
    const card = findHeldCardById(cardId);
    if (!card || !cardBenefits(card).balance) {
      showToast('该卡暂无储值权益');
      return;
    }
    state.billRechargeCardId = cardId;
    state.billRechargeAmount = '';
    state.billRechargeGift = '';
    state.billRechargeDue = '';
    state.billRechargeDueTouched = false;
    renderBillRechargeSheet();
    openMask('billRechargeMask');
  }
  function syncBillRechargeDueFromAmount() {
    if (state.billRechargeDueTouched) return;
    state.billRechargeDue = state.billRechargeAmount || '';
  }
  function renderBillRechargeSheet() {
    const card = findHeldCardById(state.billRechargeCardId);
    if (!card) return;
    const title = document.getElementById('billRechargeTitle');
    if (title) title.textContent = `储值充值 · ${card.name}`;
    syncBillRechargeDueFromAmount();
    const amt = state.billRechargeAmount;
    const gift = state.billRechargeGift;
    const due = state.billRechargeDue;
    const body = document.getElementById('billRechargeBody');
    if (!body) return;
    body.innerHTML = `
      <div class="bill-recharge-meta">
        <span>储值 <strong>${formatYen(card.rechargeBalance || 0)}</strong></span>
        <span>赠送 <strong>${formatYen(card.giftBalance || 0)}</strong></span>
      </div>
      <div class="bill-recharge-row">
        <span class="bill-recharge-row__label">充值金额</span>
        <input type="text" class="bill-recharge-row__field input-amount${!amt ? ' is-empty' : ''}" id="billRechargeAmt" readonly inputmode="decimal" placeholder="请输入" value="${amt ? escapeHtml(String(amt)) : ''}" data-bill-recharge-field="amount">
      </div>
      <div class="bill-recharge-row">
        <span class="bill-recharge-row__label">赠送金额</span>
        <input type="text" class="bill-recharge-row__field input-amount${!gift ? ' is-empty' : ''}" id="billRechargeGift" readonly inputmode="decimal" placeholder="选填" value="${gift ? escapeHtml(String(gift)) : ''}" data-bill-recharge-field="gift">
      </div>
      <div class="bill-recharge-row bill-recharge-row--due">
        <span class="bill-recharge-row__label">应付</span>
        <input type="text" class="bill-recharge-row__field input-amount bill-recharge-due__amt${!due ? ' is-empty' : ''}" id="billRechargeDue" readonly inputmode="decimal" placeholder="请输入" value="${due ? escapeHtml(String(due)) : ''}" data-bill-recharge-field="due" aria-label="应付金额">
      </div>`;
    if (typeof wireAmountKeypadInputs === 'function') wireAmountKeypadInputs(body);
    body.querySelectorAll('[data-bill-recharge-field]').forEach(el => {
      el.addEventListener('input', () => {
        const key = el.dataset.billRechargeField;
        const v = String(el.value || '').replace(/^¥/, '').trim();
        if (key === 'amount') {
          state.billRechargeAmount = v;
          /* X：改充值金额后清除应付覆盖，回到跟充值金额同步 */
          state.billRechargeDueTouched = false;
          state.billRechargeDue = v;
          const dueEl = body.querySelector('[data-bill-recharge-field="due"]');
          if (dueEl) {
            dueEl.value = v;
            dueEl.classList.toggle('is-empty', !v);
          }
        } else if (key === 'gift') {
          state.billRechargeGift = v;
        } else if (key === 'due') {
          state.billRechargeDueTouched = true;
          state.billRechargeDue = v;
        }
        el.classList.toggle('is-empty', !v);
      });
    });
  }
  function payBillRecharge() {
    const card = findHeldCardById(state.billRechargeCardId);
    if (!card) return;
    const amt = Number(state.billRechargeAmount) || 0;
    const gift = Number(state.billRechargeGift) || 0;
    syncBillRechargeDueFromAmount();
    const due = Number(state.billRechargeDue);
    if (amt <= 0) { showToast('请输入充值金额'); return; }
    if (!Number.isFinite(due) || due < 0) { showToast('请输入有效应付金额'); return; }
    state.billAssetPay = {
      type: 'recharge',
      cardId: card.id,
      amount: round2(due),
      credit: round2(amt),
      gift: Math.max(0, round2(gift)),
    };
    closeMask('billRechargeMask');
    state.payAmounts = {};
    state.payManualEdit = {};
    state.payChannel = 'alipay';
    renderPayChannels();
    openMask('payMask');
  }
  function openBillTimesTopup(cardId) {
    if (window.RTBPerm && typeof window.RTBPerm.require === 'function' && !window.RTBPerm.require('cardRenew')) return;
    const card = findHeldCardById(cardId);
    if (!card) return;
    const projects = (card.projects || []).filter(p => !p.unlimited);
    if (!projects.length) {
      showToast('该卡暂无计次项目');
      return;
    }
    state.billTimesCardId = cardId;
    state.billTimesAdds = {};
    projects.forEach(p => { state.billTimesAdds[p.key || p.label] = 0; });
    state.billTimesDue = '';
    state.billTimesDueTouched = false;
    renderBillTimesTopupSheet();
    openMask('billTimesTopupMask');
  }
  function billTimesDue() {
    const adds = state.billTimesAdds || {};
    const totalQty = Object.values(adds).reduce((s, n) => s + (Number(n) || 0), 0);
    return { totalQty, due: round2(totalQty * BILL_TIMES_UNIT_PRICE) };
  }
  function syncBillTimesDueFromCalc() {
    if (state.billTimesDueTouched) return;
    const { due } = billTimesDue();
    state.billTimesDue = due > 0 ? String(due) : '';
  }
  function renderBillTimesTopupSheet() {
    const card = findHeldCardById(state.billTimesCardId);
    if (!card) return;
    const title = document.getElementById('billTimesTopupTitle');
    if (title) title.textContent = `计次充次 · ${card.name}`;
    const projects = (card.projects || []).filter(p => !p.unlimited);
    const { totalQty } = billTimesDue();
    syncBillTimesDueFromCalc();
    const dueStr = state.billTimesDue;
    const body = document.getElementById('billTimesTopupBody');
    if (!body) return;
    if (!projects.length) {
      body.innerHTML = '<div class="empty-cart">该卡暂无计次项目</div>';
      return;
    }
    body.innerHTML = projects.map(p => {
      const key = p.key || p.label;
      const add = Number(state.billTimesAdds[key]) || 0;
      const minusDisabled = add <= 0 ? ' disabled' : '';
      return `<div class="bill-recharge-times-row">
        <div class="bill-recharge-times-row__main">
          <div class="bill-recharge-times-row__name">${escapeHtml(p.label)}</div>
          <div class="bill-recharge-times-row__sub">当前余 ${p.remain} 次 · ¥${BILL_TIMES_UNIT_PRICE}/次</div>
        </div>
        <div class="stepper">
          <button type="button" class="minus" data-times-d="-1" data-times-key="${escapeHtml(key)}" aria-label="减少"${minusDisabled}>${iconSvg('minus')}</button>
          <span class="num">${add}</span>
          <button type="button" class="plus" data-times-d="1" data-times-key="${escapeHtml(key)}" aria-label="增加">${iconSvg('plus')}</button>
        </div>
      </div>`;
    }).join('') + `<div class="bill-recharge-row bill-recharge-row--due">
      <span class="bill-recharge-row__label">应付（${totalQty} 次）</span>
      <input type="text" class="bill-recharge-row__field input-amount bill-recharge-due__amt${!dueStr ? ' is-empty' : ''}" id="billTimesDue" readonly inputmode="decimal" placeholder="请输入" value="${dueStr ? escapeHtml(String(dueStr)) : ''}" data-bill-times-due aria-label="应付金额">
    </div>`;
    if (typeof wireAmountKeypadInputs === 'function') wireAmountKeypadInputs(body);
    const dueEl = body.querySelector('[data-bill-times-due]');
    if (dueEl) {
      dueEl.addEventListener('input', () => {
        state.billTimesDueTouched = true;
        state.billTimesDue = String(dueEl.value || '').replace(/^¥/, '').trim();
        dueEl.classList.toggle('is-empty', !state.billTimesDue);
      });
    }
  }
  function bumpBillTimesAdd(key, delta) {
    const cur = Number(state.billTimesAdds[key]) || 0;
    const next = Math.max(0, Math.min(99, cur + delta));
    state.billTimesAdds[key] = next;
    /* X：改次数后清除应付覆盖，按单价重算 */
    state.billTimesDueTouched = false;
    renderBillTimesTopupSheet();
  }
  function payBillTimesTopup() {
    const card = findHeldCardById(state.billTimesCardId);
    if (!card) return;
    const { totalQty } = billTimesDue();
    if (totalQty <= 0) { showToast('请选择充次次数'); return; }
    syncBillTimesDueFromCalc();
    const due = Number(state.billTimesDue);
    if (!Number.isFinite(due) || due < 0) { showToast('请输入有效应付金额'); return; }
    const adds = {};
    const lines = [];
    (card.projects || []).forEach(p => {
      if (p.unlimited) return;
      const key = p.key || p.label;
      const add = Number(state.billTimesAdds[key]) || 0;
      if (add <= 0) return;
      adds[key] = add;
      lines.push(`${p.label} +${add} 次`);
    });
    state.billAssetPay = {
      type: 'times',
      cardId: card.id,
      amount: round2(due),
      totalQty,
      adds,
      lines,
    };
    closeMask('billTimesTopupMask');
    state.payAmounts = {};
    state.payManualEdit = {};
    state.payChannel = 'alipay';
    renderPayChannels();
    openMask('payMask');
  }

  function billCardAssetActions(card) {
    const b = cardBenefits(card);
    const tid = heldTemplateId(card);
    const tpl = (typeof getTemplateForHolderOps === 'function' ? getTemplateForHolderOps(tid) : null)
      || (typeof getTemplate === 'function' ? getTemplate(tid) : null)
      || CARD_TPL_BY_ID[tid];
    const permanent = !!(tpl && (
      (typeof isTemplatePermanent === 'function' && isTemplatePermanent(tpl))
      || (typeof isBalanceOnlyCard === 'function' && isBalanceOnlyCard(tpl))
    ));
    const hasTimedProjects = (card.projects || []).some(p => !p.unlimited);
    return {
      recharge: !!b.balance,
      renew: !!(b.timesOrValidity && hasTimedProjects),
      extend: !permanent,
      extendBlocked: permanent,
      tpl,
      tid,
    };
  }

  function openBillCardAssetScreen() {
    const c = getCustomer();
    if (!c || !c.isMember) {
      showToast('请先选择会员顾客');
      return;
    }
    renderBillCardAssetPage();
    showOnlyScreen('screen-bill-card-asset');
    setFlowNavHighlight('card-asset');
  }

  function renderBillCardAssetPage() {
    const root = document.getElementById('billCardAssetList');
    if (!root) return;
    const c = getCustomer();
    const cards = (c && c.cards) || [];
    if (!cards.length) {
      root.innerHTML = `<div class="bill-asset-empty">
        <div class="bill-asset-empty__illus" aria-hidden="true"><div class="bill-asset-empty__illus-h"></div><div class="bill-asset-empty__illus-b"></div></div>
        <div>暂无所持会员卡</div>
        <div style="margin-top:6px;font-size:13px">可先办卡，再进行充值、续次或延期</div>
        <button type="button" class="bill-asset-empty__cta" id="btnBillAssetEmptyAdd">去添加卡</button>
      </div>`;
      return;
    }
    root.innerHTML = cards.map((card, i) => {
      const acts = billCardAssetActions(card);
      const colorKey = card.cardColor || (acts.tpl && acts.tpl.cardColor);
      const theme = (typeof getCardTheme === 'function')
        ? getCardTheme(colorKey)
        : { gradient: 'linear-gradient(90deg, #F4EAE5 0%, #EED1C3 100%)' };
      const grad = theme.gradient;
      const timesLine = (card.projects || [])
        .filter(p => !p.unlimited)
        .slice(0, 2)
        .map(p => `${p.label}余${p.remain}次`)
        .join(' · ');
      const sub = [cardFaceSummary(card), timesLine].filter(Boolean).join(' · ');
      const actionBtns = [
        acts.recharge ? `<button type="button" class="bill-asset-card__act bill-asset-card__act--primary" data-bill-recharge="${escapeHtml(card.id)}">充值</button>` : '',
        acts.renew ? `<button type="button" class="bill-asset-card__act" data-bill-times-topup="${escapeHtml(card.id)}">续次</button>` : '',
        acts.extend ? `<button type="button" class="bill-asset-card__act" data-bill-extend="${escapeHtml(card.id)}">延期</button>` : '',
      ].filter(Boolean).join('');
      return `<div class="bill-asset-card" data-asset-card="${escapeHtml(card.id)}" style="--asset-band:${grad};animation-delay:${Math.min(i, 6) * 40}ms">
        <div class="bill-asset-card__band" aria-hidden="true"></div>
        <div class="bill-asset-card__body">
          <div class="bill-asset-card__head">
            <span class="bill-asset-card__face" aria-hidden="true">
              <span class="bill-asset-card__face-h" style="background:${grad}"></span>
              <span class="bill-asset-card__face-b"></span>
            </span>
            <div class="bill-asset-card__meta">
              <div class="bill-asset-card__name">${escapeHtml(card.name)}</div>
              <div class="bill-asset-card__sub">${escapeHtml(sub || '—')}</div>
              <div class="bill-asset-card__chips">${benefitChipsHtml(card)}</div>
            </div>
          </div>
          <div class="bill-asset-card__tear" aria-hidden="true"></div>
        </div>
        <div class="bill-asset-card__acts">${actionBtns || '<span class="bill-asset-card__act-empty">暂无可用操作</span>'}</div>
      </div>`;
    }).join('');
  }

  function syncBillExtendFeeFromCalc(tpl, days) {
    const hasDiscount = !!(tpl && typeof templateHasDiscountBenefit === 'function' && templateHasDiscountBenefit(tpl));
    if (!hasDiscount || !days || typeof computeExtendFeeDefault !== 'function') {
      state.billExtendFee = '';
      return;
    }
    const raw = computeExtendFeeDefault(tpl, days);
    state.billExtendFee = raw === '' || raw == null ? '' : String(raw);
  }

  function openBillExtendSheet(cardId) {
    if (window.RTBPerm && typeof window.RTBPerm.require === 'function' && !window.RTBPerm.require('cardExtend')) return;
    const card = findHeldCardById(cardId);
    if (!card) return;
    const acts = billCardAssetActions(card);
    if (acts.extendBlocked) {
      showToast('该卡永久有效，无需延期');
      return;
    }
    if (!acts.tid || !acts.tpl) {
      showToast('未找到卡模板，无法延期', true);
      return;
    }
    state.billExtendCardId = cardId;
    state.billExtendUnit = 'month';
    state.billExtendAmount = '1';
    state.billExtendDueTouched = false;
    const days = typeof durationAmountToDays === 'function' ? durationAmountToDays('month', 1) : 30;
    syncBillExtendFeeFromCalc(acts.tpl, days);
    state.billExtendDue = state.billExtendFee;
    renderBillExtendSheet();
    openMask('billExtendMask');
  }

  function renderBillExtendSheet() {
    const card = findHeldCardById(state.billExtendCardId);
    if (!card) return;
    const acts = billCardAssetActions(card);
    const tpl = acts.tpl;
    const title = document.getElementById('billExtendTitle');
    if (title) title.textContent = `延期 · ${card.name}`;
    const body = document.getElementById('billExtendBody');
    if (!body) return;
    const unit = state.billExtendUnit || 'month';
    const amount = state.billExtendAmount;
    const days = unit === 'permanent' ? null : (typeof durationAmountToDays === 'function' ? durationAmountToDays(unit, amount) : null);
    const hasDiscount = !!(tpl && typeof templateHasDiscountBenefit === 'function' && templateHasDiscountBenefit(tpl));
    syncBillExtendFeeFromCalc(tpl, days);
    if (!state.billExtendDueTouched) {
      state.billExtendDue = (hasDiscount && unit !== 'permanent') ? (state.billExtendFee || '') : '';
    }
    const durationHtml = typeof buildDurationInputHtml === 'function'
      ? buildDurationInputHtml({ unit, amount, includePermanent: true, id: 'billExtendDuration' })
      : '';
    const feeText = state.billExtendFee
      ? formatYen(typeof parseAmount === 'function' ? parseAmount(state.billExtendFee) : Number(state.billExtendFee) || 0)
      : (days ? '—' : '请先设置时长');
    const feeBlock = hasDiscount && unit !== 'permanent'
      ? `<div class="bill-recharge-row">
          <span class="bill-recharge-row__label">参考费用</span>
          <span class="bill-extend-fee-readonly${!state.billExtendFee ? ' is-empty' : ''}">${feeText}</span>
        </div>`
      : '';
    const dueStr = state.billExtendDue;
    const dueRow = unit === 'permanent'
      ? `<div class="bill-recharge-due"><span>应付</span><span class="bill-recharge-due__amt">${formatYen(0)}</span></div>`
      : `<div class="bill-recharge-row bill-recharge-row--due">
          <span class="bill-recharge-row__label">应付</span>
          <input type="text" class="bill-recharge-row__field input-amount bill-recharge-due__amt${!dueStr ? ' is-empty' : ''}" id="billExtendDue" readonly inputmode="decimal" placeholder="请输入" value="${dueStr ? escapeHtml(String(dueStr)) : ''}" data-bill-extend-due aria-label="应付金额">
        </div>`;
    body.innerHTML = `
      <p class="bill-extend-tip">若同时拥有余额和折扣权益，延期将按折扣权益的售价进行收费。应付可改价。</p>
      <div class="bill-recharge-meta">
        <span>卡模板 <strong>${escapeHtml(tpl?.name || card.name)}</strong></span>
      </div>
      <div class="bill-recharge-row" style="align-items:flex-start">
        <span class="bill-recharge-row__label" style="padding-top:8px">延期时长</span>
        <div>${durationHtml}</div>
      </div>
      ${feeBlock}
      ${dueRow}`;
    const durRoot = body.querySelector('#billExtendDuration') || body.querySelector('.duration-input');
    if (durRoot && typeof wireDurationInput === 'function') {
      wireDurationInput(durRoot, {
        get: () => ({ unit: state.billExtendUnit, amount: state.billExtendAmount }),
        set: ({ unit: u, amount: a }) => {
          state.billExtendUnit = u;
          state.billExtendAmount = a;
          state.billExtendDueTouched = false;
        },
        clampAmount: typeof clampCardValidityAmount === 'function' ? clampCardValidityAmount : undefined,
        onChange: () => renderBillExtendSheet(),
      });
    }
    if (typeof wireAmountKeypadInputs === 'function') wireAmountKeypadInputs(body);
    const dueInput = body.querySelector('[data-bill-extend-due]');
    if (dueInput) {
      dueInput.addEventListener('input', () => {
        state.billExtendDueTouched = true;
        state.billExtendDue = String(dueInput.value || '').replace(/^¥/, '').trim();
        dueInput.classList.toggle('is-empty', !state.billExtendDue);
      });
    }
  }

  function confirmBillExtend() {
    const card = findHeldCardById(state.billExtendCardId);
    if (!card) return;
    const acts = billCardAssetActions(card);
    const tpl = acts.tpl;
    const c = getCustomer();
    if (!tpl || !c) return;
    if (acts.extendBlocked) {
      showToast('该卡永久有效，无需延期');
      return;
    }
    const unit = state.billExtendUnit || 'month';
    const memberId = c.id;
    if (unit === 'permanent') {
      closeMask('billExtendMask');
      commitBillExtend({ card, tpl, memberId, unit, extendDays: null, extendFee: 0, permanent: true });
      return;
    }
    const n = typeof parseDurationAmount === 'function' ? parseDurationAmount(state.billExtendAmount) : Number(state.billExtendAmount);
    if (!n) {
      showToast('请设置延期时长', true);
      return;
    }
    const extendDays = typeof durationAmountToDays === 'function' ? durationAmountToDays(unit, n) : n;
    const hasDiscount = typeof templateHasDiscountBenefit === 'function' && templateHasDiscountBenefit(tpl);
    let extendFee = 0;
    if (hasDiscount && typeof computeExtendFeeDefault === 'function') {
      const calc = computeExtendFeeDefault(tpl, extendDays);
      extendFee = typeof parseAmount === 'function' ? parseAmount(calc) : (Number(calc) || 0);
    }
    let payDue = extendFee;
    if (state.billExtendDueTouched || String(state.billExtendDue ?? '').trim() !== '') {
      const dueRaw = String(state.billExtendDue ?? '').trim();
      payDue = dueRaw === '' ? 0 : (typeof parseAmount === 'function' ? parseAmount(dueRaw) : Number(dueRaw) || 0);
    }
    if (!Number.isFinite(payDue) || payDue < 0) {
      showToast('请输入有效应付金额', true);
      return;
    }
    closeMask('billExtendMask');
    if (payDue > 0) {
      state.billAssetPay = {
        type: 'extend',
        cardId: card.id,
        templateId: acts.tid,
        memberId,
        amount: round2(payDue),
        unit,
        extendDays,
        fee: round2(payDue),
        permanent: false,
      };
      state.payAmounts = {};
      state.payManualEdit = {};
      state.payChannel = 'alipay';
      renderPayChannels();
      openMask('payMask');
      return;
    }
    commitBillExtend({ card, tpl, memberId, unit, extendDays, extendFee: 0, permanent: false });
  }

  function commitBillExtend({ card, tpl, memberId, unit, extendDays, extendFee, permanent, silent }) {
    const tid = heldTemplateId(card) || tpl.id;
    if (typeof applyIssueExtendCommit === 'function') {
      const member = (typeof DEMO_MEMBERS !== 'undefined' ? DEMO_MEMBERS : []).find(m => m.id === memberId)
        || { id: memberId, name: (getCustomer() || {}).name || '会员' };
      applyIssueExtendCommit({
        memberId,
        tid,
        tpl,
        member,
        unit,
        extendDays,
        extendFee: round2(Number(extendFee) || 0),
        permanent: !!permanent,
        silent: !!silent,
      });
    } else if (!silent) {
      showToast(permanent ? '已设为永久有效' : `已延期 ${extendDays} 天`);
    }
    if (typeof syncMemberCardsFromHoldings === 'function') {
      syncMemberCardsFromHoldings(memberId);
    }
    renderBillCardAssetPage();
    renderBillHeader();
  }

  function clearBillDueOverride() {
    state.billDueOverride = null;
    state.billDueEdited = false;
  }

  function setBillDueOverride(amount) {
    const n = round2(Math.max(0, Number(amount) || 0));
    state.billDueOverride = n;
    state.billDueEdited = true;
  }

  function getActivePayDue() {
    if (state.orderIsFree) return 0;
    if (state.billAssetPay) return round2(Number(state.billAssetPay.amount) || 0);
    if (state.billDueOverride != null) return round2(Math.max(0, Number(state.billDueOverride) || 0));
    return round2(calcSettlement().dueCash);
  }

  function catalogUnitForCartItem(it) {
    if (!it || isQuickCartItem(it)) return null;
    const cat = typeof findCatalogItemById === 'function' ? findCatalogItemById(it.id) : null;
    if (!cat || cat.price == null || cat.price === '') return null;
    const n = Number(cat.price);
    return Number.isFinite(n) ? round2(n) : null;
  }

  function shouldGuardBillPayCatalog() {
    if (state.billAssetPay || state.cardIssuePending || state.cardExtendPending) return false;
    if (state.orderIsFree || state.billDueEdited) return false;
    return (state.cart || []).some(it => catalogUnitForCartItem(it) != null);
  }

  function withCatalogPricedCart(fn) {
    const bak = state.cart;
    state.cart = (bak || []).map(it => {
      const catP = catalogUnitForCartItem(it);
      if (catP == null) return it;
      return Object.assign({}, it, { unitPrice: catP, price: catP });
    });
    try { return fn(); }
    finally { state.cart = bak; }
  }

  function catalogAlignedDueCash() {
    return withCatalogPricedCart(() => round2(calcSettlement().dueCash));
  }

  function snapshotBillPayDue() {
    if (!shouldGuardBillPayCatalog()) {
      state.payDueSnapshot = null;
      return;
    }
    state.payDueSnapshot = getActivePayDue();
  }

  function hasBillPayAmountDrift() {
    if (!shouldGuardBillPayCatalog()) return false;
    const catalogDue = catalogAlignedDueCash();
    const shown = getActivePayDue();
    if (Math.abs(catalogDue - shown) > 0.009) return true;
    if (state.payDueSnapshot != null && Math.abs(catalogDue - state.payDueSnapshot) > 0.009) return true;
    return false;
  }

  function showPayAmountChangedDialog() {
    document.getElementById('payAmountChangedMask')?.classList.add('show');
  }

  function hidePayAmountChangedDialog() {
    document.getElementById('payAmountChangedMask')?.classList.remove('show');
  }

  function dismissPayAmountChanged() {
    hidePayAmountChangedDialog();
    closeMask('payMask');
  }

  /** 开单分账：价目变更拦截；办卡/充值/续卡等走原 openMask('payMask') */
  function openBillPayMask() {
    clampCartToProductStock({ toast: true });
    if (!state.cart.length && !state.billAssetPay && !state.cardIssuePending && !state.cardExtendPending) {
      showToast('购物车为空');
      return false;
    }
    if (state.payDueSnapshot == null) snapshotBillPayDue();
    if (hasBillPayAmountDrift()) {
      showPayAmountChangedDialog();
      return false;
    }
    openMask('payMask');
    return true;
  }

  function guardBillPayConfirmOrBlock() {
    if (!hasBillPayAmountDrift()) return true;
    showPayAmountChangedDialog();
    return false;
  }

  /** FLOW：造「价目已变、购物车未跟」场景并弹出拦截 Dialog */
  function openBillPayPriceChangedDemo() {
    hidePayAmountChangedDialog();
    closeMask('payMask');
    closeMask('checkoutMask');
    if (typeof ensureDemoFilled === 'function') ensureDemoFilled();
    if (!state.customer) enterBill(CUSTOMERS[0]);
    let target = (state.cart || []).find(it => catalogUnitForCartItem(it) != null);
    if (!target) {
      const catalog = typeof getCatalogProjects === 'function' ? getCatalogProjects() : [];
      const p = catalog.find(x => x && x.onSale !== false && x.price != null)
        || catalog.find(x => x && x.price != null)
        || (typeof PROJECTS !== 'undefined' ? PROJECTS[0] : null);
      if (!p) { showToast('无价目数据'); return; }
      state.cart = [];
      setCartQty({
        id: p.id,
        name: p.name,
        price: Number(p.price) || 0,
        category: p.category || '项目',
        benefitKey: p.benefitKey || p.name,
      }, 1);
      target = state.cart[0];
    }
    clearBillDueOverride();
    state.billAssetPay = null;
    state.cardIssuePending = null;
    state.cardExtendPending = null;
    state.orderIsFree = false;
    const cat = typeof findCatalogItemById === 'function' ? findCatalogItemById(target.id) : null;
    if (cat) {
      const cartU = lineUnit(target);
      target.unitPrice = cartU;
      target.price = cartU;
      cat.price = round2(cartU + 88);
    }
    state.payDueSnapshot = getActivePayDue();
    renderDetail();
    showOnlyScreen('screen-detail');
    state.payAmounts = {};
    renderPayChannels();
    openBillPayMask();
    if (typeof setFlowNavHighlight === 'function') setFlowNavHighlight('bill-pay-price-changed');
  }

  function freeOrderRuleText() {
    if (typeof window.EmployeeDemo !== 'undefined' && typeof window.EmployeeDemo.getFreeOrderRule === 'function') {
      return window.EmployeeDemo.getFreeOrderRule();
    }
    return '计算业绩和提成';
  }

  function renderPayMeta() {
    const block = document.getElementById('payMetaBlock');
    const note = document.getElementById('payFreeNote');
    if (!block) return;
    const rows = [];
    rows.push(`<button type="button" class="pay-meta-row" id="payFreeToggleRow" aria-pressed="${state.orderIsFree ? 'true' : 'false'}">
      <span>免单</span>
      <span class="pay-meta-switch${state.orderIsFree ? ' on' : ''}" id="payFreeSwitch" aria-hidden="true"></span>
    </button>`);
    block.innerHTML = rows.join('');
    block.hidden = false;
    if (note) {
      if (state.orderIsFree) {
        note.textContent = '免单规则：' + freeOrderRuleText() + '（可在业绩设置 · 基础设置中调整）';
        note.classList.remove('hidden');
      } else {
        note.textContent = '';
        note.classList.add('hidden');
      }
    }
  }

  window.__billingGetCardTemplates = function () {
    return CARD_TEMPLATES.map(t => ({
      id: t.id,
      name: t.name,
      price: t.price,
      cardColor: t.cardColor || 'brand_red',
      benefits: t.benefits ? { ...t.benefits } : {},
    }));
  };
  function finalizeBillAssetPay() {
    const pending = state.billAssetPay;
    if (!pending) return false;
    const card = findHeldCardById(pending.cardId);
    if (!card) {
      showToast('会员卡不存在');
      return true;
    }
    if (pending.type === 'recharge') {
      const credit = round2(Number(pending.credit != null ? pending.credit : pending.amount) || 0);
      const paid = round2(Number(pending.amount) || 0);
      const gift = Math.max(0, round2(Number(pending.gift) || 0));
      card.rechargeBalance = round2((Number(card.rechargeBalance) || 0) + credit);
      card.giftBalance = round2((Number(card.giftBalance) || 0) + gift);
      syncHeldCardBalance(card);
      state.billAssetPay = null;
      state.payAmounts = {};
      state.payManualEdit = {};
      closeMask('payMask');
      const giftLine = gift > 0 ? `<div style="margin-top:6px">赠送 ${formatYen(gift)}</div>` : '';
      const payLine = paid !== credit ? `<div style="margin-top:6px">实付 ${formatYen(paid)}</div>` : '';
      showBillAssetOk('充值成功', `
        <div>已为「${escapeHtml(card.name)}」充值 ${formatYen(credit)}</div>
        ${giftLine}${payLine}
        <div style="margin-top:8px;color:var(--text)">储值 ${formatYen(card.rechargeBalance)} · 赠送 ${formatYen(card.giftBalance)}</div>`);
      if (typeof syncMemberCardsFromHoldings === 'function' && getCustomer()?.id) {
        syncMemberCardsFromHoldings(getCustomer().id);
      }
      renderBillCardAssetPage();
      renderBillHeader();
      return true;
    }
    if (pending.type === 'times') {
      const adds = pending.adds || {};
      (card.projects || []).forEach(p => {
        if (p.unlimited) return;
        const key = p.key || p.label;
        const add = Number(adds[key]) || 0;
        if (add > 0) p.remain = (Number(p.remain) || 0) + add;
      });
      const due = round2(Number(pending.amount) || 0);
      const lines = pending.lines || [];
      state.billAssetPay = null;
      state.payAmounts = {};
      state.payManualEdit = {};
      closeMask('payMask');
      showBillAssetOk('续次成功', `
        <div>已为「${escapeHtml(card.name)}」续次</div>
        <div style="margin-top:6px">${escapeHtml(lines.join(' · '))}</div>
        <div style="margin-top:8px;color:var(--text)">实付 ${formatYen(due)}</div>`);
      if (typeof syncMemberCardsFromHoldings === 'function' && getCustomer()?.id) {
        syncMemberCardsFromHoldings(getCustomer().id);
      }
      renderBillCardAssetPage();
      renderBillHeader();
      return true;
    }
    if (pending.type === 'extend') {
      const tpl = (typeof getTemplateForHolderOps === 'function' ? getTemplateForHolderOps(pending.templateId) : null)
        || CARD_TPL_BY_ID[pending.templateId];
      const memberId = pending.memberId || getCustomer()?.id;
      const fee = round2(Number(pending.fee != null ? pending.fee : pending.amount) || 0);
      state.billAssetPay = null;
      state.payAmounts = {};
      state.payManualEdit = {};
      closeMask('payMask');
      if (tpl && memberId) {
        commitBillExtend({
          card,
          tpl,
          memberId,
          unit: pending.unit || 'month',
          extendDays: pending.extendDays,
          extendFee: fee,
          permanent: !!pending.permanent,
          silent: true,
        });
      }
      showBillAssetOk('延期成功', `
        <div>已为「${escapeHtml(card.name)}」延期</div>
        <div style="margin-top:8px;color:var(--text)">实付 ${formatYen(fee)}</div>`);
      return true;
    }
    state.billAssetPay = null;
    return false;
  }
  function staffLabel(ids) {
    const list = (ids || []).map(id => getStaffPool().find(s => s.id === id)).filter(Boolean);
    if (!list.length) return { text: '未指定员工', done: false };
    return { text: list.map(s => s.name).join('、') + '·', done: true };
  }
  function lineUnit(it) {
    const u = Number(it.unitPrice);
    return Number.isFinite(u) ? u : (Number(it.price) || 0);
  }
  function isQuickCartItem(it) {
    if (!it) return false;
    if (it.isQuick || it.type === 'quick' || it.kind === 'quick') return true;
    if (it.category === '直接收款' || it.name === '直接收款') return true;
    /* 兼容历史数据：旧名「快速消费」 */
    if (it.category === '快速消费' || it.name === '快速消费') return true;
    return !!(it.id && String(it.id).indexOf('quick-') === 0);
  }
  function cartItemBadgeMeta(it) {
    if (isQuickCartItem(it)) return { text: '直', cls: ' detail-item__badge--quick', kind: 'quick' };
    if (it.type === 'card' || it.kind === 'card') return { text: '卡', cls: ' detail-item__badge--card', kind: 'card' };
    if (it.type === 'group' || it.kind === 'group' || it.kind === 'tuangou') {
      return { text: '团', cls: ' detail-item__badge--group', kind: 'group' };
    }
    /* 库存/SKU 与产品同类：统一标「产」，不再用「库」 */
    if (it.fromStock || it.skuId || it.category === '产品' || it.type === 'product' || it.kind === 'product') {
      return { text: '产', cls: ' detail-item__badge--product', kind: 'product' };
    }
    return { text: '项', cls: '', kind: 'project' };
  }

  function cartItemBadgeHtml(it) {
    const badge = cartItemBadgeMeta(it);
    if (badge.kind === 'quick') {
      return '<span class="detail-item__badge detail-item__badge--quick" aria-label="直接收款"><img src="assets/ic_lightning_tag.svg" alt="" width="17" height="17" draggable="false"></span>';
    }
    return `<span class="detail-item__badge${badge.cls}">${badge.text}</span>`;
  }
  function cartCount() { return state.cart.reduce((s, i) => s + i.qty, 0); }
  function cartListTotal() { return round2(state.cart.reduce((s, i) => s + lineUnit(i) * i.qty, 0)); }
  function getCartQty(id) { return state.cart.find(x => x.id === id)?.qty || 0; }

  function isBillProductItem(item) {
    if (!item) return false;
    if (item.fromStock || item.skuId) return true;
    if (item.category === '产品' || item.type === 'product' || item.kind === 'product') return true;
    if (typeof getCatalogProducts === 'function' && getCatalogProducts().some(p => p.id === item.id)) return true;
    return false;
  }

  /** null = 不限购；数字含 0 = 可购上限 */
  function productStockCap(itemOrId) {
    const item = typeof itemOrId === 'object' && itemOrId ? itemOrId : null;
    const id = typeof itemOrId === 'string' ? itemOrId : item && item.id;
    if (item && item.skuId && window.StockStore && Array.isArray(window.StockStore.skus)) {
      const sku = window.StockStore.skus.find(s => s.id === item.skuId);
      if (sku) return Math.max(0, Math.round(Number(sku.stock) || 0));
    }
    if (item && item.stock != null && item.stock !== '') {
      const n = Number(item.stock);
      if (Number.isFinite(n)) return Math.max(0, Math.round(n));
    }
    if (typeof findCatalogItemById === 'function' && id) {
      const cat = findCatalogItemById(id);
      if (cat && typeof getCatalogProducts === 'function' && getCatalogProducts().some(p => p.id === cat.id)) {
        return typeof catalogStockLimit === 'function' ? catalogStockLimit(cat) : null;
      }
    }
    return null;
  }

  function clampCartToProductStock(opts) {
    const toast = !!(opts && opts.toast);
    let changed = false;
    const next = [];
    state.cart.forEach(it => {
      if (!isBillProductItem(it)) { next.push(it); return; }
      const cap = productStockCap(it);
      if (cap == null) { next.push(it); return; }
      if (cap <= 0) { changed = true; return; }
      if ((Number(it.qty) || 0) > cap) {
        it.qty = cap;
        changed = true;
      }
      next.push(it);
    });
    state.cart = next;
    if (changed) {
      syncCartChrome();
      if (toast) showToast('库存已变化，已调整购物车数量');
    }
    return changed;
  }

  function findCatalogProductByNameSpec(name, spec) {
    const n = String(name || '').trim();
    const s = String(spec || '').trim();
    if (!n || typeof getCatalogProducts !== 'function') return null;
    return getCatalogProducts().find(p => {
      if (!p || String(p.name || '').trim() !== n) return false;
      return String(p.spec || '').trim() === s;
    }) || null;
  }

  function stockSkuCategoryName(sku) {
    if (!sku || !window.StockStore) return '产品';
    const cat = (window.StockStore.categories || []).find(c => c.id === sku.categoryId);
    return (cat && cat.name) || '产品';
  }

  function stockSkuDefaultPrice(sku) {
    if (!sku) return 0;
    /* P2：从库存添加一律按成本价计入应付 / 写入价目 */
    const cost = Number(sku.cost);
    return Number.isFinite(cost) ? round2(Math.max(0, cost)) : 0;
  }

  function topCatalogProductSortOrder(catalog, count) {
    const list = Array.isArray(catalog) ? catalog : [];
    const n = Math.max(1, Number(count) || 1);
    if (typeof ensureCatalogSortOrder === 'function') ensureCatalogSortOrder(list);
    const min = list.length ? Math.min(...list.map(p => (p.sortOrder != null ? Number(p.sortOrder) : 0))) : 0;
    return min - n;
  }

  function listBillStockSkus() {
    const skus = (window.StockStore && window.StockStore.skus) || [];
    return skus.slice().sort((a, b) => {
      const an = String(a.product || '').localeCompare(String(b.product || ''), 'zh');
      if (an) return an;
      return String(a.name || '').localeCompare(String(b.name || ''), 'zh');
    });
  }

  function renderBillStockPickSheet() {
    const root = document.getElementById('billStockPickList');
    const okBtn = document.getElementById('billStockPickOk');
    if (!root) return;
    const selected = state.billStockPickSelected || {};
    const list = listBillStockSkus();
    if (!list.length) {
      root.innerHTML = '<div class="empty-cart">暂无库存商品<br>请先在库存管理中新增</div>';
      if (okBtn) okBtn.disabled = true;
      return;
    }
    root.innerHTML = list.map(sku => {
      const on = !!selected[sku.id];
      const price = stockSkuDefaultPrice(sku);
      const stock = Math.max(0, Number(sku.stock) || 0);
      const inCat = !!findCatalogProductByNameSpec(sku.product, sku.name);
      return `<button type="button" class="bill-stock-pick-row${on ? ' is-on' : ''}" data-bill-stock-sku="${escapeHtml(sku.id)}" ${stock <= 0 ? 'disabled' : ''}>
        <span class="bill-stock-pick-row__check" aria-hidden="true">${on ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>' : ''}</span>
        <span class="bill-stock-pick-row__main">
          <span class="bill-stock-pick-row__name">${escapeHtml(sku.product || '')}</span>
          ${sku.name ? `<span class="bill-stock-pick-row__spec">${escapeHtml(sku.name)}</span>` : ''}
          <span class="bill-stock-pick-row__meta">库存 ${stock}${sku.unit ? sku.unit : ''}${inCat ? ' · 已在价目表' : ''}</span>
        </span>
        <span class="bill-stock-pick-row__price"><span class="bill-stock-pick-row__price-lab">成本</span>${formatYen(price)}</span>
      </button>`;
    }).join('');
    const n = Object.keys(selected).filter(k => selected[k]).length;
    if (okBtn) {
      okBtn.disabled = n <= 0;
      okBtn.textContent = n > 0 ? `加入购物车（${n}）` : '加入购物车';
    }
  }

  function openBillStockPick() {
    state.billStockPickSelected = {};
    renderBillStockPickSheet();
    openMask('billStockPickMask');
  }

  function applyBillStockPick() {
    const selected = state.billStockPickSelected || {};
    const ids = Object.keys(selected).filter(k => selected[k]);
    if (!ids.length) { showToast('请选择库存商品'); return; }
    let added = 0;
    ids.forEach(id => {
      const sku = ((window.StockStore && window.StockStore.skus) || []).find(s => s.id === id);
      if (!sku) return;
      const stock = Math.max(0, Number(sku.stock) || 0);
      if (stock <= 0) return;
      const price = stockSkuDefaultPrice(sku);
      const item = {
        id: 'stock-' + sku.id,
        skuId: sku.id,
        name: sku.product || '',
        spec: sku.name || '',
        price,
        unitPrice: price,
        type: 'product',
        kind: 'product',
        category: '产品',
        fromStock: true,
        stock,
      };
      const row = state.cart.find(x => x.id === item.id);
      if (row) {
        if ((row.qty || 0) >= stock) return;
        setCartQty(item, 1);
      } else {
        setCartQty(item, 1);
      }
      added += 1;
    });
    closeMask('billStockPickMask');
    state.billStockPickSelected = {};
    if (added) {
      showToast(`已添加 ${added} 件库存商品`);
      syncCartChrome();
      if (document.getElementById('screen-bill') && !document.getElementById('screen-bill').classList.contains('hidden')) {
        renderBillHeader();
      }
    }
  }

  function collectPendingCatalogAddsFromCart() {
    const pending = [];
    const seen = new Set();
    (state.cart || []).forEach(it => {
      if (!it || !(it.fromStock || it.skuId)) return;
      if (!isBillProductItem(it)) return;
      const name = String(it.name || '').trim();
      const spec = String(it.spec || '').trim();
      if (!name) return;
      const key = name + '|' + spec;
      if (seen.has(key)) return;
      seen.add(key);
      if (findCatalogProductByNameSpec(name, spec)) return;
      pending.push({
        skuId: it.skuId || '',
        name,
        spec,
        price: round2(lineUnit(it)),
        category: stockSkuCategoryName(
          ((window.StockStore && window.StockStore.skus) || []).find(s => s.id === it.skuId)
        ),
      });
    });
    return pending;
  }

  function openBillStockToCatalogDialog() {
    const list = state.pendingCatalogAdds || [];
    if (!list.length) return;
    const body = document.getElementById('billStockToCatalogBody');
    if (body) body.textContent = '将按成本价加入价目表，下次可直接点选。';
    document.getElementById('billStockToCatalogMask')?.classList.add('show');
  }

  function closeBillStockToCatalogDialog() {
    document.getElementById('billStockToCatalogMask')?.classList.remove('show');
  }

  function confirmBillStockToCatalogAdds() {
    const list = state.pendingCatalogAdds || [];
    if (!list.length) {
      closeBillStockToCatalogDialog();
      return;
    }
    const catalog = typeof getCatalogProducts === 'function' ? getCatalogProducts() : null;
    if (!Array.isArray(catalog)) {
      closeBillStockToCatalogDialog();
      showToast('价目表不可用');
      return;
    }
    const toAdd = list.filter(row => !findCatalogProductByNameSpec(row.name, row.spec));
    let ord = topCatalogProductSortOrder(catalog, toAdd.length);
    let n = 0;
    toAdd.forEach((row) => {
      const id = typeof projUid === 'function' ? projUid() : ('pd' + Date.now() + n);
      catalog.unshift({
        id,
        name: row.name,
        spec: row.spec || '',
        price: round2(Number(row.price) || 0),
        onSale: true,
        category: row.category || '产品',
        sortOrder: ord++,
        boundToCard: false,
        boundToCoupon: false,
        boundToMall: false,
        hidden: false,
        boundTemplateIds: [],
        boundTemplateId: null,
        boundTemplateNames: [],
      });
      if (row.skuId && window.StockStore && Array.isArray(window.StockStore.skus)) {
        const sku = window.StockStore.skus.find(s => s.id === row.skuId);
        if (sku) {
          sku.catalogStock = Math.max(0, Number(sku.stock) || 0);
          sku.moved = true;
        }
      }
      n += 1;
    });
    state.pendingCatalogAdds = [];
    closeBillStockToCatalogDialog();
    showToast(n > 0 ? `已按成本价加入价目表 ${n} 件` : '价目表已是最新');
  }

  function skipBillStockToCatalogAdds() {
    state.pendingCatalogAdds = [];
    closeBillStockToCatalogDialog();
  }

  function deductProductStockAfterPay() {
    let changed = false;
    state.cart.forEach(it => {
      if (!isBillProductItem(it)) return;
      const qty = Math.max(0, Number(it.qty) || 0);
      if (it.skuId && window.StockStore && Array.isArray(window.StockStore.skus)) {
        const sku = window.StockStore.skus.find(s => s.id === it.skuId);
        if (sku) {
          sku.stock = Math.max(0, (Number(sku.stock) || 0) - qty);
          sku.moved = true;
          changed = true;
        }
      }
      if (typeof findCatalogItemById !== 'function') return;
      const cat = findCatalogItemById(it.id);
      if (!cat || typeof getCatalogProducts !== 'function' || !getCatalogProducts().some(p => p.id === cat.id)) return;
      const cap = typeof catalogStockLimit === 'function' ? catalogStockLimit(cat) : null;
      if (cap == null) return;
      cat.stock = Math.max(0, cap - qty);
      changed = true;
    });
    if (changed && typeof isProductCatalogTab === 'function' && isProductCatalogTab() && typeof projRenderList === 'function') {
      try { projRenderList(); } catch (_) { /* ignore */ }
    }
    return changed;
  }

  function setCartQty(item, delta) {
    let row = state.cart.find(x => x.id === item.id);
    let next = (row?.qty || 0) + delta;
    if (delta > 0 && isBillProductItem(item)) {
      const cap = productStockCap(item);
      if (cap != null) {
        if (cap <= 0) {
          showToast('库存不足');
          return;
        }
        if (next > cap) {
          const cur = row?.qty || 0;
          if (cur >= cap) {
            showToast(`库存不足，最多 ${cap} 件`);
            return;
          }
          showToast(`库存不足，最多 ${cap} 件`);
          next = cap;
        }
      }
    }
    if (delta > 0 && next > INPUT_LIMITS.CART_QTY_MAX) {
      const cur = row?.qty || 0;
      if (cur >= INPUT_LIMITS.CART_QTY_MAX) {
        showToast(`单品数量不能超过 ${INPUT_LIMITS.CART_QTY_MAX}`, true);
        return;
      }
      showToast(`单品数量不能超过 ${INPUT_LIMITS.CART_QTY_MAX}`, true);
      next = INPUT_LIMITS.CART_QTY_MAX;
    }
    if (next <= 0) {
      state.cart = state.cart.filter(x => x.id !== item.id);
      if (state.billDraft && !getDraftLines().length) {
        state.billDraft = null;
        syncBillComposerMode();
      }
    } else if (row) {
      row.qty = next;
      if (next > 0) {
        const draft = ensureBillDraft();
        if (!row.slipId) row.slipId = draft.id;
      }
    } else {
      const unit = Number.isFinite(Number(item.unitPrice)) ? Number(item.unitPrice)
        : (Number(item.price) || 0);
      const draft = ensureBillDraft();
      state.cart.push({
        ...item,
        qty: next,
        price: unit,
        unitPrice: unit,
        staffIds: [],
        staffRoles: {},
        staffDesignated: {},
        expanded: false,
        slipId: draft.id,
      });
    }
    clearBillDueOverride();
    syncBillComposerMode();
    syncCartChrome();
    const billScreen = document.getElementById('screen-bill');
    if (billScreen && !billScreen.classList.contains('hidden')) renderBillHeader();
  }
  function clearCart() {
    state.cart = [];
    clearBillDueOverride();
    state.payDueSnapshot = null;
    resetBillSlipState();
    syncCartChrome();
    const billScreen = document.getElementById('screen-bill');
    if (billScreen && !billScreen.classList.contains('hidden')) renderBillHeader();
  }
  function syncPickHoldsEntry() {
    purgeExpiredHolds({ quiet: true });
    const el = document.getElementById('pickHoldsEntry');
    const btn = document.getElementById('btnOpenHolds');
    if (!el || !btn) return;
    const n = state.heldOrders.length;
    el.hidden = n <= 0;
    const label = btn.querySelector('.pick-holds-entry__label');
    if (label) label.textContent = `取挂单（${n}）`;
    else btn.textContent = `取挂单（${n}）`;
  }
  function syncCartChrome() {
    const n = cartCount();
    const badge = document.getElementById('cartBadge');
    if (badge) {
      badge.textContent = n;
      badge.classList.toggle('hidden', n <= 0);
    }
    const preview = document.getElementById('billDuePreview');
    const label = document.getElementById('billDueLabel');
    const nextBtn = document.getElementById('btnBillNext');
    const sealedCount = (state.billSlips || []).length;
    const draftLines = getDraftLines();
    const mode = state.billComposerMode;
    let due = cartListTotal();
    if (mode === 'drafting' && state.billDraft) {
      due = slipSubtotal(state.billDraft.id);
      if (label) label.textContent = '本单小计';
    } else if (label) {
      label.textContent = '应付';
    }
    if (preview) preview.innerHTML = formatYenParts(due);
    if (nextBtn) {
      if (mode === 'drafting' && draftLines.length) {
        nextBtn.textContent = '添加此单';
        nextBtn.disabled = false;
      } else if (sealedCount >= 1) {
        nextBtn.textContent = '去结账';
        nextBtn.disabled = false;
      } else {
        nextBtn.textContent = '去结账';
        nextBtn.disabled = true;
      }
    }
  }

  function calcSettlement() {
    const listTotal = cartListTotal();
    let remaining = listTotal;
    let projectDeduct = 0;
    const projectDeductByItemId = {};
    const projectLines = [];
    const picks = state.benefitApplied;

    if (isMemberBill()) {
      getCustomer().cards.forEach(card => {
        const pick = picks[card.id];
        if (!pick) return;
        (pick.projects || []).forEach(pr => {
          if (!pr.qty) return;
          const targets = state.cart.filter(it => cartItemMatchesProjectBenefit(it, pr));
          let left = pr.qty;
          targets.forEach(it => {
            if (left <= 0) return;
            const use = Math.min(left, it.qty);
            const amt = round2(lineUnit(it) * use);
            projectDeduct += amt;
            projectDeductByItemId[it.id] = round2((projectDeductByItemId[it.id] || 0) + amt);
            remaining = round2(remaining - amt);
            projectLines.push({ card: card.name, label: pr.label, qty: use, amount: amt });
            left -= use;
          });
        });
      });
    }
    remaining = Math.max(0, remaining);

    let discountDeduct = 0;
    let discountRate = null;
    if (isMemberBill() && remaining > 0) {
      /* 折扣仅作用于权益范围内的服务项目；直接收款 / 产品不参与 */
      for (const card of getCustomer().cards) {
        const pick = picks[card.id];
        if (!(pick?.discountOn && card.discount && cardBenefits(card).projectDiscount)) continue;
        let scopedSub = 0;
        state.cart.forEach(it => {
          if (!cartItemEligibleForCardDiscount(it, card)) return;
          const line = round2(lineUnit(it) * it.qty);
          const already = projectDeductByItemId[it.id] || 0;
          scopedSub = round2(scopedSub + Math.max(0, line - already));
        });
        const discountBase = Math.min(Math.max(0, scopedSub), remaining);
        if (discountBase > 0) {
          discountRate = card.discount;
          discountDeduct = round2(discountBase * (1 - card.discount));
          remaining = round2(remaining - discountDeduct);
        }
        break;
      }
    }

    let couponDeduct = 0;
    let couponLabel = '';
    const coupon = COUPONS.find(c => c.id === state.selectedCouponId);
    /* 项目通用券：只抵扣服务项目剩余，不吃产品/库存成本价；抵用券：绑定项目/产品全额抵用 */
    const couponExDeduct = coupon && coupon.tag === '抵用券' ? couponExchangeDeduct(coupon) : 0;
    const couponCap = Math.max(0, Math.min(
      remaining,
      round2(cartDiscountableSubtotal() - projectDeduct - discountDeduct)
    ));
    if (coupon && couponCap > 0 && listTotal >= (coupon.minAmount || 0)) {
      couponDeduct = coupon.tag === '抵用券' ? Math.min(couponExDeduct, couponCap) : Math.min(coupon.amount, couponCap);
      remaining = round2(remaining - couponDeduct);
      couponLabel = coupon.name;
    }

    const openCardAmount = state.pendingOpenCard ? round2(Number(state.pendingOpenCard.amount) || 0) : 0;
    let balanceDeduct = 0;
    const balanceLines = [];
    const membercardAllowed = canPayWithMembercardFace();
    const membercardPay = membercardAllowed ? round2(Number(state.payAmounts?.membercard) || 0) : 0;
    if (isMemberBill() && membercardAllowed) {
      if (membercardPay > 0) {
        const cap = round2(Math.max(0, remaining) + openCardAmount);
        const alloc = allocateMembercardBalance(membercardPay, cap);
        balanceDeduct = alloc.total;
        balanceLines.push(...alloc.lines);
      } else {
        getCustomer().cards.forEach(card => {
          const pick = picks[card.id];
          let amt = round2(Number(pick?.balanceUse) || 0);
          if (pick?.fixedUse) amt = Math.max(amt, 98);
          if (amt <= 0 || !cardHasFaceBenefit(card)) return;
          const use = Math.min(amt, card.balance, remaining);
          if (use <= 0) return;
          balanceDeduct += use;
          remaining = round2(remaining - use);
          balanceLines.push({ card: card.name, amount: use });
        });
        balanceDeduct = round2(balanceDeduct);
      }
    }

    let dueCash = membercardPay > 0 && isMemberBill()
      ? Math.max(0, round2(Math.max(0, remaining) + openCardAmount - balanceDeduct))
      : Math.max(0, round2(remaining + openCardAmount));
    /* 手动改应付：输入值即最终应付，账单构成仍保留原抵扣展示 */
    if (state.billDueOverride != null && !state.orderIsFree) {
      dueCash = round2(Math.max(0, Number(state.billDueOverride) || 0));
    }

    return {
      listTotal, projectDeduct, projectLines, discountDeduct, discountRate,
      couponDeduct, couponLabel,
      balanceDeduct, balanceLines, openCardAmount, dueCash,
    };
  }

  function getSelectedCoupon() {
    return COUPONS.find(c => c.id === state.selectedCouponId) || null;
  }

  function couponSummaryText() {
    const c = getSelectedCoupon();
    if (!c) return '请选择优惠券';
    return `-${formatYen(c.amount)}`;
  }

  function benefitSummaryText() {
    const s = calcSettlement();
    const parts = [];
    if (s.projectDeduct > 0) parts.push('项目抵扣 ' + formatYen(s.projectDeduct));
    if (s.discountDeduct > 0) parts.push((s.discountRate * 10).toFixed(1) + '折 -' + formatYen(s.discountDeduct));
    if (s.balanceDeduct > 0) parts.push('面值抵扣 ' + formatYen(s.balanceDeduct));
    return parts.length ? parts.join(' · ') : '未使用权益';
  }

  function formatPickSpend(n) {
    const v = Math.round(Number(n) || 0);
    return v.toLocaleString('zh-CN');
  }

  /** totalSpend = 本店该顾客所有消费的实付金额合计（不含卡金抵扣/赠送/未付/已退款） */
  function customerPickMetrics(c) {
    const cardCount = Array.isArray(c.cards) ? c.cards.length : 0;
    const spend = Number(c.totalSpend);
    return {
      cardCount,
      totalSpend: Number.isFinite(spend) ? spend : 0,
    };
  }

  function customerPickRowHtml(c, dataAttr) {
    const m = customerPickMetrics(c);
    const recentText = c.lastVisit ? escapeHtml(c.lastVisit) : '未消费';
    /* Lucide · phone */
    const phoneIcon = '<svg class="customer-row__meta-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    /* Phosphor · footprints 左脚（光脚：脚掌+脚趾垫） */
    const footIcon = '<svg class="customer-row__recent-icon" viewBox="40 12 80 196" fill="currentColor" aria-hidden="true"><path d="M104 160H48a8 8 0 0 0-8 8v12a36 36 0 0 0 72 0v-12a8 8 0 0 0-8-8Zm-8 20a20 20 0 0 1-40 0v-4h40ZM76 16C64.36 16 53.07 26.31 44.2 45c-13.93 29.38-18.56 73 .29 96a8 8 0 0 0 6.2 2.93h50.55a8 8 0 0 0 6.2-2.93c18.85-23 14.22-66.65.29-96C98.85 26.31 87.57 16 76 16Zm21.15 112H54.78c-11.4-18.1-7.21-52.7 3.89-76.11C65.14 38.22 72.17 32 76 32s10.82 6.22 17.3 19.89C104.36 75.3 108.55 109.9 97.15 128Z"/></svg>';
    /* Stratis UI · currency-coin-yen */
    const spendIcon = '<svg class="customer-row__stat-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 17.28V12.24M12 12.24L8.4 7.2M12 12.24L15.6 7.2M9.12 15.84h5.76M9.12 12.96h5.76M21.6 12c0 5.302-4.298 9.6-9.6 9.6S2.4 17.302 2.4 12 6.698 2.4 12 2.4s9.6 4.298 9.6 9.6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const cardIcon = '<svg class="customer-row__stat-icon" viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="1.5" y="3.5" width="11" height="7.5" rx="1.4" stroke="currentColor" stroke-width="1.2"/><path d="M1.5 6.2h11" stroke="currentColor" stroke-width="1.2"/><path d="M4 9.2h2.8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';
    return `<div class="customer-row" ${dataAttr}>
      <img class="customer-row__avatar" src="${c.avatar}" alt="" onerror="this.onerror=null;this.src='assets/billing/avatar-female.png'">
      <div class="customer-row__main">
        <div class="customer-row__name">${escapeHtml(c.name)}</div>
        <div class="customer-row__meta">${phoneIcon}<span class="customer-row__meta-text">${escapeHtml(c.phone || '')}</span></div>
        <div class="customer-row__recent">${footIcon}<span class="customer-row__recent-text">${recentText}</span></div>
      </div>
      <div class="customer-row__stats" aria-label="消费与持卡">
        <div class="customer-row__stat">${spendIcon}<span class="customer-row__spend-label">总消费</span><span class="customer-row__spend"><span class="yen">¥</span>${formatPickSpend(m.totalSpend)}</span></div>
        <div class="customer-row__stat">${cardIcon}<span class="customer-row__cards">持卡 ${m.cardCount}</span></div>
      </div>
    </div>`;
  }

  function renderCustomerList() {
    const q = state.searchQuery.trim().toLowerCase();
    const showMale = !q || '男散客'.includes(q) || '男'.includes(q) || '散客'.includes(q);
    const showFemale = !q || '女散客'.includes(q) || '女'.includes(q) || '散客'.includes(q);
    const guestRows = [];
    if (showMale) {
      guestRows.push(`<div class="customer-row customer-row--guest-pin" data-pick-guest="male">
        <img class="customer-row__avatar" src="${AVATAR_MALE}" alt="">
        <div>
          <div class="customer-row__name">男散客</div>
          <div class="customer-row__meta">未注册顾客 · 男</div>
        </div>
      </div>`);
    }
    if (showFemale) {
      guestRows.push(`<div class="customer-row customer-row--guest-pin" data-pick-guest="female">
        <img class="customer-row__avatar" src="${AVATAR_FEMALE}" alt="">
        <div>
          <div class="customer-row__name">女散客</div>
          <div class="customer-row__meta">未注册顾客 · 女</div>
        </div>
      </div>`);
    }
    const list = CUSTOMERS.filter(c => {
      if (!q) return true;
      const letter = customerLetter(c).toLowerCase();
      return c.name.includes(q) || c.phone.includes(q) || letter === q || (c.cards || []).some(card => card.name.includes(q));
    });
    const groups = {};
    list.forEach(c => {
      const L = customerLetter(c);
      if (!groups[L]) groups[L] = [];
      groups[L].push(c);
    });
    const letters = Object.keys(groups).sort((a, b) => (a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)));
    const memberHtml = letters.map(L => {
      const rows = groups[L].map(c => customerPickRowHtml(c, `data-pick="${c.id}"`)).join('');
      return `<div class="pick-letter" data-letter="${L}">${L}</div>${rows}`;
    }).join('');
    const guestBlock = guestRows.length
      ? `<div class="bill-pick-section-label">散客</div>${guestRows.join('')}`
      : '';
    const memberBlock = memberHtml
      ? `${guestRows.length ? '<div class="bill-pick-section-label">会员</div>' : ''}${memberHtml}`
      : '';
    (document.getElementById('customerList')||{innerHTML:""}).innerHTML = guestBlock + memberBlock || '<div class="empty-cart">无匹配顾客</div>';
    state.pickAvailableLetters = letters;
    if (!letters.includes(state.pickLetter) && letters.length) state.pickLetter = letters[0];
    renderPickIndex();
  }

  function renderPickIndex() {
    const available = new Set(state.pickAvailableLetters || []);
    const el = document.getElementById('pickIndex');
    if (!el) return;
    el.innerHTML = PICK_INDEX_LETTERS.map(L => {
      const has = available.has(L);
      const on = has && state.pickLetter === L;
      const cls = (on ? 'is-on' : '') + (has ? '' : ' is-empty');
      const disabledAttrs = has ? '' : ' tabindex="-1" aria-disabled="true"';
      return '<button type="button" data-idx-letter="' + L + '" class="' + cls + '" aria-label="定位到 ' + L + '"' + disabledAttrs + '>' + L + '</button>';
    }).join('');
  }

  function nearestPickLetter(L) {
    const available = state.pickAvailableLetters || [];
    if (!available.length) return null;
    if (available.includes(L)) return L;
    const i = PICK_INDEX_LETTERS.indexOf(L);
    if (i < 0) return available[0];
    for (let d = 1; d < PICK_INDEX_LETTERS.length; d++) {
      const left = PICK_INDEX_LETTERS[i - d];
      const right = PICK_INDEX_LETTERS[i + d];
      if (left && available.includes(left)) return left;
      if (right && available.includes(right)) return right;
    }
    return available[0];
  }

  function setPickIndexActive(L) {
    state.pickLetter = L;
    document.querySelectorAll('#pickIndex [data-idx-letter]').forEach(btn => {
      const letter = btn.dataset.idxLetter;
      btn.classList.toggle('is-on', letter === L && !btn.classList.contains('is-empty'));
    });
  }

  function jumpToPickLetter(L, { smooth = true } = {}) {
    const targetLetter = nearestPickLetter(L);
    if (!targetLetter) return;
    const list = document.getElementById('customerList');
    const head = list?.querySelector(`.pick-letter[data-letter="${targetLetter}"]`);
    if (!head) return;
    setPickIndexActive(targetLetter);
    head.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' });
  }

  function showPickIndexBubble(L) {
    const bubble = document.getElementById('pickIndexBubble');
    if (!bubble) return;
    bubble.textContent = L;
    bubble.classList.add('is-show');
  }

  function hidePickIndexBubble() {
    document.getElementById('pickIndexBubble')?.classList.remove('is-show');
  }

  function letterFromPickIndexY(clientY) {
    const bar = document.getElementById('pickIndex');
    if (!bar) return null;
    const rect = bar.getBoundingClientRect();
    if (rect.height <= 0) return null;
    const y = Math.min(Math.max(clientY - rect.top, 0), rect.height - 0.001);
    const idx = Math.floor((y / rect.height) * PICK_INDEX_LETTERS.length);
    return PICK_INDEX_LETTERS[Math.min(Math.max(idx, 0), PICK_INDEX_LETTERS.length - 1)];
  }

  function selectPickIndexLetter(L, { bubble = false, smooth = false } = {}) {
    const target = nearestPickLetter(L);
    if (!target) return;
    jumpToPickLetter(target, { smooth });
    if (bubble) showPickIndexBubble(target);
  }

  function syncPickIndexFromScroll() {
    const list = document.getElementById('customerList');
    if (!list) return;
    const heads = list.querySelectorAll('.pick-letter');
    if (!heads.length) return;
    const marker = list.scrollTop + 10;
    let current = heads[0].dataset.letter;
    heads.forEach(h => {
      if (h.offsetTop <= marker) current = h.dataset.letter;
    });
    if (current && current !== state.pickLetter) setPickIndexActive(current);
  }

  function renderBillCustomerPickList() {
    const q = state.searchQuery.trim().toLowerCase();
    const showMale = !q || '男散客'.includes(q) || '男'.includes(q) || '散客'.includes(q);
    const showFemale = !q || '女散客'.includes(q) || '女'.includes(q) || '散客'.includes(q);
    const guestRows = [];
    if (showMale) {
      guestRows.push(`<div class="customer-row customer-row--guest-pin" data-bill-pick-guest="male">
        <img class="customer-row__avatar" src="${AVATAR_MALE}" alt="">
        <div>
          <div class="customer-row__name">男散客</div>
          <div class="customer-row__meta">未注册顾客 · 男</div>
        </div>
      </div>`);
    }
    if (showFemale) {
      guestRows.push(`<div class="customer-row customer-row--guest-pin" data-bill-pick-guest="female">
        <img class="customer-row__avatar" src="${AVATAR_FEMALE}" alt="">
        <div>
          <div class="customer-row__name">女散客</div>
          <div class="customer-row__meta">未注册顾客 · 女</div>
        </div>
      </div>`);
    }
    const list = CUSTOMERS.filter(c => {
      if (!q) return true;
      const letter = customerLetter(c).toLowerCase();
      return c.name.includes(q) || c.phone.includes(q) || letter === q || (c.cards || []).some(card => card.name.includes(q));
    });
    const groups = {};
    list.forEach(c => {
      const L = customerLetter(c);
      if (!groups[L]) groups[L] = [];
      groups[L].push(c);
    });
    const letters = Object.keys(groups).sort((a, b) => (a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)));
    const memberHtml = letters.map(L => {
      const rows = groups[L].map(c => customerPickRowHtml(c, `data-bill-pick-member="${c.id}"`)).join('');
      return `<div class="pick-letter" data-letter="${L}">${L}</div>${rows}`;
    }).join('');
    const guestBlock = guestRows.length
      ? `<div class="bill-pick-section-label">散客</div>${guestRows.join('')}`
      : '';
    const memberBlock = memberHtml
      ? `${guestRows.length ? '<div class="bill-pick-section-label">会员</div>' : ''}${memberHtml}`
      : '';
    return guestBlock + memberBlock || '<div class="empty-cart">无匹配顾客</div>';
  }

  function renderBillHeader() {
    const c = getCustomer();
    syncBillCardGateChrome();
    captureBillCardRailScroll();

    if (state.billCustomerPickOpen) {
      (document.getElementById('billBody')||{innerHTML:""}).innerHTML = `
      ${renderCustomerNameCard(c, { withActions: true })}
      <div class="bill-sheet bill-sheet--pick">
        <div class="search-bar search-bar--bill search-bar--member">
          <svg width="16" height="16" viewBox="0 0 13 14" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="5.5" stroke="#666" stroke-linejoin="round"/><path d="M9.5 10.5L12.5 13.5" stroke="#666" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <input id="billSearch" type="search" placeholder="搜索姓名或手机" autocomplete="off" value="${escapeHtml(state.searchQuery)}">
          <button type="button" class="search-go">搜索</button>
        </div>
        <div class="catalog-list" id="catalogList">${renderBillCustomerPickList()}</div>
      </div>`;
      return;
    }

    const mode = state.billComposerMode || 'browse';
    const slipStack = renderBillSlipStack();

    if (mode === 'review') {
      (document.getElementById('billBody')||{innerHTML:""}).innerHTML = `
      ${renderCustomerNameCard(c, { withActions: true })}
      ${slipStack}
      <button type="button" class="bill-continue-add" id="btnBillContinueAdd" data-bill-continue-add>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
        继续添加
      </button>`;
      return;
    }

    (document.getElementById('billBody')||{innerHTML:""}).innerHTML = `
      ${renderCustomerNameCard(c, { withActions: true })}
      ${slipStack}
      ${renderBillActionPanel()}
      ${(!hasBillCardSelected() && ensureBillActionTab() !== 'quick') ? renderBillCatalogBlock({ scope: false }) : ''}`;
    if (document.getElementById('catalogList')) {
      renderBillGroupTabs();
      renderBillCatalog();
    }
    const rail = document.getElementById('billCardRailScroll');
    if (rail && typeof wireBillCardRailScroll === 'function') wireBillCardRailScroll(rail);
    restoreBillCardRailScroll();
    requestAnimationFrame(() => restoreBillCardRailScroll());
    if (ensureBillActionTab() === 'quick') {
      const panel = document.getElementById('billActionPanel');
      const quickInp = document.getElementById('billQuickAmt');
      if (panel && typeof wireAmountKeypadInputs === 'function') wireAmountKeypadInputs(panel);
      if (quickInp) {
        const syncQuickDraft = () => {
          state.billQuickAmtDraft = String(quickInp.value || '').replace(/^¥/, '').trim();
          quickInp.classList.toggle('is-empty', !state.billQuickAmtDraft);
        };
        quickInp.addEventListener('input', syncQuickDraft);
        quickInp.addEventListener('change', syncQuickDraft);
      }
    }
  }

  function getBillGroupBucket() {
    return state.billTab === 'product' ? 'product' : 'project';
  }

  function getActiveBillGroupId() {
    if (!state.billGroupId) state.billGroupId = { project: 'all', product: 'all' };
    return state.billGroupId[getBillGroupBucket()] || 'all';
  }

  function setActiveBillGroupId(id) {
    if (!state.billGroupId) state.billGroupId = { project: 'all', product: 'all' };
    state.billGroupId[getBillGroupBucket()] = id || 'all';
  }

  function renderBillGroupTabs() {
    const el = document.getElementById('billGroupTabs');
    if (!el) return;
    const bucket = getBillGroupBucket();
    const groups = (typeof getCustomCatalogGroups === 'function')
      ? getCustomCatalogGroups(bucket)
      : [];
    const sysHidden = (typeof getSystemHiddenGroup === 'function')
      ? getSystemHiddenGroup(bucket)
      : null;
    const tabs = [
      { id: 'all', name: '全部' },
      ...groups.map(g => ({ id: g.id, name: g.name })),
      ...(sysHidden ? [{ id: sysHidden.id, name: sysHidden.name || '隐藏' }] : []),
    ];
    if (!tabs.some(t => t.id === getActiveBillGroupId())) setActiveBillGroupId('all');
    const cur = getActiveBillGroupId();
    el.innerHTML = tabs.map(t => (
      `<button type="button" class="catalog-group-tab${t.id === cur ? ' on' : ''}" data-bill-group="${escapeHtml(t.id)}" role="tab" aria-selected="${t.id === cur ? 'true' : 'false'}">
        <span class="catalog-group-tab__face"><span class="catalog-group-tab__label">${escapeHtml(t.name)}</span></span>
      </button>`
    )).join('');
    if (typeof wirePickGroupScrollPan === 'function') wirePickGroupScrollPan(el);
    requestAnimationFrame(() => {
      const on = el.querySelector('.catalog-group-tab.on');
      if (on && typeof ensureGroupTabFullyVisible === 'function') ensureGroupTabFullyVisible(el, on);
    });
  }

  function filterBillCatalogByGroup(list) {
    const bucket = getBillGroupBucket();
    const gid = getActiveBillGroupId();
    const catalog = bucket === 'product'
      ? (typeof getCatalogProducts === 'function' ? getCatalogProducts() : [])
      : (typeof getCatalogProjects === 'function' ? getCatalogProjects() : []);
    const byId = new Map(catalog.map(p => [p.id, p]));
    /* 开单：隐藏项可选（仅对顾客端隐藏）；已下架不可选 */
    let items = list.filter(it => {
      const raw = byId.get(it.id);
      if (!raw) return true;
      if (raw.onSale === false) return false;
      return true;
    });
    if (!gid || gid === 'all') return items;
    const g = (typeof findCatalogGroupById === 'function') ? findCatalogGroupById(gid, bucket) : null;
    if (g?.system) {
      return items.filter(it => {
        const raw = byId.get(it.id);
        return !!raw?.hidden;
      });
    }
    const ids = new Set(g?.itemIds || []);
    return items.filter(it => ids.has(it.id));
  }

  function getBillCatalogItems() {
    const bridge = window.CardCatalogBridge;
    const projects = bridge?.getBillProjects?.() || PROJECTS;
    const products = bridge?.getBillProducts?.() || PRODUCTS;
    return [...projects, ...products];
  }

  function renderBillCatalog() {
    const bridge = window.CardCatalogBridge;
    const src = state.billTab === 'project'
      ? (bridge?.getBillProjects?.() || PROJECTS)
      : (bridge?.getBillProducts?.() || PRODUCTS);
    const items = filterBillCatalogByCard(filterBillCatalogByGroup(src));
    const activeIds = getActiveBillPickCardIds();
    const scoped = activeIds.length > 0 && !activeIds.some(id => {
      const card = findHeldCardById(id);
      return card && getCardCatalogScope(card).mode === 'all';
    });
    const emptyLabel = !items.length && scoped
      ? '所选卡暂无适用项目/产品'
      : (getActiveBillGroupId() !== 'all'
        ? (state.billTab === 'product' ? '本组暂无产品' : '本组暂无项目')
        : '暂无匹配项');
    const emptyExtra = '';
    (document.getElementById('catalogList')||{innerHTML:""}).innerHTML = items.map(it => {
      const qty = getCartQty(it.id);
      const cap = state.billTab === 'product' ? productStockCap(it) : null;
      const plusDisabled = cap != null && qty >= cap;
      const stockHint = cap == null
        ? ''
        : `<div class="catalog-item__stock${cap <= 0 ? ' is-zero' : ''}">库存 ${cap}</div>`;
      return `<div class="catalog-item${plusDisabled && qty <= 0 ? ' is-stock-out' : ''}">
        <div class="catalog-item__info">
          <div class="catalog-item__name">${escapeHtml(it.name)}</div>
          <div class="catalog-item__price num">${formatPriceParts(it.price)}</div>
          ${stockHint}
        </div>
        <div class="stepper">
          ${qty ? `<button type="button" class="minus" data-step="${it.id}" data-d="-1" aria-label="减少">${iconSvg('minus')}</button><span class="num">${qty}</span>` : ''}
          <button type="button" class="plus" data-step="${it.id}" data-d="1" aria-label="增加"${plusDisabled ? ' disabled' : ''}>${iconSvg('plus')}</button>
        </div>
      </div>`;
    }).join('') || `<div class="empty-cart">${emptyLabel}${emptyExtra}</div>`;
  }

  function renderCartList(targetId) {
    const el = document.getElementById(targetId);
    if (!state.cart.length) { el.innerHTML = '<div class="empty-cart">购物车为空<br>返回开单台添加商品</div>'; return; }
    el.innerHTML = state.cart.map(it => {
      const cap = isBillProductItem(it) ? productStockCap(it) : null;
      const plusDisabled = cap != null && it.qty >= cap;
      return `
      <div class="catalog-item" style="padding:12px 16px">
        <div class="catalog-item__info">
          <div class="catalog-item__name">${escapeHtml(it.name)}${it.spec ? `<span style="font-weight:400;color:var(--text-sec)">（${escapeHtml(it.spec)}）</span>` : ''}${it.fromStock ? '<span style="margin-left:6px;font-size:11px;color:var(--brand);font-weight:500">库存</span>' : ''}</div>
          <div class="catalog-item__cat num">${formatYen(lineUnit(it))} × ${it.qty}${cap != null ? ` · 库存 ${cap}` : ''}</div>
        </div>
        <div class="catalog-item__price num">${formatYen(lineUnit(it) * it.qty)}</div>
        <div class="stepper">
          <button type="button" data-cart-step="${it.id}" data-d="-1" aria-label="减少">${iconSvg('minus')}</button>
          <span class="num">${it.qty}</span>
          <button type="button" data-cart-step="${it.id}" data-d="1" aria-label="增加"${plusDisabled ? ' disabled' : ''}>${iconSvg('plus')}</button>
        </div>
      </div>`;
    }).join('');
  }

  function staffChipLabel(st) {
    const s = (st.short || st.name || '').trim();
    if (/^[A-Za-z]+$/.test(s)) return s.charAt(0).toUpperCase();
    return s;
  }

  const DETAIL_SWIPE_WIDTH = 60;
  const DETAIL_SWIPE_MOVE = 8;

  function closeAllDetailSwipes(except) {
    document.querySelectorAll('.detail-item__track').forEach(track => {
      if (except && track === except) return;
      track.classList.remove('is-open');
      track.style.transform = '';
      track.style.transition = '';
      track.closest('.detail-item')?.classList.remove('is-swiping');
    });
  }

  function bindDetailItemSwipes() {
    document.querySelectorAll('.detail-item__track').forEach(track => {
      if (track.dataset.swipeWired === '1') return;
      track.dataset.swipeWired = '1';
      const item = track.closest('.detail-item');
      let activeId = null;
      let startX = 0;
      let startY = 0;
      let baseX = 0;
      let swiping = false;

      const detach = () => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onEnd);
        document.removeEventListener('pointercancel', onEnd);
      };

      const setTranslate = x => {
        track.style.transition = 'none';
        track.style.transform = `translateX(${x}px)`;
      };

      const settle = x => {
        track.style.transition = '';
        item?.classList.remove('is-swiping');
        const open = x < -DETAIL_SWIPE_WIDTH / 2;
        if (open) {
          closeAllDetailSwipes(track);
          track.classList.add('is-open');
          track.style.transform = `translateX(${-DETAIL_SWIPE_WIDTH}px)`;
        } else {
          track.classList.remove('is-open');
          track.style.transform = '';
        }
      };

      const onMove = e => {
        if (e.pointerId !== activeId) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (!swiping) {
          if (Math.abs(dx) < DETAIL_SWIPE_MOVE && Math.abs(dy) < DETAIL_SWIPE_MOVE) return;
          if (Math.abs(dy) > Math.abs(dx)) { activeId = null; detach(); return; }
          swiping = true;
          item?.classList.add('is-swiping');
          closeAllDetailSwipes(track);
          try { track.setPointerCapture(e.pointerId); } catch (_) {}
          baseX = track.classList.contains('is-open') ? -DETAIL_SWIPE_WIDTH : 0;
        }
        e.preventDefault();
        setTranslate(Math.min(0, Math.max(-DETAIL_SWIPE_WIDTH, baseX + dx)));
      };

      const onEnd = e => {
        if (e.pointerId !== activeId) return;
        detach();
        if (swiping) {
          const m = /translateX\((-?\d+(?:\.\d+)?)px\)/.exec(track.style.transform || '');
          settle(m ? parseFloat(m[1]) : 0);
          track.dataset.suppressClick = '1';
        } else {
          item?.classList.remove('is-swiping');
        }
        activeId = null;
        swiping = false;
      };

      track.addEventListener('pointerdown', e => {
        if (e.button !== 0) return;
        activeId = e.pointerId;
        startX = e.clientX;
        startY = e.clientY;
        swiping = false;
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onEnd);
        document.addEventListener('pointercancel', onEnd);
      });

      track.addEventListener('click', e => {
        if (track.dataset.suppressClick === '1') {
          track.dataset.suppressClick = '';
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
    });
  }

  function renderStaffPickerHtml(it) {
    ensureCartStaffState(it);
    const pool = getStaffPool();
    const edit = state.staffCardEdit && state.staffCardEdit.cartId === it.id ? state.staffCardEdit : null;
    const head = `<div class="detail-item__panel-row detail-item__panel-row--staff-head">
      <span>选择员工</span>
      <span class="chev ui-icon">${iconSvg('chevron-right', 'ui-icon')}</span>
    </div>`;
    const checkSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>`;
    const clearSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
    const cards = pool.map((st, index) => {
      const done = (it.staffIds || []).includes(st.id);
      const isEdit = !!(edit && edit.staffId === st.id);
      const dim = !!(edit && !isEdit);
      const origin = staffCardOrigin(index);
      const originSide = index % 3 === 0 ? 'left' : index % 3 === 2 ? 'right' : 'center';
      let body = '';
      const jobTitle = staffJobTitleHtml(st);
      if (isEdit && edit.face === 'designate') {
        body = `<div class="staff-card__split" role="group" aria-label="点客或散客">
          <button type="button" class="staff-card__split-btn staff-card__split-btn--des" data-staff-opt-designate="1" data-cart-id="${escapeHtml(it.id)}" data-staff-id="${escapeHtml(st.id)}">点客</button>
          <button type="button" class="staff-card__split-btn staff-card__split-btn--guest" data-staff-opt-designate="0" data-cart-id="${escapeHtml(it.id)}" data-staff-id="${escapeHtml(st.id)}">散客</button>
        </div>`;
      } else if (isEdit && edit.face === 'role') {
        const roleBtns = STAFF_ROLE_PICK_ORDER.map(rid => {
          const label = staffRoleLabel(rid);
          return `<button type="button" class="staff-card__split-btn staff-card__split-btn--role" data-staff-opt-role="${escapeHtml(rid)}" data-cart-id="${escapeHtml(it.id)}" data-staff-id="${escapeHtml(st.id)}">${escapeHtml(label)}</button>`;
        }).join('');
        body = `<div class="staff-card__split staff-card__split--3" role="group" aria-label="选择工位">${roleBtns}</div>`;
      } else {
        const pickLine = done
          ? `<div class="staff-card__title staff-card__title--pick">${escapeHtml(staffPickSummaryText(it, st.id))}</div>`
          : jobTitle;
        body = `
          ${done ? `<span class="staff-card__check">${checkSvg}</span>` : ''}
          ${staffAvatarHtml(st)}
          <div class="staff-card__name">${escapeHtml(st.name)}</div>
          ${pickLine}`;
      }
      const clearBtn = (done && !isEdit)
        ? `<button type="button" class="staff-card__clear" data-staff-clear data-cart-id="${escapeHtml(it.id)}" data-staff-id="${escapeHtml(st.id)}" aria-label="清空选择">${clearSvg}</button>`
        : '';
      if (isEdit) {
        return `<div class="staff-card is-editing${done ? ' is-done' : ''}"
          style="--staff-origin:${origin}"
          data-origin="${originSide}"
          data-staff-card data-cart-id="${escapeHtml(it.id)}" data-staff-id="${escapeHtml(st.id)}">
          <div class="staff-card__panel" data-face="${escapeHtml(edit.face)}">${body}</div>
        </div>`;
      }
      return `<div class="staff-card${done ? ' is-done' : ''}${dim ? ' is-dim' : ''}"
        style="--staff-origin:${origin}"
        data-origin="${originSide}"
        data-staff-card data-cart-id="${escapeHtml(it.id)}" data-staff-id="${escapeHtml(st.id)}">
        ${clearBtn}
        <button type="button" class="staff-card__panel" data-staff-card-hit data-cart-id="${escapeHtml(it.id)}" data-staff-id="${escapeHtml(st.id)}" aria-label="${escapeHtml(st.name)}">
          ${body}
        </button>
      </div>`;
    }).join('');
    return `<div class="detail-item__staff-block detail-item__staff-block--cards${edit ? ' is-picking' : ''}">
      ${head}
      ${edit ? `<button type="button" class="staff-card-scrim" data-staff-scrim aria-label="取消选择"></button>` : ''}
      <div class="staff-grid${edit ? ' is-morphing' : ''}">${cards}</div>
    </div>`;
  }

  function lineBenefitCardNames(it) {
    if (!it || !isMemberBill()) return '未选';
    const picks = state.benefitApplied || {};
    let preferCardIds = [];
    if (it.slipId) {
      const slip = (state.billSlips || []).find(s => s.id === it.slipId)
        || (state.billDraft && state.billDraft.id === it.slipId ? state.billDraft : null);
      if (slip && Array.isArray(slip.cardIds)) preferCardIds = slip.cardIds.slice();
    }
    const held = getCustomer().cards || [];
    const names = [];
    const seen = new Set();
    const pushCard = (card) => {
      if (!card || seen.has(card.id)) return;
      seen.add(card.id);
      names.push(card.name || '会员卡');
    };
    held.forEach(card => {
      if (preferCardIds.length && !preferCardIds.includes(card.id)) return;
      const pick = picks[card.id];
      if (!pick) return;
      let used = false;
      (pick.projects || []).forEach(pr => {
        if (!pr.qty) return;
        if (cartItemMatchesProjectBenefit(it, pr)) used = true;
      });
      if (pick.discountOn && typeof cartItemEligibleForCardDiscount === 'function'
        && cartItemEligibleForCardDiscount(it, card)) used = true;
      if (used) pushCard(card);
    });
    if (!names.length && preferCardIds.length) {
      preferCardIds.forEach(id => {
        pushCard(held.find(c => c.id === id) || (typeof findHeldCardById === 'function' ? findHeldCardById(id) : null));
      });
    }
    if (!names.length) {
      held.forEach(card => {
        const pick = picks[card.id];
        if (!pick) return;
        let used = false;
        (pick.projects || []).forEach(pr => {
          if (pr.qty && cartItemMatchesProjectBenefit(it, pr)) used = true;
        });
        if (pick.discountOn && typeof cartItemEligibleForCardDiscount === 'function'
          && cartItemEligibleForCardDiscount(it, card)) used = true;
        if (used) pushCard(card);
      });
    }
    return names.length ? names.join('、') : '未选';
  }

  function renderDetailCartLine(it) {
    if (!it.staffIds) it.staffIds = [];
    ensureCartStaffState(it);
    const unit = lineUnit(it);
    const lineAmt = round2(unit * it.qty);
    const open = state.detailExpandedId === it.id;
    const cardNames = lineBenefitCardNames(it);
    const benefitBlock = isMemberBill()
      ? `<div class="detail-staff-block">
          <button type="button" class="detail-staff-entry" data-open-benefit-line="${escapeHtml(it.id)}">
            <span class="detail-staff-entry__lbl">会员卡</span>
            <span class="detail-staff-entry__val${cardNames !== '未选' ? ' has-staff' : ''}">${escapeHtml(cardNames)}</span>
            <span class="chev ui-icon" aria-hidden="true">${iconSvg('chevron-right', 'ui-icon')}</span>
          </button>
        </div>`
      : '';
    return `<div class="detail-item ${open ? 'is-expanded' : 'is-collapsed'}" data-cart-id="${it.id}">
      <button type="button" class="detail-item__del" data-del-cart="${it.id}">删除</button>
      <div class="detail-item__track">
        <div class="detail-item__main">
          <div class="detail-item__top">
            ${cartItemBadgeHtml(it)}
            <div class="detail-item__name">${escapeHtml(it.name)}${it.qty > 1 ? ` ×${it.qty}` : ''}</div>
            <span class="detail-item__amt num">${formatYen(lineAmt)}</span>
            <button type="button" class="detail-item__expand" data-expand-item="${it.id}" aria-label="${open ? '收起' : '展开'}">${iconSvg(open ? 'chevron-up' : 'chevron-down')}</button>
          </div>
          ${open ? `<div class="detail-item__panel">
            ${benefitBlock}
            ${renderDetailStaffSection(it)}
            <div class="detail-item__panel-row detail-item__panel-row--subtotal">
              <span>小计</span>
              <button type="button" class="detail-item__subtotal-edit" data-edit-line-subtotal="${escapeHtml(it.id)}" aria-label="修改小计">
                <span class="num">${formatYen(lineAmt)}</span>
                <span class="ui-icon" aria-hidden="true">${iconSvg('edit', 'ui-icon')}</span>
              </button>
            </div>
          </div>` : ''}
        </div>
      </div>
    </div>`;
  }

  function renderSettleComposeCard(s) {
    const benefitTotal = round2((s.projectDeduct || 0) + (s.discountDeduct || 0) + (s.balanceDeduct || 0));
    const chev = iconSvg('chevron-right', 'ui-icon');
    const benefitRow = isMemberBill()
      ? `<button type="button" class="detail-compose__row" data-open-benefit>
          <span class="detail-compose__lbl">会员卡权益</span>
          <span class="detail-compose__val${benefitTotal > 0 ? ' is-deduct' : ' is-muted'}">${benefitTotal > 0 ? ('-' + formatYen(benefitTotal)) : '未使用'}${chev}</span>
        </button>`
      : '';
    const couponVal = (s.couponDeduct > 0)
      ? ('-' + formatYen(s.couponDeduct))
      : couponSummaryText();
    return `<div class="detail-compose">
      <div class="detail-compose__head">账单构成</div>
      <div class="detail-compose__row detail-compose__row--static">
        <span class="detail-compose__lbl">商品原价</span>
        <span class="detail-compose__val num">${formatYen(s.listTotal)}</span>
      </div>
      ${benefitRow}
      <button type="button" class="detail-compose__row" data-open-coupon>
        <span class="detail-compose__lbl">优惠券</span>
        <span class="detail-compose__val${s.couponDeduct > 0 ? ' is-deduct' : ' is-muted'}">${escapeHtml(couponVal)}${chev}</span>
      </button>
      <div class="detail-compose__perf" aria-hidden="true"></div>
      <div class="detail-compose__due">
        <span class="detail-compose__due-lbl">应付</span>
        <span class="detail-compose__due-amt num">${formatYen(s.dueCash)}</span>
      </div>
    </div>`;
  }

  function renderDetail() {
    const s = calcSettlement();
    state.lastSettlement = s;
    const c = getCustomer();

    const used = new Set();
    const groups = [];
    (state.billSlips || []).forEach((slip, i) => {
      const lines = getSlipLines(slip.id);
      lines.forEach(it => used.add(it.id));
      groups.push({ title: `记账单 ${i + 1}`, lines });
    });
    if (state.billDraft) {
      const lines = getDraftLines();
      lines.forEach(it => used.add(it.id));
      if (lines.length) {
        groups.push({ title: `记账单 ${(state.billSlips || []).length + 1}`, lines });
      }
    }
    const orphans = (state.cart || []).filter(it => !used.has(it.id));
    if (orphans.length) {
      groups.push({
        title: groups.length ? `记账单 ${groups.length + 1}` : '记账单 1',
        lines: orphans,
      });
    }

    const items = groups.length
      ? groups.map(g => {
          const sub = round2(g.lines.reduce((sum, it) => sum + lineUnit(it) * (Number(it.qty) || 1), 0));
          return `<div class="detail-slip">
          <div class="detail-slip__serration" aria-hidden="true"></div>
          <div class="detail-slip__head">
            <span class="detail-slip__title">${escapeHtml(g.title)}</span>
            <span class="detail-slip__meta">${g.lines.length} 项</span>
          </div>
          <div class="detail-slip__body">
            ${g.lines.map(renderDetailCartLine).join('') || '<div class="empty-cart">无商品</div>'}
          </div>
          <div class="detail-slip__foot">
            <span class="detail-slip__sub">小计</span>
            <span class="detail-slip__total">${formatYen(sub)}</span>
          </div>
        </div>`;
        }).join('')
      : '<div class="detail-slip"><div class="empty-cart">无商品</div></div>';

    const bizDateLabel = formatBillDateLabel(ensureBillBizDate());
    (document.getElementById('detailBody')||{innerHTML:""}).innerHTML = `
      <div class="detail-guest-slot">${renderCustomerNameCard(c, { withActions: true, genderMode: isAnonymousGuest(c) })}</div>
      <div class="detail-settle-stack">
        <button type="button" class="detail-biz-date" id="btnDetailBizDate" data-detail-biz-date aria-haspopup="dialog" aria-label="选择开单日期">
          <span class="detail-biz-date__lbl">开单日期</span>
          <span class="detail-biz-date__trail">
            <span class="detail-biz-date__val" id="detailDateLabel">${escapeHtml(bizDateLabel)}</span>
            <span class="detail-biz-date__chev" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></span>
          </span>
        </button>
        ${items}
        ${state.cart.length ? renderSettleComposeCard(s) : ''}
        <div class="detail-remark">
          <div class="detail-remark__label">备注</div>
          <div class="detail-remark__box">
            <textarea id="orderRemarkInput" maxlength="500" placeholder="请输入备注">${escapeHtml(state.orderRemark || '')}</textarea>
            <div class="detail-remark__count">${(state.orderRemark || '').length}/500</div>
          </div>
        </div>
      </div>`;
    syncDetailDueBar();
    bindDetailItemSwipes();
    afterStaffPickerPaint(document.getElementById('detailBody'));
  }

  function couponEligibleByOrderTotal(cp) {
    const listTotal = cartListTotal();
    const couponBase = cartDiscountableSubtotal();
    const min = Number(cp && cp.minAmount) || 0;
    const isEx = cp && cp.tag === '抵用券';
    const exAmt = isEx ? couponExchangeDeduct(cp) : 0;
    const ok = isEx ? exAmt > 0 : (couponBase > 0 && listTotal >= min);
    return {
      ok,
      listTotal,
      couponBase,
      min,
      shortfall: Math.max(0, round2(min - listTotal)),
      noProject: couponBase <= 0,
      exchangeAmt: exAmt,
    };
  }

  function renderCouponCardHtml(cp, opts) {
    const selected = !!opts.selected;
    const disabled = !!opts.disabled;
    const rulesOpen = !!opts.rulesOpen;
    const hint = opts.hint || '';
    const rulesHtml = (cp.rules || []).map(r => `<div>${escapeHtml(r)}</div>`).join('');
    const mutexHint = cp.stackWithBenefit === false ? '<span class="coupon-card__mutex">不可与会员卡同享</span>' : '';
    const tone = (cp.tag || '').indexOf('抵用券') >= 0 ? 'exchange' : 'cash';
    const isEx = cp.tag === '抵用券';
    const valueHtml = isEx
      ? `<div class="coupon-card__amount coupon-card__amount--exchange"><span class="coupon-card__num">抵</span></div><div class="coupon-card__gate">${escapeHtml(cp.gateLabel)}</div>`
      : `<div class="coupon-card__amount"><span class="coupon-card__yen">¥</span><span class="coupon-card__num">${cp.amount}</span></div><div class="coupon-card__gate">${escapeHtml(cp.gateLabel)}</div>`;
    return `<div class="coupon-card coupon-card--tone-${tone} ${selected ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''} ${rulesOpen ? 'is-rules-open' : ''}" data-coupon-id="${cp.id}" ${disabled ? 'data-coupon-disabled="1"' : ''} role="button" tabindex="0" aria-pressed="${selected}" aria-disabled="${disabled ? 'true' : 'false'}">
        <span class="coupon-card__tag">${escapeHtml(cp.tag)}</span>${mutexHint}
        <div class="coupon-card__main">
          <div class="coupon-card__info">
            <div class="coupon-card__title">${escapeHtml(cp.name)}</div>
            <div class="coupon-card__scope">${escapeHtml(cp.scope)}</div>
            ${hint ? `<div class="coupon-card__gate-hint">${escapeHtml(hint)}</div>` : ''}
          </div>
          <div class="coupon-card__value">
            ${valueHtml}
          </div>
        </div>
        <hr class="coupon-card__divider">
        <button type="button" class="coupon-card__rules-toggle" data-coupon-rules="${cp.id}">
          使用规则
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="coupon-card__rules">${rulesHtml}</div>
      </div>`;
  }

  function renderCouponPage() {
    const noneOn = !state.couponDraftId;
    const usable = [];
    const unusable = [];
    COUPONS.forEach(cp => {
      const gate = couponEligibleByOrderTotal(cp);
      if (gate.ok) usable.push({ cp, gate });
      else unusable.push({ cp, gate });
    });
    const usableHtml = usable.map(({ cp }) => renderCouponCardHtml(cp, {
      selected: state.couponDraftId === cp.id,
      rulesOpen: !!state.couponRulesOpen[cp.id],
      disabled: false,
    })).join('');
    const unusableHtml = unusable.map(({ cp, gate }) => renderCouponCardHtml(cp, {
      selected: false,
      rulesOpen: !!state.couponRulesOpen[cp.id],
      disabled: true,
      hint: gate.noProject
        ? '仅适用于服务项目，当前无可抵扣项目'
        : (cp.tag === '抵用券'
            ? '购物车未含可抵用的项目/产品'
            : `开单总价还差 ${formatYen(gate.shortfall)}（按整单合计）`),
    })).join('');
    const unusableLabel = unusable.some(({ gate, cp }) => gate.noProject || cp.tag === '抵用券')
      ? '当前不可用'
      : '未满足开单总价门槛';
    (document.getElementById('couponList')||{innerHTML:""}).innerHTML = `
      <button type="button" class="coupon-none ${noneOn ? 'is-selected' : ''}" data-coupon-none>${offerActionIconHtml('coupon-none')}不使用优惠券</button>
      ${usableHtml}
      ${unusable.length ? `<div class="coupon-section-label">${unusableLabel}</div>${unusableHtml}` : ''}`;
  }

  function openCouponScreen() {
    let draft = state.selectedCouponId;
    if (draft) {
      const cp = COUPONS.find(c => c.id === draft);
      if (cp && !couponEligibleByOrderTotal(cp).ok) draft = null;
    }
    state.couponDraftId = draft;
    state.couponRulesOpen = {};
    renderCouponPage();
    showOnlyScreen('screen-coupon');
  }

  /** 计次/共计权益可匹配的项目名（精确匹配，不按 includes 误伤） */
  function projectBenefitMatchKeys(p) {
    if (!p) return [];
    if (Array.isArray(p.matchKeys) && p.matchKeys.length) {
      return [...new Set(p.matchKeys.map(k => String(k || '').trim()).filter(Boolean))];
    }
    const out = new Set();
    [p.key, p.label].forEach(raw => {
      let s = String(raw || '').trim();
      if (!s) return;
      s = s.replace(/^共计\s*·\s*/, '');
      if (s.includes('、')) {
        s.split('、').forEach(part => {
          const t = part.trim();
          if (t) out.add(t);
        });
      } else {
        out.add(s);
      }
    });
    return [...out];
  }

  function cartItemMatchesProjectBenefit(it, p) {
    if (!it || !p) return false;
    const matchKeys = projectBenefitMatchKeys(p);
    if (!matchKeys.length) return false;
    const itemKeys = [it.benefitKey, it.name]
      .map(x => String(x || '').trim())
      .filter(Boolean);
    return itemKeys.some(ik => matchKeys.includes(ik));
  }

  function projectBenefitUsableOnCart(p) {
    if (!p || !(Number(p.remain) > 0)) return false;
    return (state.cart || []).some(it => (it.qty || 0) > 0 && cartItemMatchesProjectBenefit(it, p));
  }

  /** 可享会员折扣的服务项目（不含产品、直接收款；直接收款仅可用储值/面值） */
  function isDiscountableCartItem(it) {
    if (!it || !(it.qty > 0)) return false;
    if (typeof isQuickCartItem === 'function' && isQuickCartItem(it)) return false;
    if (typeof isBillProductItem === 'function' && isBillProductItem(it)) return false;
    return true;
  }

  /** 抵用券：购物车中绑定项目/产品的金额合计（免费抵用） */
  function couponExchangeDeduct(cp) {
    if (!cp || cp.tag !== '抵用券') return 0;
    const ids = new Set((cp.exchangeItems || []).map(i => String(i.id)));
    return round2((state.cart || []).reduce((s, it) => {
      if (!it || !(it.qty > 0)) return s;
      if (typeof isQuickCartItem === 'function' && isQuickCartItem(it)) return s;
      const key = String(it.id != null ? it.id : it.refId);
      if (!ids.has(key)) return s;
      return s + lineUnit(it) * it.qty;
    }, 0));
  }

  /** 折扣是否覆盖该购物车行（按卡模板 memberPrices / 分组项目快照） */
  function cartItemEligibleForCardDiscount(it, card) {
    if (!isDiscountableCartItem(it) || !card) return false;
    if (card.discountScopeAll) return true;
    if (Array.isArray(card.discountProjects)) {
      if (!card.discountProjects.length) return false;
      const itemKeys = [it.benefitKey, it.name]
        .map(x => String(x || '').trim())
        .filter(Boolean);
      return itemKeys.some(ik => card.discountProjects.includes(ik));
    }
    /* 旧数据未带范围字段时，不收窄（兼容） */
    return true;
  }

  function cartHasDiscountableItems() {
    return (state.cart || []).some(isDiscountableCartItem);
  }

  function cartHasDiscountableItemsForCard(card) {
    return (state.cart || []).some(it => cartItemEligibleForCardDiscount(it, card));
  }

  function cartDiscountableSubtotal() {
    return round2((state.cart || []).reduce((s, it) => {
      if (!isDiscountableCartItem(it)) return s;
      return s + lineUnit(it) * it.qty;
    }, 0));
  }

  /** 面值可用于本单：有非产品消费，或可支付的办卡/延期费用 */
  function cartFaceBenefitApplicable() {
    const hasService = (state.cart || []).some(it => (it.qty || 0) > 0 && !(typeof isBillProductItem === 'function' && isBillProductItem(it)));
    if (hasService) return true;
    const openAmt = state.pendingOpenCard ? round2(Number(state.pendingOpenCard.amount) || 0) : 0;
    if (openAmt <= 0) return false;
    if (typeof isIssuingCardWithFaceBenefit === 'function' && isIssuingCardWithFaceBenefit()) return false;
    return true;
  }

  function renderBenefitPicker() {
    if (!isMemberBill()) {
      (document.getElementById('benefitBody')||{innerHTML:""}).innerHTML = '<div class="empty-cart">当前顾客无会员卡</div>';
      return;
    }
    if (state.benefitSkip) {
      (document.getElementById('benefitBody')||{innerHTML:""}).innerHTML = `
        <button type="button" class="benefit-none-btn is-on" data-benefit-none>${offerActionIconHtml('benefit-none')}不使用权益</button>
        <button type="button" class="benefit-none-btn" id="btnOpenDiscount">${offerActionIconHtml('manual-discount')}人工打折</button>
        <p class="benefit-skip-hint">本单将不使用会员卡权益抵扣。可重新选择：</p>
        <div class="benefit-extra">
          <button type="button" class="benefit-none-btn" data-benefit-use style="width:100%;margin:0;display:inline-flex;align-items:center;justify-content:center;gap:4px">选择会员卡权益${iconSvg('chevron-right', 'ui-icon')}</button>
        </div>`;
      return;
    }
    const draft = state.benefitDraft;
    const allCards = getCustomer().cards.slice();
    let preferIds = [];
    if (state.benefitFocusLineId) {
      const line = state.cart.find(x => x.id === state.benefitFocusLineId);
      if (line && line.slipId) {
        const slip = (state.billSlips || []).find(s => s.id === line.slipId)
          || (state.billDraft && state.billDraft.id === line.slipId ? state.billDraft : null);
        if (slip && Array.isArray(slip.cardIds)) preferIds = slip.cardIds.slice();
      }
    }
    if (!preferIds.length && state.billPickCardId) preferIds = [state.billPickCardId];
    if (preferIds.length) {
      allCards.sort((a, b) => {
        const ai = preferIds.indexOf(a.id);
        const bi = preferIds.indexOf(b.id);
        return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
      });
    }
    const discountable = cartHasDiscountableItems();
    const faceOk = cartFaceBenefitApplicable();
    const cards = allCards.map(card => {
      if (!draft[card.id]) {
        draft[card.id] = emptyBenefitPickForCard(card);
      }
      const d = draft[card.id];
      (d.projects || []).forEach((pr, idx) => {
        const src = (card.projects || [])[idx];
        if (src && (!pr.matchKeys || !pr.matchKeys.length)) pr.matchKeys = projectBenefitMatchKeys(src);
      });
      const showDiscount = !!(card.discount && cardBenefits(card).projectDiscount && discountable && cartHasDiscountableItemsForCard(card));
      const showFace = !!(cardHasFaceBenefit(card) && Number(card.balance) > 0 && faceOk);
      if (!showDiscount && d.discountOn) d.discountOn = false;
      if (!showFace) {
        d.balanceUse = 0;
        d.fixedUse = 0;
      }
      let inner = '';
      if (showDiscount) {
        inner += `<div class="benefit-row"><span>${(card.discount * 10).toFixed(1)}折（${escapeHtml(card.name)}）</span><button type="button" class="toggle ${d.discountOn ? 'on' : ''}" data-disc="${card.id}"></button></div>`;
      }
      if (showFace) {
        inner += `<div class="benefit-row"><span>面值抵扣（余 ${formatYen(card.balance)}）</span><input class="amount-input num input-amount" type="number" min="0" max="${card.balance}" step="0.01" data-bal="${card.id}" value="${d.balanceUse || ''}" placeholder="0"></div>`;
        inner += `<div class="benefit-row"><span>固定金额 98 元（${escapeHtml(card.name)}）</span><button type="button" class="toggle ${d.fixedUse ? 'on' : ''}" data-fixed="${card.id}"></button></div>`;
      }
      (card.projects || []).forEach((p, idx) => {
        const pr = d.projects[idx];
        if (!pr) return;
        pr.max = p.remain;
        if (!projectBenefitUsableOnCart(p)) {
          pr.qty = 0;
          return;
        }
        if (pr.qty > p.remain) pr.qty = p.remain;
        inner += `<div class="benefit-row"><span>${escapeHtml(p.label)}（余 ${p.remain}）</span><div class="stepper">
          <button type="button" data-proj="${card.id}" data-idx="${idx}" data-d="-1" aria-label="减少" ${pr.qty ? '' : 'disabled'}>${iconSvg('minus')}</button>
          <span class="num">${pr.qty}</span>
          <button type="button" data-proj="${card.id}" data-idx="${idx}" data-d="1" aria-label="增加" ${pr.qty >= p.remain ? 'disabled' : ''}>${iconSvg('plus')}</button>
        </div></div>`;
      });
      if (!inner) return '';
      const preferred = preferIds.includes(card.id)
        ? '<span class="benefit-picked-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>记账单已选</span>'
        : '';
      return `<div class="benefit-card${preferIds.includes(card.id) ? ' is-preferred' : ''}"><div class="benefit-card__title" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">${escapeHtml(card.name)}${preferred}${benefitChipsHtml(card)}</div>${inner}</div>`;
    }).filter(Boolean).join('');
    (document.getElementById('benefitBody')||{innerHTML:""}).innerHTML = `
      <button type="button" class="benefit-none-btn" data-benefit-none>${offerActionIconHtml('benefit-none')}不使用权益</button>
      <button type="button" class="benefit-none-btn" id="btnOpenDiscount">${offerActionIconHtml('manual-discount')}人工打折</button>
      ${cards || '<div class="empty-cart" style="padding:24px 16px">本单暂无可用会员卡权益</div>'}`;
    if (typeof wireAmountKeypadInputs === 'function') wireAmountKeypadInputs(document.getElementById('benefitBody'));
  }

  function renderDiscountPage() {
    (document.getElementById('discountBody')||{innerHTML:""}).innerHTML = `
      <div class="discount-tip">${iconSvg('info', 'ui-icon')}<span>设置面值可用的折扣权益，默认不打折</span></div>
      ${state.discountCats.map(cat => `
        <div class="discount-row" data-disc-cat="${cat.id}">
          <button type="button" class="discount-row__check ${cat.on ? 'is-on' : ''}" data-disc-check="${cat.id}" aria-pressed="${cat.on ? 'true' : 'false'}">${iconCheckSvg()}</button>
          <div class="discount-row__name">${escapeHtml(cat.name)}</div>
          <div class="discount-row__field ${cat.on ? 'is-on' : ''}">
            <input type="number" class="input-amount" min="0" max="10" step="0.1" data-disc-rate="${cat.id}" value="${cat.rate}">
            <span>折</span>
          </div>
        </div>`).join('')}`;
    if (typeof wireAmountKeypadInputs === 'function') wireAmountKeypadInputs(document.getElementById('discountBody'));
  }

  function renderScanMe() {
    const s = state.lastSettlement || calcSettlement();
    const voiceOn = !!state.voiceCollect;
    (document.getElementById('scanMeBody')||{innerHTML:""}).innerHTML = `
      <div class="scan-me-panel">
        <div class="scan-me-card">
          <div class="scan-me-card__wave" aria-hidden="true">
            <img src="assets/billing/scan-me/head-wave.svg" alt="">
          </div>
          <div class="scan-me-card__brand">
            <h2 class="scan-me-card__title">企业收款</h2>
            <p class="scan-me-card__org">剑琅联盟</p>
          </div>
          <div class="scan-me-card__store">右尚造型（旗舰版体验店）</div>
          <div class="scan-me-card__qr">
            <img src="assets/billing/scan-me/qr.png" width="160" height="160" alt="收款码">
          </div>
          <div class="scan-me-card__amt-label">本次共需支付金额：</div>
          <div class="scan-me-card__amt num">${formatYen(s.dueCash)}</div>
        </div>
        <div class="scan-me-voice">
          <img class="scan-me-voice__icon" src="assets/billing/scan-me/voice.svg" width="20" height="20" alt="">
          <span class="scan-me-voice__label">语音收款提醒</span>
          <button type="button" class="toggle scan-me-toggle ${voiceOn ? 'on' : ''}" id="btnVoiceCollect" aria-pressed="${voiceOn ? 'true' : 'false'}" aria-label="语音收款提醒"></button>
        </div>
      </div>`;
  }

  function formatPayAmt(n) {
    const v = round2(Number(n) || 0);
    return v.toFixed(2);
  }

  /** 正在办理「含面值」的新卡（延期除外）：面值不可用于支付此类办卡款 */
  function isIssuingCardWithFaceBenefit() {
    if (state.pendingOpenCard?.kind === 'extend') return false;
    if (state.pendingOpenCard && state.pendingOpenCard.includesFace != null) {
      return !!state.pendingOpenCard.includesFace;
    }
    const tid = state.cardIssuePending?.templateId || state.pendingOpenCard?.templateId;
    if (!tid) return false;
    const tpl = CARD_TEMPLATES.find(t => t.id === tid) || CARD_TPL_BY_ID[tid];
    return !!(tpl?.benefits?.balance);
  }

  function canPayWithMembercardFace() {
    if (state.billAssetPay) return false;
    if (!isMemberBill()) return false;
    if (isIssuingCardWithFaceBenefit()) return false;
    return getMembercardBalanceTotal() > 0;
  }

  function clearMembercardPayIfBlocked() {
    if (canPayWithMembercardFace()) return;
    if (state.payAmounts && Number(state.payAmounts.membercard) > 0) {
      state.payAmounts.membercard = 0;
    }
    if (state.payChannel === 'membercard') state.payChannel = 'alipay';
    state.payMembercardCardId = null;
  }

  function payChannelDefs() {
    const channels = [
      { id: 'alipay', label: '支付宝', icon: 'assets/billing/pay/alipay.png', fallback: '支', color: '#1677FF' },
      { id: 'wechat', label: '微信', icon: 'assets/billing/pay/wechat.svg', fallback: '微', color: '#07C160' },
      { id: 'meituan', label: '美团', icon: 'assets/billing/pay/meituan.png', fallback: '美', color: '#FFC300' },
      { id: 'dianping', label: '大众点评', icon: 'assets/billing/pay/dianping.png', fallback: '评', color: '#FF6633' },
      { id: 'douyin', label: '抖音', icon: 'assets/billing/pay/douyin.png', fallback: '抖', color: '#111' },
      { id: 'koubei', label: '口碑', icon: 'assets/billing/pay/koubei.png', fallback: '口', color: '#FF6A00' },
      { id: 'cash', label: '现金', icon: 'assets/billing/pay/cash.svg', fallback: '现', color: '#F5A623' },
      { id: 'bank', label: '银行卡', icon: 'assets/billing/pay/bank.svg', fallback: '卡', color: '#4A7BF4' },
    ];
    if (canPayWithMembercardFace()) {
      channels.push({ id: 'membercard', label: '会员卡', icon: 'assets/billing/pay/membercard.svg', fallback: '会', color: '#F32F41' });
    }
    return channels;
  }

  function payFilledTotal() {
    return round2(Object.values(state.payAmounts || {}).reduce((s, v) => s + (Number(v) || 0), 0));
  }

  /** 当前渠道可填入金额：full=应付现金；remain=扣除其他渠道后剩余（会员卡封顶可用面值） */
  function payChannelFillAmount(id, mode) {
    const due = getActivePayDue();
    if (id === 'membercard') {
      const avail = getMembercardBalanceAvailable();
      if (mode === 'full') return round2(Math.min(due, avail));
      const cashFilled = payCashFilledTotal();
      return round2(Math.min(avail, Math.max(0, due - cashFilled)));
    }
    const self = round2(Number(state.payAmounts?.[id]) || 0);
    if (mode === 'full') return due;
    const othersCash = round2(payCashFilledTotal() - self);
    return round2(Math.max(0, due - othersCash));
  }

  /** 兼容旧调用：剩余应付（现金口径） */
  function payChannelRemain(id) {
    return payChannelFillAmount(id, 'remain');
  }

  function hasStickyManualPays() {
    const edits = state.payManualEdit || {};
    return Object.keys(edits).some(k => edits[k] && round2(Number(state.payAmounts?.[k]) || 0) > 0);
  }

  function syncPayInputDom() {
    document.querySelectorAll('#payChannels [data-pay-amt]').forEach(inp => {
      const id = inp.dataset.payAmt;
      inp.value = formatPayAmt(state.payAmounts[id] || 0);
      const editable = state.payEditingId === id;
      inp.readOnly = !editable;
    });
    document.querySelectorAll('#payChannels .pay-channel[data-pay]').forEach(row => {
      const id = row.dataset.pay;
      const on = Number(state.payAmounts[id]) > 0 || state.payChannel === id;
      row.classList.toggle('is-active', on);
    });
    updatePaySheetTotals();
  }

  function commitPayInputEl(inp) {
    if (!inp) return;
    const id = inp.dataset.payAmt;
    if (!id) return;
    state.payAmounts[id] = Math.max(0, Number(inp.value) || 0);
    if (Number(state.payAmounts[id]) > 0) state.payChannel = id;
  }

  function applyPayFocusFill(id) {
    if (state.payEditingId === id && state.payActiveAmtId === id) {
      return;
    }
    const prev = state.payActiveAmtId;
    if (prev && prev !== id) {
      const prevInp = document.querySelector(`#payChannels [data-pay-amt="${prev}"]`);
      if (prevInp) commitPayInputEl(prevInp);
    }
    /* 清掉所有非双击改过的渠道（含 init 预填的支付宝），避免点其他框时旧金额残留 */
    Object.keys(state.payAmounts || {}).forEach(cid => {
      if (cid === id) return;
      if (state.payManualEdit && state.payManualEdit[cid]) return;
      state.payAmounts[cid] = 0;
    });
    state.payEditingId = null;
    const sticky = hasStickyManualPays();
    const keepManual = !!(state.payManualEdit && state.payManualEdit[id] && Number(state.payAmounts[id]) > 0);
    if (!keepManual) {
      state.payAmounts[id] = payChannelFillAmount(id, sticky ? 'remain' : 'full');
    }
    state.payChannel = id;
    state.payActiveAmtId = id;
    syncPayInputDom();
  }

  function payCashFilledTotal() {
    return round2(Object.entries(state.payAmounts || {}).reduce((s, [id, v]) => {
      if (id === 'membercard') return s;
      return s + (Number(v) || 0);
    }, 0));
  }

  function getMemberFaceCards() {
    if (!isMemberBill()) return [];
    return (getCustomer().cards || []).filter(card =>
      cardHasFaceBenefit(card) && round2(Math.max(0, Number(card.balance) || 0)) > 0
    );
  }

  function getMembercardBalanceTotal() {
    return round2(getMemberFaceCards().reduce((sum, card) => sum + Math.max(0, Number(card.balance) || 0), 0));
  }

  function ensurePayMembercardCardId() {
    const cards = getMemberFaceCards();
    if (!cards.length) {
      state.payMembercardCardId = null;
      return null;
    }
    if (state.payMembercardCardId && cards.some(c => c.id === state.payMembercardCardId)) {
      return state.payMembercardCardId;
    }
    state.payMembercardCardId = cards[0].id;
    return state.payMembercardCardId;
  }

  function getMembercardBalanceAvailable(cardId) {
    if (!isMemberBill()) return 0;
    const cards = getMemberFaceCards();
    if (!cards.length) return 0;
    const id = arguments.length ? cardId : ensurePayMembercardCardId();
    if (!id) return getMembercardBalanceTotal();
    const card = cards.find(c => c.id === id);
    return card ? round2(Math.max(0, Number(card.balance) || 0)) : 0;
  }

  function allocateMembercardBalance(requested, capTotal) {
    const lines = [];
    const cardId = ensurePayMembercardCardId();
    const cards = getMemberFaceCards();
    const card = cards.find(c => c.id === cardId) || cards[0];
    if (!card) return { total: 0, lines };
    const left = Math.min(
      round2(Number(requested) || 0),
      round2(Number(capTotal) || 0),
      round2(Math.max(0, Number(card.balance) || 0))
    );
    if (left <= 0) return { total: 0, lines };
    lines.push({ cardId: card.id, card: card.name, amount: left, source: 'membercard' });
    return { total: left, lines };
  }

  function updatePaySheetTotals() {
    const dueCash = getActivePayDue();
    const s = calcSettlement();
    const filled = payFilledTotal();
    const cashFilled = payCashFilledTotal();
    const amtEl = document.getElementById('payAmount');
    if (amtEl) amtEl.innerHTML = `<span class="yen">¥</span><span class="val">${formatPayAmt(dueCash)}</span>`;
    const tip = document.querySelector('#payChannels > div:last-child');
    if (tip) {
      if (!state.billAssetPay && s.balanceDeduct > 0 && round2(Number(state.payAmounts?.membercard) || 0) > 0) {
        tip.textContent = `已填 ${formatYen(cashFilled)} + 面值 ${formatYen(s.balanceDeduct)} / 合计 ${formatYen(dueCash + s.balanceDeduct)}`;
      } else {
        tip.textContent = `已填 ${formatYen(filled)} / 应付 ${formatYen(dueCash)}`;
      }
    }
    return s;
  }

  function initPayAmounts(due) {
    const channels = payChannelDefs();
    const next = {};
    channels.forEach(ch => { next[ch.id] = 0; });
    const prefer = channels.find(c => c.id === state.payChannel) ? state.payChannel : 'alipay';
    state.payChannel = prefer;
    next[prefer] = round2(due);
    state.payAmounts = next;
    state.payManualEdit = {};
    state.payActiveAmtId = null;
    state.payEditingId = null;
    ensurePayMembercardCardId();
  }

  function renderPayMembercardPickerHtml() {
    const cards = getMemberFaceCards();
    if (cards.length <= 1) return '';
    ensurePayMembercardCardId();
    return `<div class="pay-membercard-picker" data-pay-mc-picker>
      <div class="pay-membercard-picker__hint">选择用于抵扣的会员卡</div>
      ${cards.map(card => {
        const on = card.id === state.payMembercardCardId;
        return `<label class="pay-membercard-option${on ? ' is-on' : ''}">
          <input type="radio" name="payMembercardCard" value="${escapeHtml(card.id)}"${on ? ' checked' : ''}>
          <span class="pay-membercard-option__main">
            <span class="pay-membercard-option__name">${escapeHtml(card.name)}</span>
            <span class="pay-membercard-option__bal">可用 ${formatYen(card.balance)}</span>
          </span>
        </label>`;
      }).join('')}
    </div>`;
  }

  function renderPayChannels() {
    clearMembercardPayIfBlocked();
    const dueCash = getActivePayDue();
    const s = calcSettlement();
    const channels = payChannelDefs();
    if (!channels.find(c => c.id === state.payChannel)) state.payChannel = channels[0]?.id || 'alipay';
    if (!state.payAmounts || !Object.keys(state.payAmounts).length) initPayAmounts(dueCash);
    channels.forEach(ch => {
      if (state.payAmounts[ch.id] == null) state.payAmounts[ch.id] = 0;
    });
    ensurePayMembercardCardId();
    const filled = payFilledTotal();
    const cashFilled = payCashFilledTotal();
    const mcPay = round2(Number(state.payAmounts?.membercard) || 0);
    const mcAvail = getMembercardBalanceAvailable();
    const faceCards = getMemberFaceCards();
    const selectedCard = faceCards.find(c => c.id === state.payMembercardCardId);
    const amtEl = document.getElementById('payAmount');
    amtEl.innerHTML = `<span class="yen">¥</span><span class="val">${formatPayAmt(dueCash)}</span>`;
    renderPayMeta();
    const channelHtml = channels.map(ch => {
      const amt = formatPayAmt(state.payAmounts[ch.id] || 0);
      const active = Number(state.payAmounts[ch.id]) > 0 || state.payChannel === ch.id;
      const iconHtml = ch.icon
        ? `<img src="${ch.icon}" alt="">`
        : `<span class="pay-channel__icon-fallback" style="background:${ch.color}" aria-hidden="true"></span>`;
      let nameLabel = escapeHtml(ch.label);
      if (ch.id === 'membercard') {
        nameLabel = selectedCard && faceCards.length > 1
          ? `会员卡 · ${escapeHtml(selectedCard.name)}（可用 ${formatYen(mcAvail)}）`
          : `会员卡（可用 ${formatYen(mcAvail)}）`;
      }
      const row = `<div class="pay-channel ${active ? 'is-active' : ''}" data-pay="${ch.id}">
        <span class="pay-channel__icon" style="background:${ch.icon ? 'transparent' : ch.color}">${iconHtml}</span>
        <span class="pay-channel__name">${nameLabel}</span>
        <span class="pay-channel__field">
          <input class="pay-channel__input num" type="number" min="0" step="0.01" data-pay-amt="${ch.id}" value="${amt}" readonly>
          <span class="pay-channel__clear" data-pay-clear="${ch.id}" role="button" aria-label="清除"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M14 6L6 14M14 14L6 6" stroke="#929292" stroke-width="1.3" stroke-linecap="round"/></svg></span>
        </span>
      </div>`;
      if (ch.id === 'membercard' && (mcPay > 0 || state.payChannel === 'membercard')) {
        return row + renderPayMembercardPickerHtml();
      }
      return row;
    }).join('');
    const tipHtml = (!state.billAssetPay && s.balanceDeduct > 0 && mcPay > 0)
      ? `已填 ${formatYen(cashFilled)} + 面值 ${formatYen(s.balanceDeduct)} / 合计 ${formatYen(dueCash + s.balanceDeduct)}`
      : `已填 ${formatYen(filled)} / 应付 ${formatYen(dueCash)}`;
    (document.getElementById('payChannels')||{innerHTML:""}).innerHTML = channelHtml
      + `<div style="padding:10px 16px 16px;font-size:12px;color:var(--text-sec)">${tipHtml}</div>`;
  }

  function consumeActiveHold() {
    const id = state.activeHoldId;
    if (!id) {
      state.billFromHold = false;
      return;
    }
    state.heldOrders = state.heldOrders.filter(h => h.id !== id);
    state.activeHoldId = null;
    state.billFromHold = false;
    syncPickHoldsEntry();
  }

  function createHoldOrder() {
    if (!state.cart.length) { showToast('请先选择商品'); return; }
    const c = getCustomer();
    const snap = {
      id: 'hold_' + Date.now(),
      createdAt: new Date().toISOString(),
      customerId: c.id,
      customerName: c.name,
      customer: isAnonymousGuest(c) ? { ...currentGuest() } : (c ? { ...c } : null),
      cart: JSON.parse(JSON.stringify(state.cart)),
      benefitApplied: JSON.parse(JSON.stringify(state.benefitApplied)),
      selectedCouponId: state.selectedCouponId,
      manualOrderNo: state.manualOrderNo || '',
      billBizDate: ensureBillBizDate(),
      technician: state.technician,
      cashierId: state.cashierId,
      billPickCardId: state.billPickCardId,
      listTotal: cartListTotal(),
      priceEdited: state.billDueOverride != null,
      dueOverride: state.billDueOverride != null ? round2(Number(state.billDueOverride) || 0) : null,
    };
    /* 取单后再次挂单：替换原挂单，避免列表残留旧快照 */
    if (state.activeHoldId) {
      state.heldOrders = state.heldOrders.filter(h => h.id !== state.activeHoldId);
      state.activeHoldId = null;
    }
    state.heldOrders.unshift(snap);
    state.billFromHold = false;
    state.cart = [];
    clearBillDueOverride();
    state.benefitDraft = {};
    state.benefitApplied = {};
    state.selectedCouponId = null;
    state.settleOffersTouched = false;
    state.couponDraftId = null;
    state.manualOrderNo = '';
    resetBillBizDate();
    state.payAmounts = {};
    syncCartChrome();
    syncPickHoldsEntry();
    showToast(`已挂单 · 共 ${state.heldOrders.length} 单`);
    enterBillUnselected();
  }

  function syncDetailDueBar() {
    const btn = document.getElementById('btnDetailDueEdit');
    if (!btn) return;
    const due = formatYen(calcSettlement().dueCash);
    btn.innerHTML = `<span id="detailDue">${due}</span>${iconSvg('edit')}${state.billDueEdited ? '<span class="bottom-bar__amt-hint">已改</span>' : ''}`;
  }

  function applyBillDueTotal(newTotal) {
    if (Number.isFinite(Number(newTotal)) && Number(newTotal) > INPUT_LIMITS.MONEY_MAX) {
      showToast('金额不能超过 ' + formatMoneyLimitLabel(), true);
      return false;
    }
    setBillDueOverride(newTotal);
    state.payAmounts = {};
    state.payManualEdit = {};
    return true;
  }

  function submitBillQuickConsume(rawAmt) {
    const raw = rawAmt != null ? rawAmt : state.billQuickAmtDraft;
    const n = typeof parseAmount === 'function' ? parseAmount(raw) : parseFloat(String(raw || '').replace(/^¥/, ''));
    if (!Number.isFinite(n) || n <= 0) {
      showToast('请输入有效金额', true);
      return false;
    }
    if (n > INPUT_LIMITS.MONEY_MAX) {
      showToast('金额不能超过 ' + formatMoneyLimitLabel(), true);
      return false;
    }
    const amt = round2(n);
    /* 放弃未封账的草稿记账单，直接收款直达结算 */
    if (state.billDraft) {
      const draftId = state.billDraft.id;
      state.cart = (state.cart || []).filter(it => it.slipId !== draftId);
      state.billDraft = null;
    }
    state.cart.push({
      id: 'quick-' + Date.now(),
      name: '直接收款',
      price: amt,
      category: '直接收款',
      type: 'quick',
      kind: 'quick',
      isQuick: true,
      qty: 1,
      unitPrice: amt,
      staffIds: [],
      staffRoles: {},
      staffDesignated: {},
      expanded: false,
    });
    state.billQuickAmtDraft = '';
    clearBillDueOverride();
    syncBillComposerMode();
    syncCartChrome();
    openBillSettle();
    return true;
  }

  function openQuickConsume() {
    setBillActionTab('quick');
    requestAnimationFrame(() => {
      const el = document.getElementById('billQuickAmt');
      if (el && typeof window.openAmountKeypad === 'function') window.openAmountKeypad(el);
      else if (!el) showToast('金额键盘未就绪');
    });
  }

  function openBillDueEditor() {
    if (window.RTBPerm && typeof window.RTBPerm.require === 'function' && !window.RTBPerm.require('billChangePrice')) return;
    if (!state.cart.length) {
      showToast('请先选择商品');
      return;
    }
    let el = document.getElementById('billDueKeypadProxy');
    if (!el) {
      el = document.createElement('input');
      el.type = 'text';
      el.id = 'billDueKeypadProxy';
      el.className = 'input-amount';
      el.setAttribute('readonly', 'readonly');
      el.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;width:1px;height:1px;';
      document.body.appendChild(el);
      el.addEventListener('change', () => {
        const n = parseFloat(el.value);
        if (!Number.isFinite(n) || n < 0) {
          showToast('请输入有效金额');
          return;
        }
        if (!applyBillDueTotal(n)) return;
        renderDetail();
        syncCartChrome();
        showToast('已更新应付金额');
      });
    }
    el.value = String(calcSettlement().dueCash ?? 0);
    if (typeof window.openAmountKeypad === 'function') window.openAmountKeypad(el);
    else showToast('金额键盘未就绪');
  }

  function applyLineSubtotal(cartId, newTotal) {
    const row = state.cart.find(x => x.id === cartId);
    if (!row) return;
    const qty = Math.max(1, Number(row.qty) || 1);
    const next = round2(Math.max(0, Number(newTotal) || 0));
    row.unitPrice = round2(next / qty);
    row.price = row.unitPrice;
    clearBillDueOverride();
  }

  function openLineSubtotalEditor(cartId) {
    if (window.RTBPerm && typeof window.RTBPerm.require === 'function' && !window.RTBPerm.require('billChangePrice')) return;
    const row = state.cart.find(x => x.id === cartId);
    if (!row) return;
    let el = document.getElementById('billLineSubtotalKeypadProxy');
    if (!el) {
      el = document.createElement('input');
      el.type = 'text';
      el.id = 'billLineSubtotalKeypadProxy';
      el.className = 'input-amount';
      el.setAttribute('readonly', 'readonly');
      el.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;width:1px;height:1px;';
      document.body.appendChild(el);
      el.addEventListener('change', () => {
        const id = el.dataset.cartId;
        const n = parseFloat(el.value);
        if (!id || !Number.isFinite(n) || n < 0) {
          showToast('请输入有效金额');
          return;
        }
        applyLineSubtotal(id, n);
        renderDetail();
        syncCartChrome();
        showToast('已更新小计');
      });
    }
    const qty = Math.max(1, Number(row.qty) || 1);
    el.dataset.cartId = cartId;
    el.value = String(round2(lineUnit(row) * qty));
    if (typeof window.openAmountKeypad === 'function') window.openAmountKeypad(el);
    else showToast('金额键盘未就绪');
  }

  function applyHoldListTotal(hold, newTotal) {
    const next = round2(Math.max(0, Number(newTotal) || 0));
    if (next > INPUT_LIMITS.MONEY_MAX) {
      showToast('金额不能超过 ' + formatMoneyLimitLabel(), true);
      return false;
    }
    /* 挂单改应付：锁定金额，不按比例改写行价 */
    hold.dueOverride = next;
    hold.priceEdited = true;
    return true;
  }

  function openHoldPriceEditor(holdId) {
    const hold = state.heldOrders.find(h => h.id === holdId);
    if (!hold) return;
    let el = document.getElementById('holdPriceKeypadProxy');
    if (!el) {
      el = document.createElement('input');
      el.type = 'text';
      el.id = 'holdPriceKeypadProxy';
      el.className = 'input-amount';
      el.setAttribute('readonly', 'readonly');
      el.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;width:1px;height:1px;';
      document.body.appendChild(el);
      el.addEventListener('change', () => {
        const id = el.dataset.holdId;
        const h = state.heldOrders.find(x => x.id === id);
        if (!h) return;
        const n = parseFloat(el.value);
        if (!Number.isFinite(n) || n < 0) {
          showToast('请输入有效金额');
          return;
        }
        if (!applyHoldListTotal(h, n)) return;
        renderHoldList();
        showToast('已更新挂单金额');
      });
    }
    el.dataset.holdId = holdId;
    el.value = String(hold.dueOverride != null ? hold.dueOverride : (hold.listTotal ?? 0));
    if (typeof window.openAmountKeypad === 'function') window.openAmountKeypad(el);
    else showToast('金额键盘未就绪');
  }

  const HOLD_KEEP_DAYS = 3;

  function holdCreatedDayStart(createdAt) {
    const d = new Date(createdAt);
    if (Number.isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function isHoldExpired(h, now) {
    if (!h) return false;
    if (state.activeHoldId && h.id === state.activeHoldId) return false;
    const start = holdCreatedDayStart(h.createdAt);
    if (!start) return false;
    const expire = new Date(start);
    expire.setDate(expire.getDate() + HOLD_KEEP_DAYS);
    const t = now instanceof Date ? now : new Date();
    return t >= expire;
  }

  function purgeExpiredHolds(opts) {
    const quiet = !!(opts && opts.quiet);
    const before = (state.heldOrders || []).length;
    const now = new Date();
    const next = (state.heldOrders || []).filter(h => !isHoldExpired(h, now));
    if (next.length === before) return 0;
    state.heldOrders = next;
    const removed = before - next.length;
    if (!quiet && removed > 0) showToast(`已自动清除 ${removed} 笔过期挂单`);
    return removed;
  }

  function renderHoldList() {
    purgeExpiredHolds({ quiet: true });
    const el = document.getElementById('holdList');
    if (!el) return;
    if (!state.heldOrders.length) {
      el.innerHTML = '<div class="empty-cart">暂无挂单<br>开单台点击「挂单」保存</div>';
      return;
    }
    el.innerHTML = `<div class="hold-list">${state.heldOrders.map(h => {
      const time = (h.createdAt || '').replace('T', ' ').slice(0, 16);
      const items = (h.cart || []).map(i => `${i.name}×${i.qty}`).join('、');
      const holdDue = h.dueOverride != null ? h.dueOverride : h.listTotal;
      return `<div class="hold-card" data-resume-hold="${h.id}">
        <div class="hold-card__main">
          <div class="hold-card__top">
            <span class="hold-card__name">${escapeHtml(h.customerName || '散客')}</span>
            <button type="button" class="hold-card__amt-btn num" data-edit-hold-price="${h.id}" aria-label="修改挂单金额"><span>${formatYen(holdDue)}</span>${iconSvg('edit')}${h.priceEdited ? '<span class="hold-card__amt-hint">已改</span>' : ''}</button>
          </div>
          <div class="hold-card__meta">${escapeHtml(time)}${h.manualOrderNo ? ' · 单号 ' + escapeHtml(h.manualOrderNo) : ''}</div>
          <div class="hold-card__meta">${escapeHtml(items || '无商品')}</div>
          <div class="hold-card__foot">
            <button type="button" class="hold-card__del" data-del-hold="${h.id}">${iconSvg('trash')}<span>删除挂单</span></button>
          </div>
        </div>
        <span class="hold-card__chev" aria-hidden="true">${iconSvg('chevron-right')}</span>
      </div>`;
    }).join('')}</div>`;
  }

  function openHoldList() {
    const removed = purgeExpiredHolds({ quiet: true });
    renderHoldList();
    showOnlyScreen('screen-holds');
    setFlowNavHighlight('hold');
    if (removed > 0) showToast(`已自动清除 ${removed} 笔过期挂单`);
  }

  function resumeHold(id) {
    const idx = state.heldOrders.findIndex(h => h.id === id);
    if (idx < 0) return;
    const h = state.heldOrders[idx];
    /* 取单不移出列表：未结账/未删除时返回挂单列表仍可见 */
    const customer = (h.customerId === 'guest' || h.customerId === 'guest_m' || h.customerId === 'guest_f')
      ? currentGuest()
      : (CUSTOMERS.find(c => c.id === h.customerId) || currentGuest());
    state.customer = customer;
    state.cart = JSON.parse(JSON.stringify(h.cart || []));
    state.benefitApplied = JSON.parse(JSON.stringify(h.benefitApplied || {}));
    state.benefitDraft = {};
    state.selectedCouponId = h.selectedCouponId || null;
    state.settleOffersTouched = true;
    state.manualOrderNo = h.manualOrderNo || '';
    state.billBizDate = clampBillBizDate(h.billBizDate || billTodayKey());
    syncBillDateLabels();
    state.technician = h.technician || '未指定';
    if (h.cashierId) state.cashierId = h.cashierId;
    ensureCashierId();
    state.billPickCardId = h.billPickCardId || null;
    state.billCardGateDone = true;
    state.billCardGateOpen = false;
    state.cardsExpanded = false;
    state.payAmounts = {};
    state.activeHoldId = h.id;
    state.billFromHold = true;
    if (h.dueOverride != null) {
      setBillDueOverride(h.dueOverride);
    } else {
      clearBillDueOverride();
      /* 旧挂单：曾按比例改行价，仅保留已改标记以跳过价目守卫 */
      if (h.priceEdited) state.billDueEdited = true;
    }
    resetBillSlipState();
    if (state.cart.length) {
      const slipId = 'slip_hold_' + Date.now();
      const cardIds = [];
      if (state.billPickCardId) cardIds.push(state.billPickCardId);
      state.cart.forEach(it => { it.slipId = slipId; });
      state.billSlips = [{ id: slipId, cardIds }];
      state.billComposerMode = 'review';
    }
    syncCartChrome();
    syncPickHoldsEntry();
    openBillCatalog({ skipGate: true });
    showToast('已取单');
  }

  function applyBenefitDraft() {
    if (state.benefitSkip) {
      state.benefitApplied = {};
      clearBillDueOverride();
      return;
    }
    state.benefitApplied = JSON.parse(JSON.stringify(state.benefitDraft));
    const cardsById = Object.fromEntries((getCustomer().cards || []).map(c => [c.id, c]));
    Object.entries(state.benefitApplied).forEach(([cardId, d]) => {
      if (!d) return;
      const card = cardsById[cardId];
      if (!cartHasDiscountableItems() || !cartHasDiscountableItemsForCard(card)) d.discountOn = false;
      if (d.fixedUse && !(Number(d.balanceUse) > 0)) d.balanceUse = 98;
    });
    clearBillDueOverride();
  }

  function mutateCardsAfterPay(settlement) {
    const c = CUSTOMERS.find(x => x.id === getCustomer().id);
    if (!c || !c.cards) return;
    const picks = state.benefitApplied || {};
    c.cards.forEach(card => {
      const pick = picks[card.id];
      if (!pick) return;
      (pick.projects || []).forEach(pr => {
        const slot = (card.projects || []).find(p => p.key === pr.key);
        if (slot && pr.qty) slot.remain = Math.max(0, slot.remain - pr.qty);
      });
    });
    (settlement.balanceLines || []).forEach(line => {
      const card = c.cards.find(x => (line.cardId && x.id === line.cardId) || x.name === line.card);
      if (!card || !(line.amount > 0) || !cardHasFaceBenefit(card)) return;
      card.balance = round2(Math.max(0, (Number(card.balance) || 0) - line.amount));
    });
  }

  function renderSuccess() {
    const refund = state.lastRefundResult;
    if (refund) {
      const rows = [];
      rows.push(`<div class="success-card__row"><span>办卡实付</span><span class="num">${formatYen(refund.purchaseAmount)}</span></div>`);
      rows.push(`<div class="success-card__row"><span>消耗价值</span><span class="num">-${formatYen(refund.consumedTotal)}</span></div>`);
      (refund.lines || []).forEach(line => {
        const name = line.label || '权益';
        const meta = line.detail ? `<br><span style="font-size:12px;color:var(--text-sec)">${escapeHtml(line.detail)}</span>` : '';
        rows.push(`<div class="success-card__row"><span>${escapeHtml(name)}${meta}</span><span class="num">${formatYen(line.remain != null ? line.remain : 0)}</span></div>`);
      });
      rows.push(`<div class="success-card__row"><span>实际退款</span><span class="num">${formatYen(refund.actualRefund)}</span></div>`);
      const titleEl = document.getElementById('successHeadTitle');
      const slotEl = document.getElementById('successIssueCardSlot');
      const descEl = document.getElementById('successIssueDesc');
      const flowBtn = document.getElementById('btnViewFlow');
      if (titleEl) titleEl.textContent = '退卡成功';
      if (flowBtn) flowBtn.classList.add('hidden');
      if (slotEl) {
        slotEl.innerHTML = '';
        slotEl.classList.add('hidden');
      }
      if (descEl) {
        descEl.textContent = `已为 ${refund.memberName} 退卡「${refund.cardName}」`;
        descEl.classList.remove('hidden');
      }
      const amtStr = String(round2(Math.max(0, Number(refund.actualRefund) || 0)));
      (document.getElementById('successSummary')||{innerHTML:""}).innerHTML = `
        <div class="success-card__amount"><span class="yen">¥</span><span class="val">${amtStr}</span></div>
        <div class="success-card__divider"></div>
        ${rows.join('')}`;
      const contBtn = document.getElementById('btnContinue');
      if (contBtn) contBtn.textContent = '返回列表';
      state.lastIssueFromCardMgmt = true;
      return;
    }
    const s = state.lastSettlement || calcSettlement();
    const chMap = {
      alipay: '支付宝', wechat: '微信', meituan: '美团', dianping: '大众点评',
      douyin: '抖音', koubei: '口碑', cash: '现金', bank: '银行卡', membercard: '会员卡',
    };
    const rows = [];
    if (state.pendingOpenCard) {
      const isExtend = state.pendingOpenCard.kind === 'extend';
      rows.push(`<div class="success-card__row"><span>${escapeHtml(state.pendingOpenCard.name)}</span><strong>${isExtend ? '延期' : (state.orderIsFree ? '开卡·免单' : '开卡')}</strong></div>`);
      rows.push(`<div class="success-card__row"><span>${isExtend ? '延期费用' : '开卡金额'}</span><span class="num">${formatYen(state.orderIsFree && !isExtend ? 0 : state.pendingOpenCard.amount)}</span></div>`);
      if (!isExtend && Array.isArray(state.pendingOpenCard.staffIds) && state.pendingOpenCard.staffIds.length) {
        const pool = getStaffPool();
        const avg = getAchCalcModeForKind('card') !== 'station';
        const names = state.pendingOpenCard.staffIds.map(sid => {
          const st = pool.find(s => s.id === sid);
          const nm = st ? st.name : sid;
          const des = state.pendingOpenCard.staffDesignated && state.pendingOpenCard.staffDesignated[sid] ? '点客' : '散客';
          const role = state.pendingOpenCard.staffRoles && state.pendingOpenCard.staffRoles[sid]
            ? staffRoleLabel(state.pendingOpenCard.staffRoles[sid]) : '';
          return avg ? `${nm}（${des}）` : `${nm}（${des}·${role || '—'}）`;
        });
        rows.push(`<div class="success-card__row"><span>服务员工</span><span>${escapeHtml(names.join('、'))}</span></div>`);
        rows.push(`<div class="success-card__row"><span>业绩入账</span><span>已记入办卡单据与办卡业绩</span></div>`);
      }
      if (state.orderIsFree && !isExtend) {
        rows.push(`<div class="success-card__row"><span>免单规则</span><span>${escapeHtml(freeOrderRuleText())}</span></div>`);
      }
    }
    (s.projectLines || []).forEach(line => {
      rows.push(`<div class="success-card__row"><span>${escapeHtml(line.card)} · ${escapeHtml(line.label)}</span><strong>抵扣 ×${line.qty}</strong></div>`);
    });
    if (s.discountDeduct > 0) {
      rows.push(`<div class="success-card__row"><span>折扣优惠</span><span class="num">-${formatYen(s.discountDeduct)}</span></div>`);
    }
    if (s.couponDeduct > 0) {
      rows.push(`<div class="success-card__row"><span>优惠券</span><span class="num">-${formatYen(s.couponDeduct)}</span></div>`);
    }
    (s.balanceLines || []).forEach(line => {
      rows.push(`<div class="success-card__row"><span>${escapeHtml(line.card)} · 面值抵扣</span><span class="num">-${formatYen(line.amount)}</span></div>`);
    });
    const splits = (s.paySplits || []).filter(p => p.amount > 0 && p.id !== 'membercard');
    if (splits.length) {
      splits.forEach(p => {
        rows.push(`<div class="success-card__row"><span>${escapeHtml(chMap[p.id] || p.id)}</span><span class="num">${formatYen(p.amount)}</span></div>`);
      });
    } else if (s.dueCash > 0) {
      const ch = chMap[state.payChannel] || state.payChannel;
      rows.push(`<div class="success-card__row"><span>${escapeHtml(ch)}</span><span class="num">${formatYen(s.dueCash)}</span></div>`);
    } else if (!rows.length) {
      rows.push(`<div class="success-card__row"><span>支付宝</span><span class="num">${formatYen(0)}</span></div>`);
    }
    if (s.manualOrderNo) {
      rows.push(`<div class="success-card__row"><span>手工单号</span><span>${escapeHtml(s.manualOrderNo)}</span></div>`);
    }
    if (s.billBizDate) {
      rows.push(`<div class="success-card__row"><span>开单日期</span><span>${escapeHtml(formatBillDateLabel(s.billBizDate))}</span></div>`);
    }
    const openAmt = state.pendingOpenCard ? Number(state.pendingOpenCard.amount) || 0 : 0;
    const paid = splits.length ? round2(splits.reduce((a, p) => a + p.amount, 0)) : s.dueCash;
    const amtStr = String(round2(Math.max(0, paid || s.dueCash || openAmt || (s.listTotal - s.projectDeduct - s.discountDeduct - (s.couponDeduct || 0) - s.balanceDeduct))));
    const titleEl = document.getElementById('successHeadTitle');
    const slotEl = document.getElementById('successIssueCardSlot');
    const descEl = document.getElementById('successIssueDesc');
    const flowBtn = document.getElementById('btnViewFlow');
    if (state.lastIssueFromCardMgmt) {
      const isExtend = state.pendingOpenCard?.kind === 'extend';
      if (titleEl) titleEl.textContent = isExtend ? '延期成功' : '办卡成功';
      if (flowBtn) flowBtn.classList.add('hidden');
      const cardHtml = state.successIssueCardHtml
        || (state.successIssueTemplateId && window.CardHost && typeof window.CardHost.renderIssueSuccessCardFace === 'function'
          ? window.CardHost.renderIssueSuccessCardFace(state.successIssueTemplateId)
          : '');
      if (slotEl && cardHtml) {
        slotEl.innerHTML = cardHtml;
        slotEl.classList.remove('hidden');
      } else if (slotEl) {
        slotEl.innerHTML = '';
        slotEl.classList.add('hidden');
      }
      if (descEl) {
        const c = getCustomer();
        const cardName = state.pendingOpenCard?.name || '';
        if (c && cardName) {
          descEl.textContent = isExtend
            ? `已为 ${c.name} 延长「${cardName}」有效期`
            : `已为 ${c.name} 办理「${cardName}」`;
          descEl.classList.remove('hidden');
        } else {
          descEl.textContent = '';
          descEl.classList.add('hidden');
        }
      }
    } else {
      if (titleEl) titleEl.textContent = '开单成功';
      if (flowBtn) flowBtn.classList.remove('hidden');
      if (slotEl) {
        slotEl.innerHTML = '';
        slotEl.classList.add('hidden');
      }
      if (descEl) {
        descEl.textContent = '';
        descEl.classList.add('hidden');
      }
    }
    (document.getElementById('successSummary')||{innerHTML:""}).innerHTML = `
      <div class="success-card__amount"><span class="yen">¥</span><span class="val">${amtStr}</span></div>
      <div class="success-card__divider"></div>
      ${rows.join('')}`;
    const contBtn = document.getElementById('btnContinue');
    if (contBtn) contBtn.textContent = state.lastIssueFromCardMgmt ? '返回列表' : '继续开单';
  }

  function showRefundSuccess(payload) {
    const p = payload || {};
    state.lastRefundResult = {
      memberName: p.memberName || '',
      cardName: p.cardName || '',
      templateId: p.templateId || '',
      purchaseAmount: round2(Number(p.purchaseAmount) || 0),
      consumedTotal: round2(Number(p.consumedTotal) || 0),
      suggestedRefund: round2(Number(p.suggestedRefund) || 0),
      actualRefund: round2(Math.max(0, Number(p.actualRefund) || 0)),
      lines: Array.isArray(p.lines) ? p.lines.map(l => ({
        label: l.label || '',
        detail: l.detail || '',
        remain: l.remain,
        used: l.used,
      })) : [],
    };
    state.lastIssueFromCardMgmt = true;
    state.pendingOpenCard = null;
    state.successIssueTemplateId = null;
    state.successIssueCardHtml = '';
    state.lastSettlement = null;
    renderSuccess();
    showOnlyScreen('screen-success');
  }

  /* ==== 流水订单 · seed 对齐 CUSTOMERS / PROJECTS / PRODUCTS / STAFFS ==== */
  const FLOW_AVATAR_GUEST = 'assets/billing/avatar-female.png';
  const FLOW_ORDERS = [
    {
      id: 'fo-seed-q1',
      flowNo: '202607290008',
      customerId: null,
      customerName: '散客',
      avatar: FLOW_AVATAR_GUEST,
      status: 'done',
      kind: 'quick',
      items: [{ id: 'fi-seed-q1', name: '直接收款', price: 50, type: 'quick', qty: 1 }],
      staff: '林屿森',
      payMethod: '现金',
      payments: [{ method: '现金', amount: 50 }],
      amount: 50,
      achievement: 50,
      commission: 0,
      discount: 0,
      benefitLabel: '无卡权益',
      time: '2026.07.29 10:18',
      cashier: '顾清扬',
      cashierId: 'st0',
    },
    {
      id: 'fo-seed-q2',
      flowNo: '202607280012',
      customerId: 'm1',
      customerName: '张雨晴',
      avatar: 'assets/billing/avatar-female.png',
      status: 'done',
      kind: 'quick',
      items: [{ id: 'fi-seed-q2', name: '直接收款', price: 88, type: 'quick', qty: 1 }],
      staff: '何苏叶',
      payMethod: '微信',
      payments: [{ method: '微信', amount: 88 }],
      amount: 88,
      achievement: 88,
      commission: 0,
      discount: 0,
      benefitLabel: '无卡权益',
      time: '2026.07.28 14:36',
      cashier: '赵敏',
      cashierId: 'st9',
    },
    {
      id: 'fo-seed-q3',
      flowNo: '202607270015',
      customerId: null,
      customerName: '散客',
      avatar: FLOW_AVATAR_GUEST,
      status: 'done',
      kind: 'quick',
      items: [{ id: 'fi-seed-q3', name: '直接收款', price: 120, type: 'quick', qty: 1 }],
      staff: 'Lisa',
      payMethod: '支付宝',
      payments: [
        { method: '支付宝', amount: 80 },
        { method: '现金', amount: 40 },
      ],
      amount: 120,
      achievement: 120,
      commission: 0,
      discount: 0,
      benefitLabel: '无卡权益',
      time: '2026.07.27 18:05',
      cashier: '赵敏',
      cashierId: 'st9',
    },
    {
      id: 'fo-seed-1',
      flowNo: '202607270001',
      customerId: null,
      customerName: '散客',
      avatar: FLOW_AVATAR_GUEST,
      status: 'done',
      kind: 'project',
      items: [{
        id: 'fi-seed-1',
        name: '洗剪吹',
        price: 68,
        type: 'project',
        qty: 1,
        staffIds: ['st1'],
        staffRoles: { st1: 'mid' },
        staffAchievements: { st1: 68 },
        staffCommissions: { st1: 0 },
      }],
      staff: '林屿森',
      staffs: [{ id: 'st1', name: '林屿森', achievement: 68, commission: 0, role: 'mid' }],
      payMethod: '现金',
      payments: [{ method: '现金', amount: 68 }],
      amount: 68,
      achievement: 68,
      commission: 0,
      discount: 0,
      benefitLabel: '无卡权益',
      time: '2026.07.27 09:22',
      cashier: '赵敏',
      cashierId: 'st9',
    },
    {
      id: 'fo-seed-2',
      flowNo: '202607261014',
      customerId: 'm1',
      customerName: '张雨晴',
      avatar: 'assets/billing/avatar-female.png',
      status: 'done',
      kind: 'project',
      items: [{
        id: 'fi-seed-2',
        name: '头皮护理',
        price: 168,
        type: 'project',
        qty: 1,
        staffIds: ['st2'],
        staffRoles: { st2: 'senior' },
        staffAchievements: { st2: 168 },
        staffCommissions: { st2: 0 },
      }],
      staff: '何苏叶',
      staffs: [{ id: 'st2', name: '何苏叶', achievement: 168, commission: 0, role: 'senior' }],
      payMethod: '微信',
      payments: [
        { method: '微信', amount: 100 },
        { method: '现金', amount: 68 },
      ],
      amount: 168,
      achievement: 168,
      commission: 0,
      discount: 0,
      benefitLabel: '无卡权益',
      time: '2026.07.26 15:40',
      cashier: '何苏叶',
      lastEditedAt: '2026.07.26 16:12',
      editLogs: [
        { id: 'fel-2b', time: '2026.07.26 16:12', operator: '何苏叶', summary: '调整项目单价 · 改为指定员工' },
        { id: 'fel-2a', time: '2026.07.26 15:52', operator: '何苏叶', summary: '修改服务项目内容' },
      ],
    },
    {
      id: 'fo-seed-3',
      flowNo: '202607251008',
      customerId: 'm8',
      customerName: '吴佳宁',
      avatar: 'assets/billing/avatar-female.png',
      status: 'done',
      kind: 'project',
      items: [{ id: 'fi-seed-3', name: '时尚洗吹', price: 58, type: 'project', qty: 1 }],
      staff: '阿Ken',
      payMethod: '会员卡',
      payments: [{ method: '会员卡', amount: 0 }],
      amount: 0,
      paidAmount: 0,
      listTotal: 58,
      listPrice: 58,
      achievement: 58,
      commission: 0,
      discount: 58,
      benefitLabel: '洗吹12次卡 · 项目抵扣',
      offerSnapshot: {
        discountTotal: 58,
        projectDeduct: 58,
        discountDeduct: 0,
        couponDeduct: 0,
        balanceDeduct: 0,
        lines: [{ label: '洗吹12次卡 · 时尚洗吹', amount: 0, meta: '抵扣 ×1' }],
      },
      cardMutations: {
        projects: [{ cardId: 'seed-card-wash', key: 'fashion-blow', qty: 1, label: '时尚洗吹' }],
        balances: [],
      },
      orderRemark: '',
      time: '2026.07.25 11:18',
      cashier: '林屿森',
    },
    {
      id: 'fo-seed-4',
      flowNo: '202607241022',
      customerId: 'm2',
      customerName: '李诗涵',
      avatar: 'assets/billing/avatar-female.png',
      status: 'done',
      kind: 'product',
      items: [{ id: 'fi-seed-4', name: '剑琅修护洗发水', price: 128, type: 'product', qty: 1, spec: '500ml' }],
      staff: 'Lisa',
      payMethod: '支付宝',
      payments: [{ method: '支付宝', amount: 128 }],
      amount: 128,
      achievement: 128,
      commission: 0,
      discount: 0,
      benefitLabel: '无卡权益',
      time: '2026.07.24 16:05',
      cashier: 'Lisa',
    },
    {
      id: 'fo-seed-5',
      flowNo: '202607231008',
      customerId: 'm1',
      customerName: '张雨晴',
      avatar: 'assets/billing/avatar-female.png',
      status: 'done',
      kind: 'card',
      items: [{ id: 'fi-seed-5', name: '办卡 · 尊享组合卡', price: 2000, type: 'card', qty: 1 }],
      staff: '林屿森',
      payMethod: '微信',
      payments: [{ method: '微信', amount: 2000 }],
      amount: 2000,
      achievement: 2000,
      commission: 0,
      discount: 0,
      benefitLabel: '无卡权益',
      time: '2026.07.23 14:20',
      cashier: '林屿森',
    },
    {
      id: 'fo-seed-6',
      flowNo: '202607221015',
      customerId: 'm2',
      customerName: '李诗涵',
      avatar: 'assets/billing/avatar-female.png',
      status: 'done',
      kind: 'card',
      items: [{ id: 'fi-seed-6', name: '充值 · 老客续充卡', price: 1000, type: 'card', qty: 1 }],
      staff: '何苏叶',
      payMethod: '支付宝',
      payments: [{ method: '支付宝', amount: 1000 }],
      amount: 1000,
      achievement: 1000,
      commission: 0,
      discount: 0,
      benefitLabel: '无卡权益',
      time: '2026.07.22 10:05',
      cashier: '何苏叶',
    },
    {
      id: 'fo-seed-7',
      flowNo: '202607201002',
      customerId: null,
      customerName: '散客',
      avatar: FLOW_AVATAR_GUEST,
      status: 'void',
      kind: 'project',
      items: [{ id: 'fi-seed-7', name: '精致剪发', price: 98, type: 'project', qty: 1 }],
      staff: '阿Ken',
      payMethod: '现金',
      payments: [{ method: '现金', amount: 98 }],
      amount: 98,
      achievement: 98,
      commission: 0,
      discount: 0,
      benefitLabel: '无卡权益',
      time: '2026.07.20 16:48',
      cashier: '阿Ken',
    },
    {
      id: 'fo-seed-8',
      flowNo: '202607191008',
      customerId: 'm1',
      customerName: '张雨晴',
      avatar: 'assets/billing/avatar-female.png',
      status: 'refund',
      kind: 'project',
      items: [{ id: 'fi-seed-8', name: '头皮护理', price: 168, type: 'project', qty: 1 }],
      staff: '何苏叶',
      payMethod: '微信',
      payments: [{ method: '微信', amount: 168 }],
      amount: 168,
      achievement: 168,
      commission: 0,
      discount: 0,
      benefitLabel: '无卡权益',
      time: '2026.07.19 11:30',
      cashier: '何苏叶',
      refunds: [{
        docType: 'refund',
        refundNo: '202607191001',
        refundKind: 'full',
        time: '2026.07.19 12:05',
        operator: '何苏叶',
        mode: 'original',
        remark: '',
        totalRefund: 168,
        items: [{ itemIndex: 0, name: '头皮护理', qty: 1, listPrice: 168, paidShare: 168, refundAmount: 168 }],
        channels: [{ method: '微信', amount: 168 }],
      }],
    },
    {
      id: 'fo-seed-9',
      flowNo: '202607181012',
      customerId: 'm2',
      customerName: '李诗涵',
      avatar: 'assets/billing/avatar-female.png',
      status: 'refund',
      kind: 'product',
      items: [{ id: 'fi-seed-9', name: '剑琅修护洗发水（500ml）', price: 128, type: 'product', qty: 1 }],
      staff: 'Lisa',
      payMethod: '支付宝',
      payments: [{ method: '支付宝', amount: 128 }],
      amount: 128,
      achievement: 128,
      commission: 0,
      discount: 0,
      benefitLabel: '无卡权益',
      time: '2026.07.18 15:42',
      cashier: 'Lisa',
      refunds: [{
        docType: 'refund',
        refundNo: '202607181002',
        refundKind: 'full',
        time: '2026.07.18 16:10',
        operator: 'Lisa',
        mode: 'designated',
        remark: '客户要求退至支付宝',
        totalRefund: 128,
        items: [{ itemIndex: 0, name: '剑琅修护洗发水（500ml）', qty: 1, listPrice: 128, paidShare: 128, refundAmount: 128 }],
        channels: [{ method: '支付宝', amount: 128 }],
      }],
    },
    {
      id: 'fo-seed-10',
      flowNo: '202607211020',
      customerId: 'm1',
      customerName: '张雨晴',
      avatar: 'assets/billing/avatar-female.png',
      status: 'partial_refund',
      kind: 'project',
      items: [
        { id: 'fi-seed-10a', name: '精致剪发', price: 98, type: 'project', qty: 1 },
        { id: 'fi-seed-10b', name: '头皮护理', price: 168, type: 'project', qty: 1 },
      ],
      staff: '何苏叶',
      payMethod: '微信',
      payments: [{ method: '微信', amount: 266 }],
      amount: 266,
      paidAmount: 266,
      achievement: 266,
      commission: 0,
      discount: 0,
      benefitLabel: '无卡权益',
      time: '2026.07.21 14:20',
      cashier: '何苏叶',
      refunds: [{
        docType: 'refund',
        refundNo: '202607211003',
        refundKind: 'partial',
        time: '2026.07.21 15:08',
        operator: '何苏叶',
        mode: 'designated',
        remark: '只退剪发，护理已完成',
        totalRefund: 98,
        items: [{ itemIndex: 0, name: '精致剪发', qty: 1, listPrice: 98, paidShare: 98, refundAmount: 98 }],
        channels: [{ method: '微信', amount: 98 }],
      }],
    },
  ];

  (function backfillFlowOrderCashierIds() {
    const nameToId = {};
    STAFFS.forEach(s => { nameToId[s.name] = s.id; });
    FLOW_ORDERS.forEach(o => {
      if (!o.cashierId && o.cashier && nameToId[o.cashier]) o.cashierId = nameToId[o.cashier];
      if (!o.cashier && o.cashierId) {
        const st = STAFFS.find(s => s.id === o.cashierId);
        if (st) o.cashier = st.name;
      }
    });
  })();


  function flowStatusLabel(status) {
    if (status === 'void') return '已作废';
    if (status === 'refund') return '已退款';
    if (status === 'partial_refund') return '部分退款';
    return '已完成';
  }

  function flowRefundKindLabel(kind) {
    return kind === 'full' ? '全退' : '部分退';
  }

  /** 仍可申请退款 / 作废：已完成或未退完的部分退 */
  function flowCanRefundOrVoid(o) {
    return !!(o && (o.status === 'done' || o.status === 'partial_refund'));
  }

  /** 修改订单仅允许未发生退款的已完成单 */
  function flowCanEditOrder(o) {
    return !!(o && o.status === 'done');
  }

  function flowTypeTag(kind) {
    if (kind === 'product') return { text: '产', cls: 'flow-type-tag--product' };
    if (kind === 'card') return { text: '卡', cls: 'flow-type-tag--card' };
    if (kind === 'group' || kind === 'tuangou') return { text: '团', cls: 'flow-type-tag--group' };
    if (kind === 'quick') return { text: '直', cls: 'flow-type-tag--quick' };
    return { text: '项', cls: '' };
  }

  /** 类型标 HTML：项/产/卡/团为色块字；直为闪电图（与结算 s6/s7 同规） */
  function flowTypeTagHtml(kind) {
    const tag = flowTypeTag(kind);
    if (kind === 'quick') {
      return `<span class="flow-type-tag flow-type-tag--quick" aria-label="直接收款"><img src="assets/ic_lightning_tag.svg" alt="" width="17" height="17" draggable="false"></span>`;
    }
    return `<span class="flow-type-tag ${tag.cls}">${tag.text}</span>`;
  }

  /** 信息列表「类型」字段用全文，不用色块标签 */
  function flowTypeLabel(kind) {
    if (kind === 'product') return '产品';
    if (kind === 'card') return '会员卡';
    if (kind === 'quick') return '直接收款';
    return '项目';
  }

  function flowAvatarSrc(o) {
    if (o && o.avatar) return o.avatar;
    if (o && o.customerId) {
      const c = CUSTOMERS.find(x => x.id === o.customerId);
      if (c && c.avatar) return c.avatar;
    }
    const name = (o && o.customerName) || '';
    if (/先生|男/.test(name)) return 'assets/billing/avatar-male.png';
    return FLOW_AVATAR_GUEST;
  }

  function flowIconEmpty() {
    /* Lucide receipt · 空态流水单据 */
    return `<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6M16 12h-6M16 16h-6"/></svg>`;
  }

  function flowEmptyHtml(title, desc) {
    return `<div class="flow-empty">
      <div class="flow-empty__illus" aria-hidden="true">${flowIconEmpty()}</div>
      <div class="flow-empty__title">${escapeHtml(title || '暂无数据')}</div>
      <div class="flow-empty__desc">${escapeHtml(desc || '相关订单会出现在这里')}</div>
    </div>`;
  }

  function flowAvatarHtml(o) {
    const src = flowAvatarSrc(o);
    return `<img class="flow-order-card__avatar" src="${escapeHtml(src)}" alt="" width="36" height="36">`;
  }

  function flowIconChevron() {
    /* Lucide chevron-right · 辅助 16 */
    return `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`;
  }
  function flowIconChevronDown() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;
  }
  function flowIconChevronUp() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>`;
  }
  function flowIconPencil() {
    /* 圆角实心铅笔 · 与 iconSvg('edit') 同款面性 */
    return filledEditPencilSvg();
  }
  /** 修改订单条目右下角「编辑」入口图：Lucide square-pen（方框 + 笔），与上方面性铅笔区分 */
  function flowIconEditSquare() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>`;
  }
  function flowIconFilter() {
    /* Lucide sliders-horizontal · 标题栏筛选统一图标 */
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>`;
  }
  function flowIconInfo() {
    /* 内联 info，避免相对路径丢图；描边用 warn-text */
    return `<svg class="flow-detail-foot__tip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="#E37318" stroke-width="2"/><path d="M12 16v-4" stroke="#E37318" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="8" r="1.25" fill="#E37318"/></svg>`;
  }

  function flowPaymentsOf(o) {
    if (o && Array.isArray(o.payments) && o.payments.length) {
      return o.payments.map(p => ({
        method: p.method || p.name || '其他',
        amount: Number(p.amount) || 0,
      }));
    }
    return [{ method: (o && o.payMethod) || '现金', amount: Number(o && o.amount) || 0 }];
  }

  function flowParseDay(timeStr) {
    if (!timeStr) return '';
    return String(timeStr).slice(0, 10).replace(/\./g, '-');
  }

  function flowTodayKey() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function flowDaysAgoKey(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    const pad = x => String(x).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  /** 将写死的流水种子日期相对「原今日 2026.07.29」平移到真实今天，保证「今日」筛选有数据 */
  function alignDemoFlowClocks() {
    const anchor = new Date('2026-07-29T12:00:00');
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const deltaDays = Math.round((today - anchor) / 86400000);
    const shiftDotTime = (timeStr) => {
      const m = String(timeStr || '').match(/^(\d{4})\.(\d{2})\.(\d{2})(.*)$/);
      if (!m) return timeStr;
      const d = new Date(+m[1], +m[2] - 1, +m[3], 12, 0, 0);
      d.setDate(d.getDate() + deltaDays);
      const pad = n => String(n).padStart(2, '0');
      return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}${m[4] || ''}`;
    };
    [FLOW_ORDERS].forEach((list) => {
      (list || []).forEach((row) => {
        if (row.time) row.time = shiftDotTime(row.time);
        if (row.lastEditedAt) row.lastEditedAt = shiftDotTime(row.lastEditedAt);
        if (Array.isArray(row.editLog)) {
          row.editLog.forEach((log) => {
            if (log.time) log.time = shiftDotTime(log.time);
          });
        }
      });
    });
  }
  alignDemoFlowClocks();

  function flowMatchDateFilter(o, dateMode, customStart, customEnd) {
    if (!dateMode || dateMode === 'all') return true;
    const day = flowParseDay(o.time);
    if (!day) return false;
    if (dateMode === 'today') return day === flowTodayKey();
    if (dateMode === 'yesterday') return day === flowDaysAgoKey(1);
    if (dateMode === '7d') return day >= flowDaysAgoKey(6) && day <= flowTodayKey();
    if (dateMode === '30d') return day >= flowDaysAgoKey(29) && day <= flowTodayKey();
    if (dateMode === 'custom' || dateMode === 'other') {
      const start = customStart || '';
      const end = customEnd || '';
      if (!start || !end) return true;
      return day >= start && day <= end;
    }
    return true;
  }

  function flowApplySheetFilter(list) {
    const f = state.flowFilter || { date: 'all', pay: 'all', guest: 'all' };
    return list.filter(o => {
      if (!flowMatchDateFilter(o, f.date, f.customStart, f.customEnd)) return false;
      if (f.pay && f.pay !== 'all' && o.payMethod !== f.pay) return false;
      if (f.guest === 'guest' && o.customerId) return false;
      if (f.guest === 'member' && !o.customerId) return false;
      return true;
    });
  }

  function flowFmtDotFromKey(key) {
    const m = String(key || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return '';
    return `${m[1]}.${m[2]}.${m[3]}`;
  }

  function flowFmtShortRange(start, end) {
    const a = String(start || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const b = String(end || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!a || !b) return '自定义';
    const left = `${Number(a[2])}.${Number(a[3])}`;
    const right = `${Number(b[2])}.${Number(b[3])}`;
    return left === right ? left : `${left}–${right}`;
  }

  function openFlowRangeSheet(context) {
    state.flowRangeContext = context || 'filter';
    let start = '';
    let end = '';
    if (context === 'self') {
      start = state.flowSelfCustomStart || '';
      end = state.flowSelfCustomEnd || '';
    } else if (context === 'filter') {
      const draft = state.flowFilterDraft || state.flowFilter || {};
      start = draft.customStart || '';
      end = draft.customEnd || '';
    }
    state.flowRangeDraftStart = start;
    state.flowRangeDraftEnd = end;
    state.flowRangeCalFocus = start && !end ? 'end' : 'start';
    const anchor = (end || start || flowTodayKey()).match(/^(\d{4})-(\d{2})/);
    state.flowRangeCalYear = anchor ? Number(anchor[1]) : new Date().getFullYear();
    state.flowRangeCalMonth = anchor ? Number(anchor[2]) - 1 : new Date().getMonth();
    renderFlowRangeChrome();
    renderFlowRangeCalendar();
    const rangeMask = document.getElementById('flowRangeMask');
    /* 提到同级遮罩最后，避免与筛选 Sheet 同层时仍被盖住 */
    if (rangeMask && rangeMask.parentElement) {
      rangeMask.parentElement.appendChild(rangeMask);
    }
    if (context === 'filter') {
      const filterMask = document.getElementById('flowFilterMask');
      if (filterMask) {
        filterMask.classList.add('is-covered');
        filterMask.style.pointerEvents = 'none';
      }
    }
    openMask('flowRangeMask');
  }

  function renderFlowRangeChrome() {
    const start = state.flowRangeDraftStart;
    const end = state.flowRangeDraftEnd;
    const focus = state.flowRangeCalFocus || 'start';
    const rangeEl = document.getElementById('flowRangeCalRange');
    if (rangeEl) {
      const chip = (kind, label, key) => {
        const on = focus === kind ? ' is-on' : '';
        const val = key
          ? `<span class="flow-balance-cal-chip__val">${escapeHtml(flowFmtDotFromKey(key))}</span>`
          : '<span class="flow-balance-cal-chip__val is-placeholder">请选择</span>';
        return `<button type="button" class="flow-balance-cal-chip${on}" data-flow-cal-focus="${kind}"><span class="flow-balance-cal-chip__label">${label}</span>${val}</button>`;
      };
      rangeEl.innerHTML = chip('start', '开始日期', start) +
        '<span class="flow-balance-cal-sep">至</span>' +
        chip('end', '结束日期', end);
    }
    const hint = document.getElementById('flowRangeCalHint');
    if (hint) {
      if (!start) hint.textContent = '请选择开始日期（今天往前 90 天内）';
      else if (!end) hint.textContent = '请选择结束日期';
      else hint.textContent = '可重新点击日期调整范围';
    }
    const okBtn = document.getElementById('flowRangeOk');
    if (okBtn) okBtn.disabled = !(start && end);
  }

  function renderFlowRangeCalendar() {
    const cal = document.getElementById('flowRangeCal');
    if (!cal) return;
    let y = state.flowRangeCalYear;
    let m = state.flowRangeCalMonth;
    if (y == null || m == null) {
      const today = flowTodayKey().split('-');
      y = Number(today[0]);
      m = Number(today[1]) - 1;
      state.flowRangeCalYear = y;
      state.flowRangeCalMonth = m;
    }
    const minK = flowDaysAgoKey(89);
    const maxK = flowTodayKey();
    const minP = minK.split('-').map(Number);
    const maxP = maxK.split('-').map(Number);
    const canPrev = !(y === minP[0] && m === minP[1] - 1);
    const canNext = !(y === maxP[0] && m === maxP[1] - 1);
    const chevL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
    const chevR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const startK = state.flowRangeDraftStart;
    const endK = state.flowRangeDraftEnd;
    const todayK = flowTodayKey();
    const cells = [];
    for (let i = 0; i < firstDow; i++) {
      cells.push('<span class="flow-balance-cal__day is-muted" aria-hidden="true"></span>');
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const disabled = key < minK || key > maxK;
      const isStart = !!(startK && key === startK);
      const isEnd = !!(endK && key === endK);
      const inRange = !!(startK && endK && key >= startK && key <= endK);
      /* 仅选开始日时也高亮端点（对齐支出 range 日历） */
      const cls = [
        'flow-balance-cal__day',
        disabled ? 'is-disabled' : '',
        isStart ? 'is-range-start' : '',
        isEnd ? 'is-range-end' : '',
        (inRange || (isStart && !endK)) ? 'is-in-range' : '',
        (isStart && !endK) ? 'is-selected' : '',
        key === todayK ? 'is-today' : '',
      ].filter(Boolean).join(' ');
      cells.push(disabled
        ? `<span class="${cls}" aria-hidden="true"><span class="flow-balance-cal__day-num">${d}</span></span>`
        : `<button type="button" class="${cls}" data-flow-cal-day="${key}" aria-label="${key}"><span class="flow-balance-cal__day-num">${d}</span></button>`);
    }
    cal.innerHTML = `
      <div class="flow-balance-cal__nav">
        <button type="button" class="flow-balance-cal__nav-btn" data-flow-cal-nav="-1" ${canPrev ? '' : 'disabled'} aria-label="上一月">${chevL}</button>
        <div class="flow-balance-cal__title">${y}年${m + 1}月</div>
        <button type="button" class="flow-balance-cal__nav-btn" data-flow-cal-nav="1" ${canNext ? '' : 'disabled'} aria-label="下一月">${chevR}</button>
      </div>
      <div class="flow-balance-cal__weekdays">${weekdays.map(w => `<div class="flow-balance-cal__wd">${w}</div>`).join('')}</div>
      <div class="flow-balance-cal__grid">${cells.join('')}</div>`;
  }

  function pickFlowRangeDay(key) {
    if (!key) return;
    const focus = state.flowRangeCalFocus || 'start';
    if (focus === 'start' || !state.flowRangeDraftStart) {
      state.flowRangeDraftStart = key;
      state.flowRangeDraftEnd = '';
      state.flowRangeCalFocus = 'end';
    } else if (focus === 'end') {
      if (key < state.flowRangeDraftStart) {
        state.flowRangeDraftEnd = state.flowRangeDraftStart;
        state.flowRangeDraftStart = key;
      } else {
        state.flowRangeDraftEnd = key;
      }
      state.flowRangeCalFocus = 'end';
    }
    renderFlowRangeChrome();
    renderFlowRangeCalendar();
  }

  function restoreFlowFilterCover() {
    const filterMask = document.getElementById('flowFilterMask');
    if (!filterMask) return;
    filterMask.classList.remove('is-covered');
    filterMask.style.pointerEvents = '';
  }

  function applyFlowRangeSheet() {
    const start = state.flowRangeDraftStart;
    const end = state.flowRangeDraftEnd;
    if (!start || !end) return;
    const ctx = state.flowRangeContext || 'filter';
    closeMask('flowRangeMask');
    restoreFlowFilterCover();
    if (ctx === 'self') {
      state.flowSelfCustomStart = start;
      state.flowSelfCustomEnd = end;
      state.flowSelfDate = 'custom';
      renderFlowSelf();
    } else if (ctx === 'filter') {
      if (!state.flowFilterDraft) state.flowFilterDraft = Object.assign({}, state.flowFilter);
      state.flowFilterDraft.date = 'custom';
      state.flowFilterDraft.customStart = start;
      state.flowFilterDraft.customEnd = end;
      renderFlowFilterSheet();
    }
  }

  function cancelFlowRangeSheet() {
    closeMask('flowRangeMask');
    restoreFlowFilterCover();
    state.flowRangeContext = null;
  }

  function flowIsActiveOrder(o) {
    return o && o.status !== 'void' && o.status !== 'refund' && o.status !== 'partial_refund';
  }

  function flowOrdersByTab(tab) {
    let list = FLOW_ORDERS.slice();
    if (tab === 'project') list = list.filter(o => (o.kind === 'project' || o.kind === 'quick') && flowIsActiveOrder(o));
    else if (tab === 'product') list = list.filter(o => o.kind === 'product' && flowIsActiveOrder(o));
    else if (tab === 'card') list = list.filter(o => o.kind === 'card' && flowIsActiveOrder(o));
    else if (tab === 'void') list = list.filter(o => o.status === 'void');
    else if (tab === 'refund') list = list.filter(o => o.status === 'refund' || o.status === 'partial_refund');
    else list = list.filter(flowIsActiveOrder);
    return flowApplySheetFilter(list);
  }


  function flowOrderRefunds(o) {
    return (o && Array.isArray(o.refunds)) ? o.refunds : [];
  }

  function flowItemRefundedAmount(o, itemIndex) {
    let sum = 0;
    flowOrderRefunds(o).forEach((r) => {
      (r.items || []).forEach((it) => {
        if (it.itemIndex === itemIndex) sum += Number(it.refundAmount) || 0;
      });
    });
    return round2(sum);
  }

  function flowItemRemainingRefundable(o, itemIndex) {
    const it = o.items[itemIndex];
    if (!it) return 0;
    const price = round2(Number(it.price || 0) * (Number(it.qty) || 1));
    return round2(Math.max(0, price - flowItemRefundedAmount(o, itemIndex)));
  }

  function flowRefundableItemIndices(o) {
    if (!o || !Array.isArray(o.items)) return [];
    return o.items.map((_, i) => i).filter((i) => flowItemRemainingRefundable(o, i) >= 0.01);
  }

  function flowOrderTotalRefunded(o) {
    return round2(flowOrderRefunds(o).reduce((s, r) => s + (Number(r.totalRefund) || 0), 0));
  }

  function flowOrderLinesTotal(o) {
    return flowItemsListTotal(o && o.items);
  }

  function flowItemPaidShare(o, itemIndex) {
    const total = flowOrderLinesTotal(o);
    const it = o.items[itemIndex];
    if (!it || total <= 0) return 0;
    const line = round2(Number(it.price || 0) * (Number(it.qty) || 1));
    const paid = flowOrderPaidAmount(o);
    return round2(paid * (line / total));
  }

  function nextRefundNo() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const prefix = `${y}${m}${day}`;
    let maxSeq = 0;
    FLOW_ORDERS.forEach((o) => {
      flowOrderRefunds(o).forEach((r) => {
        const no = String(r.refundNo || '');
        if (no.startsWith(prefix) && no.length >= 12) {
          const seq = parseInt(no.slice(8), 10);
          if (seq > maxSeq) maxSeq = seq;
        }
      });
    });
    return prefix + String(maxSeq + 1).padStart(4, '0');
  }

  function flowPositivePayments(o) {
    return flowPaymentsOf(o).filter((p) => (Number(p.amount) || 0) > 0);
  }

  /** 原单金额最大的支付方式（并列取先出现的）；无明细时回退 payMethod */
  function flowLargestPayMethod(o) {
    const pays = flowPositivePayments(o);
    if (!pays.length) return (o && o.payMethod) || '其他';
    let best = pays[0];
    pays.forEach((p) => {
      if ((Number(p.amount) || 0) > (Number(best.amount) || 0)) best = p;
    });
    return best.method || (o && o.payMethod) || '其他';
  }

  function flowSplitRefundByOriginalChannels(o, refundTotal) {
    const pays = flowPositivePayments(o);
    const sumPaid = round2(pays.reduce((s, p) => s + (Number(p.amount) || 0), 0));
    const target = round2(refundTotal);
    if (sumPaid <= 0 || target <= 0) return [{ method: o.payMethod || '其他', amount: target }];
    const rows = [];
    let allocated = 0;
    pays.forEach((p, idx) => {
      let amt;
      if (idx === pays.length - 1) amt = round2(target - allocated);
      else {
        amt = round2(target * ((Number(p.amount) || 0) / sumPaid));
        allocated = round2(allocated + amt);
      }
      if (amt > 0) rows.push({ method: p.method, amount: amt });
    });
    return rows;
  }

  function flowRefundModeLabel(mode) {
    return mode === 'designated' ? '指定退回' : '原路退回';
  }

  function flowFormatRefundChannels(refund) {
    if (!refund || !Array.isArray(refund.channels)) return '—';
    if (refund.mode === 'original') {
      return refund.channels.map((c) => `${c.method} ¥${Number(c.amount).toFixed(2)}`).join(' · ');
    }
    const c = refund.channels[0];
    return c ? c.method : '—';
  }

  function nextFlowNo() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const seq = String(FLOW_ORDERS.length + 1).padStart(4, '0');
    return `${y}${m}${day}${seq}`;
  }

  function formatFlowTime(d) {
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function flowKindFromItems(items) {
    const list = items || [];
    if (!list.length) return 'project';
    if (list.every(i => i.type === 'quick')) return 'quick';
    if (list.every(i => i.type === 'product')) return 'product';
    if (list.some(i => i.type === 'card')) return 'card';
    return 'project';
  }

  function flowItemsListTotal(items) {
    return round2((items || []).reduce((s, it) => {
      const price = Number(it.price != null ? it.price : it.unitPrice) || 0;
      const qty = Math.max(1, Number(it.qty) || 1);
      return s + price * qty;
    }, 0));
  }

  function flowOrderPaidAmount(o) {
    if (!o) return 0;
    if (o.paidAmount != null) return round2(Number(o.paidAmount) || 0);
    return round2(Number(o.amount) || 0);
  }

  function flowOrderDiscountTotal(o) {
    if (!o) return 0;
    if (o.offerSnapshot && o.offerSnapshot.discountTotal != null) {
      return round2(Number(o.offerSnapshot.discountTotal) || 0);
    }
    return round2(Number(o.discount) || 0);
  }

  function flowOrderEstimatedDue(o, itemsOverride) {
    const list = flowItemsListTotal(itemsOverride || (o && o.items) || []);
    const disc = flowOrderDiscountTotal(o);
    return round2(Math.max(0, list - disc));
  }

  function flowOrderGap(o, itemsOverride) {
    const estimated = flowOrderEstimatedDue(o, itemsOverride);
    const paid = flowOrderPaidAmount(o);
    return round2(estimated - paid);
  }

  /** 员工姓名（优先取开单2.0 的员工池：流水自带名单与开单名单不一致时，以开单为准，避免同一 id 两个名字） */
  function flowStaffNameById(sid) {
    if (!sid) return '';
    if (typeof window.staffById === 'function') {
      const host = window.staffById(sid);
      if (host && host.name) return host.name;
    }
    const st = getStaffPool().find(s => s.id === sid);
    return st ? st.name : sid;
  }

  function flowStaffPillsHtml(it) {
    const ids = Array.isArray(it.staffIds) ? it.staffIds : [];
    if (!ids.length) return '';
    return `<div class="flow-staff-pills">${ids.map(sid => {
      const nm = flowStaffNameById(sid);
      const roleId = it.staffRoles && it.staffRoles[sid];
      const role = roleId && typeof staffRoleLabel === 'function' ? staffRoleLabel(roleId) : '';
      return `<div class="flow-staff-pill-row">
        <span class="flow-staff-pill-row__name">${escapeHtml(nm)}</span>
        <span class="flow-pill flow-pill--station${role ? '' : ' is-empty'}">${role ? escapeHtml(role) : '未设工位'}</span>
      </div>`;
    }).join('')}</div>`;
  }

  function flowStaffPillsForOrderStaff(o, st) {
    const sid = st.id || st.name;
    const roles = flowStaffRoleLabelsForOrder(o, sid);
    const roleTxt = roles.length ? roles.join('/') : '';
    return `<div class="flow-staff-pill-row">
      <span class="flow-staff-pill-row__name">${escapeHtml(st.name || '—')}</span>
      <span class="flow-pill flow-pill--station${roleTxt ? '' : ' is-empty'}">${roleTxt ? escapeHtml(roleTxt) : '未设工位'}</span>
    </div>`;
  }

  function flowAggregateStaffsFromItems(items, fallbackStaffs) {
    const pool = getStaffPool();
    const map = new Map();
    (items || []).forEach(it => {
      (it.staffIds || []).forEach(sid => {
        const st = pool.find(s => s.id === sid);
        const name = st ? st.name : sid;
        const role = it.staffRoles && it.staffRoles[sid] ? it.staffRoles[sid] : null;
        const ach = Number((it.staffAchievements && it.staffAchievements[sid]) || 0);
        const comm = Number((it.staffCommissions && it.staffCommissions[sid]) || 0);
        if (!map.has(sid)) {
          map.set(sid, { id: sid, name, role: role || null, achievement: 0, commission: 0 });
        }
        const row = map.get(sid);
        if (role) row.role = role;
        row.achievement = round2((Number(row.achievement) || 0) + ach);
        row.commission = round2((Number(row.commission) || 0) + comm);
      });
    });
    if (!map.size && Array.isArray(fallbackStaffs) && fallbackStaffs.length) {
      return fallbackStaffs.map(s => Object.assign({}, s));
    }
    return Array.from(map.values());
  }

  function flowStaffRoleLabelsForOrder(o, staffId) {
    const labels = [];
    (o.items || []).forEach(it => {
      if (!it.staffRoles || !it.staffRoles[staffId]) return;
      const label = typeof staffRoleLabel === 'function' ? staffRoleLabel(it.staffRoles[staffId]) : it.staffRoles[staffId];
      if (label && labels.indexOf(label) < 0) labels.push(label);
    });
    if (!labels.length && o.staffs) {
      const st = o.staffs.find(x => x.id === staffId || x.name === staffId);
      if (st && st.role) {
        const label = typeof staffRoleLabel === 'function' ? staffRoleLabel(st.role) : st.role;
        if (label) labels.push(label);
      }
    }
    return labels;
  }

  function flowIconTrash() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>';
  }

  function buildCardMutationsFromSettlement(s) {
    const projects = [];
    const balances = [];
    const picks = state.benefitApplied || {};
    Object.keys(picks).forEach(cardId => {
      const pick = picks[cardId];
      (pick.projects || []).forEach(pr => {
        if (pr.qty) projects.push({ cardId, key: pr.key, qty: Number(pr.qty) || 0, label: pr.label || '' });
      });
    });
    (s.balanceLines || []).forEach(line => {
      if (!(line.amount > 0)) return;
      balances.push({
        cardId: line.cardId || null,
        card: line.card || '',
        amount: round2(line.amount),
      });
    });
    return { projects, balances };
  }

  function restoreCardsFromFlowMutations(o) {
    if (!o || !o.customerId || !o.cardMutations) return false;
    const c = CUSTOMERS.find(x => x.id === o.customerId);
    if (!c || !c.cards) return false;
    let changed = false;
    (o.cardMutations.projects || []).forEach(pr => {
      let card = c.cards.find(x => x.id === pr.cardId);
      let slot = card && (card.projects || []).find(p => p.key === pr.key);
      if (!slot) {
        for (let i = 0; i < c.cards.length; i++) {
          const hit = (c.cards[i].projects || []).find(p => p.key === pr.key || p.name === pr.label);
          if (hit) { card = c.cards[i]; slot = hit; break; }
        }
      }
      if (!slot) return;
      slot.remain = Math.max(0, (Number(slot.remain) || 0) + (Number(pr.qty) || 0));
      changed = true;
    });
    (o.cardMutations.balances || []).forEach(line => {
      const card = c.cards.find(x => (line.cardId && x.id === line.cardId) || x.name === line.card);
      if (!card || !(line.amount > 0)) return;
      card.balance = round2((Number(card.balance) || 0) + line.amount);
      changed = true;
    });
    if (changed) syncMemberCardsFromHoldings(o.customerId);
    return changed;
  }

  function recordFlowOrderFromSettlement(s) {
    const c = getCustomer();
    const chMap = {
      alipay: '支付宝', wechat: '微信', meituan: '美团', dianping: '大众点评',
      douyin: '抖音', koubei: '口碑', cash: '现金', bank: '银行卡', membercard: '会员卡',
    };
    const splits = (s.paySplits || []).filter(p => p.amount > 0);
    const cashLike = splits.filter(p => p.id !== 'membercard');
    const payMethod = cashLike.length
      ? (chMap[cashLike[0].id] || cashLike[0].id)
      : (splits.length ? (chMap[splits[0].id] || splits[0].id) : (chMap[state.payChannel] || state.payChannel || '现金'));
    const paid = splits.length
      ? round2(splits.reduce((a, p) => a + p.amount, 0))
      : round2(Number(s.dueCash) || 0);
    const payments = splits.length
      ? splits.map(p => ({ method: chMap[p.id] || p.id, amount: round2(p.amount) }))
      : [{ method: payMethod, amount: paid }];
    const pool = getStaffPool();
    const cartItems = (state.cart || []).map((line, i) => {
      const isQuick = isQuickCartItem(line);
      const prodHit = !isQuick && (PRODUCTS || []).find(p => p.id === line.id || p.name === line.name);
      const isProduct = !!(prodHit || line.kind === 'product' || line.type === 'product');
      const staffIds = Array.isArray(line.staffIds) ? line.staffIds.slice() : [];
      const staffRoles = {};
      staffIds.forEach(sid => {
        if (line.staffRoles && line.staffRoles[sid]) staffRoles[sid] = line.staffRoles[sid];
      });
      return {
        id: `fi-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        name: line.name || (isQuick ? '直接收款' : (isProduct ? '产品' : '项目')),
        price: round2(Number(line.unitPrice != null ? line.unitPrice : line.price) || 0),
        type: isQuick ? 'quick' : (isProduct ? 'product' : 'project'),
        qty: Number(line.qty) || 1,
        spec: (prodHit && prodHit.spec) || line.spec || '',
        staffIds,
        staffRoles,
      };
    });
    const items = cartItems.length
      ? cartItems
      : [{ name: '开单消费', price: paid, type: 'project', qty: 1, staffIds: [] }];
    const kind = flowKindFromItems(items);
    const defaultStaff = (STAFFS[0] && STAFFS[0].name) || '林屿森';
    const cashierStaff = getCashierStaff();
    const cashierName = (cashierStaff && cashierStaff.name) || defaultStaff;
    const lineStaffIds = [];
    items.forEach(it => (it.staffIds || []).forEach(id => {
      if (!lineStaffIds.includes(id)) lineStaffIds.push(id);
    }));
    const staffs = lineStaffIds.length
      ? lineStaffIds.map(sid => {
          const st = pool.find(x => x.id === sid);
          return {
            id: sid,
            name: st ? st.name : sid,
            achievement: 0,
            commission: 0,
          };
        })
      : [{
          id: (STAFFS[0] && STAFFS[0].id) || 'legacy-staff',
          name: state.technician && state.technician !== '未指定' ? state.technician : defaultStaff,
          achievement: paid || round2(Number(s.listTotal) || 0),
          commission: 0,
        }];
    if (staffs.length === 1) {
      staffs[0].achievement = paid || round2(Number(s.listTotal) || 0);
    }
    const discountTotal = round2((s.discountDeduct || 0) + (s.couponDeduct || 0) + (s.projectDeduct || 0) + (s.balanceDeduct || 0));
    const offerLines = [];
    (s.projectLines || []).forEach(line => {
      offerLines.push({ label: `${line.card} · ${line.label}`, amount: 0, meta: `抵扣 ×${line.qty}` });
    });
    if (s.discountDeduct > 0) offerLines.push({ label: '折扣优惠', amount: round2(s.discountDeduct) });
    if (s.couponDeduct > 0) offerLines.push({ label: '优惠券', amount: round2(s.couponDeduct) });
    (s.balanceLines || []).forEach(line => {
      offerLines.push({ label: `${line.card} · 面值抵扣`, amount: round2(line.amount) });
    });
    const isGuest = !c || isGuestCustomer(c);
    const order = {
      id: `fo-${Date.now()}`,
      flowNo: nextFlowNo(),
      customerId: isGuest ? null : c.id,
      customerName: (c && c.name) || '散客',
      avatar: (c && c.avatar) || FLOW_AVATAR_GUEST,
      status: 'done',
      kind,
      items,
      staff: staffs[0] ? staffs[0].name : defaultStaff,
      staffs,
      payMethod,
      payments,
      amount: paid,
      paidAmount: paid,
      listTotal: round2(Number(s.listTotal) || flowItemsListTotal(items)),
      achievement: staffs.reduce((a, x) => a + (Number(x.achievement) || 0), 0),
      commission: staffs.reduce((a, x) => a + (Number(x.commission) || 0), 0),
      discount: discountTotal,
      benefitLabel: (s.projectDeduct || s.balanceDeduct) ? '会员卡权益' : (discountTotal > 0 ? '优惠' : '无卡权益'),
      offerSnapshot: {
        discountTotal,
        projectDeduct: round2(s.projectDeduct || 0),
        discountDeduct: round2(s.discountDeduct || 0),
        couponDeduct: round2(s.couponDeduct || 0),
        balanceDeduct: round2(s.balanceDeduct || 0),
        lines: offerLines,
      },
      cardMutations: buildCardMutationsFromSettlement(s),
      orderRemark: state.orderRemark || '',
      time: formatFlowTimeOnBizDate(),
      cashier: cashierName,
      cashierId: (cashierStaff && cashierStaff.id) || null,
      manualOrderNo: s.manualOrderNo || ensureManualOrderNo(),
      billBizDate: s.billBizDate || ensureBillBizDate(),
    };
    FLOW_ORDERS.unshift(order);
    state.lastFlowOrderId = order.id;
    return order;
  }

  function renderFlowList() {
    const tabs = [
      { id: 'all', label: '全部' },
      { id: 'project', label: '项目' },
      { id: 'product', label: '产品' },
      { id: 'card', label: '会员卡' },
      { id: 'void', label: '作废' },
      { id: 'refund', label: '退款' },
    ];
    const tabEl = document.getElementById('flowListTabs');
    if (tabEl) {
      tabEl.innerHTML = tabs.map(t => (
        `<button type="button" class="flow-list-tab${state.flowTab === t.id ? ' is-active' : ''}" data-flow-tab="${t.id}" role="tab" aria-selected="${state.flowTab === t.id ? 'true' : 'false'}">${escapeHtml(t.label)}</button>`
      )).join('');
      const activeTab = tabEl.querySelector('.flow-list-tab.is-active');
      if (activeTab) {
        requestAnimationFrame(() => {
          activeTab.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'auto' });
        });
      }
    }
    const list = flowOrdersByTab(state.flowTab);
    const body = document.getElementById('flowListBody');
    if (!body) return;
    if (!list.length) {
      if (state.flowTab === 'refund') {
        body.innerHTML = flowEmptyHtml('暂无退款订单', '退款成功的订单会出现在这里');
      } else if (state.flowTab === 'void') {
        body.innerHTML = flowEmptyHtml('暂无作废订单', '作废的订单会出现在这里');
      } else {
        body.innerHTML = flowEmptyHtml('暂无流水', '切换 Tab 或完成开单后可在此查看');
      }
      return;
    }
    body.innerHTML = list.map(o => {
      const item = o.items[0] || { name: '—', price: o.amount };
      const statusCls = o.status === 'void'
        ? ' is-void'
        : (o.status === 'refund'
          ? ' is-refund'
          : (o.status === 'partial_refund' ? ' is-partial-refund' : ''));
      const showAmt = Number(o.amount);
      const priceLabel = Number(item.price != null ? item.price : (o.listPrice != null ? o.listPrice : showAmt));
      const refundHint = o.status === 'partial_refund'
        ? `<div class="flow-order-card__refund-hint">已退 ¥${flowOrderTotalRefunded(o).toFixed(2)}</div>`
        : '';
      return `<button type="button" class="flow-order-card" data-flow-id="${escapeHtml(o.id)}">
        <div class="flow-order-card__head">
          <div class="flow-order-card__user">
            ${flowAvatarHtml(o)}
            <span class="flow-order-card__name">${escapeHtml(o.customerName)}</span>
          </div>
          <span class="flow-order-card__head-trail">
            <span class="flow-order-card__status${statusCls}">${escapeHtml(flowStatusLabel(o.status))}</span>
            <span class="ui-nav-chev" aria-hidden="true">${flowIconChevron()}</span>
          </span>
        </div>
        <div class="flow-order-card__item">
          ${flowTypeTagHtml(o.kind)}
          <div class="flow-order-card__item-main">
            <div class="flow-order-card__item-name">${escapeHtml(item.name)}${(o.items && o.items.length > 1) ? ` 等${o.items.length}项` : ''}</div>
            <span class="flow-order-card__staff">服务人 | ${escapeHtml(o.staff)}</span>
            ${refundHint}
          </div>
          <div class="flow-order-card__price"><span class="yen">¥</span>${priceLabel.toFixed(2)}</div>
        </div>
        <div class="flow-order-card__pay">
          <span>${escapeHtml(o.payMethod)}</span>
          <span class="flow-order-card__pay-amt">-¥${showAmt.toFixed(2)}</span>
        </div>
        <div class="flow-order-card__total">实付总额<span class="num"><span class="yen">¥</span>${showAmt.toFixed(2)}</span></div>
        <div class="flow-order-card__foot">
          <span>开单时间</span>
          <span>${escapeHtml(o.time)}</span>
        </div>
      </button>`;
    }).join('');
  }

  function renderFlowDetail() {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId) || FLOW_ORDERS[0];
    const body = document.getElementById('flowDetailBody');
    const foot = document.getElementById('flowDetailFoot');
    if (!o || !body) return;
    const item = o.items[0] || { name: '—', price: o.amount };
    const expandLabel = state.flowDetailExpanded ? '收起' : '展开';
    const expandIcon = state.flowDetailExpanded ? flowIconChevronUp() : flowIconChevronDown();
    const payAmt = flowOrderPaidAmount(o);
    const estimatedDue = flowOrderEstimatedDue(o);
    const gap = flowOrderGap(o);
    const itemPrice = Number(item.price != null ? item.price : (o.listPrice != null ? o.listPrice : payAmt));
    const ach = Number(o.achievement != null ? o.achievement : itemPrice);
    const comm = Number(o.commission || 0);
    const payLines = flowPaymentsOf(o);
    const payRowsHtml = payLines.map(p => `
        <div class="flow-detail-pay-row"><span>${escapeHtml(p.method)}</span><span class="flow-detail-pay-amt"><span class="yen">¥</span>${Number(p.amount).toFixed(2)}</span></div>`
    ).join('');
    const itemsHtml = (o.items && o.items.length ? o.items : [item]).map(it => {
      const kind = it.type === 'product' ? 'product' : (it.type === 'card' ? 'card' : (it.type === 'quick' ? 'quick' : (it.type === 'group' || it.type === 'tuangou' ? 'group' : (o.kind || 'project'))));
      const price = Number(it.price != null ? it.price : 0);
      const staffPills = flowStaffPillsHtml(it);
      return `<div class="flow-detail-item-row" style="margin-bottom:12px">
          ${flowTypeTagHtml(kind)}
          <div style="flex:1;min-width:0">
            <div class="flow-detail-item-name">${escapeHtml(it.name)}</div>
            <div class="flow-detail-item-price"><span class="yen">¥</span>${price.toFixed(2)}${it.qty > 1 ? ` · ×${it.qty}` : ''}</div>
            ${staffPills || '<div class="flow-detail-item-staff" style="color:var(--text-sec);font-size:12px;margin-top:6px">未指定员工</div>'}
          </div>
        </div>`;
    }).join('');
    const staffs = Array.isArray(o.staffs) && o.staffs.length
      ? o.staffs
      : flowAggregateStaffsFromItems(o.items, [{ name: o.staff, achievement: ach, commission: comm }]);
    const staffBlockHtml = staffs.map(st => {
      const sid = st.id || st.name;
      const roles = flowStaffRoleLabelsForOrder(o, sid);
      return `
        <div class="flow-edit-staff-row" style="padding:12px 0">
          ${flowStaffPillsForOrderStaff(o, st)}
          <div class="flow-detail-meta__row" style="padding:8px 0 0"><span>工位</span><span class="flow-detail-meta__val">${escapeHtml(roles.length ? roles.join(' / ') : '未设置')}</span></div>
          <div class="flow-detail-meta__row" style="padding:4px 0"><span>业绩</span><span class="flow-detail-meta__val flow-detail-meta__val--num">${Number(st.achievement || 0).toFixed(2)}</span></div>
          <div class="flow-detail-meta__row" style="padding:4px 0"><span>提成</span><span class="flow-detail-meta__val flow-detail-meta__val--num">${Number(st.commission || 0).toFixed(2)}</span></div>
        </div>`;
    }).join('') || `<div class="flow-edit-item__meta-line" style="padding:4px 0">暂无服务员工</div>`;
    const staffLineHtml = '';
    const remarkRow = `<div class="flow-detail-meta__row"><span>备注</span><span class="flow-detail-meta__val">${o.orderRemark ? escapeHtml(o.orderRemark) : '无'}</span></div>`;
    const remarkEditBtn = o.status === 'done'
      ? `<button type="button" class="flow-detail-edit__link" data-flow-remark style="margin-top:8px">${o.orderRemark ? '修改备注' : '补录备注'}<span class="flow-detail-edit__link-ico" aria-hidden="true">${flowIconChevron()}</span></button>`
      : '';
    const meta = state.flowDetailExpanded ? `
      <div class="flow-detail-meta">
        <div class="flow-detail-meta__row"><span>开单人</span><span class="flow-detail-meta__val">${escapeHtml(o.cashier || o.staff || '—')}</span></div>
        <div class="flow-detail-meta__row"><span>开单时间</span><span class="flow-detail-meta__val">${escapeHtml(o.time)}</span></div>
        <div class="flow-detail-meta__row"><span>流水单号</span><span class="flow-detail-meta__val flow-detail-meta__val--num">${escapeHtml(o.flowNo)}</span></div>
        ${o.manualOrderNo ? `<div class="flow-detail-meta__row"><span>手工单号</span><span class="flow-detail-meta__val flow-detail-meta__val--num">${escapeHtml(o.manualOrderNo)}</span></div>` : ''}
        ${o.billBizDate ? `<div class="flow-detail-meta__row"><span>开单日期</span><span class="flow-detail-meta__val">${escapeHtml(formatBillDateLabel(o.billBizDate))}</span></div>` : ''}
        ${remarkRow}
        ${remarkEditBtn}
      </div>` : '';
    const offerLines = (o.offerSnapshot && o.offerSnapshot.lines && o.offerSnapshot.lines.length)
      ? o.offerSnapshot.lines
      : (Number(o.discount) > 0 ? [{ label: o.benefitLabel || '优惠', amount: Number(o.discount) }] : []);
    const offerHtml = offerLines.length
      ? offerLines.map(line => `
          <div class="flow-detail-offer-row">
            <span>${escapeHtml(line.label)}${line.meta ? ` · ${escapeHtml(line.meta)}` : ''}</span>
            <span>${line.amount > 0 ? `-¥${Number(line.amount).toFixed(2)}` : (line.meta ? '' : '—')}</span>
          </div>`).join('')
      : `<div class="flow-detail-offer-row"><span>无优惠</span><span>—</span></div>`;
    const gapHtml = (o.status === 'done' && Math.abs(gap) >= 0.01)
      ? `<div class="flow-detail-gap">
          预估应付 ¥${estimatedDue.toFixed(2)}，原实付 ¥${payAmt.toFixed(2)}，差额 ¥${Math.abs(gap).toFixed(2)}（${gap > 0 ? '少收' : '多收'}）。请走补收/退差。
          <div class="flow-detail-gap__actions">
            ${gap > 0
              ? '<button type="button" class="btn-main" data-flow-diff="collect">补收差价</button>'
              : '<button type="button" class="btn-main" data-flow-diff="refund">退还差价</button>'}
            <button type="button" class="btn-soft" data-flow-more>更多</button>
          </div>
        </div>`
      : '';
    const allBtn = state.flowFromSuccess
      ? '<button type="button" class="flow-detail-all" data-flow-all>查看全部流水</button>'
      : '';
    const canEdit = flowCanEditOrder(o);
    const canRefundOrVoid = flowCanRefundOrVoid(o);
    const refundedTotal = flowOrderTotalRefunded(o);
    const remainRefundable = round2(
      (o.items || []).reduce((s, _, i) => s + flowItemRemainingRefundable(o, i), 0)
    );
    const partialBanner = (o.status === 'partial_refund' && refundedTotal >= 0.01)
      ? `<div class="flow-detail-partial-banner">
          部分退款 · 已退 ¥${refundedTotal.toFixed(2)} · 还可退 ¥${remainRefundable.toFixed(2)}
        </div>`
      : '';
    body.innerHTML = `
      ${allBtn}
      ${partialBanner}
      ${gapHtml}
      <div class="flow-detail-card">
        <div class="flow-detail-user">
          <div class="flow-detail-user__left">
            ${flowAvatarHtml(o)}
            <strong>${escapeHtml(o.customerName)}</strong>
            ${o.status !== 'done' ? `<span class="flow-detail-status-pill${o.status === 'refund' ? ' is-refund' : (o.status === 'partial_refund' ? ' is-partial-refund' : (o.status === 'void' ? ' is-void' : ''))}">${escapeHtml(flowStatusLabel(o.status))}</span>` : ''}
          </div>
          <button type="button" class="flow-detail-expand" data-flow-expand>${expandLabel}${expandIcon}</button>
        </div>
        ${meta}
      </div>
      <div class="flow-detail-card">
        <div class="flow-detail-card__title">消费内容</div>
        ${itemsHtml}
        <div class="flow-detail-benefit">
          <div class="flow-detail-benefit__label">优惠明细</div>
          ${offerHtml}
          <div class="flow-detail-due"><span>预估应付</span><span class="amt"><span class="yen">¥</span>${estimatedDue.toFixed(2)}</span></div>
        </div>
        ${staffLineHtml}
      </div>
      <div class="flow-detail-card">
        <div class="flow-detail-card__title">业绩提成</div>
        ${staffBlockHtml}
      </div>
      ${canEdit ? `<div class="flow-detail-card">
        <div class="flow-detail-edit">
          <div class="flow-detail-edit__main">
            <div class="flow-detail-edit__title">修改订单</div>
            <div class="flow-detail-edit__hint">先调整项目，再为项目设置服务人与业绩${o.lastEditedAt ? ` · 上次 ${escapeHtml(o.lastEditedAt)}` : ''}</div>
            <button type="button" class="flow-detail-edit__link" data-flow-edit-log>
              修改记录${(o.editLogs && o.editLogs.length) ? ` · ${o.editLogs.length}` : ''}
              <span class="flow-detail-edit__link-ico" aria-hidden="true">${flowIconChevron()}</span>
            </button>
          </div>
          <button type="button" class="flow-detail-edit__btn" data-flow-edit>修改</button>
        </div>
      </div>` : ''}
      ${flowOrderRefunds(o).length ? `<div class="flow-detail-card">
        <button type="button" class="flow-detail-edit__link flow-detail-refund-log-entry" data-flow-refund-log>
          退款记录 · ${flowOrderRefunds(o).length} 笔 · 已退 ¥${refundedTotal.toFixed(2)}
          <span class="flow-detail-edit__link-ico" aria-hidden="true">${flowIconChevron()}</span>
        </button>
      </div>` : ''}
      <div class="flow-detail-card">
        <div class="flow-detail-card__title">支付信息</div>
        ${payRowsHtml}
        <div class="flow-detail-pay-row flow-detail-pay-row--strong"><span>实付（锁定）</span><span class="flow-detail-pay-amt"><span class="yen">¥</span>${payAmt.toFixed(2)}</span></div>
      </div>`;
    if (foot) {
      if (!canRefundOrVoid) {
        foot.innerHTML = `
          <div class="flow-detail-foot__main">
            <div class="flow-detail-foot__total">
              <div class="flow-detail-foot__label">实付总额</div>
              <div class="flow-detail-foot__amt"><span class="yen">¥</span>${payAmt.toFixed(2)}</div>
            </div>
            <button type="button" class="btn-void" disabled style="opacity:.5">${escapeHtml(flowStatusLabel(o.status))}</button>
          </div>
          <div class="flow-detail-foot__safe" aria-hidden="true"></div>`;
      } else {
        foot.innerHTML = `
          <div class="flow-detail-foot__tip">
            ${flowIconInfo()}
            <span class="flow-detail-foot__tip-text">${o.status === 'partial_refund' ? '还可继续退剩余款项；单子开错可作废' : '客户退钱点退款；单子开错点作废；项目差额走补收/退差'}</span>
          </div>
          <div class="flow-detail-foot__main">
            <div class="flow-detail-foot__total">
              <div class="flow-detail-foot__label">实付总额</div>
              <div class="flow-detail-foot__amt"><span class="yen">¥</span>${payAmt.toFixed(2)}</div>
            </div>
            <button type="button" class="btn-soft" data-flow-refund>申请退款</button>
            <button type="button" class="btn-void" data-flow-void>订单作废</button>
          </div>
          <div class="flow-detail-foot__safe" aria-hidden="true"></div>`;
      }
    }
  }

  function openFlowHub() {
    openFlowList();
  }

  function openFlowList() {
    state.flowFromSuccess = false;
    if (!state.flowTab) state.flowTab = 'all';
    renderFlowList();
    showOnlyScreen('screen-flow-list');
  }

  function openFlowDetail(id, opts) {
    let order = id ? FLOW_ORDERS.find(x => x.id === id) : null;
    if (!order && opts && opts.fromSuccess && state.lastFlowOrderId) {
      order = FLOW_ORDERS.find(x => x.id === state.lastFlowOrderId) || null;
    }
    if (!order) order = FLOW_ORDERS[0];
    if (!order) {
      showToast('暂无流水');
      openFlowList();
      return;
    }
    state.flowDetailId = order.id;
    state.flowDetailExpanded = false;
    state.flowFromSuccess = !!(opts && opts.fromSuccess);
    renderFlowDetail();
    showOnlyScreen('screen-flow-detail');
  }


  function renderFlowFilterSheet() {
    const draft = state.flowFilterDraft || Object.assign({}, state.flowFilter);
    state.flowFilterDraft = draft;
    const body = document.getElementById('flowFilterBody');
    if (!body) return;
    const dateOpts = [
      { id: 'all', label: '全部日期' },
      { id: 'today', label: '今日' },
      { id: 'yesterday', label: '昨天' },
      { id: '7d', label: '近7日' },
      { id: '30d', label: '近30日' },
      { id: 'custom', label: '自定义' },
    ];
    const payOpts = [
      { id: 'all', label: '全部' },
      { id: '现金', label: '现金' },
      { id: '微信', label: '微信' },
      { id: '支付宝', label: '支付宝' },
      { id: '会员卡', label: '会员卡' },
    ];
    const guestOpts = [
      { id: 'all', label: '全部顾客' },
      { id: 'guest', label: '散客' },
      { id: 'member', label: '会员' },
    ];
    const chips = (key, opts) => opts.map(o =>
      `<button type="button" class="flow-chip${draft[key] === o.id ? ' is-on' : ''}" data-flow-filter-key="${key}" data-flow-filter-val="${escapeHtml(o.id)}">${escapeHtml(o.label)}</button>`
    ).join('');
    const customOn = draft.date === 'custom';
    const startLab = draft.customStart ? flowFmtDotFromKey(draft.customStart) : '开始日期';
    const endLab = draft.customEnd ? flowFmtDotFromKey(draft.customEnd) : '结束日期';
    body.innerHTML = `
      <div class="flow-filter-section">
        <div class="flow-filter-section__title">日期</div>
        <div class="flow-chip-row">${chips('date', dateOpts)}</div>
        ${customOn ? `<div class="flow-filter-custom">
          <button type="button" class="flow-filter-custom__btn${draft.customStart ? ' is-on' : ''}" data-flow-filter-range="1">${escapeHtml(startLab)}</button>
          <span class="flow-filter-custom__sep">至</span>
          <button type="button" class="flow-filter-custom__btn${draft.customEnd ? ' is-on' : ''}" data-flow-filter-range="1">${escapeHtml(endLab)}</button>
        </div>` : ''}
      </div>
      <div class="flow-filter-section">
        <div class="flow-filter-section__title">支付方式</div>
        <div class="flow-chip-row">${chips('pay', payOpts)}</div>
      </div>
      <div class="flow-filter-section">
        <div class="flow-filter-section__title">顾客类型</div>
        <div class="flow-chip-row">${chips('guest', guestOpts)}</div>
      </div>`;
  }

  function openFlowFilter() {
    state.flowFilterDraft = Object.assign({ customStart: '', customEnd: '' }, state.flowFilter || { date: 'all', pay: 'all', guest: 'all' });
    renderFlowFilterSheet();
    openMask('flowFilterMask');
  }

  function openFlowVoidDialog() {
    document.getElementById('flowVoidMask')?.classList.add('open');
  }

  function closeFlowVoidDialog() {
    document.getElementById('flowVoidMask')?.classList.remove('open');
  }

  function confirmFlowVoid() {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    if (!o) return;
    const restored = restoreCardsFromFlowMutations(o);
    o.status = 'void';
    o.voidedAt = formatFlowTimeOnBizDate();
    closeFlowVoidDialog();
    showToast(restored ? '订单已作废，会员卡额度已恢复' : '订单已作废');
    state.flowTab = 'void';
    openFlowList();
  }

  function openFlowMore() {
    openMask('flowMoreMask');
  }

  function renderFlowRefund() {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    const body = document.getElementById('flowRefundBody');
    const foot = document.getElementById('flowRefundFoot');
    if (!o || !body) return;
    const refundable = flowRefundableItemIndices(o);
    if (!refundable.length) {
      body.innerHTML = flowEmptyHtml('无可退项目', '该订单已全部退款');
      if (foot) foot.innerHTML = '';
      return;
    }
    if (!Array.isArray(state.flowRefundSelected)) state.flowRefundSelected = refundable.slice();
    state.flowRefundSelected = state.flowRefundSelected.filter((i) => refundable.includes(i));
    const selected = new Set(state.flowRefundSelected);
    const allOn = refundable.length > 0 && refundable.every((i) => selected.has(i));
    body.innerHTML = `
      <div class="flow-refund-toolbar">
        <span>已选 ${selected.size}/${refundable.length} 项</span>
        <button type="button" data-flow-refund-all>${allOn ? '取消全选' : '全选'}</button>
      </div>
      ${o.items.map((it, i) => {
        const remain = flowItemRemainingRefundable(o, i);
        if (remain < 0.01) return '';
        const refunded = flowItemRefundedAmount(o, i);
        return `<button type="button" class="flow-refund-item${selected.has(i) ? ' is-on' : ''}" data-flow-refund-idx="${i}">
          <span class="flow-refund-item__check" aria-hidden="true">${selected.has(i) ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>' : ''}</span>
          <div class="flow-refund-item__main">
            <div class="flow-refund-item__name">${escapeHtml(it.name)}</div>
            <div class="flow-refund-item__meta">×${it.qty || 1}${refunded > 0 ? ` · 已退 ¥${refunded.toFixed(2)}` : ''}</div>
          </div>
          <div class="flow-refund-item__price"><span class="yen">¥</span>${remain.toFixed(2)}</div>
        </button>`;
      }).join('')}`;
    const sum = o.items.reduce((s, it, i) => selected.has(i) ? s + flowItemRemainingRefundable(o, i) : s, 0);
    if (foot) {
      foot.innerHTML = `
        <div class="flow-screen-foot__main">
          <div class="flow-detail-foot__total">
            <div class="flow-detail-foot__label">退款金额</div>
            <div class="flow-detail-foot__amt"><span class="yen">¥</span>${sum.toFixed(2)}</div>
          </div>
          <button type="button" class="btn-main" data-flow-refund-confirm ${selected.size ? '' : 'disabled style="opacity:.5"'}>确认退款</button>
        </div>
        <div class="flow-screen-foot__safe" aria-hidden="true"></div>`;
    }
  }

  function openFlowRefund() {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    if (!flowCanRefundOrVoid(o)) {
      showToast('当前订单不可退款', true);
      return;
    }
    if (!flowRefundableItemIndices(o).length) {
      showToast('无可退项目', true);
      return;
    }
    closeMask('flowMoreMask');
    state.flowRefundSelected = flowRefundableItemIndices(o);
    state.flowRefundMode = 'original';
    state.flowRefundDesignatedChannel = '支付宝';
    renderFlowRefund();
    showOnlyScreen('screen-flow-refund');
  }

  function confirmFlowRefund() {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    if (!o || !state.flowRefundSelected.length) {
      showToast('请选择退款项', true);
      return;
    }
    const indices = state.flowRefundSelected.slice();
    const amounts = {};
    indices.forEach((idx) => {
      amounts[idx] = flowItemRemainingRefundable(o, idx);
    });
    state.flowRefundPending = { indices, amounts, remark: '' };
    const allRemain = flowRefundableItemIndices(o);
    const isFull = allRemain.length === indices.length && allRemain.every((i) => indices.includes(i));
    state.flowRefundMode = isFull ? 'original' : 'designated';
    openFlowRefundMethodSheet();
  }

  function renderFlowRefundMethodSheet() {
    const pending = state.flowRefundPending;
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    const body = document.getElementById('flowRefundMethodBody');
    if (!pending || !o || !body) return;
    const mode = state.flowRefundMode || 'original';
    const seg = document.getElementById('flowRefundSeg');
    if (seg) {
      seg.querySelectorAll('[data-flow-refund-mode]').forEach((btn) => {
        btn.classList.toggle('is-on', btn.dataset.flowRefundMode === mode);
      });
    }
    const sel = pending.indices || [];
    if (!pending.amounts) pending.amounts = {};
    const lines = sel.map((idx) => {
      const it = o.items[idx];
      const listPrice = round2(Number(it.price || 0) * (Number(it.qty) || 1));
      const paidShare = flowItemPaidShare(o, idx);
      const remain = flowItemRemainingRefundable(o, idx);
      const defAmt = mode === 'original' ? Math.min(paidShare, remain) : remain;
      const amt = pending.amounts[idx] != null ? pending.amounts[idx] : defAmt;
      pending.amounts[idx] = amt;
      const zeroBlock = paidShare < 0.01 || listPrice < 0.01;
      const editable = mode === 'designated' && !zeroBlock;
      return { idx, it, listPrice, paidShare, amt, editable, zeroBlock };
    });
    const total = round2(lines.reduce((s, ln) => s + (Number(ln.amt) || 0), 0));
    pending.total = total;
    const channels = mode === 'original' ? flowSplitRefundByOriginalChannels(o, total) : [];
    let html = '<div class="flow-refund-method-items">';
    lines.forEach((ln) => {
      html += `<div class="flow-refund-method-item">
        <div class="flow-refund-method-item__name">${escapeHtml(ln.it.name)} · ×${ln.it.qty || 1}</div>
        <div class="flow-refund-method-item__meta">原价 ¥${ln.listPrice.toFixed(2)} · 实付分摊 ¥${ln.paidShare.toFixed(2)}</div>
        ${ln.editable
          ? `<label class="flow-refund-method-amt">退款 <input type="text" inputmode="decimal" data-flow-refund-amt="${ln.idx}" value="${Number(ln.amt).toFixed(2)}" /></label>`
          : `<div class="flow-refund-method-amt is-readonly">退款 ¥${Number(ln.amt).toFixed(2)}${ln.zeroBlock && mode === 'designated' ? ' <span class="flow-refund-zero-tag">不可指定</span>' : ''}</div>`}
      </div>`;
    });
    html += '</div>';
    if (mode === 'original') {
      html += '<div class="flow-refund-method-channels"><div class="flow-refund-method-channels__title">退回渠道（按原支付比例）</div>';
      channels.forEach((c) => {
        const isCard = /会员/.test(c.method) || c.method === '会员卡';
        const label = isCard ? `${c.method}（退回卡账户）` : (/现金|微信|支付宝|银行|信用/.test(c.method) ? `${c.method}（记账退回）` : c.method);
        html += `<div class="flow-refund-method-channel-row"><span>${escapeHtml(label)}</span><span class="num">¥${Number(c.amount).toFixed(2)}</span></div>`;
      });
      html += '</div>';
    } else {
      const designatedOpts = ['支付宝', '微信', '现金', '银行卡', '信用卡'];
      const cur = state.flowRefundDesignatedChannel || designatedOpts[0];
      html += '<div class="flow-refund-designated-ch"><div class="flow-refund-method-channels__title">退款方式（记账）</div><div class="flow-refund-radio-row">';
      designatedOpts.forEach((ch) => {
        html += `<label class="flow-refund-radio"><input type="radio" name="flowRefundDesignatedCh" value="${escapeHtml(ch)}"${cur === ch ? ' checked' : ''} /><span>${escapeHtml(ch)}</span></label>`;
      });
      html += '</div></div>';
    }
    html += `<label class="flow-refund-remark">备注<textarea id="flowRefundRemarkInput" rows="3" maxlength="200" placeholder="选填">${escapeHtml(pending.remark || '')}</textarea></label>`;
    html += `<div class="flow-refund-method-total">合计退款 <strong>¥${total.toFixed(2)}</strong></div>`;
    body.innerHTML = html;
  }

  function openFlowRefundMethodSheet() {
    renderFlowRefundMethodSheet();
    openMask('flowRefundMethodMask');
  }

  function closeFlowRefundMethodSheet() {
    closeMask('flowRefundMethodMask');
  }

  function confirmFlowRefundSubmit() {
    const pending = state.flowRefundPending;
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    if (!pending || !o) return;
    const mode = state.flowRefundMode || 'original';
    const remarkEl = document.getElementById('flowRefundRemarkInput');
    const remark = remarkEl ? String(remarkEl.value || '').slice(0, 200) : (pending.remark || '');
    const indices = pending.indices || [];
    const items = [];
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      const it = o.items[idx];
      const listPrice = round2(Number(it.price || 0) * (Number(it.qty) || 1));
      const paidShare = flowItemPaidShare(o, idx);
      const remain = flowItemRemainingRefundable(o, idx);
      let refundAmount = pending.amounts && pending.amounts[idx] != null
        ? round2(pending.amounts[idx])
        : (mode === 'original' ? Math.min(paidShare, remain) : remain);
      if (mode === 'designated') {
        if (paidShare < 0.01 || listPrice < 0.01) {
          showToast('0 元项目不可指定退款', true);
          return;
        }
        if (refundAmount <= 0 || refundAmount > remain + 0.01) {
          showToast('退款金额无效', true);
          return;
        }
      }
      items.push({ itemIndex: idx, name: it.name, qty: it.qty || 1, listPrice, paidShare, refundAmount });
    }
    const totalRefund = round2(items.reduce((s, it) => s + it.refundAmount, 0));
    if (totalRefund < 0.01) {
      showToast('退款金额需大于 0', true);
      return;
    }
    let channels;
    if (mode === 'original') {
      channels = flowSplitRefundByOriginalChannels(o, totalRefund);
    } else {
      channels = [{ method: state.flowRefundDesignatedChannel || '支付宝', amount: totalRefund }];
    }
    if (!Array.isArray(o.refunds)) o.refunds = [];
    o.refunds.push({
      docType: 'refund',
      refundNo: nextRefundNo(),
      time: formatFlowTimeOnBizDate(),
      operator: o.cashier || o.staff || '—',
      mode,
      remark,
      totalRefund,
      items,
      channels,
      refundKind: 'partial',
    });
    const left = flowRefundableItemIndices(o);
    const refundKind = left.length ? 'partial' : 'full';
    o.refunds[o.refunds.length - 1].refundKind = refundKind;
    o.status = left.length ? 'partial_refund' : 'refund';
    state.flowTab = 'refund';
    closeFlowRefundMethodSheet();
    state.flowRefundPending = null;
    showToast(left.length ? `已退 ¥${totalRefund.toFixed(2)}（部分退）` : '退款已完成（全退）');
    openFlowDetail(o.id, { fromSuccess: false });
  }

  function openFlowRefundLog() {
    renderFlowRefundLog();
    showOnlyScreen('screen-flow-refund-log');
  }

  function renderFlowRefundLog() {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    const body = document.getElementById('flowRefundLogBody');
    if (!o || !body) return;
    const list = flowOrderRefunds(o);
    if (!list.length) {
      body.innerHTML = flowEmptyHtml('暂无退款记录', '退款成功后会出现在这里');
      return;
    }
    body.innerHTML = list.map((r, i) => {
      const itemTxt = (r.items || []).map((it) => `${escapeHtml(it.name)}·×${it.qty || 1}`).join('、');
      const kind = r.refundKind === 'full' ? 'full' : 'partial';
      return `<button type="button" class="flow-refund-log-card" data-flow-refund-log-idx="${i}">
        <div class="flow-refund-log-card__top">
          <span class="flow-refund-log-card__no">${escapeHtml(r.refundNo)}</span>
          <span class="flow-refund-kind-tag flow-refund-kind-tag--${kind}">${escapeHtml(flowRefundKindLabel(kind))}</span>
          <span class="flow-refund-log-card__amt">¥${Number(r.totalRefund).toFixed(2)}</span>
        </div>
        <div class="flow-refund-log-card__meta">${itemTxt || '—'} · ${escapeHtml(flowRefundModeLabel(r.mode))}</div>
        <div class="flow-refund-log-card__time">${escapeHtml(r.time)}</div>
      </button>`;
    }).join('');
  }

  function openFlowRefundLogDetail(idx) {
    state.flowRefundLogIdx = Number(idx) || 0;
    renderFlowRefundLogDetail();
    showOnlyScreen('screen-flow-refund-log-detail');
  }

  function renderFlowRefundLogDetail() {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    const body = document.getElementById('flowRefundLogDetailBody');
    if (!o || !body) return;
    const r = flowOrderRefunds(o)[state.flowRefundLogIdx];
    if (!r) {
      body.innerHTML = flowEmptyHtml('记录不存在');
      return;
    }
    const kind = r.refundKind === 'full' ? 'full' : 'partial';
    const itemRows = (r.items || []).map((it) => `
      <div class="flow-detail-meta__row"><span>${escapeHtml(it.name)}·×${it.qty || 1}</span><span class="flow-detail-meta__val">退 ¥${Number(it.refundAmount).toFixed(2)}</span></div>
      <div class="flow-detail-meta__row is-sub"><span>原价 / 实付分摊</span><span class="flow-detail-meta__val">¥${Number(it.listPrice).toFixed(2)} / ¥${Number(it.paidShare).toFixed(2)}</span></div>`).join('');
    body.innerHTML = `
      <div class="flow-detail-card">
        <div class="flow-detail-meta">
          <div class="flow-detail-meta__row"><span>退款单号</span><span class="flow-detail-meta__val flow-detail-meta__val--num">${escapeHtml(r.refundNo)}</span></div>
          <div class="flow-detail-meta__row"><span>退款类型</span><span class="flow-detail-meta__val"><span class="flow-refund-kind-tag flow-refund-kind-tag--${kind}">${escapeHtml(flowRefundKindLabel(kind))}</span></span></div>
          <div class="flow-detail-meta__row"><span>退款时间</span><span class="flow-detail-meta__val">${escapeHtml(r.time)}</span></div>
          <div class="flow-detail-meta__row"><span>操作员工</span><span class="flow-detail-meta__val">${escapeHtml(r.operator || '—')}</span></div>
          <div class="flow-detail-meta__row"><span>退回方式</span><span class="flow-detail-meta__val">${escapeHtml(flowRefundModeLabel(r.mode))} · ${escapeHtml(flowFormatRefundChannels(r))}</span></div>
          <div class="flow-detail-meta__row"><span>退款金额</span><span class="flow-detail-meta__val flow-detail-meta__val--num">¥${Number(r.totalRefund).toFixed(2)}</span></div>
          ${r.remark ? `<div class="flow-detail-meta__row"><span>备注</span><span class="flow-detail-meta__val">${escapeHtml(r.remark)}</span></div>` : ''}
        </div>
      </div>
      <div class="flow-detail-card"><div class="flow-detail-card__title">退款项</div>${itemRows}</div>`;
  }

  /** 草稿条目类型归一（project / product / card / quick），标签与文案共用 */
  function flowEditItemKind(it) {
    if (!it) return 'project';
    if (it.type === 'card') return 'card';
    if (it.type === 'product') return 'product';
    if (it.type === 'quick') return 'quick';
    if (it.type === 'group' || it.type === 'tuangou') return 'group';
    return 'project';
  }

  /** 会员卡条目的副行文案：办卡「面值 ¥2500 · 赠送 ¥500」，充卡「储值卡 · 卡名」 */
  function flowEditCardItemMeta(it) {
    if (!it || it.type !== 'card') return '';
    if (it.cardKind === 'recharge') {
      return it.cardName ? `储值卡 · ${escapeHtml(it.cardName)}` : '储值卡充值';
    }
    const bits = [];
    const face = Number(it.cardFace || 0);
    const gift = Number(it.cardGift || 0);
    if (face > 0) bits.push(`面值 ¥${face.toFixed(2)}`);
    if (gift > 0) bits.push(`赠送 ¥${gift.toFixed(2)}`);
    return bits.join(' · ');
  }

  const flowEditCheckSvg = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';

  function renderFlowEdit() {
    ensureFlowEditDraft();
    const d = state.flowEditDraft;
    const body = document.getElementById('flowEditBody');
    const foot = document.getElementById('flowEditFoot');
    if (!d || !body) return;
    body.innerHTML = `
      <div class="flow-detail-card">
        <div class="flow-detail-card__title">订单项目</div>
        <p class="flow-edit-item__meta-line" style="padding:0 0 10px;margin:0">点进项目可设置服务员工、工位与提成</p>
        ${d.items.map(it => {
          const staffPills = flowStaffPillsHtml(it);
          const specBit = it.type === 'product' && it.spec ? `${escapeHtml(it.spec)} · ` : '';
          const cardBit = flowEditCardItemMeta(it);
          const noStaffHint = it.type === 'product' || it.type === 'card'
            ? '未指定销售员工 · 点此设置'
            : '未指定员工 · 点此设置';
          return `<div class="flow-edit-item-wrap">
            <button type="button" class="flow-edit-item" data-flow-edit-item="${escapeHtml(it.id)}">
              ${flowTypeTagHtml(flowEditItemKind(it))}
              <div class="flow-edit-item__main">
                <div class="flow-refund-item__name">${escapeHtml(it.name)}</div>
                <div class="flow-edit-item__meta-line">${specBit}×${it.qty || 1}</div>
                ${cardBit ? `<div class="flow-edit-item__meta-line">${cardBit}</div>` : ''}
                ${staffPills || `<div class="flow-edit-item__meta-line is-empty">${noStaffHint}</div>`}
              </div>
              <div class="flow-edit-item__side">
                <div class="flow-refund-item__price"><span class="yen">¥</span>${Number(it.price || 0).toFixed(2)}</div>
              </div>
              <span class="flow-edit-item__edit" aria-hidden="true">${flowIconEditSquare()}<span>编辑</span></span>
            </button>
            <button type="button" class="flow-edit-item__del" data-flow-edit-item-del="${escapeHtml(it.id)}" aria-label="删除项目">${flowIconTrash()}</button>
          </div>`;
        }).join('')}
        <button type="button" class="btn-add-benefit btn-add-benefit--block" data-flow-edit-add>+ 添加项</button>
      </div>`;
    if (foot) {
      const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
      const paid = flowOrderPaidAmount(o);
      const estimated = flowOrderEstimatedDue(o, d.items);
      foot.innerHTML = `
        <div class="flow-edit-bar__amt">
          <div class="flow-edit-bar__line flow-edit-bar__line--due"><span class="l">改后实付</span><span class="v">¥${estimated.toFixed(2)}</span></div>
          <div class="flow-edit-bar__line flow-edit-bar__line--was"><span class="l">原实付</span><span class="v">¥${paid.toFixed(2)}</span></div>
        </div>
        <div class="flow-edit-bar__btns">
          <button type="button" class="flow-edit-bar__btn flow-edit-bar__btn--g" data-flow-edit-cancel>取消</button>
          <button type="button" class="flow-edit-bar__btn flow-edit-bar__btn--c" data-flow-edit-save>保存修改</button>
        </div>`;
    }
  }

  function flowResolveItemType(it, orderKind) {
    if (it && it.type === 'product') return 'product';
    if (it && it.type === 'card') return 'card';
    if (it && it.type === 'project') return 'project';
    if (orderKind === 'product') return 'product';
    if (orderKind === 'card') return 'card';
    return 'project';
  }

  function flowNormalizeEditItems(items, orderKind, orderStaffs) {
    const orderStaffMap = new Map((orderStaffs || []).map(s => [s.id || s.name, s]));
    return (items || []).map((it, i) => {
      const type = flowResolveItemType(it, orderKind);
      let spec = it.spec || '';
      if (type === 'product' && !spec) {
        const hit = (PRODUCTS || []).find(p => p.name === it.name);
        if (hit && hit.spec) spec = hit.spec;
      }
      const staffIds = Array.isArray(it.staffIds) ? it.staffIds.slice() : [];
      const staffRoles = it.staffRoles ? Object.assign({}, it.staffRoles) : {};
      const staffAchievements = it.staffAchievements ? Object.assign({}, it.staffAchievements) : {};
      const staffCommissions = it.staffCommissions ? Object.assign({}, it.staffCommissions) : {};
      staffIds.forEach(sid => {
        if (!staffRoles[sid] && orderStaffMap.get(sid) && orderStaffMap.get(sid).role) {
          staffRoles[sid] = orderStaffMap.get(sid).role;
        }
        if (staffAchievements[sid] == null && orderStaffMap.get(sid) && staffIds.length === 1) {
          staffAchievements[sid] = Number(orderStaffMap.get(sid).achievement) || 0;
        }
        if (staffCommissions[sid] == null && orderStaffMap.get(sid) && staffIds.length === 1) {
          staffCommissions[sid] = Number(orderStaffMap.get(sid).commission) || 0;
        }
        if (staffAchievements[sid] == null) staffAchievements[sid] = 0;
        if (staffCommissions[sid] == null) staffCommissions[sid] = 0;
      });
      return {
        id: it.id || (`fi-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`),
        name: it.name || '—',
        price: Number(it.price) || 0,
        qty: Math.max(1, Number(it.qty) || 1),
        type,
        spec,
        staffIds,
        staffRoles,
        staffAchievements,
        staffCommissions,
      };
    });
  }

  function flowStaffsFromOrder(o) {
    if (Array.isArray(o.staffs) && o.staffs.length) {
      return o.staffs.map(s => ({
        id: s.id || s.name,
        name: s.name || '员工',
        role: s.role || null,
        achievement: Number(s.achievement) || 0,
        commission: Number(s.commission) || 0,
      }));
    }
    return flowAggregateStaffsFromItems(o.items, [{
      id: 'legacy-staff',
      name: o.staff || '未指定',
      achievement: Number(o.achievement != null ? o.achievement : o.amount) || 0,
      commission: Number(o.commission) || 0,
    }]);
  }

  function ensureFlowEditDraft() {
    if (state.flowEditDraft) return state.flowEditDraft;
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    if (!o) return null;
    const staffs = flowStaffsFromOrder(o);
    state.flowEditDraft = {
      items: flowNormalizeEditItems(o.items, o.kind, staffs),
      staffs,
    };
    return state.flowEditDraft;
  }

  function openFlowEdit() {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    if (!o || o.status !== 'done') {
      showToast('当前订单不可修改', true);
      return;
    }
    state.flowEditDraft = null;
    ensureFlowEditDraft();
    renderFlowEdit();
    showOnlyScreen('screen-flow-edit');
  }

  function openFlowEditAdd() {
    ensureFlowEditDraft();
    state.flowEditReplaceItemId = null;
    state.flowEditAddTab = 'project';
    state.flowEditAddSelected = [];
    resetFlowEditCardPick();
    renderFlowEditAdd();
    showOnlyScreen('screen-flow-edit-add');
  }

  function openFlowEditReplaceCatalog() {
    const it = getFlowEditItem();
    if (!it) return;
    ensureFlowEditDraft();
    state.flowEditReplaceItemId = it.id;
    state.flowEditAddTab = it.type === 'product' ? 'product' : (it.type === 'card' ? 'card' : 'project');
    state.flowEditAddSelected = [];
    resetFlowEditCardPick();
    renderFlowEditAdd();
    showOnlyScreen('screen-flow-edit-add');
  }

  /** 办卡 / 充卡 的选择态复位（切 Tab、切段、进页时调用） */
  function resetFlowEditCardPick() {
    state.flowEditAddCardSeg = 'issue';
    state.flowEditAddCardId = null;
    state.flowEditAddCardTpls = [];
    state.flowEditAddAmount = 1000;
  }

  /** 本单顾客（散客返回 null）与名下会员卡 —— 会员卡 Tab 的办卡 / 充卡数据源 */
  function flowEditCustomer() {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    if (!o || !o.customerId) return null;
    return CUSTOMERS.find(c => c.id === o.customerId) || null;
  }

  function flowEditCustomerCards() {
    const c = flowEditCustomer();
    if (!c) return [];
    const live = Array.isArray(c.cards) ? c.cards : [];
    if (live.length) return live;
    /* 本页接入了持卡账本时以账本为准；未接入（CardHost 缺席）时退回载入快照，保证「充卡」能选到顾客已有卡 */
    const hasLedger = !!(window.CardHost && typeof window.CardHost.getMemberCards === 'function');
    return hasLedger ? live : (CUSTOMER_SEED_CARDS[c.id] || []);
  }

  const FLOW_EDIT_RECHARGE_AMOUNTS = [500, 1000, 2000, 5000];

  /** 会员卡 Tab 内容：办卡（选卡模板 + 面值/赠送） / 充卡（顾客卡 + 储值金额） */
  function flowEditAddCardHtml(seg) {
    const tplPicked = new Set(state.flowEditAddCardTpls || []);
    const segHtml = `
      <div class="flow-edit-subseg" role="group" aria-label="办卡或充卡">
        <button type="button" class="flow-edit-subseg__btn${seg === 'issue' ? ' is-on' : ''}" data-flow-edit-add-cardseg="issue">办卡</button>
        <button type="button" class="flow-edit-subseg__btn${seg === 'recharge' ? ' is-on' : ''}" data-flow-edit-add-cardseg="recharge">充卡</button>
      </div>`;
    const cust = flowEditCustomer();
    /* 散客订单：与开单2.0 同口径「需先选择会员顾客再办卡」 */
    if (!cust) {
      return segHtml + `<div class="flow-edit-add-note">该订单为散客，需先为顾客办卡并选择会员顾客后，才能办卡或充卡。</div>`;
    }
    if (seg === 'issue') {
      return segHtml + `<div class="flow-edit-add-sub">选择卡模板（可多选，金额为办卡实付）</div>` +
        CARD_TEMPLATES.map(tpl => {
          const on = tplPicked.has(tpl.id);
          const bits = [];
          const face = Number(tpl.face || 0);
          const gift = Number(tpl.giftAmount || 0);
          if (face > 0) bits.push(`面值 ¥${face.toFixed(2)}`);
          if (gift > 0) bits.push(`赠送 ¥${gift.toFixed(2)}`);
          if (tpl.validity) bits.push(tpl.validity);
          return `<button type="button" class="flow-edit-pick-item${on ? ' is-on' : ''}" data-flow-edit-pick-card="${escapeHtml(tpl.id)}">
            <span class="flow-edit-pick-item__check" aria-hidden="true">${on ? flowEditCheckSvg : ''}</span>
            <div class="flow-refund-item__main">
              <div class="flow-refund-item__name">${escapeHtml(tpl.name)}</div>
              <div class="flow-refund-item__meta">${bits.map(escapeHtml).join(' · ')}</div>
            </div>
            <div class="flow-refund-item__price"><span class="yen">¥</span>${Number(tpl.price || 0).toFixed(2)}</div>
          </button>`;
        }).join('');
    }
    const cards = flowEditCustomerCards();
    const amount = Number(state.flowEditAddAmount) || 0;
    const isPreset = FLOW_EDIT_RECHARGE_AMOUNTS.indexOf(amount) >= 0;
    const chipHtml = FLOW_EDIT_RECHARGE_AMOUNTS.map(v =>
      `<button type="button" class="flow-edit-amount-chip${amount === v ? ' is-on' : ''}" data-flow-edit-add-amount="${v}">¥${v}</button>`
    ).join('');
    const cardRows = cards.length
      ? cards.map(c => {
          const on = state.flowEditAddCardId === c.id;
          return `<button type="button" class="flow-edit-pick-item${on ? ' is-on' : ''}" data-flow-edit-add-card="${escapeHtml(c.id)}">
            <span class="flow-edit-pick-item__check" aria-hidden="true">${on ? flowEditCheckSvg : ''}</span>
            <div class="flow-refund-item__main">
              <div class="flow-refund-item__name">${escapeHtml(c.name)}</div>
              <div class="flow-refund-item__meta">余额 ¥${Number(c.balance || 0).toFixed(2)}</div>
            </div>
          </button>`;
        }).join('')
      : `<div class="flow-edit-add-note">「${escapeHtml(cust.name)}」名下暂无会员卡，可先到「办卡」办理后再充值。</div>`;
    return segHtml +
      `<div class="flow-edit-panel">
        <div class="flow-edit-panel__title">储值金额</div>
        <div class="flow-edit-amount-chips">${chipHtml}</div>
        <div class="flow-edit-amount-custom${isPreset ? '' : ' is-on'}">
          <span>自定义金额</span>
          <input type="text" class="input-amount" readonly inputmode="decimal"
            data-flow-edit-add-amount-input value="${amount.toFixed(2)}" aria-label="自定义储值金额">
        </div>
      </div>
      <div class="flow-edit-add-sub">选择充值卡</div>${cardRows}`;
  }

  function renderFlowEditAdd() {
    const replacing = !!state.flowEditReplaceItemId;
    const tab = state.flowEditAddTab === 'product' ? 'product' : (state.flowEditAddTab === 'card' ? 'card' : 'project');
    const seg = state.flowEditAddCardSeg === 'recharge' ? 'recharge' : 'issue';
    const tabs = document.getElementById('flowEditAddTabs');
    const body = document.getElementById('flowEditAddBody');
    const foot = document.getElementById('flowEditAddFoot');
    const titleEl = document.querySelector('#screen-flow-edit-add .title');
    if (titleEl) titleEl.textContent = replacing ? '更换项' : '添加项';
    const selected = new Set(state.flowEditAddSelected || []);
    /* 会员卡 Tab 的「选中项数」：办卡=已选卡模板数，充卡=选好卡且金额有效才算 1 项 */
    const rechargeReady = !!state.flowEditAddCardId && Number(state.flowEditAddAmount) > 0;
    const pickedCount = tab === 'card'
      ? (seg === 'issue' ? (state.flowEditAddCardTpls || []).length : (rechargeReady ? 1 : 0))
      : selected.size;
    if (tabs) {
      tabs.innerHTML = `
        <button type="button" class="flow-edit-add-tab${tab === 'project' ? ' is-on' : ''}" data-flow-edit-add-tab="project" role="tab">项目</button>
        <button type="button" class="flow-edit-add-tab${tab === 'product' ? ' is-on' : ''}" data-flow-edit-add-tab="product" role="tab">产品</button>
        <button type="button" class="flow-edit-add-tab${tab === 'card' ? ' is-on' : ''}" data-flow-edit-add-tab="card" role="tab">会员卡</button>`;
    }
    if (body) {
      if (tab === 'card') {
        body.innerHTML = flowEditAddCardHtml(seg);
      } else {
        const list = tab === 'product' ? PRODUCTS : PROJECTS;
        body.innerHTML = list.map(p => {
          const on = selected.has(p.id);
          return `<button type="button" class="flow-edit-pick-item${on ? ' is-on' : ''}" data-flow-edit-pick="${escapeHtml(p.id)}">
            <span class="flow-edit-pick-item__check" aria-hidden="true">${on ? flowEditCheckSvg : ''}</span>
            <div class="flow-refund-item__main">
              <div class="flow-refund-item__name">${escapeHtml(p.name)}</div>
              <div class="flow-refund-item__meta">${escapeHtml(p.category || p.spec || '')}</div>
            </div>
            <div class="flow-refund-item__price"><span class="yen">¥</span>${Number(p.price || 0).toFixed(2)}</div>
          </button>`;
        }).join('');
      }
    }
    /* 会员卡 Tab 的自定义金额输入走金额键盘（.input-amount 自动接线；重绘后需重新接） */
    if (body && tab === 'card' && seg === 'recharge' && typeof window.wireAmountKeypadInputs === 'function') {
      window.wireAmountKeypadInputs(body);
    }
    if (foot) {
      const confirmLabel = replacing ? '确认更换' : '确认添加';
      foot.innerHTML = `
        <div class="flow-edit-bar__amt">
          <div class="flow-edit-bar__line"><span class="l">已选</span><span class="v">${pickedCount} 项</span></div>
        </div>
        <div class="flow-edit-bar__btns">
          <button type="button" class="flow-edit-bar__btn flow-edit-bar__btn--c" data-flow-edit-add-confirm${pickedCount ? '' : ' disabled'}>${confirmLabel}</button>
        </div>`;
    }
  }

  function confirmFlowEditAdd() {
    const d = ensureFlowEditDraft();
    if (!d) return;
    const tab = state.flowEditAddTab === 'product' ? 'product' : (state.flowEditAddTab === 'card' ? 'card' : 'project');
    const seg = state.flowEditAddCardSeg === 'recharge' ? 'recharge' : 'issue';
    const pool = tab === 'product' ? PRODUCTS : PROJECTS;
    const selected = state.flowEditAddSelected || [];
    const replaceId = state.flowEditReplaceItemId;

    if (replaceId) {
      const target = d.items.find(x => x.id === replaceId);
      if (!target) {
        showToast('原条目不存在', true);
        return;
      }
      if (tab === 'card') {
        const built = flowEditBuildOneCardItem(seg);
        if (!built) return;
        Object.keys(target).forEach((k) => {
          if (k === 'id' || k === 'staffIds' || k === 'staffRoles' || k === 'staffAchievements' || k === 'staffCommissions') return;
          delete target[k];
        });
        Object.assign(target, built, {
          id: replaceId,
          staffIds: Array.isArray(target.staffIds) ? target.staffIds : [],
          staffRoles: target.staffRoles || {},
          staffAchievements: target.staffAchievements || {},
          staffCommissions: target.staffCommissions || {},
        });
        resetFlowEditCardPick();
      } else {
        const pickId = selected[0];
        const p = pool.find(x => x.id === pickId);
        if (!p) {
          showToast('请选择要更换的内容', true);
          return;
        }
        Object.keys(target).forEach((k) => {
          if (k === 'id' || k === 'staffIds' || k === 'staffRoles' || k === 'staffAchievements' || k === 'staffCommissions' || k === 'qty') return;
          delete target[k];
        });
        target.name = p.name;
        target.price = Number(p.price) || 0;
        target.type = tab;
        target.spec = p.spec || '';
        target.qty = Math.max(1, Number(target.qty) || 1);
      }
      state.flowEditReplaceItemId = null;
      state.flowEditAddSelected = [];
      state.flowEditItemId = replaceId;
      if (typeof window.__staffPickResetEdit === 'function') window.__staffPickResetEdit();
      showOnlyScreen('screen-flow-edit-item');
      renderFlowEditItem();
      return;
    }

    if (tab === 'card') {
      addFlowEditCardItems(d, seg);
      renderFlowEdit();
      showOnlyScreen('screen-flow-edit');
      return;
    }

    selected.forEach(id => {
      const p = pool.find(x => x.id === id);
      if (!p) return;
      if (tab === 'product') {
        let cap = null;
        if (typeof findCatalogItemById === 'function' && typeof catalogStockLimit === 'function') {
          const cat = findCatalogItemById(p.id);
          if (cat) cap = catalogStockLimit(cat);
        } else if (p.stock != null) {
          cap = Number(p.stock);
        }
        if (cap != null && cap <= 0) {
          showToast(`「${p.name}」库存不足`, true);
          return;
        }
      }
      d.items.push({
        id: `fi-${Date.now()}-${id}-${Math.random().toString(36).slice(2, 6)}`,
        name: p.name,
        price: Number(p.price) || 0,
        qty: 1,
        type: tab,
        spec: p.spec || '',
        staffIds: [],
        staffRoles: {},
        staffAchievements: {},
        staffCommissions: {},
      });
    });
    state.flowEditAddSelected = [];
    renderFlowEdit();
    showOnlyScreen('screen-flow-edit');
  }

  /** 更换/添加时构造单条会员卡条目；失败时 toast 并返回 null */
  function flowEditBuildOneCardItem(seg) {
    const base = {
      qty: 1,
      type: 'card',
      spec: '',
    };
    if (seg === 'recharge') {
      const cust = flowEditCustomer();
      const card = flowEditCustomerCards().find(c => c.id === state.flowEditAddCardId);
      const amount = Number(state.flowEditAddAmount) || 0;
      if (!cust || !card) {
        showToast('请选择要充值的会员卡', true);
        return null;
      }
      if (!(amount > 0)) {
        showToast('请设置储值金额', true);
        return null;
      }
      return {
        ...base,
        name: `充值 · ${card.name}`,
        price: amount,
        cardKind: 'recharge',
        cardId: card.id,
        cardName: card.name,
      };
    }
    const tid = (state.flowEditAddCardTpls || [])[0];
    const tpl = tid && CARD_TEMPLATES.find(t => t.id === tid);
    if (!tpl) {
      showToast('请选择要办理的会员卡', true);
      return null;
    }
    return {
      ...base,
      name: `办卡 · ${tpl.name}`,
      price: Number(tpl.price) || 0,
      cardKind: 'issue',
      cardTplId: tpl.id,
      cardFace: Number(tpl.face || 0),
      cardGift: Number(tpl.giftAmount || 0),
    };
  }

  /** 会员卡 Tab 确认：办卡（卡模板 → 办卡条目）/ 充卡（顾客卡 + 储值金额 → 充值条目） */
  function addFlowEditCardItems(d, seg) {
    const base = {
      qty: 1,
      type: 'card',
      spec: '',
      staffIds: [],
      staffRoles: {},
      staffAchievements: {},
      staffCommissions: {},
    };
    if (seg === 'recharge') {
      const cust = flowEditCustomer();
      const card = flowEditCustomerCards().find(c => c.id === state.flowEditAddCardId);
      const amount = Number(state.flowEditAddAmount) || 0;
      if (!cust || !card) {
        showToast('请选择要充值的会员卡', true);
        return;
      }
      if (!(amount > 0)) {
        showToast('请设置储值金额', true);
        return;
      }
      d.items.push({
        ...base,
        id: `fi-${Date.now()}-recharge-${card.id}`,
        name: `充值 · ${card.name}`,
        price: amount,
        cardKind: 'recharge',
        cardId: card.id,
        cardName: card.name,
      });
      resetFlowEditCardPick();
      return;
    }
    const ids = state.flowEditAddCardTpls || [];
    if (!ids.length) {
      showToast('请选择要办理的会员卡', true);
      return;
    }
    ids.forEach(tid => {
      const tpl = CARD_TEMPLATES.find(t => t.id === tid);
      if (!tpl) return;
      d.items.push({
        ...base,
        id: `fi-${Date.now()}-${tid}-${Math.random().toString(36).slice(2, 6)}`,
        name: `办卡 · ${tpl.name}`,
        price: Number(tpl.price) || 0,
        cardKind: 'issue',
        cardTplId: tpl.id,
        cardFace: Number(tpl.face || 0),
        cardGift: Number(tpl.giftAmount || 0),
      });
    });
    resetFlowEditCardPick();
  }

  function openFlowEditItem(itemId) {
    ensureFlowEditDraft();
    state.flowEditItemId = itemId;
    /* 进页前复位选择器交互态（上一次遗留的「选择页」不该跟过来） */
    if (typeof window.__staffPickResetEdit === 'function') window.__staffPickResetEdit();
    showOnlyScreen('screen-flow-edit-item');
    renderFlowEditItem();
  }

  function getFlowEditItem() {
    const d = state.flowEditDraft;
    if (!d) return null;
    return d.items.find(x => x.id === state.flowEditItemId) || null;
  }

  function renderFlowEditItem() {
    const it = getFlowEditItem();
    const body = document.getElementById('flowEditItemBody');
    const foot = document.getElementById('flowEditItemFoot');
    if (!it || !body) return;
    const isProduct = it.type === 'product';
    const isCard = it.type === 'card';
    const saleLabel = isProduct || isCard ? '销售员工' : '服务员工';
    const titleEl = document.getElementById('flowEditItemTitle');
    if (titleEl) {
      titleEl.textContent = isProduct ? '编辑产品' : (isCard ? '编辑会员卡' : '编辑项目');
    }
    const typeLabel = flowTypeLabel(flowEditItemKind(it));
    if (!it.staffIds) it.staffIds = [];
    if (!it.staffRoles) it.staffRoles = {};
    if (!it.staffAchievements) it.staffAchievements = {};
    if (!it.staffCommissions) it.staffCommissions = {};
    const replaceBtn = `<button type="button" class="btn-add-benefit btn-add-benefit--block" data-flow-edit-item-replace>更换项</button>`;
    const cardMetaRows = flowEditCardItemMetaRows(it);
    body.innerHTML = `
      <div class="flow-detail-card">
        <div class="flow-detail-card__title">${isCard ? '会员卡信息' : (isProduct ? '产品信息' : '项目信息')}</div>
        <div class="flow-edit-form-row">
          <span class="flow-edit-form-row__label">名称</span>
          <span class="flow-edit-form-row__val">${escapeHtml(it.name)}</span>
        </div>
        <div class="flow-edit-form-row">
          <span class="flow-edit-form-row__label">类型</span>
          <span class="flow-edit-form-row__val">${escapeHtml(typeLabel)}</span>
        </div>
        ${isProduct && it.spec ? `<div class="flow-edit-form-row">
          <span class="flow-edit-form-row__label">规格</span>
          <span class="flow-edit-form-row__val flow-edit-form-row__val--muted">${escapeHtml(it.spec)}</span>
        </div>` : ''}
        ${cardMetaRows}
        <div class="flow-edit-form-row">
          <span class="flow-edit-form-row__label">${it.cardKind === 'recharge' ? '储值金额' : '单价'}</span>
          <input type="text" class="input-amount flow-edit-price-input" readonly inputmode="decimal"
            data-flow-edit-item-price value="${Number(it.price || 0).toFixed(2)}" aria-label="修改单价">
        </div>
        <div class="flow-edit-form-row">
          <span class="flow-edit-form-row__label">数量</span>
          <div class="flow-edit-qty">
            <button type="button" class="flow-edit-qty__btn" data-flow-edit-qty="-1" aria-label="减少">−</button>
            <span class="flow-edit-qty__val">${it.qty || 1}</span>
            <button type="button" class="flow-edit-qty__btn" data-flow-edit-qty="1" aria-label="增加">+</button>
          </div>
        </div>
        ${replaceBtn}
      </div>
      <div class="flow-detail-card">
        <div class="flow-detail-card__title">${saleLabel}</div>
        <div class="staff-embed flow-edit-staff-embed" id="flowEditStaffPick" data-staff-root data-ctx="flowedit"></div>
        <div id="flowEditStaffCards">${flowEditStaffCardsHtml(it)}</div>
      </div>`;
    if (foot) {
      foot.innerHTML = `
        <div class="flow-edit-bar__btns">
          <button type="button" class="flow-edit-bar__btn flow-edit-bar__btn--g" data-flow-edit-item-del-cur>删除</button>
          <button type="button" class="flow-edit-bar__btn flow-edit-bar__btn--c" data-flow-edit-item-done>完成</button>
        </div>`;
    }
    flowEditStaffPickerRender();
  }

  /** 会员卡条目的补充信息行（面值 / 赠送 / 充值卡） */
  function flowEditCardItemMetaRows(it) {
    if (!it || it.type !== 'card') return '';
    const row = (label, val, muted) => `<div class="flow-edit-form-row">
          <span class="flow-edit-form-row__label">${label}</span>
          <span class="flow-edit-form-row__val${muted ? ' flow-edit-form-row__val--muted' : ''}">${val}</span>
        </div>`;
    if (it.cardKind === 'recharge') {
      return it.cardName ? row('充值卡', escapeHtml(it.cardName)) : '';
    }
    const out = [];
    const face = Number(it.cardFace || 0);
    const gift = Number(it.cardGift || 0);
    if (face > 0) out.push(row('面值', `¥${face.toFixed(2)}`, true));
    if (gift > 0) out.push(row('赠送', `¥${gift.toFixed(2)}`, true));
    return out.join('');
  }

  /** 已选员工的明细卡（工位标签 · 业绩 · 提成）——选人/改工位由上方槽位选择器负责 */
  function flowEditStaffCardsHtml(it) {
    const selectedStaff = (it.staffIds || []).map(sid => ({ id: sid, name: flowStaffNameById(sid) }));
    if (!selectedStaff.length) {
      return `<div class="flow-edit-item__meta-line" style="padding:4px 0 0">暂未添加员工 · 点上方员工卡片即可加入本单</div>`;
    }
    return selectedStaff.map(st => {
      const curRole = it.staffRoles[st.id] || '';
      const roleLabel = curRole && typeof staffRoleLabel === 'function' ? staffRoleLabel(curRole) : '';
      const ach = Number(it.staffAchievements[st.id] || 0);
      const comm = Number(it.staffCommissions[st.id] || 0);
      return `<div class="flow-edit-item-staff-card" data-flow-edit-item-staff-card="${escapeHtml(st.id)}">
        <div class="flow-edit-item-staff-card__head">
          <div class="flow-edit-item-staff-card__head-main">
            <span class="flow-edit-item-staff-card__name">${escapeHtml(st.name)}</span>
            <span class="flow-pill flow-pill--station${roleLabel ? '' : ' is-empty'}">${roleLabel ? escapeHtml(roleLabel) : '未设工位'}</span>
          </div>
          <button type="button" class="flow-edit-staff-row__del" data-flow-edit-item-staff-del="${escapeHtml(st.id)}" aria-label="移除员工">${flowIconTrash()}</button>
        </div>
        <div class="flow-edit-item-staff-card__metrics">
          <div class="flow-edit-item-staff-card__metric is-readonly">
            <span class="flow-edit-item-staff-card__metric-lab">业绩</span>
            <span class="flow-edit-item-staff-card__metric-val is-ach">${ach.toFixed(2)}</span>
          </div>
          <label class="flow-edit-item-staff-card__metric">
            <span class="flow-edit-item-staff-card__metric-lab">提成</span>
            <span class="flow-edit-item-staff-card__metric-row">
              <input type="text" class="input-amount flow-edit-item-staff-card__metric-input" readonly inputmode="decimal"
                data-flow-edit-item-staff-perf="commission" data-staff-id="${escapeHtml(st.id)}"
                value="${comm.toFixed(2)}" aria-label="修改提成">
              <span class="flow-edit-item-staff-card__metric-edit" aria-hidden="true">${flowIconEditSquare()}</span>
            </span>
          </label>
        </div>
      </div>`;
    }).join('');
  }

  /* ===== 编辑项目页 · 服务员工（复用开单2.0 槽位式选择器） =====
     宿主桥：选择器 DOM 直接落开单2.0 的 [data-staff-root][data-ctx="flowedit"]，
     数据落在 window.__flowEditStaffRow（开单2.0 的 staffRow 形状），双向同步到本项目条目。
     —— 选择器内点选/落位/取消 → 开单2.0 调 window.__flowOnStaffChange() → 这里只重绘「员工明细卡」，
        选择器自身 DOM 与动效完全不受影响；
     —— 明细卡上改工位、提成 → 写回条目后整页重绘（选择器跟着重新读一遍）。 */
  const FLOW_EDIT_STAFF_ROW_ID = '__flow_edit_item__';

  function flowHostNeedStation() {
    return typeof window.spNeedStation === 'function' ? !!window.spNeedStation() : false;
  }

  function flowHostNeedExtra() {
    return typeof window.spNeedExtra === 'function' ? !!window.spNeedExtra() : false;
  }

  /** 当前全店态下选择器会渲染的槽位行 key（与开单2.0 spRowDefs 同源） */
  function flowHostRowKeys() {
    const needStation = flowHostNeedStation();
    const needExtra = flowHostNeedExtra();
    const keys = [];
    if (needStation) keys.push('senior', 'mid', 'junior');
    else if (needExtra) keys.push('avg');
    if (needExtra) keys.push('extra');
    if (!keys.length) keys.push('direct');
    return keys;
  }

  /** 条目 → 选择器行（staffRoles 为数组；提成按当前全店态映射；顾客指定不参与流水本单） */
  function flowEditStaffRowFromItem(it) {
    const keys = flowHostRowKeys();
    const direct = keys.length === 1 && keys[0] === 'direct';
    const needExtra = flowHostNeedExtra();
    const row = {
      id: FLOW_EDIT_STAFF_ROW_ID,
      staffIds: (it && Array.isArray(it.staffIds) ? it.staffIds : []).slice(),
      staffRoles: {},
      staffExtra: {},
      staffChosen: {},
    };
    row.staffIds.forEach(sid => {
      row.staffChosen[sid] = true;
      if (needExtra) row.staffExtra[sid] = false;
      if (direct) return;
      const role = it.staffRoles ? it.staffRoles[sid] : '';
      let key = keys.indexOf(role) >= 0 ? role : '';
      if (!key && keys.indexOf('avg') >= 0) key = 'avg';
      else if (!key && keys.indexOf('senior') >= 0) key = STAFF_ROLE_DEFAULT;
      if (key) row.staffRoles[sid] = [key];
    });
    return row;
  }

  /** 选择器行 → 条目（只同步选择器真正负责的字段：工位行存在时同步工位；提成由本页录入，业绩只读） */
  function flowEditApplyStaffRow(it, row) {
    if (!it || !row) return;
    const ids = Array.isArray(row.staffIds) ? row.staffIds.slice() : [];
    const syncRoles = flowHostNeedStation();
    if (!it.staffRoles) it.staffRoles = {};
    if (!it.staffAchievements) it.staffAchievements = {};
    if (!it.staffCommissions) it.staffCommissions = {};
    ids.forEach(sid => {
      if (syncRoles) {
        const roles = (row.staffRoles && row.staffRoles[sid]) || [];
        const hit = roles.find(r => r === 'senior' || r === 'mid' || r === 'junior');
        if (hit) it.staffRoles[sid] = hit;
        else if (roles.indexOf('avg') >= 0) delete it.staffRoles[sid];   /* 提成不算工位 */
      }
      if (it.staffAchievements[sid] == null) it.staffAchievements[sid] = 0;
      if (it.staffCommissions[sid] == null) it.staffCommissions[sid] = 0;
    });
    ['staffRoles', 'staffAchievements', 'staffCommissions'].forEach(k => {
      Object.keys(it[k] || {}).forEach(sid => { if (ids.indexOf(sid) < 0) delete it[k][sid]; });
    });
    it.staffIds = ids;
  }

  function flowEditStaffPickerRender() {
    const root = document.getElementById('flowEditStaffPick');
    if (!root) return;
    if (typeof window.renderStaffInto !== 'function') {
      root.innerHTML = '';
      return;
    }
    window.__flowEditStaffRow = flowEditStaffRowFromItem(getFlowEditItem());
    window.renderStaffInto(root, window.__flowEditStaffRow);
  }

  function flowEditStaffCardsRender() {
    const box = document.getElementById('flowEditStaffCards');
    if (!box) return;
    const it = getFlowEditItem();
    box.innerHTML = it ? flowEditStaffCardsHtml(it) : '';
  }

  /* 开单2.0 选择器在 flowedit 宿主里的回调（ctx 分支已注册在宿主 spNotifyHost） */
  window.__flowOnStaffChange = function () {
    const it = getFlowEditItem();
    if (!it) return;
    flowEditApplyStaffRow(it, window.__flowEditStaffRow);
    flowEditStaffCardsRender();
  };

  function buildFlowEditSummary(prev, next) {
    const bits = [];
    const prevItems = prev.items || [];
    const nextItems = next.items || [];
    if (prevItems.length !== nextItems.length) {
      bits.push(nextItems.length > prevItems.length ? '添加项目' : '减少项目');
    }
    const prevMap = new Map(prevItems.map(it => [it.id, it]));
    nextItems.forEach(it => {
      const old = prevMap.get(it.id);
      if (!old) return;
      if (Number(old.price) !== Number(it.price)) bits.push(`调整「${it.name}」单价`);
      if (Number(old.qty) !== Number(it.qty)) bits.push(`调整「${it.name}」数量`);
      if (String(old.name) !== String(it.name)) bits.push(`更换「${old.name}」`);
    });
    const prevStaff = (prev.staffs || []).map(s => s.id).sort().join(',');
    const nextStaff = (next.staffs || []).map(s => s.id).sort().join(',');
    if (prevStaff !== nextStaff) bits.push('调整参与员工');
    const uniq = Array.from(new Set(bits));
    if (!uniq.length) return '保存订单修改';
    return uniq.slice(0, 3).join(' · ');
  }

  function appendFlowEditLog(o, summary) {
    if (!o) return;
    const time = formatFlowTime(new Date());
    const sessionStaff = (window.RTBPerm && typeof window.RTBPerm.getSessionStaff === 'function')
      ? window.RTBPerm.getSessionStaff()
      : null;
    const operator = (sessionStaff && sessionStaff.name)
      || o.cashier
      || (o.staffs && o.staffs[0] && o.staffs[0].name)
      || o.staff
      || '店员';
    if (!Array.isArray(o.editLogs)) o.editLogs = [];
    o.editLogs.unshift({
      id: `fel-${Date.now()}`,
      time,
      operator,
      summary: summary || '保存订单修改',
    });
    o.lastEditedAt = time;
  }

  function renderFlowEditLog() {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    const body = document.getElementById('flowEditLogBody');
    if (!body) return;
    const logs = (o && Array.isArray(o.editLogs)) ? o.editLogs.slice() : [];
    if (!logs.length) {
      body.innerHTML = `<div class="flow-edit-log-empty">暂无修改记录<br>保存修改后会出现在这里</div>`;
      return;
    }
    body.innerHTML = `<div class="flow-edit-log-list">${logs.map(log => `
      <div class="flow-edit-log-item">
        <div class="flow-edit-log-item__time">${escapeHtml(log.time || '')}</div>
        <div class="flow-edit-log-item__summary">${escapeHtml(log.summary || '保存订单修改')}</div>
        <div class="flow-edit-log-item__op">操作人 ${escapeHtml(log.operator || '—')}</div>
      </div>`).join('')}</div>`;
  }

  function closeFlowEditLog() {
    document.getElementById('flowEditLogMask')?.classList.remove('show');
  }

  function openFlowEditLog() {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId) || FLOW_ORDERS.find(x => x.status === 'done' && x.editLogs && x.editLogs.length) || FLOW_ORDERS[0];
    if (!o) {
      showToast('暂无订单');
      return;
    }
    state.flowDetailId = o.id;
    const detail = document.getElementById('screen-flow-detail');
    if (detail && detail.classList.contains('hidden')) {
      openFlowDetail(o.id, { fromSuccess: false });
    }
    renderFlowEditLog();
    document.getElementById('flowEditLogMask')?.classList.add('show');
  }

  function flowEditItemValidationError(it) {
    if (!it) return '项目不存在';
    const name = it.name || '项目';
    const price = Number(it.price);
    if (!Number.isFinite(price) || price < 0) return `「${name}」请设置有效单价`;
    const qty = Number(it.qty);
    if (!Number.isFinite(qty) || qty < 1) return `「${name}」数量至少为 1`;
    const ids = Array.isArray(it.staffIds) ? it.staffIds : [];
    if (!ids.length) return null;
    const missingRole = ids.some(sid => !(it.staffRoles && it.staffRoles[sid]));
    /* 全店「不分工位」态（开单2.0 的提成 / 点选即勾选）下不强制每个员工都有工位 */
    if (missingRole && flowHostNeedStation()) {
      const tip = typeof stationRoleLabelsJoined === 'function' ? stationRoleLabelsJoined() : '大工/中工/小工';
      return `「${name}」请为已选员工设置工位（${tip}）`;
    }
    return null;
  }

  function flowEditDraftValidationError(d) {
    if (!d || !Array.isArray(d.items) || !d.items.length) return '请至少保留一个服务项目';
    for (let i = 0; i < d.items.length; i++) {
      const err = flowEditItemValidationError(d.items[i]);
      if (err) return err;
    }
    return null;
  }

  function applyFlowEditDraft(opts) {
    const silentGap = !!(opts && opts.silentGap);
    const skipValidate = !!(opts && opts.skipValidate);
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    const d = state.flowEditDraft;
    if (!o || !d) return false;
    if (!skipValidate) {
      const err = flowEditDraftValidationError(d);
      if (err) {
        showToast(err, true);
        return false;
      }
    }
    const prevSnap = {
      items: (o.items || []).map(it => Object.assign({}, it)),
      staffs: Array.isArray(o.staffs) ? o.staffs.map(s => Object.assign({}, s)) : flowStaffsFromOrder(o),
    };
    o.items = d.items.map(it => Object.assign({}, it, {
      staffRoles: it.staffRoles ? Object.assign({}, it.staffRoles) : {},
      staffAchievements: it.staffAchievements ? Object.assign({}, it.staffAchievements) : {},
      staffCommissions: it.staffCommissions ? Object.assign({}, it.staffCommissions) : {},
    }));
    d.staffs = flowAggregateStaffsFromItems(o.items, d.staffs);
    o.staffs = d.staffs.map(s => Object.assign({}, s));
    const primary = o.staffs[0];
    o.staff = primary ? primary.name : (o.staff || '未指定');
    o.achievement = o.staffs.reduce((s, x) => s + (Number(x.achievement) || 0), 0);
    o.commission = o.staffs.reduce((s, x) => s + (Number(x.commission) || 0), 0);
    o.kind = flowKindFromItems(o.items);
    o.listTotal = flowItemsListTotal(o.items);
    if (o.paidAmount == null) o.paidAmount = round2(Number(o.amount) || 0);
    appendFlowEditLog(o, buildFlowEditSummary(prevSnap, d));
    state.flowEditDraft = null;
    if (!silentGap) showToast('订单已修改');
    return true;
  }

  function saveFlowEdit() {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    const d = state.flowEditDraft;
    if (!o || !d) {
      showToast('订单数据异常，请返回重试', true);
      return;
    }
    const err = flowEditDraftValidationError(d);
    if (err) {
      showToast(err, true);
      return;
    }
    const paid = flowOrderPaidAmount(o);
    const estimated = flowOrderEstimatedDue(o, d.items);
    const gap = round2(estimated - paid);
    if (Math.abs(gap) >= 0.01) {
      state.flowEditPendingDiff = { gap, estimated, paid };
      const abs = Math.abs(gap);
      const collect = gap > 0;
      const method = flowLargestPayMethod(o);
      const title = document.getElementById('flowEditDiffTitle');
      const body = document.getElementById('flowEditDiffBody');
      const sameBtn = document.getElementById('flowEditDiffSamePay');
      const otherBtn = document.getElementById('flowEditDiffGoSettle');
      if (title) title.textContent = collect ? `需补收差价 ¥${abs.toFixed(2)}` : `需退还差价 ¥${abs.toFixed(2)}`;
      if (body) {
        body.textContent = collect
          ? `改后实付 ¥${estimated.toFixed(2)}，原实付 ¥${paid.toFixed(2)}，少收 ¥${abs.toFixed(2)}。请选择补记方式（须当场闭合差额）。`
          : `改后实付 ¥${estimated.toFixed(2)}，原实付 ¥${paid.toFixed(2)}，多收 ¥${abs.toFixed(2)}。请选择退还方式（须当场闭合差额）。`;
      }
      if (sameBtn) {
        sameBtn.textContent = collect
          ? `用${method}补记 ¥${abs.toFixed(2)}`
          : `用${method}退还 ¥${abs.toFixed(2)}`;
      }
      if (otherBtn) otherBtn.textContent = '选择其他支付方式';
      document.getElementById('flowEditDiffMask')?.classList.add('open');
      return;
    }
    if (!applyFlowEditDraft({ skipValidate: true })) return;
    openFlowDetail(o.id, { fromSuccess: false });
  }

  function closeFlowEditDiffDialog() {
    document.getElementById('flowEditDiffMask')?.classList.remove('open');
    state.flowEditPendingDiff = null;
  }

  /** 先保存改单，再按原单金额最大支付方式一次性补记/退差 */
  function confirmFlowEditSamePay() {
    const pending = state.flowEditPendingDiff;
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    const err = flowEditDraftValidationError(state.flowEditDraft);
    if (err) {
      showToast(err, true);
      return;
    }
    const method = o ? flowLargestPayMethod(o) : '其他';
    closeFlowEditDiffDialog();
    if (!applyFlowEditDraft({ silentGap: true, skipValidate: true })) return;
    if (o) openFlowDetail(o.id, { fromSuccess: false });
    const gap = pending ? pending.gap : flowOrderGap(o);
    if (Math.abs(gap) < 0.01) return;
    state.flowGapPayMode = gap > 0 ? 'collect' : 'refund';
    applyFlowGapPayments([{ method, amount: Math.abs(gap) }]);
  }

  /** 先保存改单，再打开与结账同款全量支付 sheet 自选渠道 */
  function confirmFlowEditGoSettle() {
    const pending = state.flowEditPendingDiff;
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    const err = flowEditDraftValidationError(state.flowEditDraft);
    if (err) {
      showToast(err, true);
      return;
    }
    closeFlowEditDiffDialog();
    if (!applyFlowEditDraft({ silentGap: true, skipValidate: true })) return;
    if (o) openFlowDetail(o.id, { fromSuccess: false });
    const gap = pending ? pending.gap : flowOrderGap(o);
    if (Math.abs(gap) < 0.01) return;
    openFlowGapPaySheet(gap > 0 ? 'collect' : 'refund');
  }


  function openFlowGapPaySheet(mode) {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    if (!o || o.status !== 'done') {
      showToast('当前订单不可调整差额', true);
      return;
    }
    const gap = flowOrderGap(o);
    const abs = Math.abs(gap);
    if (abs < 0.01) {
      showToast('当前无差额', true);
      return;
    }
    if (mode === 'collect' && gap <= 0) {
      showToast('当前为多收，请使用退还差价', true);
      return;
    }
    if (mode === 'refund' && gap >= 0) {
      showToast('当前为少收，请使用补收差价', true);
      return;
    }
    state.flowGapPayMode = mode;
    closeMask('flowMoreMask');
    const isMember = !!(o.customerId && CUSTOMERS.find(c => c.id === o.customerId && c.isMember));
    if (typeof window.openPayConfirmSheet === 'function') {
      window.openPayConfirmSheet('flowGap', { amount: abs, mode, isMember });
      return;
    }
    showToast('支付面板未就绪', true);
  }

  function applyFlowGapPayments(payments) {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    const mode = state.flowGapPayMode;
    if (!o || !mode) return;
    const list = Array.isArray(payments) ? payments : [];
    const sum = round2(list.reduce((s, p) => s + (Number(p.amount) || 0), 0));
    const gap = Math.abs(flowOrderGap(o));
    if (sum < gap - 0.01) {
      showToast('支付金额不足', true);
      return;
    }
    if (!Array.isArray(o.payments)) o.payments = [];
    if (mode === 'collect') {
      list.forEach((p) => {
        if ((Number(p.amount) || 0) <= 0) return;
        o.payments.push({ method: p.method || '其他', amount: round2(p.amount) });
      });
      o.paidAmount = round2(flowOrderPaidAmount(o) + sum);
      o.amount = o.paidAmount;
      if (list[0] && list[0].method) o.payMethod = list[0].method;
      appendFlowEditLog(o, `补收差价 ¥${gap.toFixed(2)}`);
      showToast('补收成功');
    } else {
      list.forEach((p) => {
        if ((Number(p.amount) || 0) <= 0) return;
        o.payments.push({ method: `${p.method || '其他'}·退差`, amount: -round2(p.amount) });
      });
      o.paidAmount = round2(Math.max(0, flowOrderPaidAmount(o) - sum));
      o.amount = o.paidAmount;
      appendFlowEditLog(o, `退还差价 ¥${gap.toFixed(2)}`);
      showToast('退差成功');
    }
    state.flowGapPayMode = null;
    openFlowDetail(o.id, { fromSuccess: false });
  }

  window.__onFlowGapPayConfirm = function (payments) {
    applyFlowGapPayments(payments);
  };

  function openFlowRemarkEditor() {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    if (!o || o.status !== 'done') return;
    const input = document.getElementById('flowRemarkInput');
    const count = document.getElementById('flowRemarkCount');
    if (input) {
      input.value = o.orderRemark || '';
      if (count) count.textContent = String((input.value || '').length);
    }
    document.getElementById('flowRemarkMask')?.classList.add('open');
  }

  function closeFlowRemarkEditor() {
    document.getElementById('flowRemarkMask')?.classList.remove('open');
  }

  function confirmFlowRemark() {
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    const input = document.getElementById('flowRemarkInput');
    if (!o || !input) return;
    const next = String(input.value || '').slice(0, 500);
    const prev = o.orderRemark || '';
    o.orderRemark = next;
    if (prev !== next) appendFlowEditLog(o, next ? (prev ? '修改备注' : '补录备注') : '清空备注');
    closeFlowRemarkEditor();
    showToast('备注已保存');
    renderFlowDetail();
  }


  function returnToCardListFromIssueCheckout() {
    state.lastIssueFromCardMgmt = false;
    state.lastRefundResult = null;
    state.successIssueTemplateId = null;
    state.successIssueCardHtml = '';
    state.cardIssuePending = null;
    state.cardExtendPending = null;
    state.pendingOpenCard = null;
    resetCardIssuePayState();
    state.payAmounts = {};
    state.payMembercardCardId = null;
    state.lastSettlement = null;
    const slotEl = document.getElementById('successIssueCardSlot');
    const descEl = document.getElementById('successIssueDesc');
    if (slotEl) {
      slotEl.innerHTML = '';
      slotEl.classList.add('hidden');
    }
    if (descEl) {
      descEl.textContent = '';
      descEl.classList.add('hidden');
    }
    if (typeof setStep === 'function') setStep(0);
    if (typeof renderTemplateList === 'function') renderTemplateList();
    showOnlyScreen('screen0');
  }

  function startCardIssueCheckout({ templateId, memberId, cardName, amount, cardHtml, staff, skipStaffScreen }) {
    const c = CUSTOMERS.find(x => x.id === memberId);
    if (!c) {
      showToast('未找到该会员');
      return;
    }
    state.customer = c;
    state.cart = [];
    state.benefitDraft = {};
    state.benefitApplied = {};
    state.benefitSkip = false;
    state.selectedCouponId = null;
    state.settleOffersTouched = false;
    state.couponDraftId = null;
    state.manualOrderNo = '';
    state.orderRemark = '';
    state.payAmounts = {};
    state.lastSettlement = null;
    const issueTpl = CARD_TEMPLATES.find(t => t.id === templateId) || CARD_TPL_BY_ID[templateId];
    const includesFace = !!(issueTpl?.benefits?.balance);
    const staffSnap = staff || null;
    const payAmt = round2(Math.max(0, Number(amount) || 0));
    const prevEdited = !!state.cardIssuePayEdited && state.cardIssuePayTemplateId === templateId;
    state.pendingOpenCard = {
      name: cardName,
      amount: payAmt,
      amountEdited: skipStaffScreen ? prevEdited : false,
      templateId,
      includesFace,
      bizType: 'card_issue',
      staffIds: staffSnap ? (staffSnap.staffIds || []).slice() : [],
      staffRoles: staffSnap ? Object.assign({}, staffSnap.staffRoles || {}) : {},
    };
    state.cardIssuePayTemplateId = templateId;
    state.cardIssuePayAmount = payAmt;
    state.cardIssuePayEdited = skipStaffScreen ? prevEdited : false;
    state.orderIsFree = false;
    state.cardIssuePending = { templateId, memberId, bizType: 'card_issue' };
    state.cardExtendPending = null;
    state.successIssueTemplateId = templateId;
    state.successIssueCardHtml = cardHtml
      || (window.CardHost && typeof window.CardHost.renderIssueSuccessCardFace === 'function'
        ? window.CardHost.renderIssueSuccessCardFace(templateId)
        : '');
    state.lastIssueFromCardMgmt = true;
    closeMask('cartSheetMask');
    closeMask('payMask', { keepCardExtendDraft: true });

    /* 会员卡管理办卡：进简洁「确认办卡」页（卡已锁定）；开单「添加卡」仍走选卡页 */
    if (!skipStaffScreen) {
      state.addCardMode = 'new';
      state.selectedTemplateId = templateId;
      resetIssueStaffDraft();
      renderQuickIssuePage();
      syncBillDateLabels();
      showOnlyScreen('screen-quick-issue');
      if (typeof window.setFlowNavHighlight === 'function') window.setFlowNavHighlight('card-quick-issue');
      else if (typeof setFlowNavHighlight === 'function') setFlowNavHighlight('card-quick-issue');
      if (typeof syncFlowMapFromAppState === 'function') syncFlowMapFromAppState();
      return;
    }

    openMask('checkoutMask');
    setFlowNavHighlight('checkout');
    if (typeof syncFlowMapFromAppState === 'function') syncFlowMapFromAppState();
  }

  /** 会员卡延期收费：直达开单同款支付页 */
  function startCardExtendCheckout({ templateId, memberId, cardName, amount, unit, extendDays, fee }) {
    const c = CUSTOMERS.find(x => x.id === memberId);
    if (!c) {
      showToast('未找到该会员');
      return;
    }
    const payAmt = round2(Number(fee != null ? fee : amount) || 0);
    if (payAmt <= 0) {
      showToast('延期费用无效', true);
      return;
    }
    state.customer = c;
    state.cart = [];
    state.benefitDraft = {};
    state.benefitApplied = {};
    state.benefitSkip = false;
    state.selectedCouponId = null;
    state.settleOffersTouched = false;
    state.couponDraftId = null;
    state.manualOrderNo = '';
    state.orderRemark = '';
    state.payAmounts = {};
    state.lastSettlement = null;
    state.pendingOpenCard = {
      name: cardName,
      amount: payAmt,
      kind: 'extend',
      bizType: 'card_extend',
      templateId,
      includesFace: false,
    };
    state.cardIssuePending = null;
    state.cardExtendPending = {
      templateId,
      memberId,
      bizType: 'card_extend',
      unit: unit || 'month',
      extendDays,
      fee: payAmt,
      permanent: false,
    };
    state.successIssueTemplateId = templateId;
    state.successIssueCardHtml = window.CardHost && typeof window.CardHost.renderIssueSuccessCardFace === 'function'
      ? window.CardHost.renderIssueSuccessCardFace(templateId)
      : '';
    state.lastIssueFromCardMgmt = true;
    closeMask('cartSheetMask');
    closeMask('checkoutMask', { keepCardIssueDraft: true });
    renderPayChannels();
    openMask('payMask');
    setFlowNavHighlight('pay');
    if (typeof syncFlowMapFromAppState === 'function') syncFlowMapFromAppState();
  }

  function continueBilling() {
    const c = getCustomer();
    state.cart = [];
    state.benefitDraft = {};
    state.benefitApplied = {};
    state.selectedCouponId = null;
    state.settleOffersTouched = false;
    state.couponDraftId = null;
    state.manualOrderNo = '';
    state.orderRemark = '';
    state.payAmounts = {};
    state.pendingOpenCard = null;
    state.lastSettlement = null;
    state.guestGenderPickerOpen = false;
    state.billCustomerPickOpen = false;
    syncCartChrome();
    if (c && c.isMember) enterBill(c);
    else if (hasGuestGender()) enterBill(currentGuest());
    else enterBillUnselected();
  }

  function enterBill(customer) {
    state.guestGenderPickerOpen = false;
    state.billCustomerPickOpen = false;
    state.billFromHold = false;
    state.activeHoldId = null;
    if (isAnonymousGuest(customer)) {
      if (customer && (customer.gender === 'male' || customer.gender === 'female')) state.guestGender = customer.gender;
      state.customer = currentGuest();
    } else {
      if (customer && customer.isMember) refreshCustomerCardsFromHoldings(customer);
      state.customer = customer;
      if (customer && (customer.gender === 'male' || customer.gender === 'female')) state.guestGender = customer.gender;
      else if (customer && customer.isMember) state.guestGender = null;
    }
    state.benefitDraft = {};
    state.benefitApplied = {};
    state.benefitSkip = false;
    state.selectedCouponId = null;
    state.settleOffersTouched = false;
    state.couponDraftId = null;
    state.manualOrderNo = '';
    state.orderRemark = '';
    state.payAmounts = {};
    state.detailExpandedId = null;
    state.billTab = 'project';
    state.searchQuery = '';
    state.cardsExpanded = false;
    clearBillDueOverride();
    state.payDueSnapshot = null;
    ensureCashierId();
    resetBillCardPick();
    openBillCatalog();
  }

  function resetOrder() {
    state.cart = [];
    state.customer = null;
    state.benefitDraft = {};
    state.benefitApplied = {};
    state.selectedCouponId = null;
    state.settleOffersTouched = false;
    state.couponDraftId = null;
    state.manualOrderNo = '';
    state.orderRemark = '';
    state.payAmounts = {};
    state.pendingOpenCard = null;
    state.lastSettlement = null;
    clearBillDueOverride();
    state.pendingCatalogAdds = [];
    state.billStockPickSelected = {};
    state.guestGenderPickerOpen = false;
    state.billCustomerPickOpen = false;
    resetBillSlipState();
    syncCartChrome();
    syncPickHoldsEntry();
    enterBillUnselected();
    renderCustomerList();
  }


  function openCardModule() {
    const templateId = state.selectedTemplateId;
    const customer = typeof getCustomer === 'function' ? getCustomer() : null;
    if (typeof window.CardHost !== 'undefined' && window.CardHost.issueTemplateFromBilling) {
      window.CardHost.issueTemplateFromBilling({ templateId, customer });
      return;
    }
    const q = new URLSearchParams();
    if (templateId) q.set('issue', templateId);
    if (customer && customer.id) q.set('member', customer.id);
    const qs = q.toString();
    window.open('../card/demo.html' + (qs ? ('?' + qs) : ''), '_blank', 'noopener');
  }

  function heldCardFromTemplate(tpl, customerId) {
    const projects = (tpl.projects || []).map(function (raw) {
      const s = String(raw);
      const m = s.match(/^(.+?)×(\d+)/);
      if (m) {
        const gift = s.match(/\+赠(\d+)/);
        const remain = Number(m[2]) + (gift ? Number(gift[1]) : 0);
        return { key: m[1], label: m[1], remain: remain };
      }
      return { key: s, label: s, remain: 1 };
    });
    return normalizeHeldCard({
      id: tpl.id + '_' + customerId,
      name: tpl.name,
      balance: tpl.benefits && tpl.benefits.balance ? (Number(tpl.face) || 0) : 0,
      rechargeBalance: tpl.benefits && tpl.benefits.balance ? (Number(tpl.face) || 0) : 0,
      giftBalance: tpl.benefits && tpl.benefits.balance ? (Number(tpl.giftAmount) || 0) : 0,
      discount: tpl.benefits && tpl.benefits.projectDiscount ? 0.85 : undefined,
      projects: projects,
      templateId: tpl.id,
    });
  }

  function openAddCardScreen(opts) {
    opts = opts || {};
    const c = getCustomer();
    if (!c || (!c.isMember && !hasGuestGender() && !isNamedWalkIn(c))) {
      showToast('请先选择散客性别或会员');
      return;
    }
    state.addCardMode = 'new';
    state.selectedTemplateId = CARD_TEMPLATES[0]?.id || null;
    resetCardIssuePayState();
    resetIssueStaffDraft();
    renderAddCardPage();
    showOnlyScreen('screen-add-card');
    setFlowNavHighlight('add-card');
    if (opts.openPick) openAddCardPickScreen({ scrollSelected: true });
  }

  function openAddCardPickScreen(opts) {
    opts = opts || {};
    renderAddCardPickList(opts);
    syncBillDateLabels();
    showOnlyScreen('screen-add-card-pick');
    setFlowNavHighlight(opts.flowId || 'add-card-group');
  }

  function closeAddCardPickScreen() {
    renderAddCardDecision();
    showOnlyScreen('screen-add-card');
    setFlowNavHighlight('add-card');
  }

  function renderGuestActionBtns() {
    return `<div class="customer-card__guest-actions">
            <button type="button" class="customer-card__quick-reg" id="btnRecordGuest">+快速注册</button>
          </div>`;
  }

  const GUEST_NAME_CHEV = '<span class="customer-card__guest-chev" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg></span>';

  function renderGuestIdentityHit({ label, avatar, ariaLabel }) {
    return `<button type="button" class="customer-card__guest-hit" data-guest-switch aria-label="${escapeHtml(ariaLabel || '选择顾客')}">
          <span class="customer-card__avatar-wrap">
            <img class="customer-card__avatar" src="${avatar}" alt="">
            <span class="customer-card__gender-switch" aria-hidden="true">
              <img src="assets/billing/guest-gender-switch.svg" alt="" width="20" height="20">
            </span>
          </span>
          <span class="customer-card__guest-label customer-card__name-text">${escapeHtml(label)}</span>
          ${GUEST_NAME_CHEV}
        </button>`;
  }

  function renderMemberIdentityHit(c, { visit, vip, avatar }) {
    return `<button type="button" class="customer-card__guest-hit" data-member-switch aria-label="选择顾客">
            <img class="customer-card__avatar" src="${avatar}" alt="" onerror="this.onerror=null;this.src='assets/billing/avatar-female.png'">
            <span class="customer-card__info">
              <span class="customer-card__name">
                <span class="customer-card__name-text">${escapeHtml(c.name)}</span>${vip}
              </span>
              <span class="customer-card__visit">${visit}</span>
            </span>
            ${GUEST_NAME_CHEV}
          </button>`;
  }

  function renderCustomerNameCard(c, { withActions = false, genderMode = false, assetMetrics = null } = {}) {
    const useGender = genderMode || isAnonymousGuest(c);
    if (useGender) {
      const selected = hasGuestGender();
      const g = selected ? state.guestGender : null;
      // 开单台：始终紧凑顶卡；头像+名称+＞ 打开下方顾客列表
      if (withActions) {
        const label = g === 'male' ? '男散客' : g === 'female' ? '女散客' : '散客';
        const avatar = g === 'male' ? AVATAR_MALE : g === 'female' ? AVATAR_FEMALE : 'assets/billing/avatar-guest-default.png';
        return `<div class="customer-card customer-card--guest${selected ? ' is-gender-selected' : ' is-unselected'}${state.billCustomerPickOpen ? ' is-pick-open' : ''}">
        <img class="customer-card__bg" src="assets/billing/customer-card-bg.png" alt="" aria-hidden="true">
        <div class="customer-card__row">
          ${renderGuestIdentityHit({ label, avatar, ariaLabel: '选择顾客' })}
          ${renderGuestActionBtns()}
        </div>
      </div>`;
      }
      const expanded = !!state.guestGenderPickerOpen || selected;
      if (!expanded) {
        return `<div class="customer-card customer-card--guest is-unselected">
        <img class="customer-card__bg" src="assets/billing/customer-card-bg.png" alt="" aria-hidden="true">
        <div class="customer-card__row">
          ${renderGuestIdentityHit({
            label: '散客',
            avatar: 'assets/billing/avatar-guest-default.png',
            ariaLabel: '选择散客性别',
          })}
        </div>
      </div>`;
      }
      const maleOn = g === 'male';
      const femaleOn = g === 'female';
      return `<div class="customer-card customer-card--guest is-gender-open${selected ? ' is-gender-selected' : ''}">
        <img class="customer-card__bg" src="assets/billing/customer-card-bg.png" alt="" aria-hidden="true">
        <div class="customer-card__row">
          <div class="customer-card__avatars">
            <button type="button" class="customer-card__avatar-pick${maleOn ? ' is-on' : ' is-gray'}" data-guest-gender="male" aria-label="男散客">
              <img class="customer-card__avatar" src="${AVATAR_MALE}" alt="">
            </button>
            <button type="button" class="customer-card__avatar-pick${femaleOn ? ' is-on' : ' is-gray'}" data-guest-gender="female" aria-label="女散客">
              <img class="customer-card__avatar" src="${AVATAR_FEMALE}" alt="">
            </button>
          </div>
          <div class="customer-card__gender">
            <button type="button" class="customer-card__gender-btn ${g === 'male' ? 'is-on' : ''}" data-guest-gender="male">男散客</button>
            <button type="button" class="customer-card__gender-btn ${g === 'female' ? 'is-on' : ''}" data-guest-gender="female">女散客</button>
          </div>
        </div>
      </div>`;
    }
    const visit = c.lastVisit
      ? `上次到店${escapeHtml(c.lastVisit)}`
      : (isNamedWalkIn(c) && c.phone ? escapeHtml(maskPhone(c.phone)) : '');
    const vip = c.vip
      ? '<img class="customer-card__vip" src="assets/billing/customer-vip-union.svg" alt="VIP" width="26" height="10">'
      : '';
    const avatar = c.avatar || 'assets/billing/avatar-female.png';
    const metricsHtml = assetMetrics ? `
        <div class="customer-card__metrics" aria-label="会员资产">
          <div class="customer-card__metric">
            <div class="customer-card__metric-val num">${formatMetricYen(assetMetrics.recharge)}</div>
            <div class="customer-card__metric-label">储值余额</div>
          </div>
          <div class="customer-card__metric">
            <div class="customer-card__metric-val num">${formatMetricYen(assetMetrics.gift)}</div>
            <div class="customer-card__metric-label">赠送余额</div>
          </div>
          <div class="customer-card__metric">
            <div class="customer-card__metric-val num">${assetMetrics.cardCount}</div>
            <div class="customer-card__metric-label">会员卡</div>
          </div>
          <div class="customer-card__metric">
            <div class="customer-card__metric-val num">${assetMetrics.couponCount}</div>
            <div class="customer-card__metric-label">优惠券</div>
          </div>
        </div>` : '';
    const identity = withActions
      ? renderMemberIdentityHit(c, { visit, vip, avatar })
      : `<img class="customer-card__avatar" src="${avatar}" alt="" onerror="this.onerror=null;this.src='assets/billing/avatar-female.png'">
            <div class="customer-card__info">
              <div class="customer-card__name">
                <span class="customer-card__name-text">${escapeHtml(c.name)}</span>${vip}
              </div>
              <div class="customer-card__visit">${visit}</div>
            </div>`;
    return `<div class="customer-card customer-card--member${assetMetrics ? ' customer-card--assets' : ''}">
        <img class="customer-card__bg" src="assets/billing/customer-card-bg.png" alt="" aria-hidden="true">
        <div class="customer-card__body">
          <div class="customer-card__row">
            ${identity}
          </div>
          ${metricsHtml}
        </div>
      </div>`;
  }

  function renderAddCardPage(opts) {
    opts = opts || {};
    renderAddCardDecision();
    renderAddCardPickList(opts);
  }

  function renderAddCardDecision() {
    const c = getCustomer() || GUEST;
    const custEl = document.getElementById('addCardCustomer');
    if (custEl) custEl.innerHTML = renderCustomerNameCard(c);
    document.querySelectorAll('#addCardMode [data-add-mode]').forEach(btn => {
      btn.classList.toggle('is-on', btn.dataset.addMode === state.addCardMode);
    });
    renderAddCardSlot();
    const tpl = CARD_TEMPLATES.find(t => t.id === state.selectedTemplateId)
      || (typeof getTemplate === 'function' ? getTemplate(state.selectedTemplateId) : null);
    syncCardIssuePayUi(tpl || null);
    renderAddCardStaffOnly();
  }

  function renderAddCardPickList(opts) {
    opts = opts || {};
    if (typeof ensureDemoFilled === 'function') ensureDemoFilled();
    if (typeof ensureBillingTemplatesFromCardModule === 'function') ensureBillingTemplatesFromCardModule();

    const bar = document.getElementById('addCardGroupBar');
    const emptyEl = document.getElementById('addCardGroupEmpty');
    const listEl = document.getElementById('addCardList');
    if (!listEl) return;

    const activeTpl = typeof getActiveTemplates === 'function' ? getActiveTemplates() : [];
    const anyGroups = typeof ensureCardGroups === 'function' && ensureCardGroups().length > 0;
    if (bar) {
      if (activeTpl.length && anyGroups) {
        bar.classList.remove('hidden');
        if (typeof renderCardGroupFilterTabs === 'function') {
          renderCardGroupFilterTabs(document.getElementById('addCardGroupTabs'), {
            surface: 'billing',
            dataAttr: 'data-add-card-group',
          });
        }
      } else {
        bar.classList.add('hidden');
      }
    }

    let filteredTpl = activeTpl;
    if (typeof filterTemplatesByCardGroup === 'function') {
      filteredTpl = filterTemplatesByCardGroup(activeTpl, 'billing');
    }
    const idSet = new Set(filteredTpl.map(t => t.id));
    const list = CARD_TEMPLATES.filter(tpl => idSet.has(tpl.id));

    emptyEl?.classList.add('hidden');
    if (!list.length) {
      listEl.innerHTML = '';
      if (activeTpl.length && getActiveCardGroupId && getActiveCardGroupId('billing') !== 'all') {
        emptyEl?.classList.remove('hidden');
      } else {
        listEl.innerHTML = '<div class="empty-cart" style="padding:24px 16px">暂无在售会员卡</div>';
      }
      return;
    }

    const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';
    listEl.innerHTML = list.map(tpl => {
      const selected = state.selectedTemplateId === tpl.id;
      const theme = (typeof getCardTheme === 'function')
        ? getCardTheme(tpl.cardColor)
        : { gradient: 'linear-gradient(90deg, #F4EAE5 0%, #EED1C3 100%)', accent: '#C4A394' };
      const grad = theme.gradient;
      const b = tpl.benefits || {};
      const sections = [];
      if (b.balance) {
        sections.push(`<div class="member-card-item__section"><div class="member-card-item__section-row">
          <div class="member-card-item__section-head">面值</div>
          <div class="member-card-item__section-content"><div class="member-card-item__line">面值 <span class="member-card-item__line-val is-data">¥${tpl.face}</span> · 赠送 <span class="member-card-item__line-val is-data">¥${tpl.giftAmount}</span></div></div>
        </div></div>`);
      }
      if (b.timesOrValidity) {
        const cells = (tpl.projects || []).map(p => `<div class="member-card-item__cell">${escapeHtml(p)}</div>`).join('') || '<div class="member-card-item__cell">—</div>';
        sections.push(`<div class="member-card-item__section"><div class="member-card-item__section-row">
          <div class="member-card-item__section-head">项目</div>
          <div class="member-card-item__section-content"><div class="member-card-item__grid">${cells}</div></div>
        </div></div>`);
      }
      if (b.projectDiscount) {
        const cells = (tpl.discounts || []).map(p => `<div class="member-card-item__cell">${escapeHtml(p)}</div>`).join('') || '<div class="member-card-item__cell">—</div>';
        sections.push(`<div class="member-card-item__section"><div class="member-card-item__section-row">
          <div class="member-card-item__section-head">折扣</div>
          <div class="member-card-item__section-content"><div class="member-card-item__grid">${cells}</div></div>
        </div></div>`);
      }
      sections.push(`<div class="member-card-item__section"><div class="member-card-item__section-row">
        <div class="member-card-item__section-head">期限</div>
        <div class="member-card-item__section-content"><div class="member-card-item__line">${escapeHtml(typeof formatListCardValidity === 'function' ? formatListCardValidity(tpl) : tpl.validity)}</div></div>
      </div></div>`);
      const vipHtml = (typeof cardVipIconHtml === 'function')
        ? cardVipIconHtml(tpl.cardColor)
        : '<span class="member-card-compact__vip" aria-hidden="true">VIP</span>';
      return `<div class="member-card-item ${selected ? 'is-selected' : ''}" data-template-id="${tpl.id}" role="button" tabindex="0" aria-pressed="${selected ? 'true' : 'false'}" style="--card-accent:${theme.accent}">
        ${selected ? `<span class="member-card-item__check">${checkSvg}</span>` : ''}
        <div class="member-card-compact" style="background:${grad}">
          <div class="member-card-compact__title">
            ${vipHtml}
            <span class="member-card-compact__name">${escapeHtml(tpl.name)}</span>
          </div>
          <span class="member-card-compact__price"><span class="member-card-compact__price-label">价格</span><span class="member-card-compact__price-val is-data">¥${tpl.price}</span></span>
        </div>
        <div class="member-card-item__panel">${sections.join('')}</div>
        <div class="member-card-item__footer">
          <button type="button" class="card-face-act card-face-act--clone-text" data-clone-template="${tpl.id}"><img src="assets/member-card-clone.svg" alt="" width="16" height="16" />复制建卡</button>
        </div>
      </div>`;
    }).join('');
    if (opts.scrollSelected) {
      requestAnimationFrame(() => {
        const el = document.querySelector('#addCardList .member-card-item.is-selected');
        if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    }
  }

  function renderAddCardSlot() {
    const slot = document.getElementById('addCardSlot');
    if (!slot) return;
    const tpl = CARD_TEMPLATES.find(t => t.id === state.selectedTemplateId)
      || (typeof getTemplate === 'function' ? getTemplate(state.selectedTemplateId) : null);
    if (!tpl) {
      slot.innerHTML = `<button type="button" class="add-card-slot is-empty" data-add-card-pick>
        <svg class="add-card-slot__plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
        <span>选择会员卡</span>
      </button>`;
      return;
    }
    const theme = (typeof getCardTheme === 'function')
      ? getCardTheme(tpl.cardColor)
      : { gradient: 'linear-gradient(90deg, #F4EAE5 0%, #EED1C3 100%)' };
    const grad = theme.gradient;
    const priceText = formatCardIssuePayText(getCardIssuePayAmount(tpl));
    const benefitLine = (typeof formatQuickIssueBenefitLine === 'function')
      ? formatQuickIssueBenefitLine(tpl)
      : '';
    slot.innerHTML =
      `<button type="button" class="add-card-slot" data-add-card-pick aria-label="更换会员卡">` +
      `<span class="add-card-slot__face" aria-hidden="true">` +
      `<span class="add-card-slot__face-head" style="background:${grad}"></span>` +
      `<span class="add-card-slot__face-body"></span></span>` +
      `<span class="add-card-slot__meta">` +
      `<span class="add-card-slot__name">${escapeHtml(tpl.name)}</span>` +
      `<span class="add-card-slot__price">${escapeHtml(priceText)}</span>` +
      (benefitLine && benefitLine !== '—'
        ? `<span class="add-card-slot__benefit">${escapeHtml(benefitLine)}</span>`
        : '') +
      `</span>` +
      `<span class="add-card-slot__action">更换</span>` +
      `</button>`;
  }

  /** @deprecated alias — slot is the decision summary */
  function renderAddCardPicked() {
    renderAddCardSlot();
  }


  const FLOW_MAP_GROUPS = [
    { title: '开单主流程', nodes: [
      { id: 'pick', label: '① 选择顾客', screen: 'screen-pick' },
      { id: 'bill', label: '② 点单台', screen: 'screen-bill' },
      { id: 'detail', label: '③ 结算确认', screen: 'screen-detail' },
      { id: 'cart', label: '已选', screen: 'cartSheetMask' },
      { id: 'checkout', label: '结账方式', screen: 'checkoutMask' },
      { id: 'pay', label: '开单分账', screen: 'payMask' },
      { id: 'success', label: '成功', screen: 'screen-success' },
    ]},
    { title: '收款', nodes: [
      { id: 'scan-me', label: '客户扫我', screen: 'screen-scan-me' },
      { id: 'scan-cust', label: '我扫客户', screen: 'screen-scan-cust' },
    ]},
    { title: '会员卡关联', nodes: [
      { id: 'expand', label: '展卡', screen: 'screen-bill' },
      { id: 'add-card', label: '添加卡', screen: 'screen-add-card' },
      { id: 'add-card-group', label: '添加卡 · 选卡', screen: 'screen-add-card-pick' },
      { id: 'card-asset', label: '充卡/续卡', screen: 'screen-bill-card-asset' },
      { id: 'benefit', label: '选择权益', screen: 'screen-pick-benefit' },
      { id: 'discount', label: '折扣权益', screen: 'screen-discount' },
    ]},
    { title: '其他', nodes: [
      { id: 'hold', label: '挂单列表', screen: 'screen-holds' },
    ]},
  ];

  const FLOW_NAV = {
    pick() { closeMask('payMask'); closeMask('cartSheetMask'); closeMask('checkoutMask'); openBillCustomer({ reset: true }); },
    bill() { closeMask('payMask'); closeMask('cartSheetMask'); closeMask('checkoutMask'); openBillCatalog(); },
    cart() {
      if (shouldOfferBillCardGate() && !state.billCardGateDone) {
        state.billCardGateDone = true;
        state.billCardGateOpen = false;
      }
      openBillCatalog({ skipGate: true });
      if (!state.cart.length) setCartQty(PROJECTS[0], 1);
      renderCartList('cartSheetList');
      syncCartChrome();
      openMask('cartSheetMask');
      setFlowNavHighlight('cart');
    },
    staff() {
      closeMask('payMask'); closeMask('cartSheetMask'); closeMask('checkoutMask');
      if (!state.cart.length) setCartQty(PROJECTS[0], 1);
      if (!state.customer) enterBillCustomerOnly(GUEST_UNSET);
      openBillSettle();
    },
    detail() {
      if (!state.cart.length) { showToast('请先添加商品'); return; }
      openBillSettle();
    },
    checkout() {
      if (!state.cart.length) { showToast('请先添加商品'); return; }
      clampCartToProductStock({ toast: true });
      if (!state.cart.length) { showToast('购物车为空'); return; }
      autoApplyBestSettleOffers();
      renderDetail(); showOnlyScreen('screen-detail');
      if (cartHasUnsetStaffRoles()) {
        showToast('请为已选员工设置工位（' + stationRoleLabelsJoined() + '）', true);
        return;
      }
      snapshotBillPayDue();
      openMask('checkoutMask'); setFlowNavHighlight('checkout');
    },
    pay() {
      if (!state.cart.length) { showToast('请先添加商品'); return; }
      closeMask('checkoutMask');
      renderDetail();
      state.payAmounts = {};
      renderPayChannels();
      if (openBillPayMask()) setFlowNavHighlight('pay');
    },
    'pay-price-changed'() {
      openBillPayPriceChangedDemo();
    },
    success() {
      if (!state.lastSettlement) state.lastSettlement = calcSettlement();
      if (!state.pendingOpenCard) state.pendingOpenCard = { name: '美发卡3000元', amount: 3000 };
      renderSuccess(); showOnlyScreen('screen-success');
    },
    'scan-me'() {
      if (!state.lastSettlement) state.lastSettlement = calcSettlement();
      renderScanMe(); showOnlyScreen('screen-scan-me'); setFlowNavHighlight('scan-me');
    },
    'scan-cust'() { showOnlyScreen('screen-scan-cust'); setFlowNavHighlight('scan-cust'); },
    expand() {
      if (!state.customer) enterBill(CUSTOMERS[0]);
      state.cardsExpanded = true; renderBillHeader(); showOnlyScreen('screen-bill');
    },
    'add-card'() { if (!state.customer) enterBill(CUSTOMERS[0]); openAddCardScreen(); },
    'add-card-group'() {
      if (!state.customer) enterBill(CUSTOMERS[0]);
      if (typeof setActiveCardGroupId === 'function') {
        const g = (typeof ensureCardGroups === 'function' ? ensureCardGroups() : []).find(x => (x.itemIds || []).length)
          || (typeof ensureCardGroups === 'function' ? ensureCardGroups()[0] : null);
        setActiveCardGroupId('billing', g ? g.id : 'all');
      }
      openAddCardScreen({ openPick: true });
    },
    'card-asset'() {
      if (!state.customer) enterBill(CUSTOMERS[0]);
      openBillCardAssetScreen();
    },
    benefit() {
      if (!isMemberBill()) { enterBill(CUSTOMERS[0]); }
      if (!state.cart.length) setCartQty(PROJECTS[1], 1);
      state.benefitDraft = JSON.parse(JSON.stringify(state.benefitApplied));
      renderBenefitPicker(); showOnlyScreen('screen-pick-benefit');
    },
    discount() { renderDiscountPage(); showOnlyScreen('screen-discount'); setFlowNavHighlight('discount'); },
    hold() { openHoldList(); },
  };

  function setFlowNavHighlight(id) {
    if (window.__BILLING_EMBEDDED__ && id && !String(id).startsWith('bill-') && !String(id).startsWith('flow-')) {
      id = 'bill-' + id;
    }
    /* 内嵌时交给宿主：功能链路分组 Tab 需随高亮切换 */
    if (window.__BILLING_EMBEDDED__ && typeof window.setFlowNavHighlight === 'function') {
      window.setFlowNavHighlight(id);
      return;
    }
    state.flowNavHighlight = id;
    document.querySelectorAll('.flow-map-node').forEach(btn => btn.classList.toggle('is-current', btn.dataset.flowNav === id));
  }
  function syncFlowMapFromAppState() {
    if (window.__FLOW_STANDALONE__) return;
    if (window.__BILLING_EMBEDDED__ && window.CardHost && window.CardHost.onBillingScreen) {
      const vis = document.querySelector('.phone .screen:not(.hidden)')?.id;
      if (vis) window.CardHost.onBillingScreen(vis);
      return;
    }
    const vis = document.querySelector('.phone .screen:not(.hidden)')?.id;
    const map = {
      'screen-pick': 'pick', 'screen-bill': state.cardsExpanded ? 'expand' : 'bill',
      'screen-bill-staff': 'staff', 'screen-detail': 'detail',
      'screen-pick-benefit': 'benefit', 'screen-coupon': 'detail', 'screen-holds': 'hold', 'screen-success': 'success',
      'screen-scan-me': 'scan-me', 'screen-scan-cust': 'scan-cust', 'screen-discount': 'discount',
    };
    if (document.getElementById('payMask')?.classList.contains('open')) setFlowNavHighlight('pay');
    else if (document.getElementById('checkoutMask')?.classList.contains('open')) setFlowNavHighlight('checkout');
    else if (document.getElementById('cartSheetMask')?.classList.contains('open')) setFlowNavHighlight('cart');
    else if (!document.getElementById('screen-add-card')?.classList.contains('hidden')) setFlowNavHighlight('add-card');
    else if (!document.getElementById('screen-add-card-pick')?.classList.contains('hidden')) setFlowNavHighlight('add-card-group');
    else if (!document.getElementById('screen-bill-card-asset')?.classList.contains('hidden')) setFlowNavHighlight('card-asset');
    else if (!document.getElementById('screen-quick-issue')?.classList.contains('hidden')) {
      if (typeof window.setFlowNavHighlight === 'function') window.setFlowNavHighlight('card-quick-issue');
    }
    else if (map[vis]) setFlowNavHighlight(map[vis]);
  }
  function renderFlowMap() {
    /* 内嵌时功能链路由 card 宿主维护（含项目/会员卡/开单），禁止覆盖 */
    if (window.__BILLING_EMBEDDED__) return;
    (document.getElementById('flowMapBody')||{innerHTML:""}).innerHTML = FLOW_MAP_GROUPS.map(g => `
      <section class="flow-map-group"><div class="flow-map-group__title">${escapeHtml(g.title)}</div><div class="flow-map-group__nodes">
        ${g.nodes.map(n => `<button type="button" class="flow-map-node" data-flow-nav="${n.id}">${escapeHtml(n.label)}<span class="flow-map-node__screen">${escapeHtml(n.screen)}</span></button>`).join('')}
      </div></section>`).join('');
    document.querySelectorAll('[data-flow-nav]').forEach(btn => btn.addEventListener('click', () => {
      const fn = FLOW_NAV[btn.dataset.flowNav];
      if (fn) fn(); else showToast('该节点暂未配置');
    }));
    syncFlowMapFromAppState();
  }

  document.getElementById('pickSearch')?.addEventListener('input', e => { state.searchQuery = e.target.value; renderCustomerList(); });
  document.getElementById('pickBack')?.addEventListener('click', () => {
    if (typeof openWorkbench === 'function') openWorkbench();
  });
  document.getElementById('customerList')?.addEventListener('click', e => {
    const guest = e.target.closest('[data-pick-guest]');
    if (guest) {
      const gender = guest.getAttribute('data-pick-guest');
      enterBill(gender === 'male' ? GUEST_MALE : GUEST_FEMALE);
      return;
    }
    const row = e.target.closest('[data-pick]');
    if (!row) return;
    const c = CUSTOMERS.find(x => x.id === row.dataset.pick);
    if (c) {
      state.pickLetter = customerLetter(c);
      state.guestGender = null;
      state.guestGenderPickerOpen = false;
      enterBill(c);
    }
  });
  document.getElementById('customerList')?.addEventListener('scroll', () => {
    if (pickIndexDragging) return;
    syncPickIndexFromScroll();
  }, { passive: true });

  let pickIndexDragging = false;
  let pickIndexLastLetter = '';
  const pickIndexEl = document.getElementById('pickIndex');
  function onPickIndexPointer(e, { end = false } = {}) {
    if (end) {
      pickIndexDragging = false;
      pickIndexLastLetter = '';
      hidePickIndexBubble();
      return;
    }
    const L = (e.clientY != null ? letterFromPickIndexY(e.clientY) : null)
      || e.target?.closest?.('[data-idx-letter]')?.dataset.idxLetter;
    if (!L || L === pickIndexLastLetter) return;
    pickIndexLastLetter = L;
    selectPickIndexLetter(L, { bubble: true, smooth: false });
  }
  pickIndexEl?.addEventListener('pointerdown', e => {
    pickIndexDragging = true;
    pickIndexLastLetter = '';
    try { pickIndexEl.setPointerCapture(e.pointerId); } catch (_) {}
    onPickIndexPointer(e);
    e.preventDefault();
  });
  pickIndexEl?.addEventListener('pointermove', e => {
    if (!pickIndexDragging) return;
    onPickIndexPointer(e);
    e.preventDefault();
  });
  pickIndexEl?.addEventListener('pointerup', e => onPickIndexPointer(e, { end: true }));
  pickIndexEl?.addEventListener('pointercancel', e => onPickIndexPointer(e, { end: true }));
  pickIndexEl?.addEventListener('lostpointercapture', () => onPickIndexPointer({}, { end: true }));

  document.getElementById('billBack')?.addEventListener('click', () => {
    if (state.billFromHold) {
      /* 未结账返回：挂单仍留在列表，仅结束本次取单会话 */
      state.billFromHold = false;
      state.activeHoldId = null;
      openHoldList();
      return;
    }
    openBillCustomer();
  });
  document.getElementById('btnBillGateOk')?.addEventListener('click', () => {
    const cards = (getCustomer().cards || []);
    if (!cards.length) {
      finishBillCardGate({ skip: true });
      return;
    }
    if (!state.billGateDraftCardId) {
      showToast('请选择会员卡');
      return;
    }
    finishBillCardGate({ cardId: state.billGateDraftCardId });
  });
  syncBillDateLabels();
  document.getElementById('btnBillDate')?.addEventListener('click', () => openBillDateSheet('bill'));
  document.getElementById('btnHold')?.addEventListener('click', createHoldOrder);
  document.getElementById('btnOpenHolds')?.addEventListener('click', openHoldList);
  document.getElementById('holdsBack')?.addEventListener('click', () => {
    if (window.__wbEntry === 'hold' && typeof openWorkbench === 'function') {
      window.__wbEntry = null;
      openWorkbench();
      return;
    }
    openBillCatalog();
  });
  document.getElementById('holdList')?.addEventListener('click', e => {
    const del = e.target.closest('[data-del-hold]');
    if (del) {
      e.stopPropagation();
      const delId = del.dataset.delHold;
      state.heldOrders = state.heldOrders.filter(h => h.id !== delId);
      if (state.activeHoldId === delId) {
        state.activeHoldId = null;
        state.billFromHold = false;
      }
      syncPickHoldsEntry();
      renderHoldList();
      showToast('已删除挂单');
      return;
    }
    const editAmt = e.target.closest('[data-edit-hold-price]');
    if (editAmt) {
      e.preventDefault();
      e.stopPropagation();
      openHoldPriceEditor(editAmt.dataset.editHoldPrice);
      return;
    }
    const card = e.target.closest('[data-resume-hold]');
    if (card) resumeHold(card.dataset.resumeHold);
  });
  document.getElementById('btnBillNext')?.addEventListener('click', () => {
    const c = getCustomer();
    if (!c.isMember && !hasGuestGender() && !isNamedWalkIn(c)) {
      showToast('请先选择散客性别或会员');
      return;
    }
    syncBillComposerMode();
    const draftLines = getDraftLines();
    if (state.billComposerMode === 'drafting' && draftLines.length) {
      if (!sealBillDraft()) return;
      renderBillHeader();
      syncCartChrome();
      showToast('已生成记账单');
      return;
    }
    if (!(state.billSlips || []).length) {
      showToast(state.cart.length ? '请先完成记账单' : '请先添加商品');
      return;
    }
    closeMask('cartSheetMask');
    closeMask('checkoutMask');
    openBillSettle();
  });
  document.getElementById('billStaffBack')?.addEventListener('click', () => openBillCatalog());
  document.getElementById('billStaffSkip')?.addEventListener('click', () => openBillSettle());
  document.getElementById('billStaffNext')?.addEventListener('click', () => openBillSettle());
  document.getElementById('btnBillStaffSheetDone')?.addEventListener('click', () => closeBillStaffSheet());
  document.getElementById('billStaffMask')?.addEventListener('click', e => {
    if (e.target.id === 'billStaffMask') closeBillStaffSheet();
  });
  document.getElementById('billStaffSheetRoot')?.addEventListener('click', e => {
    if (e.target.closest('[data-staff-scrim]')) {
      clearStaffCardEdit();
      renderBillStaffSheet();
      return;
    }
    const staffClear = e.target.closest('[data-staff-clear]');
    if (staffClear) {
      e.preventDefault();
      e.stopPropagation();
      const cartId = staffClear.dataset.cartId;
      const row = resolveStaffRow(cartId);
      if (!row) return;
      ensureCartStaffState(row);
      const sid = staffClear.dataset.staffId;
      row.staffIds = (row.staffIds || []).filter(x => x !== sid);
      delete row.staffRoles[sid];
      delete row.staffDesignated[sid];
      if (state.staffCardEdit && state.staffCardEdit.cartId === cartId && state.staffCardEdit.staffId === sid) {
        clearStaffCardEdit();
      }
      tapStaffHaptic();
      refreshStaffPickerUi(cartId);
      return;
    }
    const designateOpt = e.target.closest('[data-staff-opt-designate]');
    if (designateOpt) {
      e.preventDefault();
      e.stopPropagation();
      const cartId = designateOpt.dataset.cartId;
      const sid = designateOpt.dataset.staffId;
      if (!state.staffCardEdit || state.staffCardEdit.cartId !== cartId || state.staffCardEdit.staffId !== sid) return;
      const designated = designateOpt.dataset.staffOptDesignate === '1';
      const row = resolveStaffRow(cartId);
      if (!row) return;
      if (isAvgAchCalcModeForItem(row)) {
        ensureCartStaffState(row);
        if (!row.staffIds.includes(sid)) row.staffIds.push(sid);
        row.staffDesignated[sid] = designated;
        row.staffRoles[sid] = STAFF_ROLE_DEFAULT;
        clearStaffCardEdit();
        tapStaffHaptic();
        refreshStaffPickerUi(cartId);
        return;
      }
      state.staffCardEdit = {
        cartId,
        staffId: sid,
        face: 'role',
        draftDesignated: designated,
      };
      tapStaffHaptic();
      refreshStaffPickerUi(cartId);
      return;
    }
    const roleOpt = e.target.closest('[data-staff-opt-role]');
    if (roleOpt) {
      e.preventDefault();
      e.stopPropagation();
      const cartId = roleOpt.dataset.cartId;
      const sid = roleOpt.dataset.staffId;
      const row = resolveStaffRow(cartId);
      if (!row || !state.staffCardEdit || state.staffCardEdit.cartId !== cartId || state.staffCardEdit.staffId !== sid) return;
      ensureCartStaffState(row);
      if (!row.staffIds.includes(sid)) row.staffIds.push(sid);
      row.staffDesignated[sid] = !!state.staffCardEdit.draftDesignated;
      row.staffRoles[sid] = roleOpt.dataset.staffOptRole || STAFF_ROLE_DEFAULT;
      clearStaffCardEdit();
      tapStaffHaptic();
      refreshStaffPickerUi(cartId);
      return;
    }
    const staffHit = e.target.closest('[data-staff-card-hit]');
    if (staffHit) {
      e.preventDefault();
      const cartId = staffHit.dataset.cartId;
      const sid = staffHit.dataset.staffId;
      const row = resolveStaffRow(cartId);
      if (!row) return;
      ensureCartStaffState(row);
      state.staffCardEdit = { cartId, staffId: sid, face: 'designate', draftDesignated: null };
      tapStaffHaptic();
      refreshStaffPickerUi(cartId);
    }
  });
  document.getElementById('btnOpenCart')?.addEventListener('click', () => { renderCartList('cartSheetList'); openMask('cartSheetMask'); });
  function onClearCart() {
    if (!state.cart.length) { showToast('已选为空'); return; }
    clearCart();
    renderCartList('cartSheetList');
    showToast('已清空');
  }
  document.getElementById('btnClearCartSheet')?.addEventListener('click', onClearCart);

  function syncGuestRecordGenderUI(gender) {
    const seg = document.getElementById('guestRecordSegment');
    if (seg) {
      seg.classList.remove('is-male', 'is-female');
      seg.dataset.gender = gender || '';
      if (gender === 'male') seg.classList.add('is-male');
      else if (gender === 'female') seg.classList.add('is-female');
    }
    document.querySelectorAll('[data-record-gender]').forEach(btn => {
      const on = !!gender && btn.dataset.recordGender === gender;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    updateGuestRecordNamePreview();
  }
  function getGuestRecordSheetGender() {
    const seg = document.getElementById('guestRecordSegment');
    const g = seg?.dataset.gender;
    return g === 'male' || g === 'female' ? g : null;
  }
  function updateGuestRecordNamePreview() {
    const preview = document.getElementById('guestRecordPreview');
    const nameEl = document.getElementById('guestRecordPreviewName');
    const raw = document.getElementById('guestRecordName')?.value.trim() || '';
    const gender = getGuestRecordSheetGender();
    if (!preview || !nameEl) return;
    if (!gender) {
      preview.classList.add('hidden');
      nameEl.textContent = '';
      return;
    }
    nameEl.textContent = raw ? formatWalkInName(raw, gender) : (gender === 'male' ? '先生' : '小姐');
    preview.classList.remove('hidden');
  }
  function openGuestRecordSheet() {
    const nameEl = document.getElementById('guestRecordName');
    const phoneEl = document.getElementById('guestRecordPhone');
    if (nameEl) nameEl.value = '';
    if (phoneEl) phoneEl.value = '';
    syncGuestRecordGenderUI(hasGuestGender() ? state.guestGender : null);
    openMask('guestRecordMask');
    setTimeout(() => nameEl?.focus(), 120);
  }
  function saveGuestRecord() {
    const gender = getGuestRecordSheetGender();
    if (!gender) {
      showToast('请选择性别');
      return;
    }
    const rawName = document.getElementById('guestRecordName')?.value.trim() || '';
    if (!rawName) { showToast('请输入姓名'); return; }
    if (rawName.length > INPUT_LIMITS.PERSON_NAME) {
      showToast(`姓名最多 ${INPUT_LIMITS.PERSON_NAME} 字`);
      return;
    }
    const phoneRaw = document.getElementById('guestRecordPhone')?.value.trim() || '';
    const phone = phoneRaw.replace(/\D/g, '');
    if (phoneRaw && !isValidCnMobile(phone)) {
      showToast('请输入正确的手机号');
      return;
    }
    const name = formatWalkInName(rawName, gender);
    const customer = {
      id: 'w_' + Date.now(),
      name,
      phone,
      isMember: false,
      vip: false,
      gender,
      avatar: gender === 'male' ? AVATAR_MALE : AVATAR_FEMALE,
      lastVisit: null,
      cards: [],
    };
    CUSTOMERS.unshift(customer);
    state.guestGender = gender;
    state.customer = customer;
    state.guestGenderPickerOpen = false;
    closeMask('guestRecordMask');
    showToast('已录入：' + name);
    if (!document.getElementById('screen-bill').classList.contains('hidden')) renderBillHeader();
    if (!document.getElementById('screen-detail').classList.contains('hidden')) renderDetail();
  }

  document.getElementById('guestRecordMask')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-record-gender]');
    if (!btn) return;
    syncGuestRecordGenderUI(btn.dataset.recordGender);
  });
  document.getElementById('guestRecordName')?.addEventListener('input', updateGuestRecordNamePreview);

  function onGuestGenderClick(e) {
    const btn = e.target.closest('[data-guest-gender]');
    if (!btn) return;
    state.guestGender = btn.dataset.guestGender;
    state.customer = currentGuest();
    state.guestGenderPickerOpen = true;
    if (!document.getElementById('screen-bill').classList.contains('hidden')) renderBillHeader();
    if (!document.getElementById('screen-detail').classList.contains('hidden')) renderDetail();
  }
  function onGuestSwitchClick() {
    const onBill = !document.getElementById('screen-bill')?.classList.contains('hidden');
    const onDetail = !document.getElementById('screen-detail')?.classList.contains('hidden');
    if (onBill) {
      state.guestGenderPickerOpen = false;
      state.searchQuery = '';
      state.billCustomerPickOpen = !state.billCustomerPickOpen;
      renderBillHeader();
      return;
    }
    if (onDetail) {
      openMemberPicker();
    }
  }
  function onMemberSwitchClick() {
    const onBill = !document.getElementById('screen-bill')?.classList.contains('hidden');
    if (onBill) {
      state.guestGenderPickerOpen = false;
      state.searchQuery = '';
      state.billCustomerPickOpen = !state.billCustomerPickOpen;
      renderBillHeader();
      return;
    }
    openMemberPicker();
  }
  function pickBillGuest(gender) {
    state.guestGender = gender;
    state.customer = currentGuest();
    state.billCustomerPickOpen = false;
    state.guestGenderPickerOpen = false;
    state.searchQuery = '';
    state.cardsExpanded = false;
    resetBillCardPick();
    openBillCatalog({ skipGate: true });
    showToast(gender === 'male' ? '已选择男散客' : '已选择女散客');
  }
  function pickBillMember(id) {
    const c = CUSTOMERS.find(x => x.id === id);
    if (!c) return;
    state.guestGender = null;
    if (c.isMember) refreshCustomerCardsFromHoldings(c);
    state.customer = c;
    state.billCustomerPickOpen = false;
    state.guestGenderPickerOpen = false;
    state.searchQuery = '';
    state.cardsExpanded = false;
    resetBillCardPick();
    openBillCatalog();
    showToast(`已选择 ${c.name}`);
  }
  document.getElementById('billBody')?.addEventListener('click', e => {
    if (e.target.closest('[data-guest-switch]')) { onGuestSwitchClick(); return; }
    if (e.target.closest('[data-member-switch]')) { onMemberSwitchClick(); return; }
    if (e.target.closest('[data-guest-gender]')) { onGuestGenderClick(e); return; }
    const guestPick = e.target.closest('[data-bill-pick-guest]');
    if (guestPick) { pickBillGuest(guestPick.dataset.billPickGuest); return; }
    const memberPick = e.target.closest('[data-bill-pick-member]');
    if (memberPick) { pickBillMember(memberPick.dataset.billPickMember); return; }
    if (e.target.closest('[data-bill-continue-add]')) {
      continueAddBillSlip();
      renderBillHeader();
      syncCartChrome();
      return;
    }
    const actionTab = e.target.closest('[data-bill-action-tab]');
    if (actionTab) {
      setBillActionTab(actionTab.getAttribute('data-bill-action-tab'));
      return;
    }
    const heldCard = e.target.closest('[data-bill-held-card]');
    if (heldCard) {
      const rail = document.getElementById('billCardRailScroll');
      if (rail && rail.classList.contains('is-panning')) return;
      toggleBillPickCard(heldCard.getAttribute('data-bill-held-card'));
      return;
    }
    const timesTicket = e.target.closest('[data-bill-times-ticket]');
    if (timesTicket) {
      const rail = document.getElementById('billCardRailScroll');
      if (rail && rail.classList.contains('is-panning')) return;
      openTimesTicketDeductSheet(timesTicket.getAttribute('data-bill-times-ticket'));
      return;
    }
    if (e.target.closest('[data-bill-add-card]')) {
      const rail = document.getElementById('billCardRailScroll');
      if (rail && rail.classList.contains('is-panning')) return;
      openAddCardScreen();
      return;
    }
    if (e.target.id === 'btnBillQuickAdd' || e.target.closest('#btnBillQuickAdd')) {
      const inp = document.getElementById('billQuickAmt');
      submitBillQuickConsume(inp ? inp.value : state.billQuickAmtDraft);
      return;
    }
    const slipDel = e.target.closest('[data-bill-slip-delete]');
    if (slipDel) {
      deleteBillSlip(slipDel.getAttribute('data-bill-slip-delete'));
      return;
    }
    const slipEdit = e.target.closest('[data-bill-slip-edit]');
    if (slipEdit) {
      if (unsealSlipForEdit(slipEdit.getAttribute('data-bill-slip-edit'))) {
        renderBillHeader();
        syncCartChrome();
      }
      return;
    }
    if (e.target.closest('[data-bill-clear-cards]')) {
      state.billPickCardIds = [];
      state.billPickCardId = null;
      if (state.billDraft) state.billDraft.cardIds = [];
      renderBillHeader();
      syncCartChrome();
      return;
    }
    const gateCard = e.target.closest('[data-bill-gate-card]');
    if (gateCard) {
      state.billGateDraftCardId = gateCard.getAttribute('data-bill-gate-card');
      renderBillHeader();
      syncBillGateOkBtn();
      return;
    }
    if (e.target.closest('[data-bill-gate-skip]')) {
      finishBillCardGate({ skip: true });
      return;
    }
    if (e.target.closest('[data-bill-card-change]')) {
      openBillCardGate();
      return;
    }
    if (e.target.closest('[data-bill-card-clear]')) {
      finishBillCardGate({ skip: true });
      return;
    }
    if (e.target.closest('#btnRecordGuest')) { openGuestRecordSheet(); return; }
    if (e.target.id === 'btnBillAddCard' || e.target.id === 'btnBillAssetEmptyAdd') {
      openAddCardScreen();
      return;
    }
    if (e.target.id === 'btnBillCardAsset' || e.target.id === 'btnBillCardAssetAdd') {
      if (e.target.id === 'btnBillCardAssetAdd') { openAddCardScreen(); return; }
      openBillCardAssetScreen();
      return;
    }
    const rechargeBtn = e.target.closest('[data-bill-recharge]');
    if (rechargeBtn) { openBillRechargeSheet(rechargeBtn.dataset.billRecharge); return; }
    const timesBtn = e.target.closest('[data-bill-times-topup]');
    if (timesBtn) { openBillTimesTopup(timesBtn.dataset.billTimesTopup); return; }
    const extendBtn = e.target.closest('[data-bill-extend]');
    if (extendBtn) { openBillExtendSheet(extendBtn.dataset.billExtend); return; }
    const extendBlocked = e.target.closest('[data-bill-extend-blocked]');
    if (extendBlocked) { showToast('该卡永久有效，无需延期'); return; }
    const tab = e.target.closest('[data-tab]');
    if (tab) { state.billTab = tab.dataset.tab; renderBillHeader(); return; }
    const groupTab = e.target.closest('[data-bill-group]');
    if (groupTab) {
      const scroller = document.getElementById('billGroupTabs');
      if (scroller && scroller.classList.contains('is-panning')) return;
      const gid = groupTab.getAttribute('data-bill-group');
      if (!gid || gid === getActiveBillGroupId()) return;
      setActiveBillGroupId(gid);
      renderBillGroupTabs();
      renderBillCatalog();
      return;
    }
    if (e.target.id === 'btnBillStockAdd' || e.target.closest('#btnBillStockAdd')) {
      openBillStockPick();
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) {
      const catalog = getBillCatalogItems();
      const item = catalog.find(x => x.id === step.dataset.step);
      if (item) setCartQty(item, Number(step.dataset.d));
    }
  });
  document.getElementById('billStockPickCancel')?.addEventListener('click', () => closeMask('billStockPickMask'));
  document.getElementById('billStockPickOk')?.addEventListener('click', () => applyBillStockPick());
  document.getElementById('billStockPickList')?.addEventListener('click', (e) => {
    const row = e.target.closest('[data-bill-stock-sku]');
    if (!row || row.disabled) return;
    const id = row.dataset.billStockSku;
    if (!state.billStockPickSelected) state.billStockPickSelected = {};
    state.billStockPickSelected[id] = !state.billStockPickSelected[id];
    renderBillStockPickSheet();
  });
  document.getElementById('billStockToCatalogSkip')?.addEventListener('click', () => skipBillStockToCatalogAdds());
  document.getElementById('billStockToCatalogConfirm')?.addEventListener('click', () => confirmBillStockToCatalogAdds());
  document.getElementById('billStockToCatalogMask')?.addEventListener('click', (e) => {
    if (e.target.id === 'billStockToCatalogMask') skipBillStockToCatalogAdds();
  });
  document.getElementById('btnBillRechargeCancel')?.addEventListener('click', () => closeMask('billRechargeMask'));
  document.getElementById('btnBillRechargePay')?.addEventListener('click', payBillRecharge);
  document.getElementById('billRechargeMask')?.addEventListener('click', e => {
    if (e.target.id === 'billRechargeMask') closeMask('billRechargeMask');
  });
  document.getElementById('btnBillTimesCancel')?.addEventListener('click', () => closeMask('billTimesTopupMask'));
  document.getElementById('btnBillTimesPay')?.addEventListener('click', payBillTimesTopup);
  document.getElementById('billTimesTopupMask')?.addEventListener('click', e => {
    if (e.target.id === 'billTimesTopupMask') closeMask('billTimesTopupMask');
  });
  document.getElementById('billTimesTopupBody')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-times-key][data-times-d]');
    if (!btn || btn.disabled) return;
    bumpBillTimesAdd(btn.dataset.timesKey, Number(btn.dataset.timesD) || 0);
  });
  document.getElementById('btnBillExtendCancel')?.addEventListener('click', () => closeMask('billExtendMask'));
  document.getElementById('btnBillExtendConfirm')?.addEventListener('click', confirmBillExtend);
  document.getElementById('billExtendMask')?.addEventListener('click', e => {
    if (e.target.id === 'billExtendMask') closeMask('billExtendMask');
  });
  document.getElementById('btnBillTimesTicketCancel')?.addEventListener('click', () => closeMask('billTimesTicketMask'));
  document.getElementById('billTimesTicketMask')?.addEventListener('click', e => {
    if (e.target.id === 'billTimesTicketMask') closeMask('billTimesTicketMask');
  });
  document.getElementById('btnBillTimesTicketMinus')?.addEventListener('click', () => {
    state.billTimesTicketQty = Math.max(1, (Number(state.billTimesTicketQty) || 1) - 1);
    syncTimesTicketDeductStep();
  });
  document.getElementById('btnBillTimesTicketPlus')?.addEventListener('click', () => {
    state.billTimesTicketQty = (Number(state.billTimesTicketQty) || 1) + 1;
    syncTimesTicketDeductStep();
  });
  document.getElementById('btnBillTimesTicketConfirm')?.addEventListener('click', submitTimesTicketDeduct);
  document.getElementById('billTimesTicketStaffRow')?.addEventListener('click', () => {
    openBillStaffSheet('__ticket__');
  });
  document.getElementById('btnBillRechargeOk')?.addEventListener('click', closeBillAssetOk);
  document.getElementById('billRechargeOkMask')?.addEventListener('click', e => {
    if (e.target.id === 'billRechargeOkMask') closeBillAssetOk();
  });
  document.getElementById('billBody')?.addEventListener('input', e => {
    if (e.target.id === 'billSearch') {
      state.searchQuery = e.target.value;
      if (state.billCustomerPickOpen) {
        const list = document.getElementById('catalogList');
        if (list) list.innerHTML = renderBillCustomerPickList();
      } else {
        renderBillCatalog();
      }
    }
  });

  document.getElementById('cartSheetList')?.addEventListener('click', e => {
    const step = e.target.closest('[data-cart-step]');
    if (!step) return;
    const item = state.cart.find(x => x.id === step.dataset.cartStep) || getBillCatalogItems().find(x => x.id === step.dataset.cartStep);
    if (item) {
      setCartQty(item, Number(step.dataset.d));
      renderCartList('cartSheetList');
    }
  });

  document.getElementById('detailBack')?.addEventListener('click', () => {
    closeBillStaffSheet();
    openBillCatalog({ skipGate: true });
  });
  document.getElementById('btnDetailHold')?.addEventListener('click', createHoldOrder);
  document.getElementById('detailBody')?.addEventListener('click', e => {
    if (e.target.closest('[data-detail-biz-date]')) {
      openBillDateSheet('bill');
      return;
    }
    if (!e.target.closest('.detail-item__track.is-open') && !e.target.closest('[data-del-cart]')) closeAllDetailSwipes();
    if (e.target.closest('[data-guest-switch]')) { onGuestSwitchClick(); return; }
    if (e.target.closest('[data-member-switch]')) { onMemberSwitchClick(); return; }
    if (e.target.closest('[data-guest-gender]')) { onGuestGenderClick(e); return; }
    if (e.target.closest('#btnRecordGuest')) { openGuestRecordSheet(); return; }
    const openStaff = e.target.closest('[data-open-bill-staff]');
    if (openStaff) {
      openBillStaffSheet(openStaff.getAttribute('data-open-bill-staff'));
      return;
    }
    const summaryDel = e.target.closest('[data-staff-summary-del]');
    if (summaryDel) {
      e.preventDefault();
      e.stopPropagation();
      const cartId = summaryDel.getAttribute('data-cart-id');
      const sid = summaryDel.getAttribute('data-staff-id');
      const row = resolveStaffRow(cartId);
      if (!row) return;
      ensureCartStaffState(row);
      row.staffIds = (row.staffIds || []).filter(x => x !== sid);
      delete row.staffRoles[sid];
      delete row.staffDesignated[sid];
      tapStaffHaptic();
      renderDetail();
      return;
    }
    const del = e.target.closest('[data-del-cart]');
    if (del) {
      state.cart = state.cart.filter(x => x.id !== del.dataset.delCart);
      clearStaffCardEdit();
      syncCartChrome();
      if (!state.cart.length) {
        showToast('已无商品，返回开单台');
        showOnlyScreen('screen-bill');
        return;
      }
      renderDetail();
      return;
    }
    const expand = e.target.closest('[data-expand-item]');
    if (expand) {
      const id = expand.dataset.expandItem;
      state.detailExpandedId = state.detailExpandedId === id ? null : id;
      clearStaffCardEdit();
      renderDetail();
      return;
    }
    if (e.target.closest('[data-staff-scrim]')) {
      const editId = state.staffCardEdit && state.staffCardEdit.cartId;
      clearStaffCardEdit();
      if (editId) refreshStaffPickerUi(editId);
      else if (!document.getElementById('screen-detail')?.classList.contains('hidden')) renderDetail();
      else renderAddCardStaffOnly();
      return;
    }
    const staffClear = e.target.closest('[data-staff-clear]');
    if (staffClear) {
      e.preventDefault();
      e.stopPropagation();
      const cartId = staffClear.dataset.cartId;
      const row = resolveStaffRow(cartId);
      if (!row) return;
      ensureCartStaffState(row);
      const sid = staffClear.dataset.staffId;
      row.staffIds = (row.staffIds || []).filter(x => x !== sid);
      delete row.staffRoles[sid];
      delete row.staffDesignated[sid];
      if (state.staffCardEdit && state.staffCardEdit.cartId === cartId && state.staffCardEdit.staffId === sid) {
        clearStaffCardEdit();
      }
      tapStaffHaptic();
      refreshStaffPickerUi(cartId);
      return;
    }
    const designateOpt = e.target.closest('[data-staff-opt-designate]');
    if (designateOpt) {
      e.preventDefault();
      e.stopPropagation();
      const cartId = designateOpt.dataset.cartId;
      const sid = designateOpt.dataset.staffId;
      if (!state.staffCardEdit || state.staffCardEdit.cartId !== cartId || state.staffCardEdit.staffId !== sid) return;
      const designated = designateOpt.dataset.staffOptDesignate === '1';
      const row = resolveStaffRow(cartId);
      if (!row) return;
      if (isAvgAchCalcModeForItem(row)) {
        ensureCartStaffState(row);
        if (!row.staffIds.includes(sid)) row.staffIds.push(sid);
        row.staffDesignated[sid] = designated;
        row.staffRoles[sid] = STAFF_ROLE_DEFAULT;
        clearStaffCardEdit();
        tapStaffHaptic();
        refreshStaffPickerUi(cartId);
        return;
      }
      state.staffCardEdit = {
        cartId,
        staffId: sid,
        face: 'role',
        draftDesignated: designated,
      };
      tapStaffHaptic();
      refreshStaffPickerUi(cartId);
      return;
    }
    const roleOpt = e.target.closest('[data-staff-opt-role]');
    if (roleOpt) {
      e.preventDefault();
      e.stopPropagation();
      const cartId = roleOpt.dataset.cartId;
      const sid = roleOpt.dataset.staffId;
      const row = resolveStaffRow(cartId);
      if (!row || !state.staffCardEdit || state.staffCardEdit.cartId !== cartId || state.staffCardEdit.staffId !== sid) return;
      ensureCartStaffState(row);
      if (!row.staffIds.includes(sid)) row.staffIds.push(sid);
      row.staffDesignated[sid] = !!state.staffCardEdit.draftDesignated;
      row.staffRoles[sid] = roleOpt.dataset.staffOptRole || STAFF_ROLE_DEFAULT;
      clearStaffCardEdit();
      tapStaffHaptic();
      refreshStaffPickerUi(cartId);
      return;
    }
    const staffHit = e.target.closest('[data-staff-card-hit]');
    if (staffHit) {
      e.preventDefault();
      const cartId = staffHit.dataset.cartId;
      const sid = staffHit.dataset.staffId;
      const row = resolveStaffRow(cartId);
      if (!row) return;
      ensureCartStaffState(row);
      state.staffCardEdit = { cartId, staffId: sid, face: 'designate', draftDesignated: null };
      tapStaffHaptic();
      refreshStaffPickerUi(cartId);
      return;
    }
    const benefitLine = e.target.closest('[data-open-benefit-line]');
    if (benefitLine) {
      if (!isMemberBill()) { showToast('散客暂无会员卡权益'); return; }
      state.benefitFocusLineId = benefitLine.getAttribute('data-open-benefit-line') || null;
      state.benefitDraft = JSON.parse(JSON.stringify(state.benefitApplied));
      state.benefitSkip = false;
      renderBenefitPicker();
      showOnlyScreen('screen-pick-benefit');
      return;
    }
    if (e.target.closest('[data-open-benefit]')) {
      if (!isMemberBill()) { showToast('散客暂无会员卡权益'); return; }
      state.benefitFocusLineId = null;
      state.benefitDraft = JSON.parse(JSON.stringify(state.benefitApplied));
      state.benefitSkip = false;
      renderBenefitPicker(); showOnlyScreen('screen-pick-benefit');
      return;
    }
    if (e.target.closest('[data-open-coupon]')) openCouponScreen();
    const editSub = e.target.closest('[data-edit-line-subtotal]');
    if (editSub) {
      openLineSubtotalEditor(editSub.getAttribute('data-edit-line-subtotal'));
      return;
    }
  });
  document.getElementById('detailBody')?.addEventListener('input', e => {
    if (e.target.id === 'orderRemarkInput') {
      state.orderRemark = e.target.value.slice(0, 500);
      const cnt = e.target.parentElement.querySelector('.detail-remark__count');
      if (cnt) cnt.textContent = `${state.orderRemark.length}/500`;
      return;
    }
    const unit = e.target.closest('[data-unit-price]');
    if (unit) {
      const row = state.cart.find(x => x.id === unit.dataset.unitPrice);
      if (!row) return;
      row.unitPrice = round2(Math.max(0, Number(unit.value) || 0));
      syncDetailDueBar();
    }
  });
  document.getElementById('detailBody')?.addEventListener('change', e => {
    const unit = e.target.closest('[data-unit-price]');
    if (unit) {
      const row = state.cart.find(x => x.id === unit.dataset.unitPrice);
      if (row) {
        row.unitPrice = round2(Math.max(0, Number(unit.value) || 0));
        renderDetail();
      }
    }
  });
  document.getElementById('btnDetailDueEdit')?.addEventListener('click', () => openBillDueEditor());
  document.getElementById('btnGoPay')?.addEventListener('click', () => {
    if (cartHasUnsetStaffRoles()) {
      showToast('请为已选员工设置工位（' + stationRoleLabelsJoined() + '）', true);
      return;
    }
    clampCartToProductStock({ toast: true });
    if (!state.cart.length) {
      showToast('购物车为空');
      return;
    }
    snapshotBillPayDue();
    openMask('checkoutMask');
    setFlowNavHighlight('checkout');
  });
  document.getElementById('btnCheckoutScanMe')?.addEventListener('click', () => {
    closeMask('checkoutMask');
    state.lastSettlement = calcSettlement();
    renderScanMe();
    showOnlyScreen('screen-scan-me');
  });
  document.getElementById('btnCheckoutScanCust')?.addEventListener('click', () => {
    closeMask('checkoutMask');
    showOnlyScreen('screen-scan-cust');
  });
  document.getElementById('btnCheckoutBill')?.addEventListener('click', () => {
    closeMask('checkoutMask', { keepCardIssueDraft: true });
    state.payAmounts = {};
    renderPayChannels();
    openBillPayMask();
  });
  document.getElementById('btnPayAmountChangedOk')?.addEventListener('click', () => {
    dismissPayAmountChanged();
  });
  document.getElementById('scanMeBack')?.addEventListener('click', () => showOnlyScreen('screen-detail'));
  document.getElementById('scanCustBack')?.addEventListener('click', () => showOnlyScreen('screen-detail'));
  document.getElementById('scanMeBody')?.addEventListener('click', e => {
    if (e.target.id === 'btnVoiceCollect' || e.target.closest('#btnVoiceCollect')) {
      state.voiceCollect = !state.voiceCollect;
      renderScanMe();
    }
  });
  document.querySelector('#screen-scan-cust .scan-cust-roles')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-scan-role]');
    if (!btn) return;
    const role = btn.dataset.scanRole;
    showToast(role === 'member' ? '已识别会员（演示）' : role === 'card' ? '进入办卡开单（演示）' : '散客开单（演示）');
    if (role === 'guest') { state.guestGender = 'female'; enterBill(currentGuest()); }
    else if (role === 'member') enterBill(CUSTOMERS[0]);
    else openAddCardScreen();
  });

  document.getElementById('benefitBack')?.addEventListener('click', () => { renderDetail(); showOnlyScreen('screen-detail'); });
  document.getElementById('btnBenefitDone')?.addEventListener('click', () => { state.settleOffersTouched = true; applyBenefitDraft(); enforceSettleOfferMutex('benefit'); renderDetail(); showOnlyScreen('screen-detail'); });
  document.getElementById('couponBack')?.addEventListener('click', () => { renderDetail(); showOnlyScreen('screen-detail'); });
  document.getElementById('btnCouponConfirm')?.addEventListener('click', () => {
    const draft = state.couponDraftId;
    if (draft) {
      const cp = COUPONS.find(c => c.id === draft);
      if (cp && cartDiscountableSubtotal() <= 0) {
        showToast('优惠券仅适用于服务项目');
        return;
      }
      if (cp && cartListTotal() < (cp.minAmount || 0)) {
        showToast(`未满 ${cp.minAmount} 元门槛，无法使用`);
        return;
      }
    }
    state.settleOffersTouched = true;
    state.selectedCouponId = draft;
    enforceSettleOfferMutex('coupon');
    clearBillDueOverride();
    renderDetail();
    showOnlyScreen('screen-detail');
  });
  document.getElementById('couponList')?.addEventListener('click', e => {
    const rules = e.target.closest('[data-coupon-rules]');
    if (rules) {
      e.stopPropagation();
      const id = rules.dataset.couponRules;
      state.couponRulesOpen[id] = !state.couponRulesOpen[id];
      renderCouponPage();
      return;
    }
    if (e.target.closest('[data-coupon-none]')) {
      state.couponDraftId = null;
      renderCouponPage();
      return;
    }
    const card = e.target.closest('[data-coupon-id]');
    if (!card) return;
    if (card.dataset.couponDisabled === '1') {
      const cp = COUPONS.find(c => c.id === card.dataset.couponId);
      const gate = cp ? couponEligibleByOrderTotal(cp) : null;
      if (gate && !gate.ok) {
        showToast(cp.tag === '抵用券'
          ? '购物车未含可抵用的项目/产品'
          : `开单总价还差 ${formatYen(gate.shortfall)}，未满 ${gate.min} 元门槛`);
      } else {
        showToast('该优惠券暂不可用');
      }
      return;
    }
    state.couponDraftId = card.dataset.couponId;
    renderCouponPage();
  });
  document.getElementById('benefitBody')?.addEventListener('click', e => {
    if (e.target.closest('[data-benefit-use]')) {
      state.benefitSkip = false;
      renderBenefitPicker();
      return;
    }
    if (e.target.closest('[data-benefit-none]')) {
      if (state.benefitSkip) {
        state.benefitSkip = false;
      } else {
        state.benefitSkip = true;
        state.benefitDraft = {};
      }
      renderBenefitPicker();
      return;
    }
    if (e.target.id === 'btnOpenDiscount' || e.target.closest('#btnOpenDiscount')) {
      renderDiscountPage();
      showOnlyScreen('screen-discount');
      return;
    }
    const fixed = e.target.closest('[data-fixed]');
    if (fixed) {
      const d = state.benefitDraft[fixed.dataset.fixed];
      d.fixedUse = !d.fixedUse;
      if (d.fixedUse) d.balanceUse = Math.max(Number(d.balanceUse) || 0, 98);
      state.benefitSkip = false;
      renderBenefitPicker();
      return;
    }
    const disc = e.target.closest('[data-disc]');
    if (disc) {
      state.benefitSkip = false;
      const d = state.benefitDraft[disc.dataset.disc];
      d.discountOn = !d.discountOn; renderBenefitPicker(); return;
    }
    const proj = e.target.closest('[data-proj]');
    if (proj) {
      state.benefitSkip = false;
      const card = getCustomer().cards.find(c => c.id === proj.dataset.proj);
      const d = state.benefitDraft[proj.dataset.proj];
      const idx = Number(proj.dataset.idx);
      const max = card.projects[idx].remain;
      d.projects[idx].qty = Math.max(0, Math.min(max, d.projects[idx].qty + Number(proj.dataset.d)));
      renderBenefitPicker();
    }
  });
  document.getElementById('benefitBody')?.addEventListener('input', e => {
    const bal = e.target.closest('[data-bal]');
    if (bal) {
      state.benefitSkip = false;
      state.benefitDraft[bal.dataset.bal].balanceUse = Math.max(0, Number(bal.value) || 0);
    }
  });
  document.getElementById('discountBack')?.addEventListener('click', () => {
    renderBenefitPicker();
    showOnlyScreen('screen-pick-benefit');
  });
  document.getElementById('discountBody')?.addEventListener('click', e => {
    const check = e.target.closest('[data-disc-check]');
    if (!check) return;
    const cat = state.discountCats.find(c => c.id === check.dataset.discCheck);
    if (cat) { cat.on = !cat.on; renderDiscountPage(); }
  });
  document.getElementById('discountBody')?.addEventListener('input', e => {
    const inp = e.target.closest('[data-disc-rate]');
    if (!inp) return;
    const cat = state.discountCats.find(c => c.id === inp.dataset.discRate);
    if (cat) cat.rate = Math.max(0, Math.min(10, Number(inp.value) || 0));
  });
  document.getElementById('btnDiscountBatch')?.addEventListener('click', () => {
    const base = state.discountCats.find(c => c.id === 'all')?.rate || 8.5;
    state.discountCats.forEach(c => { if (c.on) c.rate = base; });
    renderDiscountPage();
    showToast('已批量套用折扣');
  });
  document.getElementById('btnDiscountSave')?.addEventListener('click', () => {
    showToast('折扣权益已保存（演示）');
    renderBenefitPicker();
    showOnlyScreen('screen-pick-benefit');
  });

  document.getElementById('btnGuestRecordSave')?.addEventListener('click', saveGuestRecord);

  document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', () => closeMask(btn.dataset.close)));
  document.querySelectorAll('[data-mask-close]').forEach(mask => {
    mask.addEventListener('click', e => {
      if (e.target === mask) closeMask(mask.dataset.maskClose);
    });
  });
  /* 开单/流水等 picker：点遮罩走本模块 closeMask（含结账/分账副作用） */
  window.__pickerMaskClosers = window.__pickerMaskClosers || Object.create(null);
  [
    'cartSheetMask', 'checkoutMask', 'payMask', 'guestRecordMask',
    'billRechargeMask', 'billTimesTopupMask', 'billExtendMask', 'billTimesTicketMask', 'addCardStaffMask',
    'billStockPickMask',
    'flowFilterMask', 'flowMoreMask', 'flowRangeMask',
  ].forEach(function (id) {
    window.__pickerMaskClosers[id] = function () { closeMask(id); };
  });
  window.__pickerMaskClosers.flowRangeMask = function () { cancelFlowRangeSheet(); };
  window.__pickerMaskClosers.addCardStaffMask = function () { closeAddCardStaffSheet(); };
  document.getElementById('addCardBack')?.addEventListener('click', () => {
    clearStaffCardEdit();
    closeMask('addCardStaffMask');
    /* 会员卡列表「办卡」进入选员工时，返回卡列表而非开单台 */
    if (state.lastIssueFromCardMgmt && state.cardIssuePending) {
      leaveQuickIssueToCardList();
      return;
    }
    renderBillHeader();
    showOnlyScreen('screen-bill');
  });
  document.getElementById('billCardAssetBack')?.addEventListener('click', () => {
    openBillCatalog({ skipGate: true });
  });
  document.getElementById('btnBillCardAssetAdd')?.addEventListener('click', () => {
    openAddCardScreen();
  });
  document.getElementById('billCardAssetList')?.addEventListener('click', e => {
    if (e.target.id === 'btnBillAssetEmptyAdd' || e.target.closest('#btnBillAssetEmptyAdd')) {
      openAddCardScreen();
      return;
    }
    const rechargeBtn = e.target.closest('[data-bill-recharge]');
    if (rechargeBtn) { openBillRechargeSheet(rechargeBtn.dataset.billRecharge); return; }
    const timesBtn = e.target.closest('[data-bill-times-topup]');
    if (timesBtn) { openBillTimesTopup(timesBtn.dataset.billTimesTopup); return; }
    const extendBtn = e.target.closest('[data-bill-extend]');
    if (extendBtn) { openBillExtendSheet(extendBtn.dataset.billExtend); return; }
  });
  document.getElementById('addCardPickBack')?.addEventListener('click', () => {
    closeAddCardPickScreen();
  });
  document.getElementById('quickIssueBack')?.addEventListener('click', () => {
    leaveQuickIssueToCardList();
  });
  document.getElementById('btnQuickIssueDate')?.addEventListener('click', () => openBillDateSheet('issue'));
  document.getElementById('quickIssueStaffRow')?.addEventListener('click', () => {
    openAddCardStaffSheet();
  });
  document.getElementById('btnQuickIssueNext')?.addEventListener('click', () => {
    confirmQuickIssueCheckout();
  });
  document.getElementById('btnAddCardBizDate')?.addEventListener('click', () => openBillDateSheet('issue'));
  document.querySelector('.add-card-decision-scroll')?.addEventListener('click', e => {
    if (e.target.closest('[data-add-card-biz-date]')) openBillDateSheet('issue');
  });
  document.getElementById('btnBillDateCancel')?.addEventListener('click', () => closeBillDateSheet());
  document.getElementById('btnBillDateOk')?.addEventListener('click', () => confirmBillDateDraft());
  document.getElementById('billDateQuick')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-bill-date-quick]');
    if (!btn) return;
    const key = btn.dataset.billDateQuick === 'yesterday' ? billDaysAgoKey(1) : billTodayKey();
    state.billBizDateDraft = clampBillBizDate(key);
    const anchor = parseBillDateKey(state.billBizDateDraft);
    if (anchor) {
      state.billBizCalYear = anchor.y;
      state.billBizCalMonth = anchor.m;
    }
    renderBillDateCalendar();
  });
  document.getElementById('billDateCal')?.addEventListener('click', e => {
    const nav = e.target.closest('[data-bill-cal-nav]');
    if (nav) {
      shiftBillDateCalMonth(Number(nav.dataset.billCalNav) || 0);
      return;
    }
    const day = e.target.closest('[data-bill-cal-day]');
    if (!day || day.disabled) return;
    state.billBizDateDraft = clampBillBizDate(day.dataset.billCalDay);
    renderBillDateCalendar();
  });
  document.getElementById('billDateMask')?.addEventListener('click', e => {
    if (e.target.id === 'billDateMask') closeBillDateSheet();
  });
  document.getElementById('addCardMode')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-add-mode]');
    if (!btn) return;
    state.addCardMode = btn.dataset.addMode;
    renderAddCardDecision();
  });
  document.getElementById('addCardSlot')?.addEventListener('click', e => {
    if (!e.target.closest('[data-add-card-pick]')) return;
    openAddCardPickScreen({ scrollSelected: true });
  });
  document.getElementById('btnAddCardCreate')?.addEventListener('click', () => {
    if (typeof openCreateFlowFromBilling === 'function') openCreateFlowFromBilling();
    else if (window.CardHost && typeof window.CardHost.openCreateFlowFromBilling === 'function') {
      window.CardHost.openCreateFlowFromBilling();
    }
  });
  document.getElementById('addCardGroupTabs')?.addEventListener('click', e => {
    const tabsEl = document.getElementById('addCardGroupTabs');
    if (tabsEl?.classList.contains('is-panning')) return;
    const tab = e.target.closest('[data-add-card-group]');
    if (!tab) return;
    const id = tab.dataset.addCardGroup;
    if (!id || (typeof getActiveCardGroupId === 'function' && id === getActiveCardGroupId('billing'))) return;
    if (typeof setActiveCardGroupId === 'function') setActiveCardGroupId('billing', id);
    renderAddCardPickList();
  });
  document.getElementById('addCardList')?.addEventListener('click', e => {
    const cloneBtn = e.target.closest('[data-clone-template]');
    if (cloneBtn) {
      e.preventDefault();
      e.stopPropagation();
      const tid = cloneBtn.dataset.cloneTemplate;
      if (typeof openDuplicateFlowFromBilling === 'function') openDuplicateFlowFromBilling(tid);
      else if (window.CardHost && typeof window.CardHost.openDuplicateFlowFromBilling === 'function') {
        window.CardHost.openDuplicateFlowFromBilling(tid);
      }
      return;
    }
    const card = e.target.closest('[data-template-id]');
    if (!card) return;
    const nextId = card.dataset.templateId;
    if (nextId !== state.selectedTemplateId) {
      state.selectedTemplateId = nextId;
      const nextTpl = CARD_TEMPLATES.find(t => t.id === nextId)
        || (typeof getTemplate === 'function' ? getTemplate(nextId) : null);
      ensureCardIssuePayForTemplate(nextTpl, { forceDefault: true });
    }
    closeAddCardPickScreen();
  });
  document.getElementById('btnQuickIssuePayEdit')?.addEventListener('click', () => {
    const tid = state.cardIssuePending?.templateId || state.selectedTemplateId;
    const tpl = (typeof getTemplate === 'function' ? getTemplate(tid) : null)
      || (typeof getTemplateById === 'function' ? getTemplateById(tid) : null)
      || CARD_TEMPLATES.find(t => t.id === tid);
    openCardIssuePayKeypad(tpl);
  });
  document.getElementById('btnAddCardPayEdit')?.addEventListener('click', () => {
    const tpl = CARD_TEMPLATES.find(t => t.id === state.selectedTemplateId)
      || (typeof getTemplate === 'function' ? getTemplate(state.selectedTemplateId) : null);
    openCardIssuePayKeypad(tpl);
  });
  document.getElementById('addCardStaffRow')?.addEventListener('click', () => {
    openAddCardStaffSheet();
  });
  document.getElementById('btnAddCardStaffDone')?.addEventListener('click', () => {
    closeAddCardStaffSheet();
  });
  document.getElementById('addCardStaffMask')?.addEventListener('click', e => {
    if (e.target === document.getElementById('addCardStaffMask')) {
      closeAddCardStaffSheet();
      return;
    }
    if (e.target.closest('[data-staff-scrim]')) {
      const editId = state.staffCardEdit && state.staffCardEdit.cartId;
      clearStaffCardEdit();
      refreshStaffPickerUi(editId || '__issue__');
      return;
    }
    const staffClear = e.target.closest('[data-staff-clear]');
    if (staffClear) {
      e.preventDefault();
      e.stopPropagation();
      const cartId = staffClear.dataset.cartId || '__issue__';
      const row = resolveStaffRow(cartId);
      if (!row) return;
      ensureCartStaffState(row);
      const sid = staffClear.dataset.staffId;
      row.staffIds = (row.staffIds || []).filter(x => x !== sid);
      delete row.staffRoles[sid];
      delete row.staffDesignated[sid];
      if (state.staffCardEdit && state.staffCardEdit.cartId === cartId && state.staffCardEdit.staffId === sid) {
        clearStaffCardEdit();
      }
      tapStaffHaptic();
      refreshStaffPickerUi(cartId);
      return;
    }
    const designateOpt = e.target.closest('[data-staff-opt-designate]');
    if (designateOpt) {
      e.preventDefault();
      e.stopPropagation();
      const cartId = designateOpt.dataset.cartId || '__issue__';
      const sid = designateOpt.dataset.staffId;
      if (!state.staffCardEdit || state.staffCardEdit.cartId !== cartId || state.staffCardEdit.staffId !== sid) return;
      const designated = designateOpt.dataset.staffOptDesignate === '1';
      const row = resolveStaffRow(cartId);
      if (!row) return;
      if (isAvgAchCalcModeForItem(row)) {
        ensureCartStaffState(row);
        if (!row.staffIds.includes(sid)) row.staffIds.push(sid);
        row.staffDesignated[sid] = designated;
        row.staffRoles[sid] = STAFF_ROLE_DEFAULT;
        clearStaffCardEdit();
        tapStaffHaptic();
        refreshStaffPickerUi(cartId);
        return;
      }
      state.staffCardEdit = { cartId, staffId: sid, face: 'role', draftDesignated: designated };
      tapStaffHaptic();
      refreshStaffPickerUi(cartId);
      return;
    }
    const roleOpt = e.target.closest('[data-staff-opt-role]');
    if (roleOpt) {
      e.preventDefault();
      e.stopPropagation();
      const cartId = roleOpt.dataset.cartId || '__issue__';
      const sid = roleOpt.dataset.staffId;
      const row = resolveStaffRow(cartId);
      if (!row || !state.staffCardEdit || state.staffCardEdit.cartId !== cartId || state.staffCardEdit.staffId !== sid) return;
      ensureCartStaffState(row);
      if (!row.staffIds.includes(sid)) row.staffIds.push(sid);
      row.staffDesignated[sid] = !!state.staffCardEdit.draftDesignated;
      row.staffRoles[sid] = roleOpt.dataset.staffOptRole || STAFF_ROLE_DEFAULT;
      clearStaffCardEdit();
      tapStaffHaptic();
      refreshStaffPickerUi(cartId);
      return;
    }
    const staffHit = e.target.closest('[data-staff-card-hit]');
    if (!staffHit) return;
    e.preventDefault();
    const cartId = staffHit.dataset.cartId || '__issue__';
    const sid = staffHit.dataset.staffId;
    const row = resolveStaffRow(cartId);
    if (!row) return;
    ensureCartStaffState(row);
    state.staffCardEdit = { cartId, staffId: sid, face: 'designate', draftDesignated: null };
    tapStaffHaptic();
    refreshStaffPickerUi(cartId);
  });
  document.getElementById('btnAddCardNext')?.addEventListener('click', () => {
    if (state.addCardMode === 'legacy') {
      showToast('补录老卡后续开放');
      return;
    }
    if (!state.selectedTemplateId) {
      showToast('请先选择卡模板');
      return;
    }
    const tpl = CARD_TEMPLATES.find(t => t.id === state.selectedTemplateId)
      || (typeof getTemplate === 'function' ? getTemplate(state.selectedTemplateId) : null);
    if (!tpl) {
      showToast('未找到该卡模板');
      return;
    }
    const staffErr = issueStaffSelectionError();
    if (staffErr) {
      showToast(staffErr, true);
      return;
    }
    const c = getCustomer();
    if (!c || c.isMember === false || String(c.id || '').indexOf('guest') === 0) {
      showToast('请先选择会员顾客再办卡', true);
      return;
    }
    const amount = getCardIssuePayAmount(tpl);
    const staff = snapshotIssueStaff();
    startCardIssueCheckout({
      templateId: tpl.id,
      memberId: c.id,
      cardName: tpl.name,
      amount,
      cardHtml: (window.CardHost && typeof window.CardHost.renderIssueSuccessCardFace === 'function')
        ? window.CardHost.renderIssueSuccessCardFace(tpl.id)
        : '',
      staff,
      skipStaffScreen: true,
    });
  });

  document.getElementById('payChannels')?.addEventListener('click', e => {
    const clear = e.target.closest('[data-pay-clear]');
    if (clear) {
      e.stopPropagation();
      const id = clear.dataset.payClear;
      state.payAmounts[id] = 0;
      if (state.payManualEdit) state.payManualEdit[id] = false;
      if (state.payEditingId === id) state.payEditingId = null;
      if (state.payActiveAmtId === id) state.payActiveAmtId = null;
      if (state.payChannel === id) {
        const next = payChannelDefs().find(c => Number(state.payAmounts[c.id]) > 0);
        if (next) state.payChannel = next.id;
      }
      renderPayChannels();
      return;
    }
    if (e.target.closest('[data-pay-amt]')) return;
    const ch = e.target.closest('.pay-channel[data-pay]');
    if (!ch) return;
    const id = ch.dataset.pay;
    const inp = ch.querySelector('[data-pay-amt]');
    if (inp) {
      inp.focus();
      return;
    }
    state.payChannel = id;
    applyPayFocusFill(id);
    renderPayChannels();
  });
  document.getElementById('payChannels')?.addEventListener('change', e => {
    const radio = e.target.closest('input[name="payMembercardCard"]');
    if (!radio) return;
    state.payMembercardCardId = radio.value;
    state.payChannel = 'membercard';
    const avail = getMembercardBalanceAvailable(radio.value);
    const cur = round2(Number(state.payAmounts.membercard) || 0);
    if (cur > avail) state.payAmounts.membercard = avail;
    else if (!(cur > 0)) {
      const remain = payChannelRemain('membercard');
      if (remain > 0) state.payAmounts.membercard = remain;
    }
    renderPayChannels();
  });
  let paySkipBlurClear = false;
  document.getElementById('payChannels')?.addEventListener('focusin', e => {
    const inp = e.target.closest('[data-pay-amt]');
    if (!inp) return;
    applyPayFocusFill(inp.dataset.payAmt);
  });
  document.getElementById('payChannels')?.addEventListener('focusout', e => {
    const inp = e.target.closest('[data-pay-amt]');
    if (!inp) return;
    if (paySkipBlurClear) {
      paySkipBlurClear = false;
      return;
    }
    commitPayInputEl(inp);
    if (state.payEditingId === inp.dataset.payAmt) {
      state.payEditingId = null;
      inp.readOnly = true;
    }
    updatePaySheetTotals();
  });
  document.getElementById('payChannels')?.addEventListener('dblclick', e => {
    const inp = e.target.closest('[data-pay-amt]');
    if (!inp) return;
    const id = inp.dataset.payAmt;
    state.payEditingId = id;
    inp.readOnly = false;
    try { inp.focus(); inp.select(); } catch (_) { /* ignore */ }
  });
  document.getElementById('payChannels')?.addEventListener('input', e => {
    const inp = e.target.closest('[data-pay-amt]');
    if (!inp) return;
    const id = inp.dataset.payAmt;
    state.payAmounts[id] = Math.max(0, Number(inp.value) || 0);
    if (!state.payManualEdit) state.payManualEdit = {};
    state.payManualEdit[id] = true;
    if (Number(state.payAmounts[id]) > 0) state.payChannel = id;
    updatePaySheetTotals();
  });
  document.getElementById('btnConfirmPay')?.addEventListener('pointerdown', () => {
    const ae = document.activeElement;
    const inp = ae && ae.closest ? ae.closest('[data-pay-amt]') : null;
    if (!inp) return;
    commitPayInputEl(inp);
    paySkipBlurClear = true;
  });
  document.getElementById('payMetaBlock')?.addEventListener('click', (e) => {
    if (e.target.closest('#payFreeToggleRow') || e.target.closest('#payFreeSwitch')) {
      state.orderIsFree = !state.orderIsFree;
      if (state.orderIsFree) {
        state.payAmounts = {};
        state.payManualEdit = {};
      }
      renderPayChannels();
      return;
    }
  });
  document.getElementById('btnConfirmPay')?.addEventListener('click', () => {
    const ae = document.activeElement;
    const focusedPay = ae && ae.closest ? ae.closest('[data-pay-amt]') : null;
    if (focusedPay) commitPayInputEl(focusedPay);
    paySkipBlurClear = false;
    if (!state.billAssetPay && !guardBillPayConfirmOrBlock()) {
      closeMask('payMask');
      return;
    }
    const dueCash = getActivePayDue();
    const cashFilled = payCashFilledTotal();
    if (dueCash > 0 && cashFilled + 0.001 < dueCash) {
      showToast(`支付金额不足，还差 ${formatYen(dueCash - cashFilled)}`);
      return;
    }
    const mcReq = round2(Number(state.payAmounts?.membercard) || 0);
    if (mcReq > 0) {
      if (!canPayWithMembercardFace()) {
        showToast('含面值的会员卡不能用面值支付办卡款');
        clearMembercardPayIfBlocked();
        renderPayChannels();
        return;
      }
      ensurePayMembercardCardId();
      const mcAvail = getMembercardBalanceAvailable();
      if (!state.payMembercardCardId || mcAvail <= 0) {
        showToast('请选择用于抵扣的会员卡');
        return;
      }
      if (mcReq > mcAvail + 0.01) {
        showToast(`所选会员卡可用面值不足，最多 ${formatYen(mcAvail)}`);
        return;
      }
    }
    const splits = payChannelDefs()
      .map(ch => ({ id: ch.id, amount: round2(Number(state.payAmounts[ch.id]) || 0) }))
      .filter(p => p.amount > 0 && p.id !== 'membercard');
    if (dueCash > 0 && !splits.length && mcReq <= 0) {
      showToast('请填写支付金额');
      return;
    }
    if (state.billAssetPay) {
      if (splits.length) state.payChannel = splits[0].id;
      finalizeBillAssetPay();
      return;
    }
    const shouldDeductStock = !state.cardIssuePending && !state.cardExtendPending;
    if (shouldDeductStock) {
      clampCartToProductStock({ toast: true });
      if (!state.cart.length && !state.orderIsFree) {
        showToast('购物车为空');
        return;
      }
      const over = state.cart.some(it => {
        if (!isBillProductItem(it)) return false;
        const cap = productStockCap(it);
        return cap != null && (Number(it.qty) || 0) > cap;
      });
      if (over) {
        showToast('库存不足，请返回调整数量');
        return;
      }
    }
    if (state.orderIsFree) {
      showToast('免单成功 · ' + freeOrderRuleText());
    }
    const s = calcSettlement();
    if (splits.length) state.payChannel = splits[0].id;
    s.paySplits = splits;
    s.manualOrderNo = ensureManualOrderNo();
    s.billBizDate = ensureBillBizDate();
    s.orderIsFree = !!state.orderIsFree;
    state.lastSettlement = s;
    if (shouldDeductStock) deductProductStockAfterPay();
    if (state.cardIssuePending) {
      /* 支付成功才 FinalizeIssue：mock 收据号 → 写持卡 + 办卡业绩分摊 */
      const pending = Object.assign({}, state.cardIssuePending, {
        tradeReceiptId: 'demo_rcpt_' + Date.now(),
        bizType: 'card_issue',
        amount: state.pendingOpenCard ? Number(state.pendingOpenCard.amount) || 0 : 0,
        staffIds: state.pendingOpenCard && Array.isArray(state.pendingOpenCard.staffIds)
          ? state.pendingOpenCard.staffIds.slice() : [],
        staffRoles: state.pendingOpenCard
          ? Object.assign({}, state.pendingOpenCard.staffRoles || {}) : {},
        staffDesignated: state.pendingOpenCard
          ? Object.assign({}, state.pendingOpenCard.staffDesignated || {}) : {},
      });
      if (!state.successIssueTemplateId) state.successIssueTemplateId = pending.templateId;
      if (!state.successIssueCardHtml && window.CardHost && typeof window.CardHost.renderIssueSuccessCardFace === 'function') {
        state.successIssueCardHtml = window.CardHost.renderIssueSuccessCardFace(pending.templateId);
      }
      if (window.CardHost && typeof window.CardHost.finalizeTemplateIssue === 'function') {
        window.CardHost.finalizeTemplateIssue(pending);
      }
      state.cardIssuePending = null;
    }
    if (state.cardExtendPending) {
      /* 支付成功才 FinalizeExtend */
      const pending = Object.assign({}, state.cardExtendPending, {
        tradeReceiptId: 'demo_rcpt_ext_' + Date.now(),
        bizType: 'card_extend',
      });
      if (!state.successIssueTemplateId) state.successIssueTemplateId = pending.templateId;
      if (!state.successIssueCardHtml && window.CardHost && typeof window.CardHost.renderIssueSuccessCardFace === 'function') {
        state.successIssueCardHtml = window.CardHost.renderIssueSuccessCardFace(pending.templateId);
      }
      if (window.CardHost && typeof window.CardHost.finalizeTemplateExtend === 'function') {
        window.CardHost.finalizeTemplateExtend(pending);
      }
      state.cardExtendPending = null;
    }
    completeBillPayFromSettlement(s);
  });
  document.getElementById('btnSuccessHome')?.addEventListener('click', () => {
    if (state.lastIssueFromCardMgmt) returnToCardListFromIssueCheckout();
    else {
      resetOrder();
      if (typeof openWorkbench === 'function') openWorkbench();
    }
  });
  document.getElementById('btnContinue')?.addEventListener('click', () => {
    if (state.lastIssueFromCardMgmt) returnToCardListFromIssueCheckout();
    else continueBilling();
  });
  document.getElementById('btnViewFlow')?.addEventListener('click', () => {
    const id = state.lastFlowOrderId || (FLOW_ORDERS[0] && FLOW_ORDERS[0].id);
    if (!id) {
      openFlowHub();
      return;
    }
    openFlowDetail(id, { fromSuccess: true });
  });
  document.getElementById('btnSign')?.addEventListener('click', () => showToast('客户签字后续开放'));
  document.getElementById('btnCustDetail')?.addEventListener('click', () => showToast('客户详情后续开放'));

  document.getElementById('flowListBack')?.addEventListener('click', () => {
    if (window.__wbEntry === 'expense' && window.ExpenseDemo && typeof window.ExpenseDemo.openList === 'function') {
      window.__wbEntry = null;
      window.ExpenseDemo.openList();
      return;
    }
    if (typeof openWorkbench === 'function') openWorkbench();
    else resetOrder();
  });
  document.getElementById('flowDetailBack')?.addEventListener('click', () => openFlowList());
  document.getElementById('flowListFilter')?.addEventListener('click', () => openFlowFilter());
  document.getElementById('flowListTabs')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-flow-tab]');
    if (!btn) return;
    state.flowTab = btn.dataset.flowTab;
    renderFlowList();
  });
  document.getElementById('flowListBody')?.addEventListener('click', (e) => {
    const card = e.target.closest('[data-flow-id]');
    if (!card) return;
    openFlowDetail(card.dataset.flowId, { fromSuccess: false });
  });
  document.getElementById('flowRangeCancel')?.addEventListener('click', () => cancelFlowRangeSheet());
  document.getElementById('flowRangeOk')?.addEventListener('click', () => applyFlowRangeSheet());
  document.getElementById('flowRangeMask')?.addEventListener('click', (e) => {
    if (e.target.id === 'flowRangeMask') cancelFlowRangeSheet();
  });
  document.getElementById('flowRangeCalRange')?.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-flow-cal-focus]');
    if (!chip) return;
    state.flowRangeCalFocus = chip.dataset.flowCalFocus;
    renderFlowRangeChrome();
    renderFlowRangeCalendar();
  });
  document.getElementById('flowRangeCal')?.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-flow-cal-nav]');
    if (nav) {
      const delta = Number(nav.dataset.flowCalNav) || 0;
      let y = state.flowRangeCalYear;
      let m = state.flowRangeCalMonth + delta;
      if (m < 0) { y -= 1; m = 11; }
      if (m > 11) { y += 1; m = 0; }
      state.flowRangeCalYear = y;
      state.flowRangeCalMonth = m;
      renderFlowRangeCalendar();
      return;
    }
    const day = e.target.closest('[data-flow-cal-day]');
    if (day) pickFlowRangeDay(day.dataset.flowCalDay);
  });
  document.getElementById('flowDetailBody')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-flow-expand]')) {
      state.flowDetailExpanded = !state.flowDetailExpanded;
      renderFlowDetail();
      return;
    }
    if (e.target.closest('[data-flow-all]')) {
      openFlowList();
      return;
    }
    if (e.target.closest('[data-flow-remark]')) {
      openFlowRemarkEditor();
      return;
    }
    if (e.target.closest('[data-flow-diff]')) {
      const btn = e.target.closest('[data-flow-diff]');
      openFlowGapPaySheet(btn.dataset.flowDiff === 'refund' ? 'refund' : 'collect');
      return;
    }
    if (e.target.closest('[data-flow-more]')) {
      openFlowMore();
      return;
    }
    if (e.target.closest('[data-flow-edit]')) {
      openFlowEdit();
      return;
    }
    if (e.target.closest('[data-flow-edit-log]')) {
      openFlowEditLog();
      return;
    }
    if (e.target.closest('[data-flow-refund-log]')) {
      openFlowRefundLog();
      return;
    }
    const perf = e.target.closest('[data-flow-perf]')
      || e.target.closest('.flow-detail-metric__item')?.querySelector('[data-flow-perf]');
    if (perf) {
      e.preventDefault();
      if (typeof openAmountKeypad === 'function') openAmountKeypad(perf);
      else if (typeof window.openAmountKeypad === 'function') window.openAmountKeypad(perf);
      else showToast('金额键盘未就绪');
    }
  });
  document.getElementById('flowDetailBody')?.addEventListener('change', (e) => {
    const el = e.target.closest('[data-flow-perf]');
    if (!el) return;
    const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
    if (!o) return;
    const val = typeof round2 === 'function' ? round2(Number(el.value) || 0) : Math.round((Number(el.value) || 0) * 100) / 100;
    if (el.dataset.flowPerf === 'achievement') o.achievement = val;
    else if (el.dataset.flowPerf === 'commission') o.commission = val;
    el.value = val.toFixed(2);
  });
  document.getElementById('flowDetailFoot')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-flow-refund]')) openFlowRefund();
    if (e.target.closest('[data-flow-void]')) openFlowVoidDialog();
  });
  document.getElementById('flowFilterBody')?.addEventListener('click', (e) => {
    const rangeBtn = e.target.closest('[data-flow-filter-range]');
    if (rangeBtn) {
      openFlowRangeSheet('filter');
      return;
    }
    const chip = e.target.closest('[data-flow-filter-key]');
    if (!chip) return;
    if (!state.flowFilterDraft) state.flowFilterDraft = Object.assign({ customStart: '', customEnd: '' }, state.flowFilter);
    state.flowFilterDraft[chip.dataset.flowFilterKey] = chip.dataset.flowFilterVal;
    if (chip.dataset.flowFilterKey === 'date' && chip.dataset.flowFilterVal === 'custom') {
      renderFlowFilterSheet();
      openFlowRangeSheet('filter');
      return;
    }
    renderFlowFilterSheet();
  });
  document.getElementById('flowFilterReset')?.addEventListener('click', () => {
    state.flowFilterDraft = { date: 'all', pay: 'all', guest: 'all', customStart: '', customEnd: '' };
    renderFlowFilterSheet();
  });
  document.getElementById('flowFilterApply')?.addEventListener('click', () => {
    const draft = state.flowFilterDraft || state.flowFilter;
    if (draft && draft.date === 'custom' && !(draft.customStart && draft.customEnd)) {
      showToast('请选择自定义起止日期');
      openFlowRangeSheet('filter');
      return;
    }
    state.flowFilter = Object.assign({ customStart: '', customEnd: '' }, draft || state.flowFilter);
    closeMask('flowFilterMask');
    renderFlowList();
  });
  document.getElementById('flowVoidCancel')?.addEventListener('click', () => closeFlowVoidDialog());
  document.getElementById('flowVoidConfirm')?.addEventListener('click', () => confirmFlowVoid());
  document.getElementById('flowVoidMask')?.addEventListener('click', (e) => {
    if (e.target.id === 'flowVoidMask') closeFlowVoidDialog();
  });
  document.getElementById('flowEditDiffCancel')?.addEventListener('click', () => closeFlowEditDiffDialog());
  document.getElementById('flowEditDiffSamePay')?.addEventListener('click', () => confirmFlowEditSamePay());
  document.getElementById('flowEditDiffGoSettle')?.addEventListener('click', () => confirmFlowEditGoSettle());
  document.getElementById('flowEditDiffMask')?.addEventListener('click', (e) => {
    if (e.target.id === 'flowEditDiffMask') closeFlowEditDiffDialog();
  });
  document.getElementById('flowRemarkCancel')?.addEventListener('click', () => closeFlowRemarkEditor());
  document.getElementById('flowRemarkConfirm')?.addEventListener('click', () => confirmFlowRemark());
  document.getElementById('flowRemarkMask')?.addEventListener('click', (e) => {
    if (e.target.id === 'flowRemarkMask') closeFlowRemarkEditor();
  });
  document.getElementById('flowRemarkInput')?.addEventListener('input', () => {
    const input = document.getElementById('flowRemarkInput');
    const count = document.getElementById('flowRemarkCount');
    if (input && count) count.textContent = String((input.value || '').length);
  });
  document.getElementById('flowEditLogClose')?.addEventListener('click', () => closeFlowEditLog());
  document.getElementById('flowEditLogMask')?.addEventListener('click', (e) => {
    if (e.target.id === 'flowEditLogMask') closeFlowEditLog();
  });
  document.getElementById('flowMoreRefund')?.addEventListener('click', () => openFlowRefund());
  document.getElementById('flowMoreCollect')?.addEventListener('click', () => openFlowGapPaySheet('collect'));
  document.getElementById('flowMoreRefundDiff')?.addEventListener('click', () => openFlowGapPaySheet('refund'));
  document.getElementById('flowRefundMethodCancel')?.addEventListener('click', () => closeFlowRefundMethodSheet());
  document.getElementById('flowRefundMethodConfirm')?.addEventListener('click', () => confirmFlowRefundSubmit());
  document.getElementById('flowRefundMethodMask')?.addEventListener('click', (e) => {
    if (e.target.id === 'flowRefundMethodMask') closeFlowRefundMethodSheet();
  });
  document.getElementById('flowRefundSeg')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-flow-refund-mode]');
    if (!btn) return;
    const remarkEl = document.getElementById('flowRefundRemarkInput');
    if (state.flowRefundPending && remarkEl) state.flowRefundPending.remark = String(remarkEl.value || '').slice(0, 200);
    state.flowRefundMode = btn.dataset.flowRefundMode;
    if (state.flowRefundPending) {
      const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
      if (o) {
        state.flowRefundPending.amounts = {};
        (state.flowRefundPending.indices || []).forEach((idx) => {
          const remain = flowItemRemainingRefundable(o, idx);
          const paidShare = flowItemPaidShare(o, idx);
          state.flowRefundPending.amounts[idx] = state.flowRefundMode === 'original'
            ? Math.min(paidShare, remain)
            : remain;
        });
      }
    }
    renderFlowRefundMethodSheet();
  });
  document.getElementById('flowRefundMethodBody')?.addEventListener('input', (e) => {
    const remark = e.target.closest('#flowRefundRemarkInput');
    if (remark && state.flowRefundPending) {
      state.flowRefundPending.remark = String(remark.value || '').slice(0, 200);
      return;
    }
    const inp = e.target.closest('[data-flow-refund-amt]');
    if (!inp || !state.flowRefundPending) return;
    const remarkEl = document.getElementById('flowRefundRemarkInput');
    if (remarkEl) state.flowRefundPending.remark = String(remarkEl.value || '').slice(0, 200);
    const idx = Number(inp.dataset.flowRefundAmt);
    const v = round2(Number(inp.value) || 0);
    if (!state.flowRefundPending.amounts) state.flowRefundPending.amounts = {};
    state.flowRefundPending.amounts[idx] = v;
    renderFlowRefundMethodSheet();
  });
  document.getElementById('flowRefundMethodBody')?.addEventListener('change', (e) => {
    const rad = e.target.closest('input[name="flowRefundDesignatedCh"]');
    if (rad) state.flowRefundDesignatedChannel = rad.value;
  });
  document.getElementById('flowRefundLogBack')?.addEventListener('click', () => openFlowDetail(state.flowDetailId, { fromSuccess: false }));
  document.getElementById('flowRefundLogDetailBack')?.addEventListener('click', () => openFlowRefundLog());
  document.getElementById('flowRefundLogBody')?.addEventListener('click', (e) => {
    const card = e.target.closest('[data-flow-refund-log-idx]');
    if (!card) return;
    openFlowRefundLogDetail(Number(card.dataset.flowRefundLogIdx));
  });
  document.getElementById('flowRefundBack')?.addEventListener('click', () => openFlowDetail(state.flowDetailId, { fromSuccess: false }));
  document.getElementById('flowRefundBody')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-flow-refund-all]')) {
      const o = FLOW_ORDERS.find(x => x.id === state.flowDetailId);
      if (!o) return;
      const all = flowRefundableItemIndices(o);
      const cur = state.flowRefundSelected || [];
      state.flowRefundSelected = cur.length === all.length ? [] : all;
      renderFlowRefund();
      return;
    }
    const row = e.target.closest('[data-flow-refund-idx]');
    if (!row) return;
    const idx = Number(row.dataset.flowRefundIdx);
    const set = new Set(state.flowRefundSelected || []);
    if (set.has(idx)) set.delete(idx); else set.add(idx);
    state.flowRefundSelected = Array.from(set).sort((a, b) => a - b);
    renderFlowRefund();
  });
  document.getElementById('flowRefundFoot')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-flow-refund-confirm]')) confirmFlowRefund();
  });
  document.getElementById('flowEditBack')?.addEventListener('click', () => openFlowDetail(state.flowDetailId, { fromSuccess: false }));
  document.getElementById('flowEditAddBack')?.addEventListener('click', () => {
    if (state.flowEditReplaceItemId) {
      const keepId = state.flowEditReplaceItemId;
      state.flowEditReplaceItemId = null;
      state.flowEditAddSelected = [];
      state.flowEditItemId = keepId;
      if (typeof window.__staffPickResetEdit === 'function') window.__staffPickResetEdit();
      showOnlyScreen('screen-flow-edit-item');
      renderFlowEditItem();
      return;
    }
    resetFlowEditCardPick();
    renderFlowEdit();
    showOnlyScreen('screen-flow-edit');
  });
  document.getElementById('flowEditItemBack')?.addEventListener('click', () => {
    renderFlowEdit();
    showOnlyScreen('screen-flow-edit');
  });
  document.getElementById('flowEditBody')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-flow-edit-add]')) {
      openFlowEditAdd();
      return;
    }
    const delItem = e.target.closest('[data-flow-edit-item-del]');
    if (delItem && state.flowEditDraft) {
      e.preventDefault();
      e.stopPropagation();
      const id = delItem.dataset.flowEditItemDel;
      if (state.flowEditDraft.items.length <= 1) {
        showToast('请至少保留一个服务项目', true);
        return;
      }
      state.flowEditDraft.items = state.flowEditDraft.items.filter(x => x.id !== id);
      renderFlowEdit();
      return;
    }
    const itemBtn = e.target.closest('[data-flow-edit-item]');
    if (itemBtn) {
      openFlowEditItem(itemBtn.dataset.flowEditItem);
      return;
    }
  });
  document.getElementById('flowEditFoot')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-flow-edit-cancel]')) openFlowDetail(state.flowDetailId, { fromSuccess: false });
    if (e.target.closest('[data-flow-edit-save]')) saveFlowEdit();
  });
  document.getElementById('flowEditAddTabs')?.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-flow-edit-add-tab]');
    if (!tab) return;
    state.flowEditAddTab = tab.dataset.flowEditAddTab;
    state.flowEditAddSelected = [];
    resetFlowEditCardPick();
    renderFlowEditAdd();
  });
  document.getElementById('flowEditAddBody')?.addEventListener('click', (e) => {
    /* 会员卡 · 办卡（卡模板，多选）/ 充卡（目标卡，单选） */
    const tplBtn = e.target.closest('[data-flow-edit-pick-card]');
    if (tplBtn) {
      const id = tplBtn.dataset.flowEditPickCard;
      if (state.flowEditReplaceItemId) {
        const cur = (state.flowEditAddCardTpls || [])[0];
        state.flowEditAddCardTpls = cur === id ? [] : [id];
      } else {
        const set = new Set(state.flowEditAddCardTpls || []);
        if (set.has(id)) set.delete(id);
        else set.add(id);
        state.flowEditAddCardTpls = Array.from(set);
      }
      renderFlowEditAdd();
      return;
    }
    const cardBtn = e.target.closest('[data-flow-edit-add-card]');
    if (cardBtn) {
      const id = cardBtn.dataset.flowEditAddCard;
      state.flowEditAddCardId = state.flowEditAddCardId === id ? null : id;
      renderFlowEditAdd();
      return;
    }
    const amountBtn = e.target.closest('[data-flow-edit-add-amount]');
    if (amountBtn) {
      state.flowEditAddAmount = Number(amountBtn.dataset.flowEditAddAmount) || 0;
      renderFlowEditAdd();
      return;
    }
    const segBtn = e.target.closest('[data-flow-edit-add-cardseg]');
    if (segBtn) {
      state.flowEditAddCardSeg = segBtn.dataset.flowEditAddCardseg === 'recharge' ? 'recharge' : 'issue';
      renderFlowEditAdd();
      return;
    }
    const btn = e.target.closest('[data-flow-edit-pick]');
    if (!btn) return;
    const id = btn.dataset.flowEditPick;
    if (state.flowEditReplaceItemId) {
      state.flowEditAddSelected = state.flowEditAddSelected && state.flowEditAddSelected[0] === id ? [] : [id];
    } else {
      const set = new Set(state.flowEditAddSelected || []);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      state.flowEditAddSelected = Array.from(set);
    }
    renderFlowEditAdd();
  });
  document.getElementById('flowEditAddBody')?.addEventListener('change', (e) => {
    const input = e.target.closest('[data-flow-edit-add-amount-input]');
    if (!input) return;
    const val = typeof round2 === 'function' ? round2(Number(input.value) || 0) : Math.round((Number(input.value) || 0) * 100) / 100;
    state.flowEditAddAmount = Math.max(0, val);
    renderFlowEditAdd();
  });
  document.getElementById('flowEditAddFoot')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-flow-edit-add-confirm]')) confirmFlowEditAdd();
  });
  document.getElementById('flowEditItemBody')?.addEventListener('click', (e) => {
    const it = getFlowEditItem();
    if (!it) return;
    if (e.target.closest('[data-flow-edit-item-replace]')) {
      openFlowEditReplaceCatalog();
      return;
    }
    const delStaff = e.target.closest('[data-flow-edit-item-staff-del]');
    if (delStaff) {
      const sid = delStaff.dataset.flowEditItemStaffDel;
      it.staffIds = (it.staffIds || []).filter(id => id !== sid);
      if (it.staffRoles) delete it.staffRoles[sid];
      if (it.staffAchievements) delete it.staffAchievements[sid];
      if (it.staffCommissions) delete it.staffCommissions[sid];
      renderFlowEditItem();
      return;
    }
    const roleBtn = e.target.closest('[data-flow-edit-item-role]');
    if (roleBtn) {
      const sid = roleBtn.dataset.flowEditItemRole;
      if (!it.staffRoles) it.staffRoles = {};
      it.staffRoles[sid] = roleBtn.dataset.role || (typeof STAFF_ROLE_DEFAULT !== 'undefined' ? STAFF_ROLE_DEFAULT : 'senior');
      renderFlowEditItem();
      return;
    }
    const qtyBtn = e.target.closest('[data-flow-edit-qty]');
    if (qtyBtn) {
      const delta = Number(qtyBtn.dataset.flowEditQty) || 0;
      it.qty = Math.max(1, (Number(it.qty) || 1) + delta);
      renderFlowEditItem();
      return;
    }
    const perf = e.target.closest('[data-flow-edit-item-staff-perf]');
    if (perf) {
      /* 业绩已改为只读（无本属性）；此处仅提成可唤起金额键盘 */
      if (perf.dataset.flowEditItemStaffPerf !== 'commission') return;
      e.preventDefault();
      if (typeof openAmountKeypad === 'function') openAmountKeypad(perf);
      else if (typeof window.openAmountKeypad === 'function') window.openAmountKeypad(perf);
      return;
    }
    const price = e.target.closest('[data-flow-edit-item-price]');
    if (price) {
      e.preventDefault();
      if (typeof openAmountKeypad === 'function') openAmountKeypad(price);
      else if (typeof window.openAmountKeypad === 'function') window.openAmountKeypad(price);
    }
  });
  document.getElementById('flowEditItemBody')?.addEventListener('change', (e) => {
    const it = getFlowEditItem();
    if (!it) return;
    const price = e.target.closest('[data-flow-edit-item-price]');
    if (price) {
      const val = typeof round2 === 'function' ? round2(Number(price.value) || 0) : Math.round((Number(price.value) || 0) * 100) / 100;
      it.price = val;
      price.value = val.toFixed(2);
      return;
    }
    const perf = e.target.closest('[data-flow-edit-item-staff-perf]');
    if (perf) {
      const sid = perf.dataset.staffId;
      const val = typeof round2 === 'function' ? round2(Number(perf.value) || 0) : Math.round((Number(perf.value) || 0) * 100) / 100;
      /* 业绩只读：仅提成可写回 */
      if (perf.dataset.flowEditItemStaffPerf !== 'commission') return;
      if (!it.staffCommissions) it.staffCommissions = {};
      it.staffCommissions[sid] = val;
      perf.value = val.toFixed(2);
    }
  });
  document.getElementById('flowEditItemFoot')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-flow-edit-item-del-cur]')) {
      const d = state.flowEditDraft;
      const id = state.flowEditItemId;
      if (!d || !id) return;
      if (d.items.length <= 1) {
        showToast('请至少保留一个服务项目', true);
        return;
      }
      d.items = d.items.filter(x => x.id !== id);
      state.flowEditItemId = null;
      renderFlowEdit();
      showOnlyScreen('screen-flow-edit');
      return;
    }
    if (e.target.closest('[data-flow-edit-item-done]')) {
      const it = getFlowEditItem();
      const err = flowEditItemValidationError(it);
      if (err) {
        showToast(err, true);
        return;
      }
      if (state.flowEditDraft) {
        state.flowEditDraft.staffs = flowAggregateStaffsFromItems(state.flowEditDraft.items, state.flowEditDraft.staffs);
      }
      renderFlowEdit();
      showOnlyScreen('screen-flow-edit');
    }
  });


  if (!window.__BILLING_EMBEDDED__) renderFlowMap();
  if (!window.__FLOW_STANDALONE__) {
    renderCustomerList();
    syncCartChrome();
    syncPickHoldsEntry();
  }
  if (!window.__BILLING_EMBEDDED__) {
    enterBillUnselected();
  }
  // Expose bridge for card flow map
  window.BillingDemo = {
    nav: typeof FLOW_NAV !== 'undefined' ? FLOW_NAV : {},
    enterPick() { if (typeof FLOW_NAV !== 'undefined' && FLOW_NAV.pick) FLOW_NAV.pick(); },
    enterBillUnselected() { enterBillUnselected(); },
    openBillCustomer(opts) { openBillCustomer(opts); },
    openBillCatalog() { openBillCatalog(); },
    openBillStaff() { openBillStaff(); },
    openBillSettle() { openBillSettle(); },
    openHoldList() { openHoldList(); },
    show(id) { showOnlyScreen(id); },
    openFlowHub,
    openBillPayPriceChangedDemo,
    openFlowList,
    openFlowDetail,
    openFlowRefund,
    openFlowRefundLog,
    openFlowRefundLogDetail,
    openFlowEdit,
    openFlowEditLog,
    openFlowEditAdd,
    openFlowEditItemDemo() {
      const productOrder = FLOW_ORDERS.find(o =>
        o.status === 'done' && (
          o.kind === 'product' ||
          (o.items || []).some(i => i.type === 'product')
        )
      );
      if (productOrder) state.flowDetailId = productOrder.id;
      else if (!state.flowDetailId) {
        const done = FLOW_ORDERS.find(o => o.status === 'done');
        if (done) state.flowDetailId = done.id;
      }
      openFlowEdit();
      const d = ensureFlowEditDraft();
      if (!d || !d.items.length) return;
      const prefer = d.items.find(x => x.type === 'product') || d.items[0];
      openFlowEditItem(prefer.id);
    },
    openFlowGapPaySheet,
    applyFlowGapPayments,
    getCustomer() { return typeof getCustomer === 'function' ? getCustomer() : null; },
    ensureMember() { if (typeof enterBill === 'function' && typeof CUSTOMERS !== 'undefined') enterBill(CUSTOMERS[0]); },
    startCardIssueCheckout(ctx) { startCardIssueCheckout(ctx || {}); },
    startCardExtendCheckout(ctx) { startCardExtendCheckout(ctx || {}); },
    showRefundSuccess(payload) { showRefundSuccess(payload || {}); },
    upsertCardTemplate(tpl) {
      if (!tpl || !tpl.id) return;
      const idx = CARD_TEMPLATES.findIndex(t => t.id === tpl.id);
      if (idx >= 0) CARD_TEMPLATES[idx] = tpl;
      else CARD_TEMPLATES.unshift(tpl);
      CARD_TPL_BY_ID[tpl.id] = tpl;
    },
    onCardIssued({ templateId, customerId }) {
      let tpl = CARD_TEMPLATES.find(t => t.id === templateId);
      if (!tpl && typeof getTemplate === 'function') {
        const full = getTemplate(templateId);
        if (full && typeof mapTemplateToBillingListItem === 'function') {
          tpl = mapTemplateToBillingListItem(full);
          CARD_TEMPLATES.unshift(tpl);
          CARD_TPL_BY_ID[tpl.id] = tpl;
        }
      } else if (tpl) {
        CARD_TPL_BY_ID[tpl.id] = tpl;
      }
      const c = CUSTOMERS.find(x => x.id === customerId);
      if (!c) return;
      c.isMember = true;
      syncMemberCardsFromHoldings(customerId);
      if (state.customer && state.customer.id === customerId) {
        state.cardsExpanded = true;
      }
    },
    onCardRefunded({ templateId, customerId }) {
      syncMemberCardsFromHoldings(customerId);
    },
    syncMemberCardsFromHoldings,
    syncAllMemberCardsFromHoldings,
    getMemberCards(memberId) {
      return (window.CardHost && typeof window.CardHost.getMemberCards === 'function'
        ? window.CardHost.getMemberCards(memberId)
        : []).map(normalizeHeldCard);
    },
  };
  /* 内嵌：以会员卡持卡账本重建开单侧顾客卡列表 */
  if (window.__BILLING_EMBEDDED__) {
    if (typeof ensureDemoFilled === 'function') ensureDemoFilled();
    if (typeof syncAllBillingCustomerCardsFromHoldings === 'function') {
      syncAllBillingCustomerCardsFromHoldings();
    } else {
      syncAllMemberCardsFromHoldings();
    }
  }
  /* 内嵌：billing 初始化后重绘宿主链路，确保项目/会员卡/开单三组都在 */
  if (window.__BILLING_EMBEDDED__ && typeof window.renderFlowMap === 'function') {
    window.renderFlowMap();
  }
})();

/** 深链前确保已选一笔可改的已完成订单（否则 openFlowEdit/Refund 会直接 return → 白屏） */
function __flowEnsureDoneOrder() {
  if (!window.BillingDemo || typeof window.BillingDemo.openFlowDetail !== 'function') return;
  window.BillingDemo.openFlowDetail(null, { fromSuccess: false });
}
window.FLOW_FLOW_NAV = {
  'flow-list': function () { window.BillingDemo.openFlowList(); },
  'flow-detail': function () { window.BillingDemo.openFlowDetail(null, { fromSuccess: false }); },
  'flow-refund': function () { __flowEnsureDoneOrder(); window.BillingDemo.openFlowRefund(); },
  'flow-refund-log': function () { window.BillingDemo.openFlowRefundLog(); },
  'flow-refund-log-detail': function () { window.BillingDemo.openFlowRefundLogDetail(0); },
  'flow-edit': function () { __flowEnsureDoneOrder(); window.BillingDemo.openFlowEdit(); },
  'flow-edit-log': function () { window.BillingDemo.openFlowEditLog(); },
  'flow-edit-add': function () { __flowEnsureDoneOrder(); window.BillingDemo.openFlowEdit(); window.BillingDemo.openFlowEditAdd(); },
  'flow-edit-item': function () { window.BillingDemo.openFlowEditItemDemo(); },
  'flow-diff-collect': function () { __flowEnsureDoneOrder(); window.BillingDemo.openFlowGapPaySheet('collect'); },
  'flow-diff-refund': function () { __flowEnsureDoneOrder(); window.BillingDemo.openFlowGapPaySheet('refund'); }
};
window.runFlowNav = function (id) {
  var root = document.getElementById('flowModuleRoot');
  var frame = document.getElementById('frame');
  if (root) root.classList.add('is-active');
  if (frame) frame.classList.add('is-flow-mode');
  document.querySelectorAll('#frame > .screen').forEach(function (s) { s.classList.remove('active'); });
  var fn = window.FLOW_FLOW_NAV[id];
  if (typeof fn === 'function') {
    try { fn(); } catch (err) { console.error(err); window.showToast('打开失败: ' + id); }
  } else window.showToast('未接入: ' + id);
  /* 若目标页未真正展开（如订单不可改），回退到门店流水，避免白屏 */
  var vis = document.querySelector('#flowModuleRoot .phone > .screen:not(.hidden)');
  var openMask = document.querySelector('#flowModuleRoot .picker-mask.open, #flowModuleRoot .dialog-mask.open, #flowModuleRoot .dialog-mask.show');
  if (!vis && !openMask && window.BillingDemo && typeof window.BillingDemo.openFlowList === 'function') {
    window.BillingDemo.openFlowList();
  }
  if (typeof window.setFlowNavHighlight === 'function') window.setFlowNavHighlight(id);
  if (typeof window.wireAmountKeypadInputs === 'function') {
    window.wireAmountKeypadInputs(document.getElementById('flowModuleRoot'));
  }
};
window.exitFlowModule = function () {
  var root = document.getElementById('flowModuleRoot');
  var frame = document.getElementById('frame');
  if (root) root.classList.remove('is-active');
  if (frame) frame.classList.remove('is-flow-mode');
  document.querySelectorAll('#flowModuleRoot .screen').forEach(function (s) { s.classList.add('hidden'); });
  document.querySelectorAll('#flowModuleRoot .picker-mask, #flowModuleRoot .dialog-mask').forEach(function (el) {
    el.classList.remove('open', 'show');
  });
};

