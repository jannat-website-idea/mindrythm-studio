import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = process.env.VERCEL
  ? {
      // The primary Sites build receives `cloudflare:workers` from Wrangler.
      // Vercel runs the same app on Node, so resolve that binding to an empty
      // env; the content layer then uses the bundled portfolio content.
      turbopack: {
        resolveAlias: {
          "cloudflare:workers": "./lib/cloudflare-workers-shim.ts",
        },
      },
      webpack(config) {
        config.resolve.alias["cloudflare:workers"] = path.resolve(
          process.cwd(),
          "lib/cloudflare-workers-shim.ts",
        );
        return config;
      },
    }
  : {
      // Sites/Cloudflare supplies its own worker bindings through Wrangler.
    };

export default nextConfig;
