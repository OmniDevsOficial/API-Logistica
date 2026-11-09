import type { RankingColocacao } from "@entities/motorista";
import { ValorMonetario } from "@entities/sessao";
import { formatCurrencyBRL, formatFrequencia } from "@shared/lib";

interface RankingPodiumProps {
  /** Os 3 primeiros colocados, em ordem de posição (1º, 2º, 3º). */
  podio: RankingColocacao[];
  /** US17: abre o modal de detalhes do motorista. Sem ele o card não é clicável. */
  onMotoristaClick?: (motoristaId: number) => void;
}

/** Ordem visual do Figma na tela larga: 2º, 1º (centralizado e mais alto) e 3º.
 *  No celular a pilha mantém a ordem natural (1º, 2º, 3º). */
const ORDEM_DESKTOP: Record<number, string> = {
  1: "sm:order-2",
  2: "sm:order-1",
  3: "sm:order-3",
};

const CARTAO_BASE =
  "flex w-full flex-col items-center justify-center rounded-lg bg-surface px-6 text-center";

interface CardPodiumProps {
  colocacao: RankingColocacao;
  primeiro: boolean;
  onMotoristaClick?: (motoristaId: number) => void;
}

function CardPodium({ colocacao, primeiro, onMotoristaClick }: CardPodiumProps) {
  const { posicao, motorista } = colocacao;
  const id = motorista.motoristaId;
  const espacamento = primeiro ? "gap-2 py-9" : "gap-1.5 py-7";

  const frequencia =
    motorista.frequencia === null
      ? "—"
      : `${formatFrequencia(motorista.frequencia)} Frequência`;

  const temFinanceiro =
    motorista.frete !== null || motorista.custos !== null;

  const conteudo = (
    <>
      <span className="text-xs text-fg">{`${posicao}º Lugar`}</span>
      <span
        className={`font-semibold text-fg ${primeiro ? "text-lg" : "text-[15px]"}`}
      >
        {motorista.nome}
      </span>
      {primeiro && motorista.veiculo && (
        <span className="text-xs text-fg-subtle">{motorista.veiculo}</span>
      )}

      <ValorMonetario
        className={`font-bold text-success ${
          primeiro ? "text-[32px] tracking-[-0.5px]" : "text-[26px]"
        }`}
      >
        {motorista.rentabilidadeMedia === null
          ? null
          : formatCurrencyBRL(motorista.rentabilidadeMedia, 2)}
      </ValorMonetario>

      <span className="flex flex-wrap items-center justify-center gap-x-4 text-xs font-semibold text-fg">
        <span>{motorista.viagens} Viagens</span>
        <span>{frequencia}</span>
      </span>

      {temFinanceiro && (
        <span className="flex flex-wrap items-center justify-center gap-x-3 text-[11px] text-fg-subtle">
          {motorista.frete !== null && (
            <span>{`Frete: ${formatCurrencyBRL(motorista.frete, 0)}`}</span>
          )}
          {motorista.custos !== null && (
            <span>{`Custos: ${formatCurrencyBRL(motorista.custos, 0)}`}</span>
          )}
        </span>
      )}
    </>
  );

  if (onMotoristaClick && id !== null) {
    const motoristaId = id;
    return (
      <button
        type="button"
        className={`${CARTAO_BASE} ${espacamento} w-full cursor-pointer transition-colors hover:bg-background`}
        onClick={() => onMotoristaClick(motoristaId)}
      >
        {conteudo}
      </button>
    );
  }

  return <div className={`${CARTAO_BASE} ${espacamento}`}>{conteudo}</div>;
}

/**
 * Pódio do mês: os 3 primeiros colocados com nome e rentabilidade média.
 * Com menos de 3 motoristas só as posições existentes são renderizadas.
 */
export function RankingPodium({ podio, onMotoristaClick }: RankingPodiumProps) {
  if (podio.length === 0) return null;

  return (
    <section aria-label="Pódio do mês" className="mx-auto w-full max-w-4xl">
      {/* Com menos de 3 posições as cartas crescem até o limite e ficam centralizadas. */}
      <ol className="flex flex-col gap-5 sm:flex-row sm:justify-center">
        {podio.map((colocacao) => (
          <li
            key={colocacao.posicao}
            className={`flex items-center sm:max-w-[300px] sm:flex-1 ${ORDEM_DESKTOP[colocacao.posicao] ?? ""}`}
          >
            <CardPodium
              colocacao={colocacao}
              primeiro={colocacao.posicao === 1}
              onMotoristaClick={onMotoristaClick}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
