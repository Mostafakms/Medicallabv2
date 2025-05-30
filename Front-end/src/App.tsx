
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Patients from "./pages/Patients";
import Samples from "./pages/Samples";
import Tests from "./pages/Tests";
import Results from "./pages/Results";
import Billing from "./pages/Billing";
import Inventory from "./pages/Inventory";
import Staff from "./pages/Staff";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="samples" element={<Samples />} />
            <Route path="tests" element={<Tests />} />
            <Route path="results" element={<Results />} />
            <Route path="billing" element={<Billing />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="staff" element={<Staff />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
