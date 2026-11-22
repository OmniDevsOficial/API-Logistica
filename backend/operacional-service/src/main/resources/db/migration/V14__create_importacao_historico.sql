/*
 * Histórico das importações de manifesto e de planilha de veículos, mostrado
 * na tela "Registros".
 *
 * As duas importações acontecem neste serviço (o relatorio-service apenas faz
 * o parse do manifesto), então este é o único lugar onde o histórico completo
 * pode ser gravado.
 *
 * - tipo e status são VARCHAR porque os enums JPA são gravados como texto;
 * - hash_arquivo guarda o SHA-256 do conteúdo: é ele que identifica um
 *   "mesmo arquivo" ao reimportar, mesmo com o nome alterado;
 * - reimportacao_de aponta para a data/hora da importação anterior do mesmo
 *   arquivo, origem do selo "Mesmo arquivo da importação de dd/mm";
 * - usuario pode ser nulo quando a requisição não tem token (imports internos
 *   e chamadas de teste).
 */

CREATE TABLE importacao_historico (
    id BIGSERIAL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL,
    data_hora TIMESTAMPTZ NOT NULL,
    arquivo VARCHAR(255) NOT NULL,
    usuario VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    criados INTEGER NOT NULL DEFAULT 0,
    atualizados INTEGER NOT NULL DEFAULT 0,
    ignorados INTEGER NOT NULL DEFAULT 0,
    rejeitados INTEGER NOT NULL DEFAULT 0,
    hash_arquivo VARCHAR(64),
    reimportacao_de TIMESTAMPTZ,

    CONSTRAINT ck_importacao_historico_tipo
        CHECK (tipo IN ('MANIFESTO', 'VEICULO')),
    CONSTRAINT ck_importacao_historico_status
        CHECK (status IN ('SUCESSO', 'PARCIAL', 'ERRO'))
);

-- A tela sempre ordena por data_hora decrescente, filtrando por tipo.
CREATE INDEX ix_importacao_historico_data_hora
    ON importacao_historico (data_hora DESC);

CREATE INDEX ix_importacao_historico_tipo_data_hora
    ON importacao_historico (tipo, data_hora DESC);

-- Localiza a importação anterior do mesmo conteúdo para marcar a reimportação.
CREATE INDEX ix_importacao_historico_tipo_hash
    ON importacao_historico (tipo, hash_arquivo);
