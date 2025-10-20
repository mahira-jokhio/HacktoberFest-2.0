import React, { useState } from 'react'
import GoalCard from '../components/goals/GoalCard'
import GoalForm from '../components/goals/GoalForm'

const Goals = () => {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)

  return (
    <section id="goals">
      <div className="page-title">
        <h2>Financial Goals</h2>
        <div>
          <button 
            className="btn" 
            onClick={() => setIsGoalModalOpen(true)}
          >
            <i className="fas fa-plus"></i> Add Goal
          </button>
        </div>
      </div>
      
      <GoalCard />

      <GoalForm 
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />
    </section>
  )
}

export default Goals