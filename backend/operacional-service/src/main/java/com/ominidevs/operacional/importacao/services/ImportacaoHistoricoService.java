package com.ominidevs.operacional.importacao.services;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ominidevs.operacional.importacao.dto.FiltroImportacao;
import com.ominidevs.operacional.importacao.dto.ImportacaoHistoricoResponse;
import com.ominidevs.operacional.importacao.dto.ResumoImportacao;
import com.ominidevs.operacional.importacao.entities.ImportacaoHistorico;
import com.ominidevs.operacional.importacao.entities.TipoImportacao;
import com.ominidevs.operacional.importacao.repositories.ImportacaoHistoricoRepository;

import jakarta.persistence.criteria.Predicate;

/**
 * Grava e consulta o histórico das importações de manifesto e de veículos.
 *
 * <p>Quem enviou o arquivo vem do token da requisição (claim "nome"); sem
 * token, o histórico fica com o usuário nulo em vez de impedir a gravação.
 *
 * <p>{@link #registrar} entra na transação da importação: ou as duas coisas
 * são gravadas, ou nenhuma. {@link #registrarFalha} abre transação própria
 * porque roda quando a importação já está condenada a ser desfeita.
 */
@Service
public class ImportacaoHistoricoService {

    private static final Logger LOG = LoggerFactory.getLogger(ImportacaoHistoricoService.class);
    private static final String ARQUIVO_DESCONHECIDO = "Arquivo não informado";
    private static final int TAMANHO_MAXIMO_HASH = 10 * 1024 * 1024;

    private final ImportacaoHistoricoRepository repository;

    public ImportacaoHistoricoService(ImportacaoHistoricoRepository repository) {
        this.repository = repository;
    }

    /**
     * Registra uma importação concluída, com as contagens do resumo.
     *
     * @param tipo MANIFESTO ou VEICULO
     * @param arquivo arquivo enviado (nome e conteúdo)
     * @param resumo contagens; o status é derivado delas
     */
    @Transactional
    public void registrar(TipoImportacao tipo, MultipartFile arquivo, ResumoImportacao resumo) {
        gravar(tipo, arquivo, resumo);
    }

    /**
     * Registra uma tentativa que falhou (arquivo inválido, serviço fora do ar,
     * 100% das linhas rejeitadas): resumo zerado e status ERRO.
     *
     * <p>Transação própria para sobreviver ao rollback da importação. A falha
     * da gravação não pode esconder o erro original, então é apenas registrada
     * em log.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void registrarFalha(TipoImportacao tipo, MultipartFile arquivo) {
        try {
            gravar(tipo, arquivo, ResumoImportacao.ZERO);
        } catch (RuntimeException excecao) {
            LOG.warn("Não foi possível registrar a falha da importação de {}", tipo, excecao);
        }
    }

    /**
     * Lista o histórico em ordem decrescente de data/hora, com os filtros que
     * a tela manda por parâmetro.
     */
    public List<ImportacaoHistoricoResponse> listar(FiltroImportacao filtro) {
        Sort ordenacao = Sort.by(Sort.Direction.DESC, "dataHora");
        return repository.findAll(comFiltros(filtro), ordenacao)
                .stream()
                .map(ImportacaoHistoricoResponse::de)
                .toList();
    }

    private void gravar(TipoImportacao tipo, MultipartFile arquivo, ResumoImportacao resumo) {
        OffsetDateTime dataHora = OffsetDateTime.now();
        String hash = hashDoArquivo(arquivo);
        OffsetDateTime reimportacaoDe = reimportacaoAnterior(tipo, hash, dataHora);

        ImportacaoHistorico historico = new ImportacaoHistorico(
                tipo,
                dataHora,
                nomeDoArquivo(arquivo),
                usuarioAtual(),
                resumo.status(),
                resumo.criados(),
                resumo.atualizados(),
                resumo.ignorados(),
                resumo.rejeitados(),
                hash,
                reimportacaoDe);
        repository.save(historico);
    }

    /** Menor registro anterior do mesmo tipo e conteúdo, se este for reenvio. */
    private OffsetDateTime reimportacaoAnterior(TipoImportacao tipo, String hash, OffsetDateTime dataHora) {
        if (hash == null) {
            return null;
        }
        return repository.findFirstByTipoAndHashArquivoOrderByDataHoraDesc(tipo, hash)
                .map(ImportacaoHistorico::getDataHora)
                .filter(anterior -> anterior.isBefore(dataHora))
                .orElse(null);
    }

    private Specification<ImportacaoHistorico> comFiltros(FiltroImportacao filtro) {
        return (root, query, cb) -> {
            List<Predicate> predicados = new ArrayList<>();
            if (filtro.tipo() != null) {
                predicados.add(cb.equal(root.get("tipo"), filtro.tipo()));
            }
            if (filtro.status() != null) {
                predicados.add(cb.equal(root.get("status"), filtro.status()));
            }
            if (filtro.de() != null) {
                predicados.add(cb.greaterThanOrEqualTo(root.get("dataHora"), inicioDoDia(filtro.de())));
            }
            if (filtro.ate() != null) {
                // O "até" é inclusive no último dia.
                predicados.add(cb.lessThan(root.get("dataHora"), inicioDoDia(filtro.ate().plusDays(1))));
            }
            return cb.and(predicados.toArray(new Predicate[0]));
        };
    }

    private OffsetDateTime inicioDoDia(LocalDate dia) {
        return dia.atStartOfDay(ZoneId.systemDefault()).toOffsetDateTime();
    }

    private String nomeDoArquivo(MultipartFile arquivo) {
        String nome = arquivo == null ? null : arquivo.getOriginalFilename();
        return nome == null || nome.isBlank() ? ARQUIVO_DESCONHECIDO : nome;
    }

    /** SHA-256 do conteúdo; nulo quando não há arquivo legível. */
    private String hashDoArquivo(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty() || arquivo.getSize() > TAMANHO_MAXIMO_HASH) {
            return null;
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(arquivo.getBytes()));
        } catch (IOException | NoSuchAlgorithmException | RuntimeException excecao) {
            LOG.debug("Sem hash para o arquivo da importação: {}", excecao.getMessage());
            return null;
        }
    }

    /** Nome de quem enviou, lido do JWT da requisição em andamento. */
    private String usuarioAtual() {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        if (autenticacao == null) {
            return null;
        }
        if (autenticacao.getPrincipal() instanceof Jwt jwt) {
            String nome = jwt.getClaimAsString("nome");
            if (nome != null && !nome.isBlank()) {
                return nome;
            }
            return jwt.getSubject();
        }
        String nome = autenticacao.getName();
        if (nome == null || nome.isBlank() || "anonymousUser".equals(nome)) {
            return null;
        }
        return nome;
    }
}
