package com.ominidevs.operacional.viagem.mappers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.DateTimeException;

import org.springframework.stereotype.Component;

import com.ominidevs.operacional.viagem.dto.ManifestoDTO;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;

@Component
public class ManifestoMapper {

    public Viagem toEntity(ManifestoDTO manifesto) {

        validarManifesto(manifesto);

        Viagem viagem = new Viagem(
                manifesto.getManifesto(),
                converterData(manifesto.getData()),
                manifesto.getMotorista(),
                manifesto.getCPF(),
                manifesto.getVeiculo(),
                converterTexto(manifesto.getOrigem()),
                converterTexto(manifesto.getDestino()),
                converterValor(manifesto.getValorFrete()),
                converterInteiro(manifesto.getKmSaida()),
                converterInteiro(manifesto.getKmChegada()),
                converterStatus(manifesto.getStatus()),
                manifesto.getObservacoes(),
                null
        );

        viagem.setReceitaFrete(converterValor(manifesto.getValorFretes()));
        viagem.setCustoFrete(converterValor(manifesto.getValorFrete()));
        viagem.setPedagio(converterValor(manifesto.getPedagio()));
        viagem.setVeiculoTipo(converterTexto(manifesto.getTipoVeiculo()));
        viagem.setDataPrevisaoChegada(converterDataOpcional(manifesto.getPrevisaoChegada()));

        return viagem;
    }

    private void validarManifesto(ManifestoDTO manifesto) {

        if (manifesto == null
                || estaVazio(manifesto.getManifesto())
                || estaVazio(manifesto.getData())) {

            throw new IllegalArgumentException(
                    "Manifesto inválido ou incompleto."
            );
        }
    }

    private boolean estaVazio(String valor) {
        return valor == null || valor.isBlank();
    }

    private LocalDate converterData(String valor) {

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd/MM/yyyy");

        try {
            return LocalDate.parse(valor.trim(), formatter);
        } catch (DateTimeException ex) {
            throw new IllegalArgumentException("Data inválida: " + valor, ex);
        }
    }

    private BigDecimal converterValor(String valor) {

        if (estaVazio(valor)) {
            return null;
        }

        String normalizado = valor.trim().replace("R$", "").replace(" ", "");
        if (normalizado.matches("[-+]?\\d{1,3}(\\.\\d{3})+(,\\d{1,2})?")) {
            normalizado = normalizado.replace(".", "").replace(',', '.');
        } else if (normalizado.matches("[-+]?\\d+(,\\d{1,2})?")) {
            normalizado = normalizado.replace(',', '.');
        } else if (normalizado.matches("[-+]?\\d+\\.\\d{1,2}")) {
            // Excel pode entregar decimais com ponto conforme a configuração regional.
        } else {
            throw new IllegalArgumentException("Valor monetário inválido: " + valor);
        }
        try {
            return new BigDecimal(normalizado).setScale(2);
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Valor monetário inválido: " + valor, ex);
        }
    }

    private Integer converterInteiro(String valor) {

        if (estaVazio(valor)) {
            return null;
        }

        return Integer.valueOf(valor.trim());
    }

    private String converterTexto(String valor) {

        if (estaVazio(valor)) {
            return null;
        }

        return valor.trim();
    }

    private LocalDate converterDataOpcional(String valor) {

        if (estaVazio(valor)) {
            return null;
        }

        return converterData(valor);
    }

    private StatusViagem converterStatus(String status) {

        if (estaVazio(status)) {
            return StatusViagem.PENDENTE;
        }

        String statusNormalizado = status
                .trim()
                .toLowerCase();

        return switch (statusNormalizado) {

            case "finalizado" ->
                    StatusViagem.FINALIZADO;

            case "em trânsito", "em transito" ->
                    StatusViagem.EM_TRANSITO;

            case "pendente" ->
                    StatusViagem.PENDENTE;

            default ->
                    throw new IllegalArgumentException(
                            "Status de viagem inválido: " + status
                    );
        };
    }
}
