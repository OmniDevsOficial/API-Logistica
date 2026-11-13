package com.ominidevs.operacional.motorista.dto;

import java.util.List;

public record PaginaHistoricoViagensResponse(
        List<ViagemHistoricoResponse> viagens,
        int pagina,
        int tamanho,
        long totalViagens,
        int totalPaginas,
        boolean ultimaPagina) {}
