import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import Auth from "./pages/Auth";
import Home from './pages/Home';
import CadastroUsuario from "./pages/Profile";
import Gamificacao from "./pages/Gamificacao";
import Score from "./pages/Score";
import Perfil from "./pages/Perfil";
import EducacaoFinanceira from "./pages/EducacaoFinanceira";
import Cursos from "./pages/Cursos";
import Credit from "./pages/Credit";
import { AuthProvider } from "./context/AuthContext";
import AuthRoute from "./components/AuthRoute";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path='/auth' element={<AuthRoute> <Auth /> </AuthRoute>} />
          <Route path="/credit" element={<Credit />} />
          <Route path="*" element={<NotFound />} />
          <Route path='/home' element={<ProtectedRoute> <Home /> </ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute> <CadastroUsuario /> </ProtectedRoute>} />
          <Route path="/gamificacao" element={<ProtectedRoute> <Gamificacao /> </ProtectedRoute>} />
          <Route path="/score" element={<ProtectedRoute> <Score /> </ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute> <Perfil /> </ProtectedRoute>} />
          <Route path="/educacao" element={<ProtectedRoute> <EducacaoFinanceira /> </ProtectedRoute>} />
          <Route path="/cursos" element={<ProtectedRoute> <Cursos /> </ProtectedRoute>} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
