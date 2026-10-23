package com.ominidevs.operacional.viagem.services;

import com.ominidevs.operacional.indicadores.exceptions.IndicadorInvalidoException;
import com.ominidevs.operacional.indicadores.model.PeriodoConsulta;
import com.ominidevs.operacional.motorista.services.MotoristaService;
import com.ominidevs.operacional.viagem.clients.ManifestoClient;
import com.ominidevs.operacional.viagem.dto.ManifestoDTO;
import com.ominidevs.operacional.viagem.dto.ImportacaoManifestoResponse;
import com.ominidevs.operacional.viagem.dto.ErroLinhaImportacao;
import com.ominidevs.operacional.viagem.dto.RankingDestinoResponse;
import com.ominidevs.operacional.viagem.dto.RentabilidadeMotoristaResponse;
import com.ominidevs.operacional.viagem.entities.StatusViagem;
import com.ominidevs.operacional.viagem.entities.Viagem;
import com.ominidevs.operacional.viagem.exceptions.FiltroInvalidoException;
import com.ominidevs.operacional.viagem.mappers.ManifestoMapper;
import com.ominidevs.operacional.viagem.repositories.ViagemRepository;
import com.ominidevs.operacional.viagem.specifications.ViagemSpecifications;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import com.ominidevs.operacional.viagem.dto.RentabilidadeViagemResponse;

@Service
public class ViagemService {

    private final ManifestoClient manifestoClient;
    private final ManifestoMapper manifestoMapper;
    private final ViagemRepository viagemRepository;
    private final MotoristaService motoristaService;

    public ViagemService(
            ManifestoClient manifestoClient,
            ManifestoMapper manifestoMapper,
            ViagemRepository viagemRepository,
            MotoristaService motoristaService
    ) {
        this.manifestoClient = manifestoClient;
        this.manifestoMapper = manifestoMapper;
        this.viagemRepository = viagemRepository;
        this.motoristaService = motoristaService;
    }

    public ImportacaoManifestoResponse importarManifesto(MultipartFile file) {

        validarArquivo(file);

        List<ManifestoDTO> manifestos =
                manifestoClient.enviar(file);

        java.util.Map<String, Viagem> viagensPorManifesto = new java.util.LinkedHashMap<>();
        List<ErroLinhaImportacao> erros = new java.util.ArrayList<>();
        for (ManifestoDTO manifesto : manifestos) {
            try {
                Viagem viagem = manifestoMapper.toEntity(manifesto);
                viagensPorManifesto.put(viagem.getManifesto(), viagem);
            } catch (IllegalArgumentException ex) {
                erros.add(new ErroLinhaImportacao(manifesto.getNumeroLinha(), manifesto.getManifesto(), ex.getMessage()));
            }
        }
        List<Viagem> viagens = new java.util.ArrayList<>(viagensPorManifesto.values());

        List<Viagem> registrosExistentes = viagens.isEmpty()
                ? List.of()
                : viagemRepository.findByManifestoIn(
                        viagens.stream().map(Viagem::getManifesto).distinct().toList());

        Set<String> manifestosExistentes = registrosExistentes
                .stream()
                .map(Viagem::getManifesto)
                .collect(Collectors.toSet());

        List<String> manifestosDuplicados = viagens.stream()
                .map(Viagem::getManifesto)
                .filter(manifestosExistentes::contains)
                .distinct()
                .toList();

        java.util.Map<String, Viagem> existentesPorManifesto = registrosExistentes.stream()
                .collect(Collectors.toMap(Viagem::getManifesto, v -> v, (a, b) -> a));
        List<Viagem> novasViagens = new java.util.ArrayList<>();
        List<Viagem> atualizadas = new java.util.ArrayList<>();
        for (Viagem viagem : viagens) {
            Viagem existente = existentesPorManifesto.get(viagem.getManifesto());
            if (existente == null) {
                novasViagens.add(viagem);
            } else {
                existente.setReceitaFrete(viagem.getReceitaFrete());
                existente.setCustoFrete(viagem.getCustoFrete());
                existente.setPedagio(viagem.getPedagio());
                existente.setValeFrete(viagem.getValeFrete());
                existente.setValorFrete(viagem.getValorFrete());
                atualizadas.add(existente);
            }
        }

        List<Viagem> paraSalvar = new java.util.ArrayList<>(novasViagens);
        paraSalvar.addAll(atualizadas);
        List<Viagem> viagensImportadas = paraSalvar.isEmpty()
                ? List.of()
                : viagemRepository.saveAll(paraSalvar);
        motoristaService.sincronizarComManifesto(viagensImportadas);

        return new ImportacaoManifestoResponse(
                viagensImportadas, manifestosDuplicados, erros);
    }

