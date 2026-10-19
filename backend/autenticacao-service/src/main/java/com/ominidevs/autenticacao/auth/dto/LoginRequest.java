package com.ominidevs.autenticacao.auth.dto;

public record LoginRequest(String email, String senha) {

    @Override
    public String toString() {
        return "LoginRequest[email=" + email + ", senha=***]";
    }
}