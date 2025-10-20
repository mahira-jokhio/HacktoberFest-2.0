export const resetUsers = () => {
  const storageKey = 'shopEaseStoreData';
  const data = JSON.parse(localStorage.getItem(storageKey));
  
  if (!data) {
    console.error('No data found in localStorage');
    return;
  }

  // Clear existing users
  data.users = [];

  // Add default users
  const defaultUsers = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Administrator'
    },
    {
      id: 2,
      username: 'cashier',
      password: 'cashier123',
      role: 'cashier',
      name: 'Cashier User'
    }
  ];

  data.users = defaultUsers;
  data.metadata.lastModified = new Date().toISOString();
  
  localStorage.setItem(storageKey, JSON.stringify(data, null, 2));
  
  console.log('✅ Users reset successfully!');
  console.log('Users:', data.users);
  console.log('\nLogin credentials:');
  console.log('Admin: admin / admin123');
  console.log('Cashier: cashier / cashier123');
};

// Browser console version (no export)
window.resetUsers = () => {
  const storageKey = 'shopEaseStoreData';
  const data = JSON.parse(localStorage.getItem(storageKey));
  
  if (!data) {
    console.error('❌ No data found in localStorage');
    return;
  }

  // Add default users with proper IDs
  const defaultUsers = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Administrator'
    },
    {
      id: 2,
      username: 'cashier',
      password: 'cashier123',
      role: 'cashier',
      name: 'Cashier User'
    }
  ];

  data.users = defaultUsers;
  data.metadata.lastModified = new Date().toISOString();
  
  localStorage.setItem(storageKey, JSON.stringify(data, null, 2));
  
  console.log('✅ Users reset successfully!');
  console.log('Users:', data.users);
  console.log('\n📋 Login credentials:');
  console.log('👤 Admin: admin / admin123');
  console.log('👤 Cashier: cashier / cashier123');
  console.log('\n🔄 Please refresh the page to login');
};

window.checkUsers = () => {
  const storageKey = 'shopEaseStoreData';
  const data = JSON.parse(localStorage.getItem(storageKey));
  
  if (!data) {
    console.error('❌ No data found in localStorage');
    return;
  }

  console.log('📊 Current users in database:');
  console.table(data.users);
  
  if (!data.users || data.users.length === 0) {
    console.warn('⚠️ No users found! Run resetUsers() to add default users.');
  }
};

console.log('🔧 User management utilities loaded!');
console.log('Run these commands in console:');
console.log('  resetUsers()  - Reset users to defaults');
console.log('  checkUsers()  - View current users');
