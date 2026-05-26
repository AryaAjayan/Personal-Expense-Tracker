import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import type { Expense } from '../../../types';
import { Button } from '../../../components/ui/Button';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
}

export function ExpenseTable({ expenses, onEdit, onDelete, isLoading }: ExpenseTableProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-card border border-border rounded-lg p-8 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground">Loading expenses...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="w-full bg-card border border-border rounded-lg p-12 flex flex-col items-center justify-center space-y-4">
        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center">
          <span className="text-2xl">💸</span>
        </div>
        <p className="text-muted-foreground text-lg">No expenses found.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-card border border-border rounded-lg overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
          <tr>
            <th className="px-6 py-4 font-medium">Date</th>
            <th className="px-6 py-4 font-medium">Title</th>
            <th className="px-6 py-4 font-medium">Category</th>
            <th className="px-6 py-4 font-medium">Amount</th>
            {(onEdit || onDelete) && <th className="px-6 py-4 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(expense.date), 'MMM dd, yyyy')}
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-foreground">{expense.title}</div>
                {expense.note && (
                  <div className="text-xs text-muted-foreground truncate max-w-[200px] mt-1">
                    {expense.note}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 font-semibold text-foreground">
                ${Number(expense.amount).toFixed(2)}
              </td>
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 text-right space-x-2">
                  {onEdit && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => onEdit(expense)}
                    >
                      <Pencil size={14} />
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(expense.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
