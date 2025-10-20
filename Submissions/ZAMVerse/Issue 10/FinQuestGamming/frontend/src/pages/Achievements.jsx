import React from 'react'
import AchievementCard from '../components/achievements/AchievementCard'

const Achievements = () => {
  return (
    <section id="achievements">
      <div className="page-title">
        <h2>Achievements</h2>
        <div>
          <span className="card-value">Level 7</span>
          <div className="card-change positive">1250 XP</div>
        </div>
      </div>
      
      <AchievementCard />
    </section>
  )
}

export default Achievements