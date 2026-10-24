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
import com.ominidevs.operacional.motorista.entities.StatusMotorista;
import com.ominidevs.operacional.motorista.exceptions.MotoristaExceptionHandler;
import com.ominidevs.operacional.motorista.exceptions.MotoristaNaoEncontradoException;
import com.ominidevs.operacional.motorista.services.MotoristaService;

class MotoristaControllerTest {

    private final MotoristaService service = mock(MotoristaService.class);
    private final UtilizacaoService utilizacaoService = mock(UtilizacaoService.class);
    private MockMvc mvc;

    private MotoristaResponseDTO motorista(StatusMotorista status) {
        return new MotoristaResponseDTO(
                1, "Ana", "00123456789", "Caminhão", "ABC1D23", status.name(),
                "Curitiba", LocalDate.of(2026, 9, 10), null, 3);
    }

    @BeforeEach
    void configurar() {
        mvc = MockMvcBuilders.standaloneSetup(new MotoristaController(service, utilizacaoService))
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
}
