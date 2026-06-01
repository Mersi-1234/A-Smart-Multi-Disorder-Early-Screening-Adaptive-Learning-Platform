/*import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";

export default function FirestoreTest() {
  const testWrite = async () => {
    try {
      const result = await addDoc(collection(db, "parentTeacherChat"), {
        senderUid: auth.currentUser?.uid || "test-user",
        senderRole: "parent",
        senderName: "Test User",
        text: "Hello from Firestore test",
        createdAtClient: Date.now(),
      });

      alert("Write success: " + result.id);
      console.log("Write success:", result.id);
    } catch (error) {
      console.error("Firestore test error:", error);
      alert("Firestore test error: " + error.message);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Firestore Test</h1>
      <button
        onClick={testWrite}
        style={{
          padding: "14px 22px",
          borderRadius: "12px",
          border: "none",
          background: "#5a35ff",
          color: "white",
          fontWeight: "900",
          cursor: "pointer",
        }}
      >
        Test Firestore Write
      </button>
    </div>
  );
}*/

import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";

export default function FirestoreTest() {
  const testWrite = async () => {
    try {
      console.log("Firebase projectId:", db.app.options.projectId);
      console.log("Firebase auth currentUser:", auth.currentUser);

      const result = await addDoc(collection(db, "parentTeacherChat"), {
        senderUid: auth.currentUser?.uid || "debug-user",
        senderRole: "parent",
        senderName: "Debug User",
        text: "Hello from Firestore debug test",
        createdAtClient: Date.now(),
      });

      alert("Write success: " + result.id);
      console.log("Write success:", result.id);
    } catch (error) {
      console.error("Firestore test error full:", error);
      alert(
        `Firestore test error:\ncode: ${error.code || "no-code"}\nmessage: ${
          error.message || "no-message"
        }`
      );
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Firestore Debug Test</h1>
      <button
        onClick={testWrite}
        style={{
          padding: "14px 22px",
          borderRadius: "12px",
          border: "none",
          background: "#5a35ff",
          color: "white",
          fontWeight: "900",
          cursor: "pointer",
        }}
      >
        Test Firestore Write
      </button>
    </div>
  );
}