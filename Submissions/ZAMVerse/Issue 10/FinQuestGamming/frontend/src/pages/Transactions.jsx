import React, { useState } from 'react'
import TransactionList from '../components/transactions/TransactionList'
import TransactionForm from '../components/transactions/TransactionForm'

const Transactions = () => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)

  return (
    <section id="transactions">
      <div className="page-title">
        <h2>Transaction History</h2>
        <div>
          <button 
            className="btn" 
            onClick={() => setIsTransactionModalOpen(true)}
          >
            <i className="fas fa-plus"></i> Add Transaction
          </button>
          <button className="btn btn-outline">
            <i className="fas fa-download"></i> Export
          </button>
        </div>
      </div>
      
      <TransactionList />

      <TransactionForm 
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </section>
  )
}

export default Transactions