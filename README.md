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
## Example Receipt

```json
{
  "receipt_id": "OPS-1042",
  "severity": "HIGH",
  "status": "ESCALATED",
  "review_required": true,
  "created_at": "2026-05-19T00:00:00Z"
}
```
