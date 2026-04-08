import Database from 'better-sqlite3';
import { resolve } from 'path';

const db = new Database(resolve('data/tutor.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const insertLevel = db.prepare('INSERT OR REPLACE INTO levels (id, title, cefr, description) VALUES (?, ?, ?, ?)');
const insertLesson = db.prepare('INSERT OR REPLACE INTO lessons (id, level_id, sort_order, title, goal, grammar_focus) VALUES (?, ?, ?, ?, ?, ?)');
const insertSection = db.prepare('INSERT OR REPLACE INTO sections (lesson_id, sort_order, type, title, teacher_script, examples, practice_prompt, vocabulary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

// Clear existing L5 sections if re-running
db.prepare("DELETE FROM sections WHERE lesson_id LIKE 'L5-%'").run();
db.prepare("DELETE FROM lessons WHERE level_id = 5").run();

const seed = db.transaction(() => {

  insertLevel.run(5, 'Business English', 'B2+', 'Professional English for the workplace — meetings, emails, presentations, and negotiations');

  // --- L5-01: Business Meetings ---
  insertLesson.run('L5-01', 5, 1, 'Business Meetings & Discussions', 'Participate confidently in English business meetings', 'Modal verbs for suggestions (could, should, might), Formal register');

  insertSection.run('L5-01', 1, 'warmup', 'Meeting Culture & Key Vocabulary',
    `Welcome to Business English! Today we're going to learn how to participate in English business meetings. Meetings are a huge part of work life, and knowing the right phrases will make you sound confident and professional. Let me start with essential meeting vocabulary.`,
    JSON.stringify([
      "agenda — 회의 안건 (the list of topics to discuss)",
      "minutes — 회의록 (the written record of the meeting)",
      "action item — 실행 항목 (a task assigned to someone)",
      "deadline — 마감일 (the date something must be finished)",
      "follow up — 후속 조치 (to check on something later)",
      "stakeholder — 이해관계자 (people affected by a decision)",
      "KPI — Key Performance Indicator (핵심 성과 지표)",
      "ROI — Return on Investment (투자 수익률)",
      "Q1, Q2, Q3, Q4 — 1분기, 2분기, 3분기, 4분기",
      "to table something — to postpone a topic for later discussion",
      "to circle back — to return to a topic later"
    ]),
    "Have you attended meetings in English before? Even if not, can you tell me what your meetings are usually about at work?",
    JSON.stringify(["agenda", "minutes", "action item", "deadline", "follow up", "stakeholder", "KPI", "ROI"])
  );

  insertSection.run('L5-01', 2, 'core', 'Opening & Running a Meeting',
    `Now let me teach you the most important phrases for the beginning of a meeting. These are used by the person leading the meeting, but even as a participant, you should know them. The structure is: Greeting → Purpose → Agenda → Ground rules.`,
    JSON.stringify([
      "OPENING THE MEETING:",
      "  'Good morning, everyone. Thank you for joining.'",
      "  'Let's get started. / Shall we begin?'",
      "  'The purpose of today's meeting is to...'",
      "  'As you can see from the agenda, we have three items to cover.'",
      "",
      "MOVING THROUGH TOPICS:",
      "  'Let's move on to the next item.'",
      "  'Moving on to the second point...'",
      "  'Before we move on, does anyone have questions?'",
      "",
      "TIME MANAGEMENT:",
      "  'We're running short on time, so let's keep this brief.'",
      "  'Let's table this for now and circle back next week.'",
      "  'In the interest of time, let's focus on the key points.'",
      "",
      "CLOSING THE MEETING:",
      "  'To summarize, we agreed on...'",
      "  'The action items are: [person] will [task] by [date].'",
      "  'Thank you all for your time. Let's reconvene next Tuesday.'"
    ]),
    "Try opening a meeting: Say 'Good morning, everyone. The purpose of today's meeting is to...' — you can pick any topic!",
    JSON.stringify(["shall we begin", "move on", "table this", "circle back", "in the interest of time", "reconvene", "action items"])
  );

  insertSection.run('L5-01', 3, 'core', 'Giving Opinions & Making Suggestions',
    `In meetings, you need to share your opinions and make suggestions. In business English, we use softer, more diplomatic language than in casual conversation. Let me teach you the difference between direct and diplomatic language.`,
    JSON.stringify([
      "GIVING YOUR OPINION (diplomatic):",
      "  'I think we should consider...' (basic)",
      "  'In my view, the best approach would be...' (professional)",
      "  'From my perspective, I believe...' (strong but polite)",
      "  'Based on the data, I'd suggest...' (evidence-based)",
      "",
      "MAKING SUGGESTIONS:",
      "  'How about we try...?' (casual)",
      "  'Could we possibly...?' (polite)",
      "  'I'd like to propose that we...' (formal)",
      "  'What if we approached it from a different angle?' (creative)",
      "  'One option might be to...' (tentative)",
      "",
      "AGREEING WITH SOMEONE:",
      "  'I completely agree with [name].'",
      "  'That's a great point. Building on that...'",
      "  'I'm on the same page.'",
      "",
      "DISAGREEING DIPLOMATICALLY:",
      "  'I see where you're coming from, but...'",
      "  'That's a valid point. However, I have a slightly different view.'",
      "  'I understand the reasoning, but have we considered...?'",
      "  ❌ NEVER say: 'You're wrong.' or 'That's a bad idea.'"
    ]),
    "Try giving an opinion diplomatically. I'll set the scene: Your team is deciding whether to launch a new product next month or wait until Q3. What would you say?",
    JSON.stringify(["in my view", "I'd suggest", "propose", "building on that", "I see where you're coming from", "have we considered"])
  );

  insertSection.run('L5-01', 4, 'practice', 'Role Play: Team Meeting',
    `Let's do a full meeting role play! I'll be your colleague, and we're in a team meeting about improving customer satisfaction scores. I'll lead the meeting, and you participate as a team member. Use the phrases we learned!`,
    JSON.stringify([
      "SCENARIO: Weekly team meeting",
      "Topic: Customer satisfaction dropped 15% in Q1",
      "Your role: Marketing team member",
      "My role: Team lead (Ms. Sarah)",
      "",
      "MEETING SCRIPT:",
      "Ms. Sarah: 'Good morning, everyone. Let's get started.'",
      "'The purpose of today's meeting is to discuss the drop in customer satisfaction.'",
      "'As you can see, our score went from 85% to 72% this quarter.'",
      "'I'd like to hear your thoughts on why this happened and what we can do.'",
      "",
      "YOUR TURN — Try using these patterns:",
      "  'In my view, the main reason is...'",
      "  'I'd like to propose that we...'",
      "  'Based on what I've seen, ...'",
      "",
      "I'll respond and keep the meeting going!"
    ]),
    "OK, I'm starting the meeting: 'Good morning! Our customer satisfaction score dropped to 72% this quarter. What are your thoughts on this?'",
    null
  );

  insertSection.run('L5-01', 5, 'review', 'Review & Business Phrases Quiz',
    `Excellent work in that meeting! You did a great job using professional language. Let me review the key phrases we learned today, and then a quick quiz.`,
    JSON.stringify([
      "KEY PHRASES REVIEW:",
      "Opening: 'The purpose of today's meeting is...'",
      "Moving on: 'Let's move on to the next item.'",
      "Opinion: 'In my view, the best approach would be...'",
      "Suggestion: 'I'd like to propose that we...'",
      "Agreeing: 'Building on that...'",
      "Disagreeing: 'I see where you're coming from, but...'",
      "Closing: 'The action items are...'",
      "",
      "Quiz 1: How do you start a meeting professionally? (Answer: 'Good morning, everyone. The purpose of today's meeting is...')",
      "Quiz 2: How do you disagree politely? (Answer: 'I see where you're coming from, but...' or 'That's a valid point. However...')",
      "Quiz 3: What does 'circle back' mean? (Answer: to return to a topic later)",
      "Quiz 4: How do you make a formal suggestion? (Answer: 'I'd like to propose that we...')",
      "Quiz 5: What are 'action items'? (Answer: Tasks assigned to specific people with deadlines)"
    ]),
    "Quiz 1: How would you start a professional meeting in English?",
    null
  );

});

seed();

console.log('Level 5: Business English added!');
const count = db.prepare("SELECT COUNT(*) as c FROM sections WHERE lesson_id LIKE 'L5-%'").get().c;
console.log(`Sections added: ${count}`);

db.close();
