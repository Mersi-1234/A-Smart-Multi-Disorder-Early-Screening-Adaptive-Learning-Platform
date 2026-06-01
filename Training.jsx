/*import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DyslexiaTraining from "../modules/training/DyslexiaTraining";
import DysgraphiaTraining from "../modules/training/DysgraphiaTraining";
import DyscalculiaTraining from "../modules/training/DyscalculiaTraining";
import { buildTrainingPlan } from "../modules/training/TrainingLogic";

function levelText(risk) {
  if (risk === "high") return "High Level";
  if (risk === "moderate") return "Moderate Level";
  return "Low Level";
}

function screenTimeText(risk) {
  if (risk === "high") return "5–8 minutes only";
  if (risk === "moderate") return "8–10 minutes";
  return "10–12 minutes";
}

function getTodayFood() {
  const foods = [
    "Egg 🥚",
    "Banana 🍌",
    "Milk 🥛",
    "Curd / Yogurt 🥣",
    "Carrot 🥕",
    "Spinach 🌿",
    "Nuts 🥜",
  ];
  const index = new Date().getDate() % foods.length;
  return foods[index];
}

function getAvoidFoods() {
  return [
    "Too many sugary snacks before study time",
    "Junk food every day",
    "Soft drinks / cola often",
    "Heavy snacks during training time",
  ];
}

function getHelpfulFoods() {
  return [
    "Protein-rich foods like egg, dal, milk",
    "Fruits and vegetables",
    "Water and proper hydration",
    "Balanced homemade meals",
  ];
}

function getParentTasks(type, risk, weakSkills = []) {
  const tasks = [];

  if (type === "dyslexia") {
    if (weakSkills.includes("letter-confusion")) {
      tasks.push("Practice b/d and p/q using flash cards and finger pointing.");
    }
    if (weakSkills.includes("phonics")) {
      tasks.push("Say simple sounds and ask child to match the correct starting letter.");
    }
    if (weakSkills.includes("word-recognition")) {
      tasks.push("Read 3 short words daily and repeat slowly.");
    }
    if (weakSkills.includes("sentence-comprehension")) {
      tasks.push("Read one short sentence and ask one simple question.");
    }
    if (weakSkills.includes("oral-reading")) {
      tasks.push("Use read-aloud and ask child to repeat clearly.");
    }
  }

  if (type === "dysgraphia") {
    if (weakSkills.includes("letter-formation")) {
      tasks.push("Do dotted tracing of letters before free writing.");
    }
    if (weakSkills.includes("writing-speed")) {
      tasks.push("Keep writing short and neat, without rushing.");
    }
    if (weakSkills.includes("attention-support")) {
      tasks.push("Give short writing sessions with breaks.");
    }
  }

  if (type === "dyscalculia") {
    if (weakSkills.includes("number-recognition")) {
      tasks.push("Show number cards and ask the child to identify them.");
    }
    if (weakSkills.includes("counting")) {
      tasks.push("Count home objects like spoons, fruits, or pencils.");
    }
    if (weakSkills.includes("number-comparison")) {
      tasks.push("Practice bigger/smaller using two numbers.");
    }
    if (weakSkills.includes("sequencing")) {
      tasks.push("Complete number sequences like 2, 4, 6, __.");
    }
    if (weakSkills.includes("basic-arithmetic")) {
      tasks.push("Use fingers or beads for simple addition practice.");
    }
  }

  if (risk === "high") {
    tasks.push("Keep sessions very short and give full support.");
  } else if (risk === "moderate") {
    tasks.push("Repeat the same activity with calm encouragement.");
  } else {
    tasks.push("Continue light reinforcement and confidence-building.");
  }

  return tasks;
}

function getVideoRefs(type) {
  const refs = {
    dyslexia: [
      {
        title: "Phonics sound practice",
        desc: "Helps with sound-letter matching and pronunciation.",
        query: "phonics sound practice for kids",
      },
      {
        title: "Letter confusion correction",
        desc: "Useful for b/d and p/q confusion.",
        query: "b d p q confusion activities for kids",
      },
      {
        title: "Slow oral reading",
        desc: "Supports clear step-by-step reading.",
        query: "slow oral reading for children",
      },
    ],
    dysgraphia: [
      {
        title: "Fine motor warm-up",
        desc: "Improves hand control before writing.",
        query: "fine motor warm up handwriting kids",
      },
      {
        title: "Letter tracing practice",
        desc: "Helps children trace letters clearly.",
        query: "letter tracing activities for kids",
      },
      {
        title: "Pencil control and posture",
        desc: "Supports writing control and comfort.",
        query: "pencil grip posture handwriting children",
      },
    ],
    dyscalculia: [
      {
        title: "Counting with objects",
        desc: "Improves quantity understanding.",
        query: "counting objects for kids learning",
      },
      {
        title: "Number recognition games",
        desc: "Builds confidence with numbers.",
        query: "number recognition games for kids",
      },
      {
        title: "Simple addition visuals",
        desc: "Makes early arithmetic easier to understand.",
        query: "simple addition with visuals for children",
      },
    ],
  };

  return refs[type] || [];
}

function Pill({ children }) {
  return (
    <span
      style={{
        background: "#eef1ff",
        color: "#4730c9",
        padding: "8px 12px",
        borderRadius: "999px",
        fontWeight: "900",
        fontSize: "13px",
      }}
    >
      {children}
    </span>
  );
}

function openYouTubeSearch(query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  window.open(url, "_blank");
}

export default function Training() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [active, setActive] = useState("");

  useEffect(() => {
    const data = buildTrainingPlan();
    setPlan(data);

    if (data?.weakAreas?.length > 0) {
      setActive(data.weakAreas[0].trainingType);
    }
  }, []);

  const activePlan = useMemo(() => {
    return plan?.weakAreas?.find((item) => item.trainingType === active) || null;
  }, [plan, active]);

  if (!plan) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h2>Training Page</h2>
        <p>Loading training plan...</p>
      </div>
    );
  }

  if (!plan.hasAnyTraining) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h2>Training Page</h2>
        <p>No focused training is needed right now.</p>
        <button onClick={() => navigate("/report")}>Go to Report</button>
      </div>
    );
  }

  const activeRisk = activePlan?.unlockedLevel || "low";
  const parentTasks = getParentTasks(active, activeRisk, activePlan?.weakSkills || []);
  const videoRefs = getVideoRefs(active);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffd6e8 0%, #d7e8ff 45%, #d8ffe1 100%)",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={bubbleOne}></div>
      <div style={bubbleTwo}></div>
      <div style={bubbleThree}></div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.96)",
          borderRadius: "28px",
          padding: "24px",
          boxShadow: "0 14px 35px rgba(0,0,0,0.14)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ margin: 0, color: "#5a35ff", fontSize: "32px" }}>
              🎨 Personalized Training Plan
            </h1>
            <p style={{ marginTop: "8px", color: "#555", fontWeight: "600" }}>
              Training now changes by both weak area and exact skill gap.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/report")} style={ghostBtn}>
              ⬅ Back to Report
            </button>
            <button onClick={() => window.print()} style={ghostBtn}>
              🖨 Print Plan
            </button>
            <button
              onClick={() => {
                localStorage.setItem("retestRequired", "true");
                navigate("/test");
              }}
              style={primaryBtn}
            >
              🔁 Start Re-test
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: "18px",
            background: "linear-gradient(to right, #fff8d6, #ffe8f2)",
            borderRadius: "22px",
            padding: "16px",
            border: "1px solid #f5d6a1",
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontWeight: "900", fontSize: "19px" }}>✨ Weak Area Training</div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "10px" }}>
              {plan.weakAreas.map((item) => (
                <div
                  key={item.trainingType}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "10px 16px",
                    fontWeight: "900",
                    border: "1px solid #ddd",
                  }}
                >
                  {item.trainingType === "dyslexia" && "📖 Dyslexia"}
                  {item.trainingType === "dysgraphia" && "✍️ Dysgraphia"}
                  {item.trainingType === "dyscalculia" && "🔢 Dyscalculia"} — {levelText(item.unlockedLevel)}
                </div>
              ))}
            </div>

            {plan.strongAreas.length > 0 && (
              <div style={{ marginTop: "12px", color: "#555", fontWeight: "700" }}>
                Strong areas skipped: {plan.strongAreas.join(", ")}
              </div>
            )}
          </div>

          <div style={{ fontSize: "54px", lineHeight: 1 }}>🧠📚⭐</div>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "18px" }}>
          {plan.weakAreas.map((item) => (
            <button
              key={item.trainingType}
              onClick={() => setActive(item.trainingType)}
              style={{
                padding: "14px 18px",
                borderRadius: "18px",
                border: active === item.trainingType ? "3px solid #5a35ff" : "1px solid #ddd",
                background: active === item.trainingType ? "#f0ecff" : "white",
                fontWeight: "900",
                cursor: "pointer",
                minWidth: "180px",
                boxShadow: active === item.trainingType ? "0 8px 20px rgba(90,53,255,0.15)" : "none",
              }}
            >
              {item.trainingType === "dyslexia" && "📖 Dyslexia"}
              {item.trainingType === "dysgraphia" && "✍️ Dysgraphia"}
              {item.trainingType === "dyscalculia" && "🔢 Dyscalculia"}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "50fr 0.8fr",
            gap: "18px",
            marginTop: "18px",
            alignItems: "start",
          }}
        >
          <div>
            <div style={bigCard}>
              <div style={titleRow}>🎮 Child Activity Plan</div>

              <div
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <Pill>Level: {levelText(activeRisk)}</Pill>
                <Pill>Screen time: {screenTimeText(activeRisk)}</Pill>
                <Pill>
                  Weak skills: {(activePlan?.weakSkills || []).join(", ") || "general support"}
                </Pill>
              </div>

              {active === "dyslexia" && (
                <DyslexiaTraining
                  unlockedLevel={activeRisk}
                  weakSkills={activePlan?.weakSkills || []}
                />
              )}

              {active === "dysgraphia" && (
                <DysgraphiaTraining
                  unlockedLevel={activeRisk}
                  weakSkills={activePlan?.weakSkills || []}
                />
              )}

              {active === "dyscalculia" && (
                <DyscalculiaTraining
                  unlockedLevel={activeRisk}
                  weakSkills={activePlan?.weakSkills || []}
                />
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <div
                style={{
                  ...sideCard,
                  marginBottom: 0,
                  background: "linear-gradient(180deg, #ffffff, #fff8fb)",
                  border: "1px solid #f0dce6",
                }}
              >
                <div style={titleRow}>👨‍👩‍👧 Parent Support Activity</div>

                <ul style={{ paddingLeft: "18px", lineHeight: "1.9", marginBottom: "18px" }}>
                  {parentTasks.map((item, index) => (
                    <li key={index} style={{ marginBottom: "8px" }}>
                      {item}
                    </li>
                  ))}
                </ul>

                <div
                  style={{
                    borderTop: "1px solid #ececec",
                    paddingTop: "14px",
                  }}
                >
                  <div style={{ ...titleRow, fontSize: "17px" }}>🎥 Helpful Video References</div>

                  <div style={{ display: "grid", gap: "14px" }}>
                    {videoRefs.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          background: "#fff",
                          border: "1px solid #eee",
                          borderRadius: "14px",
                          padding: "12px",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
                        }}
                      >
                        <div style={{ fontWeight: "900", marginBottom: "4px", fontSize: "17px" }}>
                          {item.title}
                        </div>
                        <div style={{ color: "#555", fontSize: "16px", lineHeight: "1.6" }}>
                          {item.desc}
                        </div>
                        <button onClick={() => openYouTubeSearch(item.query)} style={linkBtn}>
                          ▶ Open Video Reference
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  ...sideCard,
                  marginBottom: 0,
                  background: "linear-gradient(180deg, #ffffff, #f8fff9)",
                  border: "1px solid #dff1e3",
                }}
              >
                <div style={titleRow}>🥗 Today’s Food Support</div>

                <div
                  style={{
                    background: "#f4fff6",
                    border: "1px solid #d8efdc",
                    borderRadius: "14px",
                    padding: "12px",
                    marginBottom: "16px",
                    fontWeight: "700",
                  }}
                >
                  <span style={{ color: "#444" }}>Today suggest:</span>{" "}
                  <span style={{ color: "#1f7a3d", fontWeight: "900" }}>{getTodayFood()}</span>
                </div>

                <p style={{ marginTop: "4px", fontWeight: "800" }}>Good foods to include:</p>
                <ul style={{ paddingLeft: "18px", lineHeight: "2", marginBottom: "16px", fontSize: "17px" }}>
                  {getHelpfulFoods().map((item, index) => (
                    <li key={index} style={{ marginBottom: "6px" }}>
                      {item}
                    </li>
                  ))}
                </ul>

                <p style={{ marginTop: "10px", fontWeight: "800" }}>Foods / habits to limit:</p>
                <ul style={{ paddingLeft: "18px", lineHeight: "1.8" }}>
                  {getAvoidFoods().map((item, index) => (
                    <li key={index} style={{ marginBottom: "6px" }}>
                      {item}
                    </li>
                  ))}
                </ul>

                <p style={{ marginTop: "12px", color: "#666", fontSize: "13px", lineHeight: "1.5" }}>
                  These support learning and routine. For special diet advice, consult a doctor or dietitian.
                </p>
              </div>
            </div>
          </div>

          <div></div>
        </div>
      </div>
    </div>
  );
}

const bubbleOne = {
  position: "absolute",
  top: "40px",
  left: "40px",
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.28)",
  zIndex: 1,
};

const bubbleTwo = {
  position: "absolute",
  bottom: "50px",
  right: "60px",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.22)",
  zIndex: 1,
};

const bubbleThree = {
  position: "absolute",
  top: "220px",
  right: "180px",
  width: "110px",
  height: "110px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.25)",
  zIndex: 1,
};

const bigCard = {
  background: "linear-gradient(to bottom right, #ffffff, #f8fbff)",
  borderRadius: "22px",
  padding: "18px",
  border: "1px solid #e8e8e8",
  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
};

const sideCard = {
  background: "#fff",
  borderRadius: "18px",
  padding: "16px",
  border: "1px solid #ececec",
  marginBottom: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
};

const titleRow = {
  fontWeight: "1000",
  fontSize: "22px",
  marginBottom: "12px",
  color: "#333",
};

const primaryBtn = {
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
  background: "#5a35ff",
  color: "white",
  fontWeight: "900",
  cursor: "pointer",
};

const ghostBtn = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "white",
  fontWeight: "900",
  cursor: "pointer",
};

const linkBtn = {
  marginTop: "10px",
  padding: "8px 0",
  border: "none",
  background: "transparent",
  color: "#ff4d6d",
  fontWeight: "900",
  cursor: "pointer",
  textDecoration: "underline",
  fontSize: "14px",
};*/

