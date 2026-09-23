// Validação no cliente é só UX. O backend (OM-67) TEM que validar de novo
// (extensão real via magic bytes, tamanho, conteúdo malformado) —
// nunca confiar só nisso pra segurança.

const EXTENSOES_PERMITIDAS = ['.xlsx', '.csv'];
const TAMANHO_MAXIMO_MB = 10; // Limite definido na task; também deve ser aplicado no backend.

export interface ResultadoValidacao {
  valido: boolean;
  mensagemErro?: string;
}

export function validarArquivoRelatorio(arquivo: File): ResultadoValidacao {
  const extensao = arquivo.name.slice(arquivo.name.lastIndexOf('.')).toLowerCase();

  if (!EXTENSOES_PERMITIDAS.includes(extensao)) {
    return {
      valido: false,
      mensagemErro: 'Selecione um arquivo Excel (.xlsx) ou CSV (.csv).',
    };
  }

  // ALTERAÇÃO: evita enviar arquivos vazios ao endpoint de gravação.
  if (arquivo.size === 0) {
    return { valido: false, mensagemErro: 'O arquivo está vazio. Selecione um manifesto com dados.' };
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
