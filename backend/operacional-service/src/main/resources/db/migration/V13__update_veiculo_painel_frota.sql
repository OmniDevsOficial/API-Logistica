ALTER TABLE veiculo
    ALTER COLUMN combustivel TYPE VARCHAR(50),
    ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMP,
    ADD COLUMN IF NOT EXISTS dados_adicionais JSONB;

CREATE INDEX IF NOT EXISTS ix_veiculo_tipo ON veiculo (tipo);
