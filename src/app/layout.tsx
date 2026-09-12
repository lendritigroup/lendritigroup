import type { Metadata } from "next";
import { Barlow_Condensed, Source_Sans_3 } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { COMPANY } from "@/lib/company";
import "./globals.css";

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Lendriti Group SHPK | Heavy Machinery Trading",
    template: "%s | Lendriti Group SHPK",
  },
  description:
    "Professional European dealer of excavators, trucks and heavy machinery. Lendriti Group SHPK, Mitrovicë, Kosovo.",
  metadataBase: new URL("https://lendritigroup.com"),
  openGraph: {
    title: "Lendriti Group SHPK",
    description: "Excavators, trucks and heavy machinery trading.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} font-sans`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: COMPANY.name,
              telephone: COMPANY.phone,
              email: COMPANY.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: COMPANY.addressLines[0],
                addressLocality: "Mitrovicë",
                postalCode: "40000",
                addressCountry: "XK",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
