import { useRef, useState } from "react";
import type { MotoristaEquipe, StatusEquipe } from "@entities/motorista";
import { StatusMotoristaBadge } from "@entities/motorista/ui/StatusMotoristaBadge";
import type { VeiculoResumo } from "@entities/veiculo";
import {
  formatCpf,
  formatDateOrToday,
  formatTipoVeiculo,
  totalDePaginas,
} from "@shared/lib";
import { Paginacao } from "@shared/ui";
import { ValorMonetario } from "@entities/sessao";

interface EquipeTabelaProps {
  motoristas: MotoristaEquipe[];
  rentabilidades: Map<string, number | null>;
  chaveNomeMotorista: (nome: string) => string;
  mostrarRentabilidade?: boolean;
  onStatusChange?: (id: number, novoStatus: StatusEquipe) => void;
  statusSalvando?: number | null;
  onMotoristaClick?: (motorista: MotoristaEquipe) => void;
}

const HEADER_CELL =
  "whitespace-nowrap py-3 pr-6 text-left text-xs font-semibold text-fg-muted";
const CELL = "py-4 pr-6 align-top";

const MOTORISTAS_POR_PAGINA = 20;

const LARGURAS_COM_RENTABILIDADE = ["18%", "16%", "14%", "14%", "8%", "15%", "15%"];
const LARGURAS_SEM_RENTABILIDADE = ["22%", "20%", "16%", "16%", "10%", "16%"];

const FORMATADOR_MOEDA = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function descreverVeiculo(veiculo: VeiculoResumo): string {
  return [veiculo.placa, veiculo.modelo, formatTipoVeiculo(veiculo.tipo)]
    .filter(Boolean)
    .join(" · ");
}

/**
 * Veículo principal (modelo · tipo e placa). Os demais veículos do motorista
 * ficam no selo "+N", com a lista completa no tooltip.
 */
function VeiculoCelula({ motorista }: { motorista: MotoristaEquipe }) {
  const titulo = [motorista.modelo, motorista.veiculo !== "-" ? motorista.veiculo : null]
    .filter(Boolean)
    .join(" · ");
  const outros = motorista.outrosVeiculos;
  const listaOutros = outros.map(descreverVeiculo).join("\n");

  return (
    <div className="flex flex-col">
      <span className="flex items-center gap-1.5 text-sm text-fg">
        <span className="min-w-0 truncate" title={titulo || undefined}>
          {titulo || "-"}
        </span>
        {outros.length > 0 && (
          <span
            className="shrink-0 cursor-default rounded-full bg-border px-1.5 text-xs font-medium text-fg-muted"
            title={listaOutros}
            aria-label={`Mais ${outros.length} ${outros.length === 1 ? "veículo" : "veículos"}: ${listaOutros.replaceAll("\n", "; ")}`}
          >
            +{outros.length}
          </span>
        )}
      </span>
      <span className="text-xs text-fg-muted">{motorista.placa}</span>
    </div>
  );
}

