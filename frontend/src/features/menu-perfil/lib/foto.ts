export const TIPOS_DE_FOTO = ["image/png", "image/jpeg", "image/webp"];
export const TAMANHO_MAXIMO_DA_FOTO = 5 * 1024 * 1024;

const LADO_DA_FOTO = 256;
const QUALIDADE_DA_FOTO = 0.85;

export function validarArquivoDeFoto(arquivo: { type: string; size: number }): string | null {
  if (!TIPOS_DE_FOTO.includes(arquivo.type)) return "Escolha uma imagem PNG, JPG ou WEBP.";
  if (arquivo.size > TAMANHO_MAXIMO_DA_FOTO) return "A imagem pode ter no máximo 5 MB.";
  return null;
}

export function validarNome(nome: string): string | null {
  const limpo = nome.trim();
  if (limpo === "") return "Informe o nome.";
  if (limpo.length > 120) return "O nome pode ter no máximo 120 caracteres.";
  return null;
}

export async function prepararFoto(arquivo: File): Promise<string> {
  const imagem = await createImageBitmap(arquivo);

  try {
    const lado = Math.min(imagem.width, imagem.height);
    const canvas = document.createElement("canvas");
    canvas.width = LADO_DA_FOTO;
    canvas.height = LADO_DA_FOTO;

    const contexto = canvas.getContext("2d");
    if (!contexto) throw new Error("Não foi possível ler a imagem.");

    contexto.fillStyle = "#ffffff";
    contexto.fillRect(0, 0, LADO_DA_FOTO, LADO_DA_FOTO);
    contexto.drawImage(
      imagem,
      (imagem.width - lado) / 2,
      (imagem.height - lado) / 2,
      lado,
      lado,
      0,
      0,
      LADO_DA_FOTO,
      LADO_DA_FOTO,
    );

    return canvas.toDataURL("image/jpeg", QUALIDADE_DA_FOTO);
  } finally {
    imagem.close();
  }
}
