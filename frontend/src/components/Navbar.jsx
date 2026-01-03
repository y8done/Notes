import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext'; // Import Context
import { LogOut, User, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
      logout();
      toast.success("Logged out successfully");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-200">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold text-primary">
            LifeNote
        </Link>
      </div>
      <div className="flex-none gap-4">
        
        {/* CREATE BUTTON (Always visible) */}
        <Link to="/create" className='btn btn-sm btn-ghost gap-2'>
            <Plus className='w-4 h-4'/>
            <span className='hidden sm:inline'>Create</span>
        </Link>

        {/* AUTH BUTTONS */}
        {!isAuthenticated ? (
          // IF LOGGED OUT
          <div className='flex gap-2'>
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
            <Link to="/register" className="btn btn-ghost btn-sm">Register</Link>
          </div>
        ) : (
          // IF LOGGED IN
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2 text-sm font-medium'>
                <User className='w-4 h-4'/>
                {/* Ensure user?.name exists, otherwise fallback to "User" */}
                <span className='hidden sm:inline'>{user?.name || "User"}</span>
            </div>
            
            <button 
                onClick={handleLogout} 
                className="btn btn-ghost btn-sm text-error"
                title="Logout"
            >
              <LogOut className='w-4 h-4' />
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Navbar;