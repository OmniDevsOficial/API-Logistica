package com.ominidevs.operacional.viagem.services;

import com.ominidevs.operacional.viagem.clients.ManifestoClient;
import com.ominidevs.operacional.viagem.dto.ManifestoDTO;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.mappers.ManifestoMapper;
import com.ominidevs.operacional.viagem.repositories.ViagemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.client.ResourceAccessException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

class ImportacaoManifestoTest {
    private final ManifestoClient client = mock(ManifestoClient.class);
    private final ViagemRepository repository = mock(ViagemRepository.class);
    // Mapper real: verifica a conversão dos dados enviados à persistência.
    private final ViagemService service = new ViagemService(client, new ManifestoMapper(), repository);
    private final MockMultipartFile file = new MockMultipartFile("file", "manifesto.csv", "text/csv", new byte[]{1});

    private ManifestoDTO manifesto(String numero) {
        return new ManifestoDTO(numero, "01/10/2026", "Motorista Teste", "00123456789",
                "ABC1D23", "São Paulo", "Campinas", "1.500,50", "100", "250", "Finalizado", "Teste");
    }

    @Test void converteTodosOsManifestosESalvaValoresCorretos() {
        when(client.enviar(file)).thenReturn(List.of(manifesto("M1"), manifesto("M2")));
        when(repository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
        var viagens = service.importarManifesto(file);
        assertEquals(2, viagens.size());
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
    }

    @Test void retornaResultadoDaPersistencia() {
        when(client.enviar(file)).thenReturn(List.of(manifesto("M1")));
        var salvas = List.of(mock(Viagem.class));
        when(repository.saveAll(anyList())).thenReturn(salvas);
        assertSame(salvas, service.importarManifesto(file));
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
        when(repository.saveAll(List.<Viagem>of())).thenReturn(List.of());
        assertTrue(service.importarManifesto(file).isEmpty());
        verify(repository).saveAll(List.<Viagem>of());
    }

    @Test void manifestoInvalidoImpedeSalvarTodoOLote() {
        when(client.enviar(file)).thenReturn(List.of(manifesto("M1"), manifesto("")));
        var erro = assertThrows(IllegalArgumentException.class, () -> service.importarManifesto(file));
        assertEquals("Manifesto inválido ou incompleto.", erro.getMessage());
        verifyNoInteractions(repository);
    }

    @Test void falhaDeComunicacaoNaoGravaViagens() {
        var erro = new ResourceAccessException("Serviço indisponível");
        when(client.enviar(file)).thenThrow(erro);
        assertSame(erro, assertThrows(ResourceAccessException.class, () -> service.importarManifesto(file)));
        verifyNoInteractions(repository);
    }
}
