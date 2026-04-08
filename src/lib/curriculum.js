/**
 * ESL Standard Curriculum
 * Based on CEFR A1~B2 levels
 */
export const CURRICULUM = [
	// ===== LEVEL 1: Beginner (CEFR A1) =====
	{
		level: 1,
		title: 'Beginner',
		cefr: 'A1',
		lessons: [
			{
				id: 'L1-01',
				title: 'Greetings & Self-Introduction',
				goal: 'Introduce yourself and greet others naturally',
				keyPhrases: [
					"Hi, my name is ___.",
					"Nice to meet you.",
					"I'm from ___.",
					"How are you?",
					"I'm fine, thank you."
				],
				vocabulary: ['greeting', 'name', 'country', 'nice', 'meet'],
				grammar: 'Subject + be verb (I am, You are)',
				teacherGuide: 'Start by introducing yourself as Ms. Sarah. Ask the student their name, where they are from, and how they are doing. Practice the phrases back and forth. Correct pronunciation gently.'
			},
			{
				id: 'L1-02',
				title: 'Numbers, Days & Time',
				goal: 'Say numbers, days of the week, and tell time',
				keyPhrases: [
					"What time is it?",
					"It's 3 o'clock.",
					"What day is it today?",
					"Today is Monday.",
					"My phone number is ___."
				],
				vocabulary: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'o\'clock', 'half past'],
				grammar: 'What + be verb questions',
				teacherGuide: 'Practice numbers 1-100 briefly. Ask what day it is, what time it is. Have the student say phone numbers or addresses. Make it interactive with quick quizzes.'
			},
			{
				id: 'L1-03',
				title: 'Family & People',
				goal: 'Talk about family members and describe people',
				keyPhrases: [
					"This is my ___.",
					"I have ___ brothers/sisters.",
					"My mother is a ___.",
					"He/She is ___ years old.",
					"Do you have any siblings?"
				],
				vocabulary: ['mother', 'father', 'brother', 'sister', 'family', 'sibling', 'husband', 'wife', 'children'],
				grammar: 'Have/Has, Possessive adjectives (my, your, his, her)',
				teacherGuide: 'Ask about the student\'s family. How many people? What do they do? Practice he/she/they pronouns naturally. Share about your own "family" to model sentences.'
			},
			{
				id: 'L1-04',
				title: 'Daily Routine',
				goal: 'Describe your daily activities and schedule',
				keyPhrases: [
					"I wake up at ___.",
					"I go to work at ___.",
					"I have lunch at noon.",
					"I usually ___ in the evening.",
					"What time do you ___?"
				],
				vocabulary: ['wake up', 'breakfast', 'lunch', 'dinner', 'go to work', 'come home', 'go to bed', 'usually', 'always', 'sometimes'],
				grammar: 'Simple Present tense, Frequency adverbs (always, usually, sometimes, never)',
				teacherGuide: 'Walk through a typical day together. Ask what time they do things. Introduce frequency adverbs naturally. Compare your routine with theirs.'
			},
			{
				id: 'L1-05',
				title: 'Food & Ordering',
				goal: 'Order food at a restaurant and talk about food preferences',
				keyPhrases: [
					"I'd like ___.",
					"Can I have ___, please?",
					"I like ___.",
					"I don't like ___.",
					"How much is it?"
				],
				vocabulary: ['menu', 'order', 'drink', 'water', 'coffee', 'chicken', 'rice', 'salad', 'delicious', 'check/bill'],
				grammar: 'Would like, Can I have, Like + noun/gerund',
				teacherGuide: 'Role-play a restaurant scene. You are the waiter first, then switch. Practice ordering politely. Ask about favorite foods and foods they dislike.'
			},
			{
				id: 'L1-06',
				title: 'Directions & Places',
				goal: 'Ask for and give simple directions',
				keyPhrases: [
					"Where is the ___?",
					"Go straight.",
					"Turn left/right.",
					"It's next to ___.",
					"Is it far from here?"
				],
				vocabulary: ['straight', 'left', 'right', 'next to', 'between', 'across from', 'near', 'far', 'block', 'corner'],
				grammar: 'Prepositions of place (in, on, at, next to, between)',
				teacherGuide: 'Describe a simple map scenario. Ask "Where is the bank?" etc. Have the student give you directions. Practice prepositions with real examples around them.'
			},
			{
				id: 'L1-07',
				title: 'Shopping',
				goal: 'Buy things and talk about prices and sizes',
				keyPhrases: [
					"How much is this?",
					"Do you have this in ___?",
					"I'm looking for ___.",
					"Can I try this on?",
					"I'll take it."
				],
				vocabulary: ['price', 'size', 'color', 'cheap', 'expensive', 'sale', 'cash', 'credit card', 'receipt'],
				grammar: 'How much/many, This/That/These/Those',
				teacherGuide: 'Role-play shopping for clothes or groceries. Practice asking about prices, sizes, colors. Introduce numbers with money. Switch roles between customer and shopkeeper.'
			},
			{
				id: 'L1-08',
				title: 'Weather & Seasons',
				goal: 'Talk about the weather and seasonal activities',
				keyPhrases: [
					"What's the weather like today?",
					"It's sunny/rainy/cold/hot.",
					"I like ___ weather.",
					"In summer, I usually ___.",
					"Do you prefer ___ or ___?"
				],
				vocabulary: ['sunny', 'cloudy', 'rainy', 'snowy', 'windy', 'hot', 'cold', 'warm', 'cool', 'spring', 'summer', 'fall', 'winter'],
				grammar: 'It + be for weather, Comparative adjectives (hotter, colder)',
				teacherGuide: 'Start by asking about today\'s weather. Talk about favorite seasons and why. Practice comparisons between seasons. Discuss what they do in each season.'
			}
		]
	},

	// ===== LEVEL 2: Elementary (CEFR A2) =====
	{
		level: 2,
		title: 'Elementary',
		cefr: 'A2',
		lessons: [
			{
				id: 'L2-01',
				title: 'Talking About the Past',
				goal: 'Describe past events and experiences',
				keyPhrases: [
					"I went to ___ last weekend.",
					"Did you ___?",
					"Yes, I did. / No, I didn't.",
					"It was really ___.",
					"What did you do yesterday?"
				],
				vocabulary: ['went', 'saw', 'ate', 'bought', 'had', 'made', 'took', 'yesterday', 'last week', 'ago'],
				grammar: 'Simple Past tense (regular and irregular verbs)',
				teacherGuide: 'Ask about last weekend or yesterday. Introduce irregular past verbs through conversation. If they use present tense for past events, recast naturally. Practice question forms with Did.'
			},
			{
				id: 'L2-02',
				title: 'Future Plans & Goals',
				goal: 'Talk about plans and make predictions',
				keyPhrases: [
					"I'm going to ___.",
					"I will ___ someday.",
					"What are your plans for ___?",
					"I hope to ___.",
					"Are you going to ___?"
				],
				vocabulary: ['plan', 'goal', 'dream', 'hope', 'someday', 'next year', 'future', 'career', 'travel'],
				grammar: 'Going to + verb, Will + verb, Hope to + verb',
				teacherGuide: 'Ask about weekend plans, vacation plans, life goals. Practice the difference between "going to" (planned) and "will" (spontaneous/prediction). Encourage dreaming big in English.'
			},
			{
				id: 'L2-03',
				title: 'Health & Body',
				goal: 'Describe symptoms and visit a doctor',
				keyPhrases: [
					"I have a headache.",
					"My ___ hurts.",
					"I feel sick/tired/dizzy.",
					"You should see a doctor.",
					"Take some medicine."
				],
				vocabulary: ['headache', 'stomachache', 'fever', 'cough', 'cold', 'flu', 'medicine', 'rest', 'appointment', 'pharmacy'],
				grammar: 'Should for advice, Have + symptom',
				teacherGuide: 'Role-play a doctor visit. Practice body parts and symptoms. Give and receive health advice using "should." Discuss healthy habits.'
			},
			{
				id: 'L2-04',
				title: 'Travel & Transportation',
				goal: 'Navigate airports, hotels, and transportation',
				keyPhrases: [
					"I'd like to book a ___.",
					"How do I get to ___?",
					"Is there a ___ nearby?",
					"A one-way/round-trip ticket, please.",
					"What time does it depart/arrive?"
				],
				vocabulary: ['airport', 'hotel', 'reservation', 'boarding pass', 'luggage', 'departure', 'arrival', 'platform', 'terminal', 'check-in'],
				grammar: 'Would like to, How questions, There is/are',
				teacherGuide: 'Simulate travel scenarios: booking a hotel, at the airport, taking a taxi. Practice polite requests. Share travel experiences and ask about theirs.'
			},
			{
				id: 'L2-05',
				title: 'Hobbies & Interests',
				goal: 'Talk about hobbies in detail and express preferences',
				keyPhrases: [
					"I'm interested in ___.",
					"I enjoy ___ing.",
					"How often do you ___?",
					"I've been doing ___ for ___ years.",
					"Have you ever tried ___?"
				],
				vocabulary: ['hobby', 'interest', 'enjoy', 'prefer', 'passionate', 'beginner', 'practice', 'skill', 'creative', 'relaxing'],
				grammar: 'Gerunds (enjoy + ing), Present Perfect for experience (have you ever)',
				teacherGuide: 'Deep dive into hobbies beyond surface level. Ask why they enjoy it, how long, how often. Introduce "have you ever" for new experiences. Share interests to encourage longer responses.'
			},
			{
				id: 'L2-06',
				title: 'Work & Career',
				goal: 'Discuss jobs, work life, and career aspirations',
				keyPhrases: [
					"I work as a ___.",
					"I'm responsible for ___.",
					"What do you do for a living?",
					"I've been working here for ___.",
					"I'd like to change careers to ___."
				],
				vocabulary: ['colleague', 'manager', 'meeting', 'deadline', 'salary', 'promotion', 'resume', 'interview', 'experience', 'responsibility'],
				grammar: 'Present Perfect Continuous (have been working), Responsible for + gerund',
				teacherGuide: 'Ask about their job in detail — what they do daily, what they like/dislike. Practice job interview questions. Discuss dream jobs and career changes.'
			},
			{
				id: 'L2-07',
				title: 'Opinions & Agreeing/Disagreeing',
				goal: 'Express opinions politely and discuss topics',
				keyPhrases: [
					"I think ___.",
					"In my opinion, ___.",
					"I agree with you.",
					"I see your point, but ___.",
					"What do you think about ___?"
				],
				vocabulary: ['opinion', 'agree', 'disagree', 'believe', 'point', 'however', 'actually', 'definitely', 'probably', 'perhaps'],
				grammar: 'I think/believe + clause, Discourse markers (however, actually, on the other hand)',
				teacherGuide: 'Bring up light topics: best season, cats vs dogs, city vs countryside. Practice expressing opinions politely. Model how to disagree without being rude. Encourage using "I think" and "In my opinion."'
			},
			{
				id: 'L2-08',
				title: 'Phone Calls & Messages',
				goal: 'Handle phone conversations and leave messages',
				keyPhrases: [
					"Hello, this is ___.",
					"May I speak to ___?",
					"Could you hold on a moment?",
					"Can I take a message?",
					"I'll call you back later."
				],
				vocabulary: ['call', 'ring', 'voicemail', 'hold on', 'speak to', 'message', 'available', 'reach', 'dial', 'hang up'],
				grammar: 'Could/May for polite requests, Will for promises',
				teacherGuide: 'Role-play phone calls: calling a restaurant, a friend, an office. Practice leaving voicemail messages. Discuss the difference between formal and informal phone language.'
			}
		]
	},

	// ===== LEVEL 3: Intermediate (CEFR B1) =====
	{
		level: 3,
		title: 'Intermediate',
		cefr: 'B1',
		lessons: [
			{
				id: 'L3-01',
				title: 'Storytelling & Narratives',
				goal: 'Tell stories about past experiences with detail',
				keyPhrases: [
					"Let me tell you about the time ___.",
					"First... then... after that... finally...",
					"I was ___ing when ___.",
					"It turned out that ___.",
					"The funniest/scariest part was ___."
				],
				vocabulary: ['suddenly', 'eventually', 'meanwhile', 'fortunately', 'unfortunately', 'incredible', 'unexpected', 'memorable'],
				grammar: 'Past Continuous + Past Simple (I was walking when it started to rain), Sequencing words',
				teacherGuide: 'Ask about a memorable experience. Help structure their story with beginning, middle, end. Introduce narrative connectors. Tell a short story yourself as a model. Practice "was/were + ing" for background actions.'
			},
			{
				id: 'L3-02',
				title: 'Hypothetical Situations',
				goal: 'Discuss imaginary scenarios and give advice',
				keyPhrases: [
					"If I had more time, I would ___.",
					"What would you do if ___?",
					"If I were you, I'd ___.",
					"I wish I could ___.",
					"Imagine if ___."
				],
				vocabulary: ['imagine', 'suppose', 'possibility', 'opportunity', 'situation', 'decision', 'consequence'],
				grammar: 'Second Conditional (If + past, would + verb), I wish + past',
				teacherGuide: 'Ask fun hypothetical questions: win the lottery, be invisible, live anywhere. Practice "If I were you" for advice. Correct "If I will" to "If I had." Keep it fun and imaginative.'
			},
			{
				id: 'L3-03',
				title: 'News & Current Events',
				goal: 'Discuss news topics and express reactions',
				keyPhrases: [
					"Did you hear about ___?",
					"According to the news, ___.",
					"I was surprised to hear that ___.",
					"What's your take on ___?",
					"It's reported that ___."
				],
				vocabulary: ['headline', 'article', 'reporter', 'breaking news', 'issue', 'impact', 'policy', 'protest', 'economy', 'environment'],
				grammar: 'Passive voice (It was reported, It is believed), Reported speech basics',
				teacherGuide: 'Discuss a recent general topic (technology, environment, health). Practice passive voice naturally. Model how to express surprise, concern, hope about news. Ask for their reaction and opinion.'
			},
			{
				id: 'L3-04',
				title: 'Describing Processes',
				goal: 'Explain how things work step by step',
				keyPhrases: [
					"First, you need to ___.",
					"The next step is to ___.",
					"Make sure you ___.",
					"After that, ___.",
					"The key point is ___."
				],
				vocabulary: ['process', 'step', 'instruction', 'method', 'technique', 'essential', 'require', 'complete', 'result'],
				grammar: 'Imperative sentences, Sequencing (first, next, then, finally), Need to / Have to',
				teacherGuide: 'Ask the student to explain something they know well: a recipe, how to use an app, their work process. Guide them to use clear sequencing words. Practice giving instructions back and forth.'
			}
		]
	},

	// ===== LEVEL 4: Upper-Intermediate (CEFR B2) =====
	{
		level: 4,
		title: 'Upper-Intermediate',
		cefr: 'B2',
		lessons: [
			{
				id: 'L4-01',
				title: 'Debating & Persuasion',
				goal: 'Build arguments and persuade others',
				keyPhrases: [
					"The main argument is ___.",
					"On one hand... on the other hand...",
					"Research shows that ___.",
					"I strongly believe that ___.",
					"While I understand your point, ___."
				],
				vocabulary: ['argument', 'evidence', 'perspective', 'counterargument', 'persuade', 'convince', 'valid', 'bias', 'logical', 'furthermore'],
				grammar: 'Complex sentences with although/while/whereas, Linking words (furthermore, moreover, nevertheless)',
				teacherGuide: 'Choose a debatable topic: remote work vs office, social media pros/cons. Take opposite sides. Model structured arguments. Push the student to support opinions with reasons. Practice respectful disagreement.'
			},
			{
				id: 'L4-02',
				title: 'Presentations & Public Speaking',
				goal: 'Deliver clear presentations and speak confidently',
				keyPhrases: [
					"Today I'd like to talk about ___.",
					"Let me start by ___.",
					"Moving on to ___.",
					"To sum up, ___.",
					"Does anyone have any questions?"
				],
				vocabulary: ['introduction', 'overview', 'highlight', 'emphasize', 'conclude', 'audience', 'slide', 'point out', 'in conclusion'],
				grammar: 'Formal register, Transition phrases, Rhetorical questions',
				teacherGuide: 'Have the student give a 1-minute mini presentation on any topic they choose. Coach on structure: opening, body, conclusion. Practice transition phrases. Give feedback on clarity and flow.'
			},
			{
				id: 'L4-03',
				title: 'Idioms & Natural Speech',
				goal: 'Understand and use common English idioms',
				keyPhrases: [
					"It's a piece of cake.",
					"I'm on the same page.",
					"Let's call it a day.",
					"That rings a bell.",
					"Break a leg!"
				],
				vocabulary: ['piece of cake', 'once in a blue moon', 'hit the nail on the head', 'under the weather', 'break the ice', 'cost an arm and a leg', 'the ball is in your court'],
				grammar: 'Idiomatic expressions in context, Phrasal verbs',
				teacherGuide: 'Introduce 2-3 idioms per session. Give the context, explain the meaning, then create situations where the student can use them. Quiz them on previously learned idioms. Make it a fun guessing game.'
			},
			{
				id: 'L4-04',
				title: 'Cultural Topics & Discussion',
				goal: 'Discuss cultural differences and social topics fluently',
				keyPhrases: [
					"In Korean culture, ___.",
					"That's quite different from ___.",
					"I find it interesting that ___.",
					"From a cultural perspective, ___.",
					"How does that compare to ___?"
				],
				vocabulary: ['culture', 'tradition', 'custom', 'values', 'norm', 'diversity', 'perspective', 'stereotype', 'globalization', 'identity'],
				grammar: 'Complex comparative structures, Abstract noun usage',
				teacherGuide: 'Discuss cultural topics: holidays, food culture, work culture, social norms. Compare Korean and Western cultures. Encourage the student to explain Korean culture in English. Practice nuanced vocabulary for cultural discussion.'
			}
		]
	}
];

/**
 * Get a specific lesson by ID
 */
export function getLesson(lessonId) {
	for (const level of CURRICULUM) {
		const lesson = level.lessons.find((l) => l.id === lessonId);
		if (lesson) return { ...lesson, level: level.level, levelTitle: level.title, cefr: level.cefr };
	}
	return null;
}

/**
 * Get next lesson after the given lesson ID
 */
export function getNextLesson(currentLessonId) {
	const allLessons = CURRICULUM.flatMap((level) =>
		level.lessons.map((l) => ({ ...l, level: level.level, levelTitle: level.title, cefr: level.cefr }))
	);
	const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
	if (currentIndex === -1 || currentIndex >= allLessons.length - 1) return null;
	return allLessons[currentIndex + 1];
}

/**
 * Get all lessons as a flat list
 */
export function getAllLessons() {
	return CURRICULUM.flatMap((level) =>
		level.lessons.map((l) => ({ ...l, level: level.level, levelTitle: level.title, cefr: level.cefr }))
	);
}
