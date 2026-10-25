<h1 align="center"> Documentação do Produto da Sprint 2 </h1>

<div align="center">
    <img src="https://i.imgur.com/VbBN3Tk.jpeg" width="170x" height="170x" style="border-radius:20%;">
</div>

<p align="center">|
  <a href="#visao-geral"> Visão Geral </a> |
  <a href="#sprint-2-meta"> Metas </a> |
  <a href="#backlog-sprint-2"> Backlog </a> |
  <a href="#dor-dod"> DoR e DoD </a> |
  <a href="#desenvolvimento"> Desenvolvimento </a> |
  <a href="#retrospectiva"> Retrospectiva </a> |
  <a href="#documentos"> Documentos </a> |
  <a href="#link-do-video"> Vídeo </a> |
  <a href="#equipe"> Equipe </a> |
</p>

## Visão geral <a id="visao-geral"></a>

A Sprint 2 concentrou-se na estruturação do núcleo financeiro, segurança e alertas operacionais da plataforma: apuração de rentabilidade das viagens via importação de manifesto, média de rentabilidade por motorista, painel de motoristas disponíveis, ranking de destinos com maior retorno financeiro, alertas de baixa utilização (ociosidade), login seguro com JWT (perfis Operador e Gestor) e consolidação do dashboard com dados reais.

## 📅 Cronograma da Sprint

|    Período    |    Status    |
| :-----------: | :----------: |
| 05/10 - 25/10 | 🟢 Encerrada |

## 🎯 Metas da Sprint 2 <a id="sprint-2-meta"></a>

| Foco | User Story Meta                                                                                                       |
| :--: | :-------------------------------------------------------------------------------------------------------------------- |
|  🥇  | **US08:** Como gestor, quero registrar frete e custos de cada viagem, para calcular a rentabilidade.                  |
|  🥈  | **US09:** Como gestor, quero visualizar a rentabilidade média por viagem de cada motorista, para comparar desempenho. |

## 📋 Backlog da Sprint 2 <a id="backlog-sprint-2"></a>

| Rank  |  ID  | Prioridade | User Story                                                                                                                  | Estimativa | Sprint |  Situação   |
| :---: | :--: | :--------: | :-------------------------------------------------------------------------------------------------------------------------- | :--------: | :----: | :---------: |
| 🎗 6  | US08 |   Média    | Como gestor, quero registrar frete e custos de cada viagem, para calcular a rentabilidade.                                  |     3      |   2    | 🟢 Entregue |
| 🎗 7  | US09 |   Média    | Como gestor, quero visualizar a rentabilidade média por viagem de cada motorista, para comparar desempenho.                 |     4      |   2    | 🟢 Entregue |
| 🎗 8  | US05 |   Média    | Como operador, quero ver em uma tela única quais motoristas estão disponíveis, para direcionar novas viagens rapidamente.   |     5      |   2    | 🟢 Entregue |
| 🎗 9  | US14 |   Baixa    | Como gestor, quero identificar as rotas mais concorridas do mês, para criar campanhas de engajamento de motoristas.         |     4      |   2    | 🟢 Entregue |
| 🎗 10 | US15 |   Média    | Como gestor, quero realizar login seguro na plataforma, para garantir a segurança dos dados no sistema.                     |     4      |   2    | 🟢 Entregue |
| 🎗 11 | US16 |   Média    | Como gestor, quero ver na tela dashboard apenas os dados considerados essenciais, para garantir uma visão clara e objetiva. |     5      |   2    | 🟢 Entregue |
| 🎗 12 | US07 |   Média    | Como gestor, quero receber um alerta de motoristas com baixa utilização no mês, para agir sobre ociosidade.                 |     5      |   2    | 🟢 Entregue |

## ✅ DoR e DoD da Sprint <a id="dor-dod"></a>

**🚀 Definition of Ready (DoR)** — quando uma história está pronta para entrar na sprint:

- A história de usuário possui valor de negócio claro e definido.
- Os critérios de aceitação e as regras de negócio estão documentados no ticket.
- Os cenários de teste (BDD) estão descritos para orientar o desenvolvimento.
- O esforço (estimativa) foi pontuado pela equipe.

