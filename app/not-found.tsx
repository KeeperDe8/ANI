import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-24 text-center">
      <div className="inline-block w-20 h-20 rounded-full bg-panel grid place-items-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Not found</h1>
      <p className="text-muted mb-8 max-w-md mx-auto">
        That anime or episode doesn't exist — or our provider couldn't find it.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-accent hover:bg-accentHover text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-lg shadow-accent/30"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back home
      </Link>
    </div>
  );
}
