import Database from 'better-sqlite3';
import { resolve } from 'path';

const DB_PATH = resolve('data/tutor.db');

let _db;

export function getDb() {
	if (!_db) {
		_db = new Database(DB_PATH);
		_db.pragma('journal_mode = WAL');
		_db.pragma('foreign_keys = ON');
	}
	return _db;
}
