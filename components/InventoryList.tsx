
import React, { useState, useMemo } from 'react';
import { type Product, type Category } from '../types';
import { EditIcon, DeleteIcon, ClipboardEditIcon } from './Icons';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  onEditItem: (item: Product) => void;
  onDeleteItem: (itemId: number) => void;
  onManageStock: (item: Product) => void;
  userRole: 'admin' | 'staff';
}

const StockStatusBadge: React.FC<{ quantity: number }> = ({ quantity }) => {
  if (quantity === 0) {
    return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400">Out of Stock</span>;
  }
  if (quantity <= 10) {
    return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400">Low Stock</span>;
  }
  return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">In Stock</span>;
};


const ProductList: React.FC<ProductListProps> = ({ products, categories, onEditItem, onDeleteItem, onManageStock, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState<string>('All');
  const [stockStatusFilter, setStockStatusFilter] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const categoryOptions = useMemo(() => [{ id: 'All', name: 'All Categories' }, ...categories], [categories]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: value }));
  };

  const filteredItems = useMemo(() => {
    return products.filter(item => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = 
        item.name.toLowerCase().includes(lowerCaseSearchTerm) || 
        item.sku.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.supplierName.toLowerCase().includes(lowerCaseSearchTerm);
        
      const matchesCategory = filterCategoryId === 'All' || item.categoryId === parseInt(filterCategoryId, 10);
      
      const stockStatusMatch = (() => {
        if (stockStatusFilter === 'All') return true;
        if (stockStatusFilter === 'In Stock') return item.quantity > 10;
        if (stockStatusFilter === 'Low Stock') return item.quantity > 0 && item.quantity <= 10;
        if (stockStatusFilter === 'Out of Stock') return item.quantity === 0;
        return true;
      })();

      const minPrice = parseFloat(priceRange.min);
      const maxPrice = parseFloat(priceRange.max);
      const priceMatch = 
        (isNaN(minPrice) || item.price >= minPrice) &&
        (isNaN(maxPrice) || item.price <= maxPrice);

      return matchesSearch && matchesCategory && stockStatusMatch && priceMatch;
    });
  }, [products, searchTerm, filterCategoryId, stockStatusFilter, priceRange]);
  
  const getCategoryName = (categoryId: number) => {
    return categories.find(c => c.id === categoryId)?.name || 'N/A';
  }

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name, SKU, supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:col-span-2 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {categoryOptions.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
           <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="All">All Stock Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <div className="flex items-center gap-2 lg:col-span-2">
            <label className="text-sm text-muted-foreground">Price:</label>
            <input
              type="number"
              name="min"
              placeholder="Min"
              value={priceRange.min}
              onChange={handlePriceChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              name="max"
              placeholder="Max"
              value={priceRange.max}
              onChange={handlePriceChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-secondary">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Supplier</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              {userRole === 'admin' && <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-secondary">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.sku}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{item.supplierName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{getCategoryName(item.categoryId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StockStatusBadge quantity={item.quantity} />
                </td>
                {userRole === 'admin' && 
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-4">
                        <button onClick={() => onManageStock(item)} className="text-muted-foreground hover:text-green-600" title="Manage Stock">
                            <ClipboardEditIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => onEditItem(item)} className="text-muted-foreground hover:text-primary" title="Edit Product">
                            <EditIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => onDeleteItem(item.id)} className="text-muted-foreground hover:text-red-600" title="Delete Product">
                            <DeleteIcon className="w-5 h-5" />
                        </button>
                    </div>
                  </td>
                }
              </tr>
            ))}
             {filteredItems.length === 0 && (
              <tr>
                <td colSpan={userRole === 'admin' ? 7 : 6} className="text-center py-10 text-muted-foreground">
                  No products found. Try adjusting your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
