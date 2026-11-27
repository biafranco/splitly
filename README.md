# Splitly

[![Continuous Integration](https://github.com/biafranco/splitly/actions/workflows/ci.yml/badge.svg)](https://github.com/biafranco/splitly/actions/workflows/ci.yml)
[![Continuous Deployment](https://github.com/biafranco/splitly/actions/workflows/cd.yml/badge.svg)](https://github.com/biafranco/splitly/actions/workflows/cd.yml)
[![codecov](https://codecov.io/gh/biafranco/splitly/graph/badge.svg)](https://codecov.io/gh/biafranco/splitly)

## Integrantes

- Bianca Gabriela Franco e Silva

## Sobre o sistema

O Splitly é uma aplicação web para gerenciamento e divisão de despesas compartilhadas, desenvolvida para facilitar a organização financeira de grupos de pessoas.

### Funcionalidades

- Criação, edição e exclusão de grupos.
- Gerenciamento de participantes.
- Cadastro, edição e exclusão de despesas.
- Divisão igualitária e personalizada de valores.
- Cálculo automático de saldos individuais.
- Simplificação de dívidas.
- Registro e histórico de pagamentos.
- Dashboard financeiro.
- Busca e filtragem de despesas.
- Persistência local dos dados.

**Aplicação em produção:** https://splitly-olive.vercel.app/

## Tecnologias

| Tecnologia | Finalidade |
|---|---|
| React | Construção da interface |
| TypeScript | Tipagem estática |
| Vite | Ambiente de desenvolvimento e build |
| Tailwind CSS | Estilização |
| React Router | Navegação entre páginas |
| Lucide React | Ícones |
| LocalStorage | Persistência dos dados |
| Vitest | Testes unitários e de integração |
| React Testing Library | Testes de componentes e interações |
| Cypress | Testes de ponta a ponta |
| Istanbul | Medição de cobertura |
| ESLint | Análise estática |
| Git e GitHub | Controle de versões |
| GitHub Actions | Integração e implantação contínuas |
| Codecov | Publicação dos relatórios de cobertura |
| Vercel | Hospedagem da aplicação |

## Arquitetura

O sistema foi organizado em módulos com separação de responsabilidades:

- `domain`: entidades e regras de negócio.
- `infrastructure`: persistência e acesso aos dados.
- `features`: componentes e lógica das funcionalidades.
- `components`: componentes compartilhados.
- `pages`: páginas da aplicação.
- `utils`: funções utilitárias.
- `test`: configurações compartilhadas dos testes.

## Execução do sistema

### Pré-requisitos

- Node.js 22
- npm
- Git

### Instalação

```bash
git clone https://github.com/biafranco/splitly.git
cd splitly
npm ci
```

### Execução local

```bash
npm run dev
```

A aplicação estará disponível em http://127.0.0.1:5173.

## Execução dos testes

O projeto possui 173 testes unitários e de integração, distribuídos em 12 arquivos, além de sete testes de ponta a ponta.

### Testes unitários e de integração

```bash
npm run test
```

### Testes em modo de observação

```bash
npm run test:watch
```

### Cobertura de código

```bash
npm run test:coverage
```

O relatório HTML é disponibilizado em `coverage/index.html`.

### Testes de ponta a ponta

```bash
npm run test:e2e
```

### Cypress em modo interativo

```bash
npm run cypress:open
```

### Resultados de cobertura

| Métrica | Cobertura | Limite mínimo |
|---|---:|---:|
| Statements | 94,66% | 80% |
| Branches | 89,56% | 80% |
| Functions | 92,55% | 80% |
| Lines | 94,91% | 80% |

Os relatórios de cobertura também são publicados automaticamente no Codecov.

## Integração contínua (CI)

O workflow de integração contínua é executado automaticamente a cada push ou pull request.

As validações são realizadas em três sistemas operacionais:

- Linux
- Windows
- macOS

O pipeline contempla a instalação das dependências, análise estática, testes automatizados, verificação da cobertura mínima, build, testes E2E e publicação dos relatórios no Codecov.

## Implantação contínua (CD)

O workflow de implantação contínua é acionado após a execução bem-sucedida da integração contínua na branch `main`.

O processo realiza o build de produção e a implantação automática na Vercel. As credenciais necessárias são armazenadas no GitHub Secrets.

## Controle de versões

O projeto utiliza Git para controle de versões e GitHub como repositório remoto.

As mensagens de commit seguem a convenção Conventional Commits, utilizando prefixos como `feat`, `fix`, `test`, `docs`, `chore` e `ci`.

O versionamento das releases segue o padrão Semantic Versioning (SemVer):

- MAJOR: alterações incompatíveis.
- MINOR: novas funcionalidades compatíveis.
- PATCH: correções compatíveis.

A primeira versão estável do sistema é a `v1.0.0`.

## Uso de IA

O ChatGPT foi utilizado como ferramenta de apoio durante o desenvolvimento do projeto, auxiliando nas seguintes atividades:

- Planejamento das funcionalidades e da arquitetura.
- Revisão de código.
- Correção de bugs.
- Análise dos relatórios de cobertura.
- Elaboração da documentação.

## Links

- [Aplicação em produção](https://splitly-olive.vercel.app/)
- [Repositório GitHub](https://github.com/biafranco/splitly)
- [GitHub Actions](https://github.com/biafranco/splitly/actions)
- [Codecov](https://app.codecov.io/github/biafranco/splitly)