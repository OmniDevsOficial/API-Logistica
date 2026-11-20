package com.ominidevs.operacional.motorista.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;

import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.motorista.dto.FiltroRankingMotorista;
import com.ominidevs.operacional.motorista.dto.RankingMotoristaResponse;
import com.ominidevs.operacional.motorista.dto.RankingMotoristasResultado;
import com.ominidevs.operacional.motorista.projections.RankingMotoristaLinha;
import com.ominidevs.operacional.motorista.repositories.RankingMotoristaConsultaRepository;

/**
 * Ranking mensal de desempenho dos motoristas (US13), restrito ao Gestor.
 *
 * Somente as viagens do mês selecionado entram no cálculo. Para cada motorista:
 * rentabilidade média = rentabilidade total ÷ quantidade de viagens. A ordenação usa
 * comparators definidos aqui, e a posição sequencial (1..n) é atribuída
 * depois de ordenar. O nome é o desempate final, então a ordem é sempre
 * determinística, sem empates. Quem não viajou no mês não aparece; o front
 * separa pódio e demais a partir da lista completa.
 *
 * A rentabilidade reaproveita a expressão da US09 ({@code EXPRESSAO_SQL}),
 * usando os agregados da consulta.
 */
@Service
public class RankingMotoristaService {

    private static final Comparator<RankingMotoristaResponse> POR_RENTABILIDADE =
            Comparator.comparing(RankingMotoristaResponse::rentabilidadeMedia).reversed()
                    .thenComparing(RankingMotoristaResponse::quantidadeViagens,
                            Comparator.reverseOrder())
                    .thenComparing(RankingMotoristaResponse::nome);
    private static final Comparator<RankingMotoristaResponse> POR_FATURAMENTO =
            Comparator.comparing(RankingMotoristaResponse::faturamento).reversed()
                    .thenComparing(RankingMotoristaResponse::rentabilidadeMedia, Comparator.reverseOrder())
                    .thenComparing(RankingMotoristaResponse::nome);
    private static final Comparator<RankingMotoristaResponse> POR_VIAGENS =
            Comparator.comparing(RankingMotoristaResponse::quantidadeViagens, Comparator.reverseOrder())
                    .thenComparing(RankingMotoristaResponse::rentabilidadeMedia, Comparator.reverseOrder())
                    .thenComparing(RankingMotoristaResponse::nome);

    private final RankingMotoristaConsultaRepository repository;

    public RankingMotoristaService(RankingMotoristaConsultaRepository repository) {
        this.repository = repository;
    }

    public RankingMotoristasResultado ranking(PeriodoConsulta periodo, FiltroRankingMotorista filtro, String tipoVeiculo) {
        String tipoNormalizado = tipoVeiculo == null || tipoVeiculo.isBlank()
                ? null : tipoVeiculo.trim().toUpperCase(Locale.ROOT);
        // [inicio, fim] do período vira o semiaberto [inicio, fim + 1) do SQL.
        List<RankingMotoristaLinha> linhas = repository.consultar(
                periodo.inicio(), periodo.fim().plusDays(1), tipoNormalizado);
        List<String> tiposDisponiveis = repository.tiposDisponiveis(periodo.inicio(), periodo.fim().plusDays(1));

        if (linhas.isEmpty()) {
            return new RankingMotoristasResultado(List.of(), tiposDisponiveis);
        }

        List<RankingMotoristaResponse> ordenado = linhas.stream()
                .map(linha -> paraResponse(linha, tipoNormalizado))
                .sorted(comparator(filtro))
                .toList();

        // Posição sequencial (1..n) somente depois da ordenação.
        List<RankingMotoristaResponse> posicionados = IntStream.range(0, ordenado.size())
                .mapToObj(indice -> comPosicao(ordenado.get(indice), indice + 1))
                .toList();
        return new RankingMotoristasResultado(posicionados, tiposDisponiveis);
    }

    private Comparator<RankingMotoristaResponse> comparator(FiltroRankingMotorista filtro) {
        return switch (filtro) {
            case RENTABILIDADE -> POR_RENTABILIDADE;
            case FATURAMENTO -> POR_FATURAMENTO;
            case VIAGENS -> POR_VIAGENS;
        };
    }

    private RankingMotoristaResponse paraResponse(RankingMotoristaLinha linha, String tipoVeiculo) {
        // Cada grupo nasce de pelo menos uma viagem, então o divisor nunca é zero.
        BigDecimal media = linha.rentabilidadeTotal()
                .divide(BigDecimal.valueOf(linha.quantidadeViagens()), 2, RoundingMode.HALF_UP);
        return new RankingMotoristaResponse(
                0,
                linha.motoristaId(),
                linha.nome(),
                normalizarCpf(linha.cpf()),
                null,
                tipoVeiculo == null ? linha.veiculo() : tipoVeiculo,
                linha.placa(),
                linha.quantidadeViagens(),
                linha.quantidadeViagens(),
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
                item.rentabilidadeMedia(),
                item.rentabilidadeTotal(),
                item.faturamento(),
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
