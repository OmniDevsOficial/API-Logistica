package com.ominidevs.autenticacao.usuarios.dto;

import java.util.Locale;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CriarUsuarioRequest(
        @NotBlank(message = "Informe o nome.")
        @Size(max = 120, message = "O nome pode ter no máximo 120 caracteres.")
        String nome,

        @NotBlank(message = "Informe o e-mail.")
        @Size(max = 120, message = "O e-mail pode ter no máximo 120 caracteres.")
        @Pattern(regexp = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", message = "Informe um e-mail válido.")
        String email,

        @NotBlank(message = "Selecione o perfil.")
        @Pattern(regexp = "GESTOR|OPERADOR", message = "O perfil deve ser GESTOR ou OPERADOR.")
        String perfil,

        @NotEmpty(message = "Informe a senha.")
        @Size(min = 8, max = 72, message = "A senha precisa ter entre 8 e 72 caracteres.")
        String senha) {

    public CriarUsuarioRequest {
        nome = nome == null ? null : nome.trim();
        email = email == null ? null : email.trim().toLowerCase(Locale.ROOT);
    }

    @Override
    public String toString() {
        return "CriarUsuarioRequest[nome=" + nome + ", email=" + email + ", perfil=" + perfil + ", senha=***]";
    }
}
