import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import "@/app/globals.css";
import { content } from "@/lib/content";
import { isLocale, locales } from "@/lib/i18n";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff5a36",
  colorScheme: "light",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const copy = content[locale];
  const url = `https://swiftxpress.ca/${locale}`;

  return {
    metadataBase: new URL("https://swiftxpress.ca"),
    title: copy.meta.title,
    description: copy.meta.description,
    applicationName: "SwiftXpress",
    authors: [{ name: "SwiftXpress", url: "https://swiftxpress.ca" }],
    creator: "SwiftXpress",
    publisher: "SwiftXpress",
    category: "Delivery service",
    alternates: {
      canonical: url,
      languages: {
        "fr-CA": "https://swiftxpress.ca/fr",
        "en-CA": "https://swiftxpress.ca/en",
        "x-default": "https://swiftxpress.ca/fr",
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: "SwiftXpress",
      title: copy.meta.title,
      description: copy.meta.description,
      locale: locale === "fr" ? "fr_CA" : "en_CA",
      alternateLocale: locale === "fr" ? ["en_CA"] : ["fr_CA"],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.meta.title,
      description: copy.meta.description,
    },
    icons: {
      icon: "/icon.svg",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale}>
      <body>
        <a className="skip-link" href="#main-content">
          {content[locale].skipLink}
        </a>
        {children}
      </body>
    </html>
  );
}
