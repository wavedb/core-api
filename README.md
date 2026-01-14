# WaveDB

> **Modern metrics evaluation platform for machine learning experiments**

WaveDB is a modern alternative to TensorBoard - an open-source platform designed for tracking, visualizing, and evaluating metrics from machine learning models, neural networks, and other experiments. It provides a clean API for logging runs, managing projects, and analyzing experiment results.

## Features

- **Project Management** - Organize your experiments into projects for better organization
- **Run Tracking** - Track individual experiment runs with status, timestamps, and custom configurations
- **Metrics Logging** - Log scalar and image metrics with support for multiple data types (SCALAR, IMAGE, AUDIO, TEXT)
- **Object Storage** - Integrated MinIO for storing and retrieving images and other binary data
- **User Authentication** - Secure authentication using better-auth with session management
- **API Key Management** - Generate and manage API keys with rate limiting for programmatic access
- **RESTful API** - Clean and intuitive API design
- **Type-Safe** - Built with TypeScript for better developer experience

## Tech Stack

- **Runtime**: Bun / Node.js
- **Framework**: Hono (lightweight web framework)
- **Database**: PostgreSQL with Prisma ORM
- **Object Storage**: MinIO (S3-compatible storage)
- **Authentication**: better-auth with session management
- **Validation**: Zod
- **Language**: TypeScript

## Installation

### Prerequisites

- Bun or Node.js (v18+)
- Docker and Docker Compose (for PostgreSQL and MinIO)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/wavedb/core-api
cd core-api
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the infrastructure services (PostgreSQL and MinIO):
```bash
docker-compose -f docker/docker-compose.yml up -d
```

5. Run database migrations:
```bash
bun run migrate
```

6. Start the development server:
```bash
bun run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgres://wavedb:wavedbpassword@localhost:5432/wavedb?schema=public

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=3600

# MinIO Object Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadminpassword
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=wavedb-metrics
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get JWT token |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/project/create` | Create a new project |
| GET | `/project/list` | List all user projects |

### Runs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/runner/create` | Create a new run within a project |
| GET | `/runner/:runnerId` | Get runner details with configuration |

### Metrics

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/metric/scalar/:runnerId` | Log a scalar metric for a run |
| POST | `/metric/image/:projectId/:runnerId` | Upload and log an image metric |
| GET | `/metric/:runnerId` | Get all metrics for a run |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/` | Get user profile |
| POST | `/user/api-key` | Generate API key |

## Project Structure

```
wavedb-core/
├── docker/
│   └── docker-compose.yml    # PostgreSQL and MinIO services
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── metric.controller.ts
│   │   ├── project.controller.ts
│   │   ├── runner.controller.ts
│   │   └── user.controller.ts
│   ├── helpers/              # Utility helpers
│   │   ├── auth.ts
│   │   └── minio.ts
│   ├── middlewares/          # Auth & validation
│   │   ├── auth.ts
│   │   └── project.ts
│   ├── routers/              # API routes
│   │   ├── auth.router.ts
│   │   ├── metric.router.ts
│   │   ├── project.router.ts
│   │   ├── runner.router.ts
│   │   └── user.router.ts
│   ├── services/             # Business logic
│   ├── validations/          # Zod schemas
│   ├── types/                # TypeScript types
│   ├── exceptions.ts         # Custom errors
│   ├── constants.ts
│   └── index.ts              # Entry point
├── package.json
└── tsconfig.json
```

## Usage Example

### Register a new user

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "researcher", "email": "researcher@example.com", "password": "secure123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "researcher@example.com", "password": "secure123"}'
```

### Create a project

```bash
curl -X POST http://localhost:3000/project/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "Image Classification Experiment", "description": "Testing ResNet variants"}'
```

### Create a run

```bash
curl -X POST http://localhost:3000/runner/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "resnet50-run-1", "projectId": "PROJECT_ID", "config": {"learning_rate": 0.001, "batch_size": 32}}'
```

### Log a scalar metric

```bash
curl -X POST http://localhost:3000/metric/scalar/RUNNER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "loss", "value": 0.234, "step": 100, "tag": "training"}'
```

### Log an image metric

```bash
curl -X POST http://localhost:3000/metric/image/PROJECT_ID/RUNNER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=confusion_matrix" \
  -F "value=@/path/to/image.png" \
  -F "step=100" \
  -F "tag=validation"
```

### Get metrics for a run

```bash
curl -X GET http://localhost:3000/metric/RUNNER_ID?limit=100&orderBy=timestamp \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

```
User (id, name, email, emailVerified, image, createdAt, updatedAt)
  ├── Project (id, name, description, createdAt, updatedAt, userId)
  │    └── Run (id, name, status, startedAt, endedAt, config, projectId)
  │         └── RunnerMetric (id, name, value, step, tag, type, timestamp, runId)
  ├── Session (id, expiresAt, token, createdAt, ipAddress, userAgent, userId)
  ├── Account (id, accountId, providerId, userId, accessToken, refreshToken, password)
  ├── ApiKey (id, name, key, userId, rateLimitEnabled, expiresAt, permissions)
  └── Verification (id, identifier, value, expiresAt)

Additional Models:
  - Jwks: Stores public/private keys for JWT signing
  - RunnerMetric types: SCALAR, IMAGE, AUDIO, TEXT
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

---

**WaveDB** - Built with TypeScript by the WaveDB team

Repository: [https://github.com/wavedb/core-api](https://github.com/wavedb/core-api)
