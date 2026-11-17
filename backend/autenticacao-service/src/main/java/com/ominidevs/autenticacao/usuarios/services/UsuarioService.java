package com.ominidevs.autenticacao.usuarios.services;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ominidevs.autenticacao.auth.entities.Perfil;
import com.ominidevs.autenticacao.auth.entities.Usuario;
import com.ominidevs.autenticacao.auth.repositories.UsuarioRepository;
import com.ominidevs.autenticacao.usuarios.dto.CriarUsuarioRequest;
import com.ominidevs.autenticacao.usuarios.dto.UsuarioResponse;
import com.ominidevs.autenticacao.usuarios.exceptions.CamposInvalidosException;
import com.ominidevs.autenticacao.usuarios.exceptions.EmailEmUsoException;

@Service
public class UsuarioService {

    private static final int LIMITE_BYTES_SENHA_BCRYPT = 72;
    private static final Sort POR_NOME = Sort.by(Sort.Order.asc("nome").ignoreCase(), Sort.Order.asc("id"));

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final Clock clock;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder, Clock clock) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.clock = clock;
    }

    @Transactional
    public UsuarioResponse criar(CriarUsuarioRequest request) {
        if (request.senha().getBytes(StandardCharsets.UTF_8).length > LIMITE_BYTES_SENHA_BCRYPT) {
            throw new CamposInvalidosException(Map.of("senha",
                    "A senha é longa demais. Use menos caracteres especiais ou acentuados."));
        }
        if (repository.existsByEmail(request.email())) {
            throw new EmailEmUsoException();
        }

        Usuario usuario = new Usuario(
                request.nome(),
                request.email(),
                passwordEncoder.encode(request.senha()),
                Perfil.valueOf(request.perfil()),
                clock.instant());

        try {
            return UsuarioResponse.de(repository.saveAndFlush(usuario));
        } catch (DataIntegrityViolationException ex) {
            throw new EmailEmUsoException();
        }
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return repository.findAll(POR_NOME).stream().map(UsuarioResponse::de).toList();
    }
}
