import { useEffect, useState } from "react";
import { buscarAlertasUtilizacao } from "@entities/motorista";
import type { AlertaUtilizacao } from "@entities/motorista";
import { podeVerAlertasUtilizacao, useSessao } from "@entities/sessao";

export function useAlertasUtilizacao(): AlertaUtilizacao[] {
  const { usuario } = useSessao();
  const habilitado =
    usuario !== null && podeVerAlertasUtilizacao(usuario.perfil);
  const [alertas, setAlertas] = useState<AlertaUtilizacao[]>([]);
  const [atualizacao, setAtualizacao] = useState(0);

  useEffect(() => {
    function atualizarAoRetornar() {
      if (document.visibilityState === "visible") {
        setAtualizacao((valor) => valor + 1);
      }
    }

    window.addEventListener("focus", atualizarAoRetornar);
    document.addEventListener("visibilitychange", atualizarAoRetornar);

    return () => {
      window.removeEventListener("focus", atualizarAoRetornar);
      document.removeEventListener("visibilitychange", atualizarAoRetornar);
    };
  }, []);

  useEffect(() => {
    if (!habilitado) return;

    const controller = new AbortController();

    buscarAlertasUtilizacao(controller.signal)
      .then(setAlertas)
      .catch(() => {
        if (!controller.signal.aborted) setAlertas([]);
      });

    return () => controller.abort();
  }, [habilitado, atualizacao]);

  return habilitado ? alertas : [];
}
