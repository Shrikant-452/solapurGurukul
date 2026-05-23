import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        toast.success('Login successful!');
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(result.error || 'Invalid email or password');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <div className="auth-om animate-glow">ॐ</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to access your dashboard</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="admin@solapur.com" 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••" 
              />
            </div>
            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
          
          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          
          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>📧 Admin: admin@solapur.com / admin123</p>
            <p>📧 User: user@solapur.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;