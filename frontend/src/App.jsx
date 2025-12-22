import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, MapPin, Heart, Users, Award, ChevronRight, Menu, X } from 'lucide-react';

export default function ClinicApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', message: '',
    appointmentDate: '', appointmentTime: '', doctor: '', reason: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name, email: formData.email,
          password: formData.password, phone: formData.phone
        })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setIsLoggedIn(true);
        setCurrentUser(data);
        setSubmitStatus({ type: 'success', message: 'Registration successful!' });
        setTimeout(() => setCurrentPage('home'), 2000);
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Registration failed' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error' });
    }
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setIsLoggedIn(true);
        setCurrentUser(data);
        setSubmitStatus({ type: 'success', message: `Welcome back, ${data.name}!` });
        setTimeout(() => setCurrentPage('home'), 2000);
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Login failed' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error' });
    }
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleBookAppointment = async () => {
    if (!isLoggedIn) {
      setSubmitStatus({ type: 'error', message: 'Please login first' });
      setTimeout(() => setCurrentPage('login'), 2000);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctor: formData.doctor, date: formData.appointmentDate,
          time: formData.appointmentTime, reason: formData.reason
        })
      });
      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Appointment booked!' });
        loadAppointments();
      } else {
        setSubmitStatus({ type: 'error', message: 'Booking failed' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error' });
    }
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const loadAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/appointments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments');
    }
  };

  const handleContact = async () => {
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name, email: formData.email,
          phone: formData.phone, message: formData.message
        })
      });
      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Message sent!' });
        setFormData({ ...formData, name: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error' });
    }
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const NavBar = () => (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <Heart className="h-8 w-8 text-red-300" />
            <span className="text-2xl font-bold">HealthCare Clinic</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => setCurrentPage('home')} className="hover:text-blue-200 transition">Home</button>
            <button onClick={() => setCurrentPage('about')} className="hover:text-blue-200 transition">About</button>
            <button onClick={() => setCurrentPage('contact')} className="hover:text-blue-200 transition">Contact</button>
            {isLoggedIn ? (
              <>
                <button onClick={() => setCurrentPage('appointment')} className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600">Book Appointment</button>
                <span className="text-sm">Hi, {currentUser?.name}</span>
                <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => setCurrentPage('login')} className="hover:text-blue-200 transition">Login</button>
                <button onClick={() => setCurrentPage('register')} className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50">Register</button>
              </>
            )}
          </div>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {submitStatus && (
        <div className={`fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 ${
          submitStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {submitStatus.message}
        </div>
      )}
      {currentPage === 'home' && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Your Health, Our Priority</h1>
              <p className="text-xl md:text-2xl mb-8">Expert medical care with compassion</p>
              <button onClick={() => setCurrentPage(isLoggedIn ? 'appointment' : 'register')} 
                      className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl">
                Book Appointment Now
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Users, title: 'Expert Doctors', desc: 'Highly qualified specialists', color: 'blue' },
                { icon: Clock, title: '24/7 Service', desc: 'Round-the-clock emergency care', color: 'green' },
                { icon: Award, title: 'Quality Care', desc: 'State-of-the-art facilities', color: 'purple' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
                  <div className={`bg-${item.color}-100 w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                    <item.icon className={`h-8 w-8 text-${item.color}-600`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {currentPage === 'login' && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-20">
          <div className="max-w-md mx-auto px-4">
            <h1 className="text-5xl font-bold text-gray-900 mb-12 text-center">Login</h1>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="••••••••" />
                </div>
                <button onClick={handleLogin}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 rounded-lg font-semibold hover:shadow-xl">
                  Login
                </button>
              </div>
              <div className="mt-6 text-center text-gray-600">
                Don't have an account? 
                <button onClick={() => setCurrentPage('register')} className="text-blue-600 hover:underline ml-1 font-semibold">
                  Register here
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {currentPage === 'register' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-20">
          <div className="max-w-md mx-auto px-4">
            <h1 className="text-5xl font-bold text-gray-900 mb-12 text-center">Register</h1>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <button onClick={handleRegister}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:shadow-xl">
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 HealthCare Clinic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
