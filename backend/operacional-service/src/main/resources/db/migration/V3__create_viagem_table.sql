CREATE TABLE viagem (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	cidade_origem VARCHAR(100) NOT NULL,
	cidade_destino VARCHAR(100) NOT NULL,
	data_prevista DATE NOT NULL,
	valor_frete DECIMAL(8,2),
	status VARCHAR(20) NOT NULL
		CHECK (status IN('Finalizado', 'Em trânsito', 'Pendente')),
	motorista_id INT NOT NULL REFERENCES motorista(id),
    veiculo_id INT NOT NULL REFERENCES veiculo(id)
);