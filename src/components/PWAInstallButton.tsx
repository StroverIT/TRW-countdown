import React, { useState, useEffect } from "react";
import { pwaService } from "../services/pwaService";
import { FaDownload, FaCheck, FaWifi } from "react-icons/fa";

interface PWAInstallButtonProps {
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = "",
}) => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check initial state
    const info = pwaService.getInstallationInfo();
    setCanInstall(info.canInstall);
    setIsInstalled(info.isInstalled);
    setIsOffline(info.isOffline);

    // Listen for install prompt availability
    const handleInstallAvailable = () => {
      setCanInstall(true);
    };

    const handleInstallHidden = () => {
      setCanInstall(false);
      setIsInstalled(true);
    };

    // Listen for connection changes
    const cleanupConnection = pwaService.onConnectionChange((isOnline) => {
      setIsOffline(!isOnline);
    });

    window.addEventListener("pwa-install-available", handleInstallAvailable);
    window.addEventListener("pwa-install-hidden", handleInstallHidden);

    return () => {
      window.removeEventListener(
        "pwa-install-available",
        handleInstallAvailable
      );
      window.removeEventListener("pwa-install-hidden", handleInstallHidden);
      cleanupConnection();
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await pwaService.promptInstall();
      console.log("success", success);
      if (success) {
        setIsInstalled(true);
        setCanInstall(false);
      }
    } catch (error) {
      console.error("Failed to install PWA:", error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return (
      <div className={`flex items-center gap-2 text-green-400 ${className}`}>
        <FaCheck className="w-4 h-4" />
        <span className="text-sm">App Installed</span>
      </div>
    );
  }

  // Don't show install button if can't install
  if (!canInstall) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Connection Status */}
      <div className="flex items-center gap-1 text-xs">
        {isOffline ? (
          <>
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-red-400">Offline</span>
          </>
        ) : (
          <>
            <FaWifi className="w-3 h-3 text-green-400" />
            <span className="text-green-400">Online</span>
          </>
        )}
      </div>

      {/* Install Button */}
      <button
        onClick={handleInstall}
        disabled={isInstalling}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-2 rounded-lg text-sm inline-flex items-center gap-2 transition-colors"
      >
        <FaDownload className="w-4 h-4" />
        {isInstalling ? "Installing..." : "Install App"}
      </button>
    </div>
  );
};
