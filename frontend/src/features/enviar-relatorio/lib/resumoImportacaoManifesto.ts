import type { ResumoImportacaoProps } from '@shared/ui';
import type { ResultadoImportacao } from '../api/importarManifesto';

const AVISO_DUPLICADO = 'Já existia no banco; não foi importado de novo.';

/**
 * Converte o resultado da importação do manifesto no resumo padrão de
 * importação (o mesmo usado pelo modal de veículos).
 *
 * @param resultado Retorno de `importarManifesto`.
 * @returns Mensagem, cards e tabelas de rejeitadas/duplicadas.
 */
export function resumoImportacaoManifesto(resultado: ResultadoImportacao): ResumoImportacaoProps {
  const rejeitadas = resultado.erros.length;
  const duplicadas = resultado.manifestosDuplicados.length;

  let mensagem = 'Importação concluída. Todas as linhas foram gravadas.';
  if (rejeitadas > 0) {
    mensagem = 'Importação concluída. As linhas rejeitadas abaixo não foram gravadas; as demais foram.';
  } else if (duplicadas > 0) {
    mensagem = 'Importação concluída. Os manifestos que já existiam no banco não foram importados de novo.';
  }

  return {
    mensagem,
    cards: [
      { rotulo: 'Importadas', valor: resultado.viagensImportadas },
      { rotulo: 'Já existentes', valor: duplicadas },
      { rotulo: 'Rejeitadas', valor: rejeitadas, destaque: rejeitadas > 0 },
    ],
    tabelas: [
      {
        titulo: 'Linhas rejeitadas',
        colunaChave: 'Manifesto',
        colunaMensagem: 'Motivo',
        tom: 'erro',
        ocorrencias: resultado.erros.map(({ linha, manifesto, mensagem: motivo }) => ({
          linha,
          chave: manifesto,
          mensagem: motivo,
        })),
      },
      {
        titulo: 'Manifestos já existentes (não gravados)',
        colunaChave: 'Manifesto',
        colunaMensagem: 'Aviso',
        tom: 'aviso',
        ocorrencias: resultado.manifestosDuplicados.map((manifesto) => ({
          linha: null,
          chave: manifesto,
          mensagem: AVISO_DUPLICADO,
        })),
      },
    ],
  };
}
