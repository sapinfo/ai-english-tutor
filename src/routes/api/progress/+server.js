import { json, error } from '@sveltejs/kit';
import { getDb } from '$lib/db.js';

// GET: 진도 조회
export function GET({ url }) {
	const studentId = url.searchParams.get('studentId') || 'default';
	const db = getDb();
	const progress = db.prepare(
		'SELECT lesson_id, section_index, completed, score, updated_at FROM progress WHERE student_id = ?'
	).all(studentId);
	return json(progress);
}

// POST: 진도 저장
export async function POST({ request }) {
	const { studentId = 'default', lessonId, sectionIndex, completed, score } = await request.json();

	if (!lessonId) throw error(400, 'lessonId is required');

	const db = getDb();
	const existing = db.prepare(
		'SELECT id FROM progress WHERE student_id = ? AND lesson_id = ?'
	).get(studentId, lessonId);

	if (existing) {
		db.prepare(`
			UPDATE progress SET section_index = ?, completed = ?, score = ?, updated_at = datetime('now')
			WHERE id = ?
		`).run(sectionIndex || 0, completed ? 1 : 0, score || null, existing.id);
	} else {
		db.prepare(`
			INSERT INTO progress (student_id, lesson_id, section_index, completed, score)
			VALUES (?, ?, ?, ?, ?)
		`).run(studentId, lessonId, sectionIndex || 0, completed ? 1 : 0, score || null);
	}

	return json({ ok: true });
}
