<h1 align="center"> Documentação do Produto da Sprint 1 </h1>

<div align="center">
    <img src="https://i.imgur.com/VbBN3Tk.jpeg" width="170x" height="170x" style="border-radius:20%;">
</div>

<p align="center">|
  <a href="#visao-geral"> Visão Geral </a> |
  <a href="#sprint-1-meta"> Metas </a> |
  <a href="#backlog-sprint-1"> Backlog </a> |
  <a href="#desenvolvimento"> Desenvolvimento </a> |
  <a href="#retrospectiva"> Retrospectiva </a> |
  <a href="#documentos"> Documentos </a> |
  <a href="#link-do-Video"> Vídeo </a> |
  <a href="#equipe"> Equipe </a> |
</p>

## Visão geral <a id="visao-geral"></a>

A Sprint 1 concentrou-se em conectar as funcionalidades operacionais do sistema logístico ao dashboard: importação de manifestos, consulta e filtragem de viagens, indicadores por motorista e integração do dashboard com o backend.

## 📅 Cronograma da Sprint

| Período | Status |
| :---------: | :---------: |
| 07/09 - 27/09 | 🟢 Encerrada (com pendências, ver [Retrospectiva](#retrospectiva)) |

## 🎯 Metas da Sprint 1 <a id="sprint-1-meta"></a>

| Foco | User Story Meta |
| :---: | :--- |
| 🥇 | **US01:** Como operador, quero exportar a planilha da análise obtida e importá-la no sistema, para não perder o fluxo já usado. |
| 🥈 | **US02:** Como operador, quero importar o relatório de manifesto para popular viagens automaticamente. |

## 📋 Backlog da Sprint 1 <a id="backlog-sprint-1"></a>

| Rank | ID | Prioridade | User Story | Estimativa | Situação |
| :---: | :---: | :---: | :--- | :---: | :---: |
| 🎗 1 | US01 | Alta | Como operador, quero exportar a planilha da análise obtida e importá-la no sistema, para não perder o fluxo já usado. | 4 | 🟢 Entregue |
| 🎗 2 | US02 | Alta | Como operador, quero importar o relatório de manifesto para popular viagens automaticamente. | 4 | 🟢 Entregue |
| 🎗 3 | US04 | Alta | Como operador, quero filtrar viagens por destino/região, para entender a demanda por rota. | 4 | 🟡 Parcial |
| 🎗 4 | US06 | Alta | Como operador, quero ver a % de utilização de cada motorista, para evitar a desocupação de frotas. | 3 | 🟢 Entregue |
| 🎗 5 | US03 | Alta | Como gestor, quero visualizar quantas viagens cada motorista fez no mês, para medir a frequência de contratação. | 4 | 🟡 Parcial |

## 🛠️ Desenvolvimento da Sprint <a id="desenvolvimento"></a>

Resumo de tudo o que foi feito na sprint, por User Story. O detalhamento completo de cada task (contexto, objetivo e critérios de aceite) está no Jira, no link de cada issue.

### Visão geral das tasks

| US | Issue | Tipo | O que foi feito | Status | Jira |
| :---: | :---: | :---: | :--- | :---: | :---: |
| US01 | OM-67 | Back | Microsserviço para converter o arquivo upado pelo operador (excel ou csv) | 🟢 Concluída | [OM-67](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-67) |
| US01 | OM-68 | Front | Botão na tela de dashboard para o gestor fazer o upload do arquivo/relatório.| 🟢 Concluída | [OM-68](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-68) |
| US01 | OM-82 | Front | Interface do dashboard para visualizar os dados mais importantes, para agilizar na escolha de um motorista | 🟢 Concluída | [OM-82](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-82) |
| US01 | OM-83 | BD | Modelagem e criação do schema inicial de motorista, veículo e viagem no PostgreSQL | 🟢 Concluída | [OM-83](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-83) |
| US01 | OM-87 | Back | Construção da estrutura inicial da aplicação em Spring Boot com gradle, seguindo arquitetura MVC | 🟢 Concluída | [OM-87](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-87) |
| US01 | OM-88 | Front | Estrutura inicial do projeto com React, seguindo arquitetura FSD(Feature-Sliced Design ) | 🟢 Concluída | [OM-88](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-88) |
| US02 | OM-72 | Back | Endpoint `POST /viagens/importar-manifesto`, mapeamento para a tabela de viagens, validações e limite de 10 MB | 🟢 Concluída | [OM-72](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-72) |
| US02 | OM-73 | Front | Upload de `.xlsx`/`.csv` (seleção ou arrastar e soltar), confirmação e tratamento de erros | 🟢 Concluída | [OM-73](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-73) |
| US03 | OM-74 | Back | Endpoint de total de viagens por motorista no período, incluindo motoristas com total zero | 🟢 Concluída | [OM-74](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-74) |
| US03 | OM-75 | Front | Lista por motorista, seletor de período e detalhamento das viagens | 🟢 Concluída | [OM-75](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-75) |
| US03 | OM-98 | Integração | Conexão dos quadrantes do dashboard a dados reais e filtro de datas | 🟡 Parcial | [OM-98](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-98) |
| US04 | OM-76 | Back | Consulta de viagens com filtros combinados (destino, região, mês) | 🟢 Concluída | [OM-76](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-76) |
| US04 | OM-77 | Front | Modal de filtros na tela de viagens com atualização assíncrona | 🟡 Parcial | [OM-77](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-77) |
| US06 | OM-78 | Back | Cálculo do % de utilização, ordenação e tratamento de casos extremos | 🟢 Concluída | [OM-78](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-78) |
| US06 | OM-79 | Front | Visualização do % de utilização com seletor de período e ordenação | 🟢 Concluída | [OM-79](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-79) |

### US01 - Exportação e reimportação de planilha de análise (story OM-1)

...

### US02 — Importação de manifesto (story OM-71)

Permite ao operador importar um relatório de manifesto e cadastrar viagens em lote, sem preenchimento manual.

- **Back:** validação dos campos obrigatórios (manifesto, CPF, data e valor do frete), com erro `manifesto inválido ou incompleto`; veículo e destino opcionais (gravados como `null`); limite de 10 MB.
- **Front:** upload restrito a `.xlsx` e `.csv`, confirmação com a quantidade de viagens importadas e mensagens de erro claras.

### US03 — Viagens por motorista no mês (story OM-3)

Exibe o total de viagens de cada motorista no período escolhido e permite abrir as viagens que compõem o total.

- **Back:** contagem por período, recalculada a cada mudança, com motoristas sem viagens retornando `0`.
- **Front:** lista com seletor de período (sem recarregar a página) e detalhamento ao clicar no total.
- **Integração (OM-98):** substituição dos dados mockados do dashboard por dados reais; ver pendências na [Retrospectiva](#retrospectiva).

### US04 — Filtro de viagens por destino/região (story OM-4)

Permite filtrar as viagens por destino ou região e ver a lista atualizada sem recarregar a página.

- **Back:** filtros combinados, e lista vazia (sem erro) quando nada corresponde.
- **Front:** modal de filtros integrado aos filtros existentes, com mensagem quando não há resultados.

### US06 — % de utilização por motorista (story OM-6)

Calcula e exibe o percentual de utilização de cada motorista no período, com ordenação crescente e decrescente.

> **Regra:** utilização (%) = dias em operação ÷ dias disponíveis no período × 100.
> Dias em operação = dias distintos com viagem registrada. Dias disponíveis = valor do cadastro do motorista.

- **Back:** recálculo por período, ordenação, motorista sem viagens com 0% e dias disponíveis igual a zero tratado como "sem dados" (sem divisão por zero).
- **Front:** lista com percentuais, seletor de período, ordenação e mensagens para ausência de viagens ou de dados de disponibilidade.

<!-- ### Evidências

| US | Evidência | Link |
| :---: | :--- | :---: |
| US02 | Print/GIF do upload do manifesto | _a preencher_ |
| US03 | Print da lista de viagens por motorista | _a preencher_ |
| US04 | Print do modal de filtros | _a preencher_ |
| US06 | Print do % de utilização | _a preencher_ |
| Todas | Quadro da sprint no Jira (início e fim) | _a preencher_ |
| Todas | Pull requests da sprint | _a preencher_ | -->

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
- [DoR e DoD da Sprint](../documentacao-produto/DoR_e_DoD_sprint1.pdf)

## 🎥 Link do Vídeo <a id="link-do-Video"></a>

Neste vídeo é mostrado todo o desenvolvimento da <strong>*Plataforma de Controle de Motoristas Agregados*</strong>, feito pela equipe <strong>*OmniDevs*</strong> ao decorrer do ciclo da 1ª (primeira) Sprint.

<a href="https://www.youtube.com/watch?v=BLwNPkoQqVA"><img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white"/></a>

## 👥 **Equipe** <a id="equipe"></a>

| Foto | Nome | Função | GitHub |
| :---: | :--- | :--- | :---: |
| <img src="https://github.com/Marcio-gustavoI.png" width=50px alt="Foto do Márcio"> | **Márcio Inocêncio** | Product Owner | <a href="https://github.com/Marcio-gustavoI"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
| <img src="https://github.com/DeveloperCorsair.png" width=50px alt="Foto do Henrique"> | **Henrique Martins** | Scrum Master | <a href="https://github.com/DeveloperCorsair"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
| <img src="https://github.com/Viniciuss-Moreira.png" width=50px alt="Foto do Vinicius"> | **Vinicius Moreira** | Desenvolvedor | <a href="https://github.com/Viniciuss-Moreira"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
| <img src="https://github.com/hiGuigo.png" width=50px alt="Foto do Guilherme"> | **Guilherme Alvarenga** | Desenvolvedor | <a href="https://github.com/hiGuigo"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
| <img src="https://github.com/pedrodevroot.png" width=50px alt="Foto do Pedro"> | **Pedro Lucas** | Desenvolvedor | <a href="https://github.com/pedrodevroot"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
| <img src="https://github.com/ThOMaZMe11o.png" width=50px alt="Foto do Thomaz"> | **Thomaz De Mello** | Desenvolvedor | <a href="https://github.com/ThOMaZMe11o"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
| <img src="https://github.com/Yuri-Dev-OH.png" width=50px alt="Foto do Yuri"> | **Yuri Gonçalves** | Desenvolvedor | <a href="https://github.com/Yuri-Dev-OH"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |