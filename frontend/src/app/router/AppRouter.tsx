import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "@pages/Dashboard";
import { ViagensPage } from "@pages/Viagens";
import { MotoristasPage } from "@/pages/Motoristas";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/motoristas" element={<MotoristasPage />} />
        <Route path="/viagens" element={<ViagensPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
