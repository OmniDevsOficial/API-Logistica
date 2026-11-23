/*
 * Prepara a tabela veiculo para a importação do CSV de veículos:
 * - placa, tipo e motorista atual são os únicos dados importados, então
 *   marca, modelo e motorista deixam de ser obrigatórios;
 * - a placa passa a ser única na forma normalizada (maiúscula, sem hífen e
 *   sem espaço). Duplicatas existentes são removidas antes do índice,
 *   mantendo o registro mais recente. Nenhuma tabela referencia veiculo.
 */

ALTER TABLE veiculo DROP CONSTRAINT IF EXISTS veiculo_placa_key;

ALTER TABLE veiculo
    ALTER COLUMN marca DROP NOT NULL,
    ALTER COLUMN modelo DROP NOT NULL,
    ALTER COLUMN motorista_id DROP NOT NULL,
    ADD COLUMN IF NOT EXISTS tipo VARCHAR(50);

DELETE FROM veiculo antigo
USING veiculo recente
WHERE UPPER(REGEXP_REPLACE(antigo.placa, '[[:space:]-]', '', 'g'))
    = UPPER(REGEXP_REPLACE(recente.placa, '[[:space:]-]', '', 'g'))
  AND antigo.id < recente.id;

UPDATE veiculo
SET placa = UPPER(REGEXP_REPLACE(placa, '[[:space:]-]', '', 'g'));

CREATE UNIQUE INDEX IF NOT EXISTS ux_veiculo_placa ON veiculo (placa);

CREATE INDEX IF NOT EXISTS ix_veiculo_motorista ON veiculo (motorista_id);
