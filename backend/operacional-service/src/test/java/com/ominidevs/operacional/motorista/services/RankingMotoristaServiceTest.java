package com.ominidevs.operacional.motorista.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.motorista.dto.RankingMotoristaResponse;
import com.ominidevs.operacional.motorista.projections.RankingMotoristaLinha;
import com.ominidevs.operacional.motorista.repositories.RankingMotoristaConsultaRepository;

class RankingMotoristaServiceTest {

    private final RankingMotoristaConsultaRepository repository =
            mock(RankingMotoristaConsultaRepository.class);
    private final RankingMotoristaService service = new RankingMotoristaService(repository);

    private static final PeriodoConsulta FEVEREIRO_2026 =
            new PeriodoConsulta(LocalDate.of(2026, 2, 1), LocalDate.of(2026, 2, 28));

    private RankingMotoristaLinha linha(String nome, long viagens, long diasComViagem,
            String rentabilidadeTotal) {
        return linha(nome, viagens, diasComViagem, rentabilidadeTotal, rentabilidadeTotal,
                "0.00");
    }

    private RankingMotoristaLinha linha(String nome, long viagens, long diasComViagem,
            String rentabilidadeTotal, String frete, String custos) {
        return new RankingMotoristaLinha(nome, 10, "00123456789", "Truck", "ABC1D23", viagens,
                diasComViagem, new BigDecimal(frete), new BigDecimal(custos),
                new BigDecimal(rentabilidadeTotal));
    }

    private List<String> nomes(PeriodoConsulta periodo) {
        return service.ranking(periodo).stream().map(RankingMotoristaResponse::nome).toList();
    }

    private void devolver(RankingMotoristaLinha... linhas) {
        when(repository.consultar(FEVEREIRO_2026.inicio(), FEVEREIRO_2026.fim().plusDays(1)))
                .thenReturn(List.of(linhas));
    }

    @Test
    @DisplayName("Ordena por rentabilidade média decrescente")
    void deveOrdenarPorRentabilidadeMediaDesc() {
        devolver(
                linha("Pior", 2, 28, "100.00"),   // média 50.00
                linha("Melhor", 1, 28, "900.00"), // média 900.00
                linha("Meio", 4, 28, "600.00"));  // média 150.00

        assertEquals(List.of("Melhor", "Meio", "Pior"), nomes(FEVEREIRO_2026));
    }

    @Test
    @DisplayName("Empate na média desempata por quantidade de viagens (desc)")
    void deveDesempatarPorQuantidadeDeViagens() {
        devolver(
                linha("Ana", 2, 28, "100.00"),  // média 50.00, 2 viagens
                linha("Bruno", 4, 1, "200.00"), // média 50.00, 4 viagens
                linha("Cris", 1, 28, "50.00")); // média 50.00, 1 viagem

        assertEquals(List.of("Bruno", "Ana", "Cris"), nomes(FEVEREIRO_2026));
    }

    @Test
    @DisplayName("Empate na média e na quantidade desempata por frequência (desc)")
    void deveDesempatarPorFrequencia() {
        devolver(
                linha("Ana", 2, 10, "100.00"),  // média 50.00, 2 viagens, 35.71%
                linha("Bruno", 2, 28, "100.00"), // média 50.00, 2 viagens, 100%
                linha("Cris", 2, 14, "100.00")); // média 50.00, 2 viagens, 50%

        assertEquals(List.of("Bruno", "Cris", "Ana"), nomes(FEVEREIRO_2026));
    }

    @Test
    @DisplayName("Empate geral desempata por nome ascendente, sem deixar laços")
    void deveDesempatarPorNomeAsc() {
        devolver(
                linha("Zeca", 2, 14, "100.00"),
                linha("Ana", 2, 14, "100.00"),
                linha("Maria", 2, 14, "100.00"));

        assertEquals(List.of("Ana", "Maria", "Zeca"), nomes(FEVEREIRO_2026));
    }

    @Test
    @DisplayName("Atribui posição sequencial 1..n somente depois de ordenar")
    void deveAtribuirPosicaoSequencialDepoisDeOrdenar() {
        devolver(
                linha("Terceiro", 1, 28, "100.00"),
                linha("Primeiro", 1, 28, "900.00"),
                linha("Segundo", 1, 28, "500.00"),
                linha("Quarto", 1, 28, "50.00"));

        List<RankingMotoristaResponse> ranking = service.ranking(FEVEREIRO_2026);

        assertEquals(List.of("Primeiro", "Segundo", "Terceiro", "Quarto"),
                ranking.stream().map(RankingMotoristaResponse::nome).toList());
        assertEquals(List.of(1, 2, 3, 4),
                ranking.stream().map(RankingMotoristaResponse::posicao).toList());
    }

