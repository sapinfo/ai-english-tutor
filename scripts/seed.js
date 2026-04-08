import Database from 'better-sqlite3';
import { resolve } from 'path';
import { mkdirSync } from 'fs';

const DB_PATH = resolve('data/tutor.db');
mkdirSync(resolve('data'), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ========== Create Tables ==========

db.exec(`
  CREATE TABLE IF NOT EXISTS levels (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    cefr TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    level_id INTEGER NOT NULL,
    sort_order INTEGER NOT NULL,
    title TEXT NOT NULL,
    goal TEXT NOT NULL,
    grammar_focus TEXT,
    FOREIGN KEY (level_id) REFERENCES levels(id)
  );

  CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    teacher_script TEXT NOT NULL,
    examples TEXT,
    practice_prompt TEXT,
    vocabulary TEXT,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
  );

  CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL DEFAULT 'default',
    lesson_id TEXT NOT NULL,
    section_index INTEGER NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    score INTEGER,
    notes TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
  );
`);

// ========== Seed Data ==========

const insertLevel = db.prepare('INSERT OR REPLACE INTO levels (id, title, cefr, description) VALUES (?, ?, ?, ?)');
const insertLesson = db.prepare('INSERT OR REPLACE INTO lessons (id, level_id, sort_order, title, goal, grammar_focus) VALUES (?, ?, ?, ?, ?, ?)');
const insertSection = db.prepare('INSERT OR REPLACE INTO sections (lesson_id, sort_order, type, title, teacher_script, examples, practice_prompt, vocabulary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

// Clear existing sections to avoid duplicates
db.exec('DELETE FROM sections');

const seedData = db.transaction(() => {

  // ===== LEVEL 1: Beginner (A1) =====
  insertLevel.run(1, 'Beginner', 'A1', 'Basic everyday English for complete beginners');

  // --- L1-01: Greetings & Self-Introduction ---
  insertLesson.run('L1-01', 1, 1, 'Greetings & Self-Introduction', 'Introduce yourself and greet others naturally', 'Subject + be verb (I am, You are, He/She is)');

  insertSection.run('L1-01', 1, 'warmup', 'Welcome & Warm-up',
    `Welcome to our first English lesson! Today we're going to learn how to greet people and introduce yourself in English. This is one of the most important skills — you'll use it every day! Let me start by teaching you the most common greetings.`,
    JSON.stringify([
      "Hello! — the most universal greeting",
      "Hi! — more casual, used with friends",
      "Good morning! — used before 12 PM",
      "Good afternoon! — used from 12 PM to 6 PM",
      "Good evening! — used after 6 PM",
      "Hey! — very casual, only with close friends"
    ]),
    "Let's practice! Can you say 'Hello' back to me?",
    JSON.stringify(["hello", "hi", "good morning", "good afternoon", "good evening"])
  );

  insertSection.run('L1-01', 2, 'core', 'Introducing Yourself',
    `Great! Now let me teach you how to introduce yourself. In English, we use the phrase "My name is ___" or the shorter version "I'm ___." The word "I'm" is short for "I am." Let me show you some examples.`,
    JSON.stringify([
      "My name is Sarah. — formal",
      "I'm Sarah. — casual (I'm = I am)",
      "Hi, I'm Sarah. Nice to meet you! — the most common way",
      "Hello, my name is Sarah. It's nice to meet you. — more formal",
      "I'm Sarah, and I'm from New York. — adding where you're from",
      "My name is Sarah. I'm an English teacher. — adding your job"
    ]),
    "Now it's your turn! Try saying: 'Hi, I'm [your name]. Nice to meet you!'",
    JSON.stringify(["name", "nice to meet you", "I'm", "from"])
  );

  insertSection.run('L1-01', 3, 'core', 'Asking About Others',
    `Wonderful! Now let me teach you how to ask someone about themselves. In English, we use "What is your name?" to ask for a name. We can also ask "Where are you from?" to learn where someone lives. Let me show you the question and answer patterns.`,
    JSON.stringify([
      "What is your name? → My name is David.",
      "What's your name? → I'm David. (What's = What is)",
      "Where are you from? → I'm from Korea.",
      "Where are you from? → I'm from Seoul, Korea.",
      "How are you? → I'm fine, thank you. And you?",
      "How are you doing? → I'm doing well, thanks!",
      "How's it going? → Pretty good, thanks! (casual)"
    ]),
    "Let me ask you: What is your name? And where are you from? Try answering in English!",
    JSON.stringify(["what", "where", "how", "fine", "well", "thanks"])
  );

  insertSection.run('L1-01', 4, 'practice', 'Role Play: Meeting Someone New',
    `Now let's practice everything together! Imagine you just met a new person at a party. I'll be that person, and you introduce yourself. Remember the pattern: Greeting → Name → Where you're from. Here's an example conversation first.`,
    JSON.stringify([
      "A: Hi there! My name is Sarah.",
      "B: Hello, Sarah! I'm David. Nice to meet you!",
      "A: Nice to meet you too, David! Where are you from?",
      "B: I'm from Korea. How about you?",
      "A: I'm from New York. How are you doing today?",
      "B: I'm doing great, thanks for asking!"
    ]),
    "OK, let's try it! I'll start: 'Hi! My name is Sarah. What's your name?'",
    null
  );

  insertSection.run('L1-01', 5, 'review', 'Review & Mini Quiz',
    `Excellent work today! Let me review what we learned. We covered: greetings like Hello, Hi, Good morning. We learned to introduce ourselves with "I'm ___" and "My name is ___." We practiced asking questions: "What's your name?" and "Where are you from?" Now let me give you a quick quiz to check your understanding!`,
    JSON.stringify([
      "Quiz 1: How do you say your name in English? (Answer: My name is ___ / I'm ___)",
      "Quiz 2: What do you say after someone introduces themselves? (Answer: Nice to meet you!)",
      "Quiz 3: How do you ask where someone is from? (Answer: Where are you from?)",
      "Quiz 4: How do you respond to 'How are you?' (Answer: I'm fine, thank you.)",
      "Quiz 5: What's the casual way to say 'Hello'? (Answer: Hi! or Hey!)"
    ]),
    "Let me ask you Quiz 1: How do you introduce yourself in English?",
    null
  );

  // --- L1-02: Numbers, Days & Time ---
  insertLesson.run('L1-02', 1, 2, 'Numbers, Days & Time', 'Say numbers, days of the week, and tell time', 'What + be verb questions');

  insertSection.run('L1-02', 1, 'warmup', 'Welcome & Number Basics',
    `Today we're going to learn about numbers, days of the week, and how to tell time in English. These are super useful in everyday life! Let me start with numbers 1 to 20.`,
    JSON.stringify([
      "1-one, 2-two, 3-three, 4-four, 5-five",
      "6-six, 7-seven, 8-eight, 9-nine, 10-ten",
      "11-eleven, 12-twelve, 13-thirteen, 14-fourteen, 15-fifteen",
      "16-sixteen, 17-seventeen, 18-eighteen, 19-nineteen, 20-twenty",
      "After 20: twenty-one, twenty-two... thirty, forty, fifty...",
      "100 = one hundred, 1000 = one thousand"
    ]),
    "Can you count from 1 to 5 in English? Try it!",
    JSON.stringify(["one", "two", "three", "four", "five", "ten", "twenty", "hundred"])
  );

  insertSection.run('L1-02', 2, 'core', 'Days of the Week',
    `Great job with numbers! Now let's learn the 7 days of the week. In English, days always start with a capital letter. The week starts with Sunday in America, but Monday in many other countries.`,
    JSON.stringify([
      "Sunday (Sun.) — 일요일",
      "Monday (Mon.) — 월요일",
      "Tuesday (Tue.) — 화요일",
      "Wednesday (Wed.) — 수요일 (the 'd' is silent!)",
      "Thursday (Thu.) — 목요일",
      "Friday (Fri.) — 금요일",
      "Saturday (Sat.) — 토요일",
      "'What day is it today?' → 'Today is Monday.'",
      "'What day is it tomorrow?' → 'Tomorrow is Tuesday.'"
    ]),
    "What day is it today? Try answering: 'Today is ___.'",
    JSON.stringify(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "today", "tomorrow"])
  );

  insertSection.run('L1-02', 3, 'core', 'Telling Time',
    `Now let's learn how to tell time! In English, we use "o'clock" for exact hours and "half past" for 30 minutes. We also use AM for morning and PM for afternoon/evening.`,
    JSON.stringify([
      "What time is it? — 가장 기본적인 질문",
      "It's 3 o'clock. — 정각 (3:00)",
      "It's 3:15. — 'It's three fifteen'",
      "It's 3:30. — 'It's three thirty' or 'It's half past three'",
      "It's 3:45. — 'It's three forty-five'",
      "AM = morning (12:00 AM = midnight)",
      "PM = afternoon/evening (12:00 PM = noon)",
      "I wake up at 7 AM. I go to bed at 11 PM."
    ]),
    "What time is it now? Try saying: 'It's ___ o'clock.'",
    JSON.stringify(["o'clock", "half past", "AM", "PM", "noon", "midnight"])
  );

  insertSection.run('L1-02', 4, 'practice', 'Using Numbers in Daily Life',
    `Let's practice using numbers, days, and time in real situations! I'll teach you useful phrases for everyday life.`,
    JSON.stringify([
      "What's your phone number? → My phone number is 010-1234-5678.",
      "How old are you? → I'm 30 years old.",
      "What time do you wake up? → I wake up at 7 AM.",
      "What day is your English class? → My English class is on Monday.",
      "How much is this? → It's 5 dollars.",
      "When is your birthday? → My birthday is March 15th."
    ]),
    "Let me ask: How old are you? Try answering: 'I'm ___ years old.'",
    null
  );

  insertSection.run('L1-02', 5, 'review', 'Review & Mini Quiz',
    `Great work today! Let me review: We learned numbers 1-100, the 7 days of the week, and how to tell time with o'clock, half past, AM and PM. Time for a quick quiz!`,
    JSON.stringify([
      "Quiz 1: What comes after 'twelve'? (Answer: thirteen)",
      "Quiz 2: What day comes after Wednesday? (Answer: Thursday)",
      "Quiz 3: How do you say 3:00? (Answer: It's three o'clock)",
      "Quiz 4: What is 3:30 in English? (Answer: It's three thirty / half past three)",
      "Quiz 5: Is 8 PM morning or evening? (Answer: evening)"
    ]),
    "Quiz 1: What number comes after twelve?",
    null
  );

  // --- L1-03: Family & People ---
  insertLesson.run('L1-03', 1, 3, 'Family & People', 'Talk about family members and describe people', 'Have/Has, Possessive adjectives (my, your, his, her)');

  insertSection.run('L1-03', 1, 'warmup', 'Family Vocabulary',
    `Today we're going to learn about family! Family is a great topic because everyone has one, and people love talking about their families. Let me teach you the family member names first.`,
    JSON.stringify([
      "mother (mom) — 어머니 (엄마)",
      "father (dad) — 아버지 (아빠)",
      "parents — 부모님 (mother + father)",
      "brother — 형/오빠/남동생",
      "sister — 언니/누나/여동생",
      "siblings — 형제자매 (brothers + sisters)",
      "husband — 남편",
      "wife — 아내",
      "son — 아들",
      "daughter — 딸",
      "children / kids — 아이들",
      "grandfather (grandpa) — 할아버지",
      "grandmother (grandma) — 할머니"
    ]),
    "Can you tell me one family member in English? For example: 'mother' or 'father'",
    JSON.stringify(["mother", "father", "brother", "sister", "son", "daughter", "husband", "wife", "parents", "children"])
  );

  insertSection.run('L1-03', 2, 'core', 'Talking About Your Family',
    `Now let me teach you how to talk about your family in sentences. We use "I have" to say what family members we have. We use "my" to show it's our family. Let me show you the patterns.`,
    JSON.stringify([
      "I have one brother. — 형/남동생이 한 명 있어요",
      "I have two sisters. — 언니/여동생이 두 명 있어요",
      "I have three children. — 아이가 세 명 있어요",
      "I don't have any siblings. — 형제가 없어요",
      "My mother is a teacher. — 우리 어머니는 선생님이에요",
      "My father works at a bank. — 아버지는 은행에서 일해요",
      "My brother is 25 years old. — 형은 25살이에요",
      "My sister lives in Seoul. — 언니는 서울에 살아요"
    ]),
    "Try this: 'I have ___ brother(s) and ___ sister(s).' How many do you have?",
    JSON.stringify(["have", "my", "your", "his", "her", "our", "their"])
  );

  insertSection.run('L1-03', 3, 'core', 'Describing People',
    `Now let's learn how to describe people! We use "He is" for men and "She is" for women. We can describe their appearance and personality.`,
    JSON.stringify([
      "He is tall. / She is short.",
      "He is young. / She is old.",
      "He has black hair. / She has long hair.",
      "He is kind. — 그는 친절해요",
      "She is smart. — 그녀는 똑똑해요",
      "He is funny. — 그는 재미있어요",
      "She is hardworking. — 그녀는 열심히 일해요",
      "My mother is kind and hardworking.",
      "My father is tall and funny."
    ]),
    "Can you describe one family member? Try: 'My ___ is ___.'",
    JSON.stringify(["tall", "short", "kind", "smart", "funny", "young", "old", "hardworking"])
  );

  insertSection.run('L1-03', 4, 'practice', 'Talking About Your Family',
    `Let's put it all together! I'll tell you about my family first as an example, then you try.`,
    JSON.stringify([
      "Example: Let me tell you about my family.",
      "I have two children — a son and a daughter.",
      "My son is 15 years old. He is tall and smart.",
      "My daughter is 12 years old. She is kind and funny.",
      "My husband is a doctor. He is hardworking.",
      "My parents live in New York. My mother is 65 years old."
    ]),
    "Now tell me about your family! Start with: 'I have...' or 'My family has...'",
    null
  );

  insertSection.run('L1-03', 5, 'review', 'Review & Mini Quiz',
    `Wonderful work today! We learned family vocabulary, how to use 'I have' and 'my/his/her', and how to describe people. Let's do a quick quiz!`,
    JSON.stringify([
      "Quiz 1: What do you call your mother's mother? (Answer: grandmother)",
      "Quiz 2: How do you say 형제자매 in English? (Answer: siblings)",
      "Quiz 3: Fill in: 'I ___ two brothers.' (Answer: have)",
      "Quiz 4: Which word: 'My sister is ___ (똑똑한)' (Answer: smart)",
      "Quiz 5: He or She? '___ is my mother.' (Answer: She)"
    ]),
    "Quiz 1: What do you call your mother's mother in English?",
    null
  );

  // --- L1-04: Daily Routine ---
  insertLesson.run('L1-04', 1, 4, 'Daily Routine', 'Describe your daily activities and schedule', 'Simple Present tense, Frequency adverbs (always, usually, sometimes, never)');

  insertSection.run('L1-04', 1, 'warmup', 'Daily Activity Words',
    `Today we're going to learn how to talk about your daily routine — the things you do every day! This is very useful because you can tell people about your life. Let me teach you the most common daily activities first.`,
    JSON.stringify([
      "wake up — 일어나다",
      "get up — 침대에서 나오다",
      "take a shower — 샤워하다",
      "brush my teeth — 이를 닦다",
      "get dressed — 옷을 입다",
      "eat breakfast / have breakfast — 아침을 먹다",
      "go to work — 출근하다",
      "eat lunch / have lunch — 점심을 먹다",
      "come home — 집에 오다",
      "eat dinner / have dinner — 저녁을 먹다",
      "watch TV — TV를 보다",
      "go to bed — 잠자리에 들다",
      "fall asleep — 잠들다"
    ]),
    "Can you say one thing you do every morning? For example: 'wake up' or 'eat breakfast'",
    JSON.stringify(["wake up", "get up", "shower", "breakfast", "lunch", "dinner", "go to work", "come home", "go to bed"])
  );

  insertSection.run('L1-04', 2, 'core', 'Making Sentences About Your Day',
    `Now let me teach you how to make sentences about your routine. We use "I + verb" for things we do. And we add the TIME to say when. The pattern is: "I + verb + at + time."`,
    JSON.stringify([
      "I wake up at 7 AM.",
      "I take a shower at 7:15.",
      "I eat breakfast at 7:30.",
      "I go to work at 8:30.",
      "I eat lunch at 12:00 (noon).",
      "I come home at 6 PM.",
      "I eat dinner at 7 PM.",
      "I watch TV at 9 PM.",
      "I go to bed at 11 PM."
    ]),
    "Try telling me when you wake up: 'I wake up at ___.'",
    JSON.stringify(["at", "in the morning", "in the afternoon", "in the evening", "at night"])
  );

  insertSection.run('L1-04', 3, 'core', 'Frequency Words: How Often?',
    `Now let me teach you very useful words that tell HOW OFTEN you do something. These words are called "frequency adverbs." They go BEFORE the verb.`,
    JSON.stringify([
      "always (100%) — 항상: I always eat breakfast.",
      "usually (80%) — 보통: I usually wake up at 7.",
      "often (60%) — 자주: I often watch TV at night.",
      "sometimes (40%) — 가끔: I sometimes eat out for dinner.",
      "rarely (10%) — 거의 안: I rarely exercise in the morning.",
      "never (0%) — 절대 안: I never skip breakfast.",
      "Pattern: I + frequency word + verb",
      "I always brush my teeth before bed.",
      "I usually take a shower in the morning.",
      "I sometimes read a book before sleeping."
    ]),
    "Try using 'usually': 'I usually ___ at ___.'",
    JSON.stringify(["always", "usually", "often", "sometimes", "rarely", "never"])
  );

  insertSection.run('L1-04', 4, 'practice', 'Describe Your Whole Day',
    `Let's practice describing a full day! I'll go first, then you try. Listen to my example carefully.`,
    JSON.stringify([
      "My daily routine:",
      "I usually wake up at 6:30 AM.",
      "I always take a shower and brush my teeth.",
      "I eat breakfast at 7 — usually toast and coffee.",
      "I go to work at 8:30.",
      "I always eat lunch at 12:00 with my coworkers.",
      "I come home at 6 PM.",
      "I sometimes cook dinner, but I usually order food.",
      "I often watch TV in the evening.",
      "I always read a book before bed.",
      "I go to bed at 11 PM."
    ]),
    "Now you try! Tell me about your morning: 'I wake up at ___. Then I ___.'",
    null
  );

  insertSection.run('L1-04', 5, 'review', 'Review & Mini Quiz',
    `Great job today! We learned daily activity words, how to say when we do things with 'at + time', and frequency adverbs. Quick quiz time!`,
    JSON.stringify([
      "Quiz 1: How do you say '아침을 먹다' in English? (Answer: eat breakfast / have breakfast)",
      "Quiz 2: Where does 'usually' go? 'I ___ wake up at 7.' (Answer: I usually wake up at 7.)",
      "Quiz 3: Which means 100%: always, sometimes, or never? (Answer: always)",
      "Quiz 4: Fill in: 'I go to bed ___ 11 PM.' (Answer: at)",
      "Quiz 5: What's the opposite of 'always'? (Answer: never)"
    ]),
    "Quiz 1: How do you say '아침을 먹다' in English?",
    null
  );

  // --- L1-05: Food & Ordering ---
  insertLesson.run('L1-05', 1, 5, 'Food & Ordering', 'Order food at a restaurant and talk about food preferences', 'Would like, Can I have, Like + noun/gerund');

  insertSection.run('L1-05', 1, 'warmup', 'Food Vocabulary',
    `Today we're going to learn about food and how to order at a restaurant! This is one of the most practical English skills. Let me start by teaching you common food and drink words.`,
    JSON.stringify([
      "Drinks: water, coffee, tea, juice, soda, milk",
      "Breakfast: toast, eggs, cereal, pancakes, bacon",
      "Lunch/Dinner: chicken, beef, pork, fish, rice, pasta, salad, soup, pizza, burger",
      "Sides: french fries, bread, salad",
      "Dessert: cake, ice cream, pie, cookies",
      "Tastes: delicious, yummy, salty, sweet, spicy, sour, bitter"
    ]),
    "What's your favorite food? Can you say it in English?",
    JSON.stringify(["water", "coffee", "chicken", "rice", "salad", "pizza", "delicious", "menu", "order"])
  );

  insertSection.run('L1-05', 2, 'core', 'How to Order Food',
    `Now let me teach you the most important phrases for ordering food. In English, we use polite phrases like "I'd like" and "Can I have." The word "I'd like" means "I would like" — it's very polite!`,
    JSON.stringify([
      "I'd like a coffee, please. — 커피 하나 주세요 (가장 공손)",
      "Can I have a glass of water? — 물 한 잔 주시겠어요?",
      "I'll have the chicken. — 치킨으로 할게요",
      "Could I get the pasta? — 파스타 주시겠어요?",
      "For me, the salad, please. — 저는 샐러드요",
      "And a coffee, please. — 그리고 커피도요",
      "That's all, thank you. — 그게 다예요, 감사합니다",
      "Can I see the menu? — 메뉴 볼 수 있을까요?",
      "How much is it? / What's the total? — 얼마예요?"
    ]),
    "Try ordering: 'I'd like a ___, please.'",
    JSON.stringify(["I'd like", "Can I have", "please", "menu", "check", "bill", "total"])
  );

  insertSection.run('L1-05', 3, 'core', 'Talking About Food Preferences',
    `Now let's learn how to talk about foods you like and don't like! We use "I like" for things we enjoy and "I don't like" for things we don't enjoy.`,
    JSON.stringify([
      "I like pizza. — 피자 좋아해요",
      "I love Korean food! — 한식 정말 좋아해요",
      "I don't like spicy food. — 매운 음식 안 좋아해요",
      "I hate bitter things. — 쓴 것 싫어해요",
      "My favorite food is ___. — 가장 좋아하는 음식은 ___",
      "I prefer chicken to beef. — 소고기보다 치킨이 좋아요",
      "I'm allergic to ___. — 저는 ___에 알레르기가 있어요",
      "I'm vegetarian. — 저는 채식주의자예요"
    ]),
    "Tell me: 'My favorite food is ___.' What do you like?",
    JSON.stringify(["like", "love", "don't like", "hate", "prefer", "favorite"])
  );

  insertSection.run('L1-05', 4, 'practice', 'Role Play: At a Restaurant',
    `Let's do a role play! I'll be the waiter, and you are the customer. Here's how a typical restaurant conversation goes in English.`,
    JSON.stringify([
      "Waiter: Hi, welcome! How many people?",
      "Customer: Just one, please. / Table for two, please.",
      "Waiter: Here's your menu. Are you ready to order?",
      "Customer: Yes, I'd like the chicken pasta, please.",
      "Waiter: Anything to drink?",
      "Customer: A glass of water, please.",
      "Waiter: Would you like any dessert?",
      "Customer: No, thank you. Can I have the check, please?",
      "Waiter: Sure! Here you go. That's $15.50."
    ]),
    "OK, I'm your waiter now! 'Welcome! Are you ready to order?'",
    null
  );

  insertSection.run('L1-05', 5, 'review', 'Review & Mini Quiz',
    `Wonderful! Today we learned food vocabulary, how to order with 'I'd like' and 'Can I have', and how to express food preferences. Quiz time!`,
    JSON.stringify([
      "Quiz 1: How do you politely order a coffee? (Answer: I'd like a coffee, please.)",
      "Quiz 2: How do you ask for the bill? (Answer: Can I have the check, please?)",
      "Quiz 3: How do you say '좋아하는 음식'? (Answer: favorite food)",
      "Quiz 4: 'I ___ spicy food.' (like or don't like?) — Answer with YOUR preference!",
      "Quiz 5: How do you ask to see the menu? (Answer: Can I see the menu?)"
    ]),
    "Quiz 1: How do you politely order a coffee in English?",
    null
  );

  // ===== LEVEL 2: Elementary (A2) =====
  insertLevel.run(2, 'Elementary', 'A2', 'Everyday conversations with basic grammar structures');

  // --- L2-01: Talking About the Past ---
  insertLesson.run('L2-01', 2, 1, 'Talking About the Past', 'Describe past events and experiences', 'Simple Past tense (regular and irregular verbs)');

  insertSection.run('L2-01', 1, 'warmup', 'Introduction to Past Tense',
    `Today we're going to learn one of the most important grammar points in English — the past tense! When we talk about things that already happened (yesterday, last week, last year), we change the verb. Let me explain how it works.`,
    JSON.stringify([
      "Present → Past: How verbs change",
      "go → went (I went to the store yesterday.)",
      "eat → ate (I ate pizza for dinner.)",
      "see → saw (I saw a movie last night.)",
      "buy → bought (I bought a new phone.)",
      "have → had (I had a great time.)",
      "do → did (I did my homework.)",
      "make → made (I made breakfast this morning.)",
      "These are called 'irregular verbs' — they don't follow a pattern, you need to memorize them!"
    ]),
    "Can you try one? Change this to past: 'I go to school' → 'I ___ to school yesterday.'",
    JSON.stringify(["went", "ate", "saw", "bought", "had", "did", "made", "took", "yesterday", "last week"])
  );

  insertSection.run('L2-01', 2, 'core', 'Regular Past Tense (-ed)',
    `Some verbs are easier! We call them "regular verbs." You just add -ed to the end. Let me teach you the rules.`,
    JSON.stringify([
      "Rule 1: Most verbs → add -ed",
      "  walk → walked, talk → talked, watch → watched",
      "  play → played, cook → cooked, clean → cleaned",
      "Rule 2: Verbs ending in 'e' → just add -d",
      "  like → liked, live → lived, love → loved",
      "Rule 3: Verbs ending in consonant+y → change y to ied",
      "  study → studied, try → tried, carry → carried",
      "Rule 4: Short verbs (CVC) → double the last letter + ed",
      "  stop → stopped, plan → planned",
      "Examples in sentences:",
      "I walked to the park yesterday.",
      "She cooked dinner last night.",
      "We watched a movie on Saturday."
    ]),
    "Try making a sentence: 'I watched ___.' or 'I walked to ___.'",
    JSON.stringify(["walked", "talked", "watched", "played", "cooked", "cleaned", "liked", "studied"])
  );

  insertSection.run('L2-01', 3, 'core', 'Questions and Negatives in Past Tense',
    `Now let me teach you how to ask questions and say negative sentences in the past tense. We use "did" for questions and "didn't" for negatives. This is very important!`,
    JSON.stringify([
      "Question pattern: Did + subject + base verb?",
      "  Did you eat breakfast? (NOT: Did you ate)",
      "  Did she go to work?",
      "  Did they watch the movie?",
      "Answers: Yes, I did. / No, I didn't.",
      "Negative pattern: Subject + didn't + base verb",
      "  I didn't eat breakfast. (NOT: I didn't ate)",
      "  She didn't go to work.",
      "  They didn't watch the movie.",
      "IMPORTANT: After 'did' and 'didn't', use the BASE verb (not past form)",
      "  ✓ Did you go? ✗ Did you went?",
      "  ✓ I didn't eat. ✗ I didn't ate."
    ]),
    "Try asking me a question: 'Did you ___?' — ask me anything!",
    JSON.stringify(["did", "didn't", "did not", "yes I did", "no I didn't"])
  );

  insertSection.run('L2-01', 4, 'practice', 'Tell Me About Your Weekend',
    `Let's practice! I'll tell you about my last weekend, then you tell me about yours. Use past tense verbs!`,
    JSON.stringify([
      "My last weekend:",
      "On Saturday, I woke up late — at 9 AM.",
      "I ate pancakes for breakfast. They were delicious!",
      "I went shopping and bought some new books.",
      "In the evening, I watched a Korean drama on Netflix.",
      "On Sunday, I cooked lunch for my family.",
      "We had pasta and salad. My kids loved it.",
      "I didn't do any work — it was a relaxing weekend!"
    ]),
    "Now tell me about your weekend! What did you do last Saturday? Start with: 'Last Saturday, I...'",
    null
  );

  insertSection.run('L2-01', 5, 'review', 'Review & Mini Quiz',
    `Excellent work! Today we learned: irregular past verbs (go→went, eat→ate), regular past verbs (add -ed), how to make questions with 'Did you...?' and negatives with 'didn't.' Quiz time!`,
    JSON.stringify([
      "Quiz 1: What is the past of 'go'? (Answer: went)",
      "Quiz 2: What is the past of 'watch'? (Answer: watched)",
      "Quiz 3: Make a question: '___ you eat lunch?' (Answer: Did)",
      "Quiz 4: Make it negative: 'I ___ go to school yesterday.' (Answer: didn't)",
      "Quiz 5: Fix this sentence: 'Did you went to the store?' (Answer: Did you go to the store?)"
    ]),
    "Quiz 1: What is the past tense of 'go'?",
    null
  );

  // ===== LEVEL 3: Intermediate (B1) =====
  insertLevel.run(3, 'Intermediate', 'B1', 'Complex conversations with advanced grammar');

  // --- L3-01: Storytelling ---
  insertLesson.run('L3-01', 3, 1, 'Storytelling & Narratives', 'Tell stories about past experiences with detail', 'Past Continuous + Past Simple, Sequencing words');

  insertSection.run('L3-01', 1, 'warmup', 'Why Storytelling Matters',
    `Today we're going to learn how to tell stories in English! Storytelling is one of the best ways to practice English because you use many different tenses and vocabulary. Good storytellers use four things: time words, details, emotions, and a clear order (beginning → middle → end).`,
    JSON.stringify([
      "Time words for stories:",
      "One day... / Last summer... / A few years ago...",
      "First... Then... After that... Finally...",
      "Suddenly... / All of a sudden...",
      "Meanwhile... / At the same time...",
      "Eventually... / In the end...",
      "These words help your listener follow the story!"
    ]),
    "Think of a memorable experience. Can you tell me in one sentence when it happened? Like: 'Last summer, I...'",
    JSON.stringify(["suddenly", "eventually", "meanwhile", "fortunately", "unfortunately", "first", "then", "finally"])
  );

  insertSection.run('L3-01', 2, 'core', 'Past Continuous: Setting the Scene',
    `When we tell stories, we often describe what WAS HAPPENING in the background. For this, we use the Past Continuous tense: 'was/were + verb-ing.' Let me explain with examples.`,
    JSON.stringify([
      "Past Continuous: was/were + verb-ing = background action",
      "I was walking to work. (background action)",
      "It was raining heavily. (background weather)",
      "People were running to catch the bus. (background scene)",
      "",
      "Past Simple + Past Continuous together:",
      "I was walking to work WHEN I saw an old friend. (background + sudden event)",
      "She was cooking dinner WHEN the phone rang.",
      "We were watching TV WHEN the lights went out.",
      "They were playing soccer WHEN it started to rain.",
      "",
      "Pattern: I was ___ing when ___ happened.",
      "The 'was ___ing' part = the long background action",
      "The 'when ___' part = the sudden, short event"
    ]),
    "Try making a sentence: 'I was ___ing when ___.'",
    JSON.stringify(["was", "were", "walking", "cooking", "watching", "when", "suddenly"])
  );

  insertSection.run('L3-01', 3, 'core', 'Story Structure & Details',
    `A good story has three parts: Beginning (set the scene), Middle (what happened), and End (how it ended). Let me show you a complete example story, and pay attention to the structure.`,
    JSON.stringify([
      "BEGINNING (Set the scene):",
      "  'Last summer, I was traveling in Japan with my friend.'",
      "  'It was a hot day, and we were walking around Osaka.'",
      "",
      "MIDDLE (What happened):",
      "  'Suddenly, it started raining really hard.'",
      "  'We didn't have an umbrella, so we ran into a small restaurant.'",
      "  'The owner was very kind. He gave us free hot tea.'",
      "  'We ended up staying for two hours and had the best ramen ever!'",
      "",
      "END (How it ended):",
      "  'It turned out to be one of the best meals of the trip.'",
      "  'We went back the next day to thank him.'",
      "  'It was an unforgettable experience.'"
    ]),
    "Now try starting YOUR story. Set the scene: 'One day, I was ___ing...' or 'Last year, I was in ___.'",
    JSON.stringify(["turned out", "ended up", "it was", "unforgettable", "memorable", "incredible"])
  );

  insertSection.run('L3-01', 4, 'practice', 'Tell Your Story',
    `Now it's your turn to tell a complete story! Pick any memorable experience — funny, scary, surprising, anything! Use the structure: Beginning (when/where/what was happening) → Middle (what happened) → End (result). I'll help you along the way.`,
    JSON.stringify([
      "Story starters you can use:",
      "'Let me tell you about the time I...'",
      "'The funniest thing happened to me last...'",
      "'I'll never forget when...'",
      "'One of the most memorable experiences was...'",
      "",
      "Useful phrases for the middle:",
      "'Suddenly...' / 'Out of nowhere...'",
      "'I couldn't believe it when...'",
      "'The funniest/scariest part was...'",
      "",
      "Useful phrases for the ending:",
      "'In the end...' / 'It turned out that...'",
      "'I learned that...' / 'After that, I never ___ed again.'"
    ]),
    "Go ahead! Start with 'Let me tell you about...' or 'One time...'",
    null
  );

  insertSection.run('L3-01', 5, 'review', 'Review & Mini Quiz',
    `Fantastic storytelling today! We learned: sequencing words (first, then, suddenly, finally), Past Continuous for setting scenes (I was walking when...), and story structure (beginning, middle, end). Quiz time!`,
    JSON.stringify([
      "Quiz 1: 'I was ___ing when it started to rain.' — Make your own sentence!",
      "Quiz 2: What tense is 'was walking'? (Answer: Past Continuous)",
      "Quiz 3: Put in order: finally / first / then / suddenly (Answer: first → then → suddenly → finally)",
      "Quiz 4: Fix: 'I was walk to school when I saw her.' (Answer: I was walking to school when I saw her.)",
      "Quiz 5: How do you start a good story? (Answer: Set the scene — when, where, what was happening)"
    ]),
    "Quiz 1: Make a sentence using 'I was ___ing when ___.'",
    null
  );

  // ===== LEVEL 4: Upper-Intermediate (B2) =====
  insertLevel.run(4, 'Upper-Intermediate', 'B2', 'Fluent discussions on complex topics');

  insertLesson.run('L4-01', 4, 1, 'Debating & Persuasion', 'Build arguments and persuade others', 'Complex sentences with although/while/whereas, Linking words');

  insertSection.run('L4-01', 1, 'warmup', 'The Art of Arguing in English',
    `Today we're going to learn how to debate and express strong opinions in English! This is an advanced skill. In English, we don't just say "I think so" — we build structured arguments with evidence and examples. Let me teach you the framework.`,
    JSON.stringify([
      "Structure of a good argument:",
      "1. State your opinion: 'I strongly believe that...'",
      "2. Give a reason: 'The main reason is...'",
      "3. Provide evidence/example: 'For example, ...'",
      "4. Acknowledge the other side: 'While some people think..., I believe...'",
      "5. Conclude: 'Therefore, ...' / 'That's why I think...'",
      "",
      "Opinion phrases (weak → strong):",
      "I think... → I believe... → I'm convinced... → I strongly believe..."
    ]),
    "What's a topic you have a strong opinion about? Just name the topic — we'll practice arguing about it!",
    JSON.stringify(["argue", "debate", "opinion", "evidence", "furthermore", "however", "therefore", "convince"])
  );

  insertSection.run('L4-01', 2, 'core', 'Agreeing and Disagreeing Politely',
    `In debates, you need to both agree and disagree. In English, HOW you disagree matters a lot. Let me teach you polite and strong ways to do both.`,
    JSON.stringify([
      "AGREEING:",
      "  I agree with you. / I totally agree.",
      "  That's a great point.",
      "  I see exactly what you mean.",
      "  You're absolutely right.",
      "",
      "POLITE DISAGREEING:",
      "  I see your point, but I think...",
      "  That's true, however...",
      "  I understand what you're saying, but...",
      "  I respect your opinion, but I believe...",
      "",
      "STRONG DISAGREEING:",
      "  I'm afraid I disagree.",
      "  I don't think that's entirely true.",
      "  Actually, I see it differently.",
      "",
      "NEVER SAY: 'You are wrong.' — Always disagree with the IDEA, not the PERSON."
    ]),
    "Try disagreeing with me politely. I'll say: 'Working from home is better than working in an office.' What do you think?",
    JSON.stringify(["agree", "disagree", "however", "although", "on the other hand", "nevertheless"])
  );

  insertSection.run('L4-01', 3, 'core', 'Linking Words for Complex Arguments',
    `To sound more fluent and persuasive, you need linking words. These connect your ideas and make your argument flow smoothly. Let me teach you the most important ones.`,
    JSON.stringify([
      "ADDING ideas: Furthermore, Moreover, In addition, Also",
      "  'Remote work saves time. Furthermore, it reduces stress.'",
      "",
      "CONTRASTING ideas: However, On the other hand, Although, While, Whereas",
      "  'Some people love cities. However, others prefer the countryside.'",
      "  'Although it's expensive, the quality is excellent.'",
      "  'While cities offer convenience, rural areas offer peace.'",
      "",
      "GIVING REASONS: Because, Since, Due to, The reason is",
      "  'I prefer trains because they're more comfortable.'",
      "",
      "CONCLUDING: Therefore, As a result, In conclusion, To sum up",
      "  'Therefore, I believe remote work is the future.'"
    ]),
    "Try using 'however' or 'although' in a sentence about any topic!",
    JSON.stringify(["furthermore", "moreover", "however", "although", "whereas", "therefore", "in conclusion"])
  );

  insertSection.run('L4-01', 4, 'practice', 'Mini Debate',
    `Let's have a mini debate! I'll take one side, you take the other. Topic: "Social media does more harm than good." I'll argue FOR, you argue AGAINST. Use the structure: Opinion → Reason → Example → Conclusion.`,
    JSON.stringify([
      "My argument (FOR social media being harmful):",
      "'I strongly believe social media does more harm than good.'",
      "'The main reason is that it increases anxiety and depression, especially in teenagers.'",
      "'For example, studies show that heavy social media use is linked to poor mental health.'",
      "'Furthermore, it spreads misinformation very quickly.'",
      "'Therefore, I think we need to limit social media use.'",
      "",
      "Now YOUR turn — argue AGAINST (social media is good):",
      "Start with: 'I respect your opinion, but I believe...'",
      "Give a reason: 'The main reason is...'",
      "Give an example: 'For example,...'",
      "Conclude: 'That's why I think...'"
    ]),
    "Go ahead! Start with: 'I respect your opinion, but I believe social media is...'",
    null
  );

  insertSection.run('L4-01', 5, 'review', 'Review & Mini Quiz',
    `Excellent debating! Today we learned: how to structure arguments, polite agreeing/disagreeing, and linking words (however, furthermore, although, therefore). Quiz time!`,
    JSON.stringify([
      "Quiz 1: What's a polite way to disagree? (Answer: I see your point, but...)",
      "Quiz 2: Fill in: '___ it was raining, we went outside.' (Answer: Although)",
      "Quiz 3: Which word adds another reason: However or Furthermore? (Answer: Furthermore)",
      "Quiz 4: How do you conclude an argument? (Answer: Therefore, / In conclusion, / To sum up,)",
      "Quiz 5: Structure order: Evidence → Opinion → Reason → Conclusion. Fix it! (Answer: Opinion → Reason → Evidence → Conclusion)"
    ]),
    "Quiz 1: What's a polite way to disagree with someone in English?",
    null
  );

});

seedData();

console.log('Database seeded successfully!');
console.log(`Database path: ${DB_PATH}`);

// Count what we created
const levelCount = db.prepare('SELECT COUNT(*) as c FROM levels').get().c;
const lessonCount = db.prepare('SELECT COUNT(*) as c FROM lessons').get().c;
const sectionCount = db.prepare('SELECT COUNT(*) as c FROM sections').get().c;
console.log(`Levels: ${levelCount}, Lessons: ${lessonCount}, Sections: ${sectionCount}`);

db.close();
