import React, { useState } from "react";
import { useNavigate, Link } from "react-router"; // <-- FIX: Import Link from react-router-dom
import { KeyRound, Mail, LogIn, UserCircle } from "lucide-react";
import { toast } from 'react-hot-toast'; // <-- FIX: Import toast
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";


const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // <-- FIX: Renamed and corrected the entire function
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      // FIX: Must be a POST request and must send the form data
      const res = await api.post('/user/login', formData);

      if (res.data.token) {
        // localStorage.setItem("token", res.data.token);
        login(res.data.token, res.data.user);
        toast.success("Login successful!");
        navigate("/"); // Redirect to the homepage
      }
    } catch (error) {
      console.log("Error logging in the user", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <header className="bg-base-100 border-b border-base-content/10 shadow-sm">
        <div className="mx-auto max-w-6xl p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
              LifeNote
            </h1>
            <div className="flex items-center gap-4">
              <Link to={"/register"} className="btn btn-primary btn-outline">
                <span>Register</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center p-4">
        <div className="card w-full max-w-md shrink-0 bg-base-100 shadow-2xl">
          {/* <-- FIX: Use onSubmit on the form for proper handling */}
          <form className="card-body" onSubmit={handleLogin}>
            <div className="flex items-center gap-2">
              <KeyRound className="h-6 w-6" />
              <h2 className="card-title text-2xl font-bold">Login</h2>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Username</span>
              </label>
              <div className="input-group">
                <span><UserCircle className="h-4 w-4" /></span>
                <input
                  type="username"
                  id="username"
                  name="username" // <-- FIX: Added name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="enter your username"
                  className="input input-bordered w-full" // FIX: Removed w-full for correct layout
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <div className="input-group">
                <span><KeyRound className="h-4 w-4" /></span>
                <input
                  type="password"
                  id="password"
                  name="password" // <-- FIX: Added name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input input-bordered w-full" // FIX: Removed w-full for correct layout
                  required
                />
              </div>
              <label className="label">
                <a href="#" className="link-hover label-text-alt link">
                  Forgot password?
                </a>
              </label>
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                <LogIn className="h-4 w-4" />
                Login
              </button>
            </div>
            <div className="text-center mt-4 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="link link-primary">
                    Register here
                </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;