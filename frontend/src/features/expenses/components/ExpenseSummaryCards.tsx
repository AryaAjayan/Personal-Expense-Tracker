import { DollarSign, PieChart, Activity } from 'lucide-react';
import type { MonthlySummaryResponse } from '../../../types';

interface ExpenseSummaryCardsProps {
  summary?: MonthlySummaryResponse;
  isLoading?: boolean;
}

export function ExpenseSummaryCards({ summary, isLoading }: ExpenseSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-xl animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const topCategory = summary?.category_breakdown && summary.category_breakdown.length > 0
    ? [...summary.category_breakdown].sort((a, b) => b.total - a.total)[0]
    : { category: 'N/A', total: 0 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Spent Card */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <DollarSign size={20} />
          </div>
        </div>
        <div className="text-3xl font-bold text-foreground">
          ${Number(summary?.total_spent || 0).toFixed(2)}
        </div>
      </div>

      {/* Top Category Card */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Top Category</h3>
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
            <PieChart size={20} />
          </div>
        </div>
        <div className="text-xl font-semibold text-foreground mb-1">
          {topCategory.category}
        </div>
        <div className="text-sm text-muted-foreground">
          ${Number(topCategory.total).toFixed(2)} spent
        </div>
      </div>

      {/* Total Transactions (Placeholder logic based on breakdown length for aesthetics, could be updated with real count if API provided it) */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Categories Used</h3>
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
            <Activity size={20} />
          </div>
        </div>
        <div className="text-3xl font-bold text-foreground">
          {summary?.category_breakdown?.length || 0}
        </div>
      </div>
    </div>
  );
}
