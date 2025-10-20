import React from 'react'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const SpendingChart = () => {
  const spendingData = {
    labels: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'],
    datasets: [{
      data: [25, 15, 10, 20, 20, 10],
      backgroundColor: [
        '#ffd6cc',
        '#ccf2ff',
        '#e6ccff',
        '#ffffcc',
        '#ffccf2',
        '#e0e0e0'
      ],
      borderWidth: 0
    }]
  }

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [3200, 3400, 3200, 3500, 3400, 3500],
        backgroundColor: '#4cc9f0',
        borderWidth: 0
      },
      {
        label: 'Expenses',
        data: [1800, 1900, 2100, 1700, 1650, 1845],
        backgroundColor: '#f72585',
        borderWidth: 0
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  }

  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <>
      <div className="chart-container">
        <div className="chart-title">Spending by Category</div>
        <Doughnut data={spendingData} options={chartOptions} />
      </div>
      
      <div className="chart-container">
        <div className="chart-title">Monthly Overview</div>
        <Bar data={monthlyData} options={barOptions} />
      </div>
    </>
  )
}

export default SpendingChart