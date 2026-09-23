(function (g) {
  'use strict';
  var state = g.__flowKeypadState = g.__flowKeypadState || {
    amountKeypadTarget: null,
    amountKeypadBuffer: '',
    amountKeypadMode: 'decimal',
    amountKeypadReplacePending: false,
    amountKeypadOriginalValue: ''
  };

const INPUT_LIMITS = {
  CARD_NAME: 30,
  PROJECT_NAME: 30,
  PRODUCT_NAME: 30,
  GROUP_NAME: 20,
  SPEC: 20,
  PERSON_NAME: 20,
  SCHEME_NAME: 20,
  STOCK_NAME: 30,
  BARCODE: 32,
  REMARK_LONG: 500,
  REMARK_SHORT: 200,
  PHONE: 11,
  SEARCH: 50,
  MONEY_MAX: 999999.99,
  MONEY_INT_DIGITS: 6,
  VALIDITY_DAY_MAX: 3650,
  VALIDITY_MONTH_MAX: 120,
  VALIDITY_YEAR_MAX: 10,
  QTY_MAX: 999,
  CART_QTY_MAX: 999,
  YEARS_EXP_MAX: 50,
  PCT_MAX: 100,
};

function formatMoneyLimitLabel() {
  return '999,999.99';
}

function isValidCnMobile(phone) {
  return /^1\d{10}$/.test(String(phone || '').trim());
}

function clampMoneyNumber(n) {
  if (!Number.isFinite(n) || n < 0) return 0;
  const capped = Math.min(INPUT_LIMITS.MONEY_MAX, n);
  return Math.round(capped * 100) / 100;
}

function moneyBufferExceedsLimit(buf, mode) {
  const s = String(buf || '').trim();
  if (!s || s === '.' || s === '0.') return false;
  if (mode === 'integer') {
    const n = parseInt(s, 10);
    return Number.isFinite(n) && n > INPUT_LIMITS.VALIDITY_DAY_MAX;
  }
  const intPart = (s.split('.')[0] || '').replace(/^0+(?=\d)/, '') || '0';
  if (intPart.length > INPUT_LIMITS.MONEY_INT_DIGITS) return true;
  const n = parseFloat(s);
  return Number.isFinite(n) && n > INPUT_LIMITS.MONEY_MAX;
}

  function closeDurPicker() {}
  function closeCatalogRowActions() {}
  function closeCatalogGroupRowMenu() {}
  function clampNonNegativeAmountInput(el) {
    if (!el) return;
    var v = String(el.value || '').replace(/[^\d.]/g, '');
    var n = parseFloat(v);
    if (!Number.isFinite(n) || n < 0) el.value = '';
    else el.value = String(clampMoneyNumber(n));
  }
  function clampIntegerAmountInput(el) {
    if (!el) return;
    var n = parseInt(String(el.value || '').replace(/\D/g, ''), 10);
    if (!Number.isFinite(n) || n < 0) el.value = '';
    else el.value = String(Math.min(INPUT_LIMITS.VALIDITY_DAY_MAX, n));
  }

function getAmountKeypadMode(el) {
  return el.classList.contains('issue-extend-custom-input') ? 'integer' : 'decimal';
}

function updateAmountKeypadDisplay() {
  const disp = document.getElementById('amountKeypadDisplay');
  if (!disp) return;
  const buf = state.amountKeypadBuffer || '';
  const ph = state.amountKeypadTarget?.placeholder || '请输入';
  if (!buf) {
    disp.textContent = ph;
    disp.classList.add('is-empty');
  } else {
    disp.textContent = buf;
    disp.classList.remove('is-empty');
  }
}

function renderAmountKeypadKeys() {
  const grid = document.getElementById('amountKeypadGrid');
  if (!grid) return;
  const isInt = state.amountKeypadMode === 'integer';
  const keys = isInt
    ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', null, '0', 'delete']
    : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'delete'];
  grid.innerHTML = keys.map(k => {
    if (k === null) return '<span class="amount-keypad-key is-spacer" aria-hidden="true"></span>';
    const label = k === 'delete' ? '⌫' : k;
    const cls = k === 'delete' ? 'amount-keypad-key amount-keypad-key--delete' : 'amount-keypad-key';
    return `<button type="button" class="${cls}" data-key="${k}">${label}</button>`;
  }).join('');
  grid.querySelectorAll('[data-key]').forEach(btn => {
    btn.onclick = () => appendAmountKeypadKey(btn.dataset.key);
  });
}

function appendAmountKeypadKey(key) {
  if (state.amountKeypadReplacePending) {
    state.amountKeypadReplacePending = false;
    if (key === 'delete') {
      state.amountKeypadBuffer = '';
      updateAmountKeypadDisplay();
      return;
    }
    if (key === '.') {
      if (state.amountKeypadMode === 'integer') return;
      state.amountKeypadBuffer = '0.';
      updateAmountKeypadDisplay();
      return;
    }
    state.amountKeypadBuffer = key;
    updateAmountKeypadDisplay();
    return;
  }
  let buf = state.amountKeypadBuffer || '';
  let next = buf;
  if (key === 'delete') {
    next = buf.slice(0, -1);
  } else if (key === '.') {
    if (state.amountKeypadMode === 'integer' || buf.includes('.')) return;
    next = buf ? `${buf}.` : '0.';
  } else {
    if (state.amountKeypadMode === 'decimal' && buf.includes('.')) {
      const frac = buf.split('.')[1] || '';
      if (frac.length >= 2) return;
    }
    if (buf === '0' && key !== '.') next = key;
    else next = buf + key;
  }
  if (key !== 'delete' && moneyBufferExceedsLimit(next, state.amountKeypadMode)) {
    if (state.amountKeypadMode === 'integer') {
      showToast(`不能超过 ${INPUT_LIMITS.VALIDITY_DAY_MAX}`, true);
    } else {
      showToast(`金额不能超过 ${formatMoneyLimitLabel()}`, true);
    }
    return;
  }
  state.amountKeypadBuffer = next;
  updateAmountKeypadDisplay();
}

function openAmountKeypad(el) {
  if (!el || el.disabled) return;
  closeDurPicker();
  state.amountKeypadTarget = el;
  state.amountKeypadMode = getAmountKeypadMode(el);
  const original = el.value != null ? String(el.value) : '';
  const normalized = el.id === 'fPrice' ? original.replace(/^¥/, '').trim() : original;
  state.amountKeypadOriginalValue = normalized;
  state.amountKeypadBuffer = normalized;
  state.amountKeypadReplacePending = !!normalized;
  const titleEl = document.getElementById('amountKeypadTitle');
  if (titleEl) {
    if (el.id === 'fPrice') titleEl.textContent = state.projFormKind === 'product' ? '产品价格' : '项目价格';
    else if (el.id === 'empFYears') titleEl.textContent = '输入从业年限';
    else if (el.id === 'empAchEditCostPct') titleEl.textContent = '成本比例';
    else if (el.id === 'empAchEditCostFixed') titleEl.textContent = '固定成本';
    else if (el.classList.contains('qty-input')) titleEl.textContent = '输入数量';
    else if (el.id === 'holdPriceKeypadProxy') titleEl.textContent = '挂单金额';
    else if (el.id === 'billDueKeypadProxy' || el.id === 'cardIssuePayKeypadProxy' || el.id === 'billRechargeDue' || el.id === 'billTimesDue' || el.id === 'billExtendDue' || (el.dataset && (el.dataset.billRechargeField === 'due' || el.dataset.billTimesDue != null || el.dataset.billExtendDue != null))) titleEl.textContent = '应付金额';
    else if (el.id === 'quickConsumeKeypadProxy' || el.id === 'billQuickAmt') titleEl.textContent = '直接收款金额';
    else if (el.dataset && (el.dataset.flowPerf === 'achievement' || el.dataset.flowEditPerf === 'achievement' || el.dataset.flowEditStaffPerf === 'achievement')) titleEl.textContent = '修改业绩';
    else if (el.dataset && (el.dataset.flowPerf === 'commission' || el.dataset.flowEditPerf === 'commission' || el.dataset.flowEditStaffPerf === 'commission')) titleEl.textContent = '修改提成';
    else if (el.dataset && el.dataset.flowEditItemPrice != null) titleEl.textContent = '修改单价';
    else if (el.getAttribute && el.getAttribute('aria-label')) titleEl.textContent = el.getAttribute('aria-label');
    else titleEl.textContent = state.amountKeypadMode === 'integer' ? '输入天数' : '输入金额';
  }
  updateAmountKeypadDisplay();
  renderAmountKeypadKeys();
  document.getElementById('amountKeypadMask')?.classList.add('open');
}
window.openAmountKeypad = openAmountKeypad;

function closeAmountKeypad() {
  document.getElementById('amountKeypadMask')?.classList.remove('open');
  state.amountKeypadTarget = null;
  state.amountKeypadBuffer = '';
  state.amountKeypadReplacePending = false;
  state.amountKeypadOriginalValue = '';
}

/* 所有 .picker-mask：点击遮罩灰区关闭（不含 .dialog-mask） */
window.__pickerMaskClosers = window.__pickerMaskClosers || Object.create(null);
window.dismissPickerMaskEl = function (mask) {
  if (!mask || !mask.classList || !mask.classList.contains('picker-mask')) return;
  var id = mask.id || '';
  var fn = window.__pickerMaskClosers[id];
  if (typeof fn === 'function') {
    fn();
    return;
  }
  mask.classList.remove('open');
};
if (!window.__pickerMaskBackdropInstalled) {
  window.__pickerMaskBackdropInstalled = true;
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.classList || !t.classList.contains('picker-mask')) return;
    if (!t.classList.contains('open')) return;
    window.dismissPickerMaskEl(t);
  });
}
window.__pickerMaskClosers.amountKeypadMask = closeAmountKeypad;
window.__pickerMaskClosers.durPickerMask = closeDurPicker;
window.__pickerMaskClosers.catalogRowActionMask = closeCatalogRowActions;
window.__pickerMaskClosers.catalogGroupMenuMask = closeCatalogGroupRowMenu;

