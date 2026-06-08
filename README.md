# 📚 StudyFlow — Sistema de Gerenciamento de Estudos

> *Combatendo a procrastinação com tecnologia*

---

## 🔖 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Problema que Resolve](#problema-que-resolve)
- [Solução Proposta](#solução-proposta)
- [Público-Alvo](#público-alvo)
- [Funcionalidades](#funcionalidades)
- [Telas do Sistema](#telas-do-sistema)
- [APIs Utilizadas](#apis-utilizadas)
- [Tecnologias](#tecnologias)
- [Como Executar](#como-executar)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Requisitos Funcionais](#requisitos-funcionais)
- [Equipe](#equipe)
- [Referências](#referências)

---

## Sobre o Projeto

O **StudyFlow** é uma aplicação web desenvolvida como MVP (Minimum Viable Product) com o objetivo de auxiliar estudantes a organizarem sua rotina de estudos, combatendo a procrastinação por meio de técnicas consolidadas de aprendizado, como o método Pomodoro e a Revisão Espaçada (Active Recall).

O sistema foi desenvolvido com HTML, CSS e JavaScript puro, sem frameworks, priorizando acessibilidade, leveza e facilidade de uso.

---

## Problema que Resolve

A procrastinação e a falta de organização nos estudos são desafios amplamente documentados entre estudantes de todos os níveis. Segundo Steel (2007), cerca de 95% dos estudantes procrastinam em algum momento, sendo que 50% o fazem de forma consistente e problemática.

Um estudo publicado na revista *Psychological Science* por Kornell e Bjork (2008) demonstrou que estudantes que distribuem o aprendizado ao longo do tempo retêm significativamente mais conteúdo do que os que estudam em sessões únicas e longas — fenômeno denominado **Efeito de Espaçamento**.

Além disso, a ausência de metas claras e mensuráveis contribui para a sensação de improdutividade. Locke e Latham (2002), no artigo *Building a Practically Useful Theory of Goal Setting and Task Motivation*, demonstram que o estabelecimento de metas específicas e desafiadoras aumenta o desempenho em até 90% em relação à ausência de metas.

Diante desse cenário, o StudyFlow propõe uma solução digital integrada que reúne as principais ferramentas de produtividade estudantil em um único ambiente.

---

## Solução Proposta

O StudyFlow resolve o problema por meio de quatro pilares principais:

**1. Organização de Tarefas com Prioridades**  
O estudante cadastra suas tarefas de estudo e define prioridade (alta, média ou baixa), visualizando-as em uma tabela interativa com busca e paginação (DataTables).

**2. Revisão Espaçada**  
O usuário agenda revisões de tópicos em datas futuras, aplicando o Efeito de Espaçamento comprovado pela ciência. O sistema exibe as revisões ordenadas por data e por matéria.

**3. Técnica Pomodoro**  
Um timer configurável permite sessões de foco (25 min padrão), pausa curta (5 min) e pausa longa (15 min), com anel de progresso visual e histórico de sessões.

**4. Curiosidades Educacionais**  
Integrado à API Ninjas, o sistema exibe fatos e curiosidades sobre ciência, matemática e história, estimulando a curiosidade intelectual do estudante.

### Fluxo de Navegação

```
[Login] → [Dashboard]
              ├── [Metas & Tarefas]
              ├── [Revisão Espaçada]
              ├── [Pomodoro Timer]
              ├── [Curiosidades]  ← API Ninjas
              ├── [Progresso]
              └── [Configurações]
```

---

## Público-Alvo

O StudyFlow é destinado a:

- **Estudantes do Ensino Médio e Técnico** que precisam organizar múltiplas disciplinas e datas de prova.
- **Universitários** que enfrentam alta carga de conteúdo e dificuldade em manter rotina de estudos consistente.
- **Concurseiros e autodidatas** que estudam de forma independente e necessitam de ferramentas de organização e foco.
- **Profissionais em requalificação** que estudam em paralelo ao trabalho e precisam aproveitar ao máximo o tempo disponível.

O perfil típico do usuário é alguém com acesso a computador ou smartphone, familiaridade básica com interfaces digitais e motivação para melhorar seu desempenho acadêmico ou profissional.

---

## Funcionalidades

| # | Funcionalidade | Descrição |
|---|---|---|
| RF01 | Login com senha | Autenticação com campo de e-mail e senha, sessão persistida via localStorage |
| RF02 | Ocultar/Exibir senha | Botão de toggle no campo senha da tela de login |
| RF03 | Dark Mode persistente | Alternância entre tema claro e escuro, salvo entre sessões |
| RF04 | Gerenciamento de tarefas | Criar, concluir e excluir tarefas com nível de prioridade |
| RF05 | DataTables | Tabela de tarefas com busca, ordenação e paginação em PT-BR |
| RF06 | Revisão Espaçada | Agendamento de revisões por tópico, data e matéria |
| RF07 | Pomodoro Timer | Timer com modos Foco, Pausa e Pausa Longa, com anel de progresso |
| RF08 | API Ninjas | Busca de curiosidades educacionais via API Ninjas (`/v1/facts`) |
| RF09 | API DiceBear | Geração de avatar personalizado via API DiceBear (segunda API gratuita) |
| RF10 | Frase motivacional | Frase carregada via API AdviceSlip com fallback local |
| RF11 | Tela de Progresso | Visualização de estatísticas com barras de progresso e histórico Pomodoro |
| RF12 | Configurações | Painel para ajustar duração do Pomodoro e resetar dados |

---

## Telas do Sistema

| Tela | Descrição |
|---|---|
| 1. Login | Acesso ao sistema com e-mail, senha e toggle de visibilidade |
| 2. Dashboard | Visão geral com estatísticas e avatar personalizável |
| 3. Metas & Tarefas | Cadastro e gerenciamento de tarefas com DataTables |
| 4. Revisão Espaçada | Agendamento de revisões por tópico e data |
| 5. Pomodoro | Timer com anel de progresso e histórico de sessões |
| 6. Curiosidades | Fatos educacionais via API Ninjas com opção de salvar |
| 7. Progresso | Gráfico de barras e histórico de sessões Pomodoro |
| 8. Configurações | Dark mode, duração do Pomodoro e reset de dados |

Todas as telas seguem o padrão: **logo + menu lateral | cabeçalho (topbar) | área de conteúdo | rodapé**.

---

## APIs Utilizadas

### 1. API Ninjas — Curiosidades (`/v1/facts`)
- **Endpoint:** `https://api.api-ninjas.com/v1/facts`
- **Autenticação:** Header `X-Api-Key`
- **Uso:** Busca de curiosidades educacionais na tela "Curiosidades"
- **Cadastro gratuito:** [api-ninjas.com](https://api-ninjas.com)

### 2. DiceBear Avatars API
- **Endpoint:** `https://api.dicebear.com/7.x/bottts/svg?seed={nome}`
- **Autenticação:** Não requerida (pública e gratuita)
- **Uso:** Geração de avatar personalizado no Dashboard e Topbar

### 3. AdviceSlip API
- **Endpoint:** `https://api.adviceslip.com/advice`
- **Autenticação:** Não requerida (pública e gratuita)
- **Uso:** Frase motivacional exibida no cabeçalho após o login

---

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| HTML5 | — | Estrutura e semântica das páginas |
| CSS3 | — | Estilização, Dark Mode, responsividade |
| JavaScript (ES6+) | — | Lógica da aplicação, manipulação do DOM |
| jQuery | 3.6.0 | Integração com DataTables |
| DataTables | 1.13.6 | Tabelas interativas com busca e paginação |
| Google Fonts | — | Fontes DM Sans e Space Grotesk |
| localStorage | — | Persistência de dados no navegador |

---

## Como Executar

O projeto não requer instalação de dependências ou servidor backend. Basta:

1. **Baixe ou clone** os arquivos do projeto:
   ```
   studyflow/
   ├── index.html
   ├── style.css
   ├── app.js
   └── README.md
   ```

2. **Abra o `index.html`** diretamente no navegador (duplo clique), ou use a extensão **Live Server** do VS Code para melhor experiência.

3. **Credenciais de teste:** qualquer e-mail e senha são aceitos (validação visual apenas — MVP).

> ⚠️ As APIs externas (AdviceSlip e DiceBear) funcionam sem chave. Apenas a API Ninjas requer cadastro gratuito.

---

## Estrutura de Arquivos

```
studyflow/
│
├── index.html      # Estrutura HTML de todas as 8 telas do sistema
├── style.css       # Estilos, variáveis CSS, Dark Mode e responsividade
├── app.js          # Toda a lógica: estado, APIs, eventos e renderização
└── README.md       # Documentação do projeto
```

---

## Requisitos Funcionais — Checklist

- [x] RF com integração à **API Ninjas** (tela Curiosidades — `/v1/facts`)
- [x] RF com integração a outra **API aberta/gratuita** (DiceBear — avatares)
- [x] RF com uso do **DataTables** (tela Tarefas e tela Progresso)
- [x] RF com **tela de login** com ocultar/exibir senha
- [x] RF com **Dark Mode persistente** (localStorage + toggle sincronizado)
- [x] Mínimo de **10 Requisitos Funcionais** documentados
- [x] **Rodapé** padronizado em todas as telas internas
- [x] **Cabeçalho** (topbar) padronizado com frase motivacional e avatar
- [x] **Menu lateral** com navegação entre todas as seções

---

## Equipe

Projeto desenvolvido em grupo para a disciplina de **Desenvolvimento Web**.

| Nome | Função |
|---|---|
| *(Italo)* | Desenvolvimento Frontend |
| *(Leonardo)* | Desenvolvimento Frontend |
| *(Italo, Leonardo)* | Design e Documentação |

---

## Referências

KORNELL, N.; BJORK, R. A. Learning concepts and categories: is spacing the "enemy of induction"? **Psychological Science**, v. 19, n. 6, p. 585–592, 2008.

LOCKE, E. A.; LATHAM, G. P. Building a practically useful theory of goal setting and task motivation: a 35-year odyssey. **American Psychologist**, v. 57, n. 9, p. 705–717, 2002.

STEEL, P. The nature of procrastination: a meta-analytic and theoretical review of quintessential self-regulatory failure. **Psychological Bulletin**, v. 133, n. 1, p. 65–94, 2007.

CIRILLO, F. **The Pomodoro Technique**. FC Garage, 2006. Disponível em: https://francescocirillo.com/products/the-pomodoro-technique. Acesso em: jun. 2025.

API NINJAS. **Facts API Documentation**. Disponível em: https://api-ninjas.com/api/facts. Acesso em: jun. 2025.

DICEBEAR. **DiceBear Avatars — Open Source Avatar Library**. Disponível em: https://dicebear.com. Acesso em: jun. 2025.
