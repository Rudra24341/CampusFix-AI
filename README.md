# CampusFix AI 🏫

**AI-Powered Campus Maintenance Complaint Management System**

CampusFix AI is an AI-powered platform designed to simplify campus maintenance complaint management. It helps students and staff report campus problems and uses AI agents, historical maintenance records, and a decision engine to analyze complaints and recommend appropriate actions.

**Team Name:** Zero IQ

---

## 🚀 Problem Statement

Campus maintenance complaints are often reported through scattered communication channels. This can lead to:
- Delayed complaint resolution.
- Difficulty identifying recurring problems.
- Manual assessment of maintenance issues.
- Difficulty prioritizing urgent complaints.

## 💡 Our Solution

CampusFix AI provides a centralized complaint management system that uses AI to understand reported problems, retrieve similar historical cases, suggest solutions, and assign a priority level.

## ✨ Key Features

- **Complaint Reporting:** Submit maintenance complaints with campus location details.
- **AI Diagnosis:** Analyze complaints and identify possible causes.
- **Historical Case Retrieval:** Retrieve similar maintenance records using RAG.
- **AI Recommendations:** Generate suggested repair actions.
- **Priority Assessment:** Classify complaints based on urgency.
- **Human Intervention:** Flag critical or uncertain cases for manual review.
- **Maintenance Records:** View and search historical maintenance records.
- **Complaint History:** Keep track of submitted complaints.
- **AI Activity Monitor:** View the stages of the AI processing workflow.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite |
| Backend | Python, FastAPI |
| AI Framework | LangChain |
| AI Workflow | LangGraph |
| Language Model | Groq – openai/gpt-oss-20b |
| Vector Database | ChromaDB |
| Data Storage | JSON maintenance dataset |
| Icons | Lucide React |

## 🧠 How It Works

The system follows a four-stage AI workflow:

1. **Retrieval Node:** Uses ChromaDB to retrieve similar historical maintenance cases.
2. **Diagnosis Agent:** Analyzes the complaint and identifies possible causes.
3. **Recommendation Agent:** Generates suggested maintenance actions.
4. **Decision Engine:** Applies rule-based logic to determine complaint priority and whether human intervention is required.

## 🏗️ Project Structure

```text
CampusFix-GitHub/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── graph.py
│   │   ├── agents.py
│   │   ├── rag.py
│   │   └── test_groq.py
│   │
│   ├── data/
│   │   └── maintenance_records.json
│   │
│   ├── requirements.txt
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Python 3.10 or later (use a version compatible with the project's dependencies).
- Node.js and npm.
- Git.
- A Groq API key.

### 1. Clone the Repository

```bash
git clone https://github.com/Rudra24341/CampusFix-AI.git
cd CampusFix-AI
```

### 2. Backend Setup

Open a terminal and navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the FastAPI backend:

```bash
python -m uvicorn app.main:app --reload
```

Backend URL:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 3. Frontend Setup

Open a second terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

`http://localhost:5173`

## 🔍 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/complaint` | Submit and process a complaint |
| GET | `/api/maintenance-records` | Retrieve maintenance records |

## 🧪 Prototype Testing

The prototype has been tested with two sample scenarios:

- **Projector Issue:** A projector in Room 204 is not turning on. The system identifies a possible power-related issue and assigns Normal Priority.
- **Electrical Emergency:** A socket is sparking and producing smoke. The system assigns Emergency priority and flags the case for human intervention.

These tests demonstrate the prototype workflow and do not constitute production-level safety validation.

## 🔮 Future Improvements

- Student and administrator authentication.
- Live complaint tracking and status updates.
- Image-based damage and fault detection.
- More comprehensive maintenance datasets.
- Analytics dashboard for campus authorities.
- Notifications for complaint updates.
- Integration with campus maintenance departments.

## ⚠️ Important Note

CampusFix AI is a hackathon prototype. AI-generated diagnoses and recommendations should be verified by qualified maintenance personnel. The decision engine uses prototype rules and is not a certified safety assessment system.

## 👥 Team

**Team Zero IQ**

Built as a hackathon project.

## 📄 License

This project is currently a hackathon prototype. A formal open-source license has not yet been selected.
