// src/components/Charts/ExpensesChart.jsx
import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpensesChart({ transactions = [] }) {
  const data = useMemo(()=> {
    const categories = {};
    transactions.forEach(t => {
      if (!t.category) return;
      categories[t.category] = (categories[t.category] || 0) + Math.abs(Number(t.amount));
    });
    return {
      labels: Object.keys(categories),
      datasets: [{ data: Object.values(categories), backgroundColor: ["#60a5fa","#34d399","#f97316","#f472b6","#a78bfa"] }]
    };
  }, [transactions]);

  return (
    <div className="card">
      <h3>Expenses by Category</h3>
      <Pie data={data} />
    </div>
  );
}
