/*
 * A planilha de veículos traz modelos com até 24 caracteres (410 de 872 passam
 * de 10), mas a V2 criou modelo com 10 e marca com 14. Amplia as duas colunas para a
 * importação gravar marca e modelo sem truncar.
 */

ALTER TABLE veiculo
    ALTER COLUMN marca TYPE VARCHAR(100),
    ALTER COLUMN modelo TYPE VARCHAR(100);
