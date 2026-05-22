import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Custom hook for authentication
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Hook for checking if user is admin
export const useAdmin = () => {
  const { user, isAdmin } = useAuth();
  return { isAdmin, user };
};

// Hook for protecting routes
export const useProtectedRoute = (adminOnly = false) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    if (!loading) {
      if (adminOnly) {
        setIsAuthorized(isAuthenticated && isAdmin);
      } else {
        setIsAuthorized(isAuthenticated);
      }
    }
  }, [isAuthenticated, isAdmin, loading, adminOnly]);
  
  return { isAuthorized, loading };
};

// Hook for user profile management
export const useUserProfile = () => {
  const { user, updateUserProfile, loading } = useAuth();
  const [profile, setProfile] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  
  useEffect(() => {
    setProfile(user);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
  }, [user]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateUserProfile(formData);
    if (success) {
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
    }
    return success;
  };
  
  return {
    profile,
    isEditing,
    setIsEditing,
    formData,
    handleChange,
    handleSubmit,
    loading
  };
};

// Hook for login form
export const useLoginForm = () => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const result = await login(formData.email, formData.password);
    if (!result.success) {
      setErrors({ general: result.error });
    }
    return result;
  };
  
  return {
    formData,
    errors,
    loading,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit
  };
};

// Hook for registration form
export const useRegisterForm = () => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const result = await register(formData.name, formData.email, formData.password);
    if (!result.success) {
      setErrors({ general: result.error });
    }
    return result;
  };
  
  return {
    formData,
    errors,
    loading,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit
  };
};

// Hook for password reset
export const useForgotPassword = () => {
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({});
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const result = await forgotPassword(email);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setErrors({ general: result.error });
    }
    return result;
  };
  
  return {
    email,
    errors,
    loading,
    isSubmitted,
    handleChange,
    handleSubmit
  };
};

// Hook for password reset confirmation
export const useResetPassword = (token) => {
  const { resetPassword, loading } = useAuth();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const result = await resetPassword(token, formData.password);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setErrors({ general: result.error });
    }
    return result;
  };
  
  return {
    formData,
    errors,
    loading,
    showPassword,
    showConfirmPassword,
    isSubmitted,
    setShowPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit
  };
};

// Hook for session timeout
export const useSessionTimeout = (timeoutMinutes = 30, onTimeout) => {
  const { logout } = useAuth();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [warningShown, setWarningShown] = useState(false);
  
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const updateActivity = () => {
      setLastActivity(Date.now());
      setWarningShown(false);
    };
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity);
    });
    
    const interval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      const timeoutMs = timeoutMinutes * 60 * 1000;
      const warningMs = (timeoutMinutes - 1) * 60 * 1000;
      
      if (inactiveTime >= timeoutMs) {
        clearInterval(interval);
        logout();
        if (onTimeout) onTimeout();
      } else if (inactiveTime >= warningMs && !warningShown) {
        setWarningShown(true);
        // Could show a toast notification here
        console.log('Session will expire soon due to inactivity');
      }
    }, 60000); // Check every minute
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      clearInterval(interval);
    };
  }, [lastActivity, timeoutMinutes, logout, onTimeout, warningShown]);
  
  return { lastActivity, warningShown };
};

// Hook for email verification
export const useEmailVerification = () => {
  const { verifyEmail, loading } = useAuth();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  
  const verify = async (token) => {
    try {
      const result = await verifyEmail(token);
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(result.error);
      }
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };
  
  const resendVerification = async (email) => {
    try {
      const result = await resendVerificationEmail(email);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };
  
  return {
    status,
    error,
    loading,
    verify,
    resendVerification
  };
};

// Hook for social login
export const useSocialLogin = () => {
  const { socialLogin, loading } = useAuth();
  const [error, setError] = useState(null);
  
  const loginWithGoogle = async () => {
    try {
      const result = await socialLogin('google');
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };
  
  const loginWithFacebook = async () => {
    try {
      const result = await socialLogin('facebook');
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };
  
  return {
    loading,
    error,
    loginWithGoogle,
    loginWithFacebook
  };
};

// Hook for two-factor authentication
export const useTwoFactorAuth = () => {
  const { setup2FA, verify2FA, disable2FA, loading } = useAuth();
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  
  const setup = async () => {
    const result = await setup2FA();
    if (result.success) {
      setQrCode(result.qrCode);
      setSecret(result.secret);
    }
    return result;
  };
  
  const verify = async (code) => {
    const result = await verify2FA(code);
    if (result.success) {
      setIsEnabled(true);
    }
    return result;
  };
  
  const disable = async () => {
    const result = await disable2FA();
    if (result.success) {
      setIsEnabled(false);
      setQrCode(null);
      setSecret(null);
    }
    return result;
  };
  
  return {
    qrCode,
    secret,
    isEnabled,
    loading,
    setup,
    verify,
    disable
  };
};

export default useAuth;