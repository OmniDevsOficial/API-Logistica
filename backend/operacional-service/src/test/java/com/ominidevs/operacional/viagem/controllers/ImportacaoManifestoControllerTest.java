package com.ominidevs.operacional.viagem.controllers;

import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.services.ViagemService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import java.util.List;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ViagemController.class)
class ImportacaoManifestoControllerTest {
    @Autowired private MockMvc mvc;
    @MockitoBean private ViagemService service;
    private final MockMultipartFile file = new MockMultipartFile("file", "manifesto.csv", "text/csv", new byte[]{1});

    @Test void retornaViagensSalvasNoUpload() throws Exception {
        var viagem = new Viagem();
        ReflectionTestUtils.setField(viagem, "id", 123);
        viagem.setManifesto("M1");
        when(service.importarManifesto(any())).thenReturn(List.of(viagem));
        mvc.perform(multipart("/viagens/importar-manifesto").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(123))
                .andExpect(jsonPath("$[0].manifesto").value("M1"));
        verify(service).importarManifesto(file);
    }

    @Test void parteFileAusenteRetorna400() throws Exception {
        mvc.perform(multipart("/viagens/importar-manifesto"))
                .andExpect(status().isBadRequest());
        verifyNoInteractions(service);
    }

    @Test void relatorioSemLinhasRetornaListaVazia() throws Exception {
        when(service.importarManifesto(any())).thenReturn(List.of());
        mvc.perform(multipart("/viagens/importar-manifesto").file(file))
                .andExpect(status().isOk()).andExpect(content().json("[]"));
    }

    @Test void excessoDeTamanhoRetorna413ComMensagem() throws Exception {
        // MockMvc não aplica o limite multipart do servidor: testa o handler da exceção.
        when(service.importarManifesto(any())).thenThrow(new MaxUploadSizeExceededException(10L * 1024 * 1024));
        mvc.perform(multipart("/viagens/importar-manifesto").file(file))
                .andExpect(status().isPayloadTooLarge())
                .andExpect(jsonPath("$.erro").value("O arquivo excede o tamanho máximo permitido (10MB)."));
    }
}
