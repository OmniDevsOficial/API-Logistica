package com.ominidevs.operacional.veiculo.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.ominidevs.operacional.veiculo.dto.ImportacaoVeiculoResponse;
import com.ominidevs.operacional.veiculo.dto.OcorrenciaLinhaVeiculo;
import com.ominidevs.operacional.veiculo.exceptions.ArquivoVeiculoInvalidoException;
import com.ominidevs.operacional.veiculo.dto.FiltroVeiculo;
import com.ominidevs.operacional.veiculo.dto.VeiculoResponse;
import com.ominidevs.operacional.veiculo.exceptions.VeiculoNaoEncontradoException;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.veiculo.dto.PaginaResponse;
import com.ominidevs.operacional.veiculo.dto.ResumoFrotaResponse;
import com.ominidevs.operacional.veiculo.dto.VeiculoFrotaResponse;
import com.ominidevs.operacional.veiculo.exceptions.ParametroFrotaInvalidoException;
import com.ominidevs.operacional.veiculo.services.FrotaService;
import com.ominidevs.operacional.veiculo.services.ImportacaoVeiculoService;
import com.ominidevs.operacional.veiculo.services.VeiculoConsultaService;

@WebMvcTest(VeiculoController.class)
class VeiculoControllerTest {

    @Autowired private MockMvc mvc;
    @MockitoBean private ImportacaoVeiculoService service;
    @MockitoBean private VeiculoConsultaService consultaService;
    @MockitoBean private FrotaService frotaService;

