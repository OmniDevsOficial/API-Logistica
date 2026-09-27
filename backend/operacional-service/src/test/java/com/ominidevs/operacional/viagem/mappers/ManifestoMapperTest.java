package com.ominidevs.operacional.viagem.mappers;

import com.ominidevs.operacional.viagem.dto.ManifestoDTO;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Testes unitários do ManifestoMapper.
 */
class ManifestoMapperTest {

    private final ManifestoMapper mapper = new ManifestoMapper();

    @Test
    void deveMapearManifestoCompleto() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-001",
                "20/09/2026",
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                "Rio de Janeiro",
                "1500,50",
                "10000",
                "10250",
                "PENDENTE",
                "Entrega realizada"
        );

        Viagem viagem = mapper.toEntity(manifesto);

        assertEquals("MAN-001", viagem.getManifesto());
        assertEquals(LocalDate.of(2026, 9, 20), viagem.getData());
        assertEquals("João da Silva", viagem.getMotorista());
        assertEquals("12233245124", viagem.getCPF());
        assertEquals("ABC1D23", viagem.getVeiculo());
        assertEquals("São Paulo", viagem.getCidadeOrigem());
        assertEquals("Rio de Janeiro", viagem.getCidadeDestino());
        assertEquals(new BigDecimal("1500.50"), viagem.getValorFrete());
        assertEquals(10000, viagem.getKmSaida());
        assertEquals(10250, viagem.getKmChegada());
        assertEquals(StatusViagem.PENDENTE, viagem.getStatus());
        assertEquals("Entrega realizada", viagem.getObservacoes());
        assertNull(viagem.getEstimativaDias());
    }

    @Test
    void deveMapearOrigemVazioComoNull() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-002",
                "20/09/2026",
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "",  // origem vazia
                "Rio de Janeiro",
                "1500,50",
                "10000",
                "10250",
                "PENDENTE",
                null
        );

        Viagem viagem = mapper.toEntity(manifesto);

        assertNull(viagem.getCidadeOrigem());
    }

    @Test
    void deveMapearDestinoVazioComoNull() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-003",
                "20/09/2026",
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                "",  // destino vazio
                "1500,50",
                "10000",
                "10250",
                "PENDENTE",
                null
        );

        Viagem viagem = mapper.toEntity(manifesto);

        assertNull(viagem.getCidadeDestino());
    }

    @Test
    void deveMapearKmVaziosComoNull() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-004",
                "20/09/2026",
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                "Rio de Janeiro",
                "1500,50",
                "",  // km saída vazio
                "",  // km chegada vazio
                "PENDENTE",
                null
        );

        Viagem viagem = mapper.toEntity(manifesto);

        assertNull(viagem.getKmSaida());
        assertNull(viagem.getKmChegada());
    }

    @Test
    void deveMapearValorFreteComVirgula() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-005",
                "20/09/2026",
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                "Rio de Janeiro",
                "2.500,99",  // Com separador de milhar
                "10000",
                "10250",
                "PENDENTE",
                null
        );

        Viagem viagem = mapper.toEntity(manifesto);

        assertEquals(new BigDecimal("2500.99"), viagem.getValorFrete());
    }

    @Test
    void deveAssumirPendenteQuandoStatusVazio() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-006",
                "20/09/2026",
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                "Rio de Janeiro",
                "1500,50",
                "10000",
                "10250",
                "",  // status vazio
                null
        );

        Viagem viagem = mapper.toEntity(manifesto);

        assertEquals(StatusViagem.PENDENTE, viagem.getStatus());
    }

    @Test
    void deveMapearStatusEmTransito() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-007",
                "20/09/2026",
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                "Rio de Janeiro",
                "1500,50",
                "10000",
                "10250",
                "EM TRANSITO",
                null
        );

        Viagem viagem = mapper.toEntity(manifesto);

        assertEquals(StatusViagem.EM_TRANSITO, viagem.getStatus());
    }

    @Test
    void deveMapearStatusFinalizado() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-008",
                "20/09/2026",
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                "Rio de Janeiro",
                "1500,50",
                "10000",
                "10250",
                "FINALIZADO",
                null
        );

        Viagem viagem = mapper.toEntity(manifesto);

        assertEquals(StatusViagem.FINALIZADO, viagem.getStatus());
    }

    @Test
    void deveRejeitarManifestoSemManifesto() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "",  // manifesto vazio
                "20/09/2026",
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                "Rio de Janeiro",
                "1500,50",
                "10000",
                "10250",
                "PENDENTE",
                null
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toEntity(manifesto)
        );

        assertEquals("Manifesto inválido ou incompleto.", exception.getMessage());
    }

    @Test
    void deveRejeitarManifestoSemData() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-001",
                "",  // data vazia
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                "Rio de Janeiro",
                "1500,50",
                "10000",
                "10250",
                "PENDENTE",
                null
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toEntity(manifesto)
        );

        assertEquals("Manifesto inválido ou incompleto.", exception.getMessage());
    }

    @Test
    void deveRejeitarManifestoSemValorFrete() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-001",
                "20/09/2026",
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                "Rio de Janeiro",
                "",  // valor frete vazio
                "10000",
                "10250",
                "PENDENTE",
                null
        );

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toEntity(manifesto)
        );

        assertEquals("Manifesto inválido ou incompleto.", exception.getMessage());
    }

    @Test
    void deveRejeitarStatusInvalido() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-001",
                "20/09/2026",
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                "Rio de Janeiro",
                "1500,50",
                "10000",
                "10250",
                "CANCELADO",  // Status inválido
                null
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toEntity(manifesto)
        );
    }

    @Test
    void deveRejeitarDataInvalida() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-001",
                "32/13/2026",  // Data inválida
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                "Rio de Janeiro",
                "1500,50",
                "10000",
                "10250",
                "PENDENTE",
                null
        );

        assertThrows(
                Exception.class,  // DateTimeParseException
                () -> mapper.toEntity(manifesto)
        );
    }
}