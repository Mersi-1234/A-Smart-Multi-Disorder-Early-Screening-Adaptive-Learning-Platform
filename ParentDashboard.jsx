/*import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import {
  sendChatMessage,
  subscribeToChatMessages,
  markMessagesSeen,
} from "../services/firestoreService";

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

function getDailyFood() {
  const foods = [
    "Egg 🥚",
    "Banana 🍌",
    "Milk 🥛",
    "Curd / Yogurt 🥣",
    "Carrot 🥕",
    "Spinach 🌿",
    "Nuts 🥜",
    "Apple 🍎",
  ];

  const today = new Date().toISOString().slice(0, 10);
  let sum = 0;
  for (let i = 0; i < today.length; i++) sum += today.charCodeAt(i);
  return foods[sum % foods.length];
}

function getLevelText(risk) {
  if (risk === "high") return "High Level 🚨";
  if (risk === "moderate") return "Moderate Level ⚠️";
  return "Low Level ✅";
}

function getDetected(summary) {
  const arr = [];

  if (summary?.dyslexia?.risk && summary.dyslexia.risk !== "low") {
    arr.push({
      title: "Dyslexia",
      icon: "📖",
      level: getLevelText(summary.dyslexia.risk),
      score: summary.readingScore ?? 0,
    });
  }

  if (summary?.dysgraphia?.risk && summary.dysgraphia.risk !== "low") {
    arr.push({
      title: "Dysgraphia",
      icon: "✍️",
      level: getLevelText(summary.dysgraphia.risk),
      score: summary.writingScore ?? 0,
    });
  }

  if (summary?.dyscalculia?.risk && summary.dyscalculia.risk !== "low") {
    arr.push({
      title: "Dyscalculia",
      icon: "🔢",
      level: getLevelText(summary.dyscalculia.risk),
      score: summary.mathScore ?? 0,
    });
  }

  if (arr.length === 0) {
    arr.push({
      title: "General Learning Support",
      icon: "🌟",
      level: "Low Level ✅",
      score: 0,
    });
  }

  return arr;
}

function getProgress(current, previous) {
  if (previous == null) return "New";
  const diff = current - previous;
  if (diff > 0) return `+${diff}`;
  if (diff < 0) return `${diff}`;
  return "0";
}

function formatTime(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ProgressBar({ label, current, previous, color }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontWeight: "800", color: "#444" }}>{label}</span>
        <span style={{ fontWeight: "900", color }}>{current}%</span>
      </div>

      <div
        style={{
          width: "100%",
          height: "14px",
          background: "#edf1f7",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${current}%`,
            height: "100%",
            background: color,
            borderRadius: "999px",
          }}
        ></div>
      </div>

      <div style={{ marginTop: "6px", color: "#666", fontWeight: "700" }}>
        Previous: {previous ?? "--"} | Progress: {getProgress(current, previous)}
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  const navigate = useNavigate();
  const summary = useMemo(() => getReportSummary(), []);
  const previous = useMemo(() => getPreviousReportSummary(), []);
  const detected = useMemo(() => getDetected(summary), [summary]);

  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const quickSuggestions = [
    "My child is improving well after training.",
    "We need more guidance for home practice.",
    "Can we plan a re-test soon?",
    "Reading improved but writing still needs support.",
  ];

  useEffect(() => {
    markMessagesSeen("parent");

    const unsubscribe = subscribeToChatMessages((items) => {
      setMessages(items);
      setTimeout(() => {
        markMessagesSeen("parent");
      }, 0);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const currentUser = auth.currentUser;
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

    if (!chatText.trim() || sending) return;

    try {
      setSending(true);
      await sendChatMessage({
        senderUid: currentUser?.uid || storedUser?.uid || "parent-local-user",
        senderRole: "parent",
        senderName: "Parent",
        text: chatText,
      });
      setChatText("");
    } catch (error) {
      alert(`Message could not be sent: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffe8f2, #e7f0ff, #e8fff0)",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.97)",
          borderRadius: "28px",
          padding: "24px",
          boxShadow: "0 14px 35px rgba(0,0,0,0.14)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <div style={{ fontSize: "32px", fontWeight: "1000", color: "#3b2fb3" }}>
            LearnEase
          </div>
          <h1 style={{ margin: "8px 0 0 0", color: "#5a35ff" }}>👨‍👩‍👧 Parent Dashboard</h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "14px",
          }}
        >
          <StatCard title="Reading Score" value={summary?.readingScore ?? "--"} color="#6c63ff" icon="📖" />
          <StatCard title="Writing Score" value={summary?.writingScore ?? "--"} color="#ff6584" icon="✍️" />
          <StatCard title="Math Score" value={summary?.mathScore ?? "--"} color="#1c8c5e" icon="🔢" />
          <StatCard title="Overall" value={summary?.overall?.percentage ?? "--"} color="#ff9800" icon="🧠" />
        </div>

        <div style={{ ...panel, marginTop: "20px" }}>
          <div style={panelTitle}>📈 Progress Overview</div>
          <ProgressBar label="Reading" current={summary?.readingScore || 0} previous={previous?.readingScore ?? null} color="#6c63ff" />
          <ProgressBar label="Writing" current={summary?.writingScore || 0} previous={previous?.writingScore ?? null} color="#ff6584" />
          <ProgressBar label="Math" current={summary?.mathScore || 0} previous={previous?.mathScore ?? null} color="#1c8c5e" />
          <ProgressBar label="Overall" current={summary?.overall?.percentage || 0} previous={previous?.overall?.percentage ?? null} color="#ff9800" />
        </div>

        <div
          style={{
            marginTop: "22px",
            background: "linear-gradient(to right, #fff8d6, #ffe8f2)",
            borderRadius: "22px",
            padding: "18px",
            border: "1px solid #f5d6a1",
          }}
        >
          <div style={{ fontWeight: "1000", fontSize: "20px", color: "#333" }}>
            ✨ Current Learning Areas
          </div>

          <div
            style={{
              marginTop: "14px",
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            {detected.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "16px",
                  border: "1px solid #ddd",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontSize: "28px" }}>{item.icon}</div>
                <div style={{ fontWeight: "1000", fontSize: "18px", marginTop: "6px" }}>
                  {item.title}
                </div>
                <div style={{ marginTop: "8px", color: "#555" }}>
                  Level: <b>{item.level}</b>
                </div>
                <div style={{ marginTop: "4px", color: "#555" }}>
                  Score: <b>{item.score}</b>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...panel, marginTop: "20px", padding: "0", overflow: "hidden" }}>
          <div
            style={{
              padding: "16px 18px 10px",
              borderBottom: "1px solid #ececec",
              background: "#f8f9fb",
            }}
          >
            <div style={{ fontWeight: "1000", fontSize: "20px", color: "#222" }}>
              💬 Parent-Teacher Chat
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "12px",
              }}
            >
              {quickSuggestions.map((item) => (
                <button key={item} onClick={() => setChatText(item)} style={suggestionBtn}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              height: "380px",
              overflowY: "auto",
              padding: "18px",
              background: "#efeae2",
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.length === 0 ? (
              <div style={{ color: "#666", textAlign: "center", marginTop: "20px" }}>
                No messages yet.
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderRole === "parent";

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: isMine ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "72%",
                        minWidth: "120px",
                        padding: "10px 12px 8px",
                        borderRadius: "10px",
                        background: isMine ? "#dcf8c6" : "#ffffff",
                        boxShadow: "0 1px 1px rgba(0,0,0,0.12)",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "900",
                          fontSize: "14px",
                          color: isMine ? "#075e54" : "#5a35ff",
                          marginBottom: "4px",
                        }}
                      >
                        {isMine ? "You" : "Teacher"}
                      </div>

                      <div
                        style={{
                          color: "#222",
                          fontSize: "16px",
                          lineHeight: "1.5",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.text}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          gap: "6px",
                          marginTop: "6px",
                          fontSize: "12px",
                          color: "#667781",
                        }}
                      >
                        <span>{formatTime(msg.createdAtClient)}</span>
                        {isMine && (
                          <span style={{ color: msg.seen ? "#34b7f1" : "#667781" }}>
                            ✓✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef}></div>
          </div>

          <div
            style={{
              padding: "14px",
              borderTop: "1px solid #ececec",
              background: "#f0f2f5",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Type a message"
              style={chatInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button onClick={handleSend} style={sendBtn} disabled={sending}>
              {sending ? "..." : "➤"}
            </button>
          </div>
        </div>

        <div style={{ ...panel, marginTop: "20px" }}>
          <div style={panelTitle}>🥗 Food Support</div>

          <div
            style={{
              background: "#f4fff6",
              border: "1px solid #d8efdc",
              borderRadius: "14px",
              padding: "14px",
              fontWeight: "800",
              color: "#1f7a3d",
              marginBottom: "14px",
            }}
          >
            Today food recommendation: {getDailyFood()}
          </div>

          <details style={detailsStyle}>
            <summary style={summaryStyle}>Foods to include</summary>
            <ul style={listStyle}>
              <li>Egg, dal, milk, curd</li>
              <li>Banana, apple, seasonal fruits</li>
              <li>Spinach, carrot, leafy vegetables</li>
              <li>Nuts and enough water</li>
            </ul>
          </details>

          <details style={detailsStyle}>
            <summary style={summaryStyle}>Foods to limit</summary>
            <ul style={listStyle}>
              <li>Too many sugary snacks</li>
              <li>Soft drinks and packaged junk food</li>
              <li>Very heavy snacks before learning time</li>
              <li>Irregular meal timings</li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "16px",
        border: "1px solid #ececec",
        boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontSize: "24px" }}>{icon}</div>
      <div style={{ marginTop: "8px", color: "#666", fontWeight: "700" }}>{title}</div>
      <div style={{ marginTop: "6px", fontSize: "22px", fontWeight: "1000", color }}>
        {value}
        {value !== "--" ? "%" : ""}
      </div>
    </div>
  );
}

const panel = {
  background: "white",
  borderRadius: "18px",
  border: "1px solid #ececec",
  boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
};

const panelTitle = {
  fontWeight: "1000",
  fontSize: "18px",
  marginBottom: "8px",
  color: "#333",
  padding: "18px 18px 0",
};

const suggestionBtn = {
  padding: "8px 12px",
  borderRadius: "999px",
  border: "1px solid #d1d7db",
  background: "#ffffff",
  cursor: "pointer",
  fontWeight: "700",
  color: "#333",
};

const chatInput = {
  flex: 1,
  padding: "12px 16px",
  borderRadius: "999px",
  border: "1px solid #d1d7db",
  outline: "none",
  fontSize: "15px",
  background: "#fff",
};

const sendBtn = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  border: "none",
  background: "#00a884",
  color: "white",
  fontWeight: "900",
  fontSize: "18px",
  cursor: "pointer",
};

const detailsStyle = {
  margin: "12px 18px 0",
  border: "1px solid #ececec",
  borderRadius: "12px",
  padding: "10px 12px",
  background: "#fff",
};

const summaryStyle = {
  cursor: "pointer",
  fontWeight: "900",
  color: "#444",
};

const listStyle = {
  marginTop: "10px",
  paddingLeft: "18px",
  color: "#555",
  lineHeight: "1.8",
};*/

