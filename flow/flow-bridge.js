'use strict';
/* Inject flow fragment (if needed) + host nav bridge */
(function () {
  function ensureFragment(done) {
    var root = document.getElementById('flowModuleRoot');
    if (!root) return done && done();
    var slot = root.querySelector('.phone');
    if (!slot) return done && done();
    if (slot.dataset.flowInjected === '1' || slot.querySelector('#screen-flow-hub')) {
      slot.dataset.flowInjected = '1';
      return done && done();
    }
    fetch('flow/flow-fragment.html')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        slot.insertAdjacentHTML('beforeend', html);
        slot.dataset.flowInjected = '1';
        if (typeof window.wireAmountKeypadControls === 'function') window.wireAmountKeypadControls();
        if (typeof window.wireAmountKeypadInputs === 'function') window.wireAmountKeypadInputs(root);
        done && done();
      })
      .catch(function (e) {
        console.error('flow fragment load failed', e);
        done && done(e);
      });
  }
  function bindNav() {
    document.querySelectorAll('.site-nav [data-flow]').forEach(function (btn) {
      if (btn.dataset.flowBound) return;
      btn.dataset.flowBound = '1';
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-flow');
        if (id && typeof window.runFlowNav === 'function') window.runFlowNav(id);
        if (typeof window.closeSiteNav === 'function') window.closeSiteNav();
      });
    });
  }
  function applyDeepLink() {
    var q = new URLSearchParams(location.search);
    var flow = q.get('flow');
    if (flow && String(flow).indexOf('flow-') === 0 && typeof window.runFlowNav === 'function') {
      window.runFlowNav(flow);
    }
  }
  function boot() {
    ensureFragment(function () {
      bindNav();
      applyDeepLink();
      if (typeof window.wireAmountKeypadControls === 'function') window.wireAmountKeypadControls();
      if (typeof window.wireAmountKeypadInputs === 'function') {
        window.wireAmountKeypadInputs(document.getElementById('flowModuleRoot'));
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
