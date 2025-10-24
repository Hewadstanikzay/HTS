import React, { useMemo, useState } from "react";

// ————————————————————————————————————————————
// Apparel & Custom Print Store – Single Page (React + Tailwind)
// Languages: EN / DE (simple in-component i18n)
// Direction: LTR
// ————————————————————————————————————————————

export default function ApparelPrintStore() {
  const [lang, setLang] = useState("en");
  const t = createTranslator(lang);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(t("cat_all"));
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [toast, setToast] = useState(null);

  const products = useMemo(
    () => [
      {
        id: "ts-basic",
        title: t("p_ts_title"),
        desc: t("p_ts_desc"),
        price: 35,
        category: t("cat_tshirt"),
        colors: [t("c_white"), t("c_black"), t("c_navy"), t("c_grey")],
        sizes: ["S", "M", "L", "XL"],
        img:
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "hd-prem",
        title: t("p_hd_title"),
        desc: t("p_hd_desc"),
        price: 89,
        category: t("cat_hoodie"),
        colors: [t("c_black"), t("c_grey_melange"), t("c_green")],
        sizes: ["S", "M", "L", "XL"],
        img:
          "https://images.unsplash.com/photo-1548883354-7622d03aca4e?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "pk-classic",
        title: t("p_pk_title"),
        desc: t("p_pk_desc"),
        price: 59,
        category: t("cat_polo"),
        colors: [t("c_white"), t("c_navy"), t("c_black")],
        sizes: ["S", "M", "L", "XL"],
        img:
          "https://images.unsplash.com/photo-1520975954732-35dd222996a3?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "cs-kids",
        title: t("p_cs_title"),
        desc: t("p_cs_desc"),
        price: 39,
        category: t("cat_kids"),
        colors: [t("c_white"), t("c_pink"), t("c_sky")],
        sizes: ["2-3", "4-5", "6-7"],
        img:
          "https://images.unsplash.com/photo-1618355776468-5fff8f3ec7bd?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "cp-hat",
        title: t("p_cp_title"),
        desc: t("p_cp_desc"),
        price: 19,
        category: t("cat_access"),
        colors: [t("c_black"), t("c_beige"), t("c_olive")],
        sizes: ["Free"],
        img:
          "https://images.unsplash.com/photo-1516641393819-61b9e03ddb9a?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "bg-tote",
        title: t("p_bg_title"),
        desc: t("p_bg_desc"),
        price: 12,
        category: t("cat_access"),
        colors: [t("c_beige"), t("c_black")],
        sizes: ["One"],
        img:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    [lang]
  );

  const categories = [t("cat_all"), t("cat_tshirt"), t("cat_hoodie"), t("cat_polo"), t("cat_kids"), t("cat_access")];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const okCat = category === t("cat_all") || p.category === category;
      const okQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.desc.toLowerCase().includes(query.toLowerCase());
      return okCat && okQuery;
    });
  }, [products, category, query, lang]);

  function addToCart(p, color, size, qty = 1) {
    if (!color || !size) {
      setToast({ type: "warn", msg: t("toast_pick") });
      return;
    }
    setCart((prev) => {
      const key = `${p.id}-${color}-${size}`;
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          key,
          id: p.id,
          title: p.title,
          color,
          size,
          price: p.price,
          qty,
          img: p.img,
        },
      ];
    });
    setToast({ type: "ok", msg: t("toast_added") });
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div dir="ltr" className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header
        t={t}
        onOpenCart={() => setShowCart(true)}
        cartCount={cart.length}
        lang={lang}
        setLang={(v)=>{ setLang(v); setCategory("all"); }}
      />

      <Hero t={t} onOpenCustomizer={() => setShowCustomizer(true)} />

      <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold">{t("shop_title")}</h2>
            <p className="text-neutral-600 mt-1">{t("shop_sub")}</p>
          </div>
          <div className="flex gap-3 items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search_ph")}
              className="w-56 rounded-xl border border-neutral-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-neutral-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} t={t} />
          ))}
        </div>
      </section>

      <section id="custom" className="bg-white/70 border-y py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">{t("custom_title")}</h3>
              <p className="text-neutral-700 leading-relaxed">
                {t("custom_desc")}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowCustomizer(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  {t("btn_start_design")}
                </button>
                <a href="#pricing" className="px-5 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 transition">
                  {t("btn_view_pricing")}
                </a>
              </div>
            </div>
            <div className="flex-1">
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1585386959984-a4155223168f?q=80&w=1400&auto=format&fit=crop"
                  className="w-full h-full object-cover"
                  alt={t("alt_custom")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl md:text-3xl font-bold mb-6">{t("pricing_title")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PriceCard t={t} title="DTG" price={12} items={[t("pr_photq"), t("pr_lightdark"), t("pr_smallrun")]} />
          <PriceCard t={t} title={t("pr_silks"))} price={7} items={[t("pr_costeff"), t("pr_bulkrun"), t("pr_upto4")]} />
          <PriceCard t={t} title={t("pr_emb") } price={15} items={[t("pr_logo"), t("pr_durable"), t("pr_capspolo")] } />
        </div>
      </section>

      <section id="faq" className="bg-white/70 border-t py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">{t("faq_title")}</h3>
          <FAQ t={t} />
        </div>
      </section>

      <Footer t={t} />

      {showCart && (
        <CartDrawer
          t={t}
          items={cart}
          onClose={() => setShowCart(false)}
          onRemove={(key) => setCart((prev) => prev.filter((i) => i.key !== key))}
          onQty={(key, q) =>
            setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, q) } : i)))
          }
          total={total}
        />
      )}

      {showCustomizer && (
        <Customizer t={t} onClose={() => setShowCustomizer(false)} onAdded={(i) => setCart((c) => [...c, i])} />)
      }

      {toast && (
        <div className={`fixed bottom-4 left-4 z-50 px-4 py-2 rounded-xl shadow-lg ${
          toast.type === "ok" ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
        }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function createTranslator(lang) {
  const dict = {
    en: {
      brand: "Nurin Print",
      nav_products: "Products",
      nav_custom: "Custom Print",
      nav_pricing: "Pricing",
      nav_faq: "FAQ",
      start_order: "Start Order",
      cart: "Cart",
      hero_title: "Print anything you want – ",
      hero_title_span: "Fast, High‑Quality, Fair",
      hero_desc:
        "From t‑shirts and hoodies to caps and totes. DTG, screen printing and embroidery. Single items to team orders.",
      btn_design_now: "Design & Print Now",
      btn_view_products: "Browse Products",
      badge_ship: "Ships in 3–5 business days",
      badge_group: "Team/Group discounts",
      badge_support: "WhatsApp support",

      shop_title: "Ready‑to‑print products",
      shop_sub: "Pick, choose color & size, add to cart.",
      search_ph: "Search products...",

      custom_title: "Custom print – your design",
      custom_desc:
        "Upload your logo/text/image, choose print type (DTG, Screen, Embroidery) and get a live preview. Bulk discounts for teams and events.",
      btn_start_design: "Start Designing",
      btn_view_pricing: "See Pricing",
      alt_custom: "Custom apparel printing",

      pricing_title: "Printing & customization pricing",
      pr_photq: "Photo‑quality",
      pr_lightdark: "Works on light/dark",
      pr_smallrun: "Great for small runs",
      pr_silks: "Screen Printing",
      pr_costeff: "Cost‑effective",
      pr_bulkrun: "Best for bulk",
      pr_upto4: "Up to 4 colors",
      pr_emb: "Embroidery",
      pr_logo: "Premium logo finish",
      pr_durable: "Highly durable",
      pr_capspolo: "Caps / Polos",

      faq_title: "Frequently asked questions",
      faq_1_q: "What is the turnaround?",
      faq_1_a: "Singles: 3–5 business days. Bulk: 5–10 business days depending on the technique.",
      faq_2_q: "Minimum order?",
      faq_2_a: "We accept single‑item orders. For screen printing, 20+ is most economical.",
      faq_3_q: "When do I pay?",
      faq_3_a: "50% deposit at checkout, remainder before shipping or on pickup.",
      faq_4_q: "Best file format?",
      faq_4_a: "Transparent PNG or vector (SVG/PDF). 300dpi for DTG.",

      contact_title: "Contact",
      links_title: "Quick Links",
      links_products: "Products",
      links_custom: "Custom Print",
      links_pricing: "Pricing",
      links_faq: "FAQ",

      toast_pick: "Please select color and size.",
      toast_added: "Added to cart.",

      // categories & product copy
      cat_all: "All",
      cat_tshirt: "T‑Shirts",
      cat_hoodie: "Hoodies",
      cat_polo: "Polos",
      cat_kids: "Kids",
      cat_access: "Accessories",

      p_ts_title: "Cotton T‑Shirt",
      p_ts_desc: "100% cotton, DTG & screen friendly",
      p_hd_title: "Premium Hoodie",
      p_hd_desc: "Warm & soft, front/back print",
      p_pk_title: "Classic Polo",
      p_pk_desc: "Piqué knit, embroidery or print",
      p_cs_title: "Kids Set",
      p_cs_desc: "Soft fabric, skin‑safe inks",
      p_cp_title: "Cotton Cap",
      p_cp_desc: "Logo embroidery, one size",
      p_bg_title: "Tote Bag",
      p_bg_desc: "Sturdy seams, perfect for logos",

      c_white: "White",
      c_black: "Black",
      c_navy: "Navy",
      c_grey: "Grey",
      c_grey_melange: "Grey Melange",
      c_green: "Forest Green",
      c_pink: "Light Pink",
      c_sky: "Sky Blue",
      c_beige: "Beige",
      c_olive: "Olive",

      // cart/checkout
      color: "Color",
      size: "Size",
      qty: "Qty",
      add_to_cart: "Add to cart",
      subtotal: "Subtotal",
      remove: "Remove",
      empty_cart: "Your cart is empty.",
      checkout_name: "First name",
      checkout_family: "Last name",
      checkout_phone: "Phone",
      checkout_addr: "Address",
      checkout_note: "Order note (optional)",
      checkout_submit: "Place order",
      price_suffix: "€",

      // customizer
      garment_type: "Garment",
      print_tech: "Print technique",
      garment_tshirt: "T‑Shirt",
      garment_hoodie: "Hoodie",
      garment_polo: "Polo",
      tech_dtg: "DTG",
      tech_screen: "Screen",
      tech_emb: "Embroidery",
      text_on_garment: "Text on garment (optional)",
      upload_label: "Upload logo/image (PNG/SVG)",
      est_price: "Estimated price",
      add_to_cart_short: "Add to cart",

      // footer
      about_blurb:
        "Custom apparel printing – T‑shirts, hoodies, polos, caps and totes. Pro quality, fair pricing.",
      contact_whatsapp: "WhatsApp:",
      contact_email: "Email:",
      contact_address: "Address:",
    },
    de: {
      brand: "Nurin Print",
      nav_products: "Produkte",
      nav_custom: "Sonderdruck",
      nav_pricing: "Preise",
      nav_faq: "FAQ",
      start_order: "Bestellung starten",
      cart: "Warenkorb",
      hero_title: "Drucke, was du willst – ",
      hero_title_span: "Schnell, hochwertig, fair",
      hero_desc:
        "Von T‑Shirts und Hoodies bis Caps und Stofftaschen. DTG, Siebdruck und Stickerei. Einzelstücke bis Team‑Bestellungen.",
      btn_design_now: "Jetzt designen & drucken",
      btn_view_products: "Produkte ansehen",
      badge_ship: "Versand in 3–5 Werktagen",
      badge_group: "Rabatte für Teams/Events",
      badge_support: "WhatsApp‑Support",

      shop_title: "Druckfertige Produkte",
      shop_sub: "Wähle Produkt, Farbe & Größe und lege es in den Warenkorb.",
      search_ph: "Produkte suchen...",

      custom_title: "Sonderdruck – dein Design",
      custom_desc:
        "Lade Logo/Text/Bild hoch, wähle die Technik (DTG, Siebdruck, Stickerei) und erhalte eine Vorschau. Mengenrabatte für Teams & Events.",
      btn_start_design: "Design starten",
      btn_view_pricing: "Preise ansehen",
      alt_custom: "Textildruck",

      pricing_title: "Preise für Druck & Veredelung",
      pr_photq: "Foto‑Qualität",
      pr_lightdark: "Für hell/dunkel geeignet",
      pr_smallrun: "Ideal für kleine Auflagen",
      pr_silks: "Siebdruck",
      pr_costeff: "Kosteneffizient",
      pr_bulkrun: "Am besten für große Mengen",
      pr_upto4: "Bis zu 4 Farben",
      pr_emb: "Stickerei",
      pr_logo: "Edles Logo‑Finish",
      pr_durable: "Sehr langlebig",
      pr_capspolo: "Caps / Polos",

      faq_title: "Häufige Fragen",
      faq_1_q: "Wie lange ist die Produktionszeit?",
      faq_1_a: "Einzelstücke: 3–5 Werktage. Große Mengen: 5–10 Werktage je nach Technik.",
      faq_2_q: "Mindestmenge?",
      faq_2_a: "Einzelbestellungen sind möglich. Für Siebdruck ist 20+ am wirtschaftlichsten.",
      faq_3_q: "Wann zahle ich?",
      faq_3_a: "50% Anzahlung beim Bestellen, Rest vor Versand oder bei Abholung.",
      faq_4_q: "Beste Dateiformate?",
      faq_4_a: "Transparente PNG oder Vektor (SVG/PDF). 300dpi für DTG.",

      contact_title: "Kontakt",
      links_title: "Schnellzugriff",
      links_products: "Produkte",
      links_custom: "Sonderdruck",
      links_pricing: "Preise",
      links_faq: "FAQ",

      toast_pick: "Bitte Farbe und Größe wählen.",
      toast_added: "Zum Warenkorb hinzugefügt.",

      cat_all: "Alle",
      cat_tshirt: "T‑Shirts",
      cat_hoodie: "Hoodies",
      cat_polo: "Polos",
      cat_kids: "Kinder",
      cat_access: "Accessoires",

      p_ts_title: "Baumwoll‑T‑Shirt",
      p_ts_desc: "100% Baumwolle, geeignet für DTG & Siebdruck",
      p_hd_title: "Premium‑Hoodie",
      p_hd_desc: "Warm & weich, Front/Back‑Druck",
      p_pk_title: "Klassisches Polo",
      p_pk_desc: "Piqué, Stick oder Druck",
      p_cs_title: "Kinder‑Set",
      p_cs_desc: "Weich, hautfreundliche Tinten",
      p_cp_title: "Baumwoll‑Cap",
      p_cp_desc: "Logo‑Stick, Einheitsgröße",
      p_bg_title: "Stofftasche",
      p_bg_desc: "Robuste Nähte, perfekt für Logos",

      c_white: "Weiß",
      c_black: "Schwarz",
      c_navy: "Navy",
      c_grey: "Grau",
      c_grey_melange: "Mélange‑Grau",
      c_green: "Tannengrün",
      c_pink: "Rosa",
      c_sky: "Himmelblau",
      c_beige: "Beige",
      c_olive: "Oliv",

      color: "Farbe",
      size: "Größe",
      qty: "Menge",
      add_to_cart: "In den Warenkorb",
      subtotal: "Zwischensumme",
      remove: "Entfernen",
      empty_cart: "Dein Warenkorb ist leer.",
      checkout_name: "Vorname",
      checkout_family: "Nachname",
      checkout_phone: "Telefon",
      checkout_addr: "Adresse",
      checkout_note: "Bestellhinweis (optional)",
      checkout_submit: "Bestellung aufgeben",
      price_suffix: "€",

      garment_type: "Produkt",
      print_tech: "Drucktechnik",
      garment_tshirt: "T‑Shirt",
      garment_hoodie: "Hoodie",
      garment_polo: "Polo",
      tech_dtg: "DTG",
      tech_screen: "Siebdruck",
      tech_emb: "Stickerei",
      text_on_garment: "Text auf dem Produkt (optional)",
      upload_label: "Logo/Bild hochladen (PNG/SVG)",
      est_price: "Preis (geschätzt)",
      add_to_cart_short: "In den Warenkorb",

      about_blurb:
        "Individueller Textildruck – T‑Shirts, Hoodies, Polos, Caps & Stofftaschen. Profi‑Qualität, faire Preise.",
      contact_whatsapp: "WhatsApp:",
      contact_email: "E‑Mail:",
      contact_address: "Adresse:",
    },
  };
  return (key) => dict[lang][key];
}

function Header({ t, onOpenCart, cartCount, lang, setLang }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-extrabold text-xl">
          <Logo />
          <span>{t("brand")}</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#shop" className="hover:text-emerald-700">{t("nav_products")}</a>
          <a href="#custom" className="hover:text-emerald-700">{t("nav_custom")}</a>
          <a href="#pricing" className="hover:text-emerald-700">{t("nav_pricing")}</a>
          <a href="#faq" className="hover:text-emerald-700">{t("nav_faq")}</a>
        </nav>
        <div className="flex items-center gap-3">
          <select
            value={lang}
            onChange={(e)=>setLang(e.target.value)}
            className="rounded-xl border border-neutral-300 bg-white px-3 py-2"
            aria-label="Language"
          >
            <option value="en">EN</option>
            <option value="de">DE</option>
          </select>
          <a
            href="#custom"
            className="hidden sm:inline-flex px-3 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-100"
          >
            {t("start_order")}
          </a>
          <button
            onClick={onOpenCart}
            className="relative rounded-xl px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {t("cart")}
            {cartCount > 0 && (
              <span className="absolute -top-2 -left-2 text-xs bg-white text-emerald-700 border border-emerald-600 rounded-full px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ t, onOpenCustomizer }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-white to-white" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row gap-10 items-center">
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            {t("hero_title")}<span className="text-emerald-700">{t("hero_title_span")}</span>
          </h1>
          <p className="mt-4 text-neutral-700 md:text-lg leading-relaxed">
            {t("hero_desc")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onOpenCustomizer}
              className="px-5 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 shadow"
            >
              {t("btn_design_now")}
            </button>
            <a href="#shop" className="px-5 py-3 rounded-2xl border border-neutral-300 hover:bg-neutral-100">
              {t("btn_view_products")}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-neutral-600">
            <Badge text={t("badge_ship")} />
            <Badge text={t("badge_group")} />
            <Badge text={t("badge_support")} />
          </div>
        </div>
        <div className="flex-1">
          <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1520975954732-35dd222996a3?q=80&w=1400&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt="Custom apparel"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, onAdd, t }) {
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col">
      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <img src={product.img} alt={product.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-lg font-bold">{product.title}</h4>
            <p className="text-sm text-neutral-600">{product.desc}</p>
          </div>
          <div className="text-left font-extrabold text-emerald-700">{product.price} {t("price_suffix")}</div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <select value={color} onChange={(e) => setColor(e.target.value)} className="rounded-xl border px-3 py-2">
            <option value="">{t("color")}</option>
            {product.colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select value={size} onChange={(e) => setSize(e.target.value)} className="rounded-xl border px-3 py-2">
            <option value="">{t("size")}</option>
            {product.sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-xl border hover:bg-neutral-50"
              aria-label="decrease"
            >
              −
            </button>
            <span className="w-10 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 rounded-xl border hover:bg-neutral-50"
              aria-label="increase"
            >
              +
            </button>
          </div>
          <button
            onClick={() => onAdd(product, color, size, qty)}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {t("add_to_cart")}
          </button>
        </div>
      </div>
    </div>
  );
}

function PriceCard({ t, title, price, items }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col">
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <div className="text-3xl font-extrabold text-emerald-700">{t("price_suffix")} {price}</div>
      <ul className="mt-4 text-neutral-700 space-y-2">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2">
            <span className="mt-1 inline-block w-2 h-2 rounded-full bg-emerald-600" /> {it}
          </li>
        ))}
      </ul>
      <a href="#custom" className="mt-6 inline-block text-center px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-100">
        {t("start_order")}
      </a>
    </div>
  );
}

function FAQ({ t }) {
  const faqs = [
    { q: t("faq_1_q"), a: t("faq_1_a") },
    { q: t("faq_2_q"), a: t("faq_2_a") },
    { q: t("faq_3_q"), a: t("faq_3_a") },
    { q: t("faq_4_q"), a: t("faq_4_a") },
  ];
  return (
    <div className="divide-y rounded-2xl border bg-white">
      {faqs.map((f, i) => (
        <details key={i} className="group p-4 open:bg-emerald-50/40">
          <summary className="cursor-pointer flex items-center justify-between">
            <span className="font-bold">{f.q}</span>
            <span className="text-neutral-500 group-open:rotate-180 transition">⌃</span>
          </summary>
          <p className="mt-2 text-neutral-700 leading-relaxed">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

function Footer({ t }) {
  return (
    <footer className="border-t bg-white/70 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-xl mb-2">
            <Logo />
            {t("brand")}
          </div>
          <p className="text-neutral-600 text-sm leading-relaxed">
            {t("about_blurb")}
          </p>
        </div>
        <div>
          <h5 className="font-bold mb-3">{t("links_title")}</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="#shop" className="hover:text-emerald-700">{t("links_products")}</a></li>
            <li><a href="#custom" className="hover:text-emerald-700">{t("links_custom")}</a></li>
            <li><a href="#pricing" className="hover:text-emerald-700">{t("links_pricing")}</a></li>
            <li><a href="#faq" className="hover:text-emerald-700">{t("links_faq")}</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-3">{t("contact_title")}</h5>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>{t("contact_whatsapp")} 0700 000 000</li>
            <li>{t("contact_email")} hello@nurinprint.example</li>
            <li>{t("contact_address")} Berlin, DE</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-neutral-500 py-4">© {new Date().getFullYear()} Nurin Print • All rights reserved</div>
    </footer>
  );
}

function Badge({ text }) {
  return <span className="text-xs px-3 py-1 rounded-full border bg-white">{text}</span>;
}

function Logo() {
  return (
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-600 text-white shadow">
      NP
    </span>
  );
}

function CartDrawer({ t, items, onClose, onRemove, onQty, total }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-full sm:w-[460px] bg-white shadow-2xl p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold">{t("cart")}</h4>
          <button onClick={onClose} className="rounded-xl border px-3 py-1">Close</button>
        </div>
        {items.length === 0 ? (
          <p className="text-neutral-600">{t("empty_cart")}</p>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.key} className="flex gap-3 border rounded-xl p-3">
                <img src={it.img} alt={it.title} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold">{it.title}</div>
                      <div className="text-xs text-neutral-600">{t("color")}: {it.color} • {t("size"):} {it.size}</div>
                    </div>
                    <button onClick={() => onRemove(it.key)} className="text-sm text-red-600 hover:underline">{t("remove")}</button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded border" onClick={() => onQty(it.key, it.qty - 1)}>−</button>
                      <span className="w-8 text-center">{it.qty}</span>
                      <button className="w-8 h-8 rounded border" onClick={() => onQty(it.key, it.qty + 1)}>+</button>
                    </div>
                    <div className="font-bold">{it.price * it.qty} {t("price_suffix")}</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="font-bold">{t("subtotal")}</div>
              <div className="text-emerald-700 font-extrabold">{total} {t("price_suffix")}</div>
            </div>
            <CheckoutForm t={t} total={total} />
          </div>
        )}
      </div>
    </div>
  );
}

function CheckoutForm({ t, total }) {
  return (
    <form className="mt-4 space-y-3" onSubmit={(e)=>{e.preventDefault(); alert("Demo order submitted. We'll contact you shortly.");}}>
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder={t("checkout_name")} className="rounded-xl border px-3 py-2" />
        <input required placeholder={t("checkout_family")} className="rounded-xl border px-3 py-2" />
      </div>
      <input required type="tel" placeholder={t("checkout_phone")} className="w-full rounded-xl border px-3 py-2" />
      <input required placeholder={t("checkout_addr")} className="w-full rounded-xl border px-3 py-2" />
      <textarea placeholder={t("checkout_note")} className="w-full rounded-xl border px-3 py-2" />
      <button type="submit" className="w-full px-4 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
        {t("checkout_submit")} ({total} {t("price_suffix")})
      </button>
    </form>
  );
}

function Customizer({ t, onClose, onAdded }) {
  const [garment, setGarment] = useState(t("garment_tshirt"));
  const [tech, setTech] = useState(t("tech_dtg"));
  const [color, setColor] = useState(t("c_white"));
  const [size, setSize] = useState("M");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const basePrice = garment === t("garment_hoodie") ? 89 : garment === t("garment_polo") ? 59 : 35;
  const techAdd = tech === t("tech_emb") ? 15 : tech === t("tech_screen") ? 7 : 12;
  const price = basePrice + techAdd;

  function handleAdd() {
    onAdded({
      key: `custom-${Date.now()}`,
      id: `custom-${garment}`,
      title: `${garment} (${tech})`,
      color,
      size,
      price,
      qty: 1,
      img:
        "https://images.unsplash.com/photo-1520975954732-35dd222996a3?q=80&w=1200&auto=format&fit=crop",
    });
    alert("Added to cart.");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-bold">{t("custom_title")}</h4>
          <button onClick={onClose} className="rounded-xl border px-3 py-1">Close</button>
        </div>
        <div className="p-4 grid md:grid-cols-2 gap-6">
          <div>
            <div className="aspect-square rounded-2xl border overflow-hidden bg-neutral-50 relative">
              <img
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1400&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Preview"
              />
              {text && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="px-3 py-1 rounded-lg bg-white/80 border text-sm font-bold">{text}</div>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-neutral-600">*{t("alt_custom")}</p>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Select label={t("garment_type")} value={garment} onChange={setGarment} options={[t("garment_tshirt"), t("garment_hoodie"), t("garment_polo")]} />
              <Select label={t("print_tech")} value={tech} onChange={setTech} options={[t("tech_dtg"), t("tech_screen"), t("tech_emb")]} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select label={t("color")} value={color} onChange={setColor} options={[t("c_white"), t("c_black"), t("c_grey"), t("c_navy")]} />
              <Select label={t("size")} value={size} onChange={setSize} options={["S", "M", "L", "XL"]} />
            </div>
            <div>
              <label className="text-sm font-bold">{t("text_on_garment")}</label>
              <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="TEAM 2025"
                     className="mt-1 w-full rounded-xl border px-3 py-2"/>
            </div>
            <div>
              <label className="text-sm font-bold">{t("upload_label")}</label>
              <input type="file" accept="image/*,.svg" onChange={(e)=>setFile(e.target.files?.[0]||null)}
                     className="mt-1 w-full rounded-xl border px-3 py-2"/>
              {file && <div className="text-xs text-neutral-600 mt-1">File: {file.name}</div>}
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-neutral-700">{t("est_price")}:</div>
              <div className="text-2xl font-extrabold text-emerald-700">{price} {t("price_suffix")}</div>
            </div>
            <button onClick={handleAdd} className="w-full px-4 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
              {t("add_to_cart_short")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm font-bold">{label}</label>
      <select value={value} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2">
        {options.map((o)=> <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
