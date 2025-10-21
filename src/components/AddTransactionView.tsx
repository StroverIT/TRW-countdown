import React, { useState } from "react";
import type { SavingsTransaction } from "../types";
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

interface AddTransactionViewProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<SavingsTransaction, "id">) => Promise<void>;
  isSaving?: boolean;
}

export const AddTransactionView: React.FC<AddTransactionViewProps> = ({
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    try {
      await onSave({
        amount: amountNum,
        date: new Date(),
        note: note.trim() || undefined,
      });

      // Reset form
      setAmount("");
      setNote("");
      setError("");
      onClose();
    } catch (err) {
      setError("Failed to save transaction. Please try again.");
    }
  };

  const handleClose = () => {
    setAmount("");
    setNote("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="card-modern max-w-md w-full animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-accent-400 to-accent-500 rounded-xl flex items-center justify-center">
              <FaPlus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gradient font-display">
              Add Transaction
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-white text-opacity-60 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-xl transition-all duration-200"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="amount"
              className="block text-sm font-semibold text-white text-opacity-90"
            >
              Amount (BGN)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              placeholder="0.00"
              className={`input-field ${
                error ? "border-red-400 ring-red-400" : ""
              }`}
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="note"
              className="block text-sm font-semibold text-white text-opacity-90"
            >
              Note (Optional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this transaction..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-300 text-sm bg-red-500 bg-opacity-10 p-3 rounded-xl">
              <FaExclamationTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary flex-1"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isSaving || !amount.trim()}
            >
              {isSaving ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                <>
                  Save
                  <FaCheck className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
