package com.ominidevs.operacional.motorista.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.ArgumentCaptor;

import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.motorista.entities.Motorista;
import com.ominidevs.operacional.motorista.entities.StatusMotorista;
import com.ominidevs.operacional.motorista.exceptions.MotoristaNaoEncontradoException;
import com.ominidevs.operacional.motorista.projections.MotoristaListagem;
import com.ominidevs.operacional.motorista.projections.MotoristaStatusContagem;
import com.ominidevs.operacional.motorista.repositories.MotoristaConsultaRepository;
import com.ominidevs.operacional.motorista.repositories.MotoristaRepository;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;

class MotoristaServiceTest {

    private final MotoristaRepository repository = mock(MotoristaRepository.class);
    private final MotoristaConsultaRepository consultaRepository = mock(MotoristaConsultaRepository.class);
    private final MotoristaService service = new MotoristaService(repository, consultaRepository);
    private final PeriodoConsulta periodo = PeriodoConsulta.parse("01/09/2026", "10/09/2026");

    private Viagem viagem(String motorista, String cpf, LocalDate data, String destino) {
        return viagem(motorista, cpf, data, destino, StatusViagem.PENDENTE, "ABC1D23", "Caminhão", null);
    }

    private Viagem viagem(
            String motorista,
            String cpf,
            LocalDate data,
            String destino,
            StatusViagem statusViagem,
            String veiculo,
            String veiculoTipo,
            LocalDate previsaoChegada
    ) {
        Viagem viagem = new Viagem(
                "MAN-001", data, motorista, cpf, veiculo, "São Paulo", destino,
                new BigDecimal("1500.50"), null, null, statusViagem, null, null
        );
        viagem.setVeiculoTipo(veiculoTipo);
        viagem.setDataPrevisaoChegada(previsaoChegada);
        return viagem;
    }

    private MotoristaListagem linhaCompleta() {
        return new MotoristaListagem(1, "Ana", "Caminhão", "ABC1D23", "DISPONIVEL",
                "Curitiba", LocalDate.of(2026, 9, 10), null, 3);
    }

    @ParameterizedTest
    @EnumSource(StatusMotorista.class)
    void deveListarFiltrandoPorCadaStatus(StatusMotorista status) {
        when(consultaRepository.consultar(periodo, status)).thenReturn(List.of());

        var resultado = service.listar(status, periodo);

        assertTrue(resultado.isEmpty());
        verify(consultaRepository).consultar(periodo, status);
    }

    @Test
    void deveListarTodosSemFiltroRetornandoDadosEssenciais() {
        when(consultaRepository.consultar(periodo, null)).thenReturn(List.of(linhaCompleta()));

        var resultado = service.listar(null, periodo);

        assertEquals(1, resultado.size());
        assertEquals("Ana", resultado.getFirst().nome());
        assertEquals("Caminhão", resultado.getFirst().tipoVeiculo());
        assertEquals("ABC1D23", resultado.getFirst().placa());
        assertEquals("DISPONIVEL", resultado.getFirst().status());
        assertEquals("Curitiba", resultado.getFirst().localizacao());
        assertEquals(LocalDate.of(2026, 9, 10), resultado.getFirst().ultimaOperacao());
        assertNull(resultado.getFirst().previsaoDisponibilidade());
        assertEquals(3, resultado.getFirst().quantidadeViagens());
    }

    @Test
    void deveListarVazioQuandoNaoHaMotoristas() {
        when(consultaRepository.consultar(periodo, null)).thenReturn(List.of());

        assertTrue(service.listar(null, periodo).isEmpty());
    }

    @Test
    void deveRetornarCamposNulosParaMotoristaSemVeiculo() {
        when(consultaRepository.consultar(periodo, null)).thenReturn(List.of(
                new MotoristaListagem(1, "Bruno", null, null, "EM_OPERACAO",
                        null, null, LocalDate.of(2026, 9, 15), 0)));

        var motorista = service.listar(null, periodo).getFirst();

        assertNull(motorista.tipoVeiculo());
        assertNull(motorista.placa());
        assertNull(motorista.localizacao());
        assertNull(motorista.ultimaOperacao());
        assertEquals(LocalDate.of(2026, 9, 15), motorista.previsaoDisponibilidade());
        assertEquals(0, motorista.quantidadeViagens());
    }

