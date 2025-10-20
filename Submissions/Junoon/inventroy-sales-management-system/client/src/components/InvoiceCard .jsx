// ...existing code...
import React from "react";

const InvoiceCard = ({ invoice = {}, onEdit, onDelete }) => {
    const {
        invoiceNumber = "N/A",
        customerName = "Unknown",
        customerEmail = "",
        customerPhone = "",
        items = [],
        subTotal = 0,
        tax = 0,
        discount = 0,
        grandTotal,
        paymentMethod = "—",
        status = "paid",
        createdAt,
        dueDate,
        notes = ""
    } = invoice;

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch { }
    const isAdmin = user && user.role === "admin";


    // ensure each item has name/quantity/price/total using common alternate keys
    const normalizedItems = (items || []).map((it) => {
        const name = it.name ?? it.product ?? it.productName ?? "Unnamed";
        const quantity = Number(it.quantity ?? it.qty ?? 0);
        const price = Number(it.price ?? it.unitPrice ?? it.unit_price ?? 0);
        const total = Number(it.total ?? it.lineTotal ?? quantity * price);
        return { ...it, name, quantity, price, total };
    });

    const total = Number(grandTotal ?? invoice.total ?? normalizedItems.reduce((s, it) => s + (it.total ?? 0), 0));

    const fmtCurrency = (v) =>
        new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(Number(v || 0));

    const fmtDate = (d) => {
        if (!d) return "—";
        const date = typeof d === "string" ? new Date(d) : d;
        return isNaN(date) ? "—" : date.toLocaleString();
    };

    const statusClasses = {
        paid: "bg-green-600",
        unpaid: "bg-red-600",
        partially_paid: "bg-yellow-500 text-black",
        cancelled: "bg-gray-600"
    };

    const handleView = () => onView && onView(invoice);
    const handleEdit = () => onEdit && onEdit(invoice);
    const handleDelete = () => onDelete && onDelete(invoice);

    return (
        <div className="bg-gray-800 w-[400px] text-white p-4 rounded shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold">Invoice #{invoiceNumber}</h3>
                    <p className="text-sm text-gray-300">Customer: {customerName}</p>
                    {customerEmail ? <p className="text-xs text-gray-400">Email: {customerEmail}</p> : null}
                    {customerPhone ? <p className="text-xs text-gray-400">Phone: {customerPhone}</p> : null}
                </div>

                <div className={`px-2 py-1 rounded text-xs font-semibold ${statusClasses[status?.toLowerCase()] || "bg-gray-600"}`}>
                    {String(status).replace("_", " ")}
                </div>
            </div>

            <div className="mt-3">
                <div className="text-sm text-gray-300 mb-2">Items ({normalizedItems.length}):</div>
                <div className="bg-gray-900 rounded overflow-hidden text-xs">
                    <div className="flex px-2 py-1 font-semibold border-b border-gray-700">
                        <div className="w-1/2">Item</div>
                        <div className="w-1/6 text-right">Qty</div>
                        <div className="w-1/6 text-right">Unit</div>
                        <div className="w-1/6 text-right">Total</div>
                    </div>
                    {normalizedItems.length === 0 ? (
                        <div className="px-2 py-2 text-gray-400">No items</div>
                    ) : (
                        normalizedItems.map((it, i) => (
                            <div key={it._id ?? i} className="flex px-2 py-1 border-b last:border-b-0 border-gray-800">
                                <div className="w-1/2 truncate">{it.name}</div>
                                <div className="w-1/6 text-right">{it.quantity}</div>
                                <div className="w-1/6 text-right">{fmtCurrency(it.price)}</div>
                                <div className="w-1/6 text-right">{fmtCurrency(it.total)}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-3 flex justify-between items-start">
                <div className="text-xs text-gray-400">
                    <div>Payment: {paymentMethod}</div>
                    <div>Created: {fmtDate(createdAt)}</div>
                    <div>Due: {fmtDate(dueDate)}</div>
                </div>

                <div className="text-right">
                    <div className="text-sm text-gray-300">Subtotal: {fmtCurrency(subTotal ?? normalizedItems.reduce((s, it) => s + it.total, 0))}</div>
                    <div className="text-sm text-gray-300">Tax: {fmtCurrency(tax)}</div>
                    <div className="text-sm text-gray-300">Discount: -{fmtCurrency(discount)}</div>
                    <div className="text-lg font-bold mt-1">Total: {fmtCurrency(total)}</div>
                </div>
            </div>

            {notes ? <p className="mt-2 text-sm text-gray-400">Notes: {notes}</p> : null}

            <div className="flex justify-between mt-3">
                {/* <button onClick={handleView} className="px-2 py-1 bg-blue-600 rounded text-sm">View</button> */}
               {
                isAdmin && 
                <div className="flex gap-2">
                    <button onClick={handleEdit} className="px-2 py-1 bg-yellow-600 rounded text-sm">Edit</button>
                    <button onClick={handleDelete} className="px-2 py-1 bg-red-600 rounded text-sm">Delete</button>
                </div>
               }
            </div>
        </div>
    );
};

export default InvoiceCard;
// ...existing code...