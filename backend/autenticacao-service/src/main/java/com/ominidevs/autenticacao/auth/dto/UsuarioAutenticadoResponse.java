package com.ominidevs.autenticacao.auth.dto;

import com.ominidevs.autenticacao.auth.entities.Perfil;

public record UsuarioAutenticadoResponse(String email, String nome, Perfil perfil) {
}