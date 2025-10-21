import { USER_ID_STORAGE_KEY } from "../types";

export class UserIDService {
  private userId: string | null = null;

  constructor() {
    this.loadSavedUserId();
  }

  getUserId(): string | null {
    return this.userId;
  }

  saveUserId(id: string): void {
    const trimmedId = id.trim();
    if (this.isValidUserId(trimmedId)) {
      this.userId = trimmedId;
      localStorage.setItem(USER_ID_STORAGE_KEY, trimmedId);
    }
  }

  loadSavedUserId(): void {
    const savedId = localStorage.getItem(USER_ID_STORAGE_KEY);
    if (savedId && this.isValidUserId(savedId)) {
      this.userId = savedId;
    }
  }

  clearUserId(): void {
    this.userId = null;
    localStorage.removeItem(USER_ID_STORAGE_KEY);
  }

  isValidUserId(id: string): boolean {
    const trimmed = id.trim();
    return trimmed.length >= 3 && trimmed.length <= 20;
  }

  getLastUsedId(): string | null {
    return localStorage.getItem(USER_ID_STORAGE_KEY);
  }
}

// Export singleton instance
export const userIdService = new UserIDService();