/*
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DyslexiaTraining from "../modules/training/DyslexiaTraining";
import DysgraphiaTraining from "../modules/training/DysgraphiaTraining";
import DyscalculiaTraining from "../modules/training/DyscalculiaTraining";

function getReportSummary() {
  try {
    return JSON.parse(localStorage.getItem("reportSummary") || "null");
  } catch {
    return null;
  }
}

function levelText(risk) {
  if (risk === "high") return "High Level";
  if (risk === "moderate") return "Moderate Level";
  return "Low Level";
}

function timerMinutes(risk) {
  if (risk === "high") return 5;
  if (risk === "moderate") return 8;
  return 10;
}

function getTodayFood() {
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

function getAvoidFoods() {
  return [
    "Too many sugary snacks",
    "Soft drinks and cola",
    "Heavy junk food before learning time",
    "Very late meals and poor hydration",
  ];
}

function getHelpfulFoods() {
  return [
    "Protein-rich foods like egg, dal, milk, curd",
    "Fresh fruits and vegetables",
    "Water and proper hydration",
    "Balanced home-cooked meals",
  ];
}

function getParentTasks(type, risk) {
  const data = {
    dyslexia: {
      low: [
        "Read 3 short words with the child and repeat the sounds slowly.",
        "Use picture cards and letter cards together.",
        "Ask the child to repeat one short sentence with confidence.",
      ],
      moderate: [
        "Practice one small word family such as cat, bat, mat.",
        "Support common confusing letters like b/d or p/q using hand signs.",
        "Do 5 minutes of calm read-aloud together.",
      ],
      high: [
        "Use only 1 or 2 words at a time with clear repetition.",
        "Let the child point to the correct letter while listening.",
        "Give frequent breaks and praise every small success.",
      ],
    },
    dysgraphia: {
      low: [
        "Trace straight lines and curves on paper.",
        "Practice one or two letters slowly.",
        "Use finger tracing before pencil writing.",
      ],
      moderate: [
        "Do air-writing and big-letter tracing.",
        "Practice one short word with support.",
        "Encourage a relaxed pencil grip and comfortable posture.",
      ],
      high: [
        "Start with large strokes and shapes only.",
        "Use finger tracing, then crayon, then pencil.",
        "Keep writing time short and encouraging.",
      ],
    },
    dyscalculia: {
      low: [
        "Count 5 real objects at home and say the number aloud.",
        "Match number cards with objects.",
        "Try one small addition using fingers or beads.",
      ],
      moderate: [
        "Group spoons, toys, or blocks and count slowly.",
        "Use number cards for recognition and matching.",
        "Practice simple addition with real objects.",
      ],
      high: [
        "Start with number recognition only.",
        "Count only 1 to 3 objects first.",
        "Repeat slowly with praise and visual support.",
      ],
    },
  };

  return data[type]?.[risk] || [];
}

function getDetected(summary) {
  const arr = [];

  if (summary?.dyslexia?.risk && summary.dyslexia.risk !== "low") {
    arr.push({ key: "dyslexia", label: "📖 Reading Adventure", risk: summary.dyslexia.risk });
  }
  if (summary?.dysgraphia?.risk && summary.dysgraphia.risk !== "low") {
    arr.push({ key: "dysgraphia", label: "✍️ Writing Adventure", risk: summary.dysgraphia.risk });
  }
  if (summary?.dyscalculia?.risk && summary.dyscalculia.risk !== "low") {
    arr.push({ key: "dyscalculia", label: "🔢 Number Adventure", risk: summary.dyscalculia.risk });
  }

  if (arr.length === 0) {
    arr.push({ key: "dyslexia", label: "🌟 Fun Learning Adventure", risk: "low" });
  }

  return arr;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.08;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function formatTime(totalSeconds) {
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function Training() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showBreak, setShowBreak] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showDisorderComplete, setShowDisorderComplete] = useState(false);
  const [showAllDone, setShowAllDone] = useState(false);
  const [parentOpen, setParentOpen] = useState(false);
  const [foodOpen, setFoodOpen] = useState(false);

  useEffect(() => {
    const data = getReportSummary();
    setSummary(data);
  }, []);

  const detected = useMemo(() => getDetected(summary), [summary]);
  const active = detected[activeIndex];

  useEffect(() => {
    if (!active) return;

    const total = timerMinutes(active.risk) * 60;
    setSecondsLeft(total);
    setShowBreak(false);
    setShowDisorderComplete(false);

    const message = `Welcome to LearnEase training. Let's begin ${active.label}. You are doing great.`;
    speak(message);

    const timeout = setTimeout(() => {
      setShowWelcome(false);
    }, 2300);

    return () => clearTimeout(timeout);
  }, [activeIndex, active]);

  useEffect(() => {
    if (!active || showBreak || showDisorderComplete || showAllDone) return;

    if (secondsLeft <= 0) {
      setShowBreak(true);
      speak("Great effort. Time for a short break. Please do the parent support activity now.");
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, active, showBreak, showDisorderComplete, showAllDone]);

  if (!summary) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h2>Training Page</h2>
        <p>No report found. Please complete the test first.</p>
        <button onClick={() => navigate("/test")}>Go to Test</button>
      </div>
    );
  }

  if (!active) return null;

  const activeRisk = active.risk || "low";
  const parentTasks = getParentTasks(active.key, activeRisk);

  const handleDisorderComplete = () => {
    if (activeIndex < detected.length - 1) {
      setShowDisorderComplete(true);
      speak("Wonderful work. You finished this learning adventure. Let's get ready for the next one.");
    } else {
      setShowAllDone(true);
      speak("Amazing work today. You completed all your learning adventures. We are very proud of you.");
    }
  };

  const goNextDisorder = () => {
    setShowDisorderComplete(false);
    setActiveIndex((prev) => prev + 1);
  };

  const continueAfterBreak = () => {
    const total = timerMinutes(active.risk) * 60;
    setSecondsLeft(total);
    setShowBreak(false);
    speak("Nice break. Let's continue learning together.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffdfe9 0%, #e7efff 45%, #e5fff0 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.96)",
          borderRadius: "30px",
          padding: "24px",
          boxShadow: "0 18px 38px rgba(0,0,0,0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={bubbleOne}></div>
        <div style={bubbleTwo}></div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            marginBottom: "18px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div></div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "1000", color: "#4635c9" }}>
              LearnEase
            </div>
            <div style={{ marginTop: "6px", fontSize: "18px", fontWeight: "900", color: "#555" }}>
              Child Training Journey
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{
                minWidth: "125px",
                padding: "14px 18px",
                borderRadius: "18px",
                background: showBreak ? "#fff4e8" : "#f1f7ff",
                border: `2px solid ${showBreak ? "#f7c58f" : "#cfe1ff"}`,
                boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: "900", color: "#666" }}>
                ⏰ Training Timer
              </div>
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "24px",
                  fontWeight: "1000",
                  color: showBreak ? "#ef6c00" : "#2457d6",
                }}
              >
                {formatTime(Math.max(secondsLeft, 0))}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            background: "linear-gradient(135deg, #fff7d9, #ffe9f2)",
            borderRadius: "24px",
            padding: "18px",
            border: "1px solid #f0ddb0",
            marginBottom: "18px",
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: "1000", color: "#333" }}>
            {active.label}
          </div>
          <div style={{ marginTop: "8px", color: "#555", fontWeight: "700" }}>
            Level: <span style={{ color: "#5a35ff", fontWeight: "1000" }}>{levelText(activeRisk)}</span>
          </div>
          <div style={{ marginTop: "8px", color: "#666", lineHeight: "1.7" }}>
            Let’s learn step by step. Every small success is a big win. 🌟
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            background: "linear-gradient(180deg, #ffffff, #f9fcff)",
            borderRadius: "26px",
            padding: "20px",
            border: "1px solid #ececec",
            boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
            minHeight: "520px",
          }}
        >
          {active.key === "dyslexia" && (
            <DyslexiaTraining unlockedLevel={activeRisk} onComplete={handleDisorderComplete} />
          )}

          {active.key === "dysgraphia" && (
            <DysgraphiaTraining unlockedLevel={activeRisk} onComplete={handleDisorderComplete} />
          )}

          {active.key === "dyscalculia" && (
            <DyscalculiaTraining unlockedLevel={activeRisk} onComplete={handleDisorderComplete} />
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "16px",
            marginTop: "18px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #fff4fb, #fff9ea)",
              border: "1px solid #f2d8e7",
              borderRadius: "20px",
              padding: "16px",
              boxShadow: "0 8px 18px rgba(0,0,0,0.04)",
            }}
          >
            <button
              onClick={() => setParentOpen((prev) => !prev)}
              style={sectionToggleBtn}
            >
              👨‍👩‍👧 Parent Support Activity
              <span>{parentOpen ? "−" : "+"}</span>
            </button>

            {parentOpen && (
              <div style={{ marginTop: "12px" }}>
                <ul style={{ paddingLeft: "18px", lineHeight: "2", color: "#444", margin: 0 }}>
                  {parentTasks.map((item, index) => (
                    <li key={index} style={{ marginBottom: "6px" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #eefdf3, #f2fbff)",
              border: "1px solid #d9efe0",
              borderRadius: "20px",
              padding: "16px",
              boxShadow: "0 8px 18px rgba(0,0,0,0.04)",
            }}
          >
            <button
              onClick={() => setFoodOpen((prev) => !prev)}
              style={sectionToggleBtn}
            >
              🥗 Today’s Food Support
              <span>{foodOpen ? "−" : "+"}</span>
            </button>

            <div
              style={{
                marginTop: "12px",
                background: "#ffffff",
                border: "1px solid #dfeee3",
                borderRadius: "14px",
                padding: "12px 14px",
                fontWeight: "900",
                color: "#1f7a3d",
              }}
            >
              Today’s food recommendation: {getTodayFood()}
            </div>

            {foodOpen && (
              <div style={{ marginTop: "14px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e8f0ea",
                      borderRadius: "14px",
                      padding: "14px",
                    }}
                  >
                    <div style={{ fontWeight: "1000", color: "#1c8c5e", marginBottom: "8px" }}>
                      Foods to include
                    </div>
                    <ul style={{ paddingLeft: "18px", color: "#555", lineHeight: "1.8", margin: 0 }}>
                      {getHelpfulFoods().map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #f1e3e3",
                      borderRadius: "14px",
                      padding: "14px",
                    }}
                  >
                    <div style={{ fontWeight: "1000", color: "#d32f2f", marginBottom: "8px" }}>
                      Foods to limit
                    </div>
                    <ul style={{ paddingLeft: "18px", color: "#555", lineHeight: "1.8", margin: 0 }}>
                      {getAvoidFoods().map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "14px",
                    background: "#fff1f1",
                    border: "1px solid #f4bcbc",
                    color: "#c62828",
                    borderRadius: "14px",
                    padding: "12px 14px",
                    fontWeight: "800",
                    lineHeight: "1.7",
                  }}
                >
                  Note: These food suggestions are general support ideas only. For special diet or health-related advice, please confirm with a doctor or dietitian.
                </div>
              </div>
            )}
          </div>
        </div>

        {showWelcome && (
          <OverlayCard>
            <div style={{ fontSize: "60px" }}>🌈</div>
            <div style={overlayTitle}>Let’s begin our learning adventure!</div>
            <div style={overlayText}>
              You are doing something wonderful today. Let’s learn step by step together.
            </div>
          </OverlayCard>
        )}

        {showBreak && (
          <OverlayCard>
            <div style={{ fontSize: "62px" }}>⏸️</div>
            <div style={overlayTitle}>Time for a short break</div>
            <div style={overlayText}>
              Great effort. Let the child rest the eyes now and do the parent support activity for a few minutes.
            </div>

            <div
              style={{
                marginTop: "16px",
                textAlign: "left",
                background: "#fff9ef",
                border: "1px solid #f1d8a9",
                borderRadius: "16px",
                padding: "14px",
              }}
            >
              <div style={{ fontWeight: "1000", marginBottom: "8px", color: "#444" }}>
                Parent Activity
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", color: "#555", lineHeight: "1.8" }}>
                {parentTasks.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <button onClick={continueAfterBreak} style={overlayBtn}>
              Continue Training
            </button>
          </OverlayCard>
        )}

        {showDisorderComplete && (
          <OverlayCard>
            <div style={{ fontSize: "62px" }}>🎉</div>
            <div style={overlayTitle}>Wonderful job!</div>
            <div style={overlayText}>
              You completed this learning adventure beautifully. Let’s move to the next one with confidence.
            </div>

            <button onClick={goNextDisorder} style={overlayBtn}>
              Start Next Adventure
            </button>
          </OverlayCard>
        )}

        {showAllDone && (
          <OverlayCard>
            <div style={{ fontSize: "64px" }}>🏆</div>
            <div style={overlayTitle}>Training completed</div>
            <div style={overlayText}>
              Amazing work today. You stayed strong, learned well, and finished your training journey. We are proud of you.
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => navigate("/report")} style={overlayBtn}>
                View Report
              </button>
              <button onClick={() => navigate("/test")} style={overlayGhostBtn}>
                Start Progress Re-test
              </button>
            </div>
          </OverlayCard>
        )}
      </div>
    </div>
  );
}

function OverlayCard({ children }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "620px",
          background: "white",
          borderRadius: "28px",
          padding: "28px",
          textAlign: "center",
          boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
          border: "1px solid #ececec",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const overlayTitle = {
  marginTop: "10px",
  fontSize: "30px",
  fontWeight: "1000",
  color: "#333",
};

const overlayText = {
  marginTop: "12px",
  color: "#555",
  lineHeight: "1.8",
  fontSize: "17px",
};

const overlayBtn = {
  marginTop: "18px",
  padding: "14px 22px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #6c63ff, #5a35ff)",
  color: "white",
  fontWeight: "1000",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(90,53,255,0.22)",
};

const overlayGhostBtn = {
  marginTop: "18px",
  padding: "14px 22px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  background: "white",
  color: "#333",
  fontWeight: "1000",
  fontSize: "16px",
  cursor: "pointer",
};

const sectionToggleBtn = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "none",
  background: "transparent",
  fontWeight: "1000",
  fontSize: "18px",
  color: "#333",
  cursor: "pointer",
};

const bubbleOne = {
  position: "absolute",
  top: "40px",
  left: "30px",
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.25)",
};

const bubbleTwo = {
  position: "absolute",
  bottom: "90px",
  right: "30px",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.20)",
};*/