function confirmAmountKeypad() {
  const el = state.amountKeypadTarget;
  if (!el) { closeAmountKeypad(); return; }
  let buf = (state.amountKeypadBuffer || '').trim();
  if (!buf) {
    closeAmountKeypad();
    return;
  }
  if (moneyBufferExceedsLimit(buf, state.amountKeypadMode)) {
    if (state.amountKeypadMode === 'integer') {
      buf = String(INPUT_LIMITS.VALIDITY_DAY_MAX);
      showToast(`不能超过 ${INPUT_LIMITS.VALIDITY_DAY_MAX}`, true);
    } else {
      buf = String(INPUT_LIMITS.MONEY_MAX);
      showToast(`金额不能超过 ${formatMoneyLimitLabel()}`, true);
    }
  }
  if (el.id === 'fPrice' && state.projFormState) {
    state.projFormState.price = String(buf).replace(/^¥/, '').trim();
    el.value = state.projFormState.price;
    if (state.amountKeypadMode === 'decimal') clampNonNegativeAmountInput(el);
    else clampIntegerAmountInput(el);
    state.projFormState.price = String(el.value || '').replace(/^¥/, '').trim();
    el.value = state.projFormState.price ? `¥${state.projFormState.price}` : '';
  } else {
    el.value = buf;
    if (state.amountKeypadMode === 'decimal') clampNonNegativeAmountInput(el);
    else clampIntegerAmountInput(el);
  }
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  closeAmountKeypad();
}

