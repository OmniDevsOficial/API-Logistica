ALTER TABLE viagem
    ALTER COLUMN valor_frete TYPE NUMERIC(12,2),
    ADD COLUMN receita_frete NUMERIC(12,2),
    ADD COLUMN custo_frete NUMERIC(12,2),
    ADD COLUMN pedagio NUMERIC(12,2);
