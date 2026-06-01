/*import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef4ff 0%, #fff4fb 45%, #f2fff4 100%)",
      }}
    >
      {/* Navbar *//*}
      <header
        style={{
          width: "100%",
          padding: "22px 40px",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #6c63ff, #ff6584)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "26px",
              fontWeight: "bold",
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            }}
          >
            📘
          </div>

          <div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "1000",
                color: "#3b2fb3",
                letterSpacing: "0.3px",
              }}
            >
              LearnEase
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "#666",
                fontWeight: "700",
              }}
            >
              Smart Care for Growing Minds
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "11px 18px",
                borderRadius: "12px",
                border: "1px solid #d7d7d7",
                background: "white",
                color: "#333",
                fontWeight: "900",
                cursor: "pointer",
                boxShadow: "0 6px 14px rgba(0,0,0,0.05)",
              }}
            >
              Log In
            </button>
          </Link>

          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "11px 18px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #6c63ff, #5a35ff)",
                color: "white",
                fontWeight: "900",
                cursor: "pointer",
                boxShadow: "0 10px 18px rgba(90, 53, 255, 0.22)",
              }}
            >
              Sign Up
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section *//*}
      <main
  style={{
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "10px 40px 40px",
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: "28px",
    alignItems: "center",
    boxSizing: "border-box",
  }}
>
      
        {/* Left content *//*}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.92)",
              border: "1px solid #ececec",
              borderRadius: "999px",
              padding: "8px 14px",
              color: "#5a35ff",
              fontWeight: "900",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            }}
          >
            🌟 Smart support for children, parents, and teachers
          </div>

          <h1
            style={{
              fontSize: "58px",
              lineHeight: "1.08",
              margin: "18px 0 14px",
              color: "#1f2430",
            }}
          >
            Learn better,
            <br />
            grow stronger with <span style={{ color: "#5a35ff" }}>LearnEase</span>
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.75",
              color: "#555",
              maxWidth: "720px",
              margin: 0,
              fontWeight: "500",
            }}
          >
            LearnEase helps identify possible learning difficulties in reading,
            writing, and mathematics, then provides personalized training,
            parent guidance, teacher support, and progress tracking in one
            child-friendly platform.
          </p>

          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              marginTop: "24px",
            }}
          >
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "14px 22px",
                  borderRadius: "14px",
                  border: "none",
                  background: "linear-gradient(135deg, #6c63ff, #5a35ff)",
                  color: "white",
                  fontWeight: "1000",
                  cursor: "pointer",
                  fontSize: "16px",
                  boxShadow: "0 14px 24px rgba(90, 53, 255, 0.22)",
                }}
              >
                Get Started
              </button>
            </Link>

            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "14px 22px",
                  borderRadius: "14px",
                  border: "1px solid #d9d9d9",
                  background: "white",
                  color: "#333",
                  fontWeight: "900",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Continue to Login
              </button>
            </Link>
          </div>

         
        </div>

        {/* Right side professional cards *//*}
        <div>
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "1px solid #ececec",
              borderRadius: "28px",
              padding: "22px",
              boxShadow: "0 18px 38px rgba(0,0,0,0.10)",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #fff7d6, #ffe7f2)",
                borderRadius: "24px",
                padding: "20px",
                border: "1px solid #f2dba8",
              }}
            >
              <div style={{ fontSize: "72px", textAlign: "center" }}>
                🧒📚🧩
              </div>

              <div
                style={{
                  marginTop: "8px",
                  textAlign: "center",
                  fontSize: "22px",
                  fontWeight: "1000",
                  color: "#333",
                }}
              >
                How LearnEase Helps
              </div>

              <div
                style={{
                  marginTop: "18px",
                  display: "grid",
                  gap: "12px",
                }}
              >
                <InfoCard
                  icon="1️⃣"
                  title="Understand the child better"
                  text="Collect child profile details, parent observations, and teacher inputs."
                />
                <InfoCard
                  icon="2️⃣"
                  title="Assess only when needed"
                  text="First-time children take the full test. Returning children continue with training or re-test."
                />
                <InfoCard
                  icon="3️⃣"
                  title="Improve with guided support"
                  text="Interactive activities, read-aloud help, parent tasks, and progress-based training."
                />
              </div>
            </div>

            <div
              style={{
                marginTop: "18px",
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "12px",
              }}
            >
              <MiniStat icon="📖" label="Reading" />
              <MiniStat icon="✍️" label="Writing" />
              <MiniStat icon="🔢" label="Math" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.94)",
        border: "1px solid #ececec",
        borderRadius: "20px",
        padding: "18px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontSize: "28px" }}>{icon}</div>
      <div
        style={{
          marginTop: "8px",
          fontWeight: "1000",
          color: "#333",
          fontSize: "17px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: "6px",
          color: "#666",
          lineHeight: "1.6",
          fontSize: "14px",
        }}
      >
        {text}
      </div>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "14px",
        border: "1px solid #f0f0f0",
      }}
    >
      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <div style={{ fontSize: "22px" }}>{icon}</div>
        <div>
          <div
            style={{
              fontWeight: "1000",
              color: "#333",
              fontSize: "15px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: "4px",
              color: "#666",
              lineHeight: "1.6",
              fontSize: "14px",
            }}
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon, label }) {
  return (
    <div
      style={{
        background: "#f8fbff",
        borderRadius: "16px",
        padding: "14px",
        textAlign: "center",
        border: "1px solid #e8eef8",
      }}
    >
      <div style={{ fontSize: "28px" }}>{icon}</div>
      <div
        style={{
          marginTop: "6px",
          fontWeight: "900",
          color: "#444",
        }}
      >
        {label}
      </div>
    </div>
  );
}*/
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eaf2ff 0%, #fff2fa 45%, #eefdf2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* soft background bubbles */}
      <div style={bubbleOne}></div>
      <div style={bubbleTwo}></div>
      <div style={bubbleThree}></div>

      {/* Navbar */}
      <header
        style={{
          width: "100%",
          padding: "22px 40px",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={logoBox}>
            <div style={{ fontSize: "28px" }}>🧠</div>
            <div style={smallBook}>📘</div>
            <div style={smallStar}>✨</div>
          </div>

          <div>
            <div
              style={{
                fontSize: "38px",
                fontWeight: "1000",
                color: "#3b2fb3",
                letterSpacing: "0.4px",
                lineHeight: 1,
              }}
            >
              LearnEase
            </div>
            <div
              style={{
                fontSize: "17px",
                color: "#5f6470",
                fontWeight: "800",
                marginTop: "6px",
              }}
            >
              Smart Care for Growing Minds
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "12px 22px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.45)",
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                color: "#333",
                fontWeight: "900",
                cursor: "pointer",
                boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
              }}
            >
              Log In
            </button>
          </Link>

          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "12px 22px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.3)",
                background: "linear-gradient(135deg, #6c63ff, #5a35ff)",
                color: "white",
                fontWeight: "900",
                cursor: "pointer",
                boxShadow: "0 12px 22px rgba(90, 53, 255, 0.24)",
              }}
            >
              Sign Up
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "10px 40px 40px",
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: "28px",
          alignItems: "center",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Left content */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.45)",
              borderRadius: "999px",
              padding: "10px 16px",
              color: "#5a35ff",
              fontWeight: "900",
              boxShadow: "0 10px 22px rgba(0,0,0,0.05)",
            }}
          >
            🌟 Smart support for children, parents, and teachers
          </div>

          <h1
            style={{
              fontSize: "64px",
              lineHeight: "1.05",
              margin: "20px 0 16px",
              color: "#1f2430",
            }}
          >
            Learn better,
            <br />
            grow stronger with <span style={{ color: "#5a35ff" }}>LearnEase</span>
          </h1>

          <p
            style={{
              fontSize: "19px",
              lineHeight: "1.8",
              color: "#555",
              maxWidth: "720px",
              margin: 0,
              fontWeight: "500",
            }}
          >
            LearnEase helps identify possible learning difficulties in reading,
            writing, and mathematics, then provides personalized training,
            parent guidance, teacher support, and progress tracking in one
            child-friendly platform.
          </p>

          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              marginTop: "26px",
            }}
          >
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "15px 24px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "linear-gradient(135deg, #6c63ff, #5a35ff)",
                  color: "white",
                  fontWeight: "1000",
                  cursor: "pointer",
                  fontSize: "17px",
                  boxShadow: "0 14px 24px rgba(90, 53, 255, 0.22)",
                }}
              >
                Get Started
              </button>
            </Link>

            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "15px 24px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.5)",
                  background: "rgba(255,255,255,0.52)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  color: "#333",
                  fontWeight: "900",
                  cursor: "pointer",
                  fontSize: "17px",
                  boxShadow: "0 10px 18px rgba(0,0,0,0.05)",
                }}
              >
                Continue to Login
              </button>
            </Link>
          </div>
        </div>

        {/* Right side professional cards */}
        <div>
          <div
            style={{
              background: "rgba(255,255,255,0.38)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.5)",
              borderRadius: "30px",
              padding: "22px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.10)",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, rgba(255,247,214,0.82), rgba(255,231,242,0.82))",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "24px",
                padding: "20px",
                border: "1px solid rgba(242,219,168,0.7)",
              }}
            >
              <div style={{ fontSize: "72px", textAlign: "center" }}>
                🧒📚🧩
              </div>

              <div
                style={{
                  marginTop: "8px",
                  textAlign: "center",
                  fontSize: "22px",
                  fontWeight: "1000",
                  color: "#333",
                }}
              >
                How LearnEase Helps
              </div>

              <div
                style={{
                  marginTop: "18px",
                  display: "grid",
                  gap: "12px",
                }}
              >
                <InfoCard
                  icon="1️⃣"
                  title="Understand the child better"
                  text="Collect child profile details, parent observations, and teacher inputs."
                />
                <InfoCard
                  icon="2️⃣"
                  title="Assess only when needed"
                  text="First-time children take the full test. Returning children continue with training or re-test."
                />
                <InfoCard
                  icon="3️⃣"
                  title="Improve with guided support"
                  text="Interactive activities, read-aloud help, parent tasks, and progress-based training."
                />
              </div>
            </div>

            <div
              style={{
                marginTop: "18px",
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "12px",
              }}
            >
              <MiniStat icon="📖" label="Reading" />
              <MiniStat icon="✍️" label="Writing" />
              <MiniStat icon="🔢" label="Math" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "18px",
        padding: "14px",
        border: "1px solid rgba(255,255,255,0.55)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <div style={{ fontSize: "22px" }}>{icon}</div>
        <div>
          <div
            style={{
              fontWeight: "1000",
              color: "#333",
              fontSize: "15px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: "4px",
              color: "#666",
              lineHeight: "1.6",
              fontSize: "14px",
            }}
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon, label }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.52)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "14px",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 8px 18px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ fontSize: "28px" }}>{icon}</div>
      <div
        style={{
          marginTop: "6px",
          fontWeight: "900",
          color: "#444",
        }}
      >
        {label}
      </div>
    </div>
  );
}

const logoBox = {
  width: "68px",
  height: "68px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #6c63ff, #ff79a8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontWeight: "bold",
  boxShadow: "0 12px 24px rgba(0,0,0,0.14)",
  position: "relative",
};

const smallBook = {
  position: "absolute",
  bottom: "9px",
  right: "9px",
  fontSize: "15px",
};

const smallStar = {
  position: "absolute",
  top: "7px",
  left: "8px",
  fontSize: "12px",
};

const bubbleOne = {
  position: "absolute",
  top: "80px",
  left: "80px",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.22)",
  filter: "blur(4px)",
};

const bubbleTwo = {
  position: "absolute",
  right: "120px",
  top: "180px",
  width: "260px",
  height: "260px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.18)",
  filter: "blur(4px)",
};

const bubbleThree = {
  position: "absolute",
  bottom: "60px",
  left: "40%",
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.14)",
  filter: "blur(4px)",
};