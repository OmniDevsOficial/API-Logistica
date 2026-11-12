package com.ominidevs.operacional.motorista.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ominidevs.operacional.indicadores.dto.UtilizacaoMotoristaResponse;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.indicadores.services.UtilizacaoService;
import com.ominidevs.operacional.motorista.dto.MotoristaResumoResponse;
import com.ominidevs.operacional.motorista.dto.MotoristaResponseDTO;
import com.ominidevs.operacional.motorista.dto.PaginaHistoricoViagensResponse;
import com.ominidevs.operacional.motorista.dto.RankingMotoristaResponse;
import com.ominidevs.operacional.motorista.dto.ViagemHistoricoResponse;
import com.ominidevs.operacional.motorista.entities.StatusMotorista;
import com.ominidevs.operacional.motorista.exceptions.MotoristaExceptionHandler;
import com.ominidevs.operacional.motorista.exceptions.MotoristaNaoEncontradoException;
import com.ominidevs.operacional.motorista.exceptions.PaginacaoInvalidaException;
import com.ominidevs.operacional.motorista.model.StatusHistoricoViagem;
import com.ominidevs.operacional.motorista.services.HistoricoViagemService;
import com.ominidevs.operacional.motorista.services.MotoristaService;
import com.ominidevs.operacional.motorista.services.RankingMotoristaService;

class MotoristaControllerTest {

    private final MotoristaService service = mock(MotoristaService.class);
    private final UtilizacaoService utilizacaoService = mock(UtilizacaoService.class);
    private final RankingMotoristaService rankingService = mock(RankingMotoristaService.class);
    private final HistoricoViagemService historicoService = mock(HistoricoViagemService.class);
    private MockMvc mvc;

    private MotoristaResponseDTO motorista(StatusMotorista status) {
        return new MotoristaResponseDTO(
                1, "Ana", "00123456789", "Caminhão", "ABC1D23", status.name(),
                "Curitiba", LocalDate.of(2026, 9, 10), null, 3);
    }

