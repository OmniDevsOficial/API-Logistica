package com.ominidevs.operacional.motorista.model;

import com.ominidevs.operacional.viagem.entities.StatusViagem;

public enum StatusHistoricoViagem {

    EM_ANDAMENTO,
    CONCLUIDA;

    public static StatusHistoricoViagem de(StatusViagem status) {
        return status == StatusViagem.FINALIZADO ? CONCLUIDA : EM_ANDAMENTO;
    }
}
