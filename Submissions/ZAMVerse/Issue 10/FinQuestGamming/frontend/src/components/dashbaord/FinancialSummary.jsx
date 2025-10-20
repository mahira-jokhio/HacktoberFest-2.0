import React from 'react'
import { useFinance } from '../../contexts/FinanceContext'

const FinancialSummary = () => {
  const { transactions } = useFinance()

  const totalBalance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0)
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)
  const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1)

  return (
    <div className="dashboard-grid">
      <div className="card">
        <div className="card-header">
          <div className="card-title">Total Balance</div>
          <div className="card-icon">
            <i className="fas fa-wallet"></i>
          </div>
        </div>
        <div className="card-value">RS {totalBalance.toFixed(2)}</div>
        <div className="card-change positive">
          <i className="fas fa-arrow-up"></i> 5.2% from last month
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <div className="card-title">Monthly Income</div>
          <div className="card-icon">
            <i className="fas fa-money-bill-wave"></i>
          </div>
        </div>
        <div className="card-value">RS {monthlyIncome.toFixed(2)}</div>
        <div className="card-change positive">
          <i className="fas fa-arrow-up"></i> Consistent
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <div className="card-title">Monthly Expenses</div>
          <div className="card-icon">
            <i className="fas fa-chart-line"></i>
          </div>
        </div>
        <div className="card-value">RS {monthlyExpenses.toFixed(2)}</div>
        <div className="card-change negative">
          <i className="fas fa-arrow-up"></i> 12.5% from last month
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <div className="card-title">Savings Rate</div>
          <div className="card-icon">
            <i className="fas fa-piggy-bank"></i>
          </div>
        </div>
        <div className="card-value">{savingsRate}%</div>
        <div className="card-change positive">
          <i className="fas fa-arrow-up"></i> 3.1% from last month
        </div>
      </div>
    </div>
  )
}

export default FinancialSummary