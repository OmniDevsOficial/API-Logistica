package com.ominidevs.autenticacao.perfil.dto;

import java.time.Instant;

import com.ominidevs.autenticacao.auth.entities.Perfil;
import com.ominidevs.autenticacao.auth.entities.Usuario;

public record PerfilResponse(
        Integer id,
        String nome,
        String email,
        Perfil perfil,
        boolean ativo,
        Instant criadoEm,
        String foto) {

    public static PerfilResponse de(Usuario usuario) {
        return new PerfilResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil(),
                usuario.isAtivo(),
                usuario.getDataCriacao(),
                usuario.getFoto());
    }
}
