const IOS_URL = "https://apps.apple.com/app/beiter/id6765596572";
const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.beiteros.albaos";

export const config = { matcher: ["/"] };

export default function middleware(request: Request): Response | undefined {
  const url = new URL(request.url);

  if (url.pathname !== "/") {
    return undefined;
  }

  const headers = request.headers;

  // Prefer the client-hint header (modern browsers send this)
  const platform = headers.get("sec-ch-ua-platform")?.toLowerCase() ?? "";

  if (platform === '"android"' || platform === "android") {
    return Response.redirect(ANDROID_URL, 302);
  }

  if (
    platform === '"ios"' ||
    platform === "ios" ||
    platform === '"iphone os"' ||
    platform === "iphone os"
  ) {
    return Response.redirect(IOS_URL, 302);
  }

  // Fall back to User-Agent parsing
  const ua = headers.get("user-agent")?.toLowerCase() ?? "";

  if (ua.includes("android")) {
    return Response.redirect(ANDROID_URL, 302);
  }

  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
    return Response.redirect(IOS_URL, 302);
  }

  // Unknown device — show branded chooser
  return Response.redirect(
    new URL("/choose-store", request.url).toString(),
    302
  );
}
