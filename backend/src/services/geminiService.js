const { GoogleGenerativeAI } = require('@google/generative-ai');

const getApiKey = () => process.env.GEMINI_API_KEY || '';

// Deterministic Programmatic Weighted Score Calculation Function
const calculateWeightedScore = (criteria, mistakes = [], missingConcepts = []) => {
  const tech = Math.min(100, Math.max(0, criteria.technical_correctness || 0));
  const rel = Math.min(100, Math.max(0, criteria.relevance || 0));
  const comp = Math.min(100, Math.max(0, criteria.completeness || 0));
  const ps = Math.min(100, Math.max(0, criteria.problem_solving || 0));
  const comm = Math.min(100, Math.max(0, criteria.communication || 0));
  const prof = Math.min(100, Math.max(0, criteria.professional_quality || 0));

  // Weighted sum using exact specified percentages:
  // Technical Correctness: 35%, Relevance: 20%, Completeness: 15%, Problem Solving: 15%, Communication: 10%, Professional Quality: 5%
  let rawWeightedScore = (tech * 0.35) + (rel * 0.20) + (comp * 0.15) + (ps * 0.15) + (comm * 0.10) + (prof * 0.05);

  // Apply programmatic penalties for mistakes and missing concepts
  const mistakePenalty = (mistakes?.length || 0) * 4;
  const missingPenalty = (missingConcepts?.length || 0) * 3;
  
  let finalScore = Math.round(Math.max(0, Math.min(100, rawWeightedScore - mistakePenalty - missingPenalty)));

  // Strict score cap if technical correctness is low (prevents confident but incorrect answers from scoring high)
  if (tech < 50) {
    finalScore = Math.min(finalScore, tech + 10);
  }

  return {
    technicalAccuracy: tech,
    relevance: rel,
    completeness: comp,
    problemSolving: ps,
    communication: comm,
    professionalQuality: prof,
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

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an AI Interviewer conducting a realistic ${interviewType} interview.
Job Role: ${jobRole}
Level: ${experienceLevel}
Difficulty: ${difficulty}
Skills: ${candidateProfile?.skills ? candidateProfile.skills.join(', ') : 'Software Engineering'}

Previous Q&A:
${JSON.stringify(qnaHistory, null, 2)}

Return strictly JSON format:
{
  "question": "string",
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
    // Evidence-based evaluation mock if no key
    const text = (candidateAnswer || '').trim();
    const wordCount = text.split(' ').length;
    const isShort = wordCount < 10;
    
    const criteria = {
      technical_correctness: isShort ? 45 : 75,
      relevance: isShort ? 50 : 80,
      completeness: isShort ? 35 : 70,
      problem_solving: isShort ? 40 : 75,
      communication: isShort ? 60 : 80,
      professional_quality: isShort ? 60 : 75
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
1. Grade the answer objectively across 6 criteria on a 0-100 scale:
   - technical_correctness (35% weight): Is the technical logic factually accurate? Low score if claims are incorrect regardless of tone.
   - relevance (20% weight): Did candidate answer the exact question directly? Low score if off-topic.
   - completeness (15% weight): Did candidate cover key expected sub-topics? Low score if key concepts missing.
   - problem_solving (15% weight): Shows logical reasoning and problem-solving depth?
   - communication (10% weight): Is explanation structured and readable?
   - professional_quality (5% weight): Professional vocabulary and clarity.

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
  "technical_correctness": number,
  "relevance": number,
  "completeness": number,
  "problem_solving": number,
  "communication": number,
  "professional_quality": number,
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

    // Compute final score programmatically using 35%/20%/15%/15%/10%/5% weights
    const criteria = {
      technical_correctness: rawEval.technical_correctness || 70,
      relevance: rawEval.relevance || 70,
      completeness: rawEval.completeness || 65,
      problem_solving: rawEval.problem_solving || 65,
      communication: rawEval.communication || 75,
      professional_quality: rawEval.professional_quality || 75
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
      technical_correctness: 65,
      relevance: 70,
      completeness: 60,
      problem_solving: 60,
      communication: 75,
      professional_quality: 70
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
  let totalTechSum = 0;
  let totalRelSum = 0;
  let totalCompSum = 0;
  let totalPSSum = 0;
  let totalCommSum = 0;

  let totalCorrect = 0; // score >= 80
  let totalPartiallyCorrect = 0; // 60 <= score < 80
  let totalIncorrect = 0; // score < 60

  let allMistakes = [];
  let allMissingConcepts = [];
  let allStrengths = [];
  let allWeaknesses = [];

  qnaList.forEach(qna => {
    const ev = qna.evaluation || {};
    const score = ev.overallQuestionScore || 70;

    totalScoreSum += score;
    totalTechSum += (ev.technicalAccuracy || 70);
    totalRelSum += (ev.relevance || 70);
    totalCompSum += (ev.completeness || 65);
    totalPSSum += (ev.problemSolving || 65);
    totalCommSum += (ev.communication || 75);

    if (score >= 80) totalCorrect++;
    else if (score >= 60) totalPartiallyCorrect++;
    else totalIncorrect++;

    if (ev.mistakes) allMistakes.push(...ev.mistakes);
    if (ev.missingConcepts) allMissingConcepts.push(...ev.missingConcepts);
    if (ev.strengths) allStrengths.push(...ev.strengths);
    if (ev.weaknesses) allWeaknesses.push(...ev.weaknesses);
  });

  const count = qnaList.length || 1;
  const overallScore = Math.round(totalScoreSum / count);

  const categoryScores = {
    technical: Math.round(totalTechSum / count),
    relevance: Math.round(totalRelSum / count),
    completeness: Math.round(totalCompSum / count),
    problemSolving: Math.round(totalPSSum / count),
    communication: Math.round(totalCommSum / count)
  };

  const readinessScore = Math.max(0, Math.min(100, Math.round(overallScore * 1.05)));

  return {
    overallScore,
    categoryScores,
    readinessScore,
    totalQuestions: count,
    totalCorrect,
    totalPartiallyCorrect,
    totalIncorrect,
    totalMistakesCount: allMistakes.length,
    totalMissingConceptsCount: allMissingConcepts.length,
    allMistakes: Array.from(new Set(allMistakes)),
    allMissingConcepts: Array.from(new Set(allMissingConcepts)),
    strengths: Array.from(new Set(allStrengths)).slice(0, 5),
    weaknesses: Array.from(new Set(allWeaknesses)).slice(0, 5),
    detailedFeedback: `Evidence-based evaluation completed over ${count} question(s). Overall score calculated programmatically at ${overallScore}/100 with ${totalCorrect} correct, ${totalPartiallyCorrect} partially correct, and ${totalIncorrect} weak responses.`,
    recommendedTopics: Array.from(new Set(allMissingConcepts)).slice(0, 4),
    personalizedPlan: [
      "Review missing technical concepts highlighted in your report",
      "Practice structuring answers using STAR & technical framework methods",
      "Conduct mock technical screens under timed conditions"
    ]
  };
};

module.exports = {
  extractResumeProfile,
  generateNextQuestion,
  evaluateAnswer,
  generateFinalReport,
  calculateWeightedScore
};
