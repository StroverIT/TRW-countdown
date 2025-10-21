import { format, formatDistanceToNow } from "date-fns";

export const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)} BGN`;
};

export const formatDate = (date: Date): string => {
  return format(date, "MMM dd, yyyy");
};

export const formatDateRelative = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export const calculateProgress = (current: number, target: number): number => {
  return Math.min(current / target, 1.0);
};

export const calculateDaysRemaining = (targetDate: Date): number => {
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};
