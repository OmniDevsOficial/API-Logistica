package com.ominidevs.autenticacao.perfil.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AlterarNomeRequest(
        @NotBlank(message = "Informe o nome.")
        @Size(max = 120, message = "O nome pode ter no máximo 120 caracteres.")
        String nome) {

    public AlterarNomeRequest {
        nome = nome == null ? null : nome.trim();
    }
}
