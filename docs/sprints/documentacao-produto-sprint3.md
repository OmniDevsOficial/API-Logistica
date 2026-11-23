<h1 align="center"> Documentação da Sprint 3 </h1>

<div align="center">
    <img src="https://i.imgur.com/VbBN3Tk.jpeg" width="170x" height="170x" style="border-radius:20%;">
</div>

<p align="center">|
  <a href="#visao-geral"> Visão Geral </a> |
  <a href="#sprint-3-meta"> Metas </a> |
  <a href="#backlog-sprint-3"> Backlog </a> |
  <a href="#dor-dod"> DoR e DoD </a> |
  <a href="#desenvolvimento"> Desenvolvimento </a> |
  <a href="#retrospectiva"> Retrospectiva </a> |
  <a href="#documentos"> Documentos </a> |
  <a href="#link-do-video"> Vídeo </a> |
  <a href="#equipe"> Equipe </a> |
</p>

## Visão geral <a id="visao-geral"></a>

A Sprint 3 concentra-se em fechar as pendências da Sprint 2 e completar o núcleo de veículos e rentabilidade da plataforma: importação da planilha de veículos, comparativo de rentabilidade por tipo de veículo, ranking mensal de motoristas, histórico de viagens por motorista e pagamento consolidado por motorista (dependente de definição do cliente).

Também entram tarefas de complemento em telas já existentes, como gerenciamento de usuários, tela de administração, histórico de importações, página de veículos e ajustes do ranking.

## 📅 Cronograma da Sprint

|    Período    |     Status      |
| :-----------: | :-------------: |
| 02/11 - 22/11 | 🟢 Encerrada |

## 🎯 Metas da Sprint 3 <a id="sprint-3-meta"></a>

| Foco | User Story Meta                                                                                                    |
| :--: | :----------------------------------------------------------------------------------------------------------------- |
|  🥇  | **US12:** Importação automática da planilha de veículos, base para a rentabilidade por tipo de veículo.            |
|  🥈  | **US11:** Como gestor, quero comparar a rentabilidade entre tipos de veículo, para decisões estratégicas de frota. |

## 📋 Backlog da Sprint 3 <a id="backlog-sprint-3"></a>

| Rank  |  ID  | Prioridade | User Story                                                                                                                   | Estimativa | Sprint |  Situação  |
| :---: | :--: | :--------: | :--------------------------------------------------------------------------------------------------------------------------- | :--------: | :----: | :--------: |
| 🎗 3  | US11 |   Média    | Como gestor, quero comparar a rentabilidade entre tipos de veículo, para decisões estratégicas de frota.                     |     3      |   3    | 🟢 Entregue |
| 🎗 4  | US17 |   Média    | Como operador, quero visualizar o histórico detalhado de viagens de um motorista, para consultar as suas operações passadas. |     5      |   3    | 🟢 Entregue |
| 🎗 6  | US10 |   Média    | Como gestor, quero ver quanto cada motorista recebeu no mês, para controle de pagamento. _(aguardando definição)_            |     3      |   3    | 🟢 Entregue |
| 🎗 2  | US12 |   Baixa    | Como operador, quero importar a planilha de veículos para cadastrar a frota automaticamente.                                 |     3      |   3    | 🟢 Entregue |
| 🎗 5  | US13 |   Baixa    | Como gestor, quero um ranking mensal de motoristas, para identificar os melhores resultados.                                 |     3      |   3    | 🟢 Entregue |

## ✅ DoR e DoD da Sprint <a id="dor-dod"></a>

**🚀 Definition of Ready (DoR)** — quando uma história está pronta para entrar na sprint:

- A história de usuário possui valor de negócio claro e definido.
- Os critérios de aceitação e as regras de negócio estão documentados no ticket.
- Os cenários de teste (BDD) estão descritos para orientar o desenvolvimento.
- O esforço (estimativa) foi pontuado pela equipe.

**✔️ Definition of Done (DoD)** — quando uma história está concluída:

- O código foi implementado e atende a todos os critérios de aceitação.
- O código passou por Code Review (Pull Request aprovado por no mínimo 1 membro da equipe, sem aprovação do próprio autor).
- Os testes foram executados e validados no backend.
- A nova funcionalidade não quebrou funcionalidades anteriores.
- A documentação da sprint foi atualizada.

