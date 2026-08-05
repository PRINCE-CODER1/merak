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

  let artSeq = 0;
  function art(type, c1, c2, bg) {
    const gid = "g" + (++artSeq);
    const shapes = {
      tee:
        '<path d="M140 152 L170 130 Q200 146 230 130 L260 152 L306 196 L280 226 L262 214 L262 430 Q200 444 138 430 L138 214 L120 226 L94 196 Z" fill="' + c1 + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M170 130 Q200 146 230 130" fill="none" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M152 226 h96" stroke="' + c2 + '" stroke-width="15" stroke-linecap="round"/>',
      hoodie:
        '<path d="M136 154 L166 132 Q200 148 234 132 L264 154 L310 200 L282 230 L264 216 L264 434 Q200 448 136 434 L136 216 L118 230 L90 200 Z" fill="' + c1 + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M166 132 Q200 148 234 132" fill="none" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M170 128 Q200 146 230 128 Q220 88 200 88 Q180 88 170 128 Z" fill="' + c2 + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M191 132 v30 M209 132 v30" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
        '<path d="M152 276 h96 v70 h-96 z" fill="' + c2 + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>',
      shirt:
        '<path d="M140 152 L170 130 Q200 146 230 130 L260 152 L306 196 L280 226 L262 214 L262 430 Q200 444 138 430 L138 214 L120 226 L94 196 Z" fill="' + c1 + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M170 130 L200 158 L230 130" fill="' + c2 + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M200 158 v272" stroke="' + INK + '" stroke-width="4" stroke-dasharray="8 8"/>' +
        '<circle cx="200" cy="198" r="5" fill="' + INK + '"/><circle cx="200" cy="240" r="5" fill="' + INK + '"/><circle cx="200" cy="282" r="5" fill="' + INK + '"/><circle cx="200" cy="324" r="5" fill="' + INK + '"/>',
      jacket:
        '<path d="M140 152 L170 130 Q200 146 230 130 L260 152 L306 196 L280 226 L262 214 L262 430 Q200 444 138 430 L138 214 L120 226 L94 196 Z" fill="' + c1 + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M170 130 L200 172 L200 200 L172 152 Z" fill="' + c2 + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M230 130 L200 172 L200 200 L228 152 Z" fill="' + c2 + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M200 200 v230" stroke="' + INK + '" stroke-width="4" stroke-dasharray="7 7"/>' +
        '<rect x="150" y="416" width="100" height="18" rx="9" fill="' + c2 + '" stroke="' + INK + '" stroke-width="6"/>',
      coat:
        '<path d="M138 158 L170 134 Q200 150 230 134 L262 158 L304 202 L280 232 L262 218 L262 462 Q200 476 138 462 L138 218 L120 232 L96 202 Z" fill="' + c1 + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M170 134 L200 176 L200 470" fill="none" stroke="' + INK + '" stroke-width="4" stroke-dasharray="8 8"/>' +
        '<path d="M170 134 L202 178" fill="' + c2 + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M230 134 L198 178" fill="' + c2 + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M146 300 h108" stroke="' + c2 + '" stroke-width="14" stroke-linecap="round"/>',
      dress:
        '<path d="M140 150 L170 128 Q200 144 230 128 L260 150 L246 238 L302 456 Q200 474 98 456 L154 238 Z" fill="' + c1 + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M170 128 Q200 144 230 128" fill="none" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M152 240 h96" stroke="' + c2 + '" stroke-width="12" stroke-linecap="round"/>' +
        '<path d="M168 300 L170 452 M232 300 L230 452" stroke="' + INK + '" stroke-width="4" opacity=".3"/>',
      skirt:
        '<rect x="148" y="150" width="104" height="20" fill="' + c2 + '" stroke="' + INK + '" stroke-width="6"/>' +
        '<path d="M150 170 L250 170 L284 452 Q200 464 116 452 Z" fill="' + c1 + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M160 174 L144 448 M200 174 L200 458 M240 174 L256 448" stroke="' + INK + '" stroke-width="4" opacity=".35"/>',
      jeans:
        '<path d="M142 148 h116 v22 L258 452 L210 452 L204 262 L196 262 L190 452 L142 452 Z" fill="' + c1 + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M142 148 h116 v22 L142 170 Z" fill="' + c2 + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M200 170 L200 262" stroke="' + INK + '" stroke-width="3.5" stroke-dasharray="6 6"/>' +
        '<path d="M148 184 h24 v26 h-24 z M228 184 h24 v26 h-24 z" fill="none" stroke="' + INK + '" stroke-width="4"/>',
      shorts:
        '<path d="M142 150 h116 v22 L258 304 L210 304 L204 262 L196 262 L190 304 L142 304 Z" fill="' + c1 + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M142 150 h116 v22 L142 172 Z" fill="' + c2 + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M200 172 L200 262" stroke="' + INK + '" stroke-width="3.5" stroke-dasharray="6 6"/>' +
        '<path d="M148 184 h22 v26 h-22 z M230 184 h22 v26 h-22 z" fill="none" stroke="' + INK + '" stroke-width="4"/>',
      sneaker:
        '<path d="M106 346 Q112 252 214 246 Q288 242 296 302 L300 346 Z" fill="' + c1 + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M92 346 H308 V368 Q308 380 292 380 H108 Q92 380 92 368 Z" fill="' + c2 + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M150 252 L176 264 L150 292 L182 306 M204 252 L182 268 L208 292 L176 312" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M232 258 h42" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>',
      cap:
        '<path d="M142 172 Q142 104 200 104 Q258 104 258 172 Z" fill="' + c1 + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M142 172 L308 172 Q322 174 320 186 Q318 198 302 198 L142 198 Z" fill="' + c2 + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
        '<circle cx="200" cy="110" r="7" fill="' + c2 + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<path d="M200 104 v68" stroke="' + INK + '" stroke-width="3.5" opacity=".3"/>',
      tote:
        '<path d="M128 224 L272 224 L284 380 Q284 396 264 396 L136 396 Q116 396 116 380 Z" fill="' + c1 + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M146 224 Q146 170 200 170 Q254 170 254 224" fill="none" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/>' +
        '<rect x="168" y="258" width="64" height="34" rx="8" fill="' + c2 + '" stroke="' + INK + '" stroke-width="6"/>',
      beanie:
        '<path d="M142 240 Q142 160 200 160 Q258 160 258 240 L142 240 Z" fill="' + c1 + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>' +
        '<path d="M142 240 h116 v22 Q258 276 200 276 Q142 276 142 262 Z" fill="' + c2 + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
        '<circle cx="200" cy="164" r="7" fill="' + c2 + '" stroke="' + INK + '" stroke-width="5"/>'
    };
    return (
      '<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + type + '">' +
      '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="' + lighten(bg || "#F6F4EF", 0.55) + '"/>' +
      '<stop offset="100%" stop-color="' + (bg || "#F6F4EF") + '"/></linearGradient></defs>' +
      '<rect width="400" height="500" fill="url(#' + gid + ')"/>' +
      '<circle cx="200" cy="120" r="230" fill="#ffffff" opacity=".32"/>' +
      '<ellipse cx="200" cy="452" rx="130" ry="20" fill="' + INK + '" opacity=".08"/>' +
      '<g transform="translate(0,-8)">' + (shapes[type] || shapes.tee) + '</g></svg>'
    );
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
      heroA: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
      heroB: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
      heroC: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      banner: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80",
      story: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      look1: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
      look2: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80",
      look3: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=80",
      mega: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=600&q=80"
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
