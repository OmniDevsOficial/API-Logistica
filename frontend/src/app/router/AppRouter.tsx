import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "@pages/Dashboard";
import { ViagensPage } from "@pages/Viagens";
import { MotoristasPage } from "@/pages/Motoristas";
import { EquipeMotoristasPage } from "@pages/EquipeMotoristas";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/motoristas" element={<EquipeMotoristasPage />} />
        <Route path="/motoristas/utilizacao" element={<MotoristasPage />} />
        <Route path="/viagens" element={<ViagensPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
