// src/features/enviar-relatorio/ui/ModalEnviarRelatorio.tsx
import { useEffect, useRef, useState } from 'react';

import { MensagemFeedbackUpload, ModalImportacao } from '@shared/ui';
import type { TipoMensagemUpload } from '@shared/ui';

// ALTERAÇÃO: endpoint operacional que salva viagens, sem simulação.
import { importarManifesto, mensagemErroImportacao } from '../api/importarManifesto';
import type { ResultadoImportacao } from '../api/importarManifesto';
import { validarArquivoRelatorio } from '../lib/validarArquivoRelatorio';

interface Propriedades {
  onFechar: () => void;
  onImportado?: (resultado: ResultadoImportacao) => void;
}

interface Feedback {
  tipo: TipoMensagemUpload;
  mensagem: string;
  chave: number;
}

const DURACAO_MENSAGEM_MS = 5000;

/** Importação do manifesto sobre a estrutura comum de `ModalImportacao`. */
export function ModalEnviarRelatorio({
  onFechar,
  onImportado,
}: Propriedades) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const timeoutFeedbackRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);
  const proximaChaveFeedbackRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timeoutFeedbackRef.current) {
        clearTimeout(timeoutFeedbackRef.current);
      }
    };
  }, []);

  function fecharFeedback() {
    if (timeoutFeedbackRef.current) {
      clearTimeout(timeoutFeedbackRef.current);
      timeoutFeedbackRef.current = null;
    }

    setFeedback(null);
  }

  function exibirFeedback(
    tipo: TipoMensagemUpload,
    mensagem: string
  ) {
    if (timeoutFeedbackRef.current) {
      clearTimeout(timeoutFeedbackRef.current);
    }

    proximaChaveFeedbackRef.current += 1;

    setFeedback({
      tipo,
      mensagem,
      chave: proximaChaveFeedbackRef.current,
    });

    // Erros permanecem visíveis para o usuário ler as orientações de recuperação.
    if (tipo === 'sucesso') {
      timeoutFeedbackRef.current = setTimeout(() => {
        setFeedback(null);
        timeoutFeedbackRef.current = null;
      }, DURACAO_MENSAGEM_MS);
    }
  }

  async function enviar(arquivo: File): Promise<boolean> {
    fecharFeedback();

    try {
      const resultado = await importarManifesto(arquivo);

      const mensagemImportadas = resultado.viagensImportadas === 1
        ? '1 viagem importada com sucesso.'
        : `${resultado.viagensImportadas} viagens importadas com sucesso.`;
      const duplicadas = resultado.manifestosDuplicados;
      // Só a contagem: a lista de manifestos pode ter milhares de itens e quebra o layout.
      const mensagemDuplicadas = duplicadas.length > 0
        ? ` ${duplicadas.length} ${duplicadas.length === 1 ? 'manifesto já existia' : 'manifestos já existiam'} no banco.`
        : '';

      exibirFeedback(
        duplicadas.length > 0 ? 'aviso' : 'sucesso',
        `${mensagemImportadas}${mensagemDuplicadas}`
      );

      onImportado?.(resultado);
      return true;
    } catch (erro) {
      exibirFeedback(
        'erro',
        mensagemErroImportacao(erro)
      );
      return false;
    }
  }

  return (
    <ModalImportacao
      titulo="Importar manifesto"
      formatosAceitos=".csv ou .xlsx de até 10MB."
      accept=".csv,.xlsx"
      rotuloConfirmar="Importar manifesto"
      validarArquivo={validarArquivoRelatorio}
      onEnviar={enviar}
      onArquivoInvalido={(mensagem) => exibirFeedback('erro', mensagem)}
      onArquivoSelecionado={fecharFeedback}
      onFechar={onFechar}
      conteudo={
        feedback && (
          <MensagemFeedbackUpload
            key={feedback.chave}
            tipo={feedback.tipo}
            mensagem={feedback.mensagem}
            onFechar={fecharFeedback}
          />
        )
      }
    />
  );
}
