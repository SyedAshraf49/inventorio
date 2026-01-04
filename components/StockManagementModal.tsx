
import React, { useState, useEffect } from 'react';
import { type Product } from '../types';
import { CloseIcon } from './Icons';

interface StockManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStock: (product: Product, adjustment: number) => void;
  product: Product;
}

type AdjustmentType = 'add' | 'remove';

const StockManagementModal: React.FC<StockManagementModalProps> = ({ isOpen, onClose, onUpdateStock, product }) => {
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('add');
  const [amount, setAmount] = useState<number | string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError('');
      setAdjustmentType('add');
    }
  }, [isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setError('');
    
    if (value === '' || /^[0-9]\d*$/.test(value)) {
        const numValue = value === '' ? '' : parseInt(value, 10);
        
        if (adjustmentType === 'remove' && typeof numValue === 'number' && numValue > product.quantity) {
            setError(`Cannot remove more than available stock (${product.quantity}).`);
        }
        setAmount(numValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = typeof amount === 'number' ? amount : parseInt(amount, 10);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }
    
    if (adjustmentType === 'remove' && numericAmount > product.quantity) {
      setError(`Cannot remove more than available stock (${product.quantity}).`);
      return;
    }

    const adjustment = adjustmentType === 'add' ? numericAmount : -numericAmount;
    onUpdateStock(product, adjustment);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-start pb-4 border-b border-border">
            <div>
                <h3 className="text-xl font-semibold text-foreground">Manage Stock</h3>
                <p className="text-sm text-muted-foreground">{product.name}</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mt-6">
            <p className="text-center text-lg text-foreground">Current Quantity: <span className="font-bold text-primary">{product.quantity}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
                <div className="flex justify-center rounded-md shadow-sm" role="group">
                    <button type="button" onClick={() => setAdjustmentType('add')} className={`px-4 py-2 text-sm font-medium ${adjustmentType === 'add' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'} border border-border rounded-l-lg hover:bg-secondary`}>
                        Add Stock (Purchase)
                    </button>
                    <button type="button" onClick={() => setAdjustmentType('remove')} className={`px-4 py-2 text-sm font-medium ${adjustmentType === 'remove' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'} border border-border rounded-r-lg hover:bg-secondary`}>
                        Remove Stock (Sale)
                    </button>
                </div>
            </div>
            
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-muted-foreground text-center">Amount to {adjustmentType}</label>
                <input 
                    type="text" 
                    name="amount" 
                    id="amount" 
                    value={amount} 
                    onChange={handleAmountChange} 
                    required 
                    className="mt-1 block w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    pattern="[0-9]*"
                    inputMode="numeric"
                />
                 {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
            </div>

            <div className="pt-4 flex justify-end space-x-3 border-t border-border mt-6">
              <button type="button" onClick={onClose} className="bg-card py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring">
                Cancel
              </button>
              <button type="submit" disabled={!!error || amount === '' || amount === 0} className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
                Update Stock
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StockManagementModal;
