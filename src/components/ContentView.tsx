import React, { useMemo, useState, useEffect } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { useUserID } from "../hooks/useUserID";
import { TransactionRow } from "./TransactionRow";
import { AddTransactionView } from "./AddTransactionView";
import { formatCurrency } from "../utils/calculations";
import {
  FaExclamationTriangle,
  FaRedo,
  FaDollarSign,
  FaUser,
  FaPlus,
} from "react-icons/fa";

/**
 * Refactor goals (per NN/g guidance):
 * 1) Meet contrast requirements — ensure text is never directly on highly variable backgrounds.
 * 2) Prefer more blur when translucency is used — use a single, consistent glass surface recipe.
 * 3) Let users adjust transparency — respect a persisted "reduce_transparency" setting and media preferences.
 * 4) Reduce visual noise — fewer glow/ornament layers, motion-safe animations only.
 * 5) Semantic/accessible structure, clear focus styles, and polite status messaging.
 */

interface ContentViewProps {
  onUserIdChange: () => void;
}

export const ContentView: React.FC<ContentViewProps> = ({ onUserIdChange }) => {
  const { userId } = useUserID();
  const {
    transactions,
    currentTotal,
    progressPercentage,
    targetAmount,
    addTransaction,
    deleteTransaction,
    isAddingTransaction,
    isDeletingTransaction,
    isLoading,
    error,
  } = useTransactions(userId);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Target date: December 31, 2025
  const targetDate = new Date("2025-12-31T23:59:59");

  // Real-time countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const timeDifference = targetDate.getTime() - now.getTime();

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        // Target date has passed
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Initial call
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Prefer a stable percentage string (0–100) once here.
  const percentage = useMemo(
    () => Math.round(progressPercentage * 100),
    [progressPercentage]
  );

  // User control for transparency per NN/g. Persist and mirror OS pref if you like.
  const toggleTransparency = () => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const enabled = root.classList.toggle("reduce-transparency");
    try {
      localStorage.setItem("reduce_transparency", enabled ? "1" : "0");
    } catch {}
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  // Loading state — no busy background, motion-safe only, aria-live polite.
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-purple-600 to-purple-800"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-sm text-center border border-white/20">
          <div
            className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-white/30 border-t-white motion-safe:animate-spin"
            aria-hidden
          />
          <p className="text-white/80">Loading your savings…</p>
        </div>
      </div>
    );
  }

  // Error state — clear, high-contrast, actionable.
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-purple-600 to-purple-800">
        <div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md text-center border border-white/20"
          role="alert"
        >
          <div className="text-red-400 mb-3">
            <FaExclamationTriangle className="w-10 h-10 mx-auto" aria-hidden />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Error loading data
          </h2>
          <p className="text-white/80 mb-4">
            There was a problem loading your savings data.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center transition-colors"
          >
            Try again
            <FaRedo className="w-5 h-5 ml-2" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-purple-800">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                TRW Countdown
              </h1>
              <p className="text-white/80 text-sm">User: {userId}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTransparency}
                className="text-white/80 hover:text-white text-sm hidden sm:inline-flex"
                aria-label="Toggle transparency for better contrast"
              >
                Contrast
              </button>
              <button
                onClick={onUserIdChange}
                className="text-white/80 hover:text-white text-sm inline-flex items-center"
              >
                <FaUser className="w-4 h-4 mr-1" aria-hidden />
                user: {userId}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Countdown Timer Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 text-center border border-white/20">
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-4">
            <div className="text-center">
              <div
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2"
                aria-live="polite"
              >
                {countdown.days}
              </div>
              <p className="text-white/80 text-sm md:text-base">
                {countdown.days === 1 ? "day" : "days"}
              </p>
            </div>
            <div className="text-center">
              <div
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2"
                aria-live="polite"
              >
                {countdown.hours.toString().padStart(2, "0")}
              </div>
              <p className="text-white/80 text-sm md:text-base">
                {countdown.hours === 1 ? "hour" : "hours"}
              </p>
            </div>
            <div className="text-center">
              <div
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2"
                aria-live="polite"
              >
                {countdown.minutes.toString().padStart(2, "0")}
              </div>
              <p className="text-white/80 text-sm md:text-base">
                {countdown.minutes === 1 ? "minute" : "minutes"}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Total Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <div className="mb-3">
              <p className="text-white/80 text-sm mb-1">$ Current Total</p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {formatCurrency(currentTotal)}
              </p>
            </div>
            <div className="mb-2">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            </div>
            <p className="text-white/80 text-sm">{percentage}%</p>
          </div>

          {/* Target Amount Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <div className="mb-3">
              <p className="text-white/80 text-sm mb-1">$ Target Amount</p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {formatCurrency(targetAmount)}
              </p>
            </div>
            <div className="mb-2">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            </div>
            <p className="text-white/80 text-sm">
              {100 - percentage}% remaining
            </p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 md:p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Transactions</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hidden md:inline-flex items-center transition-colors"
            >
              <FaPlus className="w-4 h-4 mr-2" aria-hidden />
              Add Transaction
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-2xl grid place-items-center">
                <FaDollarSign className="w-10 h-10 text-white/70" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No transactions yet
              </h3>
              <p className="text-white/70 mb-6">
                Start tracking your savings by adding your first transaction.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center transition-colors"
              >
                <FaPlus className="w-5 h-5 mr-2" aria-hidden />
                Add First Transaction
              </button>
            </div>
          ) : (
            <ul className="space-y-3" aria-live="polite">
              {transactions.map((transaction, index) => (
                <li
                  key={transaction.id}
                  className="motion-safe:animate-[fadeIn_0.4s_ease_forwards]"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <TransactionRow
                    transaction={transaction}
                    onDelete={handleDeleteTransaction}
                    isDeleting={isDeletingTransaction}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mobile sticky Add button */}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg md:hidden fixed bottom-5 left-5 z-20 inline-flex items-center transition-colors"
          onClick={() => setIsAddModalOpen(true)}
          aria-label="Add transaction"
        >
          <FaPlus className="w-5 h-5 mr-2" aria-hidden />
          Add
        </button>
      </main>

      {/* Add Transaction Modal */}
      <AddTransactionView
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addTransaction}
        isSaving={isAddingTransaction}
      />
    </div>
  );
};
