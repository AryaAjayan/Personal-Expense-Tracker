import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useExpenseSummary, useExpenses } from '../features/expenses/api';
import { ExpenseTable } from '../features/expenses/components/ExpenseTable';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export function MonthlySummaryPage() {
  const { month } = useParams<{ month: string }>(); // month format: YYYY-MM
  
  // Calculate start and end dates for the month
  const [yearStr, monthStr] = (month || '').split('-');
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);
  
  // start of month
  const startDate = `${year}-${monthStr}-01`;
  
  // end of month
  const lastDay = new Date(year, monthNum, 0).getDate();
  const endDate = `${year}-${monthStr}-${lastDay}`;

  const { data, isLoading } = useExpenseSummary({
    start_date: startDate,
    end_date: endDate
  });

  const { data: expensesData, isLoading: isLoadingExpenses } = useExpenses({
    page: 1,
    size: 100, // Fetch up to 100 expenses for the month
    start_date: startDate,
    end_date: endDate
  });

  const monthName = new Date(year, monthNum - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Summary for {monthName}</h1>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="mb-8">
              <h2 className="text-sm font-medium text-muted-foreground mb-1">Total Spent</h2>
              <div className="text-4xl font-bold text-foreground">
                ${Number(data?.total_spent || 0).toFixed(2)}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Category Breakdown</h3>
            
            {data?.category_breakdown && data.category_breakdown.length > 0 ? (
              <ul className="space-y-4">
                {data.category_breakdown.sort((a, b) => b.total - a.total).map((item) => (
                  <li key={item.category} className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border border-border">
                    <span className="font-medium text-foreground">{item.category}</span>
                    <span className="font-semibold text-primary">${Number(item.total).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-12 text-center text-muted-foreground bg-muted/10 rounded-lg border border-border border-dashed">
                <span className="text-2xl mb-2 block">📊</span>
                No expenses recorded for this month.
              </div>
            )}
            
            <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2 mt-12">Expense List</h3>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <ExpenseTable 
                expenses={expensesData?.items || []} 
                isLoading={isLoadingExpenses} 
                // Omitting onEdit and onDelete for read-only view
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
