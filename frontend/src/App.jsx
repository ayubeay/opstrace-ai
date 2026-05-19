import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [title, setTitle] = useState("Molecular diagnostics device failing calibration");
  const [description, setDescription] = useState("Device calibration mismatch detected after firmware update.");
  const [result, setResult] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
function downloadReceipt(receipt) {
  const blob = new Blob(
    [JSON.stringify(receipt, null, 2)],
    { type: "application/json" }
  );

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = `receipt-${receipt.receipt_id}.json`;

  a.click();

  window.URL.revokeObjectURL(url);
}
  async function loadIncidents() {
    const res = await fetch("http://127.0.0.1:8000/incidents");
    const data = await res.json();
    setIncidents(data);
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  async function analyzeIncident() {
    setLoading(true);

    const res = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({title, description}),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
    loadIncidents();
  }

  async function reviewIncident(receiptId, decision) {
  const res = await fetch(
    `http://127.0.0.1:8000/incidents/${receiptId}/review/${decision}`,
    {
      method: "POST",
    }
  );

  const updatedIncident = await res.json();

  if (result && result.receipt.receipt_id === receiptId) {
    setResult({
      ...result,
      receipt: updatedIncident,
    });
  }

  loadIncidents();
}

  const highCount = incidents.filter((i) => i.severity === "HIGH").length;
  const reviewCount = incidents.filter((i) => i.human_review_required).length;
  const pendingCount = incidents.filter((i) => i.status === "PENDING_REVIEW").length;

  return (
    <main className="page">
      <aside className="sidebar">
        <h2>OpsTrace AI</h2>
        <nav>
          <a href="#">Dashboard</a>
          <a href="#">Incidents</a>
          <a href="#">Governance</a>
          <a href="#">Audit Receipts</a>
        </nav>
      </aside>

      <section className="content">
        <div className="hero">
          <p className="eyebrow">Proof of Work Demo</p>
          <h1>AI-Governed Service Operations Console</h1>
          <p>Operational AI workflow prototype with governance, escalation routing, human review, and audit receipts.</p>
        </div>

        <section className="stats">
          <section className="infoGrid">
  <div className="infoCard">
    <h3>What This Demonstrates</h3>

    <ul>
      <li>AI-assisted operational triage</li>
      <li>Governed escalation workflows</li>
      <li>Human-in-the-loop review</li>
      <li>Audit-ready execution receipts</li>
      <li>Operational incident traceability</li>
    </ul>
  </div>

  <div className="infoCard">
    <h3>Governance Rules</h3>

    <ul>
      <li>
        <strong>LOW:</strong> AI recommendation auto-approved
      </li>

      <li>
        <strong>MEDIUM:</strong> Supervisor review required
      </li>

      <li>
        <strong>HIGH:</strong> Engineering escalation required
      </li>

      <li>
        Human review actions generate auditable workflow state
      </li>
    </ul>
  </div>
</section>
          <div className="statCard"><span>Total Incidents</span><strong>{incidents.length}</strong></div>
          <div className="statCard"><span>High Severity</span><strong>{highCount}</strong></div>
          <div className="statCard"><span>Pending Reviews</span><strong>{pendingCount}</strong></div>
          <div className="statCard"><span>Human Reviews</span><strong>{reviewCount}</strong></div>
        </section>

        <section className="grid">
          <div className="card">
            <h2>Submit Incident</h2>

            <label>Incident Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />

            <label>Description</label>
            <textarea rows="6" value={description} onChange={(e) => setDescription(e.target.value)} />

            <button onClick={analyzeIncident}>{loading ? "Analyzing..." : "Analyze Incident"}</button>

            {result && (
              <div className="receipt">
                <h3>Latest Governance Receipt</h3>

<button
  className="downloadBtn"
  onClick={() => downloadReceipt(result.receipt)}
>
  Download Receipt JSON
</button>

<pre>
  {JSON.stringify(result.receipt, null, 2)}
</pre>
              </div>
            )}
          </div>

          <div className="card">
            <h2>Governance Queue</h2>

            <div className="incidentList">
              {incidents.map((incident) => (
                <div className="incidentItem" key={incident.receipt_id}>
                  <div className="incidentText">
                    <strong>{incident.incident_title}</strong>
                    <p>{incident.category}</p>
                    <p>Status: <b>{incident.status}</b></p>
                    <div className="timeline">
  <span>Created</span>
  <span>AI Triaged</span>
  <span>
    {incident.status === "PENDING_REVIEW"
      ? "Pending Review"
      : incident.status}
  </span>
  <span>Receipt Stored</span>
</div>

<p className="receiptId">
  Receipt: {incident.receipt_id.slice(0, 8)}...
</p>
                  </div>

                  <div className="rightStack">
                    <div className={`badge ${incident.severity}`}>{incident.severity}</div>

                    {incident.status === "PENDING_REVIEW" && (
                      <div className="actions">
                        <button className="small approve" onClick={() => reviewIncident(incident.receipt_id, "approve")}>Approve</button>
                        <button className="small escalate" onClick={() => reviewIncident(incident.receipt_id, "escalate")}>Escalate</button>
                        <button className="small reject" onClick={() => reviewIncident(incident.receipt_id, "reject")}>Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}