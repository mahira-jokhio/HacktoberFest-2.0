import React from 'react'
import { useFinance } from '../../contexts/FinanceContext'

const AchievementCard = () => {
  const { achievements } = useFinance()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="achievements-grid">
      {achievements.map(achievement => (
        <div key={achievement.id} className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
          <div className="achievement-icon">
            <i className={achievement.icon}></i>
          </div>
          <div className="achievement-title">{achievement.title}</div>
          <div className="achievement-desc">{achievement.description}</div>
          <div className="achievement-progress">
            {achievement.earned 
              ? `Earned on ${formatDate(achievement.earnedDate)}`
              : `Progress: ${achievement.progress}%`
            }
          </div>
        </div>
      ))}
    </div>
  )
}

export default AchievementCard