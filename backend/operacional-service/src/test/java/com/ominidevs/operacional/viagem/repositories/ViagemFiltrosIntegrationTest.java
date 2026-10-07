package com.ominidevs.operacional.viagem.repositories;

import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.services.ViagemService;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Serviço, Specifications e repositório reais, com as migrations da aplicação.
 * O driver Testcontainers cria um PostgreSQL exclusivo; não usa o banco do .env.
 * Requer Docker ativo. Cada teste desfaz seus dados ao terminar.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, properties = {
        "spring.datasource.url=jdbc:tc:postgresql:17-alpine:///filtros?currentSchema=operacional",
        "spring.datasource.driver-class-name=org.testcontainers.jdbc.ContainerDatabaseDriver",
        "spring.datasource.username=test",
        "spring.datasource.password=test",
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.properties.hibernate.default_schema=operacional",
        "spring.flyway.schemas=operacional",
        "spring.flyway.create-schemas=true"
})
@Transactional
class ViagemFiltrosIntegrationTest {
    @Autowired private ViagemRepository repository;
    @Autowired private ViagemService service;
    @Autowired private EntityManager entityManager;

    @BeforeEach void inserirDados() {
        repository.saveAll(List.of(
                viagem("INICIO", "2026-09-01", "Campinas", "1000.00", StatusViagem.PENDENTE),
                viagem("FIM", "2026-09-30", "CAMPINAS", "2000.00", StatusViagem.FINALIZADO),
                viagem("MEIO", "2026-09-15", "São Paulo", "1500.00", StatusViagem.EM_TRANSITO),
                viagem("ANTES", "2026-08-31", "Campinas", "999.99", StatusViagem.PENDENTE),
                viagem("DEPOIS", "2026-10-01", "Campinas", "2000.01", StatusViagem.PENDENTE),
                viagem("NULOS", "2026-09-10", null, null, StatusViagem.PENDENTE),
                viagem("BISSEXTO", "2024-02-29", "Curitiba", "500.00", StatusViagem.FINALIZADO)
        ));
        entityManager.flush();
        entityManager.clear();
    }

    private Viagem viagem(String manifesto, String data, String destino, String frete, StatusViagem status) {
        return new Viagem(manifesto, LocalDate.parse(data), "Motorista Teste", "00123456789",
                "ABC1D23", "Origem Teste", destino, frete == null ? null : new BigDecimal(frete),
                100, 200, status, null, null);
    }

    private void conferir(List<Viagem> viagens, String... manifestos) {
        assertEquals(java.util.Arrays.stream(manifestos).sorted().toList(),
                viagens.stream().map(Viagem::getManifesto).sorted().toList());
    }

    @Test void semFiltrosRetornaTodasInclusiveCamposOpcionaisNulos() {
        conferir(service.filtrar(null, null, null, null, null),
                "INICIO", "FIM", "MEIO", "ANTES", "DEPOIS", "NULOS", "BISSEXTO");
    }

    @Test void filtrosVaziosNaoRestringemConsulta() {
        assertEquals(7, service.filtrar("  ", List.of(), null, null, " ").size());
    }

    @Test void destinoUsaTrechoIgnoraCaixaEEspacosExternos() {
        conferir(service.filtrar("  aMPin  ", null, null, null, null),
                "INICIO", "FIM", "ANTES", "DEPOIS");
    }

    @Test void statusUnicoSelecionaSomenteCorrespondentes() {
        conferir(service.filtrar(null, List.of(StatusViagem.EM_TRANSITO), null, null, null), "MEIO");
    }

    @Test void multiplosStatusFuncionamComoAlternativas() {
        conferir(service.filtrar(null, List.of(StatusViagem.EM_TRANSITO, StatusViagem.FINALIZADO),
                null, null, null), "MEIO", "FIM", "BISSEXTO");
    }

    @Test void freteMinimoIncluiValorLimite() {
        conferir(service.filtrar(null, null, new BigDecimal("1000.00"), null, null),
                "INICIO", "FIM", "MEIO", "DEPOIS");
    }

    @Test void freteMaximoIncluiValorLimite() {
        conferir(service.filtrar(null, null, null, new BigDecimal("2000.00"), null),
                "INICIO", "FIM", "MEIO", "ANTES", "BISSEXTO");
    }

    @Test void faixaFreteIncluiExtremosEExcluiNulos() {
        conferir(service.filtrar(null, null, new BigDecimal("1000.00"), new BigDecimal("2000.00"), null),
                "INICIO", "FIM", "MEIO");
    }

    @Test void limitesDeFreteIguaisSelecionamValorExato() {
        conferir(service.filtrar(null, null, new BigDecimal("1500.00"), new BigDecimal("1500.00"), null), "MEIO");
    }

    @Test void mesIncluiPrimeiroEUltimoDiaMasExcluiVizinhos() {
        conferir(service.filtrar(null, null, null, null, "2026-09"), "INICIO", "FIM", "MEIO", "NULOS");
    }

    @Test void fevereiroBissextoIncluiDia29() {
        conferir(service.filtrar(null, null, null, null, "2024-02"), "BISSEXTO");
    }

    @Test void filtrosCombinadosExigemTodasAsCondicoes() {
        conferir(service.filtrar("campinas", List.of(StatusViagem.PENDENTE),
                new BigDecimal("1000.00"), new BigDecimal("2000.00"), "2026-09"), "INICIO");
    }

    @Test void semCorrespondenciaRetornaListaVazia() {
        assertTrue(service.filtrar("Destino inexistente", null, null, null, null).isEmpty());
    }

    @Test void mudarMesReconsultaDadosCorretos() {
        conferir(service.filtrar(null, null, null, null, "2026-08"), "ANTES");
        conferir(service.filtrar(null, null, null, null, "2026-10"), "DEPOIS");
    }
}
