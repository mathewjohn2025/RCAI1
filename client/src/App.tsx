import { RouterProvider } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/error-boundary";
import { useEffect } from "react";
import { router } from "./router";
import { installFetchTrap } from "@/lib/fetch-trap";
import "@/dev/admin-trap"; // Step 9: Dev trap for unauthorized admin calls

function App() {
  useEffect(() => {
    // SPECIFICATION: Install global fetch trap for unauthorized calls
    installFetchTrap();
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