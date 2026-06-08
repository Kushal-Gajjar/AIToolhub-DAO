# AIToolHub DAO

A decentralized autonomous organization (DAO) for community-governed AI tools, built with:

- **Frontend**: React + Vite + Zustand + ethers.js
- **Backend API**: ASP.NET Core 8 + Entity Framework Core + PostgreSQL + SignalR
- **AI Microservices**: Python FastAPI + Celery + Redis
- **Smart Contracts**: Solidity + OpenZeppelin Governor + Hardhat
- **Infrastructure**: Docker Compose + Nginx

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
