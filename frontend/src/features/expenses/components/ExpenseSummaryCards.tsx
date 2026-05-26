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
      <div className="glass p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Spent</h3>
          <div className="p-2.5 bg-primary/20 rounded-xl text-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <DollarSign size={20} className="drop-shadow-md" />
          </div>
        </div>
        <div className="text-4xl font-extrabold text-foreground tracking-tight">
          ${Number(summary?.total_spent || 0).toFixed(2)}
        </div>
      </div>

      {/* Top Category Card */}
      <div className="glass p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Top Category</h3>
          <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <PieChart size={20} className="drop-shadow-md" />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground mb-1 tracking-tight">
          {topCategory.category}
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          ${Number(topCategory.total).toFixed(2)} spent
        </div>
      </div>

      {/* Total Transactions (Placeholder logic based on breakdown length for aesthetics, could be updated with real count if API provided it) */}
      <div className="glass p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Categories Used</h3>
          <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <Activity size={20} className="drop-shadow-md" />
          </div>
        </div>
        <div className="text-4xl font-extrabold text-foreground tracking-tight">
          {summary?.category_breakdown?.length || 0}
        </div>
      </div>
    </div>
  );
}
