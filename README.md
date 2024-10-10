## Sumário

1. [Descrição](#descricao)
2. [Tecnologias utilizadas](#tecnologias)
3. [Créditos](#creditos)
4. [Licença](#licenca)

<div id='descricao'/> 

## 1. Descrição

O projeto é uma plataforma web que mostra os horários dos cursos e professores do IFNMG Campus Salinas. O objetivo do projeto é facilitar o acesso aos horários para melhor organização e auxiliar o setor de ensino na manutenção da planilha.

<div id='tecnologias'/> 

## 2. Tecnologias utilizadas

### 2.1 Frontend

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/) (Deploy)

### 2.2 Backend

- [Java](https://www.java.com/pt-BR/download/help/whatis_java.html)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Google Sheets API](https://developers.google.com/sheets/api/reference/rest?hl=pt-br)
- [Docker](https://www.docker.com/)
- [Koyeb](https://www.koyeb.com/) (Deploy)

### 2.3 Variáveis de ambiente

#### Backend
- `API_KEY`: URL da API do Google Sheets.
- `SPREADSHEET_ID`: URL da Planilha do Google Sheets.
- `FRONTEND_URL`: URL do Frontend.
#### Frontend
- `NEXT_PUBLIC_BACKEND_URL`: URL do Backend.

<div id='creditos'/> 

## 3. Créditos

- [Criar um aplicativo Next.js](https://nextjs.org/docs/pages/api-reference/cli/create-next-app)
- [Guia de início rápido do Java com Google Sheets](https://developers.google.com/sheets/api/quickstart/java?hl=pt-br)
- [Como pular os testes no Maven durante a Build](https://marlonluan.com.br/posts/maven-pular-testes/)

<div id='licenca'/> 

## 4. Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.
