# AI Interview Agent — Hackathon Master Prompt

I want you to build and improve my complete AI Interview Agent web application.

IMPORTANT:
- Work on my existing project instead of creating an unrelated new project.
- First inspect the complete project structure and understand the existing frontend and backend.
- Preserve working functionality. Do not unnecessarily delete or rewrite existing code.
- Implement the requirements systematically.
- Use clean, production-quality code.
- Make the UI professional, modern, responsive, and suitable for a hackathon demonstration.
- Use the existing technology stack wherever possible.
- My project uses a React/Vite frontend and Node.js/Express backend with MongoDB and AI/Gemini integration.
Verify the actual structure before changes.

## 1. PROJECT PURPOSE
Build an AI-powered interview platform with two roles:
- INTERVIEWER
- STUDENT / CANDIDATE

Main workflow:
INTERVIEWER → Creates interview → AI generates/saves questions → Gets interview ID/shareable link → Shares with Student
STUDENT → Logs in → Joins interview → Answers questions → Submits → AI evaluates → Student receives score/feedback → Interviewer views result.

## 2. LANDING PAGE
Improve the landing page with:
- Hero
- How it works
- Features
- Student benefits
- Interviewer benefits
- AI evaluation explanation
- CTA
- Footer

There are two buttons:
"Launch Platform" → authentication/platform entry page.
"Start Free AI Interview" → student interview-start/join flow.
They must not open the same page. Use proper routing.

## 3. AUTHENTICATION
Create complete authentication for Student and Interviewer.

Signup:
- First Name
- Last Name
- Gmail / Email
- Password
- Confirm Password
- Role

Login:
- Gmail / Email
- Password

Requirements:
- Validate email/password.
- Confirm password must match.
- Prevent duplicate accounts.
- Hash passwords securely.
- Never store plain-text passwords.
- Implement secure authentication, logout, session/token, protected routes and role-based redirects.
- Students cannot access Interviewer-only pages and vice versa.

## 4. INTERVIEWER DASHBOARD
Navigation:
- Dashboard
- Create Interview
- My Interviews
- Candidate Results
- Profile
- Settings
- Logout

Show:
- Total interviews
- Active interviews
- Completed interviews
- Candidates
- Average candidate score

## 5. INTERVIEW CREATION
Interviewer can create:
- Interview title
- Job/role
- Difficulty
- Description
- Skills/topics
- Number of questions
- Duration
- Interview type

Examples: Java, Python, Frontend, Backend, Full Stack, Data Science, General Technical.
AI should generate questions based on role, skills and difficulty.

Interviewer can:
- View/edit/delete/add questions
- Save interview
- Activate/deactivate interview
- Generate interview ID and shareable link
- Copy link

## 6. STUDENT DASHBOARD
Navigation:
- Dashboard
- Join Interview
- My Interviews
- Interview History
- Results
- Profile
- Settings
- Logout

Show:
- Interviews completed
- Average score
- Recent interviews
- Pending interviews
- Performance summary

## 7. STUDENT JOIN INTERVIEW
Allow:
- Enter Interview ID
- Open shareable interview link

Before starting show:
- Title
- Role
- Difficulty
- Number of questions
- Duration
- Instructions

Then "Start Interview".
Only valid/active interviews can be accessed. Students cannot modify interviewer questions.

## 8. AI INTERVIEW EXPERIENCE
Professional interview interface with:
- Question number
- Current question
- Total questions
- Progress bar
- Timer
- Answer input
- Next/Previous
- Submit

Prevent accidental loss of answers and save answers during the interview where appropriate.

## 9. AI ANSWER EVALUATION
This is critical.
Do not score only by keywords.
Evaluate:
1. Correctness
2. Relevance
3. Technical accuracy
4. Completeness
5. Clarity
6. Reasoning
7. Communication
8. Missing important concepts
9. Major mistakes
10. Minor mistakes
11. Unsupported claims
12. Overall quality

Compare the candidate answer against expected answer/concepts.
Incorrect statements and missing important concepts must reduce the score.
Weak answers must not receive artificially high scores.
Strong answers should receive high scores.
Scores must be evidence-based.

