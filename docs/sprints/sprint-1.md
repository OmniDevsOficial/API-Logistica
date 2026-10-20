<h1 align="center"> Documentação do Produto da Sprint 1 </h1>

<div align="center">
    <img src="https://i.imgur.com/VbBN3Tk.jpeg" width="170x" height="170x" style="border-radius:20%;">
</div>

<p align="center">|
  <a href="#visao geral"> Visão Geral </a> |
  <a href="#sprint-1-meta"> Metas Sprint 1 </a> |
  <a href="#backlog-sprint-1"> Backlog da Sprint 1 </a> |
  <a href="#documentos"> Documentos </a> |
  <a href="#link-do-Video"> Link do Vídeo </a> |
  <a href="#equipe"> Equipe </a> |
</p>

## Visão geral <a id="visao-geral"></a>

A Sprint 1 concentrou-se em conectar as funcionalidades operacionais do
sistema logístico ao dashboard: importação de manifestos, consulta e
filtragem de viagens, indicadores por motorista e integração do
dashboard com o backend.

<!-- As subtarefas listadas neste relatório aparecem como **Concluído** no
Jira. O material fornecido contém os objetivos e critérios de aceite das
issues, mas não inclui logs de execução, resultados individuais dos
testes automatizados, capturas de tela ou links para pull requests. Por
isso, o status registrado no Jira é apresentado como situação da tarefa;
não se afirma que evidências técnicas não fornecidas tenham sido
verificadas independentemente. -->


## 📅 Cronograma da Sprint

| Período | Status |
| :---------: | :---------: |
| 07/09 - 27/09 | 🟢 Concluído |

## 🎯 Metas da Sprint 1 <a id="sprint-1-meta"></a>

| Foco | User Story Meta |
| :---: | :--- |
| 🥇 | **US01:**  Como operador, quero exportar a planilha da análise obtida e importá-la no sistema, para não perder o fluxo já usado. |
| 🥈 | **US02:** Como operador, quero importar o relatório de manifesto para popular viagens automaticamente. |

## 📋 Backlog da Sprint 1 <a id="backlog-sprint-1"></a>

| Rank | ID | Prioridade | User Story | Estimativa |
| :---: | :---: | :---: | :--- | :---: |
| 🎗 1 | US01 | Alta | Como operador, quero exportar a planilha da análise obtida e importá-la no sistema, para não perder o fluxo já usado. | 4 |
| 🎗 2 | US02 | Alta | Como operador, quero importar o relatório de manifesto para popular viagens automaticamente. | 4 |
| 🎗 3 | US04 | Alta |  Como operador, quero filtrar viagens por destino/região, para entender a demanda por rota. | 4 |
| 🎗 4 | US06 | Alta | Como operador, quero ver a % de utilização de cada motorista, para evitar a desocupação de frotas. | 3 |
| 🎗 5 | US03 | Alta | Como gestor, quero visualizar quantas viagens cada motorista fez no mês, para medir a frequência de contratação. | 4 |


## 📂 Documentos e anexos <a id="documentos"></a>
 
- [Cenários de User Stories](../documentacao-produto/Cenarios_sprint1.pdf)
- [Backlog completo](../documentacao-produto/Backlog.pdf)
- [DoR e DoD da Sprint](../documentacao-produto/DoR_e_DoD_sprint1.pdf)

## 🎥 Link do Vídeo <a id="link-do-Video"></a>
Neste vídeo é mostrado todo o desenvolvimento da <strong>*Plataforma de Controle de Motoristas Agregados*</strong>, feito pela equipe <strong>*OmniDevs*</strong> ao decorrer do ciclo da 1°(primeira) Sprint.

<a href="https://www.youtube.com/watch?v=BLwNPkoQqVA"><img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white"/></a> 

## 2. Funcionalidades entregues

### 2.1. Importação de manifesto

**Story relacionada:** OM-71\
**Subtarefas:** OM-72 (backend) e OM-73 (frontend)

**Objetivo**

