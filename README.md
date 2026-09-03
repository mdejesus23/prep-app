# Preparation App API 🚀

## Overview 📖

This REST API serves as the backend for the Preparation App — a tool for planning
liturgical celebrations. Teams create themed preparation sessions, members unlock
a session with a shared passcode and vote on the readings to use, and the final
selection is saved as a result. Alongside that, the API serves a song and book
library and proxies liturgical reference data.

It is built with Node.js and Express, using MongoDB (Atlas) for data storage and
JWT for authentication.

## API Documentation 📚

Interactive OpenAPI 3.0 docs are served by Swagger UI at **`/api-docs`**:

- **Live:** <https://bible-themeapp.melnerdz.com/api-docs>
- **Local:** `npm run start:dev`, then open <http://localhost:3000/api-docs>

The docs are public in every environment. The spec is generated at startup by
[`docs/swagger.js`](docs/swagger.js) from `@openapi` JSDoc comments in
[`routes/`](routes/) — shared schemas, pagination params and error responses live
in `docs/swagger.js`, per-endpoint details next to the route they describe. When
you add a route, add its annotation block in the same file.

"Try it out" targets whatever origin serves the docs, so it works locally and in
production with no configuration. To exercise protected endpoints, log in via
`POST /api/v1/users/login` and paste the returned `token` into
**Authorize → bearerAuth** (the `jwt` cookie also works, since the docs are
served from the API's own origin).

## Features ✨

- **User Authentication:** 🔐 Sign-up, login and logout with JWT, delivered both
  as a bearer token and as an `httpOnly` cookie. Passwords are hashed with
  bcrypt.
- **Account Management:** 🧑‍💻 Profile updates, password changes, emailed
  password-reset flow, and soft-delete deactivation.
- **Themed Sessions & Voting:** 🗳️ Create themes, protect them with a passcode,
  attach readings, and let members toggle votes per reading. Results are stored
  in MongoDB.
- **Profile Image Uploads:** 🖼️ Uploads handled by Multer and stored on
  Cloudinary, with the previous image cleaned up and delivery URLs optimized.
- **Song & Book Library:** 🎵📕 Public catalogue of songs and of books served as
  EPUB links.
- **Liturgy of the Hours:** 🙏 Browse entries, or filter them by liturgical week
  and season.
- **Liturgical Reference Data:** 📅 Proxies the Inadiutorium liturgical calendar
  and bible-api.com for scripture passages.
- **Querying:** 🔎 List endpoints support pagination, sorting, field selection
  and case-insensitive search via a shared query builder.
- **Transactional Email:** 📧 Welcome and password-reset emails via Nodemailer
  and SendGrid.
- **API Security:** 🛡️ Helmet security headers, per-IP rate limiting, NoSQL
  injection sanitizing, XSS cleaning, HTTP parameter pollution protection,
  credentialed CORS, and centralized error handling.

## API Overview 🗺️

All routes are prefixed with `/api/v1`. See `/api-docs` for full details.

| Area                    | Base path                                | Auth        |
| ----------------------- | ---------------------------------------- | ----------- |
| Users & authentication  | `/users`                                 | Mixed       |
| Themes (owner-scoped)   | `/admin/themes`                          | Required    |
| Readings within a theme | `/admin/themes/:themeId/readings`        | Required    |
| Session access & voting | `/preparation`                           | Required    |
| Preparation results     | `/results`                               | Required    |
| Songs                   | `/songs`                                 | Public      |
| Books                   | `/books`                                 | Public      |
| Liturgy of the Hours    | `/liturgy-of-hours`                      | Public      |
| Liturgical calendar     | `/liturgy/:year/:month/:day`             | Public      |
| Bible passages          | `/bible/:verse`                          | Public      |

Signup, login, logout and the password-reset endpoints are public; the remaining
`/users` routes require a token.

## Tech Stack 🛠️

- **Node.js** ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white) (v18)
- **Express.js** ![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
- **Mongoose (MongoDB Atlas)** ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
- **Swagger / OpenAPI 3.0** ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black)
- **Docker & Caddy** ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
- **JWT for Authentication** 🔑
- **bcrypt for Password Hashing** 🔒
- **Helmet, rate limiting & input sanitizing for Security** 🪖
- **Cloudinary + Multer for Uploads** ☁️
- **Nodemailer + SendGrid for Email** 📧

## Getting Started 🏁

**Prerequisites:** Node.js 18 and a MongoDB Atlas cluster.

```bash
git clone https://github.com/mdejesus23/prep-app.git
cd prep-app
npm install
cp .env.example .env   # then fill in your own values
npm run start:dev      # nodemon, http://localhost:3000
```

Configuration is read from `.env`; see [`.env.example`](.env.example) for the
full list — MongoDB credentials, the JWT secret and expiry, the frontend URL and
cookie domain for CORS/cookies, SendGrid credentials, and Cloudinary keys.

**Scripts**

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `npm run start:dev`  | Development server with nodemon      |
| `npm run start:prod` | Production server                    |
| `npm start`          | Start the server                     |
| `npm run debug`      | Start under the `ndb` debugger       |

## Docker 🐳

Local development with hot reload:

```bash
docker compose up --build
```

Production, on the VPS:

```bash
docker compose -f docker-compose.prod.yml up -d
```

The production stack runs the app behind **Caddy**, which terminates TLS and
renews certificates automatically for the domain in the [`Caddyfile`](Caddyfile).
Container logs are rotated by Docker's `json-file` driver, and two monitoring
services ship with the stack — **Netdata** (host and container metrics) and
**Dozzle** (live log viewer). Both bind to `127.0.0.1` only, so reach them
through an SSH tunnel:

```bash
ssh -L 19999:localhost:19999 -L 8888:localhost:8888 user@your-vps
```

## Project Structure 📁

```
├── app.js              # Express app: middleware, routes, error handler
├── server.js           # DB connection and HTTP server bootstrap
├── controllers/        # Route handlers, incl. a generic CRUD factory
├── models/             # Mongoose schemas
├── routes/             # Route definitions + OpenAPI annotations
├── docs/swagger.js     # OpenAPI base spec and shared components
├── utils/              # Query features, error types, email, Cloudinary
├── scripts/            # Python helpers for importing liturgy content
└── Caddyfile           # Reverse proxy + automatic TLS
```
