# OpsTrace AI

Operational AI workflow prototype focused on governed support/service workflows.

## What it demonstrates

- AI-assisted incident triage
- Severity classification
- Escalation routing
- Human-in-the-loop review
- Audit-ready receipt generation
- Operational lifecycle tracking
- Downloadable JSON receipts

## Architecture

```text
React / Vite Frontend
        ↓
FastAPI Backend
        ↓
Mock AI Classification Engine
        ↓
Governance Rules
        ↓
Human Review Actions
        ↓
Audit Receipt Output
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```
