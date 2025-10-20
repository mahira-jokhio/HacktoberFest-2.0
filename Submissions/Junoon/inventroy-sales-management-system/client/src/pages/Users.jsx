import React, { useState } from 'react'

const initialUsers = [
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' },
]

const Users = () => {
  const [users, setUsers] = useState(initialUsers)
  const [form, setForm] = useState({ name: '', email: '' })
  const [editId, setEditId] = useState(null)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAdd = () => {
    setUsers([...users, { id: Date.now(), ...form }])
    setForm({ name: '', email: '' })
  }

  const handleEdit = id => {
    const user = users.find(u => u.id === id)
    setForm({ name: user.name, email: user.email })
    setEditId(id)
  }

  const handleUpdate = () => {
    setUsers(users.map(u => u.id === editId ? { ...u, ...form } : u))
    setForm({ name: '', email: '' })
    setEditId(null)
  }

  const handleDelete = id => setUsers(users.filter(u => u.id !== id))

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <div className="mb-4">
        <input
          className="bg-black border border-white text-white px-2 py-1 mr-2"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="bg-black border border-white text-white px-2 py-1 mr-2"
          name="email"
          placeholder="Email"
          value={form.email}
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
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="border px-2 py-1">{u.name}</td>
              <td className="border px-2 py-1">{u.email}</td>
              <td className="border px-2 py-1">
                <button className="bg-white text-black px-2 py-1 mr-2" onClick={() => handleEdit(u.id)}>Edit</button>
                <button className="bg-white text-black px-2 py-1" onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users