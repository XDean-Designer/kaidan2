/**
 * 开单结账2.0 · S1 确认执行版
 * 行下展 · 员工槽位 + 贴边 sheet（不遮展开区）· iOS 动效
 * 价目=demo 美发子集 · 结算文档流：明细→券→备注
 */
(function () {
  'use strict';

  var HOLD_COUNT = 3;
  var draft = null;

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

  /* ========== 会员档案（顶部会员卡数据源） ========== */
  var MEMBER_DEFAULT = {
    name: '陈女士', gender: 'female', avatar: 'assets/avatar_female3.png',
    lastVisit: '2026-08-15', cards: '3', balance: '2049', discount: '8.0', isNew: false
  };
  /* 当前顾客是否为会员（由 index.html 的 setCust 同步；s5 恒为会员页） */
  var custIsMember = false;
  function memberProfile() { return window.__v2Member || MEMBER_DEFAULT; }
  function todayISO() {
    var d = new Date();
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  /* isNew=true：本次新注册会员（无卡无权益、上次到店=今天） */
  function setMemberProfile(name, gender, avatar, isNew) {
    var g = (gender === 'male' || gender === 'female') ? gender : 'female';
    window.__v2Member = {
      name: name,
      gender: g,
      avatar: avatar || (g === 'male' ? 'assets/avatar_male2.png' : 'assets/avatar_card_female.png'),
      lastVisit: isNew ? todayISO() : MEMBER_DEFAULT.lastVisit,
      cards: isNew ? '0' : MEMBER_DEFAULT.cards,
      balance: isNew ? '0' : MEMBER_DEFAULT.balance,
      discount: isNew ? '—' : MEMBER_DEFAULT.discount,
      isNew: !!isNew
    };
    /* 新注册会员无任何卡/权益 → 不参与会员折扣 */
    window.__v2MemberNoBenefit = !!isNew;
    return window.__v2Member;
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

  var PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var CHEV_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  /* 「添加会员」图标（与 s4 顾客列表同款，Figma 746:222，保持橙色 #FF8956） */
  var ADD_MEMBER_SVG = '<svg viewBox="0 0 200 200" aria-hidden="true">' +
    '<path d="M185.47 160.61C184.426 161.622 183.036 162.2 181.581 162.226H166.954V175.88C166.947 178.781 164.418 181.147 161.314 181.154H161.307C158.203 181.148 155.674 178.781 155.674 175.879V162.226H141.087C139.61 162.234 138.185 161.683 137.097 160.684C136.581 160.208 136.168 159.631 135.884 158.989C135.6 158.347 135.451 157.653 135.447 156.951C135.447 154.043 137.976 151.676 141.08 151.676H155.674V138.023C155.674 135.115 158.203 132.748 161.307 132.748C164.418 132.748 166.954 135.115 166.954 138.023V151.676H181.493C184.557 151.764 186.985 154.036 187.045 156.843C187.06 157.546 186.928 158.244 186.656 158.893C186.385 159.542 185.981 160.126 185.47 160.61ZM147.248 121.184C145.818 121.195 144.434 120.68 143.359 119.737L143.075 119.507C129.839 110.146 114.012 105.149 97.7998 105.211C56.3181 105.211 22.5663 136.792 22.5663 175.616C22.5526 178.537 20.0099 180.904 16.8923 180.904C13.7748 180.904 11.2254 178.53 11.2186 175.602C11.2254 158.892 16.6353 142.864 26.8469 129.245C36.8352 115.936 50.6579 105.833 66.8408 100.024L72.0276 98.1573L67.8078 94.7692C57.5556 86.539 51.6723 74.6032 51.6723 62.018C51.6723 38.2139 72.3657 18.8525 97.7998 18.8525C123.241 18.8525 143.934 38.2139 143.934 62.018C143.934 74.6032 138.05 86.5392 127.792 94.7692L123.572 98.1639L128.766 100.024C136.001 102.614 142.886 106.151 149.236 110.533L150.778 111.716C151.437 112.192 151.974 112.817 152.347 113.539C152.719 114.262 152.916 115.062 152.921 115.875C152.921 118.797 150.379 121.177 147.248 121.184ZM132.586 62.018C132.586 44.0703 116.978 29.4698 97.7998 29.4698C78.6278 29.4698 63.0198 44.0703 63.0198 62.018C63.0198 79.9657 78.6278 94.5596 97.7998 94.5596C116.978 94.5596 132.586 79.9659 132.586 62.018Z" fill="#FF8956"></path>' +
    '</svg>';

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
  /* 挂单条数：以 index.html 的 holdOrders 为准（演示数据 3 笔），无则回落到本地常量 */
  function holdCountNow() {
    return (typeof window.holdCount === 'function') ? window.holdCount() : HOLD_COUNT;
  }
  function syncHold() {
    var n = holdCountNow();
    $all('[data-hold-count]').forEach(function (el) {
      el.textContent = String(n);
    });
  }
  window.__v2SyncHold = syncHold;

  function wrapPickRows() {
    var list = $('#s4 .pick-list');
    if (!list || list.getAttribute('data-v2-wrapped')) return;
    list.setAttribute('data-v2-wrapped', '1');
    $all('#s4 .pick-row').forEach(function (row) {
      /* 「添加会员」是入口行（新增会员），不参与顾客行的展开/开单逻辑 */
      if (row.hasAttribute('data-add-member')) return;
      wrapOnePickRow(row);
    });
  }

  /* 把单个顾客行包成「行 + 开单/直接收款操作区」，返回 wrap（已插入 DOM） */
  function wrapOnePickRow(row) {
    if (!row) return null;
    if (row.parentNode && row.parentNode.classList &&
        row.parentNode.classList.contains('pick-row-wrap')) return row.parentNode;
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
      if (typeof closeAddMember === 'function') closeAddMember();
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
      applyPick(kind, key, b.getAttribute('data-a'), nm, row.getAttribute('data-gender') || '');
    };
    wrap.setAttribute('data-kind', kind);
    wrap.setAttribute('data-nm', nm);
    row.parentNode && row.parentNode.insertBefore(wrap, row);
    wrap.appendChild(row);
    wrap.appendChild(actions);
    return wrap;
  }

  /* ========== s4 搜索：姓名 + 手机号 模糊匹配（输入即筛选） ========== */
  var S4_EMPTY_SVG =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.6"/>' +
    '<path d="M15.5 15.5L20.5 20.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
    '</svg>';

  function s4Norm(s) {
    return String(s == null ? '' : s).toLowerCase().replace(/\s+/g, '');
  }

  /* 取一行顾客的可搜索文本：姓名 + 手机号 */
  function s4RowHaystack(wrap) {
    var nm = wrap.querySelector('.nm');
    var ph = wrap.querySelector('.phone');
    return s4Norm((nm ? nm.textContent : '') + ' ' + (ph ? ph.textContent : ''));
  }

  function ensurePickEmpty() {
    var list = $('#s4 .pick-list');
    if (!list) return null;
    var box = list.querySelector('.pick-empty');
    if (!box) {
      box = document.createElement('div');
      box.className = 'pick-empty';
      box.innerHTML =
        '<div class="ic">' + S4_EMPTY_SVG + '</div>' +
        '<div class="t">未找到相关顾客</div>' +
        '<div class="s">换个姓名或手机号试试</div>';
      list.appendChild(box);
    }
    return box;
  }

  function applyPickSearch() {
    var list = $('#s4 .pick-list');
    var inp = $('#s4 [data-pick-search]');
    if (!list || !inp) return;
    var q = s4Norm(inp.value);
    if (!q) {
      list.classList.remove('is-searching');
      $all('#s4 .pick-row-wrap').forEach(function (w) { w.style.display = ''; });
      return;
    }
    list.classList.add('is-searching');
    var hits = 0;
    $all('#s4 .pick-row-wrap').forEach(function (w) {
      /* 散客组不参与搜索（搜索态由 CSS 隐藏，这里再兜一层） */
      if (w.getAttribute('data-kind') === 'guest') { w.style.display = 'none'; return; }
      var ok = s4RowHaystack(w).indexOf(q) >= 0;
      w.style.display = ok ? '' : 'none';
      if (ok) hits++;
    });
    var empty = ensurePickEmpty();
    if (empty) empty.classList.toggle('show', hits === 0);
  }

  function clearPickSearch(focus) {
    var inp = $('#s4 [data-pick-search]');
    if (!inp) return;
    inp.value = '';
    applyPickSearch();
    if (focus) inp.focus(); else inp.blur();
  }

  function wirePickSearch() {
    var list = $('#s4 .pick-list');
    var inp = $('#s4 [data-pick-search]');
    var cancel = $('#s4 [data-pick-search-cancel]');
    if (!list || !inp || list.getAttribute('data-search-wired') === '1') return;
    list.setAttribute('data-search-wired', '1');
    ensurePickEmpty();
    inp.addEventListener('input', applyPickSearch);
    /* 回车不清空、不提交 */
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') e.preventDefault();
    });
    /* 「取消」= 清空 + 退出输入态（返回首页请用标题栏左侧返回键） */
    if (cancel) {
      cancel.onclick = function (e) {
        e.stopPropagation();
        clearPickSearch(false);
      };
    }
    window.__v2PickSearchRefresh = applyPickSearch;
  }

  /* 从 s4 列表取该会员行的头像（顶部卡沿用列表头像） */
  function pickListAvatar(nm) {
    var found = '';
    $all('#s4 .pick-row').forEach(function (row) {
      if (found) return;
      var nmEl = row.querySelector('.nm');
      if (nmEl && nmEl.textContent.trim() === nm) {
        var img = row.querySelector('.avatar img') || row.querySelector('img');
        if (img) found = img.getAttribute('src') || '';
      }
    });
    return found;
  }

  function applyPick(kind, key, act, displayName, gender) {
    $all('.pick-row-wrap.is-open').forEach(function (w) {
      w.classList.remove('is-open');
    });
    closeAddMember();
    if (kind === 'guest') {
      if (window.setGuestGender) window.setGuestGender(key);
      if (window.setCust) window.setCust('guest');
    } else {
      var map = {
        chen: '陈女士', chenxr: '陈昕然', gao: '高海泉', li: '李女士', ma: '马婷'
      };
      var nm = map[key] || displayName || '会员';
      var g = (gender === 'male' || gender === 'female') ? gender
        : (nm.indexOf('先生') >= 0 ? 'male' : 'female');
      setMemberProfile(nm, g, pickListAvatar(nm), false);
      if (window.setCust) window.setCust('member');
    }
    var sid = kind === 'guest' ? 's1' : 's5';
    if (act === 'quick') {
      /* 直接收款：会员卡与散客卡都要按最新档案渲染 */
      paintMemberCards();
      go('s2');
      return;
    }
    go(sid);
    setTimeout(function () { rebuildBill(sid); }, 30);
  }

  /* ========== 「添加会员」行下展：快捷添加会员 ========== */
  /* 姓氏拼音首字母（覆盖常见姓氏；未收录的落到「#」分组） */
  var PY_SURNAMES = {
    A: '安艾敖',
    B: '白包鲍毕卞柏边别薄步巴贝班暴',
    C: '陈曹蔡崔常程楚储褚从池车岑柴晁成迟',
    D: '邓丁董杜戴段窦狄刁东都岱',
    E: '鄂恩',
    F: '范方房费冯符傅樊丰封付伏凤',
    G: '高甘干郜戈葛耿弓龚勾古谷顾关管桂郭国苟巩贡',
    H: '韩郝何贺侯胡花华黄霍洪怀惠扈海哈',
    I: '伊依',
    J: '纪季贾简江姜蒋焦金靳经井居鞠吉计嵇',
    K: '康柯孔寇匡邝阚',
    L: '李黎梁廖林凌刘柳龙楼卢鲁陆吕罗骆雷冷连廉蔺娄路栾蓝郎赖乐',
    M: '马麦毛梅孟苗莫穆牟米闵明慕',
    N: '倪聂宁牛农那南能',
    O: '欧',
    P: '潘庞裴彭皮平蒲濮逄',
    Q: '戚齐钱强乔秦邱丘裘屈曲权覃全祁',
    R: '冉任荣阮芮饶',
    S: '萨桑沙山单尚邵沈盛施石史舒帅司宋苏孙索宿',
    T: '谭汤唐陶田童涂屠邰台谈滕',
    U: '乌',
    V: '万',
    W: '汪王危韦卫魏温文翁邬吴伍武巫闻',
    X: '奚习夏鲜向项萧肖谢辛邢幸熊徐许宣薛荀席郗',
    Y: '严言阎颜晏杨姚叶易殷尹应尤游于余俞虞禹郁喻元袁岳云燕阴',
    Z: '臧曾詹张章赵甄郑支钟周朱诸祝庄卓宗邹祖左翟湛'
  };
  var PY_MAP = (function () {
    var m = {};
    Object.keys(PY_SURNAMES).forEach(function (k) {
      PY_SURNAMES[k].split('').forEach(function (ch) { if (!m[ch]) m[ch] = k; });
    });
    return m;
  })();
  var PY_ORDER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#';
  function pinyinInitial(name) {
    var ch = String(name || '').charAt(0);
    if (!ch) return '#';
    if (/[A-Za-z]/.test(ch)) return ch.toUpperCase();
    return PY_MAP[ch] || '#';
  }
  function letterOrder(l) {
    var i = PY_ORDER.indexOf(l);
    return i < 0 ? PY_ORDER.length : i;
  }
  function isLetterHead(el) {
    var t = el && el.textContent ? el.textContent.trim() : '';
    return t.length === 1 && /[A-Z#]/.test(t);
  }

  function addMemberWrap() { return $('#s4 [data-add-wrap]'); }

  function setAddMemberGender(wrap, g) {
    if (!wrap) return;
    wrap.setAttribute('data-gender', g || '');
    $all('[data-am-gender]', wrap).forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-am-gender') === g);
    });
  }
  function setPhoneErr(wrap, on) {
    if (!wrap) return;
    var input = wrap.querySelector('[data-am-phone]');
    var err = wrap.querySelector('[data-am-phone-err]');
    if (input) input.classList.toggle('is-err', !!on);
    if (err) err.classList.toggle('show', !!on);
  }
  function validPhone(v) { return /^1[3-9]\d{9}$/.test(v); }

  function resetAddMemberForm(wrap) {
    if (!wrap) return;
    var name = wrap.querySelector('[data-am-name]');
    var phone = wrap.querySelector('[data-am-phone]');
    if (name) { name.value = ''; name.classList.remove('is-err'); }
    if (phone) phone.value = '';
    setAddMemberGender(wrap, '');
    setPhoneErr(wrap, false);
  }

  /* 收起「添加会员」面板（不保存数据） */
  function closeAddMember() {
    var wrap = addMemberWrap();
    if (!wrap) return;
    wrap.classList.remove('is-open');
    resetAddMemberForm(wrap);
  }

  function scrollPickListTo(el) {
    var list = $('#s4 .pick-list');
    if (!list || !el) return;
    var top = el.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop - 8;
    try { list.scrollTo({ top: Math.max(0, top), behavior: 'smooth' }); }
    catch (e) { list.scrollTop = Math.max(0, top); }
  }

  function toggleAddMember() {
    var wrap = addMemberWrap();
    if (!wrap) return;
    var open = wrap.classList.contains('is-open');
    $all('.pick-row-wrap.is-open').forEach(function (w) { w.classList.remove('is-open'); });
    if (open) { closeAddMember(); return; }
    resetAddMemberForm(wrap);
    wrap.classList.add('is-open');
    scrollPickListTo(wrap);
  }

  /* 新建会员行：按姓氏拼音归入字母分组（不存在则新建组头），返回行元素 */
  function insertMemberRow(display, phone, gender) {
    var list = $('#s4 .pick-list');
    if (!list) return null;
    var letter = pinyinInitial(display);
    var heads = $all('#s4 .pick-list > .pick-group-h');
    var head = null;
    heads.forEach(function (h) {
      if (isLetterHead(h) && h.textContent.trim() === letter) head = h;
    });
    var row = document.createElement('div');
    row.className = 'pick-row';
    row.setAttribute('data-gender', gender);
    row.setAttribute('data-new-member', '1');
    row.innerHTML =
      '<div class="avatar"><img src="' +
        (gender === 'male' ? 'assets/avatar_male2.png' : 'assets/avatar_female2.png') +
        '" alt=""></div>' +
      '<div class="info">' +
        '<div class="line1"><span class="nm">' + esc(display) + '</span>' +
          (phone ? '<span class="phone">' + esc(phone) + '</span>' : '') +
        '</div>' +
        '<div class="sub">最近消费：未消费</div>' +
      '</div>';
    var wrap = wrapOnePickRow(row);
    if (head) {
      /* 追加到该字母分组末尾 */
      var last = head;
      var next = head.nextElementSibling;
      while (next && !(next.classList && next.classList.contains('pick-group-h'))) {
        last = next;
        next = next.nextElementSibling;
      }
      last.parentNode.insertBefore(wrap, last.nextSibling);
      return row;
    }
    /* 新建分组头：按字母序插到第一个更靠后的字母组之前（始终排在「散客」等非字母组之后） */
    var myOrder = letterOrder(letter);
    var beforeHead = null;
    heads.forEach(function (h) {
      if (!isLetterHead(h)) return;
      if (beforeHead) return;
      if (letterOrder(h.textContent.trim()) > myOrder) beforeHead = h;
    });
    head = document.createElement('div');
    head.className = 'pick-group-h';
    head.textContent = letter;
    if (beforeHead) {
      beforeHead.parentNode.insertBefore(head, beforeHead);
      head.parentNode.insertBefore(wrap, head.nextSibling);
    } else {
      list.appendChild(head);
      list.appendChild(wrap);
    }
    return row;
  }

  function confirmAddMember() {
    var wrap = addMemberWrap();
    if (!wrap) return;
    var nameInp = wrap.querySelector('[data-am-name]');
    var phoneInp = wrap.querySelector('[data-am-phone]');
    var name = ((nameInp && nameInp.value) || '').trim();
    var phone = ((phoneInp && phoneInp.value) || '').trim();
    var gender = wrap.getAttribute('data-gender') || '';
    if (!name) { toast('请输入姓名'); return; }
    if (phone && !validPhone(phone)) {
      setPhoneErr(wrap, true);
      toast('手机号格式不正确');
      return;
    }
    setPhoneErr(wrap, false);
    if (!gender) { toast('请选择性别'); return; }
    /* 只填姓（1 个字）+ 已选性别 → 自动识别为「*先生 / *小姐」 */
    var display = name.length === 1 ? name + (gender === 'male' ? '先生' : '小姐') : name;
    /* 若正在搜索，先退出搜索态，否则新行会被筛选隐藏、无法定位到该行 */
    if ($('#s4 .pick-list').classList.contains('is-searching')) clearPickSearch(false);
    var row = insertMemberRow(display, phone, gender);
    closeAddMember();
    if (!row) return;
    var w = row.closest ? row.closest('.pick-row-wrap') : null;
    $all('.pick-row-wrap.is-open').forEach(function (x) { x.classList.remove('is-open'); });
    if (w) w.classList.add('is-open');
    scrollPickListTo(w || row);
    toast('已添加会员 · ' + display);
  }

  function wireAddMember() {
    var wrap = addMemberWrap();
    if (!wrap || wrap.getAttribute('data-wired') === '1') return;
    wrap.setAttribute('data-wired', '1');
    var row = wrap.querySelector('[data-add-member]');
    if (row) {
      row.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleAddMember();
      });
    }
    $all('[data-am-gender]', wrap).forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var g = b.getAttribute('data-am-gender');
        var cur = wrap.getAttribute('data-gender');
        setAddMemberGender(wrap, cur === g ? '' : g);
      });
    });
    var nameInp = wrap.querySelector('[data-am-name]');
    var phoneInp = wrap.querySelector('[data-am-phone]');
    if (nameInp) {
      nameInp.addEventListener('input', function () { nameInp.classList.remove('is-err'); });
    }
    if (phoneInp) {
      phoneInp.addEventListener('input', function () {
        phoneInp.value = phoneInp.value.replace(/\D/g, '').slice(0, 11);
        setPhoneErr(wrap, false);
      });
      phoneInp.addEventListener('blur', function () {
        var v = phoneInp.value.trim();
        setPhoneErr(wrap, !!v && !validPhone(v));
      });
    }
    var cancel = wrap.querySelector('[data-am-cancel]');
    if (cancel) cancel.addEventListener('click', function (e) { e.stopPropagation(); closeAddMember(); });
    var ok = wrap.querySelector('[data-am-confirm]');
    if (ok) ok.addEventListener('click', function (e) { e.stopPropagation(); confirmAddMember(); });
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
    var body = scr.querySelector('.v2-bill-body');
    if (body) return body;
    body = document.createElement('div');
    body.className = 'v2-bill-body';
    body.id = screenId + 'BillBody';
    var bar = scr.querySelector('.bottom-bar');
    if (bar) scr.insertBefore(body, bar);
    else scr.appendChild(body);
    /* 列表滚动：仅切换「已滚动」态（顾客卡片不再随滚动位移，视差方案已取消） */
    body.addEventListener('scroll', function () {
      body.classList.toggle('is-scrolled', body.scrollTop > 1);
    }, { passive: true });
    return body;
  }

  /* ========== 顾客卡片：默认收起，从标题栏右侧入口展开/收起（iOS 动效） ==========
     收起后价目表大卡片直接上移贴住标题栏；展开由卡片自身高度撑开，价目表随之下移。 */
  function ccardWrap(body) { return body ? body.querySelector('[data-ccard-wrap]') : null; }
  function ccardEl(body) { return body ? body.querySelector('.v2-ccard') : null; }
  var custOpen = { s1: false, s5: false };
  var custAnim = {};
  function isCustOpen(screenId) { return !!custOpen[screenId]; }

  function custCardOpen(screenId, on) {
    var body = document.getElementById(screenId + 'BillBody');
    if (!body) return;
    var wrap = ccardWrap(body);
    var card = ccardEl(body);
    if (!wrap || !card) return;
    custOpen[screenId] = !!on;
    body.classList.toggle('cust-open', !!on);
    paintNavCust(screenId);

    var anim = custAnim[screenId];
    var from = wrap.getBoundingClientRect().height;
    if (on) {
      /* 展开：先量出目标高度，再 0 → H 过渡（卡片同时从右上角放大淡入） */
      wrap.style.height = 'auto';
      var to = wrap.getBoundingClientRect().height;
      wrap.style.height = from + 'px';
      void wrap.offsetWidth;
      clearTimeout(anim);
      wrap.style.height = to + 'px';
      custAnim[screenId] = setTimeout(function () {
        if (!isCustOpen(screenId)) return;
        wrap.style.height = 'auto';
        wrap.style.transition = '';
      }, 400);
    } else {
      wrap.style.height = from + 'px';
      void wrap.offsetWidth;
      clearTimeout(anim);
      wrap.style.height = '0px';
      custAnim[screenId] = setTimeout(function () {
        if (isCustOpen(screenId)) return;
        wrap.style.height = '0px';
        wrap.style.transition = '';
      }, 400);
    }
  }

  function toggleCustCard(screenId) {
    custCardOpen(screenId, !isCustOpen(screenId));
  }

  /* 标题栏右侧入口：会员 = 单人 icon + 姓名；散客 = 双人 icon + 「散客/男散客/女散客」
     两态 icon 均为 #929292 灰，仅图形不同（会员=单人，散客=双人） */
  var IC_CUST_MEMBER = 'assets/ic_member_head.svg';
  var IC_CUST_GUEST = 'assets/ic_guest_head.svg';
  function paintNavCust(screenId) {
    var scr = document.getElementById(screenId);
    if (!scr) return;
    var btn = scr.querySelector('[data-nav-cust]');
    if (!btn) return;
    var member = (screenId === 's5') || custIsMember;
    var m = memberProfile();
    var nm = btn.querySelector('[data-nav-cust-name]');
    var ic = btn.querySelector('.ic-mem');
    if (nm) nm.textContent = member ? m.name : guestDisplayName(currentGuestG());
    if (ic) {
      var want = member ? IC_CUST_MEMBER : IC_CUST_GUEST;
      if (ic.getAttribute('src') !== want) ic.setAttribute('src', want);
      ic.style.display = '';
    }
    btn.classList.toggle('is-member', member);
    btn.setAttribute('aria-expanded', isCustOpen(screenId) ? 'true' : 'false');
  }

  function wireNavCust(screenId) {
    var scr = document.getElementById(screenId);
    if (!scr) return;
    var btn = scr.querySelector('[data-nav-cust]');
    if (!btn || btn.getAttribute('data-wired') === '1') return;
    btn.setAttribute('data-wired', '1');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleCustCard(screenId);
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
    wireCardAddMember(root);
  }

  /* 卡内注册面板展开时按当前散客性别预选性别（男散客→男 / 女散客→女） */
  function cardDefaultGender(card) {
    var g = card.getAttribute('data-g') || currentGuestG();
    return (g === 'male' || g === 'female') ? g : '';
  }
  /* 点图标：展开 / 收起（展开时重置表单并按散客性别预选） */
  function toggleCardAddMember(card) {
    var open = card.classList.contains('is-open');
    resetAddMemberForm(card);
    if (!open) setAddMemberGender(card, cardDefaultGender(card));
    card.classList.toggle('is-open', !open);
  }

  /* ========== 散客卡「添加会员」入口：卡内快捷注册会员 ========== */
  /* 注意：淡色卡会整体重绘 innerHTML，故按「元素」而非按「卡」判断是否已绑定 */
  function wireCardAddMember(card) {
    if (!card) return;
    var panel = card.querySelector('[data-addmem-panel]');
    if (!panel) return;
    var btn = card.querySelector('[data-addmem-toggle]');
    if (btn && btn.getAttribute('data-wired') !== '1') {
      btn.setAttribute('data-wired', '1');
      btn.onclick = function (e) {
        e.stopPropagation();
        toggleCardAddMember(card);
      };
    }
    if (panel.getAttribute('data-wired') === '1') return;
    panel.setAttribute('data-wired', '1');
    /* 性别为必填单选：点击即选中，不因重复点击而取消（已有默认值，避免误点后变空） */
    $all('[data-am-gender]', panel).forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        setAddMemberGender(card, b.getAttribute('data-am-gender'));
      });
    });
    var nameInp = panel.querySelector('[data-am-name]');
    if (nameInp) {
      nameInp.addEventListener('click', function (e) { e.stopPropagation(); });
    }
    var phoneInp = panel.querySelector('[data-am-phone]');
    if (phoneInp) {
      phoneInp.addEventListener('click', function (e) { e.stopPropagation(); });
      phoneInp.addEventListener('input', function () {
        phoneInp.value = phoneInp.value.replace(/\D/g, '').slice(0, 11);
        setPhoneErr(card, false);
      });
    }
    var cancel = panel.querySelector('[data-am-cancel]');
    if (cancel) {
      cancel.addEventListener('click', function (e) {
        e.stopPropagation();
        resetAddMemberForm(card);
        card.classList.remove('is-open');
      });
    }
    var ok = panel.querySelector('[data-am-confirm]');
    if (ok) {
      ok.addEventListener('click', function (e) {
        e.stopPropagation();
        confirmCardAddMember(card);
      });
    }
  }

  /* 卡内注册成功：收起面板 → 顶部卡就地变会员卡（档案=刚注册，上次到店=今天） */
  function confirmCardAddMember(card) {
    var nameInp = card.querySelector('[data-am-name]');
    var phoneInp = card.querySelector('[data-am-phone]');
    var name = ((nameInp && nameInp.value) || '').trim();
    var phone = ((phoneInp && phoneInp.value) || '').trim();
    var gender = card.getAttribute('data-gender') || '';
    if (!name) { toast('请输入姓名'); return; }
    if (phone && !validPhone(phone)) {
      setPhoneErr(card, true);
      toast('手机号格式不正确');
      return;
    }
    setPhoneErr(card, false);
    if (!gender) { toast('请选择性别'); return; }
    /* 只填姓（1 个字）+ 已选性别 → 自动识别为「*先生 / *小姐」 */
    var display = name.length === 1 ? name + (gender === 'male' ? '先生' : '小姐') : name;
    resetAddMemberForm(card);
    card.classList.remove('is-open');
    registerCardMember(display, phone, gender);
    toast('已添加会员 · ' + display);
  }

  /* 顾客身份变化：清掉「自动匹配」的权益，让结算页按新身份重新匹配（手动选择的权益不动） */
  function refreshAutoBenefits() {
    var list = window.cartItems || [];
    var touched = false;
    list.forEach(function (it) {
      if (it && it._benefitAuto) {
        it.benefit = null;
        it._benefitCleared = false;
        it._benefitAuto = false;
        touched = true;
      }
    });
    if (!touched) return;
    var active = document.querySelector('.screen.active');
    var id = active ? active.id : '';
    if (id === 's6' && window.renderCo) window.renderCo();
    if (id === 's7' && window.renderQco) window.renderQco();
  }

  /* 注册为会员：写入档案 + 切会员身份 + 全端重绘顶部卡 */
  function registerCardMember(display, phone, gender) {
    setMemberProfile(display, gender, '', true);
    var m = memberProfile();
    m.phone = phone || '';
    custIsMember = true;
    if (window.setCust) window.setCust('member');
    if (window.setCoCust) window.setCoCust('member');
    if (window.setQcoCust) window.setQcoCust('member');
    repaintAllCards();
    refreshAutoBenefits();
  }

  /* 依据档案重绘所有会员卡（含 s1/s5 顶部卡与 s2/s3/s6/s7 淡色卡） */
  function paintMemberCards() {
    $all('.member-card[data-v2-lite="1"]').forEach(function (card) {
      card.classList.remove('is-open');
      card.classList.add('v2-ccard', 'v2-ccard--member');
      card.innerHTML = memberCardInnerHtml();
      wireCcard(card);
    });
  }
  function repaintBillCard(id) {
    var body = document.getElementById(id + 'BillBody');
    if (!body) return;
    var old = body.querySelector('[data-bill-card]');
    if (!old) return;
    var member = (id === 's5') || custIsMember;
    var tmp = document.createElement('div');
    tmp.innerHTML = member ? memberCardHtml() : guestCardHtml(currentGuestG());
    var fresh = tmp.firstChild;
    old.parentNode.replaceChild(fresh, old);
    wireCcard(fresh);
  }
  function repaintAllCards() {
    paintMemberCards();
    syncGuestLite(currentGuestG());
    repaintBillCard('s1');
    repaintBillCard('s5');
  }

  /* 会员身份变化（选会员/注册会员）时同步淡色卡与 s6/s7 结算页身份 */
  function hookCust() {
    if (window.setCust && !window.setCust._v2m) {
      var _sc = window.setCust;
      window.setCust = function (type) {
        var was = custIsMember;
        _sc.apply(this, arguments);
        custIsMember = (type === 'member');
        paintMemberCards();
        if (was !== custIsMember) refreshAutoBenefits();
      };
      window.setCust._v2m = true;
    }
    /* 散客页注册会员后 → 结算页（含「下一步」里按开单页推导身份的旧逻辑）保持会员身份 */
    if (window.setCoCust && !window.setCoCust._v2m) {
      var _scc = window.setCoCust;
      window.setCoCust = function (type) {
        return _scc.call(this, (custIsMember && type === 'guest') ? 'member' : type);
      };
      window.setCoCust._v2m = true;
    }
  }

  /* 会员卡内容（顶部卡 · 展开区展示持卡列表：卡类型 + 卡名 + 剩余权益；
     展示内容与线上现有版本一致，原型用演示数据） */
  /* 演示用持卡列表（陈女士）：储值卡 / 计次卡 / 折扣卡各一张 */
  var MEMBER_CARDS = [
    { type: '储值卡', name: '美发卡2000元', rest: '余额1900.00元' },
    { type: '计次卡', name: '染烫10次卡', rest: '余4次' },
    { type: '折扣卡', name: '超值折扣卡', rest: '8.0折' }
  ];
  /* 本次新注册会员（无卡无权益）→ 空列表，展开区显示空态 */
  function memberCardList() {
    var m = memberProfile();
    if (m.isNew || window.__v2MemberNoBenefit) return [];
    return MEMBER_CARDS;
  }
  function memberCardRowHtml(c) {
    return '<div class="v2-ccard__mc">' +
        '<span class="v2-ccard__mc-type">' + esc(c.type) + '</span>' +
        '<span class="v2-ccard__mc-name">' + esc(c.name) + '</span>' +
        '<span class="v2-ccard__mc-rest">' + esc(c.rest) + '</span>' +
      '</div>';
  }
  /* 会员持卡中的最优「折扣」权益（陈女士＝超值折扣卡 8.0折）。
     口径与结算页自动匹配的权益同源；计次卡 / 储值卡按项目抵扣、规则不同，
     不参与价目表「权益最优价」。无卡会员返回 null（价目表维持单色原价）。 */
  function memberBestDiscountRate() {
    if (window.__v2MemberNoBenefit) return null;
    var best = null;
    memberCardList().forEach(function (c) {
      if (c.type !== '折扣卡') return;
      var m = String(c.rest || '').match(/([\d.]+)\s*折/);
      if (!m) return;
      var r = parseFloat(m[1]) / 10;
      if (!isFinite(r) || r <= 0 || r >= 1) return;
      if (best == null || r < best) best = r;
    });
    return best;
  }
  /* 价目表价格单元格：无权益 → 单色原价；有权益 → 划线原价 + 红色权益价 */
  function priceCellHtml(price, rate) {
    var base = Number(price) || 0;
    if (rate == null) return money(base);
    var sale = Math.round(base * rate * 100) / 100;
    return '<s class="v2-cat-price-old">' + money(base) + '</s>' +
      '<span class="v2-cat-price-sale">' + money(sale) + '</span>';
  }
  function memberCardsHtml() {
    var list = memberCardList();
    if (!list.length) {
      return '<div class="v2-ccard__cards is-empty">暂无会员卡</div>';
    }
    return '<div class="v2-ccard__cards">' + list.map(memberCardRowHtml).join('') + '</div>';
  }
  function memberCardInnerHtml() {
    return '<div class="v2-ccard__row" style="width:100%">' +
        '<img class="v2-ccard__avatar" src="' + memberProfile().avatar + '" alt="">' +
        '<div class="v2-ccard__info">' +
          '<div class="v2-ccard__name">' +
            '<span class="v2-ccard__name-text nm">' + esc(memberProfile().name) + '</span>' +
            '<img class="v2-ccard__vip" src="assets/ic_vip.svg" alt="VIP">' +
          '</div>' +
          '<div class="v2-ccard__sub last">上次到店' + esc(memberProfile().lastVisit) + '</div>' +
        '</div>' +
        '<button type="button" class="v2-ccard__chev" data-ccard-toggle aria-label="展开权益">' +
          CHEV_SVG + '</button>' +
      '</div>' +
      memberCardsHtml();
  }
  function memberCardHtml() {
    return '<div class="v2-ccard v2-ccard--member" data-bill-card>' +
      memberCardInnerHtml() + '</div>';
  }

  /* 卡内快捷注册会员面板（复用 s4 的 .pa-* 字段样式） */
  function addMemPanelHtml() {
    return '<div class="v2-ccard__addpanel" data-addmem-panel>' +
        '<div class="pa-field"><div class="pa-lbl">姓名<i class="req">*</i></div>' +
          '<div class="pa-ctl"><input class="pa-input" data-am-name type="text" maxlength="20" ' +
            'placeholder="请输入姓名"></div></div>' +
        '<div class="pa-field"><div class="pa-lbl">手机号</div>' +
          '<div class="pa-ctl"><input class="pa-input" data-am-phone type="tel" inputmode="numeric" ' +
            'maxlength="11" placeholder="请输入手机号（选填）">' +
            '<div class="pa-err" data-am-phone-err>手机号格式不正确</div></div></div>' +
        '<div class="pa-field"><div class="pa-lbl">性别<i class="req">*</i></div>' +
          '<div class="pa-ctl"><div class="pa-gender">' +
            '<button type="button" class="pa-g" data-am-gender="male">男</button>' +
            '<button type="button" class="pa-g" data-am-gender="female">女</button>' +
          '</div></div></div>' +
        '<div class="pa-foot">' +
          '<button type="button" class="pa-btn cancel" data-am-cancel>取消</button>' +
          '<button type="button" class="pa-btn ok" data-am-confirm>确认添加</button>' +
        '</div>' +
      '</div>';
  }
  /* 散客卡内容：男/女散客右侧带「添加会员」入口，点击卡内下展快捷注册 */
  function guestCardInnerHtml(g) {
    var canAdd = (g === 'male' || g === 'female');
    return '<div class="v2-ccard__row" style="width:100%">' +
        '<img class="v2-ccard__avatar" data-v2-guest-av src="' + guestAvatarSrc(g) + '" alt="">' +
        '<div class="v2-ccard__info">' +
          '<div class="v2-ccard__name"><span class="v2-ccard__name-text nm">' +
            guestDisplayName(g) + '</span></div>' +
        '</div>' +
        (canAdd ? '<button type="button" class="v2-ccard__addmem" data-addmem-toggle ' +
          'aria-label="添加会员">' + ADD_MEMBER_SVG + '</button>' : '') +
      '</div>' +
      (canAdd ? addMemPanelHtml() : '');
  }
  function guestCardHtml(g) {
    return '<div class="v2-ccard" data-bill-card data-g="' + esc(g || 'default') + '">' +
      guestCardInnerHtml(g) + '</div>';
  }

  function customerHtml(screenId) {
    if (screenId === 's5' || custIsMember) return memberCardHtml();
    return guestCardHtml(currentGuestG());
  }

  function rebuildBill(screenId) {
    var body = ensureBillBody(screenId);
    if (!body) return;
    closeExpand();
    /* 价目表为空 → 隐藏对应 tab；两个都空 → 两个 tab 都显示并给出管理入口（本期仅说明） */
    var projEmpty = !CATALOG.project.items.length;
    var prodEmpty = !CATALOG.product.items.length;
    var bothEmpty = projEmpty && prodEmpty;
    var hideProj = projEmpty && !bothEmpty;
    var hideProd = prodEmpty && !bothEmpty;
    var tab = billTab[screenId] || 'project';
    if (tab === 'project' && hideProj) tab = 'product';
    if (tab === 'product' && hideProd) tab = 'project';
    billTab[screenId] = tab;
    var cat = CATALOG[tab];
    var groups = ['全部'].concat(cat.groups);
    if (!billGroup[screenId] || groups.indexOf(billGroup[screenId]) < 0) {
      billGroup[screenId] = '全部';
    }
    var g = billGroup[screenId];

    /* 两个都空：两个 tab 都保留（价目表管理入口本期仅以文案说明） */
    var tabsHtml = '<div class="v2-page-tabs">' +
      (hideProj ? '' : '<button type="button" class="' + (tab === 'project' ? 'on' : '') +
        '" data-btab="project">项目</button>') +
      (hideProd ? '' : '<button type="button" class="' + (tab === 'product' ? 'on' : '') +
        '" data-btab="product">产品</button>') + '</div>';

    var gTabs = groups.map(function (name) {
      return '<button type="button" class="v2-group-tab' +
        (name === g ? ' on' : '') + '" data-bgroup="' + esc(name) + '">' +
        esc(name) + '</button>';
    }).join('');

    var items = g === '全部'
      ? cat.items.slice()
      : cat.items.filter(function (it) { return it.g === g; });
    /* 会员页价目表按「权益最优价」展示（划线原价 + 红色权益价）；散客页维持单色原价 */
    var rate = (screenId === 's5') ? memberBestDiscountRate() : null;
    var list = items.map(function (it, idx) {
      var key = screenId + '_' + tab + '_' + g + '_' + idx;
      return '<div class="v2-cat-item" data-ikey="' + key + '" data-name="' +
        esc(it.name) + '" data-price="' + it.price + '" data-prod="' +
        (tab === 'product' ? '1' : '0') + '" data-group="' + esc(it.g) + '">' +
        '<div class="v2-cat-main">' +
          '<div class="v2-cat-info"><div class="v2-cat-name">' + esc(it.name) +
          '</div><div class="v2-cat-price' + (rate == null ? '' : ' has-sale') + '">' +
          priceCellHtml(it.price, rate) + '</div></div>' +
          '<div class="v2-cat-right" data-right></div>' +
        '</div>' +
      '</div>';
    }).join('');

    body.innerHTML =
      '<div class="v2-ccard-wrap" data-ccard-wrap' +
        (isCustOpen(screenId) ? ' data-open="1"' : '') + '>' +
        customerHtml(screenId) +
      '</div>' +
      '<div class="v2-price-card">' +
        '<div class="v2-price-head">' + tabsHtml +
          '<div class="v2-group-bar"><div class="v2-group-seg"><div class="v2-group-scroll">' +
          gTabs + '</div></div></div>' +
        '</div>' +
        '<div class="v2-catalog">' + list +
          (bothEmpty
            ? '<div class="v2-cat-empty">暂无价目表，请先在「管理价目表」中添加项目或产品</div>'
            : '') +
        '</div>' +
      '</div>';

    wireCcard(body.querySelector('.v2-ccard'));
    /* 默认收起：价目表大卡片上移贴住标题栏；载入时按当前状态直接定位（不做过渡） */
    var wrap = ccardWrap(body);
    if (wrap) wrap.style.height = isCustOpen(screenId) ? 'auto' : '0px';
    body.classList.toggle('cust-open', isCustOpen(screenId));
    paintNavCust(screenId);

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
      renderRowRight(row);
    });
    /* 重绘后同步标题栏入口（切 tab / 切换顾客身份后不丢状态） */
    wireNavCust(screenId);
    paintNavCust(screenId);
  }

  /* 行右侧：仅「＋」——点击弹出底部「设置内容」sheet（不再行内展开） */
  function renderRowRight(row) {
    var right = row.querySelector('[data-right]');
    if (!right) return;
    right.innerHTML =
      '<button type="button" class="v2-add-btn" data-add aria-label="添加">' +
      PLUS_SVG + '</button>';
    right.querySelector('[data-add]').onclick = function (e) {
      e.stopPropagation();
      openItemSheet(row);
    };
  }

  function emptyStaffRow() {
    return {
      id: '__v2draft__' + Date.now(),
      staffIds: [],
      staffRoles: {},
      staffExtra: {},
      staffChosen: {}
    };
  }

  /* ========== 点「＋」→ 底部「设置内容」sheet（Figma 176:329）
     数量 / 应付（元）/ 服务员工，点「确定」加入购物车（已放弃原行内展开区方案） ========== */
  function sheetEl(id) { return document.getElementById(id); }

  function paintItemSheet() {
    if (!draft) return;
    var t = sheetEl('asTitle');
    var q = sheetEl('asQty');
    var pay = sheetEl('asPayable');
    var grid = sheetEl('asStaffGrid');
    if (t) t.textContent = draft.name;
    if (q) q.textContent = String(draft.qty);
    if (pay) {
      var total = (draft.payTotal != null) ? draft.payTotal : draft.price * draft.qty;
      pay.value = (Math.round(total * 100) / 100).toFixed(2);
      pay.setAttribute('data-prev', pay.value);
    }
    if (grid) {
      /* 员工卡片用「当前草稿行」渲染（ctx=v2draft 时事件委托读 window.__v2DraftStaff） */
      grid.setAttribute('data-ctx', 'v2draft');
      window.__v2DraftStaff = draft.staffRow;
      if (typeof renderStaffInto === 'function') renderStaffInto(grid, draft.staffRow);
    }
  }

  function openItemSheet(row, prefill) {
    var screen = row.closest('.screen');
    var screenId = screen ? screen.id : 's1';
    var base = parseFloat(row.getAttribute('data-price')) || 0;
    draft = {
      key: row.getAttribute('data-ikey'),
      name: row.getAttribute('data-name'),
      price: base,
      base: base,
      qty: 1,
      payTotal: null,
      isProd: row.getAttribute('data-prod') === '1',
      group: row.getAttribute('data-group') || '',
      staffRow: emptyStaffRow(),
      screenId: screenId,
      el: row
    };

    /* 从购物车明细跳回：回填保存的数据（单价 / 数量 / 服务员工），可继续编辑 */
    if (prefill) {
      var p = parseFloat(prefill.price);
      if (isFinite(p) && p >= 0) draft.price = Math.round(p * 100) / 100;
      var b = parseFloat(prefill.base);
      if (isFinite(b) && b >= 0) draft.base = Math.round(b * 100) / 100;
      var q = parseInt(prefill.qty, 10);
      if (isFinite(q) && q > 0) draft.qty = Math.min(99, q);
      var tot = parseFloat(prefill.payTotal);
      if (isFinite(tot) && tot >= 0) draft.payTotal = Math.round(tot * 100) / 100;
      if (prefill.staff) {
        draft.staffRow = {
          id: '__v2edit__' + Date.now(),
          staffIds: (prefill.staff.staffIds || []).slice(),
          staffRoles: Object.assign({}, prefill.staff.staffRoles || {}),
          staffExtra: Object.assign({}, prefill.staff.staffExtra || {}),
          staffChosen: Object.assign({}, prefill.staff.staffChosen || {})
        };
      }
      if (prefill.editUid) draft.editUid = prefill.editUid;
    }
    /* 每次打开都是干净状态：清掉上一次残留的卡片翻牌编辑态 */
    if (typeof window.__staffPickResetEdit === 'function') window.__staffPickResetEdit();
    paintItemSheet();
    var mask = sheetEl('addSheetMask');
    if (mask) mask.classList.add('show');
  }

  /* 数量步进：同步「应付（元）」= 单价 × 数量（手动改价记录随之清空） */
  function stepSheetQty(d) {
    if (!draft) return;
    draft.qty = Math.max(1, Math.min(999, draft.qty + d));
    draft.payTotal = null;
    var q = sheetEl('asQty');
    if (q) q.textContent = String(draft.qty);
    var pay = sheetEl('asPayable');
    if (pay) pay.value = (Math.round(draft.price * draft.qty * 100) / 100).toFixed(2);
  }

  function closeItemSheet() {
    var mask = sheetEl('addSheetMask');
    if (mask) mask.classList.remove('show');
    if (draft && draft.el) draft.el.classList.remove('is-open');
    draft = null;
    window.__v2DraftStaff = null;
  }

  /* 「确定」：把 sheet 上的数量 / 应付 / 服务员工落到草稿并加入购物车 */
  function confirmItemSheet(btn) {
    if (!draft) return;
    var q = sheetEl('asQty');
    var pay = sheetEl('asPayable');
    var qty = parseInt(q ? q.textContent : '', 10);
    if (isFinite(qty) && qty > 0) draft.qty = Math.min(999, qty);
    var total = pay ? parseFloat(pay.value) : NaN;
    if (isFinite(total) && total >= 0) draft.payTotal = Math.round(total * 100) / 100;
    commitDraft(btn);
  }

  function wireItemSheet() {
    var mask = sheetEl('addSheetMask');
    if (!mask || mask.getAttribute('data-v2wired') === '1') return;
    mask.setAttribute('data-v2wired', '1');
    mask.addEventListener('click', function (e) {
      if (e.target === mask) closeItemSheet();
    });
    mask.querySelectorAll('[data-sq]').forEach(function (b) {
      b.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        stepSheetQty(parseInt(b.getAttribute('data-sq'), 10) || 0);
      };
    });
    /* 「应付（元）」右侧铅笔：聚焦数字输入框（唤起键盘直接改价） */
    var pen = mask.querySelector('.pen');
    if (pen) {
      pen.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var pay = sheetEl('asPayable');
        if (pay) {
          pay.focus();
          if (pay.select) pay.select();
        }
      };
    }
    var ok = mask.querySelector('.btn-confirm');
    if (ok) {
      ok.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        confirmItemSheet(ok);
      };
    }
  }

  /* 员工选择内嵌在「设置内容」sheet 内（点卡片展开选项卡：工位多选 + 顾客指定），
     每次改选后由 index.html 的事件委托重绘卡片网格，此处无需额外处理 */
  window.__v2OnDraftStaffChange = function () {};

  function closeExpand() { closeItemSheet(); }

  function commitDraft(fromBtn) {
    if (!draft) return;
    if (!window.cartItems) window.cartItems = [];
    /* 手动改过「应付（元）」→ 以输入值为准（结算页该明细不可用权益），否则 = 单价 × 数量 */
    var payable = (draft.payTotal != null)
      ? Math.round(draft.payTotal * 100) / 100
      : Math.round(draft.price * draft.qty * 100) / 100;
    var basePay = Math.round(draft.base * draft.qty * 100) / 100;
    var kind = draft.screenId === 's5' ? 'member' : 'guest';
    var staffObj = {
      id: '__co',
      staffIds: draft.staffRow.staffIds.slice(),
      staffRoles: Object.assign({}, draft.staffRow.staffRoles),
      staffExtra: Object.assign({}, draft.staffRow.staffExtra || {}),
      staffChosen: Object.assign({}, draft.staffRow.staffChosen || {})
    };
    var discounted = Math.abs(payable - basePay) > 0.001;
    var record = {
      name: draft.name,
      price: draft.price,
      salePrice: draft.base,
      qty: draft.qty,
      payable: payable,
      receivable: payable,
      actual: payable,
      discounted: discounted,
      isProd: draft.isProd,
      kind: kind,
      group: draft.group,
      thumb: '',
      staff: staffObj,
      benefit: null,
      _benefitCleared: false
    };
    /* 从购物车明细跳回再提交 → 替换原条目（不新增） */
    var editUid = draft.editUid || '';
    var editIdx = editUid ? cartIndexOfUid(editUid) : -1;
    if (editIdx >= 0) {
      var old = window.cartItems[editIdx] || {};
      record._uid = editUid;
      record._benefitAuto = !!old._benefitAuto;
      /* 改价商品沿用「权益锁定」；未改价则保留原权益 */
      if (discounted) {
        record.benefit = null;
        record._benefitCleared = true;
        record._benefitAuto = false;
      } else {
        record.benefit = old.benefit || null;
        record._benefitCleared = !!old._benefitCleared;
      }
      window.cartItems[editIdx] = record;
    } else {
      record._uid = nextCartUid();
      window.cartItems.push(record);
    }
    if (typeof window.recalcOrderAmounts === 'function') window.recalcOrderAmounts();
    if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
    else refreshCartUI();

    var btn = fromBtn;
    var sid = draft.screenId;
    var startRect = btn ? btn.getBoundingClientRect() : null;
    var replaced = editIdx >= 0;
    var toastSeq = window.__toastSeq || 0;
    closeExpand();
    flyToCart(startRect, sid, function () {
      /* 飞入动画期间若已有更新的提示（如「挂单成功」）出现，则不再覆盖 */
      if ((window.__toastSeq || 0) !== toastSeq) return;
      toast(replaced ? '已更新该笔' : '已加入购物车');
    });
  }

  /* 购物车明细唯一标识（用于「跳回原行编辑」时精确替换，避免下标漂移） */
  var cartSeq = 0;
  function nextCartUid() {
    cartSeq += 1;
    return 'c' + Date.now().toString(36) + '_' + cartSeq;
  }
  window.__v2NextCartUid = nextCartUid;
  function cartIndexOfUid(uid) {
    var list = window.cartItems || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i]._uid === uid) return i;
    }
    return -1;
  }

  /* 购物车明细点击 → 跳到开单页对应行、弹出「设置内容」sheet 回填保存的数据，可再编辑 */
  window.__v2JumpToCartItem = function (index) {
    var list = window.cartItems || [];
    var it = list[index];
    if (!it) return false;
    var sid = it.kind === 'member' ? 's5' : 's1';
    if (typeof window.closeCartSheet === 'function') window.closeCartSheet();
    if (typeof window.setCust === 'function') window.setCust(it.kind === 'member' ? 'member' : 'guest');
    billTab[sid] = it.isProd ? 'product' : 'project';
    billGroup[sid] = '全部';
    go(sid); /* onGoHook 会重建开单页，等待重建完成后再定位 */
    var payload = {
      price: it.price,
      base: (it.salePrice != null ? it.salePrice : it.price),
      qty: it.qty,
      payTotal: (it.payable != null ? it.payable : null),
      staff: it.staff,
      editUid: it._uid || ''
    };
    var tries = 0;
    function seek() {
      var body = document.getElementById(sid + 'BillBody');
      var rows = body ? $all('.v2-cat-item', body) : [];
      var row = null;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].getAttribute('data-name') === it.name &&
            (rows[i].getAttribute('data-prod') === '1') === !!it.isProd) { row = rows[i]; break; }
      }
      if (!row && tries < 12) { tries += 1; setTimeout(seek, 50); return; }
      if (!row) { toast('该价目已变更，无法定位'); return; }
      openItemSheet(row, payload);
    }
    setTimeout(seek, 80);
    return true;
  };

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

  /* 点「设置内容」sheet 外的遮罩区域即关闭；点 sheet 内部不关闭 */
  document.addEventListener('click', function (e) {
    if (!draft) return;
    if (e.target.closest('#addSheetMask')) return;
    if (e.target.closest('.v2-fly-ball')) return;
    closeItemSheet();
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
  /* 订单级优惠券状态由 index.html 持有（window.__v2OrderCoupon），
     此处仅负责「优惠券」行的展示与打开「选择优惠券」sheet（R13） */
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
      var scroller = scr && scr.querySelector('.scroll');
      /* R9「白卡盖住顾客卡」：与开单页同源 —— 滚动时给滚动区打 is-scrolled，
         顾客卡片降到 z-index 1（明细白卡为 2），于是白卡能从下方滑过并盖住它 */
      if (scroller && !scroller.__v2CoScroll) {
        scroller.__v2CoScroll = true;
        scroller.addEventListener('scroll', function () {
          scroller.classList.toggle('is-scrolled', scroller.scrollTop > 1);
        }, { passive: true });
      }
      ['guest-card', 'member-card'].forEach(function (cls) {
        var card = scr && scr.querySelector('.' + cls);
        if (!card) return;
        /* 顾客卡片吸在滚动区顶部（sticky）：明细白卡滚动时从下往上盖住它 */
        card.style.position = 'sticky';
        card.style.left = 'auto';
        card.style.top = '0';
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

        /* 「优惠券」行：仅右侧「值 + ›」为热区，点击打开「选择优惠券」sheet（R13） */
        extras.querySelector('[data-coupon-val]').onclick = function () {
          if (typeof window.openCouponPickSheet === 'function') window.openCouponPickSheet();
        };
        window.__v2RenderCouponRows = function () {
          var c = window.__v2OrderCoupon || null;
          $all('[data-coupon-val]').forEach(function (valEl) {
            if (c) {
              valEl.className = 'r has';
              valEl.innerHTML = esc(c.name) + '<span>›</span>';
            } else {
              valEl.className = 'r';
              valEl.innerHTML = '请选择<span>›</span>';
            }
          });
        };
        window.__v2RenderCouponRows();

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
        var gg = card.getAttribute('data-g') || 'default';
        card.classList.remove('is-open');
        card.innerHTML = guestCardInnerHtml(gg);
        wireCcard(card);
        return;
      }
      var g = card.getAttribute('data-g') || 'default';
      var keep = [];
      if (card.classList.contains('gcard')) keep.push('gcard');
      if (card.classList.contains('co-gcard')) keep.push('co-gcard');
      card.className = ('guest-card v2-lite ' + keep.join(' ')).trim();
      card.setAttribute('data-v2-lite', '1');
      card.setAttribute('data-g', g);
      card.innerHTML = guestCardInnerHtml(g);
      wireCcard(card);
    });

    $all('.member-card').forEach(function (card) {
      if (card.getAttribute('data-v2-lite') === '1') {
        card.classList.add('v2-lite', 'v2-ccard', 'v2-ccard--member');
        wireCcard(card);
        return;
      }
      var keep = [];
      if (card.classList.contains('mcard')) keep.push('mcard');
      if (card.classList.contains('co-mcard')) keep.push('co-mcard');
      card.className = ('member-card v2-lite ' + keep.join(' ')).trim();
      card.setAttribute('data-v2-lite', '1');
      /* 复用折叠样式：member-card 当容器，内部用 v2-ccard 结构 */
      card.classList.add('v2-ccard', 'v2-ccard--member');
      card.innerHTML = memberCardInnerHtml();
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
      /* 淡色卡整体重绘：男/女散客带「添加会员」入口 */
      if (card.getAttribute('data-v2-lite') === '1') {
        card.classList.remove('is-open');
        card.innerHTML = guestCardInnerHtml(g);
        wireCcard(card);
        return;
      }
      var av = card.querySelector('[data-v2-guest-av], .v2-ccard__avatar');
      if (av) av.src = src;
      var nm = card.querySelector('.nm');
      if (nm) nm.textContent = name;
      var sub = card.querySelector('.v2-ccard__sub');
      if (sub) sub.remove();
    });
    if (!custIsMember) repaintBillCard('s1');
  }

  /* ========== 标题栏日期控件：今天往前 3 个月内任选一天 ========== */
  var dPad = function (n) { return (n < 10 ? '0' : '') + n; };
  var dToday = (function () { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); })();
  /* 可选范围：今天往前推 3 个月（含今天），不可选未来 */
  var D_MAX = new Date(dToday.getFullYear(), dToday.getMonth(), dToday.getDate());
  var D_MIN = new Date(dToday.getFullYear(), dToday.getMonth() - 3, dToday.getDate());
  var selDate = new Date(dToday.getFullYear(), dToday.getMonth(), dToday.getDate());
  var viewMonth = new Date(selDate.getFullYear(), selDate.getMonth(), 1);

  function dSame(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  function dIn(d) { return d.getTime() >= D_MIN.getTime() && d.getTime() <= D_MAX.getTime(); }
  function dDot(d) { return d.getFullYear() + '.' + dPad(d.getMonth() + 1) + '.' + dPad(d.getDate()); }
  function dKey(d) { return d.getFullYear() + '-' + dPad(d.getMonth() + 1) + '-' + dPad(d.getDate()); }
  function dParse(key) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key || '');
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }

  function paintBillDates() {
    $all('.nav-bar [data-date-ctl] .date').forEach(function (el) { el.textContent = dDot(selDate); });
  }

  /* 某年某月是否与可选范围有交集（决定上/下月按钮是否可用） */
  function dMonthUsable(y, m) {
    var lastDay = new Date(y, m + 1, 0).getDate();
    return new Date(y, m, lastDay).getTime() >= D_MIN.getTime() &&
           new Date(y, m, 1).getTime() <= D_MAX.getTime();
  }

  function renderDateGrid() {
    var grid = document.querySelector('[data-date-grid]');
    var lab = document.querySelector('[data-date-month]');
    var prev = document.querySelector('[data-date-prev]');
    var next = document.querySelector('[data-date-next]');
    if (!grid) return;
    var y = viewMonth.getFullYear(), m = viewMonth.getMonth();
    if (lab) lab.textContent = y + '年' + (m + 1) + '月';
    var prevY = m === 0 ? y - 1 : y, prevM = m === 0 ? 11 : m - 1;
    var nextY = m === 11 ? y + 1 : y, nextM = m === 11 ? 0 : m + 1;
    if (prev) prev.disabled = !dMonthUsable(prevY, prevM);
    if (next) next.disabled = !dMonthUsable(nextY, nextM);
    /* 固定 6 行 × 7 列，弹层高度稳定 */
    var first = new Date(y, m, 1);
    var start = new Date(y, m, 1 - first.getDay());
    var html = '';
    for (var i = 0; i < 42; i++) {
      var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      var cls = 'dp-d';
      if (d.getMonth() !== m) cls += ' is-other';
      if (dSame(d, dToday)) cls += ' is-today';
      if (dSame(d, selDate)) cls += ' is-sel';
      var dis = dIn(d) ? '' : ' disabled';
      html += '<button type="button" class="' + cls + '"' + dis +
        ' data-date="' + dKey(d) + '"><span class="d-num">' + d.getDate() + '</span></button>';
    }
    grid.innerHTML = html;
  }

  /* asSheet=true：以底部 sheet 形态呈现（成功页「改日期」）；
     缺省为标题栏日期控件下拉形态 */
  function openDatePop(asSheet) {
    var mask = document.querySelector('[data-date-mask]');
    var pop = document.querySelector('[data-date-pop]');
    if (!pop) return;
    viewMonth = new Date(selDate.getFullYear(), selDate.getMonth(), 1);
    renderDateGrid();
    pop.classList.toggle('is-sheet', asSheet === true);
    if (mask) mask.classList.add('show');
    pop.classList.add('show');
  }
  function closeDatePop() {
    var mask = document.querySelector('[data-date-mask]');
    var pop = document.querySelector('[data-date-pop]');
    if (mask) mask.classList.remove('show');
    if (pop) pop.classList.remove('show');
  }
  function setBillDate(d) {
    if (!d || !dIn(d)) return;
    selDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    paintBillDates();
    closeDatePop();
    /* 成功页「改日期」：确认后同步成功页显示的开单日期 */
    if (typeof window.__v2OnBillDateChange === 'function') window.__v2OnBillDateChange(dKey(selDate));
  }

  function wireDateCtl() {
    var mask = document.querySelector('[data-date-mask]');
    var pop = document.querySelector('[data-date-pop]');
    paintBillDates();
    if (mask) mask.addEventListener('click', closeDatePop);
    /* 标题栏日期控件（6 个页面）→ 展开浮层 */
    document.addEventListener('click', function (e) {
      var ctl = e.target.closest && e.target.closest('[data-date-ctl]');
      if (!ctl) return;
      e.preventDefault();
      e.stopPropagation();
      if (pop && pop.classList.contains('show')) closeDatePop(); else openDatePop();
    });
    if (!pop) return;
    pop.addEventListener('click', function (e) {
      var nav = e.target.closest('[data-date-prev], [data-date-next]');
      if (nav) {
        e.stopPropagation();
        if (nav.disabled) return;
        viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + (nav.hasAttribute('data-date-prev') ? -1 : 1), 1);
        renderDateGrid();
        return;
      }
      var q = e.target.closest('[data-date-quick]');
      if (q) {
        e.stopPropagation();
        var kind = q.getAttribute('data-date-quick');
        var d = new Date(dToday.getFullYear(), dToday.getMonth(), dToday.getDate() - (kind === 'yesterday' ? 1 : 0));
        setBillDate(d);
        return;
      }
      var day = e.target.closest('[data-date]');
      if (day) {
        e.stopPropagation();
        if (day.disabled) return;
        setBillDate(dParse(day.getAttribute('data-date')));
      }
    });
    window.__v2BillDate = function () { return dKey(selDate); };
    /* 成功页「改日期」：复用同一日历，以底部 sheet 形态打开 */
    window.__v2OpenDatePop = openDatePop;
    window.__v2OpenDateSheet = function () { openDatePop(true); };
  }

  /* 演示开关（仅用于演示「价目表为空 → 隐藏对应 tab」）：
     ?noProduct=1 产品为空；?noProject=1 项目为空；两个都加 = 两个都空（两个 tab 都显示） */
  function applyDemoSwitches() {
    var q = location.search || '';
    if (/[?&]noProduct=1/.test(q)) CATALOG.product.items = [];
    if (/[?&]noProject=1/.test(q)) CATALOG.project.items = [];
  }

  function boot() {
    applyDemoSwitches();
    syncHold();
    wrapPickRows();
    wireAddMember();
    wirePickSearch();
    wireDateCtl();
    wireItemSheet();
    wireNavCust('s1');
    wireNavCust('s5');
    hookCust();
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
