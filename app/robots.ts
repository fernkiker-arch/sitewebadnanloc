import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://swiftxpress.ca/sitemap.xml",
    host: "https://swiftxpress.ca",
  };
}