/*
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import { logoutUser } from "../services/authService";
import {
  sendChatMessage,
  subscribeToChatMessages,
  markMessagesSeen,
} from "../services/firestoreService";

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

function getDailyFood() {
  const foods = [
    "Egg 🥚",
    "Banana 🍌",
    "Milk 🥛",
    "Curd / Yogurt 🥣",
    "Carrot 🥕",
    "Spinach 🌿",
    "Nuts 🥜",
    "Apple 🍎",
  ];

  const today = new Date().toISOString().slice(0, 10);
  let sum = 0;
  for (let i = 0; i < today.length; i++) sum += today.charCodeAt(i);
  return foods[sum % foods.length];
}

function getLevelText(risk) {
  if (risk === "high") return "High Level 🚨";
  if (risk === "moderate") return "Moderate Level ⚠️";
  return "Low Level ✅";
}

function getDetected(summary) {
  const arr = [];

  if (summary?.dyslexia?.risk && summary.dyslexia.risk !== "low") {
    arr.push({
      title: "Dyslexia",
      icon: "📖",
      level: getLevelText(summary.dyslexia.risk),
      score: summary.readingScore ?? 0,
    });
  }

  if (summary?.dysgraphia?.risk && summary.dysgraphia.risk !== "low") {
    arr.push({
      title: "Dysgraphia",
      icon: "✍️",
      level: getLevelText(summary.dysgraphia.risk),
      score: summary.writingScore ?? 0,
    });
  }

  if (summary?.dyscalculia?.risk && summary.dyscalculia.risk !== "low") {
    arr.push({
      title: "Dyscalculia",
      icon: "🔢",
      level: getLevelText(summary.dyscalculia.risk),
      score: summary.mathScore ?? 0,
    });
  }

  if (arr.length === 0) {
    arr.push({
      title: "General Learning Support",
      icon: "🌟",
      level: "Low Level ✅",
      score: 0,
    });
  }

  return arr;
}

function getProgressDiff(current, previous) {
  if (previous == null) return { text: "New", color: "#666" };
  const diff = current - previous;
  if (diff > 0) return { text: `+${diff}% improved`, color: "#1c8c5e" };
  if (diff < 0) return { text: `${diff}% reduced`, color: "#e53935" };
  return { text: "No change", color: "#666" };
}

function formatTime(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ComparisonCard({ label, current, previous, color }) {
  const progress = getProgressDiff(current, previous);

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
      <div style={{ fontWeight: "1000", fontSize: "18px", color: "#333" }}>{label}</div>

      <div
        style={{
          marginTop: "14px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
        }}
      >
        <div
          style={{
            background: "#f8fbff",
            border: "1px solid #e6eefb",
            borderRadius: "14px",
            padding: "12px",
          }}
        >
          <div style={{ color: "#666", fontWeight: "700", fontSize: "13px" }}>Previous</div>
          <div style={{ marginTop: "6px", fontSize: "26px", fontWeight: "1000", color: "#444" }}>
            {previous ?? "--"}{previous != null ? "%" : ""}
          </div>
        </div>

        <div
          style={{
            background: "#f8fff9",
            border: "1px solid #dcefe0",
            borderRadius: "14px",
            padding: "12px",
          }}
        >
          <div style={{ color: "#666", fontWeight: "700", fontSize: "13px" }}>Current</div>
          <div style={{ marginTop: "6px", fontSize: "26px", fontWeight: "1000", color }}>
            {current}%
          </div>
        </div>
      </div>

      <div style={{ marginTop: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontWeight: "800", color: "#555" }}>Current Progress</span>
          <span style={{ fontWeight: "900", color }}>{current}%</span>
        </div>

        <div
          style={{
            width: "100%",
            height: "14px",
            background: "#edf1f7",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${current}%`,
              height: "100%",
              background: color,
              borderRadius: "999px",
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: "10px", fontWeight: "900", color: progress.color }}>
        {progress.text}
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  const navigate = useNavigate();
  const summary = useMemo(() => getReportSummary(), []);
  const previous = useMemo(() => getPreviousReportSummary(), []);
  const detected = useMemo(() => getDetected(summary), [summary]);

  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const [sending, setSending] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const chatEndRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  const quickSuggestions = [
    "My child is improving well after training.",
    "We need more guidance for home practice.",
    "Can we plan a re-test soon?",
    "Reading improved but writing still needs support.",
  ];

  useEffect(() => {
    markMessagesSeen("parent");

    const unsubscribe = subscribeToChatMessages((items) => {
      setMessages(items);
      setTimeout(() => {
        markMessagesSeen("parent");
      }, 0);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const currentUser = auth.currentUser;

    if (!chatText.trim() || sending) return;

    try {
      setSending(true);
      await sendChatMessage({
        senderUid: currentUser?.uid || storedUser?.uid || "parent-local-user",
        senderRole: "parent",
        senderName: "Parent",
        text: chatText,
      });
      setChatText("");
    } catch (error) {
      alert(`Message could not be sent: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }

    localStorage.removeItem("role");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffe8f2, #e7f0ff, #e8fff0)",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.97)",
          borderRadius: "28px",
          padding: "24px",
          boxShadow: "0 14px 35px rgba(0,0,0,0.14)",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ width: "120px" }}></div>

          <div style={{ textAlign: "center", marginBottom: "18px", flex: 1 }}>
            <div style={{ fontSize: "32px", fontWeight: "1000", color: "#3b2fb3" }}>
              LearnEase
            </div>
            <h1 style={{ margin: "8px 0 0 0", color: "#5a35ff" }}>👨‍👩‍👧 Parent Dashboard</h1>
          </div>

          <div style={{ width: "120px", display: "flex", justifyContent: "flex-end", position: "relative" }}>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "none",
                background: "linear-gradient(135deg, #6c63ff, #ff7aa2)",
                color: "white",
                fontWeight: "1000",
                fontSize: "18px",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
              }}
            >
              {(storedUser?.name || "P").charAt(0).toUpperCase()}
            </button>

            {profileOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "58px",
                  right: 0,
                  width: "230px",
                  background: "white",
                  borderRadius: "16px",
                  border: "1px solid #ececec",
                  boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                  zIndex: 10,
                }}
              >
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ fontWeight: "1000", color: "#333" }}>
                    {storedUser?.name || "Parent"}
                  </div>
                  <div style={{ color: "#777", fontSize: "13px", marginTop: "4px" }}>
                    {storedUser?.email || "Parent Account"}
                  </div>
                </div>

                <button onClick={handlePrint} style={menuBtn}>
                  🖨 Print Summary
                </button>
                <button onClick={handleLogout} style={{ ...menuBtn, color: "#d32f2f" }}>
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "14px",
          }}
        >
          <StatCard title="Reading Score" value={summary?.readingScore ?? "--"} color="#6c63ff" icon="📖" />
          <StatCard title="Writing Score" value={summary?.writingScore ?? "--"} color="#ff6584" icon="✍️" />
          <StatCard title="Math Score" value={summary?.mathScore ?? "--"} color="#1c8c5e" icon="🔢" />
          <StatCard title="Overall" value={summary?.overall?.percentage ?? "--"} color="#ff9800" icon="🧠" />
        </div>

        <div style={{ marginTop: "20px" }}>
          <div style={{ fontWeight: "1000", fontSize: "22px", color: "#333", marginBottom: "14px" }}>
            📈 Progress Overview
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <ComparisonCard
              label="Reading Progress"
              current={summary?.readingScore || 0}
              previous={previous?.readingScore ?? null}
              color="#6c63ff"
            />
            <ComparisonCard
              label="Writing Progress"
              current={summary?.writingScore || 0}
              previous={previous?.writingScore ?? null}
              color="#ff6584"
            />
            <ComparisonCard
              label="Math Progress"
              current={summary?.mathScore || 0}
              previous={previous?.mathScore ?? null}
              color="#1c8c5e"
            />
            <ComparisonCard
              label="Overall Progress"
              current={summary?.overall?.percentage || 0}
              previous={previous?.overall?.percentage ?? null}
              color="#ff9800"
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "22px",
            background: "linear-gradient(to right, #fff8d6, #ffe8f2)",
            borderRadius: "22px",
            padding: "18px",
            border: "1px solid #f5d6a1",
          }}
        >
          <div style={{ fontWeight: "1000", fontSize: "20px", color: "#333" }}>
            ✨ Current Learning Areas
          </div>

          <div
            style={{
              marginTop: "14px",
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            {detected.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "16px",
                  border: "1px solid #ddd",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontSize: "28px" }}>{item.icon}</div>
                <div style={{ fontWeight: "1000", fontSize: "18px", marginTop: "6px" }}>
                  {item.title}
                </div>
                <div style={{ marginTop: "8px", color: "#555" }}>
                  Level: <b>{item.level}</b>
                </div>
                <div style={{ marginTop: "4px", color: "#555" }}>
                  Score: <b>{item.score}</b>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...panel, marginTop: "20px", padding: "0", overflow: "hidden" }}>
          <div
            style={{
              padding: "16px 18px 10px",
              borderBottom: "1px solid #ececec",
              background: "#f8f9fb",
            }}
          >
            <div style={{ fontWeight: "1000", fontSize: "20px", color: "#222" }}>
              💬 Parent-Teacher Chat
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "12px",
              }}
            >
              {quickSuggestions.map((item) => (
                <button key={item} onClick={() => setChatText(item)} style={suggestionBtn}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              height: "380px",
              overflowY: "auto",
              padding: "18px",
              background: "#efeae2",
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.length === 0 ? (
              <div style={{ color: "#666", textAlign: "center", marginTop: "20px" }}>
                No messages yet.
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderRole === "parent";

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: isMine ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "72%",
                        minWidth: "120px",
                        padding: "10px 12px 8px",
                        borderRadius: "10px",
                        background: isMine ? "#dcf8c6" : "#ffffff",
                        boxShadow: "0 1px 1px rgba(0,0,0,0.12)",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "900",
                          fontSize: "14px",
                          color: isMine ? "#075e54" : "#5a35ff",
                          marginBottom: "4px",
                        }}
                      >
                        {isMine ? "You" : "Teacher"}
                      </div>

                      <div
                        style={{
                          color: "#222",
                          fontSize: "16px",
                          lineHeight: "1.5",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.text}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          gap: "6px",
                          marginTop: "6px",
                          fontSize: "12px",
                          color: "#667781",
                        }}
                      >
                        <span>{formatTime(msg.createdAtClient)}</span>
                        {isMine && (
                          <span style={{ color: msg.seen ? "#34b7f1" : "#667781" }}>
                            ✓✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef}></div>
          </div>

          <div
            style={{
              padding: "14px",
              borderTop: "1px solid #ececec",
              background: "#f0f2f5",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Type a message"
              style={chatInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button onClick={handleSend} style={sendBtn} disabled={sending}>
              {sending ? "..." : "➤"}
            </button>
          </div>
        </div>

        <div style={{ ...panel, marginTop: "20px" }}>
          <div style={panelTitle}>🥗 Food Support</div>

          <div
            style={{
              background: "#f4fff6",
              border: "1px solid #d8efdc",
              borderRadius: "14px",
              padding: "14px",
              fontWeight: "800",
              color: "#1f7a3d",
              marginBottom: "14px",
            }}
          >
            Today food recommendation: {getDailyFood()}
          </div>

          <details style={detailsStyle}>
            <summary style={summaryStyle}>Foods to include</summary>
            <ul style={listStyle}>
              <li>Egg, dal, milk, curd</li>
              <li>Banana, apple, seasonal fruits</li>
              <li>Spinach, carrot, leafy vegetables</li>
              <li>Nuts and enough water</li>
            </ul>
          </details>

          <details style={detailsStyle}>
            <summary style={summaryStyle}>Foods to limit</summary>
            <ul style={listStyle}>
              <li>Too many sugary snacks</li>
              <li>Soft drinks and packaged junk food</li>
              <li>Very heavy snacks before learning time</li>
              <li>Irregular meal timings</li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "16px",
        border: "1px solid #ececec",
        boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontSize: "24px" }}>{icon}</div>
      <div style={{ marginTop: "8px", color: "#666", fontWeight: "700" }}>{title}</div>
      <div style={{ marginTop: "6px", fontSize: "22px", fontWeight: "1000", color }}>
        {value}
        {value !== "--" ? "%" : ""}
      </div>
    </div>
  );
}

const panel = {
  background: "white",
  borderRadius: "18px",
  border: "1px solid #ececec",
  boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
};

const panelTitle = {
  fontWeight: "1000",
  fontSize: "18px",
  marginBottom: "8px",
  color: "#333",
  padding: "18px 18px 0",
};

const suggestionBtn = {
  padding: "8px 12px",
  borderRadius: "999px",
  border: "1px solid #d1d7db",
  background: "#ffffff",
  cursor: "pointer",
  fontWeight: "700",
  color: "#333",
};

const chatInput = {
  flex: 1,
  padding: "12px 16px",
  borderRadius: "999px",
  border: "1px solid #d1d7db",
  outline: "none",
  fontSize: "15px",
  background: "#fff",
};

const sendBtn = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  border: "none",
  background: "#00a884",
  color: "white",
  fontWeight: "900",
  fontSize: "18px",
  cursor: "pointer",
};

const detailsStyle = {
  margin: "12px 18px 0",
  border: "1px solid #ececec",
  borderRadius: "12px",
  padding: "10px 12px",
  background: "#fff",
};

const summaryStyle = {
  cursor: "pointer",
  fontWeight: "900",
  color: "#444",
};

const listStyle = {
  marginTop: "10px",
  paddingLeft: "18px",
  color: "#555",
  lineHeight: "1.8",
};

const menuBtn = {
  width: "100%",
  textAlign: "left",
  padding: "12px 16px",
  border: "none",
  background: "white",
  cursor: "pointer",
  fontWeight: "800",
  color: "#333",
  borderBottom: "1px solid #f5f5f5",
};*/

