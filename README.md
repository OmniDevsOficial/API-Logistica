# <p align="center">**Plataforma de Controle de Motoristas Agregados**</p>
<p align="center">
  <img src="https://i.imgur.com/VbBN3Tk.jpeg" width="170x" height="170x" style="border-radius:20%;">
</p>
<div align="center">
  <strong>OMINIDEVS LOG</strong><br>
  Sistema para consumir dados e visualizar informações, proporcionando uma análise objetiva e apoiando a tomada de decisões.
</div>
<div align="center">
                                                                                                                                                                                                                               

<a href="#problema">Problema</a> • <a href="#solucao">Solução</a> • <a href="#backlog">Backlog</a> • <a href="#cronograma">Cronograma de Sprints</a> • <a href="#definition-of-ready-dor">DoR</a> • <a href="#definition-of-done-dod">DoD</a> • <a href="#tecnologias">Tecnologias</a> • <a href="fluxo-de-trabalho">Fluxo de Trabalho</a> • <a href="#equipe">Equipe</a> |
</div>


## 📌 **Problema** <a id="problema"></a>

A transportadora não tem visibilidade consolidada sobre os motoristas agregados. Não sabe facilmente quais motoristas estão sendo mais utilizados, quais estão disponíveis para novas viagens, e quais operações geram melhor retorno financeiro. Hoje a análise não relaciona viagens realizadas, disponibilidade e rentabilidade de forma integrada, o que impede direcionar melhor as viagens e evitar ociosidade da frota.

## 📌 **Solução** <a id="solucao"></a>

A proposta é um jeito simples e visual de acompanhar motoristas agregados, cruzando quantas viagens cada um fez, se está disponível pra novas operações e quanto retorno cada viagem realmente trouxe. Com isso, o time enxerga rápido quem está livre para pegar uma nova viagem (sem deixar ninguém parado à toa) e quem está trazendo o melhor resultado financeiro. 



## 📝 **Backlog do Produto** <a id="backlog"></a>

Parceiro: Newelog

| Rank | ID | Prioridade | User Story | Estimativa | Sprint |
|:---:|:---:|:---:|---|:---:|:---:|
| 1 | US5 | Alta | Como operador, quero ver em uma tela única quais motoristas estão disponíveis, para direcionar novas viagens rapidamente. | 4 | 1 |
| 2 | US2 | Alta | Como operador, quero importar o relatório de manifesto para popular viagens automaticamente. | 4 | 1 |
| 3 | US1 | Alta |  Como operador, quero exportar a planilha da análise obtida e importá-la no sistema, para não perder o fluxo já usado. | 4 | 1 |
| 4 | US6 | Alta | Como operador, quero ver a % de utilização de cada motorista, para evitar a desocupação de frotas. | 3 | 1 |
| 5 | US3 | Alta | Como gestor, quero visualizar quantas viagens cada motorista fez no mês, para medir a frequência de contratação. | 4 | 1 |
| 6 | US7 | Média | Como gestor, quero receber um alerta de motoristas com baixa utilização no mês, para agir sobre ociosidade. | 5 | 2 |
| 7 | US4 | Média | Como operador, quero filtrar viagens por destino/região, para entender a demanda por rota. | 4 | 2 |
| 8 | US8 | Média | Como gestor, quero registrar frete e custos de cada viagem, para calcular a rentabilidade. | 4 | 2 |
| 9 | US9 | Média | Como gestor, quero visualizar a rentabilidade média por viagem de cada motorista, para comparar desempenho. | 4 | 2 |
| 10 | US11 | Média | Como gestor, quero comparar a rentabilidade entre tipos de veículo, para decisões estratégicas de frota. | 5 | 2 |
| 11 | US10 | Média | Como gestor, quero ver quanto cada motorista recebeu no mês, para controle de pagamento. | 3 | 2 |
| 12 | US13 | Baixa | Como gestor, quero um ranking mensal de motoristas, para identificar os melhores resultados. | 4 | 3 |
| 13 | US14 | Baixa | Como gestor, quero identificar as rotas mais concorridas do mês, para criar campanhas de engajamento de motoristas. | 3 | 3 |
| 14 | US12 | Baixa | Como gestor, quero segmentar indicadores por gênero do motorista, para análise de diversidade da frota. | 3| 3 |

## 📅 **Cronograma de Sprints** <a id="cronograma"></a>

| Sprint | Período | Documentação | Status |
|:---:|:---:|:---:|:---:|
| **SPRINT 1** | 28/09 - 02/10 | [Sprint 1 docs](docs/sprints/sprint-1.md) | 🟡 Em andamento |
| **SPRINT 2** | 26/10 - 30/10 | [Sprint 2 docs](docs/sprints/sprint-2.md) | ⚪ Não iniciada |
| **SPRINT 3** | 23/11 - 27/11 | [Sprint 3 docs](docs/sprints/sprint-3.md) | ⚪ Não iniciada|

