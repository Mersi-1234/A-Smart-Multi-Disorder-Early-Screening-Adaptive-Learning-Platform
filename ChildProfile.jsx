/*import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChildProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    childName: "",
    age: "",
    className: "",
    schoolName: "",
    language: "",
    readingDifficulty: "",
    writingDifficulty: "",
    mathDifficulty: "",
    attentionIssues: "",
    previousTraining: "",
    remarks: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem("childProfile", JSON.stringify(form));
    alert("Child profile saved successfully!");
    navigate("/test");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffe8f2, #e7f0ff, #e8fff4)",
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
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#5a35ff", textAlign: "center" }}>
          Child Profile Form
        </h2>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Child Name</label>
          <input name="childName" value={form.childName} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>Age</label>
          <input name="age" value={form.age} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>Class / Grade</label>
          <input name="className" value={form.className} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>School Name</label>
          <input name="schoolName" value={form.schoolName} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>Preferred Language</label>
          <input name="language" value={form.language} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>Reading Difficulty</label>
          <select name="readingDifficulty" value={form.readingDifficulty} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="Sometimes">Sometimes</option>
            <option value="No">No</option>
          </select>

          <label style={labelStyle}>Writing Difficulty</label>
          <select name="writingDifficulty" value={form.writingDifficulty} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="Sometimes">Sometimes</option>
            <option value="No">No</option>
          </select>

          <label style={labelStyle}>Math Difficulty</label>
          <select name="mathDifficulty" value={form.mathDifficulty} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="Sometimes">Sometimes</option>
            <option value="No">No</option>
          </select>

          <label style={labelStyle}>Attention Issues</label>
          <select name="attentionIssues" value={form.attentionIssues} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="Sometimes">Sometimes</option>
            <option value="No">No</option>
          </select>

          <label style={labelStyle}>Previous Training Taken</label>
          <select name="previousTraining" value={form.previousTraining} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <label style={labelStyle}>Remarks</label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
          />

          <button type="submit" style={buttonStyle}>
            Save and Continue to Test
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

export default ChildProfile;*/
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import { saveChildProfile } from "../services/firestoreService";

function ChildProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    childName: "",
    age: "",
    className: "",
    schoolName: "",
    language: "",
    readingDifficulty: "",
    writingDifficulty: "",
    mathDifficulty: "",
    attentionIssues: "",
    previousTraining: "",
    remarks: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSaving) return;
    setIsSaving(true);

    try {
      localStorage.setItem("childProfile", JSON.stringify(form));

      const uid = auth.currentUser?.uid;
      if (uid) {
        await saveChildProfile(uid, form);
      }

      alert("Child profile saved successfully!");
      navigate("/test");
    } catch (error) {
      alert("Profile saved locally, but cloud save failed.");
      navigate("/test");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffe8f2, #e7f0ff, #e8fff4)",
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
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#5a35ff", textAlign: "center" }}>
          Child Profile Form
        </h2>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Child Name</label>
          <input name="childName" value={form.childName} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>Age</label>
          <input name="age" value={form.age} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>Class / Grade</label>
          <input name="className" value={form.className} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>School Name</label>
          <input name="schoolName" value={form.schoolName} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>Preferred Language</label>
          <input name="language" value={form.language} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>Reading Difficulty</label>
          <select name="readingDifficulty" value={form.readingDifficulty} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="Sometimes">Sometimes</option>
            <option value="No">No</option>
          </select>

          <label style={labelStyle}>Writing Difficulty</label>
          <select name="writingDifficulty" value={form.writingDifficulty} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="Sometimes">Sometimes</option>
            <option value="No">No</option>
          </select>

          <label style={labelStyle}>Math Difficulty</label>
          <select name="mathDifficulty" value={form.mathDifficulty} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="Sometimes">Sometimes</option>
            <option value="No">No</option>
          </select>

          <label style={labelStyle}>Attention Issues</label>
          <select name="attentionIssues" value={form.attentionIssues} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="Sometimes">Sometimes</option>
            <option value="No">No</option>
          </select>

          <label style={labelStyle}>Previous Training Taken</label>
          <select name="previousTraining" value={form.previousTraining} onChange={handleChange} style={inputStyle} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <label style={labelStyle}>Remarks</label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
          />

          <button type="submit" style={buttonStyle} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save and Continue to Test"}
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

export default ChildProfile;