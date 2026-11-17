package com.ominidevs.autenticacao.usuarios.dto;

import java.time.Instant;

import com.ominidevs.autenticacao.auth.entities.Perfil;
import com.ominidevs.autenticacao.auth.entities.Usuario;

public record UsuarioResponse(
        Integer id,
        String nome,
        String email,
        Perfil perfil,
        boolean ativo,
        Instant criadoEm) {

    public static UsuarioResponse de(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil(),
                usuario.isAtivo(),
                usuario.getDataCriacao());
    }
}
