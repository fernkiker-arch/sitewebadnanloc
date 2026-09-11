import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SwiftXpress",
    short_name: "SwiftXpress",
    description:
      "Service de livraison et messagerie à Montréal et dans les environs.",
    start_url: "/fr",
    display: "standalone",
    background_color: "#f5f3ed",
    theme_color: "#ff5a36",
    lang: "fr-CA",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