    @BeforeEach
    void configurar() {
        mvc = MockMvcBuilders.standaloneSetup(
                        new MotoristaController(service, utilizacaoService, rankingService, historicoService))
                .setControllerAdvice(new MotoristaExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /motoristas/ping retorna 200 e informa que o serviço está ativo")
    void deveRetornarStatusDoServico() throws Exception {
        mvc.perform(get("/motoristas/ping"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN))
                .andExpect(content().string("operacional-service ativo"));
    }

    @Test
    void deveListarMotoristasSemFiltroDePeriodo() throws Exception {
        when(service.listar(isNull()))
                .thenReturn(List.of(motorista(StatusMotorista.DISPONIVEL)));

        mvc.perform(get("/motoristas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].nome").value("Ana"))
                .andExpect(jsonPath("$[0].cpf").value("00123456789"))
                .andExpect(jsonPath("$[0].tipoVeiculo").value("Caminhão"))
                .andExpect(jsonPath("$[0].placa").value("ABC1D23"))
                .andExpect(jsonPath("$[0].status").value("DISPONIVEL"))
                .andExpect(jsonPath("$[0].localizacao").value("Curitiba"))
                .andExpect(jsonPath("$[0].ultimaOperacao").value("2026-09-10"))
                .andExpect(jsonPath("$[0].previsaoDisponibilidade").doesNotExist())
                .andExpect(jsonPath("$[0].quantidadeViagens").value(3));
    }

    @Test
    void deveListarVazioQuandoNaoHaMotoristas() throws Exception {
        when(service.listar(any())).thenReturn(List.of());

        mvc.perform(get("/motoristas"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"disponivel", "DISPONIVEL"})
    void deveFiltrarPorStatusAceitandoSemPontuacaoEMinusculas(String status) throws Exception {
        when(service.listar(eq(StatusMotorista.DISPONIVEL))).thenReturn(List.of());

        mvc.perform(get("/motoristas").param("status", status))
                .andExpect(status().isOk());

        verify(service).listar(eq(StatusMotorista.DISPONIVEL));
    }

    @ParameterizedTest
    @ValueSource(strings = {"em_operacao", "indisponivel"})
    void deveFiltrarPorCadaStatusDaTela(String status) throws Exception {
        when(service.listar(any())).thenReturn(List.of());

        mvc.perform(get("/motoristas").param("status", status))
                .andExpect(status().isOk());

        verify(service).listar(eq(StatusMotorista.parse(status)));
    }

    @Test
    void deveRejeitarStatusDeFiltroInvalido() throws Exception {
        mvc.perform(get("/motoristas").param("status", "VIAGEM"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").isNotEmpty());

        verifyNoInteractions(service);
    }

    @Test
    void deveAlterarStatusDoMotorista() throws Exception {
        when(service.alterarStatus(1, StatusMotorista.DISPONIVEL))
                .thenReturn(motorista(StatusMotorista.DISPONIVEL));

        mvc.perform(patch("/motoristas/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"DISPONIVEL\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("DISPONIVEL"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"em_operacao", "EM_OPERACAO"})
    void deveAlterarStatusAceitandoMinusculasEMaiusculas(String status) throws Exception {
        when(service.alterarStatus(1, StatusMotorista.EM_OPERACAO))
                .thenReturn(motorista(StatusMotorista.EM_OPERACAO));

        mvc.perform(patch("/motoristas/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"" + status + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("EM_OPERACAO"));
    }

    @Test
    void deveRetornar404ParaMotoristaInexistente() throws Exception {
        when(service.alterarStatus(99, StatusMotorista.DISPONIVEL))
                .thenThrow(new MotoristaNaoEncontradoException(99));

        mvc.perform(patch("/motoristas/99/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"DISPONIVEL\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.erro").isNotEmpty());
    }

    @Test
    void deveRetornar400ParaStatusInvalido() throws Exception {
        mvc.perform(patch("/motoristas/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"DE_CARONA\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").isNotEmpty());

        verifyNoInteractions(service);
    }

    @Test
    void deveRetornarContagemPorStatusSempreSobreOTotal() throws Exception {
        when(service.resumo()).thenReturn(new MotoristaResumoResponse(2, 1, 0, 3));

        mvc.perform(get("/motoristas/resumo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.disponiveis").value(2))
                .andExpect(jsonPath("$.emOperacao").value(1))
                .andExpect(jsonPath("$.indisponiveis").value(0))
                .andExpect(jsonPath("$.total").value(3));
    }

    private UtilizacaoMotoristaResponse baixaUtilizacao(String nome, String porcentagem) {
        return new UtilizacaoMotoristaResponse("00123456789", 1, nome, 1,
                new BigDecimal(porcentagem), "COM_VIAGENS", true);
    }

    @Test
    @DisplayName("GET /motoristas/baixa-utilizacao retorna os motoristas abaixo do limite no mês informado")
    void deveListarMotoristasComBaixaUtilizacaoNoMes() throws Exception {
        when(utilizacaoService.listarBaixaUtilizacao(any()))
                .thenReturn(List.of(baixaUtilizacao("Ana", "12.50")));

        mvc.perform(get("/motoristas/baixa-utilizacao").param("mes", "2026-09"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Ana"))
                .andExpect(jsonPath("$[0].porcentagem").value(12.5))
                .andExpect(jsonPath("$[0].baixaUtilizacao").value(true));

        verify(utilizacaoService).listarBaixaUtilizacao(
                new PeriodoConsulta(LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30)));
    }

    @Test
    @DisplayName("GET /motoristas/baixa-utilizacao sem mês usa o mês atual")
    void deveUsarMesAtualQuandoMesNaoInformado() throws Exception {
        when(utilizacaoService.listarBaixaUtilizacao(any())).thenReturn(List.of());
        YearMonth atual = YearMonth.now();

        mvc.perform(get("/motoristas/baixa-utilizacao"))
                .andExpect(status().isOk());

        verify(utilizacaoService).listarBaixaUtilizacao(
                new PeriodoConsulta(atual.atDay(1), atual.atEndOfMonth()));
    }

    @Test
    @DisplayName("GET /motoristas/baixa-utilizacao retorna 200 com lista vazia quando ninguém está abaixo do limite")
    void deveRetornarListaVaziaSemAlertas() throws Exception {
        when(utilizacaoService.listarBaixaUtilizacao(any())).thenReturn(List.of());

        mvc.perform(get("/motoristas/baixa-utilizacao").param("mes", "2026-09"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"2026-13", "09/2026", "2026-9", "abc"})
    @DisplayName("GET /motoristas/baixa-utilizacao retorna 400 para mês em formato inválido")
    void deveRetornar400ParaMesInvalido(String mes) throws Exception {
        mvc.perform(get("/motoristas/baixa-utilizacao").param("mes", mes))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Informe o mês no formato AAAA-MM."));

        verifyNoInteractions(utilizacaoService);
    }

    private RankingMotoristaResponse itemRanking() {
        return new RankingMotoristaResponse(1, 7, "Ana", "00123456789", null, "Truck", "ABC1D23",
                7, 5, new BigDecimal("25.00"), new BigDecimal("333.33"),
                new BigDecimal("1000.00"), new BigDecimal("1500.00"), new BigDecimal("500.00"));
    }

    @Test
    @DisplayName("GET /motoristas/ranking calcula o ranking do mês informado")
    void deveCalcularRankingDoMesInformado() throws Exception {
        when(rankingService.ranking(any())).thenReturn(List.of(itemRanking()));

        mvc.perform(get("/motoristas/ranking").param("mes", "2026-02"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].posicao").value(1))
                .andExpect(jsonPath("$[0].nome").value("Ana"))
                .andExpect(jsonPath("$[0].cpf").value("00123456789"))
                .andExpect(jsonPath("$[0].rentabilidadeMedia").value(333.33))
                .andExpect(jsonPath("$[0].rentabilidadeTotal").value(1000.00))
                .andExpect(jsonPath("$[0].quantidadeViagens").value(5))
                .andExpect(jsonPath("$[0].viagens").value(7))
                .andExpect(jsonPath("$[0].frequencia").value(25.00));

        verify(rankingService).ranking(
                new PeriodoConsulta(LocalDate.of(2026, 2, 1), LocalDate.of(2026, 2, 28)));
    }

    @Test
    @DisplayName("GET /motoristas/ranking aceita dataInicio/dataFim em dd/MM/aaaa (formato do front)")
    void deveAceitarDataInicioEDataFim() throws Exception {
        when(rankingService.ranking(any())).thenReturn(List.of());

        mvc.perform(get("/motoristas/ranking")
                        .param("dataInicio", "01/11/2026")
                        .param("dataFim", "30/11/2026"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        verify(rankingService).ranking(
                new PeriodoConsulta(LocalDate.of(2026, 11, 1), LocalDate.of(2026, 11, 30)));
    }

    @Test
    @DisplayName("GET /motoristas/ranking sem parâmetro usa o mês atual")
    void deveUsarMesAtualSemParametros() throws Exception {
        when(rankingService.ranking(any())).thenReturn(List.of());
        YearMonth atual = YearMonth.now();

        mvc.perform(get("/motoristas/ranking"))
                .andExpect(status().isOk());

        verify(rankingService).ranking(
                new PeriodoConsulta(atual.atDay(1), atual.atEndOfMonth()));
    }

    @Test
    @DisplayName("GET /motoristas/ranking retorna 200 com lista vazia quando o mês não tem viagens")
    void deveRetornarListaVaziaQuandoMesSemViagens() throws Exception {
        when(rankingService.ranking(any())).thenReturn(List.of());

        mvc.perform(get("/motoristas/ranking").param("mes", "2026-12"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"2026-13", "09/2026", "2026-9", "abc"})
    @DisplayName("GET /motoristas/ranking retorna 400 para mês em formato inválido")
    void deveRetornar400ParaMesDeRankingInvalido(String mes) throws Exception {
        mvc.perform(get("/motoristas/ranking").param("mes", mes))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Informe o mês no formato AAAA-MM."));

        verifyNoInteractions(rankingService);
    }

    @Test
    @DisplayName("GET /motoristas/ranking retorna 400 quando informa mês e datas juntos")
    void deveRejeitarMesEDatasJuntos() throws Exception {
        mvc.perform(get("/motoristas/ranking")
                        .param("mes", "2026-02")
                        .param("dataInicio", "01/02/2026")
                        .param("dataFim", "28/02/2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").isNotEmpty());

        verifyNoInteractions(rankingService);
    }

    @ParameterizedTest
    @ValueSource(strings = {"31/02/2026", "2026-02-01", "abc"})
    @DisplayName("GET /motoristas/ranking retorna 400 para data em formato inválido")
    void deveRetornar400ParaDataInvalida(String dataInicio) throws Exception {
        mvc.perform(get("/motoristas/ranking")
                        .param("dataInicio", dataInicio)
                        .param("dataFim", "28/02/2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Informe datas válidas no formato dd/MM/aaaa."));

        verifyNoInteractions(rankingService);
    }

    @Test
    @DisplayName("GET /motoristas/ranking retorna 400 quando falta dataFim")
    void deveRejeitarPeriodoSemDataFinal() throws Exception {
        mvc.perform(get("/motoristas/ranking").param("dataInicio", "01/02/2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").isNotEmpty());

        verifyNoInteractions(rankingService);
    }

    private PaginaHistoricoViagensResponse paginaHistorico() {
        return new PaginaHistoricoViagensResponse(
                List.of(new ViagemHistoricoResponse(
                        812, "251104", "Jacareí", "Curitiba",
                        LocalDate.of(2026, 10, 28), null, StatusHistoricoViagem.EM_ANDAMENTO)),
                0, 10, 37, 4, false);
    }

    @Test
    @DisplayName("GET /motoristas/{id}/viagens retorna a página com os campos do contrato")
    void deveRetornarHistoricoDeViagens() throws Exception {
        when(historicoService.listar(1, 0, 10)).thenReturn(paginaHistorico());

        mvc.perform(get("/motoristas/1/viagens"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.viagens[0].id").value(812))
                .andExpect(jsonPath("$.viagens[0].manifesto").value("251104"))
                .andExpect(jsonPath("$.viagens[0].origem").value("Jacareí"))
                .andExpect(jsonPath("$.viagens[0].destino").value("Curitiba"))
                .andExpect(jsonPath("$.viagens[0].dataSaida").value("2026-10-28"))
                .andExpect(jsonPath("$.viagens[0].previsaoChegada").doesNotExist())
                .andExpect(jsonPath("$.viagens[0].status").value("EM_ANDAMENTO"))
                .andExpect(jsonPath("$.pagina").value(0))
                .andExpect(jsonPath("$.tamanho").value(10))
                .andExpect(jsonPath("$.totalViagens").value(37))
                .andExpect(jsonPath("$.totalPaginas").value(4))
                .andExpect(jsonPath("$.ultimaPagina").value(false));
    }

    @Test
    @DisplayName("GET /motoristas/{id}/viagens não expõe campos da entidade")
    void naoDeveExporCamposDaEntidade() throws Exception {
        when(historicoService.listar(1, 0, 10)).thenReturn(paginaHistorico());

        mvc.perform(get("/motoristas/1/viagens"))
                .andExpect(jsonPath("$.viagens[0].cpf_motorista").doesNotExist())
                .andExpect(jsonPath("$.viagens[0].valorFrete").doesNotExist());
    }

    @Test
    @DisplayName("GET /motoristas/{id}/viagens repassa a paginação informada")
    void deveRepassarPaginacaoInformada() throws Exception {
        when(historicoService.listar(1, 2, 5)).thenReturn(paginaHistorico());

        mvc.perform(get("/motoristas/1/viagens").param("pagina", "2").param("tamanho", "5"))
                .andExpect(status().isOk());

        verify(historicoService).listar(1, 2, 5);
    }

    @Test
    @DisplayName("GET /motoristas/{id}/viagens retorna 404 quando o motorista não existe")
    void deveRetornar404NoHistoricoDeMotoristaInexistente() throws Exception {
        when(historicoService.listar(eq(99), any(Integer.class), any(Integer.class)))
                .thenThrow(new MotoristaNaoEncontradoException(99));

        mvc.perform(get("/motoristas/99/viagens"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.erro").value("Motorista não encontrado: 99"));
    }

    @Test
    @DisplayName("GET /motoristas/{id}/viagens retorna 400 para paginação inválida")
    void deveRetornar400NoHistoricoComPaginacaoInvalida() throws Exception {
        when(historicoService.listar(1, 0, 51))
                .thenThrow(new PaginacaoInvalidaException("O tamanho da página deve estar entre 1 e 50."));

        mvc.perform(get("/motoristas/1/viagens").param("tamanho", "51"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("O tamanho da página deve estar entre 1 e 50."));
    }
}
