# Organizador Financeiro

API REST para gerenciamento financeiro pessoal, permitindo controlar usuários, rendas, despesas e categorias, além de consultar gastos por período e calcular a representatividade das despesas.

## Sobre o projeto

Projeto pessoal desenvolvido para praticar desenvolvimento backend
com Node.js e TypeScript, aplicando uma arquitetura em camadas
inspirada em Clean Architecture, separação de responsabilidades
e testes automatizados.

## Funcionalidades

- Cadastro, atualização e remoção de usuários
- Autenticação com JWT
- Cadastro, atualização e remoção de rendas
- Cadastro, atualização e remoção de despesas
- Criação e gerenciamento de categorias
- Consulta de despesas por período
- Cálculo da porcentagem de cada categoria no total de despesas
- Controle de acesso por usuário
- Validação de dados
- Tratamento de erros
- Testes automatizados

## Tecnologias

- Node.js
- TypeScript
- Fastify
- Zod
- Prisma
- PostgreSQL
- Vitest
- Docker

## Arquitetura

O projeto segue uma arquitetura em camadas, com separação entre controllers, use cases e repositories.

- Os **controllers** são responsáveis por orquestrar as requisições HTTP: validam os dados de entrada (com Zod) e chamam o use case correspondente.
- Os **use cases** são responsáveis pelas regras de negócio da aplicação, recebendo dados já validados pelo controller.
- Os **repositories** são responsáveis pela abstração de acesso aos dados, permitindo trocar a implementação (ex: Prisma, in-memory) sem impactar as demais camadas.
- As **factories** são responsáveis por montar e injetar as dependências de cada controller (repository → use case → controller).

## Estrutura do projeto

A aplicação é organizada por responsabilidades, mantendo a separação entre a camada HTTP, regras de negócio e acesso aos dados
```
src/
├── adapters/          # Responsável por adaptar a comunicação entre o Fastify e os controllers
├── cryptography/      # Responsável pelas operações criptográficas, como gerar e comparar hashes de senhas usando bcrypt.
├── env/               # Responsável por fazer a validação das variáveis de ambiente da aplicação
├── errors/            # Erros customizados da aplicação
├── generated/         # Código gerado pelo Prisma
├── http/              # Resposável pela camada HTTP, incluindo controllers, factories e definição das rotas
├── lib/               # Configurações e inicialização de recursos compartilhados, como o Prisma.
├── middleware/        # Responsável pela verificação do token JWT e do refresh token. 
├── repositories/      # Interfaces e implementações de acesso aos dados
├── tokens/            # Responsável por gerar os tokens JWT.
├── use-cases/         # Regras de negócio da aplicação
├── utils/             # Funções auxiliares
├── app.ts             # Configuração da aplicação
└── server.ts          # Inicialização do servidor
```
## Autenticação

A API utiliza JWT para autenticação.

Após realizar o login, o usuário recebe um access token e um refresh token.

O access token deve ser enviado nas rotas protegidas através do header:

Authorization: Bearer <access_token>

Quando o access token expira, o refresh token pode ser utilizado
para obter um novo access token através da rota `/users/token/refresh`.

## Endpoints