export function EquipeTabela({
  motoristas,
  rentabilidades,
  chaveNomeMotorista,
  mostrarRentabilidade = true,
  onStatusChange,
  statusSalvando = null,
  onMotoristaClick,
}: EquipeTabelaProps) {
  const tabelaRef = useRef<HTMLDivElement>(null);
  const [paginacao, setPaginacao] = useState({ lista: motoristas, pagina: 1 });
  const totalPaginas = totalDePaginas(motoristas.length, MOTORISTAS_POR_PAGINA);
  const pagina =
    paginacao.lista === motoristas ? Math.min(paginacao.pagina, totalPaginas) : 1;
  const inicio = (pagina - 1) * MOTORISTAS_POR_PAGINA;
  const motoristasDaPagina = motoristas.slice(inicio, inicio + MOTORISTAS_POR_PAGINA);
  const larguras = mostrarRentabilidade
    ? LARGURAS_COM_RENTABILIDADE
    : LARGURAS_SEM_RENTABILIDADE;

  function mudarPagina(novaPagina: number) {
    setPaginacao({ lista: motoristas, pagina: novaPagina });
    const tabela = tabelaRef.current;
    if (tabela && tabela.getBoundingClientRect().top < 0) {
      tabela.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div ref={tabelaRef} className="scroll-mt-6 overflow-hidden rounded-lg bg-surface">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-6 pt-5 pb-4">
        <h2 className="text-lg font-semibold text-fg">Equipe de motoristas</h2>
        {motoristas.length > 0 && (
          <p className="text-sm tabular-nums text-fg-subtle">
            {inicio + 1}–{inicio + motoristasDaPagina.length} de {motoristas.length}{" "}
            {motoristas.length === 1 ? "motorista" : "motoristas"}
          </p>
        )}
      </div>

      {motoristas.length === 0 ? (
        <p className="border-t border-border px-6 py-8 text-center text-sm text-fg-subtle">
          Nenhum motorista encontrado.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table
            className={`w-full table-fixed ${
              mostrarRentabilidade ? "min-w-[1000px]" : "min-w-[860px]"
            }`}
          >
            <colgroup>
              {larguras.map((largura, indice) => (
                <col key={indice} style={{ width: largura }} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-y border-border">
                <th className={`${HEADER_CELL} pl-6`}>Motorista</th>
                <th className={HEADER_CELL}>Veículo/Placa</th>
                <th className={HEADER_CELL}>Operação</th>
                <th className={HEADER_CELL}>Localização</th>
                <th className={HEADER_CELL}>Viagens</th>
                {mostrarRentabilidade && (
                  <th className={HEADER_CELL}>Rentabilidade média</th>
                )}
                <th className={`${HEADER_CELL} text-right`}>Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {motoristasDaPagina.map((motorista) => {
                const cpf = formatCpf(motorista.cpf);
                const rentabilidade = rentabilidades.get(
                  chaveNomeMotorista(motorista.nome),
                );
                const selecionar = onMotoristaClick
                  ? () => onMotoristaClick(motorista)
                  : undefined;

                return (
                  <tr
                    key={motorista.id}
                    onClick={selecionar}
                    className={selecionar ? "cursor-pointer hover:bg-background" : undefined}
                  >
                    {/* Motorista — nome com o documento logo abaixo */}
                    <td className={`${CELL} pl-6`}>
                      <div className="flex flex-col">
                        {selecionar ? (
                          <button
                            type="button"
                            className="cursor-pointer text-left text-sm font-semibold text-fg transition-colors hover:text-primary"
                            onClick={(evento) => {
                              evento.stopPropagation();
                              selecionar();
                            }}
                          >
                            {motorista.nome}
                          </button>
                        ) : (
                          <span className="text-sm font-semibold text-fg">
                            {motorista.nome}
                          </span>
                        )}
                        <span className="text-xs text-fg-muted">
                          {cpf ?? "—"}
                        </span>
                      </div>
                    </td>

                    {/* Veículo/Placa — modelo · tipo do principal, placa abaixo */}
                    <td className={CELL}>
                      <VeiculoCelula motorista={motorista} />
                    </td>

                    {/* Operação — label discreto + data em destaque */}
                    <td className={CELL}>
                      <div className="flex flex-col">
                        <span className="text-xs text-fg-muted">
                          {motorista.operacao}
                        </span>
                        <span className="text-sm font-medium text-fg">
                          {formatDateOrToday(motorista.dataOperacao)}
                        </span>
                      </div>
                    </td>

                    {/* Localização */}
                    <td className={CELL}>
                      <span className="text-sm text-fg">
                        {motorista.localizacao}
                      </span>
                    </td>

                    {/* Viagens */}
                    <td className={CELL}>
                      <span className="text-sm text-fg">
                        {motorista.viagens}
                      </span>
                    </td>

                    {mostrarRentabilidade && (
                      <td className={CELL}>
                        <ValorMonetario
                          className={`whitespace-nowrap text-sm font-medium ${
                            rentabilidade != null && rentabilidade < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-fg"
                          }`}
                        >
                          {rentabilidade == null
                            ? null
                            : FORMATADOR_MOEDA.format(rentabilidade)}
                        </ValorMonetario>
                      </td>
                    )}

                    {/* Status */}
                    <td
                      className={`${CELL} text-right`}
                      onClick={(evento) => evento.stopPropagation()}
                    >
                      <StatusMotoristaBadge
                        status={motorista.status}
                        salvando={statusSalvando === motorista.id}
                        onChange={
                          onStatusChange
                            ? (novoStatus) =>
                                onStatusChange(motorista.id, novoStatus)
                            : undefined
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="border-t border-border px-6 py-4">
          <Paginacao
            paginaAtual={pagina}
            totalPaginas={totalPaginas}
            onMudarPagina={mudarPagina}
          />
        </div>
      )}
    </div>
  );
}
