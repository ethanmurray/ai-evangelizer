import type { NextConfig } from "next";
import { execSync } from "child_process";

let commitHash = "";
try {
  commitHash = execSync("git rev-parse --short HEAD").toString().trim();
} catch {
  // not in a git repo
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || "0.1.0",
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
    NEXT_PUBLIC_BUILD_COMMIT: commitHash,
  },
};

export default nextConfig;
