# AI Interview Agent Live Demo https://the-interview-agent-lilac.vercel.app/

An AI-powered interview platform that connects Interviewers and Candidates in a structured digital interview process. Interviewers can create tailored technical screens, generate questions using Google Gemini AI, and share access codes with candidates. Candidates take the interview and receive detailed, evidence-based AI evaluations including strengths, weaknesses, and specific areas for improvement.

## 🌟 Key Features

### For Interviewers / Recruiters
* **Interview Creation:** Define job role, difficulty, time limit, and required skills.
* **AI Question Generation:** Automatically generate relevant technical or behavioral questions.
* **Manage Access:** Publish interviews and generate unique shareable access codes.
* **Review Submissions:** View completed candidate results, scores, and detailed AI evaluations.

### For Students / Candidates
* **Join Interviews:** Enter an access code to start a mock interview or technical screen.
* **Focus Mode UI:** Take the interview with a distraction-free, timed interface.
* **Evidence-Based Evaluation:** Receive a comprehensive breakdown instead of an arbitrary score.
* **Actionable Feedback:** Review major/minor mistakes, missing concepts, strengths, and improved model answers.

---

## 🏗️ Technology Stack

### Frontend
* **React** (via Vite)
* **Tailwind CSS** (Styling & responsive design)
* **Lucide React** (Icons)
* **Recharts** (Data visualization)

### Backend
* **Node.js & Express.js**
* **MongoDB & Mongoose** (Database & Models)
* **Google Gemini AI** (Question generation & strict schema-based evaluation)
* **JWT & bcrypt** (Authentication & Security)

---

## 🚀 Getting Started Locally

### Prerequisites
* Node.js (v18 or higher)
* MongoDB (Local instance or Atlas cluster)
* Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/Mohd-obaidullah/the-interview-agent.git
cd the-interview-agent
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure your environment variables.
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory based on the example:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/interview_agent
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key_here
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies.
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

### 4. Access the Application
Open your browser and navigate to `http://localhost:3000` (or the port Vite assigned, usually `3000` or `5173`).

---

## 🔒 Security & Architecture
* **Role-Based Access Control (RBAC):** Students cannot access Interviewer-only routes, and vice versa.
* **Secure Auth:** Passwords are mathematically hashed via `bcrypt` before storage. Sessions are managed using stateless JSON Web Tokens.
* **Deterministic AI Evaluation:** The Gemini AI engine is constrained by a programmatic scoring formula to prevent hallucinated scores and ensure fair, evidence-based results.

---

## 📝 License
This project is open-source and available under the MIT License.
