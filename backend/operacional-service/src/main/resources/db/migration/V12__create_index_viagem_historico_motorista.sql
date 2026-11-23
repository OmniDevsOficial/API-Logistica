CREATE INDEX IF NOT EXISTS ix_viagem_historico_cpf
    ON viagem ((NULLIF(regexp_replace(cpf_motorista, '[^0-9]', '', 'g'), '')), data DESC, id DESC);

CREATE INDEX IF NOT EXISTS ix_viagem_historico_nome
    ON viagem ((LOWER(TRIM(motorista))), data DESC, id DESC);
