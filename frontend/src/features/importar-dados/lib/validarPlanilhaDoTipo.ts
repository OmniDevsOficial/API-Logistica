import type { ValidacaoArquivo } from "../../../shared/ui/ModalImportacao/ModalImportacao.tsx";
import { lerTipoDaPlanilha, type TipoPlanilha } from "../../../shared/lib/planilha.ts";
import { validarArquivoRelatorio } from "../../enviar-relatorio/lib/validarArquivoRelatorio.ts";
import { validarArquivoVeiculos } from "../../importar-veiculos/lib/validarArquivoVeiculos.ts";

const ARQUIVO_DO_OUTRO_TIPO: Record<TipoPlanilha, string> = {
  manifesto: "Este arquivo é a planilha de veículos. Para importá-lo, escolha “Importar veículos”.",
  veiculos: "Este arquivo é um manifesto. Para importá-lo, escolha “Importar manifesto”.",
};

const COLUNA_AUSENTE: Record<TipoPlanilha, string> = {
  manifesto: "O arquivo não parece um manifesto: falta a coluna Manifesto.",
  veiculos: "O arquivo não parece a planilha de veículos: falta a coluna Placa.",
};

function validarFormato(arquivo: File, tipo: TipoPlanilha): ValidacaoArquivo {
  return tipo === "manifesto" ? validarArquivoRelatorio(arquivo) : validarArquivoVeiculos(arquivo);
}

export async function validarPlanilhaDoTipo(
  arquivo: File,
  tipo: TipoPlanilha,
): Promise<ValidacaoArquivo> {
  const formato = validarFormato(arquivo, tipo);
  if (!formato.valido || !arquivo.name.toLowerCase().endsWith(".csv")) return formato;

  const encontrado = await lerTipoDaPlanilha(arquivo);
  if (encontrado === tipo) return { valido: true };

  return {
    valido: false,
    mensagemErro: encontrado === null ? COLUNA_AUSENTE[tipo] : ARQUIVO_DO_OUTRO_TIPO[tipo],
  };
}
