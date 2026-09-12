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
