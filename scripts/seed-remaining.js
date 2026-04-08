import Database from 'better-sqlite3';
import { resolve } from 'path';

const db = new Database(resolve('data/tutor.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const insertLesson = db.prepare('INSERT OR REPLACE INTO lessons (id, level_id, sort_order, title, goal, grammar_focus) VALUES (?, ?, ?, ?, ?, ?)');
const insertSection = db.prepare('INSERT OR REPLACE INTO sections (lesson_id, sort_order, type, title, teacher_script, examples, practice_prompt, vocabulary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

function addLesson(id, levelId, order, title, goal, grammar, sections) {
  insertLesson.run(id, levelId, order, title, goal, grammar);
  // Clear old sections
  db.prepare('DELETE FROM sections WHERE lesson_id = ?').run(id);
  sections.forEach((s, i) => {
    insertSection.run(id, i + 1, s.type, s.title, s.script, JSON.stringify(s.examples || []), s.practice || null, JSON.stringify(s.vocab || []));
  });
}

const seed = db.transaction(() => {

  // ===== L1-06: Directions & Places =====
  addLesson('L1-06', 1, 6, 'Directions & Places', 'Ask for and give simple directions', 'Prepositions of place (in, on, at, next to, between)', [
    { type: 'warmup', title: 'Place Vocabulary',
      script: `Today we're going to learn how to ask for directions and talk about places! This is very useful when you travel or need to find something. Let me teach you important place words first.`,
      examples: ["bank — 은행", "hospital — 병원", "post office — 우체국", "supermarket — 슈퍼마켓", "pharmacy / drugstore — 약국", "restaurant — 식당", "subway station — 지하철역", "bus stop — 버스 정류장", "parking lot — 주차장", "police station — 경찰서", "library — 도서관", "park — 공원"],
      practice: "Can you name a place near your home in English?",
      vocab: ["bank", "hospital", "post office", "supermarket", "pharmacy", "restaurant", "subway station", "bus stop"] },
    { type: 'core', title: 'Asking for Directions',
      script: `Now let me teach you how to ask where something is. The most common question is "Where is the ___?" or "How do I get to ___?" Let me show you several ways to ask.`,
      examples: ["Where is the bank? — 은행이 어디예요?", "How do I get to the station? — 역에 어떻게 가요?", "Is there a pharmacy near here? — 근처에 약국 있어요?", "Excuse me, can you help me? — 실례합니다, 도와주실 수 있어요?", "I'm looking for the post office. — 우체국을 찾고 있어요.", "Is it far from here? — 여기서 멀어요?", "How far is it? — 얼마나 멀어요?", "Can I walk there? — 걸어갈 수 있어요?"],
      practice: "Try asking: 'Excuse me, where is the ___?'",
      vocab: ["where", "how", "near", "far", "excuse me", "looking for"] },
    { type: 'core', title: 'Giving Directions',
      script: `Now let me teach you how to GIVE directions. These are the most important direction words in English.`,
      examples: ["Go straight. — 직진하세요", "Turn left. — 왼쪽으로 도세요", "Turn right. — 오른쪽으로 도세요", "It's on your left/right. — 왼쪽/오른쪽에 있어요", "It's next to the bank. — 은행 옆에 있어요", "It's between the bank and the hospital. — 은행과 병원 사이에 있어요", "It's across from the park. — 공원 맞은편에 있어요", "Go two blocks and turn right. — 두 블록 가서 우회전하세요", "It's on the corner. — 코너에 있어요"],
      practice: "Try giving me directions from your home to the nearest store!",
      vocab: ["straight", "left", "right", "next to", "between", "across from", "corner", "block"] },
    { type: 'practice', title: 'Role Play: Finding the Way',
      script: `Let's practice! I'm a tourist and I'm lost. I'll ask you for directions, and you help me find places. Let me show you an example conversation first.`,
      examples: ["Tourist: Excuse me, is there a restaurant near here?", "You: Yes! Go straight for two blocks, then turn left.", "Tourist: Is it far?", "You: No, it's about 5 minutes walking.", "Tourist: Thank you so much!", "You: You're welcome! Have a nice day!"],
      practice: "OK, I'm the tourist now: 'Excuse me, how do I get to the subway station?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great job! We learned place names, how to ask for directions, and how to give directions. Quiz time!`,
      examples: ["Quiz 1: How do you ask where the bank is? (Answer: Where is the bank?)", "Quiz 2: What does 'Go straight' mean? (Answer: 직진하세요)", "Quiz 3: 'The pharmacy is ___ the bank.' (next to/between) (Answer: next to)", "Quiz 4: How do you say 맞은편? (Answer: across from)", "Quiz 5: 'Turn ___ at the corner.' (left/right) — Your choice!"] }
  ]);

  // ===== L1-07: Shopping =====
  addLesson('L1-07', 1, 7, 'Shopping', 'Buy things and talk about prices and sizes', 'How much/many, This/That/These/Those', [
    { type: 'warmup', title: 'Shopping Vocabulary',
      script: `Today we're going to learn how to shop in English! Whether you're buying clothes, groceries, or electronics, these phrases will help you. Let me start with shopping vocabulary.`,
      examples: ["price — 가격", "size — 사이즈 (small, medium, large, XL)", "color — 색상", "cheap — 싼", "expensive — 비싼", "on sale — 할인 중", "discount — 할인", "receipt — 영수증", "cash — 현금", "credit card — 신용카드", "fitting room — 탈의실", "cashier — 계산대"],
      practice: "Do you prefer shopping online or in stores? Just say 'online' or 'in stores'!",
      vocab: ["price", "size", "color", "cheap", "expensive", "sale", "discount", "receipt", "cash", "credit card"] },
    { type: 'core', title: 'Asking About Products',
      script: `Now let me teach you the essential shopping phrases. The most important ones are asking about price, size, and availability.`,
      examples: ["How much is this? — 이거 얼마예요?", "How much are these? — 이것들 얼마예요?", "Do you have this in a smaller size? — 더 작은 사이즈 있어요?", "Do you have this in blue? — 파란색 있어요?", "Can I try this on? — 입어봐도 될까요?", "Where is the fitting room? — 탈의실 어디예요?", "I'm just looking, thank you. — 그냥 보는 거예요, 감사합니다", "This/That/These/Those:", "This shirt (가까이 하나) / That shirt (멀리 하나)", "These shoes (가까이 여러개) / Those shoes (멀리 여러개)"],
      practice: "Try asking: 'How much is this?' or 'Do you have this in ___?'",
      vocab: ["how much", "this", "that", "these", "those", "try on", "fitting room"] },
    { type: 'core', title: 'Making a Purchase',
      script: `Now let me teach you how to actually buy something and pay.`,
      examples: ["I'll take this one. — 이걸로 할게요", "I'll take it. — 그걸로 하겠습니다", "Can I pay by credit card? — 카드로 결제 가능한가요?", "Do you accept cash? — 현금 받으시나요?", "Can I get a receipt? — 영수증 주시겠어요?", "Is this on sale? — 이거 할인 중인가요?", "Can I get a discount? — 할인 해주실 수 있나요?", "I'd like to return this. — 이거 반품하고 싶어요", "Can I exchange this? — 교환할 수 있나요?"],
      practice: "Practice: 'I'll take this one. Can I pay by credit card?'",
      vocab: ["take", "pay", "accept", "receipt", "return", "exchange"] },
    { type: 'practice', title: 'Role Play: At a Clothing Store',
      script: `Let's role play! I'm a shop assistant and you're the customer buying clothes.`,
      examples: ["Assistant: Welcome! How can I help you?", "Customer: I'm looking for a jacket.", "Assistant: What size do you need?", "Customer: Medium, please. Do you have it in black?", "Assistant: Yes, here you go! Would you like to try it on?", "Customer: Yes, please. Where is the fitting room?", "Assistant: Right over there. ... How does it fit?", "Customer: It fits perfectly! How much is it?", "Assistant: It's $89. It's 20% off today.", "Customer: Great, I'll take it! Can I pay by card?"],
      practice: "I'm the assistant: 'Welcome! How can I help you today?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Excellent shopping skills! We learned product vocabulary, asking about prices and sizes, and making purchases. Quiz time!`,
      examples: ["Quiz 1: How do you ask the price? (Answer: How much is this?)", "Quiz 2: 'Do you have ___ in a larger size?' (this/these) (Answer: this)", "Quiz 3: How do you say 입어볼게요? (Answer: Can I try this on?)", "Quiz 4: 'I'll ___ it.' (Answer: take)", "Quiz 5: How do you ask for a receipt? (Answer: Can I get a receipt?)"] }
  ]);

  // ===== L1-08: Weather & Seasons =====
  addLesson('L1-08', 1, 8, 'Weather & Seasons', 'Talk about the weather and seasonal activities', 'It + be for weather, Comparative adjectives', [
    { type: 'warmup', title: 'Weather Words',
      script: `Today we're learning about weather and seasons! Weather is one of the most common small talk topics in English. Let me teach you the essential weather vocabulary.`,
      examples: ["sunny — 맑은", "cloudy — 흐린", "rainy — 비 오는", "snowy — 눈 오는", "windy — 바람 부는", "foggy — 안개 낀", "stormy — 폭풍인", "hot — 더운", "warm — 따뜻한", "cool — 시원한", "cold — 추운", "freezing — 매우 추운", "humid — 습한"],
      practice: "What's the weather like today where you are?",
      vocab: ["sunny", "cloudy", "rainy", "snowy", "windy", "hot", "cold", "warm", "cool"] },
    { type: 'core', title: 'Talking About Weather',
      script: `In English, we use "It is" or "It's" to describe weather. We NEVER say "The weather is sunny" — we just say "It's sunny." Let me show you the patterns.`,
      examples: ["What's the weather like today? — 오늘 날씨 어때?", "It's sunny today. — 오늘 맑아요", "It's raining. — 비가 오고 있어요 (지금)", "It's going to rain tomorrow. — 내일 비 올 거예요", "It was cold yesterday. — 어제 추웠어요", "It's getting warmer. — 점점 따뜻해지고 있어요", "The temperature is 25 degrees. — 기온이 25도예요", "It's a beautiful day! — 정말 좋은 날이에요!"],
      practice: "Try saying the weather right now: 'It's ___ today.'",
      vocab: ["temperature", "degrees", "forecast", "beautiful day"] },
    { type: 'core', title: 'Seasons & Comparisons',
      script: `Now let's learn the four seasons and how to compare them. In English, we add "-er" to short adjectives to compare. For example: hot → hotter, cold → colder.`,
      examples: ["Spring (봄) — It's warm and flowers bloom.", "Summer (여름) — It's hot. People go to the beach.", "Fall/Autumn (가을) — It's cool. The leaves change colors.", "Winter (겨울) — It's cold. Sometimes it snows.", "Comparisons:", "Summer is hotter than spring.", "Winter is colder than fall.", "Today is warmer than yesterday.", "Which season do you prefer?", "I prefer spring because it's not too hot and not too cold."],
      practice: "Which season do you like? Try: 'I prefer ___ because it's ___.'",
      vocab: ["spring", "summer", "fall", "autumn", "winter", "hotter", "colder", "warmer"] },
    { type: 'practice', title: 'Weather Small Talk',
      script: `Weather is the #1 small talk topic in English! Let me show you how English speakers start conversations about weather, then we'll practice.`,
      examples: ["Starting a conversation:", "'Nice day, isn't it?' — 좋은 날이죠?", "'Terrible weather we're having!' — 날씨가 정말 안 좋죠!", "'Can you believe this heat?' — 이 더위 믿겨져요?", "'I heard it's going to snow this weekend.'", "Responding:", "'Yes, it's beautiful! Perfect for a walk.'", "'I know, I forgot my umbrella!'", "'It's supposed to clear up later.'"],
      practice: "Let's practice small talk! I'll start: 'Nice weather today, isn't it?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great work! We learned weather words, how to describe weather with 'It's ___', seasons, and weather small talk. Quiz time!`,
      examples: ["Quiz 1: How do you ask about the weather? (Answer: What's the weather like today?)", "Quiz 2: 'It's ___ today.' (맑은) (Answer: sunny)", "Quiz 3: Which is correct: 'It's rain' or 'It's raining'? (Answer: It's raining)", "Quiz 4: Summer is ___ than spring. (Answer: hotter)", "Quiz 5: Name the four seasons! (Answer: spring, summer, fall/autumn, winter)"] }
  ]);

  // ===== L2-02: Future Plans & Goals =====
  addLesson('L2-02', 2, 2, 'Future Plans & Goals', 'Talk about plans and make predictions', 'Going to + verb, Will + verb, Hope to + verb', [
    { type: 'warmup', title: 'Future Time Words',
      script: `Today we're learning how to talk about the future in English! There are two main ways: "going to" for plans you already made, and "will" for decisions you make right now or predictions. Let me start with useful time words.`,
      examples: ["tomorrow — 내일", "next week / next month / next year", "this weekend — 이번 주말", "tonight — 오늘 밤", "in two days — 이틀 후", "soon — 곧", "someday — 언젠가", "in the future — 미래에", "later — 나중에"],
      practice: "Do you have any plans for this weekend? Even in Korean is OK!",
      vocab: ["tomorrow", "next week", "this weekend", "tonight", "soon", "someday", "in the future"] },
    { type: 'core', title: 'Going To — Plans',
      script: `"Be going to" is used when you already have a plan or intention. The pattern is: "I am going to + verb." Let me show you examples.`,
      examples: ["I'm going to visit my parents this weekend.", "She's going to start a new job next month.", "We're going to travel to Japan next year.", "They're going to move to a new apartment.", "I'm going to study English every day.", "He's going to buy a new car.", "Question: Are you going to come to the party?", "Negative: I'm not going to work tomorrow."],
      practice: "Tell me one plan you have: 'I'm going to ___ this weekend.'",
      vocab: ["going to", "plan", "visit", "travel", "move", "start"] },
    { type: 'core', title: 'Will — Decisions & Predictions',
      script: `"Will" is used for decisions you make RIGHT NOW or predictions about the future. The pattern is simple: "I will + verb" or "I'll + verb."`,
      examples: ["Decisions (right now):", "I'll have the chicken, please. (deciding at restaurant)", "I'll help you with that. (offering help now)", "I'll call you later. (deciding now)", "Predictions:", "I think it will rain tomorrow.", "She will be a great doctor someday.", "This project will take about two weeks.", "Going to vs Will:", "I'm going to visit Japan. (already planned) ✓", "I'll visit Japan. (just decided now) ✓", "It's going to rain. (I see dark clouds) ✓", "I think it will rain. (my prediction) ✓"],
      practice: "Make a prediction: 'I think ___ will ___.'",
      vocab: ["will", "I'll", "think", "probably", "definitely", "maybe"] },
    { type: 'practice', title: 'Talking About Your Goals',
      script: `Let's practice talking about your life goals and dreams! We can use "I want to," "I hope to," and "I'd like to" for goals.`,
      examples: ["I want to learn English fluently.", "I hope to travel around the world.", "I'd like to start my own business someday.", "My goal is to pass the English test.", "In five years, I'm going to be fluent in English.", "I plan to save more money this year.", "Someday, I will live abroad.", "My dream is to work for an international company."],
      practice: "Tell me your dream: 'Someday, I want to ___' or 'My goal is to ___.'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Excellent! We learned "going to" for plans, "will" for decisions/predictions, and goal expressions. Quiz time!`,
      examples: ["Quiz 1: 'I ___ visit my friend tomorrow.' (planned) (Answer: am going to)", "Quiz 2: 'I ___ have the pasta.' (deciding now at restaurant) (Answer: will/'ll)", "Quiz 3: What's the difference between 'going to' and 'will'? (Answer: going to = already planned, will = decide now or predict)", "Quiz 4: 'I hope ___ travel to Europe.' (Answer: to)", "Quiz 5: Make a sentence about YOUR plan for next year!"] }
  ]);

  // ===== L2-03: Health & Body =====
  addLesson('L2-03', 2, 3, 'Health & Body', 'Describe symptoms and visit a doctor', 'Should for advice, Have + symptom', [
    { type: 'warmup', title: 'Body Parts & Symptoms',
      script: `Today we're learning about health! Knowing how to describe symptoms in English is essential. Let me teach you body parts and common symptoms.`,
      examples: ["Body parts: head, eyes, ears, nose, throat, neck, back, stomach, chest, arm, leg, knee, foot/feet", "Symptoms:", "headache — 두통", "stomachache — 복통", "backache — 허리 통증", "sore throat — 인후통", "fever — 열", "cough — 기침", "cold — 감기", "flu — 독감", "runny nose — 콧물", "dizzy — 어지러운", "nauseous — 메스꺼운", "tired — 피곤한"],
      practice: "Can you point to your head and say 'head'? Now try 'stomach'!",
      vocab: ["headache", "stomachache", "fever", "cough", "cold", "flu", "sore throat", "dizzy", "tired"] },
    { type: 'core', title: 'Describing How You Feel',
      script: `When you're sick, you need to tell someone how you feel. We use "I have" for symptoms and "I feel" for general feelings.`,
      examples: ["I have a headache. — 머리가 아파요", "I have a stomachache. — 배가 아파요", "I have a fever. — 열이 있어요", "I have a cough. — 기침이 나요", "My back hurts. — 허리가 아파요", "My throat is sore. — 목이 아파요", "I feel sick. — 몸이 안 좋아요", "I feel dizzy. — 어지러워요", "I feel tired. — 피곤해요", "I don't feel well. — 컨디션이 안 좋아요"],
      practice: "Try saying: 'I have a ___' or 'I feel ___'",
      vocab: ["have", "feel", "hurts", "sore", "sick", "well"] },
    { type: 'core', title: 'Giving & Receiving Advice',
      script: `When someone is sick, we give advice using "should" and "shouldn't." The pattern is: "You should + verb." Let me teach you common health advice.`,
      examples: ["You should see a doctor. — 의사를 만나보세요", "You should take some medicine. — 약을 드세요", "You should get some rest. — 쉬세요", "You should drink lots of water. — 물을 많이 드세요", "You should stay home today. — 오늘 집에 있으세요", "You shouldn't go to work. — 출근하면 안 돼요", "You shouldn't eat spicy food. — 매운 음식 드시면 안 돼요", "You need to sleep more. — 더 주무셔야 해요"],
      practice: "I have a headache. What should I do? Try: 'You should ___.'",
      vocab: ["should", "shouldn't", "medicine", "rest", "doctor", "hospital"] },
    { type: 'practice', title: 'Role Play: At the Doctor',
      script: `Let's role play a doctor visit! I'll be the doctor. Tell me your symptoms and I'll give you advice.`,
      examples: ["Doctor: What seems to be the problem?", "Patient: I have a terrible headache and a sore throat.", "Doctor: How long have you had these symptoms?", "Patient: Since yesterday.", "Doctor: Do you have a fever?", "Patient: Yes, I think so.", "Doctor: You should take this medicine and rest for two days.", "Patient: OK, thank you, doctor."],
      practice: "I'm the doctor: 'Good morning! What seems to be the problem?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great job! We learned body parts, symptoms, how to describe how you feel, and giving advice with 'should.' Quiz time!`,
      examples: ["Quiz 1: How do you say 두통? (Answer: headache)", "Quiz 2: 'I ___ a fever.' (have/feel) (Answer: have)", "Quiz 3: 'You ___ see a doctor.' (should/have) (Answer: should)", "Quiz 4: 'My throat is ___.' (Answer: sore)", "Quiz 5: Give me health advice: 'I feel very tired.' (Answer: You should get some rest.)"] }
  ]);

  // ===== L2-04: Travel & Transportation =====
  addLesson('L2-04', 2, 4, 'Travel & Transportation', 'Navigate airports, hotels, and transportation', "Would like to, How questions, There is/are", [
    { type: 'warmup', title: 'Travel Vocabulary',
      script: `Today we're learning travel English! Whether you're at an airport, hotel, or taking a taxi, these words are essential.`,
      examples: ["Airport: terminal, gate, boarding pass, luggage/baggage, check-in, security, customs, passport, departure, arrival, delay, connecting flight", "Hotel: reservation, check-in/check-out, room key, single/double room, lobby, front desk, Wi-Fi", "Transportation: taxi, bus, train, subway, platform, ticket, one-way, round-trip"],
      practice: "Have you traveled abroad? Where did you go?",
      vocab: ["airport", "boarding pass", "luggage", "reservation", "check-in", "ticket", "one-way", "round-trip"] },
    { type: 'core', title: 'At the Airport',
      script: `Let me teach you the essential airport phrases. From check-in to boarding, these will help you navigate any airport.`,
      examples: ["I'd like to check in for my flight. — 체크인하고 싶어요", "Here's my passport and booking confirmation.", "Can I have a window/aisle seat? — 창가/통로 좌석 가능해요?", "How much luggage can I bring? — 짐을 얼마나 가져갈 수 있어요?", "Where is gate B12? — B12 게이트가 어디예요?", "What time does the flight depart? — 비행기 몇 시에 출발해요?", "My flight is delayed. — 비행기가 지연됐어요", "Where is the baggage claim? — 수하물 찾는 곳이 어디예요?"],
      practice: "Try: 'I'd like to check in for my flight to ___.'",
      vocab: ["check in", "window seat", "aisle seat", "gate", "depart", "delayed", "baggage claim"] },
    { type: 'core', title: 'At the Hotel',
      script: `Now let me teach you hotel phrases. These are important for booking and staying at hotels.`,
      examples: ["I have a reservation under the name ___.", "I'd like to book a room for two nights.", "What time is check-out? — 체크아웃 몇 시예요?", "Is breakfast included? — 조식 포함인가요?", "Is there Wi-Fi? What's the password?", "Could I get a wake-up call at 7 AM?", "The air conditioning isn't working. — 에어컨이 안 돼요", "Can I get a late check-out? — 늦은 체크아웃 가능해요?", "I'd like to check out, please."],
      practice: "Try checking in: 'I have a reservation under the name ___.'",
      vocab: ["reservation", "book", "check-out", "breakfast", "included", "Wi-Fi", "wake-up call"] },
    { type: 'practice', title: 'Role Play: Booking & Arriving',
      script: `Let's practice the complete travel experience! I'll play different roles — airline staff, hotel receptionist, taxi driver.`,
      examples: ["Scene 1 — Airport Check-in:", "Staff: Good morning! Where are you flying today?", "You: I'm flying to Tokyo.", "Scene 2 — Hotel:", "Receptionist: Welcome! Do you have a reservation?", "You: Yes, under the name ___.", "Scene 3 — Taxi:", "You: Could you take me to the airport, please?", "Driver: Sure! Which terminal?"],
      practice: "Let's start at the airport! I'm the staff: 'Good morning! May I see your passport?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Wonderful! We covered airport, hotel, and transportation phrases. Quiz time!`,
      examples: ["Quiz 1: How do you ask for a window seat? (Answer: Can I have a window seat?)", "Quiz 2: 'I have a ___ under the name Kim.' (Answer: reservation)", "Quiz 3: How do you ask about check-out time? (Answer: What time is check-out?)", "Quiz 4: 'I'd like a ___ ticket to Busan.' (one-way or round-trip)", "Quiz 5: How do you say 비행기가 지연됐어요? (Answer: My flight is delayed.)"] }
  ]);

  // ===== L2-05: Hobbies & Interests =====
  addLesson('L2-05', 2, 5, 'Hobbies & Interests', 'Talk about hobbies in detail and express preferences', 'Gerunds (enjoy + ing), Present Perfect for experience', [
    { type: 'warmup', title: 'Hobby Vocabulary',
      script: `Today we're going to learn how to talk about hobbies and interests! This is a great conversation topic. Let me teach you common hobby words.`,
      examples: ["reading — 독서", "cooking — 요리", "hiking — 등산", "swimming — 수영", "playing guitar — 기타 치기", "watching movies — 영화 보기", "photography — 사진", "painting / drawing — 그림", "gardening — 정원 가꾸기", "playing video games — 게임하기", "traveling — 여행", "yoga / exercising — 요가 / 운동"],
      practice: "What do you do in your free time? Just name one hobby!",
      vocab: ["hobby", "interest", "free time", "enjoy", "prefer", "passionate", "beginner"] },
    { type: 'core', title: 'Talking About What You Enjoy',
      script: `In English, when we talk about hobbies, we use verb + ing after words like "enjoy," "like," and "love." This is called a gerund. Let me show you.`,
      examples: ["I enjoy reading books. — 책 읽는 것을 즐겨요", "I like cooking Korean food. — 한국 요리하는 것을 좋아해요", "I love watching movies. — 영화 보는 것을 매우 좋아해요", "I'm interested in photography. — 사진에 관심 있어요", "I'm passionate about music. — 음악에 열정적이에요", "I prefer swimming to running. — 달리기보다 수영을 선호해요", "Pattern: enjoy/like/love + verb-ing", "NOT: I enjoy read books ✗", "YES: I enjoy reading books ✓"],
      practice: "Try: 'I enjoy ___ing.' What do you enjoy?",
      vocab: ["enjoy", "interested in", "passionate about", "prefer A to B"] },
    { type: 'core', title: 'Have You Ever...?',
      script: `To ask about experiences, we use "Have you ever + past participle?" This is the Present Perfect tense. It's very useful for talking about life experiences!`,
      examples: ["Have you ever been to Japan? — 일본에 가본 적 있어요?", "Have you ever tried sushi? — 초밥 먹어본 적 있어요?", "Have you ever played golf? — 골프 쳐본 적 있어요?", "Yes, I have. / No, I haven't. / No, never.", "I've been to 10 countries. — 10개국 가봤어요", "I've never tried bungee jumping. — 번지점프 해본 적 없어요", "How long have you been doing ___?", "I've been playing guitar for 5 years."],
      practice: "Ask me: 'Have you ever ___?' — ask me anything!",
      vocab: ["have you ever", "tried", "been to", "never", "for years"] },
    { type: 'practice', title: 'Hobby Conversation',
      script: `Let's have a full conversation about hobbies! I'll ask you questions and you practice answering with full sentences.`,
      examples: ["What do you do in your free time?", "→ In my free time, I enjoy ___.", "How often do you ___?", "→ I ___ about twice a week.", "Have you ever tried ___?", "→ Yes, I have! / No, I haven't, but I'd like to.", "How long have you been ___ing?", "→ I've been ___ing for ___ years.", "Why do you like it?", "→ Because it's relaxing / exciting / fun / creative."],
      practice: "Let's talk! What do you enjoy doing in your free time?" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great conversation! We learned hobby vocabulary, gerunds (enjoy + ing), and 'Have you ever...?' Quiz time!`,
      examples: ["Quiz 1: 'I enjoy ___.' (read → ?) (Answer: reading)", "Quiz 2: 'Have you ever ___ to Paris?' (Answer: been)", "Quiz 3: 'I've been playing piano ___ 10 years.' (Answer: for)", "Quiz 4: Which is correct: 'I like swim' or 'I like swimming'? (Answer: I like swimming)", "Quiz 5: Ask me about a hobby using 'Have you ever...'"] }
  ]);

  // ===== L2-06: Work & Career =====
  addLesson('L2-06', 2, 6, 'Work & Career', 'Discuss jobs, work life, and career aspirations', 'Present Perfect Continuous, Responsible for + gerund', [
    { type: 'warmup', title: 'Job Vocabulary',
      script: `Today we're learning about work and careers! This is essential for professional conversations. Let me teach you job-related vocabulary.`,
      examples: ["Common jobs: teacher, doctor, nurse, engineer, designer, developer, accountant, lawyer, chef, manager, salesperson", "Workplace words:", "office — 사무실", "company — 회사", "colleague / coworker — 동료", "boss / manager — 상사", "meeting — 회의", "deadline — 마감일", "salary — 급여", "promotion — 승진", "resume / CV — 이력서"],
      practice: "What do you do for work? Just say your job title in English if you know it!",
      vocab: ["colleague", "manager", "meeting", "deadline", "salary", "promotion", "resume"] },
    { type: 'core', title: 'Talking About Your Job',
      script: `Let me teach you how to describe your job in English. We use different phrases for your title, duties, and experience.`,
      examples: ["I work as a developer. — 개발자로 일해요", "I work at Samsung. — 삼성에서 일해요", "I work in marketing. — 마케팅 분야에서 일해요", "I'm responsible for managing the team. — 팀 관리를 담당해요", "I've been working here for 3 years. — 여기서 3년째 일하고 있어요", "My job involves a lot of meetings. — 회의가 많아요", "I usually work from 9 to 6. — 보통 9시부터 6시까지 일해요", "I sometimes work overtime. — 가끔 야근해요"],
      practice: "Try: 'I work as a ___' or 'I work at ___.'",
      vocab: ["work as", "work at", "work in", "responsible for", "involves", "overtime"] },
    { type: 'core', title: 'Career Goals & Job Interviews',
      script: `Let me teach you how to talk about career goals and common job interview phrases.`,
      examples: ["Career goals:", "I'd like to get promoted. — 승진하고 싶어요", "I want to change careers. — 이직하고 싶어요", "My goal is to become a manager. — 매니저가 되는 것이 목표예요", "Interview phrases:", "Tell me about yourself. → I'm a ___ with ___ years of experience.", "Why do you want this job? → I'm passionate about ___ and I believe...", "What are your strengths? → I'm a team player and I'm good at ___.", "Where do you see yourself in 5 years? → I see myself leading a team."],
      practice: "Practice: 'Tell me about yourself.' Give a short introduction about your work!",
      vocab: ["promoted", "change careers", "experience", "strengths", "team player", "leading"] },
    { type: 'practice', title: 'Role Play: Job Interview',
      script: `Let's do a mock job interview! I'll be the interviewer. Answer my questions using full sentences.`,
      examples: ["Interviewer: Thank you for coming. Please tell me about yourself.", "You: I'm a ___ with ___ years of experience in ___.", "Interviewer: Why are you interested in this position?", "You: I'm passionate about ___ and I'd love to contribute to ___.", "Interviewer: What's your greatest strength?", "You: I'm very organized and I work well under pressure."],
      practice: "Let's begin! 'Thank you for coming in today. Please tell me about yourself.'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Excellent! We learned job vocabulary, how to describe your work, and interview phrases. Quiz time!`,
      examples: ["Quiz 1: 'I work ___ a designer.' (as/at/in) (Answer: as)", "Quiz 2: 'I've been working here ___ 5 years.' (Answer: for)", "Quiz 3: 'I'm ___ for managing the budget.' (Answer: responsible)", "Quiz 4: How do you say 승진? (Answer: promotion)", "Quiz 5: Answer: 'What are your strengths?'"] }
  ]);

  // ===== L2-07: Opinions & Agreeing/Disagreeing =====
  addLesson('L2-07', 2, 7, 'Opinions & Agreeing/Disagreeing', 'Express opinions politely and discuss topics', 'I think/believe + clause, Discourse markers', [
    { type: 'warmup', title: 'Opinion Words',
      script: `Today we're learning how to express your opinions in English! Being able to agree and disagree politely is a very important social skill. Let me teach you the key phrases.`,
      examples: ["Opinion verbs: think, believe, feel, consider", "Strength levels:", "I think... (basic opinion)", "I believe... (stronger)", "I'm sure... (very confident)", "In my opinion... (formal)", "Personally, I think... (personal view)", "Useful adverbs:", "definitely — 확실히", "probably — 아마", "maybe — 어쩌면", "perhaps — 아마도"],
      practice: "Quick opinion: Do you prefer coffee or tea? Say 'I think ___ is better.'",
      vocab: ["opinion", "agree", "disagree", "believe", "definitely", "probably", "perhaps"] },
    { type: 'core', title: 'Expressing Opinions',
      script: `Let me teach you different ways to share your opinion, from casual to formal.`,
      examples: ["Casual:", "I think Korean food is the best!", "I feel like summer is too hot.", "Formal:", "In my opinion, education is very important.", "From my perspective, we need more parks.", "Giving reasons:", "I think ___ because ___.", "The reason I think ___ is that ___.", "Example: I think reading is important because it improves vocabulary."],
      practice: "Give me your opinion: 'I think ___ because ___.' Pick any topic!",
      vocab: ["in my opinion", "from my perspective", "the reason is", "because"] },
    { type: 'core', title: 'Agreeing & Disagreeing',
      script: `Now let me teach you how to agree and disagree politely. This is essential for good conversations!`,
      examples: ["AGREEING:", "I agree. / I totally agree.", "That's a good point.", "You're right about that.", "I think so too.", "Exactly! / Absolutely!", "POLITE DISAGREEING:", "I see your point, but I think...", "I understand, but...", "That's true, however...", "I'm not sure I agree because...", "I respect that, but personally...", "NEVER: 'You're wrong!' or 'That's stupid!'"],
      practice: "I'll say an opinion, you agree or disagree: 'I think summer is the best season.'",
      vocab: ["agree", "disagree", "however", "actually", "on the other hand"] },
    { type: 'practice', title: 'Discussion Time',
      script: `Let's have a real discussion! I'll bring up topics and we'll exchange opinions. Remember to use 'I think...' and 'I agree/disagree because...'`,
      examples: ["Topic ideas:", "1. Is it better to live in the city or the countryside?", "2. Should students wear uniforms?", "3. Is online shopping better than going to stores?", "4. Are pets good for children?", "5. Is it important to learn a second language?"],
      practice: "Let's discuss: 'Do you think it's better to live in the city or the countryside?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great discussion! We learned opinion phrases, agreeing, and polite disagreeing. Quiz time!`,
      examples: ["Quiz 1: How do you start a formal opinion? (Answer: In my opinion...)", "Quiz 2: Agree with this: 'English is useful.' (Answer: I agree! / I think so too.)", "Quiz 3: Disagree politely: 'Summer is the best.' (Answer: I see your point, but I prefer...)", "Quiz 4: 'I think ___ because ___.' Make your own sentence!", "Quiz 5: What should you NEVER say when disagreeing? (Answer: You're wrong!)"] }
  ]);

  // ===== L2-08: Phone Calls & Messages =====
  addLesson('L2-08', 2, 8, 'Phone Calls & Messages', 'Handle phone conversations and leave messages', 'Could/May for polite requests, Will for promises', [
    { type: 'warmup', title: 'Phone Vocabulary',
      script: `Today we're learning telephone English! Phone calls can be scary in a foreign language because you can't see the other person's face. But with the right phrases, you'll be confident! Let me teach you the basics.`,
      examples: ["call — 전화하다", "answer the phone — 전화 받다", "hang up — 전화 끊다", "hold on — 잠시만요", "line is busy — 통화 중", "leave a message — 메시지 남기다", "voicemail — 음성 메시지", "call back — 다시 전화하다", "wrong number — 잘못 건 전화", "reception — 수신", "text message — 문자", "missed call — 부재중 전화"],
      practice: "Do you prefer phone calls or text messages? Say: 'I prefer ___.'",
      vocab: ["call", "hold on", "leave a message", "voicemail", "call back", "hang up"] },
    { type: 'core', title: 'Making & Answering Calls',
      script: `Let me teach you how to make and answer phone calls in English. There are different phrases for formal and casual calls.`,
      examples: ["ANSWERING:", "Hello? (casual)", "Good morning, this is [name] speaking. (formal)", "MAKING A CALL:", "Hi, this is [name]. (casual)", "Hello, this is [name] from [company]. (formal)", "May I speak to ___? — ___와 통화할 수 있을까요?", "Is ___ available? — ___ 지금 통화 가능해요?", "CONNECTING:", "Hold on, please. / One moment, please.", "Let me transfer you. — 연결해 드리겠습니다", "I'm sorry, she's not available right now."],
      practice: "Practice answering: 'Hello, this is [your name] speaking.'",
      vocab: ["speaking", "available", "transfer", "hold on", "moment"] },
    { type: 'core', title: 'Leaving & Taking Messages',
      script: `Sometimes the person you're calling isn't available. Let me teach you how to leave and take messages.`,
      examples: ["LEAVING A MESSAGE:", "Could you tell her I called?", "Can I leave a message?", "Please tell him to call me back at 010-1234-5678.", "Could you ask her to email me?", "TAKING A MESSAGE:", "Can I take a message?", "Would you like to leave a message?", "I'll make sure he gets the message.", "ENDING A CALL:", "Thank you for calling. / Thanks for your time.", "I'll call you back later.", "Talk to you soon! (casual)", "Have a nice day!"],
      practice: "Try leaving a message: 'Could you tell [name] that ___?'",
      vocab: ["leave a message", "take a message", "call back", "tell him/her"] },
    { type: 'practice', title: 'Role Play: Phone Calls',
      script: `Let's practice phone calls! I'll play different roles and we'll have phone conversations.`,
      examples: ["Scenario 1 — Calling a restaurant:", "You: Hello, I'd like to make a reservation.", "Scenario 2 — Calling a friend:", "You: Hey, it's ___! Are you free this weekend?", "Scenario 3 — Office call:", "You: Hello, this is ___. May I speak to Mr. Kim?", "Receptionist: I'm sorry, he's in a meeting. Can I take a message?"],
      practice: "Let's start! *Ring ring* I'm answering: 'Hello, Seoul Restaurant. How can I help you?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great phone skills! We learned answering/making calls, leaving messages, and polite phone phrases. Quiz time!`,
      examples: ["Quiz 1: How do you answer formally? (Answer: Hello, this is [name] speaking.)", "Quiz 2: 'May I ___ to Mr. Kim?' (Answer: speak)", "Quiz 3: '잠시만요' in English? (Answer: Hold on, please.)", "Quiz 4: How do you leave a message? (Answer: Can I leave a message?)", "Quiz 5: How do you end a call politely? (Answer: Thank you for calling. / Have a nice day!)"] }
  ]);

  // ===== L3-02: Hypothetical Situations =====
  addLesson('L3-02', 3, 2, 'Hypothetical Situations', 'Discuss imaginary scenarios and give advice', 'Second Conditional (If + past, would + verb), I wish + past', [
    { type: 'warmup', title: 'Introduction to "What If"',
      script: `Today we're learning how to talk about imaginary or hypothetical situations! In English, we use a special grammar pattern called the "Second Conditional" to talk about things that are not real but we can imagine. This is a fun topic!`,
      examples: ["What would you do if you won the lottery?", "If I could fly, I would travel the world.", "If I were a celebrity, I would help poor people.", "These are NOT real — they are imaginary!", "We use: If + past tense, would + verb", "Even though we use 'past tense,' we're talking about NOW or FUTURE imaginary situations"],
      practice: "Quick answer: If you had a million dollars, what would you buy?",
      vocab: ["imagine", "suppose", "what if", "would", "could", "hypothetical"] },
    { type: 'core', title: 'Second Conditional Pattern',
      script: `Let me explain the Second Conditional grammar clearly. The pattern is: "If + subject + past verb, subject + would + base verb." Important: we use "were" (not "was") for all subjects in formal English.`,
      examples: ["Pattern: If + past, would + verb", "If I had more time, I would learn piano.", "If she spoke English, she would get that job.", "If we lived in Canada, we would ski every winter.", "If I were you, I'd study harder. (advice)", "If I were rich, I would buy a house.", "Note: 'If I were' (NOT 'If I was') — formal/correct", "Questions: What would you do if you ___?"],
      practice: "Complete this: 'If I had more free time, I would ___.'",
      vocab: ["if", "would", "were", "could", "might"] },
    { type: 'core', title: 'I Wish...',
      script: `Another way to talk about imaginary situations is "I wish." We use "I wish + past tense" to talk about things we want but are not true right now.`,
      examples: ["I wish I spoke English fluently. (But I don't yet)", "I wish I had more free time. (But I'm busy)", "I wish I could travel more. (But I can't right now)", "I wish I lived near the beach. (But I don't)", "I wish I were taller. (But I'm not)", "I wish it weren't raining. (But it is)", "I wish I didn't have to work tomorrow. (But I do)", "Note: 'I wish' = I want something that isn't true now"],
      practice: "Tell me something you wish: 'I wish I ___.'",
      vocab: ["wish", "if only", "imagine"] },
    { type: 'practice', title: 'Fun Hypothetical Questions',
      script: `Let's have fun with hypothetical questions! I'll ask you imaginative questions and you answer using "I would..." or "If I..., I would..."`,
      examples: ["What would you do if you could be invisible for one day?", "If you could live anywhere in the world, where would you live?", "If you could have dinner with anyone in history, who would you choose?", "What would you do if you were the president?", "If you could have any superpower, what would it be?"],
      practice: "Let's start! What would you do if you could travel back in time?" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Fantastic imagination! We learned Second Conditional (If + past, would + verb) and I wish + past. Quiz time!`,
      examples: ["Quiz 1: 'If I ___ more money, I would travel.' (Answer: had)", "Quiz 2: 'I wish I ___ speak French.' (Answer: could)", "Quiz 3: Fix: 'If I was you, I would study.' (Answer: If I were you)", "Quiz 4: Complete: 'What would you do if you ___ the lottery?' (Answer: won)", "Quiz 5: Make an 'I wish' sentence about something you want!"] }
  ]);

  // ===== L3-03: News & Current Events =====
  addLesson('L3-03', 3, 3, 'News & Current Events', 'Discuss news topics and express reactions', 'Passive voice, Reported speech basics', [
    { type: 'warmup', title: 'News Vocabulary',
      script: `Today we're learning how to discuss news and current events in English! This is an important skill for having deeper conversations. Let me teach you news-related vocabulary first.`,
      examples: ["headline — 헤드라인", "article — 기사", "reporter / journalist — 기자", "breaking news — 속보", "source — 출처", "issue — 이슈/문제", "economy — 경제", "environment — 환경", "politics — 정치", "technology — 기술", "global — 세계적인", "local — 지역의", "impact — 영향"],
      practice: "Do you read the news? Where do you get your news from?",
      vocab: ["headline", "article", "breaking news", "issue", "economy", "environment", "impact"] },
    { type: 'core', title: 'Passive Voice in News',
      script: `News articles use a lot of "passive voice." Instead of saying who did something, we focus on what happened. The pattern is: "be + past participle."`,
      examples: ["Active: The company fired 200 workers.", "Passive: 200 workers were fired. (focus on workers)", "Active: Scientists discovered a new species.", "Passive: A new species was discovered.", "Common news passive phrases:", "It was reported that... — ...라고 보도되었다", "It is believed that... — ...라고 믿어진다", "The suspect was arrested. — 용의자가 체포되었다", "The building was destroyed. — 건물이 파괴되었다", "A new law has been passed. — 새 법이 통과되었다"],
      practice: "Try changing: 'Someone stole the painting.' → 'The painting was ___.'",
      vocab: ["was reported", "was discovered", "was arrested", "has been", "were fired"] },
    { type: 'core', title: 'Reacting to News',
      script: `When you hear news, you need to express your reaction! Let me teach you phrases for different emotions about news.`,
      examples: ["Surprise:", "I was surprised to hear that...", "I can't believe that...!", "Really? I had no idea!", "Concern:", "That's worrying / concerning.", "I'm worried about...", "Hope:", "I hope the situation improves.", "Hopefully, they will find a solution.", "Interest:", "That's interesting! Tell me more.", "I've been following that story.", "What's your take on this? — 이것에 대해 어떻게 생각해?"],
      practice: "I'll tell you news, react! 'Scientists say robots will do 50% of jobs by 2040.'",
      vocab: ["surprised", "worried", "concerning", "hopefully", "take on", "following"] },
    { type: 'practice', title: 'News Discussion',
      script: `Let's discuss some topics like a news conversation! I'll bring up a topic and we'll share our views.`,
      examples: ["Topics to discuss:", "1. AI and jobs — Will AI replace human workers?", "2. Climate change — What should countries do?", "3. Social media — Is it good or bad for society?", "4. Education — Should schools teach more technology?", "Use these phrases:", "'According to recent reports...'", "'From what I've read...'", "'I think this is important because...'"],
      practice: "Let's discuss: 'Do you think AI will change education? What do you think?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great discussion! We learned news vocabulary, passive voice, and how to react to news. Quiz time!`,
      examples: ["Quiz 1: Change to passive: 'Police arrested the thief.' (Answer: The thief was arrested.)", "Quiz 2: 'It was ___ that the company will close.' (Answer: reported)", "Quiz 3: How do you express surprise about news? (Answer: I was surprised to hear that... / I can't believe...)", "Quiz 4: What does 'breaking news' mean? (Answer: 속보 — very important, just happened)", "Quiz 5: React to this: 'A new cure for cancer was discovered.'"] }
  ]);

  // ===== L3-04: Describing Processes =====
  addLesson('L3-04', 3, 4, 'Describing Processes', 'Explain how things work step by step', 'Imperative sentences, Sequencing, Need to / Have to', [
    { type: 'warmup', title: 'Process & Instruction Words',
      script: `Today we're learning how to explain processes — how to do things step by step. This is useful for giving instructions, explaining your work, or teaching someone. Let me teach you the key sequence words.`,
      examples: ["First... — 먼저", "Second... / Next... — 다음으로", "Then... / After that... — 그 다음에", "Finally... / Lastly... — 마지막으로", "Before you ___... — ___하기 전에", "After you ___... — ___한 후에", "Make sure you... — 반드시 ___하세요", "Be careful not to... — ___하지 않도록 주의하세요", "The key point is... — 핵심은..."],
      practice: "Can you explain how to make coffee? Just try: 'First, you ___...'",
      vocab: ["first", "next", "then", "after that", "finally", "make sure", "be careful"] },
    { type: 'core', title: 'Giving Clear Instructions',
      script: `When explaining a process, we use "imperative sentences" — these are commands without "I" or "you." Just start with the verb! Let me show you with a simple example: how to make ramen.`,
      examples: ["How to make ramen:", "First, boil some water in a pot.", "Next, open the ramen package.", "Then, put the noodles in the boiling water.", "Add the seasoning powder.", "Cook for 3-4 minutes.", "Finally, serve in a bowl and enjoy!", "Useful patterns:", "You need to ___ before ___.", "Make sure you ___ or it won't work.", "Don't forget to ___.", "The important thing is to ___."],
      practice: "Try explaining how to make your favorite food! Start with 'First...'",
      vocab: ["boil", "add", "mix", "cook", "serve", "prepare", "step", "process"] },
    { type: 'core', title: 'Explaining Work Processes',
      script: `Now let's practice explaining more complex processes — like how you do something at work or how a system works.`,
      examples: ["How I handle a customer complaint:", "First, I listen carefully to the customer's problem.", "Then, I apologize and show empathy.", "After that, I check our system to find a solution.", "Next, I explain the solution to the customer.", "Finally, I follow up to make sure they're satisfied.", "How to send an email:", "First, click 'Compose' or 'New Message.'", "Enter the recipient's email address.", "Write a clear subject line.", "Type your message.", "Review it for mistakes.", "Finally, click 'Send.'"],
      practice: "Explain a process from your daily life or work. Start with 'First, you need to...'",
      vocab: ["handle", "check", "review", "follow up", "require", "complete"] },
    { type: 'practice', title: 'Teach Me Something',
      script: `Now it's your turn to be the teacher! Pick something you know well and explain it to me step by step. I'll be your student and ask questions!`,
      examples: ["Ideas for what to explain:", "1. How to use your favorite app", "2. How you get to work", "3. How to cook a Korean dish", "4. How to do something in your job", "5. How to play a game or sport", "Remember to use: First → Next → Then → Finally", "And: Make sure you... / Don't forget to..."],
      practice: "Pick a topic and start teaching me! Use 'First, you need to...'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Excellent teaching! We learned sequence words, imperative sentences, and how to explain processes clearly. Quiz time!`,
      examples: ["Quiz 1: What comes after 'First'? (Answer: Next / Second / Then)", "Quiz 2: Fix: 'You boil the water first.' → Imperative? (Answer: First, boil the water.)", "Quiz 3: 'Make ___ you check twice.' (Answer: sure)", "Quiz 4: '반드시 확인하세요' in English? (Answer: Make sure you check.)", "Quiz 5: Explain how to make a phone call in 3 steps!"] }
  ]);

  // ===== L4-02: Presentations & Public Speaking =====
  addLesson('L4-02', 4, 2, 'Presentations & Public Speaking', 'Deliver clear presentations and speak confidently', 'Formal register, Transition phrases, Rhetorical questions', [
    { type: 'warmup', title: 'Presentation Structure',
      script: `Today we're learning how to give presentations in English! A good presentation has three parts: Introduction, Body, and Conclusion. Let me teach you the framework.`,
      examples: ["Introduction (10%): Hook the audience", "  'Good morning, everyone.'", "  'Today, I'd like to talk about ___.'", "  'Have you ever wondered why ___?' (rhetorical question)", "Body (80%): Main content, 2-3 key points", "  'Let me start with my first point...'", "  'Moving on to...'", "  'Another important aspect is...'", "Conclusion (10%): Summary + call to action", "  'To sum up...'", "  'In conclusion, I believe...'", "  'Thank you. Any questions?'"],
      practice: "Pick any topic and try the opening: 'Good morning, everyone. Today I'd like to talk about ___.'",
      vocab: ["introduction", "audience", "key point", "conclude", "summarize", "questions"] },
    { type: 'core', title: 'Transition Phrases',
      script: `Transitions are the bridges between your ideas. Without them, your presentation sounds choppy. Let me teach you the essential transitions.`,
      examples: ["Starting: 'Let me begin by...' / 'First of all...'", "Adding: 'In addition...' / 'Furthermore...' / 'Moreover...'", "Examples: 'For instance...' / 'Let me give you an example...'", "Contrasting: 'However...' / 'On the other hand...'", "Emphasizing: 'The key point here is...' / 'What's important to note is...'", "Moving on: 'Now let's move on to...' / 'Turning to our next point...'", "Concluding: 'To sum up...' / 'In conclusion...' / 'To wrap up...'", "Visual aids: 'As you can see on this slide...' / 'This chart shows...'"],
      practice: "Practice: 'Let me begin by talking about ___. Furthermore, ___.'",
      vocab: ["furthermore", "moreover", "for instance", "however", "to sum up", "turning to", "as you can see"] },
    { type: 'core', title: 'Engaging Your Audience',
      script: `A great presenter keeps the audience interested. Let me teach you techniques to engage your audience.`,
      examples: ["Rhetorical questions:", "  'Have you ever thought about how much water we waste?'", "  'What if I told you that 80% of success is showing up?'", "Statistics:", "  'According to a recent study, 70% of employees...'", "  'Research shows that...'", "Personal stories:", "  'Let me share a quick story...'", "  'I once had an experience where...'", "Audience interaction:", "  'Raise your hand if you've ever...'", "  'Think about this for a moment...'", "  'Imagine a world where...'"],
      practice: "Try a rhetorical question: 'Have you ever wondered why ___?'",
      vocab: ["according to", "research shows", "imagine", "raise your hand", "statistics"] },
    { type: 'practice', title: 'Mini Presentation',
      script: `Time to give a 1-minute mini presentation! Pick any topic you know about. Use the structure: Opening → 2 main points → Conclusion. I'll be your audience and give you feedback!`,
      examples: ["Topic suggestions:", "1. Why learning English is important", "2. Your favorite hobby and why", "3. A place everyone should visit", "4. Technology in everyday life", "5. A skill everyone should learn", "Template:", "Opening: 'Good morning! Today I'd like to talk about ___.'", "Point 1: 'First, ___. For example, ___.'", "Point 2: 'Furthermore, ___.'", "Closing: 'In conclusion, I believe ___. Thank you!'"],
      practice: "Go ahead! Start with 'Good morning, everyone! Today I'd like to talk about ___'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Wonderful presentation! We learned presentation structure, transitions, and engagement techniques. Quiz time!`,
      examples: ["Quiz 1: What are the 3 parts of a presentation? (Answer: Introduction, Body, Conclusion)", "Quiz 2: Name 2 transition phrases for adding a point (Answer: Furthermore, Moreover, In addition)", "Quiz 3: How do you end a presentation? (Answer: In conclusion... / To sum up... / Thank you, any questions?)", "Quiz 4: What is a rhetorical question? (Answer: A question you ask but don't expect an answer)", "Quiz 5: Give me an opening for a presentation about your country!"] }
  ]);

  // ===== L4-03: Idioms & Natural Speech =====
  addLesson('L4-03', 4, 3, 'Idioms & Natural Speech', 'Understand and use common English idioms', 'Idiomatic expressions in context, Phrasal verbs', [
    { type: 'warmup', title: 'What Are Idioms?',
      script: `Today we're learning idioms! Idioms are phrases where the meaning is DIFFERENT from the literal words. For example, "It's raining cats and dogs" doesn't mean animals are falling from the sky — it means it's raining very hard! Let me teach you the most common ones.`,
      examples: ["Idiom = words together have a SPECIAL meaning", "'Break a leg!' = Good luck! (NOT actually break your leg)", "'Piece of cake' = Very easy (NOT actual cake)", "'Hit the nail on the head' = Exactly right", "'Under the weather' = Feeling sick", "'Cost an arm and a leg' = Very expensive", "Native speakers use idioms ALL THE TIME", "Learning idioms will make your English sound much more natural!"],
      practice: "Have you heard any English idioms before? Do you know any?",
      vocab: ["idiom", "expression", "literal", "figurative", "meaning"] },
    { type: 'core', title: 'Everyday Idioms',
      script: `Let me teach you 10 idioms you can use every day. I'll explain the meaning and give you an example sentence for each one.`,
      examples: ["1. 'It's a piece of cake' = Very easy. 'The test was a piece of cake!'", "2. 'Break a leg' = Good luck. 'You have a job interview? Break a leg!'", "3. 'Hit the nail on the head' = Exactly right. 'You hit the nail on the head with that answer.'", "4. 'Under the weather' = Feeling sick. 'I'm feeling under the weather today.'", "5. 'Cost an arm and a leg' = Very expensive. 'That car costs an arm and a leg!'", "6. 'Once in a blue moon' = Very rarely. 'I eat fast food once in a blue moon.'", "7. 'Let's call it a day' = Let's stop working. 'It's 6 PM. Let's call it a day.'", "8. 'On the same page' = Agree/understand. 'Are we on the same page?'", "9. 'The ball is in your court' = It's your turn to decide. 'I made my offer. The ball is in your court.'", "10. 'Break the ice' = Start a conversation. 'Tell a joke to break the ice.'"],
      practice: "Try using one: Make a sentence with 'piece of cake' or 'under the weather.'",
      vocab: ["piece of cake", "break a leg", "under the weather", "once in a blue moon", "call it a day", "on the same page"] },
    { type: 'core', title: 'Phrasal Verbs',
      script: `Phrasal verbs are another type of natural English. They're verb + preposition combinations that have special meanings. Let me teach you the most useful ones.`,
      examples: ["look up = search for information. 'Look up the word in a dictionary.'", "give up = stop trying. 'Don't give up! Keep practicing!'", "figure out = understand/solve. 'I can't figure out this problem.'", "put off = postpone. 'Don't put off your homework.'", "come up with = think of (an idea). 'She came up with a great plan.'", "run into = meet by chance. 'I ran into my old teacher yesterday.'", "get along with = have a good relationship. 'I get along with my coworkers.'", "look forward to = be excited about. 'I look forward to the weekend!'"],
      practice: "Try using one: 'I'm looking forward to ___.'",
      vocab: ["look up", "give up", "figure out", "put off", "come up with", "run into", "get along", "look forward to"] },
    { type: 'practice', title: 'Idiom Guessing Game',
      script: `Let's play a game! I'll describe a situation and you guess which idiom fits. Then we'll switch — you describe a situation and I'll guess!`,
      examples: ["Example:", "Me: 'The math exam was so easy. Everyone got 100%.'", "You: 'It was a piece of cake!'", "Me: 'I almost never eat ice cream. Maybe once a year.'", "You: 'Once in a blue moon!'", "Me: 'I don't feel well today. I have a headache and sore throat.'", "You: 'You're feeling under the weather!'"],
      practice: "Let's play! 'My new phone was SO expensive — $1,500!' Which idiom?" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Awesome work with idioms! You're sounding more and more natural. Quiz time — I'll give you the meaning, you give me the idiom!`,
      examples: ["Quiz 1: Very easy = ? (Answer: A piece of cake)", "Quiz 2: Very expensive = ? (Answer: Costs an arm and a leg)", "Quiz 3: 'Don't ___ ___!' = Don't stop trying (Answer: give up)", "Quiz 4: Very rarely = ? (Answer: Once in a blue moon)", "Quiz 5: Use 'look forward to' in a sentence!"] }
  ]);

  // ===== L4-04: Cultural Topics & Discussion =====
  addLesson('L4-04', 4, 4, 'Cultural Topics & Discussion', 'Discuss cultural differences and social topics fluently', 'Complex comparative structures, Abstract noun usage', [
    { type: 'warmup', title: 'Culture Vocabulary',
      script: `Today we're discussing culture — one of the most interesting topics in English! You'll learn how to explain Korean culture and compare it with other cultures. Let me start with essential vocabulary.`,
      examples: ["culture — 문화", "tradition — 전통", "custom — 관습", "values — 가치관", "norm — 규범", "diversity — 다양성", "stereotype — 고정관념", "globalization — 세계화", "generation gap — 세대 차이", "etiquette — 예절", "taboo — 금기", "identity — 정체성", "heritage — 유산"],
      practice: "What's one Korean tradition you're proud of? Try telling me in English!",
      vocab: ["culture", "tradition", "custom", "values", "diversity", "stereotype", "etiquette"] },
    { type: 'core', title: 'Comparing Cultures',
      script: `When comparing cultures, we use special structures. Let me teach you how to make cultural comparisons respectfully and accurately.`,
      examples: ["In Korea, ___ while in America, ___.", "Unlike in Korea, Americans usually ___.", "Korean culture values ___, whereas Western culture values ___.", "One difference is that ___.", "One similarity is that both cultures ___.", "Examples:", "In Korea, people take off their shoes inside, while in America, it depends on the household.", "Korean culture values respect for elders, whereas American culture values individual expression.", "Unlike in Korea, tipping is expected in American restaurants.", "Both Korean and Japanese cultures value hard work and education."],
      practice: "Compare one thing: 'In Korea, ___, while in [country], ___.'",
      vocab: ["while", "whereas", "unlike", "on the other hand", "similarly", "in contrast"] },
    { type: 'core', title: 'Explaining Your Culture',
      script: `Being able to explain your own culture to foreigners is a valuable skill! Let me teach you useful phrases and examples for explaining Korean culture.`,
      examples: ["Explaining customs:", "'In Korean culture, we bow when we greet someone.'", "'We use honorific language when speaking to elders.'", "'It's customary to remove your shoes before entering a home.'", "Explaining why:", "'This tradition dates back to...'", "'The reason for this is...'", "'It's rooted in Confucian values.'", "Common questions foreigners ask:", "'Why do Koreans eat with metal chopsticks?'", "'What is Chuseok?'", "'Why do Koreans ask about age when they first meet?'"],
      practice: "Explain one Korean custom to me as if I'm a foreigner who knows nothing about Korea!",
      vocab: ["customary", "tradition", "dates back to", "rooted in", "Confucian", "honorific"] },
    { type: 'practice', title: 'Cultural Discussion',
      script: `Let's have a deep discussion about cultural topics! I'll bring up interesting questions and we'll exchange ideas.`,
      examples: ["Discussion topics:", "1. How has Korean culture changed in the last 20 years?", "2. What aspects of Korean culture are popular worldwide? (K-pop, K-drama, food)", "3. What cultural differences surprise Koreans when they travel abroad?", "4. Is globalization making all cultures the same?", "5. What Korean values do you think are important to preserve?", "Use: 'I think...', 'In my experience...', 'From a cultural perspective...'"],
      practice: "Let's discuss: Why do you think K-pop and Korean culture became so popular worldwide?" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Wonderful cultural discussion! We learned comparison structures, how to explain your culture, and had deep discussions. Final quiz!`,
      examples: ["Quiz 1: 'In Korea, ___, while in America, ___.' Make your own!", "Quiz 2: What does 'etiquette' mean? (Answer: 예절 — social rules for polite behavior)", "Quiz 3: How do you say 세대 차이? (Answer: generation gap)", "Quiz 4: 'This tradition ___ back to the Joseon Dynasty.' (Answer: dates)", "Quiz 5: Explain one Korean custom in 2-3 sentences!"] }
  ]);

});

seed();

// Report
const lessonCount = db.prepare('SELECT COUNT(*) as c FROM lessons').get().c;
const sectionCount = db.prepare('SELECT COUNT(*) as c FROM sections').get().c;
console.log(`Done! Total: ${lessonCount} lessons, ${sectionCount} sections`);

db.close();
