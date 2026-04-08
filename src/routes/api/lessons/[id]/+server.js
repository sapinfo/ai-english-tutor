import { json, error } from '@sveltejs/kit';
import { getLessonWithSections } from '$lib/curriculum-db.js';

export function GET({ params }) {
	const lesson = getLessonWithSections(params.id);
	if (!lesson) throw error(404, 'Lesson not found');
	return json(lesson);
}
