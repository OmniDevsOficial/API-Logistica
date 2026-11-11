// Validação no cliente é só UX: o backend valida de novo extensão, tamanho,
// cabeçalho e cada linha.

const TAMANHO_MAXIMO_MB = 10;

export interface ResultadoValidacao {
  valido: boolean;
  mensagemErro?: string;
}

export function validarArquivoVeiculos(arquivo: Pick<File, "name" | "size">): ResultadoValidacao {
  if (!arquivo.name.toLowerCase().endsWith(".csv")) {
    return { valido: false, mensagemErro: "Selecione a planilha de veículos em CSV (.csv)." };
  }

  if (arquivo.size === 0) {
    return { valido: false, mensagemErro: "O arquivo está vazio. Selecione uma planilha com veículos." };
  }

  const tamanhoEmMB = arquivo.size / (1024 * 1024);
  if (tamanhoEmMB > TAMANHO_MAXIMO_MB) {
    return {
      valido: false,
      mensagemErro: `Arquivo muito grande (${tamanhoEmMB.toFixed(1)}MB). Limite: ${TAMANHO_MAXIMO_MB}MB.`,
    };
  }

  return { valido: true };
}
