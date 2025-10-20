import React from 'react'
import { useFinance } from '../../contexts/FinanceContext'

const GoalCard = () => {
  const { goals } = useFinance()

  const formatCurrency = (amount) => {
    return `RS ${amount.toLocaleString()}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className="goals-grid">
      {goals.map(goal => (
        <div key={goal.id} className="goal-card">
          <div className="goal-header">
            <div className="goal-title">{goal.title}</div>
            <div className="goal-amount">
              {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${goal.progress}%` }}></div>
          </div>
          <div className="goal-info">
            <span>{Math.round(goal.progress)}% Complete</span>
            <span>Target: {formatDate(goal.targetDate)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default GoalCard