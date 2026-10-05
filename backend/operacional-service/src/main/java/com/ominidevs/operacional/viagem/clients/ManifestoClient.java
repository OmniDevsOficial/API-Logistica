package com.ominidevs.operacional.viagem.clients;

import com.ominidevs.operacional.viagem.dto.ManifestoDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ManifestoClient {

    List<ManifestoDTO> enviar(MultipartFile file);
}