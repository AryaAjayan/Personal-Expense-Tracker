import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import type { 
  Expense, 
  ExpenseCreate, 
  ExpenseUpdate, 
  PaginatedExpenseResponse, 
  MonthlySummaryResponse,
  MonthlyListEntry
} from '../../../types';

// Helper to remove empty params
const cleanParams = (params: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== '' && v !== undefined && v !== null)
  );
};

// Get Paginated Expenses
export const useExpenses = (params: {
  page: number;
  size: number;
  category?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['expenses', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedExpenseResponse>('/expenses', { params: cleanParams(params) });
      return data;
    },
  });
};

// Get Expense Summary
export const useExpenseSummary = (params: { start_date?: string; end_date?: string }) => {
  return useQuery({
    queryKey: ['expenseSummary', params],
    queryFn: async () => {
      const { data } = await api.get<MonthlySummaryResponse>('/expenses/summary', { params: cleanParams(params) });
      return data;
    },
  });
};

// Get Monthly List
export const useMonthlyList = () => {
  return useQuery({
    queryKey: ['monthlyList'],
    queryFn: async () => {
      const { data } = await api.get<MonthlyListEntry[]>('/expenses/summary/monthly');
      return data;
    },
  });
};

// Create Expense
export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expense: ExpenseCreate) => {
      const { data } = await api.post<Expense>('/expenses', expense);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenseSummary'] });
    },
  });
};

// Update Expense
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ExpenseUpdate }) => {
      const { data: response } = await api.put<Expense>(`/expenses/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenseSummary'] });
    },
  });
};

// Delete Expense
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenseSummary'] });
    },
  });
};
