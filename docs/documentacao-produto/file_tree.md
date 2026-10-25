# Estrutura do Projeto: Plataforma de Controle de Motoristas Agregados

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
│   │   ├── 📁 nb-cache
│   │   │   ├── 📁 autenticacao-service-1065423257
│   │   │   │   └── 📄 project-info.ser
│   │   │   ├── 📁 backend-1076882930
│   │   │   │   └── 📄 project-info.ser
│   │   │   ├── 📁 operacional-service-438172863
│   │   │   │   └── 📄 project-info.ser
│   │   │   ├── 📁 relatorio-service-1377396819
│   │   │   │   └── 📄 project-info.ser
│   │   │   ├── 📁 trust
│   │   │   │   └── 📄 D2CDF108C90DD36FA418B95A258DBD40613DE8A3F1455FE669BC2E1D105C9451
│   │   │   └── 📄 subprojects.ser
│   │   └── 📁 vcs-1
│   │       └── 📄 gc.properties
│   ├── 📁 autenticacao-service
│   │   ├── 📁 src
│   │   │   ├── 📁 main
│   │   │   │   ├── 📁 java
│   │   │   │   │   └── 📁 com
│   │   │   │   │       └── 📁 ominidevs
│   │   │   │   │           └── 📁 autenticacao
│   │   │   │   │               ├── 📁 auth
│   │   │   │   │               │   ├── 📁 configs
│   │   │   │   │               │   │   ├── ☕ AuthConfig.java
│   │   │   │   │               │   │   └── ☕ CorsConfig.java
│   │   │   │   │               │   ├── 📁 controllers
│   │   │   │   │               │   │   └── ☕ AuthController.java
│   │   │   │   │               │   ├── 📁 dto
│   │   │   │   │               │   │   ├── ☕ LoginRequest.java
│   │   │   │   │               │   │   ├── ☕ LoginResponse.java
│   │   │   │   │               │   │   └── ☕ UsuarioAutenticadoResponse.java
│   │   │   │   │               │   ├── 📁 entities
│   │   │   │   │               │   │   ├── ☕ Perfil.java
│   │   │   │   │               │   │   └── ☕ Usuario.java
│   │   │   │   │               │   ├── 📁 exceptions
│   │   │   │   │               │   │   ├── ☕ AuthExceptionHandler.java
│   │   │   │   │               │   │   ├── ☕ CredenciaisInvalidasException.java
│   │   │   │   │               │   │   └── ☕ TokenInvalidoException.java
│   │   │   │   │               │   ├── 📁 repositories
│   │   │   │   │               │   │   └── ☕ UsuarioRepository.java
│   │   │   │   │               │   └── 📁 services
│   │   │   │   │               │       ├── ☕ AuthService.java
│   │   │   │   │               │       └── ☕ TokenService.java
│   │   │   │   │               └── ☕ AutenticacaoApplication.java
│   │   │   │   └── 📁 resources
│   │   │   │       ├── 📁 db
│   │   │   │       │   └── 📁 migration
│   │   │   │       │       ├── 📄 V1__create_usuario_table.sql
│   │   │   │       │       └── 📄 V2__insert_usuarios_iniciais.sql
│   │   │   │       └── ⚙️ application.yml
│   │   │   └── 📁 test
│   │   │       └── 📁 java
│   │   │           └── 📁 com
│   │   │               └── 📁 ominidevs
│   │   │                   └── 📁 autenticacao
│   │   │                       └── 📁 auth
│   │   │                           ├── 📁 controllers
│   │   │                           │   └── ☕ AuthControllerTest.java
│   │   │                           └── 📁 services
│   │   │                               └── ☕ TokenServiceTest.java
│   │   ├── 🐳 Dockerfile
│   │   └── 📄 build.gradle
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
│   │   │   │   │               ├── 📁 dashboard
│   │   │   │   │               │   ├── 📁 controllers
│   │   │   │   │               │   │   └── ☕ DashboardController.java
│   │   │   │   │               │   ├── 📁 dto
│   │   │   │   │               │   │   ├── ☕ DashboardResponse.java
│   │   │   │   │               │   │   ├── ☕ MetricasDashboardResponse.java
│   │   │   │   │               │   │   ├── ☕ PontoSerieResponse.java
│   │   │   │   │               │   │   ├── ☕ SeriesDashboardResponse.java
│   │   │   │   │               │   │   └── ☕ ViagensPorStatusResponse.java
│   │   │   │   │               │   ├── 📁 exceptions
│   │   │   │   │               │   │   └── ☕ DashboardExceptionHandler.java
│   │   │   │   │               │   ├── 📁 projections
│   │   │   │   │               │   │   ├── ☕ PontoSerie.java
│   │   │   │   │               │   │   ├── ☕ ResumoViagens.java
│   │   │   │   │               │   │   └── ☕ ValoresFinanceirosViagem.java
│   │   │   │   │               │   ├── 📁 repositories
│   │   │   │   │               │   │   └── ☕ DashboardRepository.java
│   │   │   │   │               │   └── 📁 services
│   │   │   │   │               │       └── ☕ DashboardService.java
│   │   │   │   │               ├── 📁 indicadores
│   │   │   │   │               │   ├── 📁 controllers
│   │   │   │   │               │   │   └── ☕ UtilizacaoController.java
│   │   │   │   │               │   ├── 📁 dto
│   │   │   │   │               │   │   ├── ☕ UtilizacaoMotoristaResponse.java
│   │   │   │   │               │   │   └── ☕ UtilizacaoPeriodoResponse.java
│   │   │   │   │               │   ├── 📁 exceptions
│   │   │   │   │               │   │   ├── ☕ IndicadorExceptionHandler.java
│   │   │   │   │               │   │   └── ☕ IndicadorInvalidoException.java
│   │   │   │   │               │   ├── 📁 model
│   │   │   │   │               │   │   ├── ☕ OrdenacaoUtilizacao.java
│   │   │   │   │               │   │   └── ☕ PeriodoConsulta.java
│   │   │   │   │               │   ├── 📁 projections
│   │   │   │   │               │   │   └── ☕ MotoristaQuantidadeViagens.java
│   │   │   │   │               │   ├── 📁 repositories
│   │   │   │   │               │   │   └── ☕ UtilizacaoRepository.java
│   │   │   │   │               │   └── 📁 services
│   │   │   │   │               │       └── ☕ UtilizacaoService.java
│   │   │   │   │               ├── 📁 motorista
│   │   │   │   │               │   ├── 📁 controllers
│   │   │   │   │               │   │   └── ☕ MotoristaController.java
│   │   │   │   │               │   ├── 📁 dto
│   │   │   │   │               │   │   ├── ☕ MotoristaResponseDTO.java
│   │   │   │   │               │   │   ├── ☕ MotoristaResumoResponse.java
│   │   │   │   │               │   │   └── ☕ StatusMotoristaRequest.java
│   │   │   │   │               │   ├── 📁 entities
│   │   │   │   │               │   │   ├── ⚙️ .gitkeep
│   │   │   │   │               │   │   ├── ☕ Motorista.java
│   │   │   │   │               │   │   └── ☕ StatusMotorista.java
│   │   │   │   │               │   ├── 📁 exceptions
│   │   │   │   │               │   │   ├── ☕ MotoristaExceptionHandler.java
│   │   │   │   │               │   │   ├── ☕ MotoristaNaoEncontradoException.java
│   │   │   │   │               │   │   └── ☕ StatusInvalidoException.java
│   │   │   │   │               │   ├── 📁 projections
│   │   │   │   │               │   │   ├── ☕ MotoristaListagem.java
│   │   │   │   │               │   │   └── ☕ MotoristaStatusContagem.java
│   │   │   │   │               │   ├── 📁 repositories
│   │   │   │   │               │   │   ├── ⚙️ .gitkeep
│   │   │   │   │               │   │   ├── ☕ MotoristaConsultaRepository.java
│   │   │   │   │               │   │   └── ☕ MotoristaRepository.java
│   │   │   │   │               │   └── 📁 services
│   │   │   │   │               │       ├── ⚙️ .gitkeep
│   │   │   │   │               │       └── ☕ MotoristaService.java
│   │   │   │   │               ├── 📁 seguranca
│   │   │   │   │               │   ├── ☕ RepasseTokenInterceptor.java
│   │   │   │   │               │   └── ☕ SegurancaConfig.java
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
│   │   │   │   │               │   │   ├── ☕ ErroLinhaImportacao.java
│   │   │   │   │               │   │   ├── ☕ ImportacaoManifestoResponse.java
│   │   │   │   │               │   │   ├── ☕ ManifestoDTO.java
│   │   │   │   │               │   │   ├── ☕ RankingDestinoResponse.java
│   │   │   │   │               │   │   ├── ☕ RentabilidadeViagemResponse.java
│   │   │   │   │               │   │   └── ☕ ViagemResponseDTO.java
│   │   │   │   │               │   ├── 📁 entities
│   │   │   │   │               │   │   ├── ☕ StatusViagem.java
│   │   │   │   │               │   │   └── ☕ Viagem.java
│   │   │   │   │               │   ├── 📁 exceptions
│   │   │   │   │               │   │   ├── ☕ FileUploadException.java
│   │   │   │   │               │   │   ├── ☕ FiltroInvalidoException.java
│   │   │   │   │               │   │   ├── ☕ IntegracaoManifestoException.java
│   │   │   │   │               │   │   └── ☕ ViagemExceptionHandler.java
│   │   │   │   │               │   ├── 📁 mappers
│   │   │   │   │               │   │   └── ☕ ManifestoMapper.java
│   │   │   │   │               │   ├── 📁 repositories
│   │   │   │   │               │   │   ├── ☕ RankingDestinoRepository.java
│   │   │   │   │               │   │   ├── ☕ RankingDestinoRepositoryImpl.java
│   │   │   │   │               │   │   └── ☕ ViagemRepository.java
│   │   │   │   │               │   ├── 📁 services
│   │   │   │   │               │   │   ├── ☕ RentabilidadeService.java
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
│   │   │   │       │       ├── 📄 V4__update_viagem_table.sql
│   │   │   │       │       ├── 📄 V5__update_adiciona_dados_exibicao_viagem.sql
│   │   │   │       │       ├── 📄 V6__update_motorista_status_disponibilidade.sql
│   │   │   │       │       ├── 📄 V7__update_viagem_dados_veiculo_previsao.sql
│   │   │   │       │       └── 📄 V8__add_viagem_financial_values.sql
│   │   │   │       └── ⚙️ application.yml
│   │   │   └── 📁 test
│   │   │       └── 📁 java
│   │   │           └── 📁 com
│   │   │               └── 📁 ominidevs
│   │   │                   └── 📁 operacional
│   │   │                       ├── 📁 dashboard
│   │   │                       │   ├── 📁 controllers
│   │   │                       │   │   └── ☕ DashboardControllerTest.java
│   │   │                       │   ├── 📁 repositories
│   │   │                       │   │   └── ☕ DashboardRepositoryTest.java
│   │   │                       │   └── 📁 services
│   │   │                       │       └── ☕ DashboardServiceTest.java
│   │   │                       ├── 📁 indicadores
│   │   │                       │   ├── 📁 controllers
│   │   │                       │   │   └── ☕ UtilizacaoControllerTest.java
│   │   │                       │   ├── 📁 model
│   │   │                       │   │   └── ☕ PeriodoConsultaTest.java
│   │   │                       │   ├── 📁 repositories
│   │   │                       │   │   └── ☕ UtilizacaoRepositoryTest.java
│   │   │                       │   └── 📁 services
│   │   │                       │       └── ☕ UtilizacaoServiceTest.java
│   │   │                       ├── 📁 motorista
│   │   │                       │   ├── 📁 controllers
│   │   │                       │   │   └── ☕ MotoristaControllerTest.java
│   │   │                       │   └── 📁 services
│   │   │                       │       └── ☕ MotoristaServiceTest.java
│   │   │                       ├── 📁 seguranca
│   │   │                       │   ├── ☕ RepasseTokenInterceptorTest.java
│   │   │                       │   ├── ☕ SegurancaTest.java
│   │   │                       │   └── ☕ TokensDeTeste.java
│   │   │                       └── 📁 viagem
│   │   │                           ├── 📁 clients
│   │   │                           │   └── ☕ ManifestoClientImplTest.java
│   │   │                           ├── 📁 controllers
│   │   │                           │   ├── ☕ ImportacaoManifestoControllerTest.java
│   │   │                           │   ├── ☕ RankingDestinosControllerTest.java
│   │   │                           │   └── ☕ ViagemControllerTest.java
│   │   │                           ├── 📁 mappers
│   │   │                           │   └── ☕ ManifestoMapperTest.java
│   │   │                           ├── 📁 repositories
│   │   │                           │   ├── ☕ RankingDestinosIntegrationTest.java
│   │   │                           │   └── ☕ ViagemFiltrosIntegrationTest.java
│   │   │                           └── 📁 services
│   │   │                               ├── ☕ ImportacaoManifestoTest.java
│   │   │                               ├── ☕ RankingDestinosServiceTest.java
│   │   │                               ├── ☕ RentabilidadeServiceTest.java
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
│   │   │   │   │               │   ├── ☕ ManifestoProcessador.java
│   │   │   │   │               │   └── ☕ ManifestoService.java
│   │   │   │   │               ├── 📁 seguranca
│   │   │   │   │               │   ├── ☕ RepasseTokenInterceptor.java
│   │   │   │   │               │   └── ☕ SegurancaConfig.java
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
│   │   │                       ├── 📁 client
│   │   │                       │   └── ☕ OperacionalClientTest.java
│   │   │                       ├── 📁 manifesto
│   │   │                       │   ├── 📁 parser
│   │   │                       │   │   ├── ☕ CsvParserTest.java
│   │   │                       │   │   └── ☕ ExcelParserTest.java
│   │   │                       │   ├── ☕ ManifestoCacheTest.java
│   │   │                       │   ├── ☕ ManifestoControllerTest.java
│   │   │                       │   └── ☕ ManifestoServiceTest.java
│   │   │                       └── 📁 seguranca
│   │   │                           ├── ☕ RepasseTokenInterceptorTest.java
│   │   │                           ├── ☕ SegurancaTest.java
│   │   │                           └── ☕ TokensDeTeste.java
│   │   ├── 🐳 Dockerfile
│   │   └── 📄 build.gradle
│   ├── ⚙️ .dockerignore
│   ├── ⚙️ .gitattributes
│   ├── ⚙️ .gitignore
│   ├── 📄 build.gradle
│   ├── 📄 gradlew
│   ├── 📄 gradlew.bat
│   ├── ⚙️ package-lock.json
│   └── 📄 settings.gradle
├── 📁 database
│   ├── 📁 init
│   │   └── 📄 01-schemas.sql
│   └── 🐳 Dockerfile
├── 📁 docs
│   ├── 📁 documentacao-cliente
│   │   ├── 📝 manual-instalacao.md
│   │   └── 📝 manual-usuario.md
│   ├── 📁 documentacao-produto
│   │   ├── 📕 Backlog.pdf
│   │   ├── 📕 Cenarios_sprint1.pdf
│   │   ├── 📕 DoR_e_DoD_sprint1.pdf
│   │   └──  📝 file_tree.md
│   ├── 📁 sprints
│   │   ├── 📝 sprint-1.md
│   │   ├── 📝 sprint-2.md
│   │   └── 📝 sprint-3.md
├── 📁 e2e
│   └── 📄 permissoes.e2e.test.mjs
├── 📁 frontend
│   ├── 📁 public
│   │   ├── 🖼️ favicon.svg
│   │   ├── 🖼️ login-ilustracao.png
│   │   └── 🖼️ logo.png
│   ├── 📁 src
│   │   ├── 📁 app
│   │   │   ├── 📁 providers
│   │   │   │   └── ⚙️ .gitkeep
│   │   │   ├── 📁 router
│   │   │   │   ├── 📄 AppRouter.tsx
│   │   │   │   ├── 📄 RotaProtegida.tsx
│   │   │   │   ├── 📄 RotaPublica.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 styles
│   │   │   │   └── 🎨 index.css
│   │   │   └── 📄 App.tsx
│   │   ├── 📁 entities
│   │   │   ├── 📁 dashboard-metrics
│   │   │   │   ├── 📁 api
│   │   │   │   │   ├── 📄 dashboardService.test.mjs
│   │   │   │   │   └── 📄 dashboardService.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   └── 📄 types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 motorista
│   │   │   │   ├── 📁 api
│   │   │   │   │   ├── 📄 equipeService.ts
│   │   │   │   │   └── 📄 utilizacaoService.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   └── 📄 types.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 StatusMotoristaBadge.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 relatorio
│   │   │   │   └── 📁 api
│   │   │   │       └── 📄 enviarRelatorio.ts
│   │   │   ├── 📁 sessao
│   │   │   │   ├── 📁 lib
│   │   │   │   │   └── 📄 lerUsuarioDoToken.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   ├── 📄 permissoes.ts
│   │   │   │   │   ├── 📄 sessao.ts
│   │   │   │   │   └── 📄 types.ts
│   │   │   │   └── 📄 index.ts
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
│   │   │   │   ├── 📁 api
│   │   │   │   │   ├── 📄 importarManifesto.test.mjs
│   │   │   │   │   └── 📄 importarManifesto.ts
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 formatarTamanhoArquivo.ts
│   │   │   │   │   └── 📄 validarArquivoRelatorio.ts
│   │   │   │   ├── 📁 test-data
│   │   │   │   │   └── 📄 manifesto-teste.csv
│   │   │   │   └── 📁 ui
│   │   │   │       ├── 📄 BotaoEnviarRelatorio.tsx
│   │   │   │       ├── 📄 MensagemFeedbackUpload.tsx
│   │   │   │       └── 📄 ModalEnviarRelatorio.tsx
│   │   │   ├── 📁 login
│   │   │   │   ├── 📁 api
│   │   │   │   │   └── 📄 autenticar.ts
│   │   │   │   ├── 📁 lib
│   │   │   │   │   └── 📄 validarCredenciais.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 CampoLogin.tsx
│   │   │   │   │   └── 📄 FormularioLogin.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   └── 📁 period-filter
│   │   │       ├── 📁 ui
│   │   │       │   └── 📄 PeriodFilter.tsx
│   │   │       └── 📄 index.ts
│   │   ├── 📁 pages
│   │   │   ├── 📁 Dashboard
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 intervaloDoPeriodo.test.mjs
│   │   │   │   │   └── 📄 intervaloDoPeriodo.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   └── 📄 useDashboard.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 DashboardPage.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 Login
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 LoginPage.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 Motoristas
│   │   │   │   ├── 📁 lib
│   │   │   │   │   └── 📄 intervaloDoPeriodo.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   └── 📄 useMotoristasUtilizacao.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 MotoristasPage.tsx
│   │   │   │   │   └── 📄 UtilizacaoMotoristasPage.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   └── 📁 Viagens
│   │   │       ├── 📁 ui
│   │   │       │   └── 📄 ViagensPage.tsx
│   │   │       └── 📄 index.ts
│   │   ├── 📁 shared
│   │   │   ├── 📁 api
│   │   │   │   ├── ⚙️ .gitkeep
│   │   │   │   ├── 📄 apiFetch.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 tokenSessao.ts
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
│   │   │   │   │   └── 📄 GraficoSemDados.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 dashboard-topbar
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 DashboardTopbar.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 equipe-motoristas
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 EquipeFiltros.tsx
│   │   │   │   │   ├── 📄 EquipeStatCards.tsx
│   │   │   │   │   └── 📄 EquipeTabela.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 motoristas-list
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 MotoristasList.tsx
│   │   │   │   │   └── 📄 MotoristasTopbar.tsx
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
│   │   │       ├── 📁 api
│   │   │       │   └── 📄 filtrarViagens.ts
│   │   │       ├── 📁 model
│   │   │       │   ├── 📄 types.ts
│   │   │       │   └── 📄 useFiltroViagens.ts
│   │   │       ├── 📁 ui
│   │   │       │   ├── 📄 FiltrarViagensButton.tsx
│   │   │       │   ├── 📄 FiltrarViagensModal.tsx
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
├── ⚙️ docker-compose.yml
└── ⚙️ package-lock.json
```
