# AIToolHub DAO

A decentralized autonomous organization (DAO) for community-governed AI tools, built with:

- **Frontend**: React + Vite + Zustand + ethers.js
- **Backend API**: ASP.NET Core 8 + Entity Framework Core + PostgreSQL + SignalR
- **AI Microservices**: Python FastAPI + Celery + Redis
- **Smart Contracts**: Solidity + OpenZeppelin Governor + Hardhat
- **Infrastructure**: D<div align="center">

<br/>

```
 █████╗ ██╗████████╗ ██████╗  ██████╗ ██╗     ██╗  ██╗██╗   ██╗██████╗       ██████╗  █████╗  ██████╗ 
██╔══██╗██║╚══██╔══╝██╔═══██╗██╔═══██╗██║     ██║  ██║██║   ██║██╔══██╗      ██╔══██╗██╔══██╗██╔═══██╗
███████║██║   ██║   ██║   ██║██║   ██║██║     ███████║██║   ██║██████╔╝█████╗██║  ██║███████║██║   ██║
██╔══██║██║   ██║   ██║   ██║██║   ██║██║     ██╔══██║██║   ██║██╔══██╗╚════╝██║  ██║██╔══██║██║   ██║
██║  ██║██║   ██║   ╚██████╔╝╚██████╔╝███████╗██║  ██║╚██████╔╝██████╔╝      ██████╔╝██║  ██║╚██████╔╝
╚═╝  ╚═╝╚═╝   ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝       ╚═════╝ ╚═╝  ╚═╝ ╚═════╝
```

### 🤖 Community-Governed AI Tools Platform on the Blockchain

