import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import {
  markDetectionTestCompleted,
  saveReportSummary,
  setRetestRequired,
} from "../services/firestoreService";

/* ── helpers ── */
function getJson(key) {
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
}

function getRisk(score) {
  if (score < 40) return { label: "High Risk",      risk: "high",     color: "#e53935", bg: "#fff0f0", icon: "🚨" };
  if (score < 70) return { label: "Moderate Risk",  risk: "moderate", color: "#fb8c00", bg: "#fff8ee", icon: "⚠️" };
  return              { label: "Low Risk",       risk: "low",      color: "#43a047", bg: "#f0fff4", icon: "✅" };
}

function getDiff(current, previous) {
  if (previous == null) return null;
  return current - previous;
}

function needsTraining(score, diff) {
  if (score < 70) return true;           // still at risk
  if (diff !== null && diff < 5) return true; // had previous data and improved less than 5 points
  return false;
}

function getWeakAreas(key, reading, writing, math) {
  if (key === "reading") {
    const wrong = (reading?.tasks || []).filter(t => !t.isCorrect).map(t => (t.task || "").toLowerCase());
    const f = [];
    if (wrong.some(t => t.includes("letter")))   f.push("Letter recognition");
    if (wrong.some(t => t.includes("phonics")))  f.push("Phonics matching");
    if (wrong.some(t => t.includes("word")))     f.push("Word reading");
    if (wrong.some(t => t.includes("sentence"))) f.push("Sentence comprehension");
    return f.length ? f : ["General reading support"];
  }
  if (key === "writing") {
    const wrong = (writing?.tasks || []).filter(t => !t.isCorrect).map(t => (t.task || "").toLowerCase());
    const f = [];
    if (wrong.some(t => t.includes("letter")))  f.push("Letter formation");
    if (wrong.some(t => t.includes("word")))    f.push("Word copying");
    if (wrong.some(t => t.includes("sentence")))f.push("Sentence writing");
    if ((writing?.averageResponseTime || 0) > 15) f.push("Writing speed");
    return f.length ? f : ["General writing support"];
  }
  if (key === "math") {
    const wrong = (math?.tasks || []).filter(t => !t.isCorrect).map(t => (t.task || "").toLowerCase());
    const f = [];
    if (wrong.some(t => t.includes("recognition"))) f.push("Number recognition");
    if (wrong.some(t => t.includes("count")))       f.push("Counting");
    if (wrong.some(t => t.includes("comparison")))  f.push("Number comparison");
    if (wrong.some(t => t.includes("sequence")))    f.push("Sequencing");
    if (wrong.some(t => t.includes("arithmetic")))  f.push("Basic arithmetic");
    return f.length ? f : ["General math support"];
  }
  return [];
}

