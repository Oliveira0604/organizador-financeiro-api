# Organizador Financeiro

API REST para gerenciamento financeiro pessoal, desenvolvida com Node.js e TypeScript, com autenticação JWT, PostgreSQL, Prisma, validação de dados, regras de negócio e testes automatizados.


## Sobre o projeto

Projeto pessoal desenvolvido para praticar desenvolvimento backend
com Node.js e TypeScript, aplicando uma arquitetura em camadas
inspirada em Clean Architecture, separação de responsabilidades
e testes automatizados.

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
- [ ] O sistema deve ser capaz de simular rendimento de um dinheiro investido à renda fixa
- [x] O sistema deve permitir consultar as despesas de um mês específico.
- [ ] O sistema deve ser capaz de mostrar um resumo financeiro mensal.

## RNs
- [x] O usuário não pode se cadastrar com um email já existente
- [x] O usuário não pode cadastrar uma renda negativa
- [x] O usuário não deve ser capaz de cadastrar uma despesa com valor negativo
- [x] O usuário não pode atualizar a renda com valores negativos
- [x] O usuário não pode atualizar as despesas com valores negativos


## RNFs 
- [x] A senha do usuário deve estar criptografada
- [x] Os dados devem ser persistido em PostgreSQL
- [ ] Os gastos devem estar paginados
- [ ] As despesas devem estar paginados
- [x] A autenticação deve utilizar JWT
