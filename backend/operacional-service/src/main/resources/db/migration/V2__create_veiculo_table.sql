CREATE TABLE veiculo (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	placa VARCHAR(7) NOT NULL UNIQUE,
	marca VARCHAR(14) NOT NULL,
	modelo VARCHAR(10) NOT NULL,
	cor VARCHAR(10),
	combustivel VARCHAR(16),
	ano_fabricacao INTEGER,
	status BOOLEAN,
    motorista_id INT NOT NULL REFERENCES motorista(id)
);