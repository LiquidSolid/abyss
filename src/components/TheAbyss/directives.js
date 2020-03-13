export const RenderStats = {
  bind(el, { value }) {
    if (value && value.dom) {
      el.appendChild(value.dom);
    }
  },
};

export const PointerLock = {
  bind(el, { value }) {
    if (value) {
      requestPointerLock(el);
    }
  },
  update(el, { value, oldValue }) {
    if (value !== oldValue) {
      value ? requestPointerLock(el) : exitPointerLock();
    }
  },
  unbind(el, { value }) {
    if (value) {
      exitPointerLock();
    }
  },
};

/** @param {HTMLElement} el */
function requestPointerLock(el) {
  el.requestPointerLock = (
    el.requestPointerLock
    || el.mozRequestPointerLock
    || el.webkitRequestPointerLock
  );
  el.requestPointerLock();
}

function exitPointerLock() {
  document.exitPointerLock = (
    document.exitPointerLock
    || document.mozExitPointerLock
    || document.webkitExitPointerLock
  );
  document.exitPointerLock();
}
