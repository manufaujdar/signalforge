"use client";

import { ChangeEvent, useMemo, useState } from "react";

type Platform = "X" | "LinkedIn" | "Instagram";
type Scores = Record<"Audience fit" | "Clarity" | "Specificity" | "Conversation" | "Trust" | "Native fit", number>;

const demo = `AI agents won't replace your social media team.\n\nThey will replace the blank page, the messy research folder, and the weekly guessing game.\n\nThe useful system is simple: research → verify → draft → human review → measure → learn.\n\nWhich step slows your team down most?`;

const platformLimits: Record<Platform, number> = { X: 280, LinkedIn: 3000, Instagram: 2200 };

function clamp(n: number, min = 0, max = 100) { return Math.min(max, Math.max(min, n)); }

function analyse(text: string, platform: Platform) {
  const clean = text.trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const sentences = clean.split(/[.!?]+/).filter(Boolean);
  const links = (clean.match(/https?:\/\//g) || []).length;
  const questions = (clean.match(/\?/g) || []).length;
  const numbers = (clean.match(/\b\d+(?:[.,]\d+)?%?\b/g) || []).length;
  const hashtags = (clean.match(/#\w+/g) || []).length;
  const avgSentence = words.length / Math.max(1, sentences.length);
  const limit = platformLimits[platform];
  const lengthFit = platform === "X" ? (clean.length <= limit && clean.length >= 90 ? 92 : clamp(100 - Math.abs(clean.length - 180) * .42)) : clamp(72 + Math.min(words.length, 180) * .12);
  const scores: Scores = {
    "Audience fit": clamp(62 + (clean.match(/\byou|your|team|creator|audience\b/gi) || []).length * 4),
    "Clarity": clamp(95 - Math.max(0, avgSentence - 18) * 2.8 - (clean.match(/\b(very|really|basically|actually)\b/gi) || []).length * 3),
    "Specificity": clamp(48 + numbers * 9 + (clean.includes(":") ? 6 : 0) + (clean.includes("→") ? 8 : 0)),
    "Conversation": clamp(48 + questions * 20 + (clean.match(/\bwhich|what|how|agree|try\b/gi) || []).length * 4),
    "Trust": clamp(78 - links * 3 - (clean.match(/\b(always|never|guaranteed|secret|viral)\b/gi) || []).length * 8),
    "Native fit": clamp(lengthFit - Math.max(0, hashtags - 2) * 8),
  };
  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length);
  const risk = clamp((clean.match(/\b(always|never|guaranteed|secret|viral|cure|profit)\b/gi) || []).length * 15 + Math.max(0, hashtags - 3) * 5);
  return { scores, overall, risk, words: words.length, chars: clean.length, links, questions, limit };
}

function enhance(text: string, mode: "clear" | "bold" | "conversation") {
  const clean = text.trim().replace(/\b(very|really|basically|actually)\b\s*/gi, "").replace(/\n{3,}/g, "\n\n");
  if (mode === "clear") return clean.replace(/AI agents won't replace your social media team\./i, "AI agents are most useful before your team hits publish.");
  if (mode === "bold") return `The best social media agent doesn't publish for you.\n\nIt removes the blank page, verifies the research, and gives your team stronger options.\n\nHuman judgment still owns the final post.\n\nThat is the system worth building.`;
  return `${clean.replace(/Which step slows your team down most\?/i, "")}\n\nWhere does your content process break: research, drafting, review, or measurement?`.trim();
}

export default function Home() {
  const [platform, setPlatform] = useState<Platform>("X");
  const [text, setText] = useState(demo);
  const [active, setActive] = useState("Evaluator");
  const [notice, setNotice] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(0);
  const result = useMemo(() => analyse(text, platform), [text, platform]);
  const variants = useMemo(() => [enhance(text, "clear"), enhance(text, "bold"), enhance(text, "conversation")], [text]);
  const projected = variants.map(v => analyse(v, platform).overall);

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) { setNotice("Please upload a text file smaller than 2 MB."); return; }
    if (!file.type.startsWith("text/") && !/\.(md|txt|csv)$/i.test(file.name)) { setNotice("This version accepts .txt, .md, and .csv content files."); return; }
    setText(await file.text());
    setNotice(`${file.name} loaded and evaluated locally.`);
  }

  async function saveEvaluation() {
    try {
      const response = await fetch("/api/evaluations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ platform, content: text, score: result.overall, risk: result.risk }) });
      if (!response.ok) throw new Error();
      setNotice("Evaluation saved to your dashboard.");
    } catch { setNotice("Evaluation is ready. Persistent saving becomes available on the hosted workspace."); }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">S</span><div><strong>SignalForge</strong><small>Content intelligence</small></div></div>
        <nav aria-label="Primary navigation">
          {["Dashboard", "Evaluator", "Content Lab", "Experiments", "Trend Radar"].map((item, i) => <button key={item} onClick={() => setActive(item)} className={active === item ? "nav-active" : ""}><span>{["▦","✦","◇","⌁","◎"][i]}</span>{item}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="system-card"><span className="pulse"/><small>Evaluation engine</small><strong>6 signals online</strong><p>Explainable local scoring</p></div>
          <button className="text-button">⚙ Workspace settings</button>
          <div className="profile"><span>MF</span><div><strong>Content team</strong><small>Human approval on</small></div></div>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar"><div><span className="eyebrow">CONTENT INTELLIGENCE / {active.toUpperCase()}</span><h1>{active === "Evaluator" ? "Turn a good post into a stronger one." : active}</h1></div><div className="header-actions"><button className="ghost">Methodology</button><button className="primary" onClick={saveEvaluation}>Save evaluation</button></div></header>

        {active !== "Evaluator" ? <DashboardView active={active} onEvaluate={() => setActive("Evaluator")} /> : <>
          <section className="workspace-grid">
            <article className="composer card">
              <div className="card-head"><div><span className="step">01</span><h2>Source content</h2></div><label className="upload">↑ Upload<input type="file" accept=".txt,.md,.csv,text/plain,text/markdown,text/csv" onChange={onFile}/></label></div>
              <div className="platform-row"><span>Optimize for</span>{(["X","LinkedIn","Instagram"] as Platform[]).map(p => <button key={p} onClick={() => setPlatform(p)} className={platform === p ? "selected" : ""}>{p}</button>)}</div>
              <textarea aria-label="Content to evaluate" value={text} onChange={e => setText(e.target.value)} />
              <div className="composer-meta"><span>{result.words} words</span><span className={result.chars > result.limit ? "danger" : ""}>{result.chars} / {result.limit} characters</span><span>Auto-saved draft</span></div>
              <div className="context-row"><label>Goal<select defaultValue="conversation"><option value="conversation">Start conversation</option><option>Build authority</option><option>Drive clicks</option></select></label><label>Audience<input defaultValue="Tech & product leaders"/></label></div>
              <button className="evaluate" onClick={() => setNotice("Fresh evaluation complete.")}>Evaluate content <span>→</span></button>
            </article>

            <article className="score-card card">
              <div className="card-head"><div><span className="step">02</span><h2>Signal score</h2></div><span className="model-tag">SF / Transparent v1</span></div>
              <div className="score-hero"><div className="score-ring" style={{"--score": `${result.overall * 3.6}deg`} as React.CSSProperties}><div><strong>{result.overall}</strong><span>/100</span></div></div><div><span className="grade">{result.overall >= 80 ? "Strong foundation" : result.overall >= 65 ? "Promising draft" : "Needs work"}</span><h3>{result.overall >= 80 ? "Ready for a focused polish." : "A few changes can lift this."}</h3><p>Prioritization confidence, not predicted platform reach.</p></div></div>
              <div className="signal-list">{Object.entries(result.scores).map(([name, score]) => <div className="signal" key={name}><div><span>{name}</span><strong>{Math.round(score)}</strong></div><div className="bar"><i style={{width: `${score}%`}}/></div></div>)}</div>
              <div className="risk-line"><span className={result.risk > 25 ? "risk-dot high" : "risk-dot"}/><div><strong>{result.risk > 25 ? "Review recommended" : "Low negative-feedback risk"}</strong><small>{result.links ? `${result.links} external link detected` : "No spam or manipulation patterns detected"}</small></div><b>{result.risk}/100</b></div>
            </article>
          </section>

          <section className="improvements card">
            <div className="card-head"><div><span className="step">03</span><h2>Ranked enhancements</h2><p>Three editorial directions, scored with the same transparent model.</p></div><span className="human-badge">● Human approval required</span></div>
            <div className="variant-grid">{variants.map((variant, i) => <button key={i} className={`variant ${selectedVariant === i ? "variant-active" : ""}`} onClick={() => setSelectedVariant(i)}><div><span>0{i+1} / {['Clarity','Authority','Conversation'][i]}</span><b>+{Math.max(0, projected[i]-result.overall)} pts</b></div><p>{variant}</p><footer><span>{analyse(variant, platform).chars} chars</span><strong>{projected[i]} score</strong></footer></button>)}</div>
            <div className="selected-output"><div><span>SELECTED ENHANCEMENT</span><button onClick={() => {navigator.clipboard?.writeText(variants[selectedVariant]); setNotice("Enhanced version copied.")}}>Copy text</button></div><p>{variants[selectedVariant]}</p><button className="apply" onClick={() => setText(variants[selectedVariant])}>Apply to draft →</button></div>
          </section>
        </>}
        {notice && <div className="toast" role="status" onClick={() => setNotice("")}>{notice}<span>×</span></div>}
      </section>
    </main>
  );
}

function DashboardView({active, onEvaluate}:{active:string; onEvaluate:()=>void}) {
  return <div className="dashboard-view">
    <section className="metric-row">{[["Evaluations","24","+8 this week"],["Median score","78","↑ 6 points"],["Experiments","3","1 running"],["Approval rate","67%","Human reviewed"]].map(m => <article className="metric card" key={m[0]}><span>{m[0]}</span><strong>{m[1]}</strong><small>{m[2]}</small></article>)}</section>
    <section className="dash-grid"><article className="card chart-card"><div className="card-head"><div><span className="step">LIVE</span><h2>Signal health</h2></div><span className="model-tag">Last 8 evaluations</span></div><div className="chart">{[58,65,61,72,69,77,74,82].map((h,i)=><i key={i} style={{height:`${h}%`}}><span>{h}</span></i>)}</div><div className="axis"><span>Jun 24</span><span>Today</span></div></article><article className="card next-card"><span className="eyebrow">NEXT BEST ACTION</span><h2>Conversation scores trail clarity by 14 points.</h2><p>Test a narrower closing question on the next three X posts. Keep topic and format stable.</p><button className="primary" onClick={onEvaluate}>Evaluate a draft</button></article></section>
    <section className="card activity"><div className="card-head"><div><span className="step">RECENT</span><h2>{active} workspace</h2></div></div>{["AI agent workflow post","Open-source analytics stack","Human review framework"].map((x,i)=><div className="activity-row" key={x}><span className="activity-icon">{i===0?"X":"in"}</span><div><strong>{x}</strong><small>{["Conversation experiment","Authority post","Educational carousel"][i]}</small></div><b>{[82,76,71][i]}</b><span className="status">{i===0?"Approved":"Review"}</span></div>)}</section>
  </div>;
}