/*
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import { logoutUser } from "../services/authService";
import {
  sendChatMessage,
  subscribeToChatMessages,
  markMessagesSeen,
} from "../services/firestoreService";

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

function getDailyFood() {
  const foods = [
    "Egg 🥚",
    "Banana 🍌",
    "Milk 🥛",
    "Curd / Yogurt 🥣",
    "Carrot 🥕",
    "Spinach 🌿",
    "Nuts 🥜",
    "Apple 🍎",
  ];

  const today = new Date().toISOString().slice(0, 10);
  let sum = 0;
  for (let i = 0; i < today.length; i++) sum += today.charCodeAt(i);
  return foods[sum % foods.length];
}

function getLevelText(risk) {
  if (risk === "high") return "High Level 🚨";
  if (risk === "moderate") return "Moderate Level ⚠️";
  return "Low Level ✅";
}

function getDetected(summary) {
  const arr = [];

  if (summary?.dyslexia?.risk && summary.dyslexia.risk !== "low") {
    arr.push({
      title: "Dyslexia",
      icon: "📖",
      level: getLevelText(summary.dyslexia.risk),
      score: summary.readingScore ?? 0,
    });
  }

  if (summary?.dysgraphia?.risk && summary.dysgraphia.risk !== "low") {
    arr.push({
      title: "Dysgraphia",
      icon: "✍️",
      level: getLevelText(summary.dysgraphia.risk),
      score: summary.writingScore ?? 0,
    });
  }

  if (summary?.dyscalculia?.risk && summary.dyscalculia.risk !== "low") {
    arr.push({
      title: "Dyscalculia",
      icon: "🔢",
      level: getLevelText(summary.dyscalculia.risk),
      score: summary.mathScore ?? 0,
    });
  }

  if (arr.length === 0) {
    arr.push({
      title: "General Learning Support",
      icon: "🌟",
      level: "Low Level ✅",
      score: 0,
    });
  }

  return arr;
}

function getImprovement(current, previous) {
  if (previous == null || previous === undefined) {
    return { text: "New", color: "#666" };
  }

  const diff = current - previous;

  if (diff > 0) {
    return { text: `+${diff}%`, color: "#1c8c5e" };
  }

  if (diff < 0) {
    return { text: `${diff}%`, color: "#e53935" };
  }

  return { text: "0%", color: "#666" };
}

function formatTime(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ProgressRow({ label, current, previous, color }) {
  const improvement = getImprovement(current, previous);

  return (
    <div style={{ marginBottom: "18px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
          gap: "12px",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <div style={{ fontWeight: "900", color: "#333" }}>{label}</div>
        <div style={{ color: "#666", fontWeight: "700" }}>
          Previous: <span style={{ color: "#333", fontWeight: "900" }}>{previous ?? "--"}{previous != null ? "%" : ""}</span>
        </div>
        <div style={{ color: "#666", fontWeight: "700" }}>
          Current: <span style={{ color, fontWeight: "900" }}>{current}%</span>
        </div>
        <div style={{ fontWeight: "900", color: improvement.color }}>
          {improvement.text}
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: "14px",
          background: "#edf1f7",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${current}%`,
            height: "100%",
            background: color,
            borderRadius: "999px",
          }}
        ></div>
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  const navigate = useNavigate();
  const summary = useMemo(() => getReportSummary(), []);
  const previous = useMemo(() => getPreviousReportSummary(), []);
  const detected = useMemo(() => getDetected(summary), [summary]);

  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const [sending, setSending] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const chatEndRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  const quickSuggestions = [
    "My child is improving well after training.",
    "We need more guidance for home practice.",
    "Can we plan a re-test soon?",
    "Reading improved but writing still needs support.",
  ];

  useEffect(() => {
    markMessagesSeen("parent");

    const unsubscribe = subscribeToChatMessages((items) => {
      setMessages(items);
      setTimeout(() => {
        markMessagesSeen("parent");
      }, 0);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const currentUser = auth.currentUser;

    if (!chatText.trim() || sending) return;

    try {
      setSending(true);
      await sendChatMessage({
        senderUid: currentUser?.uid || storedUser?.uid || "parent-local-user",
        senderRole: "parent",
        senderName: "Parent",
        text: chatText,
      });
      setChatText("");
    } catch (error) {
      alert(`Message could not be sent: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }

    localStorage.removeItem("role");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffe8f2, #e7f0ff, #e8fff0)",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.97)",
          borderRadius: "28px",
          padding: "24px",
          boxShadow: "0 14px 35px rgba(0,0,0,0.14)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "start",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button onClick={() => window.print()} style={printBtn}>
              🖨 Print Summary
            </button>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "1000", color: "#3b2fb3" }}>
              LearnEase
            </div>
            <h1 style={{ margin: "8px 0 0 0", color: "#5a35ff" }}>
              👨‍👩‍👧 Parent Dashboard
            </h1>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", position: "relative" }}>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              style={profileBtn}
            >
              {(storedUser?.name || "P").charAt(0).toUpperCase()}
            </button>

            {profileOpen && (
              <div style={profileMenu}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ fontWeight: "1000", color: "#333" }}>
                    {storedUser?.name || "Parent"}
                  </div>
                  <div style={{ color: "#777", fontSize: "13px", marginTop: "4px" }}>
                    {storedUser?.email || "Parent Account"}
                  </div>
                </div>

                <button onClick={handleLogout} style={{ ...menuBtn, color: "#d32f2f" }}>
                  🚪 Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "14px",
          }}
        >
          <StatCard title="Reading Score" value={summary?.readingScore ?? "--"} color="#6c63ff" icon="📖" />
          <StatCard title="Writing Score" value={summary?.writingScore ?? "--"} color="#ff6584" icon="✍️" />
          <StatCard title="Math Score" value={summary?.mathScore ?? "--"} color="#1c8c5e" icon="🔢" />
          <StatCard title="Overall" value={summary?.overall?.percentage ?? "--"} color="#ff9800" icon="🧠" />
        </div>

        <div style={{ ...panel, marginTop: "20px" }}>
          <div style={panelTitle}>📈 Progress Overview</div>

          <div style={{ padding: "0 18px 18px" }}>
            <ProgressRow
              label="Reading"
              current={summary?.readingScore || 0}
              previous={previous?.readingScore ?? null}
              color="#6c63ff"
            />
            <ProgressRow
              label="Writing"
              current={summary?.writingScore || 0}
              previous={previous?.writingScore ?? null}
              color="#ff6584"
            />
            <ProgressRow
              label="Math"
              current={summary?.mathScore || 0}
              previous={previous?.mathScore ?? null}
              color="#1c8c5e"
            />
            <ProgressRow
              label="Overall"
              current={summary?.overall?.percentage || 0}
              previous={previous?.overall?.percentage ?? null}
              color="#ff9800"
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "22px",
            background: "linear-gradient(to right, #fff8d6, #ffe8f2)",
            borderRadius: "22px",
            padding: "18px",
            border: "1px solid #f5d6a1",
          }}
        >
          <div style={{ fontWeight: "1000", fontSize: "20px", color: "#333" }}>
            ✨ Current Learning Areas
          </div>

          <div
            style={{
              marginTop: "14px",
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            {detected.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "16px",
                  border: "1px solid #ddd",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontSize: "28px" }}>{item.icon}</div>
                <div style={{ fontWeight: "1000", fontSize: "18px", marginTop: "6px" }}>
                  {item.title}
                </div>
                <div style={{ marginTop: "8px", color: "#555" }}>
                  Level: <b>{item.level}</b>
                </div>
                <div style={{ marginTop: "4px", color: "#555" }}>
                  Score: <b>{item.score}</b>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...panel, marginTop: "20px", padding: "0", overflow: "hidden" }}>
          <div
            style={{
              padding: "16px 18px 10px",
              borderBottom: "1px solid #ececec",
              background: "#f8f9fb",
            }}
          >
            <div style={{ fontWeight: "1000", fontSize: "20px", color: "#222" }}>
              💬 Parent-Teacher Chat
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "12px",
              }}
            >
              {quickSuggestions.map((item) => (
                <button key={item} onClick={() => setChatText(item)} style={suggestionBtn}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              height: "380px",
              overflowY: "auto",
              padding: "18px",
              background: "#efeae2",
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.length === 0 ? (
              <div style={{ color: "#666", textAlign: "center", marginTop: "20px" }}>
                No messages yet.
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderRole === "parent";

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: isMine ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "72%",
                        minWidth: "120px",
                        padding: "10px 12px 8px",
                        borderRadius: "10px",
                        background: isMine ? "#dcf8c6" : "#ffffff",
                        boxShadow: "0 1px 1px rgba(0,0,0,0.12)",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "900",
                          fontSize: "14px",
                          color: isMine ? "#075e54" : "#5a35ff",
                          marginBottom: "4px",
                        }}
                      >
                        {isMine ? "You" : "Teacher"}
                      </div>

                      <div
                        style={{
                          color: "#222",
                          fontSize: "16px",
                          lineHeight: "1.5",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.text}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          gap: "6px",
                          marginTop: "6px",
                          fontSize: "12px",
                          color: "#667781",
                        }}
                      >
                        <span>{formatTime(msg.createdAtClient)}</span>
                        {isMine && (
                          <span style={{ color: msg.seen ? "#34b7f1" : "#667781" }}>
                            ✓✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef}></div>
          </div>

          <div
            style={{
              padding: "14px",
              borderTop: "1px solid #ececec",
              background: "#f0f2f5",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Type a message"
              style={chatInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button onClick={handleSend} style={sendBtn} disabled={sending}>
              {sending ? "..." : "➤"}
            </button>
          </div>
        </div>

        <div style={{ ...panel, marginTop: "20px" }}>
          <div style={panelTitle}>🥗 Food Support</div>

          <div
            style={{
              background: "#f4fff6",
              border: "1px solid #d8efdc",
              borderRadius: "14px",
              padding: "14px",
              fontWeight: "800",
              color: "#1f7a3d",
              margin: "0 18px 14px",
            }}
          >
            Today food recommendation: {getDailyFood()}
          </div>

          <details style={detailsStyle}>
            <summary style={summaryStyle}>Foods to include</summary>
            <ul style={listStyle}>
              <li>Egg, dal, milk, curd</li>
              <li>Banana, apple, seasonal fruits</li>
              <li>Spinach, carrot, leafy vegetables</li>
              <li>Nuts and enough water</li>
            </ul>
          </details>

          <details style={detailsStyle}>
            <summary style={summaryStyle}>Foods to limit</summary>
            <ul style={listStyle}>
              <li>Too many sugary snacks</li>
              <li>Soft drinks and packaged junk food</li>
              <li>Very heavy snacks before learning time</li>
              <li>Irregular meal timings</li>
            </ul>
          </details>

          <div style={{ height: "18px" }}></div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "16px",
        border: "1px solid #ececec",
        boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontSize: "24px" }}>{icon}</div>
      <div style={{ marginTop: "8px", color: "#666", fontWeight: "700" }}>{title}</div>
      <div style={{ marginTop: "6px", fontSize: "22px", fontWeight: "1000", color }}>
        {value}
        {value !== "--" ? "%" : ""}
      </div>
    </div>
  );
}

const panel = {
  background: "white",
  borderRadius: "18px",
  border: "1px solid #ececec",
  boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
};

const panelTitle = {
  fontWeight: "1000",
  fontSize: "18px",
  marginBottom: "8px",
  color: "#333",
  padding: "18px 18px 0",
};

const suggestionBtn = {
  padding: "8px 12px",
  borderRadius: "999px",
  border: "1px solid #d1d7db",
  background: "#ffffff",
  cursor: "pointer",
  fontWeight: "700",
  color: "#333",
};

const chatInput = {
  flex: 1,
  padding: "12px 16px",
  borderRadius: "999px",
  border: "1px solid #d1d7db",
  outline: "none",
  fontSize: "15px",
  background: "#fff",
};

const sendBtn = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  border: "none",
  background: "#00a884",
  color: "white",
  fontWeight: "900",
  fontSize: "18px",
  cursor: "pointer",
};

const detailsStyle = {
  margin: "12px 18px 0",
  border: "1px solid #ececec",
  borderRadius: "12px",
  padding: "10px 12px",
  background: "#fff",
};

const summaryStyle = {
  cursor: "pointer",
  fontWeight: "900",
  color: "#444",
};

const listStyle = {
  marginTop: "10px",
  paddingLeft: "18px",
  color: "#555",
  lineHeight: "1.8",
};

const profileBtn = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  border: "none",
  background: "linear-gradient(135deg, #6c63ff, #ff7aa2)",
  color: "white",
  fontWeight: "1000",
  fontSize: "18px",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
};

const profileMenu = {
  position: "absolute",
  top: "58px",
  right: 0,
  width: "240px",
  background: "white",
  borderRadius: "16px",
  border: "1px solid #ececec",
  boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
  overflow: "hidden",
  zIndex: 10,
};

const menuBtn = {
  width: "100%",
  textAlign: "left",
  padding: "12px 16px",
  border: "none",
  background: "white",
  cursor: "pointer",
  fontWeight: "800",
  color: "#333",
};

const printBtn = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "none",
  background: "#5a35ff",
  color: "white",
  fontWeight: "900",
  cursor: "pointer",
};*/








