import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../site-nav";
import { RiftMark } from "../rift-logo";
import { socialMeta } from "../seo";

const description =
  "Rift resolves an answer from your past conversations across every tool, not a stale doc or a pile of RAG passages. Examples for developers, designers, marketers, founders, PMs, and more.";

export const metadata: Metadata = {
  title: "Examples",
  description,
  ...socialMeta({
    title: "Rift examples, a shared memory for every kind of work",
    description,
    path: "/examples",
  }),
};

type Source = { tool: string; date: string };

type Persona = {
  slug: string;
  role: string; // SEO keyword heading
  value: string; // the payoff, short
  askedIn: string; // the tool the question is typed into
  query: string; // one real ask
  served: string; // the reconciled decision + reason Rift surfaces
  sources: Source[]; // the conversations Rift resolved it from (across tools and time)
};

/* Each example is one reconciled answer: a question asked in one tool, answered
   with a decision Rift pieced together from several past conversations in other
   tools, including which version is current. That synthesis is the thing a doc,
   a copy-paste, RAG, or a graph DB cannot do. Keep `served` to the decision and
   its reason; the provenance lives in `sources`. */
const PERSONAS: Persona[] = [
  {
    slug: "developers",
    role: "Developers & engineers",
    value: "Every agent already knows your stack.",
    askedIn: "Codex",
    query: "Add the invoice-retry migration for billing_events.",
    served:
      "You changed course on Mar 20: append-only billing_events_v2, not the ALTER you first planned, after it locked checkout for 38 seconds. It keys on month, because finance reconciles monthly.",
    sources: [
      { tool: "Claude Code", date: "Mar 12" },
      { tool: "Cursor", date: "Mar 20" },
    ],
  },
  {
    slug: "designers",
    role: "Product & UX designers",
    value: "Agents draft in your system, not a generic one.",
    askedIn: "Claude",
    query: "Design an empty state for the inbox.",
    served:
      "Empty states use an 8px radius, no illustrations, and one inline action. You cut the mascots in the v3 audit, because they made operational screens feel like a toy.",
    sources: [
      { tool: "Cursor", date: "Apr 3" },
      { tool: "ChatGPT", date: "Apr 11" },
    ],
  },
  {
    slug: "marketers",
    role: "Marketers",
    value: "One brand voice across every tool.",
    askedIn: "ChatGPT",
    query: "Write the launch email for v2.",
    served:
      "You picked the cost-of-context angle over privacy-first, after the Q1 “stop re-explaining yourself” line underperformed. Do not reopen it, and avoid the word unleash.",
    sources: [
      { tool: "Claude", date: "Apr 18" },
      { tool: "ChatGPT", date: "Mar 30" },
    ],
  },
  {
    slug: "founders",
    role: "Founders & solo operators",
    value: "The context only you hold, written down.",
    askedIn: "Claude",
    query: "Draft June's investor update.",
    served:
      "Open with the Nimbus and Heliotrope deals that slipped, do not bury them. April promised the enterprise tier by June at 14% MoM, so leading with the misses is what keeps it honest.",
    sources: [
      { tool: "ChatGPT", date: "May 2" },
      { tool: "Cursor", date: "Apr 26" },
    ],
  },
  {
    slug: "personal",
    role: "Personal & chief-of-staff agents",
    value: "Your assistant knows your whole life.",
    askedIn: "Claude",
    query: "Book my usual for the SF trip.",
    served:
      "The Marker, not the W. Aisle seat, no red-eyes. Keep Tuesday evening clear, because the 6pm SFO flight made you miss standup last time.",
    sources: [
      { tool: "ChatGPT", date: "Jun 9" },
      { tool: "ChatGPT", date: "May 14" },
    ],
  },
  {
    slug: "product-managers",
    role: "Product managers",
    value: "Every decision and its reason, one query away.",
    askedIn: "ChatGPT",
    query: "Draft the PRD for saved views.",
    served:
      "Saved views were cut in Q1 because permissions were still row-level, not for lack of demand. That blocker shipped last week, and Northstar and Beamly have both asked again since.",
    sources: [
      { tool: "Claude Code", date: "Jun 1" },
      { tool: "Cursor", date: "May 22" },
    ],
  },
  {
    slug: "writers",
    role: "Writers & content creators",
    value: "Drafts pick up your voice, not a template.",
    askedIn: "Claude",
    query: "Outline a post on local-first apps.",
    served:
      "Use the angle you have not run yet: sync conflict as a UX problem, not a data one. You already published the privacy argument, so do not repeat it.",
    sources: [
      { tool: "ChatGPT", date: "May 20" },
      { tool: "Claude", date: "Apr 12" },
    ],
  },
  {
    slug: "researchers",
    role: "Researchers & analysts",
    value: "Agents build on your findings, not a blank page.",
    askedIn: "ChatGPT",
    query: "Summarize what we know on context retention.",
    served:
      "You ruled out Chen 2021, because n=12 and the scores were self-reported. Okafor 2023 stayed in, because it replicated on real task logs. The dosing question is still open.",
    sources: [
      { tool: "Claude", date: "Feb 27" },
      { tool: "Claude", date: "Jan 30" },
    ],
  },
  {
    slug: "data",
    role: "Data scientists & analysts",
    value: "The next analysis stays consistent.",
    askedIn: "Claude Code",
    query: "Build a churn query.",
    served:
      "Churn excludes trialists, to match the board dashboard. The warehouse active_users table counts them, so a raw query overstates May churn by about 2.6 points.",
    sources: [
      { tool: "Cursor", date: "Apr 9" },
      { tool: "Claude", date: "Mar 28" },
    ],
  },
  {
    slug: "consultants",
    role: "Consultants & freelancers",
    value: "Every client's context, never mixed up.",
    askedIn: "ChatGPT",
    query: "Draft Friday's update for Acme.",
    served:
      "Acme wants five Slack lines by 4pm Friday, never a deck. Frame the API audit as in-scope, because anything that reads as scope creep is what stalled Marta last time.",
    sources: [
      { tool: "Claude", date: "Jun 6" },
      { tool: "Claude", date: "May 23" },
    ],
  },
  {
    slug: "sales",
    role: "Sales",
    value: "Walk into every account fully prepped.",
    askedIn: "Claude",
    query: "Prep me for the Globex renewal.",
    served:
      "The SOC 2 blocker is stale. Dana left in March and Raj owns it now, reporting to CFO Priya, so lead with the $42k support overage, not the security deck.",
    sources: [
      { tool: "ChatGPT", date: "Jun 9" },
      { tool: "ChatGPT", date: "Apr 17" },
    ],
  },
  {
    slug: "students",
    role: "Students & lifelong learners",
    value: "Agents teach on top of what you know.",
    askedIn: "Claude",
    query: "Help me revise for the linear algebra final.",
    served:
      "Eigenvalues clicked for you as “stretch directions,” not determinants. You lost marks on diagonalization in Quiz 4, because you skipped the basis-change step, so start there.",
    sources: [
      { tool: "ChatGPT", date: "May 31" },
      { tool: "ChatGPT", date: "Apr 20" },
    ],
  },
];