/*
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import DyslexiaTraining from "../modules/training/DyslexiaTraining";
import DysgraphiaTraining from "../modules/training/DysgraphiaTraining";
import DyscalculiaTraining from "../modules/training/DyscalculiaTraining";

function getJson(key, fallback = null) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function levelText(risk) {
  if (risk === "high") return "High Level";
  if (risk === "moderate") return "Moderate Level";
  return "Low Level";
}

function timerMinutes(risk) {
  if (risk === "high") return 5;
  if (risk === "moderate") return 8;
  return 10;
}

function getTodayFood() {
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

function getHelpfulFoods() {
  return [
    "Protein-rich foods like egg, dal, milk, and curd",
    "Fresh fruits and vegetables",
    "Plenty of water and proper hydration",
    "Balanced home-cooked meals",
  ];
}

function getAvoidFoods() {
  return [
    "Too many sugary snacks",
    "Soft drinks and cola",
    "Heavy junk food before learning time",
    "Poor hydration and irregular meal timings",
  ];
}

function getDetected(summary) {
  const arr = [];

  if (summary?.dyslexia?.risk && summary.dyslexia.risk !== "low") {
    arr.push({ key: "dyslexia", label: "📖 Reading Training", risk: summary.dyslexia.risk });
  }
  if (summary?.dysgraphia?.risk && summary.dysgraphia.risk !== "low") {
    arr.push({ key: "dysgraphia", label: "✍️ Writing Training", risk: summary.dysgraphia.risk });
  }
  if (summary?.dyscalculia?.risk && summary.dyscalculia.risk !== "low") {
    arr.push({ key: "dyscalculia", label: "🔢 Number Training", risk: summary.dyscalculia.risk });
  }

  if (arr.length === 0) {
    arr.push({ key: "dyslexia", label: "🌟 General Learning Training", risk: "low" });
  }

  return arr;
}

function formatTime(totalSeconds) {
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function getReadingFocusAreas(assessment) {
  if (!assessment?.tasks?.length) return ["word-recognition"];

  const wrong = assessment.tasks.filter((t) => !t.isCorrect).map((t) => t.task?.toLowerCase() || "");
  const focus = [];

  if (wrong.some((t) => t.includes("letter"))) focus.push("letter-confusion");
  if (wrong.some((t) => t.includes("phonics"))) focus.push("phonics");
  if (wrong.some((t) => t.includes("word"))) focus.push("word-recognition");
  if (wrong.some((t) => t.includes("sentence"))) focus.push("sentence-reading");

  return focus.length ? focus : ["word-recognition"];
}

function getWritingFocusAreas(assessment) {
  if (!assessment?.tasks?.length) return ["letter-formation"];

  const wrong = assessment.tasks.filter((t) => !t.isCorrect).map((t) => t.task?.toLowerCase() || "");
  const focus = [];

  if (wrong.some((t) => t.includes("letter"))) focus.push("letter-formation");
  if (wrong.some((t) => t.includes("word"))) focus.push("copying-words");
  if (wrong.some((t) => t.includes("sentence"))) focus.push("sentence-writing");
  if (wrong.some((t) => t.includes("tracing"))) focus.push("stroke-control");

  return focus.length ? focus : ["letter-formation"];
}

function getMathFocusAreas(assessment) {
  if (!assessment?.tasks?.length) return ["counting"];

  const wrong = assessment.tasks.filter((t) => !t.isCorrect).map((t) => t.task?.toLowerCase() || "");
  const focus = [];

  if (wrong.some((t) => t.includes("number recognition"))) focus.push("number-recognition");
  if (wrong.some((t) => t.includes("counting"))) focus.push("counting");
  if (wrong.some((t) => t.includes("comparison"))) focus.push("comparison");
  if (wrong.some((t) => t.includes("sequencing"))) focus.push("sequencing");
  if (wrong.some((t) => t.includes("arithmetic"))) focus.push("addition");

  return focus.length ? focus : ["counting"];
}

function getWeakAreas(disorderKey, readingAssessment, writingAssessment, mathAssessment) {
  if (disorderKey === "dyslexia") return getReadingFocusAreas(readingAssessment);
  if (disorderKey === "dysgraphia") return getWritingFocusAreas(writingAssessment);
  return getMathFocusAreas(mathAssessment);
}

function getParentTasks(type, risk, focusAreas) {
  const common = {
    dyslexia: {
      "letter-confusion": [
        "Use flash cards to compare confusing letters slowly.",
        "Ask the child to trace each letter with finger before saying it.",
      ],
      phonics: [
        "Say the sound slowly and ask the child to repeat it.",
        "Use one picture and one sound at a time.",
      ],
      "word-recognition": [
        "Read 3 short words together and repeat calmly.",
        "Show the word, say it aloud, and ask the child to point.",
      ],
      "sentence-reading": [
        "Read one short sentence with the child.",
        "Pause after each word and encourage pointing while reading.",
      ],
    },
    dysgraphia: {
      "letter-formation": [
        "Practice one big letter on paper slowly.",
        "Use finger tracing before pencil writing.",
      ],
      "copying-words": [
        "Write one short word and let the child copy calmly.",
        "Say each letter while the child writes.",
      ],
      "sentence-writing": [
        "Practice only one short sentence at a time.",
        "Encourage spacing between words.",
      ],
      "stroke-control": [
        "Draw lines, loops, and small curves for 3 to 5 minutes.",
        "Let the child trace large shapes first.",
      ],
    },
    dyscalculia: {
      "number-recognition": [
        "Use number cards from 1 to 5 and ask the child to identify them.",
        "Match one number card to one object group.",
      ],
      counting: [
        "Count spoons, blocks, or fruits one by one.",
        "Ask the child to touch each object while counting.",
      ],
      comparison: [
        "Show two numbers and ask which is bigger.",
        "Use real objects to compare more and less.",
      ],
      sequencing: [
        "Arrange number cards in order from small to big.",
        "Say the sequence aloud together.",
      ],
      addition: [
        "Use fingers or beads to show simple addition.",
        "Add objects slowly and count the final total.",
      ],
    },
  };

  const selected = focusAreas.flatMap((area) => common[type]?.[area] || []);
  const uniqueSelected = [...new Set(selected)];

  if (uniqueSelected.length) return uniqueSelected;

  if (risk === "high") {
    return [
      "Keep practice short and calm.",
      "Repeat one small activity at a time.",
      "Give praise after every small success.",
    ];
  }

  if (risk === "moderate") {
    return [
      "Practice one focused activity for a few minutes daily.",
      "Use visual and spoken help together.",
      "Take short breaks between activities.",
    ];
  }

  return [
    "Use short daily revision at home.",
    "Encourage steady practice without pressure.",
    "Appreciate every small improvement.",
  ];
}

function getVideoRefs(type, focusAreas) {
  const refs = {
    dyslexia: {
      "letter-confusion": [
        { title: "Letter confusion practice", query: "b d letter confusion activities for kids" },
      ],
      phonics: [
        { title: "Phonics sound practice", query: "phonics sound practice for kids" },
      ],
      "word-recognition": [
        { title: "Simple word reading", query: "simple word reading for children" },
      ],
      "sentence-reading": [
        { title: "Short sentence reading", query: "short sentence reading for children" },
      ],
    },
    dysgraphia: {
      "letter-formation": [
        { title: "Letter formation practice", query: "letter formation handwriting practice for kids" },
      ],
      "copying-words": [
        { title: "Copying word practice", query: "copying words handwriting practice for children" },
      ],
      "sentence-writing": [
        { title: "Sentence writing support", query: "sentence writing practice for children" },
      ],
      "stroke-control": [
        { title: "Fine motor warm-up", query: "fine motor warm up handwriting kids" },
      ],
    },
    dyscalculia: {
      "number-recognition": [
        { title: "Number recognition games", query: "number recognition games for kids" },
      ],
      counting: [
        { title: "Counting with objects", query: "counting objects for kids learning" },
      ],
      comparison: [
        { title: "More and less activities", query: "more and less math activities for kids" },
      ],
      sequencing: [
        { title: "Number sequence games", query: "number sequencing activities for kids" },
      ],
      addition: [
        { title: "Simple addition with visuals", query: "simple addition with visuals for children" },
      ],
    },
  };

  const selected = focusAreas.flatMap((area) => refs[type]?.[area] || []);
  return selected.length ? selected : [];
}

function openYouTubeSearch(query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  window.open(url, "_blank");
}

function useSpeechController() {
  const [enabled, setEnabled] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const loadVoices = () =>
    new Promise((resolve) => {
      if (!window.speechSynthesis) {
        resolve([]);
        return;
      }

      let voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        resolve(voices);
        return;
      }

      const handle = () => {
        voices = window.speechSynthesis.getVoices();
        window.speechSynthesis.removeEventListener("voiceschanged", handle);
        resolve(voices);
      };

      window.speechSynthesis.addEventListener("voiceschanged", handle);

      setTimeout(() => {
        window.speechSynthesis.removeEventListener("voiceschanged", handle);
        resolve(window.speechSynthesis.getVoices());
      }, 1000);
    });

  const speak = async (text) => {
    if (!enabled || !supported || !text?.trim()) return false;

    try {
      const synth = window.speechSynthesis;
      const voices = await loadVoices();

      const preferredVoice =
        voices.find((v) => v.lang === "en-IN") ||
        voices.find((v) => v.lang === "en-US") ||
        voices.find((v) => v.lang?.startsWith("en")) ||
        null;

      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice.lang;
      } else {
        utterance.lang = "en-US";
      }

      synth.speak(utterance);
      return true;
    } catch (error) {
      console.error("Speech error:", error);
      return false;
    }
  };

  const stop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
  };

  const startVoice = async () => {
    if (!supported) return false;

    try {
      setEnabled(true);

      const synth = window.speechSynthesis;
      synth.cancel();

      const silent = new SpeechSynthesisUtterance(" ");
      silent.volume = 0;
      synth.speak(silent);

      return true;
    } catch (error) {
      console.error("Speech start error:", error);
      return false;
    }
  };

  return { enabled, supported, speak, stop, startVoice };
}

export default function Training() {
  const navigate = useNavigate();
  const parentSupportRef = useRef(null);
  const speech = useSpeechController();

  const [summary, setSummary] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showBreak, setShowBreak] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showDisorderComplete, setShowDisorderComplete] = useState(false);
  const [showAllDone, setShowAllDone] = useState(false);
  const [parentOpen, setParentOpen] = useState(false);
  const [foodOpen, setFoodOpen] = useState(false);

  const childProfile = getJson("childProfile", {});
  const readingAssessment = getJson("readingAssessment", {});
  const writingAssessment = getJson("writingAssessment", {});
  const mathAssessment = getJson("mathAssessment", {});

  useEffect(() => {
    const data = getJson("reportSummary", null);
    setSummary(data);
  }, []);

  const detected = useMemo(() => getDetected(summary), [summary]);
  const active = detected[activeIndex];

  const focusAreas = useMemo(() => {
    if (!active) return [];
    return getWeakAreas(active.key, readingAssessment, writingAssessment, mathAssessment);
  }, [active, readingAssessment, writingAssessment, mathAssessment]);

  const parentTasks = useMemo(() => {
    if (!active) return [];
    return getParentTasks(active.key, active.risk, focusAreas);
  }, [active, focusAreas]);

  const videoRefs = useMemo(() => {
    if (!active) return [];
    return getVideoRefs(active.key, focusAreas);
  }, [active, focusAreas]);

  useEffect(() => {
    if (!active) return;
    const total = timerMinutes(active.risk) * 60;
    setSecondsLeft(total);
    setShowBreak(false);
    setShowDisorderComplete(false);
  }, [activeIndex, active]);

  useEffect(() => {
    if (!active || !speech.enabled) return;

    const message = `Welcome to LearnEase training. ${
      childProfile?.childName ? `${childProfile.childName}, ` : ""
    }let's begin ${active.label}. You are doing great.`;

    speech.speak(message);

    const timeout = setTimeout(() => {
      setShowWelcome(false);
    }, 2200);

    return () => clearTimeout(timeout);
  }, [activeIndex, active, childProfile, speech.enabled]);

  useEffect(() => {
    if (!active || showBreak || showDisorderComplete || showAllDone) return;

    if (secondsLeft <= 0) {
      setShowBreak(true);
      setParentOpen(true);
      parentSupportRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

      if (speech.enabled) {
        speech.speak(
          "Wonderful effort today. Training time is complete for now. Please continue with the parent support activity."
        );
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, active, showBreak, showDisorderComplete, showAllDone, speech.enabled]);

  useEffect(() => {
    return () => {
      speech.stop();
    };
  }, []);

  if (!summary) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h2>Training Page</h2>
        <p>No report found. Please complete the test first.</p>
        <button onClick={() => navigate("/test")}>Go to Test</button>
      </div>
    );
  }

  if (!active) return null;

  const handleDisorderComplete = () => {
    if (activeIndex < detected.length - 1) {
      setShowDisorderComplete(true);
      if (speech.enabled) {
        speech.speak("Wonderful work. You completed this training section. Let us move to the next one.");
      }
    } else {
      setShowAllDone(true);
      if (speech.enabled) {
        speech.speak("Amazing work. You finished all your training activities. We are very proud of you.");
      }
    }
  };

  const goNextDisorder = () => {
    setShowDisorderComplete(false);
    setActiveIndex((prev) => prev + 1);
  };

  const continueAfterBreak = () => {
    const total = timerMinutes(active.risk) * 60;
    setSecondsLeft(total);
    setShowBreak(false);

    if (speech.enabled) {
      speech.speak("Good job. You can continue later with parent support.");
    }
  };

  const childName = childProfile?.childName || "Child";

  const startWithVoice = async () => {
    const ok = await speech.startVoice();
    if (!ok) {
      alert("Voice is not supported or blocked in this browser.");
      return;
    }

    await speech.speak(`Welcome to LearnEase training. ${childName}, let's begin. You are doing great.`);
    setShowWelcome(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffdfe9 0%, #e7efff 45%, #e5fff0 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.96)",
          borderRadius: "30px",
          padding: "24px",
          boxShadow: "0 18px 38px rgba(0,0,0,0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={bubbleOne}></div>
        <div style={bubbleTwo}></div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            marginBottom: "18px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div>
            <button onClick={() => window.print()} style={printBtn}>
              🖨 Print Plan
            </button>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "38px", fontWeight: "1000", color: "#4635c9" }}>
              LearnEase
            </div>
            <div style={{ marginTop: "8px", fontSize: "28px", fontWeight: "1000", color: "#ff6584" }}>
              🌟 {childName}'s Training Journey
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              onClick={() => speech.enabled && speech.speak(`${childName}, you are doing great. Keep learning.`)}
              style={smallVoiceBtn}
              disabled={!speech.enabled}
            >
              🔊 Replay Voice
            </button>

            <button onClick={speech.stop} style={smallStopBtn}>
              ⏹ Stop Voice
            </button>

            <div
              style={{
                minWidth: "130px",
                padding: "14px 18px",
                borderRadius: "18px",
                background: showBreak ? "#fff4e8" : "#f1f7ff",
                border: `2px solid ${showBreak ? "#f7c58f" : "#cfe1ff"}`,
                boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: "900", color: "#666" }}>
                ⏰ Training Timer
              </div>
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "24px",
                  fontWeight: "1000",
                  color: showBreak ? "#ef6c00" : "#2457d6",
                }}
              >
                {formatTime(Math.max(secondsLeft, 0))}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            background: "linear-gradient(135deg, #fff7d9, #ffe9f2)",
            borderRadius: "24px",
            padding: "18px",
            border: "1px solid #f0ddb0",
            marginBottom: "18px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr",
            gap: "14px",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "22px", fontWeight: "1000", color: "#333" }}>
              {active.label}
            </div>
            <div style={{ marginTop: "8px", color: "#555", fontWeight: "700" }}>
              Focused for the child’s current learning needs
            </div>
          </div>

          <div style={metaPill}>
            <span style={{ fontWeight: "800", color: "#555" }}>Level:</span>
            <span style={{ color: "#5a35ff", fontWeight: "1000" }}>{levelText(active.risk)}</span>
          </div>

          <div style={metaPill}>
            <span style={{ fontWeight: "800", color: "#555" }}>Focus Areas:</span>
            <span style={{ color: "#1c8c5e", fontWeight: "1000" }}>
              {focusAreas.join(", ")}
            </span>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            background: "linear-gradient(180deg, #ffffff, #f9fcff)",
            borderRadius: "26px",
            padding: "20px",
            border: "1px solid #ececec",
            boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
            minHeight: "520px",
            // Block all interaction when timer is up
            pointerEvents: showBreak ? "none" : "auto",
            opacity: showBreak ? 0.4 : 1,
            transition: "opacity 0.3s",
          }}
        >
          {active.key === "dyslexia" && (
            <DyslexiaTraining
              unlockedLevel={active.risk}
              focusAreas={focusAreas}
              onComplete={handleDisorderComplete}
              speakText={speech.speak}
              voiceEnabled={speech.enabled}
            />
          )}

          {active.key === "dysgraphia" && (
            <DysgraphiaTraining
              unlockedLevel={active.risk}
              focusAreas={focusAreas}
              onComplete={handleDisorderComplete}
              speakText={speech.speak}
              voiceEnabled={speech.enabled}
            />
          )}

          {active.key === "dyscalculia" && (
            <DyscalculiaTraining
              unlockedLevel={active.risk}
              focusAreas={focusAreas}
              onComplete={handleDisorderComplete}
              speakText={speech.speak}
              voiceEnabled={speech.enabled}
            />
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "16px",
            marginTop: "18px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            ref={parentSupportRef}
            style={{
              background: "linear-gradient(135deg, #fff4fb, #fff9ea)",
              border: "1px solid #f2d8e7",
              borderRadius: "20px",
              padding: "16px",
              boxShadow: "0 8px 18px rgba(0,0,0,0.04)",
            }}
          >
            <button onClick={() => setParentOpen((prev) => !prev)} style={sectionToggleBtn}>
              👨‍👩‍👧 Parent Support Activity
              <span>{parentOpen ? "−" : "+"}</span>
            </button>

            {parentOpen && (
              <div style={{ marginTop: "12px" }}>
                <ul style={{ paddingLeft: "18px", lineHeight: "2", color: "#444", margin: 0 }}>
                  {parentTasks.map((item, index) => (
                    <li key={index} style={{ marginBottom: "6px" }}>
                      {item}
                    </li>
                  ))}
                </ul>

                {videoRefs.length > 0 && (
                  <div style={{ marginTop: "16px" }}>
                    <div style={{ fontWeight: "1000", color: "#444", marginBottom: "10px" }}>
                      🎥 Helpful reference links
                    </div>

                    <div style={{ display: "grid", gap: "10px" }}>
                      {videoRefs.map((item, index) => (
                        <div key={index} style={{ background: "white", border: "1px solid #eee", borderRadius: "12px", padding: "12px 14px" }}>
                          <div style={{ fontWeight: "900", color: "#333", marginBottom: "4px" }}>
                            {item.title}
                          </div>
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.query)}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#5a35ff", fontWeight: "800", fontSize: "13px", textDecoration: "underline" }}
                          >
                            🔗 Open reference video
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #eefdf3, #f2fbff)",
              border: "1px solid #d9efe0",
              borderRadius: "20px",
              padding: "16px",
              boxShadow: "0 8px 18px rgba(0,0,0,0.04)",
            }}
          >
            <button onClick={() => setFoodOpen((prev) => !prev)} style={sectionToggleBtn}>
              🥗 Today’s Food Support
              <span>{foodOpen ? "−" : "+"}</span>
            </button>

            <div
              style={{
                marginTop: "12px",
                background: "#ffffff",
                border: "1px solid #dfeee3",
                borderRadius: "14px",
                padding: "12px 14px",
                fontWeight: "900",
                color: "#1f7a3d",
              }}
            >
              Today’s food recommendation: {getTodayFood()}
            </div>

            {foodOpen && (
              <div style={{ marginTop: "14px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e8f0ea",
                      borderRadius: "14px",
                      padding: "14px",
                    }}
                  >
                    <div style={{ fontWeight: "1000", color: "#1c8c5e", marginBottom: "8px" }}>
                      Foods to include
                    </div>
                    <ul style={{ paddingLeft: "18px", color: "#555", lineHeight: "1.8", margin: 0 }}>
                      {getHelpfulFoods().map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #f1e3e3",
                      borderRadius: "14px",
                      padding: "14px",
                    }}
                  >
                    <div style={{ fontWeight: "1000", color: "#d32f2f", marginBottom: "8px" }}>
                      Foods to limit
                    </div>
                    <ul style={{ paddingLeft: "18px", color: "#555", lineHeight: "1.8", margin: 0 }}>
                      {getAvoidFoods().map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "14px",
                    background: "#fff1f1",
                    border: "1px solid #f4bcbc",
                    color: "#c62828",
                    borderRadius: "14px",
                    padding: "12px 14px",
                    fontWeight: "800",
                    lineHeight: "1.7",
                  }}
                >
                  Note: These food suggestions are general support ideas only. For special diet or health-related advice, please confirm with a doctor or dietitian.
                </div>
              </div>
            )}
          </div>
        </div>

        {showWelcome && (
          <OverlayCard>
            <div style={{ fontSize: "60px" }}>🌈</div>
            <div style={overlayTitle}>Let’s begin our learning adventure!</div>
            <div style={overlayText}>
              {childName}, you are doing something wonderful today. Let’s learn step by step together.
            </div>

            {speech.supported ? (
              <button onClick={startWithVoice} style={overlayBtn}>
                🔊 Start With Voice
              </button>
            ) : (
              <div
                style={{
                  marginTop: "18px",
                  color: "#c62828",
                  fontWeight: "800",
                }}
              >
                Voice is not supported in this browser.
              </div>
            )}
          </OverlayCard>
        )}

        {showBreak && (
          <OverlayCard>
            <div style={{ fontSize: "62px" }}>⏸️</div>
            <div style={overlayTitle}>Training time is complete for today</div>
            <div style={overlayText}>
              You worked really well. The screen training is now blocked. Please continue with the parent support activities below.
            </div>

            <button
              onClick={() => {
                setParentOpen(true);
                parentSupportRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                // NOTE: we do NOT call continueAfterBreak() here — training stays blocked
                // The overlay closes so parent can scroll to support section
                setShowBreak(false);
              }}
              style={overlayBtn}
            >
              Go to Parent Support ↓
            </button>
          </OverlayCard>
        )}

        {showDisorderComplete && (
          <OverlayCard>
            <div style={{ fontSize: "62px" }}>🎉</div>
            <div style={overlayTitle}>Wonderful work!</div>
            <div style={overlayText}>
              You completed this training section beautifully. Let’s move to the next one with confidence.
            </div>

            <button onClick={goNextDisorder} style={overlayBtn}>
              Start Next Training
            </button>
          </OverlayCard>
        )}

        {showAllDone && (
          <OverlayCard>
            <div style={{ fontSize: "64px" }}>🏆</div>
            <div style={overlayTitle}>Training completed</div>
            <div style={overlayText}>
              Amazing work today. You stayed strong, learned well, and completed your training journey beautifully.
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => navigate("/report")} style={overlayBtn}>
                View Report
              </button>
              <button onClick={() => navigate("/test")} style={overlayGhostBtn}>
                Start Progress Re-test
              </button>
            </div>
          </OverlayCard>
        )}
      </div>
    </div>
  );
}

function OverlayCard({ children }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "620px",
          background: "white",
          borderRadius: "28px",
          padding: "28px",
          textAlign: "center",
          boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
          border: "1px solid #ececec",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const overlayTitle = {
  marginTop: "10px",
  fontSize: "30px",
  fontWeight: "1000",
  color: "#333",
};

const overlayText = {
  marginTop: "12px",
  color: "#555",
  lineHeight: "1.8",
  fontSize: "17px",
};

const overlayBtn = {
  marginTop: "18px",
  padding: "14px 22px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #6c63ff, #5a35ff)",
  color: "white",
  fontWeight: "1000",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(90,53,255,0.22)",
};

const overlayGhostBtn = {
  marginTop: "18px",
  padding: "14px 22px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  background: "white",
  color: "#333",
  fontWeight: "1000",
  fontSize: "16px",
  cursor: "pointer",
};

const sectionToggleBtn = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "none",
  background: "transparent",
  fontWeight: "1000",
  fontSize: "18px",
  color: "#333",
  cursor: "pointer",
};

const videoBtn = {
  textAlign: "left",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #e2e2e2",
  background: "white",
  cursor: "pointer",
  fontWeight: "800",
  color: "#444",
};

const metaPill = {
  background: "rgba(255,255,255,0.72)",
  border: "1px solid #eee",
  borderRadius: "16px",
  padding: "12px 14px",
  display: "flex",
  gap: "8px",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
};

const bubbleOne = {
  position: "absolute",
  top: "40px",
  left: "30px",
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.25)",
};

const bubbleTwo = {
  position: "absolute",
  bottom: "90px",
  right: "30px",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.20)",
};

const printBtn = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "none",
  background: "#5a35ff",
  color: "white",
  fontWeight: "900",
  cursor: "pointer",
};

const smallVoiceBtn = {
  padding: "10px 12px",
  borderRadius: "12px",
  border: "none",
  background: "#ff6584",
  color: "white",
  fontWeight: "900",
  cursor: "pointer",
};

const smallStopBtn = {
  padding: "10px 12px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "white",
  color: "#333",
  fontWeight: "900",
  cursor: "pointer",
};*/





