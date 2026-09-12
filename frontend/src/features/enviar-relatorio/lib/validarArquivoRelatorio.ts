// Validação no cliente é só UX. O backend (OM-67) TEM que validar de novo
// (extensão real via magic bytes, tamanho, conteúdo malformado) —
// nunca confiar só nisso pra segurança.

const EXTENSOES_PERMITIDAS = ['.xlsx', '.csv'];
const TAMANHO_MAXIMO_MB = 10; // TODO: confirmar limite real com o time do backend

export interface ResultadoValidacao {
  valido: boolean;
  mensagemErro?: string;
}

export function validarArquivoRelatorio(arquivo: File): ResultadoValidacao {
  const extensao = arquivo.name.slice(arquivo.name.lastIndexOf('.')).toLowerCase();

  if (!EXTENSOES_PERMITIDAS.includes(extensao)) {
    return {
      valido: false,
      mensagemErro: `Formato inválido: ${extensao}. Envie apenas arquivos .xlsx ou .csv.`,
    };
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