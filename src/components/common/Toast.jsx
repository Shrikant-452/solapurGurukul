import React, { useEffect } from 'react';
import './Toast.css';

// Toast Container Component
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Individual Toast Component
export const Toast = ({ id, type = 'info', message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <div className={`toast toast-${type} toast-animate-in`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>×</button>
      <div className="toast-progress" style={{ animationDuration: `${duration}ms` }}></div>
    </div>
  );
};

// Toast Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
};

// Toast Service for global usage
class ToastService {
  constructor() {
    this.listeners = [];
    this.toasts = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  addToast(message, type = 'info', duration = 3000) {
    const id = Date.now();
    const toast = { id, type, message, duration };
    this.toasts = [...this.toasts, toast];
    this.notify();

    setTimeout(() => {
      this.removeToast(id);
    }, duration);

    return id;
  }

  removeToast(id) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }

  success(message, duration) {
    return this.addToast(message, 'success', duration);
  }

  error(message, duration) {
    return this.addToast(message, 'error', duration);
  }

  warning(message, duration) {
    return this.addToast(message, 'warning', duration);
  }

  info(message, duration) {
    return this.addToast(message, 'info', duration);
  }
}

export const toastService = new ToastService();

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = toastService.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    toastService.removeToast(id);
  };

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

// Default export with static methods
const Toast = {
  success: (message, duration) => toastService.success(message, duration),
  error: (message, duration) => toastService.error(message, duration),
  warning: (message, duration) => toastService.warning(message, duration),
  info: (message, duration) => toastService.info(message, duration),
  Provider: ToastProvider,
  Container: ToastContainer
};

export default Toast;