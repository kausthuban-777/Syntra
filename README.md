# Syntra

### AI-Powered HR, CRM & Operations Management Platform

Syntra is a unified enterprise platform designed to manage **Human Resources, Customer Relationship Management, Recruitment, Sales, Support, and Office Operations** within a single intelligent system.

The platform integrates operational workflows with **AI automation** to improve productivity, streamline hiring, manage sales pipelines, and provide real-time business insights.

---

## Platform Overview

Syntra consolidates multiple business systems into one centralized application:

* Human Resource Management
* Recruitment & Candidate Tracking
* CRM & Sales Pipeline
* Office Operations Management
* Customer Support
* AI Automation & Insights
* Business Analytics Dashboard

The goal is to provide organizations with a **single operational platform** to manage workforce, customers, and business processes efficiently.

---

## Core Modules

### HR Management

* Employee database and profiles
* Role and department management
* Employee lifecycle tracking
* Leave and attendance management
* Payroll and salary management
* Employee self-service portal

### Recruitment & Interview Screening

* Job posting management
* Applicant tracking system (ATS)
* Resume parsing and candidate scoring
* Interview scheduling and evaluation
* Hiring pipeline tracking

### CRM & Sales Management

* Lead capture and management
* Sales pipeline tracking
* Customer database
* Communication logs
* Quotation and invoice generation
* Payment tracking and commission calculation

### Customer Support

* Shared inbox system
* Ticket management
* Multi-channel support
* AI chatbot assistance

### Office Operations

* Task management
* Project tracking
* Asset and equipment management
* Document management

### AI Automation

* Resume analysis
* Lead scoring
* Interview question generation
* Sales forecasting
* Productivity insights
* Automated responses

### Analytics & Dashboards

* HR insights
* Sales analytics
* Recruitment performance
* Support metrics
* Business intelligence reporting

---

## Technology Stack

### Frontend

* Angular
* Bootstrap / PrimeNG
* TypeScript

### Backend

* NestJS
* Node.js
* TypeORM

### Database

* PostgreSQL

### Infrastructure

* Docker
* Nginx
* CI/CD Pipeline

### AI Integration

* OpenAI APIs
* LangChain (future)

---

## Project Structure

```
src/
 ├ hr-crm-webapp        # Angular Frontend
 └ hr-crm-backend       # NestJS Backend

docker/
 └ nginx

docker-compose.yml
```

Frontend and backend run as **independent services** connected through REST APIs.

---

## Development Setup

### Prerequisites

* Node.js
* Docker
* PostgreSQL
* Angular CLI

---

### Install Frontend

```
cd src/hr-crm-webapp
npm install
ng serve
```

Frontend runs on:

```
http://localhost:4200
```

---

### Install Backend

```
cd src/hr-crm-backend
npm install
npm run start:dev
```

Backend runs on:

```
http://localhost:3000
```

---

## API Endpoint Example

```
GET /api/health
```

Response

```json
{
  "status": "ok",
  "message": "Backend running"
}
```

---

## Docker Deployment

Build and run services:

```
docker compose up --build
```

Services started:

| Service    | Port |
| ---------- | ---- |
| Frontend   | 4200 |
| Backend    | 3000 |
| PostgreSQL | 5432 |

---

## CI/CD Pipeline

The project includes CI/CD automation for:

* Dependency installation
* Frontend build
* Backend build
* Docker image creation
* Deployment to server environments

---

## Future Roadmap

* Mobile application (Capacitor)
* Desktop application (Electron)
* Advanced AI analytics
* Workflow automation engine
* Performance management system
* Learning management module

---

## License

MIT License

---

## Maintainer

Project maintained as a full-stack enterprise platform integrating HR, CRM, recruitment, and AI-driven operational intelligence.