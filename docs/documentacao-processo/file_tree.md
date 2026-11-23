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
│   │   ├── 📁 .gradle
│   │   │   └── 📁 nb-cache
│   │   │       └── 📄 subprojects.ser
│   │   ├── 📁 src
│   │   │   ├── 📁 main
│   │   │   │   ├── 📁 java
│   │   │   │   │   └── 📁 com
│   │   │   │   │       └── 📁 ominidevs
│   │   │   │   │           └── 📁 autenticacao
│   │   │   │   │               ├── 📁 auth
│   │   │   │   │               │   ├── 📁 configs
│   │   │   │   │               │   │   └── ☕ AuthConfig.java
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
│   │   │   │   │               │   │   ├── ☕ TokenInvalidoException.java
│   │   │   │   │               │   │   └── ☕ UsuarioInativoException.java
│   │   │   │   │               │   ├── 📁 repositories
│   │   │   │   │               │   │   └── ☕ UsuarioRepository.java
│   │   │   │   │               │   └── 📁 services
│   │   │   │   │               │       ├── ☕ AuthService.java
│   │   │   │   │               │       └── ☕ TokenService.java
│   │   │   │   │               ├── 📁 perfil
│   │   │   │   │               │   ├── 📁 controllers
│   │   │   │   │               │   │   └── ☕ PerfilController.java
│   │   │   │   │               │   ├── 📁 dto
│   │   │   │   │               │   │   ├── ☕ AlterarFotoRequest.java
│   │   │   │   │               │   │   ├── ☕ AlterarNomeRequest.java
│   │   │   │   │               │   │   ├── ☕ PerfilAtualizadoResponse.java
│   │   │   │   │               │   │   └── ☕ PerfilResponse.java
│   │   │   │   │               │   ├── 📁 exceptions
│   │   │   │   │               │   │   ├── ☕ PerfilExceptionHandler.java
│   │   │   │   │               │   │   └── ☕ PerfilNaoEncontradoException.java
│   │   │   │   │               │   └── 📁 services
│   │   │   │   │               │       └── ☕ PerfilService.java
│   │   │   │   │               ├── 📁 seguranca
│   │   │   │   │               │   └── ☕ SegurancaConfig.java
│   │   │   │   │               ├── 📁 usuarios
│   │   │   │   │               │   ├── 📁 controllers
│   │   │   │   │               │   │   └── ☕ UsuarioController.java
│   │   │   │   │               │   ├── 📁 dto
│   │   │   │   │               │   │   ├── ☕ AlterarStatusRequest.java
│   │   │   │   │               │   │   ├── ☕ CriarUsuarioRequest.java
│   │   │   │   │               │   │   └── ☕ UsuarioResponse.java
│   │   │   │   │               │   ├── 📁 exceptions
│   │   │   │   │               │   │   ├── ☕ AutoDesativacaoException.java
│   │   │   │   │               │   │   ├── ☕ CamposInvalidosException.java
│   │   │   │   │               │   │   ├── ☕ EmailEmUsoException.java
│   │   │   │   │               │   │   ├── ☕ UsuarioExceptionHandler.java
│   │   │   │   │               │   │   └── ☕ UsuarioNaoEncontradoException.java
│   │   │   │   │               │   └── 📁 services
│   │   │   │   │               │       └── ☕ UsuarioService.java
│   │   │   │   │               └── ☕ AutenticacaoApplication.java
│   │   │   │   └── 📁 resources
│   │   │   │       ├── 📁 db
│   │   │   │       │   └── 📁 migration
│   │   │   │       │       ├── 📄 V1__create_usuario_table.sql
│   │   │   │       │       ├── 📄 V2__insert_usuarios_iniciais.sql
│   │   │   │       │       ├── 📄 V3__update_usuario_nome_e_ativo.sql
│   │   │   │       │       └── 📄 V4__add_usuario_foto.sql
│   │   │   │       └── ⚙️ application.yml
│   │   │   └── 📁 test
│   │   │       └── 📁 java
│   │   │           └── 📁 com
│   │   │               └── 📁 ominidevs
│   │   │                   └── 📁 autenticacao
│   │   │                       ├── 📁 auth
│   │   │                       │   ├── 📁 controllers
│   │   │                       │   │   └── ☕ AuthControllerTest.java
│   │   │                       │   └── 📁 services
│   │   │                       │       └── ☕ TokenServiceTest.java
│   │   │                       ├── 📁 perfil
│   │   │                       │   ├── 📁 controllers
│   │   │                       │   │   └── ☕ PerfilControllerTest.java
│   │   │                       │   └── 📁 services
│   │   │                       │       └── ☕ PerfilServiceTest.java
│   │   │                       └── 📁 usuarios
│   │   │                           ├── 📁 controllers
│   │   │                           │   └── ☕ UsuarioControllerTest.java
│   │   │                           └── 📁 services
│   │   │                               ├── ☕ UsuarioServiceIntegrationTest.java
│   │   │                               └── ☕ UsuarioServiceTest.java
│   │   ├── 🐳 Dockerfile
│   │   └── 📄 build.gradle
│   ├── 📁 gradle
│   │   └── 📁 wrapper
│   │       ├── 📄 gradle-wrapper.jar
│   │       └── 📄 gradle-wrapper.properties
│   ├── 📁 operacional-service
│   │   ├── 📁 src
│   │   │   └── 📁 main
│   │   │       ├── 📁 java
│   │   │       │   └── 📁 com
│   │   │       │       └── 📁 ominidevs
│   │   │       │           └── 📁 operacional
│   │   │       │               ├── 📁 dashboard
│   │   │       │               │   ├── 📁 controllers
│   │   │       │               │   │   └── ☕ DashboardController.java
│   │   │       │               │   ├── 📁 dto
│   │   │       │               │   │   ├── ☕ DashboardResponse.java
│   │   │       │               │   │   ├── ☕ DestinoMaisRentavelResponse.java
│   │   │       │               │   │   ├── ☕ MetricasDashboardResponse.java
│   │   │       │               │   │   ├── ☕ PagamentoMotoristaResponse.java
│   │   │       │               │   │   ├── ☕ PontoRentabilidadeResponse.java
│   │   │       │               │   │   ├── ☕ PontoSerieResponse.java
│   │   │       │               │   │   ├── ☕ RentabilidadePorTipoResponse.java
│   │   │       │               │   │   ├── ☕ SerieRentabilidadeResponse.java
│   │   │       │               │   │   ├── ☕ SeriesDashboardResponse.java
│   │   │       │               │   │   └── ☕ ViagensPorStatusResponse.java
│   │   │       │               │   ├── 📁 exceptions
│   │   │       │               │   │   └── ☕ DashboardExceptionHandler.java
│   │   │       │               │   ├── 📁 model
│   │   │       │               │   │   └── ☕ AgrupamentoSerie.java
│   │   │       │               │   ├── 📁 projections
│   │   │       │               │   │   ├── ☕ ComponentesPagamentoMotorista.java
│   │   │       │               │   │   ├── ☕ DestinoRentavel.java
│   │   │       │               │   │   ├── ☕ PontoRentabilidade.java
│   │   │       │               │   │   ├── ☕ PontoSerie.java
│   │   │       │               │   │   ├── ☕ RentabilidadeTipoVeiculo.java
│   │   │       │               │   │   ├── ☕ ResumoViagens.java
│   │   │       │               │   │   └── ☕ ValoresFinanceirosViagem.java
│   │   │       │               │   ├── 📁 repositories
│   │   │       │               │   │   └── ☕ DashboardRepository.java
│   │   │       │               │   └── 📁 services
│   │   │       │               │       ├── ☕ CalculadoraPagamentoMotorista.java
│   │   │       │               │       └── ☕ DashboardService.java
│   │   │       │               ├── 📁 importacao
│   │   │       │               │   ├── 📁 controllers
│   │   │       │               │   │   └── ☕ ImportacaoController.java
│   │   │       │               │   ├── 📁 dto
│   │   │       │               │   │   ├── ☕ FiltroImportacao.java
│   │   │       │               │   │   ├── ☕ ImportacaoHistoricoResponse.java
│   │   │       │               │   │   └── ☕ ResumoImportacao.java
│   │   │       │               │   ├── 📁 entities
│   │   │       │               │   │   ├── ☕ ImportacaoHistorico.java
│   │   │       │               │   │   ├── ☕ StatusImportacao.java
│   │   │       │               │   │   └── ☕ TipoImportacao.java
│   │   │       │               │   ├── 📁 repositories
│   │   │       │               │   │   └── ☕ ImportacaoHistoricoRepository.java
│   │   │       │               │   └── 📁 services
│   │   │       │               │       └── ☕ ImportacaoHistoricoService.java
│   │   │       │               ├── 📁 indicadores
│   │   │       │               │   ├── 📁 controllers
│   │   │       │               │   │   └── ☕ UtilizacaoController.java
│   │   │       │               │   ├── 📁 dto
│   │   │       │               │   │   ├── ☕ UtilizacaoMotoristaResponse.java
│   │   │       │               │   │   └── ☕ UtilizacaoPeriodoResponse.java
│   │   │       │               │   ├── 📁 exceptions
│   │   │       │               │   │   ├── ☕ IndicadorExceptionHandler.java
│   │   │       │               │   │   └── ☕ IndicadorInvalidoException.java
│   │   │       │               │   ├── 📁 model
│   │   │       │               │   │   ├── ☕ OrdenacaoUtilizacao.java
│   │   │       │               │   │   ├── ☕ PeriodoConsulta.java
│   │   │       │               │   │   └── ☕ Porcentagem.java
│   │   │       │               │   ├── 📁 projections
│   │   │       │               │   │   └── ☕ MotoristaQuantidadeViagens.java
│   │   │       │               │   ├── 📁 repositories
│   │   │       │               │   │   └── ☕ UtilizacaoRepository.java
│   │   │       │               │   └── 📁 services
│   │   │       │               │       └── ☕ UtilizacaoService.java
│   │   │       │               ├── 📁 motorista
│   │   │       │               │   ├── 📁 controllers
│   │   │       │               │   │   └── ☕ MotoristaController.java
│   │   │       │               │   ├── 📁 dto
│   │   │       │               │   │   ├── ☕ FiltroRankingMotorista.java
│   │   │       │               │   │   ├── ☕ MotoristaResponseDTO.java
│   │   │       │               │   │   ├── ☕ MotoristaResumoResponse.java
│   │   │       │               │   │   ├── ☕ PaginaHistoricoViagensResponse.java
│   │   │       │               │   │   ├── ☕ RankingMotoristaResponse.java
│   │   │       │               │   │   ├── ☕ RankingMotoristasResultado.java
│   │   │       │               │   │   ├── ☕ StatusMotoristaRequest.java
│   │   │       │               │   │   └── ☕ ViagemHistoricoResponse.java
│   │   │       │               │   ├── 📁 entities
│   │   │       │               │   │   ├── ⚙️ .gitkeep
│   │   │       │               │   │   ├── ☕ Motorista.java
│   │   │       │               │   │   └── ☕ StatusMotorista.java
│   │   │       │               │   ├── 📁 exceptions
│   │   │       │               │   │   ├── ☕ MotoristaExceptionHandler.java
│   │   │       │               │   │   ├── ☕ MotoristaNaoEncontradoException.java
│   │   │       │               │   │   ├── ☕ PaginacaoInvalidaException.java
│   │   │       │               │   │   └── ☕ StatusInvalidoException.java
│   │   │       │               │   ├── 📁 model
│   │   │       │               │   │   ├── ☕ NomeMotorista.java
│   │   │       │               │   │   └── ☕ StatusHistoricoViagem.java
│   │   │       │               │   ├── 📁 projections
│   │   │       │               │   │   ├── ☕ MotoristaListagem.java
│   │   │       │               │   │   ├── ☕ MotoristaStatusContagem.java
│   │   │       │               │   │   ├── ☕ RankingMotoristaLinha.java
│   │   │       │               │   │   └── ☕ ViagemHistoricoLinha.java
│   │   │       │               │   ├── 📁 repositories
│   │   │       │               │   │   ├── ⚙️ .gitkeep
│   │   │       │               │   │   ├── ☕ HistoricoViagemConsultaRepository.java
│   │   │       │               │   │   ├── ☕ MotoristaConsultaRepository.java
│   │   │       │               │   │   ├── ☕ MotoristaRepository.java
│   │   │       │               │   │   └── ☕ RankingMotoristaConsultaRepository.java
│   │   │       │               │   └── 📁 services
│   │   │       │               │       ├── ⚙️ .gitkeep
│   │   │       │               │       ├── ☕ HistoricoViagemService.java
│   │   │       │               │       ├── ☕ MotoristaService.java
│   │   │       │               │       └── ☕ RankingMotoristaService.java
│   │   │       │               ├── 📁 seguranca
│   │   │       │               │   ├── ☕ RepasseTokenInterceptor.java
│   │   │       │               │   └── ☕ SegurancaConfig.java
│   │   │       │               ├── 📁 veiculo
│   │   │       │               │   ├── 📁 controllers
│   │   │       │               │   │   ├── ⚙️ .gitkeep
│   │   │       │               │   │   └── ☕ VeiculoController.java
│   │   │       │               │   ├── 📁 dto
│   │   │       │               │   │   ├── ☕ FiltroVeiculo.java
│   │   │       │               │   │   ├── ☕ ImportacaoVeiculoResponse.java
│   │   │       │               │   │   ├── ☕ OcorrenciaLinhaVeiculo.java
│   │   │       │               │   │   ├── ☕ PaginaResponse.java
│   │   │       │               │   │   ├── ☕ ResumoFrotaResponse.java
│   │   │       │               │   │   ├── ☕ VeiculoFrotaResponse.java
│   │   │       │               │   │   ├── ☕ VeiculoResponse.java
│   │   │       │               │   │   └── ☕ VeiculoResumoResponse.java
│   │   │       │               │   ├── 📁 entities
│   │   │       │               │   │   ├── ⚙️ .gitkeep
│   │   │       │               │   │   ├── ☕ DadosAdicionaisConverter.java
│   │   │       │               │   │   └── ☕ Veiculo.java
│   │   │       │               │   ├── 📁 exceptions
│   │   │       │               │   │   ├── ☕ ArquivoVeiculoInvalidoException.java
│   │   │       │               │   │   ├── ☕ ParametroFrotaInvalidoException.java
│   │   │       │               │   │   ├── ☕ VeiculoExceptionHandler.java
│   │   │       │               │   │   └── ☕ VeiculoNaoEncontradoException.java
│   │   │       │               │   ├── 📁 model
│   │   │       │               │   │   ├── ☕ LinhaCsvVeiculo.java
│   │   │       │               │   │   ├── ☕ Placa.java
│   │   │       │               │   │   └── ☕ PlanilhaVeiculos.java
│   │   │       │               │   ├── 📁 projections
│   │   │       │               │   │   ├── ☕ LinhaResumoFrota.java
│   │   │       │               │   │   └── ☕ VeiculoDoMotorista.java
│   │   │       │               │   ├── 📁 repositories
│   │   │       │               │   │   ├── ⚙️ .gitkeep
│   │   │       │               │   │   ├── ☕ ResumoFrotaRepository.java
│   │   │       │               │   │   └── ☕ VeiculoRepository.java
│   │   │       │               │   ├── 📁 services
│   │   │       │               │   │   ├── ⚙️ .gitkeep
│   │   │       │               │   │   ├── ☕ FrotaService.java
│   │   │       │               │   │   ├── ☕ ImportacaoVeiculoService.java
│   │   │       │               │   │   ├── ☕ LeitorCsvVeiculo.java
│   │   │       │               │   │   └── ☕ VeiculoConsultaService.java
│   │   │       │               │   └── 📁 specifications
│   │   │       │               │       └── ☕ VeiculoSpecifications.java
│   │   │       │               ├── 📁 viagem
│   │   │       │               │   ├── 📁 clients
│   │   │       │               │   │   ├── ☕ ManifestoClient.java
│   │   │       │               │   │   └── ☕ ManifestoClientImpl.java
│   │   │       │               │   ├── 📁 configs
│   │   │       │               │   │   └── ☕ RestClientConfig.java
│   │   │       │               │   ├── 📁 controllers
│   │   │       │               │   │   └── ☕ ViagemController.java
│   │   │       │               │   ├── 📁 dto
│   │   │       │               │   │   ├── ☕ DataMaisRecenteResponse.java
│   │   │       │               │   │   ├── ☕ ErroLinhaImportacao.java
│   │   │       │               │   │   ├── ☕ ImportacaoManifestoResponse.java
│   │   │       │               │   │   ├── ☕ ManifestoDTO.java
│   │   │       │               │   │   ├── ☕ RankingDestinoResponse.java
│   │   │       │               │   │   ├── ☕ RentabilidadeMotoristaResponse.java
│   │   │       │               │   │   ├── ☕ RentabilidadeViagemResponse.java
│   │   │       │               │   │   └── ☕ ViagemResponseDTO.java
│   │   │       │               │   ├── 📁 entities
│   │   │       │               │   │   ├── ☕ StatusViagem.java
│   │   │       │               │   │   └── ☕ Viagem.java
│   │   │       │               │   ├── 📁 exceptions
│   │   │       │               │   │   ├── ☕ FileUploadException.java
│   │   │       │               │   │   ├── ☕ FiltroInvalidoException.java
│   │   │       │               │   │   ├── ☕ IntegracaoManifestoException.java
│   │   │       │               │   │   └── ☕ ViagemExceptionHandler.java
│   │   │       │               │   ├── 📁 mappers
│   │   │       │               │   │   └── ☕ ManifestoMapper.java
│   │   │       │               │   ├── 📁 repositories
│   │   │       │               │   │   ├── ☕ RankingDestinoRepository.java
│   │   │       │               │   │   ├── ☕ RankingDestinoRepositoryImpl.java
│   │   │       │               │   │   └── ☕ ViagemRepository.java
│   │   │       │               │   ├── 📁 services
│   │   │       │               │   │   ├── ☕ RentabilidadeService.java
│   │   │       │               │   │   └── ☕ ViagemService.java
│   │   │       │               │   └── 📁 specifications
│   │   │       │               │       └── ☕ ViagemSpecifications.java
│   │   │       │               └── ☕ OperacionalApplication.java
│   │   │       ├── 📁 resources
│   │   │       │   ├── 📁 db
│   │   │       │   │   └── 📁 migration
│   │   │       │   │       ├── 📄 V10__update_veiculo_importacao.sql
│   │   │       │   │       ├── 📄 V11__update_veiculo_marca_modelo.sql
│   │   │       │   │       ├── 📄 V12__create_index_viagem_historico_motorista.sql
│   │   │       │   │       ├── 📄 V13__update_veiculo_painel_frota.sql
│   │   │       │   │       ├── 📄 V14__create_importacao_historico.sql
│   │   │       │   │       ├── 📄 V1__create_motorista_table.sql
│   │   │       │   │       ├── 📄 V2__create_veiculo_table.sql
│   │   │       │   │       ├── 📄 V3__create_viagem_table.sql
│   │   │       │   │       ├── 📄 V4__update_viagem_table.sql
│   │   │       │   │       ├── 📄 V5__update_adiciona_dados_exibicao_viagem.sql
│   │   │       │   │       ├── 📄 V6__update_motorista_status_disponibilidade.sql
│   │   │       │   │       ├── 📄 V7__update_viagem_dados_veiculo_previsao.sql
│   │   │       │   │       ├── 📄 V8__add_viagem_financial_values.sql
│   │   │       │   │       └── 📄 V9__add_viagem_vale_frete.sql
│   │   │       │   └── ⚙️ application.yml
│   │   │       └── 📁 test
│   │   │           └── 📁 java
│   │   │               └── 📁 com
│   │   │                   └── 📁 ominidevs
│   │   │                       └── 📁 operacional
│   │   │                           ├── 📁 dashboard
│   │   │                           │   ├── 📁 controllers
│   │   │                           │   │   └── ☕ DashboardControllerTest.java
│   │   │                           │   ├── 📁 model
│   │   │                           │   │   └── ☕ AgrupamentoSerieTest.java
│   │   │                           │   ├── 📁 repositories
│   │   │                           │   │   ├── ☕ DashboardRepositoryTest.java
│   │   │                           │   │   └── ☕ RentabilidadePorTipoRepositoryTest.java
│   │   │                           │   └── 📁 services
│   │   │                           │       ├── ☕ CalculadoraPagamentoMotoristaTest.java
│   │   │                           │       └── ☕ DashboardServiceTest.java
│   │   │                           ├── 📁 importacao
│   │   │                           │   ├── 📁 controllers
│   │   │                           │   │   └── ☕ ImportacaoControllerTest.java
│   │   │                           │   └── 📁 services
│   │   │                           │       ├── ☕ ImportacaoHistoricoListaTest.java
│   │   │                           │       └── ☕ ImportacaoHistoricoServiceTest.java
│   │   │                           ├── 📁 indicadores
│   │   │                           │   ├── 📁 controllers
│   │   │                           │   │   └── ☕ UtilizacaoControllerTest.java
│   │   │                           │   ├── 📁 model
│   │   │                           │   │   └── ☕ PeriodoConsultaTest.java
│   │   │                           │   ├── 📁 repositories
│   │   │                           │   │   └── ☕ UtilizacaoRepositoryTest.java
│   │   │                           │   └── 📁 services
│   │   │                           │       └── ☕ UtilizacaoServiceTest.java
│   │   │                           ├── 📁 motorista
│   │   │                           │   ├── 📁 controllers
│   │   │                           │   │   └── ☕ MotoristaControllerTest.java
│   │   │                           │   ├── 📁 repositories
│   │   │                           │   │   ├── ☕ HistoricoViagemConsultaRepositoryTest.java
│   │   │                           │   │   └── ☕ RankingMotoristaConsultaRepositoryTest.java
│   │   │                           │   └── 📁 services
│   │   │                           │       ├── ☕ HistoricoViagemServiceTest.java
│   │   │                           │       ├── ☕ MotoristaServiceTest.java
│   │   │                           │       └── ☕ RankingMotoristaServiceTest.java
│   │   │                           ├── 📁 seguranca
│   │   │                           │   ├── ☕ RepasseTokenInterceptorTest.java
│   │   │                           │   ├── ☕ SegurancaTest.java
│   │   │                           │   └── ☕ TokensDeTeste.java
│   │   │                           ├── 📁 veiculo
│   │   │                           │   ├── 📁 controllers
│   │   │                           │   │   └── ☕ VeiculoControllerTest.java
│   │   │                           │   ├── 📁 repositories
│   │   │                           │   │   └── ☕ MigrationDeduplicacaoPlacaTest.java
│   │   │                           │   └── 📁 services
│   │   │                           │       ├── ☕ FrotaIntegrationTest.java
│   │   │                           │       ├── ☕ ImportacaoVeiculoIntegrationTest.java
│   │   │                           │       └── ☕ LeitorCsvVeiculoTest.java
│   │   │                           └── 📁 viagem
│   │   │                               ├── 📁 clients
│   │   │                               │   └── ☕ ManifestoClientImplTest.java
│   │   │                               ├── 📁 controllers
│   │   │                               │   ├── ☕ ImportacaoManifestoControllerTest.java
│   │   │                               │   ├── ☕ RankingDestinosControllerTest.java
│   │   │                               │   ├── ☕ RentabilidadeMotoristaControllerTest.java
│   │   │                               │   └── ☕ ViagemControllerTest.java
│   │   │                               ├── 📁 mappers
│   │   │                               │   └── ☕ ManifestoMapperTest.java
│   │   │                               ├── 📁 repositories
│   │   │                               │   ├── ☕ RankingDestinosIntegrationTest.java
│   │   │                               │   └── ☕ ViagemFiltrosIntegrationTest.java
│   │   │                               └── 📁 services
│   │   │                                   ├── ☕ ImportacaoManifestoTest.java
│   │   │                                   ├── ☕ RankingDestinosServiceTest.java
│   │   │                                   ├── ☕ RentabilidadeServiceTest.java
│   │   │                                   └── ☕ ViagemServiceTest.java
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
│   ├── 📁 documentacao-processo
│   │   ├── 📕 Backlog.pdf
│   │   ├── 📕 Cenarios_sprint1.pdf
│   │   ├── 📕 DoR_e_DoD_sprint1.pdf
│   │   └── 📝 file_tree.md
│   ├── 📁 documentacao-produto
│   │   ├── 📝 manual-instacação.md
│   │   ├── 📕 manual-instalacao.pdf
│   │   ├── 📝 manual-usuario.md
│   │   └── 📕 manual-usuario.pdf
│   └── 📁 sprints
│       ├── 📝 documentacao-produto-sprint1.md
│       ├── 📕 documentacao-produto-sprint1.pdf
│       ├── 📝 documentacao-produto-sprint2.md
│       ├── 📕 documentacao-produto-sprint2.pdf
│       └── 📝 documentacao-produto-sprint3.md
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
│   │   │   ├── 📁 conta
│   │   │   │   ├── 📁 api
│   │   │   │   │   ├── 📄 contaService.test.mjs
│   │   │   │   │   └── 📄 contaService.ts
│   │   │   │   ├── 📁 lib
│   │   │   │   │   └── 📄 iniciaisDoNome.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   ├── 📄 contaAtual.ts
│   │   │   │   │   └── 📄 types.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 AvatarConta.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 dashboard-metrics
│   │   │   │   ├── 📁 api
│   │   │   │   │   ├── 📄 dashboardService.test.mjs
│   │   │   │   │   └── 📄 dashboardService.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   └── 📄 types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 importacao
│   │   │   │   ├── 📁 api
│   │   │   │   │   ├── 📄 importacaoService.test.mjs
│   │   │   │   │   └── 📄 importacaoService.ts
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 avisoImportacaoConcluida.test.mjs
│   │   │   │   │   └── 📄 avisoImportacaoConcluida.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   └── 📄 types.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 StatusImportacaoBadge.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 motorista
│   │   │   │   ├── 📁 api
│   │   │   │   │   ├── 📄 alertaUtilizacaoService.test.mjs
│   │   │   │   │   ├── 📄 alertaUtilizacaoService.ts
│   │   │   │   │   ├── 📄 equipeService.test.mjs
│   │   │   │   │   ├── 📄 equipeService.ts
│   │   │   │   │   ├── 📄 motoristaListaService.ts
│   │   │   │   │   ├── 📄 motoristaResumoService.test.mjs
│   │   │   │   │   ├── 📄 motoristaResumoService.ts
│   │   │   │   │   ├── 📄 pagamentoMotoristasService.test.mjs
│   │   │   │   │   ├── 📄 pagamentoMotoristasService.ts
│   │   │   │   │   ├── 📄 periodoEquipe.ts
│   │   │   │   │   ├── 📄 rankingMotoristasMock.ts
│   │   │   │   │   ├── 📄 rankingMotoristasService.test.mjs
│   │   │   │   │   ├── 📄 rankingMotoristasService.ts
│   │   │   │   │   ├── 📄 rentabilidadeMotoristasService.ts
│   │   │   │   │   ├── 📄 statusMotoristaService.test.mjs
│   │   │   │   │   ├── 📄 statusMotoristaService.ts
│   │   │   │   │   └── 📄 utilizacaoService.ts
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 faturamentoMotorista.test.mjs
│   │   │   │   │   ├── 📄 faturamentoMotorista.ts
│   │   │   │   │   └── 📄 parametrosDoPeriodo.ts
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
│   │   │   │   │   ├── 📄 permissoes.test.mjs
│   │   │   │   │   ├── 📄 permissoes.ts
│   │   │   │   │   ├── 📄 sessao.ts
│   │   │   │   │   └── 📄 types.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 ValorMonetario.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 usuario
│   │   │   │   ├── 📁 api
│   │   │   │   │   ├── 📄 usuarioService.test.mjs
│   │   │   │   │   └── 📄 usuarioService.ts
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 avisoUsuarioCadastrado.ts
│   │   │   │   │   ├── 📄 formatarDataCriacao.ts
│   │   │   │   │   ├── 📄 resumoUsuarios.test.mjs
│   │   │   │   │   └── 📄 resumoUsuarios.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   └── 📄 types.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 PerfilBadge.tsx
│   │   │   │   │   └── 📄 StatusUsuarioBadge.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 veiculo
│   │   │   │   ├── 📁 api
│   │   │   │   │   ├── 📄 frotaService.test.mjs
│   │   │   │   │   ├── 📄 frotaService.ts
│   │   │   │   │   ├── 📄 veiculoService.test.mjs
│   │   │   │   │   └── 📄 veiculoService.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   └── 📄 types.ts
│   │   │   │   └── 📄 index.ts
│   │   │   └── 📁 viagem
│   │   │       ├── 📁 api
│   │   │       │   ├── 📄 historicoViagensService.test.mjs
│   │   │       │   ├── 📄 historicoViagensService.ts
│   │   │       │   ├── 📄 viagemService.test.mjs
│   │   │       │   └── 📄 viagemService.ts
│   │   │       ├── 📁 model
│   │   │       │   └── 📄 types.ts
│   │   │       ├── 📁 ui
│   │   │       │   ├── 📄 StatusHistoricoBadge.tsx
│   │   │       │   ├── 📄 StatusViagemBadge.tsx
│   │   │       │   ├── 📄 ViagemCard.tsx
│   │   │       │   ├── 📄 ViagemHistoricoCard.tsx
│   │   │       │   └── 📄 ViagemRankingItem.tsx
│   │   │       └── 📄 index.ts
│   │   ├── 📁 features
│   │   │   ├── 📁 alterar-status-usuario
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 ToggleStatusUsuario.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 cadastrar-usuario
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 validarFormularioUsuario.test.mjs
│   │   │   │   │   └── 📄 validarFormularioUsuario.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 CampoFormulario.tsx
│   │   │   │   │   ├── 📄 CampoSenha.tsx
│   │   │   │   │   ├── 📄 ModalCadastroUsuario.tsx
│   │   │   │   │   └── 📄 SeletorPerfil.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 enviar-relatorio
│   │   │   │   ├── 📁 api
│   │   │   │   │   ├── 📄 importarManifesto.test.mjs
│   │   │   │   │   └── 📄 importarManifesto.ts
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 resumoImportacaoManifesto.test.mjs
│   │   │   │   │   ├── 📄 resumoImportacaoManifesto.ts
│   │   │   │   │   └── 📄 validarArquivoRelatorio.ts
│   │   │   │   ├── 📁 test-data
│   │   │   │   │   └── 📄 manifesto-teste.csv
│   │   │   │   └── 📁 ui
│   │   │   │       └── 📄 ModalEnviarRelatorio.tsx
│   │   │   ├── 📁 historico-viagens
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 mesclarViagens.test.mjs
│   │   │   │   │   └── 📄 mesclarViagens.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   └── 📄 useHistoricoViagens.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 ModalHistoricoViagens.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 importar-dados
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 validarPlanilhaDoTipo.test.mjs
│   │   │   │   │   └── 📄 validarPlanilhaDoTipo.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 BotaoUpload.tsx
│   │   │   │   │   ├── 📄 ModalImportarDados.tsx
│   │   │   │   │   └── 📄 SeletorTipoPlanilha.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 importar-veiculos
│   │   │   │   ├── 📁 api
│   │   │   │   │   ├── 📄 importarVeiculos.test.mjs
│   │   │   │   │   └── 📄 importarVeiculos.ts
│   │   │   │   ├── 📁 lib
│   │   │   │   │   └── 📄 validarArquivoVeiculos.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 BotaoImportarVeiculos.tsx
│   │   │   │   │   └── 📄 ModalImportarVeiculos.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 login
│   │   │   │   ├── 📁 api
│   │   │   │   │   └── 📄 autenticar.ts
│   │   │   │   ├── 📁 lib
│   │   │   │   │   └── 📄 validarCredenciais.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 CampoLogin.tsx
│   │   │   │   │   └── 📄 FormularioLogin.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 menu-perfil
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 foto.test.mjs
│   │   │   │   │   └── 📄 foto.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 MenuPerfil.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 notificacoes
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 mensagemAlerta.test.mjs
│   │   │   │   │   ├── 📄 mensagemAlerta.ts
│   │   │   │   │   ├── 📄 montarNotificacoes.test.mjs
│   │   │   │   │   ├── 📄 montarNotificacoes.ts
│   │   │   │   │   ├── 📄 notificacoesDispensadas.test.mjs
│   │   │   │   │   └── 📄 notificacoesDispensadas.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   ├── 📄 types.ts
│   │   │   │   │   └── 📄 useNotificacoes.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 SinoNotificacoes.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   └── 📁 period-filter
│   │   │       ├── 📁 lib
│   │   │       │   ├── 📄 filtroSalvo.test.mjs
│   │   │       │   ├── 📄 filtroSalvo.ts
│   │   │       │   ├── 📄 intervaloDoPeriodo.test.mjs
│   │   │       │   └── 📄 intervaloDoPeriodo.ts
│   │   │       ├── 📁 model
│   │   │       │   └── 📄 usePeriodoSalvo.ts
│   │   │       ├── 📁 ui
│   │   │       │   ├── 📄 NavegacaoPeriodo.tsx
│   │   │       │   ├── 📄 PeriodFilter.tsx
│   │   │       │   └── 📄 SeletorPeriodo.tsx
│   │   │       └── 📄 index.ts
│   │   ├── 📁 pages
│   │   │   ├── 📁 Administracao
│   │   │   │   ├── 📁 config
│   │   │   │   │   └── 📄 secoes.ts
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 secoesDoPerfil.test.mjs
│   │   │   │   │   └── 📄 secoesDoPerfil.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   └── 📄 types.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 AdministracaoPage.tsx
│   │   │   │   │   └── 📄 NavegacaoSecoes.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 Dashboard
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 intervaloDoPeriodo.ts
│   │   │   │   │   ├── 📄 mesDaReferencia.test.mjs
│   │   │   │   │   └── 📄 mesDaReferencia.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   ├── 📄 useDashboard.ts
│   │   │   │   │   ├── 📄 useFrota.ts
│   │   │   │   │   ├── 📄 useRentabilidadePorTipo.ts
│   │   │   │   │   ├── 📄 useResumoFrota.ts
│   │   │   │   │   └── 📄 useValorAdiado.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 DashboardPage.tsx
│   │   │   │   │   └── 📄 PainelVeiculos.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 Login
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 LoginPage.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 Motoristas
│   │   │   │   ├── 📁 lib
│   │   │   │   │   └── 📄 intervaloDoPeriodo.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   ├── 📄 useEquipeMotoristas.ts
│   │   │   │   │   ├── 📄 useMotoristasUtilizacao.ts
│   │   │   │   │   └── 📄 useRentabilidadeMotoristas.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 MotoristasPage.tsx
│   │   │   │   │   └── 📄 UtilizacaoMotoristasPage.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 Ranking
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 distribuirRanking.test.mjs
│   │   │   │   │   └── 📄 distribuirRanking.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   ├── 📄 usePagamentoMotoristas.ts
│   │   │   │   │   └── 📄 useRankingMotoristas.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 FiltroRanking.tsx
│   │   │   │   │   └── 📄 RankingPage.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 Registros
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 filtrarPorArquivo.test.mjs
│   │   │   │   │   ├── 📄 filtrarPorArquivo.ts
│   │   │   │   │   ├── 📄 formatarRegistro.test.mjs
│   │   │   │   │   ├── 📄 formatarRegistro.ts
│   │   │   │   │   ├── 📄 juntarImportacoes.test.mjs
│   │   │   │   │   └── 📄 juntarImportacoes.ts
│   │   │   │   ├── 📁 model
│   │   │   │   │   └── 📄 useImportacoes.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 CardUltimaImportacao.tsx
│   │   │   │   │   ├── 📄 FiltrosImportacoes.tsx
│   │   │   │   │   ├── 📄 RegistrosPage.tsx
│   │   │   │   │   └── 📄 TabelaImportacoes.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   └── 📁 Viagens
│   │   │       ├── 📁 lib
│   │   │       │   ├── 📄 viagensNoPeriodo.test.mjs
│   │   │       │   └── 📄 viagensNoPeriodo.ts
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
│   │   │   │   ├── 📄 format.test.mjs
│   │   │   │   ├── 📄 format.ts
│   │   │   │   ├── 📄 formatarTamanhoArquivo.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 paginacao.test.mjs
│   │   │   │   ├── 📄 paginacao.ts
│   │   │   │   ├── 📄 planilha.test.mjs
│   │   │   │   ├── 📄 planilha.ts
│   │   │   │   └── 📄 tema.ts
│   │   │   ├── 📁 types
│   │   │   │   └── ⚙️ .gitkeep
│   │   │   └── 📁 ui
│   │   │       ├── 📁 ChartCard
│   │   │       │   └── 📄 ChartCard.tsx
│   │   │       ├── 📁 MensagemFeedbackUpload
│   │   │       │   └── 📄 MensagemFeedbackUpload.tsx
│   │   │       ├── 📁 ModalImportacao
│   │   │       │   └── 📄 ModalImportacao.tsx
│   │   │       ├── 📁 PageHeader
│   │   │       │   └── 📄 PageHeader.tsx
│   │   │       ├── 📁 Paginacao
│   │   │       │   └── 📄 Paginacao.tsx
│   │   │       ├── 📁 ResumoImportacao
│   │   │       │   └── 📄 ResumoImportacao.tsx
│   │   │       ├── 📁 StatCard
│   │   │       │   └── 📄 StatCard.tsx
│   │   │       └── 📄 index.ts
│   │   ├── 📁 widgets
│   │   │   ├── 📁 dashboard-overview
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 eixoDoGrafico.test.mjs
│   │   │   │   │   ├── 📄 eixoDoGrafico.ts
│   │   │   │   │   ├── 📄 rentabilidadePorTipo.test.mjs
│   │   │   │   │   └── 📄 rentabilidadePorTipo.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 CardRentabilidadePorTipo.tsx
│   │   │   │   │   ├── 📄 DashboardOverview.tsx
│   │   │   │   │   ├── 📄 GraficoRentabilidadePorTipo.tsx
│   │   │   │   │   ├── 📄 GraficoRentabilidadeViagens.tsx
│   │   │   │   │   └── 📄 GraficoSemDados.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 dashboard-topbar
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 DashboardTopbar.tsx
│   │   │   │   │   └── 📄 GuiasDashboard.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 equipe-motoristas
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 EquipeFiltros.tsx
│   │   │   │   │   ├── 📄 EquipeStatCards.tsx
│   │   │   │   │   └── 📄 EquipeTabela.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 frota-overview
│   │   │   │   ├── 📁 lib
│   │   │   │   │   ├── 📄 frota.test.mjs
│   │   │   │   │   └── 📄 frota.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 FrotaOverview.tsx
│   │   │   │   │   ├── 📄 FrotaTabela.tsx
│   │   │   │   │   ├── 📄 GraficoCombustivel.tsx
│   │   │   │   │   └── 📄 GraficoQuantidades.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 gerenciamento-usuarios
│   │   │   │   ├── 📁 model
│   │   │   │   │   └── 📄 useUsuarios.ts
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 SecaoUsuarios.tsx
│   │   │   │   │   ├── 📄 UsuariosKpis.tsx
│   │   │   │   │   └── 📄 UsuariosTabela.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 motoristas-list
│   │   │   │   ├── 📁 ui
│   │   │   │   │   ├── 📄 MotoristasList.tsx
│   │   │   │   │   └── 📄 MotoristasTopbar.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 ranking-list
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 RankingList.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 ranking-podium
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 RankingPodium.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 ranking-topbar
│   │   │   │   ├── 📁 ui
│   │   │   │   │   └── 📄 RankingTopbar.tsx
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
│   │   │   │   ├── 📁 model
│   │   │   │   │   └── 📄 useRankingDestinos.ts
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