**✔️ Definition of Done (DoD)** — quando uma história está concluída:

- O código foi implementado e atende a todos os critérios de aceitação.
- O código passou por Code Review (Pull Request aprovado por no mínimo 1 membro da equipe).
- Os testes foram executados e validados no backend.
- A nova funcionalidade não quebrou funcionalidades anteriores.
- A documentação da sprint foi atualizada.

## 🛠️ Desenvolvimento da Sprint <a id="desenvolvimento"></a>

Resumo de tudo o que foi desenvolvido na sprint, organizado por User Story e vinculado às respectivas issues do Jira.

### Visão geral das tasks

|   US    | Story Jira | Issue (Subtask) |    Tipo    | O que foi feito                                                                                                                   |     Responsável     |    Status    |                                   Jira                                    |
| :-----: | :--------: | :-------------: | :--------: | :-------------------------------------------------------------------------------------------------------------------------------- | :-----------------: | :----------: | :-----------------------------------------------------------------------: |
| Ajustes |   OM-99    |     OM-114      |    Back    | Testes do Operacional (pasta de motorista) e do Relatório alinhados com o `main/java`, sem testes quebrados ou incompletos        |   Yuri Gonçalves    | 🟢 Concluída | [OM-114](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-114) |
| Ajustes |   OM-99    |     OM-102      |  Back/BD   | Filtro da tela de viagem passa a enviar origem e destino e aceita mais de um filtro do mesmo tipo (ex.: finalizado e em trânsito) |  Henrique Martins   | 🟢 Concluída | [OM-102](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-102) |
| Ajustes |   OM-99    |     OM-101      | Front/Back | Correção do % de utilização na tela de motorista ao importar manifestos diferentes, sem duplicar viagens na reimportação          | Guilherme Alvarenga | 🟢 Concluída | [OM-101](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-101) |
|  US16   |   OM-110   |     OM-100      |    Back    | Prover endpoint com os dados reais e indicadores consolidados do dashboard                                                        |   Thomaz De Mello   | 🟢 Concluída | [OM-100](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-100) |
|  US16   |   OM-110   |     OM-111      | Integração | Popular os cards e indicadores do dashboard com os dados reais da API                                                             |   Thomaz De Mello   | 🟢 Concluída | [OM-111](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-111) |
|  US05   |    OM-5    |     OM-103      |    Back    | Endpoint de listagem, resumo e atualização de status de motoristas disponíveis                                                    |  Vinicius Moreira   | 🟢 Concluída | [OM-103](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-103) |
|  US05   |    OM-5    |     OM-104      | Integração | Conectar o card "Disponíveis" do dashboard ao KPI de motoristas disponíveis (valor igual ao da tela de motorista)                 |  Vinicius Moreira   | 🟢 Concluída | [OM-104](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-104) |
|  US05   |    OM-5    |     OM-105      |   Front    | Interface de tela única exibindo os motoristas disponíveis e seus status                                                          |  Vinicius Moreira   | 🟢 Concluída | [OM-105](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-105) |
|  US15   |   OM-109   |     OM-107      |   Front    | Tela de login e validação de formulário de acesso                                                                                 |     Pedro Lucas     | 🟢 Concluída | [OM-107](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-107) |
|  US15   |   OM-109   |     OM-112      |    Back    | Serviço de autenticação (`autenticacao-service`), geração de token JWT e criptografia                                             |     Pedro Lucas     | 🟢 Concluída | [OM-112](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-112) |
|  US15   |   OM-109   |     OM-113      | Integração | Integração do fluxo de login, controle de sessão (401/403), CORS e proteção de rotas privadas por perfil                          |     Pedro Lucas     | 🟢 Concluída | [OM-113](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-113) |
|  US08   |    OM-8    |     OM-106      |     BD     | Ajuste de tipos monetários e estrutura de banco para custos, vale-frete e rentabilidade                                           | Guilherme Alvarenga | 🟢 Concluída | [OM-106](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-106) |
|  US08   |    OM-8    |     OM-108      |    Back    | Importação de custos pelo manifesto e cálculo automático da rentabilidade de cada viagem                                          | Guilherme Alvarenga | 🟢 Concluída | [OM-108](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-108) |
|  US08   |    OM-8    |     OM-117      |   Front    | Exibição de frete, custos e rentabilidade por viagem na interface (restrito ao perfil Gestor)                                     | Guilherme Alvarenga | 🟢 Concluída | [OM-117](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-117) |
|  US09   |    OM-9    |     OM-115      |   Front    | Interface para visualização e ordenação da rentabilidade média por motorista (acesso apenas Gestor)                               | Guilherme Alvarenga | 🟢 Concluída | [OM-115](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-115) |
|  US09   |    OM-9    |     OM-116      |    Back    | Endpoint de cálculo da rentabilidade média por viagem de cada motorista (`AVG`)                                                   | Guilherme Alvarenga | 🟢 Concluída | [OM-116](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-116) |
|  US14   |   OM-14    |     OM-118      |    Back    | Endpoint de ranking dos 10 destinos com maior média de rentabilidade no mês                                                       |   Yuri Gonçalves    | 🟢 Concluída | [OM-118](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-118) |
|  US07   |    OM-7    |     OM-120      |   Front    | Endpoint `GET /motoristas/baixa-utilizacao?mes=YYYY-MM` (limite padrão 30%, configurável por variável de ambiente)                |     Pedro Lucas     | 🟢 Concluída | [OM-120](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-120) |
|  US07   |    OM-7    |     OM-121      |    Back    | Alerta de baixa utilização no sino de notificações e destaque em vermelho na tela de motorista                                    |     Pedro Lucas     | 🟢 Concluída | [OM-121](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-121) |

