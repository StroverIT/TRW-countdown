// PWA Service for handling offline functionality and app installation
export class PWAService {
  private static instance: PWAService;
  private deferredPrompt: any = null;
  private isInstalled = false;

  static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  constructor() {
    this.setupInstallPrompt();
    this.checkInstallationStatus();
  }

  // Setup install prompt for PWA installation
  private setupInstallPrompt(): void {
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("PWA: Install prompt triggered");
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
      // Update UI to notify the user they can install the PWA
      this.showInstallButton();
    });

    // Listen for successful installation
    window.addEventListener("appinstalled", () => {
      console.log("PWA: App was installed");
      this.isInstalled = true;
      this.hideInstallButton();
      this.deferredPrompt = null;
    });
  }

  // Check if the app is already installed
  private checkInstallationStatus(): void {
    // Check if running in standalone mode (installed)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      this.isInstalled = true;
      console.log("PWA: Running in standalone mode");
    }

    // Check for iOS Safari
    if ((window.navigator as any).standalone === true) {
      this.isInstalled = true;
      console.log("PWA: Running on iOS as standalone");
    }
  }

  // Show install button in UI
  private showInstallButton(): void {
    // Dispatch custom event to notify React components
    window.dispatchEvent(new CustomEvent("pwa-install-available"));
  }

  // Hide install button
  private hideInstallButton(): void {
    window.dispatchEvent(new CustomEvent("pwa-install-hidden"));
  }

  // Prompt user to install the PWA
  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log("PWA: No install prompt available");
      return false;
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await this.deferredPrompt.userChoice;

      console.log(`PWA: User response to install prompt: ${outcome}`);

      // Clear the deferred prompt
      this.deferredPrompt = null;

      return outcome === "accepted";
    } catch (error) {
      console.error("PWA: Error prompting install", error);
      return false;
    }
  }

  // Check if PWA can be installed
  canInstall(): boolean {
    return !!this.deferredPrompt && !this.isInstalled;
  }

  // Check if PWA is installed
  isAppInstalled(): boolean {
    return this.isInstalled;
  }

  // Register service worker
  async registerServiceWorker(): Promise<boolean> {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log(
          "PWA: Service worker registered successfully",
          registration
        );
        return true;
      } catch (error) {
        console.error("PWA: Service worker registration failed", error);
        return false;
      }
    }
    return false;
  }

  // Check if service worker is supported
  isServiceWorkerSupported(): boolean {
    return "serviceWorker" in navigator;
  }

  // Check if app is running offline
  isOffline(): boolean {
    return !navigator.onLine;
  }

  // Listen for online/offline status changes
  onConnectionChange(callback: (isOnline: boolean) => void): () => void {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Return cleanup function
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }

  // Get PWA installation info
  getInstallationInfo(): {
    canInstall: boolean;
    isInstalled: boolean;
    isOffline: boolean;
    hasServiceWorker: boolean;
  } {
    return {
      canInstall: this.canInstall(),
      isInstalled: this.isAppInstalled(),
      isOffline: this.isOffline(),
      hasServiceWorker: this.isServiceWorkerSupported(),
    };
  }
}

// Export singleton instance
export const pwaService = PWAService.getInstance();
