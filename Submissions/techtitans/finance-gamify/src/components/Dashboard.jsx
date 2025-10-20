import React, { useEffect, useState } from "react";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import BudgetGoal from "./BudgetGoal";
import GamificationPanel from "./GamificationPanel";
import ExpensesChart from "./Charts/ExpensesChart";
import ExportButton from "./ExportButton";
import "../styles/dashboard.css";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "../firebase";
//import { useAuthState } from "react-firebase-hooks/auth";

export default function Dashboard({ user }) {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    if (!user || !user.uid) {
      setTransactions([]);
      return;
    }
    const q = query(
      collection(db, "transactions"),
      where("createdBy", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTransactions(items);
    });
    return unsub;
  }, [user]);
  return (
    <div className="container" style={{display:"grid", gridTemplateColumns:"1fr 420px", gap:20}}>
      <div style={{marginBottom:8}}>
        <strong>Debug:</strong>
        <div>User UID: {user && user.uid ? user.uid : <em>not signed in</em>}</div>
        <div>Loaded transactions: {transactions.length}</div>
      </div>
      <div style={{display:"grid", gap:16}}>
        <TransactionForm user={user} />
        <TransactionList user={user} />
      </div>

      <aside style={{display:"grid", gap:16}}>
        <GamificationPanel user={user} />
        <BudgetGoal user={user} />
        <ExpensesChart />
        <ExportButton transactions={user && user.uid ? transactions : []} />
      </aside>
    </div>
  );
}