Permitir que o operador importe um relatório de manifesto para cadastrar
viagens em lote, evitando o preenchimento manual de cada viagem.

**Escopo do backend --- OM-72**

-   Criar o endpoint `POST /viagens/importar-manifesto`.
-   Receber os dados JSON retornados pelo microserviço de processamento
    do manifesto.
-   Mapear os dados recebidos para os campos existentes na tabela de
    viagens.
-   Validar os campos obrigatórios: manifesto, CPF, data e valor do
    frete.
-   Retornar erro com a mensagem `manifesto inválido ou incompleto`
    quando os dados obrigatórios estiverem ausentes.
-   Tratar veículo e destino como opcionais: quando não houver veículo
    correspondente no cadastro, a placa deve ser gravada como `null`;
    destino vazio também deve ser gravado como `null`.
-   Limitar o arquivo enviado a 10 MB.
-   Desconsiderar o campo de origem no mapeamento previsto pela tarefa.

**Escopo do frontend --- OM-73**

-   Disponibilizar upload do manifesto no dashboard, por seleção de
    arquivo ou arrastar e soltar.
-   Aceitar arquivos `.xlsx` e `.csv`, validando a extensão antes do
    envio.
-   Integrar o envio ao backend.
-   Exibir confirmação com a quantidade de viagens importadas.
-   Apresentar mensagens compreensíveis para erros de arquivo,
    indisponibilidade do backend e outras falhas de importação.

**Critérios de aceite registrados**

-   Testes unitários para garantir consistência do mapeamento entre
    entrada e saída.
-   Validação dos campos obrigatórios e tratamento dos campos opcionais.
-   Limite de upload de 10 MB.
-   Upload restrito a `.xlsx` e `.csv`, feedback de sucesso e tratamento
    amigável de erros.

**Situação no Jira:** OM-72 e OM-73 --- **Concluído**.

**Evidências técnicas:** não foram incluídos no material os resultados
dos testes, exemplos de requisição/resposta ou capturas do fluxo de
upload.

### 2.2. Total de viagens por motorista

**Story relacionada:** OM-3\
**Subtarefas:** OM-74 (backend) e OM-75 (frontend)

**Objetivo**

Exibir a quantidade de viagens de cada motorista em um período
selecionado e permitir consultar as viagens que compõem o total.

**Escopo do backend --- OM-74**

-   Criar um endpoint de listagem, previsto como
    `GET /indicadores/viagens-por-motorista?periodo=`.
-   Calcular o total de viagens por motorista no período informado.
-   Recalcular os totais quando o período mudar.
-   Incluir motoristas sem viagens no período, retornando total igual a
    `0`, em vez de removê-los da resposta.
-   Garantir a consistência da contagem por meio de testes unitários.

**Escopo do frontend --- OM-75**

-   Exibir a lista de motoristas e o total de viagens no período.
-   Disponibilizar seletor de período e atualizar a lista por nova
    chamada ao endpoint, sem recarregar a página.
-   Permitir clicar no total de um motorista para abrir o detalhamento
    das viagens individuais.
-   Exibir normalmente motoristas com total igual a zero.
-   Integrar a listagem aos endpoints de viagens existentes.

**Critérios de aceite registrados**

-   Contagem consistente para o mesmo conjunto de dados.
-   Atualização dos resultados ao alterar o período.
-   Inclusão de motoristas sem viagens.
-   Abertura do detalhamento das viagens de um motorista a partir do
    total exibido.

**Situação no Jira:** OM-74 e OM-75 --- **Concluído**.

**Evidências técnicas:** o material não contém payloads de exemplo,
resultados de testes ou capturas da tela de detalhamento.

### 2.3. Filtro de viagens por destino/região

**Story relacionada:** OM-4\
**Subtarefas:** OM-76 (backend) e OM-77 (frontend)

**Objetivo**

Permitir que o operador filtre as viagens por destino ou região e
visualize a lista atualizada sem recarregar a página.

**Escopo do backend --- OM-76**