### 📋Definition of Ready (DoR) <a id="definition-of-ready-dor"></a>

| DoR |
| :--- |
| **Definição do (MVP):** Estar definido entregas de maior valor para o usuário. |
| **Critérios de Aceitação e Regras de Negócio:** Listar as condições, cobrindo o fluxo principal e os principais cenários alternativos que definem quando a história está concluída. As regras de negócio associadas devem estar detalhadas. |
| **Definição de Dados e Mensagens:** Os dados a armazenar foram bem definidos, com tipos e validações. Mensagens de confirmação, erro e aviso foram definidas. |
| **Esforço estimado:** Realizar a estimativa de esforço técnico em conjunto com a equipe com planning poker, atribuindo pontuação de esforço estimado à história. |
| **Sem impedimentos para o início:** Verificar que não há dependências externas, bloqueios técnicos ou pendências que impeçam o início do desenvolvimento da história na Sprint. |
| **Esboço visual:** O esboço visual (telas/wireframes) e a navegação estão prontas (se necessário). |

### 📋Definition of Done (DoD) <a id="definition-of-done-dod"></a>

| DoD |
| :--- |
| **Critérios de Aceitação:** Critérios de aceitação foram atendidos. |
| **Versionamento:** Código versionado seguindo o padrão gitflow. |
| **Testes:** Testes unitários validados. |
| **Code Review:** Pull Request aprovado por no mínimo 1 membro da equipe. |
| **Manuais:** O manual de usuário e o manual de instalação foram atualizados (se a funcionalidade exigir). |

## 💻 Tecnologias <a id="tecnologias"></a>

### ⚙️ Backend
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Web MVC](https://img.shields.io/badge/Spring_Web_MVC-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### 🖥️ Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)

## 🔀 Fluxo de Trabalho <a id="fluxo-de-trabalho"></a>

```text
┌──────────────────────────────────────────────┐   📋 PASSO A PASSO
│               main — produção                │   
└──────────────────────────────────────────────┘   1️ - Criar branch Sempre da dev (feature/, fix/)
                       ↑                        
                       │ 4 PR dev → main           
                       │                           2️ - Desenvolver commits claros (feat:, fix:, docs:)
┌──────────────────────────────────────────────┐   
│              dev — integração                |
└──────────────────────────────────────────────┘   3️ - Abrir PR para a dev revisão da equipe obrigatória.
         ↑                             │           (Apagar branch remota após merge)
         │ 3 abrir PR          1 criar │           
         │ para dev             da dev │           
         │                             ↓           4️ - PR dev para main quando a US/Sprint acabar.
   ┌────────────────────────────────────────┐      
   │        feature/ fix/ docs/ ...         │      
   └────────────────────────────────────────┘      
                       ↑                           
          2 desenvolva e faça commits
````

## 👥 **Equipe** <a id="equipe"></a>

| Foto | Nome | Função | GitHub |
| :---: | :--- | :--- | :---: |
| <img src="https://github.com/Marcio-gustavoI.png" width=50px alt="Foto do Márcio"> | **Márcio Inocêncio** | Product Owner | <a href="https://github.com/Marcio-gustavoI"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
| <img src="https://github.com/Viniciuss-Moreira.png" width=50px alt="Foto do Vinicius"> | **Vinicius Moreira** | Scrum Master | <a href="https://github.com/Viniciuss-Moreira"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
| <img src="https://github.com/KathelynZanin.png" width=50px alt="Foto da Kathelyn"> | **Kathelyn Zanin** | Desenvolvedor | <a href="https://github.com/KathelynZanin"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
| <img src="https://github.com/hiGuigo.png" width=50px alt="Foto do Guilherme"> | **Guilherme Alvarenga** | Desenvolvedor | <a href="https://github.com/hiGuigo"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
| <img src="https://github.com/DeveloperCorsair.png" width=50px alt="Foto do Henrique"> | **Henrique Martins** | Desenvolvedor | <a href="https://github.com/DeveloperCorsair"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
| <img src="https://github.com/pedrodevroot.png" width=50px alt="Foto do Pedro"> | **Pedro Lucas** | Desenvolvedor | <a href="https://github.com/pedrodevroot"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
| <img src="https://github.com/ThOMaZMe11o.png" width=50px alt="Foto do Thomaz"> | **Thomaz De Mello** | Desenvolvedor | <a href="https://github.com/ThOMaZMe11o"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |
| <img src="https://github.com/Yuri-Dev-OH.png" width=50px alt="Foto do Yuri"> | **Yuri Gonçalves** | Desenvolvedor | <a href="https://github.com/Yuri-Dev-OH"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> |