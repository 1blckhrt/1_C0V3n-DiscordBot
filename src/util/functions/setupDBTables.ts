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
}
