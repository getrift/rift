import type { ReactNode } from "react";

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="-m-2 flex h-10 w-10 items-center justify-center text-ink-faint transition-colors duration-150 hover:text-ink-muted"
    >
      {children}
    </a>
  );
}

/* Shared site footer. `containerClass` lets each page align it to its own
   content column (full-bleed on the home hero, the article column on
   about/privacy) so the nav and footer share one width. */
export default function SiteFooter({ containerClass = "px-6 sm:px-10" }: { containerClass?: string }) {
  return (
    <footer
      className={`relative z-10 mx-auto flex w-full flex-col gap-4 py-7 text-[12px] text-ink-faint sm:flex-row sm:items-center sm:justify-between ${containerClass}`}
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span>© {new Date().getFullYear()} Rift</span>
        {/* Billing has to be reachable from anywhere: "cancel anytime" is only
            true if a returning subscriber can find cancellation without an email. */}
        <a href="/billing" className="transition-colors hover:text-ink-muted">
          Billing
        </a>
        <a href="/terms" className="transition-colors hover:text-ink-muted">
          Terms
        </a>
        <a href="/refunds" className="transition-colors hover:text-ink-muted">
          Refunds
        </a>
      </div>
      <div className="flex items-center gap-6">
        <SocialLink href="https://x.com/clementrog" label="Clément on X">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </SocialLink>
        <SocialLink href="https://www.linkedin.com/in/clementrog" label="Clément on LinkedIn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
          </svg>
        </SocialLink>
      </div>
    </footer>
  );
}
