# Universe Microservices Demo

This is a microservices-based application built with **NestJS** and **Nx Monorepo**. It demonstrates an event-driven architecture using RabbitMQ, PostgreSQL, and Prometheus monitoring.

## 🏗 Architecture

The system consists of two main services:

1.  **Products Service** (REST API): Handles CRUD operations for products and publishes events.
2.  **Notifications Service** (Worker): Consumes events from RabbitMQ and logs notifications.

### Tech Stack

- **Framework:** NestJS (Fastify adapter)
- **Language:** TypeScript
- **Database:** PostgreSQL, postgres.js, Drizzle for migrations
- **Message Broker:** RabbitMQ
- **Monitoring:** Prometheus
- **Tooling:** Nx, Docker, Swagger

---

## 🐳 Docker (Full Setup)

To run the entire system (Apps + Infra) inside Docker:

```bash
docker-compose up --build
```

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Prerequisites

- Node.js (v18+)
- Docker & Docker Compose

### 2. Installation

Install dependencies:

```bash
npm install
```

### 3. Setup Environment & Infrastructure

Generate local secrets and start Docker containers (Postgres, RabbitMQ, Prometheus):

```bash
# Create dummy secrets files (apps/products/.secrets/...)
npm run seed:secrets

# Start infrastructure
npm run infra:up
```

Wait a few seconds for the database to become healthy. Then run migrations:

```bash
npm run db:migrate
```

### 4. Run Applications

Start both microservices (`products` and `notifications`) in parallel:

```bash
npm run start:all
```

---

## 📡 API & Monitoring

Once the application is running, you can access:

- **Swagger API Docs:** [http://localhost:8080](http://localhost:8080) (user: `swagger`, pass: `swagger`)
- **Prometheus UI:** [http://localhost:9090](http://localhost:9090)
- **RabbitMQ Dashboard:** [http://localhost:15672](http://localhost:15672) (user: `test`, pass: `test`)
- **Metrics Endpoint:** [http://localhost:8080/api/v1/metrics](http://localhost:8080/api/v1/metrics)

---

## 🧪 Testing

To run integration tests:

```bash
npx nx test products
```

## 📊 Key Metrics

To view custom business metrics in Prometheus, search for:

- `products_actions_total` - Counter for created/deleted products with labels `status` (success/error) and `action`.
