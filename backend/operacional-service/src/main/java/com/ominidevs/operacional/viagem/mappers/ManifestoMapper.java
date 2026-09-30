package com.ominidevs.operacional.viagem.mappers;

import com.ominidevs.operacional.viagem.dto.ManifestoDTO;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
public class ManifestoMapper {

    public Viagem toEntity(ManifestoDTO manifesto) {

        validarManifesto(manifesto);

        return new Viagem(
                manifesto.getManifesto(),
                converterData(manifesto.getData()),
                manifesto.getMotorista(),
                manifesto.getCPF(),
                manifesto.getVeiculo(),
                converterDestino(manifesto.getDestino()),
                converterValor(manifesto.getValorFrete()),
                converterInteiro(manifesto.getKmSaida()),
                converterInteiro(manifesto.getKmChegada()),
                converterStatus(manifesto.getStatus()),
                manifesto.getObservacoes()
        );
    }

    private void validarManifesto(ManifestoDTO manifesto) {

        if (manifesto == null
                || estaVazio(manifesto.getManifesto())
                || estaVazio(manifesto.getData())
                || estaVazio(manifesto.getValorFrete())) {

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

        return LocalDate.parse(
                valor.trim(),
                formatter
        );
    }

    private BigDecimal converterValor(String valor) {

        if (estaVazio(valor)) {
            return null;
        }

        String valorNormalizado = valor
                .trim()
                .replace(".", "")
                .replace(",", ".");

        return new BigDecimal(valorNormalizado);
    }

    private Integer converterInteiro(String valor) {

        if (estaVazio(valor)) {
            return null;
        }

        return Integer.valueOf(valor.trim());
    }

    private String converterDestino(String destino) {

        if (estaVazio(destino)) {
            return null;
        }

        return destino.trim();
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