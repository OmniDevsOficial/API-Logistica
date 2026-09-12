export type DadosManifesto = Record<string, string>;

interface RespostaErro {
  erro?: string;
}

export async function enviarRelatorio(
  arquivo: File
): Promise<DadosManifesto[]> {
  const formulario = new FormData();

  // O backend usa @RequestParam("file")
  formulario.append('file', arquivo);

  const resposta = await fetch('/api/manifestos/upload', {
    method: 'POST',
    body: formulario,
  });

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const respostaErro = dados as RespostaErro | null;

    throw new Error(
      respostaErro?.erro ?? 'Não foi possível enviar o relatório.'
    );
  }

  return dados as DadosManifesto[];
}