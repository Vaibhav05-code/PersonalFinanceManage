import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, PieChart, LogOut, IndianRupee, UserCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <IndianRupee size={24} />
          <span>FinanceTracker</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-1 hover:text-indigo-200 transition-colors">
            <Home size={18} />
            <span>Dashboard</span>
          </Link>
          
          <Link to="/expenses" className="flex items-center space-x-1 hover:text-indigo-200 transition-colors">
            <IndianRupee size={18} />
            <span>Expenses</span>
          </Link>
          
          <Link to="/reports" className="flex items-center space-x-1 hover:text-indigo-200 transition-colors">
            <PieChart size={18} />
            <span>Reports</span>
          </Link>
          
          <Link to="/profile" className="flex items-center space-x-1 hover:text-indigo-200 transition-colors">
            <UserCircle size={18} />
            <span>Profile</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1 hover:text-indigo-200 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;