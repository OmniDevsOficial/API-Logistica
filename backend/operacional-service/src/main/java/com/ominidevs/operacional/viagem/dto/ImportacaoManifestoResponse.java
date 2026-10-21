package com.ominidevs.operacional.viagem.dto;

import java.util.List;
import com.ominidevs.operacional.viagem.entities.Viagem;

public record ImportacaoManifestoResponse(
        List<Viagem> viagensImportadas,
        List<String> manifestosDuplicados,
        List<ErroLinhaImportacao> erros) {
    public ImportacaoManifestoResponse(List<Viagem> viagensImportadas, List<String> manifestosDuplicados) {
        this(viagensImportadas, manifestosDuplicados, List.of());
    }
}
