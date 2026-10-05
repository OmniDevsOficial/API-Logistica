/* Adiciona as colunas faltantes no front-end*/

ALTER TABLE viagem
    ADD COLUMN cidade_origem VARCHAR(255),
    ADD COLUMN estimativa_dias INT;