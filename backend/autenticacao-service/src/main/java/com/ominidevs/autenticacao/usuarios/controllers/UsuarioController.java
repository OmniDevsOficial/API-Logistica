package com.ominidevs.autenticacao.usuarios.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ominidevs.autenticacao.usuarios.dto.AlterarStatusRequest;
import com.ominidevs.autenticacao.usuarios.dto.CriarUsuarioRequest;
import com.ominidevs.autenticacao.usuarios.dto.UsuarioResponse;
import com.ominidevs.autenticacao.usuarios.services.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
@PreAuthorize("hasRole('GESTOR')")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse criar(@Valid @RequestBody CriarUsuarioRequest request) {
        return service.criar(request);
    }

    @GetMapping
    public List<UsuarioResponse> listar() {
        return service.listar();
    }

    @PatchMapping("/{id}/status")
    public UsuarioResponse alterarStatus(
            @PathVariable Integer id,
            @Valid @RequestBody AlterarStatusRequest request,
            @AuthenticationPrincipal Jwt gestor) {
        return service.alterarStatus(id, request, gestor.getSubject());
    }
}
