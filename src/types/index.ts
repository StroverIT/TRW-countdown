export interface SavingsTransaction {
  id: string;
  amount: number;
  date: Date;
  note?: string;
}

export interface UserIDService {
  userId: string | null;
  setUserId: (id: string) => void;
  clearUserId: () => void;
  isValidUserId: (id: string) => boolean;
}

export interface FirebaseService {
  startListening: (userId: string) => () => void;
  saveTransaction: (
    userId: string,
    transaction: Omit<SavingsTransaction, "id">
  ) => Promise<void>;
  deleteTransaction: (userId: string, transactionId: string) => Promise<void>;
}

export interface SavingsData {
  transactions: SavingsTransaction[];
  currentTotal: number;
  progressPercentage: number;
  daysRemaining: number;
  targetAmount: number;
  targetDate: Date;
}

export const TARGET_AMOUNT = 20000;
export const TARGET_DATE = new Date(2025, 11, 31); // December 31, 2025
export const USER_ID_STORAGE_KEY = "saved_user_id";
