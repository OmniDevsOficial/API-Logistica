package com.ominidevs.autenticacao.auth.services;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ominidevs.autenticacao.auth.dto.UsuarioAutenticadoResponse;
import com.ominidevs.autenticacao.auth.entities.Perfil;
import com.ominidevs.autenticacao.auth.entities.Usuario;
import com.ominidevs.autenticacao.auth.exceptions.TokenInvalidoException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class TokenService {

    private static final int TAMANHO_MINIMO_SEGREDO = 32;

    private final SecretKey chave;
    private final Duration validade;
    private final Clock clock;

    public TokenService(
            @Value("${jwt.secret}") String segredo,
            @Value("${jwt.expiracao-minutos}") long expiracaoMinutos,
            Clock clock) {
        if (segredo == null || segredo.getBytes(StandardCharsets.UTF_8).length < TAMANHO_MINIMO_SEGREDO) {
            throw new IllegalStateException("JWT_SECRET deve ter pelo menos 32 caracteres.");
        }
        if (expiracaoMinutos <= 0) {
            throw new IllegalStateException("JWT_EXPIRACAO_MINUTOS deve ser maior que zero.");
        }
        this.chave = Keys.hmacShaKeyFor(segredo.getBytes(StandardCharsets.UTF_8));
        this.validade = Duration.ofMinutes(expiracaoMinutos);
        this.clock = clock;
    }

    public String gerar(Usuario usuario) {
        Instant agora = clock.instant();
        return Jwts.builder()
                .subject(usuario.getEmail())
                .claim("nome", usuario.getNome())
                .claim("perfil", usuario.getPerfil().name())
                .issuedAt(Date.from(agora))
                .expiration(Date.from(agora.plus(validade)))
                .signWith(chave, Jwts.SIG.HS256)
                .compact();
    }

    public UsuarioAutenticadoResponse ler(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(chave)
                    .clock(() -> Date.from(clock.instant()))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return new UsuarioAutenticadoResponse(
                    claims.getSubject(),
                    claims.get("nome", String.class),
                    Perfil.valueOf(claims.get("perfil", String.class)));
        } catch (JwtException | IllegalArgumentException | NullPointerException ex) {
            throw new TokenInvalidoException();
        }
    }
}