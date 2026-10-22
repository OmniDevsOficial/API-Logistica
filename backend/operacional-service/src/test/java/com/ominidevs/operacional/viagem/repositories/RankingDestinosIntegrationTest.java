package com.ominidevs.operacional.viagem.repositories;

import com.ominidevs.operacional.viagem.dto.RankingDestinoResponse;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.services.RentabilidadeService;
import com.ominidevs.operacional.viagem.services.ViagemService;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Ranking de destinos por rentabilidade média com SQL real no PostgreSQL.
 * O driver Testcontainers cria um banco exclusivo; requer Docker ativo.
 * Cada teste desfaz seus dados ao terminar.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, properties = {
        "spring.datasource.url=jdbc:tc:postgresql:17-alpine:///ranking?currentSchema=operacional",
        "spring.datasource.driver-class-name=org.testcontainers.jdbc.ContainerDatabaseDriver",
        "spring.datasource.username=test",
        "spring.datasource.password=test",
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.properties.hibernate.default_schema=operacional",
        "spring.flyway.schemas=operacional",
        "spring.flyway.create-schemas=true"
})
@Transactional
class RankingDestinosIntegrationTest {
    @Autowired private ViagemRepository repository;
    @Autowired private ViagemService service;
    @Autowired private EntityManager entityManager;
    @Autowired private JdbcTemplate jdbc;

    private int sequencia;

    /** Receita = 1000 + rentabilidade; custo 800 e pedágio 200 somam 1000. */
    private Viagem viagem(String data, String destino, String rentabilidade, StatusViagem status) {
        return viagem("Origem Teste", data, destino, rentabilidade, status);
    }

    private Viagem viagem(String origem, String data, String destino, String rentabilidade,
            StatusViagem status) {
        Viagem viagem = new Viagem("M-" + (++sequencia), LocalDate.parse(data), "Motorista Teste",
                "00123456789", "ABC1D23", origem, destino, new BigDecimal("1000.00"),
                100, 200, status, null, null);
        viagem.setReceitaFrete(new BigDecimal("1000.00").add(new BigDecimal(rentabilidade)));
        viagem.setCustoFrete(new BigDecimal("800.00"));
        viagem.setPedagio(new BigDecimal("200.00"));
        return viagem;
    }

    private Viagem viagemSemFinanceiro(String data, String destino, String receita, String custo, String pedagio) {
        Viagem viagem = viagem(data, destino, "0.00", StatusViagem.FINALIZADO);
        viagem.setReceitaFrete(receita == null ? null : new BigDecimal(receita));
        viagem.setCustoFrete(custo == null ? null : new BigDecimal(custo));
        viagem.setPedagio(pedagio == null ? null : new BigDecimal(pedagio));
        return viagem;
    }

    private void salvar(List<Viagem> viagens) {
        repository.saveAll(viagens);
        entityManager.flush();
        entityManager.clear();
    }

    private void salvarSetembro() {
        salvar(List.of(
                viagem("2026-09-01", "Delta", "500.00", StatusViagem.PENDENTE),
                viagem("2026-09-30", "Alfa", "300.00", StatusViagem.FINALIZADO),
                viagem("2026-09-15", "Alfa", "100.00", StatusViagem.EM_TRANSITO),
                viagem("2026-09-10", "Beta", "200.00", StatusViagem.FINALIZADO),
                viagem("2026-09-11", "Gama", "200.00", StatusViagem.PENDENTE),
                viagem("2026-09-12", "Epsilon", "100.00", StatusViagem.FINALIZADO),
                viagem("2026-09-13", "Epsilon", "100.01", StatusViagem.FINALIZADO),
                viagem("2026-09-14", "Campinas", "100.00", StatusViagem.FINALIZADO),
                viagem("2026-09-14", "CAMPINAS", "50.00", StatusViagem.PENDENTE),
                viagem("2026-09-16", "Zeta", "-50.00", StatusViagem.FINALIZADO),
                // Fora do mês: não podem alterar o ranking de setembro.
                viagem("2026-08-31", "Delta", "-9000.00", StatusViagem.FINALIZADO),
                viagem("2026-10-01", "Beta", "9000.00", StatusViagem.FINALIZADO),
                // Nulos: não entram na média nem na contagem.
                viagemSemFinanceiro("2026-09-20", "Alfa", "5000.00", "100.00", null),
                viagemSemFinanceiro("2026-09-20", "Alfa", null, "100.00", "100.00"),
                viagemSemFinanceiro("2026-09-20", "Alfa", "5000.00", null, "100.00"),
                viagemSemFinanceiro("2026-09-21", "Somente Nulos", null, null, null),
                viagem("2026-09-22", null, "8000.00", StatusViagem.FINALIZADO),
                viagem("2026-09-22", "   ", "8000.00", StatusViagem.FINALIZADO)
        ));
    }

    private void conferir(RankingDestinoResponse item, String destino, long quantidade, String media) {
        assertEquals(destino, item.destino());
        assertEquals(quantidade, item.quantidadeViagens());
        assertEquals(new BigDecimal(media), item.rentabilidadeMedia());
    }

