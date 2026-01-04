
import React from 'react';
import { CloseIcon } from './Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{message}</p>
          <div className="pt-4 flex justify-end space-x-3 border-t border-border mt-6">
            <button type="button" onClick={onClose} className="bg-card py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring">
              Cancel
            </button>
            <button onClick={onConfirm} className="bg-destructive text-destructive-foreground font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive">
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
