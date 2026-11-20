package com.ominidevs.autenticacao.perfil.services;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.ominidevs.autenticacao.auth.dto.UsuarioAutenticadoResponse;
import com.ominidevs.autenticacao.auth.entities.Perfil;
import com.ominidevs.autenticacao.auth.entities.Usuario;
import com.ominidevs.autenticacao.auth.repositories.UsuarioRepository;
import com.ominidevs.autenticacao.auth.services.TokenService;
import com.ominidevs.autenticacao.perfil.dto.AlterarFotoRequest;
import com.ominidevs.autenticacao.perfil.dto.AlterarNomeRequest;
import com.ominidevs.autenticacao.perfil.dto.PerfilAtualizadoResponse;
import com.ominidevs.autenticacao.perfil.dto.PerfilResponse;
import com.ominidevs.autenticacao.perfil.exceptions.PerfilNaoEncontradoException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PerfilServiceTest {

    private static final Instant AGORA = Instant.parse("2026-11-17T12:00:00Z");
    private static final String EMAIL = "ana@newe.com.br";
    private static final String FOTO = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";

    private final UsuarioRepository repository = mock(UsuarioRepository.class);
    private final TokenService tokenService = new TokenService(
            "segredo-apenas-para-testes-com-mais-de-32-caracteres", 60, Clock.fixed(AGORA, ZoneOffset.UTC));
    private final PerfilService service = new PerfilService(repository, tokenService);

    private Usuario ana;

    @BeforeEach
    void configurar() {
        ana = new Usuario("Ana Souza", EMAIL, "hash", Perfil.OPERADOR, AGORA);
        when(repository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(repository.findByEmail(EMAIL)).thenReturn(Optional.of(ana));
        when(repository.saveAndFlush(any(Usuario.class))).thenAnswer(chamada -> chamada.getArgument(0));
    }

    @Test
    void buscaOPerfilDoUsuarioLogado() {
        PerfilResponse perfil = service.buscar(EMAIL);

        assertEquals("Ana Souza", perfil.nome());
        assertEquals(EMAIL, perfil.email());
        assertEquals(Perfil.OPERADOR, perfil.perfil());
        assertEquals(AGORA, perfil.criadoEm());
        assertNull(perfil.foto());
    }

    @Test
    void usuarioQueNaoExisteMaisRecebeErro() {
        assertThrows(PerfilNaoEncontradoException.class, () -> service.buscar("sumiu@newe.com.br"));
    }

    @Test
    void alterarONomeGravaEDevolveUmTokenComONomeNovo() {
        PerfilAtualizadoResponse resposta = service.alterarNome(EMAIL, new AlterarNomeRequest("  Ana Lima "));

        assertEquals("Ana Lima", ana.getNome());
        assertEquals("Ana Lima", resposta.perfil().nome());
        UsuarioAutenticadoResponse token = tokenService.ler(resposta.token());
        assertEquals("Ana Lima", token.nome());
        assertEquals(EMAIL, token.email());
        assertEquals(Perfil.OPERADOR, token.perfil());
    }

    @Test
    void gravaEDepoisRemoveAFoto() {
        assertEquals(FOTO, service.alterarFoto(EMAIL, new AlterarFotoRequest(FOTO)).foto());
        assertEquals(FOTO, ana.getFoto());

        assertNull(service.alterarFoto(EMAIL, new AlterarFotoRequest(null)).foto());
        assertNull(ana.getFoto());
    }

    @Test
    void naoGravaNadaParaUsuarioInexistente() {
        assertThrows(PerfilNaoEncontradoException.class, () ->
                service.alterarFoto("sumiu@newe.com.br", new AlterarFotoRequest(FOTO)));
        verify(repository, never()).saveAndFlush(any(Usuario.class));
    }
}
