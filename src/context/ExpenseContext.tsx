import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, ExpenseContextType } from '../types';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Load expenses from localStorage when user changes
      const storedExpenses = localStorage.getItem('expenses');
      if (storedExpenses) {
        const allExpenses: Expense[] = JSON.parse(storedExpenses);
        // Filter expenses for current user
        setExpenses(allExpenses.filter(expense => expense.userId === user.id));
      }
    } else {
      setExpenses([]);
    }
  }, [user]);

  // Save all expenses to localStorage
  const saveExpenses = (updatedExpenses: Expense[]) => {
    // Get all expenses from localStorage
    const storedExpenses = localStorage.getItem('expenses');
    const allExpenses: Expense[] = storedExpenses ? JSON.parse(storedExpenses) : [];
    
    // Filter out current user's expenses
    const otherUserExpenses = user 
      ? allExpenses.filter(expense => expense.userId !== user.id) 
      : allExpenses;
    
    // Combine other users' expenses with updated expenses
    const combinedExpenses = [...otherUserExpenses, ...updatedExpenses];
    
    // Save back to localStorage
    localStorage.setItem('expenses', JSON.stringify(combinedExpenses));
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newExpense: Expense = {
      ...expense,
      id: uuidv4(),
      userId: user.id
    };
    
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  const updateExpense = (id: string, expenseUpdate: Partial<Omit<Expense, 'id' | 'userId'>>) => {
    const updatedExpenses = expenses.map(expense => 
      expense.id === id ? { ...expense, ...expenseUpdate } : expense
    );
    
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  const getExpenseById = (id: string) => {
    return expenses.find(expense => expense.id === id);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getExpensesByCategory = () => {
    return expenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      addExpense,
      updateExpense,
      deleteExpense,
      getExpenseById,
      getTotalExpenses,
      getExpensesByCategory
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};