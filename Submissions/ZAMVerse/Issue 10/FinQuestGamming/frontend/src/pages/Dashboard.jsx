import React, { useState } from 'react'
import FinancialSummary from '../components/dashboard/FinancialSummary'
import SpendingChart from '../components/dashboard/SpendingChart'
import TransactionForm from '../components/transactions/TransactionForm'

const Dashboard = () => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)

  return (
    <section id="dashboard">
      <div className="page-title">
        <h2>Financial Dashboard</h2>
        <div>
          <button 
            className="btn" 
            onClick={() => setIsTransactionModalOpen(true)}
          >
            <i className="fas fa-plus"></i> Add Transaction
          </button>
        </div>
      </div>
      
      <FinancialSummary />
      <SpendingChart />

      <TransactionForm 
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </section>
  )
}

export default Dashboard