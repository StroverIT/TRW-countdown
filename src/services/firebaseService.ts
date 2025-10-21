import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { SavingsTransaction } from "../types";

export class FirebaseService {
  async getTransactions(userId: string): Promise<SavingsTransaction[]> {
    try {
      const transactionsRef = collection(db, "users", userId, "transactions");
      const q = query(transactionsRef, orderBy("date", "desc"));

      const querySnapshot = await getDocs(q);

      const transactions: SavingsTransaction[] = querySnapshot.docs.map(
        (doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            amount: data.amount,
            date: data.date.toDate(), // Convert Firestore Timestamp to Date
            note: data.note || undefined,
          };
        }
      );

      return transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  async saveTransaction(
    userId: string,
    transaction: Omit<SavingsTransaction, "id">
  ): Promise<void> {
    try {
      const transactionsRef = collection(db, "users", userId, "transactions");
      await addDoc(transactionsRef, {
        amount: transaction.amount,
        date: Timestamp.fromDate(transaction.date),
        note: transaction.note || null,
      });
    } catch (error) {
      console.error("Error saving transaction:", error);
      throw error;
    }
  }

  async deleteTransaction(
    userId: string,
    transactionId: string
  ): Promise<void> {
    try {
      const transactionRef = doc(
        db,
        "users",
        userId,
        "transactions",
        transactionId
      );
      await deleteDoc(transactionRef);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService();
