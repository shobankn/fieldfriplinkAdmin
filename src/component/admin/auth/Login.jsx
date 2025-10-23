import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('admintoken');
    const storedUserType = localStorage.getItem('userType');
    if (token && storedUserType) {
      if (storedUserType === 'SuperAdmin') {
        navigate('/');
      } else if (storedUserType === 'Driver') {
        navigate('/driverdashboard');
      } else if (storedUserType === 'School') {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'https://fieldtriplinkbackend-production.up.railway.app/api/auth/login',
        {
          email,
          password,
        }
      );

      const { token: newToken, user } = response.data;

      if (user.role === 'super_admin') {
        localStorage.setItem('admintoken', newToken);
        localStorage.setItem('userType', 'SuperAdmin');
        toast.success('Super Admin login successful!');
        navigate('/');
      } else {
        toast.error('User role does not match super admin.');
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        'Login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center px-6 lg:px-[35px] py-6 lg:py-0">
        <div onClick={handleLogoClick} className="cursor-pointer">
          <img src={logo} alt="Logo" className="w-full max-w-[400px] lg:max-w-none" />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[55%] bg-[#f9fafb] flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-6 lg:py-0">
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] archivosemibold text-center mb-1">Sign In to your Account</h2>
        <p className="text-center text-sm sm:text-base lg:text-[16px] text-[#666666] interregular mb-6">Log in to start your journey</p>

        <form onSubmit={handleSubmit} className="mt-5 lg:mt-[20px]">
          <div className="mb-4">
            <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 outline-none focus:ring-2 focus:ring-red-500 rounded-md px-3 py-2 text-sm lg:text-base"
              required
            />
          </div>

          <div className="mb-6 lg:mb-[60px]">
            <label className="block text-sm lg:text-[14px] inter-semibold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500 px-3 py-2 text-sm lg:text-base"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <i className={showPassword ? 'far fa-eye-slash' : 'far fa-eye'}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#de3b40] hover:bg-red-600 text-white rounded-[8px] font-medium h-[48px] text-sm lg:text-base transition-colors duration-300 flex items-center justify-center cursor-pointer ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminLogin;