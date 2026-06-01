/*import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/authService";
import {
  saveParentProfile,
  saveStudentOrTeacherProfile,
} from "../services/firestoreService";

function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signupUser(email, password);
      const uid = userCredential.user.uid;

      if (role === "parent") {
        if (!consent) {
          alert("Please accept the consent checkbox.");
          return;
        }

        await saveParentProfile(uid, {
          parentName,
          email,
          phone,
          childName,
          relationship,
          consent,
        });
      } else {
        await saveStudentOrTeacherProfile(uid, {
          role,
          fullName,
          email,
        });
      }

      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffd6e8, #d7e8ff, #d8ffe1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "white",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#5a35ff", textAlign: "center" }}>
          Create Account
        </h2>

        <form onSubmit={handleSignup}>
          <label style={labelStyle}>Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
          </select>

          {role !== "parent" && (
            <>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={inputStyle}
                required
              />
            </>
          )}

          {role === "parent" && (
            <>
              <label style={labelStyle}>Parent Full Name</label>
              <input
                type="text"
                placeholder="Enter parent name"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                style={inputStyle}
                required
              />

              <label style={labelStyle}>Child Name</label>
              <input
                type="text"
                placeholder="Enter child name"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                style={inputStyle}
                required
              />

              <label style={labelStyle}>Relationship</label>
              <input
                type="text"
                placeholder="Example: Mother / Father / Guardian"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                style={inputStyle}
                required
              />

              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
                required
              />
            </>
          )}

          <label style={labelStyle}>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          {role === "parent" && (
            <label
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                marginTop: "14px",
                fontSize: "14px",
                color: "#444",
              }}
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                I agree to share my contact details for teacher-parent
                communication related to the child’s learning support and
                progress.
              </span>
            </label>
          )}

          <button type="submit" style={buttonStyle}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginTop: "14px",
  marginBottom: "6px",
  fontWeight: "700",
  color: "#444",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #ccc",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  marginTop: "20px",
  padding: "13px",
  borderRadius: "14px",
  border: "none",
  background: "#5a35ff",
  color: "white",
  fontWeight: "900",
  fontSize: "16px",
  cursor: "pointer",
};

export default Signup;*//*.............. Codeeeeeeeeeee..................*//*
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/authService";
import {
  saveParentProfile,
  saveTeacherProfile,
  saveStudentProfile,
} from "../services/firestoreService";

const initialForm = {
  email: "",
  password: "",
  confirmPassword: "",

  // parent
  parentName: "",
  phone: "",
  relationship: "",
  notes: "",
  consent: false,

  // teacher
  teacherName: "",
  schoolName: "",
  classHandled: "",
  designation: "",

  // student
  studentName: "",
  age: "",
  className: "",
  schoolNameStudent: "",
  parentNameStudent: "",
};
function withTimeout(promise, ms = 10000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out. Please try again.")), ms)
    ),
  ]);
}

function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("parent");
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setForm(initialForm);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return passwordRegex.test(password);
  };

 /* const handleSignup = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (form.password !== form.confirmPassword) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    if (!validatePassword(form.password)) {
      alert(
        "Password must be at least 8 characters and include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
      );
      return;
    }

    if (role === "parent" && !form.consent) {
      alert("Please accept the consent checkbox.");
      return;
    }

    setIsSubmitting(true);

    try {
      const userCredential = await signupUser(form.email.trim(), form.password);
      const uid = userCredential.user.uid;

      if (role === "parent") {
        await saveParentProfile(uid, {
          parentName: form.parentName,
          email: form.email.trim(),
          phone: form.phone,
          relationship: form.relationship,
          notes: form.notes,
          consent: form.consent,
        });
      } else if (role === "teacher") {
        await saveTeacherProfile(uid, {
          teacherName: form.teacherName,
          email: form.email.trim(),
          phone: form.phone,
          schoolName: form.schoolName,
          classHandled: form.classHandled,
          designation: form.designation,
          notes: form.notes,
        });
      } else if (role === "student") {
        await saveStudentProfile(uid, {
          studentName: form.studentName,
          email: form.email.trim(),
          age: form.age,
          className: form.className,
          schoolNameStudent: form.schoolNameStudent,
          parentName: form.parentNameStudent,
        });
      }

      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert(
          "This email is already registered in Firebase. If this was your first click, the account was likely created successfully. Please try logging in now."
        );
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        alert("Password is too weak. Please use a stronger password.");
      } else {
        alert(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };*/ /*..........................................................*//*
  const handleSignup = async (e) => {
  e.preventDefault();

  if (isSubmitting) return;

  if (form.password !== form.confirmPassword) {
    alert("Password and Confirm Password do not match.");
    return;
  }

  if (!validatePassword(form.password)) {
    alert(
      "Password must be at least 8 characters and include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
    );
    return;
  }

  if (role === "parent" && !form.consent) {
    alert("Please accept the consent checkbox.");
    return;
  }

  setIsSubmitting(true);

  try {
    console.log("Step 1: Starting signup...");

    const userCredential = await signupUser(form.email.trim(), form.password);
    const uid = userCredential.user.uid;

    console.log("Step 2: Auth signup successful, UID:", uid);

    if (role === "parent") {
      console.log("Step 3: Saving parent profile...");
      await saveParentProfile(uid, {
        parentName: form.parentName,
        email: form.email.trim(),
        phone: form.phone,
        relationship: form.relationship,
        notes: form.notes,
        consent: form.consent,
      });
      console.log("Step 4: Parent profile saved");
    } else if (role === "teacher") {
      console.log("Step 3: Saving teacher profile...");
      await saveTeacherProfile(uid, {
        teacherName: form.teacherName,
        email: form.email.trim(),
        phone: form.phone,
        schoolName: form.schoolName,
        classHandled: form.classHandled,
        designation: form.designation,
        notes: form.notes,
      });
      console.log("Step 4: Teacher profile saved");
    } else if (role === "student") {
      console.log("Step 3: Saving student profile...");
      await saveStudentProfile(uid, {
        studentName: form.studentName,
        email: form.email.trim(),
        age: form.age,
        className: form.className,
        schoolNameStudent: form.schoolNameStudent,
        parentName: form.parentNameStudent,
      });
      console.log("Step 4: Student profile saved");
    }

    console.log("Step 5: Signup completed");
    alert("Signup successful!");
    navigate("/login");
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === "auth/email-already-in-use") {
      alert(
        "This email is already registered in Firebase. If this was your first click, the account was likely created successfully. Please try logging in now."
      );
    } else if (error.code === "auth/invalid-email") {
      alert("Please enter a valid email address.");
    } else if (error.code === "auth/weak-password") {
      alert("Password is too weak. Please use a stronger password.");
    } else {
      alert(error.message || "Something went wrong during signup.");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef4ff,#fff4fb,#f2fff4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "white",
          borderRadius: "20px",
          padding: "28px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#5a35ff" }}>
          Create LearnEase Account
        </h2>

        <form onSubmit={handleSignup} autoComplete="off">
          <label style={labelStyle}>Select Role</label>
          <select value={role} onChange={handleRoleChange} style={inputStyle}>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          {role === "parent" && (
            <>
              <SectionTitle title="Parent Details" />
              <Field
                label="Parent Full Name"
                name="parentName"
                value={form.parentName}
                onChange={handleChange}
              />
              <Field
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              <Field
                label="Relationship to Child"
                name="relationship"
                value={form.relationship}
                onChange={handleChange}
                placeholder="Mother / Father / Guardian"
              />
              <label style={labelStyle}>Additional Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                style={{ ...inputStyle, height: "80px" }}
              />
              <label style={{ display: "flex", marginTop: "10px", gap: "8px" }}>
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={handleChange}
                />
                <span style={{ fontSize: "14px" }}>
                  I agree to share my contact information for communication with teachers.
                </span>
              </label>
            </>
          )}

          {role === "teacher" && (
            <>
              <SectionTitle title="Teacher Details" />
              <Field
                label="Teacher Name"
                name="teacherName"
                value={form.teacherName}
                onChange={handleChange}
              />
              <Field
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              <Field
                label="School Name"
                name="schoolName"
                value={form.schoolName}
                onChange={handleChange}
              />
              <Field
                label="Class Handled"
                name="classHandled"
                value={form.classHandled}
                onChange={handleChange}
              />
              <Field
                label="Designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
              />
              <label style={labelStyle}>Additional Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                style={{ ...inputStyle, height: "80px" }}
              />
            </>
          )}

          {role === "student" && (
            <>
              <SectionTitle title="Student Details" />
              <Field
                label="Student Name"
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
              />
              <Field
                label="Age"
                name="age"
                value={form.age}
                onChange={handleChange}
              />
              <Field
                label="Class / Grade"
                name="className"
                value={form.className}
                onChange={handleChange}
              />
              <Field
                label="School Name"
                name="schoolNameStudent"
                value={form.schoolNameStudent}
                onChange={handleChange}
              />
              <Field
                label="Parent Name"
                name="parentNameStudent"
                value={form.parentNameStudent}
                onChange={handleChange}
              />
            </>
          )}

          <SectionTitle title="Account Details" />
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <PasswordField
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            show={showPassword}
            setShow={setShowPassword}
          />

          <div style={{ marginTop: "6px", fontSize: "13px", color: "#666" }}>
            Password must contain at least 8 characters, 1 uppercase, 1 lowercase,
            1 number, and 1 special character.
          </div>

          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
          />

          <button
            style={{
              ...buttonStyle,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h3 style={{ marginTop: "18px", color: "#333", fontWeight: "900" }}>
      {title}
    </h3>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        autoComplete="off"
        style={inputStyle}
      />
    </div>
  );
}

function PasswordField({ label, name, value, onChange, show, setShow }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          required
          autoComplete="new-password"
          style={{ ...inputStyle, paddingRight: "50px" }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginTop: "10px",
  fontWeight: "700",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  marginTop: "4px",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  marginTop: "20px",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  background: "#5a35ff",
  color: "white",
  fontWeight: "900",
};

export default Signup;*/
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/authService";
import {
  saveParentProfile,
  saveTeacherProfile,
  saveStudentProfile,
} from "../services/firestoreService";

