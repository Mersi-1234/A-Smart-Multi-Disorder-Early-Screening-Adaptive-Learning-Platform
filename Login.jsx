import { useState } from "react";
import { loginUser } from "../services/authService";
import { getUserProfile } from "../services/firestoreService";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();

  const getRedirectPath = (profile) => {
    const role = (profile?.role || "").toLowerCase();

    if (role === "student") return "/student";
    if (role === "parent") return "/parent";
    if (role === "teacher") return "/teacher";
    return "/";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoginSuccess(false);

    try {
      const userCredential = await loginUser(email.trim(), password);
      const uid = userCredential.user.uid;
      const profile = await getUserProfile(uid);

      if (!profile) {
        alert("User profile not found.");
        setIsSubmitting(false);
        return;
      }

      const normalizedRole = (profile.role || "").toLowerCase();
      const loginStamp = new Date().toISOString();

      localStorage.setItem("role", normalizedRole);
      localStorage.setItem("lastLoginAt", loginStamp);
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          uid,
          email: profile.email || email.trim(),
          role: normalizedRole,
          name:
            profile.parentName ||
            profile.teacherName ||
            profile.studentName ||
            "User",
          lastLoginAt: loginStamp,
        })
      );

      setLoginSuccess(true);
      setIsSubmitting(false);

      // clear stale data only if this is a different user than last session
      const lastUid = JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.uid;
      if (lastUid && lastUid !== uid) {
        localStorage.removeItem("reportSummary");
        localStorage.removeItem("previousReportSummary");
        localStorage.removeItem("readingAssessment");
        localStorage.removeItem("writingAssessment");
        localStorage.removeItem("mathAssessment");
        localStorage.removeItem("retestRequired");
      }

      setTimeout(() => {
        navigate(getRedirectPath(profile));
      }, 900);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else if (error.code === "auth/invalid-credential") {
        alert("Invalid email or password.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else {
        alert(error.message);
      }
      setIsSubmitting(false);
      setLoginSuccess(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef4ff 0%, #fff4fb 45%, #f2fff4 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          width: "100%",
          maxWidth: "520px",
          background: "rgba(255,255,255,0.97)",
          borderRadius: "28px",
          padding: "34px",
          boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
          position: "relative",
          zIndex: 2,
          border: "1px solid rgba(255,255,255,0.6)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "82px",
              height: "82px",
              margin: "0 auto 16px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #6c63ff, #ff7aa2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "38px",
              boxShadow: "0 14px 26px rgba(0,0,0,0.14)",
            }}
          >
            📘
          </div>

          <div
            style={{
              fontSize: "34px",
              fontWeight: "1000",
              color: "#3b2fb3",
              lineHeight: 1.1,
            }}
          >
            LearnEase
          </div>

          <h2
            style={{
              margin: "12px 0 0 0",
              color: "#5a35ff",
              fontSize: "28px",
              fontWeight: "1000",
            }}
          >
            Welcome Back
          </h2>
        </div>

        <form onSubmit={handleLogin} autoComplete="on">
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <label htmlFor="password" style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: "54px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loginSuccess}
            style={{
              ...buttonStyle,
              opacity: isSubmitting || loginSuccess ? 0.9 : 1,
              cursor: isSubmitting || loginSuccess ? "not-allowed" : "pointer",
              background: loginSuccess
                ? "linear-gradient(135deg, #35b36b, #219653)"
                : "linear-gradient(135deg, #6c63ff, #5a35ff)",
              boxShadow: loginSuccess
                ? "0 12px 22px rgba(33, 150, 83, 0.22)"
                : "0 12px 22px rgba(90, 53, 255, 0.22)",
            }}
          >
            {isSubmitting
              ? "Signing in..."
              : loginSuccess
              ? "Login Successful ✅"
              : "Log In"}
          </button>
        </form>

        <div
          style={{
            marginTop: "18px",
            textAlign: "center",
            color: "#666",
            fontSize: "14px",
          }}
        >
          Don’t have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#5a35ff",
              fontWeight: "900",
              textDecoration: "none",
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginTop: "14px",
  marginBottom: "6px",
  fontWeight: "800",
  color: "#444",
  fontSize: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "14px 14px",
  borderRadius: "16px",
  border: "1px solid #d6d6e7",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  background: "#fcfcff",
};

const buttonStyle = {
  width: "100%",
  marginTop: "24px",
  padding: "15px",
  borderRadius: "16px",
  border: "none",
  color: "white",
  fontWeight: "1000",
  fontSize: "16px",
};

const bubbleOne = {
  position: "absolute",
  top: "60px",
  left: "60px",
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.24)",
};

const bubbleTwo = {
  position: "absolute",
  bottom: "50px",
  right: "70px",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.20)",
};

const bubbleThree = {
  position: "absolute",
  top: "180px",
  right: "220px",
  width: "110px",
  height: "110px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.22)",
};

export default Login;