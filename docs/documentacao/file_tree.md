# File Tree: API-Logistica

**Generated:** 24/09/2026, 20:14:00
**Root Path:** `c:\Users\Gustavo.DESKTOP-BRCVQUD\Desktop\API-Logistica`

```
├── 📁 .github
│   └── 📄 CODEOWNERS
├── 📁 backend
│   ├── 📁 .gradle
│   │   ├── 📁 9.7.1
│   │   │   ├── 📁 checksums
│   │   │   │   ├── 📄 checksums.lock
│   │   │   │   ├── ⚙️ md5-checksums.bin
│   │   │   │   └── ⚙️ sha1-checksums.bin
│   │   │   ├── 📁 executionHistory
│   │   │   │   ├── ⚙️ executionHistory.bin
│   │   │   │   └── 📄 executionHistory.lock
│   │   │   ├── 📁 expanded
│   │   │   │   └── 📄 expanded.lock
│   │   │   ├── 📁 fileChanges
│   │   │   │   └── ⚙️ last-build.bin
│   │   │   ├── 📁 fileHashes
│   │   │   │   ├── ⚙️ fileHashes.bin
│   │   │   │   ├── 📄 fileHashes.lock
│   │   │   │   └── ⚙️ resourceHashesCache.bin
│   │   │   ├── 📁 vcsMetadata
│   │   │   └── 📄 gc.properties
│   │   ├── 📁 buildOutputCleanup
│   │   │   ├── 📄 buildOutputCleanup.lock
│   │   │   ├── 📄 cache.properties
│   │   │   └── ⚙️ outputFiles.bin
│   │   └── 📁 vcs-1
│   │       └── 📄 gc.properties
│   ├── 📁 gradle
│   │   └── 📁 wrapper
│   │       ├── 📄 gradle-wrapper.jar
│   │       └── 📄 gradle-wrapper.properties
│   ├── 📁 operacional-service
│   │   ├── 📁 src
│   │   │   ├── 📁 main
│   │   │   │   ├── 📁 java
│   │   │   │   │   └── 📁 com
│   │   │   │   │       └── 📁 ominidevs
│   │   │   │   │           └── 📁 operacional
│   │   │   │   │               ├── 📁 motorista
│   │   │   │   │               │   ├── 📁 controllers
│   │   │   │   │               │   │   └── ☕ MotoristaController.java
│   │   │   │   │               │   ├── 📁 entities
│   │   │   │   │               │   │   └── ⚙️ .gitkeep
│   │   │   │   │               │   ├── 📁 repositories
│   │   │   │   │               │   │   └── ⚙️ .gitkeep
│   │   │   │   │               │   └── 📁 services
│   │   │   │   │               │       └── ⚙️ .gitkeep
│   │   │   │   │               ├── 📁 veiculo
│   │   │   │   │               │   ├── 📁 controllers
│   │   │   │   │               │   │   └── ⚙️ .gitkeep
│   │   │   │   │               │   ├── 📁 entities
│   │   │   │   │               │   │   └── ⚙️ .gitkeep
│   │   │   │   │               │   ├── 📁 repositories
│   │   │   │   │               │   │   └── ⚙️ .gitkeep
│   │   │   │   │               │   └── 📁 services
│   │   │   │   │               │       └── ⚙️ .gitkeep
│   │   │   │   │               ├── 📁 viagem
│   │   │   │   │               │   ├── 📁 clients
│   │   │   │   │               │   │   ├── ☕ ManifestoClient.java
│   │   │   │   │               │   │   └── ☕ ManifestoClientImpl.java
│   │   │   │   │               │   ├── 📁 configs
│   │   │   │   │               │   │   └── ☕ RestClientConfig.java
│   │   │   │   │               │   ├── 📁 controllers
│   │   │   │   │               │   │   └── ☕ ViagemController.java
│   │   │   │   │               │   ├── 📁 dto
│   │   │   │   │               │   │   └── ☕ ManifestoDTO.java
│   │   │   │   │               │   ├── 📁 entities
│   │   │   │   │               │   │   ├── ☕ StatusViagem.java
│   │   │   │   │               │   │   └── ☕ Viagem.java
│   │   │   │   │               │   ├── 📁 exceptions
│   │   │   │   │               │   │   ├── ☕ FileUploadException.java
│   │   │   │   │               │   │   ├── ☕ FiltroInvalidoException.java
│   │   │   │   │               │   │   └── ☕ ViagemExceptionHandler.java
│   │   │   │   │               │   ├── 📁 mappers
│   │   │   │   │               │   │   └── ☕ ManifestoMapper.java
│   │   │   │   │               │   ├── 📁 repositories
│   │   │   │   │               │   │   └── ☕ ViagemRepository.java
│   │   │   │   │               │   ├── 📁 services
│   │   │   │   │               │   │   └── ☕ ViagemService.java
│   │   │   │   │               │   └── 📁 specifications
│   │   │   │   │               │       └── ☕ ViagemSpecifications.java
│   │   │   │   │               └── ☕ OperacionalApplication.java
│   │   │   │   └── 📁 resources
│   │   │   │       ├── 📁 db
│   │   │   │       │   └── 📁 migration
│   │   │   │       │       ├── 📄 V1__create_motorista_table.sql
│   │   │   │       │       ├── 📄 V2__create_veiculo_table.sql
│   │   │   │       │       ├── 📄 V3__create_viagem_table.sql
│   │   │   │       │       └── 📄 V4__update_viagem_table.sql
│   │   │   │       └── ⚙️ application.yml
│   │   │   └── 📁 test
│   │   │       └── 📁 java
│   │   │           └── 📁 com
│   │   │               └── 📁 ominidevs
│   │   │                   └── 📁 operacional
│   │   │                       └── 📁 viagem
│   │   │                           ├── 📁 controllers
│   │   │                           │   └── ☕ ViagemControllerTest.java
│   │   │                           ├── 📁 mappers
│   │   │                           │   └── ☕ ManifestoMapperTest.java
│   │   │                           └── 📁 services
│   │   │                               └── ☕ ViagemServiceTest.java
│   │   ├── 🐳 Dockerfile
│   │   └── 📄 build.gradle
│   ├── 📁 relatorio-service
│   │   ├── 📁 src
│   │   │   ├── 📁 main
│   │   │   │   ├── 📁 java
│   │   │   │   │   └── 📁 com
│   │   │   │   │       └── 📁 ominidevs
│   │   │   │   │           └── 📁 relatorio
│   │   │   │   │               ├── 📁 client
│   │   │   │   │               │   └── ☕ OperacionalClient.java
│   │   │   │   │               ├── 📁 config
│   │   │   │   │               │   └── ☕ GlobalExceptionHandler.java
│   │   │   │   │               ├── 📁 manifesto
│   │   │   │   │               │   ├── 📁 exception
│   │   │   │   │               │   │   └── ☕ ArquivoInvalidoException.java
│   │   │   │   │               │   ├── 📁 parser
│   │   │   │   │               │   │   ├── ☕ ArquivoParser.java
│   │   │   │   │               │   │   ├── ☕ CsvParser.java
│   │   │   │   │               │   │   └── ☕ ExcelParser.java
│   │   │   │   │               │   ├── ☕ ManifestoController.java
│   │   │   │   │               │   └── ☕ ManifestoService.java
│   │   │   │   │               └── ☕ RelatorioApplication.java
│   │   │   │   └── 📁 resources
│   │   │   │       ├── 📁 db
│   │   │   │       │   └── 📁 migration
│   │   │   │       │       └── 📄 V1__placeholder.sql
│   │   │   │       └── ⚙️ application.yml
│   │   │   └── 📁 test
│   │   │       └── 📁 java
│   │   │           └── 📁 com
│   │   │               └── 📁 ominidevs
│   │   │                   └── 📁 relatorio
│   │   │                       └── 📁 manifesto
│   │   │                           └── ☕ ManifestoServiceTest.java
│   │   ├── 🐳 Dockerfile
│   │   └── 📄 build.gradle
│   ├── ⚙️ .dockerignore
│   ├── ⚙️ .gitattributes
│   ├── ⚙️ .gitignore
│   ├── 📄 build.gradle
│   ├── 📄 gradlew
│   ├── 📄 gradlew.bat
│   └── 📄 settings.gradle
├── 📁 database
│   ├── 📁 init
│   │   └── 📄 01-schemas.sql
│   └── 🐳 Dockerfile
├── 📁 docs
│   └── 📁 documentacao
│       ├── 📕 Backlog.pdf
│       ├── 📕 Cenarios_sprint1.pdf
│       └── 📕 DoR_e_DoD_sprint1.pdf
├── 📁 frontend
│   ├── 📁 public
│   │   ├── 🖼️ favicon.svg
│   │   └── 🖼️ logo.png
│   ├── 📁 src
│   │   ├── 📁 app
│   │   │   ├── 📁 providers
│   │   │   │   └── ⚙️ .gitkeep
│   │   │   ├── 📁 router
│   │   │   │   ├── 📄 AppRouter.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 styles
│   │   │   │   └── 🎨 index.css
│   │   │   └── 📄 App.tsx
│   │   ├── 📁 entities
│   │   │   ├── 📁 dashboard-metrics
│   │   │   │   ├── 📁 api
│   │   │   │   │   └── 📄 dashboardMetricsService.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   └── 📄 types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 relatorio
│   │   │   │   └── 📁 api
│   │   │   │       └── 📄 enviarRelatorio.ts
│   │   │   └── 📁 viagem
│   │   │       ├── 📁 api
│   │   │       │   └── 📄 viagemService.ts
│   │   │       ├── 📁 model
│   │   │       │   └── 📄 types.ts
│   │   │       ├── 📁 ui
│   │   │       │   ├── 📄 StatusViagemBadge.tsx
│   │   │       │   ├── 📄 ViagemCard.tsx
│   │   │       │   └── 📄 ViagemRankingItem.tsx
│   │   │       └── 📄 index.ts
│   │   ├── 📁 features
│   │   │   ├── 📁 enviar-relatorio
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 formatarTamanhoArquivo.ts
│   │   │   │   │   └── 📄 validarArquivoRelatorio.ts
│   │   │   │   └── 📁 ui
│   │   │   │       ├── 📄 BotaoEnviarRelatorio.tsx
│   │   │   │       ├── 📄 MensagemFeedbackUpload.tsx
│   │   │   │       └── 📄 ModalEnviarRelatorio.tsx
│   │   │   └── 📁 period-filter
│   │   │       ├── 📁 ui
│   │   │       │   └── 📄 PeriodFilter.tsx
│   │   │       └── 📄 index.ts
│   │   ├── 📁 pages
│   │   │   ├── 📁 Dashboard
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 DashboardPage.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   └── 📁 Viagens
│   │   │       ├── 📁 ui
│   │   │       │   └── 📄 ViagensPage.tsx
│   │   │       └── 📄 index.ts
│   │   ├── 📁 shared
│   │   │   ├── 📁 api
│   │   │   │   └── ⚙️ .gitkeep
│   │   │   ├── 📁 config
│   │   │   │   └── ⚙️ .gitkeep
│   │   │   ├── 📁 lib
│   │   │   │   ├── 📄 format.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 types
│   │   │   │   └── ⚙️ .gitkeep
│   │   │   └── 📁 ui
│   │   │       ├── 📁 ChartCard
│   │   │       │   └── 📄 ChartCard.tsx
│   │   │       ├── 📁 PageHeader
│   │   │       │   └── 📄 PageHeader.tsx
│   │   │       ├── 📁 StatCard
│   │   │       │   └── 📄 StatCard.tsx
│   │   │       └── 📄 index.ts
│   │   ├── 📁 widgets
│   │   │   ├── 📁 dashboard-overview
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 DashboardOverview.tsx
│   │   │   │   │   ├── 📄 RentabilidadeViagensChart.tsx
│   │   │   │   │   └── 📄 UtilizacaoFrotaChart.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 dashboard-topbar
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 DashboardTopbar.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 sidebar
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 Sidebar.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 viagens-list
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 ViagensList.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 viagens-ranking
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 ViagensRanking.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   └── 📁 viagens-topbar
│   │   │       ├── 📁 ui
│   │   │       │   └── 📄 ViagensTopbar.tsx
│   │   │       └── 📄 index.ts
│   │   └── 📄 main.tsx
│   ├── ⚙️ .dockerignore
│   ├── ⚙️ .gitignore
│   ├── 🐳 Dockerfile
│   ├── 📝 README.md
│   ├── 📄 eslint.config.js
│   ├── 🌐 index.html
│   ├── ⚙️ nginx.conf
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── ⚙️ tsconfig.app.json
│   ├── ⚙️ tsconfig.json
│   ├── ⚙️ tsconfig.node.json
│   └── 📄 vite.config.ts
├── ⚙️ .env.example
├── ⚙️ .gitignore
├── 📝 README.md
└── ⚙️ docker-compose.yml
```