### Detalhamento por User Story

#### Ajustes da Sprint 2 — Fechamento das pendências da Sprint 1 (story OM-99)

A Sprint 1 terminou com histórias pendentes, uma task de dashboard grande demais e lacunas de integração em outras histórias. Esta task reúne o que precisava ser corrigido antes de iniciar as histórias da Sprint 2.

> **Objetivo:** fechar as pendências da Sprint 1 e deixar o escopo da Sprint 2 definido.
> **Critério de aceite:** todas as subtasks concluídas.

- **Testes (OM-114):** criação da pasta de testes de motorista no serviço Operacional e verificação de que todas as funcionalidades, no Operacional e no Relatório, têm testes alinhados com o `main/java` e retornando o resultado esperado.
- **Filtro de viagens (OM-102):** o filtro passa a enviar origem e destino e o backend filtra pelos dois; ao selecionar mais de um filtro do mesmo tipo, são retornadas as viagens de todos eles.
- **% de utilização (OM-101):** reimportar o mesmo manifesto mantém o percentual e não duplica viagens; um segundo manifesto, com viagens novas, altera o percentual de acordo com o CSV. O número do manifesto identifica cada viagem de forma única.

<details>
<summary><b>Critérios de aceite dos Ajustes (OM-99)</b></summary>

|     | Critério                                                                                               |
| :-: | :----------------------------------------------------------------------------------------------------- |
| ✅  | Todas as subtasks concluídas (OM-101, OM-102 e OM-114).                                                |
| ✅  | O filtro da tela de viagem envia origem e destino, e o backend filtra pelos dois.                      |
| ✅  | Retorna as viagens de todos os filtros quando há mais de um do mesmo tipo selecionado.                 |
| ✅  | Reimportar o mesmo manifesto mantém o % de utilização e não duplica viagens.                           |
| ✅  | Um segundo manifesto, com viagens novas, altera o % de forma coerente com o CSV.                       |
| ✅  | O número do manifesto identifica cada viagem de forma única.                                           |
| ✅  | Testes do Operacional e do Relatório alinhados com o `main/java`, sem testes quebrados ou incompletos. |

</details>

#### US08 — Apuração de frete, custos e cálculo de rentabilidade (story OM-8)

