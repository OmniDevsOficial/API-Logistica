/** Veículo resumido, como aparece dentro da lista de motoristas. */
export interface VeiculoResumo {
  /** Placa normalizada (ex.: "ABC1D23"). */
  placa: string;
  /** Tipo como gravado (maiúsculas). Para exibir, use `formatTipoVeiculo`. */
  tipo: string | null;
  /** Modelo, o "nome" do veículo (ex.: "FIORINO", "VM260"). */
  modelo: string | null;
  ativo: boolean | null;
}

/** Veículo completo, como retornado por GET /veiculos. */
export interface Veiculo extends VeiculoResumo {
  id: number;
  marca: string | null;
  motoristaId: number | null;
  motoristaNome: string | null;
}

/** Filtros opcionais de GET /veiculos. */
export interface FiltroVeiculos {
  /** Trecho da placa, em qualquer formato ("abc-1" encontra "ABC1D23"). */
  placa?: string;
  /** Tipo exato, sem diferença de caixa. */
  tipo?: string;
  motoristaId?: number;
  ativo?: boolean;
}

export interface VeiculoFrota {
  id: number;
  placa: string;
  tipo: string | null;
  marca: string | null;
  modelo: string | null;
  combustivel: string | null;
  motorista: string | null;
  atualizadoEm: string | null;
  dadosAdicionais: Record<string, string>;
}

export interface PaginaFrota {
  itens: VeiculoFrota[];
  pagina: number;
  tamanho: number;
  totalItens: number;
  totalPaginas: number;
}

export interface PeriodoFrota {
  dataInicio: string;
  dataFim: string;
}

export interface FiltroFrota extends Partial<PeriodoFrota> {
  pagina?: number;
  tamanho?: number;
  tipo?: string | null;
  busca?: string;
}

export interface QuantidadeFrota {
  nome: string;
  quantidade: number;
}

export interface PercentualCombustivel extends QuantidadeFrota {
  percentual: number;
}

export interface ResumoFrota {
  possuiDados: boolean;
  totalVeiculos: number;
  veiculosSemMotorista: number;
  motoristasComVeiculo: number;
  porTipo: QuantidadeFrota[];
  porCombustivel: PercentualCombustivel[];
  porMarca: QuantidadeFrota[];
}