function wireAmountKeypadInputs(root) {
  (root || document).querySelectorAll('.input-amount, .mp-fixed-input, .issue-extend-custom-input').forEach(el => {
    if (el.dataset.noAmountKeypad != null) return;
    if (el.dataset.amountKeypadWired) return;
    el.dataset.amountKeypadWired = '1';
    el.setAttribute('readonly', 'readonly');
    el.addEventListener('click', e => {
      if (el.disabled) return;
      e.preventDefault();
      openAmountKeypad(el);
    });
    el.addEventListener('focus', e => {
      if (el.disabled) return;
      e.preventDefault();
      el.blur();
      openAmountKeypad(el);
    });
  });
}

function wireAmountKeypadControls() {
  document.getElementById('btnAmountKeypadCancel')?.addEventListener('click', closeAmountKeypad);
  document.getElementById('btnAmountKeypadOk')?.addEventListener('click', confirmAmountKeypad);
  document.getElementById('amountKeypadMask')?.addEventListener('click', e => {
    if (e.target.id === 'amountKeypadMask') closeAmountKeypad();
  });
}

  g.openAmountKeypad = openAmountKeypad;
  g.closeAmountKeypad = closeAmountKeypad;
  g.wireAmountKeypadInputs = wireAmountKeypadInputs;
  g.wireAmountKeypadControls = wireAmountKeypadControls;
  g.INPUT_LIMITS = INPUT_LIMITS;
  var _showToast = function (msg) {
    if (typeof g.showToast === 'function') g.showToast(msg);
  };
  // patch showToast refs inside confirmAmountKeypad via global
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      wireAmountKeypadControls();
      wireAmountKeypadInputs(document.getElementById('flowModuleRoot') || document);
    });
  } else {
    wireAmountKeypadControls();
    wireAmountKeypadInputs(document.getElementById('flowModuleRoot') || document);
  }
})(typeof window !== 'undefined' ? window : globalThis);
