export const config = { runtime: "edge" };

const IOS_URL = "https://apps.apple.com/app/beiter/id6765596572";
const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.beiteros.albaos";

export default function handler(request: Request): Response {
  const ua = request.headers.get("user-agent")?.toLowerCase() ?? "";
  const platform =
    request.headers.get("sec-ch-ua-platform")?.toLowerCase() ?? "";

  // Android
  if (
    platform === '"android"' ||
    platform === "android" ||
    ua.includes("android")
  ) {
    return Response.redirect(ANDROID_URL, 302);
  }

  // iOS
  if (
    platform === '"ios"' ||
    platform === "ios" ||
    ua.includes("iphone") ||
    ua.includes("ipad") ||
    ua.includes("ipod")
  ) {
    return Response.redirect(IOS_URL, 302);
  }

  // Unknown device — branded chooser
  const origin = new URL(request.url).origin;
  return Response.redirect(`${origin}/choose-store`, 302);
}
