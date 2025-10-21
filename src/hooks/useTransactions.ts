import { useState, useEffect, useCallback } from "react";
import { firebaseService } from "../services/firebaseService";
import type { SavingsTransaction } from "../types";
import { TARGET_AMOUNT, TARGET_DATE } from "../types";

export const useTransactions = (userId: string | null) => {
  const [transactions, setTransactions] = useState<SavingsTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isDeletingTransaction, setIsDeletingTransaction] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!userId) {
      setTransactions([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await firebaseService.getTransactions(userId);
      console.log("test+++ useTransactions: Fetched transactions:");
      setTransactions(data);
      setError(null);
    } catch (err) {
      console.error(
        "test+++ useTransactions: Error fetching transactions:",
        err
      );
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (
    transaction: Omit<SavingsTransaction, "id">
  ) => {
    if (!userId) throw new Error("No user ID provided");

    console.log("useTransactions: Adding transaction");
    setIsAddingTransaction(true);

    try {
      await firebaseService.saveTransaction(userId, transaction);
      console.log("useTransactions: Transaction added successfully");
      // Refetch transactions after adding
      await fetchTransactions();
    } catch (err) {
      console.error("useTransactions: Error adding transaction:", err);
      throw err;
    } finally {
      setIsAddingTransaction(false);
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    if (!userId) throw new Error("No user ID provided");

    console.log("useTransactions: Deleting transaction:", transactionId);
    setIsDeletingTransaction(true);

    try {
      await firebaseService.deleteTransaction(userId, transactionId);
      console.log("useTransactions: Transaction deleted successfully");
      // Refetch transactions after deleting
      await fetchTransactions();
    } catch (err) {
      console.error("useTransactions: Error deleting transaction:", err);
      throw err;
    } finally {
      setIsDeletingTransaction(false);
    }
  };

  // Computed values
  const currentTotal = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const progressPercentage = Math.min(currentTotal / TARGET_AMOUNT, 1.0);
  const daysRemaining = Math.max(
    0,
    Math.ceil((TARGET_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return {
    transactions,
    currentTotal,
    progressPercentage,
    daysRemaining,
    targetAmount: TARGET_AMOUNT,
    targetDate: TARGET_DATE,
    isLoading,
    error,
    addTransaction,
    deleteTransaction,
    isAddingTransaction,
    isDeletingTransaction,
  };
};
