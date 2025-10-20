import React from "react";
import "../components/navbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar({ user }) {
  const handleLogout = async () => { await signOut(auth); };

  return (
    <header className="card flex space-between" style={{alignItems:"center"}}>
      <div style={{display:"flex", gap:12, alignItems:"center"}}>
        <div style={{fontWeight:700, fontSize:18, color:"var(--primary)"}}>FinPlay</div>
        <div style={{color:"var(--muted)"}}>Gamified Finance Tracker</div>
      </div>
      <div style={{display:"flex", gap:10, alignItems:"center"}}>
        {user ? (
          <>
            <div style={{fontSize:14, color:"var(--muted)"}}>{user.email}</div>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <div style={{color:"var(--muted)", fontSize:14}}>Please sign in</div>
        )}
      </div>
    </header>
  );
}