    @Test
    void deveAlterarStatusDoMotoristaExistente() {
        Motorista motorista = new Motorista(
                "Ana", "00123456789", LocalDate.of(2026, 9, 1), StatusMotorista.DISPONIVEL);
        when(repository.findById(1)).thenReturn(Optional.of(motorista));
        when(consultaRepository.consultar(any(), isNull())).thenReturn(List.of());

        var resultado = service.alterarStatus(1, StatusMotorista.INDISPONIVEL);

        assertEquals(StatusMotorista.INDISPONIVEL, motorista.getStatus());
        assertEquals("INDISPONIVEL", resultado.status());
        assertEquals("Ana", resultado.nome());
        verify(repository).save(motorista);
    }

    @Test
    void deveFalharCom404ParaMotoristaInexistente() {
        when(repository.findById(99)).thenReturn(Optional.empty());

        assertThrows(MotoristaNaoEncontradoException.class,
                () -> service.alterarStatus(99, StatusMotorista.DISPONIVEL));

        verify(repository, never()).save(any());
    }

    @Test
    void deveSomarResumoPeloTotalDeMotoristas() {
        when(repository.contarPorStatus()).thenReturn(List.of(
                new MotoristaStatusContagem(StatusMotorista.DISPONIVEL, 2L),
                new MotoristaStatusContagem(StatusMotorista.EM_OPERACAO, 1L)));

        var resumo = service.resumo();

        assertEquals(2, resumo.disponiveis());
        assertEquals(1, resumo.emOperacao());
        assertEquals(0, resumo.indisponiveis());
        assertEquals(resumo.total(), resumo.disponiveis() + resumo.emOperacao() + resumo.indisponiveis());
    }

    @Test
    void deveRetornarResumoZeradoSemMotoristas() {
        when(repository.contarPorStatus()).thenReturn(List.of());

        var resumo = service.resumo();

        assertEquals(0, resumo.disponiveis());
        assertEquals(0, resumo.emOperacao());
        assertEquals(0, resumo.indisponiveis());
        assertEquals(0, resumo.total());
    }

    @Test
    void deveCriarMotoristaNovoComStatusPadraoEDadosDoManifesto() {
        when(repository.buscarPorCpf("00123456789")).thenReturn(List.of());

        service.sincronizarComManifesto(List.of(
                viagem("Ana", "001.234.567-89", LocalDate.of(2026, 9, 10), "Curitiba")));

        ArgumentCaptor<List<Motorista>> captor = ArgumentCaptor.forClass(List.class);
        verify(repository).saveAll(captor.capture());

        Motorista criado = captor.getValue().getFirst();
        assertEquals(StatusMotorista.DISPONIVEL, criado.getStatus());
        assertEquals("Ana", criado.getNome());
        assertEquals("00123456789", criado.getCpf());
        assertEquals("ABC1D23", criado.getVeiculoPlaca());
        assertEquals("Caminhão", criado.getVeiculoTipo());
        assertEquals(LocalDate.of(2026, 9, 10), criado.getUltimaOperacao());
        assertEquals("Curitiba", criado.getUltimaLocalizacao());
        assertNull(criado.getPrevisaoDisponibilidade());
    }

    @Test
    void devePreservarStatusDefinidoManualmenteNaReimportacao() {
        Motorista existente = new Motorista(
                "Ana", "00123456789", LocalDate.of(2026, 9, 1), StatusMotorista.INDISPONIVEL);
        existente.setUltimaOperacao(LocalDate.of(2026, 9, 1));
        when(repository.buscarPorCpf("00123456789")).thenReturn(List.of(existente));

        service.sincronizarComManifesto(List.of(
                viagem("Ana", "00123456789", LocalDate.of(2026, 9, 10), "Curitiba")));

        assertEquals(StatusMotorista.INDISPONIVEL, existente.getStatus());
        assertEquals(LocalDate.of(2026, 9, 10), existente.getUltimaOperacao());
        assertEquals("Curitiba", existente.getUltimaLocalizacao());
        verify(repository).saveAll(List.of(existente));
    }