-   Incluir os campos de origem e destino na estrutura de viagem,
    conforme descrito na tarefa.
-   Disponibilizar consulta de viagens com filtros, com exemplo de
    endpoint `GET /viagens?destino=&regiao=&mes=`.
-   Permitir combinar filtros, como destino e período.
-   Retornar uma lista vazia sem erro quando não houver
    correspondências.
-   Criar testes unitários.

**Escopo do frontend --- OM-77**

-   Criar um componente de filtro, preferencialmente em modal, na tela
    de viagens.
-   Consumir o endpoint de filtragem.
-   Atualizar a lista ou gráfico de forma assíncrona, sem recarregar a
    página.
-   Exibir mensagem clara quando nenhum resultado for encontrado.
-   Fazer o filtro funcionar em conjunto com os demais filtros
    existentes na tela.

**Critérios de aceite registrados**

-   Suporte a filtros combinados.
-   Resposta vazia tratada sem erro quando não houver resultados.
-   Testes unitários no backend.
-   Atualização assíncrona da interface e mensagem de ausência de
    resultados no frontend.

**Situação no Jira:** OM-76 e OM-77 --- **Concluído**.

**Evidências técnicas:** não foram fornecidos exemplos de chamadas com
filtros combinados, resultados de testes ou capturas da interface.

### 2.4. Percentual de utilização por motorista

**Story relacionada:** OM-6\
**Subtarefas:** OM-78 (backend) e OM-79 (frontend)

**Objetivo**

Calcular e apresentar a porcentagem de utilização de cada motorista em
um período, com opção de ordenar os resultados.

**Regra de cálculo definida na tarefa**

-   **Dias em operação:** quantidade de dias distintos com viagem
    registrada no período.
-   **Dias disponíveis:** valor obtido do cadastro do motorista para o
    período.
-   **Percentual de utilização:** dias em operação ÷ dias disponíveis no
    período × 100.

**Escopo do backend --- OM-78**

-   Criar endpoint previsto como
    `GET /indicadores/utilizacao?periodo=&ordenacao=`.
-   Recalcular os indicadores conforme o período recebido, sem
    reutilizar indevidamente o resultado de outro período.
-   Permitir ordenação crescente e decrescente pelo percentual.
-   Criar testes unitários.
-   Tratar motorista sem viagens com utilização de `0%`.
-   Tratar dias disponíveis iguais a zero como situação sem dados, sem
    provocar divisão por zero.

**Escopo do frontend --- OM-79**

-   Exibir a lista de motoristas e seus percentuais de utilização.
-   Disponibilizar seletor de período e atualizar os dados sem
    recarregar a página.
-   Permitir ordenar do maior para o menor percentual e vice-versa.
-   Exibir mensagens claras para casos como ausência de viagens no
    período ou falta de dados de disponibilidade.

**Critérios de aceite registrados**

-   Testes unitários.
-   Recálculo correto ao mudar o período.
-   Ordenação crescente e decrescente.
-   Tratamento dos casos sem viagens e sem dados de disponibilidade.

**Situação no Jira:** OM-78 e OM-79 --- **Concluído**.

**Evidências técnicas:** o material não contém valores de exemplo,
resultados de testes ou capturas do componente gráfico.

### 2.5. Integração do dashboard com o backend

**Subtarefa:** OM-98\
**Story relacionada no Jira:** OM-3

**Objetivo**

Substituir os dados simulados da tela principal por dados reais do
backend, conectando os quadrantes do dashboard aos endpoints
correspondentes.

**Escopo e critérios de aceite registrados**

-   Conectar os quadrantes disponíveis do dashboard aos endpoints e
    parâmetros correspondentes.
-   Verificar no banco de dados os campos monetários para garantir que
    sejam tratados como valores decimais ou inteiros, e não como `float`
    ou `double`.
-   Para indicadores ainda sem endpoint ou função de backend, exibir `-`
    ou deixar o campo em branco.
