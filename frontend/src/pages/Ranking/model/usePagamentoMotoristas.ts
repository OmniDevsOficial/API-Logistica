import { useCallback, useEffect, useState } from "react";
import { buscarPagamentoMotoristas } from "@entities/motorista";
import type { PagamentoMotorista } from "@entities/motorista";

/**
 * Valor a pagar por motorista no mês (AAAA-MM). Só consulta quando
 * `habilitado` (perfil Gestor); a falha fica isolada e não derruba o ranking.
 */
export function usePagamentoMotoristas(mes: string, habilitado: boolean) {
  const [dados, setDados] = useState<PagamentoMotorista[] | null>(null);
  const [carregando, setCarregando] = useState(habilitado);
  const [erro, setErro] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    if (!habilitado) return;

    const controller = new AbortController();

    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        setDados(await buscarPagamentoMotoristas(mes, controller.signal));
      } catch (erroCarregamento) {
        if (controller.signal.aborted) return;
        setErro(
          erroCarregamento instanceof Error
            ? erroCarregamento.message
            : "Não foi possível carregar o faturamento dos motoristas.",
        );
        setDados(null);
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    void carregar();
    return () => controller.abort();
  }, [mes, habilitado, versao]);

  const recarregar = useCallback(() => setVersao((valor) => valor + 1), []);

  return { dados, carregando, erro, recarregar };
}
