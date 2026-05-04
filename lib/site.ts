import { getPublicEnv } from "./env";

export function getSiteUrl() {
  const { NEXT_PUBLIC_SITE_URL } = getPublicEnv();
  return NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
}