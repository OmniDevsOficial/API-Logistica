package com.ominidevs.operacional.importacao.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.times;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.mockito.ArgumentCaptor;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import com.ominidevs.operacional.importacao.dto.FiltroImportacao;
import com.ominidevs.operacional.importacao.dto.ImportacaoHistoricoResponse;
import com.ominidevs.operacional.importacao.dto.ResumoImportacao;
import com.ominidevs.operacional.importacao.entities.ImportacaoHistorico;
import com.ominidevs.operacional.importacao.entities.StatusImportacao;
import com.ominidevs.operacional.importacao.entities.TipoImportacao;
import com.ominidevs.operacional.importacao.repositories.ImportacaoHistoricoRepository;

/**
 * Testes unitários do serviço de histórico: gravação, status derivado do
 * resumo, usuário lido do token e mapeamento da consulta. A consulta com
 * filtros de verdade ( Criteria sobre o PostgreSQL ) está em
 * ImportacaoHistoricoListaTest.
 */
class ImportacaoHistoricoServiceTest {

    private final ImportacaoHistoricoRepository repository = mock(ImportacaoHistoricoRepository.class);
    private final ImportacaoHistoricoService service = new ImportacaoHistoricoService(repository);

    private final MockMultipartFile arquivo =
            new MockMultipartFile("file", "frota-novembro.csv", "text/csv", "Placa;Tipo Veiculo".getBytes());

    @AfterEach
    void limparToken() {
        SecurityContextHolder.clearContext();
    }

    private void comUsuarioLogado(String nome) {
        Jwt jwt = new Jwt("token", Instant.now(), Instant.now().plusSeconds(300), Map.of("alg", "HS256"),
                Map.of("sub", "yuri@empresa.com", "nome", nome, "perfil", "GESTOR"));
        SecurityContextHolder.getContext().setAuthentication(new JwtAuthenticationToken(jwt));
    }

    @Test
    void registraImportacaoComStatusDerivadoDoResumoEUsuarioDoToken() {
        comUsuarioLogado("Yuri Gonçalves");

        service.registrar(TipoImportacao.VEICULO, arquivo, new ResumoImportacao(3, 1, 0, 2));

        var captor = ArgumentCaptor.forClass(ImportacaoHistorico.class);
        verify(repository).save(captor.capture());
        ImportacaoHistorico salvo = captor.getValue();
        assertEquals(TipoImportacao.VEICULO, salvo.getTipo());
        assertEquals(StatusImportacao.PARCIAL, salvo.getStatus());
        assertEquals("frota-novembro.csv", salvo.getArquivo());
        assertEquals("Yuri Gonçalves", salvo.getUsuario());
        assertEquals(3, salvo.getCriados());
        assertEquals(1, salvo.getAtualizados());
        assertEquals(0, salvo.getIgnorados());
        assertEquals(2, salvo.getRejeitados());
        assertEquals(64, salvo.getHashArquivo().length());
        assertNull(salvo.getReimportacaoDe());
    }

    @Test
    void resumoTodoRejeitadoViraErroENadaGravadoTambem() {
        service.registrar(TipoImportacao.MANIFESTO, arquivo, new ResumoImportacao(0, 0, 0, 4));
        service.registrar(TipoImportacao.MANIFESTO, arquivo, ResumoImportacao.ZERO);

        var captor = ArgumentCaptor.forClass(ImportacaoHistorico.class);
        verify(repository, times(2)).save(captor.capture());
        assertEquals(StatusImportacao.ERRO, captor.getAllValues().get(0).getStatus());
        assertEquals(StatusImportacao.ERRO, captor.getAllValues().get(1).getStatus());
    }

    @Test
    void linhaIgnoradaSemNenhumaGravadaViraErro() {
        // Nada mudou e nada foi rejeitado: o arquivo não produziu efeito.
        service.registrar(TipoImportacao.MANIFESTO, arquivo, new ResumoImportacao(0, 0, 0, 0));

        var captor = ArgumentCaptor.forClass(ImportacaoHistorico.class);
        verify(repository).save(captor.capture());
        assertEquals(StatusImportacao.ERRO, captor.getValue().getStatus());
    }

    @Test
    void registrarFalhaGravaResumoZeradoComStatusErro() {
        service.registrarFalha(TipoImportacao.MANIFESTO, arquivo);

        var captor = ArgumentCaptor.forClass(ImportacaoHistorico.class);
        verify(repository).save(captor.capture());
        ImportacaoHistorico salvo = captor.getValue();
        assertEquals(StatusImportacao.ERRO, salvo.getStatus());
        assertEquals(0, salvo.getCriados());
        assertEquals(0, salvo.getRejeitados());
        assertEquals(TipoImportacao.MANIFESTO, salvo.getTipo());
    }

    @Test
    void arquivoAusenteNaoImpedeGravarOHistorico() {
        service.registrarFalha(TipoImportacao.VEICULO, null);

        var captor = ArgumentCaptor.forClass(ImportacaoHistorico.class);
        verify(repository).save(captor.capture());
        assertEquals("Arquivo não informado", captor.getValue().getArquivo());
        assertNull(captor.getValue().getHashArquivo());
        assertNull(captor.getValue().getUsuario());
    }

    @Test
    void marcaReimportacaoQuandoJaHouveImportacaoDoMesmoConteudo() {
        OffsetDateTime anterior = OffsetDateTime.now().minusDays(12);
        when(repository.findFirstByTipoAndHashArquivoOrderByDataHoraDesc(eq(TipoImportacao.MANIFESTO), any()))
                .thenReturn(Optional.of(novaImportacao(TipoImportacao.MANIFESTO, anterior, "manifesto.csv")));

        service.registrar(TipoImportacao.MANIFESTO, arquivo, new ResumoImportacao(1, 0, 0, 0));

        var captor = ArgumentCaptor.forClass(ImportacaoHistorico.class);
        verify(repository).save(captor.capture());
        assertEquals(anterior, captor.getValue().getReimportacaoDe());
    }

    @Test
    void semTokenOUsuarioFicaNuloEmVezDeQuebrarAGravacao() {
        service.registrar(TipoImportacao.VEICULO, arquivo, new ResumoImportacao(1, 0, 0, 0));

        var captor = ArgumentCaptor.forClass(ImportacaoHistorico.class);
        verify(repository).save(captor.capture());
        assertNull(captor.getValue().getUsuario());
    }

    @Test
    void listarDevolveAsLinhasEmOrdemDecrescenteMapeadasParaAResposta() {
        ImportacaoHistorico primeira = novaImportacao(TipoImportacao.VEICULO, OffsetDateTime.now(), "frota.csv");
        when(repository.findAll(any(Specification.class), any(Sort.class)))
                .thenReturn(List.of(primeira));

        List<ImportacaoHistoricoResponse> linhas = service.listar(new FiltroImportacao(null, null, null, null));

        assertEquals(1, linhas.size());
        ImportacaoHistoricoResponse linha = linhas.getFirst();
        assertEquals(primeira.getId(), linha.id());
        assertEquals("frota.csv", linha.arquivo());
        assertEquals(TipoImportacao.VEICULO, linha.tipo());
        assertEquals(new ResumoImportacao(1, 0, 0, 0), linha.resumo());
    }

    private ImportacaoHistorico novaImportacao(TipoImportacao tipo, OffsetDateTime dataHora, String arquivo) {
        return new ImportacaoHistorico(tipo, dataHora, arquivo, "Yuri", StatusImportacao.SUCESSO,
                1, 0, 0, 0, null, null);
    }
}
