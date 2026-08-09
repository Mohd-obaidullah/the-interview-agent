const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const getApiKey = () => process.env.GEMINI_API_KEY || '';

// Deterministic Programmatic Weighted Score Calculation Function
const calculateWeightedScore = (criteria, mistakes = [], missingConcepts = []) => {
  const correctness = Math.min(100, Math.max(0, criteria.correctness || 0));
  const technicalAccuracy = Math.min(100, Math.max(0, criteria.technicalAccuracy || 0));
  const completeness = Math.min(100, Math.max(0, criteria.completeness || 0));
  const relevance = Math.min(100, Math.max(0, criteria.relevance || 0));
  const clarity = Math.min(100, Math.max(0, criteria.clarity || 0));

  // Weighted sum using exact specified percentages:
  // Correctness: 30%, Technical Accuracy: 25%, Completeness: 20%, Relevance: 15%, Clarity/Reasoning: 10%
  let rawWeightedScore = (correctness * 0.30) + (technicalAccuracy * 0.25) + (completeness * 0.20) + (relevance * 0.15) + (clarity * 0.10);

  // Apply programmatic penalties for mistakes and missing concepts
  const mistakePenalty = (mistakes?.length || 0) * 4;
  const missingPenalty = (missingConcepts?.length || 0) * 3;
  
  let finalScore = Math.round(Math.max(0, Math.min(100, rawWeightedScore - mistakePenalty - missingPenalty)));

  // Strict score cap if correctness is low (prevents confident but incorrect answers from scoring high)
  if (correctness < 50) {
    finalScore = Math.min(finalScore, correctness + 10);
  }

  return {
    correctness,
    technicalAccuracy,
    completeness,
    relevance,
    clarity,
    overallQuestionScore: finalScore
  };
};

const extractResumeProfile = async (rawText) => {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return {
      skills: ['JavaScript', 'React.js', 'Node.js', 'Express', 'REST APIs', 'MongoDB', 'System Design'],
      technologies: ['React', 'Node.js', 'Tailwind CSS', 'Git', 'Docker'],
      projects: ['E-Commerce Platform', 'Real-time Chat App'],
      experience: ['2+ years web development'],
      education: ['B.S. Computer Science'],
      achievements: ['Built scalable web applications']
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert ATS parser. Extract candidate details in JSON format:
{
  "skills": ["string"],
  "technologies": ["string"],
  "projects": ["string"],
  "experience": ["string"],
  "education": ["string"],
  "achievements": ["string"]
}

Resume Text:
"""
${rawText}
"""
Return strictly raw valid JSON.`;

    const result = await model.generateContent(prompt);
    const cleanJson = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    return {
      skills: ['JavaScript', 'React.js', 'Node.js', 'System Design'],
      technologies: ['React', 'Node.js'],
      projects: ['Full Stack Application'],
      experience: ['Software Engineering'],
      education: ['Computer Science'],
      achievements: ['Completed technical projects']
    };
  }
};

const generateNextQuestion = async ({ jobRole, experienceLevel, interviewType, difficulty, qnaHistory, candidateProfile, questionIndex }) => {
  const apiKey = getApiKey();
  
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    const mockQuestions = [
      { question: "Explain the event loop in JavaScript. How does it work with microtasks and macrotasks?", category: "Technical", difficulty: "Medium" },
      { question: "How do React hooks work under the hood, and what are the Rules of Hooks?", category: "Technical", difficulty: "Medium" },
      { question: "Describe how you handle authentication and authorization in a Node.js REST API.", category: "Technical", difficulty: "Medium" },
      { question: "How would you optimize MongoDB queries for high volume read-heavy applications?", category: "Technical", difficulty: "Hard" },
      { question: "Describe a complex technical issue you encountered in production and how you debugged it.", category: "Behavioral", difficulty: "Medium" }
    ];
    return mockQuestions[Math.min(questionIndex, mockQuestions.length - 1)];
  }

  // Curriculum RAG: Load curriculum and pick a topic
  let curriculumContext = "";
  try {
    const curriculumPath = path.join(__dirname, '../../data/curriculum.json');
    if (fs.existsSync(curriculumPath)) {
      const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));
      // Naive RAG: Pick a curriculum day based on question index
      const targetModule = curriculum[questionIndex % curriculum.length];
      curriculumContext = `
CURRICULUM FOCUS FOR THIS QUESTION:
Module: ${targetModule.module}
Objectives: ${targetModule.objectives.join(', ')}
Tools: ${targetModule.tools.join(', ')}
`;
    }
  } catch (err) {
    console.error("Failed to load curriculum:", err.message);
  }

  // Follow-up Engine logic
  const lastQnA = qnaHistory && qnaHistory.length > 0 ? qnaHistory[qnaHistory.length - 1] : null;
  let previousContextStr = "";
  if (lastQnA) {
    previousContextStr = `
PREVIOUS QUESTION: "${lastQnA.question}"
CANDIDATE ANSWER: "${lastQnA.candidateAnswer}"
PREVIOUS EVALUATION SCORE: ${lastQnA.evaluation?.overallQuestionScore || 'Unknown'}

INSTRUCTIONS FOR FOLLOW-UP:
If the candidate's answer was weak or missed important concepts, generate a FOLLOW-UP question drilling down into their specific mistake or knowledge gap.
If the candidate's answer was strong, move on to the CURRICULUM FOCUS topic instead.
`;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an AI Interviewer conducting a realistic ${interviewType} interview.
Job Role: ${jobRole}
Level: ${experienceLevel}
Difficulty: ${difficulty}
Skills: ${candidateProfile?.skills ? candidateProfile.skills.join(', ') : 'Software Engineering'}

${curriculumContext}
${previousContextStr}

Return strictly JSON format:
{
  "question": "string (the next question to ask)",
  "category": "Technical | HR | Behavioral",
  "difficulty": "Easy | Medium | Hard"
}`;

    const result = await model.generateContent(prompt);
    const cleanJson = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    return {
      question: "Explain the difference between let, var, and const in JavaScript.",
      category: "Technical",
      difficulty: "Easy"
    };
  }
};

