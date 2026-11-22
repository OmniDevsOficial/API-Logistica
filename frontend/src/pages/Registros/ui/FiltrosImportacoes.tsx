import type {
  FiltroStatusImportacao,
  FiltroTipoImportacao,
} from "@entities/importacao";
import type { FiltroRegistros } from "../model/useImportacoes";

interface FiltrosImportacoesProps {
  filtro: FiltroRegistros;
  onMudar: (filtro: FiltroRegistros) => void;
  busca: string;
  onBuscaChange: (busca: string) => void;
}

const ROTULO =
  "mb-1 block text-xs font-semibold text-fg-muted";
const CAMPO =
  "w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-fg outline-none transition-colors focus:border-primary";

const TIPOS: { valor: FiltroTipoImportacao; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "manifesto", rotulo: "Manifesto" },
  { valor: "veiculos", rotulo: "Veículos" },
];

const STATUS: { valor: FiltroStatusImportacao; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "sucesso", rotulo: "Sucesso" },
  { valor: "parcial", rotulo: "Parcial" },
  { valor: "erro", rotulo: "Erro" },
];

/**
 * Tipo, status e período são parâmetros do back; a busca pelo nome do arquivo
 * é do cliente, sobre a lista já baixada.
 */
export function FiltrosImportacoes({
  filtro,
  onMudar,
  busca,
  onBuscaChange,
}: FiltrosImportacoesProps) {
  const mudar = (parcial: Partial<FiltroRegistros>) => onMudar({ ...filtro, ...parcial });

  return (
    <div className="flex flex-col gap-4 rounded-md bg-surface p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label>
          <span className={ROTULO}>Tipo</span>
          <select
            className={CAMPO}
            value={filtro.tipo}
            onChange={(evento) => mudar({ tipo: evento.target.value as FiltroTipoImportacao })}
          >
            {TIPOS.map((item) => (
              <option key={item.valor} value={item.valor}>
                {item.rotulo}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className={ROTULO}>Status</span>
          <select
            className={CAMPO}
            value={filtro.status}
            onChange={(evento) => mudar({ status: evento.target.value as FiltroStatusImportacao })}
          >
            {STATUS.map((item) => (
              <option key={item.valor} value={item.valor}>
                {item.rotulo}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className={ROTULO}>De</span>
          <input
            type="date"
            className={CAMPO}
            value={filtro.de}
            onChange={(evento) => mudar({ de: evento.target.value })}
          />
        </label>

        <label>
          <span className={ROTULO}>Até</span>
          <input
            type="date"
            className={CAMPO}
            value={filtro.ate}
            onChange={(evento) => mudar({ ate: evento.target.value })}
          />
        </label>
      </div>

      <label>
        <span className={ROTULO}>Buscar por nome do arquivo</span>
        <input
          type="search"
          className={CAMPO}
          placeholder="Ex.: manifesto-novembro.csv"
          value={busca}
          onChange={(evento) => onBuscaChange(evento.target.value)}
        />
      </label>
    </div>
  );
}
