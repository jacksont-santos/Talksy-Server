# Chat Room & User Service

Microserviço responsável pela **criação, gerenciamento e autenticação de usuários e salas de chat**.  
Ele fornece **APIs REST** para controle de usuários e salas e integra-se ao servidor WebSocket para envio de notificações em tempo real sobre criação, atualização e remoção de salas.

## 🚀 Tecnologias Utilizadas

- **Node.js** + **TypeScript**
- **Express.js** (API REST)
- **MongoDB** + **Mongoose**
- **WebSocket (ws)**
- **JWT** (autenticação)

---

## 📂 Estrutura de Pastas

```
src/
 ├── database/
 │   └── models/         # Schemas e models do Mongoose
 ├── middlewares/        # Middlewares (ex: authMiddleware)
 ├── room/               # Controllers, services e validators de salas
 ├── user/               # Controllers, services e validators de usuários
 ├── utils/              # Funções utilitárias (hash, JWT, responses, etc.)
 ├── ws/                 # Integração com WebSocket
 └── index.ts            # Ponto de entrada da aplicação
```

---

## 📡 Endpoints Disponíveis

### **Usuários (`/user`)**
| Método | Rota       | Autenticação | Descrição |
|--------|-----------|--------------|-----------|
| `GET`  | `/`       | ✅ | Retorna dados do usuário autenticado |
| `POST` | `/signup` | ❌ | Cria um novo usuário |
| `POST` | `/signin` | ❌ | Realiza login e retorna token JWT |
| `DELETE` | `/delete` | ✅ | Deleta a conta do usuário autenticado |

---

### **Salas (`/room`)**
| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|-----------|
| `GET`  | `/` | ❌ | Lista todas as salas públicas |
| `GET`  | `/id/:id` | ❌ | Retorna detalhes de uma sala por ID |
| `GET`  | `/private` | ✅ | Lista salas privadas do usuário |
| `GET`  | `/private/:id` | ❌ | Retorna detalhes de uma sala privada por ID |
| `POST` | `/create` | ✅ | Cria uma nova sala |
| `PUT`  | `/update/:id` | ✅ | Atualiza uma sala existente |
| `DELETE` | `/delete/:id` | ✅ | Deleta uma sala |
| `GET`  | `/messages/:id` | ❌ | Retorna mensagens paginadas de uma sala |

---

## 🔒 Autenticação

A autenticação é feita via **JWT**.  
Após o login (`/user/signin`), inclua o token no header das requisições que exigem autenticação:

```http
Authorization: Bearer seu_token_jwt
```

---

## 📡 Integração WebSocket

O serviço envia mensagens para o **servidor WebSocket** definido na variável `CHATSERVER_URL`,  
notificando sobre criação, atualização e remoção de salas.

**Tipos de mensagens enviadas:**
- `addRoom` → Nova sala criada
- `updateRoom` → Sala atualizada
- `removeRoom` → Sala excluída

---

## Links

- **https://github.com/jacksont-santos/Talksy-App**
- **https://github.com/jacksont-santos/ws-orquestrator**

## Talksy App

https://talksy-app-hmtq.onrender.com