Permite apurar o valor do frete e os custos operacionais de cada viagem para calcular a rentabilidade real da operação. Os valores são obtidos diretamente pela importação/reimportação da planilha de manifesto (sem tela de cadastro ou edição manual), sendo as informações de rentabilidade visíveis apenas para o perfil de Gestor.

- **BD (OM-106):** Modelagem de colunas monetárias precisas para suportar valores de frete, vale-frete, pedágio e rentabilidade.
- **Back (OM-108):** Processamento da fórmula de rentabilidade durante a importação do manifesto via UPSERT (evitando duplicidade quando um manifesto é reimportado para correção) e tratamento de valores nulos.
- **Front (OM-117):** Exibição das receitas, despesas e saldo final de rentabilidade restrita aos gestores, com destaque visual em vermelho para viagens deficitárias.

<details>
<summary><b>Critérios de aceite da US08</b></summary>

|     | Critério                                                                                 |
| :-: | :--------------------------------------------------------------------------------------- |
| ✅  | Frete, vale-frete, pedágio e rentabilidade em colunas monetárias precisas.               |
| ✅  | Valores obtidos pela importação do manifesto, sem tela de cadastro ou edição manual.     |
| ✅  | Reimportar um manifesto corrigido atualiza as viagens sem duplicá-las (UPSERT).          |
| ✅  | Valores nulos tratados no cálculo da rentabilidade.                                      |
| ✅  | Rentabilidade visível apenas para o perfil Gestor, com viagens deficitárias em vermelho. |

</details>

#### US09 — Rentabilidade média por motorista (story OM-9)

Exibe a rentabilidade média obtida por viagem de cada motorista, permitindo ao Gestor comparar o desempenho financeiro da frota agregada.

- **Back (OM-116):** Cálculo da média (`AVG`) agrupada por motorista no período filtrado, desconsiderando viagens com valores financeiros nulos.
- **Front (OM-115):** Listagem comparativa restrita ao perfil Gestor, com suporte a ordenação crescente/decrescente e tratamento para motoristas sem viagens no mês _(em revisão)_.

<details>
<summary><b>Critérios de aceite da US09</b></summary>

|     | Critério                                                                                                     |
| :-: | :----------------------------------------------------------------------------------------------------------- |
| ✅  | Média (`AVG`) da rentabilidade por viagem de cada motorista no período, ignorando viagens com valores nulos. |
| ✅  | Acesso restrito ao perfil Gestor.                                                                            |
| ⚠️  | Ordenação crescente e decrescente e tratamento de motoristas sem viagens no mês (OM-115), em revisão.        |

</details>

#### US05 — Tela única de motoristas disponíveis (story OM-5)

Centraliza em uma única visualização os motoristas disponíveis para agilizar o direcionamento de novas cargas pelo operador.

- **Back (OM-103):** Endpoints de consulta e alteração manual de status (`PATCH /motoristas/{id}/status`), preservando a alteração manual mesmo após novas importações de manifesto.
- **Front (OM-105):** Interface dedicada listando os motoristas e seus respectivos status operacionais.
- **Integração (OM-104):** Conexão do card "Disponíveis" do dashboard ao KPI da US05, garantindo que o valor exibido coincida exatamente com a contagem da tela de motoristas _(em revisão)_.

<details>
<summary><b>Critérios de aceite da US05</b></summary>

|     | Critério                                                                                               |
| :-: | :----------------------------------------------------------------------------------------------------- |
| ✅  | Endpoints de consulta e de alteração manual do status do motorista.                                    |
| ✅  | A alteração manual de status é preservada após novas importações de manifesto.                         |
| ✅  | Tela única lista os motoristas e seus status operacionais.                                             |
| ⚠️  | Card "Disponíveis" do dashboard com valor igual à contagem da tela de motoristas (OM-104), em revisão. |

</details>

#### US14 — Identificação das rotas de maior retorno no mês (story OM-14)

Identifica os destinos com maior retorno financeiro no mês para embasar campanhas de engajamento de motoristas.

