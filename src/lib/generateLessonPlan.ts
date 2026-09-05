import type { LessonPlanInput, ProcedureStep } from './supabase';

interface ParsedStandard {
  subject: string;
  gradeLevel: string;
  topic: string;
}

const SUBJECT_KEYWORDS: Record<string, string[]> = {
  'Mathematics': ['math', 'algebra', 'geometry', 'fraction', 'decimal', 'equation', 'number', 'arithmetic', 'calculus', 'trigonometry', 'statistics', 'probability', 'multiplication', 'division', 'addition', 'subtraction'],
  'English Language Arts': ['reading', 'writing', 'essay', 'grammar', 'literature', 'comprehension', 'phonics', 'vocabulary', 'narrative', 'poem', 'poetry', 'sentence', 'paragraph', 'speech', 'language'],
  'Science': ['science', 'biology', 'chemistry', 'physics', 'ecosystem', 'energy', 'force', 'motion', 'cell', 'organism', 'experiment', 'hypothesis', 'matter', 'weather', 'climate', 'planet', 'earth'],
  'Social Studies': ['history', 'geography', 'government', 'civics', 'economics', 'culture', 'society', 'citizen', 'map', 'region', 'civilization', 'war', 'revolution', 'democracy'],
  'Arts': ['art', 'drawing', 'painting', 'music', 'dance', 'theater', 'drama', 'sculpture', 'design', 'creative'],
  'Physical Education': ['physical', 'fitness', 'exercise', 'sport', 'game', 'movement', 'health', 'nutrition'],
  'Computer Science': ['coding', 'programming', 'algorithm', 'computer', 'technology', 'digital', 'software', 'data', 'cyber'],
};

const GRADE_PATTERNS: { regex: RegExp; label: string }[] = [
  { regex: /\b(k|kindergarten)\b/i, label: 'Kindergarten' },
  { regex: /\b(pre-?k|prekindergarten)\b/i, label: 'Pre-K' },
  { regex: /\bgrade\s*(\d{1,2})\b/i, label: '' },
  { regex: /\b(\d{1,2})(?:st|nd|rd|th)\s+grade\b/i, label: '' },
  { regex: /\bgrades?\s*(\d{1,2})\s*[-–]\s*(\d{1,2})\b/i, label: '' },
  { regex: /\bhigh\s*school\b/i, label: 'High School' },
  { regex: /\bmiddle\s*school\b/i, label: 'Middle School' },
  { regex: /\belementary\b/i, label: 'Elementary' },
];

