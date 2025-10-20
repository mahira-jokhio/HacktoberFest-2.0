import React, { useState, useEffect } from "react";
import axios from "axios";
import InvoiceCard from "../InvoiceCard ";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(false);
  const [products, setProducts] = useState([]);
  // State for selected product per item
  const [selected, setSelected] = useState({});

  const emptyItem = { productId: "", name: "", quantity: 1, price: 0, total: 0 };
  const generateInvoiceNumber = () => `INV-${Math.floor(1000 + Math.random() * 9000)}`;
  const [form, setForm] = useState({
    invoiceNumber: generateInvoiceNumber(),
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    items: [ { ...emptyItem } ],
    subTotal: 0,
    tax: 0,
    discount: 0,
    grandTotal: 0,
    paymentMethod: "",
    dueDate: "",
    notes: ""
  });

  const API_URL = "http://localhost:3000/api/invoices";

  // Get user from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}
  const isAdmin = user && user.role === "admin";

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(API_URL);
      setInvoices(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchInvoices();
    axios.get('http://localhost:3000/api/products').then(res => {
      setProducts(res.data.data || []);
    });
  }, []);

  // recalc totals when items/tax/discount change
  useEffect(() => {
    const items = form.items || [];
    const sub = items.reduce((s, it) => s + ((Number(it.total) || (Number(it.quantity || 0) * Number(it.price || 0))) || 0), 0);
    const tax = Number(form.tax) || 0;
    const discount = Number(form.discount) || 0;
    const grand = Math.max(0, sub + tax - discount);
    setForm((f) => ({ ...f, subTotal: sub, grandTotal: grand }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.items, form.tax, form.discount]);

  const handleItemChange = (index, key, value) => {
    const items = [...form.items];
    items[index] = { ...items[index], [key]: value };
    // Always recalculate total if quantity or price changes
    if (key === "quantity" || key === "price") {
      const q = Number(items[index].quantity || 0);
      const p = Number(items[index].price || 0);
      items[index].total = q * p;
    }
    setForm({ ...form, items });
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { ...emptyItem }] });
  const removeItem = (i) => {
    const items = form.items.filter((_, idx) => idx !== i);
    setForm({ ...form, items: items.length ? items : [{ ...emptyItem }] });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete invoice?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchInvoices();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        invoiceNumber: form.invoiceNumber || undefined,
        customerName: form.customerName || undefined,
        customerEmail: form.customerEmail || undefined,
        customerPhone: form.customerPhone || undefined,
        items: (form.items || []).map(it => {
          const prod = products.find(p => p._id === it.productId);
          return {
            productId: it.productId || undefined,
            name: prod ? prod.name : (it.name || it.product || "Smart Watch"),
            quantity: Number(it.quantity) || 0,
            price: Number(it.price) || (prod ? prod.price : 0),
            total: Number(it.total) || (Number(it.quantity || 0) * (Number(it.price) || (prod ? prod.price : 0)))
          };
        }),
        subTotal: Number(form.subTotal) || 0,
        tax: Number(form.tax) || 0,
        discount: Number(form.discount) || 0,
        grandTotal: Number(form.grandTotal) || 0,
        paymentMethod: form.paymentMethod || undefined,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
        notes: form.notes || undefined
      };

      console.log("payload ", payload)

      if (editId) {
        await axios.put(`${API_URL}/${editId}`, payload);
      } else {
        await axios.post(`${API_URL}/add-invoice`, payload);
      }

      setShowModal(false);
      setEditId(null);
      fetchInvoices();
      setToast(true);
      setTimeout(() => setToast(false), 2000);

      setForm({
        invoiceNumber: generateInvoiceNumber(),
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        items: [{ ...emptyItem }],
        subTotal: 0,
        tax: 0,
        discount: 0,
        grandTotal: 0,
        paymentMethod: "",
        dueDate: "",
        notes: ""
      });
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const handleEdit = (inv) => {
    setEditId(inv._id);
    // normalize items shape so form fields exist, always fill name from products if possible
    const items = (inv.items || []).map(it => {
      const prod = products.find(p => p._id === (it.productId || it._id));
      return {
        productId: it.productId || it._id || "",
        name: prod ? prod.name : (it.name || it.product || it.productName || "Unnamed"),
        quantity: Number(it.quantity ?? it.qty ?? 0),
        price: Number(it.price ?? it.unitPrice ?? (prod ? prod.price : 0)),
        total: Number(it.total ?? ((it.quantity ?? it.qty ?? 0) * (it.price ?? it.unitPrice ?? (prod ? prod.price : 0))))
      };
    });
    setForm({
      invoiceNumber: inv.invoiceNumber || "",
      customerName: inv.customerName || "",
      customerEmail: inv.customerEmail || "",
      customerPhone: inv.customerPhone || "",
      items: items.length ? items : [{ ...emptyItem }],
      subTotal: inv.subTotal ?? 0,
      tax: inv.tax ?? 0,
      discount: inv.discount ?? 0,
      grandTotal: inv.grandTotal ?? inv.total ?? 0,
      paymentMethod: inv.paymentMethod || "",
      dueDate: inv.dueDate ? new Date(inv.dueDate).toISOString().substring(0, 10) : "",
      notes: inv.notes || ""
    });
    setShowModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <h2 className="text-2xl font-bold text-white">Invoices</h2>

        <input
          type="text"
          placeholder="Search by invoice number or customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 bg-gray-700 text-white rounded"
        />

        {/* {isAdmin && ( */}
          <button
            onClick={() => { setShowModal(true); setEditId(null); }}
            className="bg-green-600 px-4 py-2 rounded text-white"
          >
            + Add Invoice
          </button>
        {/* )} */}
      </div>

      {/* Grid List */}
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
        {invoices
          .filter((inv) =>
            String(inv.invoiceNumber).includes(search) ||
            (inv.customerName || "").toLowerCase().includes(search.toLowerCase())
          )
          .map((inv) => (
            <InvoiceCard
              key={inv._id}
              invoice={inv}
              onEdit={isAdmin ? () => handleEdit(inv) : undefined}
              onDelete={isAdmin ? () => handleDelete(inv._id) : undefined}
            />
          ))}
      </div>

      {/* Modal */}
  {showModal  && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-start pt-32 pb-8 overflow-auto">
          <div className="bg-gray-900 text-white p-6 rounded w-[95%] max-w-3xl">
            <h3 className="text-xl mb-3">{editId ? "Edit Invoice" : "Add Invoice"}</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  aria-label="Invoice Number"
                  className="w-full p-2 bg-gray-700 rounded"
                  placeholder="Invoice Number (auto)"
                  value={form.invoiceNumber}
                  readOnly
                />

                <input
                  aria-label="Payment Method"
                  className="w-full p-2 bg-gray-700 rounded"
                  placeholder="Payment Method (e.g. Credit Card, Bank Transfer, Cash)"
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                />

                <input
                  aria-label="Customer Name"
                  className="w-full p-2 bg-gray-700 rounded"
                  placeholder="Customer Name (required)"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                />

                <input
                  aria-label="Customer Email"
                  className="w-full p-2 bg-gray-700 rounded"
                  placeholder="Customer Email (optional)"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                />

                <input
                  aria-label="Customer Phone"
                  className="w-full p-2 bg-gray-700 rounded"
                  placeholder="Customer Phone (optional)"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                />

                <input
                  type="date"
                  aria-label="Due Date"
                  className="w-full p-2 bg-gray-700 rounded"
                  title="Due date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Items</h4>
                  <button type="button" onClick={addItem} className="text-sm bg-blue-600 px-2 py-1 rounded">+ Add Item</button>
                </div>

                <div className="space-y-2">
                  {/* Labels row */}
                  <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 mb-1">
                    <span className="col-span-5">Product Name</span>
                    <span className="col-span-2">Quantity</span>
                    <span className="col-span-3">Unit Price</span>
                    <span className="col-span-1">Line Total</span>
                    <span className="col-span-1">Action</span>
                  </div>
                  {form.items.map((it, idx) => (
                    <React.Fragment key={idx}>
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <select
                          className="col-span-5 p-2 bg-gray-700 rounded"
                          value={selected[idx] || it.productId || ""}
                          onChange={e => {
                            const selectedProduct = products.find(p => p._id === e.target.value);
                            handleItemChange(idx, "productId", e.target.value);
                            if (selectedProduct) {
                              handleItemChange(idx, "name", selectedProduct.name);
                              handleItemChange(idx, "price", selectedProduct.price);
                              setSelected(prev => ({ ...prev, [idx]: selectedProduct._id }));
                            } else {
                              handleItemChange(idx, "name", "");
                              handleItemChange(idx, "price", 0);
                              setSelected(prev => ({ ...prev, [idx]: "" }));
                            }
                          }}
                        >
                          <option value="">Select product</option>
                          {products.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          min="0"
                          className="col-span-2 p-2 bg-gray-700 rounded"
                          placeholder="Qty"
                          value={it.quantity}
                          onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                        />
                        <input
                          type="text"
                          min="0"
                          step="0.01"
                          className="col-span-3 p-2 bg-gray-700 rounded"
                          placeholder="Unit price (e.g. 49.99)"
                          value={it.price}
                          onChange={(e) => handleItemChange(idx, "price", Number(e.target.value))}
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="col-span-1 p-2 bg-gray-700 rounded"
                          placeholder="Line total"
                          value={it.total}
                          onChange={(e) => handleItemChange(idx, "total", Number(e.target.value))}
                        />
                        <button type="button" onClick={() => removeItem(idx)} className="col-span-1 bg-red-600 p-2 rounded">Del</button>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <textarea
                  className="w-full p-2 bg-gray-700 rounded"
                  placeholder="Notes (delivery instructions, warranty, etc.)"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
                <div className="space-y-2 text-right">
                  <div className="text-xs text-gray-400 mb-1">Subtotal (sum of all item totals)</div>
                  <div>Subtotal: <span className="font-semibold">${Number(form.subTotal || 0).toFixed(2)}</span></div>
                  <div className="text-xs text-gray-400 mb-1">Tax (additional charges, e.g. VAT)</div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full p-2 bg-gray-700 rounded"
                      placeholder="Tax amount (e.g. 10.00)"
                      value={form.tax}
                      onChange={(e) => setForm({ ...form, tax: Number(e.target.value) })}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mb-1">Discount (any reductions applied)</div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full p-2 bg-gray-700 rounded"
                      placeholder="Discount amount (e.g. 5.00)"
                      value={form.discount}
                      onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mb-1">Grand Total (Subtotal + Tax - Discount)</div>
                  <div className="text-lg font-bold">Grand Total: ${Number(form.grandTotal || 0).toFixed(2)}</div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                    setForm({
                      invoiceNumber: generateInvoiceNumber(),
                      customerName: "",
                      customerEmail: "",
                      customerPhone: "",
                      items: [{ ...emptyItem }],
                      subTotal: 0,
                      tax: 0,
                      discount: 0,
                      grandTotal: 0,
                      paymentMethod: "",
                      dueDate: "",
                      notes: ""
                    });
                  }}
                  type="button"
                  className="bg-gray-600 px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-600 px-3 py-1 rounded">{editId ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-green-600 px-4 py-2 rounded text-white">
          ✅ Invoice Saved Successfully!
        </div>
      )}
    </div>
  );
};

export default Invoices;