const initialForm = {
  email: "",
  password: "",
  confirmPassword: "",

  // parent
  parentName: "",
  phone: "",
  relationship: "",
  notes: "",
  consent: false,

  // teacher
  teacherName: "",
  schoolName: "",
  classHandled: "",
  designation: "",

  // student
  studentName: "",
  age: "",
  className: "",
  schoolNameStudent: "",
  parentNameStudent: "",
};

function withTimeout(promise, ms = 10000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out. Please try again.")), ms)
    ),
  ]);
}

function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("parent");
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setForm(initialForm);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (form.password !== form.confirmPassword) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    if (!validatePassword(form.password)) {
      alert(
        "Password must be at least 8 characters and include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
      );
      return;
    }

    if (role === "parent" && !form.consent) {
      alert("Please accept the consent checkbox.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Step 1: Starting signup...");

      const userCredential = await signupUser(form.email.trim(), form.password);
      const uid = userCredential.user.uid;

      console.log("Step 2: Auth signup successful, UID:", uid);

      try {
        if (role === "parent") {
          console.log("Step 3: Saving parent profile...");

          await withTimeout(
            saveParentProfile(uid, {
              parentName: form.parentName,
              email: form.email.trim(),
              phone: form.phone,
              relationship: form.relationship,
              notes: form.notes,
              consent: form.consent,
            }),
            10000
          );

          console.log("Step 4: Parent profile saved");
        } else if (role === "teacher") {
          console.log("Step 3: Saving teacher profile...");

          await withTimeout(
            saveTeacherProfile(uid, {
              teacherName: form.teacherName,
              email: form.email.trim(),
              phone: form.phone,
              schoolName: form.schoolName,
              classHandled: form.classHandled,
              designation: form.designation,
              notes: form.notes,
            }),
            10000
          );

          console.log("Step 4: Teacher profile saved");
        } else if (role === "student") {
          console.log("Step 3: Saving student profile...");

          await withTimeout(
            saveStudentProfile(uid, {
              studentName: form.studentName,
              email: form.email.trim(),
              age: form.age,
              className: form.className,
              schoolNameStudent: form.schoolNameStudent,
              parentName: form.parentNameStudent,
            }),
            10000
          );

          console.log("Step 4: Student profile saved");
        }
      } catch (profileError) {
        console.error("Profile save error:", profileError);
        alert("Account created successfully, but profile saving took too long. Please log in now.");
        navigate("/login");
        return;
      }

      console.log("Step 5: Signup completed");
      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);

      if (error.code === "auth/email-already-in-use") {
        alert(
          "This email is already registered in Firebase. Your account was likely created already. Please log in now."
        );
        navigate("/login");
        return;
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        alert("Password is too weak. Please use a stronger password.");
      } else {
        alert(error.message || "Something went wrong during signup.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef4ff,#fff4fb,#f2fff4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "white",
          borderRadius: "20px",
          padding: "28px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#5a35ff" }}>
          Create LearnEase Account
        </h2>

        <form onSubmit={handleSignup} autoComplete="off">
          <label style={labelStyle}>Select Role</label>
          <select value={role} onChange={handleRoleChange} style={inputStyle}>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          {role === "parent" && (
            <>
              <SectionTitle title="Parent Details" />
              <Field
                label="Parent Full Name"
                name="parentName"
                value={form.parentName}
                onChange={handleChange}
              />
              <Field
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              <Field
                label="Relationship to Child"
                name="relationship"
                value={form.relationship}
                onChange={handleChange}
                placeholder="Mother / Father / Guardian"
              />
              <label style={labelStyle}>Additional Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                style={{ ...inputStyle, height: "80px" }}
              />
              <label style={{ display: "flex", marginTop: "10px", gap: "8px" }}>
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={handleChange}
                />
                <span style={{ fontSize: "14px" }}>
                  I agree to share my contact information for communication with teachers.
                </span>
              </label>
            </>
          )}

          {role === "teacher" && (
            <>
              <SectionTitle title="Teacher Details" />
              <Field
                label="Teacher Name"
                name="teacherName"
                value={form.teacherName}
                onChange={handleChange}
              />
              <Field
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              <Field
                label="School Name"
                name="schoolName"
                value={form.schoolName}
                onChange={handleChange}
              />
              <Field
                label="Class Handled"
                name="classHandled"
                value={form.classHandled}
                onChange={handleChange}
              />
              <Field
                label="Designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
              />
              <label style={labelStyle}>Additional Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                style={{ ...inputStyle, height: "80px" }}
              />
            </>
          )}

          {role === "student" && (
            <>
              <SectionTitle title="Student Details" />
              <Field
                label="Student Name"
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
              />
              <Field
                label="Age"
                name="age"
                value={form.age}
                onChange={handleChange}
              />
              <Field
                label="Class / Grade"
                name="className"
                value={form.className}
                onChange={handleChange}
              />
              <Field
                label="School Name"
                name="schoolNameStudent"
                value={form.schoolNameStudent}
                onChange={handleChange}
              />
              <Field
                label="Parent Name"
                name="parentNameStudent"
                value={form.parentNameStudent}
                onChange={handleChange}
              />
            </>
          )}

          <SectionTitle title="Account Details" />
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <PasswordField
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            show={showPassword}
            setShow={setShowPassword}
          />

          <div style={{ marginTop: "6px", fontSize: "13px", color: "#666" }}>
            Password must contain at least 8 characters, 1 uppercase, 1 lowercase,
            1 number, and 1 special character.
          </div>

          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
          />

          <button
            style={{
              ...buttonStyle,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h3 style={{ marginTop: "18px", color: "#333", fontWeight: "900" }}>
      {title}
    </h3>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        autoComplete="off"
        style={inputStyle}
      />
    </div>
  );
}

function PasswordField({ label, name, value, onChange, show, setShow }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          required
          autoComplete="new-password"
          style={{ ...inputStyle, paddingRight: "50px" }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginTop: "10px",
  fontWeight: "700",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  marginTop: "4px",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  marginTop: "20px",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  background: "#5a35ff",
  color: "white",
  fontWeight: "900",
};

export default Signup;