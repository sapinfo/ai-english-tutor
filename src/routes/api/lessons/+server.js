import { json } from '@sveltejs/kit';
import { getLevelsWithLessons } from '$lib/curriculum-db.js';

export function GET() {
	const levels = getLevelsWithLessons();
	return json(levels);
}
