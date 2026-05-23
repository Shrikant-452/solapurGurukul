import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ScrollProgress from './components/common/ScrollProgress';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Mantras from './pages/Mantras';
import MantraDetail from './components/cards/MantraDetail';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import AdminDashboard from './features/admin/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import MantrasByDeity from './pages/MantrasByDeity';
import './styles/globals.css';
import './styles/animations.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollProgress />
        <Navbar />
        <ScrollToTop />
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          
          {/* Mantra Routes */}
          <Route path="/mantras" element={<Mantras />} />
          <Route path="/mantras/deity/:deityName" element={<Mantras />} />
          <Route path="/mantra/:id" element={<MantraDetail />} />
          <Route path="/deity/:deity" element={<MantrasByDeity />} />
          
          {/* Info Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fcf8f0',
              color: '#c85a00',
              fontFamily: "'Crimson Pro', serif",
              border: '1px solid #d8c090',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;