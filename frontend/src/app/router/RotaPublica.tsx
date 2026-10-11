import { Navigate, Outlet, useLocation } from "react-router-dom";
import { podeAcessar, rotaInicial, useSessao } from "@entities/sessao";

export function RotaPublica() {
  const { usuario } = useSessao();
  const location = useLocation();

  if (!usuario) return <Outlet />;

  const estado = location.state as { de?: unknown } | null;
  const rotaPedida = typeof estado?.de === "string" ? estado.de : null;
  const destino =
    rotaPedida && podeAcessar(usuario.perfil, rotaPedida)
      ? rotaPedida
      : rotaInicial(usuario.perfil);

  return <Navigate to={destino} replace />;
}
