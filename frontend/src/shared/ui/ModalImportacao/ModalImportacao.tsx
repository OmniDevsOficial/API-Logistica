// src/shared/ui/ModalImportacao/ModalImportacao.tsx
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, ReactNode } from "react";
import { FileSpreadsheet, RotateCcw, UploadCloud, X } from "lucide-react";

import { formatarTamanhoArquivo } from "../../lib/formatarTamanhoArquivo";

export interface ValidacaoArquivo {
  valido: boolean;
  mensagemErro?: string;
}

export interface ModalImportacaoProps {
  titulo: string;
  /** Formatos e limite exibidos na área de envio (ex.: ".csv de até 10MB."). */
  formatosAceitos: string;
  /** Atributo `accept` do seletor de arquivo (ex.: ".csv"). */
  accept: string;
  /** Texto do botão de envio (ex.: "Importar manifesto"). */
  rotuloConfirmar: string;
  /** Validação no cliente; arquivo inválido não é enviado. */
  validarArquivo: (arquivo: File) => ValidacaoArquivo | Promise<ValidacaoArquivo>;
  /**
   * Envia o arquivo. Deve tratar os próprios erros e devolver `true` para
   * limpar a seleção (sucesso) ou `false` para mantê-la e permitir reenviar.
   */
  onEnviar: (arquivo: File) => Promise<boolean>;
  /** Arquivo recusado pela validação do cliente. */
  onArquivoInvalido: (mensagem: string) => void;
  /** Novo arquivo válido selecionado (normalmente limpa mensagens anteriores). */
  onArquivoSelecionado?: (arquivo: File) => void;
  onFechar: () => void;
  /** Mensagens e resultados exibidos abaixo do título. */
  conteudo?: ReactNode;
  /**
   * Exibe "Tentar de novo" abaixo do conteúdo, reenviando o arquivo ainda
   * selecionado (ex.: após falha de rede). `onEnviar` deve devolver `false`
   * nesses casos para manter a seleção.
   */
  tentarDeNovo?: boolean;
  /** Texto principal da área de envio. */
  instrucao?: string;
  /** Texto do botão secundário do rodapé. */
  rotuloFechar?: string;
  /** Reduz a área de envio quando já há um resultado na tela. */
  areaCompacta?: boolean;
  seletor?: (bloqueado: boolean) => ReactNode;
}

const FOCO_PRIMARIO =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3355FF]";

/**
 * Estrutura comum dos modais de importação de planilha (manifesto, veículos):
 * seleção por clique ou arrastar, validação no cliente, cartão do arquivo,
 * trava de duplo envio e bloqueio do fechamento durante o envio.
 */
