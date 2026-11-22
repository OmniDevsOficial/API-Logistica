import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { FiltroRanking, RankingMotorista } from "@entities/motorista";
import { faturamentoDoMotorista, indexarFaturamento } from "@entities/motorista";
import { podeVerValoresMonetarios, useSessao } from "@entities/sessao";
import { formatDateRange, formatTipoVeiculo } from "@shared/lib";
import { Sidebar } from "@widgets/sidebar";
import { RankingList } from "@widgets/ranking-list";
import { RankingPodium } from "@widgets/ranking-podium";
import { RankingTopbar } from "@widgets/ranking-topbar";
import { ModalHistoricoViagens } from "@features/historico-viagens";
import {
  deslocarReferencia,
  intervaloDoPeriodo,
  podeAvancarPeriodo,
  usePeriodoSalvo,
  type PeriodoSalvo,
} from "@features/period-filter";
import { distribuirRanking } from "../lib/distribuirRanking";
import { useRankingMotoristas } from "../model/useRankingMotoristas";
import { usePagamentoMotoristas } from "../model/usePagamentoMotoristas";
import { FiltroRanking as FiltroRankingButton } from "./FiltroRanking";

interface MotoristaSelecionado {
  id: number;
  nome: string;
}

const MENSAGEM_CLASS =
  "rounded-md bg-surface p-6 text-center text-sm text-fg-subtle";
const FILTROS_VALIDOS: FiltroRanking[] = ["RENTABILIDADE", "FATURAMENTO", "VIAGENS", "TIPO_VEICULO"];
const PILL_CLASS =
  "flex items-center gap-2 whitespace-nowrap rounded-md bg-surface px-4 py-2.5 text-sm font-medium text-fg";

/** Busca por nome, CPF, veículo, placa ou telefone, sem acento nem caixa. */
function combinaComABusca(motorista: RankingMotorista, termo: string): boolean {
  if (!termo) return true;

  return [
    motorista.nome,
    motorista.cpf ?? "",
    motorista.veiculo ?? "",
    motorista.placa ?? "",
    motorista.telefone ?? "",
  ].some((campo) => campo.toLowerCase().includes(termo));
}

/**
 * Ranking de motoristas (gamificação): pódio com os 3 primeiros e
 * lista com os demais, filtrados pelo período escolhido.
 */
export function RankingPage() {
  const periodoSalvo = usePeriodoSalvo("ranking");
  if (!periodoSalvo.pronto) return null;
  return <RankingConteudo periodoSalvo={periodoSalvo} />;
}