## 🛠️ Desenvolvimento da Sprint <a id="desenvolvimento"></a>

Resumo de tudo o que será desenvolvido na sprint, organizado por User Story e vinculado às respectivas issues do Jira.

### Visão geral das tasks

|       US       | Story Jira | Issue (Subtask) |    Tipo    | O que será feito                                                                                                                                          | Responsável |   Status   | Jira |
| :------------: | :--------: | :-------------: | :--------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------: | :--------: | :--: |
|    Ajustes     |     OM-122      |        OM-135        |    Front   | Remover campos de estimativa na tela de viagens                                                     |      Guilherme Alvarenga      | 🟢 Concluída | [OM-135](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-135)   |
|    Ajustes     |     OM-122      |        OM-136        |    Back    | Ajustar o cálculo da quilometragem na tela de viagens                                               |      Guilherme Alvarenga      | 🟢 Concluída |  [OM-136](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-136)   |
|    Ajustes     |     OM-122      |        OM-137        |    Back    | Arrumar o cálculo de frequência na tela motorista                                                   |      Guilherme Alvarenga      | 🟢 Concluída |  [OM-137](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-137)   |
|    Ajustes     |     OM-122      |        OM-138        |    Front   | Implementar o modo escuro manual                                                                    |      Thomaz Mello      | 🟢 Concluída |  [OM-138](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-138)   |
|      US12      |     OM-124      |        OM-126        |    Back    | Import do manifesto de veículo                                                                      |      Yuri Gonçalves      | 🟢 Concluída |  [OM-125](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-125)   |
|      US12      |     OM-124      |        OM-126        |    Front   | Tela de upload da planilha de veículos, com estados de carregamento e feedback                                                                            |      Yuri Gonçalves      | 🟢 Concluída |  [OM-126](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-126)   |
|      US11      |     OM-11      |        OM-127        |    Back    | Endpoint de rentabilidade agrupada por tipo de veículo, com filtro mensal e acesso restrito ao Gestor                                                     |      Thomaz Mello      | 🟢 Concluída |  [OM-127](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-127)   |
|      US11      |     OM-11      |        OM-128        |   Front    | Card de rentabilidade por tipo de veículo no dashboard principal                                                                                          |      Thomaz Mello      | 🟢 Concluída |  [OM-128](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-128)   |
|      US17      |     OM-123      |        OM-133        |    Back    | Endpoint de histórico de viagens por motorista, paginado e com status derivado                                                                            |      Pedro Lucas      | 🟢 Concluída |  [OM-133](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-133)   |
|      US17      |     OM-123      |        OM-134        |   Front    | Modal de histórico de viagens do motorista, aberto pela listagem de disponibilidade e pelo ranking                                                        |      Pedro Lucas      | 🟢 Concluída |  [OM-134](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-134)   |
|      US13      |     OM-13      |        OM-129        |    Back    | Endpoint do ranking mensal de motoristas, com ordenação em um único ponto                                                                                 |      Vinicíus Moreira      | 🟢 Concluída |  [OM-129](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-129)   |
|      US13      |     OM-13      |        OM-130        |   Front    | Interface do ranking com pódio e lista, e acesso ao modal da US17                                                                                         |      Vinicíus Moreira      | 🟢 Concluída |  [OM-130](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-130)   |
|      US10      |     OM-10      |        OM-131        |    Back    | Endpoint de pagamento consolidado por motorista                                                                        |      Yuri Gonçalves      | 🟢 Concluída |  [OM-131](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-131)   |
|      US10      |     OM-10      |        OM-132        |   Front    | Dado de pagamento na visão financeira do Gestor                                                                                           |      Yuri Gonçalves      | 🟢 Concluída |  [OM-132](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-132)   |
|  Compl. US15   |     OM-12      |        OM-139        |    Back    | Cadastro e listagem de usuários no serviço de autenticação                                                                                                |      Thomaz Mello      | 🟢 Concluída |  [OM-139](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-139)   |
|  Compl. US15   |     OM-12      |        OM-140        |   Front    | Tela de Configurações (estrutura geral, com seções registradas)                                                                                           |      Thomaz Mello      | 🟢 Concluída |  [OM-140](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-140)   |
|  Compl. US15   |     OM-12      |        OM-141        |   Front    | Configurações > Usuários (lista e cadastro)                                                                                                               |      Thomaz Mello      | 🟢 Concluída |  [OM-141](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-141)   |
|  Compl. US12   |     OM-146      |        OM-147        |    Back    | Endpoints de listagem e resumo de veículos para a página de veículos                                                                                      |      Thomaz Mello      | 🟢 Concluída |  [OM-147](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-147)   |
|  Compl. US12   |     OM-146      |        OM-148        |   Front    | Guia de veículos no dashboard, com upload movido para a sidebar                                                                                           |      Thomaz Mello      | 🟢 Concluída |  [OM-148](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-148)   |
|  Compl. US12   |     OM-142      |        OM-143        |    Back    | Histórico de importações do manifesto (serviço Relatório)                                                                                                 |      Vinicíus Moreira      | 🟢 Concluída |  [OM-143](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-143)   |
|  Compl. US12   |     OM-142      |        OM-144        |    Back    | Histórico de importações de veículos (serviço Operacional)                                                                                                |      Vinicíus Moreira      | 🟢 Concluída |  [OM-144](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-144)   |
|  Compl. US12   |     OM-142      |        OM-145        |   Front    | Seção Registros: lista de importações com cards, filtros e tabela                                                                                         |      Vinicíus Moreira      | 🟢 Concluída |  [OM-145](https://vinnismoreira-1787621786306.atlassian.net/jira/browse/OM-145)   |

### Detalhamento por User Story

#### Ajustes da Sprint 2 — Fechamento das pendências

A Sprint 2 terminou com tarefas em revisão e pendências de fórmula e integração. Esta frente fecha essas pendências antes de puxar novas histórias.

- **US07:** confirmar com o cliente a fórmula da baixa utilização e finalizar o cálculo do alerta.
- **US14:** integrar o ranking de destinos ao componente visual e ajustar o rótulo de exibição.
- **Revisão:** fazer o merge dos PRs abertos (card Disponíveis e ordenação de rentabilidade por motorista).

<details>
<summary><b>Critérios de aceite dos ajustes da Sprint 2</b></summary>

|     | Critério                                                                           |
| :-: | :--------------------------------------------------------------------------------- |
| ✅  | Fórmula da baixa utilização confirmada com o cliente e aplicada no alerta da US07. |
| ✅  | Ranking de destinos integrado ao componente visual, com rótulo ajustado (US14).    |
| ✅  | Todos os PRs abertos da Sprint 2 revisados e mesclados.                            |

</details>

#### US12 — Importação automática da planilha de veículos

Permite cadastrar a frota em lote pela planilha de veículos, com atualização da base sem inserção manual. É a base da US11 e da página de veículos.

- **Back (serviço Operacional):** endpoint de upload do CSV com parse e UPSERT por placa, criando veículos e motoristas ausentes e relacionando placa e tipo ao motorista.
- **Front:** interface de upload com estado de carregamento e feedback de sucesso ou erro.

<details>
<summary><b>Critérios de aceite da US12</b></summary>

|     | Critério                                                                        |
| :-: | :------------------------------------------------------------------------------ |
| ✅  | O sistema lê o CSV padrão de veículos.                                          |
| ✅  | Veículos e motoristas ausentes são cadastrados automaticamente.                 |
| ✅  | Placa e tipo de veículo ficam relacionados ao motorista correto.                |
| ✅  | Reimportar a planilha atualiza os dados sem duplicar motoristas ou veículos.    |
| ✅  | Feedback visual claro em caso de sucesso, erro no arquivo ou linhas rejeitadas. |

</details>

#### US11 — Comparação de rentabilidade entre tipos de veículo

Consolida a rentabilidade agrupada por categoria de veículo (ex.: Fiorino, Van, VUC, Truck, Carreta), para apoiar decisões estratégicas de frota. Não tem tela própria: vira um card no dashboard principal.

- **Back (serviço Operacional):** endpoint que agrupa as viagens do mês pelo tipo do veículo e devolve receita, custo, rentabilidade e média por viagem. Viagens de placa sem tipo cadastrado entram em "Não identificado".
- **Front:** card de barras no dashboard, restrito ao perfil Gestor, com tooltip e estados de carregamento, vazio e erro.

<details>
<summary><b>Critérios de aceite da US11</b></summary>

|     | Critério                                                                              |
| :-: | :------------------------------------------------------------------------------------ |
| ✅  | Rentabilidade (receitas − custos) agrupada corretamente por tipo de veículo.          |
| ✅  | A consolidação respeita o filtro mensal do dashboard.                                 |
| ✅  | Viagens sem tipo cadastrado aparecem em "Não identificado" e não somem da soma total. |
| ✅  | Visualização restrita ao perfil Gestor.                                               |

</details>

#### US17 — Histórico de viagens e modal do motorista

Permite consultar o histórico detalhado de viagens de um motorista específico, para analisar o desempenho e as operações passadas.

- **Back (serviço Operacional):** endpoint paginado com as viagens (concluídas e em andamento) vinculadas ao motorista, ordenadas da mais recente para a mais antiga.
- **Front:** modal compartilhado, aberto pelo card do motorista na listagem de disponibilidade (US05) e pelo ranking (US13).

<details>
<summary><b>Critérios de aceite da US17</b></summary>

|     | Critério                                                                      |
| :-: | :---------------------------------------------------------------------------- |
| ✅  | O modal abre ao clicar no nome ou card do motorista.                          |
| ✅  | Lista origem, destino, datas e status das viagens, incluindo as em andamento. |
| ✅  | Acesso liberado para Operador e Gestor.                                       |

</details>

#### US13 — Ranking mensal de motoristas

Gera um ranking gerencial dos motoristas no mês, com pódio para os primeiros e lista para os demais, na visão de gamificação pedida pelo cliente.

- **Back (serviço Operacional):** endpoint com rentabilidade média (US09), número de viagens e frequência, ordenado em um único ponto. Após a US13 ser entregue, a regra de ordenação pode ser trocada sem alterar a API.
- **Front:** pódio (1º, 2º, 3º) e lista dos demais, restritos ao Gestor, com clique que abre o modal da US17.
- **Complemento (ajustes):** botão de filtro de seleção única (rentabilidade, faturamento, número de viagens e tipo de veículo), com ordenação do maior para o menor; remoção do campo de frequência; e ajustes de layout e numeração de posição.

<details>
<summary><b>Critérios de aceite da US13</b></summary>

|     | Critério                                                     |
| :-: | :----------------------------------------------------------- |
| ✅  | Ranking gerado e filtrado pelo mês selecionado.              |
| ✅  | Motoristas ordenados de forma decrescente pelo filtro ativo. |
| ✅  | Apenas um filtro selecionado por vez.                        |
| ✅  | Pódio e listagem com posição visível de cada motorista.      |
| ✅  | Campo de frequência removido da tela de ranking.             |
| ✅  | Visualização e acesso restritos ao perfil Gestor.            |

</details>

#### US10 — Controle de pagamento do motorista

Apresenta o valor total a ser pago a cada motorista no mês, para controle financeiro e repasse. A fórmula exata ainda depende de validação com o cliente, então esta frente é preliminar.

- **Back (serviço Operacional):** endpoint que soma o valor devido por motorista no período. A fórmula fica isolada em um único método para ser trocada quando for definida.
- **Front:** valor a pagar por motorista na visão financeira do Gestor.

<details>
<summary><b>Critérios de aceite da US10</b></summary>

|     | Critério                                                                  |
| :-: | :------------------------------------------------------------------------ |
| ✅  | Soma consolidada por motorista dentro do mês selecionado.                 |
| ✅  | Fórmula do pagamento validada com o cliente e aplicada em um único ponto. |
| ✅  | Acesso restrito ao perfil Gestor.                                         |

</details>

#### Complementos da US15 — Gerenciamento de usuários e Configurações

Cadastro simples de usuários para o Gestor e a tela de Configurações que o abriga. Complementa a US15 (login e perfis), sem alterar seu escopo.

- **Back (serviço de autenticação):** `POST /usuarios` e `GET /usuarios`, restritos ao Gestor. Senha com BCrypt, login único sem diferença de maiúsculas, sem edição, exclusão ou redefinição de senha nesta sprint.
- **Front:** página `/configuracoes` com navegação por seções (visível só ao Gestor). A seção Usuários lista os usuários e abre um modal de cadastro com validação no cliente.

<details>
<summary><b>Critérios de aceite dos complementos da US15</b></summary>

|     | Critério                                                                                             |
| :-: | :--------------------------------------------------------------------------------------------------- |
| ✅  | Gestor cadastra usuário com nome, login, perfil e senha, e a senha nunca aparece em resposta ou log. |
| ✅  | Login repetido (sem diferença de maiúsculas) retorna erro claro.                                     |
| ✅  | Tela de Configurações acessível só ao Gestor, com URL própria por seção.                             |
| ✅  | Operador recebe 403 nos endpoints e é redirecionado da tela.                                         |

</details>

#### Complementos da US12 — Página de veículos no dashboard

Página com a lista completa dos veículos e o resumo por tipo, dentro do dashboard, para que o Gestor consulte os dados do CSV sem uma página separada. O upload sai do dashboard e passa para a sidebar.

- **Back (serviço Operacional):** `GET /veiculos` (paginado, com filtro por tipo e busca por placa ou motorista) e `GET /veiculos/resumo` (totais e contagem por tipo). Sem dados, ambos respondem 200.
- **Front:** guia de veículos no dashboard, sempre visível, com o mesmo estado vazio da tela atual quando não há dados. Responsiva.

<details>
<summary><b>Critérios de aceite dos complementos da US12 (página de veículos)</b></summary>

|     | Critério                                                                         |
| :-: | :------------------------------------------------------------------------------- |
| ✅  | Sem veículos cadastrados, a página mostra o mesmo tratamento do dashboard atual. |
| ✅  | O guia é fixo, independente dos dados na plataforma.                             |
| ✅  | A página de veículos é responsiva.                                               |
| ✅  | O botão de upload fica na sidebar e o endpoint de upload não muda.               |

</details>

#### Complementos da US12 — Registros (histórico de importações)

Seção Registros com o histórico de cada importação de manifesto e de veículos, com status, contadores, usuário, filtros e detalhe das linhas rejeitadas e duplicadas.

- **Back:** cada serviço grava o próprio histórico (Relatório para o manifesto, Operacional para veículos), com hash do arquivo para detectar reimportações.
- **Front:** lista com cards da última importação, filtros e tabela; detalhe com ocorrências e download em CSV.

<details>
<summary><b>Critérios de aceite dos complementos da US12 (Registros)</b></summary>

|     | Critério                                                                                    |
| :-: | :------------------------------------------------------------------------------------------ |
| ✅  | Toda importação gera um registro, e falha ao gravar o registro não interrompe a importação. |
| ✅  | Reimportação do mesmo arquivo é identificada.                                               |
| ✅  | Detalhe lista as ocorrências, e o CSV baixado abre com acentos corretos no Excel.           |
| ✅  | Falha de um dos serviços não esconde os dados do outro.                                     |

</details>


## 🔍 Retrospectiva <a id="retrospectiva"></a>

**O que deu certo**

- Importação do csv de veículos funcionando de ponta a ponta, atualizando tanto o dashboard inicial, quanto o guia de veículos.
- Ranking de motoristas concluído e mostrando as informações mais importantes para o cliente.
- Histórico de importações para csv de manifestos e veículos, identificando hora, data e quem fez o upload.

**O que não deu certo**

- A sprint ficou abaixo do esperado em organização, distribuição das tasks e entrega de tarefas dentro do prazo estabelecido.

## 📂 Documentos e anexos <a id="documentos"></a>

- [Cenários de User Stories](../documentacao-processo/Cenarios_Sprint_3.pdf)
- [Backlog completo](../documentacao-processo/Backlog.pdf)

## 🎥 Link do Vídeo <a id="link-do-video"></a>

Neste vídeo é mostrado o desenvolvimento da **Plataforma de Controle de Motoristas Agregados**, feito pela equipe **OmniDevs** ao decorrer do ciclo da 3ª (terceira) Sprint.

<a href="https://www.youtube.com/watch?v=ub_1o-uZBoA"><img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white"/></a>

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
