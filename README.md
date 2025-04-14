# Inventory Management System (IMS)

A scalable, event-driven REST API for tracking product stock across multiple stores with support for caching, logging, rate-limiting, and Kubernetes-based deployment.

---

## Tech Stack

- **Node.js** + **Express** (TypeScript)
- **PostgreSQL** (stock, store, product, logs)
- **Redis** (caching layer for product reads)
- **RabbitMQ** (async messaging for event handling)
- **Kubernetes** (horizontal scaling, container orchestration)
- **Docker** + Docker Compose
- **express-rate-limit** (API rate limiting)
- **Basic Auth Middleware**

---

## Project Architecture

> Monolithic backend with modular folders and event-driven extensions.

- `src/controllers/`: Handle product/store/stock CRUD
- `src/routes/`: REST endpoints protected by Basic Auth
- `src/consumers/`: RabbitMQ consumers for logging and caching
- `src/utils/`: Redis client, event publisher, middlewares
- `src/db/`: PostgreSQL query strings
- `Dockerfile` & `docker-compose.yml`: Local orchestration
- Kubernetes manifests for container deployment

---

## Assumptions

- Each **store** can stock multiple **products**
- Each product belongs to a **global catalog**
- **Stock updates** are logged in an audit log table
- **No frontend** is required for this challenge
- API is protected with **Basic Authentication**
- Redis is used **only for reading product and store details**, with 1-hour expiration
- RabbitMQ is used for **event-based logging and caching** (e.g., on `GET_PRODUCT`)
- Logs are stored in a table — no full observability/logging stack 

---

## API Design

### Auth

All endpoints are protected using **Basic Auth** (`admin` / `hamnapassword123`).

### Routes

| Method | Endpoint                   | Description                       |
|--------|----------------------------|-----------------------------------|
| POST   | `/add-product`             | Add a new product                 |
| GET    | `/get-products`            | Get all products                  |
| GET    | `/get-product/:id`         | Get single product (Redis-cached) |
| PUT    | `/update-product`          | Update product info               |
| DELETE | `/delete-product/:id`      | Delete a product                  |
| POST   | `/add-stock`               | Add stock to a store              |
| PUT    | `/update-store-stock`      | Update stock quantity             |
| DELETE | `/delete-stock/:id`        | Remove stock from a store         |
| GET    | `/get-stock`               | View all stock entries            |
| GET    | `/get-store-stock/:id`     | Stock for a specific store        |
| GET    | `/get-filtered-stock`      | Filter by date/store              |
| POST   | `/add-store`               | Add a new store                   |
| GET    | `/get-stores`              | View all stores                   |
| GET    | `/get-store/:id`           | View a specific store             |
| PUT    | `/update-store/:id`        | Update store details              |
| DELETE | `/delete-store/:id`        | Delete a store                    |

---

## Rate Limiting

`express-rate-limit` is used to prevent abuse.  
Defaults to 1000 requests per 30 minutes per IP.

---

## Design Decisions

| Component         | Decision                                                                 |
|------------------|--------------------------------------------------------------------------|
| **Architecture** | Modular monolith, not microservices, to keep deployment and communication simple |
| **Database**      | Single PostgreSQL instance with normalized tables and relations          |
| **Async Updates** | RabbitMQ handles logging and caching in background                       |
| **Redis**         | Used to speed up `GET /get-product/:id` with TTL caching                 |
| **Authentication**| Basic Auth middleware instead of full user system (per spec)             |
| **Kubernetes**    | Used for orchestration and horizontal scaling of the API                 |

## Design Decisions Overview

| Design Area | Decision | Notes |
|------------|----------|-------|
| Architecture | Modular Monolith | Easier to manage and deploy; can be split into microservices in the future if scale or team separation demands it. |
| Database | PostgreSQL (Neon.tech) | Neon offers cloud-native Postgres with branching, but does not support sharding. Considered using Citus for future horizontal scaling. |
| Sharding Consideration | Citus (Postgres extension for distributed DBs) | Not supported on Neon, but could be applied if self-hosted or used on platforms like AWS RDS or DigitalOcean managed Postgres. |
| Kubernetes Deployment | Local single-node Kubernetes (e.g., Minikube) | Simulates production-like deployment and container orchestration. For real scaling, it could be deployed on GKE, EKS, or AKS to support multi-node clusters. |
| Authentication | Basic Auth (username/password via environment variables) | Sufficient for a prototype and internal tools, but in production should be replaced with a more robust system like JWT, OAuth, or API key management. |
| Caching | Redis | Used for caching product reads. Could be expanded to cache filtered stock reports, top products, or even full store snapshots for faster analytics. |
| Async Messaging | RabbitMQ | Used to handle event-driven cache updates and audit logging. Easily extensible for more complex event flows like notifications, restocks, or inter-service communication in microservice environments |

## Evolution (v1 → v3)

### Stage 1: Single Store
- Local SQLite database
- Basic routes for adding/removing stock
- No auth, no caching, no messaging

### Stage 2: Multi-Store System
- Switched to PostgreSQL
- Store-specific stock tables
- Filtering by store/date
- Added Basic Auth + Rate Limiting

### Stage 3: Scale & Performance
- Redis caching for product reads
- RabbitMQ for background logging + caching
- Dockerized architecture, deployed with Kubernetes
- Durable retry logic in RabbitMQ consumers
- Logging via a log table

---

### Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd inventory-tracking-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
PG_USER=your_neon_username
PG_HOST=your_neon_host
PG_NAME=your_database_name
PG_PASSWORD=your_neon_password
PG_PORT=5432
BASIC_AUTH_USERNAME=admin
BASIC_AUTH_PASSWORD=your_password
RABBITMQ_URL=amqp://localhost:5672
REDIS_URL=redis://localhost:6379
```

4. Start the services:
```bash
# Start Redis
docker run -d -p 6379:6379 redis:7-alpine

# Start RabbitMQ
docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Start the application
npm run dev
```

### Kubernetes Deployment

1. Start Minikube:
```bash
minikube start
```

2. Deploy the services in order:
```bash
# Apply ConfigMap and Secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# Deploy Redis
kubectl apply -f k8s/redis-deployment.yaml

# Deploy RabbitMQ
kubectl apply -f k8s/rabbitmq-deployment.yaml

# Deploy the Inventory API
kubectl apply -f k8s/inventory-deployment.yaml
```

3. Access the API:
```bash
# Port forward to access the API
kubectl port-forward service/inventory-app 3000:3000

# Test the API
curl http://localhost:3000/health
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PG_USER | Neon.tech database username | 
| PG_HOST | Neon.tech database host |
| PG_NAME | Database name |
| PG_PASSWORD | Database password | your_password |
| PG_PORT | Database port | 5432 |
| BASIC_AUTH_USERNAME | API authentication username | admin |
| BASIC_AUTH_PASSWORD | API authentication password | your_password |
| RABBITMQ_URL | RabbitMQ connection URL | amqp://localhost:5672 |
| REDIS_URL | Redis connection URL | redis://localhost:6379 |


