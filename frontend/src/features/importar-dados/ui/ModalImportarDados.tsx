import { useState } from "react";
import type { TipoPlanilha } from "@shared/lib";
import type { ResultadoImportacao } from "../../enviar-relatorio/api/importarManifesto";
import { ModalEnviarRelatorio } from "../../enviar-relatorio/ui/ModalEnviarRelatorio";
import type { ResultadoImportacaoVeiculos } from "../../importar-veiculos/api/importarVeiculos";
import { ModalImportarVeiculos } from "../../importar-veiculos/ui/ModalImportarVeiculos";
import { validarPlanilhaDoTipo } from "../lib/validarPlanilhaDoTipo";
import { SeletorTipoPlanilha } from "./SeletorTipoPlanilha";

interface ModalImportarDadosProps {
  tipoInicial?: TipoPlanilha;
  onFechar: () => void;
  onManifestoImportado?: (resultado: ResultadoImportacao) => void;
  onVeiculosImportados?: (resultado: ResultadoImportacaoVeiculos) => void;
}

const TITULO = "Upload de planilha";

export function ModalImportarDados({
  tipoInicial = "manifesto",
  onFechar,
  onManifestoImportado,
  onVeiculosImportados,
}: ModalImportarDadosProps) {
  const [tipo, setTipo] = useState<TipoPlanilha>(tipoInicial);

  const seletor = (bloqueado: boolean) => (
    <SeletorTipoPlanilha tipo={tipo} onChange={setTipo} bloqueado={bloqueado} />
  );
  const validarArquivo = (arquivo: File) => validarPlanilhaDoTipo(arquivo, tipo);

  return tipo === "manifesto" ? (
    <ModalEnviarRelatorio
      titulo={TITULO}
      seletor={seletor}
      validarArquivo={validarArquivo}
      onFechar={onFechar}
      onImportado={onManifestoImportado}
    />
  ) : (
    <ModalImportarVeiculos
      titulo={TITULO}
      seletor={seletor}
      validarArquivo={validarArquivo}
      onFechar={onFechar}
      onImportado={onVeiculosImportados}
    />
  );
}
