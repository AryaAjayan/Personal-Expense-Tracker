import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';
import type { Expense } from '../../../types';

interface ExpenseChartsProps {
  expenses: Expense[];
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'];

export function ExpenseCharts({ expenses }: ExpenseChartsProps) {
  // Memoize chart data generation for performance
  const { pieData, barData } = useMemo(() => {
    // 1. Process Category Data for Pie Chart
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 2. Process Daily Trend Data for Bar Chart
    const dailyTotals = expenses.reduce((acc, expense) => {
      const date = expense.date; // YYYY-MM-DD
      acc[date] = (acc[date] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const barData = Object.entries(dailyTotals)
      .map(([date, total]) => ({
        date,
        formattedDate: format(parseISO(date), 'MMM dd'),
        total
      }))
      .sort((a, b) => a.date.localeCompare(b.date)); // Sort chronologically

    return { pieData, barData };
  }, [expenses]);

  if (!expenses || expenses.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* Category Pie Chart */}
      <div className="glass p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h3 className="text-lg font-bold text-foreground mb-4">Spending by Category</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Total']}
                contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '0.5rem', color: 'var(--color-foreground)' }}
                itemStyle={{ color: 'var(--color-foreground)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Trend Bar Chart */}
      <div className="glass p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h3 className="text-lg font-bold text-foreground mb-4">Daily Spending Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
              />
              <YAxis 
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Spent']}
                cursor={{ fill: 'var(--color-muted)', opacity: 0.2 }}
                contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '0.5rem', color: 'var(--color-foreground)' }}
              />
              <Bar 
                dataKey="total" 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
