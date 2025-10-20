import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import "../../styles/auth.css";

export default function Login({ onSuccess }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth,email,password);
      onSuccess && onSuccess();
    } catch(err) {
      alert("Login failed: "+err.message);
    } finally { setLoading(false); }
  };

  return (
    <form className="auth-card" onSubmit={handle}>
      <h3>Login</h3>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button className="btn" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}
