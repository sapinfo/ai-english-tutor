<script>
	import { onMount, onDestroy } from 'svelte';

	let status = $state('idle'); // idle | recording | error
	let errorMessage = $state('');
	let partialText = $state('');
	let micMuted = $state(false);
	let recognition = null;

	// Chat history
	let messages = $state([]);
	let isThinking = $state(false);

	// Lesson data from DB
	let levels = $state([]);
	let selectedLessonId = $state('');
	let currentSectionIndex = $state(0);
	let showLessonPicker = $state(true);
	let lessonSections = $state([]);

	// Progress tracking
	let progressMap = $state({});

	// TTS
	let ttsEnabled = $state(true);
	let isSpeaking = $state(false);
	let audioPlayer = null;
	let ttsRequestId = 0;

	onMount(async () => {
		const [lessonRes, progressRes] = await Promise.all([
			fetch('/api/lessons'),
			fetch('/api/progress?studentId=default')
		]);
		if (lessonRes.ok) levels = await lessonRes.json();
		if (progressRes.ok) {
			const progressList = await progressRes.json();
			for (const p of progressList) {
				progressMap[p.lesson_id] = { section_index: p.section_index, completed: p.completed };
			}
			progressMap = { ...progressMap };
		}
	});

	async function saveProgress(completed = false) {
		if (!selectedLessonId) return;
		await fetch('/api/progress', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				lessonId: selectedLessonId,
				sectionIndex: currentSectionIndex,
				completed
			})
		});
		progressMap[selectedLessonId] = { section_index: currentSectionIndex, completed: completed ? 1 : 0 };
		progressMap = { ...progressMap };
	}

	function speakText(text) {
		if (!ttsEnabled || typeof window === 'undefined') return;
		speakKokoro(text);
	}

	function stopAllTTS() {
		ttsRequestId++;
		speechSynthesis.cancel();
		if (audioPlayer) {
			audioPlayer.pause();
			audioPlayer.onended = null;
			audioPlayer.onerror = null;
			audioPlayer = null;
		}
		isSpeaking = false;
	}

	async function speakKokoro(text) {
		stopAllTTS();
		const myId = ttsRequestId;

		isSpeaking = true;
		try {
			const res = await fetch('/api/tts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text })
			});

			if (myId !== ttsRequestId) return;
			if (!res.ok) throw new Error('TTS failed');

			const blob = await res.blob();
			if (myId !== ttsRequestId) return;

			const url = URL.createObjectURL(blob);
			if (myId !== ttsRequestId) { URL.revokeObjectURL(url); return; }

			const audio = new Audio(url);
			audioPlayer = audio;
			audio.onended = () => {
				if (audioPlayer === audio) {
					isSpeaking = false;
					audioPlayer = null;
				}
				URL.revokeObjectURL(url);
			};
			audio.onerror = () => {
				if (audioPlayer === audio) {
					isSpeaking = false;
					audioPlayer = null;
				}
				URL.revokeObjectURL(url);
			};

			if (myId !== ttsRequestId) { URL.revokeObjectURL(url); return; }
			audio.play();
		} catch (err) {
			if (myId !== ttsRequestId) return;
			console.error('Kokoro TTS error:', err);
			isSpeaking = false;
		}
	}

	function getSelectedLesson() {
		for (const level of levels) {
			const lesson = level.lessons.find((l) => l.id === selectedLessonId);
			if (lesson) return { ...lesson, level_title: level.title, cefr: level.cefr };
		}
		return null;
	}

	function buildGreeting() {
		const lesson = getSelectedLesson();
		if (!lesson) {
			return "Hi there! I'm Ms. Sarah, your English teacher. Let's just chat freely today. How are you doing?";
		}
		return `Hi there! I'm Ms. Sarah. Today's lesson is "${lesson.title}." Our goal is to ${lesson.goal.toLowerCase()}. Let me start teaching you right away!`;
	}

	async function startLesson() {
		showLessonPicker = false;

		if (selectedLessonId) {
			const res = await fetch(`/api/lessons/${selectedLessonId}`);
			if (res.ok) {
				const data = await res.json();
				lessonSections = data.sections || [];
			}
			const prog = progressMap[selectedLessonId];
			currentSectionIndex = (prog && !prog.completed) ? prog.section_index : 0;
		} else {
			lessonSections = [];
			currentSectionIndex = 0;
		}

		await startBrowserSTT();
	}

	// ===== Browser Web Speech API STT =====
	async function startBrowserSTT() {
		if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
			errorMessage = 'Speech recognition is not supported in this browser. Please use Chrome.';
			return;
		}

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		recognition = new SpeechRecognition();
		recognition.lang = 'en-US';
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onstart = () => {
			status = 'recording';
			errorMessage = '';
			showGreeting();
		};

		recognition.onresult = (event) => {
			if (micMuted) return;

			let interim = '';
			let final = '';

			for (let i = event.resultIndex; i < event.results.length; i++) {
				const transcript = event.results[i][0].transcript;
				if (event.results[i].isFinal) {
					final += transcript;
				} else {
					interim += transcript;
				}
			}

			if ((interim || final) && isSpeaking) {
				stopAllTTS();
			}

			partialText = interim;

			if (final.trim()) {
				handleCommittedText(final.trim());
			}
		};

		recognition.onerror = (event) => {
			if (event.error === 'no-speech' || event.error === 'aborted') return;
			errorMessage = `Speech recognition error: ${event.error}`;
			status = 'error';
		};

		recognition.onend = () => {
			if (status === 'recording') {
				try { recognition.start(); } catch (e) {}
			}
		};

		try {
			recognition.start();
		} catch (err) {
			errorMessage = 'Failed to start speech recognition.';
			status = 'error';
		}
	}

	// ===== Shared handlers =====
	function showGreeting() {
		if (messages.length === 0) {
			const greeting = buildGreeting();
			messages = [{ role: 'teacher', text: greeting }];
			speakText(greeting);
		}
	}

	// Debounce buffer for speech — waits 1.5s of silence before sending to teacher
	let speechBuffer = '';
	let speechBufferTimer = null;
	const SPEECH_DEBOUNCE_MS = 1500;

	function flushSpeechBuffer() {
		const text = speechBuffer.trim();
		speechBuffer = '';
		speechBufferTimer = null;
		if (!text) return;

		partialText = '';

		const lowerText = text.toLowerCase();
		if (lowerText.includes('next section')) {
			if (selectedLessonId && currentSectionIndex < (lessonSections.length || 5) - 1) {
				currentSectionIndex++;
			}
		}

		messages = [...messages, { role: 'student', text }];
		sendToTeacher(text);
	}

	function handleCommittedText(text) {
		// Filter noise
		const clean = text.replace(/[.!?,;:'"]/g, '').trim();
		if (clean.length < 2) return;
		if (/[()]/.test(text)) return;
		if (/^(music|water|cough|sneez|click|tap|hum|noise|static|breathing|sigh|clearing|rustl|shuffl|bang|beep)/i.test(clean)) return;
		if (/^(um|uh|hmm|ah|er|huh|mm|I|a)$/i.test(clean)) return;

		// Whisper hallucination filter
		const hallucinations = [
			'thank you', 'thanks', 'thanks for watching', 'thank you for watching',
			'subscribe', 'like and subscribe', 'please subscribe',
			'bye', 'goodbye', 'see you', 'see you next time',
			'you', 'the end', 'so', 'okay', 'alright',
			'oh', 'hmm', 'yeah', 'yes', 'no', 'right',
			'the', 'and', 'is', 'it', 'this', 'that'
		];
		if (hallucinations.includes(clean.toLowerCase())) {
			console.log(`[FILTER] Hallucination blocked: "${text}"`);
			return;
		}

		stopAllTTS();

		speechBuffer += (speechBuffer ? ' ' : '') + text;
		partialText = speechBuffer;

		if (speechBufferTimer) clearTimeout(speechBufferTimer);
		speechBufferTimer = setTimeout(flushSpeechBuffer, SPEECH_DEBOUNCE_MS);
	}

	let chatController = null;

	async function sendToTeacher(studentMessage) {
		isThinking = true;

		if (chatController) chatController.abort();
		chatController = new AbortController();

		try {
			const history = messages
				.filter((m) => m !== messages[messages.length - 1])
				.map((m) => ({ role: m.role, text: m.text }));

			const res = await fetch('/api/chat-groq', {
				signal: chatController.signal,
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: studentMessage,
					history,
					lessonId: selectedLessonId || null,
					sectionIndex: currentSectionIndex
				})
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.message || `API error: ${res.status}`);
			}

			const { reply } = await res.json();
			if (status !== 'recording') return;
			messages = [...messages, { role: 'teacher', text: reply }];
			speakText(reply);
		} catch (err) {
			console.error('Chat error:', err);
			errorMessage = err.message;
			messages = [
				...messages,
				{ role: 'teacher', text: "Sorry, I didn't catch that. Could you try again?" }
			];
		} finally {
			isThinking = false;
		}
	}

	async function nextSection() {
		await saveProgress(false);
		currentSectionIndex++;
		messages = [...messages, {
			role: 'teacher',
			text: `Moving to the next section! Let me teach you something new.`
		}];
		sendToTeacher("I'm ready for the next section. Please start teaching.");
	}

	function goToSection(index) {
		if (index === currentSectionIndex) return;
		currentSectionIndex = index;
		const sectionTitle = lessonSections[index]?.title || 'this section';
		messages = [...messages, {
			role: 'teacher',
			text: `Let's go back to "${sectionTitle}." Let me review this part for you.`
		}];
		sendToTeacher(`The student wants to revisit section: "${sectionTitle}". Please start teaching this section from the beginning.`);
	}

	async function stopLesson() {
		const isCompleted = currentSectionIndex >= (lessonSections.length - 1);
		await saveProgress(isCompleted);

		if (chatController) { chatController.abort(); chatController = null; }
		stopAllTTS();
		status = 'idle';
		if (recognition) {
			recognition.stop();
			recognition = null;
		}
		partialText = '';
		errorMessage = '';
		messages = [];
		currentSectionIndex = 0;
		showLessonPicker = true;
	}

	onDestroy(() => {
		if (recognition) { recognition.stop(); recognition = null; }
		if (audioPlayer) { audioPlayer.pause(); audioPlayer = null; }
		if (typeof window !== 'undefined') { speechSynthesis.cancel(); }
	});

	// Auto-scroll
	let chatBox = $state(null);
	$effect(() => {
		if (chatBox && messages.length) {
			chatBox.scrollTop = chatBox.scrollHeight;
		}
	});

