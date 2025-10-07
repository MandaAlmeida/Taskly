
# API Documentation

Esta API fornece endpoints para gerenciar Anotações, Categorias, Grupos, Subcategorias, Tarefas, Usuários e Uploads. Todos os endpoints requerem autenticação via JWT e, em alguns casos, permissões de roles.

## Índice

- [Autenticação](#autenticação)
- [Annotations](#annotations)
- [Categorias](#categorias)
- [Grupos](#grupos)
- [Subcategorias](#subcategorias)
- [Tarefas](#tarefas)
- [Usuários](#usuários)
- [Uploads](#uploads)

---

## Autenticação

Todos os endpoints requerem um token JWT válido. O token pode ser obtido no endpoint `POST /user/login`.

### Login

**POST** `/user/login`

- **Body**: 
  ```json
  {
    "username": "user@example.com",
    "password": "password"
  }
  ```

- **Response**:
  ```json
  {
    "token": "jwt_token_here"
  }
  ```

---

## Annotations

A API de Annotations permite criar, atualizar, excluir e buscar anotações. As permissões são controladas por roles de usuário.

### Criar Anotação

**POST** `/annotation/create`

- **Body**: `CreateAnnotationDTO` (com arquivos anexados)
- **Authorization**: Bearer Token

### Criar Anotação por Grupo

**POST** `/annotation/createByGroup/:groupId`

- **Body**: `CreateAnnotationDTO` (com arquivos anexados)
- **Authorization**: Bearer Token
- **Roles**: ADMIN, EDIT, DELETE

### Buscar Anotações por Usuário

**GET** `/annotation/fetchByUser`

- **Query Parameters**: `p` (página)
- **Authorization**: Bearer Token

### Buscar Anotações por Grupo

**GET** `/annotation/fetchByGroup`

- **Authorization**: Bearer Token

### Buscar Anotação por ID

**GET** `/annotation/fetchById/:annotationId`

- **Authorization**: Bearer Token

### Atualizar Anotação

**PUT** `/annotation/update/:annotationId`

- **Body**: `UpdateAnnotationDTO` (com arquivos anexados)
- **Authorization**: Bearer Token
- **Roles**: ADMIN, EDIT, DELETE

### Deletar Anotação

**DELETE** `/annotation/delete/:annotationId`

- **Authorization**: Bearer Token
- **Roles**: ADMIN

---

## Categorias

A API de Categorias permite criar, atualizar, excluir e buscar categorias.

### Criar Categoria

**POST** `/categories/create`

- **Body**: `CreateCategoryDTO`
- **Authorization**: Bearer Token

### Buscar Categorias

**GET** `/categories/fetch`

- **Authorization**: Bearer Token

### Buscar Categoria por ID

**GET** `/categories/fetchById/:categoryId`

- **Authorization**: Bearer Token

### Atualizar Categoria

**PUT** `/categories/update/:id`

- **Body**: `UpdateCategoryDTO`
- **Authorization**: Bearer Token

### Deletar Categoria

**DELETE** `/categories/delete/:id`

- **Authorization**: Bearer Token

---

## Grupos

A API de Grupos permite criar, atualizar, excluir e gerenciar membros de grupos.

### Criar Grupo

**POST** `/group/create`

- **Body**: `CreateGroupDTO`
- **Authorization**: Bearer Token

### Buscar Grupos

**GET** `/group/fetch`

- **Authorization**: Bearer Token

### Atualizar Grupo

**PUT** `/group/update/:id`

- **Body**: `UpdateGroupDTO`
- **Authorization**: Bearer Token
- **Roles**: ADMIN

### Deletar Grupo

**DELETE** `/group/delete/:id`

- **Authorization**: Bearer Token
- **Roles**: ADMIN

---

## Subcategorias

A API de Subcategorias permite criar, atualizar, excluir e buscar subcategorias.

### Criar Subcategoria

**POST** `/sub-category/create`

- **Body**: `CreateSubCategoryDTO`
- **Authorization**: Bearer Token

### Buscar Subcategorias

**GET** `/sub-category/fetch`

- **Authorization**: Bearer Token

### Buscar Subcategoria por ID

**GET** `/sub-category/fetchById/:subCategoryId`

- **Authorization**: Bearer Token

### Atualizar Subcategoria

**PUT** `/sub-category/update/:id`

- **Body**: `UpdateSubCategoryDTO`
- **Authorization**: Bearer Token

### Deletar Subcategoria

**DELETE** `/sub-category/delete/:id`

- **Authorization**: Bearer Token

---

## Tarefas

A API de Tarefas permite criar, atualizar, excluir e gerenciar tarefas.

### Criar Tarefa

**POST** `/task/create`

- **Body**: `CreateTaskDTO`
- **Authorization**: Bearer Token

### Buscar Tarefas

**GET** `/task/fetch`

- **Authorization**: Bearer Token

### Atualizar Tarefa

**PUT** `/task/update/:id`

- **Body**: `UpdateTaskDTO`
- **Authorization**: Bearer Token

### Deletar Tarefa

**DELETE** `/task/delete/:id`

- **Authorization**: Bearer Token

---

## Usuários

A API de Usuários permite registrar, atualizar, excluir e buscar informações do usuário.

### Criar Usuário

**POST** `/user/register`

- **Body**: `CreateUserDTO` (com arquivo opcional)
- **Authorization**: Nenhuma (para registro)

### Buscar Usuário por Token

**GET** `/user/fetch`

- **Authorization**: Bearer Token

### Atualizar Usuário

**PUT** `/user/update`

- **Body**: `UpdateUserDTO` (com arquivo opcional)
- **Authorization**: Bearer Token

### Deletar Usuário

**DELETE** `/user/delete`

- **Authorization**: Bearer Token

---

## Uploads

A API de Uploads permite realizar upload, download e excluir arquivos.

### Upload de Arquivo

**POST** `/uploads`

- **Body**: Arquivo
- **Authorization**: Bearer Token

### Obter URL do Arquivo

**GET** `/uploads/:filename`

- **Authorization**: Bearer Token

### Download de Arquivo

**GET** `/uploads/download/:fileKey`

- **Authorization**: Bearer Token

### Deletar Arquivo

**DELETE** `/uploads/:filename`

- **Authorization**: Bearer Token

---

## Exemplo de Header para Requisição

Para autenticar todas as requisições, adicione o token JWT no cabeçalho `Authorization` da seguinte forma:

```http
Authorization: Bearer {seu_token_jwt}
```
