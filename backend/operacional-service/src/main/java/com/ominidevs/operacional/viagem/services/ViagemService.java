package com.ominidevs.operacional.viagem.services;

import com.ominidevs.operacional.viagem.clients.ManifestoClient;
import com.ominidevs.operacional.viagem.dto.ManifestoDTO;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.mappers.ManifestoMapper;
import com.ominidevs.operacional.viagem.repositories.ViagemRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ViagemService {

    private final ManifestoClient manifestoClient;
    private final ManifestoMapper manifestoMapper;
    private final ViagemRepository viagemRepository;

    public ViagemService(
            ManifestoClient manifestoClient,
            ManifestoMapper manifestoMapper,
            ViagemRepository viagemRepository
    ) {
        this.manifestoClient = manifestoClient;
        this.manifestoMapper = manifestoMapper;
        this.viagemRepository = viagemRepository;
    }

    public List<Viagem> importarManifesto(MultipartFile file) {

        validarArquivo(file);

        List<ManifestoDTO> manifestos =
                manifestoClient.enviar(file);

        List<Viagem> viagens = manifestos.stream()
                .map(manifestoMapper::toEntity)
                .toList();

        return viagemRepository.saveAll(viagens);
    }

    private void validarArquivo(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "O arquivo não foi enviado ou está vazio."
            );
        }
    }
}