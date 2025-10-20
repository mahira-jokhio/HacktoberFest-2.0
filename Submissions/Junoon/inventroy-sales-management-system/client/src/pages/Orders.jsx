import React, { useState } from 'react'

const initialOrders = [
  { id: 1, customer: 'John', total: 300 },
  { id: 2, customer: 'Jane', total: 150 },
]

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders)
  const [form, setForm] = useState({ customer: '', total: '' })
  const [editId, setEditId] = useState(null)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAdd = () => {
    setOrders([...orders, { id: Date.now(), ...form }])
    setForm({ customer: '', total: '' })
  }

  const handleEdit = id => {
    const ord = orders.find(o => o.id === id)
    setForm({ customer: ord.customer, total: ord.total })
    setEditId(id)
  }

  const handleUpdate = () => {
    setOrders(orders.map(o => o.id === editId ? { ...o, ...form } : o))
    setForm({ customer: '', total: '' })
    setEditId(null)
  }

  const handleDelete = id => setOrders(orders.filter(o => o.id !== id))

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <div className="mb-4">
        <input
          className="bg-black border border-white text-white px-2 py-1 mr-2"
          name="customer"
          placeholder="Customer"
          value={form.customer}
          onChange={handleChange}
        />
        <input
          className="bg-black border border-white text-white px-2 py-1 mr-2"
          name="total"
          placeholder="Total"
          type="number"
          value={form.total}
          onChange={handleChange}
        />
        {editId ? (
          <button className="bg-white text-black px-2 py-1" onClick={handleUpdate}>Update</button>
        ) : (
          <button className="bg-white text-black px-2 py-1" onClick={handleAdd}>Add</button>
        )}
      </div>
      <table className="w-full text-white border border-white">
        <thead>
          <tr>
            <th className="border px-2 py-1">Customer</th>
            <th className="border px-2 py-1">Total</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td className="border px-2 py-1">{o.customer}</td>
              <td className="border px-2 py-1">{o.total}</td>
              <td className="border px-2 py-1">
                <button className="bg-white text-black px-2 py-1 mr-2" onClick={() => handleEdit(o.id)}>Edit</button>
                <button className="bg-white text-black px-2 py-1" onClick={() => handleDelete(o.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Orders