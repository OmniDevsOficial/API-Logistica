import { useState } from "react";
import type { PeriodoFrota } from "@entities/veiculo";
import { FrotaOverview, FrotaTabela } from "@widgets/frota-overview";
import { useFrota } from "../model/useFrota";
import { useResumoFrota } from "../model/useResumoFrota";
import { useValorAdiado } from "../model/useValorAdiado";

interface PainelVeiculosProps {
  periodo: PeriodoFrota;
  versao: number;
}

const MENSAGEM_CLASS = "rounded-md bg-surface p-6 text-center text-sm text-fg-subtle";
const TAMANHO_PAGINA = 20;
const ATRASO_BUSCA_MS = 300;

export function PainelVeiculos({ periodo, versao }: PainelVeiculosProps) {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState<string | null>(null);
  const chavePeriodo = `${periodo.dataInicio}-${periodo.dataFim}`;
  const [paginacao, setPaginacao] = useState({ chave: chavePeriodo, pagina: 0 });
  const pagina = paginacao.chave === chavePeriodo ? paginacao.pagina : 0;
  const buscaAdiada = useValorAdiado(busca.trim(), ATRASO_BUSCA_MS);

  const resumo = useResumoFrota(periodo, versao);
  const frota = useFrota(
    { pagina, tamanho: TAMANHO_PAGINA, tipo, busca: buscaAdiada, ...periodo },
    versao,
  );

  function setPagina(proxima: number) {
    setPaginacao({ chave: chavePeriodo, pagina: proxima });
  }

  function aoBuscar(valor: string) {
    setBusca(valor);
    setPagina(0);
  }

  function aoFiltrarTipo(valor: string | null) {
    setTipo(valor);
    setPagina(0);
  }

  if (resumo.erro) {
    return (
      <p role="alert" className={MENSAGEM_CLASS}>
        {resumo.erro}
      </p>
    );
  }

  if (resumo.carregando && !resumo.dados) {
    return (
      <p role="status" className={MENSAGEM_CLASS}>
        Carregando veículos...
      </p>
    );
  }

  if (!resumo.dados) return null;

  return (
    <div className="flex flex-col gap-6">
      {!resumo.dados.possuiDados && (
        <p role="status" className={MENSAGEM_CLASS}>
          Nenhum veículo com viagem no período selecionado.
        </p>
      )}

      <FrotaOverview resumo={resumo.dados} />

      <FrotaTabela
        pagina={frota.dados}
        carregando={frota.carregando}
        erro={frota.erro}
        busca={busca}
        onBuscaChange={aoBuscar}
        tipo={tipo}
        onTipoChange={aoFiltrarTipo}
        tipos={resumo.dados.porTipo}
        onMudarPagina={setPagina}
      />
    </div>
  );
}