/* ── sub-components ── */
function ScoreCompareCard({ title, icon, current, previous, color, bg, riskLabel, riskIcon, weakAreas, needsRetrain }) {
  const diff = getDiff(current, previous);
  const diffColor = diff === null ? "#888" : diff > 0 ? "#43a047" : diff < 0 ? "#e53935" : "#888";
  const diffText  = diff === null ? "First test" : diff > 0 ? `+${diff}% improved` : diff < 0 ? `${diff}% dropped` : "No change";

  return (
    <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: `2px solid ${color}33`, boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}>
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <div style={{ fontSize: "18px", fontWeight: "1000", color: "#333" }}>{icon} {title}</div>
        <span style={{ background: bg, color, padding: "4px 12px", borderRadius: "999px", fontWeight: "900", fontSize: "13px" }}>{riskIcon} {riskLabel}</span>
      </div>

      {/* Score comparison */}
      <div style={{ display: "grid", gridTemplateColumns: previous != null ? "1fr 1fr" : "1fr", gap: "12px", marginBottom: "14px" }}>
        {previous != null && (
          <div style={{ background: "#f8f8f8", borderRadius: "14px", padding: "14px", textAlign: "center" }}>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#888", marginBottom: "4px" }}>BEFORE TRAINING</div>
            <div style={{ fontSize: "28px", fontWeight: "1000", color: "#aaa" }}>{previous}%</div>
          </div>
        )}
        <div style={{ background: bg, borderRadius: "14px", padding: "14px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", fontWeight: "800", color: "#888", marginBottom: "4px" }}>{previous != null ? "CURRENT SCORE" : "YOUR SCORE"}</div>
          <div style={{ fontSize: "28px", fontWeight: "1000", color }}>{current}%</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "13px", fontWeight: "800", color: "#555" }}>Score progress</span>
          <span style={{ fontSize: "13px", fontWeight: "900", color: diffColor }}>{diffText}</span>
        </div>
        <div style={{ height: "10px", background: "#eee", borderRadius: "999px", overflow: "hidden" }}>
          {previous != null && (
            <div style={{ height: "100%", width: `${previous}%`, background: "#ddd", borderRadius: "999px", position: "relative" }}>
              <div style={{ position: "absolute", right: 0, top: 0, height: "100%", width: `${Math.max(0, current - previous)}%`, background: color, borderRadius: "999px" }} />
            </div>
          )}
          {previous == null && (
            <div style={{ height: "100%", width: `${current}%`, background: color, borderRadius: "999px" }} />
          )}
        </div>
      </div>

      {/* Verdict */}
      {needsRetrain ? (
        <div style={{ background: "#fff8ee", border: "1px solid #ffd180", borderRadius: "12px", padding: "10px 12px" }}>
          <div style={{ fontWeight: "900", color: "#e65100", fontSize: "13px", marginBottom: "4px" }}>⚠️ Training recommended</div>
          <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.7" }}>
            Focus areas: <span style={{ fontWeight: "900", color: "#333" }}>{weakAreas.join(", ")}</span>
          </div>
        </div>
      ) : (
        <div style={{ background: "#f0fff4", border: "1px solid #a5d6a7", borderRadius: "12px", padding: "10px 12px" }}>
          <div style={{ fontWeight: "900", color: "#2e7d32", fontSize: "13px" }}>✅ Performing well — keep it up!</div>
        </div>
      )}
    </div>
  );
}

