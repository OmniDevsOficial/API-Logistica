package com.ominidevs.operacional.viagem.services;

import com.ominidevs.operacional.motorista.services.MotoristaService;
import com.ominidevs.operacional.importacao.dto.ResumoImportacao;
import com.ominidevs.operacional.importacao.entities.TipoImportacao;
import com.ominidevs.operacional.importacao.services.ImportacaoHistoricoService;
import com.ominidevs.operacional.viagem.clients.ManifestoClient;
import com.ominidevs.operacional.viagem.dto.ManifestoDTO;
import com.ominidevs.operacional.viagem.dto.ImportacaoManifestoResponse;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.mappers.ManifestoMapper;
import com.ominidevs.operacional.viagem.repositories.ViagemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import com.ominidevs.operacional.viagem.exceptions.IntegracaoManifestoException;
import com.ominidevs.operacional.viagem.exceptions.IntegracaoManifestoException.Falha;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

class ImportacaoManifestoTest {
    private final ManifestoClient client = mock(ManifestoClient.class);
    private final ViagemRepository repository = mock(ViagemRepository.class);
    private final MotoristaService motoristaService = mock(MotoristaService.class);
    private final ImportacaoHistoricoService historico = mock(ImportacaoHistoricoService.class);
    // Mapper real: verifica a conversão dos dados enviados à persistência.
    private final ViagemService service =
            new ViagemService(client, new ManifestoMapper(), repository, motoristaService, historico);
    private final MockMultipartFile file = new MockMultipartFile("file", "manifesto.csv", "text/csv", new byte[]{1});

    private ManifestoDTO manifesto(String numero) {
        return new ManifestoDTO(numero, "01/10/2026", "Motorista Teste", "00123456789",
                "ABC1D23", "São Paulo", "Campinas", "1.500,50", "100", "250", "Finalizado", "Teste");
    }

