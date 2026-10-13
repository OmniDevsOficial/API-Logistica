package com.ominidevs.relatorio.seguranca;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

final class TokensDeTeste {

    static final String SEGREDO = "segredo-apenas-para-testes-com-mais-de-32-caracteres";

    private TokensDeTeste() {
    }

    static String valido(String perfil) {
        return gerar(SEGREDO, perfil, Instant.now().plusSeconds(3600));
    }

    static String expirado(String perfil) {
        return gerar(SEGREDO, perfil, Instant.now().minusSeconds(3600));
    }

    static String comOutraChave(String perfil) {
        return gerar("outra-chave-apenas-para-testes-com-mais-de-32-caracteres", perfil,
                Instant.now().plusSeconds(3600));
    }

    private static String gerar(String segredo, String perfil, Instant expiracao) {
        JWTClaimsSet.Builder claims = new JWTClaimsSet.Builder()
                .subject("usuario@newe.com.br")
                .claim("nome", "Usuário de Teste")
                .issueTime(Date.from(expiracao.minusSeconds(7200)))
                .expirationTime(Date.from(expiracao));
        if (perfil != null) {
            claims.claim("perfil", perfil);
        }

        try {
            SignedJWT jwt = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims.build());
            jwt.sign(new MACSigner(segredo.getBytes(StandardCharsets.UTF_8)));
            return jwt.serialize();
        } catch (JOSEException ex) {
            throw new IllegalStateException(ex);
        }
    }
}