package com.ominidevs.autenticacao.perfil.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AlterarFotoRequest(
        @Size(max = AlterarFotoRequest.TAMANHO_MAXIMO, message = "A foto é grande demais. Escolha uma imagem menor.")
        @Pattern(regexp = "^data:image/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$",
                message = "Envie uma imagem PNG, JPG ou WEBP.")
        String foto) {

    public static final int TAMANHO_MAXIMO = 400_000;
}
