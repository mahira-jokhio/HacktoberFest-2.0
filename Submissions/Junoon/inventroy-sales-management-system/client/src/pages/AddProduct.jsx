import React, { useState } from 'react'

const AddProduct = () => {
  const [form, setForm] = useState({ name: '', price: '' })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    alert(`Product Added: ${form.name} - $${form.price}`)
    setForm({ name: '', price: '' })
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <input
          className="bg-black border border-white text-white px-2 py-1"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="bg-black border border-white text-white px-2 py-1"
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <button className="bg-white text-black px-2 py-1 font-bold" type="submit">
          Add Product
        </button>
      </form>
    </div>
  )
}

export default AddProduct