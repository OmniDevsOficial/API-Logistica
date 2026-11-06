package com.ominidevs.operacional.veiculo.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

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
import com.ominidevs.operacional.veiculo.services.ImportacaoVeiculoService;
import com.ominidevs.operacional.veiculo.services.VeiculoConsultaService;

@WebMvcTest(VeiculoController.class)
class VeiculoControllerTest {

    @Autowired private MockMvc mvc;
    @MockitoBean private ImportacaoVeiculoService service;
    @MockitoBean private VeiculoConsultaService consultaService;

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
