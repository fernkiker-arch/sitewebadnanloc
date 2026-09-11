import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://swiftxpress.ca/fr",
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          "fr-CA": "https://swiftxpress.ca/fr",
          "en-CA": "https://swiftxpress.ca/en",
        },
      },
    },
    {
      url: "https://swiftxpress.ca/en",
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          "fr-CA": "https://swiftxpress.ca/fr",
          "en-CA": "https://swiftxpress.ca/en",
        },
      },
    },
  ];
}
