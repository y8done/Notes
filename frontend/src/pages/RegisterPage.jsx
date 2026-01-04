import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { KeyRound, Mail, User, UserCircle, UserPlus } from 'lucide-react';
import api from '../lib/axios';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/register', formData);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* <header className="bg-base-100 border-b border-base-content/10 shadow-sm">
        <div className="mx-auto max-w-6xl p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
              LifeNote
            </h1>
            <div className="flex items-center gap-4">
              <Link to={"/login"} className="btn btn-primary btn-outline">
                <span>Login</span>
              </Link>
            </div>
          </div>
        </div>
      </header> */}
      <Navbar />

      <main className="flex items-center justify-center p-4">
        {/* THIS IS THE MODIFIED LINE */}
        <div className="card w-full max-w-md shrink-0 bg-base-100 shadow-2xl">
          <form className="card-body" onSubmit={handleRegister}>
            <div className="flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              <h2 className="card-title text-2xl font-bold">Create Account</h2>
            </div>

            {/* Name Input */}
            <div className="form-control">
              <label className="label" htmlFor="name">
                <span className="label-text">Full Name</span>
              </label>
              <div className="input-group">
                <span><User className="h-4 w-4" /></span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            {/* Username Input */}
            <div className="form-control">
              <label className="label" htmlFor="username">
                <span className="label-text">Username</span>
              </label>
              <div className="input-group">
                <span><UserCircle className="h-4 w-4" /></span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <div className="input-group">
                <span><Mail className="h-4 w-4" /></span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <div className="input-group">
                <span><KeyRound className="h-4 w-4" /></span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                <UserPlus className="h-4 w-4" />
                Register
              </button>
            </div>
             <div className="text-center mt-4 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="link link-primary">
                    Login here
                </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;