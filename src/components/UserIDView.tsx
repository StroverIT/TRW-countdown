import React, { useState } from "react";
import { useUserID } from "../hooks/useUserID";
import {
  FaDollarSign,
  FaArrowRight,
  FaExclamationTriangle,
} from "react-icons/fa";

interface UserIDViewProps {
  onContinue: () => void;
}

export const UserIDView: React.FC<UserIDViewProps> = ({ onContinue }) => {
  const [inputUserId, setInputUserId] = useState("");
  const [error, setError] = useState("");
  const { isValidUserId, getLastUsedId, setUserId } = useUserID();

  const lastUsedId = getLastUsedId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidUserId(inputUserId)) {
      setError("User ID must be between 3 and 20 characters");
      return;
    }

    setError("");
    setUserId(inputUserId);
    onContinue();
  };

  const handleUseLastId = () => {
    if (lastUsedId) {
      setInputUserId(lastUsedId);
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white bg-opacity-10 rounded-full blur-3xl animate-pulse-slow hidden md:block"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400 bg-opacity-20 rounded-full blur-3xl animate-pulse-slow delay-1000 hidden md:block"></div>
      </div>

      <div className="surface-strong max-w-md w-full relative z-10 p-6 md:p-8 rounded-2xl">
        <div className="text-center mb-8">
          <div className="floating-element mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center shadow-neon">
              <FaDollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient font-display mb-2">
            TRW Countdown
          </h1>
          <p className="text-white text-opacity-80 text-lg">
            Enter your User ID to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="userId"
              className="block text-sm font-semibold text-white text-opacity-90"
            >
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={inputUserId}
              onChange={(e) => {
                setInputUserId(e.target.value);
                setError("");
              }}
              placeholder="Enter User ID (e.g., emil123)"
              className={`input-field ${
                error ? "border-red-400 ring-red-400" : ""
              }`}
              required
            />
            {error && (
              <div className="flex items-center space-x-2 text-red-300 text-sm">
                <FaExclamationTriangle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {lastUsedId && (
            <div className="text-center space-y-3">
              <div className="glass-card-inset rounded-xl p-4">
                <p className="text-sm text-white text-opacity-70 mb-1">
                  Last used
                </p>
                <p className="font-semibold text-white">{lastUsedId}</p>
              </div>
              <button
                type="button"
                onClick={handleUseLastId}
                className="btn-ghost text-sm"
              >
                Use Different ID
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={!inputUserId.trim() || !isValidUserId(inputUserId)}
            className="btn-primary w-full"
          >
            Continue
            <FaArrowRight className="w-5 h-5 ml-2 inline" />
          </button>
        </form>
      </div>
    </div>
  );
};
