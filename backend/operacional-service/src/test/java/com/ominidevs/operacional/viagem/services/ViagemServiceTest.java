package com.ominidevs.operacional.viagem.services;

import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.repositories.ViagemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ViagemServiceTest {

    @Mock
    private RestClient restClient;

    @Mock
    private ViagemRepository viagemRepository;

    @InjectMocks
    private ViagemService viagemService;

    @Test
    void deveMapearManifestoConsistentemente() {

        Map<String, String> manifesto = Map.of(
                "Manifesto", "MAN-001",
                "Data", "20/09/2026",
                "Motorista", "João da Silva",
                "CPF", "12233245124",
                "Veículo", "ABC1D23",
                "Destino", "São Paulo",
                "Valor Frete", "1500,50",
                "Km saída", "10000",
                "Km chegada", "10250",
                "Status", "Finalizado",
                "Observações operacionais", "Entrega realizada"
        );

        Viagem viagem = viagemService.mapearManifesto(manifesto);

        assertEquals("MAN-001", viagem.getManifesto());

        assertEquals(
                LocalDate.of(2026, 9, 20),
                viagem.getData()
        );

        assertEquals(
                "João da Silva",
                viagem.getMotorista()
        );

        assertEquals(
                "12233245124",
                viagem.getCPF()
        );

        assertEquals(
                "ABC1D23",
                viagem.getVeiculo()
        );

        assertEquals(
                "São Paulo",
                viagem.getCidadeDestino()
        );

        assertEquals(
                new BigDecimal("1500.50"),
                viagem.getValorFrete()
        );

        assertEquals(
                10000,
                viagem.getKmSaida()
        );

        assertEquals(
                10250,
                viagem.getKmChegada()
        );

        assertEquals(
                "Finalizado",
                viagem.getStatus()
        );

        assertEquals(
                "Entrega realizada",
                viagem.getObservacoes()
        );
    }

    @Test
    void deveMapearDestinoVazioComoNull() {

        Map<String, String> manifesto = Map.of(
                "Manifesto", "MAN-001",
                "Data", "20/09/2026",
                "Motorista", "João da Silva",
                "CPF", "12233245124",
                "Veículo", "ABC1D23",
                "Destino", "",
                "Valor Frete", "1500,50"
        );

        Viagem viagem = viagemService.mapearManifesto(manifesto);

        assertNull(viagem.getCidadeDestino());
    }

    @Test
    void deveMapearKmVaziosComoNull() {

        Map<String, String> manifesto = Map.of(
                "Manifesto", "MAN-001",
                "Data", "20/09/2026",
                "Motorista", "João da Silva",
                "CPF", "12233245124",
                "Veículo", "ABC1D23",
                "Destino", "São Paulo",
                "Valor Frete", "1500,50",
                "Km saída", "",
                "Km chegada", ""
        );

        Viagem viagem = viagemService.mapearManifesto(manifesto);

        assertNull(viagem.getKmSaida());
        assertNull(viagem.getKmChegada());
    }

    @Test
    void deveRejeitarManifestoSemManifesto() {

        Map<String, String> manifesto = Map.of(
                "Manifesto", "",
                "Data", "20/09/2026",
                "Motorista", "João da Silva",
                "CPF", "12233245124",
                "Veículo", "ABC1D23",
                "Destino", "São Paulo",
                "Valor Frete", "1500,50"
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> viagemService.mapearManifesto(manifesto)
        );

        assertEquals(
                "manifesto inválido ou incompleto",
                exception.getMessage()
        );
    }

    @Test
    void deveRejeitarManifestoSemData() {

        Map<String, String> manifesto = Map.of(
                "Manifesto", "MAN-001",
                "Data", "",
                "Motorista", "João da Silva",
                "CPF", "12233245124",
                "Veículo", "ABC1D23",
                "Destino", "São Paulo",
                "Valor Frete", "1500,50"
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> viagemService.mapearManifesto(manifesto)
        );

        assertEquals(
                "manifesto inválido ou incompleto",
                exception.getMessage()
        );
    }

    @Test
    void deveRejeitarManifestoSemValorFrete() {

        Map<String, String> manifesto = Map.of(
                "Manifesto", "MAN-001",
                "Data", "20/09/2026",
                "Motorista", "João da Silva",
                "CPF", "12233245124",
                "Veículo", "ABC1D23",
                "Destino", "São Paulo",
                "Valor Frete", ""
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> viagemService.mapearManifesto(manifesto)
        );

        assertEquals(
                "manifesto inválido ou incompleto",
                exception.getMessage()
        );
    }
}