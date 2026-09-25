package com.ominidevs.operacional.indicadores.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import org.springframework.stereotype.Service;
import com.ominidevs.operacional.indicadores.dto.*;
import com.ominidevs.operacional.indicadores.model.*;
import com.ominidevs.operacional.indicadores.exceptions.IndicadorInvalidoException;
import com.ominidevs.operacional.indicadores.repositories.UtilizacaoRepository;

@Service
public class UtilizacaoService {
    private final UtilizacaoRepository repository;

    public UtilizacaoService(UtilizacaoRepository repository) { this.repository = repository; }

    public UtilizacaoPeriodoResponse consultar(PeriodoConsulta periodo, OrdenacaoUtilizacao ordenacao) {
        return consultar(periodo, ordenacao, null);
    }

    public UtilizacaoPeriodoResponse consultar(PeriodoConsulta periodo, OrdenacaoUtilizacao ordenacao, String cpf) {
        String cpfFiltro = normalizarFiltroCpf(cpf);
        // Regra acordada: participação nas viagens, NÃO dias operados/dias disponíveis.
        // Sem cache: cada chamada consulta novamente o período solicitado.
        var dados = repository.consultar(periodo);
        long total = dados.stream().mapToLong(d -> d.quantidadeViagens()).sum();
        // Com o mesmo denominador, ordenar pela quantidade equivale ao percentual exato.
        Comparator<UtilizacaoMotoristaResponse> comparador =
                Comparator.comparingLong(UtilizacaoMotoristaResponse::quantidadeViagens);
        if (ordenacao == OrdenacaoUtilizacao.DESC) comparador = comparador.reversed();
        comparador = comparador.thenComparing(UtilizacaoMotoristaResponse::nome, String.CASE_INSENSITIVE_ORDER)
                .thenComparing(UtilizacaoMotoristaResponse::chave);

        // Filtra somente a lista exibida, depois do total geral: o denominador não muda.
        var motoristas = dados.stream()
                .filter(d -> cpfFiltro == null || cpfFiltro.equals(d.chave()))
                .map(d -> new UtilizacaoMotoristaResponse(
                d.chave(), d.motoristaId(), d.nome(), d.quantidadeViagens(),
                calcularPorcentagem(d.quantidadeViagens(), total),
                d.quantidadeViagens() == 0 ? "SEM_VIAGENS" : "COM_VIAGENS"))
                .sorted(comparador).toList();

        return new UtilizacaoPeriodoResponse(
                periodo.inicio().format(PeriodoConsulta.FORMATO),
                periodo.fim().format(PeriodoConsulta.FORMATO),
                "PARTICIPACAO_NAS_VIAGENS", ordenacao.parametro(), total,
                total == 0 ? "SEM_VIAGENS" : "COM_DADOS", motoristas);
    }

    private String normalizarFiltroCpf(String cpf) {
        // Campo omitido ou vazio mantém a listagem completa. Preserva zeros iniciais.
        if (cpf == null || cpf.isBlank()) return null;
        String valor = cpf.trim();
        if (!valor.matches("[0-9]{11}|[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}")) {
            throw new IndicadorInvalidoException("Informe o CPF com 11 dígitos, com ou sem pontuação.");
        }
        return valor.replace(".", "").replace("-", "");
    }

    private BigDecimal calcularPorcentagem(long quantidade, long total) {
        if (total == 0) return new BigDecimal("0.00");
        // Arredondamento individual: a soma exibida pode ser 99,99% ou 100,01%.
        return BigDecimal.valueOf(quantidade).multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);
    }
}
