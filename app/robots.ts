import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/api", "/auth", "/login", "/confirm"],
    },
    sitemap: "https://tigerkennhomes.com/sitemap.xml",
  };
}