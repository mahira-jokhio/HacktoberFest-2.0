import React, { useState } from 'react'
import { useFinance } from '../../contexts/FinanceContext'
import Modal from '../common/Modal'

const TransactionForm = ({ isOpen, onClose }) => {
  const { addTransaction } = useFinance()
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    type: 'expense',
    category: 'food'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const transaction = {
      ...formData,
      amount: formData.type === 'expense' ? -Math.abs(parseFloat(formData.amount)) : Math.abs(parseFloat(formData.amount)),
      date: new Date(formData.date).toISOString().split('T')[0]
    }
    addTransaction(transaction)
    onClose()
    setFormData({
      date: '',
      description: '',
      amount: '',
      type: 'expense',
      category: 'food'
    })
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="transaction-date">Date</label>
          <input
            type="date"
            className="form-control"
            id="transaction-date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="transaction-description">Description</label>
          <input
            type="text"
            className="form-control"
            id="transaction-description"
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="transaction-amount">Amount</label>
          <input
            type="number"
            className="form-control"
            id="transaction-amount"
            name="amount"
            placeholder="Enter amount"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="transaction-type">Type</label>
          <select
            className="form-control"
            id="transaction-type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="transaction-category">Category</label>
          <select
            className="form-control"
            id="transaction-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="entertainment">Entertainment</option>
            <option value="utilities">Utilities</option>
            <option value="shopping">Shopping</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">Add Transaction</button>
        </div>
      </form>
    </Modal>
  )
}

export default TransactionForm