import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import Auth from "./pages/Auth";
import Dash from './pages/Dash';
import CadastroUsuario from "./pages/Profile";
import Gamificacao from "./pages/Gamificacao";
import Score from "./pages/Score";
import Perfil from "./pages/Perfil";
import EducacaoFinanceira from "./pages/EducacaoFinanceira";
import Cursos from "./pages/Cursos";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path='/auth' element={<Auth />} />
          <Route path="*" element={<NotFound />} />
          <Route path='/dash' element={<Dash />}/>
          <Route path="/profile" element={<CadastroUsuario />} />
          <Route path="/dash/gamificacao" element={<Gamificacao />} />
          <Route path="/dash/score" element={<Score />} />
          <Route path="/dash/perfil" element={<Perfil />} />
          <Route path="/dash/educacao" element={<EducacaoFinanceira />} />
          <Route path="/dash/cursos" element={<Cursos />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
