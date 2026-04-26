import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-bg">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accentDim grid place-items-center text-white font-bold shadow-lg shadow-accent/20">
                A
              </div>
              <span className="font-bold text-xl">
                <span className="text-white">Ani</span>
                <span className="text-accent">Stream</span>
              </span>
            </Link>
            <p className="text-2xl md:text-3xl font-bold leading-tight max-w-md">
              Trusted by millions, featuring the best updated anime from around the world.
            </p>
          </div>

          <div className="md:text-right">
            <div className="flex md:justify-end flex-wrap gap-x-6 gap-y-2 text-sm text-muted mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/search?q=trending" className="hover:text-white transition-colors">Discover</Link>
              <Link href="/search?q=new" className="hover:text-white transition-colors">New Releases</Link>
              <Link href="/search?q=popular" className="hover:text-white transition-colors">Popular</Link>
            </div>
            <div className="flex md:justify-end gap-3">
              <SocialBtn label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </SocialBtn>
              <SocialBtn label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </SocialBtn>
              <SocialBtn label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialBtn>
              <SocialBtn label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </SocialBtn>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
          <div className="flex flex-wrap gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Language</Link>
          </div>
          <div>© {new Date().getFullYear()} AniStream</div>
        </div>
      </div>
    </footer>
  );
}

function SocialBtn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      className="w-10 h-10 grid place-items-center rounded-full bg-panel border border-border hover:border-accent hover:text-accent text-muted transition-colors"
    >
      {children}
    </button>
  );
}
