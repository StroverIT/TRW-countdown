import React from "react";
import type { SavingsTransaction } from "../types";
import { formatCurrency, formatDate } from "../utils/calculations";
import { FaTrash } from "react-icons/fa";

interface TransactionRowProps {
  transaction: SavingsTransaction;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  onDelete,
  isDeleting = false,
}) => {
  return (
    <div className="surface rounded-2xl p-5 hover:bg-white/15 transition-all duration-300 group animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold text-white">
              {formatCurrency(transaction.amount)}
            </span>
            <span className="text-sm text-white text-opacity-70 bg-white bg-opacity-10 px-3 py-1 rounded-full">
              {formatDate(transaction.date)}
            </span>
          </div>
          {transaction.note && (
            <p className="text-sm text-white text-opacity-80 italic">
              "{transaction.note}"
            </p>
          )}
        </div>

        <button
          onClick={() => onDelete(transaction.id)}
          disabled={isDeleting}
          className="ml-4 p-3 text-red-300 hover:text-red-200 hover:bg-red-500 hover:bg-opacity-20 rounded-xl transition-all duration-200 disabled:opacity-50 group-hover:scale-110"
          title="Delete transaction"
          aria-label={`Delete transaction of ${formatCurrency(
            transaction.amount
          )} on ${formatDate(transaction.date)}`}
        >
          <FaTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
