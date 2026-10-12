package com.ominidevs.autenticacao.auth.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ominidevs.autenticacao.auth.dto.LoginRequest;
import com.ominidevs.autenticacao.auth.dto.LoginResponse;
import com.ominidevs.autenticacao.auth.dto.UsuarioAutenticadoResponse;
import com.ominidevs.autenticacao.auth.services.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return service.login(request);
    }

    @GetMapping("/validar")
    public UsuarioAutenticadoResponse validar(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String autorizacao) {
        return service.validar(autorizacao);
    }
}