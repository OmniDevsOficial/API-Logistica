package com.ominidevs.operacional.viagem.services;

import com.ominidevs.operacional.motorista.services.MotoristaService;
import com.ominidevs.operacional.viagem.clients.ManifestoClient;
import com.ominidevs.operacional.viagem.dto.RankingDestinoResponse;
import com.ominidevs.operacional.viagem.exceptions.FiltroInvalidoException;
import com.ominidevs.operacional.viagem.mappers.ManifestoMapper;
import com.ominidevs.operacional.viagem.repositories.ViagemRepository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Testes unitários do ranking de destinos por rentabilidade média: conversão do
 * mês em período fechado e validação do parâmetro antes de consultar o banco.
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
    @DisplayName("Mês informado consulta do primeiro ao último dia e repassa o ranking")
    void mesConsultaPeriodoCompleto() {
        List<RankingDestinoResponse> ranking = List.of(
                new RankingDestinoResponse("Campinas", 3, new BigDecimal("250.00")));
        when(viagemRepository.rankingDestinosPorRentabilidade(
                LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30))).thenReturn(ranking);

        assertSame(ranking, viagemService.rankingDestinosPorRentabilidade("2026-09"));
    }

    @Test
    @DisplayName("Fevereiro bissexto termina no dia 29")
    void fevereiroBissextoTerminaNoDia29() {
        viagemService.rankingDestinosPorRentabilidade("2024-02");

        verify(viagemRepository).rankingDestinosPorRentabilidade(
                LocalDate.of(2024, 2, 1), LocalDate.of(2024, 2, 29));
    }

    @Test
    @DisplayName("Mês sem viagens retorna lista vazia sem exceção")
    void mesSemViagensRetornaListaVazia() {
        when(viagemRepository.rankingDestinosPorRentabilidade(any(), any())).thenReturn(List.of());

        assertTrue(viagemService.rankingDestinosPorRentabilidade("2026-12").isEmpty());
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = { "   ", "2026-13", "09/2026", "2026-9", "setembro" })
    @DisplayName("Mês ausente ou inválido lança exceção sem consultar o banco")
    void mesInvalidoNaoConsultaBanco(String mes) {
        assertThrows(FiltroInvalidoException.class,
                () -> viagemService.rankingDestinosPorRentabilidade(mes));

        verifyNoInteractions(viagemRepository);
    }
}