/* ── main component ── */
export default function Report() {
  const navigate = useNavigate();

  const reading = useMemo(() => getJson("readingAssessment"), []);
  const writing = useMemo(() => getJson("writingAssessment"), []);
  const math    = useMemo(() => getJson("mathAssessment"), []);

  // Read the EXISTING reportSummary as "previous" before this render overwrites it.
  // Also check previousReportSummary as fallback (for re-tests).
  const prevReport = useMemo(() => {
    return getJson("previousReportSummary") || null;
  }, []);

  const readingScore = reading?.domainScore || 0;
  const writingScore = writing?.domainScore || 0;
  const mathScore    = math?.domainScore    || 0;
  const overall      = Math.round((readingScore + writingScore + mathScore) / 3);

  const readingRisk = useMemo(() => getRisk(readingScore), [readingScore]);
  const writingRisk = useMemo(() => getRisk(writingScore), [writingScore]);
  const mathRisk    = useMemo(() => getRisk(mathScore),    [mathScore]);
  const overallRisk = useMemo(() => getRisk(overall),      [overall]);

  const prevReading = prevReport?.readingScore ?? null;
  const prevWriting = prevReport?.writingScore ?? null;
  const prevMath    = prevReport?.mathScore    ?? null;
  const prevOverall = prevReport?.overall?.percentage ?? null;

  const readingWeak = useMemo(() => getWeakAreas("reading", reading, writing, math), [reading, writing, math]);
  const writingWeak = useMemo(() => getWeakAreas("writing", reading, writing, math), [reading, writing, math]);
  const mathWeak    = useMemo(() => getWeakAreas("math",    reading, writing, math), [reading, writing, math]);

  const readingNeeds = needsTraining(readingScore, getDiff(readingScore, prevReading));
  const writingNeeds = needsTraining(writingScore, getDiff(writingScore, prevWriting));
  const mathNeeds    = needsTraining(mathScore,    getDiff(mathScore,    prevMath));
  const anyNeeds     = readingNeeds || writingNeeds || mathNeeds;

  const overallDiff = getDiff(overall, prevOverall);

  /* save to localStorage + Firestore */
  useEffect(() => {
    const run = async () => {
      // snapshot the current report as "previous" before overwriting
      const existing = getJson("reportSummary");
      if (existing) {
        localStorage.setItem("previousReportSummary", JSON.stringify(existing));
      }

      const summary = {
        readingScore, writingScore, mathScore,
        dyslexia:   { risk: readingRisk.risk, score: readingScore, level: readingRisk.label },
        dysgraphia: { risk: writingRisk.risk, score: writingScore, level: writingRisk.label },
        dyscalculia:{ risk: mathRisk.risk,    score: mathScore,    level: mathRisk.label    },
        overall:    { percentage: overall, risk: overallRisk.risk, level: overallRisk.label },
        progress:   { previousOverall: existing?.overall?.percentage ?? null },
        retrainingNeeded: anyNeeds,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("reportSummary", JSON.stringify(summary));
      localStorage.setItem("retestRequired", anyNeeds ? "true" : "false");
      try {
        const uid = auth.currentUser?.uid;
        if (uid) {
          await saveReportSummary(uid, summary);
          await markDetectionTestCompleted(uid);
          await setRetestRequired(uid, anyNeeds);
        }
      } catch (e) { console.error(e); }
    };
    run();
  }, []); // eslint-disable-line

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ffd6e8, #d7e8ff, #d8ffe1)", padding: "24px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", background: "rgba(255,255,255,0.97)", borderRadius: "28px", padding: "28px", boxShadow: "0 14px 40px rgba(0,0,0,0.12)" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "34px", fontWeight: "1000", color: "#3b2fb3" }}>LearnEase</div>
          <h1 style={{ margin: "8px 0 6px", color: "#5a35ff", fontSize: "26px" }}>📊 Result Report</h1>
          <p style={{ color: "#666", fontSize: "15px", maxWidth: "560px", margin: "0 auto", lineHeight: "1.7" }}>
            This report shows the child's current scores, compares them with previous results, and recommends whether further training is needed.
          </p>
        </div>

        {/* Overall summary banner */}
        <div style={{ background: `linear-gradient(135deg, ${overallRisk.bg}, #f8f8ff)`, border: `2px solid ${overallRisk.color}44`, borderRadius: "20px", padding: "20px 24px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800", color: "#888" }}>OVERALL SCORE</div>
            <div style={{ fontSize: "42px", fontWeight: "1000", color: overallRisk.color, lineHeight: 1 }}>{overall}%</div>
            <div style={{ marginTop: "6px", fontWeight: "900", color: overallRisk.color }}>{overallRisk.icon} {overallRisk.label}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            {prevOverall != null ? (
              <>
                <div style={{ fontSize: "13px", color: "#888", fontWeight: "800" }}>BEFORE TRAINING</div>
                <div style={{ fontSize: "28px", fontWeight: "1000", color: "#aaa" }}>{prevOverall}%</div>
                <div style={{ fontWeight: "900", color: overallDiff > 0 ? "#43a047" : overallDiff < 0 ? "#e53935" : "#888", fontSize: "15px", marginTop: "4px" }}>
                  {overallDiff > 0 ? `▲ +${overallDiff}% improved` : overallDiff < 0 ? `▼ ${overallDiff}% dropped` : "No change"}
                </div>
              </>
            ) : (
              <div style={{ color: "#aaa", fontWeight: "800", fontSize: "14px" }}>First screening — complete training to see progress next time</div>
            )}
          </div>
        </div>

        {/* Per-domain comparison cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <ScoreCompareCard
            title="Reading (Dyslexia)" icon="📖"
            current={readingScore} previous={prevReading}
            color={readingRisk.color} bg={readingRisk.bg}
            riskLabel={readingRisk.label} riskIcon={readingRisk.icon}
            weakAreas={readingWeak} needsRetrain={readingNeeds}
          />
          <ScoreCompareCard
            title="Writing (Dysgraphia)" icon="✍️"
            current={writingScore} previous={prevWriting}
            color={writingRisk.color} bg={writingRisk.bg}
            riskLabel={writingRisk.label} riskIcon={writingRisk.icon}
            weakAreas={writingWeak} needsRetrain={writingNeeds}
          />
          <ScoreCompareCard
            title="Math (Dyscalculia)" icon="🔢"
            current={mathScore} previous={prevMath}
            color={mathRisk.color} bg={mathRisk.bg}
            riskLabel={mathRisk.label} riskIcon={mathRisk.icon}
            weakAreas={mathWeak} needsRetrain={mathNeeds}
          />
        </div>

        {/* Training verdict */}
        <div style={{ borderRadius: "20px", padding: "22px", marginBottom: "24px", background: anyNeeds ? "linear-gradient(135deg, #fff8ee, #fff3f3)" : "linear-gradient(135deg, #f0fff4, #e8f5e9)", border: `2px solid ${anyNeeds ? "#ffcc80" : "#a5d6a7"}` }}>
          <div style={{ fontSize: "20px", fontWeight: "1000", color: anyNeeds ? "#e65100" : "#2e7d32", marginBottom: "10px" }}>
            {anyNeeds ? "⚠️ Training is recommended" : "🎉 Great performance — no training needed right now!"}
          </div>
          {anyNeeds ? (
            <>
              <p style={{ color: "#555", lineHeight: "1.8", marginBottom: "14px" }}>
                Based on the scores and comparison with previous results, the child still needs support in the following areas:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {readingNeeds && readingWeak.map(w => (
                  <span key={w} style={{ background: "#fff0f0", color: "#c62828", padding: "6px 14px", borderRadius: "999px", fontWeight: "900", fontSize: "13px", border: "1px solid #ffcdd2" }}>📖 {w}</span>
                ))}
                {writingNeeds && writingWeak.map(w => (
                  <span key={w} style={{ background: "#fff8e1", color: "#e65100", padding: "6px 14px", borderRadius: "999px", fontWeight: "900", fontSize: "13px", border: "1px solid #ffe082" }}>✍️ {w}</span>
                ))}
                {mathNeeds && mathWeak.map(w => (
                  <span key={w} style={{ background: "#e8f5e9", color: "#1b5e20", padding: "6px 14px", borderRadius: "999px", fontWeight: "900", fontSize: "13px", border: "1px solid #a5d6a7" }}>🔢 {w}</span>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: "#555", lineHeight: "1.8" }}>
              The child has scored above 70% in all areas and shown good improvement. Continue with light practice to maintain progress.
            </p>
          )}
        </div>

        {/* Detailed stats */}
        <details style={{ background: "#f8f9fb", borderRadius: "16px", padding: "16px", border: "1px solid #ececec", marginBottom: "24px" }}>
          <summary style={{ fontWeight: "1000", color: "#333", cursor: "pointer", fontSize: "16px" }}>📋 Detailed Test Statistics</summary>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginTop: "14px" }}>
            {[
              { label: "📖 Reading", data: reading, risk: readingRisk },
              { label: "✍️ Writing", data: writing, risk: writingRisk },
              { label: "🔢 Math",    data: math,    risk: mathRisk    },
            ].map(({ label, data, risk }) => (
              <div key={label} style={{ background: "white", borderRadius: "12px", padding: "14px", border: `1px solid ${risk.color}33` }}>
                <div style={{ fontWeight: "1000", color: risk.color, marginBottom: "8px" }}>{label}</div>
                <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.9" }}>
                  <div>Accuracy: <b>{data?.accuracyScore || 0}%</b></div>
                  <div>Mistakes: <b>{data?.mistakes || 0}</b></div>
                  <div>Avg response: <b>{data?.averageResponseTime || 0}s</b></div>
                  <div>Total questions: <b>{data?.totalQuestions || 0}</b></div>
                </div>
              </div>
            ))}
          </div>
        </details>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          {anyNeeds && (
            <button
              onClick={() => navigate("/training")}
              style={{ padding: "14px 28px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #6c63ff, #5a35ff)", color: "white", fontWeight: "1000", fontSize: "16px", cursor: "pointer", boxShadow: "0 10px 20px rgba(90,53,255,0.22)" }}
            >
              🎯 Start Targeted Training
            </button>
          )}
          <button
            onClick={() => navigate("/test")}
            style={{ padding: "14px 28px", borderRadius: "14px", border: "1px solid #ddd", background: "white", fontWeight: "1000", fontSize: "16px", cursor: "pointer", color: "#333" }}
          >
            🔁 Re-take Test
          </button>
          <button
            onClick={() => navigate("/student")}
            style={{ padding: "14px 28px", borderRadius: "14px", border: "1px solid #ddd", background: "white", fontWeight: "1000", fontSize: "16px", cursor: "pointer", color: "#333" }}
          >
            🏠 Dashboard
          </button>
        </div>

        <p style={{ textAlign: "center", color: "#aaa", fontSize: "12px", marginTop: "20px", lineHeight: "1.6" }}>
          This is a prototype screening tool and not a clinical diagnosis. For professional assessment, consult a specialist.
        </p>

      </div>
    </div>
  );
}
