import Database from 'better-sqlite3';
import { resolve } from 'path';

const db = new Database(resolve('data/tutor.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const insertLesson = db.prepare('INSERT OR REPLACE INTO lessons (id, level_id, sort_order, title, goal, grammar_focus) VALUES (?, ?, ?, ?, ?, ?)');
const insertSection = db.prepare('INSERT OR REPLACE INTO sections (lesson_id, sort_order, type, title, teacher_script, examples, practice_prompt, vocabulary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

function addLesson(id, levelId, order, title, goal, grammar, sections) {
  insertLesson.run(id, levelId, order, title, goal, grammar);
  db.prepare('DELETE FROM sections WHERE lesson_id = ?').run(id);
  sections.forEach((s, i) => {
    insertSection.run(id, i + 1, s.type, s.title, s.script, JSON.stringify(s.examples || []), s.practice || null, JSON.stringify(s.vocab || []));
  });
}

const seed = db.transaction(() => {

  // =============================================
  // L5 Business English — 3 more lessons (L5-06 ~ L5-08)
  // =============================================

  // ===== L5-06: Reports & Documentation =====
  addLesson('L5-06', 5, 6, 'Reports & Documentation', 'Write clear business reports and documentation', 'Nominalisation, Impersonal structures (It was found that...)', [
    { type: 'warmup', title: 'Report Types & Structure',
      script: `Today we're learning how to write business reports in English! Reports are essential for communicating findings, progress, and recommendations. Let me teach you the different types and standard structure.`,
      examples: ["Types of reports:", "progress report — 진행 보고서", "annual report — 연간 보고서", "incident report — 사건 보고서", "market research report — 시장 조사 보고서", "feasibility study — 타당성 조사", "Standard structure:", "Executive Summary — 요약", "Introduction / Background — 배경", "Findings / Results — 결과", "Analysis — 분석", "Recommendations — 권고사항", "Conclusion — 결론"],
      practice: "What kind of reports do you write at work?",
      vocab: ["progress report", "annual report", "executive summary", "findings", "recommendations", "feasibility"] },
    { type: 'core', title: 'Formal Writing Techniques',
      script: `Business reports use formal, objective language. We avoid personal opinions and use impersonal structures. Instead of "I found that sales dropped," we write "It was found that sales declined." This is called nominalisation — turning verbs into nouns to sound more formal.`,
      examples: ["Impersonal structures:", "It was found that... — ~라는 것이 발견되었다", "The data indicates that... — 데이터에 따르면...", "It is recommended that... — ~이 권고된다", "It should be noted that... — ~을 주목해야 한다", "Nominalisation (verb → noun):", "improve → improvement (개선)", "reduce → reduction (감소)", "implement → implementation (구현)", "analyze → analysis (분석)", "decide → decision (결정)", "'We improved efficiency' → 'The improvement in efficiency was significant.'"],
      practice: "Try nominalisation: Change 'We decided to expand' to a formal version.",
      vocab: ["it was found", "indicates", "recommended", "improvement", "reduction", "implementation", "analysis"] },
    { type: 'core', title: 'Data Description & Recommendations',
      script: `Let me teach you how to describe data trends and write strong recommendations. These are the most critical parts of any report.`,
      examples: ["Describing data:", "Sales increased by 15% compared to the previous quarter.", "There was a significant decline in customer complaints.", "Revenue remained stable throughout the period.", "The most notable trend was the growth in mobile users.", "Writing recommendations:", "Based on our findings, we recommend...", "It is strongly advised that the company invest in...", "We propose the following three actions:", "In light of the data, we suggest prioritizing...", "The most cost-effective solution would be to..."],
      practice: "Describe a trend: 'There was a significant ___ in ___.'",
      vocab: ["increased by", "decline", "remained stable", "notable", "based on", "strongly advised", "propose"] },
    { type: 'practice', title: 'Report Writing Exercise',
      script: `Let's practice writing a mini report! I'll give you data and you write the findings and recommendations section. Focus on formal language and clear structure.`,
      examples: ["Scenario: Monthly Sales Report", "Data:", "- Online sales: up 22% from last month", "- In-store sales: down 8%", "- Customer satisfaction: 4.2/5 (up from 3.8)", "- Returns: decreased by 15%", "Write: 1) Key findings, 2) One recommendation"],
      practice: "Based on the data above, write your findings. Start with: 'The data indicates that...'" },
    { type: 'review', title: 'Review & Report Quiz',
      script: `Excellent report writing! We learned report structure, formal writing techniques, and data description. Quiz time!`,
      examples: ["Quiz 1: What's the formal version of 'I think we should...'? (Answer: It is recommended that...)", "Quiz 2: Nominalise: 'reduce costs' → (Answer: cost reduction)", "Quiz 3: 'Sales ___ by 15% compared to Q1.' (Answer: increased)", "Quiz 4: What's an executive summary? (Answer: A brief overview of the entire report)", "Quiz 5: Write a recommendation starting with 'Based on our findings...'"] }
  ]);

  // ===== L5-07: Customer Relations =====
  addLesson('L5-07', 5, 7, 'Customer Relations', 'Handle customer inquiries, complaints, and build relationships', 'Empathy language patterns, De-escalation techniques', [
    { type: 'warmup', title: 'Customer Service Vocabulary',
      script: `Today we're learning customer relations English! Whether you're in sales, support, or management, dealing with customers in English is a key business skill. Let me teach you the essential vocabulary.`,
      examples: ["inquiry — 문의", "complaint — 불만/클레임", "refund — 환불", "replacement — 교체", "satisfaction — 만족", "feedback — 피드백", "resolve — 해결하다", "escalate — 상위로 올리다", "follow up — 후속 조치", "apologize — 사과하다", "compensate — 보상하다", "loyalty — 충성도"],
      practice: "Have you ever dealt with customer complaints in English?",
      vocab: ["inquiry", "complaint", "refund", "replacement", "resolve", "escalate", "compensate", "loyalty"] },
    { type: 'core', title: 'Handling Inquiries & Requests',
      script: `Let me teach you how to handle customer inquiries professionally. The key is to be helpful, clear, and positive. Even when you can't help, frame it positively.`,
      examples: ["Greeting:", "Thank you for contacting us. How may I assist you?", "I'd be happy to help you with that.", "Providing information:", "Let me look into that for you.", "Based on our records, your order was shipped on...", "I can confirm that...", "When you can't help directly:", "I understand your concern. Let me transfer you to the right department.", "Unfortunately, that's outside my area, but I can connect you with someone who can help.", "While I'm not able to do that directly, what I CAN do is..."],
      practice: "A customer asks about their order status. How do you respond?",
      vocab: ["assist", "look into", "confirm", "transfer", "concern", "connect with"] },
    { type: 'core', title: 'Handling Complaints & De-escalation',
      script: `Dealing with angry customers is the hardest part. The secret is the HEARD method: Hear, Empathize, Apologize, Resolve, Diagnose. Never argue — always acknowledge their feelings first.`,
      examples: ["HEARD Method:", "Hear: 'I understand this has been frustrating for you.'", "Empathize: 'I completely understand how you feel. I'd be upset too.'", "Apologize: 'I sincerely apologize for the inconvenience.'", "Resolve: 'Here's what I'm going to do to fix this right away...'", "Diagnose: 'I'll make sure this doesn't happen again by...'", "De-escalation phrases:", "'I want to make sure we get this right for you.'", "'Your satisfaction is our top priority.'", "'I appreciate your patience while we resolve this.'", "'Let me personally make sure this is taken care of.'"],
      practice: "A customer is angry about a wrong delivery. Use the HEARD method to respond.",
      vocab: ["frustrating", "sincerely", "inconvenience", "fix", "patience", "taken care of", "priority"] },
    { type: 'practice', title: 'Role Play: Customer Scenarios',
      script: `Let's role play different customer scenarios! I'll be the customer with different issues and attitudes. Handle each situation professionally.`,
      examples: ["Scenario 1: A polite customer asking for a refund on a defective product.", "Scenario 2: An angry customer whose order arrived 2 weeks late.", "Scenario 3: A confused customer who received the wrong item.", "Scenario 4: A loyal customer requesting a special discount."],
      practice: "Scenario 1: 'Hi, I bought this laptop last week and the screen flickers. I'd like a refund please.'" },
    { type: 'review', title: 'Review & Customer Service Quiz',
      script: `Great customer service skills! We learned professional responses, the HEARD method, and de-escalation. Quiz time!`,
      examples: ["Quiz 1: What does HEARD stand for? (Answer: Hear, Empathize, Apologize, Resolve, Diagnose)", "Quiz 2: How do you start when a customer is angry? (Answer: Acknowledge their feelings first)", "Quiz 3: 'I ___ apologize for the inconvenience.' (Answer: sincerely)", "Quiz 4: What's better: 'I can't do that' or 'What I CAN do is...'? (Answer: What I CAN do is...)", "Quiz 5: Handle this: 'Your product ruined my presentation!' — Respond professionally."] }
  ]);

  // ===== L5-08: Leadership & Management =====
  addLesson('L5-08', 5, 8, 'Leadership & Management', 'Lead teams and manage people using effective English communication', 'Coaching language, Motivational phrases, Constructive feedback', [
    { type: 'warmup', title: 'Leadership Communication',
      script: `Today we're learning leadership and management English! Great leaders communicate clearly, motivate their teams, and give constructive feedback. Let me teach you the vocabulary of leadership.`,
      examples: ["delegate — 위임하다", "empower — 권한을 부여하다", "mentor — 멘토링하다", "motivate — 동기부여하다", "accountability — 책임", "initiative — 주도적 행동", "constructive feedback — 건설적 피드백", "performance review — 성과 평가", "team building — 팀 빌딩", "conflict resolution — 갈등 해결", "one-on-one — 1대1 미팅", "KPI (Key Performance Indicator) — 핵심 성과 지표"],
      practice: "Are you in a leadership or management role? What's the hardest part?",
      vocab: ["delegate", "empower", "mentor", "accountability", "initiative", "constructive", "performance review", "KPI"] },
    { type: 'core', title: 'Giving Constructive Feedback',
      script: `One of the most important leadership skills is giving feedback. We use the SBI model: Situation, Behavior, Impact. This keeps feedback specific and non-personal. Always balance positive and constructive feedback.`,
      examples: ["SBI Model:", "Situation: 'In yesterday's meeting...'", "Behavior: '...I noticed you interrupted the client several times.'", "Impact: 'This made the client feel unheard, and they seemed frustrated.'", "Positive feedback:", "'I was really impressed by how you handled that difficult client.'", "'Your presentation was well-structured and very persuasive.'", "Constructive feedback:", "'I'd like to suggest a different approach for next time...'", "'One area where I think you could improve is...'", "'What do you think went well, and what would you do differently?'"],
      practice: "Give me constructive feedback using SBI: 'In [situation], I noticed [behavior], which [impact].'",
      vocab: ["noticed", "impressed", "suggest", "approach", "improve", "differently"] },
    { type: 'core', title: 'Motivating & Delegating',
      script: `Great leaders motivate their teams and delegate effectively. Let me teach you phrases for inspiring your team and assigning tasks clearly.`,
      examples: ["Motivating:", "'I believe in this team's ability to deliver.'", "'You've done an amazing job so far. Let's keep the momentum going.'", "'I know this is challenging, but I'm confident we can figure it out together.'", "'Your contribution to this project has been invaluable.'", "Delegating:", "'I'd like you to take ownership of this project.'", "'Could you take the lead on the marketing plan?'", "'I'm assigning this to you because I trust your expertise in this area.'", "'Please have this ready by Friday. Let me know if you need any support.'", "Coaching:", "'What do you think the best approach would be?'", "'How would you handle this situation?'"],
      practice: "Delegate a task to me: Tell me what to do, why me, and the deadline.",
      vocab: ["ability", "momentum", "confident", "contribution", "ownership", "take the lead", "expertise", "support"] },
    { type: 'practice', title: 'Role Play: Management Scenarios',
      script: `Let's practice real management scenarios! I'll play your team member in different situations. Practice motivating, delegating, and giving feedback.`,
      examples: ["Scenario 1: A team member did excellent work — give positive feedback.", "Scenario 2: A team member keeps missing deadlines — have a constructive conversation.", "Scenario 3: Delegate an important project to a team member.", "Scenario 4: Your team is demotivated after a project failure — rally them."],
      practice: "Scenario 1: I just finished a big project ahead of schedule. Give me feedback!" },
    { type: 'review', title: 'Review & Leadership Quiz',
      script: `Excellent leadership communication! We learned feedback techniques, motivation, and delegation. Quiz time!`,
      examples: ["Quiz 1: What does SBI stand for? (Answer: Situation, Behavior, Impact)", "Quiz 2: Which is better: 'You did it wrong' or 'One area for improvement is...'? (Answer: One area for improvement is...)", "Quiz 3: How do you delegate effectively? (Answer: Clear task + reason + deadline + offer support)", "Quiz 4: 'I'd like you to take ___ of this project.' (Answer: ownership)", "Quiz 5: Motivate a discouraged team in one sentence."] }
  ]);

  // =============================================
  // L6 Real-Life English — New Level + 8 lessons
  // =============================================

  // Create Level 6
  db.prepare('INSERT OR REPLACE INTO levels (id, title, cefr, description) VALUES (?, ?, ?, ?)').run(
    6, 'Real-Life English', 'A2-B2', 'Practical English for everyday situations — banking, housing, emergencies, and more'
  );

  // ===== L6-01: Banking & Finance =====
  addLesson('L6-01', 6, 1, 'Banking & Finance', 'Handle banking tasks and discuss personal finance', 'Can/Could for requests, Numbers & amounts', [
    { type: 'warmup', title: 'Banking Vocabulary',
      script: `Today we're learning practical banking English! Whether you're opening an account, making a transfer, or discussing loans, these words and phrases are essential. Let me start with key vocabulary.`,
      examples: ["savings account — 저축 계좌", "checking account — 당좌 계좌", "balance — 잔액", "deposit — 예금/입금", "withdrawal — 출금", "transfer — 이체", "interest rate — 이자율", "loan — 대출", "mortgage — 주택담보대출", "credit score — 신용점수", "ATM — 현금인출기", "statement — 거래내역서", "overdraft — 초과인출", "fee — 수수료"],
      practice: "Do you use online banking? What banking tasks do you do most?",
      vocab: ["savings account", "checking account", "balance", "deposit", "withdrawal", "transfer", "interest rate", "loan"] },
    { type: 'core', title: 'At the Bank',
      script: `Let me teach you the essential phrases for banking. Whether you're at a physical bank or calling customer service, these phrases will help you handle any banking situation.`,
      examples: ["I'd like to open a savings account. — 저축 계좌를 개설하고 싶습니다", "Could I check my account balance? — 잔액을 확인할 수 있을까요?", "I'd like to make a deposit of $500. — 500달러를 입금하고 싶습니다", "I need to transfer money to another account. — 다른 계좌로 이체해야 합니다", "What's the interest rate on this account? — 이 계좌의 이자율이 어떻게 되나요?", "Are there any monthly fees? — 월 수수료가 있나요?", "I'd like to apply for a loan. — 대출을 신청하고 싶습니다", "Can I set up automatic payments? — 자동이체를 설정할 수 있나요?"],
      practice: "Try: 'I'd like to open a ___ account. What's the interest rate?'",
      vocab: ["open an account", "check balance", "make a deposit", "transfer", "apply for", "set up", "automatic"] },
    { type: 'core', title: 'Discussing Personal Finance',
      script: `Now let's learn how to talk about personal finance topics. Budgeting, saving, and investing are common conversation topics among adults.`,
      examples: ["I'm trying to save more money. — 돈을 더 모으려고 노력 중이야", "I set a monthly budget of $2,000. — 월 예산을 2,000달러로 정했어", "I've been investing in stocks recently. — 최근에 주식 투자를 하고 있어", "Living expenses have gone up a lot. — 생활비가 많이 올랐어", "I'm paying off my student loans. — 학자금 대출을 갚고 있어", "It's important to have an emergency fund. — 비상금을 갖고 있는 게 중요해", "How do you manage your finances? — 재정 관리는 어떻게 해?", "I'm thinking about opening a retirement account. — 퇴직 계좌를 개설할까 생각 중이야"],
      practice: "What's your biggest financial goal? Start with 'I'm trying to...'",
      vocab: ["save", "budget", "invest", "expenses", "paying off", "emergency fund", "manage", "retirement"] },
    { type: 'practice', title: 'Role Play: Bank Visit',
      script: `Let's role play a bank visit! I'll be the bank teller. You come in to handle different banking tasks. Use the phrases we learned.`,
      examples: ["Scenario flow:", "1. Greet the teller and state your purpose", "2. Ask about account options or fees", "3. Provide necessary information", "4. Confirm the transaction", "5. Thank them and leave"],
      practice: "Welcome to First National Bank! How can I help you today?" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great banking skills! We learned banking vocabulary, transaction phrases, and personal finance discussion. Quiz time!`,
      examples: ["Quiz 1: How do you ask to open an account? (Answer: I'd like to open a savings account.)", "Quiz 2: What's the difference between deposit and withdrawal? (Answer: Deposit = put money in, Withdrawal = take money out)", "Quiz 3: 'Could I ___ my account balance?' (Answer: check)", "Quiz 4: What does 'interest rate' mean? (Answer: 이자율)", "Quiz 5: Ask about monthly fees politely."] }
  ]);

  // ===== L6-02: Housing & Real Estate =====
  addLesson('L6-02', 6, 2, 'Housing & Real Estate', 'Find housing, discuss leases, and handle housing-related situations', 'Comparatives for comparing options, Must/Have to for lease terms', [
    { type: 'warmup', title: 'Housing Vocabulary',
      script: `Today we're learning housing English! Whether you're renting an apartment, buying a house, or dealing with your landlord, you need these words. Let me teach you the essential housing vocabulary.`,
      examples: ["rent — 임대료", "lease — 임대 계약", "landlord — 집주인", "tenant — 세입자", "deposit (security deposit) — 보증금", "utilities — 공과금 (gas, electricity, water)", "furnished — 가구 포함", "unfurnished — 가구 미포함", "studio / one-bedroom / two-bedroom — 원룸 / 1베드룸 / 2베드룸", "move in / move out — 입주 / 퇴거", "maintenance — 유지보수/수리", "pet-friendly — 반려동물 허용"],
      practice: "Do you rent or own? What's important to you in a home?",
      vocab: ["rent", "lease", "landlord", "tenant", "deposit", "utilities", "furnished", "maintenance"] },
    { type: 'core', title: 'Apartment Hunting',
      script: `Let me teach you how to search for apartments and ask the right questions. When viewing apartments, you need to compare options and understand the terms.`,
      examples: ["Searching:", "I'm looking for a one-bedroom apartment near downtown. — 시내 근처 1베드룸 아파트를 찾고 있어요", "What's the monthly rent? — 월세가 얼마인가요?", "Are utilities included? — 공과금이 포함되어 있나요?", "Is there a parking space? — 주차 공간이 있나요?", "How long is the lease? — 계약 기간이 얼마나 되나요?", "Comparing:", "This apartment is bigger than the other one. — 이 아파트가 다른 것보다 더 커요", "The rent is cheaper, but it's farther from the station. — 월세는 더 싸지만 역에서 더 멀어요", "This one has a better view. — 이 쪽이 뷰가 더 좋아요"],
      practice: "You're looking for an apartment. Tell me what you need: 'I'm looking for a...'",
      vocab: ["looking for", "monthly rent", "included", "parking", "lease", "bigger", "cheaper", "farther"] },
    { type: 'core', title: 'Lease Terms & Landlord Communication',
      script: `Understanding your lease and communicating with your landlord is crucial. Let me teach you the important lease terms and how to handle common situations.`,
      examples: ["Lease terms:", "You must give 30 days' notice before moving out. — 퇴거 30일 전에 통보해야 합니다", "The security deposit is refundable. — 보증금은 환불 가능합니다", "No pets are allowed in the building. — 건물에 반려동물이 허용되지 않습니다", "Rent is due on the 1st of every month. — 월세는 매월 1일에 납부해야 합니다", "Contacting landlord:", "I'd like to report a maintenance issue. — 수리 문제를 신고하고 싶습니다", "The heating isn't working in my apartment. — 난방이 작동하지 않습니다", "There's a water leak in the bathroom. — 욕실에 수도 누수가 있습니다", "When can someone come to fix it? — 언제 수리하러 올 수 있나요?"],
      practice: "Report a problem to your landlord: 'I'd like to report...'",
      vocab: ["notice", "refundable", "allowed", "due", "report", "maintenance issue", "heating", "leak", "fix"] },
    { type: 'practice', title: 'Role Play: Apartment Viewing',
      script: `Let's role play an apartment viewing! I'm the real estate agent showing you an apartment. Ask questions, compare with other options, and negotiate.`,
      examples: ["Agent: Welcome! This is a spacious one-bedroom with great natural light.", "You: What's the monthly rent?", "Agent: $1,500 per month, utilities not included.", "You: Is there any room for negotiation on the price?", "Agent: We might be able to go down to $1,400 with a 12-month lease.", "You: Are pets allowed?", "Agent: Small dogs and cats are fine with a $200 pet deposit."],
      practice: "I'm showing you a nice apartment downtown. 'Welcome! Come in and take a look around!'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great housing skills! We learned housing vocabulary, apartment hunting, and lease communication. Quiz time!`,
      examples: ["Quiz 1: What's a security deposit? (Answer: 보증금 — money held by landlord, returned when you leave)", "Quiz 2: 'Are ___ included in the rent?' (Answer: utilities)", "Quiz 3: How do you report a broken heater? (Answer: The heating isn't working in my apartment.)", "Quiz 4: 'You ___ give 30 days' notice.' (must/should) (Answer: must)", "Quiz 5: Compare two apartments using: '...is ___ than...'"] }
  ]);

  // ===== L6-03: Medical English (Advanced) =====
  addLesson('L6-03', 6, 3, 'Medical English (Advanced)', 'Handle complex medical situations including specialists, insurance, and pharmacy', 'Reported speech for relaying doctor instructions, Medical terminology', [
    { type: 'warmup', title: 'Medical System Vocabulary',
      script: `Today we're going deeper into medical English! Beyond basic doctor visits, you need to understand the healthcare system — insurance, specialists, pharmacy, and emergency care. Let me teach you the essential terms.`,
      examples: ["insurance — 보험", "copay — 본인부담금", "deductible — 공제액", "prescription — 처방전", "pharmacy — 약국", "specialist — 전문의", "referral — (전문의) 의뢰서", "lab work / blood test — 혈액검사", "X-ray / MRI / CT scan — 엑스레이 / MRI / CT", "allergic reaction — 알레르기 반응", "side effects — 부작용", "dosage — 복용량", "follow-up appointment — 추적 진료"],
      practice: "Have you ever visited a doctor in an English-speaking country?",
      vocab: ["insurance", "copay", "prescription", "specialist", "referral", "lab work", "side effects", "dosage"] },
    { type: 'core', title: 'Specialist Visits & Medical History',
      script: `When you see a specialist, they ask detailed questions about your medical history. Let me teach you how to explain your symptoms in detail and understand the doctor's instructions.`,
      examples: ["I've been referred to you by Dr. Smith. — Smith 선생님이 의뢰해주셨습니다", "I've been experiencing chest pain for two weeks. — 2주간 가슴 통증이 있었습니다", "The pain comes and goes. — 통증이 왔다 갔다 합니다", "It gets worse when I exercise. — 운동할 때 더 심해집니다", "I'm allergic to penicillin. — 페니실린에 알레르기가 있습니다", "I'm currently taking medication for high blood pressure. — 현재 고혈압 약을 복용 중입니다", "Is there a family history of heart disease? — 심장병 가족력이 있나요?", "We need to run some tests. — 몇 가지 검사를 해야 합니다"],
      practice: "Describe a symptom: 'I've been experiencing ___ for ___.'",
      vocab: ["referred", "experiencing", "comes and goes", "gets worse", "allergic", "medication", "family history", "run tests"] },
    { type: 'core', title: 'Pharmacy & Insurance',
      script: `After seeing the doctor, you often need to visit the pharmacy and deal with insurance. Let me teach you the important phrases for these situations.`,
      examples: ["At the pharmacy:", "I'd like to fill this prescription. — 이 처방전을 조제해주세요", "How often should I take this? — 얼마나 자주 복용해야 하나요?", "Take two tablets twice a day with food. — 하루 2번 식사와 함께 2알 복용하세요", "Are there any side effects? — 부작용이 있나요?", "Is there a generic version available? — 제네릭(복제약)이 있나요?", "Insurance:", "Does my insurance cover this procedure? — 이 시술이 보험 적용되나요?", "What's my copay for this visit? — 이번 진료의 본인부담금이 얼마인가요?", "I need a pre-authorization from my insurance. — 보험사의 사전 승인이 필요합니다", "The doctor said I need a referral. — 의사가 의뢰서가 필요하다고 했습니다"],
      practice: "At the pharmacy: 'I'd like to fill this prescription. How often should I take it?'",
      vocab: ["fill prescription", "tablets", "twice a day", "side effects", "generic", "cover", "copay", "pre-authorization"] },
    { type: 'practice', title: 'Role Play: Medical Scenarios',
      script: `Let's role play different medical scenarios! I'll play different roles — doctor, pharmacist, insurance agent. Practice explaining symptoms and understanding instructions.`,
      examples: ["Scenario 1: Visit a specialist for recurring headaches.", "Scenario 2: Fill a prescription at the pharmacy and ask about side effects.", "Scenario 3: Call your insurance to check if a procedure is covered.", "Scenario 4: Schedule a follow-up appointment."],
      practice: "You're visiting a neurologist for headaches. 'Good morning! I'm Dr. Park. What brings you in today?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Excellent medical English! We covered specialist visits, pharmacy, and insurance. Quiz time!`,
      examples: ["Quiz 1: How do you say 처방전을 조제해주세요? (Answer: I'd like to fill this prescription.)", "Quiz 2: 'Take two tablets ___ a day ___ food.' (Answer: twice / with)", "Quiz 3: What's a 'referral'? (Answer: 전문의 의뢰서)", "Quiz 4: How do you ask about insurance coverage? (Answer: Does my insurance cover this?)", "Quiz 5: Describe a symptom using: 'I've been experiencing...'"] }
  ]);

  // ===== L6-04: Cars & Auto Services =====
  addLesson('L6-04', 6, 4, 'Cars & Auto Services', 'Handle car-related situations including repairs, rentals, and accidents', 'Describing problems (There\'s a... / It makes a...)', [
    { type: 'warmup', title: 'Car Vocabulary',
      script: `Today we're learning car-related English! Knowing how to describe car problems, talk to mechanics, and handle rental situations is very practical. Let me teach you the essential vocabulary.`,
      examples: ["engine — 엔진", "tire — 타이어", "brake — 브레이크", "battery — 배터리", "oil change — 오일 교환", "flat tire — 펑크", "windshield — 앞유리", "dashboard — 계기판", "check engine light — 엔진 경고등", "mileage — 주행거리", "gas station — 주유소", "mechanic — 정비사", "tow truck — 견인차", "transmission — 변속기"],
      practice: "Do you drive? Have you ever had car trouble?",
      vocab: ["engine", "tire", "brake", "battery", "oil change", "flat tire", "mechanic", "tow truck"] },
    { type: 'core', title: 'At the Auto Shop',
      script: `When your car has a problem, you need to describe it clearly to the mechanic. We use phrases like "It makes a strange noise" or "There's a warning light on." Let me teach you the essential phrases.`,
      examples: ["My car won't start. — 차가 시동이 안 걸려요", "The engine makes a strange noise. — 엔진에서 이상한 소리가 나요", "There's a warning light on the dashboard. — 계기판에 경고등이 켜져 있어요", "The brakes feel soft / squeaky. — 브레이크가 부드러워요 / 삐걱거려요", "I think I need an oil change. — 오일 교환이 필요한 것 같아요", "How much will the repair cost? — 수리비가 얼마나 될까요?", "How long will it take? — 얼마나 걸릴까요?", "Is it safe to drive like this? — 이 상태로 운전해도 안전한가요?"],
      practice: "Describe a car problem: 'My car ___. It makes a ___.'",
      vocab: ["won't start", "strange noise", "warning light", "brakes", "oil change", "repair", "cost", "safe"] },
    { type: 'core', title: 'Car Rentals & Gas Stations',
      script: `Renting a car and using gas stations are common travel needs. Let me teach you the phrases for smooth car rental and refueling.`,
      examples: ["Renting:", "I'd like to rent a car for three days. — 3일간 차를 렌트하고 싶습니다", "Do you have any compact / SUV options? — 소형차 / SUV 있나요?", "Is insurance included? — 보험이 포함되어 있나요?", "What's the mileage limit? — 주행거리 제한이 있나요?", "Where do I return the car? — 차를 어디에 반납하나요?", "Gas station:", "Fill it up, please. — 가득 채워주세요", "I need $30 of regular / premium. — 레귤러/프리미엄 30달러 주세요", "Which pump number? — 몇 번 주유기요?", "Where's the nearest gas station? — 가장 가까운 주유소가 어디예요?"],
      practice: "Rent a car: 'I'd like to rent a ___ for ___.'",
      vocab: ["rent", "compact", "SUV", "insurance included", "mileage limit", "return", "fill up", "regular", "premium"] },
    { type: 'practice', title: 'Role Play: Car Situations',
      script: `Let's role play different car situations! I'll play the mechanic, rental agent, or tow truck operator.`,
      examples: ["Scenario 1: Your car won't start — call a tow truck.", "Scenario 2: Take your car to the mechanic for a strange noise.", "Scenario 3: Rent a car at the airport.", "Scenario 4: You got a flat tire — call roadside assistance."],
      practice: "Your car won't start this morning. Call me (the mechanic): 'Hi, I'm having a problem with my car...'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great car English! We covered auto shop communication, rentals, and emergency situations. Quiz time!`,
      examples: ["Quiz 1: How do you say 시동이 안 걸려요? (Answer: My car won't start.)", "Quiz 2: 'The engine makes a ___ noise.' (Answer: strange)", "Quiz 3: How do you ask about repair cost? (Answer: How much will the repair cost?)", "Quiz 4: 'Fill it ___, please.' (Answer: up)", "Quiz 5: Describe a car problem to a mechanic using 'There's a...' or 'It makes a...'"] }
  ]);

  // ===== L6-05: Airport & Immigration =====
  addLesson('L6-05', 6, 5, 'Airport & Immigration', 'Navigate airports, customs, and immigration smoothly', 'Will for quick decisions, Present simple for schedules', [
    { type: 'warmup', title: 'Airport & Immigration Vocabulary',
      script: `Today we're learning detailed airport and immigration English! Going beyond basic travel, we'll cover customs, immigration interviews, and problem situations. These phrases can save you a lot of stress!`,
      examples: ["customs — 세관", "immigration / passport control — 출입국심사", "declaration form — 신고서", "visa — 비자", "connecting flight — 환승편", "layover — 경유 대기", "baggage claim — 수하물 찾는 곳", "carry-on — 기내 수하물", "checked bag — 위탁 수하물", "boarding pass — 탑승권", "gate change — 게이트 변경", "delayed / cancelled — 지연 / 취소", "duty-free — 면세"],
      practice: "How often do you travel internationally?",
      vocab: ["customs", "immigration", "declaration", "connecting flight", "layover", "baggage claim", "carry-on", "duty-free"] },
    { type: 'core', title: 'Immigration & Customs Questions',
      script: `Immigration officers ask specific questions. Being prepared helps you stay calm and answer clearly. Let me teach you the most common questions and how to answer them confidently.`,
      examples: ["What's the purpose of your visit? — Business / Tourism / Visiting family.", "How long will you be staying? — I'll be here for two weeks.", "Where will you be staying? — I'll be staying at the Hilton Hotel.", "Do you have a return ticket? — Yes, I'm flying back on March 30th.", "Do you have anything to declare? — No, nothing to declare. / Yes, I have some gifts.", "How much currency are you carrying? — About $3,000 in cash.", "Who are you traveling with? — I'm traveling alone / with my family.", "What do you do for a living? — I'm a software engineer."],
      practice: "Answer this: 'What's the purpose of your visit and how long will you be staying?'",
      vocab: ["purpose", "visit", "staying", "return ticket", "declare", "currency", "traveling with"] },
    { type: 'core', title: 'Handling Airport Problems',
      script: `Things go wrong at airports all the time — delayed flights, lost luggage, missed connections. Let me teach you how to handle these stressful situations calmly.`,
      examples: ["Delayed/cancelled flight:", "My flight has been delayed. When is the next available flight?", "Can I get rebooked on another airline?", "Am I entitled to compensation for the delay?", "Lost luggage:", "My luggage didn't arrive. I'd like to file a lost baggage report.", "Here's my baggage claim tag.", "Can you deliver it to my hotel when it arrives?", "Missed connection:", "I missed my connecting flight because of the delay.", "Can you help me get on the next flight to London?", "I need accommodation if there's an overnight layover."],
      practice: "Your luggage is lost. Report it: 'Excuse me, my luggage didn't arrive...'",
      vocab: ["delayed", "rebooked", "compensation", "file a report", "baggage claim tag", "deliver", "missed connection", "accommodation"] },
    { type: 'practice', title: 'Role Play: Airport Scenarios',
      script: `Let's practice airport scenarios! I'll play different airport staff. Handle each situation confidently.`,
      examples: ["Scenario 1: Go through immigration — answer the officer's questions.", "Scenario 2: Your flight is cancelled — talk to the airline desk.", "Scenario 3: Your luggage is missing — file a report.", "Scenario 4: You need to change your seat — ask at the gate."],
      practice: "You've landed and you're at passport control. 'Next please. Passport, please. What's the purpose of your visit?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Excellent airport English! We covered immigration, customs, and problem situations. Quiz time!`,
      examples: ["Quiz 1: 'What's the ___ of your visit?' (Answer: purpose)", "Quiz 2: How do you report lost luggage? (Answer: My luggage didn't arrive. I'd like to file a lost baggage report.)", "Quiz 3: 'Do you have anything to ___?' (Answer: declare)", "Quiz 4: 'I ___ my connecting flight.' (Answer: missed)", "Quiz 5: Answer: 'How long will you be staying?'"] }
  ]);

  // ===== L6-06: Emergency Situations =====
  addLesson('L6-06', 6, 6, 'Emergency Situations', 'Handle emergencies including 911 calls, accidents, and urgent situations', 'Imperative for urgent instructions, Need to / Have to for urgency', [
    { type: 'warmup', title: 'Emergency Vocabulary',
      script: `Today we're learning emergency English! Knowing what to say in an emergency can literally save lives. In the US, you call 911. In the UK, it's 999. Let me teach you the critical vocabulary.`,
      examples: ["emergency — 응급상황", "ambulance — 구급차", "fire department — 소방서", "police — 경찰", "accident — 사고", "injury — 부상", "bleeding — 출혈", "unconscious — 의식 없는", "CPR — 심폐소생술", "first aid — 응급처치", "fire extinguisher — 소화기", "evacuation — 대피", "theft — 절도", "witness — 목격자"],
      practice: "Have you ever had to call emergency services? What happened?",
      vocab: ["emergency", "ambulance", "accident", "injury", "bleeding", "unconscious", "first aid", "evacuation"] },
    { type: 'core', title: 'Calling Emergency Services',
      script: `When you call 911, the operator will ask specific questions. You need to stay calm, give your location, and describe the situation clearly. Let me teach you exactly what to say.`,
      examples: ["911 call structure:", "Operator: 911, what's your emergency?", "I need an ambulance. Someone collapsed on the street.", "I'd like to report a car accident.", "There's a fire in my building.", "Key information to give:", "My location is 123 Main Street. — 제 위치는 메인스트리트 123번지입니다", "A man is lying on the ground and he's not breathing. — 한 남자가 바닥에 쓰러져 있고 숨을 쉬지 않습니다", "There are two cars involved. One person is injured. — 차 두 대가 관련되어 있고 한 명이 다쳤습니다", "Please send help immediately. — 즉시 도움을 보내주세요", "I'll stay on the line. — 전화 끊지 않고 대기하겠습니다"],
      practice: "Call 911: Describe a car accident you witnessed.",
      vocab: ["collapsed", "report", "location", "not breathing", "involved", "injured", "immediately", "stay on the line"] },
    { type: 'core', title: 'Accident Reports & Police',
      script: `After an accident or crime, you may need to talk to police or file a report. Let me teach you the phrases for reporting incidents clearly.`,
      examples: ["Reporting an accident:", "I was involved in a car accident. — 교통사고를 당했습니다", "The other driver ran a red light. — 상대 운전자가 신호를 무시했습니다", "I'd like to file a police report. — 경찰 보고서를 작성하고 싶습니다", "Here's my driver's license and insurance. — 면허증과 보험증이요", "Reporting a crime:", "My wallet was stolen. — 지갑을 도난당했습니다", "Someone broke into my car. — 누군가 내 차를 침입했습니다", "I saw the person who did it. — 범인을 봤습니다", "It happened about 30 minutes ago near the park. — 약 30분 전에 공원 근처에서 일어났습니다"],
      practice: "Report to police: 'I'd like to report... It happened...'",
      vocab: ["involved", "ran a red light", "file a report", "driver's license", "stolen", "broke into", "happened"] },
    { type: 'practice', title: 'Role Play: Emergency Scenarios',
      script: `Let's practice emergency scenarios! Stay calm and communicate clearly. I'll play the 911 operator, police officer, or bystander.`,
      examples: ["Scenario 1: Call 911 — someone fell and hit their head.", "Scenario 2: Report a fender-bender accident to police.", "Scenario 3: Your hotel room was burglarized — report to the front desk.", "Scenario 4: You witness someone choking — describe the situation."],
      practice: "911, what's your emergency?" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Vital emergency English skills! We covered 911 calls, accident reports, and police communication. Quiz time!`,
      examples: ["Quiz 1: What number do you call for emergencies in the US? (Answer: 911)", "Quiz 2: 'I need an ___. Someone collapsed.' (Answer: ambulance)", "Quiz 3: How do you report a stolen wallet? (Answer: My wallet was stolen.)", "Quiz 4: What's the first thing to tell 911? (Answer: Your location and what happened)", "Quiz 5: 'I'd like to ___ a police report.' (Answer: file)"] }
  ]);

  // ===== L6-07: Online Shopping & Delivery =====
  addLesson('L6-07', 6, 7, 'Online Shopping & Delivery', 'Shop online, handle returns, and deal with delivery issues', 'Present perfect for order status (has been shipped), Complaint structures', [
    { type: 'warmup', title: 'Online Shopping Vocabulary',
      script: `Today we're learning online shopping English! Shopping online has become part of daily life, and you need to know how to handle orders, returns, and customer service in English. Let me teach you the key vocabulary.`,
      examples: ["add to cart — 장바구니에 담기", "checkout — 결제하기", "promo code / coupon — 프로모 코드 / 쿠폰", "shipping — 배송", "tracking number — 송장번호", "estimated delivery — 배송 예정일", "out of stock — 품절", "return / exchange — 반품 / 교환", "refund — 환불", "review / rating — 리뷰 / 평점", "subscription — 구독", "free shipping — 무료 배송", "warranty — 보증"],
      practice: "What do you buy online most? Clothes, electronics, groceries?",
      vocab: ["add to cart", "checkout", "shipping", "tracking number", "out of stock", "return", "refund", "warranty"] },
    { type: 'core', title: 'Placing Orders & Tracking',
      script: `Let me teach you the phrases for the full online shopping cycle — from ordering to tracking your package.`,
      examples: ["Ordering:", "I'd like to place an order for... — ~을 주문하고 싶습니다", "Do you ship internationally? — 해외 배송되나요?", "How long does shipping take? — 배송이 얼마나 걸리나요?", "Is there a discount code for first-time buyers? — 신규 고객 할인 코드가 있나요?", "Tracking:", "My order number is #A12345. — 주문번호는 #A12345입니다", "Where is my package? It hasn't arrived yet. — 택배가 어디 있나요? 아직 도착하지 않았어요", "The tracking says it was delivered, but I didn't receive it. — 배송완료라고 되어있는데 받지 못했어요", "Your order has been shipped and is expected to arrive by Friday. — 주문이 발송되었으며 금요일까지 도착 예정입니다"],
      practice: "Track your order: 'My order number is ___. It hasn't arrived yet.'",
      vocab: ["place an order", "ship", "shipping", "discount code", "package", "tracking", "delivered", "expected"] },
    { type: 'core', title: 'Returns, Refunds & Complaints',
      script: `Sometimes things go wrong with online orders. Let me teach you how to handle returns, request refunds, and make complaints effectively.`,
      examples: ["Requesting a return:", "I'd like to return this item. It doesn't fit. — 이 제품을 반품하고 싶습니다. 맞지 않아요", "What's your return policy? — 반품 정책이 어떻게 되나요?", "Can I get a prepaid return label? — 선불 반품 라벨을 받을 수 있나요?", "Requesting a refund:", "I'd like a full refund, please. — 전액 환불을 요청합니다", "The product arrived damaged. — 제품이 파손되어 도착했습니다", "I received the wrong item. — 잘못된 제품을 받았습니다", "Making a complaint:", "I've been waiting for my order for 3 weeks. This is unacceptable.", "I'd like to speak to a supervisor. — 관리자와 통화하고 싶습니다", "I expect either a replacement or a full refund. — 교체 또는 전액 환불을 기대합니다"],
      practice: "Your order arrived damaged. Contact support: 'I'd like to report...'",
      vocab: ["return", "fit", "return policy", "prepaid label", "full refund", "damaged", "wrong item", "replacement"] },
    { type: 'practice', title: 'Role Play: Customer Support Chat',
      script: `Let's practice online shopping scenarios! I'll be the customer support agent. Handle common issues.`,
      examples: ["Scenario 1: Your order is 2 weeks late — inquire about the status.", "Scenario 2: You received the wrong size — request an exchange.", "Scenario 3: A product arrived broken — request a refund.", "Scenario 4: You want to cancel an order before it ships."],
      practice: "Chat with support: 'Hi, I have an issue with my recent order #A12345...'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great online shopping skills! We covered ordering, tracking, returns, and complaints. Quiz time!`,
      examples: ["Quiz 1: 'Your order ___ ___ shipped.' (Answer: has been)", "Quiz 2: How do you ask about returns? (Answer: What's your return policy?)", "Quiz 3: 'The product arrived ___.' (Answer: damaged)", "Quiz 4: How do you request a refund? (Answer: I'd like a full refund, please.)", "Quiz 5: 'I received the ___ item.' (Answer: wrong)"] }
  ]);

  // ===== L6-08: Moving & Settling In =====
  addLesson('L6-08', 6, 8, 'Moving & Settling In', 'Handle moving to a new area and setting up essential services', 'Going to for planned actions, Need to for necessities', [
    { type: 'warmup', title: 'Moving & Setup Vocabulary',
      script: `Today we're learning about moving and settling into a new place! Whether you're moving to a new city or a new country, there are many practical tasks that require English. Let me teach you the essential vocabulary.`,
      examples: ["moving company — 이사업체", "packing / unpacking — 짐 싸기 / 풀기", "forwarding address — 우편물 전달 주소", "set up utilities — 공과금 개설", "internet service provider (ISP) — 인터넷 서비스 제공업체", "register / sign up — 등록하다", "neighborhood — 동네", "commute — 통근", "grocery store — 식료품점", "laundromat — 코인세탁소", "community center — 주민센터", "driver's license — 운전면허증", "resident registration — 주민등록"],
      practice: "Have you ever moved to a new city or country? What was the hardest part?",
      vocab: ["moving company", "forwarding address", "set up", "utilities", "register", "neighborhood", "commute", "laundromat"] },
    { type: 'core', title: 'Setting Up Essential Services',
      script: `When you move somewhere new, you need to set up electricity, gas, water, internet, and more. Let me teach you how to call these companies and set up services.`,
      examples: ["I'd like to set up electricity service at my new address. — 새 주소로 전기를 개통하고 싶습니다", "I'm moving to 456 Oak Street on April 1st. — 4월 1일에 오크 스트리트 456번지로 이사합니다", "What plans do you have for internet service? — 인터넷 요금제가 어떻게 되나요?", "I need to set up a new phone line. — 새 전화선을 개통해야 합니다", "Can I schedule the installation for Saturday? — 설치를 토요일로 잡을 수 있나요?", "I need to change my address for mail forwarding. — 우편물 전달을 위해 주소를 변경해야 합니다", "Where do I register for garbage collection? — 쓰레기 수거는 어디서 신청하나요?", "I'd like to cancel the service at my old address. — 이전 주소의 서비스를 해지하고 싶습니다"],
      practice: "Call to set up internet: 'Hi, I'd like to set up internet service at...'",
      vocab: ["set up", "service", "address", "plans", "installation", "schedule", "change address", "cancel"] },
    { type: 'core', title: 'Exploring Your New Neighborhood',
      script: `After moving, you need to learn about your new neighborhood. Let me teach you how to ask neighbors, find local services, and get settled in.`,
      examples: ["Meeting neighbors:", "Hi, I just moved in next door. I'm [name]. — 안녕하세요, 옆집에 방금 이사 온 [이름]입니다", "Do you know a good restaurant around here? — 이 근처에 맛집 아시나요?", "Is there a grocery store within walking distance? — 걸어갈 수 있는 거리에 식료품점이 있나요?", "Finding services:", "Where's the nearest post office? — 가장 가까운 우체국이 어디예요?", "I'm looking for a good dentist in the area. — 이 지역에서 좋은 치과를 찾고 있어요", "How do I get to the subway from here? — 여기서 지하철까지 어떻게 가나요?", "Is this area safe at night? — 이 지역이 밤에 안전한가요?", "What day is garbage collection? — 쓰레기 수거일이 며칠이에요?"],
      practice: "Introduce yourself to a neighbor: 'Hi, I just moved in...'",
      vocab: ["moved in", "next door", "around here", "walking distance", "nearest", "in the area", "safe", "garbage collection"] },
    { type: 'practice', title: 'Role Play: New Resident',
      script: `Let's practice settling-in scenarios! I'll play your neighbor, the internet company agent, or the building manager.`,
      examples: ["Scenario 1: Introduce yourself to your new neighbor and ask about the area.", "Scenario 2: Call the internet company to set up Wi-Fi.", "Scenario 3: Ask the building manager about rules (parking, laundry, quiet hours).", "Scenario 4: Visit the local government office to register your new address."],
      practice: "You just moved in. I'm your neighbor. *knock knock* 'Oh, hello! Are you the new neighbor?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great settling-in skills! We covered setting up services, meeting neighbors, and exploring your neighborhood. Quiz time!`,
      examples: ["Quiz 1: 'I'd like to ___ ___ electricity at my new address.' (Answer: set up)", "Quiz 2: How do you introduce yourself to a neighbor? (Answer: Hi, I just moved in next door. I'm [name].)", "Quiz 3: 'Is there a grocery store within ___ distance?' (Answer: walking)", "Quiz 4: How do you ask about internet plans? (Answer: What plans do you have for internet service?)", "Quiz 5: 'I need to ___ my address for mail forwarding.' (Answer: change)"] }
  ]);

});

seed();

console.log('Curriculum expansion 2 complete!');
console.log('Added:');
console.log('  L5-06: Reports & Documentation');
console.log('  L5-07: Customer Relations');
console.log('  L5-08: Leadership & Management');
console.log('  --- New Level 6: Real-Life English ---');
console.log('  L6-01: Banking & Finance');
console.log('  L6-02: Housing & Real Estate');
console.log('  L6-03: Medical English (Advanced)');
console.log('  L6-04: Cars & Auto Services');
console.log('  L6-05: Airport & Immigration');
console.log('  L6-06: Emergency Situations');
console.log('  L6-07: Online Shopping & Delivery');
console.log('  L6-08: Moving & Settling In');

// Verify
const total = db.prepare('SELECT COUNT(*) as cnt FROM lessons').get();
const sections = db.prepare('SELECT COUNT(*) as cnt FROM sections').get();
const levelStats = db.prepare('SELECT lv.title, COUNT(l.id) as cnt FROM levels lv LEFT JOIN lessons l ON lv.id = l.level_id GROUP BY lv.id ORDER BY lv.id').all();
console.log(`\nTotal: ${total.cnt} lessons, ${sections.cnt} sections`);
for (const lv of levelStats) {
  console.log(`  ${lv.title}: ${lv.cnt} lessons`);
}

db.close();
