import { useRef, useState } from "react";
import { ViagemCard, type Viagem } from "@entities/viagem";
import { totalDePaginas } from "@shared/lib";
import { Paginacao } from "@shared/ui";

interface ViagensListProps {
  viagens: Viagem[];
}

const VIAGENS_POR_PAGINA = 30;

export function ViagensList({ viagens }: ViagensListProps) {
  const listaRef = useRef<HTMLDivElement>(null);
  // A página vale só para a lista em que foi escolhida: se busca, filtro ou
  // período trocarem a lista, volta para a primeira sem precisar de efeito.
  const [paginacao, setPaginacao] = useState({ lista: viagens, pagina: 1 });
  const totalPaginas = totalDePaginas(viagens.length, VIAGENS_POR_PAGINA);
  const pagina =
    paginacao.lista === viagens ? Math.min(paginacao.pagina, totalPaginas) : 1;

  const inicio = (pagina - 1) * VIAGENS_POR_PAGINA;
  const viagensDaPagina = viagens.slice(inicio, inicio + VIAGENS_POR_PAGINA);

  function mudarPagina(novaPagina: number) {
    setPaginacao({ lista: viagens, pagina: novaPagina });
    const lista = listaRef.current;
    if (!lista) return;
    lista.scrollTo({ top: 0 });
    // Só rola a tela se o topo da lista ficou para cima (paginador no rodapé).
    if (lista.getBoundingClientRect().top < 0) {
      lista.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (viagens.length === 0) {
    return (
      <p className="rounded-md bg-surface p-6 text-center text-sm text-fg-subtle">
        Nenhuma viagem encontrada.
      </p>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <p className="text-sm text-fg-subtle tabular-nums">
        {inicio + 1}–{inicio + viagensDaPagina.length} de {viagens.length} viagens
      </p>

      <div
        ref={listaRef}
        className="scrollbar-hide flex scroll-mt-6 flex-col gap-4 lg:h-full lg:min-h-0 lg:overflow-y-auto"
      >
        {/* A key por página reinicia só este bloco, com uma entrada suave. */}
        <div key={pagina} className="flex flex-col gap-4 motion-safe:animate-surgir">
          {viagensDaPagina.map((viagem) => (
            <ViagemCard key={viagem.id} viagem={viagem} />
          ))}
        </div>
      </div>

      <Paginacao
        paginaAtual={pagina}
        totalPaginas={totalPaginas}
        onMudarPagina={mudarPagina}
      />
    </div>
  );
}
