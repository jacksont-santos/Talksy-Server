# Documentação do Projeto

## Visão geral

O `chat-manager-api` é uma API back-end em Node.js e TypeScript para gerenciar usuários, salas de chat e conversas em tempo real. A aplicação combina uma API REST com um serviço WebSocket para permitir notificações e interação em tempo real.

A proposta principal é fornecer:
- registro e autenticação de usuários;
- criação, consulta, edição e exclusão de salas de chat;
- acesso a salas públicas e privadas;
- gerenciamento de membros de sala;
- histórico de mensagens por sala;

## Arquitetura

### Fluxo de requisição REST

1. O cliente faz requisição HTTP ao Express.
2. O middleware `authMiddleware` verifica o token JWT quando necessário.
3. O controller processa a requisição e chama o service apropriado.
4. O service aplica regras de negócio e chama o repository.
5. O repository consulta ou grava dados no MongoDB.
6. O controller envia a resposta JSON ao cliente.

### Comunicação em tempo real

- O `WSService` envia notificações por WebSocket sempre que uma sala é criada, atualizada ou removida.
- O serviço WebSocket mantém conexões abertas e retransmite eventos ao cliente.

## Endpoints

### `/health`

- Método: `GET`
- Autenticação: não
- Retorno: status do serviço

Exemplo de resposta:
```json
"manager ok"
```

### `/auth/signin`

- Método: `POST`
- Autenticação: não
- Body:
  - `username` (string, 4-20)
  - `password` (string, 6-16)

Exemplo de request:
```json
{
  "username": "user1",
  "password": "secret123"
}
```

Resposta bem-sucedida:
```json
{
  "message": "Login successful",
  "data": {
    "token": "<jwt-token>",
    "_id": "<user-id>",
    "username": "user1",
    "nickname": "nick1"
  }
}
```

### `/user/signup`

- Método: `POST`
- Autenticação: não
- Body:
  - `username` (string, 6-24)
  - `password` (string, 6-24)
  - `nickname` (string, 4-24)

Retorno:
```json
{
  "message": "User created successfully",
  "data": {
    "_id": "<user-id>",
    "username": "user1",
    "nickname": "nick1"
  }
}
```

### `/user/`

- Método: `GET`
- Autenticação: sim (Bearer token)
- Retorno: dados do usuário autenticado

### `/user/update`

- Método: `PUT`
- Autenticação: sim
- Body opcionais:
  - `username` (string, 6-24)
  - `password` (string, 6-24)
  - `nickname` (string, 4-24)

Retorno:
```json
{
  "message": "User updated successfully",
  "data": {
    "_id": "<user-id>",
    "username": "user1",
    "nickname": "nick1"
  }
}
```

### `/user/delete`

- Método: `DELETE`
- Autenticação: sim
- Retorno:
```json
{
  "message": "User deleted successfully"
}
```

### `/room/`

- Método: `GET`
- Autenticação: sim
- Retorno: lista de salas públicas

### `/room/id/:id`

- Método: `GET`
- Autenticação: sim
- Retorno: detalhes de uma sala pública por ID

### `/room/private`

- Método: `GET`
- Autenticação: sim
- Retorno: lista de salas privadas do usuário autenticado

### `/room/private/id/:id`

- Método: `GET`
- Autenticação: sim
- Retorno: detalhes de uma sala privada do usuário autenticado

### `/room/invited/:id/token/:token`

- Método: `GET`
- Autenticação: não
- Usa token de convite para recuperar sala privada

### `/room/member`

- Método: `GET`
- Autenticação: sim
- Retorno: salas em que o usuário é membro

### `/room/messages/:roomId`

- Método: `GET`
- Autenticação: sim
- Query params:
  - `page` (número, opcional, padrão 1)
  - `limit` (número, opcional, padrão 10)
- Retorno: histórico de mensagens da sala

### `/room/create`

- Método: `POST`
- Autenticação: sim
- Body:
  - `name` (string, 4-30)
  - `maxUsers` (int, 2-10)
  - `isPublic` ("true" | "false")
  - `password` (string, 6-16) quando `isPublic` for "false"

Retorno:
```json
{
  "message": "Room created successfully",
  "data": {
    "_id": "<room-id>",
    "ownerId": "<user-id>",
    "name": "Sala 1",
    "maxUsers": 6,
    "public": false,
    "active": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### `/room/update/:id`

- Método: `PUT`
- Autenticação: sim
- Body opcionais:
  - `name` (string)
  - `maxUsers` (int)
  - `active` (boolean)
  - `isPublic` ("true" | "false")
  - `password` (string, 6-16)

Retorno:
```json
{
  "message": "Room updated successfully",
  "data": { ... }
}
```

### `/room/delete/:id`

- Método: `DELETE`
- Autenticação: sim
- Retorno:
```json
{
  "message": "Room deleted successfully",
  "data": {
    "_id": "<room-id>"
  }
}
```

## Modelos de dados / tabelas

### Coleção `users`

| Campo     | Tipo    | Obrigatório | Observações |
|----------|---------|-------------|-------------|
| `_id`     | string  | sim         | UUID gerado automaticamente |
| `username`| string  | sim         | único, 6-24 caracteres |
| `password`| string  | sim         | hash bcrypt, não selecionado por padrão |
| `nickname`| string  | sim         | único, 4-24 caracteres |

### Coleção `rooms`

| Campo      | Tipo    | Obrigatório | Observações |
|-----------|---------|-------------|-------------|
| `_id`       | string  | sim         | UUID gerado automaticamente |
| `ownerId`   | string  | sim         | ID do usuário que criou a sala |
| `name`      | string  | sim         | 4-30 caracteres |
| `maxUsers`  | number  | sim         | valor entre 2 e 10 |
| `public`    | boolean | sim         | true para sala pública |
| `active`    | boolean | sim         | status de atividade |
| `password`  | string  | não         | hash bcrypt, somente para salas privadas |
| `createdAt` | Date    | sim         | data de criação |
| `updatedAt` | Date    | sim         | data de atualização |

### Coleção `roomMembers`

| Campo       | Tipo      | Obrigatório | Observações |
|------------|-----------|-------------|-------------|
| `_id`        | string    | sim         | ID da lista de membros |
| `ownerId`    | string    | sim         | dono da sala |
| `roomId`     | string    | sim         | ID da sala |
| `users`      | string[]  | sim         | IDs de usuários convidados/membros |
| `createdAt`  | Date      | sim         | data de criação |
| `updatedAt`  | Date      | sim         | data de atualização |

### Coleção `chat`

| Campo       | Tipo       | Obrigatório | Observações |
|------------|------------|-------------|-------------|
| `_id`        | string     | sim         | ID do documento de chat |
| `roomId`     | string     | sim         | ID da sala |
| `chat`       | array      | sim         | lista de mensagens |
| `createdAt`  | Date       | sim         | data de criação do documento |
| `updatedAt`  | Date       | sim         | data de atualização |

Cada item em `chat` contém:
- `id` (string)
- `userId` (string)
- `nickname` (string)
- `content` (string)
- `createdAt` (Date)

