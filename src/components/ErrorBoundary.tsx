import { Component, type ErrorInfo, type ReactNode } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError && this.state.error) {
      const isFirebaseError =
        this.state.error.message.includes("Firebase") ||
        this.state.error.message.includes("environment variables");

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-neutral-900 to-neutral-950">
          <div className="max-w-2xl w-full bg-neutral-800 rounded-2xl p-8 shadow-2xl border border-red-500/20">
            <div className="text-center mb-6">
              <FaExclamationTriangle className="w-16 h-16 mx-auto text-red-400 mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                {isFirebaseError
                  ? "Firebase Configuration Error"
                  : "Application Error"}
              </h1>
              <p className="text-red-300 mb-6">{this.state.error.message}</p>
            </div>

            {isFirebaseError && (
              <>
                <div className="bg-neutral-900 rounded-xl p-6 mb-6">
                  <h2 className="text-xl font-semibold text-white mb-3">
                    Setup Instructions:
                  </h2>
                  <ol className="text-white/80 space-y-2 list-decimal list-inside">
                    <li>
                      Create a{" "}
                      <code className="bg-neutral-800 px-2 py-1 rounded text-primary-400">
                        .env
                      </code>{" "}
                      file in the project root
                    </li>
                    <li>
                      Add your Firebase credentials from the Firebase Console
                    </li>
                    <li>
                      Restart the development server (
                      <code className="bg-neutral-800 px-2 py-1 rounded text-primary-400">
                        npm run dev
                      </code>
                      )
                    </li>
                  </ol>
                </div>

                <div className="bg-neutral-900 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    .env file template:
                  </h3>
                  <pre className="bg-neutral-950 p-4 rounded text-sm text-green-400 overflow-x-auto">
                    {`VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id`}
                  </pre>
                </div>

                <div className="text-center">
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-semibold"
                  >
                    Open Firebase Console
                  </a>
                </div>
              </>
            )}

            {!isFirebaseError && (
              <div className="text-center">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-semibold"
                >
                  Reload Page
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
