import type { NextConfig } from "next";

const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const requestedBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath = isGithubPagesBuild ? (requestedBasePath || (repositoryName ? `/${repositoryName}` : "")) : "";

const deploymentConfig: Partial<NextConfig> = isGithubPagesBuild
  ? {
      output: "export",
      images: {
        unoptimized: true,
      },
      trailingSlash: true,
      ...(basePath
        ? {
            basePath,
            assetPrefix: `${basePath}/`,
          }
        : {}),
    }
  : {
      output: "standalone",
    };

const nextConfig: NextConfig = {
  ...deploymentConfig,
  serverExternalPackages: ["pdf-parse", "mammoth"],
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
