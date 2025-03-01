import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import ExpenseForm from '../components/ExpenseForm';

const AddExpensePage: React.FC = () => {
  const { addExpense } = useExpenses();
  const navigate = useNavigate();

  const handleSubmit = (expense: any) => {
    addExpense(expense);
    navigate('/expenses');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
          <button
            onClick={() => navigate('/expenses')}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Cancel
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <ExpenseForm onSubmit={handleSubmit} buttonText="Add Expense" />
        </div>
      </div>
    </div>
  );
};

export default AddExpensePage;