import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import { logoutUser } from "../services/authService";
import { getUserProfile, getChildrenByParentName } from "../services/firestoreService";
import FloatingChat from "../components/FloatingChat";

function getDailyFood() {
  const foods = ["Egg 🥚","Banana 🍌","Milk 🥛","Curd / Yogurt 🥣","Carrot 🥕","Spinach 🌿","Nuts 🥜","Apple 🍎"];
  const today = new Date().toISOString().slice(0, 10);
  let sum = 0;
  for (let i = 0; i < today.length; i++) sum += today.charCodeAt(i);
  return foods[sum % foods.length];
}
function getLevelText(risk) {
  if (risk === "high") return "High Level 🚨";
  if (risk === "moderate") return "Moderate Level ⚠️";
  return "Low Level ✅";
}
function getDetected(summary) {
  const arr = [];
  if (summary?.dyslexia?.risk && summary.dyslexia.risk !== "low")
    arr.push({ title: "Dyslexia", icon: "📖", level: getLevelText(summary.dyslexia.risk), score: summary.readingScore ?? 0 });
  if (summary?.dysgraphia?.risk && summary.dysgraphia.risk !== "low")
    arr.push({ title: "Dysgraphia", icon: "✍️", level: getLevelText(summary.dysgraphia.risk), score: summary.writingScore ?? 0 });
  if (summary?.dyscalculia?.risk && summary.dyscalculia.risk !== "low")
    arr.push({ title: "Dyscalculia", icon: "🔢", level: getLevelText(summary.dyscalculia.risk), score: summary.mathScore ?? 0 });
  if (arr.length === 0)
    arr.push({ title: "General Learning Support", icon: "🌟", level: "Low Level ✅", score: 0 });
  return arr;
}
function getImprovement(current, previous) {
  if (previous == null) return { text: "New", color: "#666" };
  const diff = current - previous;
  if (diff > 0) return { text: `+${diff}%`, color: "#1c8c5e" };
  if (diff < 0) return { text: `${diff}%`, color: "#e53935" };
  return { text: "0%", color: "#666" };
}
function getRisk(score) {
  if (score === null || score === undefined) return { label: "No test yet", color: "#aaa" };
  if (score < 40) return { label: "High Risk 🚨", color: "#e53935" };
  if (score < 70) return { label: "Moderate ⚠️", color: "#ff9800" };
  return { label: "Low Risk ✅", color: "#1c8c5e" };
}

