# Flow Builder - Backend API

A NestJS-based backend API for the Flow Builder application, providing user authentication and workflow management functionality.

## 🚀 Features

- **User Authentication**: JWT-based authentication with registration and login
- **Workflow Management**: Create, read, update, delete workflows
- **Workflow Validation**: Validate workflow components and connections
- **PostgreSQL Database**: Robust data persistence with TypeORM
- **API Documentation**: Swagger/OpenAPI documentation
- **CORS Support**: Configured for frontend integration

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Docker** (for PostgreSQL database)
- **Git**

## 🏁 Getting Started

### 1. Clone the Repository

### 2. Install Dependencies

npm install

### 3. Setup Database

Start PostgreSQL using Docker:
docker run --name flow-app
-e POSTGRES_DB=flow-app
-e POSTGRES_PASSWORD=password
-v $HOME/code/flow-app/data:/var/lib/postgresql/data:z
-p 5432:5432
-d postgres:13-alpine

### 4. Environment Configuration

Create a `.env` file in the backend root directory:

NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=flow-app

JWT*SECRET=f5Q{lcz&z*==x
JWT_EXPIRES_IN=24h

### 5. Run the Application

npm run start:dev

## 📚 API Documentation

Once the application is running, you can access:

- **API Base URL**: `http://localhost:3001`
- **Swagger Documentation**: `http://localhost:3001/api`

## 🔗 API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/verify` - Verify JWT token

### Users

- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

### Workflows

- `GET /workflows` - Get all user workflows
- `GET /workflows/:id` - Get specific workflow
- `POST /workflows` - Create new workflow
- `PUT /workflows/:id` - Update workflow
- `DELETE /workflows/:id` - Delete workflow
- `POST /workflows/validate` - Validate workflow structure
