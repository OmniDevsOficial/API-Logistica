import { Fragment, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import type { PaginaFrota, QuantidadeFrota, VeiculoFrota } from "@entities/veiculo";
import { Paginacao } from "@shared/ui";
import { formatarAtualizadoEm, rotuloNome, rotuloTipo } from "../lib/frota";

interface FrotaTabelaProps {
  pagina: PaginaFrota | null;
  carregando: boolean;
  erro: string | null;
  busca: string;
  onBuscaChange: (valor: string) => void;
  tipo: string | null;
  onTipoChange: (tipo: string | null) => void;
  tipos: QuantidadeFrota[];
  onMudarPagina: (pagina: number) => void;
}

const HEADER_CELL = "whitespace-nowrap py-3 pr-6 text-left text-xs font-semibold text-fg-muted";
const CELL = "py-4 pr-6 align-top text-sm text-fg";
const MENSAGEM = "border-t border-border px-6 py-8 text-center text-sm text-fg-subtle";

function veiculo(item: VeiculoFrota): string {
  const marca = item.marca ? rotuloNome(item.marca) : null;
  return [marca, item.modelo].filter(Boolean).join(" · ") || "-";
}

function totalPorExtenso(total: number): string {
  return total === 1 ? "1 veículo" : `${total} veículos`;
}

interface BotaoDetalhesProps {
  aberto: boolean;
  onAlternar: () => void;
  placa: string;
}

function BotaoDetalhes({ aberto, onAlternar, placa }: BotaoDetalhesProps) {
  return (
    <button
      type="button"
      onClick={onAlternar}
      aria-expanded={aberto}
      aria-label={`${aberto ? "Ocultar" : "Ver"} detalhes do veículo ${placa}`}
      className="inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-background"
    >
      Detalhes
      <ChevronDown
        size={14}
        className={`transition-transform duration-150 ${aberto ? "rotate-180" : ""}`}
      />
    </button>
  );
}

function DadosAdicionais({ dados }: { dados: Record<string, string> }) {
  const entradas = Object.entries(dados);
  if (entradas.length === 0) {
    return <p className="text-sm text-fg-subtle">Nenhum dado adicional na planilha.</p>;
  }

  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
      {entradas.map(([nome, valor]) => (
        <div key={nome} className="flex min-w-0 flex-col">
          <dt className="text-xs text-fg-muted">{nome}</dt>
          <dd className="truncate text-sm font-medium text-fg" title={valor}>
            {valor}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function FrotaTabela({
  pagina,
  carregando,
  erro,
  busca,
  onBuscaChange,
  tipo,
  onTipoChange,
  tipos,
  onMudarPagina,
}: FrotaTabelaProps) {
  const [abertos, setAbertos] = useState<Set<number>>(() => new Set());
  const itens = pagina?.itens ?? [];

  function alternar(id: number) {
    setAbertos((atuais) => {
      const proximos = new Set(atuais);
      if (proximos.has(id)) proximos.delete(id);
      else proximos.add(id);
      return proximos;
    });
  }

  function conteudo() {
    if (erro) {
      return (
        <p role="alert" className={MENSAGEM}>
          {erro}
        </p>
      );
    }
    if (carregando && !pagina) {
      return (
        <p role="status" className={MENSAGEM}>
          Carregando veículos...
        </p>
      );
    }
    if (itens.length === 0) {
      return <p className={MENSAGEM}>Nenhum veículo encontrado.</p>;
    }

    return (
      <>
        <ul className="divide-y divide-border border-t border-border md:hidden">
          {itens.map((item) => {
            const aberto = abertos.has(item.id);
            return (
              <li key={item.id} className="flex flex-col gap-3 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col">
                    <span className="text-sm font-semibold text-fg">{item.placa}</span>
                    <span className="truncate text-xs text-fg-muted">{rotuloTipo(item.tipo)}</span>
                  </div>
                  <BotaoDetalhes aberto={aberto} onAlternar={() => alternar(item.id)} placa={item.placa} />
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex min-w-0 flex-col">
                    <dt className="text-xs text-fg-muted">Veículo</dt>
                    <dd className="truncate text-sm text-fg">{veiculo(item)}</dd>
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <dt className="text-xs text-fg-muted">Combustível</dt>
                    <dd className="truncate text-sm text-fg">
                      {item.combustivel ? rotuloNome(item.combustivel) : "-"}
                    </dd>
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <dt className="text-xs text-fg-muted">Motorista</dt>
                    <dd className="truncate text-sm text-fg">{item.motorista ?? "Sem motorista"}</dd>
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <dt className="text-xs text-fg-muted">Atualizado em</dt>
                    <dd className="truncate text-sm text-fg">{formatarAtualizadoEm(item.atualizadoEm)}</dd>
                  </div>
                </dl>
                {aberto && (
                  <div className="rounded-md bg-background p-3">
                    <DadosAdicionais dados={item.dadosAdicionais} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="border-y border-border">
                <th className={`${HEADER_CELL} pl-6`}>Placa</th>
                <th className={HEADER_CELL}>Tipo</th>
                <th className={HEADER_CELL}>Veículo</th>
                <th className={HEADER_CELL}>Combustível</th>
                <th className={HEADER_CELL}>Motorista</th>
                <th className={HEADER_CELL}>Atualizado em</th>
                <th className={`${HEADER_CELL} text-right`}>
                  <span className="sr-only">Detalhes</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {itens.map((item) => {
                const aberto = abertos.has(item.id);
                return (
                  <Fragment key={item.id}>
                    <tr>
                      <td className={`${CELL} pl-6 font-semibold whitespace-nowrap`}>{item.placa}</td>
                      <td className={CELL}>{rotuloTipo(item.tipo)}</td>
                      <td className={CELL}>{veiculo(item)}</td>
                      <td className={CELL}>{item.combustivel ? rotuloNome(item.combustivel) : "-"}</td>
                      <td className={CELL}>
                        {item.motorista ?? <span className="text-fg-subtle">Sem motorista</span>}
                      </td>
                      <td className={`${CELL} whitespace-nowrap`}>{formatarAtualizadoEm(item.atualizadoEm)}</td>
                      <td className={`${CELL} text-right`}>
                        <BotaoDetalhes aberto={aberto} onAlternar={() => alternar(item.id)} placa={item.placa} />
                      </td>
                    </tr>
                    {aberto && (
                      <tr className="bg-background/60">
                        <td colSpan={7} className="px-6 py-4">
                          <DadosAdicionais dados={item.dadosAdicionais} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="flex w-full items-center gap-2 rounded-xl bg-surface px-4 py-3 md:max-w-md">
          <Search size={16} className="shrink-0 text-fg-muted" aria-hidden />
          <span className="sr-only">Buscar veículo</span>
          <input
            type="search"
            placeholder="Buscar por placa ou motorista"
            value={busca}
            onChange={(evento) => onBuscaChange(evento.target.value)}
            className="w-full min-w-0 bg-transparent text-sm text-fg placeholder-fg-subtle outline-none"
          />
        </label>

        <label className="flex w-full items-center gap-2 md:w-auto">
          <span className="sr-only">Filtrar por tipo</span>
          <select
            value={tipo ?? ""}
            onChange={(evento) => onTipoChange(evento.target.value || null)}
            className="w-full cursor-pointer rounded-xl bg-surface px-4 py-3 text-sm text-fg outline-none md:w-64"
          >
            <option value="">Todos os tipos</option>
            {tipos.map(({ nome, quantidade }) => (
              <option key={nome} value={nome}>
                {rotuloTipo(nome)} ({quantidade})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-hidden rounded-lg bg-surface">
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h2 className="text-lg font-semibold text-fg">Frota</h2>
          {pagina && (
            <span className="text-sm text-fg-muted" aria-live="polite">
              {totalPorExtenso(pagina.totalItens)}
            </span>
          )}
        </div>
        {conteudo()}
      </div>

      {pagina && (
        <Paginacao
          paginaAtual={pagina.pagina + 1}
          totalPaginas={pagina.totalPaginas}
          onMudarPagina={(numero) => onMudarPagina(numero - 1)}
        />
      )}
    </section>
  );
}
