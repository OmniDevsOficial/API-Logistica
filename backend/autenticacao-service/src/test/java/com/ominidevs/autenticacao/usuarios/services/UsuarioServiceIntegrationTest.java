package com.ominidevs.autenticacao.usuarios.services;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.ominidevs.autenticacao.usuarios.dto.CriarUsuarioRequest;
import com.ominidevs.autenticacao.usuarios.dto.UsuarioResponse;
import com.ominidevs.autenticacao.usuarios.exceptions.EmailEmUsoException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, properties = {
        "spring.datasource.url=jdbc:tc:postgresql:17-alpine:///autenticacao?currentSchema=autenticacao",
        "spring.datasource.driver-class-name=org.testcontainers.jdbc.ContainerDatabaseDriver",
        "spring.datasource.username=test",
        "spring.datasource.password=test",
        "jwt.secret=segredo-apenas-para-testes-com-mais-de-32-caracteres"
})
@Transactional
class UsuarioServiceIntegrationTest {

    private static final String SENHA = "senha-forte-123";

    @Autowired
    private UsuarioService service;

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void migrationMantemOsUsuariosIniciaisAtivos() {
        List<UsuarioResponse> usuarios = service.listar();

        assertEquals(List.of("gestor@newe.com.br", "operador@newe.com.br"),
                usuarios.stream().map(UsuarioResponse::email).toList());
        assertTrue(usuarios.stream().allMatch(UsuarioResponse::ativo));
        assertTrue(usuarios.stream().allMatch(usuario -> usuario.criadoEm() != null));
    }

    @Test
    void cadastroGravaHashAtivoEApareceNaListaEmOrdemDeNome() {
        UsuarioResponse criado = service.criar(
                new CriarUsuarioRequest("ana souza", "Ana@Newe.com.br", "OPERADOR", SENHA));

        assertNotNull(criado.id());
        assertTrue(criado.ativo());
        String hash = jdbc.queryForObject(
                "SELECT senha_hash FROM autenticacao.usuario WHERE email = ?", String.class, "ana@newe.com.br");
        assertNotEquals(SENHA, hash);
        assertTrue(passwordEncoder.matches(SENHA, hash));

        assertEquals(List.of("ana souza", "Gestor", "Operador"),
                service.listar().stream().map(UsuarioResponse::nome).toList());
    }

    @Test
    void emailExistenteComMaiusculaDiferenteRetornaConflito() {
        assertThrows(EmailEmUsoException.class, () ->
                service.criar(new CriarUsuarioRequest("Outro", "GESTOR@NEWE.COM.BR", "GESTOR", SENHA)));
    }

    @Test
    void nomeDe120CaracteresCabeNaColuna() {
        String nome = "a".repeat(120);

        UsuarioResponse criado = service.criar(new CriarUsuarioRequest(nome, "longo@newe.com.br", "GESTOR", SENHA));

        assertEquals(120, criado.nome().length());
    }
}