    @Test void dadosConhecidosOrdenamPorMediaDecrescenteComDesempate() {
        salvarSetembro();

        List<RankingDestinoResponse> ranking = service.rankingDestinosPorRentabilidade("01/09/2026", "30/09/2026");

        assertEquals(List.of("Delta", "Alfa", "Beta", "Gama", "Epsilon", "Campinas", "Zeta"),
                ranking.stream().map(r -> r.destino().equals("CAMPINAS") ? "Campinas" : r.destino()).toList());
        conferir(ranking.get(0), "Delta", 1, "500.00");
        conferir(ranking.get(1), "Alfa", 2, "200.00");
        conferir(ranking.get(4), "Epsilon", 2, "100.01");
        conferir(ranking.get(6), "Zeta", 1, "-50.00");
    }

    @Test void empateNaMediaDesempataPorQuantidadeEDepoisPorNome() {
        salvarSetembro();

        List<RankingDestinoResponse> empatados = service.rankingDestinosPorRentabilidade("01/09/2026", "30/09/2026")
                .subList(1, 4);

        conferir(empatados.get(0), "Alfa", 2, "200.00");
        conferir(empatados.get(1), "Beta", 1, "200.00");
        conferir(empatados.get(2), "Gama", 1, "200.00");
    }

    @Test void destinoAgrupaIgnorandoCaixa() {
        salvarSetembro();

        RankingDestinoResponse campinas = service.rankingDestinosPorRentabilidade("01/09/2026", "30/09/2026").get(5);

        assertTrue("Campinas".equalsIgnoreCase(campinas.destino()));
        assertEquals(2, campinas.quantidadeViagens());
        assertEquals(new BigDecimal("75.00"), campinas.rentabilidadeMedia());
    }

    @Test void valoresNulosEDestinoVazioFicamForaDoCalculo() {
        salvarSetembro();

        List<RankingDestinoResponse> ranking = service.rankingDestinosPorRentabilidade("01/09/2026", "30/09/2026");

        assertEquals(2, ranking.get(1).quantidadeViagens());
        assertTrue(ranking.stream().noneMatch(r -> r.destino() == null
                || r.destino().isBlank() || r.destino().equals("Somente Nulos")));
    }

    @Test void limitaADezDestinos() {
        List<Viagem> viagens = new ArrayList<>();
        IntStream.rangeClosed(1, 12).forEach(i ->
                viagens.add(viagem("2026-11-05", "Destino %02d".formatted(i), i + ".00", StatusViagem.FINALIZADO)));
        salvar(viagens);

        List<RankingDestinoResponse> ranking = service.rankingDestinosPorRentabilidade("01/11/2026", "30/11/2026");

        assertEquals(10, ranking.size());
        assertEquals("Destino 12", ranking.get(0).destino());
        assertEquals("Destino 03", ranking.get(9).destino());
    }

    @Test void periodoAnualIncluiViagensDeTodosOsMeses() {
        salvarSetembro();

        List<RankingDestinoResponse> ranking = service.rankingDestinosPorRentabilidade("01/01/2026", "31/12/2026");

        conferir(ranking.get(0), "Beta", 2, "4600.00");
        assertEquals("Origem Teste", ranking.get(0).origem());
    }

    @Test void mesmaRotaComOrigensDiferentesFormaGruposSeparados() {
        salvar(List.of(
                viagem("2026-09-01", "Delta", "500.00", StatusViagem.FINALIZADO),
                viagem("Outra Origem", "2026-09-02", "Delta", "100.00", StatusViagem.FINALIZADO)));

        List<RankingDestinoResponse> ranking = service.rankingDestinosPorRentabilidade("01/09/2026", "30/09/2026");

        assertEquals(List.of("Origem Teste", "Outra Origem"),
                ranking.stream().map(RankingDestinoResponse::origem).toList());
    }

    @Test void mesSemViagensRetornaListaVazia() {
        salvarSetembro();

        assertTrue(service.rankingDestinosPorRentabilidade("01/12/2026", "31/12/2026").isEmpty());
    }

    @Test void mesSomenteComValoresNulosRetornaListaVazia() {
        salvar(List.of(viagemSemFinanceiro("2026-07-10", "Alfa", null, "100.00", "100.00")));

        assertTrue(service.rankingDestinosPorRentabilidade("01/07/2026", "31/07/2026").isEmpty());
    }

    @Test void expressaoSqlEquivaleAFormulaJava() {
        salvar(List.of(viagemSemFinanceiro("2026-09-01", "Alfa", "1234.56", "789.01", "45.67")));

        BigDecimal sql = jdbc.queryForObject(
                "SELECT " + RentabilidadeService.EXPRESSAO_SQL + " FROM operacional.viagem",
                BigDecimal.class);

        assertEquals(RentabilidadeService.calcular(
                new BigDecimal("1234.56"), new BigDecimal("789.01"), new BigDecimal("45.67")), sql);
    }
}
