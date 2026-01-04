
import React, { useState, useEffect } from 'react';
import { type Product, type Category } from '../types';
import { CloseIcon } from './Icons';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Product | Omit<Product, 'id' | 'lastUpdated'>) => void;
  itemToEdit: Product | null;
  categories: Category[];
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, itemToEdit, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: categories[0]?.id || 0,
    quantity: 0,
    price: 0,
    supplierName: '',
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name,
        sku: itemToEdit.sku,
        categoryId: itemToEdit.categoryId,
        quantity: itemToEdit.quantity,
        price: itemToEdit.price,
        supplierName: itemToEdit.supplierName,
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        categoryId: categories[0]?.id || 0,
        quantity: 0,
        price: 0,
        supplierName: ''
      });
    }
  }, [itemToEdit, isOpen, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number = value;
    if (type === 'number' || name === 'categoryId') {
        processedValue = parseFloat(value) || 0;
    }
  
    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId && categories.length > 0) {
        alert("Please select a category.");
        return;
    }
    if (itemToEdit) {
      onSave({ ...itemToEdit, ...formData });
    } else {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-lg transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <h3 className="text-xl font-semibold text-foreground">{itemToEdit ? 'Edit Product' : 'Add New Product'}</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground">Product Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"/>
              </div>
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-foreground">SKU</label>
                <input type="text" name="sku" id="sku" value={formData.sku} onChange={handleChange} required className="mt-1 block w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"/>
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-foreground">Category</label>
                  <select name="categoryId" id="categoryId" value={formData.categoryId} onChange={handleChange} required className="mt-1 block w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm">
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="supplierName" className="block text-sm font-medium text-foreground">Supplier Name</label>
                  <input type="text" name="supplierName" id="supplierName" value={formData.supplierName} onChange={handleChange} required className="mt-1 block w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"/>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-foreground">Quantity</label>
                <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} min="0" required className="mt-1 block w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"/>
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-foreground">Price ($)</label>
                <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} min="0" step="0.01" required className="mt-1 block w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"/>
              </div>
            </div>
            <div className="pt-4 flex justify-end space-x-3 border-t border-border mt-6">
              <button type="button" onClick={onClose} className="bg-card py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring">
                Cancel
              </button>
              <button type="submit" className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
