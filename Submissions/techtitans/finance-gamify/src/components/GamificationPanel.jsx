// src/components/GamificationPanel.jsx
import React, { useEffect, useState } from "react";
import { db, doc, onSnapshot } from "../firebase";
import { evaluateBadges, calculateLevel } from "../utils/gamifyUtils";

export default function GamificationPanel({ user }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user || !user.uid) {
      setProfile(null);
      return;
    }
    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) setProfile({ id: snap.id, ...snap.data() });
        else setProfile(null);
      },
      (err) => {
        console.error("GamificationPanel onSnapshot error:", err);
      }
    );
    return () => unsub();
  }, [user]);

  if (!user || !user.uid) return (
    <div className="card">
      <h3>Gamification</h3>
      <p className="muted">Sign in to see your points and badges</p>
    </div>
  );

  if (!profile) return <div className="card">Loading profile...</div>;

  const badges = evaluateBadges(profile);
  const level = calculateLevel(profile.points || 0);

  return (
    <div className="card">
      <h3>Gamification</h3>
      <p>Points: <strong>{profile.points || 0}</strong> • Level: <strong>{level}</strong></p>
      <div style={{marginTop:8}}>
        <strong>Badges</strong>
        <div style={{display:"flex", gap:8, marginTop:8, flexWrap:"wrap"}}>
          {badges.length ? badges.map(b => (
            <div key={b} style={{padding:"6px 10px", background:"#e6f2ff", borderRadius:999}}>{b}</div>
          )) : <div className="muted">No badges yet — complete tasks to earn them</div>}
        </div>
      </div>
    </div>
  );
}
