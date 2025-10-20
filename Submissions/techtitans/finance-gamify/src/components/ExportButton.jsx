import React from "react";
import { exportTransactionsToCSV } from "../utils/exportCSV";

export default function ExportButton({ transactions }) {
  const disabled = !transactions || transactions.length === 0;
  return (
    <button
      className="btn"
      onClick={() => exportTransactionsToCSV(transactions)}
      disabled={disabled}
      title={disabled ? "No transactions to export" : "Export transactions to CSV"}
    >
      {disabled ? "No transactions" : "Export CSV"}
    </button>
  );
}
