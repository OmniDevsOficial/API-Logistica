// src/features/enviar-relatorio/lib/formatarTamanhoArquivo.ts

// Transforma bytes em algo legível tipo "2.4 MB" pra mostrar no card do arquivo
export function formatarTamanhoArquivo(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}