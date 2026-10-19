import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "@pages/Dashboard";
import { LoginPage } from "@pages/Login";
import { ViagensPage } from "@pages/Viagens";
import { MotoristasPage, UtilizacaoMotoristasPage } from "@/pages/Motoristas";
import { RotaProtegida } from "./RotaProtegida";
import { RotaPublica } from "./RotaPublica";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RotaPublica />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<RotaProtegida />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/motoristas" element={<MotoristasPage />} />
          <Route path="/motoristas/utilizacao" element={<UtilizacaoMotoristasPage />} />
          <Route path="/viagens" element={<ViagensPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
