import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://swiftxpress.ca"),
  title: "SwiftXpress",
  description:
    "Service de livraison et messagerie à Montréal et dans les environs.",
};

export default function RootRedirectLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
