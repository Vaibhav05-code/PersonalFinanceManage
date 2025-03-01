import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import CategoryChart from '../components/CategoryChart';
import { BarChart, Calendar, Download } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { expenses } = useExpenses();
  const [period, setPeriod] = useState('month'); // 'month', 'quarter', 'year'
  const [startDate, setStartDate] = useState(() => {
    const date = startOfMonth(new Date());
    return format(date, 'yyyy-MM-dd');
  });
  const [endDate, setEndDate] = useState(() => {
    const date = endOfMonth(new Date());
    return format(date, 'yyyy-MM-dd');
  });

  // Filter expenses by date range
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
  });

  // Calculate total for the period
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Group expenses by category
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  // Group expenses by date (for the chart)
  const expensesByDate = filteredExpenses.reduce((acc, expense) => {
    const date = format(new Date(expense.date), 'yyyy-MM-dd');
    acc[date] = (acc[date] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Sort dates for the chart
  const sortedDates = Object.keys(expensesByDate).sort();

  // Set predefined periods
  const setPredefinedPeriod = (periodType: string) => {
    const today = new Date();
    let start, end;

    switch (periodType) {
      case 'month':
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      case 'quarter':
        start = startOfMonth(subMonths(today, 2));
        end = endOfMonth(today);
        break;
      case 'year':
        start = startOfMonth(subMonths(today, 11));
        end = endOfMonth(today);
        break;
      default:
        start = startOfMonth(today);
        end = endOfMonth(today);
    }

    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(end, 'yyyy-MM-dd'));
    setPeriod(periodType);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Expense Reports</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex space-x-2 mb-4 md:mb-0">
            <button
              onClick={() => setPredefinedPeriod('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                period === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setPredefinedPeriod('quarter')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                period === 'quarter'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Last 3 Months
            </button>
            <button
              onClick={() => setPredefinedPeriod('year')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                period === 'year'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Last 12 Months
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPeriod('custom');
                }}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPeriod('custom');
                }}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <BarChart size={20} className="text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Expense Summary</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-3xl font-bold text-indigo-600">₹{totalAmount.toFixed(2)}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">Number of Transactions</p>
                <p className="text-xl font-semibold">{filteredExpenses.length}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Average per Transaction</p>
                <p className="text-xl font-semibold">
                  ₹{filteredExpenses.length ? (totalAmount / filteredExpenses.length).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Download size={16} className="mr-2" />
                Export Report
              </button>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-4">
              <Calendar size={20} className="text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Expense Breakdown</h2>
            </div>
            
            <CategoryChart data={expensesByCategory} />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Expense Trend</h2>
        
        {sortedDates.length > 0 ? (
          <div className="h-64">
            <div className="flex h-full items-end">
              {sortedDates.map((date) => {
                const amount = expensesByDate[date];
                const maxAmount = Math.max(...Object.values(expensesByDate));
                const height = (amount / maxAmount) * 100;
                
                return (
                  <div key={date} className="flex-1 flex flex-col items-center mx-1">
                    <div 
                      className="w-full bg-indigo-500 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                      {format(new Date(date), 'MMM dd')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No expense data available for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;