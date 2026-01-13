import { Wallet } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { SummaryCards } from '@/components/SummaryCards';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { BudgetChart } from '@/components/BudgetChart';

const Index = () => {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
  } = useTransactions();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-2">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Budget Tracker</h1>
              <p className="text-sm text-muted-foreground">Track your income and expenses</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {/* Summary Cards */}
        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />

        {/* Form and Chart Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TransactionForm onAddTransaction={addTransaction} />
          <BudgetChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
        </div>

        {/* Transaction List */}
        <TransactionList
          transactions={transactions}
          onDeleteTransaction={deleteTransaction}
          onUpdateTransaction={updateTransaction}
        />
      </main>
    </div>
  );
};

export default Index;
