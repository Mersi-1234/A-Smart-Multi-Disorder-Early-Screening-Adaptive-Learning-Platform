import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/detection.css";

export default function Test() {
  const navigate = useNavigate();

  const isRetest = useMemo(() => {
    return localStorage.getItem("retestRequired") === "true";
  }, []);

  const startAssessment = () => {
    // only clear assessment data, keep previous report for comparison
    localStorage.removeItem("readingAssessment");
    localStorage.removeItem("writingAssessment");
    localStorage.removeItem("mathAssessment");
    navigate("/reading");
  };

  return (
    <div className="screen-wrap">
      <div className="screen-bubble one"></div>
      <div className="screen-bubble two"></div>
      <div className="screen-bubble three"></div>

      <div className="screen-card">
        <div style={{ textAlign: "center" }}>
          <div
            className="screen-badge"
            style={{
              background: isRetest ? "#fff3e0" : "#eef1ff",
              color: isRetest ? "#ef6c00" : "#4a4aff",
            }}
          >
            {isRetest ? "🔁 Progress Re-test" : "🧠 Initial Screening Assessment"}
          </div>

          <h1 className="screen-title">
            {isRetest ? "LearnEase Progress Re-test" : "LearnEase Detection Screening"}
          </h1>

          <p className="screen-subtitle">
            {isRetest
              ? "This checks how much the child improved after training and whether more practice is needed."
              : "This checks reading, writing, and mathematics learning areas and prepares a support plan."}
          </p>
        </div>

        <div className="domain-grid">
          <TestCard
            icon="📖"
            title={isRetest ? "Reading Progress Check" : "Reading Screening"}
            text="Word recognition, phonics, oral support, and reading speed."
            color="#6c63ff"
          />
          <TestCard
            icon="✍️"
            title={isRetest ? "Writing Progress Check" : "Writing Screening"}
            text="Tracing, copying, spelling, writing control, and speed."
            color="#ff6584"
          />
          <TestCard
            icon="🔢"
            title={isRetest ? "Math Progress Check" : "Math Screening"}
            text="Number sense, counting, comparison, sequencing, and arithmetic."
            color="#1c8c5e"
          />
        </div>

        <div className="info-box">
          <div className="info-title">
            {isRetest ? "What happens after this re-test?" : "What will be measured?"}
          </div>
          <ul className="info-list">
            <li>Current score in reading, writing, and math</li>
            <li>Comparison with previous result</li>
            <li>Progress shown in parent and teacher dashboards</li>
            <li>Decision whether training is still needed</li>
            <li>Updated next-step support plan</li>
          </ul>
        </div>

        <div className="center-actions">
          <button onClick={startAssessment} className="primary-btn">
            {isRetest ? "Start Progress Re-test" : "Start Screening"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TestCard({ icon, title, text, color }) {
  return (
    <div className="domain-card">
      <div className="domain-icon">{icon}</div>
      <div className="domain-title" style={{ color }}>
        {title}
      </div>
      <div className="domain-text">{text}</div>
    </div>
  );
}
