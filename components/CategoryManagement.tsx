
import React, { useState, useMemo } from 'react';
import { type Category, type Product } from '../types';
import { PlusIcon, DeleteIcon } from './Icons';

interface CategoryManagementProps {
    categories: Category[];
    products: Product[];
    onAddCategory: (name: string) => void;
    onDeleteCategory: (id: number) => void;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ categories, products, onAddCategory, onDeleteCategory }) => {
    const [newCategoryName, setNewCategoryName] = useState('');

    const categoryUsage = useMemo(() => {
        const usageCount: { [key: number]: number } = {};
        for (const category of categories) {
            usageCount[category.id] = 0;
        }
        for (const product of products) {
            if (usageCount[product.categoryId] !== undefined) {
                usageCount[product.categoryId]++;
            }
        }
        return usageCount;
    }, [categories, products]);

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim() === '') {
            alert('Category name cannot be empty.');
            return;
        }
        if (categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
            alert('This category name already exists.');
            return;
        }
        onAddCategory(newCategoryName.trim());
        setNewCategoryName('');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 bg-card p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">Add New Category</h3>
                <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                        <label htmlFor="categoryName" className="block text-sm font-medium text-foreground">Category Name</label>
                        <input
                            type="text"
                            id="categoryName"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="mt-1 block w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
                            placeholder="e.g., Stationery"
                        />
                    </div>
                    <button type="submit" className="w-full flex justify-center items-center bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add Category
                    </button>
                </form>
            </div>
            <div className="md:col-span-2 bg-card p-6 rounded-xl shadow-lg">
                 <h2 className="text-xl font-semibold text-foreground mb-6">Existing Categories</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-secondary">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Products</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {categories.map((category) => {
                                const isInUse = categoryUsage[category.id] > 0;
                                return (
                                <tr key={category.id} className="hover:bg-secondary">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{category.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{categoryUsage[category.id]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative flex justify-end items-center">
                                            <button
                                                onClick={() => onDeleteCategory(category.id)}
                                                disabled={isInUse}
                                                className="text-muted-foreground hover:text-red-600 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
                                                title={isInUse ? "Cannot delete: category is in use" : "Delete Category"}
                                            >
                                                <DeleteIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                             {categories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-10 text-muted-foreground">
                                    No categories found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CategoryManagement;
