# 🛡️ EasyComply

[![Status do Build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/seu-usuario/easycomply/actions) [![Cobertura de Testes](https://img.shields.io/badge/coverage-90%25-blue)](https://github.com/seu-usuario/easycomply) [![Licença](https://img.shields.io/badge/license-MIT-green)](LICENSE) [![Python](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/) [![Node.js](https://img.shields.io/badge/node.js-18+-blue.svg)](https://nodejs.org/)

**Solução SaaS em conformidade com a LGPD e segurança da informação para pequenas empresas.**

O EasyComply é uma plataforma completa e acessível que ajuda empresas a atingirem e manterem conformidade com a Lei Geral de Proteção de Dados (LGPD), oferecendo recursos como checklist inteligente, geração de documentos legais, simulação de auditorias, consultoria com IA, treinamentos gamificados, painéis analíticos e gestão de incidentes.

---

## 📖 Sumário

*   [Principais Funcionalidades](#-principais-funcionalidades)
*   [Por que EasyComply?](#-por-que-easycomply)
*   [Demonstração Visual](#-demonstração-visual)
*   [Estrutura do Projeto](#️-estrutura-do-projeto)
*   [Instalação Local](#-instalação-local)
    *   [Requisitos](#requisitos)
    *   [Backend (Flask)](#backend-flask)
    *   [Frontend (React)](#frontend-react)
    *   [Com Docker](#com-docker)
*   [Executando os Testes](#-executando-os-testes)
*   [Documentação da API](#-documentação-da-api)
*   [IA & LGPD](#-ia--lgpd)
*   [Roadmap de Expansão](#-roadmap-de-expansão)
*   [Contribuindo](#-contribuindo)
*   [Licença](#-licença)
*   [Contato](#-contato)

---

## 🚀 Principais Funcionalidades

O EasyComply oferece um conjunto robusto de ferramentas para simplificar a jornada de conformidade com a LGPD:

- ✅ **Checklist Inteligente da LGPD:** Guia automatizado com priorização de tarefas baseada em análise de risco e integração para upload de evidências.
- 📄 **Geração Automatizada de Documentos Legais:** Crie políticas de privacidade, termos de uso, contratos de tratamento de dados (DPA) e outros documentos essenciais, com controle de versionamento e suporte para assinatura digital.
- 🔍 **Simulações de Auditoria e Planos de Resposta a Incidentes:** Prepare sua empresa com simulações realistas de auditorias da ANPD e crie planos de resposta a incidentes eficazes, com relatórios detalhados e planos de ação integrados.
- 🧠 **Consultoria com Inteligência Artificial:** Assistente virtual especializado em privacidade e LGPD, capaz de analisar documentos, responder dúvidas e fornecer orientações baseadas no histórico de interações.
- 📊 **Dashboard de Conformidade em Tempo Real:** Monitore o nível de adequação da sua empresa com indicadores de desempenho personalizáveis, alertas proativos e integração com o calendário corporativo para prazos e revisões.
- 📚 **Treinamento e Conscientização Gamificados:** Plataforma de e-learning com trilhas de conhecimento adaptadas à realidade da sua empresa, módulos interativos, emissão de certificados, ranking de participantes e conteúdo personalizável por setor ou área de atuação.
- 🔐 **Gestão Centralizada de Incidentes de Segurança:** Ferramenta colaborativa para registrar, classificar, investigar e documentar incidentes de violação de dados, com logs estruturados e integração com as principais ferramentas de comunicação interna.
- 🌐 **Benchmarking Anônimo de Maturidade:** Compare o desempenho de conformidade da sua empresa com outras organizações de mesmo porte ou setor, de forma anônima e segura.
- 🧩 **Integrações Estratégicas:** Conecte o EasyComply com seus sistemas existentes, como CRMs (Salesforce, HubSpot), repositórios de arquivos (Google Drive, OneDrive) e outras ferramentas corporativas para um fluxo de trabalho unificado.

---

## ✨ Por que EasyComply?

*   **Acessível para Pequenas Empresas:** Soluções de conformidade podem ser caras e complexas. O EasyComply foi desenhado para ser intuitivo e com um custo acessível, democratizando o acesso à adequação à LGPD.
*   **Foco em Automação Inteligente:** Reduza o trabalho manual com nossos checklists, geradores de documentos e IA, permitindo que sua equipe foque no que realmente importa.
*   **Visão 360° da Conformidade:** Desde a avaliação inicial até a gestão de incidentes e treinamento contínuo, cobrimos todo o ciclo de vida da conformidade.
*   **Tecnologia de Ponta:** Utilizamos Flask e React para uma plataforma robusta e moderna, e Gemini 1.5 Pro para uma IA poderosa e contextualizada.

---

## 🖼️ Demonstração Visual

*Aqui você pode adicionar screenshots da interface do EasyComply ou um GIF demonstrando as principais funcionalidades. Por exemplo:*

**(Placeholder para Screenshot do Dashboard Principal)**

`(Descrição breve da imagem ou GIF)`

**(Placeholder para GIF da Geração de Documentos)**

`(Descrição breve da imagem ou GIF)`

---

## 🏗️ Estrutura do Projeto

O EasyComply é organizado com uma estrutura modular para facilitar o desenvolvimento, manutenção e escalabilidade. Abaixo detalhamos os principais diretórios e arquivos do projeto:

### Backend Flask - Padrão MVC

O backend é construído com Flask, seguindo uma abordagem inspirada no padrão Model-View-Controller (MVC), organizada da seguinte forma:

```
app/
├── __init__.py                # Inicializa a aplicação Flask
├── config.py                  # Configurações globais (banco, chave JWT, etc.)
├── extensions.py              # Extensões Flask: SQLAlchemy, JWT, Migrate, Login

├── controllers/               # Controladores (Lógica de apresentação e orquestração de requests)
│   ├── dashboard_controller.py
│   ├── checklist_controller.py
│   ├── documentos_controller.py
│   ├── auditorias_controller.py
│   ├── treinamentos_controller.py
│   ├── incidentes_controller.py
│   ├── ia_controller.py
│   ├── relatorios_controller.py
│   ├── admin_controller.py
│   └── auth_controller.py

├── models/                    # Modelos ORM (Representação do banco de dados)
│   ├── user.py
│   ├── checklist.py
│   ├── documento.py
│   ├── auditoria.py
│   ├── treinamento.py
│   ├── incidente.py
│   └── relatorio.py

├── routes/                    # Definição de Blueprints e rotas da API

├── services/                  # Camada de serviço (Lógica de negócio desacoplada)
│   ├── ia_service.py          # IA para consultas legais e análise de documentos
│   ├── payment_service.py     # Integração com gateways de pagamento
│   ├── email_service.py       # Envio de notificacões e alertas
│   ├── incident_service.py    # Fluxo de resposta e registro de incidentes
│   └── benchmarking_service.py # Comparativo anônimo entre empresas similares

├── utils/                     # Funções e módulos utilitários
│   ├── validators.py          # Validações de dados de entrada
│   ├── formatters.py          # Formatadores de dados para apresentação
│   └── decorators.py          # Decoradores para autenticação, logging, etc.

├── schemas/                   # Schemas para validação e serialização de dados (e.g., Marshmallow)
│   ├── checklist_schema.py
│   ├── incidente_schema.py
│   └── user_schema.py

├── templates/                 # Templates HTML renderizados pelo servidor (Jinja2)
│   ├── base.html
│   ├── includes/              # Componentes de template reutilizáveis
│   └── pages/                 # Templates específicos por módulo/funcionalidade

├── static/                    # Arquivos estáticos (CSS, JavaScript, Imagens)
│   ├── css/
│   ├── js/
│   └── img/

├── tests/                     # Testes unitários e de integração
│   ├── test_auth.py
│   ├── test_checklist.py
│   ├── test_ia.py
│   └── conftest.py            # Configurações e fixtures para pytest
```

### Frontend React

A interface do usuário é desenvolvida com React, promovendo uma experiência rica e interativa:

```
react_frontend/
├── public/                    # Arquivos estáticos e index.html base
├── src/
│   ├── components/            # Componentes React reutilizáveis (ex: Cards, Tabelas, Gráficos)
│   ├── pages/                 # Componentes de página (representando as diferentes telas da aplicação)
│   ├── contexts/              # React Context API para gerenciamento de estado global (ex: AuthContext, ThemeContext)
│   ├── hooks/                 # Hooks personalizados para lógica reutilizável
│   ├── services/              # Funções para interagir com a API do backend
│   ├── styles/                # Arquivos de estilização global, variáveis CSS, temas
│   ├── App.js                 # Componente raiz da aplicação React
│   └── index.js               # Ponto de entrada da aplicação React
```

### Infraestrutura e DevOps

Arquivos e diretórios relacionados à configuração, build, deploy e manutenção do projeto:

```
.env                         # Arquivo para variáveis de ambiente (NÃO versionar)
requirements.txt             # Dependências Python para o backend
migrations/                  # Scripts de migração do banco de dados (Alembic/Flask-Migrate)
Dockerfile                   # Instruções para construir a imagem Docker da aplicação
Makefile                     # Comandos de atalho para tarefas comuns (ex: make test, make lint)
docker-compose.yml           # Orquestração de múltiplos containers (app, banco de dados, etc.)
README.md                    # Este arquivo :) - Documentação principal do projeto

react_frontend/
└── package.json             # Dependências JavaScript para o frontend

docs/
├── postman_collection.json  # Coleção do Postman para teste da API
└── ARQUITETURA.md         # (Sugerido) Documento detalhado da arquitetura
```

Para uma visão mais aprofundada da arquitetura, componentes e fluxos de dados, consulte nosso [DOCUMENTO_DE_ARQUITETURA.md](docs/ARQUITETURA.md) (sugestão de criar este arquivo na pasta `docs/`).

---

## 🔧 Instalação Local

Siga os passos abaixo para configurar o ambiente de desenvolvimento localmente.

### Requisitos

*   Python 3.10 ou superior
*   Node.js 18.x ou superior
*   Docker e Docker Compose (Recomendado para facilitar a configuração do banco de dados e outros serviços)
*   Poetry (Gerenciador de dependências Python - sugestão para substituir `requirements.txt` futuramente)

### Backend (Flask)

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/easycomply.git
    cd easycomply
    ```

2.  **Configure o ambiente virtual e instale as dependências:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # No Windows: venv\Scripts\activate
    pip install -r requirements.txt 
    ```
    *(Sugestão: Considere migrar para Poetry com `poetry install`)*

3.  **Configure as variáveis de ambiente:**
    Copie o arquivo de exemplo e ajuste as configurações conforme necessário (especialmente as credenciais do banco de dados).
    ```bash
    cp .env.example .env
    # Edite o arquivo .env com suas configurações
    ```

4.  **Aplique as migrações do banco de dados:**
    (Certifique-se que o PostgreSQL está rodando e acessível, ou use Docker)
    ```bash
    flask db upgrade
    ```

5.  **Inicie o servidor de desenvolvimento do backend:**
    ```bash
    flask run
    ```
    O backend estará disponível em `http://localhost:5000` (ou a porta configurada).

### Frontend (React)

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd react_frontend # Ou o nome da pasta do seu frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento do frontend:**
    ```bash
    npm start
    ```
    O frontend estará disponível em `http://localhost:3000` (ou a porta configurada pelo React).

### Com Docker (Recomendado)

Para uma configuração simplificada e isolada, utilize Docker Compose:

```bash
docker-compose up --build
```
Isto irá construir as imagens e iniciar todos os serviços (backend, frontend, banco de dados) definidos no arquivo `docker-compose.yml`.

---

## 🧪 Executando os Testes

Para garantir a qualidade e estabilidade do código, execute os testes automatizados:

```bash
# Ative o ambiente virtual do backend, se não estiver ativo
# source venv/bin/activate 
pytest tests/
```
Certifique-se de que as dependências de desenvolvimento para testes estão instaladas.

---

## 📚 Documentação da API

A API do EasyComply permite a integração com outras ferramentas e a automação de processos. A documentação detalhada das rotas, parâmetros e exemplos de requisições/respostas está disponível através de:

*   **Postman Collection:** Importe nossa coleção [`docs/postman_collection.json`](docs/postman_collection.json) no seu Postman.
*   **Swagger/OpenAPI (Em Breve):** Estamos trabalhando para disponibilizar uma documentação interativa via Swagger UI na rota `/api/docs`.

**Exemplo de Requisição (Autenticação):**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

---

## 🧠 IA & LGPD

A inteligência artificial do EasyComply é um diferencial chave, treinada e otimizada com um vasto corpus de conhecimento sobre privacidade e proteção de dados, incluindo:

*   Texto integral da Lei Geral de Proteção de Dados (Lei 13.709/2018) e suas atualizações.
*   Decisões, resoluções e guias orientativos da Autoridade Nacional de Proteção de Dados (ANPD).
*   Jurisprudência consolidada dos tribunais brasileiros sobre temas de privacidade e dados pessoais.
*   Normas técnicas relevantes, como a família ISO 27000 (especialmente ISO 27001 e ISO 27701).
*   Dados vetorizados com técnicas de embedding que garantem a segurança e o contexto local das informações da sua empresa, sem exposição desnecessária.

---

## 🧩 Roadmap de Expansão

Estamos constantemente trabalhando para evoluir o EasyComply. Nossos próximos passos incluem:

*   [ ] **Suporte à ISO 27001 para PMEs:** Módulo dedicado para auxiliar pequenas e médias empresas na implementação dos controles da ISO 27001.
*   [ ] **Integração Avançada com Cloud Storage:** Sincronização bidirecional com Google Drive, Microsoft OneDrive e Dropbox para gerenciamento de evidências.
*   [ ] **Planos de Assinatura Flexíveis e Modelo White-Label:** Opções para diferentes tamanhos de empresa e possibilidade de customização da plataforma para consultorias parceiras.
*   [ ] **Comunidade EasyComply:** Criação de um fórum interno para troca de experiências entre usuários e um marketplace de consultores especializados em LGPD e segurança da informação.

Fique de olho nas [releases](https://github.com/seu-usuario/easycomply/releases) para as últimas atualizações!

---

## 🤝 Contribuindo

Adoramos contribuições da comunidade! Se você deseja ajudar a melhorar o EasyComply, siga estes passos:

1.  **Faça um Fork** do projeto.
2.  **Crie uma Feature Branch:** `git checkout -b feature/sua-nova-funcionalidade`
3.  **Realize suas Mudanças:** Implemente sua funcionalidade ou correção.
4.  **Adicione Testes:** Garanta que sua contribuição está coberta por testes.
5.  **Commit suas Mudanças:** `git commit -m 'feat: Adiciona nova funcionalidade incrível'` (siga os [Conventional Commits](https://www.conventionalcommits.org/))
6.  **Envie para o Branch Remoto:** `git push origin feature/sua-nova-funcionalidade`
7.  **Abra um Pull Request:** Detalhe suas mudanças e o porquê delas.

Por favor, leia nosso [GUIA_DE_CONTRIBUICAO.md](CONTRIBUTING.md) para mais detalhes sobre padrões de código e processo de pull request (sugestão de criar este arquivo).

---

## 📄 Licença

Este projeto é distribuído sob a Licença MIT. Veja o arquivo [`LICENSE`](LICENSE) para mais informações.

---

## 📞 Contato

Desenvolvido com ❤️ por **EasyData360**.

📧 Email: [contato@easydata360.com.br](mailto:contato@easydata360.com.br)
🌐 Website: [www.easydata360.com.br](http://www.easydata360.com.br)
🔗 LinkedIn: [linkedin.com/company/easydata360](https://linkedin.com/company/easydata360) (Exemplo)

---

> “Conformidade não é um destino. É uma jornada de cultura, tecnologia e responsabilidade.”

