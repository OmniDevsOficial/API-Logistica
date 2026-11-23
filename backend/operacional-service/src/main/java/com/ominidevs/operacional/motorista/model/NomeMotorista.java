package com.ominidevs.operacional.motorista.model;

import java.text.Normalizer;
import java.util.Locale;

/**
 * Regras de comparação e exibição do nome do motorista.
 *
 * <p>As planilhas de manifesto e de veículos escrevem o mesmo nome com caixa,
 * acentos e espaços diferentes ("JHONATA  TREVAS" e "Jhonata Trevas"). A
 * chave gerada aqui é a forma usada para reconhecer que são a mesma pessoa.
 */
public final class NomeMotorista {

    private NomeMotorista() {
    }

    /**
     * Remove espaços nas pontas e reduz espaços internos repetidos a um só.
     *
     * @param nome nome como veio do arquivo.
     * @return nome limpo, ou {@code null} quando vazio.
     */
    public static String limpar(String nome) {
        if (nome == null) {
            return null;
        }
        String limpo = nome.strip().replaceAll("\\s+", " ");
        return limpo.isEmpty() ? null : limpo;
    }

    /**
     * Gera a chave de comparação: minúsculas, sem acentos e com espaços
     * normalizados. Deve casar com a normalização feita em
     * {@code MotoristaRepository.buscarSemCpfPorChaveNome}.
     *
     * @param nome nome como veio do arquivo.
     * @return chave de comparação, ou {@code null} quando o nome for vazio.
     */
    public static String chave(String nome) {
        String limpo = limpar(nome);
        if (limpo == null) {
            return null;
        }
        return Normalizer.normalize(limpo, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT);
    }
}
