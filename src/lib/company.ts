export const COMPANY = {
  name: "Lendriti Group SHPK",
  shortName: "Lendriti",
  legalName: "Lendriti Group SHPK",
  phone: "+383 49 272 125",
  phoneHref: "tel:+38349272125",
  whatsapp: "+383 44 272 125",
  whatsappHref: "https://wa.me/38344272125",
  email: "lendritigroupshpk@gmail.com",
  emailHref: "mailto:lendritigroupshpk@gmail.com",
  addressLines: ["Rruga Minatorët e Trepqës", "Mitrovicë, 40000", "Kosovë"],
  addressOneLine: "Rruga Minatorët e Trepqës, Mitrovicë, 40000, Kosovë",
  city: "Mitrovicë",
  country: "Kosovë",
  countryCode: "XK",
  germany: {
    label: "DE",
    phone: "+49 174 2462506",
    phoneHref: "tel:+491742462506",
    whatsapp: "+49 174 2462506",
    whatsappHref: "https://wa.me/491742462506",
  },
  social: {
    instagram: "https://www.instagram.com/lendritigroupshpk",
    facebook: "https://www.facebook.com/share/1UPuRYE91p/?mibextid=wwXIfr",
    tiktok: "https://www.tiktok.com/@lendritigroupshpk",
  },
} as const;

export const CATEGORY_SLUGS = {
  excavator: "excavators",
  truck: "trucks",
  other: "other-machinery",
} as const;

export type MachineCategory = keyof typeof CATEGORY_SLUGS;

export const CATEGORY_FROM_SLUG: Record<string, MachineCategory> = {
  excavators: "excavator",
  trucks: "truck",
  "other-machinery": "other",
};

export const LISTING_STATUSES = ["draft", "active", "reserved", "sold", "archived"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];