/* What the alternatives give you instead. Names the enemy plainly (per the
   product's thesis): a doc, copy-paste, RAG, a graph DB. */
const ALTERNATIVES: [string, string][] = [
  ["a markdown file", "goes stale the day after you write it, if you remember it exists"],
  ["copy-paste", "carries the text between tools but drops the reason behind it"],
  ["RAG", "returns passages that match your words, not the decision you reached"],
  ["a graph database", "only knows what you modeled into it up front"],
];

function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0 text-ink-faint"
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function NotThis() {
  return (
    <section className="mt-10 rounded-[14px] border border-white/[0.07] bg-white/[0.015] p-6 sm:p-7">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
        Why not a doc, copy-paste, or RAG
      </p>
      <ul className="mt-4 divide-y divide-white/[0.06]">
        {ALTERNATIVES.map(([k, v]) => (
          <li
            key={k}
            className="flex flex-col gap-0.5 py-2.5 text-[13.5px] sm:grid sm:grid-cols-[170px_1fr] sm:gap-4"
          >
            <span className="font-mono text-ink-subtle">{k}</span>
            <span className="leading-snug text-ink-faint">{v}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[14.5px] leading-[1.6] text-ink-muted">
        Rift keeps the decision, the reason, and which version is current. It resolves the answer from your
        past conversations and serves it to whatever agent you are working in.
      </p>
    </section>
  );
}

function ProfileRow({ p, index }: { p: Persona; index: number }) {
  return (
    <article
      id={p.slug}
      className="ex-row -mx-5 grid scroll-mt-24 gap-x-10 gap-y-4 border-t border-white/[0.06] px-5 py-8 sm:py-9 md:grid-cols-[minmax(0,300px)_1fr]"
    >
      {/* left: the scan anchors */}
      <div>
        <span className="ex-index font-mono text-[11px] tabular-nums text-ink-faint">
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="mt-2 text-[18px] font-semibold leading-snug tracking-tight text-ink">{p.role}</h2>
        <p className="mt-1.5 text-[14px] leading-snug text-ink-subtle">{p.value}</p>
      </div>

      {/* right: a question asked in one tool, answered from conversations in others */}
      <div className="min-w-0">
        <div className="flex items-center gap-2.5 rounded-[9px] border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5">
          <Chevron />
          <span className="min-w-0 flex-1 truncate text-[13px] leading-snug text-ink-muted">{p.query}</span>
          <span className="flex-shrink-0 rounded-[5px] border border-white/[0.09] px-1.5 py-px font-mono text-[10px] leading-[16px] text-ink-faint">
            {p.askedIn}
          </span>
        </div>

        <p className="mt-3.5 max-w-[56ch] text-[14px] leading-[1.62] text-ink-muted">{p.served}</p>

        <div className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="inline-flex items-center gap-1.5">
            <RiftMark size={11} className="flex-shrink-0 text-ink-subtle" />
            <span className="font-mono text-[10px] uppercase tracking-[0.09em] text-ink-faint">
              resolved from {p.sources.length} conversations
            </span>
          </span>
          {p.sources.map((s) => (
            <span
              key={s.tool + s.date}
              className="rounded-[5px] border border-white/[0.07] px-1.5 py-px font-mono text-[10px] text-ink-faint"
            >
              {s.tool} · {s.date}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-canvas font-sans text-ink antialiased">
      <SiteNav containerClass="max-w-[940px] px-6 sm:px-10" />

      <div className="mx-auto max-w-[940px] px-6 py-16 sm:px-10 sm:py-24">
        <header className="max-w-[660px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">Examples</p>
          <h1 className="mt-4 text-[40px] font-semibold leading-[1.04] tracking-[-0.025em] text-ink sm:text-[52px]">
            One memory. Every kind of work.
          </h1>
          <p className="mt-5 text-[17px] leading-[1.6] text-ink-subtle">
            Rift captures the conversations you already have with your agents and keeps the decisions, not
            just the words. A question you ask in one tool is answered with what you settled across several
            others, the context a doc would have lost and your other tools never saw.
          </p>
        </header>

        <NotThis />

        {/* jump links — internal linking + quick navigation; landing lifts the row */}
        <nav aria-label="Jump to a profile" className="mt-12 flex flex-wrap gap-2">
          {PERSONAS.map((p) => (
            <a
              key={p.slug}
              href={`#${p.slug}`}
              className="rounded-full border border-white/[0.07] bg-white/[0.015] px-3 py-1.5 text-[12px] text-ink-subtle transition-colors hover:border-white/[0.18] hover:text-ink"
            >
              {p.role}
            </a>
          ))}
        </nav>

        <div className="mt-8">
          {PERSONAS.map((p, i) => (
            <ProfileRow key={p.slug} p={p} index={i + 1} />
          ))}
        </div>

        <section className="mt-16 overflow-hidden rounded-[16px] border border-white/[0.08] bg-white/[0.02] px-7 py-10 text-center sm:py-14">
          <RiftMark size={26} className="mx-auto text-ink opacity-90" />
          <h2 className="mt-5 text-[24px] font-semibold tracking-tight text-ink sm:text-[28px]">
            Your work is the example.
          </h2>
          <p className="mx-auto mt-3 max-w-[500px] text-[15.5px] leading-[1.6] text-ink-subtle">
            Whatever you do all day, you are already deciding things in one tool and re-explaining them in the
            next. Rift resolves them once.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-[44px] items-center rounded-[10px] bg-ink px-5 text-[14px] font-semibold text-canvas transition-shadow duration-150 hover:shadow-[0_10px_30px_-16px_rgba(255,255,255,0.4)]"
            >
              Get Rift
            </Link>
            <Link
              href="/about"
              className="inline-flex h-[44px] items-center rounded-[10px] border border-white/[0.1] px-5 text-[14px] text-ink-subtle transition-colors hover:border-white/[0.22] hover:text-ink"
            >
              How Rift works
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
