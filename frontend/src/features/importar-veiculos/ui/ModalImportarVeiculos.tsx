import { useState } from "react";
import type { ReactNode } from "react";

import { MensagemFeedbackUpload, ModalImportacao, ResumoImportacao } from "@shared/ui";
import type { OcorrenciaImportacao, ValidacaoArquivo } from "@shared/ui";

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

function porPlaca(ocorrencias: OcorrenciaLinha[]): OcorrenciaImportacao[] {
  return ocorrencias.map(({ linha, placa, mensagem }) => ({ linha, chave: placa, mensagem }));
}

function ResumoImportacaoVeiculos({ resultado }: { resultado: ResultadoImportacaoVeiculos }) {
  return (
    <ResumoImportacao
      mensagem={
        resultado.linhasComErro > 0
          ? "Importação concluída. As linhas rejeitadas abaixo não foram gravadas; as demais foram."
          : "Importação concluída. Todas as linhas foram gravadas."
      }
      cards={[
        { rotulo: "Criados", valor: resultado.veiculosCadastrados },
        { rotulo: "Atualizados", valor: resultado.veiculosAtualizados },
        { rotulo: "Motoristas novos", valor: resultado.motoristasCadastrados },
        { rotulo: "Rejeitados", valor: resultado.linhasComErro, destaque: resultado.linhasComErro > 0 },
      ]}
      tabelas={[
        {
          titulo: "Linhas rejeitadas",
          colunaChave: "Placa",
          colunaMensagem: "Motivo",
          tom: "erro",
          ocorrencias: porPlaca(resultado.erros),
        },
        {
          titulo: "Avisos (linhas gravadas)",
          colunaChave: "Placa",
          colunaMensagem: "Aviso",
          tom: "aviso",
          ocorrencias: porPlaca(resultado.avisos),
        },
      ]}
    />
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

      {resultado && <ResumoImportacaoVeiculos resultado={resultado} />}
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
