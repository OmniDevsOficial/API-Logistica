import type { PagamentoMotorista, RankingMotorista } from "../model/types";

/** Índice de valor a pagar por CPF (só dígitos) e, como reserva, por nome. */
export interface IndiceFaturamento {
  porCpf: ReadonlyMap<string, number>;
  porNome: ReadonlyMap<string, number>;
}

function digitos(cpf: string | null): string | null {
  const limpo = (cpf ?? "").replace(/\D/g, "");
  return limpo === "" ? null : limpo;
}

/** Mesma chave do ranking no backend: nome sem espaços nas pontas e em caixa alta. */
function chaveNome(nome: string): string {
  return nome.trim().toUpperCase();
}

/**
 * Indexa o pagamento do mês para cruzar com o ranking. O pagamento vem
 * agrupado por CPF; itens sem CPF não entram, pois misturam motoristas.
 */
export function indexarFaturamento(
  pagamentos: readonly PagamentoMotorista[],
): IndiceFaturamento {
  const porCpf = new Map<string, number>();
  const porNome = new Map<string, number>();

  for (const pagamento of pagamentos) {
    const cpf = digitos(pagamento.cpf);
    if (cpf === null) continue;
    porCpf.set(cpf, pagamento.valorAPagar);
    const nome = chaveNome(pagamento.motorista);
    porNome.set(nome, (porNome.get(nome) ?? 0) + pagamento.valorAPagar);
  }

  return { porCpf, porNome };
}

/**
 * Valor a pagar do motorista do ranking: procura pelo CPF e, sem ele, pelo nome.
 *
 * @returns O valor no mês, ou `null` quando não há correspondência.
 */
export function faturamentoDoMotorista(
  indice: IndiceFaturamento,
  motorista: Pick<RankingMotorista, "cpf" | "nome">,
): number | null {
  const cpf = digitos(motorista.cpf);
  if (cpf !== null && indice.porCpf.has(cpf)) {
    return indice.porCpf.get(cpf) ?? null;
  }
  return indice.porNome.get(chaveNome(motorista.nome)) ?? null;
}