```
### Usuários
| Método | Rota                            | Descrição                                              | Auth

| POST   | "/users/create"                 | Cria um usuário                                        | Não
| POST   | "/users/session"                | Inicia uma sessão                                      | Não
| PATCH  | "/users/token/refresh"          | Renova o access token                                  | Não 
| PATCH  | "/users/update/:id"             | Atualiza informações dos usuarios                      | Sim
| DELETE | "/users/delete/:id"             | Faz o soft delete de um usuário                        | Sim

### Categorias
| Método | Rota                            | Descrição                                              | Auth

| POST   | "/category/create/"             | Cria uma categoria                                     | Sim
| PATCH  | "/category/update/:categoryId"  | Atualiza uma categoria                                 | Sim
| DELETE | "/category/delete/:categoryId"  | Faz o soft delete em uma categoria                     | Sim

## Incomes
| Método | Rota                            | Descrição                                               | Auth

| GET    | "/incomes/categoryid"           | Retorna o nome, quantia e quando uma renda foi recebida | Sim
| GET    | "/incomes/userid"               | Retorna as rendas do usuario                            | Sim
| GET    | "/incomes/category/total"       | Retorna a quantidade total de uma categoria             | Sim
| GET    | "/incomes/user/total"           | Retorna a quantidade total do usuario                   | Sim
| GET    | "/incomes/category/percentage"  | Retorna a porcentagem total de uma categoria            | Sim
| POST   | "/incomes/create"               | Cria uma renda nova                                     | Sim
| PATCH  | "/incomes/update"               | Atualiza uma ou mais informação sobre a renda           | Sim
| DELETE | "/incomes/delete"               | Faz o soft delete de uma renda                          | Sim

## Expenses 
| Método | Rota                             | Descrição                                               | Auth

| GET    | "/expenses"                      | Retorna as despesas do usuário                          | Sim
| GET    | "/expenses/category"             | Retorna as despesas de uma categoria                    | Sim
| GET    | "/expenses/category/percentage"  | Retorna a porcentagem de uma categoria                  | Sim
| GET    | "/expenses/category/total"       | Retorna o total de uma categoria                        | Sim
| POST   | "/expenses/create/"              | Cria uma despesa                                        | Sim
| PATCH  | "/expenses/update"               | Atualiza uma ou mais informação sobre a despesa         | Sim
| DELETE | "/expenses/delete"               | Faz o soft delete de uma despesa                        | Sim
```

## Decisões técnicas

### Repositories

As interfaces de repository são independentes da implementação de
persistência. Isso permite utilizar implementações diferentes, como
Prisma e in-memory, facilitando os testes e reduzindo o acoplamento.

### Use Cases

As regras de negócio ficam concentradas nos use cases, mantendo os
controllers focados na comunicação HTTP.

### Controllers

Os controllers são responsáveis por receber e tratar as requisições HTTP, validar os dados de entrada utilizando Zod e encaminhar as informações para os respectivos use cases. Dessa forma, permanecem independentes das regras de negócio e dos detalhes de persistência.

### Validação

Os dados recebidos pela API são validados utilizando Zod antes de
serem encaminhados aos use cases.


## Como executar o projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

### 1. Clone o repositório

```bash
git clone https://github.com/Oliveira0604/organizador-financeiro-api
```

Entre na pasta do projeto:

```bash
cd organizador-financeiro-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e configure as variáveis necessárias:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="seu-segredo"
```

Consulte as variáveis utilizadas no projeto para preencher os valores corretamente.

### 4. Inicie o banco de dados

Com o Docker instalado e em execução, utilize:

```bash
docker compose up -d
```

### 5. Execute as migrations

Para criar as tabelas no banco de dados:

```bash
npx prisma migrate dev
```

### 6. Inicie a aplicação

```bash
npm run start:dev
```

A aplicação estará disponível localmente conforme a porta configurada no projeto.

## RFs 
- [x] O sistema deve ser capaz de cadastrar um usuário
- [x] O sistema deve ser capaz de atualizar dados de um usuário
- [x] O sistema deve ser capaz de deletar um usuário
- [x] O sistema deve ser capaz de autenticar um usuário
- [x] O sistema deve ser capaz de cadastrar rendas 
- [x] O sistema deve ser capaz de atualizar rendas 
- [x] O sistema deve ser capaz de cadastrar uma despesa
- [x] O sistema deve ser capaz de atualizar uma despesa
- [x] O sistema deve ser capaz de remover uma despesa
- [x] O sistema deve ser capaz de categorizar as despesas
- [x] O sistema deve ser capaz de mostrar os gastos até o período da solicitação
- [x] O sistema deve ser capaz de mostrar a porcentagem que cada despesa representa
- [x] O sistema deve permitir consultar as despesas de um mês específico.

## RNs
- [x] O usuário não pode se cadastrar com um email já existente
- [x] O usuário não pode cadastrar uma renda negativa
- [x] O usuário não deve ser capaz de cadastrar uma despesa com valor negativo
- [x] O usuário não pode atualizar a renda com valores negativos
- [x] O usuário não pode atualizar as despesas com valores negativos


## RNFs 
- [x] A senha do usuário deve estar criptografada
- [x] Os dados devem ser persistido em PostgreSQL
- [x] Os gastos devem estar paginados
- [x] As despesas devem estar paginados
- [x] A autenticação deve utilizar JWT