function RankingConteudo({ periodoSalvo }: { periodoSalvo: PeriodoSalvo }) {
  const { periodo, setPeriodo, referencia, setReferencia } = periodoSalvo;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [motoristaHistorico, setMotoristaHistorico] =
    useState<MotoristaSelecionado | null>(null);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const filtroParam = searchParams.get("filtro");
  const tipoParam = searchParams.get("tipoVeiculo");
  const filtro: FiltroRanking = FILTROS_VALIDOS.includes(filtroParam as FiltroRanking)
    && (filtroParam !== "TIPO_VEICULO" || Boolean(tipoParam))
    ? filtroParam as FiltroRanking
    : "RENTABILIDADE";
  const tipoVeiculo = filtro === "TIPO_VEICULO" ? tipoParam : null;
  const { dataInicio, dataFim } = intervaloDoPeriodo(periodo, referencia);
  const { dados, tiposDisponiveis, carregando, erro, recarregar } = useRankingMotoristas(
    dataInicio,
    dataFim,
    filtro,
    tipoVeiculo ?? undefined,
  );

  // O valor a pagar é um dado separado, disponível apenas para Gestores.
  const { usuario } = useSessao();
  const ehGestor = usuario !== null && podeVerValoresMonetarios(usuario.perfil);
  const pagamentos = usePagamentoMotoristas(dataInicio, dataFim, ehGestor);
  const indiceFaturamento = useMemo(
    () => indexarFaturamento(pagamentos.dados ?? []),
    [pagamentos.dados],
  );
  const faturamentoDe = useCallback(
    (motorista: RankingMotorista) => faturamentoDoMotorista(indiceFaturamento, motorista),
    [indiceFaturamento],
  );

  const atualizarFiltro = (novoFiltro: FiltroRanking, novoTipo: string | null) => {
    setSearchParams((atuais) => {
      const proximos = new URLSearchParams(atuais);
      proximos.set("filtro", novoFiltro);
      if (novoFiltro === "TIPO_VEICULO" && novoTipo) proximos.set("tipoVeiculo", novoTipo);
      else proximos.delete("tipoVeiculo");
      return proximos;
    }, { replace: true });
  };

  const { podio, lista } = useMemo(
    () => distribuirRanking(dados ?? []),
    [dados],
  );

  const termo = busca.trim().toLowerCase();
  // A posição vem do ranking completo: a busca só decide o que fica visível.
  const podioVisivel = useMemo(
    () => podio.filter(({ motorista }) => combinaComABusca(motorista, termo)),
    [podio, termo],
  );
  const listaVisivel = useMemo(
    () => lista.filter(({ motorista }) => combinaComABusca(motorista, termo)),
    [lista, termo],
  );

  function abrirHistorico(motoristaId: number) {
    const motorista = dados?.find((item) => item.motoristaId === motoristaId);
    setMotoristaHistorico({ id: motoristaId, nome: motorista?.nome ?? "" });
    setHistoricoAberto(true);
  }

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar">
        <RankingTopbar
          search={busca}
          onSearchChange={setBusca}
          period={periodo}
          onPeriodChange={setPeriodo}
          dateRangeLabel={formatDateRange(dataInicio, dataFim)}
          podeAvancar={podeAvancarPeriodo(periodo, referencia)}
          onPeriodoAnterior={() => setReferencia(deslocarReferencia(periodo, referencia, -1))}
          onPeriodoSeguinte={() => setReferencia(deslocarReferencia(periodo, referencia, 1))}
          referencia={referencia}
          onSelecionarData={setReferencia}
          onMenuClick={() => setSidebarOpen(true)}
          filtro={
            <FiltroRankingButton
              filtro={filtro}
              tipoVeiculo={tipoVeiculo}
              tiposDisponiveis={tiposDisponiveis}
              onChange={atualizarFiltro}
              buttonClassName={PILL_CLASS}
            />
          }
        />

        {ehGestor && pagamentos.erro && (
          <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md bg-surface px-4 py-3 text-sm text-fg-subtle">
            <span>{pagamentos.erro}</span>
            <button type="button" onClick={pagamentos.recarregar} className="cursor-pointer rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-dark">
              Tentar de novo
            </button>
          </div>
        )}

        {erro ? (
          <div role="alert" className={MENSAGEM_CLASS}>
            <p>{erro}</p>
            <button
              type="button"
              onClick={recarregar}
              className="mt-3 cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Tentar de novo
            </button>
          </div>
        ) : carregando && dados === null ? (
          <p role="status" className={MENSAGEM_CLASS}>
            Carregando ranking...
          </p>
        ) : dados && dados.length === 0 ? (
          <div role="status" className={MENSAGEM_CLASS}>
            <p>{filtro === "TIPO_VEICULO"
              ? `Nenhum motorista com viagens de ${formatTipoVeiculo(tipoVeiculo) ?? tipoVeiculo} neste período`
              : "Sem viagens neste período"}</p>
            {filtro === "TIPO_VEICULO" && (
              <button type="button" onClick={() => atualizarFiltro("RENTABILIDADE", null)}
                className="mt-3 cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark">
                Limpar filtro
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {carregando && <p role="status" className="text-sm text-fg-muted">Atualizando ranking...</p>}
            <RankingPodium
              podio={podioVisivel}
              faturamentoDe={ehGestor ? faturamentoDe : undefined}
              filtroAtivo={filtro}
              onMotoristaClick={abrirHistorico}
            />
            {/* Com 3 motoristas ou menos não há lista: só o pódio. */}
            {lista.length > 0 && (
              <RankingList
                motoristas={listaVisivel}
                faturamentoDe={ehGestor ? faturamentoDe : undefined}
                filtroAtivo={filtro}
                onMotoristaClick={abrirHistorico}
              />
            )}
          </div>
        )}

        <ModalHistoricoViagens
          motoristaId={motoristaHistorico?.id ?? null}
          nome={motoristaHistorico?.nome ?? ""}
          open={historicoAberto}
          onClose={() => setHistoricoAberto(false)}
        />
      </main>
    </div>
  );
}
