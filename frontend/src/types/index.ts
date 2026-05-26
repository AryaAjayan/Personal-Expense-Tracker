export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  note?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCreate {
  title: string;
  amount: number;
  category: string;
  date: string;
  note?: string | null;
}

export interface ExpenseUpdate extends Partial<ExpenseCreate> {}

export interface PaginatedExpenseResponse {
  items: Expense[];
  total: number;
  page: number;
  size: number;
}

export interface CategorySummary {
  category: string;
  total: number;
}

export interface MonthlySummaryResponse {
  total_spent: number;
  category_breakdown: CategorySummary[];
}

export interface MonthlyListEntry {
  month: string;
  total: number;
}