import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DyslexiaTraining from "../modules/training/DyslexiaTraining";
import DysgraphiaTraining from "../modules/training/DysgraphiaTraining";
import DyscalculiaTraining from "../modules/training/DyscalculiaTraining";

/* ── helpers ── */
function getJson(key, fallback = null) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}
function levelText(r) { return r === "high" ? "High Level" : r === "moderate" ? "Moderate Level" : "Low Level"; }
function timerMinutes(r) { return r === "high" ? 5 : r === "moderate" ? 8 : 10; }
function formatTime(s) { return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; }

function getTodayFood() {
  const foods = ["Egg 🥚","Banana 🍌","Milk 🥛","Curd / Yogurt 🥣","Carrot 🥕","Spinach 🌿","Nuts 🥜","Apple 🍎"];
  const today = new Date().toISOString().slice(0,10);
  let sum = 0; for (let i = 0; i < today.length; i++) sum += today.charCodeAt(i);
  return foods[sum % foods.length];
}
function getHelpfulFoods() { return ["Protein-rich foods like egg, dal, milk, curd","Fresh fruits and vegetables","Water and proper hydration","Balanced home-cooked meals"]; }
function getAvoidFoods()   { return ["Too many sugary snacks","Soft drinks and cola","Heavy junk food before learning time","Poor hydration and irregular meal timings"]; }

