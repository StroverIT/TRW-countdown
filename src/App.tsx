import { useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { UserIDView } from "./components/UserIDView";
import { ContentView } from "./components/ContentView";
import { UserIDProvider, useUserID } from "./hooks/useUserID";

function AppContent() {
  const { userId } = useUserID();
  const [showUserIdChange, setShowUserIdChange] = useState(false);

  const handleUserIdChange = () => {
    setShowUserIdChange(true);
  };

  const handleUserIdChangeComplete = () => {
    setShowUserIdChange(false);
  };

  return (
    <div className="App">
      {!userId || showUserIdChange ? (
        <UserIDView onContinue={handleUserIdChangeComplete} />
      ) : (
        <ContentView onUserIdChange={handleUserIdChange} />
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <UserIDProvider>
        <AppContent />
      </UserIDProvider>
    </ErrorBoundary>
  );
}

export default App;
