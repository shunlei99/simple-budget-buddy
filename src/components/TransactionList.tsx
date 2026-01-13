import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, TrendingUp, TrendingDown, Pencil, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Transaction, TransactionType } from '@/types/budget';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onUpdateTransaction: (id: string, updates: Omit<Transaction, 'id'>) => void;
}

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Other'],
};

export function TransactionList({ transactions, onDeleteTransaction, onUpdateTransaction }: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editType, setEditType] = useState<TransactionType>('expense');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState<Date>(new Date());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditType(transaction.type);
    setEditAmount(transaction.amount.toString());
    setEditCategory(transaction.category);
    setEditDescription(transaction.description);
    setEditDate(new Date(transaction.date));
  };

  const handleSaveEdit = () => {
    if (!editingTransaction || !editAmount || parseFloat(editAmount) <= 0) return;

    onUpdateTransaction(editingTransaction.id, {
      type: editType,
      amount: parseFloat(editAmount),
      category: editCategory || 'Other',
      description: editDescription,
      date: editDate.toISOString(),
    });

    setEditingTransaction(null);
  };

  const handleTypeChange = (newType: TransactionType) => {
    setEditType(newType);
    setEditCategory('');
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-1">No transactions yet</h3>
          <p className="text-muted-foreground text-sm">
            Add your first transaction to start tracking your budget
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="group">
                    <TableCell className="font-medium">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.type === 'income' ? 'income' : 'expense'}
                        className="flex w-fit items-center gap-1"
                      >
                        {transaction.type === 'income' ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {transaction.description || '—'}
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${
                        transaction.type === 'income' ? 'text-income' : 'text-expense'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(transaction)}
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onDeleteTransaction(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingTransaction} onOpenChange={(open) => !open && setEditingTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select value={editType} onValueChange={(v) => handleTypeChange(v as TransactionType)}>
                  <SelectTrigger id="edit-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-income" />
                        Income
                      </span>
                    </SelectItem>
                    <SelectItem value="expense">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-expense" />
                        Expense
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES[editType].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  placeholder="Optional description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editDate ? format(editDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editDate}
                    onSelect={(d) => d && setEditDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditingTransaction(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
