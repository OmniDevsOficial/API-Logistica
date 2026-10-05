ALTER TABLE viagem
    DROP COLUMN IF EXISTS cidade_origem,
    DROP COLUMN IF EXISTS data_prevista,
    DROP COLUMN IF EXISTS motorista_id,
    DROP COLUMN IF EXISTS veiculo_id;

ALTER TABLE viagem
    ADD COLUMN IF NOT EXISTS manifesto VARCHAR(50) NOT NULL,
    ADD COLUMN IF NOT EXISTS data DATE NOT NULL,
    ADD COLUMN IF NOT EXISTS motorista VARCHAR(255),
    ADD COLUMN IF NOT EXISTS cpf_motorista VARCHAR(50),
    ADD COLUMN IF NOT EXISTS veiculo VARCHAR(50),
    ADD COLUMN IF NOT EXISTS km_saida INT,
    ADD COLUMN IF NOT EXISTS km_chegada INT,
    ADD COLUMN IF NOT EXISTS observacoes TEXT;

ALTER TABLE viagem
    ALTER COLUMN cidade_destino TYPE VARCHAR(255),
    ALTER COLUMN cidade_destino DROP NOT NULL;

ALTER TABLE viagem
    ALTER COLUMN valor_frete TYPE DECIMAL(10,2);

ALTER TABLE viagem
    DROP CONSTRAINT IF EXISTS viagem_status_check;

ALTER TABLE viagem
    ADD CONSTRAINT viagem_status_check
    CHECK (
        status IN (
            'PENDENTE',
            'EM_TRANSITO',
            'FINALIZADO'
        )
    );