package com.ominidevs.operacional.viagem.services;

import com.ominidevs.operacional.viagem.clients.ManifestoClient;
import com.ominidevs.operacional.viagem.dto.ManifestoDTO;
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

@Service
public class ViagemService {

    private final ManifestoClient manifestoClient;
    private final ManifestoMapper manifestoMapper;
    private final ViagemRepository viagemRepository;

    public ViagemService(
            ManifestoClient manifestoClient,
            ManifestoMapper manifestoMapper,
            ViagemRepository viagemRepository
    ) {
        this.manifestoClient = manifestoClient;
        this.manifestoMapper = manifestoMapper;
        this.viagemRepository = viagemRepository;
    }

    public List<Viagem> importarManifesto(MultipartFile file) {

        validarArquivo(file);

        List<ManifestoDTO> manifestos =
                manifestoClient.enviar(file);

        List<Viagem> viagens = manifestos.stream()
                .map(manifestoMapper::toEntity)
                .toList();

        return viagemRepository.saveAll(viagens);
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