## 10. STRUCTURED AI EVALUATION
Return structured data similar to:
```json
{
  "overallScore": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "majorMistakes": [],
  "minorMistakes": [],
  "questionResults": [
    {
      "question": "",
      "answer": "",
      "score": 0,
      "correctness": 0,
      "relevance": 0,
      "technicalAccuracy": 0,
      "completeness": 0,
      "feedback": "",
      "mistakes": [],
      "improvedAnswer": ""
    }
  ],
  "recommendation": ""
}
```
Suggested weighting:
Correctness 30%
Technical accuracy 25%
Completeness 20%
Relevance 15%
Clarity/reasoning 10%

Calculate the final score from question-level evaluations instead of simply asking the AI to invent one final score.

## 11. STUDENT RESULTS
Show:
- Overall score
- Performance level
- Strengths
- Weaknesses
- Major/minor mistakes
- Question-by-question scores
- Detailed feedback
- Improved answers
- Recommendation
- Areas to improve

Categories:
90–100 Excellent
80–89 Very Good
70–79 Good
60–69 Needs Improvement
Below 60 Requires Significant Improvement

## 12. INTERVIEWER RESULTS
Interviewer can view results only for interviews they created.
Show:
- Candidate name/email
- Interview
- Date
- Overall score
- Question scores
- Strengths
- Weaknesses
- Feedback

Add useful filtering/sorting where practical.

## 13. PROFILE
Make Profile fully functional for both roles.
Display:
- First name
- Last name
- Email
- Role
- Account information
Allow appropriate editing with validation.

## 14. SETTINGS
Make Settings functional.
Include:
- Account settings
- Password change
- Notification preferences
- Theme if supported
- Logout
- Delete account with confirmation
Do not create fake buttons. Every visible option must work or be clearly unavailable.

## 15. ROLE-BASED SECURITY
Student routes only for Students.
Interviewer routes only for Interviewers.

Interviewer:
- Create/edit/delete interviews
- View candidate results
Student:
- Join/take interviews
- Submit answers
- View own results

A Student must never access another student's private results.
An Interviewer can manage only their own interviews.

## 16. DATABASE
Inspect existing MongoDB architecture.
Use appropriate models/collections for:
- Users
- Interviews
- Questions
- Attempts/submissions
- Answers
- Results

Use proper references, validation and error handling.
Use environment variables for MongoDB credentials.
Never hard-code credentials.

## 17. API
Inspect and improve existing API without creating duplicates.
Typical routes:
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/profile
- PUT /api/profile
- POST /api/interviews
- GET /api/interviews
- GET /api/interviews/:id
- PUT /api/interviews/:id
- DELETE /api/interviews/:id
- POST /api/interviews/:id/join
- POST /api/interviews/:id/submit
- GET /api/results
- GET /api/results/:id
- GET /api/health

Reuse equivalent existing routes.

## 18. AI INTEGRATION
Inspect existing Gemini/AI implementation and improve it instead of unnecessarily replacing it.
Use AI for:
- Question generation
- Answer evaluation
- Feedback
- Improved answer suggestions
Keep API keys in environment variables and never expose them in frontend code.
Handle API failures, rate limits, invalid responses, timeouts and empty responses gracefully.

## 19. NAVIGATION
Verify every button/link:
- Profile, Settings, Dashboard, Create Interview, My Interviews, Results, Join Interview, Logout, Back, Landing page CTAs
No dead links or fake buttons.

## 20. UI/UX
Make the application feel like a professional SaaS platform.
Use consistent typography, spacing, cards, buttons, contrast, responsive layouts, loading states, empty states, errors, success messages, confirmations and progress indicators.
Support desktop, laptop, tablet and mobile.

## 21. ERROR HANDLING
Frontend: understandable error messages.
Backend:
- Validate requests
- Handle database/auth/AI errors
- Do not expose sensitive information or production stack traces.

## 22. SECURITY AUDIT
Check: Password hashing, Authentication, Authorization, CORS, Environment variables, API keys, MongoDB credentials, Input validation, Protected routes, Sensitive errors, Secret files, .gitignore.
Never expose API keys, passwords, MongoDB credentials, JWT secrets or private configuration.

