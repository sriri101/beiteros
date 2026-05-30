const IOS_URL = "https://apps.apple.com/app/beiter/id6765596572";
const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.beiteros.albaos";

export default function ChooseStore() {
  return (
    <div
      style={{ backgroundColor: "#111111", minHeight: "100vh" }}
      className="flex flex-col items-center justify-center px-6"
    >
      {/* Logo mark */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
          <rect width="52" height="52" rx="14" fill="#E31E24" />
          <text
            x="50%"
            y="54%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            fontFamily="Inter, sans-serif"
            fontWeight="800"
            fontSize="24"
          >
            B
          </text>
        </svg>
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "20px",
            letterSpacing: "2px",
          }}
        >
          BEITER
        </span>
      </div>

      {/* Headline */}
      <h1
        style={{
          color: "#FFFFFF",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: "26px",
          textAlign: "center",
          lineHeight: 1.25,
          marginBottom: "8px",
          letterSpacing: "-0.4px",
        }}
      >
        Download the Beiter app
      </h1>
      <p
        style={{
          color: "#777777",
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          textAlign: "center",
          marginBottom: "44px",
        }}
      >
        Select your platform below
      </p>

      {/* CTA buttons */}
      <div className="flex flex-col gap-4 w-full" style={{ maxWidth: "320px" }}>
        <a
          href={IOS_URL}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            backgroundColor: "#FFFFFF",
            color: "#111111",
            borderRadius: "14px",
            padding: "17px 20px",
            textDecoration: "none",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          <AppleIcon />
          Download on the App Store
        </a>

        <a
          href={ANDROID_URL}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            backgroundColor: "#E31E24",
            color: "#FFFFFF",
            borderRadius: "14px",
            padding: "17px 20px",
            textDecoration: "none",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          <PlayIcon />
          Get it on Google Play
        </a>
      </div>

      <p
        style={{
          color: "#333333",
          fontFamily: "Inter, sans-serif",
          fontSize: "13px",
          marginTop: "52px",
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} BEITER. All rights reserved.
      </p>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M16.112 11.55c-.02-2.17 1.77-3.22 1.85-3.27-1.01-1.48-2.58-1.68-3.13-1.7-1.33-.14-2.6.79-3.27.79-.68 0-1.72-.77-2.84-.75-1.46.02-2.8.85-3.55 2.16-1.52 2.63-.39 6.52 1.09 8.65.73 1.04 1.59 2.21 2.72 2.17 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.7.71 2.86.69 1.18-.02 1.93-1.06 2.65-2.11a9.5 9.5 0 0 0 1.2-2.44c-.03-.01-2.3-.88-2.34-3.48z"
        fill="currentColor"
      />
      <path
        d="M14.02 5.14c.6-.73 1.01-1.75.9-2.77-.87.04-1.92.58-2.54 1.3-.56.64-1.05 1.67-.92 2.65.97.07 1.96-.49 2.56-1.18z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M4 3.27v15.46L13.73 11 4 3.27z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M4 18.73 13.73 11 18 8.6 4 3.27"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M4 3.27 18 13.4l-4.27-2.4L4 18.73"
        fill="currentColor"
        opacity="0.25"
      />
    </svg>
  );
}