    @Test
    void deveManterDadosDerivadosDeManifestoMaisAntigo() {
        Motorista existente = new Motorista(
                "Ana", "00123456789", LocalDate.of(2026, 9, 1), StatusMotorista.DISPONIVEL);
        existente.setVeiculoPlaca("DEF4E56");
        existente.setUltimaOperacao(LocalDate.of(2026, 9, 10));
        when(repository.buscarPorCpf("00123456789")).thenReturn(List.of(existente));

        service.sincronizarComManifesto(List.of(
                viagem("Ana", "00123456789", LocalDate.of(2026, 8, 20), "Sorocaba")));

        assertEquals("DEF4E56", existente.getVeiculoPlaca());
        assertEquals(LocalDate.of(2026, 9, 10), existente.getUltimaOperacao());
        assertNull(existente.getUltimaLocalizacao());
    }

    @Test
    void deveDeixarVeiculoNuloQuandoManifestoNaoTrouxerPlaca() {
        when(repository.buscarPorCpf("00123456789")).thenReturn(List.of());

        service.sincronizarComManifesto(List.of(
                viagem("Ana", "00123456789", LocalDate.of(2026, 9, 10), "Curitiba",
                        StatusViagem.PENDENTE, "  ", null, null)));

        ArgumentCaptor<List<Motorista>> captor = ArgumentCaptor.forClass(List.class);
        verify(repository).saveAll(captor.capture());

        Motorista criado = captor.getValue().getFirst();
        assertNull(criado.getVeiculoPlaca());
        assertNull(criado.getVeiculoTipo());
    }

    @Test
    void deveUsarPrevisaoApenasDaViagemEmTransito() {
        when(repository.buscarPorCpf("00123456789")).thenReturn(List.of());

        service.sincronizarComManifesto(List.of(
                viagem("Ana", "00123456789", LocalDate.of(2026, 9, 10), "Curitiba",
                        StatusViagem.EM_TRANSITO, "ABC1D23", "Caminhão", LocalDate.of(2026, 9, 12)),
                viagem("Ana", "00123456789", LocalDate.of(2026, 9, 8), "Sorocaba",
                        StatusViagem.FINALIZADO, "ABC1D23", "Caminhão", LocalDate.of(2026, 9, 9))));

        ArgumentCaptor<List<Motorista>> captor = ArgumentCaptor.forClass(List.class);
        verify(repository).saveAll(captor.capture());

        Motorista motorista = captor.getValue().getFirst();
        assertEquals(LocalDate.of(2026, 9, 12), motorista.getPrevisaoDisponibilidade());
        assertEquals(LocalDate.of(2026, 9, 10), motorista.getUltimaOperacao());
        assertEquals("Curitiba", motorista.getUltimaLocalizacao());
    }

    @Test
    void deveAgruparViagensDoMesmoCpfComOuSemPontuacao() {
        when(repository.buscarPorCpf("00123456789")).thenReturn(List.of());

        service.sincronizarComManifesto(List.of(
                viagem("Ana", "001.234.567-89", LocalDate.of(2026, 9, 10), "Curitiba"),
                viagem("Ana", "00123456789", LocalDate.of(2026, 9, 5), "Sorocaba")));

        verify(repository).buscarPorCpf("00123456789");
        verify(repository, never()).buscarSemCpfPorNome(any());

        ArgumentCaptor<List<Motorista>> captor = ArgumentCaptor.forClass(List.class);
        verify(repository).saveAll(captor.capture());
        assertEquals(1, captor.getValue().size());
    }

    @Test
    void deveAgruparPorNomeQuandoManifestoNaoTemCpfValido() {
        when(repository.buscarSemCpfPorNome("joão silva")).thenReturn(List.of());

        service.sincronizarComManifesto(List.of(
                viagem("João Silva", "SEM CPF", LocalDate.of(2026, 9, 10), "Curitiba"),
                viagem("joão silva", null, LocalDate.of(2026, 9, 5), "Sorocaba")));

        verify(repository, never()).buscarPorCpf(any());

        ArgumentCaptor<List<Motorista>> captor = ArgumentCaptor.forClass(List.class);
        verify(repository).saveAll(captor.capture());

        Motorista criado = captor.getValue().getFirst();
        assertEquals(1, captor.getValue().size());
        assertNull(criado.getCpf());
        assertEquals("joão silva", criado.getNome().toLowerCase());
    }
}
