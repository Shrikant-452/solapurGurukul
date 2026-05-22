import React, { useEffect, useRef, useState } from 'react';
import './Modal.css';

// Main Modal Component
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showFooter = false,
  footerContent,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  className = '',
  position = 'center'
}) => {
  const modalRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      
      // Focus trap
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    if (closeOnOverlayClick) {
      handleClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    handleClose();
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`modal-overlay ${isAnimating ? 'open' : ''} ${position}`}
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        className={`modal-container ${size} ${className} ${isAnimating ? 'open' : ''}`}
        tabIndex={-1}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h3 className="modal-title">{title}</h3>}
            {showCloseButton && (
              <button className="modal-close-btn" onClick={handleClose}>
                ✕
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="modal-body">
          {children}
        </div>

        {/* Modal Footer */}
        {(showFooter || footerContent) && (
          <div className="modal-footer">
            {footerContent ? (
              footerContent
            ) : (
              <>
                <button 
                  className="modal-btn modal-btn-cancel" 
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  {cancelText}
                </button>
                <button 
                  className="modal-btn modal-btn-confirm" 
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : confirmText}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Confirmation Modal
export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  isLoading = false
}) => {
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
        return '?';
    }
  };

  const getIconClass = () => {
    switch (type) {
      case 'success':
        return 'confirm-icon-success';
      case 'error':
        return 'confirm-icon-error';
      case 'warning':
        return 'confirm-icon-warning';
      default:
        return 'confirm-icon-info';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      showFooter={true}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onClose}
      isLoading={isLoading}
    >
      <div className="confirm-modal-content">
        <div className={`confirm-icon ${getIconClass()}`}>
          {getIcon()}
        </div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
      </div>
    </Modal>
  );
};

// Alert Modal
export const AlertModal = ({ 
  isOpen, 
  onClose, 
  title = 'Alert',
  message = '',
  buttonText = 'OK'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      showFooter={true}
      confirmText={buttonText}
      onConfirm={onClose}
      showCloseButton={false}
    >
      <div className="alert-modal-content">
        <p className="alert-message">{message}</p>
      </div>
    </Modal>
  );
};

// Drawer Modal (Side Panel)
export const DrawerModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  position = 'right',
  size = 'medium'
}) => {
  return (
    <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div 
        className={`drawer-container ${position} ${size} ${isOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <h3 className="drawer-title">{title}</h3>
          <button className="drawer-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="drawer-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Image Modal
export const ImageModal = ({ 
  isOpen, 
  onClose, 
  src, 
  alt = 'Image',
  caption = ''
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      showCloseButton={true}
      closeOnOverlayClick={true}
    >
      <div className="image-modal-content">
        <img src={src} alt={alt} className="image-modal-img" />
        {caption && <p className="image-modal-caption">{caption}</p>}
      </div>
    </Modal>
  );
};

// Form Modal
export const FormModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  isLoading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="medium"
      showFooter={true}
      confirmText={submitText}
      cancelText={cancelText}
      onConfirm={onSubmit}
      onCancel={onClose}
      isLoading={isLoading}
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {children}
      </form>
    </Modal>
  );
};

// Custom Hook for Modal
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return { isOpen, open, close, toggle };
};

export default Modal;