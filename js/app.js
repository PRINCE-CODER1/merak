/* ============ MERAK — app layer ============ */
(function () {
  "use strict";
  const $ = s => document.querySelector(s);
  const $$ = s => Array.prototype.slice.call(document.querySelectorAll(s));
  const B = MRK.BRAND;
  const PAGE = document.body.dataset.page;

  /* ---------------- toast ---------------- */
  function toast(msg) {
    const box = $("#toasts");
    if (!box) return;
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = "<i>✦</i>" + msg;
    box.appendChild(t);
    setTimeout(function () {
      t.style.transition = "opacity .3s";
      t.style.opacity = "0";
      setTimeout(function () { t.remove(); }, 320);
    }, 2400);
  }

  /* ---------------- overlays ---------------- */
  function openOverlay(sel) {
    closeAll();
    const el = $(sel);
    if (el) el.classList.add("on");
    const s = $("#scrim");
    if (s) s.classList.add("on");
    document.body.classList.add("locked");
  }
  function closeAll() {
    $$(".drawer, .modal").forEach(function (e) { e.classList.remove("on"); });
    const s = $("#scrim");
    if (s) s.classList.remove("on");
    const m = $("#mmenu");
    if (m) m.classList.remove("open");
    document.body.classList.remove("locked");
  }

  /* ---------------- badges ---------------- */
  function renderBadges() {
    const cc = $("#cartCnt"), wc = $("#wishCnt");
    if (cc) {
      const n = MRKStore.cartCount();
      cc.textContent = n;
      cc.classList.toggle("zero", n === 0);
    }
    if (wc) {
      const n = MRKStore.wishCount();
      wc.textContent = n;
      wc.classList.toggle("zero", n === 0);
    }
  }

  /* ---------------- shared bits ---------------- */
  function catName(s) { return MRK.catName(s); }

  function cardHTML(p) {
    const wished = MRKStore.isWished(p.slug);
    const badgeCls = p.badge === "New" ? "pop" : p.badge === "Bestseller" ? "lime" : "";
    return (
      '<article class="pcard" data-slug="' + p.slug + '">' +
        '<a class="pcard__art" href="product.html?p=' + p.slug + '" style="background:' + p.bg + '">' +
          MRK.art(p.type, p.c1, p.c2, p.bg) +
          (p.badge ? '<span class="pcard__badge ' + badgeCls + '">' + p.badge + "</span>" : "") +
          '<button class="pcard__wish' + (wished ? " on" : "") + '" data-wish="' + p.slug + '" aria-label="Save ' + p.name + '">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 20s-7-4.6-7-9.4A4 4 0 0 1 12 8a4 4 0 0 1 7 2.6C19 15.4 12 20 12 20z"/></svg>' +
          "</button>" +
          '<div class="pcard__quick"><button class="btn btn--sm btn--ink btn--full" data-add="' + p.slug + '">Quick add</button></div>' +
        "</a>" +
        '<div class="pcard__bd">' +
          '<a class="pcard__cat" href="shop.html?cat=' + p.cat + '">' + catName(p.cat) + "</a>" +
          '<a class="pcard__name" href="product.html?p=' + p.slug + '">' + p.name + "</a>" +
          '<div class="pcard__rate"><b>★ ' + p.rating + "</b> · " + p.reviews + " reviews</div>" +
          '<div class="pcard__price"><b>' + MRK.inr(p.price) + "</b>" +
            (p.mrp ? "<s>" + MRK.inr(p.mrp) + "</s>" : "") +
            "<em>−" + MRK.off(p) + "%</em></div>" +
        "</div>" +
      "</article>"
    );
  }

  function rail(p) {
    return (
      '<article class="pcard">' +
        '<a class="pcard__art" href="product.html?p=' + p.slug + '" style="background:' + p.bg + '">' +
          MRK.art(p.type, p.c1, p.c2, p.bg) +
          (p.badge ? '<span class="pcard__badge ' + (p.badge === "New" ? "pop" : "lime") + '">' + p.badge + "</span>" : "") +
          '<button class="pcard__wish" data-wish="' + p.slug + '" aria-label="Save ' + p.name + '">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 20s-7-4.6-7-9.4A4 4 0 0 1 12 8a4 4 0 0 1 7 2.6C19 15.4 12 20 12 20z"/></svg>' +
          "</button>" +
          '<div class="pcard__quick"><button class="btn btn--sm btn--ink btn--full" data-add="' + p.slug + '">Quick add</button></div>' +
        "</a>" +
        '<div class="pcard__bd">' +
          '<span class="pcard__cat">' + catName(p.cat) + "</span>" +
          '<a class="pcard__name" href="product.html?p=' + p.slug + '">' + p.name + "</a>" +
          '<div class="pcard__price"><b>' + MRK.inr(p.price) + "</b><s>" + MRK.inr(p.mrp) + "</s><em>−" + MRK.off(p) + "%</em></div>" +
        "</div>" +
      "</article>"
    );
  }

  function reveal() {
    const io = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); }
      });
    }, { threshold: 0.08 });
    $$(".rv").forEach(function (el) { if (!el.classList.contains("in")) io.observe(el); });
  }

  function photo(key) { return B.photos[key] || ""; }

  /* ---------------- header / footer ---------------- */
  function renderHeader() {
    const host = $("#siteHeader");
    if (!host) return;
    const catLinks = MRK.CATEGORIES.map(function (c) {
      const n = MRK.PRODUCTS.filter(p => p.cat === c.slug).length;
      return '<a href="shop.html?cat=' + c.slug + '"><span>' + c.name + "</span><i>" + n + "</i></a>";
    }).join("");
    host.innerHTML =
      '<div class="announce" aria-hidden="true"><div class="announce__track" id="announceTrack"></div></div>' +
      '<header class="hdr" id="hdr">' +
        '<div class="wrap hdr__in">' +
          '<a class="logo" href="index.html">' + B.logoMark + "<span>.</span><small>" + B.tagline.toUpperCase() + "</small></a>" +
          '<nav class="nav" id="nav">' +
            '<a href="shop.html?flag=new">New In</a>' +
            '<div class="nav__item">' +
              '<a class="nav__link" href="shop.html">Shop <svg width="10" height="7" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l5 5 5-5"/></svg></a>' +
              '<div class="mega" id="mega">' +
                '<div class="mega__grid">' +
                  '<div class="mega__cat"><h4>Shop by category</h4>' + catLinks + "</div>" +
                  '<div class="mega__spot">' +
                    '<div class="media"><img src="' + photo("mega") + '" alt="" loading="lazy" onerror="this.style.display=\'none\'"></div>' +
                    '<div class="meat"><b>Fresh drop every Friday</b><small>New styles land before the weekend</small><a class="btn btn--sm btn--ink" href="shop.html?flag=new">Shop new in</a></div>' +
                  "</div>" +
                "</div>" +
              "</div>" +
            "</div>" +

            '<a href="index.html#story">About</a>' +
            '<a href="index.html#faq">Help</a>' +
          "</nav>" +
          '<div class="tools">' +
            '<button class="iconbtn" id="searchBtn" aria-label="Search products">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
            "</button>" +
            '<button class="iconbtn" id="wishBtn" aria-label="Wishlist">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 20s-7-4.6-7-9.4A4 4 0 0 1 12 8a4 4 0 0 1 7 2.6C19 15.4 12 20 12 20z"/></svg>' +
              '<span class="cnt" id="wishCnt">0</span>' +
            "</button>" +
            '<a class="iconbtn" href="cart.html" aria-label="Shopping bag">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>' +
              '<span class="cnt" id="cartCnt">0</span>' +
            "</a>" +
            '<button class="iconbtn burger" id="burger" aria-label="Open menu">' +
              '<svg width="19" height="19" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
            "</button>" +
          "</div>" +
        "</div>" +
      "</header>" +
      '<nav class="mmenu" id="mmenu">' +
        '<button class="close" id="mclose" aria-label="Close menu">×</button>' +
        '<a href="shop.html">Shop</a>' +
        '<a href="shop.html?flag=new">New In</a>' +

        '<a href="index.html#story">About</a>' +
        '<a href="index.html#faq">Help</a>' +
        '<div class="mmenu__meta"><a href="cart.html">My bag</a><a href="#" data-wish-open>Wishlist</a></div>' +
      "</nav>";

    const track = $("#announceTrack");
    const msg = MRK.TICKER.map(function (t) { return "<i>✦</i>" + t; }).join("");
    track.innerHTML = msg + msg;

    $("#burger").onclick = function () {
      const m = $("#mmenu");
      m.classList.add("open");
      document.body.classList.add("locked");
    };
    $("#mclose").onclick = closeAll;
    $$("#mmenu a").forEach(function (a) { a.onclick = closeAll; });
    $("#searchBtn").onclick = function () {
      openOverlay("#searchModal");
      setTimeout(function () { const q = $("#qBig"); if (q) q.focus(); }, 120);
    };
    $("#wishBtn").onclick = function () { openWish(); };
    $$("#mmenu [data-wish-open]").forEach(function (a) { a.onclick = function (e) { e.preventDefault(); closeAll(); openWish(); }; });
  }

  function renderFooter() {
    const host = $("#siteFooter");
    if (!host) return;
    const catLinks = MRK.CATEGORIES.map(function (c) {
      return '<li><a href="shop.html?cat=' + c.slug + '">' + c.name + "</a></li>";
    }).join("");
    host.innerHTML =
      '<footer class="ftr">' +
        '<div class="wrap">' +
          '<div class="ftr__grid">' +
            '<div>' +
              '<a class="logo" href="index.html">' + B.logoMark + "<span>.</span></a>" +
              "<p>" + B.blurb + "</p>" +
              '<div class="ftr__socials">' +
                '<a href="' + B.social.instagram + '" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg></a>' +
                '<a href="' + B.social.facebook + '" aria-label="Facebook"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14.5 8z"/></svg></a>' +
                '<a href="' + B.social.x + '" aria-label="X"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1H22l-6.8 7.8L23 23h-6.3l-4.9-6.4L6.2 23H3l7.3-8.3L1 1h6.4l4.4 5.9L18.9 1zm-1.1 19.8h1.7L6.7 3H4.9L17.8 20.8z"/></svg></a>' +
              "</div>" +
              '<div class="ftr__pay"><span>UPI</span><span>GPay</span><span>PhonePe</span><span>VISA</span><span>COD</span></div>' +
            "</div>" +
            "<div><h4>Shop</h4><ul>" + catLinks + "</ul></div>" +
            "<div><h4>Help</h4><ul>" +
              '<li><a href="#" data-size-open>Size guide</a></li>' +
              '<li><a href="index.html#faq">Shipping &amp; returns</a></li>' +
              '<li><a href="index.html#faq">Track an order</a></li>' +
              '<li><a href="index.html#faq">FAQs</a></li>' +
            "</ul></div>" +
            "<div><h4>Company</h4><ul>" +
              '<li><a href="index.html#story">Our story</a></li>' +

              '<li><a href="shop.html?flag=new">New arrivals</a></li>' +
              '<li><a href="cart.html">My bag</a></li>' +
            "</ul></div>" +
            "<div><h4>Contact</h4><ul>" +
              "<li>" + B.address + "</li>" +
              '<li><a href="tel:' + B.phone.replace(/\s/g, "") + '">' + B.phone + "</a></li>" +
              '<li><a href="mailto:' + B.email + '">' + B.email + "</a></li>" +
            "</ul></div>" +
          "</div>" +
          '<div class="ftr__bot"><span>© ' + new Date().getFullYear() + " " + B.logoMark + ' Clothing · GSTIN 29ABCDE1234F1Z5</span><span>Made with care in India</span></div>' +
        "</div>" +
      "</footer>";
  }

  /* ---------------- overlays markup ---------------- */
  function injectShell() {
    const d = document.createElement("div");
    d.id = "shell";
    d.innerHTML =
      '<div class="scrim" id="scrim"></div>' +
      '<aside class="drawer" id="wishDrawer" aria-label="Wishlist">' +
        '<div class="drawer__hd"><h3>Saved for later</h3><button class="iconbtn" data-close aria-label="Close wishlist" style="width:36px;height:36px">✕</button></div>' +
        '<div class="drawer__bd" id="wishLines"></div>' +
      "</aside>" +
      '<div class="modal" id="qvModal" role="dialog" aria-label="Quick view">' +
        '<div class="modal__box" style="width:min(860px,100%)"><div id="qvBody"></div></div>' +
      "</div>" +
      '<div class="modal" id="sizeModal" role="dialog" aria-label="Size guide">' +
        '<div class="modal__box"><div id="sizeBody"></div></div>' +
      "</div>" +
      '<div class="modal" id="searchModal" role="dialog" aria-label="Search">' +
        '<div class="modal__box">' +
          '<label class="search" style="box-shadow:none">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
            '<input id="qBig" type="search" placeholder="Search tees, hoodies, denim…" aria-label="Search">' +
          "</label>" +
          '<div class="search-results" id="qResults"></div>' +
        "</div>" +
      "</div>" +
      '<div class="toasts" id="toasts"></div>' +
      '<div class="sab" id="sab"></div>' +
      '<button class="totop" id="totop" aria-label="Back to top"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>';
    document.body.appendChild(d);

    $("#scrim").onclick = closeAll;
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeAll();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll();
    });
    $("#totop").onclick = function () { window.scrollTo({ top: 0, behavior: "smooth" }); };
    window.addEventListener("scroll", function () {
      const t = $("#totop");
      if (t) t.classList.toggle("show", window.scrollY > 700);
    }, { passive: true });

    $("#sizeBody").innerHTML = sizeGuideHTML();

    $("#qBig").addEventListener("input", function () {
      const v = this.value.toLowerCase();
      const hits = v ? MRK.PRODUCTS.filter(function (p) {
        return (p.name + " " + MRK.catName(p.cat) + " " + p.fabric + " " + p.desc).toLowerCase().indexOf(v) > -1;
      }).slice(0, 6) : [];
      $("#qResults").innerHTML = v
        ? (hits.length
            ? hits.map(function (p) {
                return '<button class="sr-line" data-goto="product.html?p=' + p.slug + '">' +
                  '<span class="th">' + MRK.art(p.type, p.c1, p.c2, p.bg) + "</span>" +
                  "<span><h4>" + p.name + "</h4><small>" + MRK.catName(p.cat) + "</small></span>" +
                  '<span class="pr">' + MRK.inr(p.price) + "</span></button>";
              }).join("")
            : '<p class="mono" style="font-size:12px;opacity:.6;padding:16px 4px">No match for "' + this.value + '". Try "tee", "hoodie" or "denim".</p>')
        : "";
    });
  }

  function sizeGuideHTML() {
    return (
      '<h2 class="display" style="font-size:30px;text-transform:uppercase">Size guide</h2>' +
      '<p style="font-size:14px;color:var(--ink-2);margin:10px 0 18px">Measure a garment that already fits you and match it below. All values in inches. Between sizes? Go one up — our fits run relaxed.</p>' +
      '<table class="tbl"><thead><tr><th>Size</th><th>Chest</th><th>Waist</th><th>Length</th></tr></thead><tbody>' +
      '<tr><td>S</td><td>37</td><td>30</td><td>26</td></tr>' +
      '<tr><td>M</td><td>40</td><td>33</td><td>27</td></tr>' +
      '<tr><td>L</td><td>43</td><td>36</td><td>28</td></tr>' +
      '<tr><td>XL</td><td>46</td><td>39</td><td>29</td></tr>' +
      "</tbody></table>" +
      '<button class="btn btn--ink btn--full" data-close style="margin-top:20px">Got it</button>'
    );
  }

  /* ---------------- wishlist drawer ---------------- */
  function openWish() {
    const w = MRKStore.getWish();
    $("#wishLines").innerHTML = w.length
      ? w.map(function (id) {
          const p = MRK.bySlug(id);
          return '<div class="cline">' +
            '<div class="cline__art" style="background:' + p.bg + '">' + MRK.art(p.type, p.c1, p.c2, p.bg) + "</div>" +
            '<div class="cline__in"><h4>' + p.name + "</h4><a href='shop.html?cat=" + p.cat + "'>" + MRK.catName(p.cat) + "</a>" +
            '<div class="cline__tools"><button class="btn btn--sm btn--ink" data-add="' + p.slug + '">Add to bag</button>' +
            '<button class="linkbtn" data-unwish="' + p.slug + '">Remove</button></div></div>' +
            '<div class="cline__rt"><b>' + MRK.inr(p.price) + "</b></div>" +
          "</div>";
        }).join("")
      : '<div class="empty"><h3>Nothing saved</h3><p>Tap the heart on any piece to park it here for later.</p><a class="btn btn--sm btn--ink" style="margin-top:14px" href="shop.html" data-close>Start shopping</a></div>';
    openOverlay("#wishDrawer");
  }

  /* ---------------- quick view ---------------- */
  let qv = { slug: null, colour: null, size: null, qty: 1 };
  function openQV(slug) {
    const p = MRK.bySlug(slug);
    if (!p) return;
    qv = { slug: slug, colour: p.colours[0], size: p.sizes[Math.min(2, p.sizes.length - 1)], qty: 1 };
    paintQV();
    openOverlay("#qvModal");
  }
  function paintQV() {
    const p = MRK.bySlug(qv.slug);
    const wished = MRKStore.isWished(p.slug);
    $("#qvBody").innerHTML =
      '<div class="pwrap" style="gap:26px;padding:0">' +
        '<div class="gallery__main" style="border:none;border-radius:var(--r)">' +
          MRK.art(p.type, qv.colour, p.c2, p.bg) +
          (p.badge ? '<span class="pcard__badge ' + (p.badge === "New" ? "pop" : "lime") + '">' + p.badge + "</span>" : "") +
        "</div>" +
        '<div class="pinfo" style="padding:8px 4px 0 0">' +
          '<span class="pcard__cat">' + MRK.catName(p.cat) + "</span>" +
          '<h1 style="font-size:30px">' + p.name + "</h1>" +
          '<div class="prate"><b>★ ' + p.rating + "</b><span>" + p.reviews + " reviews</span></div>" +
          '<div class="pprice" style="margin:14px 0"><b>' + MRK.inr(p.price) + "</b><s>" + MRK.inr(p.mrp) + "</s><em>−" + MRK.off(p) + "%</em></div>" +
          '<p class="pdesc">' + p.desc + "</p>" +
          '<div class="plabel">Colour <span class="mono" style="text-transform:none;letter-spacing:0;opacity:.6">' + qv.colour + "</span></div>" +
          '<div class="dots">' + p.colours.map(function (c) {
            return '<button class="dot' + (c === qv.colour ? " on" : "") + '" data-qc="' + c + '" style="background:' + c + '" aria-label="Colour ' + c + '"></button>';
          }).join("") + "</div>" +
          '<div class="plabel">Size <button data-size-open>Size guide</button></div>' +
          '<div class="chips">' + p.sizes.map(function (s) {
            return '<button class="chip' + (s === qv.size ? " on" : "") + '" data-qs="' + s + '">' + s + "</button>";
          }).join("") + "</div>" +
          '<div class="qtyrow">' +
            '<div class="qty"><button data-qq-dec>−</button><span>' + qv.qty + "</span><button data-qq-inc>+</button></div>" +
            '<div class="pacts">' +
              '<button class="btn btn--accent" id="qvAdd">Add · ' + MRK.inr(p.price * qv.qty) + "</button>" +
              '<button class="iconbtn" id="qvWish" aria-label="Save">' +
                '<svg width="17" height="17" viewBox="0 0 24 24" fill="' + (wished ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 20s-7-4.6-7-9.4A4 4 0 0 1 12 8a4 4 0 0 1 7 2.6C19 15.4 12 20 12 20z"/></svg>' +
              "</button>" +
            "</div>" +
          "</div>" +
          '<button class="btn btn--line btn--full" style="margin-top:10px" data-goto="product.html?p=' + p.slug + '">View full details</button>' +
        "</div>" +
      "</div>";

    $$("#qvBody [data-qc]").forEach(function (b) {
      b.onclick = function () { qv.colour = b.dataset.qc; paintQV(); };
    });
    $$("#qvBody [data-qs]").forEach(function (b) {
      b.onclick = function () { qv.size = b.dataset.qs; paintQV(); };
    });
    $("#qvBody [data-qq-inc]").onclick = function () { qv.qty++; paintQV(); };
    $("#qvBody [data-qq-dec]").onclick = function () { qv.qty = Math.max(1, qv.qty - 1); paintQV(); };
    $("#qvAdd").onclick = function () {
      MRKStore.addToCart(qv.slug, qv.size, qv.colour, qv.qty);
      closeAll();
      toast(p.name + " added to bag");
    };
    $("#qvWish").onclick = function () {
      const on = MRKStore.toggleWish(qv.slug);
      paintQV();
      toast(on ? "Saved to wishlist" : "Removed from wishlist");
    };
  }

  /* ---------------- global click delegation ---------------- */
  document.addEventListener("click", function (e) {
    const add = e.target.closest("[data-add]");
    if (add) {
      e.preventDefault();
      const p = MRK.bySlug(add.dataset.add);
      MRKStore.addToCart(add.dataset.add);
      toast((p ? p.name : "Item") + " added to bag");
      return;
    }
    const wish = e.target.closest("[data-wish]");
    if (wish) {
      e.preventDefault();
      const on = MRKStore.toggleWish(wish.dataset.wish);
      wish.classList.toggle("on", on);
      toast(on ? "Saved to wishlist" : "Removed from wishlist");
      return;
    }
    const unwish = e.target.closest("[data-unwish]");
    if (unwish) {
      e.preventDefault();
      MRKStore.toggleWish(unwish.dataset.unwish);
      closeAll();
      openWish();
      return;
    }
    const qvBtn = e.target.closest("[data-qv]");
    if (qvBtn) {
      e.preventDefault();
      openQV(qvBtn.dataset.qv);
      return;
    }
    const goto = e.target.closest("[data-goto]");
    if (goto) {
      e.preventDefault();
      window.location.href = goto.dataset.goto;
      return;
    }
    const sizeOpen = e.target.closest("[data-size-open]");
    if (sizeOpen) {
      e.preventDefault();
      openOverlay("#sizeModal");
      return;
    }
    const lookAdd = e.target.closest("[data-look-add]");
    if (lookAdd) {
      e.preventDefault();
      const l = MRK.LOOKS[+lookAdd.dataset.lookAdd];
      l.ids.forEach(function (id) { MRKStore.addToCart(id); });
      const res = MRKStore.setCoupon("URBAN10");
      toast("Whole look added · " + (res.ok ? "10% applied" : "10% discount"));
      setTimeout(function () { window.location.href = "cart.html"; }, 700);
      return;
    }
  });

  /* ---------------- HOME ---------------- */
  function pageHome() {
    const c = $("#homeCats");
    if (c) {
      c.innerHTML = MRK.CATEGORIES.map(function (cat) {
        const n = MRK.PRODUCTS.filter(p => p.cat === cat.slug).length;
        return '<a class="cat rv" href="shop.html?cat=' + cat.slug + '">' +
          '<div class="media">' + MRK.art(cat.art, cat.slug === "accessories" ? "#141210" : "#1D3BF0", "#D9F24B", "#fff") + "</div>" +
          "<h3>" + cat.name + "</h3><p>" + n + " styles · " + cat.blurb + "</p></a>";
      }).join("");
    }
    const t = $("#homeTrend");
    if (t) t.innerHTML = MRK.trending(8).map(cardHTML).join("");
    const l = $("#homeLooks");
    if (l) {
      l.innerHTML = MRK.LOOKS.map(function (look, i) {
        return lookHTML(look, i);
      }).join("");
    }
    const r = $("#homeRevs");
    if (r) {
      r.innerHTML = MRK.REVIEWS.map(function (rev) {
        return '<div class="rev rv">' +
          '<div class="rev__stars">' + MRK.stars(rev.r) + "</div>" +
          "<p>" + rev.t + "</p>" +
          '<div class="rev__who">' +
            '<div class="rev__av" style="background:' + rev.col + '">' + rev.n[0] + "</div>" +
            "<div><b>" + rev.n + "</b><span>" + rev.c + "</span></div>" +
          "</div></div>";
      }).join("");
    }
    const f = $("#homeFaq");
    if (f) {
      f.innerHTML = MRK.FAQS.map(function (qa) {
        return '<div class="acc"><button>' + qa[0] + "<i>+</i></button><div class='acc__a'><p>" + qa[1] + "</p></div></div>";
      }).join("");
      $$("#homeFaq .acc button").forEach(function (b) { b.onclick = function () { b.parentElement.classList.toggle("open"); }; });
    }
    const strip = $("#stripTrack");
    if (strip) {
      const words = ["FREE SHIPPING OVER " + MRK.inr(MRK.FREE_AT), "15-DAY RETURNS", "COD ACROSS INDIA", "CUT IN INDIA", "NEW DROP EVERY FRIDAY", "FIT GUARANTEED"];
      strip.innerHTML = words.map(function (w) { return "<span>" + w + "<i>✦</i></span>"; }).join("") +
        words.map(function (w) { return "<span>" + w + "<i>✦</i></span>"; }).join("");
    }
    const stats = $$("[data-stat]");
    stats.forEach(function (el) {
      const key = el.dataset.stat;
      if (key === "products") el.textContent = MRK.PRODUCTS.length;
      if (key === "cats") el.textContent = MRK.CATEGORIES.length;
      if (key === "rating") el.textContent = "4.7";
      if (key === "orders") el.textContent = "18k";
    });
    bindNewsletter();
    reveal();
  }

  function lookHTML(look, i) {
    const imagesHTML = look.ids.map(function(id) {
      const p = MRK.bySlug(id);
      return '<div style="flex:1; height:100%;">' + MRK.art(p.type, p.c1, p.c2, p.bg) + '</div>';
    }).join("");

    return '<article class="look rv">' +
      '<div class="look__top">' +
        '<div class="media" style="display:flex; gap:2px; background:#fff;">' + imagesHTML + '</div>' +
        '<span class="look__no">LOOK 0' + (i + 1) + "</span>" +
      "</div>" +
      '<div class="look__bd">' +
        "<h3>" + look.title + "</h3>" +
        "<p>" + look.blurb + "</p>" +
        '<div class="look__items">' + look.ids.map(function (id) {
          const p = MRK.bySlug(id);
          return "<span>" + p.name.replace("Merak ", "") + "</span>";
        }).join("") + "</div>" +
        '<div class="look__row">' +
          '<div class="look__price"><s>' + MRK.inr(bundleMrp(look)) + "</s> " + MRK.inr(bundlePrice(look)) +
            "<small>10% bundle price applied</small></div>" +
          '<button class="btn btn--sm btn--accent" data-look-add="' + i + '">Add the set</button>' +
        "</div>" +
      "</div>" +
    "</article>";
  }
  function bundlePrice(look) { return Math.round(look.ids.reduce(function (s, id) { return s + MRK.bySlug(id).price; }, 0) * 0.9); }
  function bundleMrp(look) { return look.ids.reduce(function (s, id) { return s + MRK.bySlug(id).mrp; }, 0); }

  function bindNewsletter() {
    const form = $("#newsForm");
    if (form) {
      form.onsubmit = function (e) {
        e.preventDefault();
        toast("You're on the drop list");
        form.reset();
      };
    }
  }

  /* ---------------- SHOP ---------------- */
  function pageShop() {
    const MAX = 6000;
    const S = { cats: [], sizes: [], colours: [], flags: [], max: MAX, q: "", sort: "featured" };
    const params = new URLSearchParams(window.location.search);
    if (params.get("cat")) S.cats = [params.get("cat")];
    if (params.get("q")) { S.q = params.get("q").toLowerCase(); }
    if (params.get("flag") === "new") S.flags.push("New in");
    if (params.get("flag") === "sale") S.flags.push("On sale");
    if (params.get("sort")) S.sort = params.get("sort");

    $("#fCat").innerHTML = MRK.CATEGORIES.map(function (c) {
      const n = MRK.PRODUCTS.filter(p => p.cat === c.slug).length;
      return '<label class="check"><input type="checkbox" value="' + c.slug + '" data-fcat>' + c.name + '<span class="n">' + n + "</span></label>";
    }).join("");
    const allSizes = Array.from(new Set(MRK.PRODUCTS.flatMap(function (p) { return p.sizes; })));
    $("#fSize").innerHTML = allSizes.map(function (s) { return '<button class="chip" data-fsize="' + s + '">' + s + "</button>"; }).join("");
    const allCols = Array.from(new Set(MRK.PRODUCTS.flatMap(function (p) { return p.colours; })));
    $("#fCol").innerHTML = allCols.map(function (c) { return '<button class="dot" data-fcol="' + c + '" style="background:' + c + '" aria-label="Colour ' + c + '"></button>'; }).join("");
    $("#fFlag").innerHTML = ["New in", "On sale", "Rated 4.5+"].map(function (f) {
      return '<label class="check"><input type="checkbox" value="' + f + '" data-fflag>' + f + "</label>";
    }).join("");
    $("#fPrice").max = MAX;
    $("#fPrice").value = S.max;
    $("#priceOut").textContent = MRK.inr(S.max);

    function visible() {
      let out = MRK.PRODUCTS.filter(function (p) {
        const f = S;
        if (f.cats.length && f.cats.indexOf(p.cat) === -1) return false;
        if (f.sizes.length && !p.sizes.some(s => f.sizes.indexOf(s) > -1)) return false;
        if (f.colours.length && !p.colours.some(c => f.colours.indexOf(c) > -1)) return false;
        if (p.price > f.max) return false;
        if (f.flags.indexOf("New in") > -1 && !p.newIn) return false;
        if (f.flags.indexOf("On sale") > -1 && MRK.off(p) < 30) return false;
        if (f.flags.indexOf("Rated 4.5+") > -1 && p.rating < 4.5) return false;
        if (f.q && (p.name + " " + MRK.catName(p.cat) + " " + p.fabric + " " + p.desc).toLowerCase().indexOf(f.q) === -1) return false;
        return true;
      });
      if (S.sort === "lo") out.sort((a, b) => a.price - b.price);
      if (S.sort === "hi") out.sort((a, b) => b.price - a.price);
      if (S.sort === "rate") out.sort((a, b) => b.rating - a.rating);
      if (S.sort === "disc") out.sort((a, b) => MRK.off(b) - MRK.off(a));
      if (S.sort === "new") out.sort((a, b) => (b.newIn ? 1 : 0) - (a.newIn ? 1 : 0));
      return out;
    }

    function renderActiveFilters() {
      let chips = "";
      S.cats.forEach(function (c) { chips += '<span class="af-chip">' + MRK.catName(c) + '<button data-xcat="' + c + '">×</button></span>'; });
      S.sizes.forEach(function (s) { chips += '<span class="af-chip">Size ' + s + '<button data-xsize="' + s + '">×</button></span>'; });
      S.colours.forEach(function (c) { chips += '<span class="af-chip">' + c + '<button data-xcol="' + c + '">×</button></span>'; });
      S.flags.forEach(function (f) { chips += '<span class="af-chip">' + f + '<button data-xflag="' + f + '">×</button></span>'; });
      $("#activeFilters").innerHTML = chips;
      if (chips) $("#activeFilters").classList.add("rv", "in");
    }

    function render() {
      const list = visible();
      $("#grid").innerHTML = list.length
        ? list.map(cardHTML).join("")
        : '<div class="empty"><h3>Nothing on this rack</h3><p>Loosen a filter or clear them all — there are ' + MRK.PRODUCTS.length + " styles waiting.</p>" +
          '<button class="btn btn--sm btn--accent" style="margin-top:16px" id="clearAll">Clear filters</button></div>';
      $("#count").textContent = list.length + " of " + MRK.PRODUCTS.length + " styles";
      renderActiveFilters();
      syncUI();
      const ca = $("#clearAll");
      if (ca) ca.onclick = clearAll;
      reveal();
    }

    function syncUI() {
      $$("[data-fcat]").forEach(function (el) { el.checked = S.cats.indexOf(el.value) > -1; });
      $$("[data-fsize]").forEach(function (el) { el.classList.toggle("on", S.sizes.indexOf(el.dataset.fsize) > -1); });
      $$("[data-fcol]").forEach(function (el) { el.classList.toggle("on", S.colours.indexOf(el.dataset.fcol) > -1); });
      $$("[data-fflag]").forEach(function (el) { el.checked = S.flags.indexOf(el.value) > -1; });
    }

    function clearAll() {
      S.cats = []; S.sizes = []; S.colours = []; S.flags = []; S.max = MAX; S.q = "";
      $("#q").value = ""; $("#fPrice").value = MAX; $("#priceOut").textContent = MRK.inr(MAX);
      render(); updateURL(); toast("Filters cleared");
    }

    function updateURL() {
      const p = new URLSearchParams();
      if (S.cats.length) p.set("cat", S.cats[0]);
      if (S.q) p.set("q", S.q);
      if (S.flags.indexOf("New in") > -1) p.set("flag", "new");
      else if (S.flags.indexOf("On sale") > -1) p.set("flag", "sale");
      if (S.sort !== "featured") p.set("sort", S.sort);
      const qs = p.toString();
      try { history.replaceState(null, "", qs ? "shop.html?" + qs : "shop.html"); } catch (e) { /* file protocol */ }
    }

    document.addEventListener("change", function (e) {
      const cat = e.target.closest("[data-fcat]");
      const flag = e.target.closest("[data-fflag]");
      if (cat) {
        const v = cat.value;
        S.cats = cat.checked ? Array.from(new Set(S.cats.concat([v]))) : S.cats.filter(x => x !== v);
        render(); updateURL(); return;
      }
      if (flag) {
        const v = flag.value;
        S.flags = flag.checked ? Array.from(new Set(S.flags.concat([v]))) : S.flags.filter(x => x !== v);
        render(); updateURL(); return;
      }
    });
    document.addEventListener("click", function (e) {
      const fs = e.target.closest("[data-fsize]");
      const fc = e.target.closest("[data-fcol]");
      const x = e.target.closest("[data-xcat], [data-xsize], [data-xcol], [data-xflag]");
      if (fs) {
        const v = fs.dataset.fsize;
        S.sizes = S.sizes.indexOf(v) > -1 ? S.sizes.filter(x => x !== v) : S.sizes.concat([v]);
        render(); updateURL(); return;
      }
      if (fc) {
        const v = fc.dataset.fcol;
        S.colours = S.colours.indexOf(v) > -1 ? S.colours.filter(x => x !== v) : S.colours.concat([v]);
        render(); updateURL(); return;
      }
      if (x) {
        const kind = x.dataset.xcat ? "cats" : x.dataset.xsize ? "sizes" : x.dataset.xcol ? "colours" : "flags";
        const val = x.dataset.xcat || x.dataset.xsize || x.dataset.xcol || x.dataset.xflag;
        S[kind] = S[kind].filter(v => v !== val);
        render(); updateURL(); return;
      }
    });
    $("#fPrice").addEventListener("input", function () {
      S.max = +this.value;
      $("#priceOut").textContent = MRK.inr(S.max);
      render();
    });
    $("#q").addEventListener("input", function () {
      S.q = this.value.toLowerCase();
      render(); updateURL();
    });
    $("#sort").addEventListener("change", function () {
      S.sort = this.value;
      render(); updateURL();
    });
    $("#fbtn").addEventListener("click", function () {
      $("#filters").classList.toggle("open");
    });
    $("#clearF").addEventListener("click", clearAll);

    $("#q").value = S.q;
    $("#sort").value = S.sort;
    const t = $("#shopTitle");
    if (t) {
      if (S.cats.length) { const c = MRK.catBySlug(S.cats[0]); if (c) t.innerHTML = c.name; }
      else if (S.flags.indexOf("New in") > -1) t.innerHTML = "New in";
      else if (S.flags.indexOf("On sale") > -1) t.innerHTML = "On sale";
    }
    render();
  }

  /* ---------------- PRODUCT ---------------- */
  function pageProduct() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("p");
    const p = MRK.bySlug(slug);
    if (!p) { window.location.href = "shop.html"; return; }

    MRKStore.addViewed(slug);
    document.title = p.name + " · " + B.logoMark;
    $("#pCat").textContent = MRK.catName(p.cat);
    $("#pCat").href = "shop.html?cat=" + p.cat;
    $("#pCrumbCat").textContent = MRK.catName(p.cat);
    $("#pCrumbCat").href = "shop.html?cat=" + p.cat;
    $("#pCrumbName").textContent = p.name;

    const st = { colour: p.colours[0], size: p.sizes[Math.min(2, p.sizes.length - 1)], qty: 1 };

    function paintThumbs() {
      $("#gThumbs").innerHTML = p.colours.map(function (c) {
        return '<button class="gthumb' + (c === st.colour ? " on" : "") + '" data-pcol="' + c + '" aria-label="Colour ' + c + '">' +
          '<span class="dot2" style="background:' + c + '"></span></button>';
      }).join("");
      $$("#gThumbs [data-pcol]").forEach(function (b) {
        b.onclick = function () { st.colour = b.dataset.pcol; paint(); };
      });
    }

    function paintMain() {
      $("#gMain").innerHTML =
        MRK.art(p.type, st.colour, p.c2, p.bg) +
        (p.badge ? '<span class="pcard__badge ' + (p.badge === "New" ? "pop" : "lime") + '">' + p.badge + "</span>" : "") +
        '<button class="zoom" data-qv="' + p.slug + '" aria-label="Quick view"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></button>';
      $("#pColLabel").textContent = st.colour;
    }

    function paintInfo() {
      const wished = MRKStore.isWished(p.slug);
      $("#pName").textContent = p.name;
      $("#pRate").innerHTML = '<b>★ ' + p.rating + "</b><span>" + p.reviews + " reviews</span>";
      $("#pPrice").innerHTML = "<b>" + MRK.inr(p.price) + "</b><s>" + MRK.inr(p.mrp) + "</s><em>−" + MRK.off(p) + "%</em>";
      $("#pDesc").textContent = p.desc;
      const d2 = $("#pDesc2");
      if (d2) d2.textContent = p.desc;
      $("#pFab").textContent = p.fabric;
      $("#pFit").textContent = p.fit;
      $("#pColours").innerHTML = p.colours.map(function (c) {
        return '<button class="dot' + (c === st.colour ? " on" : "") + '" data-pcol="' + c + '" style="background:' + c + '" aria-label="Colour ' + c + '"></button>';
      }).join("");
      $("#pSizes").innerHTML = p.sizes.map(function (s) {
        return '<button class="chip' + (s === st.size ? " on" : "") + '" data-psize="' + s + '">' + s + "</button>";
      }).join("");
      $("#pQty").innerHTML = "<span>" + st.qty + "</span>";
      $("#pAdd").innerHTML = "Add to bag · " + MRK.inr(p.price * st.qty);
      $("#pWishBtn").classList.toggle("on", wished);

      $$("#pColours [data-pcol]").forEach(function (b) {
        b.onclick = function () { st.colour = b.dataset.pcol; paint(); };
      });
      $$("#pSizes [data-psize]").forEach(function (b) {
        b.onclick = function () { st.size = b.dataset.psize; paint(); };
      });
      $("#pQtyDec").onclick = function () { st.qty = Math.max(1, st.qty - 1); paintInfo(); };
      $("#pQtyInc").onclick = function () { st.qty++; paintInfo(); };
      $("#pAdd").onclick = function () {
        MRKStore.addToCart(p.slug, st.size, st.colour, st.qty);
        toast(p.name + " added to bag");
        const btn = $("#pAdd");
        btn.innerHTML = "✓ Added to bag";
        btn.classList.add("btn--lime");
        btn.classList.remove("btn--accent");
        setTimeout(function () { btn.innerHTML = "Add to bag · " + MRK.inr(p.price * st.qty); btn.classList.add("btn--accent"); btn.classList.remove("btn--lime"); }, 1800);
      };
      $("#pBuy").onclick = function () {
        MRKStore.addToCart(p.slug, st.size, st.colour, st.qty);
        window.location.href = "checkout.html";
      };
      $("#pWishBtn").onclick = function () {
        const on = MRKStore.toggleWish(p.slug);
        $("#pWishBtn").classList.toggle("on", on);
        toast(on ? "Saved to wishlist" : "Removed from wishlist");
      };
    }

    function paint() { paintMain(); paintInfo(); paintThumbs(); }

    $("#related").innerHTML = MRK.related(p).map(rail).join("");
    const viewed = MRKStore.getViewed().filter(function (v) { return v !== slug; });
    $("#viewedWrap").style.display = viewed.length ? "" : "none";
    $("#viewed").innerHTML = viewed.map(function (v) { const x = MRK.bySlug(v); return x ? rail(x) : ""; }).join("");

    paint();

    $$(".acc").forEach(function (a) {
      a.querySelector("button").onclick = function () { a.classList.toggle("open"); };
    });

    const sab = $("#sab");
    if (sab) {
      sab.innerHTML =
        '<div class="sab__in">' +
          '<div><div class="sab__name">' + p.name + '</div><div class="sab__price">' + MRK.inr(p.price) + "</div></div>" +
          '<button class="btn btn--accent btn--sm" id="sabAdd">Add to bag · ' + MRK.inr(p.price) + "</button>" +
        "</div>";
      $("#sabAdd").onclick = function () {
        MRKStore.addToCart(p.slug, st.size, st.colour, st.qty);
        toast(p.name + " added to bag");
      };
      window.addEventListener("scroll", function () {
        sab.classList.toggle("show", window.scrollY > 560);
      }, { passive: true });
    }
    reveal();
  }

  /* ---------------- LOOKBOOK ---------------- */
  function pageLookbook() {
    const l = $("#lookbookGrid");
    if (l) l.innerHTML = MRK.LOOKS.map(lookHTML).join("");
    bindNewsletter();
    reveal();
  }

  /* ---------------- CART ---------------- */
  function pageCart() {
    function paint() {
      const lines = MRKStore.getCart();
      const t = MRKStore.totals();
      const list = $("#cartLines");
      if (!lines.length) {
        $("#cartWrap").innerHTML =
          '<div class="empty"><h3>Your bag is empty</h3><p>Nothing picked yet — the full rack is one tap away.</p>' +
          '<a class="btn btn--accent" style="margin-top:16px" href="shop.html">Start shopping</a></div>';
        return;
      }
      list.innerHTML = lines.map(function (l) {
        const p = MRK.bySlug(l.id);
        return '<div class="cline">' +
          '<a class="cline__art" href="product.html?p=' + p.slug + '" style="background:' + p.bg + '">' + MRK.art(p.type, l.colour, p.c2, p.bg) + "</a>" +
          '<div class="cline__in"><a href="product.html?p=' + p.slug + '">' + MRK.catName(p.cat) + "</a>" +
          "<h4>" + p.name + "</h4>" +
          '<div class="cline__meta">Size ' + l.size + " · " + l.colour + "</div>" +
          '<div class="cline__tools">' +
            '<div class="qty"><button data-cdec="' + l.key + '">−</button><span>' + l.qty + "</span><button data-cinc='" + l.key + "'>+</button></div>" +
            '<button class="linkbtn" data-move="' + l.key + '">Move to wishlist</button>' +
            '<button class="linkbtn" data-rm="' + l.key + '">Remove</button>' +
          "</div></div>" +
          '<div class="cline__rt"><b>' + MRK.inr(p.price * l.qty) + "</b></div>" +
        "</div>";
      }).join("");

      $("#shipMsg").innerHTML = t.sub === 0
        ? "Free shipping kicks in above " + MRK.inr(MRK.FREE_AT) + "."
        : (t.left > 0
            ? "Add <b>" + MRK.inr(t.left) + "</b> more for free shipping."
            : "You unlocked <b>free shipping</b>");
      $("#shipBar").style.width = Math.min(100, t.sub / MRK.FREE_AT * 100) + "%";
      $("#totals").innerHTML =
        "<li><span>Subtotal</span><span class='mono'>" + MRK.inr(t.sub) + "</span></li>" +
        (t.disc ? "<li><span>Coupon " + MRKStore.getCoupon() + "</span><em>− " + MRK.inr(t.disc) + "</em></li>" : "") +
        "<li><span>Delivery</span><span class='mono'>" + (t.ship ? MRK.inr(t.ship) : "<em>Free</em>") + "</span></li>" +
        '<li class="big"><span>Total</span><span>' + MRK.inr(t.grand) + "</span></li>";
      $("#coBtn").disabled = !lines.length;
    }

    document.addEventListener("click", function (e) {
      const inc = e.target.closest("[data-cinc]");
      const dec = e.target.closest("[data-cdec]");
      const rm = e.target.closest("[data-rm]");
      const mv = e.target.closest("[data-move]");
      if (inc) { MRKStore.setQty(inc.dataset.cinc, MRKStore.getCart().find(l => l.key === inc.dataset.cinc).qty + 1); paint(); return; }
      if (dec) {
        const l = MRKStore.getCart().find(x => x.key === dec.dataset.cdec);
        if (l.qty <= 1) MRKStore.remove(l.key); else MRKStore.setQty(l.key, l.qty - 1);
        paint(); return;
      }
      if (rm) { MRKStore.remove(rm.dataset.rm); paint(); toast("Removed from bag"); return; }
      if (mv) {
        const l = MRKStore.getCart().find(x => x.key === mv.dataset.move);
        if (l) { MRKStore.remove(l.key); MRKStore.toggleWish(l.id); }
        paint(); toast("Moved to wishlist"); return;
      }
    });

    $("#applyCode").onclick = function () {
      const v = $("#code").value.trim().toUpperCase();
      if (!v) return;
      const res = MRKStore.setCoupon(v);
      if (res.ok) { toast(res.label + " applied"); $("#code").value = ""; }
      else toast(res.msg);
      paint();
    };
    $("#code").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); $("#applyCode").onclick(); }
    });
    $("#coBtn").onclick = function () { window.location.href = "checkout.html"; };
    paint();
  }

  /* ---------------- CHECKOUT ---------------- */
  function pageCheckout() {
    const step = Math.max(1, Math.min(3, +(new URLSearchParams(window.location.search).get("step")) || 1));
    const box = $("#coPanel");
    const summary = $("#coSummary");

    function paintSummary() {
      if (!summary) return;
      const t = MRKStore.totals();
      const lines = MRKStore.getCart();
      summary.innerHTML =
        '<div class="summary">' +
          "<h3>Order summary</h3>" +
          '<div class="ship"><p id="smShip">' + (t.left > 0 ? "Add <b>" + MRK.inr(t.left) + "</b> more for free shipping." : "<b>Free shipping</b> unlocked") + "</p><div class='bar'><i style='width:" + Math.min(100, t.sub / MRK.FREE_AT * 100) + "%'></i></div></div>" +
          '<div class="cart-mini">' + (lines.length
            ? lines.map(function (l) {
                const p = MRK.bySlug(l.id);
                return '<div class="cline"><div class="cline__art" style="background:' + p.bg + '">' + MRK.art(p.type, l.colour, p.c2, p.bg) + "</div>" +
                  '<div class="cline__in"><h4>' + p.name + "</h4><div class='cline__meta'>" + l.size + " · " + p.colours[0] + " · ×" + l.qty + "</div></div>" +
                  '<div class="cline__rt"><b>' + MRK.inr(p.price * l.qty) + "</b></div></div>";
              }).join("")
            : '<p class="mono" style="font-size:11px;opacity:.6">Your bag is empty.</p>') + "</div>" +
          '<ul class="totals">' +
            "<li><span>Subtotal</span><span class='mono'>" + MRK.inr(t.sub) + "</span></li>" +
            (t.disc ? "<li><span>Coupon</span><em>− " + MRK.inr(t.disc) + "</em></li>" : "") +
            "<li><span>Delivery</span><span class='mono'>" + (t.ship ? MRK.inr(t.ship) : "<em>Free</em>") + "</span></li>" +
            '<li class="big"><span>Total</span><span>' + MRK.inr(t.grand) + "</span></li>" +
          "</ul>" +
          '<div class="paystrip"><span>UPI</span><span>GPay</span><span>PhonePe</span><span>VISA</span><span>COD</span></div>' +
        "</div>";
    }

    function paint() {
      if (step === 3) { paintDone(); paintSummary(); return; }
      if (!MRKStore.getCart().length) { window.location.href = "cart.html"; return; }
      const t = MRKStore.totals();
      const bar = '<div class="steps"><div class="' + (step > 1 ? "done" : "on") + '">1 · Address</div>' +
        '<div class="' + (step === 2 ? "on" : step > 2 ? "done" : "") + '">2 · Payment</div>' +
        '<div class="' + (step === 3 ? "on" : "") + '">3 · Done</div></div>';

      if (step === 1) {
        box.innerHTML = bar +
          '<div class="panel">' +
            "<h2>Where to?</h2>" +
            '<p class="lead">We send tracking on WhatsApp, so give us the number you use there.</p>' +
            '<div class="two">' +
              '<div class="field"><label>Full name</label><input id="cName" placeholder="Aarav Mehta"></div>' +
              '<div class="field"><label>WhatsApp number</label><input id="cPhone" placeholder="98765 43210" inputmode="numeric"></div>' +
            "</div>" +
            '<div class="field"><label>Address</label><textarea id="cAddr" rows="2" placeholder="House no, street, landmark"></textarea></div>' +
            '<div class="two">' +
              '<div class="field"><label>City</label><input id="cCity" placeholder="Bengaluru"></div>' +
              '<div class="field"><label>PIN code</label><input id="cPin" placeholder="560038" inputmode="numeric" maxlength="6"></div>' +
            "</div>" +
            '<p class="err" id="e1">Fill in name, a 10-digit number, address and a 6-digit PIN.</p>' +
            '<div style="display:flex;gap:10px;margin-top:16px">' +
              '<button class="btn" data-close>Keep shopping</button>' +
              '<button class="btn btn--accent" style="flex:1;justify-content:center" id="toPay">Continue · ' + MRK.inr(t.grand) + "</button>" +
            "</div>" +
          "</div>";
        $("#toPay").onclick = function () {
          const ok = $("#cName").value.trim() && /^\d{10}$/.test($("#cPhone").value.replace(/\s/g, "")) && $("#cAddr").value.trim() && /^\d{6}$/.test($("#cPin").value);
          if (!ok) { $("#e1").classList.add("show"); return; }
          window.location.href = "checkout.html?step=2";
        };
      }

      if (step === 2) {
        box.innerHTML = bar +
          '<div class="panel">' +
            "<h2>How you're paying</h2>" +
            '<p class="lead">Demo checkout — no money moves and no card details are stored.</p>' +
            '<div class="pay">' +
              '<label><input type="radio" name="pay" value="UPI" checked> UPI · GPay, PhonePe, Paytm <span class="end">Instant</span></label>' +
              '<label><input type="radio" name="pay" value="Card"> Debit / credit card <span class="end">VISA · MC · RuPay</span></label>' +
              '<label><input type="radio" name="pay" value="Netbanking"> Net banking <span class="end">All major banks</span></label>' +
              '<label><input type="radio" name="pay" value="COD"> Cash on delivery <span class="end">+ ₹0</span></label>' +
            "</div>" +
            '<div style="display:flex;gap:10px;margin-top:18px">' +
              '<button class="btn" id="back1">Back</button>' +
              '<button class="btn btn--accent" style="flex:1;justify-content:center" id="place">Place order · ' + MRK.inr(t.grand) + "</button>" +
            "</div>" +
          "</div>";
        $("#back1").onclick = function () { window.location.href = "checkout.html?step=1"; };
        $("#place").onclick = function () {
          const paid = document.querySelector("input[name=pay]:checked").value;
          const order = { no: "MK" + Math.floor(100000 + Math.random() * 899999), paid: paid, total: t.grand };
          localStorage.setItem("merak_last_order", JSON.stringify(order));
          MRKStore.clearCart();
          window.location.href = "checkout.html?step=3";
        };
      }
    }

    function paintDone() {
      let order = null;
      try { order = JSON.parse(localStorage.getItem("merak_last_order")); } catch (e) { /* ignore */ }
      const d = new Date(); d.setDate(d.getDate() + 4);
      const eta = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
      const no = order ? order.no : "MK" + Math.floor(100000 + Math.random() * 899999);
      const total = order ? order.total : 0;
      const paid = order ? order.paid : "UPI";
      box.innerHTML =
        '<div class="steps"><div class="done">1 · Address</div><div class="done">2 · Payment</div><div class="on">3 · Done</div></div>' +
        '<div class="panel done-wrap">' +
          '<div class="big">✦</div>' +
          "<h2>Order placed</h2>" +
          "<p style='color:var(--ink-2)'>Order <b class='mono'>" + no + "</b> · paying by " + paid + "</p>" +
          '<div class="ticket">' +
            '<div class="tk-row"><span>Order number</span><b>' + no + "</b></div>" +
            '<div class="tk-row"><span>Arriving by</span><b>' + eta + "</b></div>" +
            '<div class="tk-row"><span>Amount</span><b>' + MRK.inr(total) + "</b></div>" +
            '<div class="tk-row"><span>Status</span><b style="color:var(--ok)">Confirmed</b></div>' +
          "</div>" +
          "<p style='font-size:14px'>Tracking lands on WhatsApp and email the moment it ships. Demo order — nothing was charged.</p>" +
          '<a class="btn btn--ink btn--full" style="margin-top:22px" href="shop.html">Continue shopping</a>' +
        "</div>";
      const keep = document.createElement("button");
      keep.className = "btn btn--line btn--full";
      keep.style.marginTop = "10px";
      keep.innerHTML = "Back to home";
      keep.onclick = function () { window.location.href = "index.html"; };
      box.appendChild(keep);
    }

    paint();
    paintSummary();
  }

  /* ---------------- boot ---------------- */
  injectShell();
  renderHeader();
  renderFooter();
  MRKStore.subscribe(renderBadges);
  renderBadges();

  const routers = { home: pageHome, shop: pageShop, product: pageProduct, lookbook: pageLookbook, cart: pageCart, checkout: pageCheckout };
  if (routers[PAGE]) routers[PAGE]();
})();
