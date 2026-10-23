import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PeriodOption } from "@entities/dashboard-metrics";

type Visao = "dias" | "meses" | "anos";

interface SeletorPeriodoProps {
  periodo: PeriodOption;
  referencia: Date;
  onSelecionar: (data: Date) => void;
  hoje?: Date;
}

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const MESES_COMPLETOS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const ANOS_POR_BLOCO = 12;

const NAV =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-background hover:text-fg disabled:cursor-not-allowed disabled:opacity-40";
const TITULO =
  "cursor-pointer rounded-md px-2 py-1 text-sm font-semibold text-fg transition-colors hover:bg-background disabled:cursor-default disabled:hover:bg-transparent";

function classeOpcao(selecionada: boolean) {
  return `cursor-pointer rounded-md text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
    selecionada ? "bg-primary font-semibold text-white" : "text-fg hover:bg-background"
  }`;
}

function visaoDoPeriodo(periodo: PeriodOption): Visao {
  if (periodo === "dia") return "dias";
  if (periodo === "mes") return "meses";
  return "anos";
}

/**
 * Calendário do filtro de período. A visão inicial segue o filtro: Dia escolhe
 * dia (e permite subir para mês/ano), Mês escolhe mês e ano, Ano escolhe o ano.
 * Datas futuras ficam desabilitadas, como nas setas de navegação.
 */
export function SeletorPeriodo({
  periodo,
  referencia,
  onSelecionar,
  hoje = new Date(),
}: SeletorPeriodoProps) {
  const [visao, setVisao] = useState<Visao>(() => visaoDoPeriodo(periodo));
  const [ano, setAno] = useState(referencia.getFullYear());
  const [mes, setMes] = useState(referencia.getMonth());

  const limite = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const anoAtual = limite.getFullYear();
  const inicioBloco = Math.floor(ano / ANOS_POR_BLOCO) * ANOS_POR_BLOCO;

  function escolherAno(anoEscolhido: number) {
    if (periodo === "ano") return onSelecionar(new Date(anoEscolhido, 0, 1));
    setAno(anoEscolhido);
    setVisao("meses");
  }

  function escolherMes(mesEscolhido: number) {
    if (periodo === "mes") return onSelecionar(new Date(ano, mesEscolhido, 1));
    setMes(mesEscolhido);
    setVisao("dias");
  }

  function deslocarMes(passos: number) {
    const data = new Date(ano, mes + passos, 1);
    setAno(data.getFullYear());
    setMes(data.getMonth());
  }

  function cabecalho(titulo: string, onTitulo: (() => void) | null, onAnterior: () => void,
    onSeguinte: () => void, podeAvancar: boolean) {
    return (
      <div className="mb-2 flex items-center justify-between">
        <button type="button" className={NAV} onClick={onAnterior} aria-label="Anterior">
          <ChevronLeft size={16} />
        </button>
        <button type="button" className={TITULO} onClick={onTitulo ?? undefined} disabled={!onTitulo}>
          {titulo}
        </button>
        <button type="button" className={NAV} onClick={onSeguinte} disabled={!podeAvancar} aria-label="Seguinte">
          <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  if (visao === "anos") {
    const anos = Array.from({ length: ANOS_POR_BLOCO }, (_, i) => inicioBloco + i);
    return (
      <div>
        {cabecalho(
          `${anos[0]} – ${anos[anos.length - 1]}`,
          null,
          () => setAno(ano - ANOS_POR_BLOCO),
          () => setAno(ano + ANOS_POR_BLOCO),
          inicioBloco + ANOS_POR_BLOCO <= anoAtual,
        )}
        <div className="grid grid-cols-3 gap-1">
          {anos.map((opcao) => (
            <button
              key={opcao}
              type="button"
              className={`${classeOpcao(opcao === referencia.getFullYear())} py-2.5`}
              disabled={opcao > anoAtual}
              onClick={() => escolherAno(opcao)}
            >
              {opcao}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (visao === "meses") {
    return (
      <div>
        {cabecalho(
          String(ano),
          () => setVisao("anos"),
          () => setAno(ano - 1),
          () => setAno(ano + 1),
          ano < anoAtual,
        )}
        <div className="grid grid-cols-3 gap-1">
          {MESES.map((nome, indice) => (
            <button
              key={nome}
              type="button"
              className={`${classeOpcao(
                ano === referencia.getFullYear() && indice === referencia.getMonth(),
              )} py-2.5`}
              disabled={new Date(ano, indice, 1) > limite}
              onClick={() => escolherMes(indice)}
            >
              {nome}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const deslocamento = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  return (
    <div>
      {cabecalho(
        `${MESES_COMPLETOS[mes]} ${ano}`,
        () => setVisao("meses"),
        () => deslocarMes(-1),
        () => deslocarMes(1),
        new Date(ano, mes + 1, 1) <= limite,
      )}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DIAS_SEMANA.map((dia, indice) => (
          <span key={indice} className="py-1 text-xs font-medium text-fg-subtle">
            {dia}
          </span>
        ))}
        {Array.from({ length: deslocamento }, (_, indice) => (
          <span key={`vazio-${indice}`} />
        ))}
        {Array.from({ length: diasNoMes }, (_, indice) => {
          const data = new Date(ano, mes, indice + 1);
          return (
            <button
              key={indice}
              type="button"
              className={`${classeOpcao(data.getTime() === new Date(
                referencia.getFullYear(), referencia.getMonth(), referencia.getDate(),
              ).getTime())} h-8 tabular-nums`}
              disabled={data > limite}
              onClick={() => onSelecionar(data)}
            >
              {indice + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