- **Back (OM-118):** Agrupamento por destino gerando o ranking dos 10 destinos com maior média de rentabilidade no mês, ordenados de forma decrescente.
- **Front / Integração:** A integração do ranking com o componente visual no frontend e o ajuste do rótulo de exibição ficaram pendentes para finalização.

<details>
<summary><b>Critérios de aceite da US14</b></summary>

|     | Critério                                                                                      |
| :-: | :-------------------------------------------------------------------------------------------- |
| ✅  | Ranking dos 10 destinos com maior média de rentabilidade no mês, em ordem decrescente (back). |
| ⚠️  | Integração do ranking com o componente visual e ajuste do rótulo de exibição, pendentes.      |

</details>

#### US15 — Login seguro e controle de acesso por perfil (story OM-109)

Garante a proteção dos dados operacionais e financeiros através de autenticação JWT e separação de permissões entre os perfis **Operador** e **Gestor**.

- **Back (OM-112):** Microsserviço dedicado (`autenticacao-service`), validação de credenciais com senhas criptografadas (Bcrypt) e emissão de token JWT com expiração de 8 horas.
- **Front (OM-107):** Tela de login com validação de campos e exibição de mensagens genéricas para credenciais inválidas.
- **Integração (OM-113):** Configuração de CORS, interceptação de respostas `401` (não autenticado) e `403` (acesso negado para perfil Operador em telas financeiras) e proteção de rotas privadas.

<details>
<summary><b>Critérios de aceite da US15</b></summary>

|     | Critério                                                                                                             |
| :-: | :------------------------------------------------------------------------------------------------------------------- |
| ✅  | Senhas criptografadas com Bcrypt e token JWT com expiração de 8 horas.                                               |
| ✅  | Credenciais inválidas exibem mensagem genérica.                                                                      |
| ✅  | Respostas `401` (não autenticado) e `403` (acesso negado) tratadas; perfil Operador sem acesso às telas financeiras. |
| ✅  | CORS configurado e rotas privadas protegidas por perfil.                                                             |

</details>

#### US16 — Dashboard com dados essenciais (story OM-110)

Apresenta no painel principal apenas os indicadores essenciais da operação para garantir uma leitura rápida e objetiva pelo gestor.

- **Back (OM-100):** Endpoint consolidado (`GET /dashboard`) reunindo as métricas principais do período.
- **Integração (OM-111):** Conexão dos quadrantes do dashboard aos dados reais, atualização automática após upload de planilhas e tratamento de estados vazios (_Empty State_).

<details>
<summary><b>Critérios de aceite da US16</b></summary>

|     | Critério                                                                     |
| :-: | :--------------------------------------------------------------------------- |
| ✅  | Endpoint consolidado `GET /dashboard` com as métricas principais do período. |
| ✅  | Quadrantes do dashboard alimentados por dados reais da API.                  |
| ✅  | Dashboard atualizado automaticamente após o upload de planilhas.             |
| ✅  | Estados vazios (_Empty State_) tratados.                                     |

</details>

#### US07 — Alerta de motoristas com baixa utilização no mês (story OM-7)

Auxilia o gestor a identificar proativamente motoristas agregados com baixa taxa de ocupação no mês para agir sobre a ociosidade da frota.

- **Back (OM-XXX):** Endpoint `GET /motoristas/baixa-utilizacao?mes=YYYY-MM` identificando motoristas abaixo do limite mínimo de utilização (padrão de 30%, configurável por variável de ambiente), incluindo motoristas sem viagens no período com `0%` _(em andamento)_.
- **Front (OM-YYY):** Exibição de alerta no sino de notificações no formato _"Alerta motorista: {nome}, baixa frequência: {percentual}%"_ e destaque da frequência em vermelho com ícone de alerta na tela de motoristas _(em revisão)_.

<details>
<summary><b>Critérios de aceite da US07</b></summary>

|     | Critério                                                                                                                                                 |
| :-: | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅  | Endpoint `GET /motoristas/baixa-utilizacao` com limite padrão de 30% (configurável por variável de ambiente), incluindo motoristas sem viagens com `0%`. |
| ✅  | Alerta no sino de notificações e destaque em vermelho, com ícone, na tela de motoristas.                                                                 |

