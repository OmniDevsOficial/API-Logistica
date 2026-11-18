package com.ominidevs.operacional.veiculo.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.veiculo.dto.PaginaResponse;
import com.ominidevs.operacional.veiculo.dto.ResumoFrotaResponse;
import com.ominidevs.operacional.veiculo.dto.ResumoFrotaResponse.PercentualPorCombustivel;
import com.ominidevs.operacional.veiculo.dto.ResumoFrotaResponse.QuantidadePorMarca;
import com.ominidevs.operacional.veiculo.dto.ResumoFrotaResponse.QuantidadePorTipo;
import com.ominidevs.operacional.veiculo.dto.VeiculoFrotaResponse;
import com.ominidevs.operacional.veiculo.exceptions.ParametroFrotaInvalidoException;
import com.ominidevs.operacional.veiculo.projections.LinhaResumoFrota;
import com.ominidevs.operacional.veiculo.repositories.ResumoFrotaRepository;
import com.ominidevs.operacional.veiculo.repositories.VeiculoRepository;
import com.ominidevs.operacional.veiculo.specifications.VeiculoSpecifications;

@Service
@Transactional(readOnly = true)
public class FrotaService {

    public static final int TAMANHO_MAXIMO_PAGINA = 100;
    private static final BigDecimal CEM = BigDecimal.valueOf(100);

    private final VeiculoRepository veiculoRepository;
    private final ResumoFrotaRepository resumoRepository;

    public FrotaService(VeiculoRepository veiculoRepository, ResumoFrotaRepository resumoRepository) {
        this.veiculoRepository = veiculoRepository;
        this.resumoRepository = resumoRepository;
    }

    public PaginaResponse<VeiculoFrotaResponse> listar(
            int pagina, int tamanho, String tipo, String busca, PeriodoConsulta periodo) {
        if (pagina < 0) {
            throw new ParametroFrotaInvalidoException("O parâmetro pagina deve ser maior ou igual a 0.");
        }
        if (tamanho < 1 || tamanho > TAMANHO_MAXIMO_PAGINA) {
            throw new ParametroFrotaInvalidoException(
                    "O parâmetro tamanho deve estar entre 1 e " + TAMANHO_MAXIMO_PAGINA + ".");
        }
        var filtro = VeiculoSpecifications.tipoDaFrota(tipo)
                .and(VeiculoSpecifications.placaOuMotoristaContem(busca))
                .and(VeiculoSpecifications.comViagemNoPeriodo(periodo));
        var paginacao = PageRequest.of(pagina, tamanho, Sort.by("placa"));
        return PaginaResponse.de(veiculoRepository.findAll(filtro, paginacao), VeiculoFrotaResponse::de);
    }

    public ResumoFrotaResponse resumir(PeriodoConsulta periodo) {
        long total = 0;
        long semMotorista = 0;
        long motoristasComVeiculo = 0;
        List<QuantidadePorTipo> porTipo = new ArrayList<>();
        List<LinhaResumoFrota> combustiveis = new ArrayList<>();
        List<QuantidadePorMarca> porMarca = new ArrayList<>();

        for (LinhaResumoFrota linha : resumoRepository.consultar(periodo)) {
            switch (linha.grupo()) {
                case ResumoFrotaRepository.GRUPO_TOTAL -> {
                    total = linha.quantidade();
                    semMotorista = linha.semMotorista();
                    motoristasComVeiculo = linha.motoristas();
                }
                case ResumoFrotaRepository.GRUPO_TIPO ->
                        porTipo.add(new QuantidadePorTipo(linha.chave(), linha.quantidade()));
                case ResumoFrotaRepository.GRUPO_COMBUSTIVEL -> combustiveis.add(linha);
                case ResumoFrotaRepository.GRUPO_MARCA -> {
                    if (linha.chave() != null) {
                        porMarca.add(new QuantidadePorMarca(linha.chave(), linha.quantidade()));
                    }
                }
                default -> {
                }
            }
        }

        long totalVeiculos = total;
        List<PercentualPorCombustivel> porCombustivel = combustiveis.stream()
                .map(linha -> new PercentualPorCombustivel(
                        linha.chave(), linha.quantidade(), percentual(linha.quantidade(), totalVeiculos)))
                .toList();

        return new ResumoFrotaResponse(
                total > 0, total, semMotorista, motoristasComVeiculo, porTipo, porCombustivel, porMarca);
    }

    public static PeriodoConsulta periodo(String dataInicio, String dataFim) {
        boolean semInicio = dataInicio == null || dataInicio.isBlank();
        boolean semFim = dataFim == null || dataFim.isBlank();
        if (semInicio && semFim) {
            return null;
        }
        if (semInicio || semFim) {
            throw new ParametroFrotaInvalidoException("Informe dataInicio e dataFim juntos, no formato dd/MM/aaaa.");
        }
        return PeriodoConsulta.parse(dataInicio.strip(), dataFim.strip());
    }

    private static BigDecimal percentual(long parte, long total) {
        if (total == 0) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(parte).multiply(CEM).divide(BigDecimal.valueOf(total), 1, RoundingMode.HALF_UP);
    }
}
