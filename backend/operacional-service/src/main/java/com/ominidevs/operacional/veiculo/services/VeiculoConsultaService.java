package com.ominidevs.operacional.veiculo.services;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ominidevs.operacional.veiculo.dto.FiltroVeiculo;
import com.ominidevs.operacional.veiculo.dto.VeiculoResponse;
import com.ominidevs.operacional.veiculo.dto.VeiculoResumoResponse;
import com.ominidevs.operacional.veiculo.entities.Veiculo;
import com.ominidevs.operacional.veiculo.exceptions.VeiculoNaoEncontradoException;
import com.ominidevs.operacional.veiculo.model.Placa;
import com.ominidevs.operacional.veiculo.projections.VeiculoDoMotorista;
import com.ominidevs.operacional.veiculo.repositories.VeiculoRepository;
import com.ominidevs.operacional.veiculo.specifications.VeiculoSpecifications;

/**
 * Ponto de entrada para consultar veículos a partir de outros módulos
 * (motoristas, viagens, indicadores). Prefira estes métodos a acessar
 * {@link VeiculoRepository} diretamente: eles já normalizam a placa e evitam
 * uma consulta por item.
 *
 * <p>Exemplo (US11, rentabilidade por tipo): reúna as placas das viagens e
 * chame {@link #tiposPorPlaca(Collection)} uma vez, em vez de buscar veículo
 * a veículo.
 */
@Service
@Transactional(readOnly = true)
public class VeiculoConsultaService {

    private static final Sort ORDEM_PADRAO = Sort.by("placa");

    private final VeiculoRepository repository;

    public VeiculoConsultaService(VeiculoRepository repository) {
        this.repository = repository;
    }

    /**
     * Lista veículos com filtros opcionais, ordenados por placa.
     *
     * @param filtro filtros; campos {@code null} não filtram.
     * @return veículos com o motorista atual.
     */
    public List<VeiculoResponse> listar(FiltroVeiculo filtro) {
        FiltroVeiculo f = filtro == null ? FiltroVeiculo.todos() : filtro;
        return repository.findAll(
                        VeiculoSpecifications.placaContem(f.placa())
                                .and(VeiculoSpecifications.tipoIgual(f.tipo()))
                                .and(VeiculoSpecifications.doMotorista(f.motoristaId()))
                                .and(VeiculoSpecifications.ativo(f.ativo())),
                        ORDEM_PADRAO)
                .stream()
                .map(VeiculoResponse::de)
                .toList();
    }

    /**
     * Busca um veículo pela placa, aceitando qualquer formato ("abc-1d23").
     *
     * @param placa placa do veículo.
     * @return o veículo com o motorista atual.
     * @throws VeiculoNaoEncontradoException se a placa não estiver cadastrada.
     */
    public VeiculoResponse buscarPorPlaca(String placa) {
        String normalizada = Placa.normalizar(placa);
        return repository.findByPlaca(normalizada == null ? "" : normalizada)
                .map(VeiculoResponse::de)
                .orElseThrow(() -> new VeiculoNaoEncontradoException(placa));
    }

    /**
     * Tipos de veículo cadastrados, em ordem alfabética, para filtros e
     * agrupamentos (ex.: comparação de rentabilidade por tipo).
     *
     * @return tipos distintos em maiúsculas.
     */
    public List<String> listarTipos() {
        return repository.listarTipos();
    }

    /**
     * Tipo de cada placa informada, em uma única consulta. Placas em qualquer
     * formato são aceitas; a chave do mapa é a placa normalizada. Placas sem
     * cadastro ou sem tipo ficam fora do mapa.
     *
     * @param placas placas, por exemplo de {@code viagem.veiculo}.
     * @return mapa placa normalizada → tipo.
     */
    public Map<String, String> tiposPorPlaca(Collection<String> placas) {
        List<String> normalizadas = placas == null
                ? List.of()
                : placas.stream().map(Placa::normalizar).filter(Objects::nonNull).distinct().toList();
        if (normalizadas.isEmpty()) {
            return Map.of();
        }
        return repository.findByPlacaIn(normalizadas).stream()
                .filter(v -> v.getTipo() != null)
                .collect(Collectors.toMap(Veiculo::getPlaca, Veiculo::getTipo));
    }

    /**
     * Veículos atuais de cada motorista, em uma única consulta. Em cada lista
     * os ativos vêm primeiro; o primeiro item é o veículo principal.
     *
     * @param motoristaIds motoristas a consultar.
     * @return mapa id do motorista → veículos; motoristas sem veículo ficam fora.
     */
    public Map<Integer, List<VeiculoResumoResponse>> veiculosPorMotorista(Collection<Integer> motoristaIds) {
        if (motoristaIds == null || motoristaIds.isEmpty()) {
            return Map.of();
        }
        return repository.listarPorMotoristas(motoristaIds).stream()
                .collect(Collectors.groupingBy(
                        VeiculoDoMotorista::motoristaId,
                        LinkedHashMap::new,
                        Collectors.mapping(
                                v -> new VeiculoResumoResponse(v.placa(), v.tipo(), v.modelo(), v.ativo()),
                                Collectors.toList())));
    }
}
