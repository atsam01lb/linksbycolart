/* ===========================================
   COLART LINKS — CLIENT DIRECTORY DATA
   Feeds the main directory page (index.html).

   Each profile lives in its own folder with its own files:
     /<slug>/index.html      the profile page
     /<slug>/style.css       the profile's own styling
     /<slug>/assets/         the profile's own assets (logo.svg, images…)

   To add a new client:
   1. Duplicate any profile folder (e.g. /josephfarah) and rename it to the new slug.
   2. Edit the name/category in <slug>/index.html, the accent in <slug>/style.css,
      and replace <slug>/assets/logo.svg with the client's logo.
   3. Add an entry to the list below.

   Fields:
   slug      folder name → links.colartdigitalmarketingagency.com/<slug>/
   name      Display name
   nameAr    Optional Arabic name (shown + searchable)
   category  Short description / category
   logo      Optional. Defaults to <slug>/assets/logo.svg
   logoFit   "cover" (default, fills the circle) or "contain" (logo with padding)
   accent    Optional: teal | mint | magenta | yellow | lime | purple
             (auto-assigned from the Colart palette if omitted)
=========================================== */

window.COLART_CLIENTS = [
  {
    slug: "colart",
    name: "Colart",
    category: "Digital Marketing Agency",
    logoFit: "contain",
    accent: "purple"
  },
  {
    slug: "delarabitar",
    name: "Delara Bitar",
    category: "Tattoo & Art Studio",
    logo: "assets/delara-bitar-logo.svg",
    logoFit: "contain",
    accent: "magenta"
  },
  {
    slug: "nakhakhasa",
    name: "Nakha Khasa",
    nameAr: "نكهة خاصة",
    category: "Restaurant & Café",
    logoFit: "contain",
    accent: "lime"
  },
  {
    slug: "abouhamzerestaurant",
    name: "Abou Hamze Restaurant",
    nameAr: "مطعم أبو حمزة",
    category: "Restaurant",
    accent: "teal"
  },
  {
    slug: "josephfarah",
    name: "Joseph Farah",
    category: "Beauty & Personal Care",
    logoFit: "contain",
    accent: "mint"
  },
  {
    slug: "relaxtime",
    name: "Relax Time",
    category: "Trading · Gold, Forex & Bitcoin",
    logoFit: "contain",
    accent: "yellow"
  },
  {
    slug: "samelhindy",
    name: "Sam El Hindy",
    category: "Creative Strategist & Entrepreneur",
    logoFit: "cover",
    accent: "purple"
  },
  {
    slug: "kabis",
    name: "Kabis",
    category: "Content Creator",
    logoFit: "cover",
    accent: "purple"
  }
];