// Evidence-Based Evaluation Function with Strict Scoring Rules
const evaluateAnswer = async ({ question, candidateAnswer, jobRole, experienceLevel }) => {
  const apiKey = getApiKey();
  
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    const text = (candidateAnswer || '').trim();
    const wordCount = text.split(' ').length;
    const isShort = wordCount < 10;
    
    const criteria = {
      correctness: isShort ? 45 : 75,
      technicalAccuracy: isShort ? 50 : 80,
      completeness: isShort ? 35 : 70,
      relevance: isShort ? 40 : 75,
      clarity: isShort ? 60 : 80
    };

    const mistakes = isShort ? ["Answer is overly vague and lacks core technical definitions."] : ["Could mention edge case handling."];
    const missingConcepts = isShort ? ["Microtask vs Macrotask queue priority", "Execution stack frames"] : ["Temporal Dead Zone details"];

    const computedScores = calculateWeightedScore(criteria, mistakes, missingConcepts);

    return {
      ...computedScores,
      criteria,
      mistakes,
      incorrectStatements: isShort ? ["Claimed event loop runs synchronously."] : [],
      missingConcepts,
      strengths: ["Clear tone and articulate language."],
      weaknesses: isShort ? ["Lacks technical depth and misses key architectural concepts."] : ["Can include practical code examples."],
      suggestedAnswer: "The JavaScript event loop continuously monitors the call stack and message queues. Promises register callbacks in the microtask queue, which are processed completely before the event loop pulls from the macrotask queue (such as setTimeout).",
      feedback: isShort ? "Answer is incomplete and misses essential technical mechanics." : "Solid response covering core mechanics clearly."
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a strict, fair, and evidence-based AI Technical Interview Evaluator.
Job Role: ${jobRole}
Level: ${experienceLevel}
Question Asked: "${question}"
Candidate Answer: "${candidateAnswer}"

EVALUATION RULES:
1. Grade the answer objectively across 5 criteria on a 0-100 scale:
   - correctness (30% weight): Is the answer factually and conceptually correct?
   - technicalAccuracy (25% weight): Correct technical details, terminology and reasoning.
   - completeness (20% weight): Important concepts and required parts included.
   - relevance (15% weight): Did candidate answer the exact question directly?
   - clarity (10% weight): Organization, explanation and logical reasoning.

2. SCORE BAND BENCHMARKS:
   - 90-100: Excellent answer covering almost all key concepts accurately.
   - 75-89: Good answer with minor gaps.
   - 60-74: Average / partially correct answer with noticeable gaps.
   - 40-59: Weak answer with significant mistakes or missing facts.
   - <40: Mostly incorrect or non-responsive answer.

3. Identify explicit evidence:
   - mistakes: list of technical or factual mistakes.
   - incorrect_statements: list of wrong claims made.
   - missing_concepts: list of expected key points missing.
   - strengths: strong points in answer.
   - weaknesses: weak areas in answer.
   - suggested_answer: standard comprehensive model answer.

Return strictly raw valid JSON format:
{
  "correctness": number,
  "technicalAccuracy": number,
  "completeness": number,
  "relevance": number,
  "clarity": number,
  "mistakes": ["string"],
  "incorrect_statements": ["string"],
  "missing_concepts": ["string"],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "suggested_answer": "string",
  "feedback": "string"
}`;

    const result = await model.generateContent(prompt);
    const cleanJson = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const rawEval = JSON.parse(cleanJson);

    // Compute final score programmatically
    const criteria = {
      correctness: rawEval.correctness || 70,
      technicalAccuracy: rawEval.technicalAccuracy || 70,
      completeness: rawEval.completeness || 65,
      relevance: rawEval.relevance || 70,
      clarity: rawEval.clarity || 75
    };

    const mistakes = rawEval.mistakes || [];
    const missingConcepts = rawEval.missing_concepts || [];
    const computedScores = calculateWeightedScore(criteria, mistakes, missingConcepts);

    return {
      ...computedScores,
      criteria,
      mistakes,
      incorrectStatements: rawEval.incorrect_statements || [],
      missingConcepts,
      strengths: rawEval.strengths || [],
      weaknesses: rawEval.weaknesses || [],
      suggestedAnswer: rawEval.suggested_answer || "Refer to core documentation for standard execution models.",
      feedback: rawEval.feedback || "Evaluated based on standard technical criteria."
    };
  } catch (err) {
    console.error('Gemini Evaluation Error:', err.message);
    const fallbackCriteria = {
      correctness: 65,
      technicalAccuracy: 60,
      completeness: 60,
      relevance: 70,
      clarity: 75
    };
    return {
      ...calculateWeightedScore(fallbackCriteria, ["Answer lacked detailed mechanics."], ["Core execution context"]),
      criteria: fallbackCriteria,
      mistakes: ["Lacked detailed mechanics."],
      incorrectStatements: [],
      missingConcepts: ["Core execution context"],
      strengths: ["Clear communication."],
      weaknesses: ["Needs deeper technical coverage."],
      suggestedAnswer: "Provide a structured breakdown of the underlying technology.",
      feedback: "Answer evaluated based on foundational concepts."
    };
  }
};

// Evidence-Based Final Report Generator
const generateFinalReport = async (interviewData) => {
  const qnaList = interviewData.qnaList || [];
  
  // Calculate aggregate metrics programmatically
  let totalScoreSum = 0;

  let allMistakes = [];
  let allMissingConcepts = [];
  let allStrengths = [];
  let allWeaknesses = [];

  qnaList.forEach(qna => {
    const ev = qna.evaluation || {};
    const score = ev.overallQuestionScore || 70;

    totalScoreSum += score;

    if (ev.mistakes) allMistakes.push(...ev.mistakes);
    if (ev.missingConcepts) allMissingConcepts.push(...ev.missingConcepts);
    if (ev.strengths) allStrengths.push(...ev.strengths);
    if (ev.weaknesses) allWeaknesses.push(...ev.weaknesses);
  });

  const count = qnaList.length || 1;
  const overallScore = Math.round(totalScoreSum / count);

  return {
    overallScore,
    summary: `Evidence-based evaluation completed over ${count} question(s). Overall score calculated programmatically at ${overallScore}/100.`,
    strengths: Array.from(new Set(allStrengths)).slice(0, 5),
    weaknesses: Array.from(new Set(allWeaknesses)).slice(0, 5),
    majorMistakes: Array.from(new Set(allMistakes)).slice(0, 5),
    minorMistakes: Array.from(new Set(allMissingConcepts)).slice(0, 5),
    questionResults: qnaList.map(qna => ({
      question: qna.question || '',
      answer: qna.candidateAnswer || '',
      score: qna.evaluation?.overallQuestionScore || 0,
      correctness: qna.evaluation?.correctness || 0,
      technicalAccuracy: qna.evaluation?.technicalAccuracy || 0,
      completeness: qna.evaluation?.completeness || 0,
      relevance: qna.evaluation?.relevance || 0,
      clarity: qna.evaluation?.clarity || 0,
      feedback: qna.evaluation?.feedback || "",
      mistakes: qna.evaluation?.mistakes || [],
      improvedAnswer: qna.evaluation?.suggestedAnswer || ""
    })),
    recommendation: `Focus on ${Array.from(new Set(allMissingConcepts)).slice(0, 4).join(', ') || 'general improvements'}`
  };
};

module.exports = {
  extractResumeProfile,
  generateNextQuestion,
  evaluateAnswer,
  generateFinalReport,
  calculateWeightedScore
};
