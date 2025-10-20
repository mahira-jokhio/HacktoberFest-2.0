import React, { useState } from "react";
import { db } from "../firebase";
import "./TransactionForm.css";
import { calculatePointsOnTransaction } from "../utils/gamifyUtils";
import { doc, updateDoc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function TransactionForm({ user }) {
  const [form, setForm] = useState({ description: "", category: "Food", amount: "" });
  const [loading, setLoading] = useState(false);

  // If there's no authenticated user, don't render the form.
  if (!user || !user.uid) return null;

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const amountNum = Number(form.amount);
      if (Number.isNaN(amountNum)) throw new Error("Invalid amount");

      const data = {
        ...form,
        amount: amountNum,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      };
      await addDoc(collection(db, "transactions"), data);

      const points = calculatePointsOnTransaction(data);
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const current = userSnap.data();
        const newPoints = (current.points || 0) + points;
        await updateDoc(userRef, { points: newPoints });
      }
      setForm({ description: "", category: "Food", amount: "" });
    } catch (err) {
      // err may not always be an Error with a message property (e.g. strings); handle gracefully
      const message = err && err.message ? err.message : String(err);
      alert("Error posting transaction: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={submit} style={{ display: "grid", gap: 10 }}>
      <h3>Add Transaction</h3>
      <input name="description" placeholder="Description" value={form.description} onChange={handle} required />
      <select name="category" value={form.category} onChange={handle} required>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Utilities">Utilities</option>
        <option value="Income">Income</option>
        <option value="Savings">Savings</option>
      </select>
      <input
        name="amount"
        type="number"
        step="0.01"
        placeholder="Amount (use negative for expense e.g. -20)"
        value={form.amount}
        onChange={handle}
        required
      />
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  );
}