## 23. ENVIRONMENT VARIABLES
Backend:
MONGODB_URI=
GEMINI_API_KEY=
JWT_SECRET=
CLIENT_URL=
PORT=
NODE_ENV=production

Frontend:
VITE_API_URL=

Create/update .env.example with placeholders only. Never put real secrets in .env.example. Ensure .env is in .gitignore.

## 24. PRODUCTION READINESS
Backend must use process.env.PORT. Production hosting must be able to bind to 0.0.0.0.
CORS should use the production frontend URL, not unrestricted wildcard access.
Verify GET /api/health. Production errors must not expose sensitive stack traces.

## 25. BUILD AND TEST
After implementation:
- Run frontend production build.
- Run backend syntax checks.
- Start frontend and backend locally.

## 26. DO NOT BREAK EXISTING FEATURES
Before changes inspect: Routes, Components, Authentication, AI logic, Database models, API calls, Styling, Deployment configuration.
Reuse existing functionality. Do not create duplicate authentication or APIs. Do not remove working features unnecessarily.

## 27. FINAL QUALITY REPORT
At the end report:
A. Features implemented
B. Files created
C. Files modified
D. Authentication
E. Student workflow
F. Interviewer workflow
G. AI evaluation
H. Profile
I. Settings
J. Security
K. Database
L. Build
M. Testing
N. Remaining issues
Mark each major area PASS or NEEDS FIX.

## 28. WORKING RULE
Do not merely tell me what code to write. Inspect the project and implement changes directly. After each major group, verify the project still works. If a command needs permission, use the normal Antigravity confirmation. Do not deploy automatically. First make the application fully functional locally and production-ready. Only guide deployment after I explicitly request it.

FINAL GOAL:
INTERVIEWER → Sign Up/Login → Dashboard → Create Interview → AI generates questions → Save → ID/link → Share → View candidate results.
STUDENT → Sign Up/Login → Dashboard → Join → Take interview → Submit → AI evaluates → Accurate score + detailed feedback → Interview history.
BOTH → Profile → Settings → Logout.
The final application must be secure, responsive, professional, functional and suitable for a hackathon demonstration.

---

# Detailed Project Documentation — Hackathon Edition

## 1. Project Overview
AI Interview Agent is an AI-powered interview platform designed to connect Interviewers and Students/Candidates in a structured digital interview process.

## 10. AI Evaluation System
**Key improvement:** The score must not be based only on keywords or superficial similarity. A candidate who makes several technical mistakes should not receive an unjustifiably high score.

### 10.1 Evaluation Criteria
- Correctness (30%): Whether the answer is factually and conceptually correct
- Technical accuracy (25%): Correct technical details, terminology and reasoning
- Completeness (20%): Important concepts and required parts included
- Relevance (15%): Whether the answer directly addresses the question
- Clarity / reasoning (10%): Organization, explanation and logical reasoning

### 10.2 What AI Must Detect
- Major/Minor technical mistakes.
- Missing important concepts.
- Unsupported or incorrect claims.
- Irrelevant content.
- Strong reasoning and correct conclusions.
- Areas where the candidate could improve.

## 14. Role-Based Access Matrix
| Feature | Student | Interviewer |
| :--- | :---: | :---: |
| Sign up / Login | ✓ | ✓ |
| Student dashboard | ✓ | — |
| Interviewer dashboard | — | ✓ |
| Create interview | — | ✓ |
| Manage own interviews | — | ✓ |
| Join interview | ✓ | — |
| Take interview | ✓ | — |
| Submit answers | ✓ | — |
| View own results | ✓ | — |
| View candidates' results | — | ✓ |
| Profile | ✓ | ✓ |
| Settings | ✓ | ✓ |

## 16. Suggested Data Models
**User:** firstName, lastName, email, passwordHash, role, createdAt, updatedAt
**Interview:** interviewerId, title, role, difficulty, description, skills, duration, questionCount, questions, active, shareId, createdAt
**Attempt / Submission:** interviewId, studentId, answers, startedAt, submittedAt, status, resultId
**Result:** attemptId, studentId, interviewId, overallScore, summary, strengths, weaknesses, majorMistakes, minorMistakes, questionResults, recommendation, createdAt