export function ModalImportacao({
  titulo,
  formatosAceitos,
  accept,
  rotuloConfirmar,
  validarArquivo,
  onEnviar,
  onArquivoInvalido,
  onArquivoSelecionado,
  onFechar,
  conteudo,
  tentarDeNovo = false,
  instrucao = "Escolha um arquivo ou arraste e solte aqui.",
  rotuloFechar = "Cancelar",
  areaCompacta = false,
  seletor,
}: ModalImportacaoProps) {
  const [arrastando, setArrastando] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  // Trava síncrona para impedir dois envios antes da atualização visual do React.
  const envioEmAndamentoRef = useRef(false);

  // Fechar a janela não cancela uma gravação no servidor. Aguarde sua resposta.
  function tentarFechar() {
    if (!envioEmAndamentoRef.current) onFechar();
  }

  useEffect(() => {
    function aoPressionarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape" && !envioEmAndamentoRef.current) onFechar();
    }
    window.addEventListener("keydown", aoPressionarTecla);
    return () => window.removeEventListener("keydown", aoPressionarTecla);
  }, [onFechar]);

  function removerArquivo() {
    setArquivoSelecionado(null);
    setArrastando(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function tratarNovoArquivo(arquivo: File) {
    if (envioEmAndamentoRef.current) return;
    const resultado = await validarArquivo(arquivo);

    if (!resultado.valido) {
      removerArquivo();
      onArquivoInvalido(resultado.mensagemErro ?? "Arquivo inválido.");
      return;
    }

    onArquivoSelecionado?.(arquivo);
    setArquivoSelecionado(arquivo);
  }

  function aoSoltarArquivo(evento: DragEvent<HTMLDivElement>) {
    evento.preventDefault();
    setArrastando(false);
    const arquivo = evento.dataTransfer.files[0];
    if (arquivo) void tratarNovoArquivo(arquivo);
  }

  function aoSelecionarPeloInput(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    if (arquivo) void tratarNovoArquivo(arquivo);
  }

  async function enviar() {
    if (!arquivoSelecionado || envioEmAndamentoRef.current) return;
    envioEmAndamentoRef.current = true;
    setEnviando(true);

    try {
      const limparSelecao = await onEnviar(arquivoSelecionado);
      if (limparSelecao) removerArquivo();
    } catch {
      // onEnviar deve tratar os próprios erros; por segurança mantém o arquivo para reenviar.
    } finally {
      envioEmAndamentoRef.current = false;
      setEnviando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50"
      onClick={tentarFechar}
    >
      <div
        className="flex max-h-[88vh] w-[92vw] max-w-[640px] flex-col gap-6 overflow-y-auto rounded-2xl bg-surface p-5 text-left shadow-2xl sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-busy={enviando}
        aria-labelledby="titulo-modal-importacao"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="titulo-modal-importacao" className="m-0 text-xl font-bold text-fg">
            {titulo}
          </h2>

          <button
            type="button"
            className={`flex cursor-pointer border-0 bg-transparent p-1 text-fg-muted transition-colors hover:text-fg ${FOCO_PRIMARIO}`}
            onClick={tentarFechar}
            disabled={enviando}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {seletor?.(enviando)}

        {conteudo}

        {tentarDeNovo && (
          <button
            type="button"
            className={`inline-flex cursor-pointer items-center gap-2 self-end rounded-full border border-gray-300 dark:border-border bg-transparent px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50 ${FOCO_PRIMARIO}`}
            onClick={enviar}
            disabled={!arquivoSelecionado || enviando}
          >
            <RotateCcw size={16} aria-hidden="true" />
            Tentar de novo
          </button>
        )}

        {!arquivoSelecionado ? (
          <div
            className={`flex flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 transition-colors duration-150 ${
              areaCompacta ? "py-6" : "py-14"
            } ${arrastando ? "border-[#3355FF] bg-[rgba(51,85,255,0.04)]" : "border-gray-300 dark:border-border"}`}
            onDragOver={(evento) => {
              evento.preventDefault();
              setArrastando(true);
            }}
            onDragLeave={() => setArrastando(false)}
            onDrop={aoSoltarArquivo}
          >
            <UploadCloud className="mb-2 h-10 w-10 text-fg-subtle" aria-hidden="true" />

            <p className="m-0 text-center font-semibold text-fg">{instrucao}</p>

            <p className="mb-3 mt-0 text-center text-sm text-fg-subtle">{formatosAceitos}</p>

            <button
              type="button"
              className={`cursor-pointer rounded-lg border border-gray-300 dark:border-border bg-transparent px-5 py-2 text-sm text-fg-muted transition-colors hover:bg-background hover:text-fg ${FOCO_PRIMARIO}`}
              onClick={() => inputRef.current?.click()}
            >
              Selecionar arquivo
            </button>

            <input
              ref={inputRef}
              type="file"
              accept={accept}
              hidden
              onChange={aoSelecionarPeloInput}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-border p-4">
            <FileSpreadsheet size={28} className="shrink-0 text-fg-subtle" aria-hidden="true" />

            <div className="flex min-w-0 flex-1 flex-col">
              <span className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-fg">
                {arquivoSelecionado.name}
              </span>
              <span className="text-[13px] text-fg-subtle">
                {formatarTamanhoArquivo(arquivoSelecionado.size)}
              </span>
            </div>

            <button
              type="button"
              className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-fg-subtle transition-colors hover:text-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="cursor-pointer rounded-full border border-gray-300 dark:border-border bg-transparent px-6 py-2.5 font-semibold text-fg-muted transition-colors hover:bg-background hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-subtle"
            onClick={tentarFechar}
            disabled={enviando}
          >
            {rotuloFechar}
          </button>

          <button
            type="button"
            className={`cursor-pointer rounded-full border-0 bg-[#3355FF] px-6 py-2.5 font-semibold text-white transition-colors enabled:hover:bg-[#2444E0] disabled:cursor-not-allowed disabled:bg-indigo-200 dark:disabled:bg-[#3355FF]/30 ${FOCO_PRIMARIO}`}
            onClick={enviar}
            disabled={!arquivoSelecionado || enviando}
          >
            {enviando ? "Importando..." : rotuloConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