function getDetected(summary) {
  const arr = [];
  if (summary?.dyslexia?.risk   && summary.dyslexia.risk   !== "low") arr.push({ key: "dyslexia",   label: "📖 Reading Adventure",  risk: summary.dyslexia.risk });
  if (summary?.dysgraphia?.risk && summary.dysgraphia.risk !== "low") arr.push({ key: "dysgraphia", label: "✍️ Writing Adventure",  risk: summary.dysgraphia.risk });
  if (summary?.dyscalculia?.risk&& summary.dyscalculia.risk!== "low") arr.push({ key: "dyscalculia",label: "🔢 Number Adventure",   risk: summary.dyscalculia.risk });
  if (arr.length === 0) arr.push({ key: "dyslexia", label: "🌟 General Learning Training", risk: "low" });
  return arr;
}

function getWeakAreas(key, reading, writing, math) {
  if (key === "dyslexia") {
    if (!reading?.tasks?.length) return ["word-recognition"];
    const wrong = reading.tasks.filter(t => !t.isCorrect).map(t => (t.task||"").toLowerCase());
    const f = [];
    if (wrong.some(t => t.includes("letter")))   f.push("letter-confusion");
    if (wrong.some(t => t.includes("phonics")))  f.push("phonics");
    if (wrong.some(t => t.includes("word")))     f.push("word-recognition");
    if (wrong.some(t => t.includes("sentence"))) f.push("sentence-comprehension");
    return f.length ? f : ["word-recognition"];
  }
  if (key === "dysgraphia") {
    if (!writing?.tasks?.length) return ["letter-formation"];
    const wrong = writing.tasks.filter(t => !t.isCorrect).map(t => (t.task||"").toLowerCase());
    const f = [];
    if (wrong.some(t => t.includes("letter")))  f.push("letter-formation");
    if (wrong.some(t => t.includes("word")))    f.push("writing-speed");
    if (wrong.some(t => t.includes("sentence")))f.push("writing-speed");
    return f.length ? f : ["letter-formation"];
  }
  if (key === "dyscalculia") {
    if (!math?.tasks?.length) return ["counting"];
    const wrong = math.tasks.filter(t => !t.isCorrect).map(t => (t.task||"").toLowerCase());
    const f = [];
    if (wrong.some(t => t.includes("recognition"))) f.push("number-recognition");
    if (wrong.some(t => t.includes("count")))       f.push("counting");
    if (wrong.some(t => t.includes("comparison")))  f.push("number-comparison");
    if (wrong.some(t => t.includes("sequence")))    f.push("sequencing");
    if (wrong.some(t => t.includes("arithmetic")))  f.push("basic-arithmetic");
    return f.length ? f : ["counting"];
  }
  return [];
}