function detectSubject(standard: string): string {
  const lower = standard.toLowerCase();
  for (const [subject, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return subject;
  }
  return 'General';
}

function detectGradeLevel(standard: string): string {
  for (const pattern of GRADE_PATTERNS) {
    const match = standard.match(pattern.regex);
    if (match) {
      if (pattern.label) return pattern.label;
      if (match[2]) return `Grades ${match[1]}–${match[2]}`;
      return `Grade ${match[1]}`;
    }
  }
  return 'General';
}

function extractTopic(standard: string): string {
  const cleaned = standard
    .replace(/^CCSS\.?/i, '')
    .replace(/^NGSS\.?/i, '')
    .replace(/^NCAS\.?/i, '')
    .replace(/^TEKS\.?/i, '')
    .replace(/^Common\s+Core\s+/i, '')
    .replace(/^Standard\s*[:#]?\s*/i, '')
    .trim();
  return cleaned.length > 120 ? cleaned.slice(0, 117) + '...' : cleaned;
}

function buildObjectives(subject: string, topic: string, grade: string): string[] {
  const base = [
    `Students will be able to understand and explain the key concepts of ${topic}.`,
    `Students will be able to apply ${topic} to solve real-world problems.`,
    `Students will be able to analyze and evaluate examples related to ${topic}.`,
  ];
  if (subject === 'Mathematics') {
    return [
      `Students will be able to identify and describe the core mathematical principles of ${topic}.`,
      `Students will be able to solve problems involving ${topic} using appropriate strategies.`,
      `Students will be able to justify their reasoning when working with ${topic}.`,
    ];
  }
  if (subject === 'English Language Arts') {
    return [
      `Students will be able to read and comprehend texts related to ${topic}.`,
      `Students will be able to write clearly about ${topic} using grade-appropriate language.`,
      `Students will be able to discuss ${topic} using evidence from the text.`,
    ];
  }
  if (subject === 'Science') {
    return [
      `Students will be able to formulate a hypothesis related to ${topic}.`,
      `Students will be able to conduct an investigation exploring ${topic}.`,
      `Students will be able to analyze data and draw conclusions about ${topic}.`,
    ];
  }
  if (subject === 'Social Studies') {
    return [
      `Students will be able to describe the historical and social context of ${topic}.`,
      `Students will be able to compare different perspectives on ${topic}.`,
      `Students will be able to connect ${topic} to current events and civic life.`,
    ];
  }
  return base;
}

function buildMaterials(subject: string): string[] {
  const general = ['Pencils and notebooks', 'Whiteboard and markers', 'Handout with the standard and key terms'];
  if (subject === 'Mathematics') return [...general, 'Calculators', 'Graph paper', 'Manipulatives or visual aids'];
  if (subject === 'English Language Arts') return [...general, 'Selected reading text', 'Graphic organizer', 'Highlighters'];
  if (subject === 'Science') return [...general, 'Lab equipment as needed', 'Safety goggles', 'Data collection sheet'];
  if (subject === 'Social Studies') return [...general, 'Primary source documents', 'Map or atlas', 'Discussion prompt cards'];
  if (subject === 'Arts') return [...general, 'Art supplies (paper, paint, brushes)', 'Visual examples of the technique'];
  if (subject === 'Computer Science') return [...general, 'Computers or tablets', 'Coding environment access'];
  return general;
}

function buildProcedure(topic: string): ProcedureStep[] {
  return [
    {
      phase: 'Introduction',
      title: 'Hook & Activation',
      detail: `Open with a provocative question or real-world scenario connected to ${topic}. Ask students to share prior knowledge and record predictions on the board. State the learning objectives clearly.`,
      duration: '5–7 min',
    },
    {
      phase: 'Direct Instruction',
      title: 'Model the Concept',
      detail: `Present the core idea of ${topic} using a worked example, visual model, or short demonstration. Think aloud so students see the reasoning process. Check for understanding with targeted questions.`,
      duration: '10–12 min',
    },
    {
      phase: 'Guided Practice',
      title: 'Collaborative Work',
      detail: `Students work in pairs or small groups on a scaffolded task related to ${topic}. Circulate, prompting with guiding questions and correcting misconceptions in real time.`,
      duration: '12–15 min',
    },
    {
      phase: 'Independent Practice',
      title: 'Apply Independently',
      detail: `Students complete an individual task applying ${topic}. Differentiate by complexity or support level. Collect work to inform the next lesson.`,
      duration: '8–10 min',
    },
    {
      phase: 'Closure',
      title: 'Reflect & Summarize',
      detail: `Use an exit ticket: students write one thing they learned about ${topic} and one question they still have. Share key takeaways and preview the next lesson.`,
      duration: '3–5 min',
    },
  ];
}

function buildAssessment(subject: string, topic: string): string {
  const common = `Formative assessment occurs throughout via questioning and observation during guided and independent practice. An exit ticket checks individual understanding of ${topic}. A short rubric-based task at the end of the week can serve as a summative check.`;
  return common;
}

function buildDifferentiation(grade: string): string {
  return [
    `Support: Provide sentence starters, visual aids, and a partially completed example for students who need scaffolding.`,
    `Extension: Offer an open-ended challenge that asks advanced students to generalize or create their own example.`,
    `Language: For multilingual learners, pre-teach key vocabulary and allow responses in both languages before transitioning to English.`,
  ].join(' ');
}

function buildHomework(topic: string): string {
  return `Students complete a short take-home task: find one real-world example of ${topic} outside of class (in the news, at home, or online) and write 3–5 sentences explaining the connection. Due next class.`;
}

function buildTitle(subject: string, topic: string): string {
  const topicShort = topic.length > 60 ? topic.slice(0, 57) + '...' : topic;
  return `${subject}: ${topicShort}`;
}

export function generateLessonPlan(standard: string, options?: { gradeLevel?: string; duration?: string }): LessonPlanInput {
  const parsed: ParsedStandard = {
    subject: detectSubject(standard),
    gradeLevel: options?.gradeLevel || detectGradeLevel(standard),
    topic: extractTopic(standard),
  };

  return {
    standard,
    subject: parsed.subject,
    grade_level: parsed.gradeLevel,
    duration: options?.duration || '45 minutes',
    title: buildTitle(parsed.subject, parsed.topic),
    objectives: buildObjectives(parsed.subject, parsed.topic, parsed.gradeLevel),
    materials: buildMaterials(parsed.subject),
    procedure: buildProcedure(parsed.topic),
    assessment: buildAssessment(parsed.subject, parsed.topic),
    differentiation: buildDifferentiation(parsed.gradeLevel),
    homework: buildHomework(parsed.topic),
  };
}
