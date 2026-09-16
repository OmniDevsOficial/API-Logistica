CREATE TABLE motorista (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	nome VARCHAR(80) NOT NULL,
	cpf VARCHAR(11) NOT NULL UNIQUE,
	cidade VARCHAR(50) NOT NULL,
	estado CHAR(2) NOT NULL
    CHECK (estado IN (
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF',
        'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
        'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS',
        'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    )),
	data_criacao DATE NOT NULL
);