
import React, { useState, useMemo } from 'react';
import { type Product, type Category, type Transaction } from '../types';

interface ReportsProps {
  products: Product[];
  categories: Category[];
  transactions: Transaction[];
}

type ReportType = 'available' | 'lowStock' | 'purchases' | 'sales';

const Reports: React.FC<ReportsProps> = ({ products, categories, transactions }) => {
  const [activeReport, setActiveReport] = useState<ReportType>('available');

  const getCategoryName = (categoryId: number) => categories.find(c => c.id === categoryId)?.name || 'N/A';
  const getProduct = (productId: number) => products.find(p => p.id === productId);

  const reportData = useMemo(() => {
    switch (activeReport) {
      case 'available':
        return products
          .filter(p => p.quantity > 0)
          .map(p => ({
            'Product Name': p.name,
            SKU: p.sku,
            Category: getCategoryName(p.categoryId),
            Supplier: p.supplierName,
            Quantity: p.quantity,
            'Price': `$${p.price.toFixed(2)}`,
            'Total Value': `$${(p.quantity * p.price).toFixed(2)}`,
          }));
      case 'lowStock':
        return products
          .filter(p => p.quantity > 0 && p.quantity <= 10)
          .map(p => ({
            'Product Name': p.name,
            SKU: p.sku,
            Category: getCategoryName(p.categoryId),
            Supplier: p.supplierName,
            Quantity: p.quantity,
            'Price': `$${p.price.toFixed(2)}`,
          }));
      case 'purchases':
        return transactions
          .filter(t => t.type === 'purchase')
          .map(t => {
            const product = getProduct(t.productId);
            return {
              Date: new Date(t.date).toLocaleString(),
              'Product Name': product?.name || 'N/A',
              SKU: product?.sku || 'N/A',
              'Quantity Purchased': t.quantity,
              'Price per Item': `$${t.pricePerItem.toFixed(2)}`,
              'Total Cost': `$${(t.quantity * t.pricePerItem).toFixed(2)}`,
            };
          });
      case 'sales':
        return transactions
          .filter(t => t.type === 'sale')
          .map(t => {
            const product = getProduct(t.productId);
            return {
              Date: new Date(t.date).toLocaleString(),
              'Product Name': product?.name || 'N/A',
              SKU: product?.sku || 'N/A',
              'Quantity Sold': t.quantity,
              'Price per Item': `$${t.pricePerItem.toFixed(2)}`,
              'Total Revenue': `$${(t.quantity * t.pricePerItem).toFixed(2)}`,
            };
          });
      default:
        return [];
    }
  }, [activeReport, products, categories, transactions]);

  const reportTitles: Record<ReportType, string> = {
    available: 'Available Stock Report',
    lowStock: 'Low Stock Report',
    purchases: 'Purchase History Report',
    sales: 'Sales History Report',
  };

  const exportToCsv = (filename: string, data: any[]) => {
    if (!data || !data.length) return;
    const separator = ',';
    const keys = Object.keys(data[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      data.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = String(cell).replace(/"/g, '""').replace(/,/g, '');
          return `"${cell}"`;
        }).join(separator);
      }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handlePrint = () => {
    window.print();
  };

  const renderTable = () => {
    if (reportData.length === 0) {
      return <p className="text-center text-muted-foreground py-10">No data available for this report.</p>;
    }
    const headers = Object.keys(reportData[0]);
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-secondary">
            <tr>
              {headers.map(header => (
                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {reportData.map((row, index) => (
              <tr key={index} className="hover:bg-secondary">
                {headers.map(header => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
     <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none;
          }
          .dark #print-area {
             background-color: white !important;
             color: black !important;
          }
          .dark #print-area * {
             color: black !important;
          }
        }
      `}</style>
      <div className="space-y-6">
        <div className="bg-card p-4 rounded-xl shadow-lg no-print">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Reports</h2>
                    <p className="text-sm text-muted-foreground">Analyze your inventory and transaction data.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => exportToCsv(reportTitles[activeReport], reportData)} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 focus:outline-none">
                        Export to CSV
                    </button>
                    <button onClick={handlePrint} className="bg-secondary text-secondary-foreground font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-secondary/80 focus:outline-none">
                        Print Report
                    </button>
                </div>
            </div>
          <div className="border-b border-border mt-4">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {(['available', 'lowStock', 'purchases', 'sales'] as ReportType[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveReport(tab)}
                  className={`${
                    activeReport === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                >
                  {reportTitles[tab].replace(' Report', '').replace(' History','')}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div id="print-area" className="bg-card p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">{reportTitles[activeReport]}</h3>
          {renderTable()}
        </div>
      </div>
    </>
  );
};

export default Reports;