## 22. Hackathon Demonstration Script
For a strong live demonstration, show one complete story rather than every feature.
1. Start on the landing page and explain the problem in one sentence.
2. Show the two role options: Interviewer and Student.
3. Log in as Interviewer.
4. Create a technical interview for a selected role.
5. Use AI to generate questions.
6. Show the generated interview ID/share link.
7. Switch to the Student flow.
8. Join the interview using the ID/link.
9. Answer a few questions, including at least one strong answer and one intentionally imperfect answer.
10. Submit the interview.
11. Show the AI evaluation with question-level scores, mistakes and improved answers.
12. Return to the Interviewer dashboard and show the candidate result.
13. Briefly show Profile, Settings and role-based dashboards.
14. End by explaining that the system provides structured, evidence-based feedback rather than only a generic score.

---

# Previous / Incremental Prompts

## Phase 1: Core Platform Vision
Build a production-quality full-stack web application called "The Interview Agent".

The Interview Agent is an autonomous AI-powered interview platform that conducts realistic technical, HR, and behavioral interviews. The AI should dynamically adapt its next question based on the candidate's previous answers, selected job role, experience level, and uploaded resume.

Core workflow:
1. User registers/logs in.
2. User uploads their resume.
3. AI analyzes the resume and extracts skills, experience, projects, and technologies.
4. User selects a target role such as Full Stack Developer, Backend Developer, Java Developer, Python Developer, Data Analyst, etc.
5. User selects interview type: Technical, HR, Behavioral, or Mixed.
6. AI creates a personalized interview.
7. AI asks one question at a time.
8. User answers using text or voice.
9. AI evaluates every answer in real time.
10. AI dynamically chooses the next question based on the candidate's answer.
11. At the end, generate a complete interview report.

Evaluation should include:
- Technical accuracy
- Relevance
- Communication
- Clarity
- Confidence
- Depth of knowledge
- Problem-solving ability
- Overall performance

The final report should include:
- Overall score out of 100
- Category-wise scores
- Strong areas
- Weak areas
- Questions the candidate struggled with
- Detailed AI feedback
- Recommended topics to study
- Personalized improvement plan
- Interview readiness score

IMPORTANT:
The application should feel like a real autonomous AI interviewer rather than a simple question-answer chatbot.

Design:
- Modern premium SaaS interface
- Dark navy/black background
- Purple/blue gradient accents
- Clean glassmorphism cards
- Responsive design
- Professional dashboard
- Smooth animations
- Interview progress indicator
- Real-time AI evaluation panel
- Voice waveform while recording
- Attractive charts for performance analytics

Main pages:
- Landing Page
- Login/Register
- Candidate Dashboard
- Resume Upload
- Interview Setup
- Live Interview
- Interview History
- AI Evaluation
- Final Interview Report
- Profile/Settings

Live Interview screen:
- Current question prominently displayed
- Voice recording interface
- Text answer option
- Timer
- Interview progress
- AI status indicator
- Previous/Next controls
- Ability to pause or skip
- Minimal distractions

Dashboard:
- Total interviews
- Average score
- Interview readiness
- Recent interviews
- Skill performance
- Improvement trends
- Recommended practice areas

Architecture:
Frontend: React + Tailwind CSS
Backend: Node.js + Express
Database: MongoDB
AI: Gemini API
Authentication: JWT
Resume processing: PDF/text extraction
Voice: Browser Web Speech API or suitable speech-to-text API

Create clean reusable components and a scalable folder structure. Use environment variables for API keys and secrets. Never expose API keys in frontend code.

The final product should look like a startup-ready AI interview platform suitable for a hackathon demo.

## Phase 2: Roles and Authentication
I want to implement a proper authentication system in my Interview Agent project.

The application has two user roles:
1. Student - the person who gives the AI interview.
2. Interviewer - the person who conducts/manages interviews.

Please inspect my existing frontend and backend structure first. Do not unnecessarily rewrite existing working code.

Implement:

SIGNUP:
- First Name
- Last Name
- Gmail/email
- Password
- Confirm Password
- Role: Student or Interviewer
- Validate all fields
- Validate email format
- Validate password confirmation
- Prevent duplicate email accounts
- Hash passwords securely using bcrypt
- Store the user's role in the database

