package com.ominidevs.autenticacao.usuarios.services;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ominidevs.autenticacao.auth.entities.Perfil;
import com.ominidevs.autenticacao.auth.entities.Usuario;
import com.ominidevs.autenticacao.auth.repositories.UsuarioRepository;
import com.ominidevs.autenticacao.usuarios.dto.CriarUsuarioRequest;
import com.ominidevs.autenticacao.usuarios.dto.UsuarioResponse;
import com.ominidevs.autenticacao.usuarios.exceptions.CamposInvalidosException;
import com.ominidevs.autenticacao.usuarios.exceptions.EmailEmUsoException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UsuarioServiceTest {

    private static final Instant AGORA = Instant.parse("2026-11-17T12:00:00Z");
    private static final String SENHA = "senha-forte-123";

    private final UsuarioRepository repository = mock(UsuarioRepository.class);
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(4);
    private final UsuarioService service =
            new UsuarioService(repository, passwordEncoder, Clock.fixed(AGORA, ZoneOffset.UTC));

    @BeforeEach
    void configurar() {
        when(repository.existsByEmail(anyString())).thenReturn(false);
        when(repository.saveAndFlush(any(Usuario.class))).thenAnswer(chamada -> chamada.getArgument(0));
    }

    private Usuario usuarioGravado() {
        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(repository).saveAndFlush(captor.capture());
        return captor.getValue();
    }

    @Test
    void gravaASenhaComoHashBcryptENuncaEmTexto() {
        service.criar(new CriarUsuarioRequest("Ana", "ana@newe.com.br", "OPERADOR", SENHA));

        Usuario gravado = usuarioGravado();
        assertNotEquals(SENHA, gravado.getSenhaHash());
        assertTrue(gravado.getSenhaHash().startsWith("$2"));
        assertTrue(passwordEncoder.matches(SENHA, gravado.getSenhaHash()));
    }

    @Test
    void normalizaNomeEEmailAntesDeVerificarEGravar() {
        service.criar(new CriarUsuarioRequest("  Ana Souza ", "  Ana@Newe.COM.br ", "GESTOR", SENHA));

        verify(repository).existsByEmail("ana@newe.com.br");
        Usuario gravado = usuarioGravado();
        assertEquals("Ana Souza", gravado.getNome());
        assertEquals("ana@newe.com.br", gravado.getEmail());
        assertEquals(Perfil.GESTOR, gravado.getPerfil());
    }

    @Test
    void novoUsuarioNasceAtivoComADataDoRelogio() {
        UsuarioResponse resposta = service.criar(new CriarUsuarioRequest("Ana", "ana@newe.com.br", "OPERADOR", SENHA));

        assertTrue(resposta.ativo());
        assertEquals(AGORA, resposta.criadoEm());
        assertEquals("ana@newe.com.br", resposta.email());
    }

    @Test
    void emailRepetidoComMaiusculaDiferenteRetornaConflito() {
        when(repository.existsByEmail("gestor@newe.com.br")).thenReturn(true);

        assertThrows(EmailEmUsoException.class, () ->
                service.criar(new CriarUsuarioRequest("Outro", "GESTOR@Newe.com.br", "OPERADOR", SENHA)));
        verify(repository, never()).saveAndFlush(any(Usuario.class));
    }

    @Test
    void violacaoDeUnicidadeNoBancoViraConflito() {
        when(repository.saveAndFlush(any(Usuario.class)))
                .thenThrow(new DataIntegrityViolationException("usuario_email_key"));

        assertThrows(EmailEmUsoException.class, () ->
                service.criar(new CriarUsuarioRequest("Ana", "ana@newe.com.br", "OPERADOR", SENHA)));
    }

    @Test
    void senhaAcimaDoLimiteDoBcryptViraErroDoCampoSenha() {
        String senhaComAcentos = "ç".repeat(40);

        CamposInvalidosException erro = assertThrows(CamposInvalidosException.class, () ->
                service.criar(new CriarUsuarioRequest("Ana", "ana@newe.com.br", "OPERADOR", senhaComAcentos)));

        assertTrue(erro.getCampos().containsKey("senha"));
        verify(repository, never()).saveAndFlush(any(Usuario.class));
    }

    @Test
    void listaOrdenadaPorNomeSemDiferenciarMaiusculas() {
        when(repository.findAll(any(Sort.class))).thenReturn(List.of(
                new Usuario("Ana", "ana@newe.com.br", "hash", Perfil.OPERADOR, AGORA)));

        List<UsuarioResponse> usuarios = service.listar();

        ArgumentCaptor<Sort> captor = ArgumentCaptor.forClass(Sort.class);
        verify(repository).findAll(captor.capture());
        Sort.Order porNome = captor.getValue().getOrderFor("nome");
        assertTrue(porNome.isAscending());
        assertTrue(porNome.isIgnoreCase());
        assertEquals("Ana", usuarios.get(0).nome());
    }
}
