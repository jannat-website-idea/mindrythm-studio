import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  serverExternalPackages: ["nodemailer"],
};

export default nextConfig;
