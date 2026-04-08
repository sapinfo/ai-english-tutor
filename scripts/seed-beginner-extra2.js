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

  // ===== L1-14: Weather & Seasons =====
  addLesson('L1-14', 1, 14, 'Weather & Seasons', 'Talk about the weather and describe seasons', 'It is + weather adjective, Present Simple for habits & facts', [
    { type: 'warmup', title: 'Weather Vocabulary',
      script: `Today we're going to talk about the weather! It's one of the most common conversation topics in English. People LOVE talking about the weather. Let me teach you the important words.`,
      examples: ["sunny — 맑은", "cloudy — 흐린", "rainy — 비 오는", "snowy — 눈 오는", "windy — 바람 부는", "hot — 더운", "cold — 추운", "warm — 따뜻한", "cool — 시원한", "humid — 습한", "foggy — 안개 낀", "stormy — 폭풍우의"],
      practice: "Look outside! How's the weather today? Say: 'It's ___ today.'",
      vocab: ["sunny", "cloudy", "rainy", "snowy", "windy", "hot", "cold", "warm", "cool", "humid"] },
    { type: 'core', title: 'Talking About Today\'s Weather',
      script: `To talk about the weather, we use "It's ___." or "It is ___." We also use "What's the weather like?" to ask. Let me show you common weather conversations.`,
      examples: ["What's the weather like today? — 오늘 날씨 어때요?", "It's sunny and warm. — 맑고 따뜻해요.", "It's raining outside. — 밖에 비가 오고 있어요.", "It's very cold today. — 오늘 정말 추워요.", "It's going to rain tomorrow. — 내일 비가 올 거예요.", "I hope it's nice this weekend. — 이번 주말에 날씨 좋으면 좋겠어요.", "Do I need an umbrella? — 우산 필요해요?", "Yes, you should bring one. — 네, 가져가세요.", "The temperature is 25 degrees. — 기온이 25도예요."],
      practice: "Describe today's weather in detail: 'Today it's ___. The temperature is about ___ degrees.'",
      vocab: ["weather", "outside", "rain", "snow", "umbrella", "temperature", "degrees", "forecast"] },
    { type: 'core', title: 'Seasons & Seasonal Activities',
      script: `Now let's learn about the four seasons! Each season has different weather and fun activities. In Korea, you have very distinct seasons, so this will be easy!`,
      examples: ["spring — 봄: It's warm. Flowers bloom. (따뜻해요. 꽃이 피어요.)", "summer — 여름: It's hot and humid. I go swimming. (덥고 습해요. 수영해요.)", "fall / autumn — 가을: It's cool. The leaves change color. (선선해요. 나뭇잎이 변해요.)", "winter — 겨울: It's cold and snowy. I wear a warm coat. (춥고 눈이 와요. 따뜻한 코트를 입어요.)", "What's your favorite season? — 어떤 계절 좋아해요?", "I like spring because it's warm and beautiful. — 따뜻하고 예뻐서 봄이 좋아요.", "In summer, I like to eat ice cream. — 여름에는 아이스크림 먹는 걸 좋아해요.", "In winter, I like to drink hot chocolate. — 겨울에는 핫초코 마시는 걸 좋아해요."],
      practice: "What's your favorite season and why? Say: 'My favorite season is ___ because ___.'",
      vocab: ["spring", "summer", "fall", "winter", "flower", "leaf", "swim", "ice cream", "season"] },
    { type: 'practice', title: 'Weather Plans Role Play',
      script: `The weather affects our plans! Let's practice making plans based on the weather. I'll describe the weather, and you suggest what we should do.`,
      examples: ["It's sunny and warm. → Let's go to the park!", "It's raining hard. → Let's stay home and watch a movie.", "It's snowing! → Let's make a snowman!", "It's very hot today. → Let's go to the beach or eat ice cream.", "It's a beautiful fall day. → Let's go hiking and see the leaves.", "It's cold and windy. → Let's go to a cafe and drink something warm."],
      practice: "I'll tell you the weather. You suggest a plan! Ready? 'It's a beautiful sunny day today!'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Wonderful! Now you can talk about the weather like a pro! Remember, weather is the easiest way to start a conversation in English. Quiz time!`,
      examples: ["Quiz 1: How do you ask about the weather? (Answer: What's the weather like today?)", "Quiz 2: Name the 4 seasons in English. (Answer: spring, summer, fall/autumn, winter)", "Quiz 3: It's raining. What should you bring? (Answer: an umbrella)", "Quiz 4: 'My favorite season is ___ because ___.' (Your answer!)", "Quiz 5: Describe tomorrow's weather using 'It's going to be ___.'" ] }
  ]);

  // ===== L1-15: Directions & Places in Town =====
  addLesson('L1-15', 1, 15, 'Directions & Places in Town', 'Ask for and give simple directions to places', 'Imperative sentences (Go, Turn), Prepositions of direction (next to, across from)', [
    { type: 'warmup', title: 'Places in Town Vocabulary',
      script: `Today we're going to learn about places in a town and how to give directions! This is super useful when you travel or help someone find their way.`,
      examples: ["bank — 은행", "hospital — 병원", "pharmacy — 약국", "post office — 우체국", "supermarket — 슈퍼마켓", "restaurant — 식당", "convenience store — 편의점", "gas station — 주유소", "library — 도서관", "park — 공원", "police station — 경찰서", "subway station — 지하철역", "bus stop — 버스 정류장", "parking lot — 주차장"],
      practice: "What places are near your home? Say: 'Near my home, there is a ___.'",
      vocab: ["bank", "hospital", "pharmacy", "post office", "supermarket", "restaurant", "library", "park", "station"] },
    { type: 'core', title: 'Asking for Directions',
      script: `When you're lost or need to find a place, these phrases will help you! Always start politely with "Excuse me."`,
      examples: ["Excuse me, where is the bank? — 실례합니다, 은행이 어디예요?", "How do I get to the subway station? — 지하철역에 어떻게 가요?", "Is there a pharmacy near here? — 근처에 약국 있어요?", "Can you help me? I'm lost. — 도와주실 수 있어요? 길을 잃었어요.", "How far is it? — 얼마나 멀어요?", "Is it far from here? — 여기서 먼가요?", "It's about 5 minutes on foot. — 걸어서 약 5분이에요.", "It's very close. — 아주 가까워요."],
      practice: "Practice asking: 'Excuse me, where is the ___?'",
      vocab: ["excuse me", "where", "how", "near", "far", "close", "lost", "help", "minutes", "walk"] },
    { type: 'core', title: 'Giving Directions',
      script: `Now let's learn how to GIVE directions. We use action words: go, turn, walk. These are commands — short and clear!`,
      examples: ["Go straight. — 직진하세요.", "Turn left. — 왼쪽으로 도세요.", "Turn right. — 오른쪽으로 도세요.", "Go straight for two blocks. — 두 블록 직진하세요.", "Turn left at the traffic light. — 신호등에서 좌회전하세요.", "It's on your right. — 오른쪽에 있어요.", "It's on your left. — 왼쪽에 있어요.", "It's next to the bank. — 은행 옆에 있어요.", "It's across from the park. — 공원 맞은편에 있어요.", "It's between the cafe and the bookstore. — 카페와 서점 사이에 있어요."],
      practice: "Give me directions from your home to the nearest convenience store!",
      vocab: ["straight", "left", "right", "turn", "block", "traffic light", "corner", "across from", "on your left"] },
    { type: 'practice', title: 'Direction Role Play',
      script: `Let's practice! I'll be a tourist who is lost, and you help me find places. Then we'll switch roles!`,
      examples: ["Tourist: Excuse me, how do I get to the hospital?", "You: Go straight for 3 blocks. Turn right at the big intersection. The hospital is on your left.", "Tourist: Is it far?", "You: No, it's about 10 minutes on foot.", "Tourist: Thank you so much!", "You: You're welcome! Have a nice day."],
      practice: "I'm a tourist! 'Excuse me, can you help me? Where is the nearest subway station?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Excellent! Now you can ask for and give directions in English. This is really helpful when you travel! Quiz time!`,
      examples: ["Quiz 1: How do you politely ask where the bank is? (Answer: Excuse me, where is the bank?)", "Quiz 2: '왼쪽으로 도세요' in English? (Answer: Turn left.)", "Quiz 3: 'The pharmacy is ___ ___ the hospital.' (맞은편) (Answer: across from)", "Quiz 4: How do you ask if a place is far? (Answer: Is it far from here? / How far is it?)", "Quiz 5: Give me directions to your favorite restaurant!"] }
  ]);

  // ===== L1-16: Health & Body =====
  addLesson('L1-16', 1, 16, 'Health & Body', 'Describe body parts and talk about health problems', 'My ___ hurts, I have a ___, Should for advice', [
    { type: 'warmup', title: 'Body Parts Vocabulary',
      script: `Today we're going to learn about the body and health! Knowing body parts in English is important, especially when you visit a doctor. Let me teach you the key words.`,
      examples: ["head — 머리", "face — 얼굴", "eye(s) — 눈", "ear(s) — 귀", "nose — 코", "mouth — 입", "tooth / teeth — 이 / 이빨", "neck — 목", "shoulder(s) — 어깨", "arm(s) — 팔", "hand(s) — 손", "finger(s) — 손가락", "stomach — 배", "back — 등", "leg(s) — 다리", "knee(s) — 무릎", "foot / feet — 발"],
      practice: "Touch your head and say: 'This is my head.' Now try with other body parts!",
      vocab: ["head", "eye", "ear", "nose", "mouth", "hand", "arm", "leg", "foot", "stomach", "back"] },
    { type: 'core', title: 'Describing Health Problems',
      script: `When you don't feel well, you need to explain what's wrong. There are two main patterns: "My ___ hurts" and "I have a ___." Let me teach you both!`,
      examples: ["My head hurts. = I have a headache. — 머리가 아파요.", "My stomach hurts. = I have a stomachache. — 배가 아파요.", "My throat hurts. = I have a sore throat. — 목이 아파요.", "My back hurts. = I have a backache. — 등이 아파요.", "I have a cold. — 감기에 걸렸어요.", "I have a fever. — 열이 나요.", "I have a cough. — 기침이 나요.", "I have a runny nose. — 콧물이 나요.", "I feel dizzy. — 어지러워요.", "I don't feel well. — 몸이 안 좋아요."],
      practice: "Imagine you're sick. Tell me: 'I don't feel well. My ___ hurts.' or 'I have a ___.'",
      vocab: ["hurt", "headache", "stomachache", "cold", "fever", "cough", "sore throat", "dizzy", "sick"] },
    { type: 'core', title: 'Giving Health Advice',
      script: `When someone is sick, you can give advice using "You should ___." This means it's a good idea. Let me teach you common health advice.`,
      examples: ["You should see a doctor. — 병원에 가봐야 해요.", "You should take some medicine. — 약을 먹어야 해요.", "You should rest at home. — 집에서 쉬어야 해요.", "You should drink warm water. — 따뜻한 물을 마셔야 해요.", "You should get some sleep. — 잠을 좀 자야 해요.", "You shouldn't go to work. — 출근하면 안 돼요.", "You shouldn't eat spicy food. — 매운 음식 먹으면 안 돼요.", "Take care! — 몸조리 잘해요!", "Get well soon! — 빨리 나으세요!"],
      practice: "I have a terrible headache. What should I do? Give me advice using 'You should ___.'",
      vocab: ["should", "doctor", "medicine", "rest", "sleep", "take care", "get well", "healthy"] },
    { type: 'practice', title: 'At the Doctor\'s Office',
      script: `Let's role play! You're visiting a doctor. I'll be the doctor and ask you questions. You describe your symptoms!`,
      examples: ["Doctor: Hello! What seems to be the problem?", "Patient: I don't feel well. I have a headache and a sore throat.", "Doctor: How long have you had these symptoms?", "Patient: Since yesterday.", "Doctor: Do you have a fever?", "Patient: Yes, I think so. I feel hot.", "Doctor: You should rest and take this medicine.", "Patient: Thank you, doctor."],
      practice: "Let's start! I'm the doctor. 'Hello! What brings you here today?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great job! You can now talk about your body, describe health problems, and give advice. Very useful in real life! Quiz time!`,
      examples: ["Quiz 1: How do you say 머리가 아파요? (Answer: My head hurts. / I have a headache.)", "Quiz 2: Your friend has a cold. Give advice. (Answer: You should rest and drink warm water.)", "Quiz 3: Name 5 body parts in English.", "Quiz 4: 'I have a ___.' (기침) (Answer: cough)", "Quiz 5: What do you say when someone is sick? (Answer: Take care! / Get well soon!)"] }
  ]);

  // ===== L1-17: Hobbies & Free Time =====
  addLesson('L1-17', 1, 17, 'Hobbies & Free Time', 'Talk about hobbies and what you do in your free time', 'Like + verb-ing (gerund), How often + frequency adverbs', [
    { type: 'warmup', title: 'Hobby Vocabulary',
      script: `Today we're going to talk about hobbies and free time! Everyone has things they love to do. Let me teach you hobby words in English.`,
      examples: ["reading — 독서", "cooking — 요리", "drawing / painting — 그림 그리기", "singing — 노래 부르기", "dancing — 춤추기", "hiking — 등산", "gaming — 게임하기", "photography — 사진 촬영", "watching movies — 영화 보기", "listening to music — 음악 듣기", "traveling — 여행하기", "gardening — 정원 가꾸기", "yoga — 요가", "cycling — 자전거 타기"],
      practice: "What are your hobbies? Say: 'My hobby is ___.' or 'My hobbies are ___ and ___.'",
      vocab: ["hobby", "reading", "cooking", "drawing", "singing", "hiking", "gaming", "photography", "traveling"] },
    { type: 'core', title: 'Like + Verb-ing',
      script: `To talk about things you enjoy, use "I like ___-ing." Adding "-ing" to a verb makes it a hobby or activity. This is very natural in English!`,
      examples: ["I like reading books. — 책 읽는 걸 좋아해요.", "I like cooking Korean food. — 한국 음식 만드는 걸 좋아해요.", "I love watching movies. — 영화 보는 걸 아주 좋아해요.", "I enjoy listening to music. — 음악 듣는 걸 즐겨요.", "I don't like running. — 달리기는 안 좋아해요.", "Do you like hiking? — 등산 좋아해요?", "What do you like doing in your free time? — 여가 시간에 뭐 하는 걸 좋아해요?", "I'm interested in photography. — 사진 촬영에 관심이 있어요."],
      practice: "Tell me 3 things you like doing: 'I like ___-ing, ___-ing, and ___-ing.'",
      vocab: ["like", "love", "enjoy", "hate", "don't like", "interested in", "free time", "in my spare time"] },
    { type: 'core', title: 'How Often? Frequency Words',
      script: `Now let's learn how to say HOW OFTEN you do your hobbies. These words go before the main verb!`,
      examples: ["always (100%) — 항상: I always listen to music.", "usually (80%) — 보통: I usually read before bed.", "often (60%) — 자주: I often go hiking on weekends.", "sometimes (40%) — 가끔: I sometimes cook dinner.", "rarely / seldom (10%) — 거의 안: I rarely play games.", "never (0%) — 절대 안: I never go dancing.", "How often do you exercise? — 얼마나 자주 운동해요?", "I exercise three times a week. — 일주일에 세 번 운동해요.", "Once a month, I go hiking. — 한 달에 한 번 등산해요.", "Every day, I read the news. — 매일 뉴스를 읽어요."],
      practice: "How often do you do your hobby? 'I ___ (frequency) ___ (hobby).'",
      vocab: ["always", "usually", "often", "sometimes", "rarely", "never", "every day", "once a week", "twice"] },
    { type: 'practice', title: 'Hobby Interview',
      script: `Let's interview each other about our hobbies! I'll ask you questions, and then you ask me. This is great practice for real conversations!`,
      examples: ["What do you like doing in your free time?", "How often do you do it?", "When did you start this hobby?", "Who do you do it with?", "Do you like indoor or outdoor activities?", "What new hobby do you want to try?"],
      practice: "I'll start: 'What do you like doing in your free time?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Awesome work! You can now talk all about your hobbies and how often you do them. This makes conversations so much more interesting! Quiz time!`,
      examples: ["Quiz 1: How do you say 요리하는 걸 좋아해요? (Answer: I like cooking.)", "Quiz 2: Put the frequency in order: sometimes, always, never, usually. (Answer: never → sometimes → usually → always)", "Quiz 3: 'How ___ do you exercise?' (Answer: often)", "Quiz 4: What do you like doing on weekends? (Your answer with like + -ing!)", "Quiz 5: Tell me a hobby you do 'sometimes' and one you do 'every day.'"] }
  ]);

  // ===== L1-18: Shopping & Money =====
  addLesson('L1-18', 1, 18, 'Shopping & Money', 'Buy things at a store and talk about prices', 'How much is/are, I\'d like + noun, Numbers for prices', [
    { type: 'warmup', title: 'Shopping Vocabulary',
      script: `Today we're going to learn about shopping! Whether you're at a market, a mall, or online, these English phrases will be very helpful. Let's start with basic words.`,
      examples: ["shop / store — 가게", "mall / shopping center — 쇼핑몰", "price — 가격", "cheap — 싼", "expensive — 비싼", "sale — 할인", "discount — 할인", "cash — 현금", "credit card — 신용카드", "receipt — 영수증", "size — 사이즈", "try on — 입어보다", "customer — 고객", "cashier — 계산원"],
      practice: "Do you like shopping? Say: 'I like / don't like shopping because ___.'",
      vocab: ["shop", "price", "cheap", "expensive", "sale", "cash", "credit card", "receipt", "size"] },
    { type: 'core', title: 'Asking About Prices',
      script: `The most important question when shopping: "How much?" Let me teach you how to ask about prices and understand the answers.`,
      examples: ["How much is this? — 이거 얼마예요?", "How much are these shoes? — 이 신발 얼마예요?", "It's 20 dollars. — 20달러예요.", "They're 50,000 won. — 5만원이에요.", "That's too expensive. — 너무 비싸요.", "That's a good price! — 괜찮은 가격이네요!", "Is it on sale? — 세일 중이에요?", "Can I get a discount? — 할인 가능해요?", "It's 30% off. — 30% 할인이에요.", "Do you accept credit cards? — 카드 되나요?"],
      practice: "Point to something near you and ask: 'How much is this ___?'",
      vocab: ["how much", "dollar", "won", "price", "too expensive", "on sale", "discount", "percent off"] },
    { type: 'core', title: 'Shopping Conversations',
      script: `Now let's learn the full conversation you might have in a store. From entering the store to paying — I'll teach you every step!`,
      examples: ["Can I help you? — 도와드릴까요?", "I'm just looking, thanks. — 그냥 구경하는 거예요, 감사해요.", "I'm looking for a jacket. — 재킷을 찾고 있어요.", "I'd like this one, please. — 이걸로 주세요.", "Do you have this in a different size? — 다른 사이즈 있어요?", "Can I try this on? — 이거 입어봐도 돼요?", "Where is the fitting room? — 탈의실 어디예요?", "It fits perfectly! — 딱 맞아요!", "It's too big / too small. — 너무 커요 / 너무 작아요.", "I'll take it! — 이걸로 할게요!", "Can I pay by card? — 카드로 결제해도 돼요?", "Here's your receipt. — 영수증이요."],
      practice: "Practice: 'Excuse me, I'm looking for ___. How much is it?'",
      vocab: ["looking for", "I'd like", "try on", "fitting room", "size", "fits", "too big", "too small", "take", "pay"] },
    { type: 'practice', title: 'Shopping Role Play',
      script: `Let's go shopping! I'll be the store clerk and you're the customer. We'll practice a complete shopping conversation from start to finish!`,
      examples: ["Clerk: Welcome! Can I help you?", "Customer: Yes, I'm looking for a gift for my friend.", "Clerk: How about this scarf? It's very popular.", "Customer: It's nice! How much is it?", "Clerk: It's 25 dollars. It's on sale today!", "Customer: Great! I'll take it. Can I pay by card?", "Clerk: Of course! Here's your receipt. Thank you!", "Customer: Thank you! Have a nice day!"],
      practice: "Welcome to my store! I'm the clerk. 'Hello! Welcome! Can I help you find something?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Fantastic! You're ready to shop in English! You can ask about prices, try things on, and pay. Very practical skills! Quiz time!`,
      examples: ["Quiz 1: How do you ask the price? (Answer: How much is this?)", "Quiz 2: The clerk asks 'Can I help you?' but you just want to look. What do you say? (Answer: I'm just looking, thanks.)", "Quiz 3: You want to try on a shirt. What do you say? (Answer: Can I try this on?)", "Quiz 4: 'I'd ___ this one, please.' (Answer: like)", "Quiz 5: You decided to buy it. What do you say? (Answer: I'll take it!)"] }
  ]);

});

seed();
console.log('Seeded L1-14 ~ L1-18 (Beginner extra lessons 2)');
db.close();
