import { getDb } from './db.js';

/**
 * Get all levels with their lessons (no sections — for lesson picker)
 */
export function getLevelsWithLessons() {
	const db = getDb();
	const levels = db.prepare('SELECT * FROM levels ORDER BY id').all();
	const lessons = db.prepare('SELECT * FROM lessons ORDER BY level_id, sort_order').all();

	return levels.map((level) => ({
		...level,
		lessons: lessons.filter((l) => l.level_id === level.id)
	}));
}

/**
 * Get a specific lesson with all its sections
 */
export function getLessonWithSections(lessonId) {
	const db = getDb();
	const lesson = db.prepare(`
		SELECT l.*, lv.title as level_title, lv.cefr
		FROM lessons l
		JOIN levels lv ON l.level_id = lv.id
		WHERE l.id = ?
	`).get(lessonId);

	if (!lesson) return null;

	const sections = db.prepare(
		'SELECT * FROM sections WHERE lesson_id = ? ORDER BY sort_order'
	).all(lessonId);

	// Parse JSON fields
	sections.forEach((s) => {
		s.examples = s.examples ? JSON.parse(s.examples) : [];
		s.vocabulary = s.vocabulary ? JSON.parse(s.vocabulary) : [];
	});

	return { ...lesson, sections };
}

/**
 * Build system prompt with current section context
 */
export function buildLessonContext(lessonId, sectionIndex) {
	const lesson = getLessonWithSections(lessonId);
	if (!lesson) return null;

	const section = lesson.sections[sectionIndex] || lesson.sections[0];
	const totalSections = lesson.sections.length;

	return {
		lessonTitle: lesson.title,
		lessonGoal: lesson.goal,
		grammarFocus: lesson.grammar_focus,
		levelTitle: lesson.level_title,
		cefr: lesson.cefr,
		currentSection: {
			index: sectionIndex,
			total: totalSections,
			type: section.type,
			title: section.title,
			teacherScript: section.teacher_script,
			examples: section.examples,
			practicePrompt: section.practice_prompt,
			vocabulary: section.vocabulary
		}
	};
}

/**
 * Save progress
 */
export function saveProgress(studentId, lessonId, sectionIndex, completed, score) {
	const db = getDb();
	const existing = db.prepare(
		'SELECT id FROM progress WHERE student_id = ? AND lesson_id = ?'
	).get(studentId, lessonId);

	if (existing) {
		db.prepare(`
			UPDATE progress SET section_index = ?, completed = ?, score = ?, updated_at = datetime('now')
			WHERE id = ?
		`).run(sectionIndex, completed ? 1 : 0, score || null, existing.id);
	} else {
		db.prepare(`
			INSERT INTO progress (student_id, lesson_id, section_index, completed, score)
			VALUES (?, ?, ?, ?, ?)
		`).run(studentId, lessonId, sectionIndex, completed ? 1 : 0, score || null);
	}
}

/**
 * Get progress for a student
 */
export function getProgress(studentId) {
	const db = getDb();
	return db.prepare(
		'SELECT * FROM progress WHERE student_id = ? ORDER BY updated_at DESC'
	).all(studentId);
}
