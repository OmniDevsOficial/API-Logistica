package com.ominidevs.autenticacao.auth.services;

import java.util.Locale;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ominidevs.autenticacao.auth.dto.LoginRequest;
import com.ominidevs.autenticacao.auth.dto.LoginResponse;
import com.ominidevs.autenticacao.auth.dto.UsuarioAutenticadoResponse;
import com.ominidevs.autenticacao.auth.entities.Usuario;
import com.ominidevs.autenticacao.auth.exceptions.CredenciaisInvalidasException;
import com.ominidevs.autenticacao.auth.exceptions.TokenInvalidoException;
import com.ominidevs.autenticacao.auth.repositories.UsuarioRepository;

@Service
public class AuthService {

    private static final String PREFIXO_BEARER = "Bearer ";

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final String hashDeComparacao;

    public AuthService(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder,
            TokenService tokenService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.hashDeComparacao = passwordEncoder.encode("usuario-inexistente");
    }

    public LoginResponse login(LoginRequest request) {
        if (request == null || emBranco(request.email()) || emBranco(request.senha())) {
            throw new CredenciaisInvalidasException();
        }

        String email = request.email().trim().toLowerCase(Locale.ROOT);
        Optional<Usuario> usuario = repository.findByEmail(email);
        String hash = usuario.map(Usuario::getSenhaHash).orElse(hashDeComparacao);
        boolean senhaConfere = passwordEncoder.matches(request.senha(), hash);

        if (usuario.isEmpty() || !senhaConfere) {
            throw new CredenciaisInvalidasException();
        }

        return new LoginResponse(tokenService.gerar(usuario.get()));
    }

    public UsuarioAutenticadoResponse validar(String autorizacao) {
        if (autorizacao == null || !autorizacao.startsWith(PREFIXO_BEARER)) {
            throw new TokenInvalidoException();
        }
        return tokenService.ler(autorizacao.substring(PREFIXO_BEARER.length()).trim());
    }

    private static boolean emBranco(String valor) {
        return valor == null || valor.isBlank();
    }
}