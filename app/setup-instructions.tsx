import InstallCommand from "./install-command";

function SetupStep({ index, title, body }: { index: string; title: string; body: string }) {
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

/* Canonical post-signup instructions — install command + requirements + the
   first three steps. Single source of truth for the invite modal's success view
   AND the /welcome page (linked from the beta email), so they never drift. */
export default function SetupInstructions() {
  return (
    <div className="w-full text-left">
      <InstallCommand />
      <p className="mt-2 text-[12px] leading-[17px] text-ink-faint">Requires macOS 12.3+ and Node 20.19+.</p>
      <div className="mt-5 flex w-full flex-col gap-3.5 rounded-[14px] border border-white/[0.07] bg-white/[0.025] p-5">
        <SetupStep index="1" title="Run the installer" body="It walks you through local setup." />
        <SetupStep index="2" title="Import one export" body="Start with ChatGPT, Claude, Grok, or Gemini." />
        <SetupStep index="3" title="Search one decision" body="Connect agents after the archive is useful." />
      </div>
    </div>
  );
}