function ProgressRow({ label, current, previous, color }) {
  const improvement = getImprovement(current, previous);
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 0.7fr", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ fontWeight: "900", color: "#333" }}>{label}</div>
        <div style={{ color: "#666", fontWeight: "700" }}>Prev: <span style={{ color: "#333", fontWeight: "900" }}>{previous ?? "--"}{previous != null ? "%" : ""}</span></div>
        <div style={{ color: "#666", fontWeight: "700" }}>Now: <span style={{ color, fontWeight: "900" }}>{current}%</span></div>
        <div style={{ fontWeight: "900", color: improvement.color }}>{improvement.text}</div>
      </div>
      <div style={{ width: "100%", height: "14px", background: "#edf1f7", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ width: `${current}%`, height: "100%", background: color, borderRadius: "999px" }} />
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [children, setChildren] = useState([]);
  const [selectedUid, setSelectedUid] = useState("");
  const [loading, setLoading] = useState(true);

  const profileEmail = auth.currentUser?.email ||
    JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.email || "";

  const child = children.find((c) => c.uid === selectedUid) || null;
  const summary = child?.reportSummary || null;
  const previous = child?.previousReportSummary || null;
  const detected = useMemo(() => getDetected(summary), [summary]);

  const parentSuggestions = [
    "My child is improving well after training.",
    "We need more guidance for home practice.",
    "Can we plan a re-test soon?",
    "Reading improved but writing still needs support.",
  ];

  useEffect(() => {
    const uid = auth.currentUser?.uid ||
      JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.uid;
    if (!uid) { setLoading(false); return; }

    getUserProfile(uid)
      .then((profile) => {
        const parentName = profile?.parentName || "";
        if (!parentName) { setLoading(false); return Promise.resolve([]); }
        return getChildrenByParentName(parentName);
      })
      .then((kids) => {
        if (kids && kids.length > 0) {
          setChildren(kids);
          setSelectedUid(kids[0].uid);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try { await logoutUser(); } catch { /* ignore */ }
    localStorage.removeItem("role");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <>
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ffe8f2, #e7f0ff, #e8fff0)", padding: "20px" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto", background: "rgba(255,255,255,0.97)", borderRadius: "28px", padding: "24px", boxShadow: "0 14px 35px rgba(0,0,0,0.14)", position: "relative" }}>

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "start", marginBottom: "18px" }}>
          <div>
            <button onClick={() => window.print()} style={printBtn}>🖨 Print Summary</button>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "1000", color: "#3b2fb3" }}>LearnEase</div>
            <h1 style={{ margin: "8px 0 0 0", color: "#5a35ff" }}>👨‍👩‍👧 Parent Dashboard</h1>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", position: "relative" }}>
            <button onClick={() => setProfileOpen((p) => !p)} style={profileBtn}>P</button>
            {profileOpen && (
              <div style={profileMenu}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ fontWeight: "1000", color: "#333" }}>Parent</div>
                  <div style={{ color: "#777", fontSize: "13px", marginTop: "4px" }}>{profileEmail}</div>
                </div>
                <button onClick={handleLogout} style={{ ...menuBtn, color: "#d32f2f" }}>🚪 Log Out</button>
              </div>
            )}
          </div>
        </div>

        {/* Child info bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "linear-gradient(to right, #fff0f8, #f0edff)", borderRadius: "16px", padding: "14px 18px", marginBottom: "20px", border: "1px solid #f0c8e0" }}>
          <span style={{ fontSize: "22px" }}>👧</span>
          <span style={{ fontWeight: "900", color: "#c2185b", fontSize: "16px", whiteSpace: "nowrap" }}>My Child:</span>
          {loading ? (
            <span style={{ color: "#888", fontSize: "14px" }}>Loading...</span>
          ) : children.length === 0 ? (
            <span style={{ color: "#888", fontSize: "14px" }}>No children linked yet. Make sure your child used your name during signup.</span>
          ) : children.length === 1 ? (
            <span style={{ fontWeight: "1000", fontSize: "17px", color: "#333" }}>
              {child?.studentName || child?.email || "—"}
              {child?.className ? <span style={{ color: "#888", fontWeight: "700", fontSize: "14px" }}> · Class {child.className}</span> : ""}
              {child?.schoolName ? <span style={{ color: "#aaa", fontWeight: "700", fontSize: "13px" }}> · {child.schoolName}</span> : ""}
            </span>
          ) : (
            <select
              value={selectedUid}
              onChange={(e) => setSelectedUid(e.target.value)}
              style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #f0c8e0", fontSize: "15px", fontWeight: "800", color: "#333", background: "white", cursor: "pointer", outline: "none" }}
            >
              {children.map((c) => (
                <option key={c.uid} value={c.uid}>
                  {c.studentName || c.email}{c.className ? ` — Class ${c.className}` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "14px" }}>
          <StatCard title="Reading Score" value={summary?.readingScore ?? "--"} color="#6c63ff" icon="📖" />
          <StatCard title="Writing Score" value={summary?.writingScore ?? "--"} color="#ff6584" icon="✍️" />
          <StatCard title="Math Score" value={summary?.mathScore ?? "--"} color="#1c8c5e" icon="🔢" />
          <StatCard title="Overall" value={summary?.overall?.percentage ?? "--"} color="#ff9800" icon="🧠" />
        </div>

        {/* Progress */}
        <div style={{ ...panel, marginTop: "20px" }}>
          <div style={panelTitle}>📈 {child?.studentName ? `${child.studentName}'s Progress` : "Progress Overview"}</div>
          <div style={{ padding: "0 18px 18px" }}>
            <ProgressRow label="Reading" current={summary?.readingScore || 0} previous={previous?.readingScore ?? null} color="#6c63ff" />
            <ProgressRow label="Writing" current={summary?.writingScore || 0} previous={previous?.writingScore ?? null} color="#ff6584" />
            <ProgressRow label="Math" current={summary?.mathScore || 0} previous={previous?.mathScore ?? null} color="#1c8c5e" />
            <ProgressRow label="Overall" current={summary?.overall?.percentage || 0} previous={previous?.overall?.percentage ?? null} color="#ff9800" />
          </div>
        </div>

        {/* Learning areas */}
        <div style={{ marginTop: "22px", background: "linear-gradient(to right, #fff8d6, #ffe8f2)", borderRadius: "22px", padding: "18px", border: "1px solid #f5d6a1" }}>
          <div style={{ fontWeight: "1000", fontSize: "20px", color: "#333" }}>✨ Current Learning Areas</div>
          <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px" }}>
            {detected.map((item, index) => {
              const risk = getRisk(item.score);
              return (
                <div key={index} style={{ background: "white", borderRadius: "18px", padding: "16px", border: "1px solid #ddd", boxShadow: "0 8px 18px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: "28px" }}>{item.icon}</div>
                  <div style={{ fontWeight: "1000", fontSize: "18px", marginTop: "6px" }}>{item.title}</div>
                  <div style={{ marginTop: "8px", color: "#555" }}>Level: <b>{item.level}</b></div>
                  <div style={{ marginTop: "4px", fontWeight: "900", color: risk.color }}>Score: {item.score}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Food Support */}
        <div style={{ ...panel, marginTop: "20px" }}>
          <div style={panelTitle}>🥗 Food Support</div>
          <div style={{ background: "#f4fff6", border: "1px solid #d8efdc", borderRadius: "14px", padding: "14px", fontWeight: "800", color: "#1f7a3d", margin: "0 18px 14px" }}>
            Today food recommendation: {getDailyFood()}
          </div>
          <details style={detailsStyle}>
            <summary style={summaryStyle}>Foods to include</summary>
            <ul style={listStyle}>
              <li>Egg, dal, milk, curd</li>
              <li>Banana, apple, seasonal fruits</li>
              <li>Spinach, carrot, leafy vegetables</li>
              <li>Nuts and enough water</li>
            </ul>
          </details>
          <details style={detailsStyle}>
            <summary style={summaryStyle}>Foods to limit</summary>
            <ul style={listStyle}>
              <li>Too many sugary snacks</li>
              <li>Soft drinks and packaged junk food</li>
              <li>Very heavy snacks before learning time</li>
              <li>Irregular meal timings</li>
            </ul>
          </details>
          <div style={{ height: "18px" }}></div>
        </div>

      </div>
    </div>

    <FloatingChat
      senderRole="parent"
      otherLabel="Teacher"
      suggestions={parentSuggestions}
    />
    </>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div style={{ background: "white", borderRadius: "18px", padding: "16px", border: "1px solid #ececec", boxShadow: "0 8px 18px rgba(0,0,0,0.05)" }}>
      <div style={{ fontSize: "24px" }}>{icon}</div>
      <div style={{ marginTop: "8px", color: "#666", fontWeight: "700" }}>{title}</div>
      <div style={{ marginTop: "6px", fontSize: "22px", fontWeight: "1000", color }}>
        {value}{value !== "--" ? "%" : ""}
      </div>
    </div>
  );
}

const panel = { background: "white", borderRadius: "18px", border: "1px solid #ececec", boxShadow: "0 8px 18px rgba(0,0,0,0.05)" };
const panelTitle = { fontWeight: "1000", fontSize: "18px", marginBottom: "8px", color: "#333", padding: "18px 18px 0" };
const detailsStyle = { margin: "12px 18px 0", border: "1px solid #ececec", borderRadius: "12px", padding: "10px 12px", background: "#fff" };
const summaryStyle = { cursor: "pointer", fontWeight: "900", color: "#444" };
const listStyle = { marginTop: "10px", paddingLeft: "18px", color: "#555", lineHeight: "1.8" };
const profileBtn = { width: "48px", height: "48px", borderRadius: "50%", border: "none", background: "linear-gradient(135deg, #6c63ff, #ff7aa2)", color: "white", fontWeight: "1000", fontSize: "18px", cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.12)" };
const profileMenu = { position: "absolute", top: "58px", right: 0, width: "240px", background: "white", borderRadius: "16px", border: "1px solid #ececec", boxShadow: "0 14px 30px rgba(0,0,0,0.12)", overflow: "hidden", zIndex: 10 };
const menuBtn = { width: "100%", textAlign: "left", padding: "12px 16px", border: "none", background: "white", cursor: "pointer", fontWeight: "800", color: "#333" };
const printBtn = { padding: "10px 14px", borderRadius: "12px", border: "none", background: "#5a35ff", color: "white", fontWeight: "900", cursor: "pointer" };
