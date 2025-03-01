import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { UserCircle, Mail, Calendar } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { expenses, getTotalExpenses } = useExpenses();
  
  if (!user) {
    return null;
  }
  
  // Calculate some stats
  const totalExpenses = getTotalExpenses();
  const expenseCount = expenses.length;
  const joinDate = new Date().toLocaleDateString(); // In a real app, this would come from the user object
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-600 px-6 py-12">
            <div className="flex flex-col items-center">
              <div className="bg-white p-2 rounded-full mb-4">
                <UserCircle size={80} className="text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Mail size={24} className="text-indigo-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Calendar size={24} className="text-indigo-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium">{joinDate}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <UserCircle size={24} className="text-indigo-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium">{user.id.substring(0, 8)}...</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Expenses Tracked</p>
                  <p className="text-2xl font-bold text-indigo-600">₹{totalExpenses.toFixed(2)}</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Number of Expenses</p>
                  <p className="text-2xl font-bold text-indigo-600">{expenseCount}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
              
              <div className="space-y-4">
                <button className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Change Password
                </button>
                
                <button className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Update Profile
                </button>
                
                <button className="w-full md:w-auto px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;