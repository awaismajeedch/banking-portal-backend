# 🏦 Banking Portal Backend  
A secure, scalable, and enterprise-grade backend for a modern banking system.  
Built with **Node.js, Express, TypeScript, PostgreSQL, and Prisma ORM (v7)** with full JWT authentication, protected routes, ACID-safe transactions, and clean layered architecture.

---

## 🚀 Features

### 🔐 Authentication & Security
- JWT **Access & Refresh Token** authentication  
- Password hashing with **bcrypt**  
- Role-based access control (**Admin/User**)  
- Protected routes via custom **auth middleware**  
- Secure API design following enterprise standards  

### 🧾 User & Account Management
- Create **Savings** and **Current** accounts  
- Automatically generated **unique account numbers**  
- Account status control (active/locked)  
- View user-owned accounts  

### 💸 Banking Transactions
- **Deposit**  
- **Withdraw**  
- **Transfer between accounts**  
- Full **transaction history** per account  
- Detailed **transfer logs** for auditing  
- Uses `prisma.$transaction()` for ACID guarantees  

### 🏗 Architecture Highlights
- Layered Architecture:  
  **Routes → Controllers → Services → Database (Prisma)**  
- Fully type-safe backend using **TypeScript**  
- Prisma 7 with PostgreSQL adapter  
- Clean project structure & best practices  

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 7 (PostgreSQL Adapter) |
| Security | JWT, bcrypt |
| Architecture | Layered Architecture / MVC |

---

## 📦 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/banking-portal-backend.git
cd banking-portal-backend
```

### 2️⃣ Install dependencies

```bash
npm install
```
### 3️⃣ Create .env file
```bash
DATABASE_URL="postgresql://USER:PASS@localhost:5432/banking_portal?schema=public"
ACCESS_TOKEN_SECRET="your_long_random_secret_here"
REFRESH_TOKEN_SECRET="your_long_random_secret_here"
PORT=5000
```
### 4️⃣ Run database migrations
```bash
npx prisma migrate dev
```
### 5️⃣ Start development server
```bash
npm run dev
```
### Server will start at: http://localhost:5000
## 🔗 API Endpoints

---

## 🔐 Auth Routes

| Method | Endpoint         | Description             |
|--------|------------------|-------------------------|
| POST   | `/auth/register` | Register a new user     |
| POST   | `/auth/login`    | Login & get tokens      |
| POST   | `/auth/refresh`  | Refresh access token    |

---

## 🧾 Account Routes  
**(Require `Authorization: Bearer <accessToken>`)**

| Method | Endpoint                 | Description                  |
|--------|---------------------------|------------------------------|
| POST   | `/accounts`              | Create a new bank account    |
| GET    | `/accounts`              | List user accounts           |
| GET    | `/accounts/:id`          | Get specific account details |
| PATCH  | `/accounts/:id/status`   | Admin: lock/unlock account   |

---

## 💸 Transaction Routes  
**(Require `Authorization: Bearer <accessToken>`)**

| Method | Endpoint                          | Description                |
|--------|------------------------------------|----------------------------|
| POST   | `/transactions/deposit`           | Deposit into an account    |
| POST   | `/transactions/withdraw`          | Withdraw from an account   |
| POST   | `/transactions/transfer`          | Transfer between accounts  |
| GET    | `/transactions/:accountId`        | View transaction history   |

---



