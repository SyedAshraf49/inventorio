
import React, { useMemo } from 'react';
import { type Product, type Category } from '../types';
import StatCard from './StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TotalItemsIcon, TotalValueIcon, LowStockIcon, OutOfStockIcon } from './Icons';

interface DashboardProps {
  products: Product[];
  categories: Category[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, categories }) => {
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalStockValue = products.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const lowStockProducts = products.filter(item => item.quantity > 0 && item.quantity <= 10).length;
    const outOfStockProducts = products.filter(item => item.quantity === 0).length;
    return { totalProducts, totalStockValue, lowStockProducts, outOfStockProducts };
  }, [products]);

  const categoryData = useMemo(() => {
    const categoryQuantities: { [key: number]: number } = {};
    products.forEach(item => {
      if (categoryQuantities[item.categoryId]) {
        categoryQuantities[item.categoryId] += item.quantity;
      } else {
        categoryQuantities[item.categoryId] = item.quantity;
      }
    });

    return Object.keys(categoryQuantities).map(id => {
      const categoryId = parseInt(id, 10);
      const category = categories.find(c => c.id === categoryId);
      return { name: category ? category.name : 'Unknown', quantity: categoryQuantities[categoryId] };
    });
  }, [products, categories]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Unique Products" 
          value={stats.totalProducts} 
          icon={<TotalItemsIcon />}
          color="blue"
        />
        <StatCard 
          title="Total Inventory Value" 
          value={`$${stats.totalStockValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} 
          icon={<TotalValueIcon />}
          color="green"
        />
        <StatCard 
          title="Low Stock Products" 
          value={stats.lowStockProducts} 
          icon={<LowStockIcon />}
          color="yellow"
        />
        <StatCard 
          title="Out of Stock" 
          value={stats.outOfStockProducts} 
          icon={<OutOfStockIcon />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-card p-6 rounded-xl shadow-lg">
           <h3 className="text-lg font-semibold text-foreground mb-4">Product Quantity by Category</h3>
           <div style={{ width: '100%', height: 300 }}>
             <ResponsiveContainer>
                <BarChart data={categoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip wrapperClassName="!bg-card !border-border !rounded-lg !shadow-lg" cursor={{fill: 'hsl(var(--secondary))'}} />
                  <Legend wrapperStyle={{fontSize: "14px"}} />
                  <Bar dataKey="quantity" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="lg:col-span-2 bg-card p-6 rounded-xl shadow-lg">
           <h3 className="text-lg font-semibold text-foreground mb-4">Recently Updated Products</h3>
            <ul className="space-y-4">
              {[...products]
                .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
                .slice(0, 5)
                .map(item => (
                  <li key={item.id} className="flex justify-between items-center border-b border-border pb-2 last:border-b-0">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sku}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{new Date(item.lastUpdated).toLocaleDateString()}</p>
                  </li>
              ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
