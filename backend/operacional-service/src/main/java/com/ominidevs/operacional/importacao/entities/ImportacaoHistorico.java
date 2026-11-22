package com.ominidevs.operacional.importacao.entities;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Uma importação de manifesto ou de planilha de veículos que aconteceu no
 * sistema. É a linha exibida na tela "Registros".
 *
 * <p>O registro é gravado junto com a própria importação (mesma transação),
 * então um histórico que existe sempre corresponde a uma importação que foi
 * concluída. Tentativas que falharam gravam a linha própria, com status ERRO
 * e resumo zerado.
 */
@Entity
@Table(name = "importacao_historico")
public class ImportacaoHistorico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 20)
    private TipoImportacao tipo;

    @Column(name = "data_hora", nullable = false)
    private OffsetDateTime dataHora;

    @Column(name = "arquivo", nullable = false, length = 255)
    private String arquivo;

    @Column(name = "usuario", length = 255)
    private String usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private StatusImportacao status;

    @Column(name = "criados", nullable = false)
    private int criados;

    @Column(name = "atualizados", nullable = false)
    private int atualizados;

    @Column(name = "ignorados", nullable = false)
    private int ignorados;

    @Column(name = "rejeitados", nullable = false)
    private int rejeitados;

    /** SHA-256 do conteúdo do arquivo; {@code null} quando não foi possível ler. */
    @Column(name = "hash_arquivo", length = 64)
    private String hashArquivo;

    /** Data/hora da importação anterior do mesmo conteúdo, quando houver. */
    @Column(name = "reimportacao_de")
    private OffsetDateTime reimportacaoDe;

    protected ImportacaoHistorico() {
    }

    public ImportacaoHistorico(
            TipoImportacao tipo,
            OffsetDateTime dataHora,
            String arquivo,
            String usuario,
            StatusImportacao status,
            int criados,
            int atualizados,
            int ignorados,
            int rejeitados,
            String hashArquivo,
            OffsetDateTime reimportacaoDe
    ) {
        this.tipo = tipo;
        this.dataHora = dataHora;
        this.arquivo = arquivo;
        this.usuario = usuario;
        this.status = status;
        this.criados = criados;
        this.atualizados = atualizados;
        this.ignorados = ignorados;
        this.rejeitados = rejeitados;
        this.hashArquivo = hashArquivo;
        this.reimportacaoDe = reimportacaoDe;
    }

    public Long getId() {
        return id;
    }

    public TipoImportacao getTipo() {
        return tipo;
    }

    public OffsetDateTime getDataHora() {
        return dataHora;
    }

    public String getArquivo() {
        return arquivo;
    }

    public String getUsuario() {
        return usuario;
    }

    public StatusImportacao getStatus() {
        return status;
    }

    public int getCriados() {
        return criados;
    }

    public int getAtualizados() {
        return atualizados;
    }

    public int getIgnorados() {
        return ignorados;
    }

    public int getRejeitados() {
        return rejeitados;
    }

    public String getHashArquivo() {
        return hashArquivo;
    }

    public OffsetDateTime getReimportacaoDe() {
        return reimportacaoDe;
    }
}