function getParentTasks(key, risk, focusAreas) {
  const base = {
    dyslexia: {
      "letter-confusion": "Practice b/d and p/q using flash cards and finger pointing.",
      phonics: "Say simple sounds and ask the child to match the correct starting letter.",
      "word-recognition": "Read 3 short words daily and repeat slowly.",
      "sentence-comprehension": "Read one short sentence and ask one simple question.",
      "oral-reading": "Use read-aloud and ask the child to repeat clearly.",
    },
    dysgraphia: {
      "letter-formation": "Do dotted tracing of letters before free writing.",
      "writing-speed": "Keep writing short and neat, without rushing.",
      "attention-support": "Give short writing sessions with breaks.",
    },
    dyscalculia: {
      "number-recognition": "Show number cards and ask the child to identify them.",
      counting: "Count home objects like spoons, fruits, or pencils.",
      "number-comparison": "Practice bigger/smaller using two numbers.",
      sequencing: "Complete number sequences like 2, 4, 6, __.",
      "basic-arithmetic": "Use fingers or beads for simple addition practice.",
    },
  };
  const tasks = focusAreas.map(a => base[key]?.[a]).filter(Boolean);
  if (risk === "high")     tasks.push("Keep sessions very short and give full support.");
  else if (risk === "moderate") tasks.push("Repeat the same activity with calm encouragement.");
  else tasks.push("Continue light reinforcement and confidence-building.");
  return tasks;
}