LOGIN:
- Gmail/email
- Password
- Verify hashed password
- Create a secure authentication session/token
- Redirect the user according to their role

ROLE-BASED REDIRECTION:
- Student -> Student Dashboard
- Interviewer -> Interviewer Dashboard

Also create proper protected routes so a Student cannot access Interviewer pages and an Interviewer cannot access Student-only pages.

First inspect the existing project and tell me which files you will modify/create. Then implement the changes without breaking the existing interview functionality.

## Phase 3: Dashboards
Now implement role-specific interfaces for my Interview Agent application.

STUDENT DASHBOARD:
- Start AI Interview
- Interview History
- Performance/Analytics
- Profile
- Settings
- Logout

INTERVIEWER DASHBOARD:
- Create Interview
- Candidates
- Scheduled Interviews
- Interview Results
- Analytics
- Profile
- Settings
- Logout

The dashboard must be selected based on the authenticated user's role.
Students must never see interviewer-only options.
Interviewers must never see student-only options.
Reuse my existing UI design, colors, components and styling where possible.
Do not break the existing AI interview functionality.
Before changing files, inspect the existing frontend routing and authentication code.

Fix the landing page navigation.
Currently "Launch Platform" and "Start Free AI Interview" open the same interface.

Change the behavior:
Launch Platform:
- If not authenticated -> Login/Signup page
- If authenticated -> appropriate dashboard based on role

Start Free AI Interview:
- If not authenticated -> Student Login/Signup
- If authenticated as Student -> AI Interview Setup page
- If authenticated as Interviewer -> do not allow starting a student interview from this button; direct them to the Interviewer Dashboard

Do not duplicate pages unnecessarily.
Inspect the current routing before making changes.

## Additional Component Flows

AI: Explain polymorphism in Java.
Student: Gives answer.
AI evaluates answer.
        ↓
If answer is weak:
AI: Can you explain the difference between method overloading and method overriding?
        ↓
If answer is strong:
AI: Good. Now let's discuss a practical use of runtime polymorphism.

Profile
[Profile Picture]
First Name
Last Name
Gmail
Role
[Edit Profile]
[Save Changes]

Settings
Appearance
○ Dark
○ Light
Interview Settings
☑ Show feedback after interview
☑ Enable timer
Notifications
☑ Interview reminders
Account
[Change Password]
[Logout]

## Phase 4: Authentication Flow Adjustments
I want to implement separate authentication flows for Students and Interviewers in my Interview Agent project.

Do NOT use a role dropdown inside the signup form.
Create a role selection page first:
"Continue as"
[Student]
[Interviewer]

STUDENT FLOW:
Student -> Student Sign Up
Student Sign Up fields:
- First Name
- Last Name
- Gmail/email
- Password
- Confirm Password
- Create Student Account

After successful signup:
-> Student Dashboard

Student Login:
- Gmail/email
- Password
- Login button
- Link to Student Sign Up
- Forgot Password link if authentication system supports it

INTERVIEWER FLOW:
Interviewer -> Interviewer Sign Up
Interviewer Sign Up fields:
- First Name
- Last Name
- Gmail/email
- Password
- Confirm Password
- Create Interviewer Account

After successful signup:
-> Interviewer Dashboard

Interviewer Login:
- Gmail/email
- Password
- Login button
- Link to Interviewer Sign Up
- Forgot Password link if authentication system supports it

IMPORTANT:
- Store the user's role in the backend/database as either "student" or "interviewer".
- Hash passwords securely using bcrypt.
- Prevent duplicate email accounts.
- Validate password confirmation.
- Create secure authentication/session handling.
- Protect role-specific routes.
- A student must not be able to access interviewer-only pages.
- An interviewer must not be able to access student-only pages.
- Keep my existing Interview Agent UI design, dark theme, gradients and styling.
- Make the authentication pages visually consistent with my existing landing page.

Before changing anything, inspect my existing frontend and backend structure and identify the files responsible for routing, authentication, database and the current landing page.
Do not delete or break my existing AI interview functionality.
First tell me which files you plan to modify/create. Then implement the authentication system.

## Phase 5: Authentication Execution
Implement ONLY the authentication system for my Interview Agent project.

