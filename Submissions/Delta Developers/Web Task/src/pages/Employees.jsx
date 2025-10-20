import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/database';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Calendar } from 'lucide-react';

const Employees = () => {
  const { employees, attendance, refreshData } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({ name: '', salary: '' });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const employeeData = {
      name: formData.name,
      salary: parseFloat(formData.salary)
    };

    if (editingEmployee) {
      await db.employees.update(editingEmployee.id, employeeData);
    } else {
      const newEmpId = await db.employees.add(employeeData);
      // Add today's attendance for new employee
      await db.attendance.add({
        employee_id: newEmpId.id,
        date: new Date().toISOString().split('T')[0],
        status: 'present'
      });
    }

    refreshData();
    resetForm();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      await db.employees.delete(id);
      // Delete all attendance records for this employee
      const empAttendance = await db.attendance.where('employee_id').equals(id).toArray();
      await db.attendance.bulkDelete(empAttendance.map(a => a.id));
      refreshData();
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      salary: employee.salary.toString()
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', salary: '' });
    setEditingEmployee(null);
    setShowModal(false);
  };

  const getAttendanceForDate = (employeeId, date) => {
    return attendance?.find(a => a.employee_id === employeeId && a.date === date);
  };

  const toggleAttendance = async (employeeId, date) => {
    const existing = getAttendanceForDate(employeeId, date);
    
    if (existing) {
      const newStatus = existing.status === 'present' ? 'absent' : 'present';
      await db.attendance.update(existing.id, { status: newStatus });
    } else {
      await db.attendance.add({
        employee_id: employeeId,
        date: date,
        status: 'present'
      });
    }
    refreshData();
  };

  const getAttendanceSummary = () => {
    const dateAttendance = attendance?.filter(a => a.date === selectedDate) || [];
    const present = dateAttendance.filter(a => a.status === 'present').length;
    const absent = dateAttendance.filter(a => a.status === 'absent').length;
    return { present, absent, total: employees?.length || 0 };
  };

  const summary = getAttendanceSummary();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employees & Attendance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your team and track attendance
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Add Employee
        </button>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                {summary.total}
              </p>
            </div>
            <div className="bg-indigo-500 p-3 rounded-lg">
              <Calendar className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Present Today</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                {summary.present}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Absent Today</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
                {summary.absent}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <XCircle className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Tracking */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Daily Attendance</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {employees?.map(employee => {
              const att = getAttendanceForDate(employee.id, selectedDate);
              const isPresent = att?.status === 'present';
              
              return (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{employee.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Salary: Rs. {employee.salary.toLocaleString()}/month
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAttendance(employee.id, selectedDate)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isPresent
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {isPresent ? (
                        <>
                          <CheckCircle size={18} />
                          Present
                        </>
                      ) : (
                        <>
                          <XCircle size={18} />
                          Absent
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(employee)}
                      className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Monthly Salary (Rs.)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {editingEmployee ? 'Update' : 'Add'} Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
