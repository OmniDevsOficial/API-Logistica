import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  encerrarSessao,
  podeAcessar,
  rotaInicial,
  useSessao,
} from "@entities/sessao";

const ESPERA_MAXIMA_MS = 2_147_483_647;

export function RotaProtegida() {
  const { usuario } = useSessao();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!usuario) return;

    const espera = usuario.expiraEm - Date.now();
    if (espera > ESPERA_MAXIMA_MS) return;

    const temporizador = setTimeout(encerrarSessao, espera);
    return () => clearTimeout(temporizador);
  }, [usuario]);

  if (!usuario) {
    return <Navigate to="/login" replace state={{ de: pathname }} />;
  }

  if (!podeAcessar(usuario.perfil, pathname)) {
    return <Navigate to={rotaInicial(usuario.perfil)} replace />;
  }

  return <Outlet />;
}
