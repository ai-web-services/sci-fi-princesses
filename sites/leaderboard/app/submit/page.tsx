import type { Metadata } from "next";
import Link from "next/link";
import { chatGPTSignInPath, getChatGPTUser } from "../chatgpt-auth";
import { SubmitRun } from "./SubmitRun";

export const metadata: Metadata = { title: "Submit Expedition — Stellar Princesses" };

export default async function SubmitPage({ searchParams }: { searchParams: Promise<{ run?: string }> }) {
  const params = await searchParams;
  const run = String(params.run || "").slice(0, 4096);
  const user = await getChatGPTUser();
  const returnPath = `/submit?run=${encodeURIComponent(run)}`;
  return <main className="submit-page">
    <p className="eyebrow">Crown Network // Secure Relay</p>
    <h1>Stabilize Run</h1>
    <p className="lede">Your local expedition remains playable and private unless you choose to link it to the shared rankings.</p>
    {!run ? <div className="signal failed"><strong>No expedition signal was supplied.</strong></div>
      : !user ? <a className="signin submit-cta" href={chatGPTSignInPath(returnPath)}>Sign in with ChatGPT and submit</a>
      : <>
        <span className="identity">Submitting as {user.displayName}</span>
        <SubmitRun encodedRun={run} />
      </>}
    <Link className="board-link" href="/">View global rankings</Link>
  </main>;
}