function getVideoRefs(key, focusAreas) {
  const refs = {
    dyslexia: {
      "letter-confusion": [{ title: "b/d confusion practice", query: "b d p q confusion activities for kids" }],
      phonics:            [{ title: "Phonics sound practice",  query: "phonics sound practice for kids" }],
      "word-recognition": [{ title: "Word recognition games",  query: "word recognition games for kids" }],
      "sentence-comprehension": [{ title: "Sentence comprehension", query: "sentence comprehension activities children" }],
    },
    dysgraphia: {
      "letter-formation":  [{ title: "Letter formation practice", query: "letter tracing activities for kids" }],
      "writing-speed":     [{ title: "Slow neat writing",          query: "slow neat handwriting practice children" }],
      "attention-support": [{ title: "Fine motor warm-up",         query: "fine motor warm up handwriting kids" }],
    },
    dyscalculia: {
      "number-recognition": [{ title: "Number recognition games",  query: "number recognition games for kids" }],
      counting:             [{ title: "Counting with objects",      query: "counting objects for kids learning" }],
      "number-comparison":  [{ title: "Bigger and smaller numbers", query: "bigger smaller number comparison kids" }],
      sequencing:           [{ title: "Number sequence patterns",   query: "number sequence pattern activities kids" }],
      "basic-arithmetic":   [{ title: "Simple addition visuals",    query: "simple addition with visuals for children" }],
    },
  };
  return focusAreas.flatMap(a => refs[key]?.[a] || []);
}