-   Garantir que o filtro de datas retorne dados correspondentes ao
    período selecionado.

**Situação no Jira:** OM-98 --- **Concluído**.

**Evidências técnicas:** não foram fornecidos mapeamento dos quadrantes
para os endpoints, exemplos de respostas ou resultados de validação dos
valores monetários.

## 3. Resumo das issues

  -------------------------------------------------------------------------
  Issue             Responsabilidade   Resultado/escopo   Status no Jira
                                       registrado         
  ----------------- ------------------ ------------------ -----------------
  OM-72             Backend ---        Endpoint,          Concluído
                    importação de      mapeamento,        
                    manifesto          validações e       
                                       limite de arquivo  

  OM-73             Frontend ---       Upload,            Concluído
                    importação de      integração,        
                    manifesto          feedback de        
                                       sucesso e erros    

  OM-74             Backend ---        Contagem por       Concluído
                    viagens por        período, incluindo 
                    motorista          total zero         

  OM-75             Frontend ---       Lista, seletor de  Concluído
                    viagens por        período e          
                    motorista          detalhamento       

  OM-76             Backend --- filtro Consulta por       Concluído
                    de viagens         destino/região e   
                                       filtros combinados 

  OM-77             Frontend ---       Modal, atualização Concluído
                    filtro de viagens  assíncrona e       
                                       estado sem         
                                       resultados         

  OM-78             Backend ---        Cálculo            Concluído
                    utilização de      percentual,        
                    motoristas         ordenação e casos  
                                       extremos           

  OM-79             Frontend ---       Lista, período,    Concluído
                    utilização de      ordenação e        
                    motoristas         mensagens de       
                                       estado             

  OM-98             Integração do      Conexão dos        Concluído
                    dashboard          quadrantes a dados 
                                       reais e filtro de  
                                       datas              
  -------------------------------------------------------------------------

## 4. Resultado consolidado

De acordo com o status do Jira, as subtarefas fornecidas para a Sprint 1
foram concluídas. O escopo registrado abrange:

-   Importação de manifestos para cadastro de viagens.
-   Consulta de total de viagens por motorista e detalhamento.
-   Filtragem de viagens por destino/região e combinação de parâmetros.
-   Cálculo e visualização do percentual de utilização dos motoristas.
-   Integração do dashboard com o backend e tratamento de valores
    monetários e períodos.

## 5. Pendências de evidência para uma prestação de contas técnica

O Jira fornecido registra as tarefas como concluídas, mas não contém
evidências suficientes para afirmar, de forma independente, que cada
critério foi validado em execução. Para fechar a documentação técnica
com rastreabilidade, anexar ou referenciar, quando disponíveis:

1.  Resultado da execução dos testes unitários e de integração.
2.  Exemplos de requisições e respostas dos endpoints.
3.  Capturas das telas de upload, filtros, lista por motorista e
    utilização.
4.  Pull requests ou commits associados às issues.
5.  Evidência de validação do filtro de datas e dos tipos numéricos
    usados nos valores monetários.

Esses itens são recomendações de documentação e **não** indicam que as
funcionalidades estejam necessariamente pendentes; apenas não constam no
material recebido para este relatório.

## 6. Referências Jira

-   [OM-72 --- Backend: importação de
    manifesto](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-72)
-   [OM-73 --- Frontend: importação de manifesto no
    dashboard](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-73)
-   [OM-74 --- Total de viagens por motorista no
    período](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-74)
-   [OM-75 --- Lista de viagens por
    motorista](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-75)
-   [OM-76 --- Backend: filtro na tabela de
    viagens](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-76)
-   [OM-77 --- Frontend: modal com filtros na tela de
    viagens](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-77)
-   [OM-78 --- Cálculo de utilização por
    motorista](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-78)
-   [OM-79 --- Visualização gráfica da utilização de
    motoristas](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-79)
-   [OM-98 --- Integração do dashboard com o
    backend](https://vinnismoreira-1787621786306.atlassian.net/browse/OM-98)
    
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
