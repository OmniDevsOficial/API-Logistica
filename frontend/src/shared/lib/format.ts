export function formatCurrency(value: number, fractionDigits = 2): string {
  const formatted = value.toLocaleString("pt-BR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return `$${formatted}`;
}

export function formatCurrencyBRL(value: number, fractionDigits = 0): string {
  const formatted = value.toLocaleString("pt-BR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return `R$${formatted}`;
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

export function formatCpf(cpf: string | null): string | null {
  if (!cpf) return null;

  const digitos = cpf.replace(/\D/g, "");
  if (digitos.length !== 11) return cpf;

  return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

const MESES_PT_BR = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function formatBrDate(brDate: string): string {
  const [day, month, year] = brDate.split("/").map(Number);
  return `${day} ${MESES_PT_BR[month - 1]} ${year}`;
}

/** "dd/mm/aaaa" vira "Hoje" quando a data é o dia corrente, como no protótipo. */
export function formatDateOrToday(brDate: string, hoje = new Date()): string {
  const [dia, mes, ano] = brDate.split("/").map(Number);
  if (!dia || !mes || !ano) return brDate;

  const ehHoje =
    ano === hoje.getFullYear() &&
    mes === hoje.getMonth() + 1 &&
    dia === hoje.getDate();

  return ehHoje ? "Hoje" : brDate;
}

export function formatDateRange(inicio: string, fim: string): string {
  return `${formatBrDate(inicio)} - ${formatBrDate(fim)}`;
}
