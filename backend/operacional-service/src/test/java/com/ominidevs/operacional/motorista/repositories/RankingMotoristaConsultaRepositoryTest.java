package com.ominidevs.operacional.motorista.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.motorista.dto.RankingMotoristaResponse;
import com.ominidevs.operacional.motorista.entities.Motorista;
import com.ominidevs.operacional.motorista.entities.StatusMotorista;
import com.ominidevs.operacional.motorista.projections.RankingMotoristaLinha;
import com.ominidevs.operacional.motorista.services.RankingMotoristaService;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.repositories.ViagemRepository;

import jakarta.persistence.EntityManager;

/**
 * Ranking de motoristas com SQL real no PostgreSQL. O driver Testcontainers
 * cria um banco exclusivo; requer Docker ativo. Cada teste desfaz seus dados
 * ao terminar.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, properties = {
        "spring.datasource.url=jdbc:tc:postgresql:17-alpine:///ranking_motorista?currentSchema=operacional",
        "spring.datasource.driver-class-name=org.testcontainers.jdbc.ContainerDatabaseDriver",
        "spring.datasource.username=test",
        "spring.datasource.password=test",
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.properties.hibernate.default_schema=operacional",
        "spring.flyway.schemas=operacional",
        "spring.flyway.create-schemas=true"
})
@Transactional
class RankingMotoristaConsultaRepositoryTest {

    @Autowired private RankingMotoristaConsultaRepository repository;
    @Autowired private RankingMotoristaService service;
    @Autowired private MotoristaRepository motoristas;
    @Autowired private ViagemRepository viagens;
    @Autowired private EntityManager entityManager;

    private int sequencia;

    private Viagem viagem(String data, String motorista, String cpf, String veiculo,
            String receita, String valeFrete) {
        Viagem viagem = new Viagem("M-" + (++sequencia), LocalDate.parse(data), motorista, cpf,
                veiculo, "Origem Teste", "Destino Teste", new BigDecimal("1000.00"),
                100, 200, StatusViagem.FINALIZADO, null, null);
        viagem.setVeiculoTipo("Truck");
        viagem.setReceitaFrete(receita == null ? null : new BigDecimal(receita));
        viagem.setValeFrete(valeFrete == null ? null : new BigDecimal(valeFrete));
        return viagem;
    }

    private Motorista motorista(String nome, String cpf, String placa, String tipo) {
        Motorista motorista = new Motorista(nome, cpf, LocalDate.of(2026, 1, 1),
                StatusMotorista.DISPONIVEL);
        motorista.setVeiculoPlaca(placa);
        motorista.setVeiculoTipo(tipo);
        return motoristas.save(motorista);
    }

    private void salvar(List<Viagem> novas) {
        viagens.saveAll(novas);
        entityManager.flush();
        entityManager.clear();
    }

    private List<RankingMotoristaLinha> setembro() {
        return repository.consultar(LocalDate.of(2026, 9, 1), LocalDate.of(2026, 10, 1));
    }

    @Test
    void agrupaPeloMotoristaDoManifestoIgnorandoCaixaEVazio() {
        salvar(List.of(
                viagem("2026-09-01", "Ana Silva", "00123456789", "ABC1D23", "1000.00", "400.00"),
                viagem("2026-09-02", "  ana silva  ", "00123456789", "ABC1D23", "500.00", "200.00"),
                viagem("2026-09-03", "   ", "99999999999", "ZZZ9A99", "700.00", "100.00")));

        List<RankingMotoristaLinha> linhas = setembro();

        assertEquals(1, linhas.size());
        RankingMotoristaLinha linha = linhas.getFirst();
        assertEquals("Ana Silva", linha.nome());
        assertEquals(2, linha.quantidadeViagens());
        assertEquals(2, linha.diasComViagem());
        assertEquals(new BigDecimal("1500.00"), linha.frete());
        assertEquals(new BigDecimal("600.00"), linha.custos());
        assertEquals(new BigDecimal("900.00"), linha.rentabilidadeTotal());
    }

    @Test
    void resolveCadastroDoMotoristaPeloCpfNormalizado() {
        Motorista cadastrado = motorista("Ana Silva", "00123456789", "RTA4F21", "Cavalo mecânico");
        salvar(List.of(
                viagem("2026-09-01", "Ana Silva", "001.234.567-89", "ABC1D23", "1000.00", "400.00"),
                viagem("2026-09-02", "Ana Silva", "00123456789", "ZZZ9A99", "1000.00", "400.00")));

        RankingMotoristaLinha linha = setembro().getFirst();

        // O cadastro do motorista vence a placa/tipo da última viagem.
        assertEquals(cadastrado.getId(), linha.motoristaId());
        assertEquals("00123456789", linha.cpf());
        assertEquals("RTA4F21", linha.placa());
        assertEquals("Cavalo mecânico", linha.veiculo());
    }

    @Test
    void cpfSemCadastroVemDaViagemNormalizadoNoServico() {
        // Sem cadastro: o CPF vem do manifesto, com pontuação, e o service
        // normaliza para 11 dígitos antes de entregar ao front.
        salvar(List.of(
                viagem("2026-09-01", "Sem Cadastro", "001.234.567-89", "ABC1D23",
                        "1000.00", "400.00")));

        RankingMotoristaLinha linha = setembro().getFirst();
        assertEquals("001.234.567-89", linha.cpf());

        RankingMotoristaResponse item = service.ranking(
                new PeriodoConsulta(LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30)))
                .getFirst();
        assertEquals("00123456789", item.cpf());
        assertNull(item.telefone());
    }

    @Test
    void usaOVeiculoDaUltimaViagemQuandoNaoHaCadastro() {
        salvar(List.of(
                viagem("2026-09-01", "Sem Cadastro", "", "ABC1D23", "1000.00", "400.00"),
                viagem("2026-09-15", "Sem Cadastro", "", "ZZZ9A99", "1000.00", "400.00")));

        RankingMotoristaLinha linha = setembro().getFirst();

        assertNull(linha.motoristaId());
        assertEquals("ZZZ9A99", linha.placa());
        assertEquals("Truck", linha.veiculo());
    }

    @Test
    void consideraSomenteAsViagensDoPeriodoSemiaberto() {
        salvar(List.of(
                // 31/08 está fora: o período começa em 01/09.
                viagem("2026-08-31", "Ana Silva", "00123456789", "ABC1D23", "9999.00", "0.00"),
                viagem("2026-09-01", "Ana Silva", "00123456789", "ABC1D23", "1000.00", "400.00"),
                viagem("2026-09-30", "Ana Silva", "00123456789", "ABC1D23", "2000.00", "600.00"),
                // 01/10 está fora: o fim é exclusivo (01/10).
                viagem("2026-10-01", "Ana Silva", "00123456789", "ABC1D23", "9999.00", "0.00")));

        RankingMotoristaLinha linha = setembro().getFirst();

        assertEquals(2, linha.quantidadeViagens());
        assertEquals(2, linha.diasComViagem());
        assertEquals(new BigDecimal("3000.00"), linha.frete());
        assertEquals(new BigDecimal("1000.00"), linha.custos());
        assertEquals(new BigDecimal("2000.00"), linha.rentabilidadeTotal());
    }

    @Test
    void contaTodasAsViagensMasIgnoraNulosNaRentabilidadeTotal() {
        salvar(List.of(
                viagem("2026-09-01", "Ana Silva", "00123456789", "ABC1D23", "1000.00", "400.00"),
                viagem("2026-09-02", "Ana Silva", "00123456789", "ABC1D23", "500.00", null)));

        RankingMotoristaLinha linha = setembro().getFirst();

        assertEquals(2, linha.quantidadeViagens());
        assertEquals(new BigDecimal("1500.00"), linha.frete());
        assertEquals(new BigDecimal("400.00"), linha.custos());
        // Mesma regra da US09: a expressão com NULL não entra no somatório.
        assertEquals(new BigDecimal("600.00"), linha.rentabilidadeTotal());
    }

    @Test
    void motoristaComCadastroSemViagemNaoAparece() {
        motorista("Parado", "11111111111", "PAR1A23", "Truck");
        salvar(List.of(viagem("2026-09-01", "Ana Silva", "00123456789", "ABC1D23",
                "1000.00", "400.00")));

        List<RankingMotoristaLinha> linhas = setembro();

        assertEquals(1, linhas.size());
        assertEquals("Ana Silva", linhas.getFirst().nome());
    }

    @Test
    void mesSemViagensRetornaListaVazia() {
        salvar(List.of(viagem("2026-09-01", "Ana Silva", "00123456789", "ABC1D23",
                "1000.00", "400.00")));

        assertTrue(repository.consultar(LocalDate.of(2026, 12, 1),
                LocalDate.of(2027, 1, 1)).isEmpty());
    }

    @Test
    void rankingCompletoOrdenaECalculaFrequenciaComVinteEOitoDias() {
        salvar(List.of(
                // Empate de média (400.00), de viagens (2) e de frequência: o nome decide.
                viagem("2026-02-02", "Ana Silva", "00123456789", "ABC1D23", "600.00", "200.00"),
                viagem("2026-02-10", "Ana Silva", "00123456789", "ABC1D23", "600.00", "200.00"),
                viagem("2026-02-02", "Bruno Dias", "22222222222", "DEF4E56", "600.00", "200.00"),
                viagem("2026-02-10", "Bruno Dias", "22222222222", "DEF4E56", "600.00", "200.00"),
                // Média menor (100.00): fica atrás mesmo com mais viagens no total.
                viagem("2026-02-01", "Zeca Lima", "33333333333", "GHI7J89", "200.00", "100.00"),
                viagem("2026-02-03", "Zeca Lima", "33333333333", "GHI7J89", "200.00", "100.00"),
                viagem("2026-02-05", "Zeca Lima", "33333333333", "GHI7J89", "200.00", "100.00"),
                viagem("2026-02-07", "Zeca Lima", "33333333333", "GHI7J89", "200.00", "100.00")));

        List<RankingMotoristaResponse> ranking = service.ranking(
                new PeriodoConsulta(LocalDate.of(2026, 2, 1), LocalDate.of(2026, 2, 28)));

        assertEquals(List.of("Ana Silva", "Bruno Dias", "Zeca Lima"),
                ranking.stream().map(RankingMotoristaResponse::nome).toList());
        assertEquals(List.of(1, 2, 3),
                ranking.stream().map(RankingMotoristaResponse::posicao).toList());

        RankingMotoristaResponse ana = ranking.getFirst();
        assertEquals(new BigDecimal("400.00"), ana.rentabilidadeMedia());
        assertEquals(new BigDecimal("800.00"), ana.rentabilidadeTotal());
        assertEquals(2, ana.quantidadeViagens());
        // Fevereiro/2026 tem 28 dias: 2 ÷ 28 × 100 = 7,14.
        assertEquals(new BigDecimal("7.14"), ana.frequencia());

        // Zeca viajou em 4 dias: 4 ÷ 28 × 100 = 14,29 (frequência maior, média menor).
        assertEquals(new BigDecimal("14.29"), ranking.getLast().frequencia());
    }

    @Test
    void frequenciaUsaVinteENoveDiasEmFevereiroBissexto() {
        salvar(List.of(
                viagem("2024-02-01", "Ana Silva", "00123456789", "ABC1D23", "600.00", "200.00"),
                viagem("2024-02-15", "Ana Silva", "00123456789", "ABC1D23", "600.00", "200.00")));

        List<RankingMotoristaResponse> ranking = service.ranking(
                new PeriodoConsulta(LocalDate.of(2024, 2, 1), LocalDate.of(2024, 2, 29)));

        // 2 ÷ 29 × 100 = 6,90.
        assertEquals(new BigDecimal("6.90"), ranking.getFirst().frequencia());
    }
}
