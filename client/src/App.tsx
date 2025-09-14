import { RouterProvider } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/error-boundary";
import { useEffect } from "react";
import { initVersionManagement } from "@/lib/version-manager";
import { router } from "./router";
import { installFetchTrap } from "@/lib/fetch-trap";
import "@/dev/admin-trap"; // Step 9: Dev trap for unauthorized admin calls

function App() {
  // Initialize bulletproof caching solution
  useEffect(() => {
    initVersionManagement().catch(console.error);
    
    // SPECIFICATION: Install global fetch trap for unauthorized calls
    installFetchTrap();
    
    // DEV-ONLY: Clear old caches 
    if (import.meta.env.DEV) {
      queryClient.clear();
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
      }
    }
  }, []);
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;