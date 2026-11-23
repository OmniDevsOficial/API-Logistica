package com.ominidevs.operacional.veiculo.exceptions;

/**
 * Arquivo de veículos rejeitado por inteiro (extensão, tamanho, vazio ou
 * cabeçalho sem as colunas obrigatórias). Resulta em HTTP 400.
 */
public class ArquivoVeiculoInvalidoException extends RuntimeException {

    public ArquivoVeiculoInvalidoException(String mensagem) {
        super(mensagem);
    }

    public ArquivoVeiculoInvalidoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
