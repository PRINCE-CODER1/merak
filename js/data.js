/* ============ MERAK — data layer ============ */
window.MRK = (function () {
  const INK = "#141210";

  function lighten(hex, p) {
    hex = (hex || "#F6F4EF").replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const n = parseInt(hex, 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    r += Math.round((255 - r) * p);
    g += Math.round((255 - g) * p);
    b += Math.round((255 - b) * p);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function art(type, c1, c2, bg) {
    const urls = {
      tee: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600",
      hoodie: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600",
      shirt: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600",
      jeans: "https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg?auto=compress&cs=tinysrgb&w=600",
      shorts: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=600",
      jacket: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=600",
      coat: "https://images.pexels.com/photos/2036646/pexels-photo-2036646.jpeg?auto=compress&cs=tinysrgb&w=600",
      dress: "https://images.pexels.com/photos/1036628/pexels-photo-1036628.jpeg?auto=compress&cs=tinysrgb&w=600",
      skirt: "https://images.pexels.com/photos/1004014/pexels-photo-1004014.jpeg?auto=compress&cs=tinysrgb&w=600",
      cap: "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=600",
      tote: "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=600",
      beanie: "https://images.pexels.com/photos/852860/pexels-photo-852860.jpeg?auto=compress&cs=tinysrgb&w=600"
    };
    const imgUrl = urls[type] || urls.tee;
    return '<img src="' + imgUrl + '" alt="' + type + '" style="width:100%;height:100%;object-fit:cover;display:block;">';
  }

  const BRAND = {
    name: "URBAN PLANET",
    logoMark: "URBAN PLANET",
    tagline: "Wear your story.",
    blurb: "Independent clothing label making heavy-duty everyday essentials — cut, sewn and printed in India. Built to last beyond the season.",
    phone: "+91 98765 43210",
    phoneLink: "919876543210",
    email: "hello@urbanplanet.in",
    address: "Studio 12, 4th Cross, Indiranagar, Bengaluru 560038",
    social: {
      instagram: "#",
      facebook: "#",
      x: "#"
    },
    whatsapp: "https://wa.me/919876543210",
    photos: {
      heroA: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800",
      heroB: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800",
      heroC: "https://images.pexels.com/photos/2036646/pexels-photo-2036646.jpeg?auto=compress&cs=tinysrgb&w=1200",
      banner: "https://images.pexels.com/photos/3731256/pexels-photo-3731256.jpeg?auto=compress&cs=tinysrgb&w=1600",
      story: "https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg?auto=compress&cs=tinysrgb&w=900",
      look1: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1000",
      look2: "https://images.pexels.com/photos/1036628/pexels-photo-1036628.jpeg?auto=compress&cs=tinysrgb&w=1000",
      look3: "https://images.pexels.com/photos/996330/pexels-photo-996330.jpeg?auto=compress&cs=tinysrgb&w=1000",
      mega: "https://images.pexels.com/photos/1487809/pexels-photo-1487809.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  };

  const CATEGORIES = [
    { slug: "tshirts", name: "T-Shirts", art: "tee", blurb: "Heavyweight cotton, boxy fits" },
    { slug: "hoodies", name: "Hoodies & Sweats", art: "hoodie", blurb: "Fleece that keeps you warm" },
    { slug: "shirts", name: "Shirts", art: "shirt", blurb: "Crisp collars, easy shapes" },
    { slug: "bottoms", name: "Bottoms", art: "jeans", blurb: "Denim, cargos and shorts" },
    { slug: "outerwear", name: "Outerwear", art: "jacket", blurb: "Built for layering season" },
    { slug: "dresses", name: "Dresses & Skirts", art: "dress", blurb: "Easy, feminine silhouettes" },
    { slug: "accessories", name: "Accessories", art: "cap", blurb: "The finishing touches" }
  ];

  const P = (slug, name, cat, type, price, mrp, c1, c2, bg, sizes, colours, rating, reviews, badge, desc, fabric, fit, newIn) =>
    ({ slug, name, cat, type, price, mrp, c1, c2, bg, sizes, colours, rating, reviews, badge, desc, fabric, fit, newIn });

  const SZ_TOP = ["S", "M", "L", "XL"];
  const SZ_BOTTOM = ["28", "30", "32", "34"];
  const SZ_ONE = ["One size"];

  const PRODUCTS = [
    P("core-heavyweight-tee", "Core Heavyweight Tee", "tshirts", "tee", 1199, 1799, "#D9F24B", "#141210", "#F3F8D8", SZ_TOP, ["#D9F24B", "#1D3BF0", "#141210", "#F6F4EF"], 4.8, 287, "Bestseller", "240 GSM combed cotton, bio-washed so it never shrinks. The tee that doesn't go see-through after the third wash.", "240 GSM combed cotton", "Relaxed boxy", false),
    P("archive-graphic-tee", "Archive Graphic Tee", "tshirts", "tee", 1399, 1999, "#1D3BF0", "#D9F24B", "#DDE2FF", SZ_TOP, ["#1D3BF0", "#F6F4EF", "#FF4D00"], 4.7, 143, "New", "Small-run screen print pulled from our 2024 archive. Thick, crack-proof ink on heavyweight cotton.", "240 GSM combed cotton", "Relaxed boxy", true),
    P("sunset-wash-tee", "Sunset Wash Tee", "tshirts", "tee", 999, 1499, "#FF4D00", "#FFD02F", "#FFE4D6", SZ_TOP, ["#FF4D00", "#FFD02F", "#F6F4EF"], 4.6, 198, "", "Garment-dyed for a lived-in colour that fades beautifully instead of going grey.", "220 GSM cotton", "Regular", false),
    P("jersey-sport-tee", "Jersey Sport Tee", "tshirts", "tee", 1299, 1799, "#FFD7E4", "#1D3BF0", "#FDE6ED", SZ_TOP, ["#FFD7E4", "#1D3BF0", "#141210"], 4.5, 96, "New", "Stretch-knit jersey with a side-seam-free cut. Moves with you, keeps its shape all day.", "Stretch jersey", "Athletic", true),

    P("oversized-fleece-hoodie", "Oversized Fleece Hoodie", "hoodies", "hoodie", 2799, 3999, "#141210", "#D9F24B", "#E3E1DC", SZ_TOP, ["#141210", "#D9F24B", "#6B655A", "#F6F4EF"], 4.8, 312, "Bestseller", "Brushed fleece inside, drop shoulders, and a kangaroo pocket deep enough for a phone and a hand. Runs big on purpose.", "Cotton fleece 380 GSM", "Oversized", false),
    P("crewneck-sweatshirt", "Crewneck Sweatshirt", "hoodies", "hoodie", 2299, 3199, "#B7F0D8", "#141210", "#E4F7EE", SZ_TOP, ["#B7F0D8", "#141210", "#1D3BF0"], 4.7, 154, "", "A clean crewneck with ribbed cuffs that stay put. The layer you reach for every single weekend.", "Cotton fleece 320 GSM", "Regular", false),
    P("halfzip-trainer", "Half-Zip Trainer", "hoodies", "hoodie", 2499, 3499, "#C9E9FF", "#1D3BF0", "#EAF4FC", SZ_TOP, ["#C9E9FF", "#1D3BF0", "#F6F4EF"], 4.6, 87, "New", "Half-zip mock neck with a zip garage so it never catches your chin. Pre-run or post-office.", "Cotton fleece 340 GSM", "Slim", true),

    P("oxford-poplin-shirt", "Oxford Poplin Shirt", "shirts", "shirt", 1799, 2599, "#F6F4EF", "#1D3BF0", "#F0EDE4", SZ_TOP, ["#F6F4EF", "#1D3BF0", "#B7F0D8"], 4.7, 221, "Bestseller", "Proper oxford cotton, single-needle stitching, and a collar that stands without a stay. Works with jeans or a tie.", "Oxford cotton", "Slim", false),
    P("cuban-collar-shirt", "Cuban Collar Shirt", "shirts", "shirt", 1599, 2299, "#E4DDFF", "#FF4D00", "#F3EFFE", SZ_TOP, ["#E4DDFF", "#FF4D00", "#F6F4EF"], 4.5, 118, "New", "Camp-collar shirt cut boxy with a straight hem. Unbutton one more than you think you should.", "Rayon blend", "Boxy", true),

    P("utility-denim", "Utility Denim", "bottoms", "jeans", 2199, 3299, "#33518F", "#D9F24B", "#E3E9F5", SZ_BOTTOM, ["#33518F", "#141210", "#7D94C7"], 4.8, 176, "Bestseller", "Mid-rise, straight through the leg with deep utility pockets. Raw hem — tell us your length and we cut it free.", "Non-stretch denim 14 oz", "Straight", false),
    P("wide-cargo-pant", "Wide Cargo Pant", "bottoms", "jeans", 2399, 3499, "#6B655A", "#141210", "#EFECE6", SZ_BOTTOM, ["#6B655A", "#141210", "#8A7F6E"], 4.6, 132, "New", "Six pockets, wide leg, elasticated drawcord waist. The pair people re-order in a second colour.", "Cotton twill", "Wide", true),
    P("relaxed-shorts", "Relaxed Shorts", "bottoms", "shorts", 1499, 2199, "#FFD02F", "#141210", "#FFF3CE", SZ_BOTTOM, ["#FFD02F", "#141210", "#B7F0D8"], 4.5, 143, "", "Above-the-knee with a forgiving waist and two proper pockets. Summer is sorted.", "Cotton twill", "Relaxed", false),

    P("racer-moto-jacket", "Racer Moto Jacket", "outerwear", "jacket", 3999, 5999, "#141210", "#FF4D00", "#E3E1DC", SZ_TOP, ["#141210", "#6B655A"], 4.9, 97, "Bestseller", "Bomber-style with a high collar and asymmetric zip. Break it in for a week and it moulds to you.", "Vegan leather", "True to size", false),
    P("field-overshirt", "Field Overshirt", "outerwear", "jacket", 2899, 3999, "#8A6B4F", "#D9F24B", "#F1E7DB", SZ_TOP, ["#8A6B4F", "#141210", "#B48C66"], 4.6, 76, "", "Wear it open as a jacket or buttoned as a shirt. Two chest pockets that actually fit a wallet.", "Brushed canvas", "Relaxed", false),
    P("city-trench-coat", "City Trench Coat", "outerwear", "coat", 5499, 7499, "#C9BBA4", "#141210", "#F1ECE2", SZ_TOP, ["#C9BBA4", "#141210"], 4.8, 64, "", "Double-breasted, waist-tied, and cut long enough to feel dramatic without tripping on stairs.", "Cotton gabardine", "Tailored", true),

    P("swing-mini-dress", "Swing Mini Dress", "dresses", "dress", 1899, 2799, "#FF4D00", "#FFD02F", "#FFE4D6", SZ_TOP, ["#FF4D00", "#141210", "#D9F24B"], 4.7, 109, "New", "A-line with a swingy skirt and ribbed knit bodice. Pairs with sneakers by day, heels by night.", "Ribbed knit + woven skirt", "A-line", true),
    P("pleated-maxi-skirt", "Pleated Maxi Skirt", "dresses", "skirt", 1699, 2499, "#1D3BF0", "#C9E9FF", "#DDE2FF", SZ_TOP, ["#1D3BF0", "#F6F4EF", "#141210"], 4.6, 92, "", "Knife pleats from a fitted waistband to the floor. Twirl factor: certified.", "Crepe de chine", "High rise", false),

    P("merak-logo-cap", "Merak Logo Cap", "accessories", "cap", 899, 1299, "#141210", "#D9F24B", "#E3E1DC", SZ_ONE, ["#141210", "#6B655A", "#D9F24B"], 4.7, 168, "Bestseller", "Six-panel, curved brim, adjustable strap. The cap that survives being washed with everything else.", "Twill + cotton", "One size", false),
    P("canvas-tote", "Canvas Tote", "accessories", "tote", 699, 999, "#F6F4EF", "#FF4D00", "#F0EDE4", SZ_ONE, ["#F6F4EF", "#FFD02F", "#B7F0D8"], 4.6, 121, "", "16 oz canvas with a boxed base and straps long enough for a shoulder. Holds a laptop and a week of groceries.", "16 oz canvas", "One size", true),
    P("ribbed-beanie", "Ribbed Beanie", "accessories", "beanie", 799, 1199, "#B7F0D8", "#141210", "#E4F7EE", SZ_ONE, ["#B7F0D8", "#141210", "#FFD7E4"], 4.5, 88, "", "Double-fold ribbed knit that stays on your head through a whole commute.", "Acrylic knit", "One size", false)
  ];

  const LOOKS = [
    { title: "Monochrome Day", blurb: "Oversized fleece over utility denim, finished with the logo cap. All black, zero effort.", ids: ["oversized-fleece-hoodie", "utility-denim", "merak-logo-cap"], img: "look1" },
    { title: "Office Hours", blurb: "Oxford poplin under the city trench, with the canvas tote for your everyday carry.", ids: ["oxford-poplin-shirt", "city-trench-coat", "canvas-tote"], img: "look2" },
    { title: "Weekend Club", blurb: "Sunset tee tucked into wide cargos, capped with the beanie. Off-duty energy, on.", ids: ["sunset-wash-tee", "wide-cargo-pant", "ribbed-beanie"], img: "look3" }
  ];

  const REVIEWS = [
    { n: "Priya M.", c: "Mumbai", t: "The oversized hoodie is genuinely oversized — not 'oversized' like other brands. Fleece is soft and it survived six washes without pilling.", r: 5, col: "#FFD7E4" },
    { n: "Arjun S.", c: "Bengaluru", t: "Quality is a step above fast fashion. The denim is thick, stitching is clean, and the fit matched the size chart exactly.", r: 5, col: "#C9E9FF" },
    { n: "Sana K.", c: "Delhi", t: "Ordered Monday, delivered Wednesday. Packaging was lovely and the cotton tee is heavier than most premium brands here.", r: 5, col: "#B7F0D8" },
    { n: "Rohit V.", c: "Pune", t: "Took an XL in the moto jacket — fits perfectly over hoodies. Colour and stitching look exactly like the product page.", r: 4, col: "#E4DDFF" }
  ];

  const FAQS = [
    ["How fast is delivery?", "Orders ship within 24 hours on working days. Metro cities get deliveries in 2-3 days, the rest of India in 4-6 days. You get tracking on WhatsApp and email the moment your order leaves the warehouse."],
    ["What is your return policy?", "Free size exchanges and returns within 15 days of delivery, as long as tags are attached and the item is unworn. We arrange a doorstep pickup — no questions asked."],
    ["Are sizes true to size?", "Yes. Every size chart is based on real garment measurements. If you're between sizes, go one size up — our fits are designed to be relaxed."],
    ["Is cash on delivery available?", "Yes, COD is available up to ₹5,000 across India. Above that we ask for a small advance online so we're not left holding a stitched-to-order piece."],
    ["Do you ship internationally?", "Currently we ship across India. International shipping is coming soon — join the drop list and we'll email you the moment it goes live."]
  ];

  const COUPONS = {
    URBAN10: { type: "pct", v: 10, min: 0, label: "10% off your order" },
    CLUB20: { type: "pct", v: 20, min: 2999, label: "20% off above ₹2,999" },
    SHIPFREE: { type: "ship", v: 0, min: 0, label: "Free delivery" }
  };

  const FREE_AT = 2499;
  const SHIP_FEE = 79;

  const TICKER = [
    "Free shipping above " + inr(FREE_AT),
    "Easy 15-day returns",
    "COD across India",
    "New drop every Friday",
    "Sized true · fit guaranteed",
    "GST invoice with every order"
  ];

  function inr(n) { return "₹" + n.toLocaleString("en-IN"); }
  function bySlug(s) { return PRODUCTS.find(p => p.slug === s); }
  function catBySlug(s) { return CATEGORIES.find(c => c.slug === s); }
  function catName(s) { const c = catBySlug(s); return c ? c.name : s; }
  function off(p) { return Math.round((1 - p.price / p.mrp) * 100); }
  function stars(r) {
    const f = Math.round(r);
    return "★".repeat(f) + '<span style="opacity:.3">' + "★".repeat(5 - f) + "</span>";
  }
  function related(p, n) {
    n = n || 4;
    const same = PRODUCTS.filter(x => x.cat === p.cat && x.slug !== p.slug);
    const rest = PRODUCTS.filter(x => x.cat !== p.cat);
    return same.concat(rest).slice(0, n);
  }
  function trending(n) {
    n = n || 8;
    return PRODUCTS.filter(p => p.badge || p.newIn).concat(PRODUCTS.filter(p => !p.badge && !p.newIn)).slice(0, n);
  }

  return { BRAND, CATEGORIES, PRODUCTS, LOOKS, REVIEWS, FAQS, COUPONS, FREE_AT, SHIP_FEE, TICKER, art, lighten, inr, bySlug, catBySlug, catName, off, stars, related, trending };
})();
