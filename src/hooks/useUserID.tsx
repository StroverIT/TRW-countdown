import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { userIdService } from "../services/userIdService";

interface UserIDContextType {
  userId: string | null;
  setUserId: (id: string) => void;
  clearUserId: () => void;
  isValidUserId: (id: string) => boolean;
  getLastUsedId: () => string | null;
}

const UserIDContext = createContext<UserIDContextType | undefined>(undefined);

interface UserIDProviderProps {
  children: ReactNode;
}

export const UserIDProvider = ({ children }: UserIDProviderProps) => {
  const [userId, setUserIdState] = useState<string | null>(null);

  useEffect(() => {
    // Load initial user ID
    const initialUserId = userIdService.getUserId();
    setUserIdState(initialUserId);
  }, []);

  const setUserId = (id: string) => {
    userIdService.saveUserId(id);
    setUserIdState(id.trim());
  };

  const clearUserId = () => {
    userIdService.clearUserId();
    setUserIdState(null);
  };

  const isValidUserId = (id: string) => {
    return userIdService.isValidUserId(id);
  };

  const getLastUsedId = () => {
    return userIdService.getLastUsedId();
  };

  const value: UserIDContextType = {
    userId,
    setUserId,
    clearUserId,
    isValidUserId,
    getLastUsedId,
  };

  return (
    <UserIDContext.Provider value={value}>{children}</UserIDContext.Provider>
  );
};

export const useUserID = () => {
  const context = useContext(UserIDContext);
  if (context === undefined) {
    throw new Error("useUserID must be used within a UserIDProvider");
  }
  return context;
};
