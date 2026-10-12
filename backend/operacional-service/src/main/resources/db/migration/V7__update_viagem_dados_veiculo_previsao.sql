ALTER TABLE viagem
    ADD COLUMN IF NOT EXISTS veiculo_tipo VARCHAR(50),
    ADD COLUMN IF NOT EXISTS data_previsao_chegada DATE;
