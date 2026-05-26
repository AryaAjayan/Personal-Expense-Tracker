import { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import type { Expense, ExpenseCreate } from '../../../types';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseCreate) => Promise<void>;
  initialData?: Expense | null;
  categories: string[];
}

/**
 * Extracts a human-readable error message string from an Axios error.
 * FastAPI returns validation errors as { detail: [{ loc, msg, type }] },
 * which is an array of objects — NOT a string. Rendering objects directly
 * in JSX causes React to crash with "Objects are not valid as a React child",
 * unmounting the entire component tree (blank screen).
 */
function extractErrorMessage(err: any): string {
  const detail = err?.response?.data?.detail;

  // FastAPI validation error: detail is an array of { loc, msg, type }
  if (Array.isArray(detail)) {
    return detail
      .map((d: any) => {
        const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : '';
        return field ? `${field}: ${d.msg}` : d.msg;
      })
      .join('. ');
  }

  // FastAPI string error (e.g. 404 "Not found")
  if (typeof detail === 'string') {
    return detail;
  }

  // Axios / network error
  if (typeof err?.message === 'string') {
    return err.message;
  }

  return 'Failed to save expense. Please try again.';
}

export function ExpenseFormModal({ isOpen, onClose, onSubmit, initialData, categories }: ExpenseFormModalProps) {
  const [formData, setFormData] = useState<any>({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Clear any previous error when the modal opens
      setError(null);

      if (initialData) {
        setFormData({
          title: initialData.title,
          amount: initialData.amount.toString(),
          category: initialData.category,
          date: initialData.date,
          note: initialData.note || '',
        });
      } else {
        setFormData({
          title: '',
          amount: '',
          category: categories[0] || '',
          date: new Date().toISOString().split('T')[0],
          note: ''
        });
      }
    }
  }, [isOpen, initialData, initialData?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: ExpenseCreate = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        // Send null instead of empty string for optional note field
        note: formData.note.trim() || undefined,
      };
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      console.error('Expense save failed:', err);
      setError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Expense' : 'Add New Expense'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            required
            maxLength={100}
            className="w-full bg-background/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
            value={formData.title}
            onChange={handleChange}
            placeholder="E.g., Groceries"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              required
              min="0.01"
              step="0.01"
              className="w-full bg-background/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              required
              className="w-full bg-background/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            required
            list="categories"
            maxLength={50}
            className="w-full bg-background/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
            value={formData.category}
            onChange={handleChange}
            placeholder="Select or type a category"
          />
          <datalist id="categories">
            {categories.map(cat => <option key={cat} value={cat} />)}
          </datalist>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Note (Optional)</label>
          <textarea
            name="note"
            rows={3}
            className="w-full bg-background/50 border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-none"
            value={formData.note}
            onChange={handleChange}
            placeholder="Any additional details..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (initialData ? 'Update Expense' : 'Add Expense')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
