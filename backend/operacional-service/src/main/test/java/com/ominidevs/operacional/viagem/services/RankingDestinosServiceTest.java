package com.ominidevs.operacional.viagem.services;

import com.ominidevs.operacional.indicadores.exceptions.IndicadorInvalidoException;
import com.ominidevs.operacional.motorista.services.MotoristaService;
import com.ominidevs.operacional.viagem.clients.ManifestoClient;
import com.ominidevs.operacional.viagem.dto.RankingDestinoResponse;
import com.ominidevs.operacional.viagem.mappers.ManifestoMapper;
import com.ominidevs.operacional.viagem.repositories.ViagemRepository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Testes unitários do ranking de rotas por rentabilidade média: conversão das
 * datas em período fechado e validação dos parâmetros antes de consultar o banco.
 */
@ExtendWith(MockitoExtension.class)
class RankingDestinosServiceTest {

    @Mock
    private ManifestoClient manifestoClient;

    @Mock
    private ManifestoMapper manifestoMapper;

    @Mock
    private ViagemRepository viagemRepository;

    @Mock
    private MotoristaService motoristaService;

    @InjectMocks
    private ViagemService viagemService;

    @Test
    @DisplayName("Período informado é repassado ao banco com as datas convertidas")
    void periodoRepassadoAoBanco() {
        List<RankingDestinoResponse> ranking = List.of(
                new RankingDestinoResponse("Matriz", "Campinas", 3, new BigDecimal("250.00")));
        when(viagemRepository.rankingDestinosPorRentabilidade(
                LocalDate.of(2026, 1, 1), LocalDate.of(2026, 12, 31))).thenReturn(ranking);

        assertSame(ranking, viagemService.rankingDestinosPorRentabilidade("01/01/2026", "31/12/2026"));
    }

    @Test
    @DisplayName("Período sem viagens retorna lista vazia sem exceção")
    void periodoSemViagensRetornaListaVazia() {
        when(viagemRepository.rankingDestinosPorRentabilidade(any(), any())).thenReturn(List.of());

        assertTrue(viagemService.rankingDestinosPorRentabilidade("01/12/2026", "31/12/2026").isEmpty());
    }

    @ParameterizedTest
    @CsvSource(nullValues = "NULL", value = {
            "NULL, 31/12/2026",
            "01/01/2026, NULL",
            "2026-01-01, 31/12/2026",
            "31/02/2026, 31/12/2026",
            "31/12/2026, 01/01/2026"
    })
    @DisplayName("Data ausente, inválida ou início após o fim lança exceção sem consultar o banco")
    void periodoInvalidoNaoConsultaBanco(String dataInicio, String dataFim) {
        assertThrows(IndicadorInvalidoException.class,
                () -> viagemService.rankingDestinosPorRentabilidade(dataInicio, dataFim));

        verifyNoInteractions(viagemRepository);
    }
}