</details>

## 🔍 Retrospectiva <a id="retrospectiva"></a>

**O que deu certo**

- Entrega majoritária do escopo planejado, com conclusão integral das histórias centrais de negócio (US08, US15 e US16) e do backend de todas as demais histórias (US05, US09 e US14).
- Criação do microsserviço dedicado de autenticação (`autenticacao-service`) com controle de acesso por perfil (Operador e Gestor).
- Pagamento das pendências técnicas da Sprint 1 com a integração real dos quadrantes do dashboard (OM-100 e OM-111).
- Task de ajustes (OM-99) concluída: filtro de viagens corrigido (OM-102), % de utilização corrigido (OM-101) e testes do back-end alinhados (OM-114).

**O que não deu certo / Pendências no fechamento**

- Algumas tarefas entraram na reta final da sprint em fase de revisão (Pull Request aberto) ou finalização:
  - **US05 (OM-104):** Integração do card "Disponíveis" do dashboard em revisão.
  - **US09 (OM-115):** Interface de ordenação da rentabilidade média por motorista em revisão.
  - **US14:** Backend concluído (OM-118), restando a integração visual no frontend e ajuste de título.
  - **US07:** Backend do alerta de baixa utilização em andamento e frontend em revisão.

**O que muda na Sprint 3**

- Priorizar o merge e validação das tasks em revisão logo no início da Sprint 3 antes de puxar novas histórias.
- Antecipar a integração entre Front e Back assim que os contratos de endpoint forem definidos, reduzindo o acúmulo de revisões nos últimos dias da sprint.

## 📂 Documentos e anexos <a id="documentos"></a>

- [Cenários de User Stories](../documentacao-produto/Cenarios_sprint2.pdf)
- [Backlog completo](../documentacao-produto/Backlog.pdf)

## 🎥 Link do Vídeo <a id="link-do-video"></a>

Neste vídeo é mostrado o desenvolvimento da **Plataforma de Controle de Motoristas Agregados**, feito pela equipe **OmniDevs** ao decorrer do ciclo da 2ª (segunda) Sprint.

<a href="#"><img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white"/></a>

## 👥 **Equipe** <a id="equipe"></a>

|                                          Foto                                          | Nome                    | Função        |                                                                          GitHub                                                                           |
| :------------------------------------------------------------------------------------: | :---------------------- | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------: |
|   <img src="https://github.com/Marcio-gustavoI.png" width=50px alt="Foto do Márcio">   | **Márcio Inocêncio**    | Product Owner |  <a href="https://github.com/Marcio-gustavoI"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a>  |
| <img src="https://github.com/DeveloperCorsair.png" width=50px alt="Foto do Henrique">  | **Henrique Martins**    | Scrum Master  | <a href="https://github.com/DeveloperCorsair"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a>  |
| <img src="https://github.com/Viniciuss-Moreira.png" width=50px alt="Foto do Vinicius"> | **Vinicius Moreira**    | Desenvolvedor | <a href="https://github.com/Viniciuss-Moreira"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
|     <img src="https://github.com/hiGuigo.png" width=50px alt="Foto do Guilherme">      | **Guilherme Alvarenga** | Desenvolvedor |      <a href="https://github.com/hiGuigo"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a>      |
|     <img src="https://github.com/pedrodevroot.png" width=50px alt="Foto do Pedro">     | **Pedro Lucas**         | Desenvolvedor |   <a href="https://github.com/pedrodevroot"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a>    |
|     <img src="https://github.com/ThOMaZMe11o.png" width=50px alt="Foto do Thomaz">     | **Thomaz De Mello**     | Desenvolvedor |    <a href="https://github.com/ThOMaZMe11o"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a>    |
|      <img src="https://github.com/Yuri-Dev-OH.png" width=50px alt="Foto do Yuri">      | **Yuri Gonçalves**      | Desenvolvedor |    <a href="https://github.com/Yuri-Dev-OH"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a>    |
