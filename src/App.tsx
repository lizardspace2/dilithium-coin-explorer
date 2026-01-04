import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BlockPage from "./pages/BlockPage";
import TransactionPage from "./pages/TransactionPage";
import AddressPage from "./pages/AddressPage";
import BlocksListPage from "./pages/BlocksListPage";
import TransactionsListPage from "./pages/TransactionsListPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/block/:id" element={<BlockPage />} />
          <Route path="/tx/:id" element={<TransactionPage />} />
          <Route path="/address/:id" element={<AddressPage />} />
          <Route path="/blocks" element={<BlocksListPage />} />
          <Route path="/transactions" element={<TransactionsListPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
