import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import "./TransactionList.css";

export default function TransactionList({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

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
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setTransactions(items);
      },
      (err) => {
        console.error("TransactionList onSnapshot error:", err);
        alert("Error loading transactions: " + (err?.message || String(err)));
      }
    );
    return unsub;
  }, [user]);

  const filtered = transactions.filter(t => {
    if (filter !== "All" && t.category !== filter) return false;
    if (search && !(t.description || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="card">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h3>Transactions</h3>
        <div style={{display:"flex", gap:8}}>
          <select value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Income">Income</option>
            <option value="Savings">Savings</option>
          </select>
          <input placeholder="Search" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{marginTop:12}}>
        {!user || !user.uid ? (
          <p className="muted">Sign in to view your transactions</p>
        ) : filtered.length === 0 ? (
          <p className="muted">No transactions for this account</p>
        ) : (
          <ul style={{listStyle:"none", padding:0, margin:0}}>
            {filtered.map(t => (
              <li key={t.id} style={{display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #f1f5f9"}}>
                <div>
                  <div style={{fontWeight:600}}>{t.description}</div>
                  <div style={{color:"var(--muted)", fontSize:13}}>{t.category} • {t.createdAt ? new Date(t.createdAt.seconds*1000).toLocaleString() : ""}</div>
                </div>
                <div style={{fontWeight:700, color: t.amount<0 ? "#ef4444":"#10b981"}}>{t.amount}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
