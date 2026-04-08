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
  // L3 Intermediate (B1) — 4 new lessons
  // =============================================

  // ===== L3-05: Emotions & Feelings =====
  addLesson('L3-05', 3, 5, 'Emotions & Feelings', 'Express emotions and respond to others\' feelings', 'Present perfect for emotional states, Adjectives with -ed/-ing', [
    { type: 'warmup', title: 'Emotion Vocabulary',
      script: `Today we're going to learn how to express our emotions in English! Being able to talk about feelings is essential for meaningful conversations. Let me teach you some important emotion words first.`,
      examples: ["excited — 신나는", "frustrated — 답답한/좌절한", "anxious — 불안한", "relieved — 안도하는", "disappointed — 실망한", "grateful — 감사하는", "embarrassed — 당황한", "overwhelmed — 압도당한", "confident — 자신감 있는", "jealous — 질투하는", "lonely — 외로운", "proud — 자랑스러운"],
      practice: "How are you feeling right now? Try using one of these words!",
      vocab: ["excited", "frustrated", "anxious", "relieved", "disappointed", "grateful", "embarrassed", "overwhelmed"] },
    { type: 'core', title: '-ed vs -ing Adjectives',
      script: `In English, many emotion words have two forms: -ed and -ing. This is very important! The -ed form describes how YOU feel. The -ing form describes what CAUSES the feeling. For example: "I am bored" means you feel boredom. "The movie is boring" means the movie causes boredom.`,
      examples: ["I'm excited. / The news is exciting. — 나는 신난다 / 그 뉴스는 신나게 한다", "I'm bored. / The class is boring. — 나는 지루하다 / 수업이 지루하다", "I'm confused. / The instructions are confusing. — 나는 혼란스럽다 / 설명이 혼란스럽다", "I'm interested. / The book is interesting. — 나는 관심이 있다 / 그 책은 흥미롭다", "I'm surprised. / The result is surprising. — 나는 놀랐다 / 결과가 놀랍다", "I'm tired. / The work is tiring. — 나는 피곤하다 / 일이 피곤하게 한다"],
      practice: "Try making a sentence: 'I am ___(ed). The ___ is ___(ing).'",
      vocab: ["bored/boring", "excited/exciting", "confused/confusing", "interested/interesting", "surprised/surprising", "tired/tiring"] },
    { type: 'core', title: 'Expressing & Responding to Feelings',
      script: `Now let me teach you how to express your feelings in conversation and how to respond when someone shares their feelings. Showing empathy is very important in English!`,
      examples: ["I've been feeling stressed lately. — 요즘 스트레스를 많이 받고 있어", "I'm so happy about the promotion! — 승진해서 너무 기뻐!", "I've been a bit down recently. — 최근에 좀 우울했어", "Responding with empathy:", "I'm sorry to hear that. — 그렇다니 유감이야", "That must be really tough. — 정말 힘들겠다", "I'm so happy for you! — 정말 기쁘다!", "I totally understand how you feel. — 네 기분 완전히 이해해", "Is there anything I can do to help? — 내가 도울 수 있는 거 있어?"],
      practice: "Tell me how you've been feeling this week. I'll respond with empathy!",
      vocab: ["stressed", "happy", "down", "tough", "understand", "empathy"] },
    { type: 'practice', title: 'Emotional Conversation',
      script: `Let's have a real conversation about feelings! I'll share something and ask about your feelings too. Use the emotion vocabulary and empathy phrases we learned.`,
      examples: ["Example conversation:", "A: How have you been lately?", "B: To be honest, I've been feeling a bit anxious about my exam.", "A: I totally understand. That must be stressful. When is the exam?", "B: It's next week. I'm trying to stay positive.", "A: I'm sure you'll do great! You've been working hard."],
      practice: "Let's start: How have you been feeling lately? Tell me honestly!" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great job expressing your emotions today! We learned emotion vocabulary, the -ed/-ing difference, and how to show empathy. Quiz time!`,
      examples: ["Quiz 1: 'The movie was ___.' (bored/boring) (Answer: boring)", "Quiz 2: How do you respond when someone is sad? (Answer: I'm sorry to hear that / That must be tough)", "Quiz 3: 'I've been feeling ___ lately.' — Fill in with an emotion", "Quiz 4: 'She is ___ about the trip.' (excited/exciting) (Answer: excited)", "Quiz 5: What's the difference between 'I'm interested' and 'It's interesting'?"] }
  ]);

  // ===== L3-06: Movies, Music & Entertainment =====
  addLesson('L3-06', 3, 6, 'Movies, Music & Entertainment', 'Discuss movies, music, and entertainment preferences', 'Relative clauses (who/which/that), Giving recommendations', [
    { type: 'warmup', title: 'Entertainment Vocabulary',
      script: `Today we're going to learn how to talk about movies, music, and entertainment! This is one of the best conversation topics because everyone loves entertainment. Let me teach you the key vocabulary.`,
      examples: ["genre — 장르 (action, comedy, drama, horror, sci-fi, romance, thriller)", "plot — 줄거리", "character — 등장인물", "director — 감독", "soundtrack — 사운드트랙/OST", "sequel — 속편", "lyrics — 가사", "concert — 콘서트", "streaming — 스트리밍 (Netflix, YouTube)", "binge-watch — 몰아보기", "catchy — (노래가) 중독성 있는", "blockbuster — 블록버스터/대작"],
      practice: "What kind of movies or music do you like? Just name a genre!",
      vocab: ["genre", "plot", "character", "director", "soundtrack", "lyrics", "streaming", "binge-watch"] },
    { type: 'core', title: 'Talking About Movies & Shows',
      script: `Let me teach you how to talk about movies and TV shows using relative clauses. Relative clauses use "who," "which," or "that" to add details. For example: "It's a movie THAT made me cry." "She's the actress WHO played the main character."`,
      examples: ["It's a movie that made me cry. — 나를 울린 영화야", "He's the actor who played the villain. — 악역을 맡은 배우야", "It's a show which has 5 seasons. — 시즌 5까지 있는 드라마야", "The plot is about a man who discovers a secret. — 비밀을 발견하는 남자 이야기야", "I recommend this movie. It's really worth watching. — 이 영화 추천해. 볼 만해", "I binge-watched the whole series in one weekend. — 주말 동안 시리즈를 다 몰아봤어", "The ending was unexpected! — 결말이 예상 밖이었어!"],
      practice: "Tell me about a movie you watched recently. Use: 'It's a movie that...'",
      vocab: ["that", "who", "which", "recommend", "worth watching", "ending"] },
    { type: 'core', title: 'Talking About Music & Concerts',
      script: `Now let's talk about music! Music is a universal topic. Let me teach you phrases for discussing your music taste and experiences.`,
      examples: ["What kind of music are you into? — 어떤 음악 좋아해?", "I'm really into K-pop / rock / jazz. — 나는 케이팝/록/재즈에 빠져 있어", "This song has been stuck in my head all day. — 이 노래가 하루 종일 머릿속에 맴돌아", "The lyrics are so meaningful. — 가사가 정말 의미 있어", "Have you been to any concerts lately? — 최근에 콘서트 갔었어?", "The live performance was amazing! — 라이브 공연이 굉장했어!", "I listen to music when I'm commuting. — 출퇴근할 때 음악 들어", "Can you recommend a good playlist? — 좋은 플레이리스트 추천해줄 수 있어?"],
      practice: "What music are you into? Tell me about a song you love!",
      vocab: ["into", "stuck in my head", "lyrics", "meaningful", "live performance", "playlist"] },
    { type: 'practice', title: 'Entertainment Recommendations',
      script: `Let's practice recommending entertainment to each other! I'll ask for recommendations and also give you some. Use relative clauses and recommendation phrases.`,
      examples: ["Recommending:", "You should watch ___. It's a movie that ___.", "I highly recommend ___. The plot is about ___.", "If you like ___, you'll love ___.", "Asking:", "What would you recommend?", "Is there anything good on Netflix right now?", "What's a song that always cheers you up?"],
      practice: "Can you recommend a movie or show to me? Tell me what it's about!" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Awesome! We learned entertainment vocabulary, relative clauses, and how to give recommendations. Quiz time!`,
      examples: ["Quiz 1: Complete: 'It's a movie ___ made me laugh.' (who/that) (Answer: that)", "Quiz 2: How do you say 몰아보기 in English? (Answer: binge-watch)", "Quiz 3: 'This song has been ___ in my head.' (Answer: stuck)", "Quiz 4: Complete: 'He's the singer ___ wrote this song.' (who/which) (Answer: who)", "Quiz 5: Recommend me a movie using: 'You should watch ___ because...'"] }
  ]);

  // ===== L3-07: Environment & Nature =====
  addLesson('L3-07', 3, 7, 'Environment & Nature', 'Discuss environmental issues and nature', 'Modal verbs for obligation (should/must/have to), First conditional for consequences', [
    { type: 'warmup', title: 'Environment Vocabulary',
      script: `Today we're going to learn how to talk about the environment and nature in English! Environmental topics come up a lot in modern conversations. Let me teach you the key words.`,
      examples: ["pollution — 오염", "climate change — 기후 변화", "global warming — 지구 온난화", "recycle — 재활용하다", "renewable energy — 재생 에너지", "carbon footprint — 탄소 발자국", "deforestation — 산림 벌채", "endangered species — 멸종 위기종", "sustainable — 지속 가능한", "eco-friendly — 친환경적인", "waste — 쓰레기/낭비", "drought — 가뭄"],
      practice: "Do you recycle at home? What do you recycle?",
      vocab: ["pollution", "climate change", "recycle", "renewable energy", "sustainable", "eco-friendly", "waste", "endangered"] },
    { type: 'core', title: 'Talking About Environmental Problems',
      script: `Let me teach you how to discuss environmental problems using modal verbs. We use "should" for advice, "must/have to" for strong obligation, and "shouldn't" for things we need to stop doing.`,
      examples: ["We should recycle more. — 우리는 더 재활용해야 해", "We must reduce carbon emissions. — 우리는 탄소 배출을 줄여야 해", "People have to use less plastic. — 사람들은 플라스틱을 줄여야 해", "We shouldn't waste water. — 물을 낭비하면 안 돼", "Air pollution is getting worse every year. — 대기 오염이 매년 악화되고 있어", "If we don't act now, the problem will get worse. — 지금 행동하지 않으면 문제가 악화될 거야", "Many animals are losing their habitats. — 많은 동물들이 서식지를 잃고 있어"],
      practice: "What environmental problem concerns you the most? Use 'I think we should...'",
      vocab: ["should", "must", "have to", "reduce", "emissions", "plastic", "habitat"] },
    { type: 'core', title: 'Solutions & Taking Action',
      script: `Now let's talk about solutions! We use the first conditional to talk about consequences: "If we do X, Y will happen." This is great for discussing environmental actions.`,
      examples: ["If we plant more trees, the air will be cleaner. — 나무를 더 심으면 공기가 깨끗해질 거야", "If we use public transport, we'll reduce pollution. — 대중교통을 이용하면 오염을 줄일 수 있어", "If everyone recycles, we'll produce less waste. — 모두가 재활용하면 쓰레기가 줄어들 거야", "Solar energy is becoming cheaper every year. — 태양 에너지가 매년 저렴해지고 있어", "I try to use reusable bags instead of plastic. — 비닐 대신 재사용 가방을 쓰려고 해", "Small changes can make a big difference. — 작은 변화가 큰 차이를 만들 수 있어"],
      practice: "Tell me one thing you do to help the environment. Start with 'I try to...'",
      vocab: ["plant", "public transport", "solar energy", "reusable", "instead of", "difference"] },
    { type: 'practice', title: 'Environmental Discussion',
      script: `Let's have a discussion about the environment! I'll bring up topics and we'll exchange ideas about problems and solutions.`,
      examples: ["Discussion starters:", "What do you think is the biggest environmental problem?", "Do you think individuals or governments should take more responsibility?", "How has the weather changed in your country over the years?", "What eco-friendly habits do you have?", "Do you think electric cars will replace regular cars?"],
      practice: "Let's discuss: What do you think is the biggest environmental problem today?" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Excellent discussion! We learned environment vocabulary, modal verbs for obligation, and first conditional for consequences. Quiz time!`,
      examples: ["Quiz 1: 'We ___ recycle more.' (should/would) (Answer: should)", "Quiz 2: 'If we plant trees, the air ___ cleaner.' (Answer: will be)", "Quiz 3: What does 'sustainable' mean? (Answer: 지속 가능한)", "Quiz 4: 'We ___ waste water.' (should/shouldn't) (Answer: shouldn't)", "Quiz 5: Name 3 eco-friendly actions in English."] }
  ]);

  // ===== L3-08: Technology & Internet =====
  addLesson('L3-08', 3, 8, 'Technology & Internet', 'Discuss technology, apps, and digital life', 'Present perfect continuous (have been + ing), Expressing opinions about technology', [
    { type: 'warmup', title: 'Tech Vocabulary',
      script: `Today we're going to learn how to talk about technology and the internet! Technology is everywhere in our lives, so this vocabulary is very useful. Let me teach you the essential tech words.`,
      examples: ["app (application) — 앱", "download / upload — 다운로드 / 업로드", "update — 업데이트", "password — 비밀번호", "Wi-Fi — 와이파이", "social media — 소셜 미디어", "notification — 알림", "algorithm — 알고리즘", "artificial intelligence (AI) — 인공지능", "cloud storage — 클라우드 저장소", "screen time — 화면 시간", "digital detox — 디지털 디톡스"],
      practice: "What apps do you use every day?",
      vocab: ["app", "download", "upload", "update", "password", "social media", "notification", "AI"] },
    { type: 'core', title: 'Talking About Tech Habits',
      script: `Let me teach you how to talk about your technology habits using the present perfect continuous. We use "have been + verb-ing" to talk about actions that started in the past and continue now. For example: "I've been using this app for two years."`,
      examples: ["I've been using Instagram since 2020. — 2020년부터 인스타그램을 쓰고 있어", "I've been learning English with this app for 3 months. — 이 앱으로 3개월째 영어를 배우고 있어", "I've been spending too much time on my phone lately. — 요즘 핸드폰에 너무 많은 시간을 쓰고 있어", "She's been working from home since the pandemic. — 팬데믹 이후로 재택근무를 하고 있어", "How long have you been using this phone? — 이 핸드폰 얼마나 오래 쓰고 있어?", "I've been thinking about doing a digital detox. — 디지털 디톡스를 할까 생각 중이야"],
      practice: "Tell me: How long have you been using your current phone?",
      vocab: ["have been using", "since", "for", "spending time", "working from home", "digital detox"] },
    { type: 'core', title: 'Opinions on Technology',
      script: `Let's learn how to express opinions about technology. Technology has advantages and disadvantages, and it's important to discuss both sides.`,
      examples: ["I think social media is useful for staying connected. — 소셜 미디어는 연결을 유지하는 데 유용하다고 생각해", "On the other hand, it can be addictive. — 반면에 중독성이 있을 수 있어", "AI is changing the way we work. — AI가 우리의 일하는 방식을 바꾸고 있어", "I'm worried about online privacy. — 온라인 개인정보가 걱정돼", "Technology makes life more convenient. — 기술이 생활을 더 편리하게 해", "But we shouldn't depend on it too much. — 하지만 너무 의존하면 안 돼", "The biggest advantage is... / The biggest disadvantage is... — 가장 큰 장점은... / 가장 큰 단점은..."],
      practice: "What do you think about AI? Start with 'I think AI...'",
      vocab: ["useful", "addictive", "convenient", "privacy", "depend on", "advantage", "disadvantage"] },
    { type: 'practice', title: 'Tech Discussion',
      script: `Let's have a discussion about technology! I'll bring up interesting topics and we'll share our opinions. Use the phrases we learned.`,
      examples: ["Discussion topics:", "Do you think smartphones have made life better or worse?", "How much screen time do you have per day?", "Would you trust a self-driving car?", "Do you think AI will replace some jobs?", "What technology could you not live without?", "Should children have smartphones?"],
      practice: "Let's discuss: Do you think smartphones have made life better or worse?" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great tech discussion! We learned technology vocabulary, present perfect continuous, and how to express opinions. Quiz time!`,
      examples: ["Quiz 1: 'I ___ ___ using this app for 2 years.' (Answer: have been)", "Quiz 2: What does 'digital detox' mean? (Answer: 디지털 디톡스 — 디지털 기기를 쉬는 것)", "Quiz 3: 'On the ___ hand, technology can be addictive.' (Answer: other)", "Quiz 4: Name 3 advantages of technology in English.", "Quiz 5: 'How long ___ you ___ learning English?' (Answer: have / been)"] }
  ]);

  // =============================================
  // L4 Upper-Intermediate (B2) — 4 new lessons
  // =============================================

  // ===== L4-05: Business Email & Writing =====
  addLesson('L4-05', 4, 5, 'Business Email & Writing', 'Write professional emails and business correspondence', 'Formal register, Polite request structures (would/could)', [
    { type: 'warmup', title: 'Email Structure & Etiquette',
      script: `Today we're learning how to write professional emails in English! Email is the most common form of business communication. A good email is clear, polite, and well-structured. Let me show you the basic structure.`,
      examples: ["Subject line — 제목 (clear and specific)", "Greeting — 인사 (Dear Mr./Ms., Hi [Name])", "Opening line — 첫 문장 (I hope this email finds you well.)", "Body — 본문 (main message)", "Closing line — 마무리 (Please let me know if you have any questions.)", "Sign-off — 끝인사 (Best regards, / Sincerely, / Kind regards,)", "Attachment — 첨부 (Please find attached...)"],
      practice: "Have you written a business email in English before?",
      vocab: ["subject line", "greeting", "body", "sign-off", "attachment", "regards", "sincerely"] },
    { type: 'core', title: 'Polite Requests & Formal Phrases',
      script: `In business emails, we use polite and formal language. Instead of "I want," we say "I would like." Instead of "Can you," we say "Could you" or "Would you be able to." Let me teach you the most important formal phrases.`,
      examples: ["I would like to request... — ~을 요청하고 싶습니다", "Could you please send me...? — ~을 보내주시겠어요?", "Would you be able to attend the meeting? — 회의에 참석하실 수 있으신가요?", "I am writing to inform you that... — ~을 알려드리기 위해 이메일 드립니다", "I would appreciate it if you could... — ~해주시면 감사하겠습니다", "Please find attached the report. — 보고서를 첨부합니다", "I look forward to hearing from you. — 답변 기다리겠습니다", "Thank you for your prompt response. — 신속한 답변 감사합니다"],
      practice: "Try writing a polite request: 'Could you please...'",
      vocab: ["would like", "could you", "would appreciate", "inform", "attached", "look forward to", "prompt"] },
    { type: 'core', title: 'Common Email Scenarios',
      script: `Let me show you how to write emails for different business situations. Each situation needs different phrases and tone.`,
      examples: ["Making an appointment:", "I would like to schedule a meeting for next Tuesday at 2 PM.", "Following up:", "I'm writing to follow up on our previous conversation.", "Apologizing:", "I sincerely apologize for the delay in responding.", "Declining politely:", "Thank you for the offer, but unfortunately I won't be able to attend.", "Asking for information:", "Could you please provide more details about the project timeline?", "Confirming:", "This is to confirm that the meeting is scheduled for March 25th."],
      practice: "Write a short email: Schedule a meeting with a colleague for next week.",
      vocab: ["schedule", "follow up", "apologize", "delay", "unfortunately", "provide", "confirm"] },
    { type: 'practice', title: 'Email Writing Practice',
      script: `Let's practice writing real emails! I'll give you scenarios and you write the email. I'll check your language and suggest improvements.`,
      examples: ["Scenario 1: Reply to your boss confirming you'll attend Friday's meeting.", "Scenario 2: Email a client apologizing for a shipping delay.", "Scenario 3: Request a day off from your manager next week.", "Scenario 4: Follow up with someone who hasn't replied in a week."],
      practice: "Let's start with Scenario 1: Reply to your boss confirming Friday's meeting." },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Excellent email skills! We learned email structure, polite request phrases, and common business scenarios. Quiz time!`,
      examples: ["Quiz 1: What's more polite: 'Send me the file' or 'Could you please send me the file'? (Answer: Could you please...)", "Quiz 2: How do you start a formal email? (Answer: Dear Mr./Ms. [Name])", "Quiz 3: 'I ___ ___ to hearing from you.' (Answer: look forward)", "Quiz 4: How do you mention an attachment? (Answer: Please find attached...)", "Quiz 5: What sign-off is best for a formal email? (Answer: Best regards / Sincerely)"] }
  ]);

  // ===== L4-06: Negotiation & Persuasion =====
  addLesson('L4-06', 4, 6, 'Negotiation & Persuasion', 'Negotiate effectively and persuade in professional settings', 'Third conditional (would have), Hedging language (might, perhaps, tend to)', [
    { type: 'warmup', title: 'Negotiation Basics',
      script: `Today we're learning the art of negotiation in English! Whether you're discussing a salary, a business deal, or even where to eat dinner, negotiation skills are essential. Let me teach you the key vocabulary.`,
      examples: ["negotiate — 협상하다", "compromise — 타협", "proposal — 제안", "counteroffer — 맞제안", "deadline — 마감일", "terms — 조건", "mutual benefit — 상호 이익", "bottom line — 최종 결론/마지노선", "win-win — 윈윈", "deal-breaker — 거래 파기 사유", "leverage — 협상력", "concession — 양보"],
      practice: "Have you ever had to negotiate something? What was it about?",
      vocab: ["negotiate", "compromise", "proposal", "counteroffer", "terms", "mutual benefit", "deal-breaker", "concession"] },
    { type: 'core', title: 'Making & Responding to Proposals',
      script: `In negotiation, you need to make proposals and respond to them diplomatically. We use "hedging" language to sound less direct and more professional. Instead of "No," we say "That might be difficult." Instead of "I want," we say "I was hoping we could..."`,
      examples: ["I'd like to propose... — ~을 제안하고 싶습니다", "What if we tried a different approach? — 다른 접근을 시도해보면 어떨까요?", "I was hoping we could reach a compromise. — 타협에 도달할 수 있으면 합니다", "That's an interesting point, however... — 흥미로운 의견이지만...", "I see your point, but I tend to think... — 의견은 이해하지만 저는 ~라고 생각합니다", "That might be difficult for us because... — 그건 저희에게 어려울 수 있는데...", "Perhaps we could consider... — 아마도 ~을 고려해볼 수 있을까요", "Would you be open to...? — ~에 대해 열린 마음이신가요?"],
      practice: "Try making a proposal: 'What if we tried...'",
      vocab: ["propose", "approach", "compromise", "tend to", "perhaps", "consider", "open to"] },
    { type: 'core', title: 'Closing a Deal & Reflecting',
      script: `Let me teach you how to close a negotiation and reflect on what happened. We also use the third conditional to talk about what WOULD HAVE happened differently. For example: "If we had offered more, they would have agreed faster."`,
      examples: ["So, do we have a deal? — 합의된 건가요?", "Let me summarize what we've agreed on. — 합의한 내용을 정리하겠습니다", "I think this is a fair compromise. — 공정한 타협이라고 생각합니다", "Let's put this in writing. — 서면으로 작성합시다", "Reflecting (Third conditional):", "If we had been more flexible, we would have closed the deal sooner.", "If I had known about the deadline, I would have prepared earlier.", "We should have asked for more details before agreeing."],
      practice: "Reflect on a past situation: 'If I had..., I would have...'",
      vocab: ["deal", "summarize", "fair", "flexible", "in writing", "should have"] },
    { type: 'practice', title: 'Role Play: Salary Negotiation',
      script: `Let's role play a salary negotiation! You've received a job offer and want to negotiate a better salary. I'll be the hiring manager. Use polite, professional language.`,
      examples: ["You: Thank you for the offer. I'm very excited about this role.", "You: However, based on my experience, I was hoping for a salary of...", "Manager: That's above our initial budget. What if we offered...?", "You: I appreciate that. Perhaps we could also discuss benefits?", "Manager: We could look into additional vacation days.", "You: That sounds like a fair compromise. I'd be happy to accept."],
      practice: "I'm the hiring manager: 'We'd like to offer you the position at $60,000. What do you think?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great negotiation skills! We learned negotiation vocabulary, hedging language, and the third conditional. Quiz time!`,
      examples: ["Quiz 1: What's more diplomatic: 'No' or 'That might be difficult'? (Answer: That might be difficult)", "Quiz 2: 'If we ___ offered more, they ___ have agreed.' (Answer: had / would)", "Quiz 3: What does 'deal-breaker' mean? (Answer: 거래를 파기하게 하는 사유)", "Quiz 4: Complete: 'I was ___ we could reach a compromise.' (Answer: hoping)", "Quiz 5: How do you close a negotiation politely? (Answer: Let me summarize what we've agreed on.)"] }
  ]);

  // ===== L4-07: Job Interviews Advanced =====
  addLesson('L4-07', 4, 7, 'Job Interviews Advanced', 'Excel in job interviews with advanced techniques', 'STAR method (Situation, Task, Action, Result), Complex sentence structures', [
    { type: 'warmup', title: 'Interview Preparation',
      script: `Today we're going to master job interviews in English! This is the advanced level — we'll go beyond basic Q&A and learn how to really impress interviewers. The key technique is the STAR method: Situation, Task, Action, Result.`,
      examples: ["STAR Method:", "Situation — Set the scene (When/Where)", "Task — What was the challenge?", "Action — What did YOU do?", "Result — What was the outcome?", "Common advanced interview questions:", "Tell me about a time you solved a difficult problem.", "Describe a situation where you showed leadership.", "Give an example of when you worked under pressure.", "What's your greatest professional achievement?"],
      practice: "What kind of job would you like to interview for?",
      vocab: ["STAR method", "situation", "task", "action", "result", "achievement", "leadership", "under pressure"] },
    { type: 'core', title: 'Answering Behavioral Questions',
      script: `Behavioral questions ask about your past experiences. Interviewers believe your past behavior predicts future performance. Let me show you how to answer using the STAR method.`,
      examples: ["Question: Tell me about a time you solved a difficult problem.", "S: Last year at my company, our main client was unhappy with the delivery time.", "T: I needed to find a way to speed up the process without increasing costs.", "A: I analyzed our workflow and found that two steps could run simultaneously. I proposed a new schedule to my team.", "R: We reduced delivery time by 30%, and the client renewed their contract.", "Key phrases:", "In my previous role... — 이전 직장에서...", "I was responsible for... — ~을 담당했습니다", "As a result... — 결과적으로...", "This experience taught me... — 이 경험을 통해 배운 것은..."],
      practice: "Think of a work achievement. Tell me the Situation first.",
      vocab: ["previous role", "responsible for", "analyzed", "proposed", "as a result", "taught me"] },
    { type: 'core', title: 'Difficult Interview Questions',
      script: `Let me prepare you for the tricky questions that interviewers love to ask. These questions test your self-awareness and honesty.`,
      examples: ["What's your biggest weakness?", "Good answer: 'I tend to be a perfectionist, which sometimes means I spend too much time on details. I've been working on prioritizing tasks better.'", "Where do you see yourself in 5 years?", "Good answer: 'I see myself growing into a leadership role where I can mentor others and contribute to the company's strategic goals.'", "Why should we hire you?", "Good answer: 'My combination of technical skills and communication abilities makes me well-suited for this role. In my last position, I...'", "Why are you leaving your current job?", "Good answer: 'I'm looking for new challenges and opportunities to grow professionally.'"],
      practice: "Let's practice: What's your biggest weakness? Answer honestly but strategically!",
      vocab: ["weakness", "perfectionist", "prioritize", "leadership role", "mentor", "well-suited", "professionally"] },
    { type: 'practice', title: 'Mock Interview',
      script: `Time for a full mock interview! I'll be the interviewer. Answer each question professionally using the techniques we learned. Remember: STAR method for behavioral questions, honest but strategic for tricky questions.`,
      examples: ["Interview flow:", "1. Tell me about yourself. (30-second pitch)", "2. Why are you interested in this position?", "3. Tell me about a time you showed leadership.", "4. How do you handle stress?", "5. Do you have any questions for us?"],
      practice: "Let's begin! 'Good morning. Thank you for coming in today. Please, tell me about yourself.'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Excellent interview skills! You're well-prepared for any English interview. Let's review the key points.`,
      examples: ["Quiz 1: What does STAR stand for? (Answer: Situation, Task, Action, Result)", "Quiz 2: How should you answer 'What's your weakness?' (Answer: Be honest but show you're improving)", "Quiz 3: What phrase starts a STAR answer? (Answer: In my previous role... / Last year at my company...)", "Quiz 4: Should you ask questions at the end of an interview? (Answer: Yes, always!)", "Quiz 5: Give a 30-second 'Tell me about yourself' answer."] }
  ]);

  // ===== L4-08: Social Issues & Critical Thinking =====
  addLesson('L4-08', 4, 8, 'Social Issues & Critical Thinking', 'Discuss social issues with nuance and critical thinking', 'Passive voice advanced, Expressing nuanced opinions (It could be argued that...)', [
    { type: 'warmup', title: 'Social Issues Vocabulary',
      script: `Today we're tackling an important topic: social issues! Being able to discuss complex topics in English shows advanced language ability. This requires nuanced vocabulary and balanced opinions. Let me teach you the key terms.`,
      examples: ["equality — 평등", "diversity — 다양성", "discrimination — 차별", "stereotype — 고정관념", "mental health — 정신 건강", "work-life balance — 워라밸", "gender gap — 성별 격차", "generation gap — 세대 차이", "inequality — 불평등", "awareness — 인식", "activism — 행동주의", "privilege — 특권"],
      practice: "Which social issue do you think about most? Just name one.",
      vocab: ["equality", "diversity", "discrimination", "stereotype", "mental health", "work-life balance", "awareness", "inequality"] },
    { type: 'core', title: 'Expressing Nuanced Opinions',
      script: `When discussing social issues, we avoid extreme statements. Instead, we use nuanced language that shows we consider multiple perspectives. Let me teach you advanced opinion structures.`,
      examples: ["It could be argued that... — ~라고 주장할 수 있다", "From one perspective... but on the other hand... — 한편으로는... 하지만 다른 한편으로는...", "While I understand that..., I believe... — ~라는 것을 이해하지만, 저는 ~라고 생각합니다", "There's no simple answer to this issue. — 이 문제에 간단한 답은 없습니다", "It depends on the context. — 상황에 따라 다릅니다", "Research suggests that... — 연구에 따르면...", "Many people tend to overlook... — 많은 사람들이 ~을 간과하는 경향이 있습니다", "This is a complex issue that requires... — 이것은 ~을 필요로 하는 복잡한 문제입니다"],
      practice: "Share a nuanced opinion: 'It could be argued that social media...'",
      vocab: ["argued", "perspective", "nuanced", "context", "research suggests", "overlook", "complex"] },
    { type: 'core', title: 'Building Arguments with Evidence',
      script: `Strong arguments need evidence and examples. Let me teach you how to support your opinions with facts, examples, and logical reasoning. We also use advanced passive voice: "It has been shown that..." "This issue is often overlooked."`,
      examples: ["According to recent studies... — 최근 연구에 따르면...", "It has been shown that remote work increases productivity. — 원격 근무가 생산성을 높이는 것으로 나타났다", "For instance... / For example... — 예를 들어...", "Statistics show that... — 통계에 따르면...", "One reason for this is... — 이것의 한 가지 이유는...", "This is often overlooked because... — 이것은 종종 간과되는데 왜냐하면...", "In conclusion, I believe... — 결론적으로, 저는 ~라고 생각합니다"],
      practice: "Support an opinion with evidence: 'According to... / For example...'",
      vocab: ["according to", "studies", "statistics", "for instance", "overlooked", "in conclusion"] },
    { type: 'practice', title: 'Structured Discussion',
      script: `Let's have a structured discussion on social issues! I'll present a topic, and you share your nuanced opinion with evidence. I'll also share my perspective so we can have a balanced discussion.`,
      examples: ["Discussion format:", "1. State your opinion clearly", "2. Give a reason or evidence", "3. Acknowledge the other side", "4. Conclude with your view", "Topics:", "Should social media have age restrictions?", "Is work-life balance more important than career success?", "Should mental health days be standard in workplaces?"],
      practice: "Let's discuss: Should social media have age restrictions? Share your nuanced opinion." },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Brilliant discussion! You showed real critical thinking skills. We learned social issue vocabulary, nuanced opinions, and evidence-based arguments. Quiz time!`,
      examples: ["Quiz 1: Complete: 'It ___ be argued that...' (Answer: could)", "Quiz 2: How do you introduce evidence? (Answer: According to... / Research suggests...)", "Quiz 3: What does 'nuanced' mean? (Answer: 미묘한/세밀한 — considering multiple aspects)", "Quiz 4: 'This issue is often ___.' (overlook/overlooked) (Answer: overlooked)", "Quiz 5: Give a nuanced opinion on work-life balance using 'While I understand..., I believe...'"] }
  ]);

  // =============================================
  // L5 Business English — 4 new lessons
  // =============================================

  // ===== L5-02: Business Email & Correspondence =====
  addLesson('L5-02', 5, 2, 'Email & Professional Writing', 'Master professional email communication for global business', 'Formal vs semi-formal register, Diplomatic language patterns', [
    { type: 'warmup', title: 'Global Email Culture',
      script: `Welcome to our second Business English lesson! Today we're focusing on email — the backbone of global business communication. Did you know that the average professional sends 40+ emails per day? Let me teach you how to stand out with clear, professional emails.`,
      examples: ["Formal: Dear Mr. Kim, — 존대말", "Semi-formal: Hi James, — 친근한 비즈니스", "Register depends on: relationship, company culture, situation", "CC (Carbon Copy) — 참조", "BCC (Blind Carbon Copy) — 숨은 참조", "FYI (For Your Information) — 참고로", "ASAP (As Soon As Possible) — 가능한 빨리", "ETA (Estimated Time of Arrival) — 예상 도착 시간", "TBD (To Be Determined) — 미정"],
      practice: "How many emails do you send per day? Is it mostly in Korean or English?",
      vocab: ["formal", "semi-formal", "CC", "BCC", "FYI", "ASAP", "ETA", "TBD"] },
    { type: 'core', title: 'Writing Clear & Concise Emails',
      script: `The key to good business emails is being clear and concise. Don't write a novel! Get to the point quickly. Let me show you the structure: Purpose → Details → Action needed.`,
      examples: ["Opening (Purpose):", "I'm writing to follow up on our meeting yesterday.", "I'm reaching out regarding the Q2 budget proposal.", "I wanted to update you on the project timeline.", "Body (Details — keep it short):", "After reviewing the data, we found that sales increased by 15%.", "The client has requested changes to the original design.", "Action (What you need):", "Could you review the attached document by Friday?", "Please let me know your availability for a call this week.", "I'd appreciate your feedback by end of day."],
      practice: "Write an opening line: 'I'm writing to...'",
      vocab: ["follow up", "reaching out", "regarding", "update", "review", "availability", "feedback"] },
    { type: 'core', title: 'Diplomatic Email Language',
      script: `In business, being diplomatic is crucial. Even when you're frustrated, your email should remain professional. Let me show you how to soften negative messages.`,
      examples: ["Instead of 'You didn't send the report' →", "'I noticed the report hasn't been received yet.'", "Instead of 'That won't work' →", "'I'm afraid that might not be feasible given our constraints.'", "Instead of 'You're wrong' →", "'I see your point, though I'd like to suggest an alternative perspective.'", "Delivering bad news:", "Unfortunately, we won't be able to meet the original deadline.", "I regret to inform you that the position has been filled.", "Softening requests:", "I was wondering if you might be able to...", "Would it be possible to...?"],
      practice: "Rewrite diplomatically: 'You're late with the report.'",
      vocab: ["I noticed", "feasible", "constraints", "alternative", "unfortunately", "regret", "wondering"] },
    { type: 'practice', title: 'Email Scenarios',
      script: `Let's practice writing emails for real business scenarios! I'll describe the situation and you write the email. I'll give you feedback on tone and clarity.`,
      examples: ["Scenario 1: A client is unhappy with a delayed shipment. Apologize and explain.", "Scenario 2: You need to reschedule an important meeting.", "Scenario 3: Introduce yourself to a new international colleague.", "Scenario 4: Politely decline a vendor's proposal."],
      practice: "Scenario 1: A client emails asking why their order is 2 weeks late. Write a professional response." },
    { type: 'review', title: 'Review & Email Quiz',
      script: `Excellent professional writing! We covered email structure, diplomatic language, and real-world scenarios. Quiz time!`,
      examples: ["Quiz 1: Which is more professional: 'Send it ASAP' or 'I'd appreciate it by end of day'? (Answer: I'd appreciate it by end of day)", "Quiz 2: How do you soften 'You're wrong'? (Answer: I see your point, though I'd like to suggest...)", "Quiz 3: What does 'I'm reaching out regarding...' mean? (Answer: ~에 대해 연락드립니다)", "Quiz 4: How do you deliver bad news professionally? (Answer: Unfortunately... / I regret to inform you...)", "Quiz 5: Write a professional closing for an email asking for a reply."] }
  ]);

  // ===== L5-03: Presentations & Pitching =====
  addLesson('L5-03', 5, 3, 'Presentations & Pitching', 'Deliver compelling business presentations and pitches', 'Rhetorical devices, Data presentation language, Storytelling in business', [
    { type: 'warmup', title: 'Presentation Frameworks',
      script: `Today we're learning how to give powerful business presentations! A great presentation can change careers and win deals. The key framework is: Hook → Problem → Solution → Evidence → Call to Action.`,
      examples: ["Hook — Start with something interesting (question, story, statistic)", "Problem — What challenge are we addressing?", "Solution — Your proposal or idea", "Evidence — Data, examples, testimonials", "Call to Action — What should the audience do next?", "Key terms:", "slide deck — 프레젠테이션 자료", "stakeholder — 이해관계자", "ROI (Return on Investment) — 투자 대비 수익", "key takeaway — 핵심 요점", "Q&A session — 질의응답"],
      practice: "What was the last presentation you gave? What was it about?",
      vocab: ["hook", "stakeholder", "ROI", "key takeaway", "Q&A", "slide deck", "call to action"] },
    { type: 'core', title: 'Opening & Engaging Your Audience',
      script: `The first 30 seconds decide whether your audience pays attention! Let me teach you powerful opening techniques and transition phrases that keep people engaged.`,
      examples: ["Starting with a question:", "'How many of you have experienced...?'", "Starting with a statistic:", "'Did you know that 73% of customers prefer...?'", "Starting with a story:", "'Last month, one of our clients faced a challenge that...'", "Transitions:", "'Now, let me move on to the next point...'", "'This brings me to my main argument...'", "'Let me give you a concrete example...'", "Building on points:", "'Building on what I just mentioned...'", "'This is particularly important because...'"],
      practice: "Create a presentation hook for a product you know. Start with a question or statistic.",
      vocab: ["did you know", "move on to", "brings me to", "concrete example", "building on", "particularly"] },
    { type: 'core', title: 'Presenting Data & Closing Strong',
      script: `In business presentations, you need to present data clearly and close with impact. Let me teach you how to describe charts, trends, and numbers, then how to end memorably.`,
      examples: ["Describing trends:", "'As you can see from this chart, sales have increased by 25%.'", "'There has been a steady growth in user engagement.'", "'The data shows a significant drop in costs since Q3.'", "Comparing:", "'Compared to last year, our revenue has doubled.'", "'While costs went up by 5%, profits increased by 20%.'", "Closing strong:", "'In summary, the three key takeaways are...'", "'I'd like to close with this thought: [powerful statement]'", "'My recommendation is to... Who's on board?'"],
      practice: "Describe a trend: 'As you can see from the data, ___ has...'",
      vocab: ["as you can see", "steady growth", "significant", "compared to", "in summary", "recommendation"] },
    { type: 'practice', title: 'Mini Pitch',
      script: `Time for a mini pitch! Choose a product, service, or idea and present it to me in under 2 minutes. Use the framework: Hook → Problem → Solution → Evidence → Call to Action.`,
      examples: ["Example mini pitch:", "Hook: 'What if I told you that you could learn English 3x faster?'", "Problem: 'Most English apps focus on reading, not speaking.'", "Solution: 'Our AI tutor gives you real-time conversation practice.'", "Evidence: 'Users improve their speaking scores by 40% in 3 months.'", "Call to Action: 'Try it free for 30 days. What do you have to lose?'"],
      practice: "Give me your pitch! Start with a hook." },
    { type: 'review', title: 'Review & Presentation Quiz',
      script: `Outstanding presentation skills! We learned frameworks, engagement techniques, data language, and pitching. Quiz time!`,
      examples: ["Quiz 1: What are the 5 parts of a pitch framework? (Answer: Hook, Problem, Solution, Evidence, Call to Action)", "Quiz 2: Name 3 ways to start a presentation. (Answer: Question, Statistic, Story)", "Quiz 3: 'As you can ___ from this chart...' (Answer: see)", "Quiz 4: What does ROI stand for? (Answer: Return on Investment)", "Quiz 5: Give me a 15-second elevator pitch for any product."] }
  ]);

  // ===== L5-04: Conference Calls & Virtual Meetings =====
  addLesson('L5-04', 5, 4, 'Conference Calls & Virtual Meetings', 'Manage virtual meetings and international conference calls', 'Interrupting politely, Clarification strategies, Managing turn-taking', [
    { type: 'warmup', title: 'Virtual Meeting Essentials',
      script: `Today we're learning how to handle conference calls and virtual meetings! Since COVID, virtual meetings have become the norm. Let me teach you the essential vocabulary and etiquette.`,
      examples: ["mute / unmute — 음소거 / 해제", "share your screen — 화면 공유", "Can you see my screen? — 화면 보이시나요?", "You're on mute. — 음소거 상태입니다", "There's a lag. — 딜레이가 있어요", "Can you hear me? — 들리시나요?", "Let me share my screen. — 화면 공유하겠습니다", "I'll drop the link in the chat. — 채팅에 링크 올려드리겠습니다", "Let's circle back to that. — 그 부분은 나중에 다시 이야기합시다", "action items — 실행 항목/할 일"],
      practice: "How many virtual meetings do you have per week?",
      vocab: ["mute", "unmute", "share screen", "lag", "circle back", "action items", "drop in the chat"] },
    { type: 'core', title: 'Managing the Meeting Flow',
      script: `In virtual meetings, managing the flow is harder than in person. Let me teach you how to open a meeting, manage time, keep people on track, and close effectively.`,
      examples: ["Opening:", "'Let's get started. Today's agenda covers three topics.'", "'Before we begin, let me do a quick roll call.'", "Managing time:", "'We have 30 minutes, so let's keep each topic to 10 minutes.'", "'We're running short on time. Let's table that for the next meeting.'", "Keeping on track:", "'That's a great point. Let's circle back to that after we cover...'", "'Let's stay focused on the main topic.'", "Closing:", "'Let me recap the action items from today's meeting.'", "'Who's responsible for each item?'", "'Great meeting, everyone. I'll send the meeting notes by EOD.'"],
      practice: "Practice opening a meeting: 'Let's get started. Today's agenda...'",
      vocab: ["agenda", "roll call", "table", "circle back", "recap", "action items", "EOD"] },
    { type: 'core', title: 'Interrupting & Clarifying Politely',
      script: `On conference calls, it's important to know how to interrupt politely, ask for clarification, and make sure everyone is heard. These phrases are your lifeline in international calls.`,
      examples: ["Polite interruptions:", "'Sorry to interrupt, but I'd like to add something.'", "'If I may, I think...'", "'Can I jump in here for a moment?'", "Asking for clarification:", "'Could you elaborate on that point?'", "'Sorry, I didn't catch that. Could you repeat it?'", "'Just to clarify, are you saying that...?'", "Confirming understanding:", "'So if I understand correctly, we need to...'", "'Let me make sure I've got this right: ...'", "Connection issues:", "'I think we lost you for a second. Could you repeat that?'", "'Your audio is breaking up.'"],
      practice: "Practice: Politely interrupt me and ask for clarification.",
      vocab: ["interrupt", "elaborate", "clarify", "catch", "jump in", "breaking up", "got this right"] },
    { type: 'practice', title: 'Role Play: Team Meeting',
      script: `Let's simulate a virtual team meeting! I'll play different team members with different communication styles. You practice managing the meeting, interrupting, and clarifying.`,
      examples: ["Meeting scenario: Q2 Project Review", "Attendees: You (meeting lead), Alex (marketing), Jamie (engineering)", "Agenda:", "1. Q1 results review (5 min)", "2. Q2 goals discussion (10 min)", "3. Resource allocation (5 min)", "4. Action items & next steps (5 min)"],
      practice: "You're leading the meeting. Open it: 'Good morning everyone. Let's get started...'" },
    { type: 'review', title: 'Review & Meeting Quiz',
      script: `Great meeting management! We learned virtual meeting vocabulary, flow management, and polite interruption. Quiz time!`,
      examples: ["Quiz 1: Someone's mic is off. What do you say? (Answer: You're on mute.)", "Quiz 2: How do you politely interrupt? (Answer: Sorry to interrupt, but... / If I may...)", "Quiz 3: What does 'Let's table that' mean? (Answer: 나중에 다시 이야기하자)", "Quiz 4: How do you ask someone to repeat? (Answer: Could you repeat that? / I didn't catch that.)", "Quiz 5: How do you close a meeting? (Answer: Let me recap the action items...)"] }
  ]);

  // ===== L5-05: Networking & Small Talk =====
  addLesson('L5-05', 5, 5, 'Networking & Small Talk', 'Build professional relationships through networking and small talk', 'Question tags for rapport, Indirect questions for politeness', [
    { type: 'warmup', title: 'Networking Culture',
      script: `Today we're learning the art of professional networking! In the business world, who you know matters as much as what you know. Networking starts with small talk — casual, friendly conversation that builds trust. Let me teach you the key vocabulary.`,
      examples: ["networking event — 네트워킹 행사", "business card — 명함", "elevator pitch — 30초 자기소개", "rapport — 유대감/친밀감", "icebreaker — 분위기를 깨는 말", "industry — 업계", "connect on LinkedIn — 링크드인으로 연결하다", "follow up — 후속 연락하다", "mutual connection — 공통 지인", "conference — 컨퍼런스/학회", "workshop — 워크숍", "mingle — 어울리다"],
      practice: "Have you been to a networking event? How was it?",
      vocab: ["networking", "rapport", "icebreaker", "elevator pitch", "mutual connection", "mingle", "follow up"] },
    { type: 'core', title: 'Starting & Maintaining Small Talk',
      script: `Small talk is the gateway to professional relationships. The trick is to ask open-ended questions and show genuine interest. We also use question tags to build rapport: "Great event, isn't it?" "You work in marketing, don't you?"`,
      examples: ["Icebreakers:", "'Great event, isn't it?' — 좋은 행사죠?", "'How did you hear about this event?' — 이 행사는 어떻게 알게 되셨어요?", "'Is this your first time at this conference?' — 이 컨퍼런스 처음이세요?", "Maintaining conversation:", "'That sounds really interesting. How did you get into that field?' — 흥미롭네요. 어떻게 그 분야에 들어가셨어요?", "'What's the most exciting project you're working on?' — 지금 가장 흥미로운 프로젝트가 뭐예요?", "'I've been meaning to learn more about that.' — 그것에 대해 더 알고 싶었어요", "Question tags for rapport:", "'The food is great, isn't it?'", "'You're based in Seoul, aren't you?'"],
      practice: "Try an icebreaker with me! Pretend we just met at a conference.",
      vocab: ["isn't it", "don't you", "get into", "field", "based in", "meaning to"] },
    { type: 'core', title: 'Exchanging Information & Following Up',
      script: `After good small talk, you want to exchange contact information and follow up later. Let me teach you how to smoothly transition from chat to professional connection, and how to write a follow-up message.`,
      examples: ["Transitioning:", "'It was great talking to you! Could I get your business card?'", "'I'd love to continue this conversation. Are you on LinkedIn?'", "'We should grab coffee sometime to discuss this further.'", "Indirect questions (more polite):", "'I was wondering what company you work for.' (not 'What company do you work for?')", "'Could you tell me what your role involves?'", "Follow-up email:", "'It was a pleasure meeting you at [event] yesterday.'", "'I really enjoyed our conversation about [topic].'", "'I'd love to explore how we might collaborate.'", "'Would you be available for a coffee meeting next week?'"],
      practice: "We had a great chat. Now smoothly ask for my LinkedIn!",
      vocab: ["business card", "LinkedIn", "grab coffee", "pleasure meeting", "collaborate", "available"] },
    { type: 'practice', title: 'Role Play: Networking Event',
      script: `Let's simulate a networking event! I'll play different people you might meet. Practice your small talk, ask questions, and exchange information. Remember: be curious, ask open-ended questions, and find common ground!`,
      examples: ["Person 1: A marketing director from a tech company", "Person 2: A startup founder looking for partnerships", "Person 3: A fellow attendee who seems shy and standing alone", "Tips:", "Find common ground (same industry, hobby, mutual connection)", "Listen more than you talk", "Remember names and details", "Always follow up within 24 hours"],
      practice: "You're at a tech conference. I'm standing by the coffee table. Come say hi!" },
    { type: 'review', title: 'Review & Networking Quiz',
      script: `Fantastic networking skills! We learned small talk, question tags, and professional follow-up. Quiz time!`,
      examples: ["Quiz 1: Name 2 good icebreakers for a networking event.", "Quiz 2: 'Great event, ___ it?' (Answer: isn't)", "Quiz 3: Which is more polite: 'What's your job?' or 'I was wondering what you do.' (Answer: I was wondering...)", "Quiz 4: How soon should you follow up after meeting someone? (Answer: Within 24 hours)", "Quiz 5: Write a one-line follow-up message after meeting someone at a conference."] }
  ]);

});

seed();

console.log('Curriculum expansion complete!');
console.log('Added:');
console.log('  L3-05: Emotions & Feelings');
console.log('  L3-06: Movies, Music & Entertainment');
console.log('  L3-07: Environment & Nature');
console.log('  L3-08: Technology & Internet');
console.log('  L4-05: Business Email & Writing');
console.log('  L4-06: Negotiation & Persuasion');
console.log('  L4-07: Job Interviews Advanced');
console.log('  L4-08: Social Issues & Critical Thinking');
console.log('  L5-02: Email & Professional Writing');
console.log('  L5-03: Presentations & Pitching');
console.log('  L5-04: Conference Calls & Virtual Meetings');
console.log('  L5-05: Networking & Small Talk');

// Verify
const total = db.prepare('SELECT COUNT(*) as cnt FROM lessons').get();
const sections = db.prepare('SELECT COUNT(*) as cnt FROM sections').get();
console.log(`\nTotal: ${total.cnt} lessons, ${sections.cnt} sections`);

db.close();
