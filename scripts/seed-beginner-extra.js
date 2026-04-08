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

  // ===== L1-09: Colors, Shapes & Clothes =====
  addLesson('L1-09', 1, 9, 'Colors, Shapes & Clothes', 'Describe objects using colors and talk about what you wear', 'Adjective + Noun order (a red shirt, a big bag)', [
    { type: 'warmup', title: 'Color Vocabulary',
      script: `Today we're going to learn about colors and clothes! Colors are everywhere, and knowing them in English is super useful. Let me teach you the basic colors first.`,
      examples: ["red — 빨간", "blue — 파란", "green — 초록", "yellow — 노란", "black — 검은", "white — 하얀", "orange — 주황", "pink — 분홍", "purple — 보라", "brown — 갈색", "gray — 회색"],
      practice: "What's your favorite color? Say: 'My favorite color is ___.'",
      vocab: ["red", "blue", "green", "yellow", "black", "white", "orange", "pink", "purple", "brown"] },
    { type: 'core', title: 'Describing with Colors & Adjectives',
      script: `In English, the color (adjective) comes BEFORE the noun. This is different from Korean! For example: a red shirt (빨간 셔츠), NOT a shirt red. Let me show you more examples.`,
      examples: ["a red shirt — 빨간 셔츠", "a blue bag — 파란 가방", "a big black car — 크고 검은 차", "a small white cat — 작고 하얀 고양이", "What color is it? — 무슨 색이에요?", "It's blue. — 파란색이에요.", "I like the green one. — 초록색 거 좋아요.", "The round table — 둥근 탁자", "The square box — 네모난 상자"],
      practice: "Look around you. Describe something: 'I see a ___ ___.' (color + thing)",
      vocab: ["color", "round", "square", "big", "small", "long", "short"] },
    { type: 'core', title: 'Talking About Clothes',
      script: `Now let's learn clothing words! I'll also teach you how to say what you're wearing today.`,
      examples: ["shirt / T-shirt — 셔츠 / 티셔츠", "pants / jeans — 바지 / 청바지", "jacket / coat — 재킷 / 코트", "dress — 원피스", "skirt — 치마", "shoes / sneakers — 신발 / 운동화", "hat / cap — 모자", "socks — 양말", "I'm wearing a blue shirt. — 파란 셔츠를 입고 있어요.", "She's wearing a red dress. — 그녀는 빨간 원피스를 입고 있어요.", "What are you wearing today? — 오늘 뭐 입고 있어요?"],
      practice: "Tell me: 'I'm wearing ___.' Describe what you have on right now!",
      vocab: ["shirt", "pants", "jacket", "dress", "shoes", "hat", "socks", "wearing"] },
    { type: 'practice', title: 'Guessing Game: What Am I Describing?',
      script: `Let's play a guessing game! I'll describe something using colors and shapes, and you guess what it is. Then you describe something for me!`,
      examples: ["It's round and orange. You can eat it. (Answer: an orange)", "It's small, square, and black. You use it every day. (Answer: a phone)", "It's long and yellow. You write with it. (Answer: a pencil)", "It's big and white. You sleep on it. (Answer: a bed)", "Now your turn! Describe something and I'll guess."],
      practice: "Describe something in the room: 'It's ___ and ___. You use it for ___.'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great job! We learned colors, shapes, clothes, and how to describe things in English. Remember: adjective comes BEFORE the noun! Quiz time!`,
      examples: ["Quiz 1: How do you say 파란 가방 in English? (Answer: a blue bag)", "Quiz 2: What are you wearing today? (Answer with: I'm wearing ___)", "Quiz 3: 'It's a ___ ___ car.' (big, black) — What's the correct order? (Answer: big black)", "Quiz 4: What shape is a ball? (Answer: round)", "Quiz 5: Name 3 colors you can see right now!"] }
  ]);

  // ===== L1-10: My Home & Room =====
  addLesson('L1-10', 1, 10, 'My Home & Room', 'Describe your home, rooms, and furniture', 'There is / There are, Prepositions of place (in, on, under, next to)', [
    { type: 'warmup', title: 'Home & Room Vocabulary',
      script: `Today we're going to talk about where you live! Home is where the heart is, right? Let me teach you words for rooms and things in your home.`,
      examples: ["house — 집", "apartment — 아파트", "bedroom — 침실", "living room — 거실", "kitchen — 부엌", "bathroom — 화장실", "balcony — 발코니", "bed — 침대", "desk — 책상", "chair — 의자", "sofa / couch — 소파", "table — 탁자", "refrigerator / fridge — 냉장고", "window — 창문", "door — 문"],
      practice: "Do you live in a house or an apartment? Say: 'I live in a/an ___.'",
      vocab: ["house", "apartment", "bedroom", "living room", "kitchen", "bathroom", "bed", "desk", "chair", "sofa", "table"] },
    { type: 'core', title: 'There Is / There Are',
      script: `To describe what's in a room, we use "There is" for one thing and "There are" for many things. This is very useful!`,
      examples: ["There is a bed in my room. — 내 방에 침대가 있어요.", "There is a TV in the living room. — 거실에 TV가 있어요.", "There are two windows in the kitchen. — 부엌에 창문이 두 개 있어요.", "There are many books on the desk. — 책상 위에 책이 많아요.", "Is there a balcony? — 발코니 있어요?", "Yes, there is. / No, there isn't. — 네, 있어요. / 아니요, 없어요.", "Are there any pictures on the wall? — 벽에 사진 있어요?", "How many rooms are there? — 방이 몇 개예요?"],
      practice: "Describe your room: 'There is a ___ in my room. There are ___ on the ___.'",
      vocab: ["there is", "there are", "many", "any", "wall", "floor", "ceiling"] },
    { type: 'core', title: 'Where Is It? Prepositions',
      script: `Now let's learn how to say WHERE things are. These little words are called prepositions, and they're very important!`,
      examples: ["on — 위에: The book is on the table. (책이 탁자 위에 있어요)", "in — 안에: The clothes are in the closet. (옷이 옷장 안에 있어요)", "under — 아래에: The cat is under the bed. (고양이가 침대 밑에 있어요)", "next to — 옆에: The lamp is next to the bed. (램프가 침대 옆에 있어요)", "between — 사이에: The desk is between the bed and the window. (책상이 침대와 창문 사이에 있어요)", "in front of — 앞에: The TV is in front of the sofa. (TV가 소파 앞에 있어요)", "behind — 뒤에: The garden is behind the house. (정원이 집 뒤에 있어요)"],
      practice: "Look around your room. Where is your phone? 'My phone is ___ the ___.'",
      vocab: ["on", "in", "under", "next to", "between", "in front of", "behind"] },
    { type: 'practice', title: 'Describe Your Dream Home',
      script: `Let's have fun! Imagine your dream home. How many rooms? What furniture? Where is everything? Describe it to me!`,
      examples: ["My dream home is a big house with a garden.", "There are 4 bedrooms and 3 bathrooms.", "In the living room, there is a big sofa and a large TV.", "The kitchen is next to the living room.", "There is a swimming pool behind the house.", "My bedroom has a king-size bed next to the window."],
      practice: "Tell me about your dream home! Start with: 'My dream home is ___. There is/are ___.'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Wonderful! Now you can describe any home in English. You learned room names, furniture, There is/are, and prepositions. Quiz time!`,
      examples: ["Quiz 1: How do you say '내 방에 침대가 있어요'? (Answer: There is a bed in my room.)", "Quiz 2: 'The book is ___ the table.' (on/in/under) (Answer: on)", "Quiz 3: One thing → There ___. Many things → There ___. (Answer: is / are)", "Quiz 4: Where is your TV? (Answer with: The TV is ___ the ___)", "Quiz 5: How many rooms are there in your home?"] }
  ]);

  // ===== L1-11: Feelings & Emotions =====
  addLesson('L1-11', 1, 11, 'Feelings & Emotions', 'Express how you feel and ask about others\' feelings', 'I feel + adjective, Because for giving reasons', [
    { type: 'warmup', title: 'Emotion Vocabulary',
      script: `Today we're going to talk about feelings! Being able to express how you feel is really important. Let me teach you emotion words.`,
      examples: ["happy — 행복한", "sad — 슬픈", "angry — 화난", "tired — 피곤한", "excited — 신나는", "nervous — 긴장되는", "bored — 지루한", "surprised — 놀란", "worried — 걱정되는", "scared — 무서운", "hungry — 배고픈", "sleepy — 졸린", "confused — 혼란스러운"],
      practice: "How are you feeling right now? Say: 'I feel ___.' or 'I'm ___.'",
      vocab: ["happy", "sad", "angry", "tired", "excited", "nervous", "bored", "surprised", "worried", "scared"] },
    { type: 'core', title: 'Expressing Your Feelings',
      script: `There are two easy ways to talk about feelings: "I feel + adjective" or "I'm + adjective." Both are correct! Let me also teach you how to say WHY you feel that way using "because."`,
      examples: ["I feel happy. = I'm happy. — 나는 행복해요.", "I feel tired because I worked late. — 늦게까지 일해서 피곤해요.", "I'm excited because tomorrow is my birthday! — 내일 생일이라서 신나요!", "I'm nervous because I have a test. — 시험이 있어서 긴장돼요.", "I'm bored because there's nothing to do. — 할 게 없어서 지루해요.", "She looks happy. — 그녀는 행복해 보여요.", "He seems tired. — 그는 피곤해 보여요."],
      practice: "Tell me how you feel and why: 'I feel ___ because ___.'",
      vocab: ["feel", "because", "look", "seem", "really", "very", "a little", "so"] },
    { type: 'core', title: 'Asking About Others\' Feelings',
      script: `It's also important to ask how other people are feeling. This shows you care! Let me teach you how to ask and respond.`,
      examples: ["How are you feeling? — 기분이 어때요?", "Are you okay? — 괜찮아요?", "What's wrong? — 무슨 일이에요?", "You look sad. What happened? — 슬퍼 보여요. 무슨 일 있었어요?", "Is everything alright? — 다 괜찮아요?", "I'm sorry to hear that. — 그거 안됐네요.", "That's great! I'm happy for you! — 잘됐다! 축하해!", "Don't worry, it'll be okay. — 걱정 마세요, 괜찮을 거예요.", "Cheer up! — 힘내요!"],
      practice: "Practice asking me: 'How are you feeling today?' and I'll answer!",
      vocab: ["okay", "alright", "wrong", "happened", "sorry", "cheer up", "worry", "great"] },
    { type: 'practice', title: 'Situation Role Play',
      script: `Let's practice with real situations! I'll describe a situation, and you tell me how you would feel. Then we'll practice a short conversation.`,
      examples: ["Situation 1: You got 100% on your English test!", "→ I feel happy/excited because I got a perfect score!", "Situation 2: Your friend cancelled plans at the last minute.", "→ I feel sad/disappointed because my friend cancelled.", "Situation 3: You have a job interview tomorrow.", "→ I feel nervous because I have an interview tomorrow.", "Situation 4: You're waiting in a very long line.", "→ I feel bored/tired because the line is so long."],
      practice: "New situation: You just received a surprise gift from a friend. How do you feel?" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Excellent! You can now express your feelings and ask about others' feelings in English. This is a really valuable skill! Quiz time!`,
      examples: ["Quiz 1: How do you say 피곤해요 in English? (Answer: I'm tired. / I feel tired.)", "Quiz 2: 'I feel ___ because I have a test tomorrow.' (Answer: nervous/worried)", "Quiz 3: Your friend looks sad. What do you say? (Answer: Are you okay? / What's wrong?)", "Quiz 4: How do you say the reason? Use '___'. (Answer: because)", "Quiz 5: How are you feeling right now? Tell me with 'because'!"] }
  ]);

  // ===== L1-12: At School & Learning =====
  addLesson('L1-12', 1, 12, 'At School & Learning', 'Talk about school subjects, learning, and abilities', 'Can / Can\'t for ability, Good at + noun/gerund', [
    { type: 'warmup', title: 'School & Subject Vocabulary',
      script: `Today we're going to talk about school and learning! Even if you're not a student anymore, these words are very useful. Let me teach you school-related vocabulary.`,
      examples: ["school — 학교", "class / classroom — 수업 / 교실", "teacher — 선생님", "student — 학생", "math — 수학", "science — 과학", "English — 영어", "history — 역사", "art — 미술", "music — 음악", "P.E. (physical education) — 체육", "homework — 숙제", "test / exam — 시험", "textbook — 교과서"],
      practice: "What was your favorite subject in school? Say: 'My favorite subject was ___.'",
      vocab: ["math", "science", "English", "history", "art", "music", "homework", "test", "teacher", "student"] },
    { type: 'core', title: 'Can & Can\'t: Talking About Abilities',
      script: `"Can" is a very useful word! It means you have the ability to do something. "Can't" means you cannot. Let me show you how to use them.`,
      examples: ["I can speak English. — 나는 영어를 할 수 있어요.", "I can't swim. — 나는 수영을 못해요.", "Can you play the piano? — 피아노 칠 수 있어요?", "Yes, I can. / No, I can't. — 네, 할 수 있어요. / 아니요, 못해요.", "She can cook very well. — 그녀는 요리를 아주 잘해요.", "He can't drive. — 그는 운전을 못해요.", "I can read Korean but I can't write it. — 한국어 읽기는 되는데 쓰기는 못해요.", "What can you do? — 뭘 할 수 있어요?"],
      practice: "Tell me 2 things you can do and 1 thing you can't do!",
      vocab: ["can", "can't", "speak", "swim", "cook", "drive", "play", "read", "write", "sing"] },
    { type: 'core', title: 'Good At & Learning Expressions',
      script: `Now let's learn how to say what you're good at and what you want to learn. "Good at" means you do something well. "Want to learn" means something you'd like to study.`,
      examples: ["I'm good at math. — 나는 수학을 잘해요.", "I'm not good at cooking. — 나는 요리를 못해요.", "She's good at drawing. — 그녀는 그림을 잘 그려요.", "What are you good at? — 뭘 잘해요?", "I want to learn English. — 영어를 배우고 싶어요.", "I'm studying Korean. — 한국어를 공부하고 있어요.", "It's easy/hard for me. — 나한테 쉬워요/어려워요.", "Practice makes perfect! — 연습이 완벽을 만들어요!"],
      practice: "Tell me: 'I'm good at ___.' and 'I want to learn ___.'",
      vocab: ["good at", "bad at", "study", "learn", "practice", "easy", "hard", "difficult", "improve"] },
    { type: 'practice', title: 'Ability Interview',
      script: `Let's do a fun interview! I'll ask you about your abilities and skills, and you answer. Then you can ask me questions too!`,
      examples: ["Can you cook? What can you make?", "Are you good at sports? Which ones?", "Can you play any musical instruments?", "What languages can you speak?", "What do you want to learn this year?", "Are you good at using computers?"],
      practice: "Let's start! Can you cook? Tell me about it." },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Great work! You learned school vocabulary, can/can't, and how to talk about your abilities. Remember: practice makes perfect! Quiz time!`,
      examples: ["Quiz 1: How do you say 나는 수영을 할 수 있어요? (Answer: I can swim.)", "Quiz 2: 'I'm ___ ___ math.' (잘하다) (Answer: good at)", "Quiz 3: Can you speak English? (Answer: Yes, I can!)", "Quiz 4: What do you want to learn? (Answer with: I want to learn ___)", "Quiz 5: Tell me 3 things you can do!"] }
  ]);

  // ===== L1-13: Making Plans & Invitations =====
  addLesson('L1-13', 1, 13, 'Making Plans & Invitations', 'Make plans with friends and respond to invitations', 'Let\'s + verb, Want to + verb, Have to + verb', [
    { type: 'warmup', title: 'Activity & Plan Vocabulary',
      script: `Today we're going to learn how to make plans and invite friends! This is really useful for social life. Let me teach you activity words first.`,
      examples: ["watch a movie — 영화 보다", "go shopping — 쇼핑 가다", "eat out — 외식하다", "go to a cafe — 카페 가다", "play games — 게임하다", "go for a walk — 산책하다", "have dinner — 저녁 먹다", "hang out — 놀다", "work out / exercise — 운동하다", "stay home — 집에 있다", "this weekend — 이번 주말", "tonight — 오늘 밤", "tomorrow — 내일"],
      practice: "What do you like to do on weekends? Say: 'On weekends, I like to ___.'",
      vocab: ["movie", "shopping", "cafe", "walk", "dinner", "hang out", "exercise", "weekend", "tonight", "tomorrow"] },
    { type: 'core', title: 'Making Plans: Let\'s & Want to',
      script: `To suggest doing something together, we use "Let's ___!" It's friendly and casual. You can also ask "Do you want to ___?" Let me show you.`,
      examples: ["Let's watch a movie! — 영화 보자!", "Let's go eat lunch. — 점심 먹으러 가자.", "Do you want to go shopping? — 쇼핑 갈래?", "Do you want to hang out this weekend? — 이번 주말에 놀래?", "How about going to a cafe? — 카페 가는 거 어때?", "Why don't we try that new restaurant? — 그 새 식당 가보는 거 어때?", "What do you want to do? — 뭐 하고 싶어?", "Where do you want to go? — 어디 가고 싶어?"],
      practice: "Invite me somewhere! Say: 'Let's ___!' or 'Do you want to ___?'",
      vocab: ["let's", "want to", "how about", "why don't we", "together", "shall we"] },
    { type: 'core', title: 'Accepting & Declining Invitations',
      script: `When someone invites you, you need to know how to say yes or no politely. Especially saying "no" nicely is very important in English!`,
      examples: ["Sure! Sounds great! — 좋아! 좋은데!", "That sounds fun! — 재미있겠다!", "I'd love to! — 그러고 싶어!", "OK, when and where? — 좋아, 언제 어디서?", "Sorry, I can't. I have to work. — 미안, 안 돼. 일해야 해.", "I'm busy that day. — 그날 바빠.", "Maybe next time? — 다음에?", "I'd love to, but I have plans already. — 그러고 싶은데, 이미 약속이 있어.", "Are you free on Saturday? — 토요일에 시간 돼?", "What time works for you? — 몇 시가 좋아?"],
      practice: "I'll invite you: 'Do you want to go to a cafe this Saturday?' How do you respond?",
      vocab: ["sure", "sounds", "love to", "sorry", "busy", "free", "plans", "next time", "already"] },
    { type: 'practice', title: 'Role Play: Planning a Weekend',
      script: `Let's plan a weekend together! We'll practice the whole conversation: suggesting, asking about time, accepting or declining.`,
      examples: ["A: Hey! Are you free this Saturday?", "B: Yes, I'm free! What's up?", "A: Do you want to watch a movie?", "B: Sure, sounds great! What time?", "A: How about 3 o'clock?", "B: Perfect! Where should we meet?", "A: Let's meet at the subway station.", "B: OK! See you Saturday at 3!"],
      practice: "Let's try! I'll start: 'Hey! Are you free this weekend?'" },
    { type: 'review', title: 'Review & Mini Quiz',
      script: `Awesome! Now you can make plans, invite friends, and respond to invitations in English. This is great for making English-speaking friends! Quiz time!`,
      examples: ["Quiz 1: How do you suggest watching a movie together? (Answer: Let's watch a movie!)", "Quiz 2: How do you ask '이번 주말에 시간 돼?' (Answer: Are you free this weekend?)", "Quiz 3: Your friend invites you but you're busy. What do you say? (Answer: Sorry, I can't. I'm busy that day.)", "Quiz 4: 'Do you ___ to go shopping?' (Answer: want)", "Quiz 5: Invite me to do something fun this weekend!"] }
  ]);

});

seed();
console.log('Seeded L1-09 ~ L1-13 (Beginner extra lessons)');
db.close();
