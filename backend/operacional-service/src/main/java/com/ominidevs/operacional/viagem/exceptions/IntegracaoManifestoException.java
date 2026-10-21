package com.ominidevs.operacional.viagem.exceptions;

import org.springframework.http.HttpStatus;

/** Mensagens controladas: nunca repassa o corpo de erro do serviço remoto ao usuário. */
public class IntegracaoManifestoException extends RuntimeException {
    public enum Falha {
        ARQUIVO_INVALIDO(HttpStatus.BAD_REQUEST, "O manifesto é inválido ou está incompleto. Confira o arquivo."),
        TAMANHO_EXCEDIDO(HttpStatus.valueOf(413), "O arquivo ultrapassa o tamanho permitido de 10 MB."),
        INDISPONIVEL(HttpStatus.SERVICE_UNAVAILABLE, "O serviço de processamento está indisponível. Tente novamente mais tarde."),
        RESPOSTA_INVALIDA(HttpStatus.BAD_GATEWAY, "Não foi possível interpretar a resposta do serviço de processamento.");

        private final HttpStatus status;
        private final String mensagem;

        Falha(HttpStatus status, String mensagem) {
            this.status = status;
            this.mensagem = mensagem;
        }
    }

    private final Falha falha;

    public IntegracaoManifestoException(Falha falha, Throwable causa) {
        super(falha.mensagem, causa);
        this.falha = falha;
    }

    public HttpStatus getStatus() {
        return falha.status;
    }
}
