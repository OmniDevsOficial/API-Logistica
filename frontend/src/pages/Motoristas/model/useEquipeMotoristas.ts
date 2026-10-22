import { useCallback, useEffect, useState } from "react";
import { buscarEquipeMotoristas } from "@entities/motorista";
import type { EquipeMotoristasData, StatusEquipe } from "@entities/motorista";

export function useEquipeMotoristas(filtro: StatusEquipe | null) {
  const [dados, setDados] = useState<EquipeMotoristasData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        const resultado = await buscarEquipeMotoristas(
          filtro,
          controller.signal,
        );
        setDados(resultado);
      } catch (erroCarregamento) {
        if (controller.signal.aborted) return;
        setErro(
          erroCarregamento instanceof Error
            ? erroCarregamento.message
            : "Ocorreu um erro ao carregar os motoristas.",
        );
        setDados(null);
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    void carregar();
    return () => controller.abort();
  }, [filtro, versao]);

  const recarregar = useCallback(() => setVersao((valor) => valor + 1), []);

  return { dados, carregando, erro, recarregar };
}
