# Organizador Financeiro

API backend para um agente financeiro integrado ao WhatsApp.

## Sobre o projeto

Projeto pessoal desenvolvido para praticar desenvolvimento backend
com Node.js e TypeScript, aplicando princípios de Clean Architecture,
separação de responsabilidades e testes automatizados.

## Tecnologias

- Node.js
- TypeScript
- Fastify
- Prisma
- PostgreSQL
- Vitest
- Docker

## Arquitetura

Breve explicação de como Controllers, Use Cases e Repositories
estão organizados e qual é a responsabilidade de cada camada.

## RFs 
- [ x ] O sistema deve ser capaz de cadastrar um usuário
- [ x ] O sistema deve ser capaz de atualizar dados de um usuário
- [ x ] O sistema deve ser capaz de deletar um usuário
- [ ] O sistema deve ser capaz de autenticar um usuário
- [ x ] O sistema deve ser capaz de cadastrar rendas 
- [] O sistema deve ser capaz de atualizar rendas 
- [ x ] O sistema deve ser capaz de cadastrar uma despesa
- [ x ] O sistema deve ser capaz de atualizar uma despesa
- [ x ] O sistema deve ser capaz de remover uma despesa
- [ x ] O sistema deve ser capaz de categorizar as despesas
- [ x ] O sistema deve ser capaz de mostrar os gastos até o período da solicitação
- [ x ] O sistema deve ser capaz de mostrar a porcentagem que cada despesa representa
- [ ] O sistema deve ser capaz de definir limite de gastos para cada área de acordo com o usuário
- [ ] O sistema deve ser capaz de dar dicas de economia
- [ ] O sistema deve ser capaz de explicar entre renda fixa e renda variável
- [ ] O sistema deve ser capaz de simular rendimento de um dinheiro investido à renda fixa
- [ ] O sistema deve permitir consultar as despesas de um mês específico.
- [ ] O sistema deve ser capaz de mostrar um resumo financeiro mensal.

## RNs
- [ x ] O usuário não pode se cadastrar com um número já existente
- [ ] O usuário não pode cadastrar uma renda negativa
- [ ] O usuário não deve ser capaz de cadastrar uma despesa com valor negativo
- [ ] O usuário não deve ser capaz de definir um limite de gasto negativo
- [ ] O usuário não pode atualizar a renda com valores negativos
- [ ] O usuário não pode atualizar as despesas com valores negativos
- [ ] O sistema não deve responder a nada que não seja do tópico financeiro
- [ ] O sistema não pode induzir o usuário a por o dinheiro em um determinado investimento


## RNFs 
- [ ] A senha do usuário deve estar criptografada
- [ ] Os dados devem ser persistido em PostgreSQL
- [ ] Os gastos devem estar paginados
- [ ] No Whatsapp deve ser mostrado uma mensagem com os gastos um embaixo do outro representando os dias
- [ ] A autenticação deve utilizar JWT
