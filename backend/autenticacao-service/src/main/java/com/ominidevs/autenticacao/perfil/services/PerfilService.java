package com.ominidevs.autenticacao.perfil.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ominidevs.autenticacao.auth.entities.Usuario;
import com.ominidevs.autenticacao.auth.repositories.UsuarioRepository;
import com.ominidevs.autenticacao.auth.services.TokenService;
import com.ominidevs.autenticacao.perfil.dto.AlterarFotoRequest;
import com.ominidevs.autenticacao.perfil.dto.AlterarNomeRequest;
import com.ominidevs.autenticacao.perfil.dto.PerfilAtualizadoResponse;
import com.ominidevs.autenticacao.perfil.dto.PerfilResponse;
import com.ominidevs.autenticacao.perfil.exceptions.PerfilNaoEncontradoException;

@Service
public class PerfilService {

    private final UsuarioRepository repository;
    private final TokenService tokenService;

    public PerfilService(UsuarioRepository repository, TokenService tokenService) {
        this.repository = repository;
        this.tokenService = tokenService;
    }

    @Transactional(readOnly = true)
    public PerfilResponse buscar(String email) {
        return PerfilResponse.de(usuarioDo(email));
    }

    @Transactional
    public PerfilAtualizadoResponse alterarNome(String email, AlterarNomeRequest request) {
        Usuario usuario = usuarioDo(email);
        usuario.alterarNome(request.nome());
        Usuario salvo = repository.saveAndFlush(usuario);
        return new PerfilAtualizadoResponse(PerfilResponse.de(salvo), tokenService.gerar(salvo));
    }

    @Transactional
    public PerfilResponse alterarFoto(String email, AlterarFotoRequest request) {
        Usuario usuario = usuarioDo(email);
        usuario.alterarFoto(request.foto());
        return PerfilResponse.de(repository.saveAndFlush(usuario));
    }

    private Usuario usuarioDo(String email) {
        return repository.findByEmail(email).orElseThrow(PerfilNaoEncontradoException::new);
    }
}
