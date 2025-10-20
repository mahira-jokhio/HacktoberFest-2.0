let monthlyAllowance = 0;
let dailyBudget = 0;
let transactions = [];
let points = 0;
const dailySavingGoal = 100;


const currentUser = localStorage.getItem('currentUser') || 'guest';


function userKey(key) {
  return `${currentUser}_${key}`;
}


const ctx = document.getElementById('expenseChart').getContext('2d');
let expenseChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Food', 'Transport', 'Entertainment', 'Utilities'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4caf50'],
      hoverOffset: 10,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: '💸 Expense Breakdown', font: { size: 16 } }
    }
  }
});


function setAllowance() {
  monthlyAllowance = parseFloat(document.getElementById('monthlyAllowance').value);
  if (isNaN(monthlyAllowance) || monthlyAllowance <= 0) {
    alert("⚠️ Please enter a valid allowance!");
    return;
  }
  dailyBudget = monthlyAllowance / 30;
  document.getElementById('dailyGoal').textContent = 
    `💵 Daily Budget: ₨${dailyBudget.toFixed(2)} | 🎯 Save at least ₨${dailySavingGoal}/day`;
  generateCalendar();
  saveData();
}


function generateCalendar() {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';
  for (let i = 1; i <= 30; i++) {
    const day = document.createElement('div');
    day.classList.add('day');
    day.id = `day-${i}`;
    day.textContent = i;
    calendar.appendChild(day);
  }

  transactions.forEach(t => updateCalendarDay(t.date));
}


function addTransaction() {
  const desc = document.getElementById('desc').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value || getToday();
  const time = document.getElementById('time').value || getCurrentTime();

  if (!desc || isNaN(amount) || amount <= 0) {
    alert('⚠️ Enter valid expense details!');
    return;
  }

  const transaction = { desc, amount, category, date, time };
  transactions.push(transaction);

  updatePieChart();
  updateCalendarDay(date);
  evaluateDayGoal(date);
  displayTransactions();
  saveData();

  document.getElementById('desc').value = '';
  document.getElementById('amount').value = '';
}


function updateCalendarDay(date) {
  const day = parseInt(date.split('-')[2]);
  const totalForDay = transactions
    .filter(t => t.date === date)
    .reduce((sum, t) => sum + t.amount, 0);

  const dayDiv = document.getElementById(`day-${day}`);
  if (dayDiv) {
    dayDiv.innerHTML = `<strong>${day}</strong><br>₨${totalForDay}`;
  }
}


function getToday() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0,5);
}


function updatePieChart() {
  const totals = { Food: 0, Transport: 0, Entertainment: 0, Utilities: 0 };
  transactions.forEach(t => totals[t.category] += t.amount);
  expenseChart.data.datasets[0].data = Object.values(totals);
  expenseChart.update();
}


function evaluateDayGoal(date) {
  const totalSpent = transactions
    .filter(t => t.date === date)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const day = parseInt(date.split('-')[2]);
  const dayDiv = document.getElementById(`day-${day}`);
  
  if (totalSpent <= dailyBudget) {
    dayDiv.classList.add('achieved');
  } else {
    dayDiv.classList.add('missed');
  }
}


function showDailySummary() {
  const today = getToday();
  const todaySpending = transactions
    .filter(t => t.date === today)
    .reduce((sum, t) => sum + t.amount, 0);

  if (todaySpending === 0) {
    document.getElementById('summaryOutput').textContent = 
      "No spending recorded today.";
    return;
  }

  const remaining = dailyBudget - todaySpending;
  let message = `Spent: ₨${todaySpending} | Remaining: ₨${remaining.toFixed(2)} `;

  if (remaining >= dailySavingGoal) {
    message += "🎉 Goal achieved! +25 points!";
    points += 25;
  } else if (remaining > 0) {
    message += "👍 Stayed within budget! +10 points!";
    points += 10;
  } else {
    message += "😬 Overspent! +5 points for trying!";
    points += 5;
  }

  document.getElementById('points').textContent = points;
  document.getElementById('summaryOutput').textContent = message;
  saveData();
}

function viewAllTransactions() {
  const container = document.getElementById('allTransactions');
  container.innerHTML = '';

  if (transactions.length === 0) {
    container.innerHTML = "<p>No transactions yet.</p>";
    return;
  }

  transactions.forEach((t, i) => {
    const div = document.createElement('div');
    div.classList.add('transaction-item');
    div.textContent = `${i + 1}. ${t.desc} - ₨${t.amount} (${t.category}) | ${t.date} ${t.time}`;
    container.appendChild(div);
  });
}


function deleteAll() {
  if (confirm("⚠️ Are you sure you want to delete all transactions?")) {
    transactions = [];
    generateCalendar();
    updatePieChart();
    document.getElementById('allTransactions').innerHTML = '';
    saveData();
    alert("All records cleared!");
  }
}



// ---------- Save + Authentication helpers ----------


function saveData() {
  localStorage.setItem(userKey('transactions'), JSON.stringify(transactions));
  localStorage.setItem(userKey('points'), points);
  localStorage.setItem(userKey('monthlyAllowance'), monthlyAllowance);
  localStorage.setItem(userKey('dailyBudget'), dailyBudget);
}

// Load data for the current user
function loadUserData() {
  transactions = JSON.parse(localStorage.getItem(userKey('transactions'))) || [];
  points = parseInt(localStorage.getItem(userKey('points'))) || 0;
  monthlyAllowance = parseFloat(localStorage.getItem(userKey('monthlyAllowance'))) || 0;
  dailyBudget = parseFloat(localStorage.getItem(userKey('dailyBudget'))) || 0;

  // Restore daily goal text
  if (monthlyAllowance > 0 && dailyBudget > 0) {
    document.getElementById('monthlyAllowance').value = monthlyAllowance;
    document.getElementById('dailyGoal').textContent = 
      `💵 Daily Budget: ₨${dailyBudget.toFixed(2)} | 🎯 Save at least ₨${dailySavingGoal}/day`;
  }

  // Restore visuals
  generateCalendar();
  updatePieChart();
  viewAllTransactions();
  document.getElementById('points').textContent = points;
}

// Logout (keeps data saved)
function logout() {
  alert('👋 You have been signed out!');
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  const current = window.location.pathname.split('/').pop();
  if (current === '' || current === 'index.html') {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn !== 'true') {
      window.location.href = 'login.html';
      return;
    }
  }
  loadUserData();
});