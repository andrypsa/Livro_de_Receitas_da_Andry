# 🍰 Caderno Digital de Receitas da Andry

Aplicação web full stack para cadastrar, organizar, consultar e gerenciar receitas.

Desenvolvida com **Java + Spring Boot** no backend e **React + TypeScript** no frontend, utilizando **MySQL** para persistência dos dados e **Spring Security** para autenticação e controle de acesso.

> 🚧 Projeto em desenvolvimento contínuo, ainda não finalizado, este é um README inicial.

---

## 📌 Sobre o projeto

O **Caderno Digital de Receitas da Andry** foi criado para centralizar receitas em uma aplicação organizada, pesquisável e acessível por diferentes dispositivos.

A aplicação possui:

- área pública para consulta de receitas;
- área administrativa para gerenciamento completo;
- controle de receitas públicas e privadas;
- gerenciamento de imagens;
- diferentes níveis de acesso administrativo.

---

## ✨ Funcionalidades

### 🍽️ Receitas

- cadastro, edição e exclusão;
- visualização detalhada;
- pesquisa por nome;
- filtro por categoria;
- controle de privacidade;
- origem e status da receita;
- upload e remoção de múltiplas imagens.

### 🔐 Área administrativa

- primeiro acesso do administrador principal;
- login e logout;
- autenticação por sessão;
- proteção CSRF;
- gerenciamento completo das receitas;
- controle de permissões.

### 👥 Administradores

O sistema permite até dois administradores ativos:

- **Administrador principal:** gerencia receitas e administradores;
- **Administrador secundário:** gerencia receitas, mas não possui acesso ao gerenciamento de administradores.

O segundo administrador é criado por meio de um **convite com token**, no qual o próprio convidado define sua senha.

---

## 🛠️ Tecnologias

### Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL
- Maven

### Frontend

- React
- TypeScript
- Vite
- React Router
- Fetch API
- HTML
- CSS

### Ferramentas

- Git
- GitHub
- Visual Studio Code
- npm

---

## 🏗️ Arquitetura

```text
React + TypeScript
        ↓
      API REST
        ↓
Java + Spring Boot
        ↓
JPA / Hibernate
        ↓
      MySQL
```

---

## 📂 Estrutura principal

```text
Livro_de_Receitas_da_Andry/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── types/
│       └── utils/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/andry/livrodigitalreceitas/
│       │       ├── config/
│       │       ├── controller/
│       │       ├── dto/
│       │       ├── exception/
│       │       ├── model/
│       │       ├── repository/
│       │       └── service/
│       │
│       └── resources/
│
├── pom.xml
└── README.md
```

---

## 🔐 Segurança

O projeto utiliza:

- Spring Security;
- BCrypt para armazenamento de senhas;
- autenticação baseada em sessão;
- proteção CSRF;
- controle de acesso por roles;
- proteção dos endpoints no backend;
- tokens exclusivos para convites administrativos;
- credenciais locais fora do versionamento.

Roles utilizadas:

```text
ROLE_ADMIN
ROLE_ADMIN_PRINCIPAL
```

---

## 🚀 Executando localmente

### Pré-requisitos

- Java 17
- Node.js
- npm
- MySQL
- Git

### Backend

Crie localmente:

```text
src/main/resources/application-local.properties
```

Exemplo:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/NOME_DO_BANCO
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
```

Depois execute:

```bash
.\mvnw.cmd spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
---

## ✅ Status

Atualmente já estão funcionais:

- [x] CRUD de receitas
- [x] receitas públicas e privadas
- [x] upload de imagens
- [x] pesquisa e filtros
- [x] autenticação administrativa
- [x] controle de sessão
- [x] administrador principal e secundário
- [x] convite por token
- [x] ativação, desativação e reativação de administrador

---

## 🗺️ Próximas evoluções

- [ ] login de visitantes com Google
- [ ] login de visitantes com Facebook
- [ ] favoritos
- [ ] comentários
- [ ] impressão e PDF
- [ ] armazenamento de imagens em nuvem
- [ ] ampliação dos testes automatizados
- [ ] migrations do banco
- [ ] CI/CD
- [ ] deploy

---

## 👩‍💻 Autoria

Desenvolvido por **Andrielly Patrícia** como projeto pessoal e aplicação prática de desenvolvimento full stack.

---

## ⚖️ Licença e direitos autorais

© 2026 Andrielly Patrícia Silva Araújo. Todos os direitos reservados.

Este projeto, incluindo seu código-fonte, estrutura, documentação e demais materiais autorais, é de titularidade de sua autora e foi disponibilizado publicamente para fins de **portfólio, demonstração e avaliação técnica**.

A disponibilização deste repositório não concede autorização para exploração comercial do projeto.

É proibida, sem autorização prévia e expressa da autora, a utilização deste projeto, total ou parcialmente, para:

- comercialização ou revenda;
- utilização em produtos ou serviços comerciais;
- redistribuição como produto próprio;
- sublicenciamento;
- apropriação ou apresentação do projeto como sendo de autoria de terceiros.

A visualização pública do código e as funcionalidades disponibilizadas pela própria plataforma GitHub não representam transferência de titularidade ou concessão automática de licença comercial.
Caso exista interesse em utilizar, adaptar, licenciar ou comercializar este projeto, entre em contato com a autora para avaliação e negociação de uma autorização ou licença específica.
O uso não autorizado poderá estar sujeito às medidas cabíveis previstas na legislação aplicável de proteção de software e direitos autorais.

**Para propostas de licenciamento, autorização de uso ou exploração comercial*, entre em contato com a autora pelo Linkedin: https://www.linkedin.com/in/andrielly-patricia/.