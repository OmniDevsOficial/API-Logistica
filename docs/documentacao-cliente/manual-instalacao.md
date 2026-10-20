## ⚙️ Manual de Instalação <a id="manual-de-instalacao"></a>

### 📌 Pré-requisitos

| Ferramenta | Versão mínima | Descrição |
| :--- | :---: | :--- |
| **Git** | 2.x | Clonar o repositório |
| **Docker** | 24.x | Rodar os containers |
| **Docker Compose** | 2.x | Orquestrar os serviços |


### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/OmniDevsOficial/API-Logistica.git
cd API-Logistica
```

### 2️⃣ Configurar variáveis de ambiente

```bash
# Linux / macOS
cp .env.example .env
```

```powershell
# Windows (PowerShell)
Copy-Item .env.example .env
```

Edite o arquivo `.env` gerado com os valores desejados, por exemplo:

```env
POSTGRES_DB=newelog_db
POSTGRES_USER=newelog_app
POSTGRES_PASSWORD=newelog_app
JWT_SECRET=
JWT_EXPIRACAO_MINUTOS=480
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

<!-- Chave JWT -->
Para gerar a chave JWT na primeira vez, cole e execute este comando no PowerShell:
```
$bytes = New-Object byte[] 48
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$key = [Convert]::ToBase64String($bytes)
$rng.Dispose()
$key
```

### 3️⃣ Subir os containers
Na raiz do projeto execute o Docker:
```bash
docker compose up --build
```

### 4️⃣ Acessar os serviços

Após todos os containers estarem rodando, acesse:

| Serviço | URL | Descrição |
| :--- | :--- | :--- |
| Frontend | http://localhost:3000 | Interface web (React + Vite) |
| Operacional API | http://localhost:8081 | Microsserviço operacional (Spring Boot) |
| Relatório API | http://localhost:8082 | Microsserviço de relatórios (Spring Boot) |
| Autenticação API | http://localhost:8083 | Microsserviço de autenticação (Spring Boot) |
| PostgreSQL | localhost:5433 | Banco de dados (acesso via pgAdmin, DBeaver, Psql, etc.) |

### 5️⃣ Parar os containers

```bash
# Parar os containers (mantém os dados do banco)
docker compose down

# Parar e remover os volumes (apaga os dados do banco)
docker compose down -v
```