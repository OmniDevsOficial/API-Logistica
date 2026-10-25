<h1 align="center"> Documentação do Produto da Sprint 1 </h1>

<div align="center">
    <img src="https://i.imgur.com/VbBN3Tk.jpeg" width="170x" height="170x" style="border-radius:20%;">
</div>

<p align="center">|
  <a href="#visao-geral"> Visão Geral </a> |
  <a href="#sprint-1-meta"> Metas </a> |
  <a href="#backlog-sprint-1"> Backlog </a> |
  <a href="#dor-dod"> DoR e DoD </a> |
  <a href="#desenvolvimento"> Desenvolvimento </a> |
  <a href="#retrospectiva"> Retrospectiva </a> |
  <a href="#documentos"> Documentos </a> |
  <a href="#link-do-Video"> Vídeo </a> |
  <a href="#equipe"> Equipe </a> |
</p>

## Visão geral <a id="visao-geral"></a>

A Sprint 1 concentrou-se em conectar as funcionalidades operacionais do sistema logístico ao dashboard: importação de manifestos, consulta e filtragem de viagens, indicadores por motorista e integração do dashboard com o backend.

## 📅 Cronograma da Sprint

|    Período    |                               Status                               |
| :-----------: | :----------------------------------------------------------------: |
| 07/09 - 27/09 | 🟢 Encerrada (com pendências, ver [Retrospectiva](#retrospectiva)) |

## 🎯 Metas da Sprint 1 <a id="sprint-1-meta"></a>

| Foco | User Story Meta                                                                                                                 |
| :--: | :------------------------------------------------------------------------------------------------------------------------------ |
|  🥇  | **US01:** Como operador, quero exportar a planilha da análise obtida e importá-la no sistema, para não perder o fluxo já usado. |
|  🥈  | **US02:** Como operador, quero importar o relatório de manifesto para popular viagens automaticamente.                          |

## 📋 Backlog da Sprint 1 <a id="backlog-sprint-1"></a>

| Rank |  ID  | Prioridade | User Story                                                                                                            | Estimativa |  Situação   |
| :--: | :--: | :--------: | :-------------------------------------------------------------------------------------------------------------------- | :--------: | :---------: |
| 🎗 1 | US01 |    Alta    | Como operador, quero exportar a planilha da análise obtida e importá-la no sistema, para não perder o fluxo já usado. |     4      | 🟢 Entregue |
| 🎗 2 | US02 |    Alta    | Como operador, quero importar o relatório de manifesto para popular viagens automaticamente.                          |     4      | 🟢 Entregue |
| 🎗 3 | US04 |    Alta    | Como operador, quero filtrar viagens por destino/região, para entender a demanda por rota.                            |     4      | 🟡 Parcial  |
| 🎗 4 | US06 |    Alta    | Como operador, quero ver a % de utilização de cada motorista, para evitar a desocupação de frotas.                    |     3      | 🟢 Entregue |
| 🎗 5 | US03 |    Alta    | Como gestor, quero visualizar quantas viagens cada motorista fez no mês, para medir a frequência de contratação.      |     4      | 🟡 Parcial  |

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

## 🛠️ Desenvolvimento da Sprint <a id="desenvolvimento"></a>

Resumo de tudo o que foi feito na sprint, por User Story. O detalhamento completo de cada task (contexto, objetivo e critérios de aceite) está no Jira, no link de cada issue.

### Visão geral das tasks

|     US      | Story Jira | Issue (Subtask) |    Tipo    | O que foi feito                                                                                                                                |     Responsável     |    Status    | Jira                                                                    |
| :---------: | :--------: | :-------------: | :--------: | :--------------------------------------------------------------------------------------------------------------------------------------------- | :-----------------: | :----------: | ----------------------------------------------------------------------- |
|    US01     |    OM-1    |      OM-88      |   Front    | Estrutura inicial do frontend em React, seguindo a arquitetura FSD                                                                             |     Pedro Lucas     | 🟢 Concluída | [OM-88](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-88) |
|    US01     |    OM-1    |      OM-83      |     BD     | Schema inicial (Motorista, Veículo e Viagem) criado via migration, com CPF e placa únicos e veículo opcional na viagem                         |  Henrique Martins   | 🟢 Concluída | [OM-83](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-83) |
|    US01     |    OM-1    |      OM-67      |    Back    | Microsserviço que converte o arquivo `.xlsx`/`.csv` em JSON via API REST, com cache simples, tratamento de arquivo inválido e testes unitários |  Márcio Inocêncio   | 🟢 Concluída | [OM-67](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-67) |
|    US01     |    OM-1    |      OM-82      |   Front    | Tela do dashboard reconstruída a partir do Figma                                                                                               |   Thomaz De Mello   | 🟢 Concluída | [OM-82](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-82) |
|    US01     |    OM-1    |      OM-68      |   Front    | Botão de upload (arrastar ou selecionar `.xlsx`/`.csv`) integrado ao microsserviço de processamento                                            |   Yuri Gonçalves    | 🟢 Concluída | [OM-68](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-68) |
|    US01     |    OM-1    |      OM-87      |    Back    | Estrutura inicial do backend em Spring Boot com gradle, seguindo arquitetura MVC                                                               | Guilherme Alvarenga | 🟢 Concluída | [OM-87](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-87) |
|    US02     |   OM-71    |      OM-72      |    Back    | Endpoint `POST /viagens/importar-manifesto`, mapeamento para a tabela de viagens, validações e limite de 10 MB                                 | Guilherme Alvarenga | 🟢 Concluída | [OM-72](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-72) |
|    US02     |   OM-71    |      OM-73      |   Front    | Upload de `.xlsx`/`.csv` (seleção ou arrastar e soltar), confirmação e tratamento de erros                                                     |   Yuri Gonçalves    | 🟢 Concluída | [OM-73](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-73) |
|    US03     |    OM-3    |      OM-74      |    Back    | Endpoint de total de viagens por motorista no período, incluindo motoristas com total zero                                                     |     Pedro Lucas     | 🟢 Concluída | [OM-74](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-74) |
|    US03     |    OM-3    |      OM-75      |   Front    | Lista por motorista, seletor de período e detalhamento das viagens                                                                             |   Thomaz De Mello   | 🟢 Concluída | [OM-75](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-75) |
|    US03     |    OM-3    |      OM-98      | Integração | Conexão dos quadrantes do dashboard a dados reais e filtro de datas                                                                            |   Thomaz De Mello   |  🟡 Parcial  | [OM-98](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-98) |
|    US04     |    OM-4    |      OM-76      |    Back    | Consulta de viagens com filtros combinados (destino, região, mês)                                                                              |   Thomaz De Mello   | 🟢 Concluída | [OM-76](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-76) |
|    US04     |    OM-4    |      OM-77      |   Front    | Modal de filtros na tela de viagens com atualização assíncrona                                                                                 |  Henrique Martins   |  🟡 Parcial  | [OM-77](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-77) |
|    US06     |    OM-6    |      OM-78      |    Back    | Cálculo do % de utilização, ordenação e tratamento de casos extremos                                                                           |   Yuri Gonçalves    | 🟢 Concluída | [OM-78](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-78) |
|    US06     |    OM-6    |      OM-79      |   Front    | Visualização do % de utilização com seletor de período e ordenação                                                                             | Guilherme Alvarenga | 🟢 Concluída | [OM-79](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-79) |
| Refatoração |   OM-89    |      OM-90      |    Back    | Desacoplamento do microsserviço de processamento                                                                                               |  Henrique Martins   | 🟢 Concluída | [OM-90](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-90) |
| Refatoração |   OM-89    |      OM-91      |   Front    | Desacoplamento do frontend                                                                                                                     |   Thomaz De Mello   | 🟢 Concluída | [OM-91](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-91) |
| Refatoração |   OM-89    |      OM-94      |   Infra    | Dockerfile do microsserviço principal                                                                                                          |     Pedro Lucas     | 🟢 Concluída | [OM-94](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-94) |
| Refatoração |   OM-89    |      OM-93      |   Infra    | Dockerfile do microsserviço de processamento                                                                                                   |     Pedro Lucas     | 🟢 Concluída | [OM-93](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-93) |
| Refatoração |   OM-89    |      OM-97      |   Infra    | Dockerfile do banco de dados                                                                                                                   |     Pedro Lucas     | 🟢 Concluída | [OM-93](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-97) |
| Refatoração |   OM-89    |      OM-95      |   Infra    | Dockerfile do frontend                                                                                                                         |     Pedro Lucas     | 🟢 Concluída | [OM-93](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-95) |
| Refatoração |   OM-89    |      OM-96      |   Infra    | Docker Compose unindo todos os Dockerfiles                                                                                                     |     Pedro Lucas     | 🟢 Concluída | [OM-93](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-96) |

### US01 — Exportação e reimportação de planilha de análise (story OM-1)

Permite ao operador levar para o sistema a planilha do processo que ele já usa, sem perder o fluxo atual. A US01 é a base da sprint: entregou a estrutura do projeto e o caminho do arquivo até o banco.

- **Front:** estrutura inicial em React com arquitetura FSD (OM-88), tela do dashboard fiel ao Figma (OM-82) e botão de upload com arrastar e soltar (OM-68).
- **Back:** microsserviço de processamento que converte o arquivo em JSON, sem retrabalho para os demais serviços, com cache simples e fallback para arquivo inválido (OM-67).
- **Banco:** schema inicial criado por migration, com CPF do motorista e placa do veículo únicos (OM-83).

<details>
<summary><b>Critérios de aceite da US01</b></summary>

| | Critério |
| :---: | :--- |
| ✅ | Aceitar estritamente arquivos `.xlsx` e `.csv`. |
| ✅ | Arquivo corrompido ou vazio não derruba o serviço: a ação é barrada com mensagem amigável (fallback). |
| ✅ | Valores financeiros processados com precisão monetária; colunas desnecessárias (como "Origem") ignoradas. |
| ✅ | Conversão para JSON consistente com o arquivo original, com testes unitários. |
| ✅ | Estrutura do banco criada por migration, com CPF do motorista e placa do veículo únicos e veículo opcional na viagem. |

</details>

### US02 — Importação de manifesto (story OM-71)
 
Permite ao operador importar um relatório de manifesto e cadastrar viagens em lote, sem preenchimento manual.
 
- **Back:** validação dos campos obrigatórios (manifesto, CPF, data e valor do frete), com erro `manifesto inválido ou incompleto`; veículo e destino opcionais (gravados como `null`); limite de 10 MB.
- **Front:** upload restrito a `.xlsx` e `.csv`, confirmação com a quantidade de viagens importadas e mensagens de erro claras.

<details>
<summary><b>Critérios de aceite da US02</b></summary>

| | Critério |
| :---: | :--- |
| ✅ | Rejeitar linhas sem os campos obrigatórios (manifesto, CPF do motorista, data e valor do frete). |
| ✅ | Tamanho máximo do arquivo de 10 MB. |
| ✅ | Veículo e destino opcionais: quando ausentes, gravados como `null`. |
| ✅ | Confirmação com a quantidade de viagens importadas. |
 
</details>

### US03 — Viagens por motorista no mês (story OM-3)
 
Exibe o total de viagens de cada motorista no período escolhido e permite abrir as viagens que compõem o total.
 
- **Back:** contagem por período, recalculada a cada mudança, com motoristas sem viagens retornando `0`.
- **Front:** lista com seletor de período (sem recarregar a página) e detalhamento ao clicar no total.
- **Integração (OM-98):** substituição dos dados mockados do dashboard por dados reais; ver pendências na [Retrospectiva](#retrospectiva).

<details>
<summary><b>Critérios de aceite da US03</b></summary>

| | Critério |
| :---: | :--- |
| ✅ | Recalcular o total de viagens ao alterar o período. |
| ✅ | Motoristas sem viagens no período aparecem com total `0`. |
| ✅ | O total é clicável e abre o detalhamento das viagens do motorista. |
| ⚠️ | Dados do dashboard vindos do backend (OM-98), pendente de finalização. |
 
</details>

### US04 — Filtro de viagens por destino/região (story OM-4)
 
Permite filtrar as viagens por destino ou região e ver a lista atualizada sem recarregar a página.
 
- **Back:** filtros combinados, e lista vazia (sem erro) quando nada corresponde.
- **Front:** modal de filtros integrado aos filtros existentes, com mensagem quando não há resultados.

<details>
<summary><b>Critérios de aceite da US04</b></summary>

| | Critério |
| :---: | :--- |
| ✅ | Filtros combinados (ex.: destino + data) no backend. |
| ✅ | Sem resultados: lista vazia, sem erro. |
| ⚠️ | Atualização assíncrona na interface, sem recarregar a página, e mensagem de ausência de resultados (OM-77), pendente de finalização. |
 
</details>

### US06 — % de utilização por motorista (story OM-6)
 
Calcula e exibe o percentual de utilização de cada motorista no período, com ordenação crescente e decrescente.
 
> **Regra:** utilização (%) = dias em operação ÷ dias disponíveis no período × 100.
> Dias em operação = dias distintos com viagem registrada. Dias disponíveis = valor do cadastro do motorista.
 
- **Back:** recálculo por período, ordenação, motorista sem viagens com 0% e dias disponíveis igual a zero tratado como "sem dados" (sem divisão por zero).
- **Front:** lista com percentuais, seletor de período, ordenação e mensagens para ausência de viagens ou de dados de disponibilidade.

<details>
<summary><b>Critérios de aceite da US06</b></summary>

| | Critério |
| :---: | :--- |
| ✅ | Fórmula: (dias em operação ÷ dias disponíveis no período) × 100. |
| ✅ | Divisão por zero prevenida: motorista sem dias disponíveis exibe "sem dados"; sem viagens exibe 0%. |
| ✅ | Tabela reordenável (crescente e decrescente) pelo percentual. |
| ✅ | Recálculo correto ao mudar o período. |
 
</details>
 
### Refatoração — Arquitetura de microsserviços em Docker (story OM-89)
 
Durante a sprint, a arquitetura foi refatorada para microsserviços, com cada parte do sistema empacotada em Docker. Essa mudança não estava no backlog, mas foi necessária para o projeto continuar de acordo com o cliente.
 
- **Desacoplamento (OM-90 e OM-91):** o microsserviço de processamento e o frontend foram separados do restante da aplicação.
- **Docker (OM-93, OM-94 e demais tasks):** Dockerfiles do microsserviço principal, do microsserviço de processamento, do banco de dados e do frontend.
- **Docker Compose:** arquivo que une todos os Dockerfiles, para subir o sistema inteiro de uma vez.

## 🔍 Retrospectiva <a id="retrospectiva"></a>

**O que deu certo**

- Importação do manifesto funcionando de ponta a ponta (back e front).
- Cálculo de utilização do motorista implementado e testado com casos extremos.

**O que não deu certo**

- A integração do dashboard (OM-98) e parte do front do filtro de viagens (OM-77) não foram finalizadas na sprint.
- O dashboard ainda não possui backend próprio: os quadrantes continuam parcialmente mockados.
- A sprint ficou abaixo do esperado em organização e acompanhamento das tasks.

**O que muda na Sprint 2**

- Revisão completa do projeto e das tasks antes de começar novas US.
- Tasks quebradas em tamanhos menores (front e back por US), com um responsável por US.
- Padronização de commits, branches e PRs, com aprovação obrigatória de pelo menos 1 revisor.
- Documentação passa a fazer parte do DoD.

## 📂 Documentos e anexos <a id="documentos"></a>

- [Cenários de User Stories](../documentacao-produto/Cenarios_sprint1.pdf)
- [Backlog completo](../documentacao-produto/Backlog.pdf)

## 🎥 Link do Vídeo <a id="link-do-Video"></a>

Neste vídeo é mostrado todo o desenvolvimento da <strong>_Plataforma de Controle de Motoristas Agregados_</strong>, feito pela equipe <strong>_OmniDevs_</strong> ao decorrer do ciclo da 1ª (primeira) Sprint.

<a href="https://www.youtube.com/watch?v=BLwNPkoQqVA"><img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white"/></a>

## 👥 **Equipe** <a id="equipe"></a>

|                                          Foto                                          | Nome                    | Função        |                                                                          GitHub                                                                           |
| :------------------------------------------------------------------------------------: | :---------------------- | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------: |
|   <img src="https://github.com/Marcio-gustavoI.png" width=50px alt="Foto do Márcio">   | **Márcio Inocêncio**    | Product Owner |  <a href="https://github.com/Marcio-gustavoI"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a>  |
| <img src="https://github.com/Viniciuss-Moreira.png" width=50px alt="Foto do Vinicius"> | **Vinicius Moreira**    | Scrum Master  | <a href="https://github.com/Viniciuss-Moreira"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
|     <img src="https://github.com/hiGuigo.png" width=50px alt="Foto do Guilherme">      | **Guilherme Alvarenga** | Desenvolvedor |      <a href="https://github.com/hiGuigo"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a>      |
| <img src="https://github.com/DeveloperCorsair.png" width=50px alt="Foto do Henrique">  | **Henrique Martins**    | Desenvolvedor | <a href="https://github.com/DeveloperCorsair"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a>  |
|     <img src="https://github.com/pedrodevroot.png" width=50px alt="Foto do Pedro">     | **Pedro Lucas**         | Desenvolvedor |   <a href="https://github.com/pedrodevroot"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a>    |
|     <img src="https://github.com/ThOMaZMe11o.png" width=50px alt="Foto do Thomaz">     | **Thomaz De Mello**     | Desenvolvedor |    <a href="https://github.com/ThOMaZMe11o"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a>    |
|      <img src="https://github.com/Yuri-Dev-OH.png" width=50px alt="Foto do Yuri">      | **Yuri Gonçalves**      | Desenvolvedor |    <a href="https://github.com/Yuri-Dev-OH"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a>    |
