/* ============ MERAK — state layer ============ */
window.MRKStore = (function () {
  const KEY = "merak_store_v1";
  const DEFAULT_STATE = { cart: [], wish: [], viewed: [], coupon: null };

  let state = Object.assign({}, DEFAULT_STATE);
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) state = Object.assign({}, DEFAULT_STATE, saved);
  } catch (e) { /* storage unavailable */ }

  const subs = [];
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }
  function emit() {
    subs.forEach(function (f) { try { f(); } catch (e) { /* guard */ } });
  }
  function subscribe(f) { subs.push(f); }

  function defSize(id) { const p = MRK.bySlug(id); return p ? p.sizes[Math.min(2, p.sizes.length - 1)] : null; }
  function defColour(id) { const p = MRK.bySlug(id); return p ? p.colours[0] : null; }

  function cartCount() { return state.cart.reduce((s, l) => s + l.qty, 0); }
  function wishCount() { return state.wish.length; }

  function addToCart(id, size, colour, qty) {
    const p = MRK.bySlug(id);
    if (!p) return;
    size = size || defSize(id);
    colour = colour || defColour(id);
    qty = qty || 1;
    const key = id + "|" + size + "|" + colour;
    const ex = state.cart.find(l => l.key === key);
    if (ex) ex.qty += qty;
    else state.cart.push({ key: key, id: id, size: size, colour: colour, qty: qty });
    save(); emit();
  }

  function setQty(key, qty) {
    const l = state.cart.find(x => x.key === key);
    if (!l) return;
    l.qty = Math.max(1, qty);
    save(); emit();
  }

  function remove(key) {
    state.cart = state.cart.filter(l => l.key !== key);
    save(); emit();
  }

  function clearCart() {
    state.cart = [];
    state.coupon = null;
    save(); emit();
  }

  function toggleWish(id) {
    const i = state.wish.indexOf(id);
    if (i > -1) state.wish.splice(i, 1);
    else state.wish.push(id);
    save(); emit();
    return isWished(id);
  }

  function isWished(id) { return state.wish.indexOf(id) > -1; }

  function addViewed(id) {
    state.viewed = [id].concat(state.viewed.filter(x => x !== id)).slice(0, 8);
    save(); emit();
  }

  function setCoupon(code) {
    const c = MRK.COUPONS[code];
    if (!c) return { ok: false, msg: "That code doesn't exist" };
    const t = totals();
    if (t.sub < c.min) return { ok: false, msg: "This code needs a bag over " + MRK.inr(c.min) };
    state.coupon = code;
    save(); emit();
    return { ok: true, label: c.label };
  }

  function clearCoupon() { state.coupon = null; save(); emit(); }
  function getCoupon() { return state.coupon; }

  function totals() {
    const sub = state.cart.reduce((s, l) => s + MRK.bySlug(l.id).price * l.qty, 0);
    let disc = 0;
    let ship = sub >= MRK.FREE_AT ? 0 : MRK.SHIP_FEE;
    const c = MRK.COUPONS[state.coupon];
    if (c && sub >= c.min) {
      if (c.type === "pct") disc = Math.round(sub * c.v / 100);
      if (c.type === "ship") ship = 0;
    }
    return { sub: sub, disc: disc, ship: ship, grand: Math.max(0, sub - disc + ship), left: Math.max(0, MRK.FREE_AT - sub) };
  }

  return {
    subscribe: subscribe,
    cartCount: cartCount,
    wishCount: wishCount,
    getCart: function () { return state.cart; },
    getWish: function () { return state.wish; },
    getViewed: function () { return state.viewed; },
    addToCart: addToCart,
    setQty: setQty,
    remove: remove,
    clearCart: clearCart,
    toggleWish: toggleWish,
    isWished: isWished,
    addViewed: addViewed,
    setCoupon: setCoupon,
    clearCoupon: clearCoupon,
    getCoupon: getCoupon,
    totals: totals,
    defSize: defSize,
    defColour: defColour
  };
})();
