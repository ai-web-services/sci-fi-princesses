"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function SubmitRun({ encodedRun }: { encodedRun: string }) {
  const payload = useMemo(() => {
    try { return JSON.parse(encodedRun) as unknown; }
    catch { return null; }
  }, [encodedRun]);
  const started = useRef(false);
  const [state, setState] = useState<"sending" | "submitted" | "duplicate" | "limited" | "failed">(payload ? "sending" : "failed");
  const [message, setMessage] = useState(payload ? "Validating expedition signal…" : "This expedition signal is malformed.");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!payload) return;
    fetch("/api/runs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(async response => ({ response, body: await response.json().catch(() => ({})) as { error?: string } }))
      .then(({ response, body }) => {
        if (response.ok) { setState("submitted"); setMessage("Run stabilized on the Crown Network."); }
        else if (response.status === 409) { setState("duplicate"); setMessage("This run was already stabilized."); }
        else if (response.status === 429) { setState("limited"); setMessage("Submission limit reached. Your local record is still safe."); }
        else { setState("failed"); setMessage(body.error || "The signal could not be stabilized. Your local record is still safe."); }
      })
      .catch(() => { setState("failed"); setMessage("The Crown Network is offline. Your local record is still safe."); });
  }, [payload]);

  return <div className={`signal ${state}`} aria-live="polite">
    <span className="signal-dot" aria-hidden="true" />
    <strong>{message}</strong>
    <small>{state === "sending" ? "Do not close this relay." : "You may safely return to Stellar Princesses."}</small>
  </div>;
}
