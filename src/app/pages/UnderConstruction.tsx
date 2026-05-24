import svgPaths from "../../imports/BeiterDistAppCopy/svg-9mnkqkgciw";

function ConstructionIcon() {
  return (
    <div className="relative shrink-0" style={{ width: 48, height: 48 }}>
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 47.9972 47.9972"
      >
        <g>
          <path
            d={svgPaths.p3ca8fc70}
            stroke="#E31E24"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.99982"
          />
          <path
            d="M33.998 27.9983V41.9975"
            stroke="#E31E24"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.99982"
          />
          <path
            d="M13.9992 27.9983V41.9975"
            stroke="#E31E24"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.99982"
          />
          <path
            d="M33.998 5.99964V11.9993"
            stroke="#E31E24"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.99982"
          />
          <path
            d="M13.9992 5.99964V11.9993"
            stroke="#E31E24"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.99982"
          />
          <path
            d={svgPaths.p2a55eb80}
            stroke="#E31E24"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.99982"
          />
          <path
            d={svgPaths.pce3b180}
            stroke="#E31E24"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.99982"
          />
          <path
            d={svgPaths.p3d726280}
            stroke="#E31E24"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.99982"
          />
        </g>
      </svg>
    </div>
  );
}

export default function UnderConstruction() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full"
      style={{ backgroundColor: "#111111" }}
    >
      <div className="flex flex-col items-center gap-6 px-6 max-w-md w-full text-center">
        {/* Icon container */}
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 96, height: 96, backgroundColor: "#1A1A1A" }}
        >
          <ConstructionIcon />
        </div>

        {/* Title */}
        <h1
          className="text-white tracking-[0.96px] uppercase"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 24, lineHeight: "32px" }}
        >
          Distributor Portal
        </h1>

        {/* Description */}
        <div className="flex flex-col gap-3">
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: "22.75px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            The Distributor Portal is currently under construction and temporarily unavailable.
          </p>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: "22.75px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            We're working hard to bring you an enhanced experience. Please check back soon.
          </p>
        </div>

        {/* Back to landing */}
        <a
          href="/"
          className="mt-4 inline-flex items-center gap-2 text-sm"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            color: "#E31E24",
          }}
        >
          ← Back to BeiterOS
        </a>
      </div>
    </div>
  );
}
