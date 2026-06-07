"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RiftMark } from "./rift-logo";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Status = "idle" | "submitting" | "success" | "error";

export default function InviteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // focus the field, lock body scroll, trap focus, restore focus, close on ESC
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 70);

    const focusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (current === first || !dialogRef.current?.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      // restore focus to whatever opened the modal (the CTA)
      opener?.focus?.();
    };
  }, [open, onClose]);

  // reset state a moment after the modal closes
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStatus("idle");
      setError("");
      setEmail("");
      setHoneypot("");
    }, 250);
    return () => clearTimeout(t);
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("Enter a valid email address.");
      setStatus("error");
      inputRef.current?.focus();
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, contact_fax: honeypot }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Couldn't submit right now. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div aria-hidden onClick={onClose} className="absolute inset-0 bg-[rgba(4,5,6,0.72)] backdrop-blur-md" />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Request a Rift beta invite"
            className="relative w-full max-w-[420px] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.1)] bg-[#0c0d0f] p-7 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.92)]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.97 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-[#62666d] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[#c8cdd6]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {status === "success" ? (
              <div className="flex flex-col items-center py-3 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] text-[#f7f8f8]">
                  <RiftMark size={22} />
                </span>
                <h2 className="mt-5 text-[20px] font-semibold tracking-tight text-[#f7f8f8]">You&rsquo;re on the list</h2>
                <p className="mt-2 max-w-[300px] text-[14.5px] leading-[22px] text-[#8a8f98]">
                  Thanks. I&rsquo;ll reach out from this email when your invite is ready.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 inline-flex h-[42px] items-center rounded-[11px] bg-[#f7f8f8] px-5 text-[14px] font-semibold text-[#08090a] transition-transform duration-200 hover:-translate-y-px"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <span className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-[#f7f8f8]">
                  <RiftMark size={20} />
                </span>
                <h2 className="mt-5 text-[21px] font-semibold tracking-tight text-[#f7f8f8]">Join the Mac beta</h2>
                <p className="mt-2 text-[14.5px] leading-[22px] text-[#8a8f98]">
                  Rift is in private beta. Leave your email and I&rsquo;ll send you an invite. No spam, just the invite.
                </p>

                <form onSubmit={submit} className="mt-6" noValidate>
                  <label htmlFor="invite-email" className="sr-only">
                    Email address
                  </label>
                  {/* Honeypot: hidden from humans, catches naive bots. The field
                      name avoids real autofill categories (e.g. "company") so a
                      password manager can't fill it and trigger a silent no-send. */}
                  <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
                    <label htmlFor="invite-contact-fax">Fax</label>
                    <input
                      id="invite-contact-fax"
                      type="text"
                      name="contact_fax"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>
                  <input
                    ref={inputRef}
                    id="invite-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") {
                        setStatus("idle");
                        setError("");
                      }
                    }}
                    aria-invalid={status === "error"}
                    aria-describedby={status === "error" ? "invite-error" : undefined}
                    className="h-[46px] w-full rounded-[11px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-3.5 text-[15px] text-[#f7f8f8] outline-none transition-colors placeholder:text-[#5b5f66] focus:border-[rgba(255,255,255,0.32)]"
                  />
                  {status === "error" && (
                    <p id="invite-error" role="alert" aria-live="assertive" className="mt-2 text-[13px] text-[#f08a8a]">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-3 inline-flex h-[46px] w-full items-center justify-center rounded-[11px] bg-[#f7f8f8] text-[15px] font-semibold text-[#08090a] transition-[transform,opacity] duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "submitting" ? "Sending…" : "Request invite"}
                  </button>
                </form>

                <p className="mt-4 text-center text-[13px] text-[#62666d]">
                  Already invited?{" "}
                  <Link href="/start" onClick={onClose} className="text-[#c8cdd6] underline-offset-4 hover:underline">
                    Set up Rift →
                  </Link>
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
