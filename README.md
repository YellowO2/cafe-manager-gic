# Café Employee Manager

Full-stack implementing a café and employee manager with NestJS, PostgreSQL, and a React frontend.

- Frontend: React (Vite), Ant Design, AG Grid, TanStack Query, React Router, Day.js, TypeScript
- Backend: NestJS (Node 22), Prisma ORM, PostgreSQL

## Links
Due to using free tier, server spins down after 15min inactive, which delays initial request by about 1min. Hence when first accessing the page, it probably takes about a minute for backend to respond. Subsequently it will be quick. Pardon 🙏
- Live App: https://cafe-manager-gic-frontend.onrender.com
- Deployed Backend: https://cafe-manager-gic-backend.onrender.com

## Running locally 

### Method 1: Docker Compose (recommended)

Prerequisites: Docker and Docker Compose installed.

```bash
docker compose up -d --build
```

Services:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Postgres: localhost:5432

Data is seeded automatically by Prisma on first run.

### Method 2: Individually

Frontend
```bash
nvm use 22
cd frontend
cp .env.example .env    # for vite base url
npm install
npm run dev
```

Backend
```bash
nvm use 22
cd backend
npm install
npm run prisma:generate && npm run prisma:migrate # if needed
npm run start:dev
```

Postgres
```
docker compose up -d postgres
```

## Project Structure

### Backend

<table width="100%">
<tr>
<td width="30%" valign="top">

Folder Structure (simplified)

```
backend/
├── src/
│   ├── cafes/
│   │   ├── controller
│   │   ├── service
│   │   └── dto/
│   ├── employees/
│   │   ├── controller
│   │   ├── service
│   │   └── dto/
│   └── prisma/
│       ├── service
│       └── module
└── prisma/
    ├── schema
    └── migrations/
```

</td>
<td>

**Diagram**

```mermaid
graph LR
    subgraph EmployeesModule
        EmpC[Controller]
        EmpS[Service]
        EmpC --> EmpS
    end
    
    subgraph CafesModule
        CafeC[Controller]
        CafeS[Service]
        CafeC --> CafeS
    end
    
    PrismaService[PrismaService]
    
    EmpS --> PrismaService
    CafeS --> PrismaService
    PrismaService --> DB[(PostgreSQL)]
```

</td>
</tr>
</table>

### Frontend

<table width="100%">
<tr>
<td width="30%">

Folder Structure (simplified)

```
frontend/
└── src/
    ├── api/
    │   # API client
    ├── features/
    │   # Pages
    ├── components/
    │   # Reusable UI
    └── hooks/
        # Custom hooks
```

</td>
<td>

**Diagram**

```mermaid
graph LR
    Pages["<b>Pages</b><br/>CafesPage<br/>EmployeesPage<br/>Forms"] --> API["<b>API Layer</b><br/>cafes.ts<br/>employees.ts"]
    Pages --> Components["<b>Components</b><br/>FormTextField<br/>PageHeader<br/>TableActionCell"]
    API -->|REST HTTP| Backend[Backend API]
```

</td>
</tr>
</table>

## APIs

cafes:
- GET `/cafes?location=<string>` → list cafes with employee counts, sorted by employee count desc
- GET `/cafes/:id` → get a cafe
- POST `/cafes` → create cafe
- PUT `/cafes/:id` → update cafe
- DELETE `/cafes/:id` → delete cafe and all its employees

employees:
- GET `/employees?cafe=<string>` → list employees (optional filtering with cafe name), sorted by days worked desc
- GET `/employees/:id` → employee details
- POST `/employees` → create employee
- PUT `/employees/:id` → update employee
- DELETE `/employees/:id` → delete employee

## Futher improvements
- send and store logo data as bytea instead of base64 string
- if more images/blob data are needed to be stored, would consider storing them in a cloud blob storage + CDN service.

