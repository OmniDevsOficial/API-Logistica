package com.ominidevs.operacional.indicadores.services;

import com.ominidevs.operacional.indicadores.dto.ViagensPorMotoristaDTO;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.exceptions.FiltroInvalidoException;
import com.ominidevs.operacional.viagem.repositories.ViagemRepository;

import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
public class IndicadorService {

    private final ViagemRepository viagemRepository;

    public IndicadorService(ViagemRepository viagemRepository) {
        this.viagemRepository = viagemRepository;
    }

    public List<ViagensPorMotoristaDTO> contarViagensPorMotorista(String periodo) {

        YearMonth mes = converterPeriodo(periodo);

        return viagemRepository.contarViagensPorMotorista(
                mes.atDay(1),
                mes.atEndOfMonth()
        );
    }

    public List<Viagem> listarViagensDoMotorista(String cpfMotorista, String periodo) {

        if (cpfMotorista == null || cpfMotorista.isBlank()) {
            throw new FiltroInvalidoException(
                    "cpfMotorista é obrigatório"
            );
        }

        YearMonth mes = converterPeriodo(periodo);

        return viagemRepository.buscarPorMotoristaNoPeriodo(
                cpfMotorista.trim(),
                mes.atDay(1),
                mes.atEndOfMonth()
        );
    }

    private YearMonth converterPeriodo(String periodo) {

        if (periodo == null || periodo.isBlank()) {
            throw new FiltroInvalidoException(
                    "periodo é obrigatório e deve estar no formato YYYY-MM"
            );
        }

        try {
            return YearMonth.parse(periodo.trim());
        } catch (DateTimeParseException e) {
            throw new FiltroInvalidoException(
                    "periodo deve estar no formato YYYY-MM"
            );
        }
    }
}
