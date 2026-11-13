import { useState } from "react";
import type { ReactNode } from "react";

import { MensagemFeedbackUpload, ModalImportacao } from "@shared/ui";
import type { ValidacaoArquivo } from "@shared/ui";

import {
  importarVeiculos,
  mensagemErroImportacaoVeiculos,
  podeTentarDeNovo,
} from "../api/importarVeiculos";
import type {
  OcorrenciaLinha,
  ResultadoImportacaoVeiculos,
} from "../api/importarVeiculos";
import { validarArquivoVeiculos } from "../lib/validarArquivoVeiculos";

interface Propriedades {
  onFechar: () => void;
  onImportado?: (resultado: ResultadoImportacaoVeiculos) => void;
  titulo?: string;
  validarArquivo?: (arquivo: File) => ValidacaoArquivo | Promise<ValidacaoArquivo>;
  seletor?: (bloqueado: boolean) => ReactNode;
}

interface ErroTela {
  mensagem: string;
  podeTentarDeNovo: boolean;
  chave: number;
}

function TabelaOcorrencias({
  titulo,
  colunaMensagem,
  ocorrencias,
  tom,
}: {
  titulo: string;
  colunaMensagem: string;
  ocorrencias: OcorrenciaLinha[];
  tom: "erro" | "aviso";
}) {
  if (ocorrencias.length === 0) return null;
  const cor = tom === "erro" ? "text-red-700 dark:text-red-400" : "text-amber-800 dark:text-amber-300";

  return (
    <section className="flex flex-col gap-2">
      <h3 className={`m-0 text-sm font-semibold ${cor}`}>{titulo}</h3>
      <div className="max-h-60 overflow-y-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-background">
            <tr className="text-xs text-fg-muted">
              <th scope="col" className="w-16 px-3 py-2 font-semibold">Linha</th>
              <th scope="col" className="w-24 px-3 py-2 font-semibold">Placa</th>
              <th scope="col" className="px-3 py-2 font-semibold">{colunaMensagem}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ocorrencias.map((ocorrencia) => (
              <tr key={`${ocorrencia.linha}-${ocorrencia.mensagem}`}>
                <td className="px-3 py-2 align-top text-fg-muted">{ocorrencia.linha}</td>
                <td className="px-3 py-2 align-top font-mono text-fg">{ocorrencia.placa ?? "—"}</td>
                <td className="px-3 py-2 align-top text-fg">{ocorrencia.mensagem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ResumoImportacao({ resultado }: { resultado: ResultadoImportacaoVeiculos }) {
  const cards = [
    { rotulo: "Criados", valor: resultado.veiculosCadastrados, destaque: false },
    { rotulo: "Atualizados", valor: resultado.veiculosAtualizados, destaque: false },
    { rotulo: "Motoristas novos", valor: resultado.motoristasCadastrados, destaque: false },
    { rotulo: "Rejeitados", valor: resultado.linhasComErro, destaque: resultado.linhasComErro > 0 },
  ];

  return (
    <div className="flex flex-col gap-4" role="status" aria-live="polite">
      <p className="m-0 text-sm text-fg-muted">
        {resultado.linhasComErro > 0
          ? "Importação concluída. As linhas rejeitadas abaixo não foram gravadas; as demais foram."
          : "Importação concluída. Todas as linhas foram gravadas."}
      </p>

      <dl className="m-0 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.rotulo}
            className={`rounded-lg border px-3 py-2 ${
              card.destaque ? "border-red-300 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10" : "border-border"
            }`}
          >
            <dt className={`text-xs ${card.destaque ? "text-red-700 dark:text-red-400" : "text-fg-muted"}`}>{card.rotulo}</dt>
            <dd className={`m-0 text-lg font-semibold ${card.destaque ? "text-red-700 dark:text-red-400" : "text-fg"}`}>
              {card.valor}
            </dd>
          </div>
        ))}
      </dl>

      <TabelaOcorrencias
        titulo="Linhas rejeitadas"
        colunaMensagem="Motivo"
        ocorrencias={resultado.erros}
        tom="erro"
      />
      <TabelaOcorrencias
        titulo="Avisos (linhas gravadas)"
        colunaMensagem="Aviso"
        ocorrencias={resultado.avisos}
        tom="aviso"
      />
    </div>
  );
}

/**
 * Importação do CSV de veículos sobre a estrutura comum de `ModalImportacao`.
 * Depois do envio mostra o resumo e as linhas rejeitadas em vez de fechar,
 * para quem importou conferir o que precisa corrigir na planilha.
 */
export function ModalImportarVeiculos({
  onFechar,
  onImportado,
  titulo = "Importar veículos",
  validarArquivo = validarArquivoVeiculos,
  seletor,
}: Propriedades) {
  const [erro, setErro] = useState<ErroTela | null>(null);
  const [resultado, setResultado] = useState<ResultadoImportacaoVeiculos | null>(null);

  function exibirErro(mensagem: string, podeReenviar: boolean) {
    setErro((anterior) => ({
      mensagem,
      podeTentarDeNovo: podeReenviar,
      chave: (anterior?.chave ?? 0) + 1,
    }));
  }

  async function enviar(arquivo: File): Promise<boolean> {
    setErro(null);
    setResultado(null);

    try {
      const resposta = await importarVeiculos(arquivo);
      setResultado(resposta);
      onImportado?.(resposta);
      return true;
    } catch (falha) {
      exibirErro(mensagemErroImportacaoVeiculos(falha), podeTentarDeNovo(falha));
      // Mantém o arquivo selecionado para o "Tentar de novo".
      return false;
    }
  }

  const conteudo = (
    <>
      {erro && (
        <MensagemFeedbackUpload
          key={erro.chave}
          tipo="erro"
          mensagem={erro.mensagem}
          onFechar={() => setErro(null)}
        />
      )}

      {resultado && <ResumoImportacao resultado={resultado} />}
    </>
  );

  return (
    <ModalImportacao
      titulo={titulo}
      formatosAceitos=".csv de até 10MB, com as colunas Placa e Tipo Veículo."
      accept=".csv"
      rotuloConfirmar="Importar veículos"
      rotuloFechar={resultado ? "Fechar" : "Cancelar"}
      instrucao={resultado ? "Importar outra planilha" : undefined}
      areaCompacta={resultado !== null}
      validarArquivo={validarArquivo}
      seletor={seletor}
      onEnviar={enviar}
      onArquivoInvalido={(mensagem) => {
        setResultado(null);
        exibirErro(mensagem, false);
      }}
      onArquivoSelecionado={() => setErro(null)}
      onFechar={onFechar}
      conteudo={conteudo}
      tentarDeNovo={erro?.podeTentarDeNovo ?? false}
    />
  );
}
