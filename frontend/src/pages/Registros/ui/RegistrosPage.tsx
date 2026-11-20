import { useEffect, useMemo, useRef, useState } from "react";
import type { TipoImportacao } from "@entities/importacao";
import { podeImportarVeiculos, useSessao } from "@entities/sessao";
import {
  BotaoUpload,
  EVENTO_IMPORTACAO_CONCLUIDA,
} from "@features/importar-dados";
import { Sidebar } from "@widgets/sidebar";
import { totalDePaginas } from "@shared/lib";
import { PageHeader, Paginacao } from "@shared/ui";
import { filtrarPorArquivo } from "../lib/filtrarPorArquivo";
import { LABEL_TIPO } from "../lib/formatarRegistro";
import { useImportacoes, type FiltroRegistros } from "../model/useImportacoes";
import { CardUltimaImportacao } from "./CardUltimaImportacao";
import { FiltrosImportacoes } from "./FiltrosImportacoes";
import { TabelaImportacoes } from "./TabelaImportacoes";

const IMPORTACOES_POR_PAGINA = 20;

const FILTRO_INICIAL: FiltroRegistros = {
  tipo: "todos",
  status: "todos",
  de: "",
  ate: "",
};

const BOTAO_TENTAR_DE_NOVO =
  "inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark";

function AvisoDeFalha({ fonte, onTentar }: { fonte: TipoImportacao; onTentar: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start justify-between gap-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 sm:flex-row sm:items-center"
    >
      <p className="text-sm font-medium text-fg">
        Não foi possível carregar o histórico de {LABEL_TIPO[fonte]}
      </p>
      <button type="button" className={BOTAO_TENTAR_DE_NOVO} onClick={onTentar}>
        Tentar de novo
      </button>
    </div>
  );
}

/**
 * Registros: o histórico das importações de manifesto e de planilha de
 * veículos, juntado numa lista só.
 */
export function RegistrosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { usuario } = useSessao();
  const [filtro, setFiltro] = useState<FiltroRegistros>(FILTRO_INICIAL);
  const [busca, setBusca] = useState("");
  const listaRef = useRef<HTMLDivElement>(null);

  const { linhas, carregando, erroTotal, falhas, ultimas, recarregar, recarregarFonte } =
    useImportacoes(filtro);

  // Uma importação que termina em qualquer modal recarrega esta lista.
  useEffect(() => {
    window.addEventListener(EVENTO_IMPORTACAO_CONCLUIDA, recarregar);
    return () => window.removeEventListener(EVENTO_IMPORTACAO_CONCLUIDA, recarregar);
  }, [recarregar]);

  // A busca é do cliente: a lista inteira já veio do back.
  const linhasBuscadas = useMemo(() => filtrarPorArquivo(linhas, busca), [linhas, busca]);

  const totalPaginas = totalDePaginas(linhasBuscadas.length, IMPORTACOES_POR_PAGINA);
  // A página vale só para a lista em que foi escolhida: mudou a lista,
  // volta para a primeira sem efeito extra.
  const [paginacao, setPaginacao] = useState({ lista: linhasBuscadas, pagina: 1 });
  const pagina =
    paginacao.lista === linhasBuscadas ? Math.min(paginacao.pagina, totalPaginas) : 1;
  const inicio = (pagina - 1) * IMPORTACOES_POR_PAGINA;
  const daPagina = linhasBuscadas.slice(inicio, inicio + IMPORTACOES_POR_PAGINA);

  function mudarPagina(novaPagina: number) {
    setPaginacao({ lista: linhasBuscadas, pagina: novaPagina });
    const lista = listaRef.current;
    if (!lista) return;
    lista.scrollTo({ top: 0 });
    if (lista.getBoundingClientRect().top < 0) {
      lista.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const semNenhuma = linhas.length === 0;

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 px-4 py-6 sm:px-10 sm:py-8 lg:ml-sidebar lg:flex lg:flex-col">
        <header className="mb-7 flex flex-col gap-5">
          <PageHeader
            title="Registros"
            onMenuClick={() => setSidebarOpen(true)}
            acoes={usuario && podeImportarVeiculos(usuario.perfil) ? <BotaoUpload /> : undefined}
          />
        </header>

        <div className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <CardUltimaImportacao
              titulo="Última importação do manifesto"
              importacao={ultimas.manifesto}
              carregando={carregando}
            />
            <CardUltimaImportacao
              titulo="Última importação de veículos"
              importacao={ultimas.veiculos}
              carregando={carregando}
            />
          </div>

          {falhas.map((fonte) => (
            <AvisoDeFalha key={fonte} fonte={fonte} onTentar={() => recarregarFonte(fonte)} />
          ))}

          <FiltrosImportacoes
            filtro={filtro}
            onMudar={setFiltro}
            busca={busca}
            onBuscaChange={setBusca}
          />

          {carregando && (
            <p className="py-8 text-center text-sm text-fg-subtle">Carregando registros…</p>
          )}

          {!carregando && erroTotal && (
            <div
              role="alert"
              className="flex flex-col items-center gap-4 rounded-md bg-surface p-8 text-center"
            >
              <p className="text-sm text-fg-muted">
                Não foi possível carregar o histórico de importações.
              </p>
              <button type="button" className={BOTAO_TENTAR_DE_NOVO} onClick={recarregar}>
                Tentar de novo
              </button>
            </div>
          )}

          {!carregando && !erroTotal && (
            <>
              {linhasBuscadas.length > 0 ? (
                <>
                  <p className="text-sm tabular-nums text-fg-subtle">
                    {inicio + 1}–{inicio + daPagina.length} de {linhasBuscadas.length}{" "}
                    {linhasBuscadas.length === 1 ? "importação" : "importações"}
                  </p>

                  <div ref={listaRef} className="scroll-mt-6">
                    <TabelaImportacoes linhas={daPagina} />
                  </div>

                  <Paginacao
                    paginaAtual={pagina}
                    totalPaginas={totalPaginas}
                    onMudarPagina={mudarPagina}
                  />
                </>
              ) : (
                <p className="rounded-md bg-surface p-6 text-center text-sm text-fg-subtle">
                  {semNenhuma
                    ? "Nenhuma importação ainda"
                    : "Nenhuma importação encontrada para os filtros"}
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
