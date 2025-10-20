// File-based database using localStorage with JSON format
// Re-export file storage APIs for backward compatibility

import {
  fileStorage,
  productsAPI,
  salesAPI,
  employeesAPI,
  customersAPI,
  attendanceAPI,
  stockMovementsAPI,
  usersAPI
} from './fileStorage';

// Database object that mimics Dexie API for easier migration
export const db = {
  products: {
    toArray: () => Promise.resolve(productsAPI.getAll()),
    add: (item) => Promise.resolve(productsAPI.add(item)),
    bulkAdd: (items) => Promise.resolve(productsAPI.bulkAdd(items)),
    update: (id, updates) => Promise.resolve(productsAPI.update(id, updates)),
    delete: (id) => Promise.resolve(productsAPI.delete(id)),
    get: (id) => Promise.resolve(productsAPI.get(id)),
    count: () => Promise.resolve(productsAPI.getAll().length)
  },
  sales: {
    toArray: () => Promise.resolve(salesAPI.getAll()),
    add: (item) => Promise.resolve(salesAPI.add(item)),
    bulkAdd: (items) => Promise.resolve(salesAPI.bulkAdd(items)),
    update: (id, updates) => Promise.resolve(salesAPI.update(id, updates)),
    delete: (id) => Promise.resolve(salesAPI.delete(id)),
    get: (id) => Promise.resolve(salesAPI.get(id)),
    count: () => Promise.resolve(salesAPI.getAll().length)
  },
  employees: {
    toArray: () => Promise.resolve(employeesAPI.getAll()),
    add: (item) => Promise.resolve(employeesAPI.add(item)),
    bulkAdd: (items) => Promise.resolve(employeesAPI.bulkAdd(items)),
    update: (id, updates) => Promise.resolve(employeesAPI.update(id, updates)),
    delete: (id) => Promise.resolve(employeesAPI.delete(id)),
    get: (id) => Promise.resolve(employeesAPI.get(id)),
    count: () => Promise.resolve(employeesAPI.getAll().length)
  },
  customers: {
    toArray: () => Promise.resolve(customersAPI.getAll()),
    add: (item) => Promise.resolve(customersAPI.add(item)),
    bulkAdd: (items) => Promise.resolve(customersAPI.bulkAdd(items)),
    update: (id, updates) => Promise.resolve(customersAPI.update(id, updates)),
    delete: (id) => Promise.resolve(customersAPI.delete(id)),
    get: (id) => Promise.resolve(customersAPI.get(id)),
    count: () => Promise.resolve(customersAPI.getAll().length)
  },
  attendance: {
    toArray: () => Promise.resolve(attendanceAPI.getAll()),
    add: (item) => Promise.resolve(attendanceAPI.add(item)),
    bulkAdd: (items) => Promise.resolve(attendanceAPI.bulkAdd(items)),
    update: (id, updates) => Promise.resolve(attendanceAPI.update(id, updates)),
    delete: (id) => Promise.resolve(attendanceAPI.delete(id)),
    get: (id) => Promise.resolve(attendanceAPI.get(id)),
    count: () => Promise.resolve(attendanceAPI.getAll().length),
    where: (field) => ({
      equals: (value) => ({
        toArray: () => Promise.resolve(fileStorage.where('attendance', field, value))
      })
    }),
    bulkDelete: (ids) => Promise.resolve(fileStorage.bulkDelete('attendance', ids))
  },
  stockMovements: {
    toArray: () => Promise.resolve(stockMovementsAPI.getAll()),
    add: (item) => Promise.resolve(stockMovementsAPI.add(item)),
    bulkAdd: (items) => Promise.resolve(stockMovementsAPI.bulkAdd(items)),
    update: (id, updates) => Promise.resolve(stockMovementsAPI.update(id, updates)),
    delete: (id) => Promise.resolve(stockMovementsAPI.delete(id)),
    get: (id) => Promise.resolve(stockMovementsAPI.get(id)),
    count: () => Promise.resolve(stockMovementsAPI.getAll().length)
  },
  users: {
    toArray: () => Promise.resolve(usersAPI.getAll()),
    add: (item) => Promise.resolve(usersAPI.add(item)),
    bulkAdd: (items) => Promise.resolve(usersAPI.bulkAdd(items)),
    update: (id, updates) => Promise.resolve(usersAPI.update(id, updates)),
    delete: (id) => Promise.resolve(usersAPI.delete(id)),
    get: (id) => Promise.resolve(usersAPI.get(id)),
    count: () => Promise.resolve(usersAPI.getAll().length),
    findByUsername: (username) => Promise.resolve(usersAPI.findByUsername(username))
  }
};

// Export file storage utilities
export { fileStorage };
