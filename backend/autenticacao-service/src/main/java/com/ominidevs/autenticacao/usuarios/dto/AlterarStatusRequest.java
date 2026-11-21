package com.ominidevs.autenticacao.usuarios.dto;

import jakarta.validation.constraints.NotNull;

public record AlterarStatusRequest(
        @NotNull(message = "Informe o status.")
        Boolean ativo) {
}
