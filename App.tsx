
import React, { useState, useCallback } from 'react';
import { initialProducts } from './data/mockData';
import { initialCategories } from './data/categories';
import { mockUsers } from './data/users';
import { initialTransactions } from './data/transactions';
import { initialAuditLogs } from './data/auditLog';
import { type Product, type User, type Category, type Transaction, type Notification, type AuditLog } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProductList from './components/InventoryList';
import ProductModal from './components/AddItemModal';
import StockManagementModal from './components/StockManagementModal';
import SignIn from './components/ui/signin-page';
import Users from './components/Users';
import CategoryManagement from './components/CategoryManagement';
import ConfirmationModal from './components/ConfirmationModal';
import Reports from './components/Reports';
import AuditLogView from './components/AuditLog';

type View = 'dashboard' | 'products' | 'users' | 'categories' | 'reports' | 'audit';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLog[]>(initialAuditLogs);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [managingStockFor, setManagingStockFor] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  
  const addAuditLog = useCallback((action: string, details: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: Date.now(),
      user: currentUser.username,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLog(prev => [newLog, ...prev]);
  }, [currentUser]);

  const handleLogin = (username: string, password: string): Promise<void> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = mockUsers.find(u => u.username === username && u.password === password);
            if (user) {
                setCurrentUser(user);
                resolve();
            } else {
                reject(new Error('Invalid username or password.'));
            }
        }, 500);
     });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setNotifications([]);
  };

  const addNotification = useCallback((notifData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notifData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const handleMarkAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  const handleClearNotifications = () => setNotifications([]);

  const handleCloseStockModal = useCallback(() => { setIsStockModalOpen(false); setManagingStockFor(null); }, []);
  const closeProductModal = useCallback(() => { setIsProductModalOpen(false); setEditingProduct(null); }, []);

  const handleStockUpdate = useCallback((product: Product, adjustment: number) => {
    const oldQuantity = product.quantity;
    const newQuantity = oldQuantity + adjustment;

    if (oldQuantity > 10 && newQuantity <= 10 && newQuantity > 0) addNotification({ type: 'lowStock', message: 'is running low on stock.', productId: product.id, productName: product.name });
    if (oldQuantity > 0 && newQuantity === 0) addNotification({ type: 'outOfStock', message: 'is now out of stock.', productId: product.id, productName: product.name });
    
    addAuditLog('Stock Update', `Quantity for "${product.name}" changed from ${oldQuantity} to ${newQuantity} (${adjustment > 0 ? '+' : ''}${adjustment}).`);

    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, quantity: newQuantity, lastUpdated: new Date().toISOString() } : p));
    const newTransaction: Transaction = { id: Date.now(), productId: product.id, type: adjustment > 0 ? 'purchase' : 'sale', quantity: Math.abs(adjustment), pricePerItem: product.price, date: new Date().toISOString() };
    setTransactions(prev => [newTransaction, ...prev]);

    handleCloseStockModal();
  }, [addNotification, addAuditLog, handleCloseStockModal]);
  
  const handleAddCategory = (name: string) => {
    const newCategory: Category = { id: Date.now(), name };
    setCategories(prev => [...prev, newCategory]);
  };
  const handleDeleteCategory = (id: number) => {
    if (products.some(p => p.categoryId === id)) {
      alert("Cannot delete category as it is in use.");
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const handleAddProduct = (productData: Omit<Product, 'id' | 'lastUpdated'>) => {
    const newProduct: Product = { ...productData, id: Date.now(), lastUpdated: new Date().toISOString() };
    setProducts(prev => [newProduct, ...prev]);
    addAuditLog('Product Added', `Added new product: "${newProduct.name}" (SKU: ${newProduct.sku}).`);
  };
  
  const handleUpdateProduct = (updatedProduct: Product) => {
    const oldProduct = products.find(p => p.id === updatedProduct.id);
    if (!oldProduct) return;
    
    const changes = Object.keys(updatedProduct).filter(key => key !== 'lastUpdated' && oldProduct[key as keyof Product] !== updatedProduct[key as keyof Product])
      .map(key => `${key}: from '${oldProduct[key as keyof Product]}' to '${updatedProduct[key as keyof Product]}'`).join(', ');

    if(changes){
      addAuditLog('Product Edited', `Edited "${updatedProduct.name}": ${changes}.`);
    }

    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? { ...updatedProduct, lastUpdated: new Date().toISOString() } : p));
  };

  const handleDeleteRequest = (itemId: number) => {
    setItemToDelete(itemId);
    setIsDeleteModalOpen(true);
  };
  const confirmDeleteItem = () => {
    if (itemToDelete !== null) {
      const productToDelete = products.find(p => p.id === itemToDelete);
      if (productToDelete) {
         addAuditLog('Product Deleted', `Deleted product: "${productToDelete.name}" (SKU: ${productToDelete.sku}).`);
      }
      setProducts(prev => prev.filter(item => item.id !== itemToDelete));
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };
  
  const openAddProductModal = useCallback(() => { setEditingProduct(null); setIsProductModalOpen(true); }, []);
  const openEditProductModal = useCallback((item: Product) => { setEditingProduct(item); setIsProductModalOpen(true); }, []);
  const handleOpenStockModal = useCallback((product: Product) => { setManagingStockFor(product); setIsStockModalOpen(true); }, []);
  
  const handleSaveProduct = (item: Product | Omit<Product, 'id' | 'lastUpdated'>) => {
    if ('id' in item) handleUpdateProduct(item as Product);
    else handleAddProduct(item);
    closeProductModal();
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard products={products} categories={categories} />;
      case 'products': return <ProductList products={products} categories={categories} onEditItem={openEditProductModal} onDeleteItem={handleDeleteRequest} onManageStock={handleOpenStockModal} userRole={currentUser!.role} />;
      case 'categories': return <CategoryManagement categories={categories} products={products} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} />;
      case 'reports': return <Reports products={products} categories={categories} transactions={transactions} />;
      case 'audit': return <AuditLogView logs={auditLog} />;
      case 'users': return <Users />;
      default: return <Dashboard products={products} categories={categories} />;
    }
  };

  if (!currentUser) return <SignIn onLogin={handleLogin} />;

  return (
    <>
      <div className="flex h-screen bg-background font-sans">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} userRole={currentUser.role} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onAddItem={openAddProductModal} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} user={currentUser} onLogout={handleLogout} notifications={notifications} onMarkAllAsRead={handleMarkAllAsRead} onClearNotifications={handleClearNotifications} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </main>
        </div>
        {isProductModalOpen && <ProductModal isOpen={isProductModalOpen} onClose={closeProductModal} onSave={handleSaveProduct} itemToEdit={editingProduct} categories={categories} />}
        {isStockModalOpen && managingStockFor && <StockManagementModal isOpen={isStockModalOpen} onClose={handleCloseStockModal} onUpdateStock={handleStockUpdate} product={managingStockFor} />}
      </div>
      <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDeleteItem} title="Confirm Deletion" message="Are you sure you want to delete this product? This action cannot be undone." />
    </>
  );
};

export default App;
