package com.ominidevs.operacional.indicadores.services;

import com.ominidevs.operacional.indicadores.dto.ViagensPorMotoristaDTO;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.exceptions.FiltroInvalidoException;
import com.ominidevs.operacional.viagem.repositories.ViagemRepository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IndicadorServiceTest {

    @Mock
    private ViagemRepository viagemRepository;

    @InjectMocks
    private IndicadorService indicadorService;

    private static final LocalDate INICIO_SETEMBRO = LocalDate.of(2026, 9, 1);
    private static final LocalDate FIM_SETEMBRO = LocalDate.of(2026, 9, 30);

    private List<ViagensPorMotoristaDTO> totaisDeSetembro() {
        return List.of(
                new ViagensPorMotoristaDTO("12233245124", "João da Silva", 18L),
                new ViagensPorMotoristaDTO("98765432100", "Maria Souza", 7L)
        );
    }

    @Test
    @DisplayName("Critério 1: mesmo conjunto de dados deve produzir a mesma contagem em chamadas repetidas")
    void deveManterContagemConsistenteParaOMesmoConjuntoDeDados() {

        when(viagemRepository.contarViagensPorMotorista(INICIO_SETEMBRO, FIM_SETEMBRO))
                .thenReturn(totaisDeSetembro());

        List<ViagensPorMotoristaDTO> primeira =
                indicadorService.contarViagensPorMotorista("2026-09");

        List<ViagensPorMotoristaDTO> segunda =
                indicadorService.contarViagensPorMotorista("2026-09");

        assertEquals(primeira, segunda);
        assertEquals(18L, primeira.get(0).totalViagens());
        assertEquals("João da Silva", primeira.get(0).motorista());
    }

    @Test
    @DisplayName("Critério 2: deve converter o período informado no primeiro e no último dia do mês")
    void deveRecalcularAoVariarOPeriodo() {

        ArgumentCaptor<LocalDate> inicio = ArgumentCaptor.forClass(LocalDate.class);
        ArgumentCaptor<LocalDate> fim = ArgumentCaptor.forClass(LocalDate.class);

        when(viagemRepository.contarViagensPorMotorista(any(), any()))
                .thenReturn(List.of());

        indicadorService.contarViagensPorMotorista("2026-09");
        indicadorService.contarViagensPorMotorista("2026-02");

        verify(viagemRepository, times(2))
                .contarViagensPorMotorista(inicio.capture(), fim.capture());

        assertEquals(LocalDate.of(2026, 9, 1), inicio.getAllValues().get(0));
        assertEquals(LocalDate.of(2026, 9, 30), fim.getAllValues().get(0));

        assertEquals(LocalDate.of(2026, 2, 1), inicio.getAllValues().get(1));
        assertEquals(LocalDate.of(2026, 2, 28), fim.getAllValues().get(1));
    }

    @Test
    @DisplayName("Critério 3: motorista sem viagens no período deve permanecer na lista com total 0")
    void deveManterMotoristaSemViagensComTotalZero() {

        when(viagemRepository.contarViagensPorMotorista(INICIO_SETEMBRO, FIM_SETEMBRO))
                .thenReturn(List.of(
                        new ViagensPorMotoristaDTO("12233245124", "João da Silva", 18L),
                        new ViagensPorMotoristaDTO("55544433322", "Carlos Lima", 0L)
                ));

        List<ViagensPorMotoristaDTO> resultado =
                indicadorService.contarViagensPorMotorista("2026-09");

        assertEquals(2, resultado.size());

        ViagensPorMotoristaDTO semViagens = resultado.stream()
                .filter(linha -> linha.cpfMotorista().equals("55544433322"))
                .findFirst()
                .orElseThrow(() -> new AssertionError(
                        "Motorista sem viagens desapareceu da resposta"
                ));

        assertEquals(0L, semViagens.totalViagens());
    }

    @Test
    @DisplayName("Deve rejeitar período em formato inválido sem consultar o banco")
    void deveRejeitarPeriodoEmFormatoInvalido() {

        FiltroInvalidoException exception = assertThrows(
                FiltroInvalidoException.class,
                () -> indicadorService.contarViagensPorMotorista("setembro/2026")
        );

        assertEquals("periodo deve estar no formato YYYY-MM", exception.getMessage());
        verifyNoInteractions(viagemRepository);
    }

    @Test
    @DisplayName("Deve rejeitar período ausente sem consultar o banco")
    void deveRejeitarPeriodoAusente() {

        FiltroInvalidoException exception = assertThrows(
                FiltroInvalidoException.class,
                () -> indicadorService.contarViagensPorMotorista(null)
        );

        assertEquals(
                "periodo é obrigatório e deve estar no formato YYYY-MM",
                exception.getMessage()
        );
        verifyNoInteractions(viagemRepository);
    }

    @Test
    @DisplayName("Detalhamento deve consultar as viagens do CPF informado dentro do período")
    void deveListarViagensDoMotoristaNoPeriodo() {

        Viagem viagem = new Viagem(
                "MAN-001",
                LocalDate.of(2026, 9, 10),
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                new BigDecimal("1500.50"),
                null,
                null,
                StatusViagem.FINALIZADO,
                null
        );

        when(viagemRepository.buscarPorMotoristaNoPeriodo(
                eq("12233245124"), eq(INICIO_SETEMBRO), eq(FIM_SETEMBRO)))
                .thenReturn(List.of(viagem));

        List<Viagem> resultado =
                indicadorService.listarViagensDoMotorista("12233245124", "2026-09");

        assertEquals(1, resultado.size());
        assertEquals("MAN-001", resultado.get(0).getManifesto());
    }

    @Test
    @DisplayName("Detalhamento deve rejeitar CPF vazio sem consultar o banco")
    void deveRejeitarCpfVazioNoDetalhamento() {

        FiltroInvalidoException exception = assertThrows(
                FiltroInvalidoException.class,
                () -> indicadorService.listarViagensDoMotorista("   ", "2026-09")
        );

        assertEquals("cpfMotorista é obrigatório", exception.getMessage());
        verifyNoInteractions(viagemRepository);
    }
}
