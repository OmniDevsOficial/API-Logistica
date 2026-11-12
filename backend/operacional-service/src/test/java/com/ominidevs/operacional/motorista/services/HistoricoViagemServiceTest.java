package com.ominidevs.operacional.motorista.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.ominidevs.operacional.motorista.dto.PaginaHistoricoViagensResponse;
import com.ominidevs.operacional.motorista.entities.Motorista;
import com.ominidevs.operacional.motorista.entities.StatusMotorista;
import com.ominidevs.operacional.motorista.exceptions.MotoristaNaoEncontradoException;
import com.ominidevs.operacional.motorista.exceptions.PaginacaoInvalidaException;
import com.ominidevs.operacional.motorista.model.StatusHistoricoViagem;
import com.ominidevs.operacional.motorista.projections.ViagemHistoricoLinha;
import com.ominidevs.operacional.motorista.repositories.HistoricoViagemConsultaRepository;
import com.ominidevs.operacional.motorista.repositories.MotoristaRepository;
import com.ominidevs.operacional.viagem.entities.StatusViagem;

class HistoricoViagemServiceTest {

    private static final String CPF = "001.234.567-89";
    private static final String NOME = "Ana Silva";

    private final MotoristaRepository motoristaRepository = mock(MotoristaRepository.class);
    private final HistoricoViagemConsultaRepository consulta = mock(HistoricoViagemConsultaRepository.class);
    private final HistoricoViagemService service = new HistoricoViagemService(motoristaRepository, consulta);

    private void motoristaExiste() {
        Motorista motorista = new Motorista(NOME, CPF, LocalDate.of(2026, 1, 1), StatusMotorista.DISPONIVEL);
        when(motoristaRepository.findById(1)).thenReturn(Optional.of(motorista));
    }

    private ViagemHistoricoLinha linha(int id, StatusViagem status) {
        return new ViagemHistoricoLinha(id, "M-" + id, "Jacareí", "Curitiba",
                LocalDate.of(2026, 10, 28), LocalDate.of(2026, 10, 30), status);
    }

    @Test
    @DisplayName("motorista inexistente lança 404 sem consultar viagens")
    void deveLancarQuandoMotoristaNaoExiste() {
        when(motoristaRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(MotoristaNaoEncontradoException.class, () -> service.listar(99, 0, 10));

        verifyNoInteractions(consulta);
    }

    @Test
    @DisplayName("FINALIZADO vira CONCLUIDA; EM_TRANSITO e PENDENTE viram EM_ANDAMENTO")
    void deveDerivarOStatus() {
        motoristaExiste();
        when(consulta.contar(CPF, NOME)).thenReturn(3L);
        when(consulta.listar(CPF, NOME, 10, 0L)).thenReturn(List.of(
                linha(1, StatusViagem.FINALIZADO),
                linha(2, StatusViagem.EM_TRANSITO),
                linha(3, StatusViagem.PENDENTE)));

        PaginaHistoricoViagensResponse pagina = service.listar(1, 0, 10);

        assertEquals(StatusHistoricoViagem.CONCLUIDA, pagina.viagens().get(0).status());
        assertEquals(StatusHistoricoViagem.EM_ANDAMENTO, pagina.viagens().get(1).status());
        assertEquals(StatusHistoricoViagem.EM_ANDAMENTO, pagina.viagens().get(2).status());
        assertEquals("M-1", pagina.viagens().get(0).manifesto());
        assertEquals(LocalDate.of(2026, 10, 30), pagina.viagens().get(0).previsaoChegada());
    }

    @Test
    @DisplayName("37 viagens com tamanho 10 dão 4 páginas e a página 3 é a última")
    void deveCalcularTotalDePaginas() {
        motoristaExiste();
        when(consulta.contar(CPF, NOME)).thenReturn(37L);
        when(consulta.listar(CPF, NOME, 10, 0L)).thenReturn(List.of(linha(1, StatusViagem.FINALIZADO)));
        when(consulta.listar(CPF, NOME, 10, 30L)).thenReturn(List.of(linha(2, StatusViagem.FINALIZADO)));

        PaginaHistoricoViagensResponse primeira = service.listar(1, 0, 10);
        PaginaHistoricoViagensResponse ultima = service.listar(1, 3, 10);

        assertEquals(4, primeira.totalPaginas());
        assertEquals(37, primeira.totalViagens());
        assertFalse(primeira.ultimaPagina());
        assertEquals(4, ultima.totalPaginas());
        assertTrue(ultima.ultimaPagina());
    }

    @Test
    @DisplayName("sem viagens devolve lista vazia sem consultar a página")
    void deveDevolverPaginaVaziaSemViagens() {
        motoristaExiste();
        when(consulta.contar(CPF, NOME)).thenReturn(0L);

        PaginaHistoricoViagensResponse pagina = service.listar(1, 0, 10);

        assertTrue(pagina.viagens().isEmpty());
        assertEquals(0, pagina.totalViagens());
        assertEquals(0, pagina.totalPaginas());
        assertTrue(pagina.ultimaPagina());
        verify(consulta, org.mockito.Mockito.never()).listar(anyString(), anyString(), anyInt(), anyLong());
    }

    @Test
    @DisplayName("recusa página negativa e tamanho fora de 1 a 50")
    void deveRecusarPaginacaoInvalida() {
        assertThrows(PaginacaoInvalidaException.class, () -> service.listar(1, -1, 10));
        assertThrows(PaginacaoInvalidaException.class, () -> service.listar(1, 0, 0));
        assertThrows(PaginacaoInvalidaException.class, () -> service.listar(1, 0, 51));

        verifyNoInteractions(motoristaRepository, consulta);
    }

    @Test
    @DisplayName("repassa o deslocamento pagina x tamanho")
    void deveRepassarODeslocamento() {
        motoristaExiste();
        when(consulta.contar(CPF, NOME)).thenReturn(100L);
        when(consulta.listar(CPF, NOME, 20, 40L)).thenReturn(List.of(linha(1, StatusViagem.FINALIZADO)));

        service.listar(1, 2, 20);

        verify(consulta).listar(CPF, NOME, 20, 40L);
    }
}