/* ── speech hook ── */
function useSpeech() {
  const [enabled, setEnabled] = useState(false);
  const [supported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);

  const speak = (text) => {
    if (!enabled || !supported || !text?.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; u.pitch = 1.05; u.volume = 1; u.lang = "en-US";
    window.speechSynthesis.speak(u);
  };

  const stop = () => { if (supported) window.speechSynthesis.cancel(); };

  const startVoice = () => {
    if (!supported) return false;
    setEnabled(true);
    const silent = new SpeechSynthesisUtterance(" ");
    silent.volume = 0;
    window.speechSynthesis.speak(silent);
    return true;
  };

  return { enabled, supported, speak, stop, startVoice };
}

/* ── main component ── */
export default function Training() {
  const navigate = useNavigate();
  const parentSupportRef = useRef(null);
  const speech = useSpeech();

  const [summary, setSummary]                   = useState(null);
  const [activeIndex, setActiveIndex]           = useState(0);
  const [secondsLeft, setSecondsLeft]           = useState(-1); // -1 = not started yet
  const [showBreak, setShowBreak]               = useState(false);
  const [showWelcome, setShowWelcome]           = useState(true);
  const [showDisorderComplete, setShowDisorderComplete] = useState(false);
  const [showAllDone, setShowAllDone]           = useState(false);
  const [parentOpen, setParentOpen]             = useState(false);
  const [foodOpen, setFoodOpen]                 = useState(false);

  const readingAssessment = getJson("readingAssessment", {});
  const writingAssessment = getJson("writingAssessment", {});
  const mathAssessment    = getJson("mathAssessment", {});
  const childProfile      = getJson("childProfile", {});

  useEffect(() => { setSummary(getJson("reportSummary", null)); }, []);

  const detected = useMemo(() => getDetected(summary), [summary]);
  const active   = detected[activeIndex];

  const focusAreas = useMemo(() => {
    if (!active) return [];
    return getWeakAreas(active.key, readingAssessment, writingAssessment, mathAssessment);
  }, [active]); // eslint-disable-line

  const parentTasks = useMemo(() => active ? getParentTasks(active.key, active.risk, focusAreas) : [], [active, focusAreas]);
  const videoRefs   = useMemo(() => active ? getVideoRefs(active.key, focusAreas) : [], [active, focusAreas]);

  /* timer reset on activity change */
  useEffect(() => {
    if (!active) return;
    setSecondsLeft(-1); // wait for welcome to be dismissed before starting
    setShowBreak(false);
    setShowDisorderComplete(false);
  }, [activeIndex]); // eslint-disable-line

  /* welcome voice */
  useEffect(() => {
    if (!active || !speech.enabled) return;
    const name = childProfile?.childName ? `${childProfile.childName}, ` : "";
    speech.speak(`Welcome to LearnEase training. ${name}let's begin ${active.label}. You are doing great.`);
  }, [activeIndex, speech.enabled]); // eslint-disable-line

  /* countdown timer — only runs after welcome dismissed (secondsLeft >= 0) */
  useEffect(() => {
    if (!active || showBreak || showDisorderComplete || showAllDone || secondsLeft < 0) return;
    if (secondsLeft === 0) {
      setShowBreak(true);
      setParentOpen(true);
      parentSupportRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (speech.enabled) speech.speak("Wonderful effort. Training time is complete. Please continue with the parent support activity.");
      return;
    }
    const t = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft, showBreak, showDisorderComplete, showAllDone]); // eslint-disable-line

  useEffect(() => () => speech.stop(), []); // eslint-disable-line

  if (!summary) return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Training</h2>
      <p>No report found. Please complete the test first.</p>
      <button onClick={() => navigate("/test")} style={overlayBtn}>Go to Test</button>
    </div>
  );
  if (!active) return null;

  const childName = childProfile?.childName || "Champion";

  const handleDisorderComplete = () => {
    if (activeIndex < detected.length - 1) {
      setShowDisorderComplete(true);
      if (speech.enabled) speech.speak("Wonderful work! You completed this training section. Let's move to the next one.");
    } else {
      setShowAllDone(true);
      if (speech.enabled) speech.speak("Amazing work today! You finished all your training activities. We are so proud of you!");
    }
  };

  const goNextDisorder = () => { setShowDisorderComplete(false); setShowWelcome(true); setSecondsLeft(-1); setActiveIndex(i => i + 1); };

  const continueAfterBreak = () => {
    setSecondsLeft(timerMinutes(active.risk) * 60);
    setShowBreak(false);
    if (speech.enabled) speech.speak("Good job. Let's continue learning together.");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ffdfe9 0%, #e7efff 45%, #e5fff0 100%)", padding: "20px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", background: "rgba(255,255,255,0.97)", borderRadius: "30px", padding: "28px", boxShadow: "0 18px 38px rgba(0,0,0,0.12)", position: "relative", overflow: "hidden" }}>

        {/* bg bubbles */}
        <div style={{ position:"absolute", top:30, left:30, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.22)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:60, right:30, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.18)", pointerEvents:"none" }} />

        {/* ── Header ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", marginBottom:"20px", position:"relative", zIndex:2 }}>
          <div>
            <button onClick={() => window.print()} style={ghostBtn}>🖨 Print Plan</button>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:"36px", fontWeight:"1000", color:"#4635c9" }}>LearnEase</div>
            <div style={{ fontSize:"22px", fontWeight:"1000", color:"#ff6584", marginTop:"4px" }}>🌟 {childName}'s Training Journey</div>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center" }}>
            {/* Timer only in header */}
            <div style={{ padding:"12px 16px", borderRadius:"16px", background: showBreak ? "#fff4e8" : "#f1f7ff", border:`2px solid ${showBreak ? "#f7c58f" : "#cfe1ff"}`, textAlign:"center", minWidth:"110px" }}>
              <div style={{ fontSize:"12px", fontWeight:"900", color:"#666" }}>⏰ Timer</div>
              <div style={{ fontSize:"22px", fontWeight:"1000", color: showBreak ? "#ef6c00" : secondsLeft < 0 ? "#aaa" : "#2457d6" }}>
                {secondsLeft < 0 ? "--:--" : formatTime(Math.max(secondsLeft, 0))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Disorder tabs ── */}
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"18px", position:"relative", zIndex:2 }}>
          {detected.map((d, i) => (
            <button key={d.key} onClick={() => setActiveIndex(i)}
              style={{ padding:"12px 20px", borderRadius:"16px", border: i === activeIndex ? "3px solid #5a35ff" : "1px solid #ddd", background: i === activeIndex ? "#f0ecff" : "white", fontWeight:"900", cursor:"pointer", boxShadow: i === activeIndex ? "0 6px 16px rgba(90,53,255,0.15)" : "none" }}>
              {d.label}
            </button>
          ))}
        </div>

        {/* ── Info bar ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", marginBottom:"18px", position:"relative", zIndex:2 }}>
          <div style={metaPill}><span style={{ color:"#888" }}>Level:</span> <span style={{ color:"#5a35ff", fontWeight:"1000" }}>{levelText(active.risk)}</span></div>
          <div style={metaPill}><span style={{ color:"#888" }}>Screen time:</span> <span style={{ color:"#1c8c5e", fontWeight:"1000" }}>{timerMinutes(active.risk)} min</span></div>
          <div style={metaPill}><span style={{ color:"#888" }}>Focus:</span> <span style={{ color:"#ff6584", fontWeight:"1000" }}>{focusAreas.join(", ") || "general"}</span></div>
        </div>

        {/* ── Training area (blocked when timer up) ── */}
        <div style={{ position:"relative", zIndex:2, background:"linear-gradient(180deg,#ffffff,#f9fcff)", borderRadius:"26px", padding:"24px", border:"1px solid #ececec", boxShadow:"0 10px 24px rgba(0,0,0,0.05)", pointerEvents: showBreak ? "none" : "auto", opacity: showBreak ? 0.4 : 1, transition:"opacity 0.3s" }}>

          {/* Voice controls inside training area */}
          <div style={{ display:"flex", justifyContent:"flex-end", gap:"10px", marginBottom:"16px", flexWrap:"wrap" }}>
            <button
              onClick={() => { if (!speech.enabled) speech.startVoice(); else speech.stop(); }}
              style={{ padding:"8px 14px", borderRadius:"10px", border:"none", background: speech.enabled ? "#ff6584" : "#eee", color: speech.enabled ? "white" : "#555", fontWeight:"900", cursor:"pointer", fontSize:"13px" }}
            >
              {speech.enabled ? "🔊 Voice On" : "🔇 Voice Off"}
            </button>
            <button
              onClick={() => speech.enabled && speech.speak(`${childName}, you are doing great. Keep going!`)}
              disabled={!speech.enabled}
              style={{ padding:"8px 14px", borderRadius:"10px", border:"1px solid #ddd", background:"white", fontWeight:"900", cursor:"pointer", fontSize:"13px", opacity: speech.enabled ? 1 : 0.5 }}
            >
              🔁 Replay encouragement
            </button>
          </div>
          {active.key === "dyslexia" && (
            <DyslexiaTraining unlockedLevel={active.risk} focusAreas={focusAreas} onComplete={handleDisorderComplete} speakText={speech.speak} voiceEnabled={speech.enabled} />
          )}
          {active.key === "dysgraphia" && (
            <DysgraphiaTraining unlockedLevel={active.risk} focusAreas={focusAreas} onComplete={handleDisorderComplete} speakText={speech.speak} voiceEnabled={speech.enabled} />
          )}
          {active.key === "dyscalculia" && (
            <DyscalculiaTraining unlockedLevel={active.risk} focusAreas={focusAreas} onComplete={handleDisorderComplete} speakText={speech.speak} voiceEnabled={speech.enabled} />
          )}
        </div>

        {/* ── Parent Support ── */}
        <div ref={parentSupportRef} style={{ marginTop:"18px", background:"linear-gradient(135deg,#fff4fb,#fff9ea)", border:"1px solid #f2d8e7", borderRadius:"20px", padding:"18px", position:"relative", zIndex:2 }}>
          <button onClick={() => setParentOpen(p => !p)} style={toggleBtn}>
            👨‍👩‍👧 Parent Support Activity <span>{parentOpen ? "−" : "+"}</span>
          </button>
          {parentOpen && (
            <div style={{ marginTop:"14px" }}>
              <ul style={{ paddingLeft:"20px", lineHeight:"2", color:"#444", margin:"0 0 16px 0" }}>
                {parentTasks.map((t, i) => <li key={i} style={{ marginBottom:"6px" }}>{t}</li>)}
              </ul>
              {videoRefs.length > 0 && (
                <div>
                  <div style={{ fontWeight:"1000", color:"#444", marginBottom:"12px", fontSize:"16px" }}>🎥 Reference links</div>
                  <div style={{ display:"grid", gap:"10px" }}>
                    {videoRefs.map((v, i) => (
                      <div key={i} style={{ background:"white", border:"1px solid #eee", borderRadius:"12px", padding:"12px 14px" }}>
                        <div style={{ fontWeight:"900", color:"#333", marginBottom:"6px" }}>{v.title}</div>
                        <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.query)}`} target="_blank" rel="noreferrer"
                          style={{ color:"#5a35ff", fontWeight:"800", fontSize:"13px", textDecoration:"underline" }}>
                          🔗 Open reference video
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Food Support ── */}
        <div style={{ marginTop:"14px", background:"linear-gradient(135deg,#eefdf3,#f2fbff)", border:"1px solid #d9efe0", borderRadius:"20px", padding:"18px", position:"relative", zIndex:2 }}>
          <button onClick={() => setFoodOpen(p => !p)} style={toggleBtn}>
            🥗 Today's Food Support <span>{foodOpen ? "−" : "+"}</span>
          </button>
          <div style={{ marginTop:"12px", background:"white", border:"1px solid #dfeee3", borderRadius:"12px", padding:"12px 14px", fontWeight:"900", color:"#1f7a3d" }}>
            Today's recommendation: {getTodayFood()}
          </div>
          {foodOpen && (
            <div style={{ marginTop:"14px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
              <div style={{ background:"white", border:"1px solid #e8f0ea", borderRadius:"14px", padding:"14px" }}>
                <div style={{ fontWeight:"1000", color:"#1c8c5e", marginBottom:"8px" }}>Foods to include</div>
                <ul style={{ paddingLeft:"18px", color:"#555", lineHeight:"1.8", margin:0 }}>
                  {getHelpfulFoods().map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
              <div style={{ background:"white", border:"1px solid #f1e3e3", borderRadius:"14px", padding:"14px" }}>
                <div style={{ fontWeight:"1000", color:"#d32f2f", marginBottom:"8px" }}>Foods to limit</div>
                <ul style={{ paddingLeft:"18px", color:"#555", lineHeight:"1.8", margin:0 }}>
                  {getAvoidFoods().map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ── Overlays ── */}
        {showWelcome && (
          <Overlay>
            <div style={{ fontSize:"72px" }}>🌈</div>
            <div style={overlayTitle}>Let's start learning, {childName}!</div>
            <div style={overlayText}>
              You are doing something wonderful today.<br/>
              Let's learn step by step together. Every small win counts! 🌟
            </div>
            <div style={{ marginTop:"18px", background:"#f0ecff", borderRadius:"16px", padding:"14px", fontSize:"15px", color:"#4635c9", fontWeight:"800" }}>
              Today's adventure: <span style={{ fontWeight:"1000" }}>{active.label}</span><br/>
              <span style={{ color:"#888", fontWeight:"700", fontSize:"13px" }}>Level: {levelText(active.risk)} · {timerMinutes(active.risk)} minutes</span>
            </div>
            <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap", marginTop:"20px" }}>
              {speech.supported && (
                <button
                  onClick={() => {
                    speech.startVoice();
                    speech.speak(`Let's start learning, ${childName}! Today we are doing ${active.label}. You are going to do amazing!`);
                    setShowWelcome(false);
                    setSecondsLeft(timerMinutes(active.risk) * 60);
                  }}
                  style={overlayBtn}
                >
                  🔊 Start with Voice
                </button>
              )}
              <button
                onClick={() => {
                  setShowWelcome(false);
                  setSecondsLeft(timerMinutes(active.risk) * 60);
                }}
                style={{ ...overlayBtn, background: speech.supported ? "white" : "linear-gradient(135deg,#6c63ff,#5a35ff)", color: speech.supported ? "#333" : "white", border: speech.supported ? "1px solid #ddd" : "none", boxShadow: speech.supported ? "none" : undefined }}
              >
                ▶ Start Training
              </button>
            </div>
          </Overlay>
        )}

        {showBreak && (
          <Overlay>
            <div style={{ fontSize:"62px" }}>⏸️</div>
            <div style={overlayTitle}>Great effort! Time's up for today.</div>
            <div style={overlayText}>The screen training is now blocked. Please do the parent support activity below with your child.</div>
            <div style={{ marginTop:"16px", background:"#fff9ef", border:"1px solid #f1d8a9", borderRadius:"16px", padding:"14px", textAlign:"left" }}>
              <div style={{ fontWeight:"1000", marginBottom:"8px", color:"#444" }}>👨‍👩‍👧 Parent Activity</div>
              <ul style={{ margin:0, paddingLeft:"18px", color:"#555", lineHeight:"1.9" }}>
                {parentTasks.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
            <button
              onClick={() => {
                setParentOpen(true);
                parentSupportRef.current?.scrollIntoView({ behavior:"smooth", block:"center" });
                setShowBreak(false);
              }}
              style={overlayBtn}
            >
              Go to Parent Support ↓
            </button>
          </Overlay>
        )}

        {showDisorderComplete && (
          <Overlay>
            <div style={{ fontSize:"62px" }}>🎉</div>
            <div style={overlayTitle}>Wonderful work!</div>
            <div style={overlayText}>You completed this training section beautifully. Let's move to the next one!</div>
            <button onClick={goNextDisorder} style={overlayBtn}>Start Next Training ➜</button>
          </Overlay>
        )}

        {showAllDone && (
          <Overlay>
            <div style={{ fontSize:"64px" }}>🏆</div>
            <div style={overlayTitle}>Training Complete!</div>
            <div style={overlayText}>Amazing work today, {childName}! You finished your entire training journey. We are so proud of you!</div>
            <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
              <button onClick={() => navigate("/report")} style={overlayBtn}>View Report</button>
              <button onClick={() => navigate("/test")} style={{ ...overlayBtn, background:"white", color:"#333", border:"1px solid #ddd", boxShadow:"none" }}>Start Re-test</button>
            </div>
          </Overlay>
        )}

      </div>
    </div>
  );
}

function Overlay({ children }) {
  return (
    <div style={{ position:"absolute", inset:0, background:"rgba(255,255,255,0.82)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:20, padding:"20px", borderRadius:"30px" }}>
      <div style={{ width:"100%", maxWidth:"580px", background:"white", borderRadius:"28px", padding:"32px", textAlign:"center", boxShadow:"0 20px 50px rgba(0,0,0,0.18)", border:"1px solid #ececec" }}>
        {children}
      </div>
    </div>
  );
}

const overlayTitle = { marginTop:"10px", fontSize:"28px", fontWeight:"1000", color:"#333" };
const overlayText  = { marginTop:"10px", color:"#555", lineHeight:"1.8", fontSize:"16px" };
const overlayBtn   = { marginTop:"18px", padding:"14px 24px", borderRadius:"14px", border:"none", background:"linear-gradient(135deg,#6c63ff,#5a35ff)", color:"white", fontWeight:"1000", fontSize:"16px", cursor:"pointer", boxShadow:"0 10px 20px rgba(90,53,255,0.22)" };
const ghostBtn     = { padding:"10px 14px", borderRadius:"12px", border:"1px solid #ddd", background:"white", fontWeight:"900", cursor:"pointer", fontSize:"14px" };
const toggleBtn    = { width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", border:"none", background:"transparent", fontWeight:"1000", fontSize:"18px", color:"#333", cursor:"pointer" };
const metaPill     = { background:"rgba(255,255,255,0.8)", border:"1px solid #eee", borderRadius:"14px", padding:"12px 14px", display:"flex", gap:"8px", alignItems:"center", justifyContent:"center", flexWrap:"wrap", fontSize:"14px" };
