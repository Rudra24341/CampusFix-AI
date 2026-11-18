import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Activity,
  Settings,
  Bell,
  Search,
  History,
  MapPin,
  Send,
  Sparkles,
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Zap,
  LoaderCircle,
} from "lucide-react";

import "./App.css";

function App() {
  const [activities, setActivities] = useState([]);
  const [decision, setDecision] = useState(null);
  const [complaint, setComplaint] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Maintenance records
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Navigation
  const [activePage, setActivePage] = useState("Dashboard");

  // Complaint history
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("campusfix-history")
      ) || [];
    } catch {
      return [];
    }
  });

  // Save complaint history
  useEffect(() => {
    localStorage.setItem(
      "campusfix-history",
      JSON.stringify(history)
    );
  }, [history]);

  // --------------------------------
  // LIVE DASHBOARD STATISTICS
  // --------------------------------

  const totalComplaints = history.length;

  const emergencyCases = history.filter(
    (item) => item.decision?.priority === "Emergency"
  ).length;

  const pendingReview = history.filter(
    (item) => item.decision?.priority === "Manual Review"
  ).length;

  const highPriorityCases = history.filter(
    (item) => item.decision?.priority === "High Priority"
  ).length;

  // --------------------------------
  // FILTER MAINTENANCE RECORDS
  // --------------------------------

  const filteredRecords = maintenanceRecords.filter((record) => {
    const searchText =
      `${record.id} ${record.location} ${record.category} ${record.complaint}`.toLowerCase();

    const matchesSearch = searchText.includes(
      searchTerm.toLowerCase()
    );

    const matchesCategory =
      categoryFilter === "All" ||
      record.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // --------------------------------
  // FETCH MAINTENANCE RECORDS
  // --------------------------------

  const fetchMaintenanceRecords = async () => {
    setRecordsLoading(true);
    setRecordsError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/maintenance-records"
      );

      if (!response.ok) {
        throw new Error("Unable to load maintenance records.");
      }

      const data = await response.json();

      setMaintenanceRecords(data.records || []);
    } catch (err) {
      setRecordsError(err.message);
    } finally {
      setRecordsLoading(false);
    }
  };

  // --------------------------------
  // NAVIGATION
  // --------------------------------

  const navigateTo = (page, sectionId) => {
    setActivePage(page);

    if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // --------------------------------
  // SUBMIT COMPLAINT
  // --------------------------------

  const submitComplaint = async (event) => {
    event.preventDefault();

    if (!complaint.trim() || !location.trim()) {
      setError("Please enter both the complaint and location.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setDecision(null);
    setActivities([]);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/complaint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complaint,
            location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to process your complaint."
        );
      }

      const decisionData =
        data.decision ?? data.result?.decision ?? null;

      const completeResult = {
        ...data,
        decision: decisionData,
      };

      setResult(completeResult);
      setDecision(decisionData);
      setActivities(data.activities || []);

      // Save complete analysis
      setHistory((previousHistory) => [
        {
          id: Date.now(),
          complaint: data.complaint,
          location: data.location,
          diagnosis: data.diagnosis,
          recommendation: data.recommendation,
          decision: decisionData,
          date: new Date().toLocaleString(),
        },
        ...previousHistory,
      ]);

    } catch (err) {
      setError(
        err.message.includes("fetch")
          ? "Cannot connect to the backend. Make sure your FastAPI server is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // EXAMPLE COMPLAINT
  // --------------------------------

  const useExample = (text) => {
    setComplaint(text);
    setError("");
  };

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">
            <Zap size={23} />
          </div>

          <div>
            <h2>CampusFix</h2>
            <span>AI MAINTENANCE</span>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-nav">

          <button
            className={`nav-item ${activePage === "Dashboard" ? "active" : ""}`}
            onClick={() => navigateTo("Dashboard")}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${activePage === "Report Complaint" ? "active" : ""}`}
            onClick={() =>
              navigateTo("Report Complaint", "complaint-form")
            }
          >
            <ClipboardList size={19} />
            <span>Report Complaint</span>
          </button>

          <button
            className={`nav-item ${activePage === "Maintenance" ? "active" : ""}`}
            onClick={() => {
              fetchMaintenanceRecords();
              navigateTo("Maintenance", "maintenance-records");
            }}
          >
            <Wrench size={19} />
            <span>Maintenance Records</span>
          </button>

          <button
            className={`nav-item ${activePage === "Complaint History" ? "active" : ""}`}
            onClick={() =>
              navigateTo("Complaint History", "complaint-history")
            }
          >
            <History size={19} />
            <span>Complaint History</span>
          </button>

          <button
            className={`nav-item ${activePage === "AI Activity" ? "active" : ""}`}
            onClick={() =>
              navigateTo("AI Activity", "ai-activity")
            }
          >
            <Activity size={19} />
            <span>AI Activity</span>
          </button>

        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-label">PREFERENCES</div>

          <div className="nav-item">
            <Settings size={19} />
            <span>Settings</span>
          </div>

          <div className="profile">
            <div className="avatar">CF</div>

            <div>
              <strong>Campus Admin</strong>
              <span>Maintenance Portal</span>
            </div>
          </div>
        </div>

      </aside>

      {/* MAIN WORKSPACE */}
      <main className="main-content">

        <header className="topbar">
          <div>
            <div className="breadcrumb">
              Workspace <span>/</span> Dashboard
            </div>

            <h1>Campus Dashboard</h1>
          </div>

          <div className="topbar-actions">

            <div className="system-status">
              <span className="status-dot"></span>
              AI System
            </div>

            <button
              className="icon-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>

            <div className="top-avatar">CA</div>

          </div>
        </header>

        {/* WELCOME SECTION */}
        <section className="welcome-section">

          <div>
            <div className="eyebrow">
              <Sparkles size={15} />
              INTELLIGENT CAMPUS MANAGEMENT
            </div>

            <h2>Good to see you!</h2>

            <p>
              Report campus issues and let AI help diagnose
              and recommend solutions.
            </p>
          </div>

          <div className="welcome-decoration">
            <BrainCircuit size={65} strokeWidth={1.2} />
          </div>

        </section>

        {/* LIVE COMPLAINT STATISTICS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon blue">
              <ClipboardList size={21} />
            </div>

            <div>
              <span className="stat-label">
                Total Complaints
              </span>

              <h3>{totalComplaints}</h3>

              <p>All submitted complaints</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <AlertTriangle size={21} />
            </div>

            <div>
              <span className="stat-label">
                Emergency Cases
              </span>

              <h3>{emergencyCases}</h3>

              <p>Emergency priority</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Clock size={21} />
            </div>

            <div>
              <span className="stat-label">
                Pending Review
              </span>

              <h3>{pendingReview}</h3>

              <p>Manual review cases</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <Activity size={21} />
            </div>

            <div>
              <span className="stat-label">
                High Priority
              </span>

              <h3>{highPriorityCases}</h3>

              <p>High-priority cases</p>
            </div>
          </div>

        </section>

        {/* AI SYSTEM INFORMATION */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon blue">
              <BrainCircuit size={21} />
            </div>

            <div>
              <span className="stat-label">AI Agents</span>
              <h3>03</h3>
              <p>2 AI Agents + 1 Decision Engine</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <BrainCircuit size={21} />
            </div>

            <div>
              <span className="stat-label">Knowledge Engine</span>
              <h3>RAG</h3>
              <p>Powered by ChromaDB</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Activity size={21} />
            </div>

            <div>
              <span className="stat-label">AI Workflow</span>
              <h3>Active</h3>
              <p>LangGraph orchestration</p>
            </div>
          </div>

        </section>

        {/* MAIN GRID */}
        <section className="workspace-grid">

          {/* COMPLAINT FORM */}
          <div
            className="panel complaint-panel"
            id="complaint-form"
          >

            <div className="panel-heading">
              <div>
                <div className="panel-icon">
                  <ClipboardList size={19} />
                </div>

                <h3>Report a Maintenance Issue</h3>

                <p>
                  Describe the issue happening on your campus.
                </p>
              </div>

              <span className="required-label">NEW REPORT</span>
            </div>

            <form onSubmit={submitComplaint}>

              <label htmlFor="location">
                Campus Location
              </label>

              <div className="input-wrapper">
                <MapPin size={18} />

                <input
                  id="location"
                  type="text"
                  placeholder="e.g. Room 204, Computer Lab"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <label htmlFor="complaint">
                Describe the Problem
              </label>

              <textarea
                id="complaint"
                placeholder="Explain what happened. For example: The projector in my classroom is not turning on..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                rows={5}
                required
              />

              <div className="examples">
                <span>Try an example:</span>

                <button
                  type="button"
                  onClick={() =>
                    useExample("The projector is not turning on.")
                  }
                >
                  Projector issue
                </button>

                <button
                  type="button"
                  onClick={() =>
                    useExample("The classroom fan is not working.")
                  }
                >
                  Fan issue
                </button>

                <button
                  type="button"
                  onClick={() =>
                    useExample(
                      "The laboratory equipment is not receiving power."
                    )
                  }
                >
                  Electrical issue
                </button>
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={17} />
                  {error}
                </div>
              )}

              <button
                className="submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="spin" size={19} />
                    Analysing Complaint...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analyse with CampusFix AI
                    <Send size={17} />
                  </>
                )}
              </button>

              <p className="form-note">
                <CheckCircle2 size={14} />
                Your complaint will be analysed using historical
                campus maintenance records.
              </p>

            </form>
          </div>

          {/* AI WORKFLOW CARD */}
          <div className="panel workflow-panel" id="workflow">

            <div className="panel-heading">
              <div>
                <div className="panel-icon purple-bg">
                  <BrainCircuit size={19} />
                </div>

                <h3>AI Processing Engine</h3>

                <p>
                  How CampusFix analyses your complaint.
                </p>
              </div>
            </div>

            {/* AI ACTIVITY MONITOR */}
            <section
              className="history-section"
              id="ai-activity"
            >

              <div className="section-heading">
                <div>
                  <h2>AI Activity Monitor</h2>
                  <p>
                    Track the execution of CampusFix AI agents.
                  </p>
                </div>
              </div>

              <div className="history-list">

                {activities.length === 0 ? (
                  <div className="history-card">
                    <p>No AI activity recorded yet.</p>
                    <span>
                      Submit a complaint to see the AI workflow.
                    </span>
                  </div>
                ) : (
                  activities.map((activity, index) => (
                    <div className="history-card" key={index}>
                      <div>
                        <strong>
                          {index + 1}. {activity.stage}
                        </strong>

                        <span className="activity-status">
                          {activity.status}
                        </span>
                      </div>

                      <p>{activity.details}</p>
                    </div>
                  ))
                )}

              </div>
            </section>

            {/* FOUR WORKFLOW STAGES */}
            <div className="workflow-list">

              <div className="workflow-step">
                <div className="workflow-number">01</div>

                <div>
                  <strong>RAG Knowledge Retrieval</strong>
                  <span>
                    ChromaDB retrieves similar historical cases.
                  </span>
                </div>

                <CheckCircle2 size={18} className="step-check" />
              </div>

              <div className="workflow-line"></div>

              <div className="workflow-step">
                <div className="workflow-number purple-number">
                  02
                </div>

                <div>
                  <strong>Diagnosis Agent</strong>
                  <span>
                    Groq analyses the complaint and identifies possible causes.
                  </span>
                </div>

                <BrainCircuit size={18} className="step-ai" />
              </div>

              <div className="workflow-line"></div>

              <div className="workflow-step">
                <div className="workflow-number green-number">
                  03
                </div>

                <div>
                  <strong>Recommendation Agent</strong>
                  <span>
                    Generates maintenance actions and urgency suggestions.
                  </span>
                </div>

                <Wrench size={18} className="step-ai" />
              </div>

              <div className="workflow-line"></div>

              <div className="workflow-step">
                <div className="workflow-number">04</div>

                <div>
                  <strong>Decision Engine</strong>
                  <span>
                    Evaluates priority, safety risks and human intervention.
                  </span>
                </div>

                <Activity size={18} className="step-ai" />
              </div>

            </div>

            <div className="engine-footer">
              <div className="engine-footer-icon">
                <Zap size={17} />
              </div>

              <div>
                <strong>Powered by Agentic AI</strong>
                <span>LangGraph + Groq + ChromaDB</span>
              </div>
            </div>

          </div>
        </section>

        {/* RESULTS */}
        {result && (
          <section className="results-section">

            <div className="results-heading">
              <div>
                <div className="eyebrow">
                  <Sparkles size={15} />
                  AI ANALYSIS COMPLETE
                </div>

                <h2>Maintenance Analysis</h2>

                <p>
                  {result.location} · {result.complaint}
                </p>
              </div>

              <span className="success-label">
                <CheckCircle2 size={15} />
                Analysis Complete
              </span>
            </div>

            <div className="result-grid">

              {/* AI DIAGNOSIS */}
              <div className="result-card diagnosis-card">
                <div className="result-card-title">
                  <BrainCircuit size={20} />
                  <h3>AI Diagnosis</h3>
                </div>

                <div className="result-text">
                  {result.diagnosis}
                </div>
              </div>

              {/* RECOMMENDED SOLUTION */}
              <div className="result-card recommendation-card">
                <div className="result-card-title">
                  <Wrench size={20} />
                  <h3>Recommended Solution</h3>
                </div>

                <div className="result-text">
                  {result.recommendation}
                </div>
              </div>

              {/* DECISION ENGINE */}
              <div className="result-card decision-card">
                <div className="result-card-title">
                  <Activity size={20} />
                  <h3>Decision Engine</h3>
                </div>

                {result.decision ? (
                  <div className="result-text">

                    <p>
                      <strong>Urgency:</strong>{" "}
                      {result.decision.urgency || "Not available"}
                    </p>

                    <p>
                      <strong>Final Priority:</strong>{" "}
                      {result.decision.priority || "Not available"}
                    </p>

                    <p>
                      <strong>Human Intervention:</strong>{" "}
                      {result.decision.human_intervention_required === true
                        ? "Required"
                        : result.decision.human_intervention_required === false
                          ? "Not Required"
                          : "Not available"}
                    </p>

                    <div className="decision-next-action">
                      <strong>Next Action</strong>

                      <p>
                        {result.decision.next_action ||
                          "No next action provided by the Decision Engine."}
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="result-text">
                    Decision information is not available.
                  </div>
                )}
              </div>

            </div>

            <div className="result-disclaimer">
              <AlertCircle size={16} />
              AI recommendations are based on retrieved historical
              records. Safety-critical repairs must be verified by
              qualified maintenance personnel.
            </div>

            <button
              className="new-report-button"
              onClick={() => {
                setResult(null);
                setDecision(null);
                setActivities([]);
                setComplaint("");
                setLocation("");
                setError("");
              }}
            >
              + Create Another Report
            </button>

          </section>
        )}

        {/* EMPTY RESULTS */}
        {!result && (
          <section className="empty-results">
            <div className="empty-icon">
              <Search size={24} />
            </div>

            <div>
              <strong>Your AI analysis will appear here</strong>

              <p>
                Submit a maintenance complaint to see its diagnosis,
                recommended solution, and final decision.
              </p>
            </div>
          </section>
        )}

        {/* COMPLAINT HISTORY */}
        <section
          className="history-section"
          id="complaint-history"
        >

          <div className="results-heading">
            <div>
              <div className="eyebrow">
                <History size={15} />
                PREVIOUS REPORTS
              </div>

              <h2>Complaint History</h2>

              <p>
                Your previously analysed campus maintenance complaints.
              </p>
            </div>

            <span className="success-label">
              {history.length} Reports
            </span>
          </div>

          {history.length === 0 ? (
            <div className="empty-results">
              <div className="empty-icon">
                <ClipboardList size={24} />
              </div>

              <div>
                <strong>No previous complaints</strong>

                <p>
                  Successfully analysed complaints will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="history-list">

              {history.map((item) => (
                <div className="result-card" key={item.id}>

                  <div className="result-card-title">
                    <ClipboardList size={20} />
                    <h3>{item.location}</h3>
                  </div>

                  <p>
                    <strong>Complaint:</strong> {item.complaint}
                  </p>

                  <p>
                    <strong>Diagnosis:</strong> {item.diagnosis}
                  </p>

                  <p>
                    <strong>Recommendation:</strong> {item.recommendation}
                  </p>

                  <p>
                    <strong>Final Priority:</strong>{" "}
                    {item.decision?.priority || "Not available"}
                  </p>

                  <p>
                    <strong>Urgency:</strong>{" "}
                    {item.decision?.urgency || "Not available"}
                  </p>

                  <p>
                    <strong>Human Intervention:</strong>{" "}
                    {item.decision?.human_intervention_required === true
                      ? "Required"
                      : item.decision?.human_intervention_required === false
                        ? "Not Required"
                        : "Not available"}
                  </p>

                  <p>
                    <strong>Next Action:</strong>{" "}
                    {item.decision?.next_action || "Not available"}
                  </p>

                  <span className="history-date">
                    {item.date}
                  </span>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* MAINTENANCE RECORDS */}
        <section
          className="history-section"
          id="maintenance-records"
        >

          <div className="section-heading">
            <div>
              <h2>Maintenance Records</h2>
              <p>
                View and manage campus maintenance records.
              </p>
            </div>

            <span>{filteredRecords.length} Records</span>
          </div>

          <div className="history-controls">

            <input
              type="text"
              placeholder="Search by ID, location or complaint..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>

              {[
                ...new Set(
                  maintenanceRecords.map(
                    (record) => record.category
                  )
                ),
              ].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}

            </select>
          </div>

          {recordsLoading && (
            <p>Loading maintenance records...</p>
          )}

          {recordsError && (
            <p className="error-message">{recordsError}</p>
          )}

          {!recordsLoading && !recordsError && (
            <div className="records-table-wrapper">

              <table className="records-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Location</th>
                    <th>Category</th>
                    <th>Complaint</th>
                    <th>Cause</th>
                    <th>Resolution</th>
                    <th>Estimated Cost</th>
                    <th>Repair Time</th>
                    <th>Urgency</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{record.location}</td>
                      <td>{record.category}</td>
                      <td>{record.complaint}</td>
                      <td>{record.cause}</td>
                      <td>{record.resolution}</td>
                      <td>₹{record.estimated_cost}</td>
                      <td>{record.repair_time_hours} hrs</td>
                      <td>{record.urgency}</td>
                    </tr>
                  ))}

                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan="9">
                        No matching records found.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          )}

        </section>

        {/* FOOTER */}
        <footer className="footer">
          <span>© 2026 CampusFix AI</span>
          <span>Intelligent Campus Maintenance System</span>
        </footer>

      </main>
    </div>
  );
}

export default App;