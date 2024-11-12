import { client } from "../constants.js";

export default async function setupDBTables() {
	client.db.exec(`
        CREATE TABLE IF NOT EXISTS welcome (
            channel_id TEXT,
            message TEXT
        );
    `);

	client.db.exec(`
        CREATE TABLE IF NOT EXISTS leave (
            channel_id TEXT,
            message TEXT
        );
    `);

	client.db.exec(`
        CREATE TABLE IF NOT EXISTS sotd_queue (
            name TEXT,
            artist TEXT,
            url TEXT
        );
    `);

	client.db.exec(`
        CREATE TABLE IF NOT EXISTS sotd (
            channel_id TEXT,
            message TEXT,
            role_id TEXT
        );
    `);

	client.db.exec(`
        CREATE TABLE IF NOT EXISTS feedback (
            message TEXT,
            role_id TEXT
        );
    `);

	client.db.exec(`
        CREATE TABLE IF NOT EXISTS qotd (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
        );
    `);
}
