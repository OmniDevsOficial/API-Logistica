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

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.motorista.dto.MotoristaResumoResponse;
import com.ominidevs.operacional.motorista.dto.MotoristaResponseDTO;
import com.ominidevs.operacional.motorista.entities.StatusMotorista;
import com.ominidevs.operacional.motorista.exceptions.MotoristaExceptionHandler;
import com.ominidevs.operacional.motorista.exceptions.MotoristaNaoEncontradoException;
import com.ominidevs.operacional.motorista.services.MotoristaService;

class MotoristaControllerTest {

    private final MotoristaService service = mock(MotoristaService.class);
    private MockMvc mvc;

    private MotoristaResponseDTO motorista(StatusMotorista status) {
        return new MotoristaResponseDTO(
                1, "Ana", "Caminhão", "ABC1D23", status.name(),
                "Curitiba", LocalDate.of(2026, 9, 10), null, 3);
    }

    @BeforeEach
    void configurar() {
        mvc = MockMvcBuilders.standaloneSetup(new MotoristaController(service))
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
    void deveListarMotoristasComPeriodoPadraoDoMesCorrente() throws Exception {
        when(service.listar(isNull(), eq(PeriodoConsulta.mesCorrente())))
                .thenReturn(List.of(motorista(StatusMotorista.DISPONIVEL)));

        mvc.perform(get("/motoristas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].nome").value("Ana"))
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
        when(service.listar(any(), any())).thenReturn(List.of());

        mvc.perform(get("/motoristas"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"disponivel", "DISPONIVEL"})
    void deveFiltrarPorStatusAceitandoSemPontuacaoEMinusculas(String status) throws Exception {
        when(service.listar(eq(StatusMotorista.DISPONIVEL), any())).thenReturn(List.of());

        mvc.perform(get("/motoristas").param("status", status))
                .andExpect(status().isOk());

        verify(service).listar(eq(StatusMotorista.DISPONIVEL), any());
    }

    @ParameterizedTest
    @ValueSource(strings = {"em_operacao", "indisponivel"})
    void deveFiltrarPorCadaStatusDaTela(String status) throws Exception {
        when(service.listar(any(), any())).thenReturn(List.of());

        mvc.perform(get("/motoristas").param("status", status))
                .andExpect(status().isOk());

        verify(service).listar(eq(StatusMotorista.parse(status)), any());
    }

    @Test
    void deveRejeitarStatusDeFiltroInvalido() throws Exception {
        mvc.perform(get("/motoristas").param("status", "VIAGEM"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").isNotEmpty());

        verifyNoInteractions(service);
    }

    @Test
    void deveAceitarPeriodoInformado() throws Exception {
        when(service.listar(isNull(), eq(PeriodoConsulta.parse("01/09/2026", "10/09/2026"))))
                .thenReturn(List.of());

        mvc.perform(get("/motoristas")
                        .param("dataInicio", "01/09/2026")
                        .param("dataFim", "10/09/2026"))
                .andExpect(status().isOk());

        verify(service).listar(isNull(), eq(PeriodoConsulta.parse("01/09/2026", "10/09/2026")));
    }

    @Test
    void deveRejeitarPeriodoIncompleto() throws Exception {
        mvc.perform(get("/motoristas").param("dataInicio", "01/09/2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").isNotEmpty());

        verifyNoInteractions(service);
    }

    @Test
    void deveRejeitarDataInvalida() throws Exception {
        mvc.perform(get("/motoristas")
                        .param("dataInicio", "31/02/2026")
                        .param("dataFim", "10/09/2026"))
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
}