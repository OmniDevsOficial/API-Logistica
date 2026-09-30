package com.ominidevs.operacional.viagem.services;

import com.ominidevs.operacional.viagem.clients.ManifestoClient;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.exceptions.FiltroInvalidoException;
import com.ominidevs.operacional.viagem.mappers.ManifestoMapper;
import com.ominidevs.operacional.viagem.repositories.ViagemRepository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Testes unitários do filtro de viagens (GET /viagens - OM-76).
 * Cobre os cenários dos critérios de aceite:
 * 1. Filtros combinados (destino + mês, e demais) delegam ao repository
 * 2. Sem resultado -> lista vazia, sem exceção
 * 3. Sem nenhum filtro informado -> busca tudo
 * 4. Parâmetros inválidos (mês fora do formato, freteMin > freteMax) -> exceção, sem consultar o banco
 */
@ExtendWith(MockitoExtension.class)
class ViagemServiceTest {

    @Mock
    private ManifestoClient manifestoClient;

    @Mock
    private ManifestoMapper manifestoMapper;

    @Mock
    private ViagemRepository viagemRepository;

    @InjectMocks
    private ViagemService viagemService;

    private Viagem criarViagem() {
        return new Viagem(
                "MAN-001",
                LocalDate.of(2026, 9, 10),
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                new BigDecimal("1500.50"),
                null,
                null,
                StatusViagem.PENDENTE,
                null
        );
    }

    @Test
    @DisplayName("Deve retornar as viagens do repository ao combinar destino, status, frete e mês")
    void deveFiltrarComTodosOsParametrosCombinados() {

        when(viagemRepository.findAll(any(Specification.class)))
                .thenReturn(List.of(criarViagem()));

        List<Viagem> resultado = viagemService.filtrar(
                "São Paulo",
                List.of(StatusViagem.PENDENTE),
                new BigDecimal("1000.00"),
                new BigDecimal("2000.00"),
                "2026-09"
        );

        assertEquals(1, resultado.size());
        verify(viagemRepository).findAll(any(Specification.class));
    }

    @Test
    @DisplayName("Deve retornar lista vazia sem lançar exceção quando não há resultado")
    void deveRetornarListaVaziaSemErroQuandoNaoHaResultado() {

        when(viagemRepository.findAll(any(Specification.class)))
                .thenReturn(List.of());

        List<Viagem> resultado = viagemService.filtrar(
                "Destino inexistente", null, null, null, null
        );

        assertTrue(resultado.isEmpty());
    }

    @Test
    @DisplayName("Deve buscar todas as viagens quando nenhum filtro é informado")
    void deveFuncionarSemNenhumFiltro() {

        when(viagemRepository.findAll(any(Specification.class)))
                .thenReturn(List.of(criarViagem()));

        List<Viagem> resultado = viagemService.filtrar(null, null, null, null, null);

        assertEquals(1, resultado.size());
        verify(viagemRepository).findAll(any(Specification.class));
    }

    @Test
    @DisplayName("Deve rejeitar mês em formato inválido sem consultar o banco")
    void deveRejeitarMesEmFormatoInvalido() {

        FiltroInvalidoException exception = assertThrows(
                FiltroInvalidoException.class,
                () -> viagemService.filtrar(null, null, null, null, "setembro/2026")
        );

        assertEquals("mes deve estar no formato YYYY-MM", exception.getMessage());
        verifyNoInteractions(viagemRepository);
    }

    @Test
    @DisplayName("Deve rejeitar freteMin maior que freteMax sem consultar o banco")
    void deveRejeitarFaixaDeFreteInvalida() {

        FiltroInvalidoException exception = assertThrows(
                FiltroInvalidoException.class,
                () -> viagemService.filtrar(
                        null, null, new BigDecimal("2000.00"), new BigDecimal("1000.00"), null
                )
        );

        assertEquals("freteMin não pode ser maior que freteMax", exception.getMessage());
        verifyNoInteractions(viagemRepository);
    }
}
