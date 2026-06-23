import InstallCommand, { DownloadButton } from "./install-command";

/* Modal success copy only. /docs owns the full setup flow so onboarding does not
   drift between two maintained instruction blocks. */
export default function SetupInstructions() {
  return (
    <div className="w-full text-left">
      <DownloadButton />
      <p className="mt-4 mb-2 text-[12px] leading-[17px] text-ink-faint">
        Prefer the terminal, or on Intel? Run it yourself or hand it to your agent. macOS 12.3+, Node 20.19+.
      </p>
      <InstallCommand />

      <div className="mt-5 rounded-[14px] border border-white/[0.07] bg-white/[0.025] p-5">
        <p className="text-[13.5px] leading-[20px] text-ink-subtle">
          Finish setup in the docs. They walk through <span className="font-mono text-ink-muted">rift onboard</span>,
          connecting your agents, search that finds the idea when the words differ, and the common fixes.
        </p>
        <a
          href="/docs#welcome"
          className="mt-4 inline-flex h-10 items-center rounded-[10px] border border-white/[0.1] bg-white/[0.04] px-4 text-[13.5px] font-medium text-ink-bright transition-[background-color,color,transform] duration-150 hover:bg-white/[0.07] hover:text-ink active:scale-[0.96]"
        >
          Open docs
        </a>
      </div>
    </div>
  );
}
