import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, MapPin, Heart, Users, Award, ChevronRight, Menu, X, Bell } from 'lucide-react';

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
  const [notifications, setNotifications] = useState([]);
  const [eventSource, setEventSource] = useState(null);

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(user));
      connectToNotifications(token);
    }
  }, []);

  // Connect to Atmosphere SSE for real-time notifications
  const connectToNotifications = (token) => {
    if (eventSource) {
      eventSource.close();
    }

    const es = new EventSource(`http://localhost:8080/atmosphere/notifications/stream?token=${token}`);
    
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Notification received:', data);
        
        if (data.type === 'connected') {
          console.log('✅ Connected to notification stream');
          showNotification('Connected to real-time notifications', 'success');
        } else if (data.type === 'notification' || data.type === 'broadcast') {
          showNotification(data.message, 'info');
          setNotifications(prev => [...prev, data]);
        }
      } catch (e) {
        console.error('Error parsing notification:', e);
      }
    };

    es.onerror = (error) => {
      console.error('EventSource error:', error);
      es.close();
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        const token = localStorage.getItem('token');
        if (token) {
          connectToNotifications(token);
        }
      }, 5000);
    };

    setEventSource(es);
  };

  const showNotification = (message, type = 'info') => {
    setSubmitStatus({ type, message });
    setTimeout(() => setSubmitStatus(null), 5000);
  };

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
        connectToNotifications(data.token);
        showNotification('Registration successful!', 'success');
        setTimeout(() => setCurrentPage('home'), 2000);
      } else {
        showNotification(data.message || 'Registration failed', 'error');
      }
    } catch (error) {
      showNotification('Network error', 'error');
    }
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
        connectToNotifications(data.token);
        showNotification(`Welcome back, ${data.name}!`, 'success');
        setTimeout(() => setCurrentPage('home'), 2000);
      } else {
        showNotification(data.message || 'Login failed', 'error');
      }
    } catch (error) {
      showNotification('Network error', 'error');
    }
  };

  const handleLogout = () => {
    if (eventSource) {
      eventSource.close();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('home');
    showNotification('Logged out successfully', 'success');
  };

  const handleBookAppointment = async () => {
    if (!isLoggedIn) {
      showNotification('Please login first', 'error');
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
        showNotification('Appointment booked successfully!', 'success');
        setFormData({ ...formData, appointmentDate: '', appointmentTime: '', doctor: '', reason: '' });
        loadAppointments();
      } else {
        showNotification('Booking failed', 'error');
      }
    } catch (error) {
      showNotification('Network error', 'error');
    }
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
        showNotification('Message sent!', 'success');
        setFormData({ ...formData, name: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      showNotification('Network error', 'error');
    }
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
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Bell className="h-6 w-6 cursor-pointer" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </div>
                  <span className="text-sm">Hi, {currentUser?.name}</span>
                  <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">Logout</button>
                </div>
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
          submitStatus.type === 'success' ? 'bg-green-500' : 
          submitStatus.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white flex items-center space-x-2`}>
          {submitStatus.type === 'info' && <Bell className="h-5 w-5" />}
          <span>{submitStatus.message}</span>
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
      {currentPage === 'appointment' && (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">Book Appointment</h1>
            <p className="text-xl text-gray-600 mb-12 text-center">Schedule your visit with our expert doctors</p>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Select Doctor</label>
                  <select name="doctor" value={formData.doctor} onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                    <option value="">Choose a doctor...</option>
                    <option value="Dr. Smith">Dr. Smith - General Medicine</option>
                    <option value="Dr. Johnson">Dr. Johnson - Cardiology</option>
                    <option value="Dr. Williams">Dr. Williams - Pediatrics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Date</label>
                  <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleInputChange}
                         min={new Date().toISOString().split('T')[0]}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Time</label>
                  <select name="appointmentTime" value={formData.appointmentTime} onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                    <option value="">Select time...</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Reason</label>
                  <textarea name="reason" value={formData.reason} onChange={handleInputChange} rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
              </div>
              <button onClick={handleBookAppointment}
                      className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:shadow-xl">
                Confirm Appointment
              </button>
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
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
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
