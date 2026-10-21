package com.ominidevs.autenticacao.auth.services;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Base64;

import org.junit.jupiter.api.Test;

import com.ominidevs.autenticacao.auth.dto.UsuarioAutenticadoResponse;
import com.ominidevs.autenticacao.auth.entities.Perfil;
import com.ominidevs.autenticacao.auth.entities.Usuario;
import com.ominidevs.autenticacao.auth.exceptions.TokenInvalidoException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TokenServiceTest {

    private static final String SEGREDO = "segredo-de-teste-com-mais-de-32-caracteres";
    private static final Instant AGORA = Instant.parse("2026-10-12T12:00:00Z");
    private static final long VALIDADE_MINUTOS = 60;

    private final Usuario gestor = new Usuario("João Conceição", "gestor@newe.com.br", "hash", Perfil.GESTOR);

    private TokenService servicoEm(Instant instante) {
        return new TokenService(SEGREDO, VALIDADE_MINUTOS, Clock.fixed(instante, ZoneOffset.UTC));
    }

    private String payloadDe(String token) {
        return new String(Base64.getUrlDecoder().decode(token.split("\\.")[1]), StandardCharsets.UTF_8);
    }

    @Test
    void tokenCarregaIdentificacaoPerfilEExpiracao() {
        String payload = payloadDe(servicoEm(AGORA).gerar(gestor));

        assertTrue(payload.contains("\"sub\":\"gestor@newe.com.br\""));
        assertTrue(payload.contains("\"nome\":\"João Conceição\""));
        assertTrue(payload.contains("\"perfil\":\"GESTOR\""));
        assertTrue(payload.contains("\"exp\":" + AGORA.plus(Duration.ofMinutes(VALIDADE_MINUTOS)).getEpochSecond()));
    }

    @Test
    void tokenNaoCarregaASenha() {
        String payload = payloadDe(servicoEm(AGORA).gerar(gestor));

        assertTrue(!payload.contains("hash") && !payload.contains("senha"));
    }

    @Test
    void leOTokenDentroDaValidade() {
        String token = servicoEm(AGORA).gerar(gestor);

        UsuarioAutenticadoResponse usuario = servicoEm(AGORA.plus(Duration.ofMinutes(59))).ler(token);

        assertEquals("gestor@newe.com.br", usuario.email());
        assertEquals("João Conceição", usuario.nome());
        assertEquals(Perfil.GESTOR, usuario.perfil());
    }

    @Test
    void recusaTokenExpirado() {
        String token = servicoEm(AGORA).gerar(gestor);

        assertThrows(TokenInvalidoException.class,
                () -> servicoEm(AGORA.plus(Duration.ofMinutes(61))).ler(token));
    }

    @Test
    void recusaTokenAssinadoComOutraChave() {
        TokenService outroServico = new TokenService(
                "outro-segredo-de-teste-com-mais-de-32-caracteres", VALIDADE_MINUTOS,
                Clock.fixed(AGORA, ZoneOffset.UTC));

        assertThrows(TokenInvalidoException.class,
                () -> servicoEm(AGORA).ler(outroServico.gerar(gestor)));
    }

    @Test
    void recusaTokenMalformado() {
        assertThrows(TokenInvalidoException.class, () -> servicoEm(AGORA).ler("nao-e-um-token"));
    }

    @Test
    void recusaSegredoCurto() {
        assertThrows(IllegalStateException.class,
                () -> new TokenService("curto", VALIDADE_MINUTOS, Clock.fixed(AGORA, ZoneOffset.UTC)));
    }
}