    private void validarArquivo(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "O arquivo não foi enviado ou está vazio."
            );
        }
    }

    public List<Viagem> filtrar(
            String destino,
            List<StatusViagem> status,
            BigDecimal freteMin,
            BigDecimal freteMax,
            String mes
    ) {

        validarFaixaFrete(freteMin, freteMax);

        LocalDate inicioMes = null;
        LocalDate fimMes = null;

        if (mes != null && !mes.isBlank()) {
            YearMonth periodo = converterMes(mes);
            inicioMes = periodo.atDay(1);
            fimMes = periodo.atEndOfMonth();
        }

        Specification<Viagem> filtro = ViagemSpecifications.destinoContem(destino)
                .and(ViagemSpecifications.statusEntre(status))
                .and(ViagemSpecifications.freteMinimo(freteMin))
                .and(ViagemSpecifications.freteMaximo(freteMax))
                .and(ViagemSpecifications.dataNoMes(inicioMes, fimMes));

        return viagemRepository.findAll(filtro);
    }

    public RentabilidadeViagemResponse consultarRentabilidade(String manifesto) {
        Viagem viagem = viagemRepository.findByManifesto(manifesto)
                .orElseThrow(() -> new java.util.NoSuchElementException("Viagem não encontrada: " + manifesto));
        return new RentabilidadeViagemResponse(viagem.getManifesto(), viagem.getMotorista(),
                viagem.getCidadeOrigem(), viagem.getCidadeDestino(), viagem.getReceitaFrete(),
                viagem.getCustoFrete(), viagem.getPedagio(),
                RentabilidadeService.calcular(viagem.getReceitaFrete(), viagem.getCustoFrete(), viagem.getPedagio()));
    }

    public List<RentabilidadeMotoristaResponse> rentabilidadeMediaPorMotorista(LocalDate inicio, LocalDate fim) {
        return viagemRepository.rentabilidadeMediaPorMotorista(inicio, fim);
    }

    /**
     * TOP 10 rotas (origem e destino) por rentabilidade média no período.
     * Agregação, desempate e limite são feitos no banco.
     *
     * @param dataInicio data inicial no formato dd/MM/aaaa, inclusiva.
     * @param dataFim data final no formato dd/MM/aaaa, inclusiva.
     * @return até 10 rotas ordenadas por rentabilidade média decrescente.
     * @throws IndicadorInvalidoException se alguma data estiver ausente, em
     *     formato inválido ou se o início for posterior ao fim.
     */
    public List<RankingDestinoResponse> rankingDestinosPorRentabilidade(
            String dataInicio, String dataFim) {

        PeriodoConsulta periodo = PeriodoConsulta.parse(dataInicio, dataFim);

        return viagemRepository.rankingDestinosPorRentabilidade(periodo.inicio(), periodo.fim());
    }

    private void validarFaixaFrete(BigDecimal freteMin, BigDecimal freteMax) {

        if (freteMin != null && freteMax != null && freteMin.compareTo(freteMax) > 0) {
            throw new FiltroInvalidoException(
                    "freteMin não pode ser maior que freteMax"
            );
        }
    }

    private YearMonth converterMes(String mes) {

        try {
            return YearMonth.parse(mes);
        } catch (DateTimeParseException e) {
            throw new FiltroInvalidoException(
                    "mes deve estar no formato YYYY-MM"
            );
        }
    }
}
