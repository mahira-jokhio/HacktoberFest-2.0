export function calculatePointsOnTransaction(tx) {
  const amt = Number(tx.amount);
  if (amt >= 0) return 10; 
  if (Math.abs(amt) <= 10) return 2;
  if (Math.abs(amt) <= 50) return 1;
  return 0;
}

export function evaluateBadges(profile) {
  const badges = [];
  if (profile.points >= 100) badges.push("Budget Master");
  if ((profile.streakNoSpendDays || 0) >= 3) badges.push("No-Spend Streak");
  if ((profile.goalsReached || 0) >= 1) badges.push("Goal Achiever");
  if (profile.points >= 500) badges.push("Financial Guru");
  return badges;
}

export function calculateLevel(points = 0) {
  return Math.floor(points / 100) + 1;
}
