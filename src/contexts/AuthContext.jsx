import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    console.log('Login attempt:', email, password);
    
    // Hardcoded admin credentials for testing
    if (email === 'admin@solapur.com' && password === 'admin123') {
      const adminUser = {
        id: '1',
        email: 'admin@solapur.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      console.log('Admin login success');
      return { success: true, user: adminUser };
    }
    
    // Hardcoded user credentials
    if (email === 'user@solapur.com' && password === 'user123') {
      const normalUser = {
        id: '2',
        email: 'user@solapur.com',
        name: 'Devotee User',
        role: 'user',
        createdAt: new Date().toISOString()
      };
      setUser(normalUser);
      localStorage.setItem('user', JSON.stringify(normalUser));
      console.log('User login success');
      return { success: true, user: normalUser };
    }
    
    console.log('Login failed: Invalid credentials');
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (name, email, password) => {
    // Check if user already exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = existingUsers.find(u => u.email === email);
    
    if (userExists) {
      return { success: false, error: 'Email already exists' };
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    // Save to registered users
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return { success: true, user: userWithoutPassword };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const getAllUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return [
      { id: '1', email: 'admin@solapur.com', name: 'Admin User', role: 'admin', createdAt: new Date().toISOString() },
      ...registeredUsers
    ];
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    getAllUsers,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};