    @Test void converteTodosOsManifestosESalvaValoresCorretos() {
        when(client.enviar(file)).thenReturn(List.of(manifesto("M1"), manifesto("M2")));
        when(repository.findByManifestoIn(List.of("M1", "M2"))).thenReturn(List.of());
        when(repository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        var resultado = service.importarManifesto(file);
        var viagens = resultado.viagensImportadas();
        assertEquals(2, viagens.size());
        assertTrue(resultado.manifestosDuplicados().isEmpty());
        assertEquals(List.of("M1", "M2"), viagens.stream().map(Viagem::getManifesto).toList());
        for (var viagem : viagens) {
            assertEquals(LocalDate.of(2026, 10, 1), viagem.getData());
            assertEquals("Motorista Teste", viagem.getMotorista());
            assertEquals("00123456789", viagem.getCPF());
            assertEquals("ABC1D23", viagem.getVeiculo());
            assertEquals("São Paulo", viagem.getCidadeOrigem());
            assertEquals("Campinas", viagem.getCidadeDestino());
            assertEquals(new BigDecimal("1500.50"), viagem.getValorFrete());
            assertEquals(100, viagem.getKmSaida());
            assertEquals(250, viagem.getKmChegada());
            assertEquals(StatusViagem.FINALIZADO, viagem.getStatus());
            assertEquals("Teste", viagem.getObservacoes());
            assertNull(viagem.getEstimativaDias());
        }
        verify(client).enviar(file);
        verify(repository).saveAll(viagens);
        verify(motoristaService).sincronizarComManifesto(viagens);
    }

    @Test void retornaResultadoDaPersistencia() {
        when(client.enviar(file)).thenReturn(List.of(manifesto("M1")));
        when(repository.findByManifestoIn(List.of("M1"))).thenReturn(List.of());
        var salvas = List.of(mock(Viagem.class));
        when(repository.saveAll(anyList())).thenReturn(salvas);
        var resultado = service.importarManifesto(file);
        assertEquals(salvas, resultado.viagensImportadas());
        assertTrue(resultado.manifestosDuplicados().isEmpty());
    }

    @Test void reimportaManifestoExistenteAtualizandoORegistro() {
        when(client.enviar(file)).thenReturn(List.of(manifesto("M1")));
        var existente = mock(Viagem.class);
        when(existente.getManifesto()).thenReturn("M1");
        when(repository.findByManifestoIn(List.of("M1"))).thenReturn(List.of(existente));
        when(repository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        var resultado = service.importarManifesto(file);

        assertEquals(List.of(existente), resultado.viagensImportadas());
        assertEquals(List.of("M1"), resultado.manifestosDuplicados());
        verify(repository).saveAll(List.of(existente));
        verify(motoristaService).sincronizarComManifesto(List.of(existente));
    }

    @Test void rejeitaArquivoAusente() {
        assertThrows(IllegalArgumentException.class, () -> service.importarManifesto(null));
        verifyNoInteractions(client, repository);
    }

    @Test void rejeitaArquivoVazio() {
        var vazio = new MockMultipartFile("file", "vazio.csv", "text/csv", new byte[0]);
        var erro = assertThrows(IllegalArgumentException.class, () -> service.importarManifesto(vazio));
        assertEquals("O arquivo não foi enviado ou está vazio.", erro.getMessage());
        verifyNoInteractions(client, repository);
    }

    @Test void respostaSemLinhasRetornaListaVazia() {
        when(client.enviar(file)).thenReturn(List.of());
        var resultado = service.importarManifesto(file);
        assertTrue(resultado.viagensImportadas().isEmpty());
        assertTrue(resultado.manifestosDuplicados().isEmpty());
        verify(repository, never()).saveAll(anyList());
    }

    @Test void manifestoInvalidoGeraErroPorLinhaESalvaAsLinhasValidas() {
        when(client.enviar(file)).thenReturn(List.of(manifesto("M1"), manifesto("")));
        when(repository.findByManifestoIn(List.of("M1"))).thenReturn(List.of());
        when(repository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        var resultado = service.importarManifesto(file);
        assertEquals(List.of("M1"), resultado.viagensImportadas().stream().map(Viagem::getManifesto).toList());
        assertEquals(1, resultado.erros().size());
        assertEquals("Manifesto inválido ou incompleto.", resultado.erros().get(0).mensagem());
    }

    @Test void dataInvalidaGeraErroPorLinhaSemAbortarImportacao() {
        var linhaValida = manifesto("9010");
        linhaValida.setNumeroLinha(2);
        var linhaComDataInvalida = new ManifestoDTO("9011", "32/13/2026", "Motorista Teste", "00123456789",
                "ABC1D23", "São Paulo", "Campinas", "1.500,50", "100", "250", "Finalizado", "Teste");
        linhaComDataInvalida.setNumeroLinha(3);
        when(client.enviar(file)).thenReturn(List.of(linhaValida, linhaComDataInvalida));
        when(repository.findByManifestoIn(List.of("9010"))).thenReturn(List.of());
        when(repository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        var resultado = service.importarManifesto(file);

        assertEquals(List.of("9010"), resultado.viagensImportadas().stream().map(Viagem::getManifesto).toList());
        assertEquals(1, resultado.erros().size());
        assertEquals(3, resultado.erros().get(0).linha());
        assertEquals("9011", resultado.erros().get(0).manifesto());
        assertTrue(resultado.erros().get(0).mensagem().startsWith("Data inválida:"));
        verify(repository).saveAll(resultado.viagensImportadas());
    }

    @Test void ultimaOcorrenciaDoManifestoVence() {
        var primeira = manifesto("M1");
        var ultima = new ManifestoDTO("M1", "01/10/2026", "Motorista Teste", "00123456789", "ABC1D23",
                "São Paulo", "Campinas", "1.500,50", "200", "250", "Finalizado", "Teste");
        when(client.enviar(file)).thenReturn(List.of(primeira, ultima));
        when(repository.findByManifestoIn(List.of("M1"))).thenReturn(List.of());
        when(repository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        var resultado = service.importarManifesto(file);
        assertEquals(1, resultado.viagensImportadas().size());
        assertEquals(200, resultado.viagensImportadas().get(0).getKmSaida());
    }

    @Test void reimportacaoAtualizaValorFinanceiroQueEstavaNull() {
        var entrada = new ManifestoDTO("M1", "01/10/2026", "Motorista Teste", "00123456789", "ABC1D23",
                "São Paulo", "Campinas", "800,00", "100", "250", "Finalizado", "Teste");
        entrada.setValorFretes("1.200,00");
        entrada.setPedagio("35,50");
        entrada.setValeFrete("835,50");
        when(client.enviar(file)).thenReturn(List.of(entrada));
        var existente = new Viagem("M1", LocalDate.of(2026, 10, 1), "Motorista Teste", "00123456789", "ABC1D23",
                "São Paulo", "Campinas", new BigDecimal("1500.50"), 100, 250, StatusViagem.FINALIZADO, "Teste", null);
        existente.setReceitaFrete(null);
        existente.setCustoFrete(null);
        existente.setPedagio(null);
        when(repository.findByManifestoIn(List.of("M1"))).thenReturn(List.of(existente));
        when(repository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        var resultado = service.importarManifesto(file);
        assertEquals(new BigDecimal("800.00"), resultado.viagensImportadas().get(0).getCustoFrete());
        assertEquals(new BigDecimal("1200.00"), resultado.viagensImportadas().get(0).getReceitaFrete());
        assertEquals(new BigDecimal("35.50"), resultado.viagensImportadas().get(0).getPedagio());
        assertEquals(new BigDecimal("835.50"), resultado.viagensImportadas().get(0).getValeFrete());
    }

    @ParameterizedTest
    @EnumSource(Falha.class)
    void falhaDeComunicacaoNaoGravaViagens(Falha falha) {
        var erro = new IntegracaoManifestoException(falha, null);
        when(client.enviar(file)).thenThrow(erro);
        assertSame(erro, assertThrows(IntegracaoManifestoException.class, () -> service.importarManifesto(file)));
        verifyNoInteractions(repository);
    }

    @Test void registraNoHistoricoResumoDaImportacaoBemSucedida() {
        when(client.enviar(file)).thenReturn(List.of(manifesto("M1"), manifesto("")));
        when(repository.findByManifestoIn(List.of("M1"))).thenReturn(List.of());
        when(repository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        service.importarManifesto(file);

        // Uma linha gravada e uma rejeitada -> parcial.
        verify(historico).registrar(
                eq(TipoImportacao.MANIFESTO), eq(file), eq(new ResumoImportacao(1, 0, 0, 1)));
        verify(historico, never()).registrarFalha(any(), any());
    }

    @Test void reimportacaoSemMudancaNenhumaContaComoIgnorada() {
        when(client.enviar(file)).thenReturn(List.of(manifesto("M1")));
        when(repository.findByManifestoIn(List.of("M1"))).thenReturn(List.of());
        when(repository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        Viagem gravada = service.importarManifesto(file).viagensImportadas().get(0);

        // Mesmo arquivo: a linha já gravada volta com os mesmos valores.
        when(repository.findByManifestoIn(List.of("M1"))).thenReturn(List.of(gravada));
        service.importarManifesto(file);

        var captor = org.mockito.ArgumentCaptor.forClass(ResumoImportacao.class);
        verify(historico, times(2)).registrar(eq(TipoImportacao.MANIFESTO), eq(file), captor.capture());
        assertEquals(new ResumoImportacao(0, 0, 1, 0), captor.getAllValues().get(1));
    }

    @Test void falhaNaImportacaoRegistraATentativaComoErro() {
        when(client.enviar(file)).thenThrow(new IntegracaoManifestoException(Falha.INDISPONIVEL, null));

        assertThrows(IntegracaoManifestoException.class, () -> service.importarManifesto(file));

        verify(historico).registrarFalha(TipoImportacao.MANIFESTO, file);
        verify(historico, never()).registrar(any(), any(), any());
    }
}