</script>

<svelte:head>
	<title>AI English Tutor</title>
</svelte:head>

<main>
	<header>
		<h1>AI English Tutor</h1>
		{#if status === 'recording'}
			<span class="status-badge recording">
				<span class="dot"></span>
				{micMuted ? 'Muted' : isSpeaking ? 'Speaking...' : 'Listening...'}
			</span>
		{/if}
		{#if selectedLessonId && status === 'recording'}
			<span class="section-badge">
				Section {currentSectionIndex + 1}/{lessonSections.length || 5}
			</span>
		{/if}
		<span style="flex:1"></span>
	</header>

	<!-- Lesson Picker -->
	{#if showLessonPicker && status === 'idle'}
		<section class="lesson-picker">
			{#each levels as level}
				<div class="level-group">
					<h2 class="level-title">
						Level {level.id}: {level.title}
						<span class="cefr">{level.cefr}</span>
					</h2>
					<div class="lesson-grid">
						{#each level.lessons as lesson}
							{@const prog = progressMap[lesson.id]}
							<button
								class="lesson-card {selectedLessonId === lesson.id ? 'selected' : ''} {prog?.completed ? 'completed' : prog ? 'in-progress' : ''}"
								onclick={() => { selectedLessonId = lesson.id; }}
							>
								<div class="lesson-card-header">
									<span class="lesson-id">{lesson.id}</span>
									{#if prog?.completed}
										<span class="progress-badge done">Completed</span>
									{:else if prog}
										<span class="progress-badge ongoing">{prog.section_index + 1}/5</span>
									{/if}
								</div>
								<span class="lesson-title">{lesson.title}</span>
								<span class="lesson-goal">{lesson.goal}</span>
							</button>
						{/each}
					</div>
				</div>
			{/each}

			<button
				class="lesson-card free-talk {selectedLessonId === '' ? 'selected' : ''}"
				onclick={() => { selectedLessonId = ''; }}
			>
				<span class="lesson-id">FREE</span>
				<span class="lesson-title">Free Talk</span>
				<span class="lesson-goal">No specific topic — just practice conversation</span>
			</button>
		</section>
	{/if}

	<!-- Lesson Info Bar + Section Progress -->
	{#if selectedLessonId && status === 'recording'}
		{@const lesson = getSelectedLesson()}
		{#if lesson}
			<div class="lesson-info">
				<div class="lesson-info-top">
					<strong>{lesson.title}</strong>
					<span class="lesson-info-level">{lesson.level_title} ({lesson.cefr})</span>
				</div>
				<span class="lesson-info-goal">{lesson.goal}</span>

				{#if lessonSections.length > 0}
					<div class="section-progress">
						{#each lessonSections as section, i}
							<button
								class="section-step {i < currentSectionIndex ? 'done' : i === currentSectionIndex ? 'active' : 'upcoming'}"
								onclick={() => goToSection(i)}
							>
								<span class="step-dot">
									{#if i < currentSectionIndex}✓{:else}{i + 1}{/if}
								</span>
								<span class="step-label">{section.title.length > 15 ? section.title.slice(0, 15) + '…' : section.title}</span>
							</button>
							{#if i < lessonSections.length - 1}
								<div class="step-line {i < currentSectionIndex ? 'done' : ''}"></div>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	{/if}

	<!-- Chat Area -->
	<section class="chat-area" bind:this={chatBox}>
		{#if messages.length === 0 && status === 'idle' && !showLessonPicker}
			<div class="empty-state">
				<p class="emoji">🎓</p>
				<p>Press <strong>Start Lesson</strong> to begin.</p>
			</div>
		{/if}

		{#each messages as msg}
			<div class="message {msg.role}">
				<span class="label">{msg.role === 'teacher' ? '🎓 Ms. Sarah' : '🎤 You'}</span>
				<p>{msg.text}</p>
			</div>
		{/each}

		{#if partialText}
			<div class="message student partial">
				<span class="label">🎤 You</span>
				<p>{partialText}</p>
			</div>
		{/if}

		{#if isThinking}
			<div class="message teacher thinking">
				<span class="label">🎓 Ms. Sarah</span>
				<p class="dots">Thinking<span>...</span></p>
			</div>
		{/if}
	</section>

	<!-- Error -->
	{#if errorMessage}
		<div class="error-bar">{errorMessage}</div>
	{/if}

	<!-- Controls -->
	<section class="controls">
		{#if status === 'idle' || status === 'error'}
			<button class="btn-start" onclick={startLesson}>
				{#if selectedLessonId}
					{@const lesson = getSelectedLesson()}
					Start: {lesson?.title || 'Lesson'}
				{:else}
					Start Free Talk
				{/if}
			</button>
		{:else}
			{#if selectedLessonId && currentSectionIndex < lessonSections.length - 1}
				<button class="btn-next" onclick={nextSection}>Next Section →</button>
			{/if}
			<button class="btn-stop" onclick={stopLesson}>End Lesson</button>
			<button class="btn-mic" onclick={() => { micMuted = !micMuted; if (micMuted) partialText = ''; }}>
				{micMuted ? '🎙️' : '🎤'}
			</button>
			<button class="btn-tts" onclick={() => { ttsEnabled = !ttsEnabled; if (!ttsEnabled) stopAllTTS(); }}>
				{ttsEnabled ? '🔊' : '🔇'}
			</button>
		{/if}
	</section>
</main>

<style>
	main {
		max-width: 720px;
		margin: 0 auto;
		padding: 16px;
		display: flex;
		flex-direction: column;
		height: 100vh;
		height: 100dvh;
		overflow: hidden;
	}

	header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--border);
	}

	h1 { font-size: 20px; font-weight: 700; }

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		padding: 4px 10px;
		border-radius: 999px;
	}

	.status-badge.recording {
		background: rgba(229, 69, 69, 0.15);
		color: var(--danger);
	}

	.section-badge {
		font-size: 11px;
		padding: 2px 8px;
		border-radius: 4px;
		background: var(--accent);
		color: #fff;
		font-weight: 600;
	}

	.btn-mic {
		margin-left: auto;
		background: var(--surface);
		border: 1px solid var(--border);
		padding: 4px 8px;
		font-size: 18px;
		border-radius: 6px;
		min-width: 36px;
	}
	.btn-mic:hover { background: var(--border); }

	.btn-tts {
		background: var(--surface);
		border: 1px solid var(--border);
		padding: 4px 8px;
		font-size: 18px;
		border-radius: 6px;
		min-width: 36px;
	}
	.btn-tts:hover { background: var(--border); }

	.dot {
		width: 6px; height: 6px; border-radius: 50%;
		background: var(--danger);
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.3; }
	}

	/* Lesson Picker */
	.lesson-picker {
		flex: 1;
		overflow-y: auto;
		padding: 16px 0;
	}

	.level-group { margin-bottom: 20px; }

	.level-title {
		font-size: 14px;
		font-weight: 700;
		color: var(--text);
		margin-bottom: 8px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.cefr {
		font-size: 11px;
		padding: 1px 6px;
		border-radius: 4px;
		background: var(--accent);
		color: #fff;
		font-weight: 600;
	}

	.lesson-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}

	.lesson-card {
		text-align: left;
		padding: 10px 12px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 2px;
		transition: all 0.15s;
	}
	.lesson-card:hover { border-color: var(--accent); }
	.lesson-card.selected {
		border-color: var(--accent);
		background: rgba(79, 140, 255, 0.1);
	}
	.lesson-card.free-talk {
		margin-top: 12px;
		border-style: dashed;
	}

	.lesson-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.lesson-card.completed {
		border-color: #22c55e;
		background: rgba(34, 197, 94, 0.08);
	}

	.lesson-card.in-progress {
		border-color: #f59e0b;
		background: rgba(245, 158, 11, 0.08);
	}

	.progress-badge {
		font-size: 9px;
		font-weight: 700;
		padding: 1px 6px;
		border-radius: 4px;
	}

	.progress-badge.done {
		background: #22c55e;
		color: #fff;
	}

	.progress-badge.ongoing {
		background: #f59e0b;
		color: #fff;
	}

	.lesson-id {
		font-size: 10px; font-weight: 700;
		color: var(--accent); letter-spacing: 0.5px;
	}
	.lesson-title { font-size: 13px; font-weight: 600; color: var(--text); }
	.lesson-goal { font-size: 11px; color: var(--text-dim); line-height: 1.4; }

	/* Lesson Info Bar */
	.lesson-info {
		padding: 8px 12px;
		background: rgba(79, 140, 255, 0.1);
		border: 1px solid rgba(79, 140, 255, 0.2);
		border-radius: 8px;
		margin: 8px 0;
	}
	.lesson-info-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lesson-info strong { font-size: 13px; color: var(--accent); }
	.lesson-info-level { font-size: 11px; color: var(--text-dim); }
	.lesson-info-goal { font-size: 12px; color: var(--text-dim); }

	/* Section Progress Bar */
	.section-progress {
		display: flex;
		align-items: center;
		gap: 0;
		margin-top: 10px;
		overflow-x: auto;
	}

	.section-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		min-width: 50px;
		flex-shrink: 0;
		cursor: pointer;
		background: none;
		border: none;
		padding: 4px;
		border-radius: 6px;
		transition: background 0.15s;
	}

	.section-step:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	.step-dot {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 11px;
		font-weight: 700;
		border: 2px solid var(--border);
		background: var(--surface);
		color: var(--text-dim);
	}

	.section-step.done .step-dot {
		background: #22c55e;
		border-color: #22c55e;
		color: #fff;
	}

	.section-step.active .step-dot {
		background: var(--accent);
		border-color: var(--accent);
		color: #fff;
		animation: pulse 1.5s infinite;
	}

	.step-label {
		font-size: 9px;
		color: var(--text-dim);
		text-align: center;
		white-space: nowrap;
	}

	.section-step.active .step-label {
		color: var(--accent);
		font-weight: 600;
	}

	.section-step.done .step-label {
		color: #22c55e;
	}

	.step-line {
		flex: 1;
		height: 2px;
		background: var(--border);
		min-width: 12px;
		margin-bottom: 16px;
	}

	.step-line.done {
		background: #22c55e;
	}

	/* Chat */
	.chat-area {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 16px 0 80px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.empty-state {
		text-align: center;
		padding: 60px 20px;
		color: var(--text-dim);
	}
	.empty-state .emoji { font-size: 48px; margin-bottom: 16px; }
	.empty-state strong { color: var(--accent); }

	.message {
		max-width: 85%;
		padding: 10px 14px;
		border-radius: 12px;
	}
	.message .label {
		font-size: 11px; font-weight: 600;
		color: var(--text-dim);
		display: block; margin-bottom: 4px;
	}
	.message p { font-size: 15px; line-height: 1.6; }

	.message.teacher {
		align-self: flex-start;
		background: var(--surface);
		border: 1px solid var(--border);
	}
	.message.student {
		align-self: flex-end;
		background: var(--accent);
		color: #fff;
	}
	.message.student .label { color: rgba(255, 255, 255, 0.7); }
	.message.partial { opacity: 0.6; }

	.message.thinking .dots span {
		animation: blink 1.2s infinite;
	}
	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.2; }
	}

	/* Error */
	.error-bar {
		padding: 8px 12px;
		border-radius: 6px;
		background: rgba(229, 69, 69, 0.1);
		color: var(--danger);
		font-size: 13px;
		margin-bottom: 8px;
	}

	/* Controls */
	.controls {
		display: flex;
		gap: 8px;
		padding: 12px 0 4px;
		border-top: 1px solid var(--border);
		flex-shrink: 0;
	}

	.btn-start {
		flex: 1;
		background: var(--accent);
		color: #fff;
		font-size: 16px;
		padding: 12px;
	}
	.btn-start:hover:not(:disabled) { background: var(--accent-hover); }

	.btn-next {
		flex: 1;
		background: var(--accent);
		color: #fff;
		font-size: 14px;
		padding: 12px;
	}
	.btn-next:hover { background: var(--accent-hover); }

	.btn-stop {
		flex: 1;
		background: var(--danger);
		color: #fff;
		font-size: 16px;
		padding: 12px;
	}
	.btn-stop:hover { background: var(--danger-hover); }

	@media (max-width: 480px) {
		.lesson-grid { grid-template-columns: 1fr; }
	}
</style>