First inspect my existing frontend and backend.
Create these pages/routes:
1. Role Selection
   - "Continue as Student"
   - "Continue as Interviewer"
2. Student Authentication
   - Student Sign Up
   - Student Login
3. Interviewer Authentication
   - Interviewer Sign Up
   - Interviewer Login

Store the role as: student / interviewer
Use secure password hashing. Validate duplicate emails and password confirmation.
After login: Student -> Student Dashboard | Interviewer -> Interviewer Dashboard
Protect the routes so students cannot access interviewer pages and interviewers cannot access student pages.

IMPORTANT:
Do not modify my AI interview scoring system yet.
Do not modify the existing interview functionality yet.
Do not redesign the entire website yet.
Only implement authentication and role-based routing.
Before making changes, show me which files you will create or modify.

## Phase 6: Interview Creation Execution
Implement STEP 2: Interviewer-created interviews and student participation.

IMPORTANT: My authentication system is already implemented. Do not recreate authentication.

The required workflow is:

INTERVIEWER:
1. Login as interviewer.
2. Open Interviewer Dashboard.
3. Add a "Create Interview" option.
4. Interviewer can create an interview with: Interview title, Job/role, Skills/topics, Difficulty, Number of questions, Time limit.
5. Generate the interview/questions using my existing AI functionality.
6. Show a preview of the generated interview.
7. Allow interviewer to Publish the interview.
8. After publishing, generate a unique Interview ID or shareable interview link.
9. Interviewer can see their created interviews.
10. Interviewer can see student submissions/results for each interview.

STUDENT:
1. Login as student.
2. Open Student Dashboard.
3. Show "Available Interviews".
4. Student can enter an Interview ID or open a shared interview link.
5. Student can see the interview details before starting.
6. Student clicks "Start Interview".
7. Student gives the interview using my existing AI interview functionality.
8. Save the student's answers and interview result.
9. Student can see their own result after completing the interview.

ACCESS CONTROL:
- Interviewers can create and publish interviews.
- Students can only participate in published interviews.
- Students cannot create interviews.
- Interviewers cannot take student interviews through the student dashboard.
- A student can only see their own results.
- An interviewer can only see results for interviews created by that interviewer.

IMPORTANT:
- Reuse my existing AI interview functionality.
- Reuse my existing database/backend where possible.
- Do not create a second authentication system.
- Do not change the AI scoring/accuracy algorithm yet.
- Do not redesign the entire UI. Keep the current visual style.

Before making changes, inspect the existing project and tell me:
1. Which files you will modify.
2. Which new files you will create.
3. What database changes are required.

## Phase 7: Student Interview Workflow
STEP 3: Complete the Student Interview and Results workflow.
My authentication and interviewer-created interview system are already implemented.
Now make the complete workflow functional:

STUDENT:
1. Student Dashboard should show published interviews.
2. Student can select an interview created by an interviewer.
3. Show: Interview title, Job role, Difficulty, Number of questions, Time limit, Interviewer name if available
4. Student clicks "Start Interview".
5. Use my existing AI interview interface/functionality.
6. The interview must use the questions/interview configuration created by the interviewer.
7. Save the student's answers while the interview is in progress.
8. Student can submit/finish the interview.
9. After submission, save the interview attempt and result.

RESULTS:
Student should be able to see:
- Final score
- Question-by-question results
- Their answers
- Correctness/quality feedback
- Strengths
- Weaknesses
- Suggestions for improvement

INTERVIEWER:
For each interview they created, show:
- Number of students who attempted it
- Student names
- Completion status
- Score
- Date/time
- View detailed result

ACCESS CONTROL:
- Student can only see their own results.
- Interviewer can only see results for interviews they created.
- Students can only take published interviews.
- A student should not be able to submit the same interview multiple times unless retakes are explicitly enabled.

IMPORTANT:
- Reuse the existing authentication.
- Reuse the existing interviewer interview-generation system.
- Reuse the existing AI interview functionality.
- Do NOT redesign the whole UI.
- Do NOT modify the scoring algorithm yet. We will improve scoring separately in the next step.
- Do not create duplicate authentication or duplicate interview systems.

Before modifying files, inspect the existing implementation and tell me which files/database models/routes you will change.
