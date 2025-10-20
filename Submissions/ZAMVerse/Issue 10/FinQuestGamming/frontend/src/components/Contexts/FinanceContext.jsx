import React, { createContext, useState, useContext } from 'react'

const FinanceContext = createContext()

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: '2023-06-15',
      description: 'Grocery Store',
      category: 'food',
      amount: -1185.50,
      type: 'expense'
    },
    {
      id: 2,
      date: '2023-06-14',
      description: 'Salary Deposit',
      category: 'income',
      amount: 13500.00,
      type: 'income'
    },
    {
      id: 3,
      date: '2023-06-12',
      description: 'Gas Station',
      category: 'transport',
      amount: -1145.00,
      type: 'expense'
    },
    {
      id: 4,
      date: '2023-06-10',
      description: 'Netflix Subscription',
      category: 'entertainment',
      amount: -1015.99,
      type: 'expense'
    },
    {
      id: 5,
      date: '2023-06-08',
      description: 'Electricity Bill',
      category: 'utilities',
      amount: -7120.75,
      type: 'expense'
    }
  ])

  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Emergency Fund',
      currentAmount: 12500,
      targetAmount: 25500,
      targetDate: '2023-12-31',
      progress: 49
    },
    {
      id: 2,
      title: 'New Laptop',
      currentAmount: 1700,
      targetAmount: 1200,
      targetDate: '2023-10-31',
      progress: 67
    },
    {
      id: 3,
      title: 'Vacation to Hawaii',
      currentAmount: 21200,
      targetAmount: 53000,
      targetDate: '2024-03-31',
      progress: 40
    }
  ])

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'First Saver',
      description: 'Save your first RS 15000',
      icon: 'fas fa-seedling',
      earned: true,
      earnedDate: '2023-05-15',
      progress: 100
    },
    {
      id: 2,
      title: 'Budget Master',
      description: 'Stay under budget for 3 consecutive months',
      icon: 'fas fa-calendar-check',
      earned: true,
      earnedDate: '2023-06-01',
      progress: 100
    },
    {
      id: 3,
      title: 'No-Spend Streak',
      description: 'Complete 5 no-spend days in a month',
      icon: 'fas fa-fire',
      earned: true,
      earnedDate: '2023-05-28',
      progress: 100
    },
    {
      id: 4,
      title: 'Savings Guru',
      description: 'Achieve a 50% savings rate for a month',
      icon: 'fas fa-trophy',
      earned: false,
      progress: 47
    },
    {
      id: 5,
      title: 'Investment Novice',
      description: 'Make your first investment',
      icon: 'fas fa-chart-line',
      earned: false,
      progress: 0
    },
    {
      id: 6,
      title: 'Goal Crusher',
      description: 'Complete 5 financial goals',
      icon: 'fas fa-award',
      earned: false,
      progress: 40
    }
  ])

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  const addGoal = (goal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100
    const newGoal = {
      id: Date.now(),
      ...goal,
      progress: Math.min(progress, 100)
    }
    setGoals(prev => [...prev, newGoal])
  }

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id))
  }

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(goal => goal.id !== id))
  }

  const value = {
    transactions,
    goals,
    achievements,
    addTransaction,
    addGoal,
    deleteTransaction,
    deleteGoal
  }

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}