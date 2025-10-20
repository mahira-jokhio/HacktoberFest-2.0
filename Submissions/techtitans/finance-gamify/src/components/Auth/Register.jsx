import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, setDoc, doc, serverTimestamp } from "../../firebase";
import "../../styles/auth.css";
import { calculateLevel } from "../../utils/gamifyUtils";

export default function Register({ onSuccess }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth,email,password);
      const profileRef = doc(db, "users", userCred.user.uid);
      await setDoc(profileRef, {
        email,
        points: 0,
        badges: [],
        level: calculateLevel(0),
        goalsReached: 0,
        createdAt: serverTimestamp()
      });
      onSuccess && onSuccess();
    } catch(err) {
      alert("Registration failed: " + err.message);
    } finally { setLoading(false); }
  };

  return (
    <form className="auth-card" onSubmit={handle}>
      <h3>Create Account</h3>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button className="btn" type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
    </form>
  );
}
