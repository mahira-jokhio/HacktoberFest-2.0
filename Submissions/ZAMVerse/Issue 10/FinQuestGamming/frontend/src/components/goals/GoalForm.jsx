import React, { useState } from 'react'
import { useFinance } from '../../contexts/FinanceContext'
import Modal from '../common/modal'

const GoalForm = ({ isOpen, onClose }) => {
  const { addGoal } = useFinance()
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const goal = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      targetDate: formData.targetDate
    }
    addGoal(goal)
    onClose()
    setFormData({
      title: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: ''
    })
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Financial Goal">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="goal-title">Goal Title</label>
          <input
            type="text"
            className="form-control"
            id="goal-title"
            name="title"
            placeholder="Enter goal title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="goal-target">Target Amount</label>
          <input
            type="number"
            className="form-control"
            id="goal-target"
            name="targetAmount"
            placeholder="Enter target amount"
            step="0.01"
            value={formData.targetAmount}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="goal-current">Current Amount</label>
          <input
            type="number"
            className="form-control"
            id="goal-current"
            name="currentAmount"
            placeholder="Enter current amount"
            step="0.01"
            value={formData.currentAmount}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="goal-deadline">Target Date</label>
          <input
            type="date"
            className="form-control"
            id="goal-deadline"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">Add Goal</button>
        </div>
      </form>
    </Modal>
  )
}

export default GoalForm