import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ExpenseFiltersProps {
  onFilterChange: (filters: { search: string; category: string; start_date: string; end_date: string }) => void;
  categories: string[];
}

export function ExpenseFilters({ onFilterChange, categories }: ExpenseFiltersProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search, category, start_date: startDate, end_date: endDate });
    }, 400);
    return () => clearTimeout(timer);
  }, [search, category, startDate, endDate, onFilterChange]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setStartDate('');
    setEndDate('');
  };

  const hasFilters = search || category || startDate || endDate;

  return (
    <div className="bg-card border border-border p-4 rounded-lg space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            className="w-full bg-background border border-input rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-48">
          <select
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="flex items-center space-x-2">
          <input
            type="date"
            className="w-full md:w-auto bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="date"
            className="w-full md:w-auto bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} className="text-xs h-[38px]">
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
