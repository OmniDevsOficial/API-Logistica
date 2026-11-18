package com.ominidevs.autenticacao.perfil.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ominidevs.autenticacao.perfil.dto.AlterarFotoRequest;
import com.ominidevs.autenticacao.perfil.dto.AlterarNomeRequest;
import com.ominidevs.autenticacao.perfil.dto.PerfilAtualizadoResponse;
import com.ominidevs.autenticacao.perfil.dto.PerfilResponse;
import com.ominidevs.autenticacao.perfil.services.PerfilService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/perfil")
public class PerfilController {

    private final PerfilService service;

    public PerfilController(PerfilService service) {
        this.service = service;
    }

    @GetMapping
    public PerfilResponse buscar(@AuthenticationPrincipal Jwt usuario) {
        return service.buscar(usuario.getSubject());
    }

    @PatchMapping
    public PerfilAtualizadoResponse alterarNome(
            @Valid @RequestBody AlterarNomeRequest request,
            @AuthenticationPrincipal Jwt usuario) {
        return service.alterarNome(usuario.getSubject(), request);
    }

    @PatchMapping("/foto")
    public PerfilResponse alterarFoto(
            @Valid @RequestBody AlterarFotoRequest request,
            @AuthenticationPrincipal Jwt usuario) {
        return service.alterarFoto(usuario.getSubject(), request);
    }
}
