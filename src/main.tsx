import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

// Create a React Query client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <div className="flex justify-center items-center min-h-screen w-screen bg-gray-100">
      <App />
    </div>
    </QueryClientProvider>
  </React.StrictMode>
);