    @Test
    void listaFrotaPaginadaComValoresPadrao() throws Exception {
        when(frotaService.listar(0, 20, null, null, null)).thenReturn(new PaginaResponse<>(List.of(
                new VeiculoFrotaResponse(1, "ABC-1D23", "FIORINO", "FIAT", "FIORINO", "FLEX", "Ana",
                        LocalDateTime.of(2026, 11, 18, 10, 30), Map.of("Cor", "BRANCA"))), 0, 20, 1, 1));

        mvc.perform(get("/veiculos/frota"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itens[0].placa").value("ABC-1D23"))
                .andExpect(jsonPath("$.itens[0].motorista").value("Ana"))
                .andExpect(jsonPath("$.itens[0].dadosAdicionais.Cor").value("BRANCA"))
                .andExpect(jsonPath("$.totalItens").value(1))
                .andExpect(jsonPath("$.totalPaginas").value(1));
    }

    @Test
    void listaFrotaRepassandoPaginacaoEFiltros() throws Exception {
        when(frotaService.listar(2, 50, "VAN", "abc-1", null)).thenReturn(new PaginaResponse<>(List.of(), 2, 50, 0, 0));

        mvc.perform(get("/veiculos/frota")
                        .param("pagina", "2").param("tamanho", "50").param("tipo", "VAN").param("busca", "abc-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itens").isEmpty())
                .andExpect(jsonPath("$.pagina").value(2));
    }

    @Test
    void parametroDePaginacaoForaDoLimiteRetorna400() throws Exception {
        when(frotaService.listar(0, 101, null, null, null)).thenThrow(
                new ParametroFrotaInvalidoException("O parâmetro tamanho deve estar entre 1 e 100."));

        mvc.perform(get("/veiculos/frota").param("tamanho", "101"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("O parâmetro tamanho deve estar entre 1 e 100."));
    }

    @Test
    void paginaNaoNumericaRetorna400() throws Exception {
        mvc.perform(get("/veiculos/frota").param("pagina", "abc"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("O parâmetro pagina é inválido."));
    }

    @Test
    void repassaPeriodoParaListagemEResumo() throws Exception {
        var setembro = new PeriodoConsulta(LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30));
        when(frotaService.listar(0, 20, null, null, setembro)).thenReturn(new PaginaResponse<>(List.of(), 0, 20, 0, 0));
        when(frotaService.resumir(setembro)).thenReturn(
                new ResumoFrotaResponse(false, 0, 0, 0, List.of(), List.of(), List.of()));

        mvc.perform(get("/veiculos/frota").param("dataInicio", "01/09/2026").param("dataFim", "30/09/2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalItens").value(0));
        mvc.perform(get("/veiculos/resumo").param("dataInicio", "01/09/2026").param("dataFim", "30/09/2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.possuiDados").value(false));
    }

    @Test
    void periodoIncompletoOuInvalidoRetorna400() throws Exception {
        mvc.perform(get("/veiculos/resumo").param("dataInicio", "01/09/2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Informe dataInicio e dataFim juntos, no formato dd/MM/aaaa."));
        mvc.perform(get("/veiculos/frota").param("dataInicio", "2026-09-01").param("dataFim", "30/09/2026"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Informe datas válidas no formato dd/MM/aaaa."));
    }

    @Test
    void retornaResumoDaFrota() throws Exception {
        when(frotaService.resumir(null)).thenReturn(new ResumoFrotaResponse(true, 3, 1, 2,
                List.of(new ResumoFrotaResponse.QuantidadePorTipo("VAN", 2),
                        new ResumoFrotaResponse.QuantidadePorTipo("NAO_IDENTIFICADO", 1)),
                List.of(new ResumoFrotaResponse.PercentualPorCombustivel("DIESEL", 2, new BigDecimal("66.7"))),
                List.of(new ResumoFrotaResponse.QuantidadePorMarca("FIAT", 2))));

        mvc.perform(get("/veiculos/resumo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.possuiDados").value(true))
                .andExpect(jsonPath("$.veiculosSemMotorista").value(1))
                .andExpect(jsonPath("$.porTipo[1].tipo").value("NAO_IDENTIFICADO"))
                .andExpect(jsonPath("$.porCombustivel[0].percentual").value(66.7))
                .andExpect(jsonPath("$.porMarca[0].marca").value("FIAT"));
    }

    @Test
    void listaVeiculosRepassandoOsFiltros() throws Exception {
        when(consultaService.listar(new FiltroVeiculo("abc", "fiorino", 7, true))).thenReturn(List.of(
                new VeiculoResponse(1, "ABC1D23", "FIORINO", "FIAT", "FIORINO", true, 7, "Ana")));

        mvc.perform(get("/veiculos")
                        .param("placa", "abc").param("tipo", "fiorino")
                        .param("motoristaId", "7").param("ativo", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].placa").value("ABC1D23"))
                .andExpect(jsonPath("$[0].modelo").value("FIORINO"))
                .andExpect(jsonPath("$[0].motoristaNome").value("Ana"));
    }

    @Test
    void listaTipos() throws Exception {
        when(consultaService.listarTipos()).thenReturn(List.of("FIORINO", "VAN"));

        mvc.perform(get("/veiculos/tipos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[1]").value("VAN"));
    }

    @Test
    void placaInexistenteRetorna404() throws Exception {
        when(consultaService.buscarPorPlaca("ZZZ9Z99")).thenThrow(new VeiculoNaoEncontradoException("ZZZ9Z99"));

        mvc.perform(get("/veiculos/ZZZ9Z99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.erro").value("Veículo não encontrado: ZZZ9Z99."));
    }

    private final MockMultipartFile arquivo =
            new MockMultipartFile("file", "veiculos.csv", "text/csv", "Placa;Tipo Veículo".getBytes());

    @Test
    void retornaResumoDaImportacao() throws Exception {
        when(service.importar(any())).thenReturn(new ImportacaoVeiculoResponse(3, 1, 1, 1, 0, 1,
                List.of(new OcorrenciaLinhaVeiculo(4, "AB12", "Placa inválida. Use o formato AAA9999 ou AAA9A99.")),
                List.of()));

        mvc.perform(multipart("/veiculos/importacao").file(arquivo))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalLinhas").value(3))
                .andExpect(jsonPath("$.veiculosCadastrados").value(1))
                .andExpect(jsonPath("$.linhasComErro").value(1))
                .andExpect(jsonPath("$.erros[0].linha").value(4))
                .andExpect(jsonPath("$.erros[0].placa").value("AB12"))
                .andExpect(jsonPath("$.avisos").isEmpty());
    }

    @Test
    void arquivoInvalidoRetorna400ComMensagem() throws Exception {
        when(service.importar(any())).thenThrow(
                new ArquivoVeiculoInvalidoException("Colunas obrigatórias ausentes: Tipo Veículo."));

        mvc.perform(multipart("/veiculos/importacao").file(arquivo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Colunas obrigatórias ausentes: Tipo Veículo."));
    }

    @Test
    void excessoDeTamanhoRetorna400NaImportacaoDeVeiculos() throws Exception {
        // MockMvc não aplica o limite multipart do servidor: testa o handler da exceção.
        when(service.importar(any())).thenThrow(new MaxUploadSizeExceededException(10L * 1024 * 1024));

        mvc.perform(multipart("/veiculos/importacao").file(arquivo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("O arquivo excede o tamanho máximo permitido (10MB)."));
    }

    @Test
    void importacaoConcorrenteRetorna409() throws Exception {
        when(service.importar(any())).thenThrow(new DataIntegrityViolationException("ux_veiculo_placa"));

        mvc.perform(multipart("/veiculos/importacao").file(arquivo))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.erro").value(
                        "Outra importação alterou os mesmos veículos ao mesmo tempo. Envie o arquivo novamente."));
    }
}
