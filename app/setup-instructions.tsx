import InstallCommand from "./install-command";

function SetupStep({ index, title, body }: { index: string; title: string; body: React.ReactNode }) {
  return (
    <div className="flex gap-3 text-left">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/[0.12] text-[11px] text-ink-muted">
        {index}
      </span>
      <span>
        <span className="block text-[13px] font-medium text-ink-bright">{title}</span>
        <span className="mt-0.5 block text-[12.5px] leading-[18px] text-ink-faint">{body}</span>
      </span>
    </div>
  );
}

/* Canonical setup, single source of truth for the invite modal's success view AND
   the /welcome page (linked from the beta email), so they never drift. Auto-capture
   is the model: install, then it just records — no "import one export" first step.
   ponytail: backfill stays a "reply and I'll set you up" until its real steps exist;
   don't invent a command here. */
export default function SetupInstructions() {
  return (
    <div className="w-full text-left">
      <InstallCommand />
      <p className="mt-2 text-[12px] leading-[17px] text-ink-faint">
        Run it in your terminal, or hand it to your agent and let it install. macOS 12.3+, Node 20.19+.
      </p>
      <div className="mt-5 flex w-full flex-col gap-3.5 rounded-[14px] border border-white/[0.07] bg-white/[0.025] p-5">
        <SetupStep
          index="1"
          title="It captures automatically"
          body="Your Claude Code, Codex, and Cursor sessions save to your local memory as you work. Nothing to import."
        />
        <SetupStep
          index="2"
          title="Point your agents at it"
          body={
            <>
              Add a line to your <span className="text-ink-muted">AGENTS.md</span> or{" "}
              <span className="text-ink-muted">CLAUDE.md</span> telling them to use Rift to recall past context
              before starting.
            </>
          }
        />
        <SetupStep
          index="3"
          title="Check it's connected"
          body={
            <>
              Run <span className="text-ink-muted">/mcp</span> in your agent and confirm “rift” shows up.
            </>
          }
        />
      </div>
      <p className="mt-4 text-[12.5px] leading-[18px] text-ink-faint">
        Want to bring in your older ChatGPT or Claude chats, or switch on semantic search? Reply to the email that
        sent you here and I&rsquo;ll set you up. Semantic search is on me during the beta.
      </p>
    </div>
  );
}
