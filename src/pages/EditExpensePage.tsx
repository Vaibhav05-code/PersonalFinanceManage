import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import ExpenseForm from '../components/ExpenseForm';

const EditExpensePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getExpenseById, updateExpense } = useExpenses();
  const navigate = useNavigate();
  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundExpense = getExpenseById(id);
      if (foundExpense) {
        setExpense(foundExpense);
      } else {
        navigate('/expenses', { replace: true });
      }
    }
    setLoading(false);
  }, [id, getExpenseById, navigate]);

  const handleSubmit = (updatedExpense: any) => {
    if (id) {
      updateExpense(id, updatedExpense);
      navigate('/expenses');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Expense</h1>
          <button
            onClick={() => navigate('/expenses')}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Cancel
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {expense && (
            <ExpenseForm 
              onSubmit={handleSubmit} 
              initialValues={expense} 
              buttonText="Update Expense" 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditExpensePage;