import React, { useState, useEffect } from "react";
import { db, doc, setDoc, getDoc } from "../firebase";

export default function BudgetGoal({ user }) {
  const [budget, setBudget] = useState({ monthly: 0, goal: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load(){
      if (!user || !user.uid) return;
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setBudget({ monthly: data.monthlyBudget || 0, goal: data.savingsGoal || 0 });
        }
      } catch (err) {
        console.error("BudgetGoal load error:", err);
      }
    }
    load();
  }, [user]);

  const save = async () => {
    if (!user || !user.uid) {
      alert("Sign in to save your budget");
      return;
    }
    setLoading(true);
    try {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, { monthlyBudget: Number(budget.monthly), savingsGoal: Number(budget.goal) }, { merge: true });
      alert("Budget & goal saved");
    } catch (err) {
      console.error("BudgetGoal save error:", err);
      alert("Error saving budget: " + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.uid) return (
    <div className="card">
      <h3>Budget & Savings Goal</h3>
      <p className="muted">Sign in to view and save your budget</p>
    </div>
  );

  return (
    <div className="card">
      <h3>Budget & Savings Goal</h3>
      <label>Monthly budget</label>
      <input value={budget.monthly} onChange={e=>setBudget({...budget, monthly:e.target.value})} />
      <label>Savings goal</label>
      <input value={budget.goal} onChange={e=>setBudget({...budget, goal:e.target.value})} />
      <button className="btn" onClick={save} disabled={loading}>{loading ? "Saving..." : "Save"}</button>
    </div>
  );
}
