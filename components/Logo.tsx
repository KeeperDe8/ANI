import Link from "next/link";

export default function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const mark = size === "sm" ? 22 : 26;
  const inner = mark - 3;
  const text = size === "sm" ? "text-base" : "text-[17px]";
  return (
    <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
      <span
        className="relative grid place-items-center rounded-[7px]"
        style={{
          width: mark,
          height: mark,
          background: "conic-gradient(from 215deg at 50% 50%, #8b5cf6, #ec4899 50%, #8b5cf6)",
        }}
      >
        <span
          className="absolute rounded-[5.5px]"
          style={{ inset: 1.5, background: "#0b0b10" }}
        />
        <svg viewBox="0 0 24 24" width={11} height={11} className="relative">
          <polygon points="7,4 20,12 7,20" fill="#fff" />
        </svg>
      </span>
      <span className={`${text} leading-none`}>
        <span
          style={{
            background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Ani
        </span>
        <span className="text-white">Stream</span>
      </span>
    </Link>
  );
}
