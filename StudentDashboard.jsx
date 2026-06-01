/*import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Student Dashboard</h1>

      <button
        onClick={() => navigate("/test")}
        style={{
          padding: "12px 25px",
          fontSize: "18px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Start Detection Test
      </button>
    </div>
  );
}

export default StudentDashboard;*/



import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function getReportSummary() {
  try {
    return JSON.parse(localStorage.getItem("reportSummary") || "null");
  } catch {
    return null;
  }
}

function getPreviousReportSummary() {
  try {
    return JSON.parse(localStorage.getItem("previousReportSummary") || "null");
  } catch {
    return null;
  }
}

function getChange(current, previous) {
  if (previous == null) return "New";
  const diff = current - previous;
  if (diff > 0) return `+${diff}`;
  if (diff < 0) return `${diff}`;
  return "0";
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const summary = useMemo(() => getReportSummary(), []);
  const previous = useMemo(() => getPreviousReportSummary(), []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef4ff, #fff3fb, #eefdf4)",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "white",
          borderRadius: "24px",
          padding: "24px",
          boxShadow: "0 12px 28px rgba(0,0,0,0.10)",
        }}
      >
        <h1 style={{ marginTop: 0, color: "#5a35ff" }}>🎓 Student Dashboard</h1>
        <p style={{ color: "#555", fontWeight: "600" }}>
          Continue your assessment, training, and track your improvement.
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "14px",
          }}
        >
          <ScoreCard
            title="Reading"
            score={summary?.readingScore ?? "--"}
            change={summary ? getChange(summary.readingScore, previous?.readingScore) : "--"}
            color="#6c63ff"
            icon="📖"
          />
          <ScoreCard
            title="Writing"
            score={summary?.writingScore ?? "--"}
            change={summary ? getChange(summary.writingScore, previous?.writingScore) : "--"}
            color="#ff6584"
            icon="✍️"
          />
          <ScoreCard
            title="Math"
            score={summary?.mathScore ?? "--"}
            change={summary ? getChange(summary.mathScore, previous?.mathScore) : "--"}
            color="#1c8c5e"
            icon="🔢"
          />
          <ScoreCard
            title="Overall"
            score={summary?.overall?.percentage ?? "--"}
            change={
              summary
                ? getChange(summary.overall.percentage, previous?.overall?.percentage)
                : "--"
            }
            color="#ff9800"
            icon="🧠"
          />
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "16px",
          }}
        >
          <ActionCard
            title="🧪 Start / Re-start Test"
            text="Take the screening to check reading, writing, and math performance."
            buttonText="Open Test"
            onClick={() => navigate("/test")}
            color="#1c8c5e"
          />
          <ActionCard
            title="🎯 Continue Training"
            text="Practice only the training modules that match your weak areas."
            buttonText="Open Training"
            onClick={() => navigate("/training")}
            color="#5a35ff"
          />
          <ActionCard
            title="📄 View Report"
            text="See your latest screening result and progress summary."
            buttonText="Open Report"
            onClick={() => navigate("/report")}
            color="#ff6584"
          />
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ title, score, change, color, icon }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "18px",
        padding: "16px",
        border: "1px solid #ececec",
        boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontSize: "24px" }}>{icon}</div>
      <div style={{ marginTop: "8px", color: "#666", fontWeight: "700" }}>{title}</div>
      <div style={{ marginTop: "6px", fontSize: "24px", fontWeight: "1000", color }}>
        {score}
        {score !== "--" ? "%" : ""}
      </div>
      <div style={{ marginTop: "6px", fontWeight: "800", color: "#444" }}>
        Change: {change}
      </div>
    </div>
  );
}

function ActionCard({ title, text, buttonText, onClick, color }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "18px",
        border: "1px solid #ececec",
        boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontWeight: "1000", fontSize: "18px", color }}>{title}</div>
      <div style={{ marginTop: "8px", color: "#555", lineHeight: "1.7" }}>{text}</div>
      <button
        onClick={onClick}
        style={{
          marginTop: "14px",
          padding: "12px 16px",
          borderRadius: "12px",
          border: "none",
          background: color,
          color: "white",
          fontWeight: "900",
          cursor: "pointer",
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}
