// src/features/enviar-relatorio/ui/ModalEnviarRelatorio.tsx
import { useState } from 'react';
import type { ReactNode } from 'react';

import { MensagemFeedbackUpload, ModalImportacao, ResumoImportacao } from '@shared/ui';
import type { ValidacaoArquivo } from '@shared/ui';

// ALTERAÇÃO: endpoint operacional que salva viagens, sem simulação.
import { importarManifesto, mensagemErroImportacao } from '../api/importarManifesto';
import type { ResultadoImportacao } from '../api/importarManifesto';
import { resumoImportacaoManifesto } from '../lib/resumoImportacaoManifesto';
import { validarArquivoRelatorio } from '../lib/validarArquivoRelatorio';

interface Propriedades {
  onFechar: () => void;
  onImportado?: (resultado: ResultadoImportacao) => void;
  titulo?: string;
  validarArquivo?: (arquivo: File) => ValidacaoArquivo | Promise<ValidacaoArquivo>;
  seletor?: (bloqueado: boolean) => ReactNode;
}

interface ErroTela {
  mensagem: string;
  chave: number;
}

/**
 * Importação do manifesto sobre a estrutura comum de `ModalImportacao`, no
 * mesmo padrão do modal de veículos: depois do envio mostra o resumo (cards e
 * tabelas de rejeitadas/já existentes) em vez de fechar.
 */
export function ModalEnviarRelatorio({
  onFechar,
  onImportado,
  titulo = 'Importar manifesto',
  validarArquivo = validarArquivoRelatorio,
  seletor,
}: Propriedades) {
  const [erro, setErro] = useState<ErroTela | null>(null);
  const [resultado, setResultado] = useState<ResultadoImportacao | null>(null);

  function exibirErro(mensagem: string) {
    setErro((anterior) => ({ mensagem, chave: (anterior?.chave ?? 0) + 1 }));
  }

  async function enviar(arquivo: File): Promise<boolean> {
    setErro(null);
    setResultado(null);

    try {
      const resposta = await importarManifesto(arquivo);
      setResultado(resposta);
      onImportado?.(resposta);
      return true;
    } catch (falha) {
      // Sem "Tentar de novo": o resultado pode ser incerto e reenviar duplicaria viagens.
      exibirErro(mensagemErroImportacao(falha));
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

      {resultado && <ResumoImportacao {...resumoImportacaoManifesto(resultado)} />}
    </>
  );

  return (
    <ModalImportacao
      titulo={titulo}
      formatosAceitos=".csv ou .xlsx de até 10MB."
      accept=".csv,.xlsx"
      rotuloConfirmar="Importar manifesto"
      rotuloFechar={resultado ? 'Fechar' : 'Cancelar'}
      instrucao={resultado ? 'Importar outra planilha' : undefined}
      areaCompacta={resultado !== null}
      validarArquivo={validarArquivo}
      seletor={seletor}
      onEnviar={enviar}
      onArquivoInvalido={(mensagem) => {
        setResultado(null);
        exibirErro(mensagem);
      }}
      onArquivoSelecionado={() => setErro(null)}
      onFechar={onFechar}
      conteudo={conteudo}
    />
  );
}
