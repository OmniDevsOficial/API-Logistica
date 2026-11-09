package com.ominidevs.operacional.motorista.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;

import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.indicadores.model.Porcentagem;
import com.ominidevs.operacional.motorista.dto.RankingMotoristaResponse;
import com.ominidevs.operacional.motorista.projections.RankingMotoristaLinha;
import com.ominidevs.operacional.motorista.repositories.RankingMotoristaConsultaRepository;

/**
 * Ranking mensal de desempenho dos motoristas (US13), restrito ao Gestor.
 *
 * Somente as viagens do mês selecionado entram no cálculo. Para cada motorista:
 * rentabilidade média = rentabilidade total ÷ quantidade de viagens (a média da
 * US09) e frequência = dias com viagem ÷ dias do mês × 100. A ordenação usa um
 * único Comparator — rentabilidade média (desc), quantidade de viagens (desc),
 * frequência (desc) e nome (asc) — e a posição sequencial (1..n) é atribuída
 * depois de ordenar. O nome é o desempate final, então a ordem é sempre
 * determinística, sem empates. Quem não viajou no mês não aparece; o front
 * separa pódio e demais a partir da lista completa.
 *
 * A rentabilidade reaproveita a expressão da US09 ({@code EXPRESSAO_SQL}) e a
 * frequência reaproveita {@link Porcentagem}, sem duplicar lógica.
 */
@Service
public class RankingMotoristaService {

    // Um Comparator só, na ordem acordada: média (desc), viagens (desc),
    // frequência (desc) e nome (asc). BigDecimal compara por valor, então
    // escalas diferentes (100.00 vs 100.0) não geram empate falso.
    private static final Comparator<RankingMotoristaResponse> ORDEM =
            Comparator.comparing(RankingMotoristaResponse::rentabilidadeMedia).reversed()
                    .thenComparing(RankingMotoristaResponse::quantidadeViagens,
                            Comparator.reverseOrder())
                    .thenComparing(RankingMotoristaResponse::frequencia, Comparator.reverseOrder())
                    .thenComparing(RankingMotoristaResponse::nome);

    private final RankingMotoristaConsultaRepository repository;

    public RankingMotoristaService(RankingMotoristaConsultaRepository repository) {
        this.repository = repository;
    }

    public List<RankingMotoristaResponse> ranking(PeriodoConsulta periodo) {
        // [inicio, fim] do período vira o semiaberto [inicio, fim + 1) do SQL.
        List<RankingMotoristaLinha> linhas = repository.consultar(
                periodo.inicio(), periodo.fim().plusDays(1));

        if (linhas.isEmpty()) {
            return List.of();
        }

        long diasDoMes = ChronoUnit.DAYS.between(periodo.inicio(), periodo.fim()) + 1;

        List<RankingMotoristaResponse> ordenado = linhas.stream()
                .map(linha -> paraResponse(linha, diasDoMes))
                .sorted(ORDEM)
                .toList();

        // Posição sequencial (1..n) somente depois da ordenação.
        return IntStream.range(0, ordenado.size())
                .mapToObj(indice -> comPosicao(ordenado.get(indice), indice + 1))
                .toList();
    }

    private RankingMotoristaResponse paraResponse(RankingMotoristaLinha linha, long diasDoMes) {
        // Cada grupo nasce de pelo menos uma viagem, então o divisor nunca é zero.
        BigDecimal media = linha.rentabilidadeTotal()
                .divide(BigDecimal.valueOf(linha.quantidadeViagens()), 2, RoundingMode.HALF_UP);
        // Frequência do mês: dias com viagem ÷ dias do mês × 100 (fev = 28/29).
        BigDecimal frequencia = Porcentagem.calcular(linha.diasComViagem(), diasDoMes);

        return new RankingMotoristaResponse(
                0,
                linha.motoristaId(),
                linha.nome(),
                normalizarCpf(linha.cpf()),
                null,
                linha.veiculo(),
                linha.placa(),
                linha.quantidadeViagens(),
                linha.quantidadeViagens(),
                frequencia,
                media,
                linha.rentabilidadeTotal(),
                linha.frete(),
                linha.custos());
    }

    private RankingMotoristaResponse comPosicao(RankingMotoristaResponse item, int posicao) {
        return new RankingMotoristaResponse(
                posicao,
                item.motoristaId(),
                item.nome(),
                item.cpf(),
                item.telefone(),
                item.veiculo(),
                item.placa(),
                item.viagens(),
                item.quantidadeViagens(),
                item.frequencia(),
                item.rentabilidadeMedia(),
                item.rentabilidadeTotal(),
                item.frete(),
                item.custos());
    }

    /**
     * O front formata com {@code formatCpf}; aqui só garantimos 11 dígitos.
     * CPF ausente, vazio ou incompleto vira null e a tela cai no traço.
     */
    private String normalizarCpf(String cpf) {
        if (cpf == null) {
            return null;
        }
        String digitos = cpf.replaceAll("\\D", "");
        return digitos.length() == 11 ? digitos : null;
    }
}
