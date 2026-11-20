import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import type { FiltroRanking, RankingMotorista } from "@entities/motorista";
import { faturamentoDoMotorista, indexarFaturamento } from "@entities/motorista";
import { podeVerValoresMonetarios, useSessao } from "@entities/sessao";
import { formatTipoVeiculo } from "@shared/lib";
import { Sidebar } from "@widgets/sidebar";
import { RankingList } from "@widgets/ranking-list";
import { RankingPodium } from "@widgets/ranking-podium";
import { SinoNotificacoes } from "@features/alerta-utilizacao";
import {
  NavegacaoPeriodo,
  deslocarReferencia,
  podeAvancarPeriodo,
} from "@features/period-filter";
import { PageHeader } from "@shared/ui";
import { distribuirRanking } from "../lib/distribuirRanking";
import { mesDaReferencia, rotuloMes } from "../lib/rotuloMes";
import { useRankingMotoristas } from "../model/useRankingMotoristas";
import { usePagamentoMotoristas } from "../model/usePagamentoMotoristas";
import { FiltroRanking as FiltroRankingButton } from "./FiltroRanking";
import { MenuPerfil } from "@features/menu-perfil";

const MENSAGEM_CLASS =
  "rounded-md bg-surface p-6 text-center text-sm text-fg-subtle";
const FILTROS_VALIDOS: FiltroRanking[] = ["RENTABILIDADE", "FATURAMENTO", "VIAGENS", "TIPO_VEICULO"];

function dataDoMes(valor: string | null): Date | null {
  if (!valor || !/^\d{4}-\d{2}$/.test(valor)) return null;
  const [ano, mes] = valor.split("-").map(Number);
  if (ano < 1900 || mes < 1 || mes > 12) return null;
  const referencia = new Date(ano, mes - 1, 1);
  const atual = new Date();
  if (referencia > new Date(atual.getFullYear(), atual.getMonth(), 1)) return null;
  return referencia;
}

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
 * Ranking mensal de motoristas (gamificação): pódio com os 3 primeiros e
 * lista com os demais, filtrados pelo mês escolhido.
 */
export function RankingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const filtroParam = searchParams.get("filtro");
  const tipoParam = searchParams.get("tipoVeiculo");
  const filtro: FiltroRanking = FILTROS_VALIDOS.includes(filtroParam as FiltroRanking)
    && (filtroParam !== "TIPO_VEICULO" || Boolean(tipoParam))
    ? filtroParam as FiltroRanking
    : "RENTABILIDADE";
  const tipoVeiculo = filtro === "TIPO_VEICULO" ? tipoParam : null;
  const referencia = dataDoMes(searchParams.get("mes")) ?? new Date();
  const mes = mesDaReferencia(referencia);
  useEffect(() => {
    const mesNaUrl = searchParams.get("mes");
    if (mesNaUrl && dataDoMes(mesNaUrl) === null) {
      setSearchParams((atuais) => {
        const proximos = new URLSearchParams(atuais);
        proximos.set("mes", mesDaReferencia(new Date()));
        return proximos;
      }, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const { dados, tiposDisponiveis, carregando, erro, recarregar } = useRankingMotoristas(
    mes,
    filtro,
    tipoVeiculo ?? undefined,
  );

  // O valor a pagar é um dado separado, disponível apenas para Gestores.
  const { usuario } = useSessao();
  const ehGestor = usuario !== null && podeVerValoresMonetarios(usuario.perfil);
  const pagamentos = usePagamentoMotoristas(mes, ehGestor);
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
      proximos.set("mes", mes);
      proximos.set("filtro", novoFiltro);
      if (novoFiltro === "TIPO_VEICULO" && novoTipo) proximos.set("tipoVeiculo", novoTipo);
      else proximos.delete("tipoVeiculo");
      return proximos;
    }, { replace: true });
  };

  const atualizarMes = (novaReferencia: Date) => {
    const novoMes = mesDaReferencia(novaReferencia);
    setSearchParams((atuais) => {
      const proximos = new URLSearchParams(atuais);
      proximos.set("mes", novoMes);
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

  // TODO(US17): quando o modal de detalhes existir, passar
  // onMotoristaClick={(motoristaId) => abrirDetalhes(motoristaId)} para o
  // pódio e para a lista. Enquanto isso o clique não faz nada.

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar">
        <header className="mb-7 flex flex-col gap-5">
          <PageHeader
            title="Ranking"
            onMenuClick={() => setSidebarOpen(true)}
            perfil={<MenuPerfil />}
            notificacoes={<SinoNotificacoes />}
          />

          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center gap-2 rounded-md bg-surface px-4 py-2.5 sm:w-[420px]">
              <Search size={16} className="shrink-0 text-fg-muted" />
              <input
                type="text"
                placeholder="Pesquisar"
                aria-label="Pesquisar motoristas"
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
                className="w-full min-w-0 bg-transparent text-sm text-fg placeholder-fg-subtle outline-none"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <FiltroRankingButton
                filtro={filtro}
                tipoVeiculo={tipoVeiculo}
                tiposDisponiveis={tiposDisponiveis}
                onChange={atualizarFiltro}
              />
              <NavegacaoPeriodo
                label={rotuloMes(referencia)}
                podeAvancar={podeAvancarPeriodo("mes", referencia)}
                onAnterior={() => atualizarMes(deslocarReferencia("mes", referencia, -1))}
                onSeguinte={() => atualizarMes(deslocarReferencia("mes", referencia, 1))}
                periodo="mes"
                referencia={referencia}
                onSelecionarData={atualizarMes}
              />
            </div>
          </div>
        </header>

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
              ? `Nenhum motorista com viagens de ${formatTipoVeiculo(tipoVeiculo) ?? tipoVeiculo} neste mês`
              : "Sem viagens neste mês"}</p>
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
            />
            {/* Com 3 motoristas ou menos não há lista: só o pódio. */}
            {lista.length > 0 && (
              <RankingList
                motoristas={listaVisivel}
                faturamentoDe={ehGestor ? faturamentoDe : undefined}
                filtroAtivo={filtro}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
