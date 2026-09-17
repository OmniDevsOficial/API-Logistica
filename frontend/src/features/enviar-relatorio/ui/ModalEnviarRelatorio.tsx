// src/features/enviar-relatorio/ui/ModalEnviarRelatorio.tsx
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  X,
} from 'lucide-react';

import { enviarRelatorio } from '../../../entities/relatorio/api/enviarRelatorio';
import { formatarTamanhoArquivo } from '../lib/formatarTamanhoArquivo';
import { validarArquivoRelatorio } from '../lib/validarArquivoRelatorio';
import {
  MensagemFeedbackUpload,
  type TipoMensagemUpload,
} from './MensagemFeedbackUpload';

interface Propriedades {
  onFechar: () => void;
}

interface Feedback {
  tipo: TipoMensagemUpload;
  mensagem: string;
  chave: number;
}

const DURACAO_MENSAGEM_MS = 5000;

export function ModalEnviarRelatorio({
  onFechar,
}: Propriedades) {
  const [arrastando, setArrastando] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] =
    useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
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

    timeoutFeedbackRef.current = setTimeout(() => {
      setFeedback(null);
      timeoutFeedbackRef.current = null;
    }, DURACAO_MENSAGEM_MS);
  }

  function tratarNovoArquivo(arquivo: File) {
    const resultado = validarArquivoRelatorio(arquivo);

    if (!resultado.valido) {
      if (inputRef.current) {
        inputRef.current.value = '';
      }

      exibirFeedback(
        'erro',
        resultado.mensagemErro ?? 'Arquivo inválido.'
      );

      return;
    }

    fecharFeedback();
    setArquivoSelecionado(arquivo);
  }

  function removerArquivo() {
    setArquivoSelecionado(null);
    setArrastando(false);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  function aoSoltarArquivo(
    evento: DragEvent<HTMLDivElement>
  ) {
    evento.preventDefault();
    setArrastando(false);

    const arquivo = evento.dataTransfer.files[0];

    if (arquivo) {
      tratarNovoArquivo(arquivo);
    }
  }

  function aoSelecionarPeloInput(
    evento: ChangeEvent<HTMLInputElement>
  ) {
    const arquivo = evento.target.files?.[0];

    if (arquivo) {
      tratarNovoArquivo(arquivo);
    }
  }

  async function aoConfirmar() {
    if (!arquivoSelecionado || enviando) return;

    try {
      setEnviando(true);

      const dados = await enviarRelatorio(arquivoSelecionado);

      removerArquivo();

      exibirFeedback(
        'sucesso',
        `Relatório enviado com sucesso! ${dados.length} registros processados.`
      );
    } catch (erro) {
      exibirFeedback(
        'erro',
        erro instanceof Error
          ? erro.message
          : 'Não foi possível enviar o relatório.'
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      className="
        fixed inset-0 z-[1000]
        flex items-center justify-center
        bg-black/50
      "
      onClick={onFechar}
    >
      <div
        className="
          flex max-h-[88vh] w-[92vw] max-w-[640px]
          flex-col gap-6 overflow-y-auto
          rounded-2xl bg-white p-5 text-left
          shadow-2xl
          sm:p-7
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-upload"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2
            id="titulo-upload"
            className="m-0 text-xl font-bold text-gray-900"
          >
            Upload
          </h2>

          <button
            type="button"
            className="
              flex cursor-pointer border-0 bg-transparent p-1
              text-gray-500 transition-colors
              hover:text-gray-700
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-[#3355FF]
            "
            onClick={onFechar}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {feedback && (
          <MensagemFeedbackUpload
            key={feedback.chave}
            tipo={feedback.tipo}
            mensagem={feedback.mensagem}
            onFechar={fecharFeedback}
          />
        )}

        {!arquivoSelecionado ? (
          <div
            className={`
              flex flex-col items-center gap-2
              rounded-xl border-2 border-dashed
              px-6 py-14
              transition-colors duration-150
              ${
                arrastando
                  ? 'border-[#3355FF] bg-[rgba(51,85,255,0.04)]'
                  : 'border-gray-300'
              }
            `}
            onDragOver={(evento) => {
              evento.preventDefault();
              setArrastando(true);
            }}
            onDragLeave={() => setArrastando(false)}
            onDrop={aoSoltarArquivo}
          >
            <UploadCloud
              className="mb-2 h-10 w-10 text-gray-400"
              aria-hidden="true"
            />

            <p className="m-0 text-center font-semibold text-gray-900">
              Escolha um arquivo ou arraste e solte aqui.
            </p>

            <p className="mb-3 mt-0 text-center text-sm text-gray-400">
              .csv ou .xlsx de até 10MB.
            </p>

            <button
              type="button"
              className="
                cursor-pointer rounded-lg border border-gray-300
                bg-transparent px-5 py-2
                text-sm text-gray-500
                transition-colors
                hover:bg-gray-50 hover:text-gray-700
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#3355FF]
              "
              onClick={() => inputRef.current?.click()}
            >
              Navegador por arquivos
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx"
              hidden
              onChange={aoSelecionarPeloInput}
            />
          </div>
        ) : (
          <div
            className="
              flex items-center gap-3
              rounded-xl border border-gray-200 p-4
            "
          >
            <FileSpreadsheet
              size={28}
              className="shrink-0 text-gray-400"
              aria-hidden="true"
            />

            <div className="flex min-w-0 flex-1 flex-col">
              <span
                className="
                  overflow-hidden text-ellipsis whitespace-nowrap
                  font-semibold text-gray-900
                "
              >
                {arquivoSelecionado.name}
              </span>

              <span className="text-[13px] text-gray-400">
                {formatarTamanhoArquivo(arquivoSelecionado.size)}
              </span>
            </div>

            <button
              type="button"
              className="
                shrink-0 cursor-pointer border-0 bg-transparent p-0
                text-gray-400 transition-colors
                hover:text-red-500
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-red-500
                disabled:cursor-not-allowed disabled:opacity-50
              "
              onClick={removerArquivo}
              disabled={enviando}
              aria-label="Remover arquivo"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="
              cursor-pointer rounded-full border border-gray-300
              bg-transparent px-6 py-2.5
              font-semibold text-gray-500
              transition-colors
              hover:bg-gray-50 hover:text-gray-700
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-gray-400
            "
            onClick={onFechar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="
              cursor-pointer rounded-full border-0
              bg-[#3355FF] px-6 py-2.5
              font-semibold text-white
              transition-colors
              enabled:hover:bg-[#2444E0]
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-[#3355FF]
              disabled:cursor-not-allowed
              disabled:bg-indigo-200
            "
            onClick={aoConfirmar}
            disabled={!arquivoSelecionado || enviando}
          >
            {enviando ? 'Enviando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}