<br/>

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Web3%20%7C%20Blockchain-blueviolet?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![Backend](https://img.shields.io/badge/Backend-.NET%208-512BD4?style=for-the-badge&logo=dotnet)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

<br/>

> **AIToolHub DAO** is a decentralized autonomous organization where the community proposes, votes on, funds, and governs AI tools — all powered by smart contracts on the Polygon blockchain.

<br/>

---

</div>

<br/>

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#️-project-structure)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Running the App](#-running-the-app)
- [Smart Contract Deployment](#-smart-contract-deployment)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#️-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

<br/>

---

## Features

<br/>

| Feature | Description |
|---|---|
| **On-Chain Governance** | Propose and vote on AI tools using smart contracts |
| **AI Microservices** | Python FastAPI services with async task queue via Celery |
| **Secure Auth** | JWT-based authentication with .NET Core middleware |
| **Real-Time Updates** | SignalR WebSocket for live voting and proposal updates |
| **Web3 Integration** | Connect wallet via ethers.js, interact with Polygon contracts |
| **Fully Dockerized** | Full stack runs with a single `docker-compose up` command |

<br/>

---

## Tech Stack

<br/>

### Frontend
| Technology | Purpose |
|---|---|
| **React + Vite** | UI framework & fast bundler |
| **Zustand** | Lightweight state management |
| **ethers.js** | Blockchain & wallet interaction |

### Backend API
| Technology | Purpose |
|---|---|
| **ASP.NET Core 8** | REST API framework |
| **Entity Framework Core** | ORM for database access |
| **PostgreSQL** | Relational database |
| **SignalR** | Real-time WebSocket communication |

### AI Microservices
| Technology | Purpose |
|---|---|
| **Python FastAPI** | High-performance async API |
| **Celery** | Distributed task queue |
| **Redis** | Message broker & caching |

### Smart Contracts
| Technology | Purpose |
|---|---|
| **Solidity** | Smart contract language |
| **OpenZeppelin Governor** | DAO governance framework |
| **Hardhat** | Development & testing environment |

<br/>

---

##  Project Structure

```
aitoolhub-dao/
│
├── 📁 aitoolhub-frontend/       # React frontend (Vite + Zustand + ethers.js)
│   └── src/
│       ├── components/          # Reusable UI components
│       ├── pages/               # Application pages
│       ├── store/               # Zustand state stores
│       └── utils/               # Helper functions & web3 utils
│
├── 📁 aitoolhub-api/            # ASP.NET Core 8 REST API
│   ├── Controllers/             # API route handlers
│   ├── Models/                  # Entity models
│   ├── Services/                # Business logic
│   └── Hubs/                    # SignalR hubs
│
├── 📁 aitoolhub-ai/             # Python FastAPI microservices
│   ├── routers/                 # API route definitions
│   ├── tasks/                   # Celery async tasks
│   └── models/                  # AI model integrations
│
├── 📁 aitoolhub-contracts/      # Solidity smart contracts
│   ├── contracts/               # .sol contract files
│   ├── scripts/                 # Deployment scripts
│   └── test/                    # Contract test files
│
├── docker-compose.yml           # Multi-service orchestration
└── nginx.conf                   # Reverse proxy config
```

<br/>

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)

<br/>

---

## Installation

**1. Clone the repository**
```bash
git clone https://github.com/DhruviGajjar26/AItoolhub-DAO.git
cd aitoolhub-dao
```

**2. Set up environment variables**
```bash
cp .env.example .env
# Fill in your values (see Environment Variables section)
```

**3. Install contract dependencies**
```bash
cd aitoolhub-contracts
npm install
```

<br/>

---

## Running the App

### Start All Services (Docker)
```bash
docker-compose up --build
```

### Service URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| .NET API (Swagger) | http://localhost:5000/swagger |
| Python AI (Docs) | http://localhost:8000/docs |
| Nginx Proxy | http://localhost:80 |

<br/>

---

## Smart Contract Deployment

```bash
cd aitoolhub-contracts

# Run tests
npx hardhat test

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai
```

<br/>

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tools` | Get all AI tools |
| `POST` | `/api/proposals` | Submit a new proposal |
| `GET` | `/api/proposals` | Get all proposals |
| `POST` | `/api/vote` | Cast a vote on a proposal |
| `GET` | `/api/results/:id` | Get voting results |

<br/>

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# JWT Authentication (minimum 32 characters)
Jwt__Secret=your_super_secret_key_here

# Smart Contract Deployer Wallet
PRIVATE_KEY=your_wallet_private_key

# Polygon Contract Verification
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

>  **Never commit your `.env` file!** It is already listed in `.gitignore`.

<br/>

---

## Contributing

Contributions are always welcome! Here's how:

```bash
# 1. Fork the project
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m "Add some AmazingFeature"

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

<br/>

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br/>

---

<div align="center">

Made by **[Dhruvi Gajjar](https://github.com/DhruviGajjar26)**
, Contributed by **[Kushal-Gajjar](https://github.com/Kushal-Gajjar)**

 **Star this repo if you found it helpful!**

</div>Docker Compose + Nginx

## Quick Start

```bash
# Clone and start all services
git clone <repo>
cd aitoolhub-dao
docker-compose up --build
```

| Service       | URL                          |
|---------------|------------------------------|
| Frontend      | http://localhost:3000        |
| .NET API      | http://localhost:5000/swagger|
| Python AI     | http://localhost:8000/docs   |
| Nginx Proxy   | http://localhost:80          |

## Project Structure

```
aitoolhub-dao/
├── aitoolhub-frontend/    React frontend (Vite)
├── aitoolhub-api/         ASP.NET Core 8 REST API
├── aitoolhub-ai/          Python FastAPI AI microservices
├── aitoolhub-contracts/   Solidity smart contracts (Hardhat)
├── docker-compose.yml
└── nginx.conf
```

## Smart Contract Deployment

```bash
cd aitoolhub-contracts
npm install
npx hardhat test
npx hardhat run scripts/deploy.js --network mumbai
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:
- `Jwt__Secret` — min 32-char secret for JWT signing
- `PRIVATE_KEY` — deployer wallet private key for contracts
- `POLYGONSCAN_API_KEY` — for contract verification
"." 