    @Test
    @DisplayName("Rentabilidade média = rentabilidade total ÷ quantidade de viagens (média da US09)")
    void deveCalcularRentabilidadeMediaPeloTotalDivididoPelasViagens() {
        devolver(linha("Ana", 3, 28, "1000.00", "1500.00", "500.00"));

        RankingMotoristaResponse item = service.ranking(FEVEREIRO_2026).getFirst();

        assertEquals(new BigDecimal("333.33"), item.rentabilidadeMedia());
        assertEquals(new BigDecimal("1000.00"), item.rentabilidadeTotal());
        assertEquals(new BigDecimal("1500.00"), item.frete());
        assertEquals(new BigDecimal("500.00"), item.custos());
    }

    @Test
    @DisplayName("Frequência = dias com viagem ÷ dias do mês × 100 (fevereiro com 28 dias)")
    void deveCalcularFrequenciaComVinteEOitoDias() {
        devolver(linha("Ana", 7, 7, "700.00"));

        assertEquals(new BigDecimal("25.00"), service.ranking(FEVEREIRO_2026).getFirst().frequencia());
    }

    @Test
    @DisplayName("Frequência respeita fevereiro bissexto com 29 dias")
    void deveCalcularFrequenciaComVinteENoveDias() {
        PeriodoConsulta fevereiro2024 = new PeriodoConsulta(
                LocalDate.of(2024, 2, 1), LocalDate.of(2024, 2, 29));
        when(repository.consultar(fevereiro2024.inicio(), fevereiro2024.fim().plusDays(1)))
                .thenReturn(List.of(linha("Ana", 7, 7, "700.00")));

        assertEquals(new BigDecimal("24.14"), service.ranking(fevereiro2024).getFirst().frequencia());
    }

    @Test
    @DisplayName("Consulta o período semiaberto [início, fim + 1) para pegar o mês inteiro")
    void deveConsultarPeriodoSemiaberto() {
        devolver();

        service.ranking(FEVEREIRO_2026);

        verify(repository).consultar(LocalDate.of(2026, 2, 1), LocalDate.of(2026, 3, 1));
    }

    @Test
    @DisplayName("Mês sem viagens retorna lista vazia (200 [] no endpoint)")
    void deveRetornarListaVaziaQuandoNaoHaViagens() {
        devolver();

        assertTrue(service.ranking(FEVEREIRO_2026).isEmpty());
    }

    @Test
    @DisplayName("Repasse os identificadores do manifesto e deixa telefone nulo (sem coluna no banco)")
    void deveRepasseIdentificadoresDoManifesto() {
        RankingMotoristaLinha linha = new RankingMotoristaLinha("Ana", 7, "001.234.567-89",
                "Truck", "ABC1D23", 5, 5, new BigDecimal("300.00"), new BigDecimal("500.00"),
                new BigDecimal("200.00"));
        devolver(linha);

        RankingMotoristaResponse item = service.ranking(FEVEREIRO_2026).getFirst();

        assertEquals(7, item.motoristaId());
        assertEquals("Ana", item.nome());
        // CPF sai sem pontuação: o front formata com formatCpf.
        assertEquals("00123456789", item.cpf());
        assertEquals("Truck", item.veiculo());
        assertEquals("ABC1D23", item.placa());
        assertNull(item.telefone());
        assertEquals(item.quantidadeViagens(), item.viagens());
        assertEquals(5, item.quantidadeViagens());
        assertEquals(1, item.posicao());
    }

    @Test
    @DisplayName("CPF vazio ou incompleto vira null e a tela cai no traço")
    void deveDevolverCpfNuloQuandoInvalido() {
        devolver(
                new RankingMotoristaLinha("Sem CPF", null, "  ", null, null, 1, 1,
                        BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO),
                new RankingMotoristaLinha("Curto", null, "123", null, null, 1, 1,
                        BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO));

        List<RankingMotoristaResponse> ranking = service.ranking(FEVEREIRO_2026);

        assertNull(ranking.get(0).cpf());
        assertNull(ranking.get(1).cpf());
    }

    @Test
    @DisplayName("Não altera a ordem recebida do banco além do Comparator (lista completa para o pódio)")
    void deveDevolverListaCompleta() {
        devolver(
                linha("A", 1, 28, "10.00"),
                linha("B", 1, 28, "9.00"),
                linha("C", 1, 28, "8.00"));

        List<RankingMotoristaResponse> ranking = service.ranking(FEVEREIRO_2026);

        assertEquals(3, ranking.size());
        assertEquals(new BigDecimal("10.00"), ranking.getFirst().rentabilidadeMedia());
        assertEquals(3, ranking.getLast().posicao());
    }
}
