package com.ominidevs.operacional.indicadores.controllers;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.ominidevs.operacional.indicadores.exceptions.IndicadorExceptionHandler;
import com.ominidevs.operacional.indicadores.projections.MotoristaQuantidadeViagens;
import com.ominidevs.operacional.indicadores.repositories.UtilizacaoRepository;
import com.ominidevs.operacional.indicadores.services.UtilizacaoService;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UtilizacaoControllerTest {
    private final UtilizacaoRepository repo = mock(UtilizacaoRepository.class);
    private MockMvc mvc;

    @BeforeEach void configurar() {
        mvc = MockMvcBuilders.standaloneSetup(new UtilizacaoController(new UtilizacaoService(repo)))
                .setControllerAdvice(new IndicadorExceptionHandler()).build();
    }

    @Test void retornaContratoComOrdenacaoPadrao() throws Exception {
        when(repo.consultar(any())).thenReturn(List.of(
                new MotoristaQuantidadeViagens("001", 1, "Ana", 2)));
        mvc.perform(get("/indicadores/utilizacao").param("dataInicio", "01/09/2026")
                        .param("dataFim", "10/09/2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dataInicio").value("01/09/2026"))
                .andExpect(jsonPath("$.dataFim").value("10/09/2026"))
                .andExpect(jsonPath("$.ordenacao").value("desc"))
                .andExpect(jsonPath("$.totalViagens").value(2))
                .andExpect(jsonPath("$.motoristas[0].porcentagem").value(100))
                .andExpect(jsonPath("$.motoristas[0].motoristaId").value(1));
    }

    @Test void aceitaCrescente() throws Exception {
        when(repo.consultar(any())).thenReturn(List.of());
        mvc.perform(get("/indicadores/utilizacao").param("dataInicio", "01/09/2026")
                        .param("dataFim", "10/09/2026").param("ordenacao", "asc"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.ordenacao").value("asc"))
                .andExpect(jsonPath("$.status").value("SEM_VIAGENS"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"00123456789", "001.234.567-89"})
    void filtraCpfMantendoTotalGeral(String cpf) throws Exception {
        when(repo.consultar(any())).thenReturn(List.of(
                new MotoristaQuantidadeViagens("00123456789", null, "Ana", 10),
                new MotoristaQuantidadeViagens("11111111111", 2, "Bruno", 30)));
        mvc.perform(get("/indicadores/utilizacao").param("dataInicio", "01/09/2026")
                        .param("dataFim", "10/09/2026").param("cpf", cpf))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalViagens").value(40))
                .andExpect(jsonPath("$.motoristas.length()").value(1))
                .andExpect(jsonPath("$.motoristas[0].chave").value("00123456789"))
                .andExpect(jsonPath("$.motoristas[0].quantidadeViagens").value(10))
                .andExpect(jsonPath("$.motoristas[0].porcentagem").value(25));
    }

    @Test void cpfNaoEncontradoRetornaListaVaziaETotalGeral() throws Exception {
        when(repo.consultar(any())).thenReturn(List.of(
                new MotoristaQuantidadeViagens("00123456789", 1, "Ana", 10)));
        mvc.perform(get("/indicadores/utilizacao").param("dataInicio", "01/09/2026")
                        .param("dataFim", "10/09/2026").param("cpf", "11111111111"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.totalViagens").value(10))
                .andExpect(jsonPath("$.motoristas").isEmpty());
    }

    @Test void cpfVazioNaoFiltra() throws Exception {
        when(repo.consultar(any())).thenReturn(List.of(
                new MotoristaQuantidadeViagens("00123456789", 1, "Ana", 10),
                new MotoristaQuantidadeViagens("11111111111", 2, "Bruno", 30)));
        mvc.perform(get("/indicadores/utilizacao").param("dataInicio", "01/09/2026")
                        .param("dataFim", "10/09/2026").param("cpf", " "))
                .andExpect(status().isOk()).andExpect(jsonPath("$.motoristas.length()").value(2));
    }

    @Test void motoristaCadastradoSemViagensMantemZero() throws Exception {
        when(repo.consultar(any())).thenReturn(List.of(
                new MotoristaQuantidadeViagens("00123456789", 1, "Ana", 0),
                new MotoristaQuantidadeViagens("11111111111", 2, "Bruno", 30)));
        mvc.perform(get("/indicadores/utilizacao").param("dataInicio", "01/09/2026")
                        .param("dataFim", "10/09/2026").param("cpf", "00123456789"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.totalViagens").value(30))
                .andExpect(jsonPath("$.motoristas[0].porcentagem").value(0))
                .andExpect(jsonPath("$.motoristas[0].status").value("SEM_VIAGENS"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"123", "abcdefghijk", "abc00123456789", "001/234/56789"})
    void rejeitaFormatoCpfInvalido(String cpf) throws Exception {
        mvc.perform(get("/indicadores/utilizacao").param("dataInicio", "01/09/2026")
                        .param("dataFim", "10/09/2026").param("cpf", cpf))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.erro").isNotEmpty());
        verifyNoInteractions(repo);
    }

    @Test void rejeitaParametroAusente() throws Exception {
        mvc.perform(get("/indicadores/utilizacao")).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").isNotEmpty());
        verifyNoInteractions(repo);
    }

    @Test void rejeitaDataInvalida() throws Exception {
        mvc.perform(get("/indicadores/utilizacao").param("dataInicio", "31/02/2026")
                .param("dataFim", "10/09/2026")).andExpect(status().isBadRequest());
        verifyNoInteractions(repo);
    }

    @Test void rejeitaOrdenacaoInvalida() throws Exception {
        mvc.perform(get("/indicadores/utilizacao").param("dataInicio", "01/09/2026")
                .param("dataFim", "10/09/2026").param("ordenacao", "nome"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.erro").isNotEmpty());
        verifyNoInteractions(repo);
    }

    @Test void bancoIndisponivelRetornaMensagemAmigavel() throws Exception {
        when(repo.consultar(any())).thenThrow(new DataAccessResourceFailureException("segredo"));
        mvc.perform(get("/indicadores/utilizacao").param("dataInicio", "01/09/2026")
                .param("dataFim", "10/09/2026"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.erro").value(
                        "Não foi possível consultar as viagens agora. Tente novamente em instantes."));
    }
}
