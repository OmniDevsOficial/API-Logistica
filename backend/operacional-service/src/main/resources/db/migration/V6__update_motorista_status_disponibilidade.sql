ALTER TABLE motorista
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'DISPONIVEL',
    ADD COLUMN IF NOT EXISTS veiculo_placa VARCHAR(20),
    ADD COLUMN IF NOT EXISTS veiculo_tipo VARCHAR(50),
    ADD COLUMN IF NOT EXISTS ultima_operacao DATE,
    ADD COLUMN IF NOT EXISTS ultima_localizacao VARCHAR(255),
    ADD COLUMN IF NOT EXISTS previsao_disponibilidade DATE;

ALTER TABLE motorista
    ALTER COLUMN nome TYPE VARCHAR(255),
    ALTER COLUMN nome DROP NOT NULL,
    ALTER COLUMN cpf DROP NOT NULL,
    ALTER COLUMN cidade DROP NOT NULL,
    ALTER COLUMN estado DROP NOT NULL;

ALTER TABLE motorista DROP CONSTRAINT IF EXISTS motorista_status_check;

ALTER TABLE motorista
    ADD CONSTRAINT motorista_status_check
    CHECK (
        status IN (
            'DISPONIVEL',
            'EM_OPERACAO',
            'INDISPONIVEL'
        )
    );
