import React from 'react';
import { format } from 'date-fns';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import CategoryChart from '../components/CategoryChart';
import ExpenseList from '../components/ExpenseList';
import { DollarSign, TrendingUp, Calendar, PieChart, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    expenses, 
    getTotalExpenses, 
    getExpensesByCategory,
    deleteExpense
  } = useExpenses();
  
  // Get recent expenses (last 5)
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Get current month expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
  
  const totalCurrentMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Get expense categories
  const expensesByCategory = getExpensesByCategory();
  
  // Get most expensive category
  let mostExpensiveCategory = { category: 'None', amount: 0 };
  Object.entries(expensesByCategory).forEach(([category, amount]) => {
    if (amount > mostExpensiveCategory.amount) {
      mostExpensiveCategory = { category, amount };
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}
        </h1>
        <Link
          to="/expenses/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={16} className="mr-2" />
          Add Expense
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Expenses"
          value={`₹${getTotalExpenses().toFixed(2)}`}
          icon={DollarSign}
          color="bg-indigo-600"
        />
        <StatCard
          title="This Month"
          value={`₹${totalCurrentMonth.toFixed(2)}`}
          icon={Calendar}
          color="bg-green-600"
        />
        <StatCard
          title="Highest Category"
          value={mostExpensiveCategory.category}
          icon={PieChart}
          color="bg-purple-600"
        />
        <StatCard
          title="Average Expense"
          value={`₹${expenses.length ? (getTotalExpenses() / expenses.length).toFixed(2) : '0.00'}`}
          icon={TrendingUp}
          color="bg-pink-600"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Expenses</h2>
            <Link to="/expenses" className="text-sm text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          </div>
          <ExpenseList 
            expenses={recentExpenses} 
            onEdit={(id) => window.location.href = `/expenses/edit/${id}`}
            onDelete={deleteExpense}
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Expense Breakdown</h2>
          <CategoryChart data={expensesByCategory} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Monthly Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => {
            const monthDate = new Date();
            monthDate.setMonth(monthDate.getMonth() - index);
            
            const monthName = format(monthDate, 'MMMM yyyy');
            const monthExpenses = expenses.filter(expense => {
              const expenseDate = new Date(expense.date);
              return (
                expenseDate.getMonth() === monthDate.getMonth() && 
                expenseDate.getFullYear() === monthDate.getFullYear()
              );
            });
            
            const monthTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            
            return (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900">{monthName}</h3>
                <p className="text-2xl font-bold text-indigo-600 mt-2">₹{monthTotal.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {monthExpenses.length} expense{monthExpenses.length !== 1 ? 's' : ''}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;