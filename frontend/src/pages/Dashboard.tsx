import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ExpenseTable } from '../features/expenses/components/ExpenseTable';
import { ExpenseFilters } from '../features/expenses/components/ExpenseFilters';
import { ExpenseSummaryCards } from '../features/expenses/components/ExpenseSummaryCards';
import { ExpenseFormModal } from '../features/expenses/components/ExpenseFormModal';
import { 
  useExpenses, 
  useExpenseSummary, 
  useCreateExpense, 
  useUpdateExpense, 
  useDeleteExpense,
  useMonthlyList
} from '../features/expenses/api';
import type { Expense, ExpenseCreate } from '../types';

// Default categories for the MVP
const DEFAULT_CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];

export function Dashboard() {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    start_date: '',
    end_date: '',
  });
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const categories = DEFAULT_CATEGORIES;

  const { data: expensesData, isLoading: isLoadingExpenses } = useExpenses({
    page,
    size: 20,
    ...filters,
  });

  const { data: summaryData, isLoading: isLoadingSummary } = useExpenseSummary({
    start_date: filters.start_date,
    end_date: filters.end_date,
  });

  const { data: monthlyListData, isLoading: isLoadingMonthlyList } = useMonthlyList();

  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();
  const deleteMutation = useDeleteExpense();

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: ExpenseCreate) => {
    if (editingExpense) {
      await updateMutation.mutateAsync({ id: editingExpense.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              💰
            </div>
            <h1 className="text-xl font-bold text-foreground">ExpenseTracker</h1>
          </div>
          <Button onClick={handleOpenAddModal} size="sm" className="gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Add Expense</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExpenseSummaryCards summary={summaryData} isLoading={isLoadingSummary} />
        
        <ExpenseFilters 
          categories={categories} 
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            setPage(1); // Reset page on filter change
          }} 
        />

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <ExpenseTable 
            expenses={expensesData?.items || []} 
            isLoading={isLoadingExpenses}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
          />
          
          {/* Pagination Controls */}
          {expensesData && expensesData.total > 20 && (
            <div className="p-4 border-t border-border flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Showing {Math.min((page - 1) * 20 + 1, expensesData.total)} to {Math.min(page * 20, expensesData.total)} of {expensesData.total}
              </span>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * 20 >= expensesData.total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Summaries Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Monthly Summaries</h2>
          {isLoadingMonthlyList ? (
            <div className="flex space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-48 h-16 bg-card border border-border rounded-lg animate-pulse" />
              ))}
            </div>
          ) : monthlyListData && monthlyListData.length > 0 ? (
            <div className="flex overflow-x-auto pb-4 space-x-4 snap-x">
              {monthlyListData.map(item => {
                const dateObj = new Date(item.month + '-01');
                const monthName = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
                return (
                  <Link 
                    key={item.month} 
                    to={`/summary/${item.month}`}
                    className="flex-shrink-0 snap-start bg-card border border-border p-4 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-primary/50 min-w-[200px] group"
                  >
                    <div className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-primary transition-colors">{monthName}</div>
                    <div className="text-xl font-bold text-foreground">${Number(item.total).toFixed(2)}</div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No monthly summaries available.</p>
          )}
        </div>
      </main>

      {/* Modals */}
      <ExpenseFormModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingExpense}
        categories={categories}
      />
    </div>
  );
}
