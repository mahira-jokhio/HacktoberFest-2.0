import { saveAs } from "file-saver";

export function exportTransactionsToCSV(transactions = [], filename = "transactions.csv") {
  if (!transactions.length) {
    alert("No transactions to export");
    return;
  }
  const header = ["Date","Description","Category","Amount"];
  const rows = transactions.map(t => [
    t.createdAt ? new Date(t.createdAt.seconds ? t.createdAt.seconds*1000 : t.createdAt).toLocaleString() : "",
    `"${(t.description || "").replace(/"/g,'""')}"`,
    t.category || "",
    t.amount
  ]);
  const csv = [header, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
}
