package com.ominidevs.operacional.importacao.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.ominidevs.operacional.importacao.entities.ImportacaoHistorico;
import com.ominidevs.operacional.importacao.entities.TipoImportacao;

public interface ImportacaoHistoricoRepository
        extends JpaRepository<ImportacaoHistorico, Long>, JpaSpecificationExecutor<ImportacaoHistorico> {

    /**
     * Última importação do mesmo tipo com o mesmo conteúdo de arquivo: origem
     * do selo de reimportação ("Mesmo arquivo da importação de dd/mm").
     */
    Optional<ImportacaoHistorico> findFirstByTipoAndHashArquivoOrderByDataHoraDesc(
            TipoImportacao tipo, String hashArquivo);
}
