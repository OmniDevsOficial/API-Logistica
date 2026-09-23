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
 * Movido de ViagemServiceTest (OM-72) para acompanhar a extração
 * da lógica de mapeamento para o ManifestoMapper (a classe testada
 * mudou, os cenários cobertos são os mesmos).
 */
class ManifestoMapperTest {

    private final ManifestoMapper mapper = new ManifestoMapper();

    @Test
    void deveMapearManifestoConsistentemente() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-001",
                "20/09/2026",
                "João da Silva",
                "12233245124",
                "ABC1D23",
                "São Paulo",
                "1500,50",
                "10000",
                "10250",
                "Finalizado",
                "Entrega realizada"
        );

        Viagem viagem = mapper.toEntity(manifesto);

        assertEquals("MAN-001", viagem.getManifesto());
        assertEquals(LocalDate.of(2026, 9, 20), viagem.getData());
        assertEquals("João da Silva", viagem.getMotorista());
        assertEquals("12233245124", viagem.getCPF());
        assertEquals("ABC1D23", viagem.getVeiculo());
        assertEquals("São Paulo", viagem.getCidadeDestino());
        assertEquals(new BigDecimal("1500.50"), viagem.getValorFrete());
        assertEquals(10000, viagem.getKmSaida());
        assertEquals(10250, viagem.getKmChegada());
        assertEquals(StatusViagem.FINALIZADO, viagem.getStatus());
        assertEquals("Entrega realizada", viagem.getObservacoes());
    }

    @Test
    void deveMapearDestinoVazioComoNull() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-001", "20/09/2026", "João da Silva", "12233245124",
                "ABC1D23", "", "1500,50", null, null, null, null
        );

        Viagem viagem = mapper.toEntity(manifesto);

        assertNull(viagem.getCidadeDestino());
    }

    @Test
    void deveMapearKmVaziosComoNull() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-001", "20/09/2026", "João da Silva", "12233245124",
                "ABC1D23", "São Paulo", "1500,50", "", "", null, null
        );

        Viagem viagem = mapper.toEntity(manifesto);

        assertNull(viagem.getKmSaida());
        assertNull(viagem.getKmChegada());
    }

    @Test
    void deveAssumirPendenteQuandoStatusVazio() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "MAN-001", "20/09/2026", "João da Silva", "12233245124",
                "ABC1D23", "São Paulo", "1500,50", null, null, "", null
        );

        Viagem viagem = mapper.toEntity(manifesto);

        assertEquals(StatusViagem.PENDENTE, viagem.getStatus());
    }

    @Test
    void deveRejeitarManifestoSemManifesto() {

        ManifestoDTO manifesto = new ManifestoDTO(
                "", "20/09/2026", "João da Silva", "12233245124",
                "ABC1D23", "São Paulo", "1500,50", null, null, null, null
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
                "MAN-001", "", "João da Silva", "12233245124",
                "ABC1D23", "São Paulo", "1500,50", null, null, null, null
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
                "MAN-001", "20/09/2026", "João da Silva", "12233245124",
                "ABC1D23", "São Paulo", "", null, null, null, null
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
                "MAN-001", "20/09/2026", "João da Silva", "12233245124",
                "ABC1D23", "São Paulo", "1500,50", null, null, "Cancelado", null
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toEntity(manifesto)
        );
    }
}
