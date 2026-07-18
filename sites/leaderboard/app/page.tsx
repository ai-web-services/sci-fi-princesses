import type { Metadata } from "next";
import { desc, asc } from "drizzle-orm";
import { getDb } from "../db";
import { expeditionRuns } from "../db/schema";
import { chatGPTSignInPath, getChatGPTUser } from "./chatgpt-auth";

export const metadata: Metadata = {
  title: "Stellar Princesses — Expedition Records",
  description: "Shared Crown Bearer expedition rankings.",
};

export default async function Home() {
  const user = await getChatGPTUser();
  let runs: Array<typeof expeditionRuns.$inferSelect> = [];
  try {
    runs = await getDb().select().from(expeditionRuns).orderBy(
      desc(expeditionRuns.xp), desc(expeditionRuns.level), desc(expeditionRuns.bosses),
      asc(expeditionRuns.durationMs), asc(expeditionRuns.id),
    ).limit(25);
  } catch {
    // The first deployment can render before its D1 migration has applied.
  }

  return (
    <main>
      <div className="starfield" aria-hidden="true" />
      <header>
        <p className="eyebrow">Crown Network // Lumenwild Relay</p>
        <h1>Expedition Records</h1>
        <p className="lede">The strongest stabilized runs across every active Stellar Princess.</p>
        {user ? <span className="identity">Linked as {user.displayName}</span> :
          <a className="signin" href={chatGPTSignInPath("/")}>Sign in with ChatGPT to submit</a>}
      </header>
      <section className="board" aria-label="Global expedition leaderboard">
        <div className="row headings"><span>#</span><span>Princess</span><span>XP</span><span>LV</span><span>Boss</span><span>Time</span></div>
        {runs.length ? runs.map((run, index) => (
          <div className={`row ${user?.email === run.userEmail ? "mine" : ""}`} key={run.id}>
            <span className="rank">{String(index + 1).padStart(2, "0")}</span>
            <span><strong>{run.displayName}{user?.email === run.userEmail ? " · YOU" : ""}</strong><small>{run.result} · {run.objective} · {run.seed}</small></span>
            <span>{run.xp.toLocaleString()}</span><span>{run.level}</span><span>{run.bosses}</span>
            <span>{formatTime(run.durationMs)}</span>
          </div>
        )) : <div className="empty">No stabilized run signals yet. Be the first through the gate.</div>}
      </section>
      <footer>STELLAR PRINCESSES · v6 CROWN NETWORK</footer>
    </main>
  );
}

function formatTime(ms: number) {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
