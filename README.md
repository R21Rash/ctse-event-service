# CTSE Event Service

An event management microservice built with **Node.js**, **Express**, and **MongoDB**. Part of the CTSE Cloud Computing group project — Event Management System.

## Architecture

This service manages events and integrates with the **Auth Service** for token validation (inter-service communication).

### Endpoints

| Method | Endpoint          | Description               | Auth Required |
| ------ | ----------------- | ------------------------- | ------------- |
| `POST` | `/api/events`     | Create a new event        | Yes (Bearer)  |
| `GET`  | `/api/events`     | List all events           | No            |
| `GET`  | `/api/events/:id` | Get event by ID           | No            |
| `PUT`  | `/api/events/:id` | Update an event           | Yes (Bearer)  |
| `GET`  | `/health`         | Health check              | No            |
| `GET`  | `/api-docs`       | Swagger API documentation | No            |

## Inter-Service Communication

This service communicates with the **Auth Service** to validate JWT tokens:

```
Client → Event Service (with JWT token in header)
           ↓ calls Auth Service /api/auth/validate
           ← returns user info if valid
           → proceeds with event operation
```

Auth Service URL is configured via the `AUTH_SERVICE_URL` environment variable.

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Auth**: JWT validation via Auth Service (inter-service)
- **Security**: Helmet.js, express-rate-limit, express-validator
- **Docs**: Swagger (swagger-jsdoc + swagger-ui-express)
- **Testing**: Jest + Supertest
- **Linting**: ESLint
- **Containerization**: Docker (multi-stage build)
- **CI/CD**: GitHub Actions
- **Cloud**: AWS (ECR + ECS Fargate)
- **SAST**: Snyk

## Getting Started

### Local Development

```bash
npm install
npm run dev
```

### Docker

```bash
docker build -t event-service .
docker run -p 3001:3001 --env-file .env event-service
```

## Project Structure

```
src/
├── app.js                 # Express app setup
├── server.js              # Server entry point
├── config/
│   ├── db.js              # MongoDB connection
│   └── swagger.js         # Swagger configuration
├── controllers/
│   └── eventController.js # Event CRUD logic
├── middleware/
│   └── authMiddleware.js  # Token validation via Auth Service
└── routes/
    └── eventRoutes.js     # Route definitions + Swagger docs
tests/
└── event.test.js          # Integration tests
```

## License

ISC
