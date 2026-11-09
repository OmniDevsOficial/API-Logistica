import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { RankingMotorista } from "@entities/motorista";
import { Sidebar } from "@widgets/sidebar";
import { RankingList } from "@widgets/ranking-list";
import { RankingPodium } from "@widgets/ranking-podium";
import { SinoNotificacoes } from "@features/alerta-utilizacao";
import {
  NavegacaoPeriodo,
  deslocarReferencia,
  intervaloDoPeriodo,
  podeAvancarPeriodo,
} from "@features/period-filter";
import { PageHeader } from "@shared/ui";
import { distribuirRanking } from "../lib/distribuirRanking";
import { rotuloMes } from "../lib/rotuloMes";
import { useRankingMotoristas } from "../model/useRankingMotoristas";

const MENSAGEM_CLASS =
  "rounded-md bg-surface p-6 text-center text-sm text-fg-subtle";

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
  // Padrão do filtro é o mês atual, como no dashboard.
  const [referencia, setReferencia] = useState(() => new Date());

  const intervalo = useMemo(
    () => intervaloDoPeriodo("mes", referencia),
    [referencia],
  );
  const { dados, carregando, erro, recarregar } = useRankingMotoristas(
    intervalo.dataInicio,
    intervalo.dataFim,
  );

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
            notificacoes={<SinoNotificacoes />}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

            {/* Seletor de mês reaproveitado do dashboard. */}
            <NavegacaoPeriodo
              label={rotuloMes(referencia)}
              podeAvancar={podeAvancarPeriodo("mes", referencia)}
              onAnterior={() =>
                setReferencia(deslocarReferencia("mes", referencia, -1))
              }
              onSeguinte={() =>
                setReferencia(deslocarReferencia("mes", referencia, 1))
              }
              periodo="mes"
              referencia={referencia}
              onSelecionarData={setReferencia}
            />
          </div>
        </header>

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
        ) : carregando ? (
          <p role="status" className={MENSAGEM_CLASS}>
            Carregando ranking...
          </p>
        ) : dados && dados.length === 0 ? (
          <p role="status" className={MENSAGEM_CLASS}>
            Sem viagens neste mês
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            <RankingPodium podio={podioVisivel} />
            {/* Com 3 motoristas ou menos não há lista: só o pódio. */}
            {lista.length > 0 && <RankingList motoristas={listaVisivel} />}
          </div>
        )}
      </main>
    </div>
  );
}
